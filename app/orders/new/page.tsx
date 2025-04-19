'use client';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/store';

export default function NewOrder() {
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerContact: '',
    deliveryAddress: '',
    items: [] as { id: string; quantity: number }[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { cart, clearCart } = useStore();
      const orderItems = cart.map(item => ({
        id: item.productId,
        quantity: item.quantity
      }));

      // Add to form data
      const orderData = {
        ...formData,
        userId: user?.id,
        items: orderItems
      };
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user?.id
        }),
      });

      if (res.ok) {
        router.push('/orders');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Place New Order</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.buyerName}
            onChange={e => setFormData({...formData, buyerName: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block mb-2">Contact</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.buyerContact}
            onChange={e => setFormData({...formData, buyerContact: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block mb-2">Delivery Address</label>
          <textarea
            className="w-full border rounded p-2"
            value={formData.deliveryAddress}
            onChange={e => setFormData({...formData, deliveryAddress: e.target.value})}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
