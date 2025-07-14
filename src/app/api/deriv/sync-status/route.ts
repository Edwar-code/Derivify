import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { revalidatePath } from 'next/cache'; // <-- IMPORTANT IMPORT

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'User is not authenticated.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const token = body.token;
    if (!token) {
      return NextResponse.json({ error: 'Deriv token is missing.' }, { status: 400 });
    }
    
    const appId = '85288';

    const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${appId}`);
    const api = new DerivAPIBasic({ connection });
    await api.authorize(token);
    const accountStatus = await api.getAccountStatus();
    api.disconnect();

    const poaStatus = accountStatus?.authentication?.identity?.status ?? 'none';
    
    const client = await clientPromise;
    const db = client.db();
    await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { derivPoaStatus: poaStatus } }
    );

    // --- THIS IS THE FIX ---
    // This tells Next.js: "The data for the dashboard has changed.
    // The next time someone visits, you must rebuild the page from scratch."
    revalidatePath('/dashboard');

    return NextResponse.json({ success: true, status: poaStatus });

  } catch (error) {
    console.error('SYNC-STATUS CRITICAL FAILURE:', error);
    return NextResponse.json({ error: (error as Error).message || 'An unknown internal server error occurred.' }, { status: 500 });
  }
}