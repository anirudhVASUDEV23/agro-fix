import { NextResponse } from 'next/server';
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma';

// PUT route to update an order status
export async function PUT(
  request: Request,
  { params }: { params: { id: string } } // Ensure correct typing for params
) {
  try {
    const user = await currentUser(); // Await the promise
    if (!user || !user.id) { // Check if the user or user.id is not found
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    const order = await prisma.order.update({
      where: {
        id: params.id, // Using the dynamic 'id' from the URL
      },
      data: {
        status,
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { message: 'Error updating order status' },
      { status: 500 }
    );
  }
}

// GET route to fetch order details
export async function GET(
  request: Request,
  { params }: { params: { id: string } } // Ensure correct typing for params
) {
  try {
    const user = await currentUser(); // Await the promise
    if (!user || !user.id) { // Check if the user or user.id is not found
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: params.id, // Using the dynamic 'id' from the URL
      },
      include: {
        items: true, // Include related items if applicable
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { message: 'Error fetching order' },
      { status: 500 }
    );
  }
}
