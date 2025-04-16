"use client";
import { useEffect } from "react";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isSignedIn } = useClerk(); // Use Clerk's hook to check if the user is signed in
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      // Redirect the user to the dashboard if they are signed in
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <SignedIn>
        {/* Automatically redirect to dashboard if signed in */}
        {/* No need for UserButton here, as they will be redirected */}
      </SignedIn>

      <SignedOut>
        {/* Display when the user is signed out */}
        <div className="flex space-x-4">
          {/* Get Started button redirects to the sign-up page */}
          <Link
            href="/sign-up"
            className="inline-block bg-white text-emerald-500 font-medium px-5 py-3 rounded hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>

          {/* Sign In button redirects to the sign-in page */}
          <Link
            href="/sign-in"
            className="inline-block bg-blue-500 text-white font-medium px-5 py-3 rounded hover:bg-gray-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </SignedOut>
    </div>
  );
}
