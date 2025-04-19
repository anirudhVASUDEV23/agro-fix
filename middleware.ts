import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-up(.*)", "/sign-in(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname, origin } = req.nextUrl;

  if (pathname.startsWith("/api/webhooks")) {
    console.log("Skipping Clerk auth for webhook route:", pathname);
    return NextResponse.next();
  }
  const userAuth = await auth();
  const { userId } = userAuth;

  console.log("Middleware Info:", userId, pathname, origin);

  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/sign-up", origin));
  }

  console.log("User ID:", userId);

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
