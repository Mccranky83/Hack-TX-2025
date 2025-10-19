'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { CustomDesignCartItem } from '@/contexts/CartContext';
import DesignPreview from '@/components/DesignPreview';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    // Close the cart drawer first
    onClose();
    // Navigate to checkout page using Next.js router
    router.push('/checkout');
  };

  const isCustomDesignItem = (item: any): item is CustomDesignCartItem => {
    return 'design' in item;
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-screen w-full max-w-md bg-slate-900 border-l border-slate-700 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-semibold text-slate-100">Shopping Cart</h2>
            {state.itemCount > 0 && (
              <Badge className="bg-emerald-400 text-slate-950">
                {state.itemCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col flex-1 min-h-0">
          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">Your cart is empty</h3>
              <p className="text-slate-400">Add some designs to get started!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {state.items.map((item) => (
                  <div key={item.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex space-x-3">
                      {/* Item Image */}
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

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-100 truncate">
                          {isCustomDesignItem(item) ? item.design.name : item.product.name}
                        </h4>
                        <p className="text-sm text-slate-400">
                          {isCustomDesignItem(item) ? 
                            `${item.selectedSize} • ${item.selectedColor}` : 
                            `${item.selectedSize} • ${item.selectedColor}`
                          }
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0 border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-600"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm text-slate-100 w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0 border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-600"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-slate-100">
                              ${(isCustomDesignItem(item) ? item.price : item.product.price) * item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.id)}
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-700 p-4 space-y-3 flex-shrink-0">
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-100">Total</span>
                  <span className="text-xl font-bold text-emerald-400">
                    ${state.total.toFixed(2)}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-600"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
