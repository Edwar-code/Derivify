
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { customAlphabet } from 'nanoid';

// Generate a friendly, unique referral code
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
const generateReferralCode = () => `DERIVIFY-${nanoid(5)}`;

export async function POST(req: Request) {
    try {
        const { uid, email, name, usedReferralCode } = await req.json();

        if (!uid || !email || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ uid });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const newUser = {
            uid,
            email,
            name,
            createdAt: new Date(),
            walletBalance: 0,
            referralCode: generateReferralCode(),
            referredBy: null, // We'll handle this in the referral logic step
            usedReferralCode: usedReferralCode || null,
        };

        await usersCollection.insertOne(newUser);

        // We can add the referral commission logic here in the next step

        return NextResponse.json({ success: true, user: newUser }, { status: 201 });

    } catch (error) {
        console.error('Failed to create user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
