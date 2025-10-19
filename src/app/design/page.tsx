'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Sun, Moon, Circle, RotateCcw, Save, ShoppingBag, TestTube, Palette } from "lucide-react";

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

// Canvas-based pattern filling
const createPatternIcon = (type: string, size: number = 24) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Load pattern image
  const patternImg = new Image();
  patternImg.src = '/images/pattern/picture1.png';
  
  patternImg.onload = () => {
    // Draw pattern as background
    ctx.drawImage(patternImg, 0, 0, size, size);
    
    // Create clipping path based on icon type
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = 'black';
    
    switch (type) {
      case 'star':
        drawStar(ctx, size / 2, size / 2, size / 2);
        break;
      case 'saturn':
        drawSaturn(ctx, size / 2, size / 2, size / 2);
        break;
      case 'moon':
        drawMoon(ctx, size / 2, size / 2, size / 2);
        break;
      case 'circle':
        drawCircle(ctx, size / 2, size / 2, size / 2);
        break;
    }
  };
  
  return canvas.toDataURL();
};

// Drawing functions for each icon type
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
  // Planet body
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.4, 0, 2 * Math.PI);
  ctx.fill();
  
  // Rings (ellipse around the planet)
  ctx.beginPath();
  ctx.ellipse(cx, cy, radius * 0.7, radius * 0.15, 0, 0, 2 * Math.PI);
  ctx.fill();
};

const drawMoon = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
  // Create crescent moon by drawing two circles and using composite operation
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.8, 0, 2 * Math.PI);
  ctx.fill();
  
  // Create the "cutout" for crescent effect
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(cx + radius * 0.3, cy, radius * 0.6, 0, 2 * Math.PI);
  ctx.fill();
  
  // Reset composite operation
  ctx.globalCompositeOperation = 'destination-in';
};

const drawCircle = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.8, 0, 2 * Math.PI);
  ctx.fill();
};

// React component for pattern-filled icons
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
      
      switch (type) {
        case 'star':
          drawStar(ctx, size / 2, size / 2, size / 2);
          break;
        case 'saturn':
          drawSaturn(ctx, size / 2, size / 2, size / 2);
          break;
        case 'moon':
          drawMoon(ctx, size / 2, size / 2, size / 2);
          break;
        case 'circle':
          drawCircle(ctx, size / 2, size / 2, size / 2);
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
};

interface DesignElement {
  id: string;
  type: 'star' | 'saturn' | 'moon' | 'circle';
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
}

