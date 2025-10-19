import asyncio
import cv2
import numpy as np
import base64
import json
import logging
import time
from aiohttp import web, WSMsgType
import aiohttp_cors

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
