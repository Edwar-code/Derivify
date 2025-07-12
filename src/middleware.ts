export { default } from "next-auth/middleware";

// This config specifies which routes should be protected.
export const config = {
  matcher: [
    '/dashboard/:path*', // Protects all routes under /dashboard
    // Add any other routes you want to protect here
    // '/settings',
  ],
};