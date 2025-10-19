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

export default function DashboardPage() {
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [designToDelete, setDesignToDelete] = useState<SavedDesign | null>(null);
  
  // Zoom modal state
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null);

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

  // Get privacy level badge color
  const getPrivacyLevelColor = (testResults?: { success: boolean; score: number }) => {
    if (!testResults) return 'bg-gray-600';
    if (testResults.success) return 'bg-green-600';
    if (testResults.score >= 70) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  // Get privacy level text
  const getPrivacyLevelText = (testResults?: { success: boolean; score: number }) => {
    if (!testResults) return 'Not Tested';
    if (testResults.success) return 'Tested & Ready';
    if (testResults.score >= 70) return 'Needs Work';
    return 'Poor Score';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">Undetectable</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/settings">
              <Button variant="outline" className="text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white">
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
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Your <span className="text-gray-700">Undetectable</span> Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your patterns and create custom AI-confusing designs
          </p>
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Test/Demo Your Shirt */}
          <Link href="/demo">
            <Card className="bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer h-full">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TestTube className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl">Test/Demo Your Shirt</CardTitle>
                <CardDescription className="text-lg">
                  See computer vision in action with live camera detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    Live camera feed with real-time detection
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    See detection results: "1 person detected", "2 people detected"
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    Test your existing clothing patterns
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Custom Designs */}
          <Link href="/design">
            <Card className="bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer h-full">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl">Custom Designs</CardTitle>
                <CardDescription className="text-lg">
                  Create your own AI-confusing patterns with celestial elements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    Drag & drop design elements (stars, moons, suns, circles)
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    Test your design for undetection effectiveness
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
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
            <h2 className="text-3xl font-bold text-gray-900">Saved Designs</h2>
            <Link href="/design">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                <Palette className="mr-2 h-4 w-4" />
                Create New Design
              </Button>
            </Link>
          </div>
          
          {savedDesigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No designs saved yet</h3>
              <p className="text-gray-500 mb-6">Create your first AI-confusing design to get started!</p>
              <Link href="/design">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Palette className="mr-2 h-4 w-4" />
                  Create Your First Design
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDesigns.map((design) => (
                <Card key={design.id} className="bg-gray-50 border-gray-200 text-gray-900">
                  <CardHeader>
                    <div 
                      className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors group"
                      onClick={() => openZoomModal(design)}
                    >
                      <DesignPreview design={design} size="md" />
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="text-xs bg-white/90">
                          {design.clothingType === 'shirt' ? 'T-Shirt' : 'Hoodie'}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{design.name}</CardTitle>
                    <CardDescription>{design.description}</CardDescription>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(design.createdAt).toLocaleDateString()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-3">
                      <Badge className={getPrivacyLevelColor(design.testResults)}>
                        {getPrivacyLevelText(design.testResults)}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteClick(design)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/design?load=${design.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="flex-1">
                        <TestTube className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <ShoppingBag className="h-4 w-4 mr-1" />
                        Order
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
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
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">{savedDesigns.length}</div>
              <div className="text-gray-600">Designs Created</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {savedDesigns.filter(design => design.testResults?.success).length}
              </div>
              <div className="text-gray-600">Tested & Ready</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {savedDesigns.reduce((total, design) => total + design.elements.length, 0)}
              </div>
              <div className="text-gray-600">Total Elements</div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <DialogTitle className="text-xl font-semibold text-center">
              Delete Design?
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Are you sure you want to delete <strong>"{designToDelete?.name}"</strong>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
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
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-6"
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
    </div>
  );
}
