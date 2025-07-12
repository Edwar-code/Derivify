
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET() {
    noStore();
    try {
        const client = await clientPromise;
        const db = client.db();
        const withdrawals = await db.collection("withdrawals").find({}).sort({ requestedAt: -1 }).toArray();
        return NextResponse.json(withdrawals);
    } catch (error) {
        console.error('Failed to fetch withdrawals:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
