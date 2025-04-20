'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/store/store';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Link 
        href="/products"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 flex items-center justify-center"
                >
                  <Package className="w-32 h-32 text-blue-500" />
                </motion.div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">5.0 (250 reviews)</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${(product.price * 1.2).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      In Stock
                    </span>
                    <span>•</span>
                    <span>Free Shipping</span>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={added}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 transition-all duration-200 
                      transform hover:scale-105 group"
                  >
                    {added ? (
                      <motion.span
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="flex items-center"
                      >
                        Added to Cart ✓
                      </motion.span>
                    ) : (
                      <span className="flex items-center">
                        <ShoppingCart className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                        Add to Cart
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}