import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { name, email, password, referralCode } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'This email address is already in use.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        await usersCollection.insertOne({
            name,
            email,
            password: hashedPassword,
            emailVerified: null, // next-auth uses this field
            image: null, // and this one
            usedReferralCode: referralCode || null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        
        return res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error("Error in sign-up API: ", error);
        return res.status(500).json({ message: 'An unknown error occurred during sign-up.' });
    }
}