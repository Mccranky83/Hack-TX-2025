'use client';

import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SavedDesign } from '@/types';
import { useCart } from '@/contexts/CartContext';
import DesignPreview from '@/components/DesignPreview';

interface OrderModalProps {
  design: SavedDesign;
  isOpen: boolean;
  onClose: () => void;
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = ['Black', 'White', 'Navy', 'Gray', 'Forest Green'];

export default function OrderModal({ design, isOpen, onClose }: OrderModalProps) {
  const { addToCart, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);

  // Pricing based on clothing type and privacy level
  const getPrice = () => {
    const basePrice = design.clothingType === 'shirt' ? 29.99 : 59.99;
    const privacyMultiplier = design.testResults?.success ? 1.2 : 1.0;
    return basePrice * privacyMultiplier;
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: `design-${design.id}-${selectedSize}-${selectedColor}`,
      design,
      quantity,
      selectedSize,
      selectedColor,
      price: getPrice(),
    };

    addToCart(cartItem);
    onClose();
    openCart();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-slate-100 max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div>
            <DialogTitle className="text-xl text-slate-100">{design.name}</DialogTitle>
            <DialogDescription className="text-slate-300">
              {design.clothingType === 'shirt' ? 'T-Shirt' : 'Hoodie'} • Custom Design
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto flex-1 min-h-0">
          {/* Design Preview */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Design Preview</h4>
            <div className="aspect-square bg-slate-700 rounded-lg flex items-center justify-center">
              <DesignPreview design={design} size="md" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-slate-400">
                {design.elements.length} element{design.elements.length !== 1 ? 's' : ''}
              </span>
              {design.testResults && (
                <Badge className={design.testResults.success ? 'bg-green-600' : 'bg-yellow-600'}>
                  {design.testResults.success ? 'Tested & Ready' : 'Needs Work'}
                </Badge>
              )}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Size</h4>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSize(size)}
                  className={
                    selectedSize === size
                      ? 'bg-emerald-400 text-slate-950'
                      : 'border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-600'
                  }
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Color</h4>
            <div className="grid grid-cols-3 gap-2">
              {colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedColor(color)}
                  className={
                    selectedColor === color
                      ? 'bg-emerald-400 text-slate-950'
                      : 'border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-600'
                  }
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Quantity</h4>
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-600"
              >
                -
              </Button>
              <span className="text-slate-100 w-8 text-center">{quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
                className="border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-600"
              >
                +
              </Button>
            </div>
          </div>

          {/* Price */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-slate-100">Total</span>
              <span className="text-2xl font-bold text-emerald-400">
                ${(getPrice() * quantity).toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              ${getPrice().toFixed(2)} × {quantity} item{quantity !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <DialogFooter className="space-x-3 flex-shrink-0 border-t border-slate-700 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddToCart}
            className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
