'use client';

import { useState, useEffect } from 'react';
import { SavedDesign, DesignElement } from '@/types';
import { Star, Sun, Moon, Circle } from 'lucide-react';

// Custom Saturn component
const Saturn = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="6" />
    <ellipse cx="12" cy="12" rx="10" ry="3" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// Custom solid circle component
const SolidCircle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

// Custom solid star component
const SolidStar = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

// Custom solid moon component
const SolidMoon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const celestialElements = [
  { id: 'star', icon: SolidStar, name: 'Star', color: '#000000' },
  { id: 'saturn', icon: Saturn, name: 'Saturn', color: '#000000' },
  { id: 'moon', icon: SolidMoon, name: 'Moon', color: '#000000' },
  { id: 'circle', icon: SolidCircle, name: 'Circle', color: '#000000' }
];

// Pattern icon component (simplified version for preview)
const PatternIcon = ({ type, size = 24, className }: { type: string; size?: number; className?: string }) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const patternImg = new Image();
    patternImg.crossOrigin = 'anonymous';
    patternImg.src = '/images/pattern/picture1.png';
    
    patternImg.onload = () => {
      // Draw pattern as background
      ctx.drawImage(patternImg, 0, 0, size, size);
      
      // Create clipping path
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = 'black';
      
      // Draw the shape based on type
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2;
      
      switch (type) {
        case 'star':
          drawStar(ctx, centerX, centerY, radius);
          break;
        case 'saturn':
          drawSaturn(ctx, centerX, centerY, radius);
          break;
        case 'moon':
          drawMoon(ctx, centerX, centerY, radius);
          break;
        case 'circle':
          drawCircle(ctx, centerX, centerY, radius);
          break;
      }
      
      setImageSrc(canvas.toDataURL());
    };
  }, [type, size]);

  return imageSrc ? (
    <img 
      src={imageSrc} 
      alt={type}
      className={className}
      style={{ width: size, height: size }}
    />
  ) : null;
};

// Drawing functions (simplified versions)
const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
  const spikes = 5;
  const outerRadius = radius;
  const innerRadius = radius * 0.4;
  
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
};

const drawSaturn = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.4, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(cx, cy, radius * 0.7, radius * 0.15, 0, 0, 2 * Math.PI);
  ctx.fill();
};

const drawMoon = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.8, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(cx + radius * 0.3, cy, radius * 0.6, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.globalCompositeOperation = 'destination-in';
};

const drawCircle = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.8, 0, 2 * Math.PI);
  ctx.fill();
};

interface DesignPreviewProps {
  design: SavedDesign;
  size?: 'sm' | 'md' | 'lg';
}

export default function DesignPreview({ design, size = 'md' }: DesignPreviewProps) {
  const sizeClasses = {
    sm: 'w-16 h-20',
    md: 'w-full h-full',
    lg: 'w-40 h-50'
  };

  const clothingTemplates = {
    shirt: { 
      width: 400, 
      height: 500, 
      name: 'T-Shirt',
      image: '/images/fordesigning/blacktshirt.webp'
    },
    hoodie: { 
      width: 400, 
      height: 560, 
      name: 'Hoodie',
      image: '/images/fordesigning/blacksweatshirt.webp'
    }
  };

  const template = clothingTemplates[design.clothingType];

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto`}>
      {/* Clothing Template Background */}
      <div className="relative w-full h-full bg-slate-800 border border-slate-600 rounded-lg overflow-hidden">
        <img
          src={template.image}
          alt={template.name}
          className="w-full h-full object-contain"
        />
        
        {/* Design Elements */}
        {design.elements.map((element) => {
          const IconComponent = celestialElements.find(el => el.id === element.type)?.icon || Star;
          
          // Calculate the proper scale factor based on the actual rendered image size
          // The image uses object-contain, so we need to calculate how much it's scaled
          // For a 400px wide template in a container, we need to find the actual scale
          const containerWidth = 400; // This will be the actual rendered width of the image
          const containerHeight = template.height;
          
          // The scale factor should be 1.0 since we want full size positioning
          // But we need to account for the fact that the container might be different size
          const scaleFactor = 1.0; // Use original coordinates
          
          // Add small offset to account for object-contain centering
          const offsetX = -25; // Move left to counteract "down to the right"
          const offsetY = -60; // Move up to counteract "down to the right"
          
          const scaledSize = element.size * scaleFactor;
          const scaledX = (element.x * scaleFactor) + offsetX;
          const scaledY = (element.y * scaleFactor) + offsetY;
          
          return (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: scaledX,
                top: scaledY,
                transform: `rotate(${element.rotation}deg)`,
                width: scaledSize,
                height: scaledSize
              }}
            >
              {element.color === '#000000' ? (
                <PatternIcon 
                  type={element.type}
                  size={scaledSize}
                  className="w-full h-full"
                />
              ) : (
                <IconComponent 
                  className="w-full h-full" 
                  style={{ color: element.color }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
