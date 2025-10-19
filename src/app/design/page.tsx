'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Star, Sun, Moon, Circle, RotateCcw, Save, ShoppingBag, TestTube, Palette, X } from "lucide-react";
import { SavedDesign, DesignElement } from "@/types";
// html2canvas will be imported dynamically

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

  return imageSrc ? (
    <img 
      src={imageSrc} 
      alt={type}
      className={className}
      style={{ width: size, height: size }}
    />
  ) : null;
};


export default function DesignPage() {
  const [selectedClothing, setSelectedClothing] = useState<'shirt' | 'hoodie'>('shirt');
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragElement, setDragElement] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [testResults, setTestResults] = useState<{ 
    success: boolean; 
    score: number;
    detectionCount?: number;
    confidence?: number;
    detections?: any[];
    annotatedImage?: string;
    generatedImage?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Save modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [designName, setDesignName] = useState('');
  const [designDescription, setDesignDescription] = useState('');
  
  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedDesignName, setSavedDesignName] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  
  // Load design state
  const [isLoadingDesign, setIsLoadingDesign] = useState(false);
  const [loadedDesignId, setLoadedDesignId] = useState<string | null>(null);
  
  // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  // Canvas drawing functions for screenshot generation
  const drawStarOnCanvas = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
    const spikes = 5;
    const outerRadius = radius;
    const innerRadius = radius * 0.4;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes;
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawSaturnOnCanvas = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
    // Draw planet
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw rings
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * 0.8, radius * 0.3, 0, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const drawMoonOnCanvas = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add crescent effect
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx - radius * 0.3, cy, radius * 0.8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  };

  const drawCircleOnCanvas = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.fill();
  };

  const testDesign = async () => {
    if (elements.length === 0) {
      setErrorMessage('Please add some elements to your design before testing!');
      setShowErrorModal(true);
      return;
    }

    try {
      setIsLoading(true);
      
      // Capture screenshot of the design canvas
      if (!canvasRef.current) {
        throw new Error('Design canvas not found');
      }

      // Create manual canvas-based screenshot to avoid oklch color issues
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Set canvas size to match the design canvas
      const rect = canvasRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Fill background
      ctx.fillStyle = '#1e293b'; // slate-800
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw border
      ctx.strokeStyle = '#475569'; // slate-600
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
      
      // Draw the clothing template
      const clothingTemplate = new Image();
      clothingTemplate.crossOrigin = 'anonymous';
      clothingTemplate.src = clothingTemplates[selectedClothing].image;
      
      await new Promise((resolve, reject) => {
        clothingTemplate.onload = () => {
          ctx.drawImage(clothingTemplate, 0, 0, canvas.width, canvas.height);
          resolve(void 0);
        };
        clothingTemplate.onerror = reject;
      });
      
      // Draw design elements
      for (const element of elements) {
        const elementSize = element.size;
        const x = element.x;
        const y = element.y;
        
        ctx.save();
        ctx.translate(x + elementSize / 2, y + elementSize / 2);
        ctx.rotate((element.rotation * Math.PI) / 180);
        
        // Set color
        ctx.fillStyle = element.color;
        ctx.strokeStyle = element.color;
        
        // Draw the element based on type
        switch (element.type) {
          case 'star':
            drawStarOnCanvas(ctx, 0, 0, elementSize / 2);
            break;
          case 'saturn':
            drawSaturnOnCanvas(ctx, 0, 0, elementSize / 2);
            break;
          case 'moon':
            drawMoonOnCanvas(ctx, 0, 0, elementSize / 2);
            break;
          case 'circle':
            drawCircleOnCanvas(ctx, 0, 0, elementSize / 2);
            break;
        }
        
        ctx.restore();
      }
      
      const screenshot = canvas.toDataURL('image/png').split(',')[1];
      
      // Continue with the API call
      const response = await fetch('/api/test-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          screenshot: screenshot,
          clothingType: selectedClothing
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to test design');
      }

      const result = await response.json();
      const newTestResults = {
        success: result.testResults.success,
        score: result.testResults.score,
        detectionCount: result.testResults.detectionCount,
        confidence: result.testResults.confidence,
        detections: result.testResults.detections,
        annotatedImage: result.testResults.annotatedImage,
        generatedImage: result.testResults.generatedImage
      };
      
      setTestResults(newTestResults);

      // If we're editing an existing design, update it with test results
      if (loadedDesignId) {
        const savedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
        const updatedDesigns = savedDesigns.map((design: SavedDesign) => 
          design.id === loadedDesignId 
            ? { ...design, testResults: newTestResults }
            : design
        );
        localStorage.setItem('savedDesigns', JSON.stringify(updatedDesigns));
      }
      
    } catch (error) {
      console.error('Error testing design:', error);
      setErrorMessage(`Failed to test design: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClick = () => {
    if (elements.length === 0) {
      setErrorMessage('Please add some elements to your design before saving!');
      setShowErrorModal(true);
      return;
    }
    
    // Pre-populate form with existing design data if loading
    if (loadedDesignId) {
      const savedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
      const design = savedDesigns.find((d: SavedDesign) => d.id === loadedDesignId);
      if (design) {
        setDesignName(design.name);
        setDesignDescription(design.description);
      }
    } else {
      setDesignName('');
      setDesignDescription('');
    }
    
    setShowSaveModal(true);
  };

  const handleSaveDesign = () => {
    if (!designName.trim()) {
      setErrorMessage('Please enter a name for your design');
      setShowErrorModal(true);
      return;
    }

    // Get existing designs from localStorage
    const existingDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
    
    if (loadedDesignId) {
      // Update existing design
      const updatedDesigns = existingDesigns.map((design: SavedDesign) => 
        design.id === loadedDesignId 
          ? {
              ...design,
              name: designName.trim(),
              description: designDescription.trim() || 'Custom design',
              clothingType: selectedClothing,
              elements: [...elements],
              testResults: testResults || undefined
            }
          : design
      );
      localStorage.setItem('savedDesigns', JSON.stringify(updatedDesigns));
      setSavedDesignName(`${designName} (Updated)`);
    } else {
      // Create new design
      const newDesign: SavedDesign = {
        id: `design-${Date.now()}`,
        name: designName.trim(),
        description: designDescription.trim() || 'Custom design',
        clothingType: selectedClothing,
        elements: [...elements],
        createdAt: new Date(),
        testResults: testResults || undefined
      };
      
      const updatedDesigns = [...existingDesigns, newDesign];
      localStorage.setItem('savedDesigns', JSON.stringify(updatedDesigns));
      setSavedDesignName(designName);
    }
    
    // Close modal and show success
    setShowSaveModal(false);
    setRedirectCountdown(3);
    setShowSuccessModal(true);
  };

  const handleCancelSave = () => {
    setShowSaveModal(false);
    setDesignName('');
    setDesignDescription('');
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    setSavedDesignName('');
    // Redirect to dashboard after closing success modal
    window.location.href = '/dashboard';
  };

  // Load an existing design
  const loadDesign = (designId: string) => {
    const savedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
    const design = savedDesigns.find((d: SavedDesign) => d.id === designId);
    
    if (design) {
      setIsLoadingDesign(true);
      setLoadedDesignId(designId);
      setElements(design.elements);
      setSelectedClothing(design.clothingType);
      setTestResults(design.testResults || null);
      setIsLoadingDesign(false);
    }
  };

  // Check for design ID in URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const designId = urlParams.get('load');
    if (designId) {
      loadDesign(designId);
    }
  }, []);

  // Auto-redirect countdown timer
  useEffect(() => {
    if (showSuccessModal && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSuccessModal && redirectCountdown === 0) {
      handleCloseSuccess();
    }
  }, [showSuccessModal, redirectCountdown]);

  const orderDesign = () => {
    // Mock order - in real app this would start checkout process
    const notification = document.createElement('div');
    notification.className = 'fixed top-6 right-6 bg-slate-900/95 backdrop-blur-sm border border-blue-500/30 text-slate-100 px-4 py-3 rounded-xl shadow-2xl z-50 font-mono text-sm max-w-sm';
    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
        <span>Redirecting to checkout...</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const resetCanvas = () => {
    setElements([]);
    setSelectedElement(null);
    setHoveredElement(null);
    setTestResults(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-slate-100">Undetectable</span>
              {loadedDesignId && (
                <Badge className="bg-blue-600 text-white">
                  Editing Design
                </Badge>
              )}
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSaveClick} variant="outline" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button onClick={orderDesign} className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-mono cursor-pointer">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Order
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {isLoadingDesign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading design...</p>
            </div>
          </div>
        )}
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Clothing Type Selector */}
          <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
            <CardHeader>
              <CardTitle className="text-slate-100">Clothing Type</CardTitle>
              <CardDescription className="text-slate-300">Choose what you're designing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(clothingTemplates).map(([key, template]) => (
                <Button
                  key={key}
                  variant={selectedClothing === key ? "default" : "outline"}
                  className={`w-full cursor-pointer ${selectedClothing === key ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300' : 'border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-600 hover:text-slate-100 hover:border-slate-300'}`}
                  onClick={() => setSelectedClothing(key as any)}
                >
                  {template.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Design Canvas */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
              <CardHeader>
                <CardTitle className="text-slate-100">Design Canvas</CardTitle>
                <CardDescription className="text-slate-300">Drag elements onto the clothing to create your pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  ref={canvasRef}
                  className="relative bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg overflow-hidden"
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
                        {/* Hover detection zone - covers element + border area */}
                        <div
                          className="absolute"
                          style={{
                            left: element.x - 10,
                            top: element.y - 10,
                            width: element.size + 20,
                            height: element.size + 20,
                          }}
                          onMouseEnter={() => setHoveredElement(element.id)}
                          onMouseLeave={() => setHoveredElement(null)}
                        >
                          <div
                            className={`absolute cursor-move group ${selectedElement === element.id ? 'ring-2 ring-blue-500' : ''}`}
                            style={{
                              left: 10,
                              top: 10,
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
                          
                          {/* Delete Button - Positioned outside rotated container */}
                          {hoveredElement === element.id && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteElement(element.id);
                              }}
                              className="absolute w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors z-20 cursor-pointer"
                              style={{
                                left: element.size,
                                top: -8
                              }}
                              title="Delete element"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        {/* Element Controls - Show below selected element */}
                        {selectedElement === element.id && (
                          <div 
                            className="absolute bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg z-10"
                            style={{
                              left: element.x,
                              top: element.y + element.size + 10,
                              minWidth: '200px'
                            }}
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-slate-100">Edit Element</span>
                                <Button 
                                  onClick={() => deleteElement(element.id)}
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500 text-red-400 bg-slate-700/50 hover:bg-red-600 hover:text-white cursor-pointer"
                                >
                                  Delete
                                </Button>
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium mb-1 text-slate-300">Size</label>
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
                                <label className="block text-xs font-medium mb-1 text-slate-300">Rotation</label>
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
                    <div className="absolute inset-0 bg-emerald-400/20 flex items-center justify-center">
                      <div className="text-emerald-400 font-semibold">Drop here to add element</div>
                    </div>
                  )}
                </div>

                {/* Canvas Controls */}
                <div className="mt-4 flex justify-center space-x-4">
                  <Button onClick={resetCanvas} variant="outline" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Element Library */}
          <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
            <CardHeader>
              <CardTitle className="text-slate-100">Elements</CardTitle>
              <CardDescription className="text-slate-300">Drag to add to design</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {celestialElements.map((element) => {
                const IconComponent = element.icon;
                return (
                  <div
                    key={element.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element.id)}
                    className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600 cursor-grab hover:bg-slate-700/50 transition-colors"
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
                    <span className="text-sm font-medium text-slate-100">{element.name}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="mt-8 space-y-6">
            <Card className={`border-2 ${testResults.success ? 'border-emerald-500 bg-emerald-900/20' : 'border-yellow-500 bg-yellow-900/20'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">
                      {testResults.success ? 'Design Test Passed!' : 'Design Needs Improvement'}
                    </h3>
                    <p className="text-slate-300">
                      AI Confusion Score: {testResults.score}%
                    </p>
                    {testResults.detectionCount !== undefined && (
                      <p className="text-slate-400 text-sm">
                        Detections: {testResults.detectionCount} | Confidence: {testResults.confidence ? (testResults.confidence * 100).toFixed(1) : 0}%
                      </p>
                    )}
                  </div>
                  <Badge className={testResults.success ? 'bg-emerald-600' : 'bg-yellow-600'}>
                    {testResults.success ? 'Ready to Order' : 'Needs Work'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

          </div>
        )}


        {/* Test & Order Section */}
        <div className="mt-8">
          <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
            <CardHeader>
              <CardTitle className="text-slate-100">Test & Order Your Design</CardTitle>
              <CardDescription className="text-slate-300">Test your design for AI confusion effectiveness, then order your custom clothing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={testDesign} 
                  disabled={isLoading}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-8 py-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TestTube className="mr-2 h-5 w-5" />
                  {isLoading ? 'Testing...' : 'Test Design'}
                </Button>
                <Button onClick={orderDesign} className="bg-slate-800 hover:bg-slate-700 text-slate-100 px-8 py-4 cursor-pointer">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Order Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Design Stats */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-slate-300 mb-2">{elements.length}</div>
              <div className="text-slate-400">Elements Added</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-slate-300 mb-2">
                {elements.filter(el => el.type === 'star').length}
              </div>
              <div className="text-slate-400">Stars</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-slate-300 mb-2">
                {testResults ? testResults.score : 0}%
              </div>
              <div className="text-slate-400">AI Confusion Score</div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Save Design Modal */}
      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-slate-100">
              {loadedDesignId ? 'Update Design' : 'Save Design'}
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              {loadedDesignId 
                ? 'Update your design name and description, then save the changes.'
                : 'Give your design a name and description to save it to your library.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="design-name" className="text-slate-100">Design Name *</Label>
              <Input
                id="design-name"
                placeholder="Enter design name..."
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                className="w-full bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-emerald-400"
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="design-description" className="text-slate-100">Description (Optional)</Label>
              <Input
                id="design-description"
                placeholder="Enter design description..."
                value={designDescription}
                onChange={(e) => setDesignDescription(e.target.value)}
                className="w-full bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-emerald-400"
              />
            </div>
            
            <div className="text-sm text-slate-400">
              <p><strong className="text-slate-300">Clothing Type:</strong> {selectedClothing === 'shirt' ? 'T-Shirt' : 'Hoodie'}</p>
              <p><strong className="text-slate-300">Elements:</strong> {elements.length} design element{elements.length !== 1 ? 's' : ''}</p>
              {testResults && (
                <p><strong className="text-slate-300">Test Score:</strong> {testResults.score}%</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleCancelSave}
              className="mr-2 cursor-pointer border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveDesign}
              disabled={!designName.trim()}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 cursor-pointer disabled:bg-slate-600 disabled:text-slate-400"
            >
              <Save className="mr-2 h-4 w-4" />
              {loadedDesignId ? 'Update Design' : 'Save Design'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-slate-100">
          <DialogHeader>
            <div className="mx-auto mb-6">
              {/* Professional Success Icon */}
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                <svg 
                  className="w-8 h-8 text-emerald-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
            </div>
            <DialogTitle className="text-xl font-semibold text-slate-100 text-center">
              Design Saved Successfully
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-center">
              Your design <span className="font-medium text-slate-100">"{savedDesignName}"</span> has been added to your library.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-sm text-slate-300">Design is now available in your dashboard</span>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                <span>View and manage your design collection</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                <span>Test your design for AI confusion effectiveness</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                <span>Order custom clothing with your design</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-slate-800/30 border border-slate-700 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300 text-sm">
                  Redirecting to dashboard in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}...
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="justify-center">
             <Button 
               onClick={handleCloseSuccess}
               className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-6 py-2 cursor-pointer"
             >
               {redirectCountdown > 0 ? `Continue (${redirectCountdown})` : 'Continue to Dashboard'}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-slate-100">
          <DialogHeader>
            <div className="mx-auto mb-4">
              <div className="w-16 h-16 bg-yellow-900/20 border border-yellow-500/30 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <DialogTitle className="text-xl font-semibold text-center text-slate-100">
              Attention Required
            </DialogTitle>
            <DialogDescription className="text-center text-slate-300">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="justify-center">
            <Button 
              onClick={() => setShowErrorModal(false)}
              className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-6 cursor-pointer"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
