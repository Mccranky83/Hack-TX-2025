'use client';

import { useState, useRef, useEffect } from 'react';
import { SavedDesign } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react';

interface DesignZoomModalProps {
  design: SavedDesign;
  isOpen: boolean;
  onClose: () => void;
}

export default function DesignZoomModal({ design, isOpen, onClose }: DesignZoomModalProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom and position when modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-slate-900 border-slate-700" showCloseButton={false}>
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-slate-100">
              {design.name} - Design Preview
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer disabled:opacity-50"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-slate-300 min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer disabled:opacity-50"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
                className="ml-2 border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6 pt-4">
          <div
            ref={containerRef}
            className="relative w-full h-[60vh] bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-600"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
            >
              <DesignPreviewLarge design={design} />
            </div>
          </div>
          
          <div className="mt-4 text-sm text-slate-400">
            <p><strong className="text-slate-300">Clothing Type:</strong> {design.clothingType === 'shirt' ? 'T-Shirt' : 'Hoodie'}</p>
            <p><strong className="text-slate-300">Elements:</strong> {design.elements.length} design element{design.elements.length !== 1 ? 's' : ''}</p>
            <p><strong className="text-slate-300">Created:</strong> {new Date(design.createdAt).toLocaleDateString()}</p>
            {design.testResults && (
              <p><strong className="text-slate-300">Test Score:</strong> {design.testResults.score}%</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Large preview component for the zoom modal
function DesignPreviewLarge({ design }: { design: SavedDesign }) {
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
    <div className="relative" style={{ width: template.width, height: template.height }}>
      {/* Clothing Template Background */}
      <div className="relative w-full h-full bg-slate-800 border border-slate-600 rounded-lg overflow-hidden">
        <img
          src={template.image}
          alt={template.name}
          className="w-full h-full object-contain"
        />
        
        {/* Design Elements */}
        {design.elements.map((element) => {
          const IconComponent = getIconComponent(element.type);
          
          return (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: element.x,
                top: element.y,
                transform: `rotate(${element.rotation}deg)`,
                width: element.size,
                height: element.size
              }}
            >
              {element.color === '#000000' ? (
                <PatternIconLarge 
                  type={element.type}
                  size={element.size}
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

// Helper function to get icon component
function getIconComponent(type: string) {
  const icons = {
    star: () => (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    saturn: () => (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="6" />
        <ellipse cx="12" cy="12" rx="10" ry="3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    moon: () => (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
    circle: () => (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
      </svg>
    )
  };
  
  return icons[type as keyof typeof icons] || icons.star;
}

// Pattern icon component for large preview
function PatternIconLarge({ type, size, className }: { type: string; size: number; className?: string }) {
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
      ctx.drawImage(patternImg, 0, 0, size, size);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = 'black';
      
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

  return (
    <img 
      src={imageSrc} 
      alt={type}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}

// Drawing functions
function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
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
}

function drawSaturn(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.4, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(cx, cy, radius * 0.7, radius * 0.15, 0, 0, 2 * Math.PI);
  ctx.fill();
}

function drawMoon(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.8, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(cx + radius * 0.3, cy, radius * 0.6, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.globalCompositeOperation = 'destination-in';
}

function drawCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.8, 0, 2 * Math.PI);
  ctx.fill();
}
