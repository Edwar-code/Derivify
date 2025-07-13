import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { revalidatePath } from 'next/cache'; // <-- IMPORTANT IMPORT

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login?error=AuthenticationRequired', req.url));
  }

  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard?deriv_status=error', req.url));
  }
  
  const appId = '85288'; // Your App ID
  const clientSecret = process.env.DERIV_CLIENT_SECRET;

  if (!clientSecret) {
    console.error("Critical: DERIV_CLIENT_SECRET is not set in environment variables.");
    return NextResponse.redirect(new URL('/dashboard?deriv_status=error', req.url));
  }

  try {
    const bodyParams = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: appId,
        code: code,
        redirect_uri: `${new URL(req.url).origin}/api/deriv/callback`,
        client_secret: clientSecret,
    });

    const tokenResponse = await fetch('https://oauth.deriv.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyParams,
    });

    if (!tokenResponse.ok) { throw new Error('Failed to get Deriv token'); }

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
      { $set: { derivAccessToken: accessToken, derivPoaStatus: poaStatus } }
    );

    // --- THIS IS THE FIX ---
    // This tells Next.js to dump the old cached dashboard and build a new one.
    revalidatePath('/dashboard');

    return NextResponse.redirect(new URL('/dashboard?deriv_status=success', req.url));

  } catch (error) {
    console.error('Deriv callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?deriv_status=error', req.url));
  }
}