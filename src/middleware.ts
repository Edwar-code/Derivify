import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // You can add logic here if you want, but for now, just protecting pages is enough.
    // console.log("Token in middleware: ", req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

// This applies next-auth to all matching routes
export const config = { 
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root, assuming it's a public landing page)
     * - /login (the login page)
     * - /signup (the signup page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)',
    '/dashboard/:path*', // Explicitly protect the dashboard and its sub-routes
  ]
}