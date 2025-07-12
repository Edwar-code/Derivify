
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try {
        const { amount } = await req.json();

        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json({ error: 'Invalid withdrawal amount' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const withdrawalsCollection = db.collection('withdrawals');

        // In a real app, you would associate this with a user ID
        const newWithdrawalRequest = {
            // userId: new ObjectId('some-user-id'), // Example user ID
            amount,
            currency: 'KES',
            status: 'Pending',
            requestedAt: new Date(),
            _id: new ObjectId(),
        };

        await withdrawalsCollection.insertOne(newWithdrawalRequest);

        return NextResponse.json({ success: true, message: 'Withdrawal request created successfully' });

    } catch (error) {
        console.error('Failed to create withdrawal request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
