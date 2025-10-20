#!/usr/bin/env python3
import asyncio
import cv2
import numpy as np
import sys
import os
import torch
from PIL import Image
import torchvision.transforms as T
from ultralytics import YOLO
import time

# Import the WebRTC server
from webrtc_server import get_server

# Configuration (exactly like live_patch_attack.py)
MODEL_PATH = "yolov8n.pt"
IMG_SIZE = 640
CONF_BASE = 0.75
device = "cpu"

# ===== Smoothing for confidence meter =====
SMOOTH_ALPHA = 0.25   # 0..1 (lower = smoother, less sudden)

# =================== MODEL ====================
model = YOLO(MODEL_PATH)
to_tensor = T.ToTensor()
resize640 = T.Resize((IMG_SIZE, IMG_SIZE))

def tensor_to_uint8(img_t):
    arr = (img_t.permute(1, 2, 0).clamp(0, 1).cpu().numpy() * 255).astype(np.uint8)
    return np.ascontiguousarray(arr)

def open_camera(preferred_index=0):
    """Try to open camera with different backends"""
    backends = [cv2.CAP_MSMF, cv2.CAP_DSHOW, cv2.CAP_ANY]
    tried = set()
    for backend in backends:
        for idx in [preferred_index]:
            key = (backend, idx)
            if key in tried:
                continue
            tried.add(key)
            cap = cv2.VideoCapture(idx, backend)
            if cap.isOpened():
                cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
                cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
                print(f"[cam] opened index={idx} backend={backend}")
                return cap
            cap.release()
    return None


async def main():
    # Get video source (exactly like live_patch_attack.py)
    VIDEO_SOURCE = sys.argv[1] if len(sys.argv) > 1 else None
    
    print("Initializing video source...")
    
    if VIDEO_SOURCE and os.path.exists(VIDEO_SOURCE):
        cap = cv2.VideoCapture(VIDEO_SOURCE)
        if not cap.isOpened():
            raise RuntimeError(f"Failed to open video file: {VIDEO_SOURCE}")
        print(f"[vid] playing file: {VIDEO_SOURCE}")
    else:
        cap = open_camera(preferred_index=0)
        if cap is None:
            raise RuntimeError(
                "No camera opened. Close Teams/Zoom/OBS/Camera app and try again.\n"
                "Or run with a video file:  python webrtc_demo.py path\\to\\video.mp4"
            )
    
    # Load YOLO model
    print("Loading YOLO model...")
    model = YOLO(MODEL_PATH)
    
    # Get WebRTC server
    server = get_server()
    
    # Start server in background
    server_task = asyncio.create_task(server.start_server())
    
    # Give server time to start
    await asyncio.sleep(2)
    
    print("WebRTC server started on http://localhost:8080")
    print("Open your browser and go to http://localhost:8080 to view the stream")
    print("Press 'q' to quit")
    
    # Start camera loop in a separate task
    camera_task = asyncio.create_task(camera_loop(cap, model, server))
    
    try:
        # Keep the server running
        await asyncio.gather(server_task, camera_task)
    except KeyboardInterrupt:
        print("\nShutting down...")
    finally:
        camera_task.cancel()
        server_task.cancel()
        if cap is not None:
            cap.release()
        cv2.destroyAllWindows()

async def camera_loop(cap, model, server):
    """Camera processing loop"""
    frame_count = 0
    start_time = time.time()
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("[warn] frame read failed; stopping.")
                break
            
            # Convert to RGB for processing (exactly like live_patch_attack.py)
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
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
            img_t = to_tensor(resize640(Image.fromarray(model_frame_rgb))).to(device)
            np_640 = tensor_to_uint8(img_t)

            # ===== Inference ===== (exactly like live_patch_attack.py)
            res = model.predict(
                source=np_640,
                imgsz=IMG_SIZE,
                conf=CONF_BASE,
                iou=0.30,
                augment=False,
                agnostic_nms=False,
                classes=[0],
                device=device,
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
            
            # Calculate FPS
            frame_count += 1
            elapsed = time.time() - start_time
            fps = frame_count / elapsed if elapsed > 0 else 0
            
            # Calculate average confidence
            avg_confidence = np.mean([d["confidence"] for d in detections]) if detections else 0.0
            
            # Resize the original frame to match model dimensions for proper coordinate mapping
            frame_rgb_640 = cv2.resize(frame_rgb, (IMG_SIZE, IMG_SIZE))
            vis = res.plot(img=frame_rgb_640)
            
            # Resize back to original camera resolution for display
            original_height, original_width = frame_rgb.shape[:2]
            vis_resized = cv2.resize(vis, (original_width, original_height))
            
            # Stream the annotated frame (with bounding boxes)
            # Convert RGB to BGR for the server (OpenCV format)
            vis_bgr_for_stream = cv2.cvtColor(vis_resized, cv2.COLOR_RGB2BGR)
            server.stream_frame(vis_bgr_for_stream)
            server.stream_inference(detections, avg_confidence, fps)
            
            # Show the annotated frame (convert RGB back to BGR for OpenCV display)
            vis_bgr = cv2.cvtColor(vis_resized, cv2.COLOR_RGB2BGR)
            cv2.imshow("WebRTC Demo", vis_bgr)
            
            # Print status every 30 frames
            if frame_count % 30 == 0:
                print(f"[stream] FPS: {fps:.1f}, Clients: {len(server.clients)}, Detections: {len(detections)}")
            
            # Check for quit
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            
            # Small delay to prevent overwhelming the system
            await asyncio.sleep(0.033)  # ~30 FPS
                
    except Exception as e:
        print(f"Error in camera loop: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
