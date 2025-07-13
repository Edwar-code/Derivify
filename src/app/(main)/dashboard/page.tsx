// This file is located at your dashboard/page.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaymentModal } from "@/components/payment/payment-modal";
import { FileText, Building, FileUp, Banknote, Wallet, Gift, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { WithdrawalModal } from "@/components/wallet/withdrawal-modal";

// --- SERVER-SIDE DATA FETCHING ---
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Import the authOptions from your NextAuth configuration
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const documents = [
  {
    id: "doc-1",
    name: "KRA Returns Document",
    description: "Official KRA document to serve as a proof of address.",
    price: 150,
    icon: <FileText className="w-6 h-6 text-primary" />,
  },
  {
    id: "doc-2",
    name: "Utility Electricity Bill",
    description: "A recent electricity bill with your name and address.",
    price: 150,
    icon: <Building className="w-6 h-6 text-primary" />,
  },
  {
    id: "doc-3",
    name: "Affidavit for Proof",
    description: "A sworn affidavit legally confirming your place of residence.",
    price: 150,
    icon: <FileUp className="w-6 h-6 text-primary" />,
  },
  {
    id: "doc-4",
    name: "Bank Statement",
    description: "Official bank statement reflecting your address.",
    price: 150,
    icon: <Banknote className="w-6 h-6 text-primary" />,
  },
];

export default async function DashboardPage() {
  // Pass the authOptions to getServerSession to get the session correctly
  const session = await getServerSession(authOptions);

  // --- DEBUGGING LOG ---
  console.log("Dashboard Page - Session Object:", JSON.stringify(session, null, 2));

  // --- CHECK 1: Validate the session object itself ---
  // The type for session.user is now correctly inferred to potentially have an 'id'
  if (!session || !session.user || !session.user.id) {
    console.log("Dashboard Page: Redirecting to login due to missing session or user ID.");
    redirect("/login");
  }

  const userId = session.user.id;
  console.log("Dashboard Page - User ID from session:", userId);

  let user = null;
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // --- CHECK 2: Validate the user from the database ---
    user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    console.log("Dashboard Page - User found in DB:", JSON.stringify(user, null, 2));

  } catch (error) {
    console.error("Dashboard Page: Error querying database.", error);
    // If new ObjectId(userId) fails, it will be caught here.
    redirect("/login");
  }

  if (!user) {
    console.log("Dashboard Page: Redirecting to login because user was not found in the database with ID:", userId);
    redirect("/login");
  }

  // Use real data from the database, with fallbacks for safety
  const walletBalance = user.walletBalance ?? 0;
  const referralCode = user.referralCode ?? "N/A";

  console.log("Dashboard Page: Successfully loaded for user:", user.email);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-border bg-card shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wallet/> Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-3xl font-bold text-foreground">KES {walletBalance.toFixed(2)}</p>
                <WithdrawalModal currentBalance={walletBalance} />
            </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gift/> Referral Code</CardTitle>
                <CardDescription>Share this code to earn rewards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="border border-dashed border-border rounded-md p-3 text-center">
                    <p className="text-2xl font-mono tracking-widest text-foreground">{referralCode}</p>
                </div>
                <Button variant="outline" className="w-full">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Code
                </Button>
            </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card shadow-md">
          <CardHeader>
            <CardTitle>Get Your Proof of Address Documents</CardTitle>
            <CardDescription>Select a document to purchase. Payments are securely handled.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {documents.map((doc) => (
                  <div key={doc.id} className="flex flex-col items-center justify-between text-center gap-4 p-4 rounded-lg border border-border bg-background">
                      <div className="text-primary">{doc.icon}</div>
                      <h3 className="font-semibold">{doc.name}</h3>
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                      <PaymentModal document={doc} />
                  </div>
              ))}
          </CardContent>
      </Card>
    </div>
  );
}