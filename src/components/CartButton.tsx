'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from '@/components/CartDrawer';

interface CartButtonProps {
  className?: string;
}

export default function CartButton({ className }: CartButtonProps) {
  const { state, toggleCart, closeCart } = useCart();

  return (
    <>
      <Button
        variant="outline"
        onClick={toggleCart}
        className={`relative border-slate-500 text-slate-100 bg-slate-800/50 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-400 cursor-pointer ${className}`}
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        Cart
        {state.itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-emerald-400 text-slate-950 text-xs h-5 w-5 flex items-center justify-center p-0">
            {state.itemCount}
          </Badge>
        )}
      </Button>
      
      <CartDrawer
        isOpen={state.isOpen}
        onClose={closeCart}
      />
    </>
  );
}
