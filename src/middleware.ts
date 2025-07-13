// This file is located at your root, at middleware.ts

import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // You can add role-based checks here in the future if needed.
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

// This is the corrected configuration
export const config = { 
  // This matcher now ONLY protects routes that start with /dashboard.
  // Your homepage ('/'), login, and signup pages are now automatically public.
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*", // Also protect the orders page
    "/profile/:path*", // Also protect the profile page
    // Add any other routes here that should be for logged-in users only.
  ]
}