export default function DesignPage() {
  const [selectedClothing, setSelectedClothing] = useState<'shirt' | 'hoodie'>('shirt');
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragElement, setDragElement] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [testResults, setTestResults] = useState<{ success: boolean; score: number } | null>(null);

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

  const celestialElements = [
    { id: 'star', icon: SolidStar, name: 'Star', color: '#000000' },
    { id: 'saturn', icon: Saturn, name: 'Saturn', color: '#000000' },
    { id: 'moon', icon: SolidMoon, name: 'Moon', color: '#000000' },
    { id: 'circle', icon: SolidCircle, name: 'Circle', color: '#000000' }
  ];

  const handleDragStart = (e: React.DragEvent, elementType: string) => {
    setDragElement(elementType);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement: DesignElement = {
      id: `${dragElement}-${Date.now()}`,
      type: dragElement as any,
      x: x - 25, // Center the element
      y: y - 25,
      size: 50,
      color: celestialElements.find(el => el.id === dragElement)?.color || '#000000',
      rotation: 0
    };

    setElements(prev => [...prev, newElement]);
    setDragElement(null);
    setIsDragging(false);
  };

  const handleElementClick = (elementId: string) => {
    setSelectedElement(elementId);
  };

  const handleElementMove = (elementId: string, newX: number, newY: number) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, x: newX, y: newY } : el
    ));
  };

  const handleElementResize = (elementId: string, newSize: number) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, size: Math.max(20, Math.min(100, newSize)) } : el
    ));
  };

  const handleElementRotate = (elementId: string, newRotation: number) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, rotation: newRotation } : el
    ));
  };

  const handleElementColorChange = (elementId: string, newColor: string) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, color: newColor } : el
    ));
  };

  const deleteElement = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    setSelectedElement(null);
  };

  const testDesign = () => {
    // Mock testing - in real app this would call your API
    const score = Math.random() * 40 + 60; // 60-100% success rate
    setTestResults({
      success: score > 80,
      score: Math.round(score)
    });
  };

  const saveDesign = () => {
    // Mock save - in real app this would save to user's library
    alert('Design saved to your library!');
  };

  const orderDesign = () => {
    // Mock order - in real app this would start checkout process
    alert('Redirecting to checkout...');
  };

  const resetCanvas = () => {
    setElements([]);
    setSelectedElement(null);
    setTestResults(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-gray-900">Undetectable</span>
            <div className="flex space-x-2">
              <Button onClick={saveDesign} variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button onClick={orderDesign} className="bg-gray-900 hover:bg-gray-800 text-white">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Order
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Clothing Type Selector */}
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardHeader>
              <CardTitle>Clothing Type</CardTitle>
              <CardDescription>Choose what you're designing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(clothingTemplates).map(([key, template]) => (
                <Button
                  key={key}
                  variant={selectedClothing === key ? "default" : "outline"}
                  className={`w-full ${selectedClothing === key ? 'bg-gray-900 text-white' : 'border-gray-300 text-gray-700'}`}
                  onClick={() => setSelectedClothing(key as any)}
                >
                  {template.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Design Canvas */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-50 border-gray-200 text-gray-900">
              <CardHeader>
                <CardTitle>Design Canvas</CardTitle>
                <CardDescription>Drag elements onto the clothing to create your pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  ref={canvasRef}
                  className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
                  style={{ 
                    width: clothingTemplates[selectedClothing]?.width || 400,
                    height: clothingTemplates[selectedClothing]?.height || 500,
                    margin: '0 auto'
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const draggedElementId = e.dataTransfer.getData('element-id');
                    if (draggedElementId) {
                      const rect = canvasRef.current?.getBoundingClientRect();
                      if (rect) {
                        const newX = e.clientX - rect.left - 25;
                        const newY = e.clientY - rect.top - 25;
                        handleElementMove(draggedElementId, newX, newY);
                      }
                    } else if (dragElement) {
                      // New element from library
                      handleDrop(e);
                    }
                  }}
                >
                  {/* Clothing Template Background */}
                  <div className="absolute inset-0">
                    <img
                      src={clothingTemplates[selectedClothing]?.image || '/images/fordesigning/blacktshirt.webp'}
                      alt={clothingTemplates[selectedClothing]?.name || 'T-Shirt'}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Design Elements */}
                  {elements.map((element) => {
                    const IconComponent = celestialElements.find(el => el.id === element.type)?.icon || Star;
                    return (
                      <div key={element.id}>
                        <div
                          className={`absolute cursor-move ${selectedElement === element.id ? 'ring-2 ring-blue-500' : ''}`}
                          style={{
                            left: element.x,
                            top: element.y,
                            transform: `rotate(${element.rotation}deg)`,
                            width: element.size,
                            height: element.size
                          }}
                          onClick={() => handleElementClick(element.id)}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('element-id', element.id);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                        >
                          {element.color === '#000000' ? (
                            <PatternIcon 
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
                        
                        {/* Element Controls - Show below selected element */}
                        {selectedElement === element.id && (
                          <div 
                            className="absolute bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-10"
                            style={{
                              left: element.x,
                              top: element.y + element.size + 10,
                              minWidth: '200px'
                            }}
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Edit Element</span>
                                <Button 
                                  onClick={() => deleteElement(element.id)}
                                  size="sm"
                                  variant="outline"
                                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                                >
                                  Delete
                                </Button>
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium mb-1">Size</label>
                                <input
                                  type="range"
                                  min="20"
                                  max="100"
                                  value={element.size}
                                  onChange={(e) => handleElementResize(element.id, parseInt(e.target.value))}
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium mb-1">Rotation</label>
                                <input
                                  type="range"
                                  min="0"
                                  max="360"
                                  value={element.rotation}
                                  onChange={(e) => handleElementRotate(element.id, parseInt(e.target.value))}
                                  className="w-full"
                                />
                              </div>
                              
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Drop Zone Indicator */}
                  {isDragging && (
                    <div className="absolute inset-0 bg-blue-100 bg-opacity-50 flex items-center justify-center">
                      <div className="text-blue-600 font-semibold">Drop here to add element</div>
                    </div>
                  )}
                </div>

                {/* Canvas Controls */}
                <div className="mt-4 flex justify-center space-x-4">
                  <Button onClick={resetCanvas} variant="outline" className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Element Library */}
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardHeader>
              <CardTitle>Elements</CardTitle>
              <CardDescription>Drag to add to design</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {celestialElements.map((element) => {
                const IconComponent = element.icon;
                return (
                  <div
                    key={element.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element.id)}
                    className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 cursor-grab hover:bg-gray-50 transition-colors"
                  >
                    {element.color === '#000000' ? (
                      <PatternIcon 
                        type={element.id}
                        size={24}
                        className="w-6 h-6"
                      />
                    ) : (
                      <IconComponent className="w-6 h-6" style={{ color: element.color }} />
                    )}
                    <span className="text-sm font-medium">{element.name}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="mt-8">
            <Card className={`border-2 ${testResults.success ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {testResults.success ? 'Design Test Passed!' : 'Design Needs Improvement'}
                    </h3>
                    <p className="text-gray-600">
                      AI Confusion Score: {testResults.score}%
                    </p>
                  </div>
                  <Badge className={testResults.success ? 'bg-green-600' : 'bg-yellow-600'}>
                    {testResults.success ? 'Ready to Order' : 'Needs Work'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}


        {/* Test & Order Section */}
        <div className="mt-8">
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardHeader>
              <CardTitle>Test & Order Your Design</CardTitle>
              <CardDescription>Test your design for AI confusion effectiveness, then order your custom clothing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={testDesign} className="bg-green-600 hover:bg-green-700 text-white px-8 py-4">
                  <TestTube className="mr-2 h-5 w-5" />
                  Test Design
                </Button>
                <Button onClick={orderDesign} className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Order Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Design Stats */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">{elements.length}</div>
              <div className="text-gray-600">Elements Added</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {elements.filter(el => el.type === 'star').length}
              </div>
              <div className="text-gray-600">Stars</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {testResults ? testResults.score : 0}%
              </div>
              <div className="text-gray-600">AI Confusion Score</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
