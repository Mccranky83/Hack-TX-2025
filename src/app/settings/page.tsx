'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LogOut, User, Bell, Shield, Palette, TestTube } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, this would clear authentication tokens, etc.
    // For now, just redirect to the marketing page
    router.push('/');
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
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-gray-900">Undetectable</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Settings
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Account Settings */}
            <Card className="bg-gray-50 border-gray-200 text-gray-900">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900">demo@undetectable.com</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member since</span>
                  <span className="text-gray-900">January 2025</span>
                </div>
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-gray-50 border-gray-200 text-gray-900">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Control your notification preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email notifications</span>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Design updates</span>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order updates</span>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="bg-gray-50 border-gray-200 text-gray-900">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Privacy</CardTitle>
                    <CardDescription>Control your privacy and data</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Data collection</span>
                  <Button variant="outline" size="sm">Minimal</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Design sharing</span>
                  <Button variant="outline" size="sm">Private</Button>
                </div>
                <Button variant="outline" className="w-full">
                  Privacy Policy
                </Button>
              </CardContent>
            </Card>

            {/* Design Preferences */}
            <Card className="bg-gray-50 border-gray-200 text-gray-900">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Design Preferences</CardTitle>
                    <CardDescription>Customize your design experience</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Default clothing</span>
                  <Button variant="outline" size="sm">T-Shirt</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pattern preference</span>
                  <Button variant="outline" size="sm">Celestial</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Auto-save designs</span>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logout Section */}
          <Card className="mt-8 bg-red-50 border-red-200 text-gray-900">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-red-900">Sign Out</CardTitle>
                  <CardDescription>Sign out of your account and return to the marketing page</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                You'll be redirected to the main page and will need to sign in again to access your dashboard.
              </p>
              <Button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
