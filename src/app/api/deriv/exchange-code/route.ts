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
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json();
  const code = body.code;

  if (!code) {
    return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
  }
  
  const appId = '85288';

  try {
    const tokenResponse = await fetch('https://oauth.deriv.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: appId,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.json();
      console.error("Deriv token exchange failed:", errorBody);
      throw new Error('Failed to get Deriv token. Please try connecting again.');
    }
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${appId}`);
    const api = new DerivAPIBasic({ connection });
    await api.authorize(accessToken);
    const accountStatus = await api.getAccountStatus();
    api.disconnect();

    const poaStatus = accountStatus?.authentication?.identity?.status ?? 'none';
    
    const client = await clientPromise;
    const db = client.db();
    await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { derivPoaStatus: poaStatus } }
    );

    revalidatePath('/dashboard');

    return NextResponse.json({ success: true, status: poaStatus });

  } catch (error) {
    console.error('Deriv exchange-code error:', error);
    return NextResponse.json({ error: (error as Error).message || 'An internal server error occurred' }, { status: 500 });
  }
}