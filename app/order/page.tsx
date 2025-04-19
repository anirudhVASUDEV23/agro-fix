"use client"; // Make sure the file is client-side only if you're using Next.js 13

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; // Import the necessary hooks
import { useUser } from "@clerk/nextjs"; // Assuming you are using Clerk for authentication

// Define your form data structure
type OrderFormData = {
  userId: string;
  buyerName: string;
  buyerContact: string;
  deliveryAddress: string;
  items: { id: string; name: string; price: number }[];
};

const PlaceOrderForm = () => {
  const { register, handleSubmit, getValues, setValue } =
    useForm<OrderFormData>();
  const { user } = useUser(); // Assuming Clerk provides user info

  const [products, setProducts] = useState<any[]>([]); // Store product data
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]); // Store selected products
  const [loading, setLoading] = useState<boolean>(false); // To track loading state
  const [orderMessage, setOrderMessage] = useState<string>(""); // To store success or error message

  // Fetch the product catalogue on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle form submission
  const onSubmit = async (data: OrderFormData) => {
    setLoading(true); // Set loading to true when request is being made
    setOrderMessage(""); // Clear any previous messages

    // Get the selected items from the form values
    const items = selectedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
    }));

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          buyerName: data.buyerName,
          buyerContact: data.buyerContact,
          deliveryAddress: data.deliveryAddress,
          items,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const result = await response.json();
      setOrderMessage("Order placed successfully!"); // Show success message
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderMessage("Error placing order. Please try again later."); // Show error message
    } finally {
      setLoading(false); // Set loading to false after request is completed
    }
  };

  // Handle checkbox change (selecting products)
  const handleCheckboxChange = (product: any, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, product]);
    } else {
      setSelectedProducts((prev) =>
        prev.filter((item) => item.id !== product.id)
      );
    }
  };

  return (
    <div>
      <h2>Place Order</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="buyerName">Name:</label>
          <input
            id="buyerName"
            type="text"
            {...register("buyerName", { required: "Name is required" })}
          />
        </div>

        <div>
          <label htmlFor="buyerContact">Contact:</label>
          <input
            id="buyerContact"
            type="text"
            {...register("buyerContact", { required: "Contact is required" })}
          />
        </div>

        <div>
          <label htmlFor="deliveryAddress">Delivery Address:</label>
          <input
            id="deliveryAddress"
            type="text"
            {...register("deliveryAddress", {
              required: "Address is required",
            })}
          />
        </div>

        <div>
          <h3>Select Products</h3>
          {products.map((product) => (
            <div key={product.id}>
              <input
                type="checkbox"
                id={`product-${product.id}`}
                onChange={(e) =>
                  handleCheckboxChange(product, e.target.checked)
                }
              />
              <label htmlFor={`product-${product.id}`}>
                {product.name} - ${product.price}
              </label>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
      {orderMessage && <p>{orderMessage}</p>}{" "}
      {/* Display success or error message */}
    </div>
  );
};

export default PlaceOrderForm;
