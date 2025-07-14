// File Path: src/app/api/deriv/sync-status/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'User is not authenticated.' }, { status: 401 });
  }

  const body = await req.json();
  const token = body.token;

  if (!token) {
    return NextResponse.json({ error: 'Deriv token is missing.' }, { status: 400 });
  }

  const appId = '85288';

  try {
    const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${appId}`);
    const api = new DerivAPIBasic({ connection });

    // Authorize the WebSocket connection with the token we received from the frontend
    await api.authorize(token);
    const accountStatus = await api.getAccountStatus();
    api.disconnect();

    const poaStatus = accountStatus?.authentication?.identity?.status ?? 'none';
    
    // Save the new status to our database
    const client = await clientPromise;
    const db = client.db();
    await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { derivPoaStatus: poaStatus } }
    );

    // Invalidate the cache to ensure the UI updates on the next full refresh
    revalidatePath('/dashboard');

    // Send a success response back to the frontend with the new status
    return NextResponse.json({ success: true, status: poaStatus });

  } catch (error) {
    console.error('SYNC-STATUS CRITICAL FAILURE:', error);
    return NextResponse.json({ error: (error as Error).message || 'An unknown internal server error occurred.' }, { status: 500 });
  }
}