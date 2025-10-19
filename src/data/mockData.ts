import { Product, MockDetectResult } from '@/types';

// Mock products for the shop
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Stealth Basic Tee',
    description: 'Our entry-level privacy shirt with subtle anti-detection patterns. Perfect for everyday wear.',
    price: 29.99,
    image: '/images/stealth-basic.jpg',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Gray'],
    privacyLevel: 'basic',
    inStock: true,
  },
  {
    id: '2',
    name: 'Ghost Mode Hoodie',
    description: 'Advanced privacy hoodie with enhanced anti-YOLO technology. Stay invisible to AI surveillance.',
    price: 59.99,
    image: '/images/ghost-hoodie.jpg',
    category: 'hoodie',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Dark Gray', 'Forest Green'],
    privacyLevel: 'enhanced',
    inStock: true,
  },
  {
    id: '3',
    name: 'Maximum Privacy Jacket',
    description: 'Our flagship product with maximum anti-detection capabilities. For serious privacy advocates.',
    price: 89.99,
    image: '/images/max-privacy-jacket.jpg',
    category: 'jacket',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Charcoal'],
    privacyLevel: 'maximum',
    inStock: true,
  },
  {
    id: '4',
    name: 'Urban Camo Tee',
    description: 'Street-style privacy shirt that blends urban aesthetics with anti-detection technology.',
    price: 34.99,
    image: '/images/urban-camo.jpg',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Urban Gray', 'Street Black'],
    privacyLevel: 'basic',
    inStock: false,
  },
  {
    id: '5',
    name: 'Digital Disruptor Hoodie',
    description: 'High-tech hoodie designed to confuse computer vision algorithms with advanced pattern disruption.',
    price: 69.99,
    image: '/images/digital-disruptor.jpg',
    category: 'hoodie',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Tech Black', 'Cyber Blue'],
    privacyLevel: 'enhanced',
    inStock: true,
  },
];

// Mock detection results for testing
export const mockDetectionResults: MockDetectResult[] = [
  {
    detected: false,
    confidence: 0.15,
    objects: [],
    timestamp: Date.now(),
    imageUrl: '/images/test-result-1.jpg',
  },
  {
    detected: true,
    confidence: 0.87,
    objects: [
      {
        name: 'person',
        confidence: 0.87,
        bbox: { x: 100, y: 50, width: 200, height: 300 },
      },
    ],
    timestamp: Date.now() - 3600000,
    imageUrl: '/images/test-result-2.jpg',
  },
];

// Privacy level descriptions
export const privacyLevels = {
  basic: {
    name: 'Basic Privacy',
    description: 'Subtle anti-detection patterns for everyday use',
    effectiveness: '60-70%',
  },
  enhanced: {
    name: 'Enhanced Privacy',
    description: 'Advanced pattern disruption for better protection',
    effectiveness: '80-85%',
  },
  maximum: {
    name: 'Maximum Privacy',
    description: 'Cutting-edge technology for maximum invisibility',
    effectiveness: '90-95%',
  },
};
