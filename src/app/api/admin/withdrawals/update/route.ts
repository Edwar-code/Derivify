
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try {
        const { withdrawalId, status } = await req.json();

        if (!withdrawalId || !status) {
            return NextResponse.json({ error: 'Missing withdrawalId or status' }, { status: 400 });
        }

        if (!['Approved', 'Rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
        }

        if (!ObjectId.isValid(withdrawalId)) {
            return NextResponse.json({ error: 'Invalid Withdrawal ID format' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('withdrawals').updateOne(
            { _id: new ObjectId(withdrawalId) },
            { 
                $set: {
                    status: status,
                    processedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Withdrawal request not found' }, { status: 404 });
        }
        
        // In a real app, if status is 'Approved', you would also deduct the amount
        // from the user's wallet balance in the 'users' collection.

        return NextResponse.json({ success: true, message: 'Withdrawal status updated' });

    } catch (error) {
        console.error('Failed to update withdrawal status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
