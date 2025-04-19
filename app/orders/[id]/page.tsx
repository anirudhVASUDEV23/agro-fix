'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function OrderDetails({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    fetch(`/api/orders/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data.order);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching order:', error);
        setLoading(false);
      });
  }, [params.id, user]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      <div className="border rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold">Order Status</h2>
            <p className="text-lg">{order.status}</p>
          </div>
          <div>
            <h2 className="font-semibold">Order Date</h2>
            <p className="text-lg">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <h2 className="font-semibold">Delivery Address</h2>
            <p className="text-lg">{order.delivery_address}</p>
          </div>
          <div>
            <h2 className="font-semibold">Contact</h2>
            <p className="text-lg">{order.buyer_contact}</p>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="font-semibold mb-4">Order Items</h2>
          <div className="space-y-2">
            {order.products.map((product: any) => (
              <div key={product.id} className="flex justify-between items-center">
                <span>{product.name}</span>
                <span>${product.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}