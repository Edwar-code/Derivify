import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

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
          throw new Error("Missing credentials.");
        }
        
        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("No user found.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password.");
        }
        
        // Returns the user's role from the database. Defaults to 'customer' if no role is found.
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || 'customer' 
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Adds the user's role to the JWT token
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Adds the user's role to the final session object
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };