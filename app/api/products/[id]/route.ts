import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch product details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Error fetching product' },
      { status: 500 }
    );
  }
}

// PUT - Update product price
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { price } = await request.json();

    if (!price) {
      return NextResponse.json(
        { message: 'Price is required' },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: params.id,
      },
      data: {
        price,
      },
    });

    return NextResponse.json({ updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Error updating product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'Error deleting product' },
      { status: 500 }
    );
  }
}
