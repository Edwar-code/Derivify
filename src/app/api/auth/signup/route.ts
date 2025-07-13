import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { Db } from 'mongodb';

const generateUniqueReferralCode = async (db: Db): Promise<string> => {
    let referralCode = '';
    let isUnique = false;
    while (!isUnique) {
        referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const existingUser = await db.collection('users').findOne({ referralCode });
        if (!existingUser) {
            isUnique = true;
        }
    }
    return referralCode;
};

export async function POST(req: Request) {
    try {
        const { name, email, password, referralCode: usedReferralCode } = await req.json();

        if (!name || !email || !password) {
            return new NextResponse(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return new NextResponse(JSON.stringify({ message: 'This email address is already in use.' }), { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newReferralCode = await generateUniqueReferralCode(db);

        // --- Create the new user document with all necessary fields ---
        await usersCollection.insertOne({
            name,
            email,
            password: hashedPassword,
            emailVerified: null,
            image: null,
            role: 'user',
            walletBalance: 0,
            referralBonuses: [], // <-- ADDED: Initializes the bonuses array
            referralCode: newReferralCode,
            usedReferralCode: usedReferralCode || null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        
        return new NextResponse(JSON.stringify({ message: 'User created successfully' }), { status: 201 });

    } catch (error) {
        console.error("Error in sign-up API: ", error);
        return new NextResponse(JSON.stringify({ message: 'An unknown error occurred during sign-up.' }), { status: 500 });
    }
}