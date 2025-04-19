import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  console.log("Webhook received at /api/webhooks/user");

  try {
    const body = await req.json();
    console.log("Received webhook data:", body);

    const user = body.data; // Extract the actual user object from 'data'
    const { id, email_addresses, first_name } = user;
    const email = email_addresses?.[0]?.email_address;

    if (!id || !email) {
      console.log("Missing required fields: id or email");
      return NextResponse.json(
        { message: "Missing user ID or email" },
        { status: 400 }
      );
    }

    const role = email === "admin@example.com" ? "admin" : "buyer"; // Auto-assign admin

    console.log(
      `Upserting user with id: ${id}, email: ${email}, name: ${first_name}`
    );

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    await prisma.user.upsert({
      where: { clerkUserId: id },
      update: { email, name: first_name },
      create: {
        clerkUserId: id,
        email,
        name: first_name,
        role,
      },
    });

    console.log(`User with ID ${id} synced successfully`);
    return NextResponse.json({ message: "User synced" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { message: "Error processing webhook" },
      { status: 500 }
    );
  }
}
