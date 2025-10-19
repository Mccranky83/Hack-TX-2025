# PrivacyWear - Privacy by Fashion

A modern frontend for a hackathon prototype showcasing "privacy-by-fashion" concept. This app demonstrates how clothing can be designed to hide from YOLO computer vision detection.

## 🚀 Quick Start

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

## 🛠️ Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Lucide React** for icons

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
- **Mock Detection**: Simulates YOLO detection results
- **Results Display**: Clear PASS/FAIL indicators
- **Confidence Scores**: Shows detection confidence levels

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

## 🔧 Backend Integration Points

The app is designed with clear TODO markers for backend integration:

- `POST /api/detect` - Image detection endpoint
- `GET /api/products` - Product catalog
- `POST /api/cart` - Cart management
- `POST /api/checkout` - Mock checkout
- `GET /api/user/profile` - User profile

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── page.tsx         # Hero/Dashboard page
│   ├── test/            # Privacy testing page
│   ├── shop/            # Product catalog & cart
│   └── signin/          # Authentication page
├── components/ui/       # shadcn/ui components
├── types/               # TypeScript definitions
├── data/                # Mock data
└── lib/                 # Utilities
```

## 🚀 Deployment

This app is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- Any platform supporting Node.js

## 🎯 Hackathon Demo Flow

1. **Landing Page**: Show the concept and value proposition
2. **Test Privacy**: Demonstrate the detection tool with mock results
3. **Shop Collection**: Browse products and add to cart
4. **Checkout**: Complete the mock purchase flow

## 🔮 Future Enhancements

- Real computer vision API integration
- User authentication system
- Payment processing
- Product reviews and ratings
- Size guide and recommendations
- Social sharing features

---

**Built for TX2025 Hackathon** 🏆

*Protecting your privacy through fashion*