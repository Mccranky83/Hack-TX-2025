'use client';

import { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, Mail, Lock } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock sign-in - in real app this would call your auth API
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard after login
      window.location.href = '/dashboard';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors mb-8">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl font-bold text-slate-100">Undetectable</span>
          </div>
          <p className="text-slate-400">Sign in to your account</p>
        </div>

        {/* Sign In Form */}
        <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-slate-100">Welcome Back</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Sign in to access your AI-confusing dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-mono"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <Link href="/signup" className="text-emerald-400 hover:text-emerald-300">
                  Sign up
                </Link>
              </p>
            </div>

          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            By signing in, you agree to our{' '}
            <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">
              Privacy Policy
            </Link>
            {' '}and{' '}
            <Link href="/terms" className="text-emerald-400 hover:text-emerald-300">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
