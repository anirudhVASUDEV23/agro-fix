'use client';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useStore } from '@/store/store';
import { useState } from 'react';
import CartView from './CartView';

export default function Navbar() {
  const { user } = useUser();
  const { cart } = useStore();
  const [showCart, setShowCart] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">E-Commerce</Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/products" className="hover:text-blue-500">Products</Link>
            {user && (
              <>
                <Link href="/orders" className="hover:text-blue-500">My Orders</Link>
                {user.publicMetadata.role === 'admin' && (
                  <Link href="/admin" className="hover:text-blue-500">Admin</Link>
                )}
                <button 
                  onClick={() => setShowCart(!showCart)}
                  className="relative hover:text-blue-500"
                >
                  Cart
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>
              </>
            )}
            {!user ? (
              <Link href="/sign-in" className="bg-blue-500 text-white px-4 py-2 rounded">
                Sign In
              </Link>
            ) : (
              <Link href="/sign-out" className="text-gray-600 hover:text-gray-800">
                Sign Out
              </Link>
            )}
          </div>
        </div>
        {showCart && (
          <div className="absolute right-4 top-16 w-96 z-50 bg-white shadow-xl rounded-lg">
            <CartView onClose={() => setShowCart(false)} />
          </div>
        )}
      </div>
    </nav>
  );
}
