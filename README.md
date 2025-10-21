# PrivacyWear - Privacy by Fashion

A modern full-stack application showcasing "privacy-by-fashion" concept. This app demonstrates how clothing can be designed to hide from YOLO computer vision detection, featuring both a Next.js frontend and Python-based YOLO detection backend.

## 🚀 Quick Start

### Frontend (Next.js)
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Backend (YOLO Detection)
1. **Start the YOLO server:**
   ```bash
   ./start_py.sh
   ```

2. **Or manually:**
   ```bash
   cd object-detection
   source venv/bin/activate
   python webrtc_server.py
   ```

3. **Test detection:**
   ```bash
   cd object-detection
   source venv/bin/activate
   python test_inference_endpoint.py
   ```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Lucide React** for icons
- **Stripe** for payment processing

### Backend
- **Python 3.12+** with virtual environment
- **YOLOv8** (Ultralytics) for object detection
- **OpenCV** for computer vision
- **aiohttp** for async web server
- **PyTorch** for ML framework
- **Pillow** for image processing

## 📱 Features

### 🏠 Hero/Dashboard Page
- Marketing-focused landing page
- Clear value proposition for privacy-by-fashion
- Call-to-action buttons for testing and shopping
- Privacy level explanations
- Responsive design

### 🧪 Test Your Privacy Page
- **Image Upload**: Upload photos to test detection
- **Camera Capture**: Use webcam for real-time testing
- **Real YOLO Detection**: Live object detection using YOLOv8
- **Results Display**: Clear PASS/FAIL indicators with bounding boxes
- **Confidence Scores**: Shows detection confidence levels
- **Annotated Images**: Visual results with detection overlays

### 🛍️ Shop Page
- **Product Grid**: Browse privacy-focused clothing
- **Filtering**: Filter by category, privacy level, search
- **Product Details**: Modal with size/color selection
- **Shopping Cart**: Local storage-based cart
- **Mock Checkout**: Simulated checkout process

### 🔐 Sign In Page
- Clean authentication interface
- Demo credentials provided
- Privacy policy links

## 🎨 Design Features

- **Dark Theme**: Sleek purple/slate gradient design
- **Mobile-First**: Fully responsive across all devices
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Optimized images, lazy loading
- **Modern UI**: Clean, professional interface

## 📊 Privacy Levels

- **Basic (60-70%)**: Subtle anti-detection patterns
- **Enhanced (80-85%)**: Advanced pattern disruption  
- **Maximum (90-95%)**: Cutting-edge invisibility tech

## 🔧 API Endpoints

### Frontend APIs (Next.js)
- `POST /api/test-design` - Test clothing design with AI
- `POST /api/generate-image` - Generate realistic images using Gemini
- `POST /api/inference` - Run YOLO detection on images
- `GET /api/products` - Product catalog
- `POST /api/cart` - Cart management
- `POST /api/checkout` - Stripe checkout

### Backend APIs (Python)
- `POST /inference` - YOLO object detection endpoint
- `WebSocket /ws` - Real-time camera feed
- `GET /health` - Server health check

## 🐍 Python Backend Setup

### Prerequisites
- Python 3.12+ installed
- Virtual environment support

### Installation
The Python backend uses a virtual environment located in `object-detection/venv/`:

```bash
# Automatic setup (recommended)
./start_py.sh

# Manual setup
cd object-detection
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Dependencies
- **ultralytics**: YOLOv8 model
- **opencv-python**: Computer vision
- **aiohttp**: Async web server
- **torch/torchvision**: ML framework
- **pillow**: Image processing
- **numpy**: Numerical computing

### Running the Backend
```bash
# Start YOLO server (port 8080)
cd object-detection
source venv/bin/activate
python webrtc_server.py

# Test detection
python test_inference_endpoint.py

# Run camera demo
python webrtc_demo.py
```

## 📁 Project Structure

```
├── src/                    # Next.js frontend
│   ├── app/               # App Router pages
│   │   ├── page.tsx       # Hero/Dashboard page
│   │   ├── test/          # Privacy testing page
│   │   ├── shop/          # Product catalog & cart
│   │   ├── design/        # Design interface
│   │   ├── checkout/      # Checkout flow
│   │   └── api/           # API routes
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities
│   └── types/             # TypeScript definitions
├── object-detection/       # Python backend
│   ├── venv/              # Virtual environment
│   ├── webrtc_server.py   # YOLO detection server
│   ├── webrtc_demo.py     # Camera demo
│   ├── test_*.py          # Test scripts
│   ├── requirements.txt   # Python dependencies
│   └── yolov8n.pt         # YOLO model weights
├── public/                # Static assets
├── start_py.sh           # Python setup script
└── package.json          # Node.js dependencies
```

## 🚀 Deployment

This app is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- Any platform supporting Node.js

## 🎯 Hackathon Demo Flow

1. **Landing Page**: Show the concept and value proposition
2. **Design Interface**: Create custom privacy-focused clothing designs
3. **Test Privacy**: Demonstrate real YOLO detection with live results
4. **Shop Collection**: Browse products and add to cart
5. **Checkout**: Complete the purchase flow with Stripe integration

## 🔧 Environment Setup

### Required Environment Variables
Create a `.env.local` file in the root directory:

```env
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# WebRTC Server Configuration
WEBRTC_SERVER_URL=http://localhost:8080

# Next.js Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Development Workflow
1. **Start Python backend**: `./start_py.sh`
2. **Start Next.js frontend**: `npm run dev`
3. **Test integration**: Visit `/test` page for live detection
4. **Design clothing**: Visit `/design` page for design interface

## 🔮 Future Enhancements

- **Advanced AI Models**: Integration with more sophisticated detection models
- **User Authentication**: Complete user management system
- **Real-time Processing**: Live video stream analysis
- **Mobile App**: React Native mobile application
- **Product Reviews**: User feedback and rating system
- **Size Guide**: AI-powered size recommendations
- **Social Features**: Share designs and privacy scores
- **Cloud Deployment**: Scalable cloud infrastructure

## 🐛 Troubleshooting

### Common Issues

**Python Backend Issues:**
- **Virtual environment not found**: Run `./start_py.sh` to create it
- **Package installation fails**: Ensure Python 3.12+ is installed
- **Port 8080 in use**: Change port in `webrtc_server.py`

**Frontend Issues:**
- **API calls fail**: Ensure Python backend is running on port 8080
- **Environment variables**: Check `.env.local` file exists
- **Build errors**: Run `npm install` to update dependencies

**Detection Issues:**
- **No detections**: Check image quality and lighting
- **Low confidence**: Try different angles or lighting
- **Server errors**: Check Python backend logs

---

**Built for TX2025 Hackathon** 🏆

*Protecting your privacy through fashion*