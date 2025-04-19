'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/store/store';
import { useUser } from '@clerk/nextjs';
import ProductCard from '@/components/ProductCard';

export default function Products() {
  const { products, setProducts } = useStore();
  const { user } = useUser();
  const [cart, setCart] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.products));
  }, []);

  const handleAddToCart = (productId: string) => {
    setCart([...cart, productId]);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== productId));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            isAdmin={user?.publicMetadata?.role === 'admin'}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
