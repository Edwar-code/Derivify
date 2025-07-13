import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { revalidatePath } from 'next/cache';

// This is a POST route because the frontend will send the code here.
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
    // 1. Exchange the code for a token. NOTICE: No client_secret is sent.
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
      throw new Error('Failed to get Deriv token');
    }
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // 2. Use the new token to get the POA status
    const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${appId}`);
    const api = new DerivAPIBasic({ connection });
    await api.authorize(accessToken);
    const accountStatus = await api.getAccountStatus();
    api.disconnect();

    const poaStatus = accountStatus?.authentication?.identity?.status ?? 'none';
    
    // 3. Save the new status to our database
    const client = await clientPromise;
    const db = client.db();
    await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { derivPoaStatus: poaStatus } }
    );

    // 4. Invalidate the dashboard cache to ensure the UI updates on next load
    revalidatePath('/dashboard');

    // 5. Send a success response back to the frontend
    return NextResponse.json({ success: true, status: poaStatus });

  } catch (error) {
    console.error('Deriv exchange-code error:', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}