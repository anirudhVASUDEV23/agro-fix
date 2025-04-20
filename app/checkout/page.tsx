'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Truck, Package } from 'lucide-react';
import { toast } from 'sonner';

interface OrderFormData {
  buyer_name: string;
  buyer_contact: string;
  delivery_address: string;
}

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [formData, setFormData] = useState<OrderFormData>({
    buyer_name: '',
    buyer_contact: '',
    delivery_address: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productPromises = cart.map(async (item) => {
          const res = await fetch(`/api/products/${item.productId}`);
          if (!res.ok) throw new Error(`Failed to fetch product ${item.productId}`);
          const data = await res.json();
          return { ...data.product, quantity: item.quantity };
        });

        const items = await Promise.all(productPromises);
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    if (cart.length > 0) {
      fetchProducts();
    } else {
      setCartItems([]);
    }
  }, [cart]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_name: formData.buyer_name,
          buyer_contact: formData.buyer_contact,
          delivery_address: formData.delivery_address,
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          productIds: cartItems.map(item => item.id)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/orders/${data.order.id}`);
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="fade-in">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
          Checkout
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Delivery Details Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    name="buyer_name"
                    value={formData.buyer_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Contact Number</label>
                  <Input
                    name="buyer_contact"
                    value={formData.buyer_contact}
                    onChange={handleInputChange}
                    placeholder="Enter your contact number"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Delivery Address</label>
                  <Input
                    name="delivery_address"
                    value={formData.delivery_address}
                    onChange={handleInputChange}
                    placeholder="Enter your delivery address"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Card remains the same */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-2 border-b"
                  >
                    <span>{item.name} x {item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleCheckout}
              disabled={loading || 
                cartItems.length === 0 || 
                !formData.buyer_name || 
                !formData.buyer_contact || 
                !formData.delivery_address}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200"
            >
              {loading ? (
                <span className="animate-spin inline-block">
                  <Package className="w-5 h-5" />
                </span>
              ) : (
                "Complete Order"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}