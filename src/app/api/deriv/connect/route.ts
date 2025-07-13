import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { WebSocket } from 'ws';
import { AES } from 'crypto-js';

// Helper function to securely encrypt the user's private token before saving it
const encryptToken = (token: string): string => {
    return AES.encrypt(token, process.env.CRYPTO_SECRET_KEY!).toString();
};

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    try {
        const { token } = await req.json(); // The user's private token is received from the form
        if (!token || typeof token !== 'string') {
            return new NextResponse(JSON.stringify({ message: 'API token is required' }), { status: 400 });
        }

        // Your app's public ID is used here.
        const app_id = process.env.DERIV_APP_ID!;
        const connection = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${app_id}`);
        const api = new DerivAPIBasic({ connection });

        // This promise validates the user's token and gets their account status
        const getAccountStatus = () => new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Deriv API connection timed out.'));
                api.disconnect();
            }, 15000);

            // Here, we use the USER'S private token to authorize access to THEIR account
            api.authorize(token).then(async (authResponse) => {
                if (authResponse.error) {
                    clearTimeout(timeout);
                    reject(new Error(authResponse.error.message));
                    return;
                }
                
                const statusResponse = await api.get_account_status();
                clearTimeout(timeout);
                
                if (statusResponse.error) {
                    reject(new Error(statusResponse.error.message));
                } else {
                    resolve(statusResponse.get_account_status);
                }
            }).catch(error => {
                clearTimeout(timeout);
                reject(error);
            });
        });

        const accountStatus: any = await getAccountStatus();
        api.disconnect();

        const poaStatus = accountStatus?.authentication?.document?.status ?? 'none';
        const encryptedToken = encryptToken(token);

        // Update your database with the status and the ENCRYPTED token
        const client = await clientPromise;
        const db = client.db();
        await db.collection("users").updateOne(
            { _id: new ObjectId(session.user.id) },
            { 
                $set: {
                    derivApiToken: encryptedToken,
                    derivPoaStatus: poaStatus,
                    derivStatusCheckedAt: new Date(),
                }
            }
        );

        return new NextResponse(JSON.stringify({
            message: 'Deriv account connected successfully',
            poaStatus: poaStatus
        }), { status: 200 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return new NextResponse(JSON.stringify({ message: errorMessage }), { status: 500 });
    }
}