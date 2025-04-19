'use client';

import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be greater than zero"),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });


  useEffect(() => {
    if (user) {
      fetch("/api/getme")
        .then((res) => res.json())
        .then((data) => {
          console.log(data.user)
          if (data.user.role === "admin") {
            setIsAdmin(true);
          } else if(data.user.role==="buyer") {
            setIsAdmin(false);
          }
          else{
            setMessage("Something went wrong!");
          }
        });
    }
  }, [user]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage(result.message || "Error adding product");
      } else {
        setMessage("Product added successfully!");
        reset();
      }
    } catch (error) {
      setMessage("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  if (isAdmin) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/admin/orders" 
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Manage Orders</h2>
            <p className="text-gray-600">View and update all orders</p>
          </Link>
          
          <Link href="/admin/products" 
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
            <p className="text-gray-600">Add, edit or remove products</p>
          </Link>

          <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Admin Controls</h2>
            <p className="text-gray-600">Email: {user.emailAddresses[0].emailAddress}</p>
            <p className="text-gray-600">Role: Administrator</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Quick Stats</h2>
            <p className="text-gray-600">Monitor sales and inventory</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Product Name</label>
              <input
                {...register("name")}
                type="text"
                className="w-full mt-1 p-2 border rounded"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                {...register("price", { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full mt-1 p-2 border rounded"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>

            {message && (
              <p
                className={`mt-3 ${
                  message.includes("success") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.firstName}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/products" 
          className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Browse Products</h2>
          <p className="text-gray-600">View our latest products and make purchases</p>
        </Link>
        
        <Link href="/orders" 
          className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">My Orders</h2>
          <p className="text-gray-600">Track and manage your orders</p>
        </Link>

        <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Account Details</h2>
          <p className="text-gray-600">Email: {user.emailAddresses[0].emailAddress}</p>
          <p className="text-gray-600">Role: Buyer</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
          <p className="text-gray-600">Contact our support team for assistance</p>
          <a href="mailto:support@example.com" 
            className="text-blue-500 hover:text-blue-600 mt-2 inline-block">
            support@example.com
          </a>
        </div>
      </div>
    </div>
  );
}