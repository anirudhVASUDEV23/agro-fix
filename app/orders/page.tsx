'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    // Fetch only the current user's orders
    fetch(`/api/orders/user/${user.id}`)
      .then(res => res.json())
      .then(data => setOrders(data.orders));
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Order #{order.id}</h3>
                <p className="text-gray-600">Status: {order.status}</p>
                <p className="text-gray-600">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => router.push(`/orders/${order.id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
