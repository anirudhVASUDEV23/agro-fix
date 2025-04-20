'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Package, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetails() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = Array.isArray(params.id) ? params.id[0] : params.id;
    
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data.order);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching order:', error);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Package className="w-8 h-8 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Order not found</h2>
          <Link 
            href="/orders"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link 
        href="/orders"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Order #{order.id}</span>
            <Badge variant={
              order.status === 'delivered' ? 'success' :
              order.status === 'pending' ? 'warning' : 'secondary'
            }>
              {order.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Delivery Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Name: {order.buyer_name}</p>
              <p>Contact: {order.buyer_contact}</p>
              <p>Address: {order.delivery_address}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 font-bold">
            <span>Total</span>
            <span>${order.items.reduce((sum: number, item: any) => 
              sum + (item.price * item.quantity), 0).toFixed(2)}</span>
          </div>

          <div className="text-sm text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}