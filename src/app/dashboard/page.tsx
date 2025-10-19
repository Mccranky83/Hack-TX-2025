'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Palette, TestTube, ShoppingBag, Download, Upload, Settings } from "lucide-react";

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
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-slate-100">Undetectable</span>
          </div>
          <div className="flex items-center space-x-4">
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
            <TypingAnimation text="Your Undetectable Dashboard" className="text-4xl md:text-6xl font-bold text-slate-100" />
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Saved Design Cards */}
            <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
              <CardHeader>
                <div className="aspect-square bg-slate-800 rounded-lg mb-4 flex items-center justify-center border border-slate-600">
                  <span className="text-slate-400 text-sm">Design Preview</span>
                </div>
                <CardTitle className="text-slate-100">Celestial Stars</CardTitle>
                <CardDescription className="text-slate-300">Custom design with star patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge className="bg-emerald-400/20 text-emerald-400 border-emerald-400/30">Tested & Ready</Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">
                      <TestTube className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
              <CardHeader>
                <div className="aspect-square bg-slate-800 rounded-lg mb-4 flex items-center justify-center border border-slate-600">
                  <span className="text-slate-400 text-sm">Design Preview</span>
                </div>
                <CardTitle className="text-slate-100">Moon Phases</CardTitle>
                <CardDescription className="text-slate-300">Lunar pattern design</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">Needs Testing</Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">
                      <TestTube className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
              <CardHeader>
                <div className="aspect-square bg-slate-800 rounded-lg mb-4 flex items-center justify-center border border-slate-600">
                  <span className="text-slate-400 text-sm">Design Preview</span>
                </div>
                <CardTitle className="text-slate-100">Solar Eclipse</CardTitle>
                <CardDescription className="text-slate-300">Sun and moon combination</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge className="bg-emerald-400/20 text-emerald-400 border-emerald-400/30">Tested & Ready</Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">
                      <TestTube className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-slate-300 mb-2">5</div>
              <div className="text-slate-400">Designs Created</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">3</div>
              <div className="text-slate-400">Tested & Ready</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">2</div>
              <div className="text-slate-400">Orders Placed</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
