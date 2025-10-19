import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ShoppingBag, TestTube, Palette, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">Undetectable</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/signin">
              <Button variant="outline" className="text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Be Invisible to <span className="text-gray-700">AI</span>
          </h1>
          
          {/* Logo Image */}
          <div className="flex justify-center mb-8">
            <Image
              src="/picture1.png"
              alt="Undetectable Logo"
              width={200}
              height={200}
              className="object-contain"
              priority
            />
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolutionary clothing patterns that confuse computer vision algorithms. 
            Make yourself invisible to AI surveillance through strategic design.
          </p>
          <div className="flex justify-center">
            <Link href="/signin">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg">
                <Zap className="mr-2 h-5 w-5" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardHeader>
              <Eye className="h-12 w-12 text-gray-600 mb-4" />
              <CardTitle>AI-Confusing Patterns</CardTitle>
              <CardDescription className="text-gray-600">
                Strategic patterns designed to confuse computer vision algorithms and make you invisible to AI detection
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardHeader>
              <Palette className="h-12 w-12 text-gray-600 mb-4" />
              <CardTitle>Custom Designs</CardTitle>
              <CardDescription className="text-gray-600">
                Create your own personal patterns or choose from our library of proven AI-confusing designs
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardHeader>
              <Zap className="h-12 w-12 text-gray-600 mb-4" />
              <CardTitle>Proven Technology</CardTitle>
              <CardDescription className="text-gray-600">
                Tested patterns that effectively disrupt YOLO, R-CNN, and other computer vision systems
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Pattern</h3>
              <p className="text-gray-600">Select from proven AI-confusing patterns or create your own design</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Test Effectiveness</h3>
              <p className="text-gray-600">Use our detection tool to verify your pattern confuses AI algorithms</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Stay Invisible</h3>
              <p className="text-gray-600">Wear your custom pattern and remain undetected by AI surveillance</p>
            </div>
          </div>
        </div>

        {/* The Surveillance Reality */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">The AI Surveillance Reality</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-50 border-gray-200 text-gray-900">
              <CardHeader>
                <CardTitle>Every Face is a Data Point</CardTitle>
                <CardDescription>AI systems track, analyze, and profile you 24/7</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Every camera you pass feeds your biometric data to AI systems that build detailed profiles of your movements, emotions, and behavior. Your face is being harvested for corporate and government databases without your consent.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200 text-gray-900">
              <CardHeader>
                <CardTitle>Predictive Policing & Social Control</CardTitle>
                <CardDescription>AI determines your "risk level" before you commit any crime</CardDescription>
              </CardHeader>
              <CardContent>
                <p>AI surveillance systems are already predicting "criminal behavior" based on facial expressions, gait analysis, and social connections. Your freedom of movement is being algorithmically restricted before you even act.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200 text-gray-900">
              <CardHeader>
                <CardTitle>Corporate Behavior Modification</CardTitle>
                <CardDescription>Your emotions and reactions are being manipulated in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Retail AI systems analyze your facial expressions to manipulate your purchasing decisions. Your emotional state is being weaponized against you to extract maximum profit from your vulnerability.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-100 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Fight Back Against AI Surveillance</h2>
          <p className="text-gray-600 mb-8">Join the resistance. Take back your autonomy from algorithmic control and corporate surveillance. Your face, your choice.</p>
           <div className="flex justify-center">
             <Link href="/signin">
               <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4">
                 Get Started
               </Button>
             </Link>
           </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200">
        <div className="text-center text-gray-500">
           <p>&copy; 2025 Undetectable. Confusing AI through strategic pattern design.</p>
        </div>
      </footer>
    </div>
  );
}