import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // This logic protects the admin routes
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.role !== "admin"
    ) {
      // If a user is not an admin, silently redirect them back to their own user dashboard.
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      // This callback ensures the user is logged in to access any protected page.
      authorized: ({ token }) => !!token,
    },
  }
);

// This config protects all the necessary routes.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/admin/:path*", // This ensures the middleware runs on all admin routes
  ],
};