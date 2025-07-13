import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const REFERRAL_BONUS_AMOUNT = 20;

export async function POST(req: Request) {
  if (!PAYSTACK_SECRET_KEY) {
    console.error("🔴 Paystack secret key is not set.");
    return new NextResponse("Server configuration issue.", { status: 500 });
  }

  const paystackSignature = req.headers.get("x-paystack-signature");
  const body = await req.text();
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");

  if (hash !== paystackSignature) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  try {
    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const transactionData = event.data;
      const metadata = transactionData.metadata;
      
      const client = await clientPromise;
      const db = client.db();

      // --- Task 1: Create the Order (Your existing logic) ---
      try {
        const newOrder = {
          _id: new ObjectId(),
          customerName: metadata.customer_name || 'N/A',
          customerEmail: transactionData.customer.email,
          documentName: metadata.document_name || 'N/A',
          amount: transactionData.amount / 100,
          currency: transactionData.currency,
          reference: transactionData.reference,
          status: 'Awaiting Details',
          createdAt: new Date(),
        };
        await db.collection("orders").insertOne(newOrder);
        console.log("✅ Order successfully saved:", newOrder.reference);
      } catch (dbError) {
        console.error("🔴 DB Error (Order):", dbError);
      }
      
      // --- Task 2: Award Referral Bonus (New Logic) ---
      if (metadata.usedReferralCode) {
        try {
          const referrer = await db.collection('users').findOne({ 
            referralCode: metadata.usedReferralCode 
          });

          if (referrer) {
            const bonusRecord = {
              amount: REFERRAL_BONUS_AMOUNT,
              fromUserId: metadata.payingUserId || 'unknown',
              fromCustomerName: metadata.customer_name || 'New User',
              status: 'unclaimed',
              earnedAt: new Date(),
            };
            await db.collection('users').updateOne(
              { _id: referrer._id },
              { $push: { referralBonuses: bonusRecord } }
            );
            console.log(`✅ Bonus of ${REFERRAL_BONUS_AMOUNT} awarded to ${referrer.email}`);
          }
        } catch (bonusError) {
          console.error("🔴 DB Error (Bonus):", bonusError);
        }
      }
    }

    return new NextResponse("Webhook received.", { status: 200 });
  } catch (error) {
    console.error("🔴 Error processing webhook:", error);
    return new NextResponse("Webhook processing error.", { status: 500 });
  }
}