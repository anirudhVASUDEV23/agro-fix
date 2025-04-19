import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// PUT route stays the same
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, price } = await req.json();

    if (!name && !price) {
      return NextResponse.json(
        { message: "At least one field is required to update" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: { name, price },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Error updating product" },
      { status: 500 }
    );
  }
}

// DELETE route with Clerk integration
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();

  // console.log(user); // Log the user object to check its propertie

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Get user from your database using Clerk's user ID
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  console.log(dbUser)

  if (dbUser?.role !== "admin") {
    return NextResponse.json({ message: "Access denied" }, { status: 403 });
  }

  try {
    const product = await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Error deleting product" },
      { status: 500 }
    );
  }
}
