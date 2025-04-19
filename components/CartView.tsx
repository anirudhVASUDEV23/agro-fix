'use client';
import { useStore } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartView() {
  const { cart, removeFromCart } = useStore();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    // Fetch product details for cart items
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

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center gap-4">
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => router.push('/orders/new')}
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}