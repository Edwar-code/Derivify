// This file is located at app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

/**
 * These are your NextAuth options. By exporting them, you can use them in other places
 * like your dashboard page to get the server-side session.
 */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.log("Missing credentials");
          throw new Error("Missing credentials");
        }

        const client = await clientPromise;
        const db = client.db(); // Ensure you are getting the db instance
        const usersCollection = db.collection("users");
        
        console.log("Attempting to find user:", credentials.email);
        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user || !user.password) {
          console.log("No user found with this email or user is missing a password.");
          throw new Error("No user found with this email.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          console.log("Invalid password for user:", credentials.email);
          throw new Error("Invalid password.");
        }
        
        console.log("Login successful for:", user.email);
        // Return the object that the JWT callback will use
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      }
    })
  ],
  session: {
    // This is correct, you want to use JWTs for your session
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign in, the user object is passed in
      if (user) {
        console.log("JWT Callback: User object found, adding to token:", user);
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // The token's properties are passed to the session object
      if (token?.id && session.user) {
        // Here we are casting the user object to allow adding the 'id' property
        (session.user).id = token.id;
      }
      console.log("Session Callback: Final session object:", session);
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
  }
};

// The handler is created using the exported options
const handler = NextAuth(authOptions);

// This is the standard export for Next.js App Router route handlers
export { handler as GET, handler as POST };