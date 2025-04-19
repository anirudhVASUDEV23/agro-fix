"use server"
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function GET(req: Request) {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, price } = await req.json();

    if (!name || !price) {
      return NextResponse.json(
        { message: "Missing required fields: name or price" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: { name, price },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { message: "Error adding product" },
      { status: 500 }
    );
  }
}
