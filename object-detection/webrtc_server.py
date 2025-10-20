import asyncio
import cv2
import numpy as np
import base64
import json
import logging
import time
from aiohttp import web, WSMsgType
import aiohttp_cors
from ultralytics import YOLO
import torch
from PIL import Image
import torchvision.transforms as T

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SimpleWebRTCServer:
    def __init__(self, host="localhost", port=8080):
        self.host = host
        self.port = port
        self.clients = set()
        self.frame_data = None
        self.inference_data = None
        
        # YOLO model and processing (same as live_patch_attack.py)
        self.model = YOLO("yolov8n.pt")
        self.img_size = 640
        self.conf_base = 0.75  # Exactly like live_patch_attack.py
        self.device = "cpu"
        self.to_tensor = T.ToTensor()
        self.resize640 = T.Resize((self.img_size, self.img_size))
        
    def tensor_to_uint8(self, img_t):
        arr = (img_t.permute(1, 2, 0).clamp(0, 1).cpu().numpy() * 255).astype(np.uint8)
        return np.ascontiguousarray(arr)
        
    async def websocket_handler(self, request):
        """Handle WebSocket connections"""
        ws = web.WebSocketResponse()
        await ws.prepare(request)
        
        self.clients.add(ws)
        logger.info(f"Client connected. Total clients: {len(self.clients)}")
        
        try:
            # Send welcome message
            await ws.send_str(json.dumps({
                "type": "connection",
                "message": "Connected to WebRTC server",
                "timestamp": time.time()
            }))
            
            async for msg in ws:
                if msg.type == WSMsgType.TEXT:
                    try:
                        data = json.loads(msg.data)
                        logger.info(f"Received: {data}")
                    except json.JSONDecodeError:
                        logger.error("Invalid JSON received")
                elif msg.type == WSMsgType.ERROR:
                    logger.error(f"WebSocket error: {ws.exception()}")
                    break
        except Exception as e:
            logger.error(f"WebSocket error: {e}")
        finally:
            self.clients.discard(ws)
            logger.info(f"Client disconnected. Total clients: {len(self.clients)}")
        
        return ws
    
    async def broadcast_data(self, data_type, data):
        """Broadcast data to all connected clients"""
        if not self.clients:
            return
            
        message = json.dumps({
            "type": data_type,
            "data": data,
            "timestamp": time.time()
        })
        
        # Create a copy of clients to avoid modification during iteration
        clients_copy = list(self.clients)
        disconnected = set()
        
        for client in clients_copy:
            try:
                await client.send_str(message)
            except Exception as e:
                logger.error(f"Error sending to client: {e}")
                disconnected.add(client)
        
        # Remove disconnected clients
        self.clients -= disconnected
    
    def stream_frame(self, frame_bgr):
        """Stream frame data"""
        try:
            # Encode frame as JPEG
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 85]
            _, buffer = cv2.imencode('.jpg', frame_bgr, encode_param)
            frame_bytes = buffer.tobytes()
            
            # Encode as base64
            frame_b64 = base64.b64encode(frame_bytes).decode('utf-8')
            
            # Store for async broadcast
            self.frame_data = {
                "frame": frame_b64,
                "format": "jpeg"
            }
            
        except Exception as e:
            logger.error(f"Error encoding frame: {e}")
    
    def stream_inference(self, detections, confidence, fps):
        """Stream inference data"""
        self.inference_data = {
            "detections": detections,
            "confidence": confidence,
            "fps": fps
        }
    
    async def broadcast_worker(self):
        """Background task to broadcast data"""
        while True:
            try:
                if self.frame_data:
                    await self.broadcast_data("frame", self.frame_data)
                    self.frame_data = None
                
                if self.inference_data:
                    await self.broadcast_data("inference", self.inference_data)
                    self.inference_data = None
                
                await asyncio.sleep(0.033)  # ~30 FPS
            except Exception as e:
                logger.error(f"Error in broadcast worker: {e}")
                await asyncio.sleep(0.1)
    
    async def start_server(self):
        """Start the server"""
        app = web.Application()
        
        # Configure CORS
        cors = aiohttp_cors.setup(app, defaults={
            "*": aiohttp_cors.ResourceOptions(
                allow_credentials=True,
                expose_headers="*",
                allow_headers="*",
                allow_methods="*"
            )
        })
        
        # Add routes
        app.router.add_get('/ws', self.websocket_handler)
        app.router.add_get('/', self.serve_client)
        app.router.add_post('/inference', self.handle_inference)
        
        # Add CORS to all routes
        for route in list(app.router.routes()):
            cors.add(route)
        
        # Start broadcast worker
        asyncio.create_task(self.broadcast_worker())
        
        logger.info(f"Starting WebRTC server on {self.host}:{self.port}")
        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, self.host, self.port)
        await site.start()
        logger.info("WebRTC server started successfully")
    
    async def handle_inference(self, request):
        """Handle image inference requests"""
        try:
            # Get JSON data with base64 image
            data = await request.json()
            image_b64 = data.get('image')
            
            if not image_b64:
                return web.Response(
                    text=json.dumps({"error": "No image provided"}), 
                    status=400,
                    content_type='application/json'
                )
            
            # Decode base64 image
            image_data = base64.b64decode(image_b64)
            nparr = np.frombuffer(image_data, np.uint8)
            frame_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame_bgr is None:
                return web.Response(
                    text=json.dumps({"error": "Invalid image format"}), 
                    status=400,
                    content_type='application/json'
                )
            
            # Convert to RGB for processing (exactly like live_patch_attack.py)
            frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
            
            # Create a separate copy for YOLO model processing with brightness adjustments
            model_frame_rgb = frame_rgb.copy()
            
            # Apply brightness adjustments only to the model processing frame
            gray = cv2.cvtColor(model_frame_rgb, cv2.COLOR_RGB2GRAY)
            if np.mean(gray) > 100:  # Bright lighting detected
                # Reduce brightness and enhance contrast
                model_frame_rgb = cv2.convertScaleAbs(model_frame_rgb, alpha=0.7, beta=-30)
                clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
                lab = cv2.cvtColor(model_frame_rgb, cv2.COLOR_RGB2LAB)
                lab[:,:,0] = clahe.apply(lab[:,:,0])
                model_frame_rgb = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
            
            # Resize to model size (exactly like live_patch_attack.py)
            img_t = self.to_tensor(self.resize640(Image.fromarray(model_frame_rgb))).to(self.device)
            np_640 = self.tensor_to_uint8(img_t)
            
            # Run YOLO inference (exactly like live_patch_attack.py MODE_NONE)
            res = self.model.predict(
                source=np_640,
                imgsz=self.img_size,
                conf=self.conf_base,  # 0.65
                iou=0.30,  # iou_nms for MODE_NONE
                augment=False,  # use_tta for MODE_NONE
                agnostic_nms=False,  # agn_nms for MODE_NONE
                classes=[0],
                device=self.device,
                verbose=False
            )[0]
            
            # Process results
            detections = []
            if res.boxes is not None and len(res.boxes) > 0:
                for box in res.boxes:
                    detections.append({
                        "confidence": float(box.conf.item()),
                        "bbox": {
                            "x1": float(box.xyxy[0][0].item()),
                            "y1": float(box.xyxy[0][1].item()),
                            "x2": float(box.xyxy[0][2].item()),
                            "y2": float(box.xyxy[0][3].item())
                        }
                    })
            
            # Calculate average confidence
            avg_confidence = np.mean([d["confidence"] for d in detections]) if detections else 0.0
            
            # Draw results on the original RGB frame
            frame_rgb_640 = cv2.resize(frame_rgb, (self.img_size, self.img_size))
            vis = res.plot(img=frame_rgb_640)
            
            # Resize back to original resolution
            original_height, original_width = frame_rgb.shape[:2]
            vis_resized = cv2.resize(vis, (original_width, original_height))
            
            # Convert to BGR for encoding
            vis_bgr = cv2.cvtColor(vis_resized, cv2.COLOR_RGB2BGR)
            
            # Encode as JPEG and convert to base64
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 85]
            _, buffer = cv2.imencode('.jpg', vis_bgr, encode_param)
            frame_b64 = base64.b64encode(buffer).decode('utf-8')
            
            # Return results
            return web.Response(
                text=json.dumps({
                    "success": True,
                    "detections": detections,
                    "confidence": avg_confidence,
                    "detection_count": len(detections),
                    "annotated_image": frame_b64,
                    "format": "jpeg"
                }),
                content_type='application/json'
            )
            
        except Exception as e:
            logger.error(f"Error in inference: {e}")
            return web.Response(
                text=json.dumps({"error": str(e)}), 
                status=500,
                content_type='application/json'
            )
    
    async def serve_client(self, request):
        """Serve the test client HTML page"""
        html_content = """
<!DOCTYPE html>
<html>
<head>
    <title>WebRTC Test Client</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background: #f0f0f0; 
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            padding: 20px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        .status { 
            padding: 10px; 
            margin: 10px 0; 
            border-radius: 5px; 
            font-weight: bold; 
        }
        .connected { background: #d4edda; color: #155724; }
        .disconnected { background: #f8d7da; color: #721c24; }
        #videoStream { 
            max-width: 100%; 
            border: 2px solid #ddd; 
            border-radius: 5px; 
        }
        .metrics { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
            gap: 10px; 
            margin: 20px 0; 
        }
        .metric { 
            background: #e9ecef; 
            padding: 15px; 
            border-radius: 5px; 
            text-align: center; 
        }
        .metric-value { 
            font-size: 24px; 
            font-weight: bold; 
            color: #007bff; 
        }
        .detections { 
            margin-top: 20px; 
        }
        .detection { 
            background: #fff3cd; 
            padding: 10px; 
            margin: 5px 0; 
            border-radius: 5px; 
            border-left: 4px solid #ffc107; 
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 WebRTC Test Client</h1>
        
        <div id="status" class="status disconnected">Disconnected</div>
        
        <div class="metrics">
            <div class="metric">
                <div>FPS</div>
                <div class="metric-value" id="fps">0</div>
            </div>
            <div class="metric">
                <div>Confidence</div>
                <div class="metric-value" id="confidence">0%</div>
            </div>
            <div class="metric">
                <div>Detections</div>
                <div class="metric-value" id="detectionCount">0</div>
            </div>
        </div>
        
        <img id="videoStream" src="" alt="Video Stream" style="display: none;">
        <div id="noVideo" style="text-align: center; padding: 50px; color: #666;">
            <div>📹 Waiting for video stream...</div>
        </div>
        
        <div class="detections">
            <h3>Detections</h3>
            <div id="detectionsList">No detections</div>
        </div>
        
        <div style="margin-top: 20px;">
            <button onclick="connect()" style="padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Connect</button>
            <button onclick="disconnect()" style="padding: 10px 20px; margin: 5px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Disconnect</button>
        </div>
    </div>

    <script>
        let ws = null;
        let isConnected = false;
        
        function updateStatus(connected) {
            const status = document.getElementById('status');
            isConnected = connected;
            
            if (connected) {
                status.textContent = 'Connected';
                status.className = 'status connected';
            } else {
                status.textContent = 'Disconnected';
                status.className = 'status disconnected';
            }
        }
        
        function connect() {
            if (ws && ws.readyState === WebSocket.OPEN) return;
            
            console.log('Connecting to WebRTC server...');
            ws = new WebSocket('ws://localhost:8080/ws');
            
            ws.onopen = function(event) {
                console.log('Connected to WebRTC server');
                updateStatus(true);
            };
            
            ws.onmessage = function(event) {
                try {
                    const data = JSON.parse(event.data);
                    handleMessage(data);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };
            
            ws.onclose = function(event) {
                console.log('WebRTC connection closed');
                updateStatus(false);
            };
            
            ws.onerror = function(error) {
                console.error('WebRTC error:', error);
                updateStatus(false);
            };
        }
        
        function disconnect() {
            if (ws) {
                ws.close();
                ws = null;
            }
            updateStatus(false);
        }
        
        function handleMessage(data) {
            switch (data.type) {
                case 'connection':
                    console.log('Connection message:', data.message);
                    break;
                    
                case 'inference':
                    updateInferenceData(data.data);
                    break;
                    
                case 'frame':
                    updateVideoFrame(data.data);
                    break;
            }
        }
        
        function updateInferenceData(data) {
            document.getElementById('fps').textContent = data.fps.toFixed(1);
            document.getElementById('confidence').textContent = (data.confidence * 100).toFixed(1) + '%';
            document.getElementById('detectionCount').textContent = data.detections.length;
            
            const detectionsList = document.getElementById('detectionsList');
            if (data.detections.length === 0) {
                detectionsList.innerHTML = 'No detections';
            } else {
                detectionsList.innerHTML = data.detections.map(det => 
                    `<div class="detection">Person (${(det.confidence * 100).toFixed(1)}%)</div>`
                ).join('');
            }
        }
        
        function updateVideoFrame(data) {
            const videoStream = document.getElementById('videoStream');
            const noVideo = document.getElementById('noVideo');
            
            if (data.frame) {
                videoStream.src = 'data:image/jpeg;base64,' + data.frame;
                videoStream.style.display = 'block';
                noVideo.style.display = 'none';
            }
        }
        
        // Auto-connect on page load
        window.onload = function() {
            connect();
        };
    </script>
</body>
</html>
        """
        return web.Response(text=html_content, content_type='text/html')

# Global server instance
server = SimpleWebRTCServer()

def get_server():
    return server

async def start_webrtc_server():
    await server.start_server()

if __name__ == "__main__":
    asyncio.run(start_webrtc_server())
