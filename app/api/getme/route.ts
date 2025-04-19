import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  // Fetch the authentication details from Clerk
  const { userId } = getAuth(req);

  // Return user details
  if (!userId) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });

  return NextResponse.json({ user });
}
