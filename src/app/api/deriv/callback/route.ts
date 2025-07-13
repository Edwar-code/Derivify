// File Path: app/api/deriv/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  console.log("--- Deriv Callback Started ---");

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    console.error("Callback Error: User not logged in.");
    return NextResponse.redirect(new URL('/login?error=AuthenticationRequired', req.url));
  }
  console.log("Step 1: User session found for ID:", session.user.id);

  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    console.error("Callback Error: No 'code' in URL parameters.");
    return NextResponse.redirect(new URL('/dashboard?deriv_status=error&reason=no_code', req.url));
  }
  console.log("Step 2: Authorization code received:", code);
  
  const appId = '85288';
  const clientSecret = process.env.DERIV_CLIENT_SECRET;

  if (!clientSecret) {
    console.error("Callback Error: CRITICAL - DERIV_CLIENT_SECRET environment variable not set.");
    return NextResponse.redirect(new URL('/dashboard?deriv_status=error&reason=no_secret', req.url));
  }
  console.log("Step 3: Client Secret found.");

  try {
    const bodyParams = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: appId,
        code: code,
        redirect_uri: `${new URL(req.url).origin}/api/deriv/callback`,
        client_secret: clientSecret,
    });

    console.log("Step 4: Attempting to exchange code for token with Deriv...");
    const tokenResponse = await fetch('https://oauth.deriv.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyParams,
    });

    if (!tokenResponse.ok) {
        const errorBody = await tokenResponse.json();
        console.error("Callback Error: Deriv token exchange failed. Status:", tokenResponse.status, "Body:", errorBody);
        throw new Error(`Deriv token API error: ${JSON.stringify(errorBody)}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    console.log("Step 5: Successfully received access token from Deriv.");
    
    console.log("Step 6: Connecting to Deriv WebSocket to get account status...");
    const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${appId}`);
    const api = new DerivAPIBasic({ connection });

    await api.authorize(accessToken);
    console.log("Step 7: WebSocket authorized.");
    const accountStatus = await api.getAccountStatus();
    console.log("Step 8: Account status received:", accountStatus);
    api.disconnect();

    const poaStatus = accountStatus?.authentication?.identity?.status ?? 'none';
    console.log("Step 9: Parsed POA status:", poaStatus);
    
    console.log("Step 10: Updating user in MongoDB...");
    const client = await clientPromise;
    const db = client.db();
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { derivAccessToken: accessToken, derivPoaStatus: poaStatus } }
    );
    console.log("Step 11: MongoDB update successful.");

    revalidatePath('/dashboard');
    console.log("Step 12: Dashboard path revalidated.");
    
    console.log("--- Deriv Callback Successful. Redirecting... ---");
    return NextResponse.redirect(new URL('/dashboard?deriv_status=success', req.url));

  } catch (error) {
    console.error('--- Deriv Callback CRITICAL FAILURE ---', error);
    return NextResponse.redirect(new URL('/dashboard?deriv_status=error&reason=catch_block', req.url));
  }
}