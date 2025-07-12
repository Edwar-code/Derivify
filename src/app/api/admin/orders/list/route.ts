
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET() {
    noStore();
    try {
        const client = await clientPromise;
        const db = client.db();
        const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
