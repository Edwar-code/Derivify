import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  if (!PAYSTACK_SECRET_KEY) {
    console.error("🔴 Paystack secret key is not set in environment variables.");
    return new NextResponse("Webhook Error: Server configuration issue.", { status: 500 });
  }

  const paystackSignature = req.headers.get("x-paystack-signature");
  const body = await req.text();
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");

  if (hash !== paystackSignature) {
    console.warn("🔴 Webhook Error: Invalid signature received.");
    return new NextResponse("Invalid signature", { status: 401 });
  }

  try {
    const event = JSON.parse(body);
    console.log(`Received Paystack event: ${event.event}`);

    if (event.event === "charge.success") {
      const transactionData = event.data;
      const metadata = transactionData.metadata;

      console.log("✅ Payment successful! Preparing to save order...");
      
      try {
        const client = await clientPromise;
        const db = client.db();
        const ordersCollection = db.collection("orders");

        const newOrder = {
          customerName: metadata.customer_name,
          customerEmail: transactionData.customer.email,
          documentName: metadata.document_name,
          amount: transactionData.amount / 100, // Convert from kobo/cents
          currency: transactionData.currency,
          reference: transactionData.reference,
          status: 'Awaiting Details',
          createdAt: new Date(),
          _id: new ObjectId(),
        };

        await ordersCollection.insertOne(newOrder);
        console.log("✅ Order successfully saved to database:", newOrder);

      } catch (dbError) {
        console.error("🔴 Database Error: Could not save order.", dbError);
        // We don't want to return a 500 to Paystack if the db fails,
        // as they might retry. We'll just log it for now.
        // In a real production app, you'd have a more robust error handling/retry mechanism.
      }
    } else {
      console.log(`- Skipping event: ${event.event}`);
    }

    return new NextResponse("Webhook received successfully.", { status: 200 });

  } catch (error) {
    console.error("🔴 Error processing webhook:", error);
    return new NextResponse("Webhook Error: Could not process request.", { status: 500 });
  }
}
