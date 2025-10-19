'use client';

import { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Wifi, WifiOff, Play, Square, AlertTriangle } from "lucide-react";

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

  // Split the text to highlight "Detection"
  const renderText = () => {
    const parts = displayedText.split('Detection');
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}
          <span className="text-emerald-400">Detection</span>
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

interface Detection {
  confidence: number;
  bbox: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

interface InferenceData {
  detections: Detection[];
  confidence: number;
  fps: number;
}

interface WebSocketMessage {
  type: 'connection' | 'frame' | 'inference';
  data?: any;
  message?: string;
  timestamp: number;
}

export default function DemoPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [inferenceData, setInferenceData] = useState<InferenceData | null>(null);
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [detectionHistory, setDetectionHistory] = useState<string[]>([]);
  const [lastDetectionCount, setLastDetectionCount] = useState<number>(-1);
  const wsRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLImageElement>(null);

  // WebSocket connection management
  const connectToStream = async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      const ws = new WebSocket('ws://localhost:8080/ws');
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log('Connected to WebRTC server');
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);
      };
      
      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Failed to connect to live stream server');
        setIsConnecting(false);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionError('Failed to connect to live stream server');
      setIsConnecting(false);
    }
  };

  const disconnectFromStream = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setInferenceData(null);
    setCurrentFrame(null);
  };

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'connection':
        console.log('Connection message:', message.message);
        break;
        
      case 'inference':
        setInferenceData(message.data);
        // Only add to detection history when detection count changes significantly
        const detectionCount = message.data.detections.length;
        if (detectionCount !== lastDetectionCount) {
          const now = new Date();
          const timeString = now.toLocaleTimeString();
          const detectionText = detectionCount === 0 ? "No people detected" : 
                               detectionCount === 1 ? "1 person detected" : 
                               `${detectionCount} people detected`;
          const historyEntry = `${timeString}: ${detectionText}`;
          setDetectionHistory(prev => [...prev.slice(-9), historyEntry]); // Keep last 10
          setLastDetectionCount(detectionCount);
        }
        break;
        
      case 'frame':
        if (message.data?.frame) {
          setCurrentFrame(`data:image/jpeg;base64,${message.data.frame}`);
        }
        break;
    }
  };

  const resetDemo = () => {
    setDetectionHistory([]);
    setLastDetectionCount(-1);
    if (isConnected) {
      disconnectFromStream();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-slate-100">Undetectable</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-100 mb-4">
            <TypingAnimation text="Live Detection Demo" className="text-4xl md:text-6xl font-bold text-slate-100" />
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            See computer vision in action. Test how well your clothing patterns confuse AI detection systems.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Live Stream Feed */}
          <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-100">Live Stream Feed</CardTitle>
              <CardDescription className="text-slate-300">
                Real-time video stream with AI detection overlay
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Connection Status */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800 mb-4">
                <div className="flex items-center space-x-3">
                  {isConnected ? (
                    <Wifi className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-red-400" />
                  )}
                  <span className={isConnected ? "text-emerald-400" : "text-red-400"}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-600">
                  {currentFrame ? (
                    <img
                      ref={videoRef}
                      src={currentFrame}
                      alt="Live stream"
                      className="w-full h-full object-cover"
                    />
                  ) : isConnected ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-2"></div>
                        <p className="text-slate-400">Waiting for video stream...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <WifiOff className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-400">Connect to start live stream</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Detection Overlay */}
                {isConnected && inferenceData && (
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        inferenceData.detections.length > 0 ? 'bg-red-500' : 'bg-green-500'
                      }`}></div>
                      <span className="text-sm font-mono">
                        {inferenceData.detections.length > 0 ? 'AI Detection Active' : 'No Detection'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Detection Count Badge */}
                {isConnected && inferenceData && inferenceData.detections.length > 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-red-600 text-white">
                      {inferenceData.detections.length} Detection{inferenceData.detections.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Connection Controls */}
              <div className="mt-6 flex justify-center space-x-4">
                {!isConnected ? (
                  <Button 
                    onClick={connectToStream} 
                    className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-mono cursor-pointer"
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-950 mr-2"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Connect to Stream
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={disconnectFromStream} 
                    variant="outline" 
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-slate-100 bg-red-900/20 cursor-pointer"
                  >
                    <Square className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                )}
                <Button 
                  onClick={resetDemo} 
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-100 bg-slate-800 cursor-pointer"
                >
                  Reset
                </Button>
              </div>

              {/* Error Display */}
              {connectionError && (
                <Alert className="mt-4 border-red-600 bg-red-900/20">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    {connectionError}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Detection Results */}
          <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-100">Live Detection Results</CardTitle>
              <CardDescription className="text-slate-300">
                Real-time AI detection output from the live stream
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current Detection Status */}
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-100">Current Status:</span>
                    <Badge className={isConnected ? "bg-emerald-400/20 text-emerald-400 border-emerald-400/30" : "bg-slate-600/20 text-slate-400 border-slate-600/30"}>
                      {isConnected ? "Live" : "Disconnected"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300">
                    {isConnected 
                      ? "Receiving real-time detection data from the live stream"
                      : "Connect to live stream to see real-time results"
                    }
                  </p>
                </div>

                {/* Performance Metrics */}
                {inferenceData && (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-600">
                      <div className="text-2xl font-bold text-emerald-400">
                        {(inferenceData.confidence * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-300">Detection Confidence</div>
                    </div>
                  </div>
                )}

                {/* Current Detection Status */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-100">Current Status:</h3>
                  
                  {inferenceData ? (
                    <div className="space-y-4">
                      {/* Main Status Indicator */}
                      <div className={`rounded-lg p-6 text-center ${
                        inferenceData.detections.length === 0 
                          ? 'bg-emerald-400/20 border-2 border-emerald-400' 
                          : inferenceData.detections.length === 1 
                          ? 'bg-yellow-400/20 border-2 border-yellow-400'
                          : 'bg-red-400/20 border-2 border-red-400'
                      }`}>
                        <div className="text-4xl mb-2">
                          {inferenceData.detections.length === 0 ? '✅' : 
                           inferenceData.detections.length === 1 ? '⚠️' : '❌'}
                        </div>
                        <div className="text-xl font-bold mb-1 text-slate-100">
                          {inferenceData.detections.length === 0 ? 'INVISIBLE' : 
                           inferenceData.detections.length === 1 ? 'PARTIALLY DETECTED' : 'FULLY DETECTED'}
                        </div>
                        <div className="text-sm text-slate-300">
                          {inferenceData.detections.length === 0 ? 'Your privacy clothing is working perfectly!' : 
                           inferenceData.detections.length === 1 ? 'AI is having trouble identifying you clearly' : 
                           'AI can clearly see and identify you'}
                        </div>
                      </div>

                      {/* Confidence Meter */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-slate-300">
                          <span>Detection Confidence</span>
                          <span className="font-mono text-slate-100">{(inferenceData.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-300 ${
                              inferenceData.confidence < 0.3 ? 'bg-emerald-400' :
                              inferenceData.confidence < 0.7 ? 'bg-yellow-400' : 'bg-red-400'
                            }`}
                            style={{ width: `${inferenceData.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Recent Changes Indicator */}
                      {detectionHistory.length > 0 && (
                        <div className="bg-slate-800 rounded-lg p-4">
                          <div className="text-sm font-medium text-slate-200 mb-2">Recent Change:</div>
                          <div className="text-sm text-slate-300">
                            {detectionHistory[detectionHistory.length - 1]}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <div className="text-4xl mb-2">📡</div>
                      <p>Connect to live stream to see detection status</p>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-300 mb-2">How to Test:</h4>
                  <ol className="text-sm text-blue-200 space-y-1">
                    <li>1. Connect to the live stream</li>
                    <li>2. Put on your AI-confusing clothing</li>
                    <li>3. Watch the real-time detection results</li>
                    <li>4. Look for "No people detected" for success</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}
