'use client';
import { useStore } from '@/store/store';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Star } from 'lucide-react';
import { motion } from "framer-motion";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
}

export function ProductCard({ id, name, price }: ProductCardProps) {
  const { addToCart } = useStore();

  const handleAddToCart = () => {
    addToCart(id);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{name}</h3>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className="text-2xl font-bold text-blue-600">${price}</p>
          <Button 
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}