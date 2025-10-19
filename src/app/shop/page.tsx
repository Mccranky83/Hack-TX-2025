'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingBag, Search, Filter, ArrowLeft, Plus, Minus, Trash2, CreditCard } from "lucide-react";
import { Product, CartItem } from "@/types";
import { mockProducts } from "@/data/mockData";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPrivacyLevel, setSelectedPrivacyLevel] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('privacyWearCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('privacyWearCart', JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrivacyLevel = selectedPrivacyLevel === 'all' || product.privacyLevel === selectedPrivacyLevel;
    
    return matchesSearch && matchesCategory && matchesPrivacyLevel;
  });

  const addToCart = () => {
    if (!selectedProduct || !selectedSize || !selectedColor) return;

    const existingItem = cart.find(item => 
      item.productId === selectedProduct.id && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    );

    if (existingItem) {
      setCart(cart.map(item => 
        item === existingItem 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      const newItem: CartItem = {
        productId: selectedProduct.id,
        product: selectedProduct,
        quantity,
        selectedSize,
        selectedColor
      };
      setCart([...cart, newItem]);
    }

    setSelectedProduct(null);
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
  };

  const updateCartItem = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }
    
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
  };

  const removeFromCart = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getPrivacyLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-green-600';
      case 'enhanced': return 'bg-yellow-600';
      case 'maximum': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-white">PrivacyWear</span>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black relative">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Cart
                  {getCartItemCount() > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-purple-600 text-white">
                      {getCartItemCount()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-slate-800 border-slate-700 text-white">
                <SheetHeader>
                  <SheetTitle>Shopping Cart</SheetTitle>
                  <SheetDescription>
                    {cart.length === 0 ? 'Your cart is empty' : `${getCartItemCount()} items in your cart`}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No items in your cart</p>
                  ) : (
                    <>
                      {cart.map((item, index) => (
                        <Card key={index} className="bg-slate-700/50 border-slate-600">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">{item.product.name}</h3>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromCart(index)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-300 mb-2">
                              {item.selectedSize} • {item.selectedColor}
                            </p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCartItem(index, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCartItem(index, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="border-t border-slate-600 pt-4">
                        <div className="flex justify-between text-lg font-semibold mb-4">
                          <span>Total:</span>
                          <span>${getTotalPrice().toFixed(2)}</span>
                        </div>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Checkout
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Privacy <span className="text-purple-400">Collection</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose from our range of privacy-focused clothing designed to protect you from AI surveillance
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700 text-white mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="shirt">Shirts</option>
                  <option value="hoodie">Hoodies</option>
                  <option value="jacket">Jackets</option>
                </select>
              </div>

              <div>
                <Label htmlFor="privacy">Privacy Level</Label>
                <select
                  id="privacy"
                  value={selectedPrivacyLevel}
                  onChange={(e) => setSelectedPrivacyLevel(e.target.value)}
                  className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white"
                >
                  <option value="all">All Levels</option>
                  <option value="basic">Basic (60-70%)</option>
                  <option value="enhanced">Enhanced (80-85%)</option>
                  <option value="maximum">Maximum (90-95%)</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedPrivacyLevel('all');
                  }}
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white hover:text-black"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <div className="aspect-square bg-slate-700 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Product Image</span>
                </div>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge className={getPrivacyLevelColor(product.privacyLevel)}>
                    {product.privacyLevel}
                  </Badge>
                </div>
                <CardDescription className="text-gray-300">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-400">${product.price}</span>
                    {!product.inStock && (
                      <Badge variant="outline" className="border-red-600 text-red-400">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    <p>Sizes: {product.sizes.join(', ')}</p>
                    <p>Colors: {product.colors.join(', ')}</p>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={!product.inStock}
                        onClick={() => setSelectedProduct(product)}
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white">
                      <DialogHeader>
                        <DialogTitle>{product.name}</DialogTitle>
                        <DialogDescription>
                          {product.description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="size">Size</Label>
                          <select
                            id="size"
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white"
                          >
                            <option value="">Select Size</option>
                            {product.sizes.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <Label htmlFor="color">Color</Label>
                          <select
                            id="color"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white"
                          >
                            <option value="">Select Color</option>
                            {product.colors.map(color => (
                              <option key={color} value={color}>{color}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="quantity">Quantity</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setQuantity(quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <Button 
                          onClick={addToCart}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          disabled={!selectedSize || !selectedColor}
                        >
                          Add to Cart - ${(product.price * quantity).toFixed(2)}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No products found matching your criteria</p>
          </div>
        )}
      </main>
    </div>
  );
}
