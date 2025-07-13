import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // The `withAuth` function augments your `Request` object with the user's token.
  function middleware(req) {
    // --- ADD THIS LOG FOR DEBUGGING ---
    // This log will show you what the middleware sees for every protected route.
    console.log("Middleware running for path:", req.nextUrl.pathname);
    console.log("Token in middleware:", req.nextauth.token);

    // You can return early if everything is fine.
    return NextResponse.next();
  },
  {
    callbacks: {
      // This callback determines if the user is authorized.
      // It runs BEFORE the middleware function above.
      authorized: ({ token }) => {
        // The user is authorized if the token exists (i.e., they are logged in).
        return !!token;
      },
    },
  }
);

// This is the only matcher you need.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /login (the login page)
     * - /signup (your signup page)
     *
     * This single line protects all other routes, including your dashboard.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)",
  ],
};