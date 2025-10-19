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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-slate-100">Undetectable</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-100 mb-8">
            Settings
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Account Settings */}
            <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-400/20 rounded-full flex items-center justify-center border-2 border-emerald-400">
                    <User className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-100">Account</CardTitle>
                    <CardDescription className="text-slate-300">Manage your account settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Email</span>
                  <span className="text-slate-100">demo@undetectable.com</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Member since</span>
                  <span className="text-slate-100">January 2025</span>
                </div>
                <Button variant="outline" className="w-full border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-400/20 rounded-full flex items-center justify-center border-2 border-emerald-400">
                    <Bell className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-100">Notifications</CardTitle>
                    <CardDescription className="text-slate-300">Control your notification preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Email notifications</span>
                  <Button variant="outline" size="sm" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">Enabled</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Design updates</span>
                  <Button variant="outline" size="sm" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">Enabled</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Order updates</span>
                  <Button variant="outline" size="sm" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">Enabled</Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-400/20 rounded-full flex items-center justify-center border-2 border-emerald-400">
                    <Shield className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-100">Privacy</CardTitle>
                    <CardDescription className="text-slate-300">Control your privacy and data</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Data collection</span>
                  <Button variant="outline" size="sm" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">Minimal</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Design sharing</span>
                  <Button variant="outline" size="sm" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">Private</Button>
                </div>
                <Button variant="outline" className="w-full border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">
                  Privacy Policy
                </Button>
              </CardContent>
            </Card>

            {/* Design Preferences */}
            <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-400/20 rounded-full flex items-center justify-center border-2 border-emerald-400">
                    <Palette className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-100">Design Preferences</CardTitle>
                    <CardDescription className="text-slate-300">Customize your design experience</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Default clothing</span>
                  <Button variant="outline" size="sm" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">T-Shirt</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Pattern preference</span>
                  <Button variant="outline" size="sm" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">Celestial</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Auto-save designs</span>
                  <Button variant="outline" size="sm" className="border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer">Enabled</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logout Section */}
          <Card className="mt-8 bg-red-900/20 border-red-700 text-slate-100">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500">
                  <LogOut className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-red-400">Sign Out</CardTitle>
                  <CardDescription className="text-slate-300">Sign out of your account and return to the marketing page</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-red-300 mb-4">
                You'll be redirected to the main page and will need to sign in again to access your dashboard.
              </p>
              <Button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
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
