// Core data types for the privacy-by-fashion app

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'shirt' | 'hoodie' | 'jacket';
  sizes: string[];
  colors: string[];
  privacyLevel: 'basic' | 'enhanced' | 'maximum';
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isSignedIn: boolean;
}

export interface MockDetectResult {
  detected: boolean;
  confidence: number;
  objects: Array<{
    name: string;
    confidence: number;
    bbox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  timestamp: number;
  imageUrl?: string;
}

export interface DetectionTest {
  id: string;
  imageUrl: string;
  result: MockDetectResult;
  testDate: Date;
  userId: string;
}

// Navigation and UI types
export type NavigationItem = {
  label: string;
  href: string;
  icon?: string;
};

export type PrivacyLevel = 'basic' | 'enhanced' | 'maximum';

// API response types (for future backend integration)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// TODO: Backend integration points
// - POST /api/detect - Image detection endpoint
// - GET /api/products - Product catalog
// - POST /api/cart - Cart management
// - POST /api/checkout - Mock checkout
// - GET /api/user/profile - User profile
