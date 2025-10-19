# Image Inference Implementation

This document describes the implementation of image inference for created designs using Gemini API and the WebRTC server.

## Overview

The system implements a 2-step process for testing designs:

1. **Screenshot Capture**: Captures a screenshot of the designed clothing using html2canvas
2. **Image Generation**: Uses Gemini API to generate a realistic image of a person wearing the designed clothing based on the screenshot
3. **Inference**: Uses the WebRTC server's YOLO model to run object detection on the generated image

## Architecture

```
Design Page → Screenshot → API Endpoints → External Services
     ↓           ↓            ↓              ↓
  Elements → html2canvas → /api/test-design → Gemini API
     ↓           ↓            ↓              ↓
  Clothing → Screenshot → /api/generate-image → WebRTC Server
     ↓           ↓            ↓              ↓
  Test Results ← /api/inference ← YOLO Model
```

## API Endpoints

### 1. `/api/test-design` (POST)
Main endpoint that orchestrates the entire testing process.

**Request:**
```json
{
  "screenshot": "base64_encoded_screenshot",
  "clothingType": "shirt"
}
```

**Response:**
```json
{
  "success": true,
  "testResults": {
    "success": true,
    "score": 85,
    "detectionCount": 1,
    "confidence": 0.85,
    "detections": [...],
    "annotatedImage": "base64_encoded_image",
    "generatedImage": "base64_encoded_image"
  }
}
```

### 2. `/api/generate-image` (POST)
Generates a realistic image using Gemini 2.5 Flash Image model.

**Request:**
```json
{
  "screenshot": "base64_encoded_screenshot",
  "clothingType": "shirt"
}
```

**Response:**
```json
{
  "success": true,
  "image": "base64_encoded_image",
  "note": "Image generated using Gemini 2.5 Flash Image"
}
```

**Features**:
- Uses `gemini-2.5-flash-image` model for actual image generation
- Creates photorealistic images of people wearing the designed clothing
- Supports image editing and style transfer
- Configurable aspect ratios (3:4 for clothing photos)
- Graceful fallback when API key is not configured

### 3. `/api/inference` (POST)
Runs object detection on the provided image.

**Request:**
```json
{
  "image": "base64_encoded_image"
}
```

**Response:**
```json
{
  "success": true,
  "detections": [...],
  "confidence": 0.85,
  "detection_count": 1,
  "annotated_image": "base64_encoded_image",
  "format": "jpeg"
}
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# WebRTC Server Configuration
WEBRTC_SERVER_URL=http://localhost:8080

# Next.js Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables
1. Copy `config.env.example` to `.env.local`
2. Fill in your actual API keys

### 3. Start the WebRTC Server
```bash
cd object-detection
python webrtc_server.py
```

### 4. Start the Next.js Application
```bash
npm run dev
```

## Usage

### Testing a Design

1. Go to the Design page (`/design`)
2. Create a design by adding elements to the clothing
3. Click "Test Design" button
4. The system will:
   - Generate a realistic image using Gemini API
   - Run object detection on the generated image
   - Display the results with confidence scores

### Testing with Uploaded Images

1. Go to the Test page (`/test`)
2. Upload an image or capture from camera
3. The system will run real object detection using the WebRTC server
4. View the annotated results

## Features

- **Screenshot Capture**: Captures design canvas using manual canvas rendering (avoids oklch color issues)
- **Real Image Generation**: Uses Gemini 2.5 Flash Image to create photorealistic images of people wearing designed clothing
- **Mock Object Detection**: Falls back to mock detection when WebRTC server is unavailable
- **Annotated Results**: Shows detection results with bounding boxes and detailed detection information
- **Image Display**: Shows both generated realistic images and AI detection results side-by-side
- **Loading States**: Proper loading indicators during processing
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Graceful Fallbacks**: System works even when external services are unavailable

## Technical Details

### Screenshot Capture
The system creates a manual canvas-based screenshot to avoid oklch color function issues:

```typescript
// Create manual canvas to avoid oklch color issues
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size and draw background
canvas.width = rect.width;
canvas.height = rect.height;
ctx.fillStyle = '#1e293b';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw clothing template
const clothingTemplate = new Image();
clothingTemplate.src = clothingTemplates[selectedClothing].image;
ctx.drawImage(clothingTemplate, 0, 0, canvas.width, canvas.height);

// Draw design elements programmatically
for (const element of elements) {
  // Draw each element using canvas drawing functions
  drawElementOnCanvas(ctx, element);
}
```

**Note**: This approach completely bypasses html2canvas and oklch color issues by manually drawing the design on a canvas element using standard RGB colors.

### Image Processing Pipeline
1. Design canvas is manually rendered on a canvas element to avoid oklch color issues
2. Screenshot is sent to Gemini API to generate a realistic image of a person wearing the design
3. The generated image is sent to the WebRTC server for inference
4. YOLO model processes the image and returns detection results
5. Confusion score is calculated based on detection results
6. Results are displayed to the user with confusion scores

### Confusion Score Calculation

The confusion score measures how well the design confuses AI detection systems (higher is better for privacy):

**Formula:**
```typescript
function calculateConfusionScore(inferenceResult) {
  const { detection_count, confidence } = inferenceResult;
  
  // Perfect confusion if no detections
  if (detection_count === 0) return 100;
  
  // Base score: (1 - confidence) * 100
  let score = Math.round((1 - confidence) * 100);
  
  // Penalty for multiple detections
  if (detection_count > 1) {
    score -= (detection_count - 1) * 10;
  }
  
  // Bonus for very uncertain detections
  if (confidence < 0.3) {
    score += 20;
  }
  
  return Math.max(0, Math.min(100, score));
}
```

**Score Interpretation:**
- **90-100**: Excellent confusion (very good for privacy)
- **70-89**: Good confusion (good for privacy)
- **50-69**: Moderate confusion (some privacy protection)
- **30-49**: Poor confusion (limited privacy protection)
- **0-29**: No confusion (no privacy protection)

### Error Handling
- API failures gracefully fall back to mock detection
- User-friendly error messages for common issues
- Loading states prevent multiple simultaneous requests
- Validation ensures required data is present

## Troubleshooting

### Common Issues

1. **Gemini API Key Not Set**
   - Error: "Gemini API key not configured"
   - Solution: Set `GEMINI_API_KEY` in `.env.local`

2. **WebRTC Server Not Running**
   - Error: "Failed to run inference on WebRTC server"
   - Solution: Start the WebRTC server with `python webrtc_server.py`

3. **CORS Issues**
   - Error: Network errors when calling APIs
   - Solution: Ensure `NEXT_PUBLIC_BASE_URL` is set correctly

### Debug Mode
Enable debug logging by setting the log level in the WebRTC server:
```python
logging.basicConfig(level=logging.DEBUG)
```

## Future Enhancements

- [ ] Batch processing for multiple designs
- [ ] Advanced design analysis metrics
- [ ] Integration with more AI models
- [ ] Real-time video processing
- [ ] Cloud deployment options
