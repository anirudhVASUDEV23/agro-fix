import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, buyerName, buyerContact, deliveryAddress, items } =
      await req.json();

    if (!userId || !buyerName || !buyerContact || !deliveryAddress || !items) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new order and link it to the user and products
    const order = await prisma.order.create({
      data: {
        buyer_name: buyerName,
        buyer_contact: buyerContact,
        delivery_address: deliveryAddress,
        items,
        status: "pending", // Default status for a new order
        userId,
        products: {
          connect: items.map((item: { id: string }) => ({ id: item.id })), // Connect the products
        },
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { message: "Error placing order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, products: true }, // Include user and product details
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
}
