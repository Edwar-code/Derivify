import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { Db } from 'mongodb'; // Import Db type for type hinting

/**
 * Generates a short, uppercase, alphanumeric referral code and ensures it is unique
 * in the users collection.
 * @param {Db} db - The MongoDB database instance.
 * @returns {Promise<string>} A unique referral code.
 */
const generateUniqueReferralCode = async (db: Db): Promise<string> => {
    let referralCode = '';
    let isUnique = false;
    
    // Keep generating new codes until a unique one is found
    while (!isUnique) {
        // Generate a 6-character uppercase alphanumeric code (e.g., A2B4E9)
        referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Check if a user with this referral code already exists
        const existingUser = await db.collection('users').findOne({ referralCode });
        
        // If no user is found with this code, it's unique
        if (!existingUser) {
            isUnique = true;
        }
    }
    return referralCode;
};


export async function POST(req: Request) {
    try {
        // 'referralCode' from the body is the code the user *used* to sign up. We'll rename it for clarity.
        const { name, email, password, referralCode: usedReferralCode } = await req.json();

        // Validate that essential fields are provided
        if (!name || !email || !password) {
            return new NextResponse(
              JSON.stringify({ message: 'Missing required fields' }),
              { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');

        // Check if a user with the given email already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return new NextResponse(
              JSON.stringify({ message: 'This email address is already in use.' }),
              { status: 409 } // 409 Conflict
            );
        }

        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate a new, unique referral code for this new user
        const newReferralCode = await generateUniqueReferralCode(db);

        // Create the new user document with all necessary fields
        await usersCollection.insertOne({
            name,
            email,
            password: hashedPassword,
            emailVerified: null,             // Field used by next-auth adapter
            image: null,                     // Field used by next-auth adapter
            role: 'user',                    // Assign a default role
            walletBalance: 0,                // Initialize wallet balance
            referralCode: newReferralCode,   // The new code assigned to *this* user
            usedReferralCode: usedReferralCode || null, // The code they signed up with
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