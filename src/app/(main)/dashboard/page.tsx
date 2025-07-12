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

const documents = [
  // ... (your documents array remains the same)
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

// The page component is now async
export default async function DashboardPage() {
  const session = await getServerSession();

  // If there's no session, the middleware should have redirected, but this is a failsafe.
  if (!session || !session.user || !(session.user as any).id) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch the user data from MongoDB
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

  if (!user) {
    redirect("/login"); // User not found in DB
  }

  // Use real data from the database, with fallbacks for safety
  const walletBalance = user.walletBalance ?? 0;
  const referralCode = user.referralCode ?? "N/A";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-border bg-card shadow-md">
            {/* ... card content ... */}
            <CardContent className="space-y-4">
                {/* DYNAMIC DATA */}
                <p className="text-3xl font-bold text-foreground">KES {walletBalance.toFixed(2)}</p>
                <WithdrawalModal currentBalance={walletBalance} />
            </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-md">
            {/* ... card content ... */}
            <CardContent className="space-y-4">
                <div className="border border-dashed border-border rounded-md p-3 text-center">
                    {/* DYNAMIC DATA */}
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
          {/* ... card content ... */}
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between space-x-4 p-4 rounded-lg border border-border bg-background">
                      {/* ... content */}
                      <PaymentModal document={doc} />
                  </div>
              ))}
          </CardContent>
      </Card>
    </div>
  );
}