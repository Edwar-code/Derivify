'use server';

import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function claimReferralBonuses() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, message: 'Unauthorized.' };
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    
    const mongoSession = client.startSession();
    try {
        let totalClaimAmount = 0;
        await mongoSession.withTransaction(async () => {
            const user = await usersCollection.findOne({ _id: new ObjectId(session.user.id) }, { session: mongoSession });

            if (!user || !user.referralBonuses) { throw new Error("No bonus data found."); }

            const unclaimedBonuses = user.referralBonuses.filter((b: any) => b.status === 'unclaimed');
            if (unclaimedBonuses.length === 0) { throw new Error("No unclaimed bonuses found."); }

            totalClaimAmount = unclaimedBonuses.reduce((sum: number, b: any) => sum + b.amount, 0);

            // Add amount to main wallet
            await usersCollection.updateOne({ _id: user._id }, { $inc: { walletBalance: totalClaimAmount } }, { session: mongoSession });

            // Mark bonuses as claimed
            const unclaimedIds = unclaimedBonuses.map((b: any) => b.earnedAt); // Assuming earnedAt is unique enough
            await usersCollection.updateMany(
                { _id: user._id, "referralBonuses.earnedAt": { $in: unclaimedIds } },
                { $set: { "referralBonuses.$[elem].status": "claimed" } },
                { arrayFilters: [{ "elem.earnedAt": { $in: unclaimedIds } }], session: mongoSession }
            );
        });

        revalidatePath('/dashboard');
        return { success: true, message: `Successfully claimed KES ${totalClaimAmount.toFixed(2)}!` };
    } catch (error) {
        console.error("Claim bonus error:", error);
        return { success: false, message: error instanceof Error ? error.message : "Failed to claim bonuses." };
    } finally {
        await mongoSession.endSession();
    }
}