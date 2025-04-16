// app/api/webhooks/user/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id, email_addresses, first_name } = body;

    const email = email_addresses?.[0]?.email_address;

    if (!id || !email) {
      return NextResponse.json(
        { message: "Missing user ID or email" },
        { status: 400 }
      );
    }

    // Upsert user in DB
    await prisma.user.upsert({
      where: { clerkUserId: id },
      update: { email, name: first_name },
      create: {
        clerkUserId: id,
        email,
        name: first_name,
      },
    });

    return NextResponse.json({ message: "User synced" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { message: "Error processing webhook" },
      { status: 500 }
    );
  }
}
