'use client';
import { useStore } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function CartView({ onClose }: { onClose?: () => void }) {
  const { cart, removeFromCart } = useStore();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    Promise.all(
      cart.map(item =>
        fetch(`/api/products/${item.productId}`)
          .then(res => res.json())
          .then(data => ({
            ...data.product,
            quantity: item.quantity
          }))
      )
    ).then(setCartItems);
  }, [cart]);

  if (cart.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
          <h3 className="text-lg font-semibold">Your cart is empty</h3>
          <p className="text-gray-500">Add items to get started</p>
          <Button 
            onClick={() => router.push('/products')}
            className="mt-2 hover:scale-105 transition-transform"
          >
            Browse Products
          </Button>
        </div>
      </Card>
    );
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
      <AnimatePresence>
        {cartItems.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b py-3"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between font-bold mb-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Button
          onClick={() => router.push('/checkout')}
          className="w-full bg-blue-500 hover:bg-blue-600 transition-colors group"
        >
          Checkout
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  );
}