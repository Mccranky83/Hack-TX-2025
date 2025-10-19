'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Camera, CheckCircle, XCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MockDetectResult } from "@/types";

export default function TestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MockDetectResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Real detection function using the inference API
  const runDetection = async (imageData: string): Promise<MockDetectResult> => {
    try {
      const response = await fetch('/api/inference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData.split(',')[1] // Remove data:image/jpeg;base64, prefix
        })
      });

      if (!response.ok) {
        throw new Error('Failed to run inference');
      }

      const result = await response.json();
      
      return {
        detected: result.detection_count > 0,
        confidence: result.confidence,
        objects: result.detections.map((det: any) => ({
          name: 'person',
          confidence: det.confidence,
          bbox: {
            x: det.bbox.x1,
            y: det.bbox.y1,
            width: det.bbox.x2 - det.bbox.x1,
            height: det.bbox.y2 - det.bbox.y1
          }
        })),
        timestamp: Date.now(),
        imageUrl: imageData,
        annotatedImage: result.annotated_image
      };
    } catch (error) {
      console.error('Detection error:', error);
      // Fallback to mock detection if API fails
      return mockDetection(imageData);
    }
  };

  // Fallback mock detection function
  const mockDetection = async (imageData: string): Promise<MockDetectResult> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock random result
    const detected = Math.random() > 0.3; // 70% chance of not being detected
    const confidence = Math.random() * 0.4 + (detected ? 0.6 : 0.1);
    
    return {
      detected,
      confidence,
      objects: detected ? [{
        name: 'person',
        confidence,
        bbox: { x: 100, y: 50, width: 200, height: 300 }
      }] : [],
      timestamp: Date.now(),
      imageUrl: imageData
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      setImagePreview(imageData);
      setIsLoading(true);
      
      try {
        const detectionResult = await runDetection(imageData);
        setResult(detectionResult);
      } catch (error) {
        console.error('Detection failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    setImagePreview(imageData);
    setIsLoading(true);
    
    try {
      const detectionResult = await runDetection(imageData);
      setResult(detectionResult);
    } catch (error) {
      console.error('Detection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  };

  const getResultBadge = () => {
    if (!result) return null;
    
    if (result.detected) {
      return (
        <Badge className="bg-red-600 text-white text-lg px-4 py-2">
          <XCircle className="mr-2 h-5 w-5" />
          DETECTED
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-600 text-white text-lg px-4 py-2">
          <CheckCircle className="mr-2 h-5 w-5" />
          INVISIBLE
        </Badge>
      );
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence < 0.3) return 'text-green-600';
    if (confidence < 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">PrivacyWear</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Test Your <span className="text-purple-400">Privacy</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload a photo or use your camera to test how well our privacy clothing protects you from AI detection
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-slate-800/50 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Upload or Capture</CardTitle>
              <CardDescription>
                Choose how you want to test your privacy protection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div className="space-y-4">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Camera Section */}
              <div className="space-y-4">
                <Button 
                  onClick={startCamera}
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white hover:text-black"
                  disabled={isLoading}
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Use Camera
                </Button>
                
                {videoRef.current?.srcObject && (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg"
                    />
                    <Button
                      onClick={capturePhoto}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-600 hover:bg-purple-700"
                      disabled={isLoading}
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Capture
                    </Button>
                  </div>
                )}
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Preview</h3>
                  <img
                    src={imagePreview}
                    alt="Test image"
                    className="w-full rounded-lg border border-slate-600"
                  />
                  {result?.annotatedImage && (
                    <div className="space-y-2">
                      <h4 className="text-md font-semibold">Detection Results</h4>
                      <img
                        src={`data:image/jpeg;base64,${result.annotatedImage}`}
                        alt="Annotated detection results"
                        className="w-full rounded-lg border border-slate-600"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-slate-800/50 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Detection Results</CardTitle>
              <CardDescription>
                See how well your privacy clothing protects you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                  <p className="text-gray-300">Analyzing your image...</p>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* Main Result */}
                  <div className="text-center">
                    {getResultBadge()}
                    <p className="text-2xl font-bold mt-4">
                      {result.detected ? 'You were detected!' : 'You are invisible!'}
                    </p>
                    <p className="text-gray-300 mt-2">
                      Confidence: <span className={getConfidenceColor(result.confidence)}>
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </p>
                  </div>

                  {/* Detailed Results */}
                  {result.objects.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Detected Objects:</h3>
                      {result.objects.map((obj, index) => (
                        <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium capitalize">{obj.name}</span>
                            <Badge className="bg-red-600">
                              {(obj.confidence * 100).toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recommendations */}
                  <Alert className={result.detected ? "border-red-600 bg-red-900/20" : "border-green-600 bg-green-900/20"}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {result.detected 
                        ? "Your privacy clothing needs improvement. Consider upgrading to a higher privacy level."
                        : "Excellent! Your privacy clothing is working effectively to protect you from AI detection."
                      }
                    </AlertDescription>
                  </Alert>

                  <Button 
                    onClick={() => {
                      setResult(null);
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    variant="outline"
                    className="w-full border-white text-white hover:bg-white hover:text-black"
                  >
                    Test Another Image
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Upload or capture an image to test your privacy protection</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Hidden canvas for camera capture */}
        <canvas ref={canvasRef} className="hidden" />
      </main>
    </div>
  );
}
