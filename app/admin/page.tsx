'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/store/store';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const { orders, setOrders } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.publicMetadata?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders);
        setLoading(false);
      });
  }, [user]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const updatedOrders = orders.map(order =>
          order.id === orderId ? { ...order, status } : order
        );
        setOrders(updatedOrders);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                <p>Customer: {order.buyer_name}</p>
                <p>Status: {order.status}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                className="border rounded p-2"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}