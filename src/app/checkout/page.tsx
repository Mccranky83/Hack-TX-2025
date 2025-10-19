'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Lock, CheckCircle, User, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { CustomDesignCartItem } from '@/contexts/CartContext';
import DesignPreview from '@/components/DesignPreview';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [savePaymentInfo, setSavePaymentInfo] = useState(false);
  
  // Payment form state
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States'
  });

  // Presaved payment methods
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([
    {
      id: '1',
      name: 'John Doe',
      last4: '4242',
      expiry: '12/25',
      type: 'Visa',
      email: 'john.doe@example.com',
      address: '123 Main St, New York, NY 10001'
    },
    {
      id: '2', 
      name: 'Jane Smith',
      last4: '5555',
      expiry: '08/26',
      type: 'Mastercard',
      email: 'jane.smith@example.com',
      address: '456 Oak Ave, Los Angeles, CA 90210'
    }
  ]);

  const isCustomDesignItem = (item: any): item is CustomDesignCartItem => {
    return 'design' in item;
  };

  const handlePaymentClick = () => {
    setShowPaymentForm(true);
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    const method = savedPaymentMethods.find(m => m.id === methodId);
    if (method) {
      // Pre-fill form with saved payment method
      setPaymentInfo({
        cardNumber: `**** **** **** ${method.last4}`,
        expiryDate: method.expiry,
        cvv: '',
        cardholderName: method.name,
        email: method.email,
        address: method.address.split(', ')[0],
        city: method.address.split(', ')[1],
        zipCode: method.address.split(', ')[2].split(' ')[1],
        country: 'United States'
      });
    }
  };

  const handleUseNewPayment = () => {
    setSelectedPaymentMethod('');
    setPaymentInfo({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
      country: 'United States'
    });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate Stripe payment processing
    try {
      // In a real implementation, you would:
      // 1. Validate payment information
      // 2. Create a Stripe payment intent
      // 3. Process the payment
      // 4. Handle success/failure
      
      // For now, simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-mono">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-100 mb-4">Order Complete!</h1>
            <p className="text-xl text-slate-300 mb-8">
              Thank you for your order. Your custom designs are being processed.
            </p>
            <div className="space-y-4">
              <Link href="/dashboard">
                <Button className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold">
                  Back to Dashboard
                </Button>
              </Link>
              <p className="text-sm text-slate-400 mt-6">
                You will receive an email confirmation shortly.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-mono">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-slate-100 mb-4">Your cart is empty</h1>
            <p className="text-xl text-slate-300 mb-8">
              Add some designs to your cart before checking out.
            </p>
            <Link href="/dashboard">
              <Button className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-100 mb-8">Checkout</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
                <CardHeader>
                  <CardTitle className="text-slate-100">Order Summary</CardTitle>
                  <CardDescription className="text-slate-300">
                    Review your items before checkout
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <div className="flex space-x-3">
                        <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          {isCustomDesignItem(item) ? (
                            <DesignPreview design={item.design} size="sm" />
                          ) : (
                            <img 
                              src={item.product.image} 
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-100 truncate">
                            {isCustomDesignItem(item) ? item.design.name : item.product.name}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {item.selectedSize} • {item.selectedColor}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-slate-300">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-sm font-medium text-slate-100">
                              ${(isCustomDesignItem(item) ? item.price : item.product.price) * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Payment Section */}
            <div>
              <Card className="bg-slate-900/50 border-slate-700 text-slate-100">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Secure checkout powered by Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Total */}
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-300">
                        <span>Subtotal</span>
                        <span>${state.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Tax</span>
                        <span>${(state.total * 0.08).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-slate-600 pt-2">
                        <div className="flex justify-between text-lg font-semibold text-slate-100">
                          <span>Total</span>
                          <span>${(state.total * 1.08).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <Lock className="h-4 w-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  {/* Payment Button or Form */}
                  {!showPaymentForm ? (
                    <Button
                      onClick={handlePaymentClick}
                      className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold h-12 cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Enter Payment Information</span>
                      </div>
                    </Button>
                  ) : (
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      {/* Saved Payment Methods */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-slate-300 flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Choose Payment Method
                        </h4>
                        
                        {/* Saved Methods */}
                        <div className="space-y-2">
                          {savedPaymentMethods.map((method) => (
                            <div
                              key={method.id}
                              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                selectedPaymentMethod === method.id
                                  ? 'border-emerald-400 bg-emerald-400/10'
                                  : 'border-slate-600 bg-slate-800/50 hover:bg-slate-700/50'
                              }`}
                              onClick={() => handlePaymentMethodSelect(method.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center">
                                    <CreditCard className="h-4 w-4 text-slate-300" />
                                  </div>
                                  <div>
                                    <div className="text-slate-100 font-medium">
                                      {method.type} •••• {method.last4}
                                    </div>
                                    <div className="text-sm text-slate-400">
                                      {method.name} • Expires {method.expiry}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-slate-400">
                                  {method.email}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Use New Payment Method */}
                          <div
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedPaymentMethod === ''
                                ? 'border-emerald-400 bg-emerald-400/10'
                                : 'border-slate-600 bg-slate-800/50 hover:bg-slate-700/50'
                            }`}
                            onClick={handleUseNewPayment}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center">
                                <CreditCard className="h-4 w-4 text-slate-300" />
                              </div>
                              <div>
                                <div className="text-slate-100 font-medium">
                                  Use New Payment Method
                                </div>
                                <div className="text-sm text-slate-400">
                                  Enter new card information
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Information Form */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-slate-300 flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Card Information
                        </h4>
                        
                        <div>
                          <Label htmlFor="cardNumber" className="text-slate-300 mb-2 block">Card Number</Label>
                          <Input
                            id="cardNumber"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            className="bg-slate-800 border-slate-600 text-slate-100"
                            disabled={selectedPaymentMethod !== ''}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate" className="text-slate-300 mb-2 block">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              type="text"
                              placeholder="MM/YY"
                              value={paymentInfo.expiryDate}
                              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                              className="bg-slate-800 border-slate-600 text-slate-100"
                              disabled={selectedPaymentMethod !== ''}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv" className="text-slate-300 mb-2 block">CVV</Label>
                            <Input
                              id="cvv"
                              type="text"
                              placeholder="123"
                              value={paymentInfo.cvv}
                              onChange={(e) => handleInputChange('cvv', e.target.value)}
                              className="bg-slate-800 border-slate-600 text-slate-100"
                              disabled={selectedPaymentMethod !== ''}
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="cardholderName" className="text-slate-300 mb-2 block">Cardholder Name</Label>
                          <Input
                            id="cardholderName"
                            type="text"
                            placeholder="John Doe"
                            value={paymentInfo.cardholderName}
                            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                            className="bg-slate-800 border-slate-600 text-slate-100"
                            disabled={selectedPaymentMethod !== ''}
                            required
                          />
                        </div>
                      </div>

                      {/* Billing Information */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-slate-300 flex items-center">
                          <MapPin className="mr-2 h-4 w-4" />
                          Billing Information
                        </h4>
                        
                        <div>
                          <Label htmlFor="email" className="text-slate-300 mb-2 block">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={paymentInfo.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="bg-slate-800 border-slate-600 text-slate-100"
                            disabled={selectedPaymentMethod !== ''}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="address" className="text-slate-300 mb-2 block">Address</Label>
                          <Input
                            id="address"
                            type="text"
                            placeholder="123 Main St"
                            value={paymentInfo.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="bg-slate-800 border-slate-600 text-slate-100"
                            disabled={selectedPaymentMethod !== ''}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city" className="text-slate-300 mb-2 block">City</Label>
                            <Input
                              id="city"
                              type="text"
                              placeholder="New York"
                              value={paymentInfo.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              className="bg-slate-800 border-slate-600 text-slate-100"
                              disabled={selectedPaymentMethod !== ''}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="zipCode" className="text-slate-300 mb-2 block">ZIP Code</Label>
                            <Input
                              id="zipCode"
                              type="text"
                              placeholder="10001"
                              value={paymentInfo.zipCode}
                              onChange={(e) => handleInputChange('zipCode', e.target.value)}
                              className="bg-slate-800 border-slate-600 text-slate-100"
                              disabled={selectedPaymentMethod !== ''}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Save Payment Information */}
                      {selectedPaymentMethod === '' && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="savePayment"
                            checked={savePaymentInfo}
                            onChange={(e) => setSavePaymentInfo(e.target.checked)}
                            className="w-4 h-4 text-emerald-400 bg-slate-800 border-slate-600 rounded focus:ring-emerald-400 focus:ring-2"
                          />
                          <Label htmlFor="savePayment" className="text-sm text-slate-300">
                            Save this payment method for future purchases
                          </Label>
                        </div>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold h-12 cursor-pointer"
                      >
                        {isProcessing ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>Processing Payment...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Lock className="h-5 w-5" />
                            <span>Pay ${(state.total * 1.08).toFixed(2)}</span>
                          </div>
                        )}
                      </Button>
                    </form>
                  )}

                  {/* Payment Methods */}
                  <div className="text-center">
                    <p className="text-sm text-slate-400 mb-2">We accept</p>
                    <div className="flex justify-center space-x-4 text-xs text-slate-500">
                      <span>Visa</span>
                      <span>Mastercard</span>
                      <span>American Express</span>
                      <span>PayPal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
