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
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-gray-900">Undetectable</span>
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
            Your <span className="text-red-600">AI-Confusing</span> Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create, test, and manage your personal AI-confusing patterns
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/design">
            <Card className="bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer">
              <CardHeader>
                <Palette className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Create Pattern</CardTitle>
                <CardDescription>
                  Design your own AI-confusing pattern or choose from templates
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/test">
            <Card className="bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer">
              <CardHeader>
                <TestTube className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Test Detection</CardTitle>
                <CardDescription>
                  Upload an image to test how well your pattern confuses AI
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/shop">
            <Card className="bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer">
              <CardHeader>
                <ShoppingBag className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Order Clothing</CardTitle>
                <CardDescription>
                  Get your custom pattern printed on shirts, hoodies, and more
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* My Patterns Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">My Patterns</h2>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Palette className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Pattern Cards */}
            <Card className="bg-gray-50 border-gray-200 text-gray-900">
              <CardHeader>
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Pattern Preview</span>
                </div>
                <CardTitle>Geometric Disruptor</CardTitle>
                <CardDescription>Basic pattern - 65% AI confusion rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge className="bg-green-600">Basic</Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <TestTube className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200 text-gray-900">
              <CardHeader>
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Pattern Preview</span>
                </div>
                <CardTitle>Noise Generator</CardTitle>
                <CardDescription>Advanced pattern - 82% AI confusion rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge className="bg-yellow-600">Advanced</Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <TestTube className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200 text-gray-900">
              <CardHeader>
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Pattern Preview</span>
                </div>
                <CardTitle>AI Breaker</CardTitle>
                <CardDescription>Maximum pattern - 94% AI confusion rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge className="bg-red-600">Maximum</Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <TestTube className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Tests */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Tests</h2>
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Geometric Disruptor Test</h3>
                    <p className="text-sm text-gray-600">Uploaded 2 hours ago</p>
                  </div>
                  <Badge className="bg-green-600">PASSED - 15% detected</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Noise Generator Test</h3>
                    <p className="text-sm text-gray-600">Uploaded 1 day ago</p>
                  </div>
                  <Badge className="bg-green-600">PASSED - 8% detected</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Basic Pattern Test</h3>
                    <p className="text-sm text-gray-600">Uploaded 3 days ago</p>
                  </div>
                  <Badge className="bg-yellow-600">PARTIAL - 35% detected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">12</div>
              <div className="text-gray-600">Patterns Created</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">8</div>
              <div className="text-gray-600">Successful Tests</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 border-gray-200 text-gray-900">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-gray-600">Orders Placed</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
