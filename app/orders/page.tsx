'use client';
import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  items: any[];
}

export default function OrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/orders/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setOrders(data.orders);
          setLoading(false);
        });
    }
  }, [user]);

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

  if (!orders.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to create your first order!</p>
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg
              hover:bg-blue-700 transition-colors group"
          >
            Browse Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
          My Orders
        </h1>

        <div className="space-y-6">
          <AnimatePresence>
            {orders.map(order => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          <Package className="w-5 h-5 text-blue-500" />
                          Order #{order.id}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <Badge
                          variant={
                            order.status === 'delivered' ? 'success' :
                            order.status === 'pending' ? 'warning' : 'secondary'
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">${order.total}</p>
                        <p className="text-sm text-gray-600">{order.items.length} items</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
