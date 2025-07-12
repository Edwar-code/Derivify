import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
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

        // Check if user exists and has a password
        if (!user || !user.password) {
          throw new Error("No user found with this email.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password.");
        }

        // Return the user object if everything is valid
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      }
    })
  ],
  session: {
    // Use JSON Web Tokens for session management
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    // This callback adds the user ID from the token to the session object
    async session({ session, token }) {
      if (token?.sub && session.user) {
        (session.user as { id: string }).id = token.sub;
      }
      return session;
    },
    // This callback is called when a JWT is created
    async jwt({ token, user }) {
        if (user) {
            token.sub = user.id
        }
        return token
    }
  },
  pages: {
    signIn: '/login', // Point to your custom login page
    error: '/login',   // On error, redirect back to the login page
  }
});

// This is the required export for the App Router that makes it work
export { handler as GET, handler as POST }