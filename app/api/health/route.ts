import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";

const clerk = new Clerk();
const client = clerk.client;

export async function GET(req: Request) {
  try {
    // Get the current user's authentication info
    const { userId, sessionId } = getAuth(req);

    if (!userId || !sessionId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Retrieve the user's JWT from Clerk
    const jwtToken = await clerkClient.sessions
      .getSession(sessionId)
      .then((session) => {
        return session?.jwtToken;
      });

    if (!jwtToken) {
      return NextResponse.json({ message: "JWT not found" }, { status: 500 });
    }

    // Return the JWT token to the client
    return NextResponse.json({ jwt: jwtToken });
  } catch (error) {
    console.error("Error fetching JWT:", error);
    return NextResponse.json(
      { message: "Error fetching JWT" },
      { status: 500 }
    );
  }
}
