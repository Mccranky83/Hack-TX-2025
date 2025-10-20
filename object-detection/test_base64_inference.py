#!/usr/bin/env python3
"""
Test script for the HTTP inference endpoint with base64
"""
import requests
import base64
import json
import sys
import os

def test_inference_endpoint(image_path, server_url="http://localhost:8080"):
    """Test the inference endpoint with a base64 image"""
    
    if not os.path.exists(image_path):
        print(f"Error: Image file not found: {image_path}")
        return
    
    print(f"Testing inference endpoint with: {image_path}")
    print(f"Server URL: {server_url}/inference")
    
    try:
        # Read and resize the image to reduce size
        import cv2
        img = cv2.imread(image_path)
        if img is None:
            print(f"Error: Could not read image {image_path}")
            return
        
        # Resize to max 800x600 to reduce size
        height, width = img.shape[:2]
        if width > 800 or height > 600:
            scale = min(800/width, 600/height)
            new_width = int(width * scale)
            new_height = int(height * scale)
            img = cv2.resize(img, (new_width, new_height))
            print(f"Resized image from {width}x{height} to {new_width}x{new_height}")
        
        # Encode as JPEG with compression
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 85]
        _, buffer = cv2.imencode('.jpg', img, encode_param)
        image_b64 = base64.b64encode(buffer).decode('utf-8')
        
        # Prepare JSON payload
        payload = {
            "image": image_b64
        }
        
        # Send POST request to inference endpoint
        response = requests.post(
            f"{server_url}/inference",
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            
            print(f"\n✅ Inference successful!")
            print(f"Detection count: {result['detection_count']}")
            print(f"Average confidence: {result['confidence']:.3f}")
            
            if result['detections']:
                print(f"\nDetections:")
                for i, det in enumerate(result['detections']):
                    print(f"  {i+1}. Confidence: {det['confidence']:.3f}")
                    bbox = det['bbox']
                    print(f"     BBox: ({bbox['x1']:.0f}, {bbox['y1']:.0f}) - ({bbox['x2']:.0f}, {bbox['y2']:.0f})")
            else:
                print("No detections found")
            
            # Save the annotated image
            if result['annotated_image']:
                annotated_data = base64.b64decode(result['annotated_image'])
                output_path = f"annotated_{os.path.basename(image_path)}"
                with open(output_path, 'wb') as f:
                    f.write(annotated_data)
                print(f"\nAnnotated image saved as: {output_path}")
            
        else:
            print(f"❌ Error: {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error message: {error_data.get('error', 'Unknown error')}")
            except:
                print(f"Response: {response.text}")
                
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to server. Make sure the WebRTC server is running.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_base64_inference.py <image_path> [server_url]")
        print("Example: python test_base64_inference.py demo2.png")
        sys.exit(1)
    
    image_path = sys.argv[1]
    server_url = sys.argv[2] if len(sys.argv) > 2 else "http://localhost:8080"
    
    test_inference_endpoint(image_path, server_url)
