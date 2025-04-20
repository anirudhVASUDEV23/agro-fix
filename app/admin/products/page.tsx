'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, Package, DollarSign, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  price: number;
}

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      });
  }, []);

  const handleEdit = async (product: Product, newPrice: number) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, price: newPrice }),
      });

      if (res.ok) {
        setProducts(products.map(p => 
          p.id === product.id ? { ...p, price: newPrice } : p
        ));
        setEditingProduct(null);
      }
    } catch (error) {
      console.error('Failed to update product');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete product');
    }
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
          Manage Products
        </h1>

        <div className="grid gap-6">
          <AnimatePresence>
            {products.map(product => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h2>
                      <p className="text-gray-600 flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {product.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <label className="text-sm font-medium">Price</label>
                              <Input
                                type="number"
                                defaultValue={product.price}
                                onChange={(e) => {
                                  const newPrice = parseFloat(e.target.value);
                                  if (!isNaN(newPrice)) {
                                    handleEdit(product, newPrice);
                                  }
                                }}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <AlertCircle className="w-5 h-5 text-red-500" />
                              Confirm Deletion
                            </DialogTitle>
                          </DialogHeader>
                          <p className="py-4">Are you sure you want to delete this product?</p>
                          <div className="flex justify-end gap-3">
                            <Button variant="outline">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(product.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
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