"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const trackingSchema = z.object({
  orderId: z.string().uuid("Invalid order ID format"),
});

type TrackingFormData = z.infer<typeof trackingSchema>;

interface OrderDetails {
  id: string;
  buyer_name: string;
  buyer_contact: string;
  delivery_address: string;
  items: Record<string, number>;
  status: string;
  createdAt: string;
}

export default function TrackOrderPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackingFormData>({
    resolver: zodResolver(trackingSchema),
  });

  const onSubmit = async (data: TrackingFormData) => {
    try {
      setLoading(true);
      setError("");
      setOrder(null);

      const response = await fetch(`/api/orders/${data.orderId}`);
      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to find order");
        return;
      }

      setOrder(result);
    } catch (err) {
      setError("Failed to track order");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Your Order</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Order ID
          </label>
          <input
            type="text"
            {...register("orderId")}
            placeholder="Enter your order ID"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
          {errors.orderId && (
            <p className="mt-1 text-sm text-red-600">{errors.orderId.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Tracking..." : "Track Order"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
      )}

      {order && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Order Details
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {order.buyer_name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Contact</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {order.buyer_contact}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Delivery Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {order.delivery_address}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Order Items
                </h4>
                <div className="space-y-2">
                  {Object.entries(order.items).map(([productId, quantity]) => (
                    <div
                      key={productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">Product ID: {productId}</span>
                      <span className="text-gray-900">
                        Quantity: {String(quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
