import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb" // We will create this file next
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
            throw new Error("Missing credentials");
        }

        const client: MongoClient = await clientPromise;
        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password.");
        }

        // Return a user object that next-auth will use
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    // You can add callbacks here to customize session tokens, etc.
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub; // Add user ID to the session object
      }
      return session;
    },
    async jwt({ token, user }) {
        if (user) {
            token.sub = user.id
        }
        return token
    }
  },
  pages: {
    signIn: '/login', // Redirect users to your custom login page
    // error: '/auth/error', // Optional: a page to handle auth errors
  }
})