'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Palette, TestTube, ShoppingBag, Download, Upload, Settings } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">Undetectable</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Saved Design Cards */}
            <Card className="bg-gray-50 border-gray-200 text-gray-900">
              <CardHeader>
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Design Preview</span>
                </div>
                <CardTitle>Celestial Stars</CardTitle>
                <CardDescription>Custom design with star patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge className="bg-green-600">Tested & Ready</Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <TestTube className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200 text-gray-900">
              <CardHeader>
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Design Preview</span>
                </div>
                <CardTitle>Moon Phases</CardTitle>
                <CardDescription>Lunar pattern design</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge className="bg-yellow-600">Needs Testing</Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <TestTube className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200 text-gray-900">
              <CardHeader>
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Design Preview</span>
                </div>
                <CardTitle>Solar Eclipse</CardTitle>
                <CardDescription>Sun and moon combination</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge className="bg-green-600">Tested & Ready</Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <TestTube className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
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
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">5</div>
              <div className="text-gray-600">Designs Created</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">3</div>
              <div className="text-gray-600">Tested & Ready</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
              <div className="text-gray-600">Orders Placed</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
