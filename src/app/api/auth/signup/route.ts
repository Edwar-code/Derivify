import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { name, email, password, referralCode } = await req.json();

        if (!name || !email || !password) {
            return new NextResponse(
              JSON.stringify({ message: 'Missing required fields' }),
              { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return new NextResponse(
              JSON.stringify({ message: 'This email address is already in use.' }),
              { status: 409 } // 409 Conflict
            );
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user document
        await usersCollection.insertOne({
            name,
            email,
            password: hashedPassword, // Store the hashed password
            emailVerified: null,     // Field used by next-auth adapter
            image: null,             // Field used by next-auth adapter
            usedReferralCode: referralCode || null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        
        return new NextResponse(
          JSON.stringify({ message: 'User created successfully' }),
          { status: 201 } // 201 Created
        );

    } catch (error) {
        console.error("Error in sign-up API: ", error);
        return new NextResponse(
          JSON.stringify({ message: 'An unknown error occurred during sign-up.' }),
          { status: 500 }
        );
    }
}