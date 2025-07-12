
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try {
        const { orderId, details } = await req.json();

        if (!orderId || !details) {
            return NextResponse.json({ error: 'Missing orderId or details' }, { status: 400 });
        }

        if (!ObjectId.isValid(orderId)) {
            return NextResponse.json({ error: 'Invalid Order ID format' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const ordersCollection = db.collection('orders');

        const result = await ordersCollection.updateOne(
            { _id: new ObjectId(orderId) },
            { 
                $set: {
                    details: details,
                    status: 'Processing',
                    submittedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Order updated successfully' });

    } catch (error) {
        console.error('Failed to update order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
