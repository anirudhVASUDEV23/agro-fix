import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      buyer_name, 
      buyer_contact, 
      delivery_address, 
      items,
      productIds 
    } = body;

    const order = await prisma.order.create({
      data: {
        buyer_name,
        buyer_contact,
        delivery_address,
        items,
        status: 'pending',
        userId: user.id,
        products: {
          connect: productIds.map((id: string) => ({ id }))
        }
      },
      include: {
        products: true
      }
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { message: 'Error creating order' },
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
