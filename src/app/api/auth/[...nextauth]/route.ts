import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

// Define a type for the user object to avoid type errors
import { User } from "next-auth"

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

        if (!user || !user.password) {
          throw new Error("No user found with this email.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password.");
        }

        // --- THIS IS THE FIX ---
        // Return the full user object from the database, but make sure
        // the `id` property is set to the string representation of `_id`.
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          // You can include other user properties here if you have them
          // e.g., image: user.image,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    // The jwt callback is where you augment the token
    async jwt({ token, user }) {
      // The `user` object is passed from the `authorize` function on initial sign in.
      if (user) {
        token.id = user.id; // Persist the user ID to the token
        // You can add other properties here too:
        // token.role = user.role;
      }
      return token;
    },
    // The session callback gets the token and returns the session object
    async session({ session, token }) {
      // Make the user ID available on the session object
      if (token && session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  }
});

export { handler as GET, handler as POST };