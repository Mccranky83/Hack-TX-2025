'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ShoppingBag, TestTube, Palette, Zap, Terminal, Code, Shield } from "lucide-react";

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

  // Split the text to highlight "Invisible"
  const renderText = () => {
    const parts = displayedText.split('Invisible');
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}
          <span className="text-emerald-400">Invisible</span>
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

// Professional Image carousel component with controls
function ImageCarousel() {
  const images = [
    { src: "/picture1.png", alt: "AI-Confusing Pattern 1" },
    { src: "/picture2.png", alt: "AI-Confusing Pattern 2" },
    { src: "/picture3.png", alt: "AI-Confusing Pattern 3" },
    { src: "/picture4.png", alt: "AI-Confusing Pattern 4" }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length, isAutoPlaying]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Just the image - NO OVERLAYS */}
      <div className="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            width={192}
            height={192}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            priority={index === 0}
            unoptimized
          />
        ))}
      </div>
      
      {/* Status info - BELOW the image */}
      <div className="text-center">
        <div className="text-sm text-slate-400 font-mono mb-2">
          Pattern {currentIndex + 1} of {images.length}
        </div>
        <div className="text-xs text-emerald-400 font-mono">
          {isAutoPlaying ? '● Auto-advancing' : '● Manual control'}
        </div>
      </div>
      
      {/* Controls - BELOW everything */}
      <div className="flex flex-col items-center space-y-4">
        {/* Navigation controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={goToPrevious}
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-emerald-400 rounded-full flex items-center justify-center text-slate-300 hover:text-emerald-400 transition-all shadow-lg cursor-pointer"
          >
            ←
          </button>
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-emerald-400 rounded-full flex items-center justify-center text-slate-300 hover:text-emerald-400 transition-all shadow-lg cursor-pointer"
          >
            {isAutoPlaying ? '⏸' : '▶'}
          </button>
          <button
            onClick={goToNext}
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-emerald-400 rounded-full flex items-center justify-center text-slate-300 hover:text-emerald-400 transition-all shadow-lg cursor-pointer"
          >
            →
          </button>
        </div>
        
        {/* Dot indicators */}
        <div className="flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all shadow-lg ${
                index === currentIndex 
                  ? 'bg-emerald-400 scale-125 shadow-emerald-400/50' 
                  : 'bg-slate-600 hover:bg-slate-500 hover:scale-110'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Terminal className="h-6 w-6 text-emerald-400" />
              <span className="text-xl font-bold text-slate-100">Undetectable</span>
            </div>
            <div className="hidden md:block text-sm text-slate-500 font-mono">
              v2.1.0-alpha
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/signin">
              <Button variant="outline" className="text-slate-300 border-slate-600 hover:bg-slate-800 hover:text-slate-100 hover:border-slate-500 font-mono text-sm bg-slate-900/50 cursor-pointer">
                <Code className="mr-2 h-4 w-4" />
                Access System
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          {/* Professional status indicator */}
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300 font-mono">System Online</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-6">
            <TypingAnimation text="Be Invisible to AI" className="text-slate-100" />
          </h1>
          
          {/* Image Carousel */}
          <div className="flex justify-center mb-8">
            <ImageCarousel />
          </div>
          
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <div className="text-emerald-400 text-sm font-mono mb-2">$ ./undetectable --status</div>
            <div className="text-slate-300 text-sm font-mono">✓ Anti-surveillance patterns loaded</div>
            <div className="text-slate-300 text-sm font-mono">✓ AI confusion algorithms active</div>
            <div className="text-slate-300 text-sm font-mono">✓ Stealth mode ready</div>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Revolutionary clothing patterns that confuse computer vision algorithms. 
            Make yourself invisible to AI surveillance through strategic design.
          </p>
          
          <div className="flex justify-center">
            <Link href="/signin">
              <Button size="lg" className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-8 py-4 text-lg font-mono border-2 border-emerald-400 shadow-lg hover:shadow-emerald-400/25 transition-all cursor-pointer">
                <Shield className="mr-2 h-5 w-5" />
                Initialize Stealth Mode
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-slate-900/50 border-slate-700 text-slate-100 hover:border-emerald-400/50 transition-all">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Eye className="h-8 w-8 text-emerald-400" />
                <div className="text-emerald-400 text-xs font-mono bg-slate-800 px-2 py-1 rounded">ACTIVE</div>
              </div>
              <CardTitle className="text-slate-100 text-xl">AI-Confusing Patterns</CardTitle>
              <CardDescription className="text-slate-400 leading-relaxed">
                Strategic patterns designed to confuse computer vision algorithms and make you invisible to AI detection
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 text-slate-100 hover:border-emerald-400/50 transition-all">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Palette className="h-8 w-8 text-emerald-400" />
                <div className="text-emerald-400 text-xs font-mono bg-slate-800 px-2 py-1 rounded">BETA</div>
              </div>
              <CardTitle className="text-slate-100 text-xl">Custom Designs</CardTitle>
              <CardDescription className="text-slate-400 leading-relaxed">
                Create your own personal patterns or choose from our library of proven AI-confusing designs
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 text-slate-100 hover:border-emerald-400/50 transition-all">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Shield className="h-8 w-8 text-emerald-400" />
                <div className="text-emerald-400 text-xs font-mono bg-slate-800 px-2 py-1 rounded">PROVEN</div>
              </div>
              <CardTitle className="text-slate-100 text-xl">Proven Technology</CardTitle>
              <CardDescription className="text-slate-400 leading-relaxed">
                Tested patterns that effectively disrupt YOLO, R-CNN, and other computer vision systems
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 mb-6">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-slate-300 font-mono">System Process</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-100 mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-slate-900 border-2 border-slate-700 group-hover:border-emerald-400 rounded-xl w-20 h-20 flex items-center justify-center mx-auto mb-6 transition-all">
                <span className="text-2xl font-bold text-emerald-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Choose Your Pattern</h3>
              <p className="text-slate-400 leading-relaxed">Select from proven AI-confusing patterns or create your own design</p>
            </div>
            <div className="text-center group">
              <div className="bg-slate-900 border-2 border-slate-700 group-hover:border-emerald-400 rounded-xl w-20 h-20 flex items-center justify-center mx-auto mb-6 transition-all">
                <span className="text-2xl font-bold text-emerald-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Test Effectiveness</h3>
              <p className="text-slate-400 leading-relaxed">Use our detection tool to verify your pattern confuses AI algorithms</p>
            </div>
            <div className="text-center group">
              <div className="bg-slate-900 border-2 border-slate-700 group-hover:border-emerald-400 rounded-xl w-20 h-20 flex items-center justify-center mx-auto mb-6 transition-all">
                <span className="text-2xl font-bold text-emerald-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Stay Invisible</h3>
              <p className="text-slate-400 leading-relaxed">Wear your custom pattern and remain undetected by AI surveillance</p>
            </div>
          </div>
        </div>

        {/* The Surveillance Reality */}
        <div className="mb-16">
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 mb-6 mx-auto w-fit">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300 font-mono">Threat Analysis</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-100 text-center mb-8">The AI Surveillance Reality</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-900/50 border-slate-700 text-slate-100 hover:border-red-400/50 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 bg-red-400/20 rounded-lg flex items-center justify-center">
                    <Eye className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="text-red-400 text-xs font-mono bg-slate-800 px-2 py-1 rounded">CRITICAL</div>
                </div>
                <CardTitle className="text-slate-100 text-xl">Every Face is a Data Point</CardTitle>
                <CardDescription className="text-slate-400">AI systems track, analyze, and profile you 24/7</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">Every camera you pass feeds your biometric data to AI systems that build detailed profiles of your movements, emotions, and behavior. Your face is being harvested for corporate and government databases without your consent.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 text-slate-100 hover:border-red-400/50 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 bg-red-400/20 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="text-red-400 text-xs font-mono bg-slate-800 px-2 py-1 rounded">WARNING</div>
                </div>
                <CardTitle className="text-slate-100 text-xl">Predictive Policing & Social Control</CardTitle>
                <CardDescription className="text-slate-400">AI determines your "risk level" before you commit any crime</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">AI surveillance systems are already predicting "criminal behavior" based on facial expressions, gait analysis, and social connections. Your freedom of movement is being algorithmically restricted before you even act.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 text-slate-100 hover:border-red-400/50 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 bg-red-400/20 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="text-red-400 text-xs font-mono bg-slate-800 px-2 py-1 rounded">ACTIVE</div>
                </div>
                <CardTitle className="text-slate-100 text-xl">Corporate Behavior Modification</CardTitle>
                <CardDescription className="text-slate-400">Your emotions and reactions are being manipulated in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">Retail AI systems analyze your facial expressions to manipulate your purchasing decisions. Your emotional state is being weaponized against you to extract maximum profit from your vulnerability.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-slate-900 border border-slate-700 rounded-2xl p-12">
          <div className="inline-flex items-center space-x-2 bg-slate-800 border border-slate-600 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300 font-mono">Resistance Protocol</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-100 mb-4">Fight Back Against AI Surveillance</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">Join the resistance. Take back your autonomy from algorithmic control and corporate surveillance. Your face, your choice.</p>
           <div className="flex justify-center">
             <Link href="/signin">
               <Button size="lg" className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-8 py-4 font-mono border-2 border-emerald-400 shadow-lg hover:shadow-emerald-400/25 transition-all cursor-pointer">
                 <Shield className="mr-2 h-5 w-5" />
                 Join Resistance
               </Button>
             </Link>
           </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-slate-800">
        <div className="text-center text-slate-400">
           <p>&copy; 2025 Undetectable. Confusing AI through strategic pattern design.</p>
           <div className="text-sm mt-2 font-mono text-slate-500">v2.1.0-alpha | System Status: Online</div>
        </div>
      </footer>
    </div>
  );
}