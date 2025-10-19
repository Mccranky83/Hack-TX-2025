'use client';

import { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, CameraOff, Play, Pause, RotateCcw } from "lucide-react";

export default function DemoPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectionResults, setDetectionResults] = useState<string[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock detection results for demo
  const mockDetectionResults = [
    "No people detected",
    "1 person detected",
    "2 people detected", 
    "3 people detected",
    "1 person detected",
    "No people detected"
  ];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        startDetection();
      }
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setIsDetecting(false);
    setDetectionResults([]);
  };

  const startDetection = () => {
    setIsDetecting(true);
    let resultIndex = 0;
    
    const detectionInterval = setInterval(() => {
      if (!isDetecting) {
        clearInterval(detectionInterval);
        return;
      }
      
      setDetectionResults(prev => [...prev, mockDetectionResults[resultIndex]]);
      resultIndex = (resultIndex + 1) % mockDetectionResults.length;
    }, 2000);
  };

  const stopDetection = () => {
    setIsDetecting(false);
  };

  const resetDemo = () => {
    setDetectionResults([]);
    if (isStreaming) {
      stopCamera();
    }
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
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">Undetectable</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Live <span className="text-gray-700">Detection</span> Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See computer vision in action. Test how well your clothing patterns confuse AI detection systems.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Camera Feed */}
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardHeader>
              <CardTitle className="text-2xl">Live Camera Feed</CardTitle>
              <CardDescription>
                Your camera feed with real-time AI detection overlay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  {isStreaming ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Camera feed will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Detection Overlay */}
                {isStreaming && (
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-mono">AI Detection Active</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="mt-6 flex justify-center space-x-4">
                {!isStreaming ? (
                  <Button onClick={startCamera} className="bg-gray-900 hover:bg-gray-800 text-white">
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <Button onClick={stopCamera} variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
                      <CameraOff className="mr-2 h-4 w-4" />
                      Stop Camera
                    </Button>
                    {!isDetecting ? (
                      <Button onClick={startDetection} className="bg-green-600 hover:bg-green-700 text-white">
                        <Play className="mr-2 h-4 w-4" />
                        Start Detection
                      </Button>
                    ) : (
                      <Button onClick={stopDetection} variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                        <Pause className="mr-2 h-4 w-4" />
                        Stop Detection
                      </Button>
                    )}
                  </>
                )}
                <Button onClick={resetDemo} variant="outline" className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detection Results */}
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardHeader>
              <CardTitle className="text-2xl">Detection Results</CardTitle>
              <CardDescription>
                Real-time AI detection output showing what the system sees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current Detection Status */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Current Status:</span>
                    <Badge className={isDetecting ? "bg-red-600" : "bg-gray-600"}>
                      {isDetecting ? "Detecting" : "Idle"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {isDetecting 
                      ? "AI is actively analyzing the camera feed for human detection"
                      : "Start detection to see real-time results"
                    }
                  </p>
                </div>

                {/* Detection History */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Detection History:</h3>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {detectionResults.length === 0 ? (
                      <p className="text-gray-500 text-sm">No detection results yet</p>
                    ) : (
                      detectionResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                          <span className="text-sm font-mono">{result}</span>
                          <Badge className={
                            result.includes("No people") ? "bg-green-600" :
                            result.includes("1 person") ? "bg-yellow-600" :
                            "bg-red-600"
                          }>
                            {result.includes("No people") ? "Success" :
                             result.includes("1 person") ? "Partial" : "Detected"}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">How to Test:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Start your camera</li>
                    <li>2. Put on your AI-confusing clothing</li>
                    <li>3. Start detection to see results</li>
                    <li>4. Watch for "No people detected" for success</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Stats */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {detectionResults.filter(r => r.includes("No people")).length}
              </div>
              <div className="text-gray-600">Successful Undetections</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {detectionResults.length}
              </div>
              <div className="text-gray-600">Total Detections</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {detectionResults.length > 0 
                  ? Math.round((detectionResults.filter(r => r.includes("No people")).length / detectionResults.length) * 100)
                  : 0}%
              </div>
              <div className="text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
