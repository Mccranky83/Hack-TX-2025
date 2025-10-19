import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, ShoppingBag, TestTube } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">PrivacyWear</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/signin">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Hide from <span className="text-purple-400">AI</span> with Style
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Revolutionary clothing that makes you invisible to computer vision detection. 
            Stay private while staying fashionable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/test">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
                <TestTube className="mr-2 h-5 w-5" />
                Test Your Privacy
              </Button>
            </Link>
            <Link href="/shop">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Collection
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-slate-800/50 border-slate-700 text-white">
            <CardHeader>
              <Eye className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle>Anti-Detection Technology</CardTitle>
              <CardDescription>
                Advanced patterns and materials designed to confuse YOLO and other computer vision algorithms
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 text-white">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle>Privacy by Design</CardTitle>
              <CardDescription>
                Built with privacy-first principles. Your data stays yours, and you stay invisible to surveillance
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 text-white">
            <CardHeader>
              <ShoppingBag className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle>Fashion Forward</CardTitle>
              <CardDescription>
                Stylish designs that don't compromise on aesthetics. Look good while staying private
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Choose Your Style</h3>
              <p className="text-gray-300">Browse our collection of privacy-focused clothing</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Test Your Privacy</h3>
              <p className="text-gray-300">Use our detection tool to verify your invisibility</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Stay Protected</h3>
              <p className="text-gray-300">Wear with confidence knowing you're protected from AI surveillance</p>
            </div>
          </div>
        </div>

        {/* Privacy Levels */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-8">Privacy Levels</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700 text-white">
              <CardHeader>
                <Badge className="w-fit bg-green-600">Basic</Badge>
                <CardTitle>Stealth Mode</CardTitle>
                <CardDescription>60-70% detection avoidance</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Perfect for everyday wear with subtle anti-detection patterns</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 text-white">
              <CardHeader>
                <Badge className="w-fit bg-yellow-600">Enhanced</Badge>
                <CardTitle>Ghost Mode</CardTitle>
                <CardDescription>80-85% detection avoidance</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Advanced pattern disruption for better protection</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 text-white">
              <CardHeader>
                <Badge className="w-fit bg-red-600">Maximum</Badge>
                <CardTitle>Invisible Mode</CardTitle>
                <CardDescription>90-95% detection avoidance</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Cutting-edge technology for maximum invisibility</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-slate-800/30 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Take Control of Your Privacy?</h2>
          <p className="text-gray-300 mb-8">Join thousands of privacy-conscious individuals who choose style and security</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/test">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4">
                Test Your Privacy Now
              </Button>
            </Link>
            <Link href="/shop">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4">
                Shop Collection
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-slate-700">
        <div className="text-center text-gray-400">
          <p>&copy; 2025 PrivacyWear. Protecting your privacy through fashion.</p>
        </div>
      </footer>
    </div>
  );
}