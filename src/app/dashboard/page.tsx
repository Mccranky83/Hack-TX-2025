'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Palette, TestTube, ShoppingBag, Download, Upload, Settings, Trash2, Edit, AlertTriangle } from "lucide-react";
import { SavedDesign } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DesignPreview from "@/components/DesignPreview";
import DesignZoomModal from "@/components/DesignZoomModal";
import CartButton from "@/components/CartButton";
import CartDrawer from "@/components/CartDrawer";
import OrderModal from "@/components/OrderModal";

// Typing animation component with highlighted word
function TypingAnimation({ text, className = "" }: { text: string; className?: string }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  // Split the text to highlight "Undetectable"
  const renderText = () => {
    const parts = displayedText.split('Undetectable');
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}
          <span className="text-emerald-400">Undetectable</span>
          {parts[1]}
        </>
      );
    }
    return displayedText;
  };

  return (
    <span className={className}>
      {renderText()}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function DashboardPage() {
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [designToDelete, setDesignToDelete] = useState<SavedDesign | null>(null);
  
  // Zoom modal state
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null);
  
  // Order modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [designToOrder, setDesignToOrder] = useState<SavedDesign | null>(null);

  // Test functionality state
  const [testingDesign, setTestingDesign] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{ [designId: string]: { 
    success: boolean; 
    score: number;
    detectionCount?: number;
    confidence?: number;
    detections?: any[];
  } }>({});

  // Load saved designs from localStorage on component mount
  useEffect(() => {
    const designs = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
    setSavedDesigns(designs);
  }, []);

  // Show delete confirmation modal
  const handleDeleteClick = (design: SavedDesign) => {
    setDesignToDelete(design);
    setShowDeleteModal(true);
  };

  // Confirm delete design
  const confirmDelete = () => {
    if (designToDelete) {
      const updatedDesigns = savedDesigns.filter(design => design.id !== designToDelete.id);
      setSavedDesigns(updatedDesigns);
      localStorage.setItem('savedDesigns', JSON.stringify(updatedDesigns));
      setShowDeleteModal(false);
      setDesignToDelete(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDesignToDelete(null);
  };

  // Open zoom modal
  const openZoomModal = (design: SavedDesign) => {
    setSelectedDesign(design);
    setShowZoomModal(true);
  };

  // Close zoom modal
  const closeZoomModal = () => {
    setShowZoomModal(false);
    setSelectedDesign(null);
  };

  // Open order modal
  const openOrderModal = (design: SavedDesign) => {
    setDesignToOrder(design);
    setShowOrderModal(true);
  };

  // Close order modal
  const closeOrderModal = () => {
    setShowOrderModal(false);
    setDesignToOrder(null);
  };

  // Test design function
  const testDesign = async (design: SavedDesign) => {
    setTestingDesign(design.id);
    
    try {
      // Create a canvas to render the design
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      canvas.width = 400;
      canvas.height = 500;

      // Draw background
      ctx.fillStyle = '#1e293b'; // slate-800
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw border
      ctx.strokeStyle = '#475569'; // slate-600
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

      // Draw clothing template
      const clothingTemplate = new Image();
      clothingTemplate.crossOrigin = 'anonymous';
      clothingTemplate.src = design.clothingType === 'shirt' 
        ? '/images/fordesigning/blacktshirt.png!bw700' 
        : '/images/fordesigning/blacksweatshirt.webp';

      await new Promise((resolve, reject) => {
        clothingTemplate.onload = () => {
          ctx.drawImage(clothingTemplate, 0, 0, canvas.width, canvas.height);
          resolve(void 0);
        };
        clothingTemplate.onerror = reject;
      });

      // Draw design elements
      for (const element of design.elements) {
        const elementSize = element.size;
        const x = element.x;
        const y = element.y;

        ctx.save();
        ctx.translate(x + elementSize / 2, y + elementSize / 2);
        ctx.rotate((element.rotation * Math.PI) / 180);

        ctx.fillStyle = element.color;
        ctx.strokeStyle = element.color;

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

      // Call the test API
      const response = await fetch('/api/test-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          screenshot,
          clothingType: design.clothingType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to test design');
      }

      const result = await response.json();
      
      // Update test results
      setTestResults(prev => ({
        ...prev,
        [design.id]: {
          success: result.testResults.success,
          score: result.testResults.score,
          detectionCount: result.testResults.detectionCount,
          confidence: result.testResults.confidence,
          detections: result.testResults.detections
        }
      }));

      // Update the design in localStorage
      const updatedDesigns = savedDesigns.map(d => 
        d.id === design.id 
          ? { ...d, testResults: {
              success: result.testResults.success,
              score: result.testResults.score,
              detectionCount: result.testResults.detectionCount,
              confidence: result.testResults.confidence,
              detections: result.testResults.detections
            }}
          : d
      );
      setSavedDesigns(updatedDesigns);
      localStorage.setItem('savedDesigns', JSON.stringify(updatedDesigns));
      
    } catch (error) {
      console.error('Error testing design:', error);
      alert(`Failed to test design: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTestingDesign(null);
    }
  };

  // Canvas drawing functions
  const drawStarOnCanvas = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    const spikes = 5;
    const outerRadius = radius;
    const innerRadius = radius * 0.4;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes;
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawSaturnOnCanvas = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    // Main planet
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Rings
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.4, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const drawMoonOnCanvas = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Crescent effect
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(x - radius * 0.3, y, radius * 0.8, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawCircleOnCanvas = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  };

  // Get privacy level badge color
  const getPrivacyLevelColor = (design: SavedDesign) => {
    const currentResults = testResults[design.id] || design.testResults;
    if (!currentResults) return 'bg-gray-600';
    if (currentResults.success) return 'bg-green-600';
    if (currentResults.score >= 70) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  // Get privacy level text
  const getPrivacyLevelText = (design: SavedDesign) => {
    const currentResults = testResults[design.id] || design.testResults;
    if (!currentResults) return 'Not Tested';
    if (currentResults.success) return 'Tested & Ready';
    if (currentResults.score >= 70) return 'Needs Work';
    return 'Poor Score';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
             <span className="text-2xl font-bold text-slate-100 font-mono">404 Apparel</span>
          </div>
          <div className="flex items-center space-x-4">
            <CartButton />
            <Link href="/settings">
              <Button variant="outline" className="text-slate-100 border-slate-500 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-100 mb-4">
             <TypingAnimation text="Your 404 Apparel Dashboard" className="text-4xl md:text-6xl font-bold text-slate-100" />
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Test your patterns and create custom AI-confusing designs
          </p>
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Test/Demo Your Shirt */}
          <Link href="/demo">
            <Card className="bg-slate-900/50 border-slate-700 text-slate-100 hover:bg-slate-800/50 hover:border-emerald-400/50 transition-all cursor-pointer h-full">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-400">
                  <TestTube className="h-10 w-10 text-emerald-400" />
                </div>
                <CardTitle className="text-2xl text-slate-100">Test/Demo Your Shirt</CardTitle>
                <CardDescription className="text-lg text-slate-300">
                  See computer vision in action with live camera detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-slate-300">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    Live camera feed with real-time detection
                  </div>
                  <div className="flex items-center text-slate-300">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    See detection results: "1 person detected", "2 people detected"
                  </div>
                  <div className="flex items-center text-slate-300">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    Test your existing clothing patterns
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Custom Designs */}
          <Link href="/design">
            <Card className="bg-slate-900/50 border-slate-700 text-slate-100 hover:bg-slate-800/50 hover:border-emerald-400/50 transition-all cursor-pointer h-full">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-400">
                  <Palette className="h-10 w-10 text-emerald-400" />
                </div>
                <CardTitle className="text-2xl text-slate-100">Custom Designs</CardTitle>
                <CardDescription className="text-lg text-slate-300">
                  Create your own AI-confusing patterns with celestial elements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-slate-300">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    Drag & drop design elements (stars, moons, suns, circles)
                  </div>
                  <div className="flex items-center text-slate-300">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    Test your design for undetection effectiveness
                  </div>
                  <div className="flex items-center text-slate-300">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    Order custom clothing with your design
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Saved Designs Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-100">Saved Designs</h2>
            <Link href="/design">
              <Button className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-mono cursor-pointer">
                <Palette className="mr-2 h-4 w-4" />
                Create New Design
              </Button>
            </Link>
          </div>
          
          {savedDesigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No designs saved yet</h3>
              <p className="text-slate-400 mb-6">Create your first AI-confusing design to get started!</p>
              <Link href="/design">
                <Button className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-mono cursor-pointer">
                  <Palette className="mr-2 h-4 w-4" />
                  Create Your First Design
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDesigns.map((design) => (
                <Card key={design.id} className="bg-slate-900/50 border-slate-700 text-slate-100">
                  <CardHeader>
                    <div 
                      className="aspect-square bg-slate-800 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden cursor-pointer hover:bg-slate-700 transition-colors group border border-slate-600"
                      onClick={() => openZoomModal(design)}
                    >
                      <DesignPreview design={design} size="md" />
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="text-xs bg-slate-700/90 text-slate-100 border-slate-500">
                          {design.clothingType === 'shirt' ? 'T-Shirt' : 'Hoodie'}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700/90 rounded-full p-2">
                          <svg className="w-6 h-6 text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-slate-100">{design.name}</CardTitle>
                    <CardDescription className="text-slate-300">{design.description}</CardDescription>
                    <div className="text-xs text-slate-400">
                      Created: {new Date(design.createdAt).toLocaleDateString()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-3">
                      <Badge className={getPrivacyLevelColor(design)}>
                        {getPrivacyLevelText(design)}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteClick(design)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/30 border-red-500/50 bg-slate-800/50 hover:border-red-400 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/design?load=${design.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer"
                        onClick={() => testDesign(design)}
                        disabled={testingDesign === design.id}
                      >
                        <TestTube className="h-4 w-4 mr-1" />
                        {testingDesign === design.id ? 'Testing...' : 'Test'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openOrderModal(design)}
                        className="flex-1 border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer"
                      >
                        <ShoppingBag className="h-4 w-4 mr-1" />
                        Order
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                      {design.elements.length} element{design.elements.length !== 1 ? 's' : ''}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-slate-300 mb-2">{savedDesigns.length}</div>
              <div className="text-slate-400">Designs Created</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                {savedDesigns.filter(design => design.testResults?.success).length}
              </div>
              <div className="text-slate-400">Tested & Ready</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {savedDesigns.reduce((total, design) => total + design.elements.length, 0)}
              </div>
              <div className="text-slate-400">Total Elements</div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-slate-100">
          <DialogHeader>
            <div className="mx-auto mb-4">
              <div className="w-16 h-16 bg-red-900/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <DialogTitle className="text-xl font-semibold text-center text-slate-100">
              Delete Design?
            </DialogTitle>
            <DialogDescription className="text-center text-slate-300">
              Are you sure you want to delete <strong className="text-slate-100">"{designToDelete?.name}"</strong>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-300">
                  <p className="font-medium mb-1">This will permanently delete:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Design name: {designToDelete?.name}</li>
                    <li>Description: {designToDelete?.description}</li>
                    <li>Elements: {designToDelete?.elements.length} design element{designToDelete?.elements.length !== 1 ? 's' : ''}</li>
                    <li>Created: {designToDelete ? new Date(designToDelete.createdAt).toLocaleDateString() : ''}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="justify-center space-x-3">
            <Button 
              variant="outline" 
              onClick={cancelDelete}
              className="px-6 border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-6 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Design
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Design Zoom Modal */}
      {selectedDesign && (
        <DesignZoomModal
          design={selectedDesign}
          isOpen={showZoomModal}
          onClose={closeZoomModal}
        />
      )}

      {/* Order Modal */}
      {designToOrder && (
        <OrderModal
          design={designToOrder}
          isOpen={showOrderModal}
          onClose={closeOrderModal}
        />
      )}

      {/* Cart Drawer - will be controlled by CartButton */}
    </div>
  );
}
