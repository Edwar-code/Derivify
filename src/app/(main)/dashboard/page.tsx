import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaymentModal } from "@/components/payment/payment-modal";
import { FileText, Building, FileUp, Banknote, Wallet, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { WithdrawalModal } from "@/components/wallet/withdrawal-modal";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

import { ReferralCard } from "@/components/dashboard/referral-card";
import { DerivConnectionCard } from "@/components/dashboard/deriv-connection-card";
import { BonusClaimCard } from "@/components/dashboard/bonus-claim-card";

const documents = [
    { id: "doc-1", name: "KRA Returns Document", description: "Official KRA document.", price: 150, icon: <FileText className="w-6 h-6 text-primary" /> },
    { id: "doc-2", name: "Utility Electricity Bill", description: "A recent electricity bill.", price: 150, icon: <Building className="w-6 h-6 text-primary" /> },
    { id: "doc-3", name: "Affidavit for Proof", description: "A sworn legal affidavit.", price: 150, icon: <FileUp className="w-6 h-6 text-primary" /> },
    { id: "doc-4", name: "Bank Statement", description: "Official bank statement.", price: 150, icon: <Banknote className="w-6 h-6 text-primary" /> },
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) });

  if (!user) {
    redirect("/login");
  }
  
  const isAdmin = user.role === 'admin' || user.email === 'kybeedd@gmail.com';
  const walletBalance = user.walletBalance ?? 0;
  const referralCode = user.referralCode ?? "N/A";
  const derivPoaStatus = user.derivPoaStatus ?? 'none';
  
  const claimableBonus = user.referralBonuses
    ?.filter((b: any) => b.status === 'unclaimed')
    .reduce((sum: number, b: any) => sum + b.amount, 0) ?? 0;

  return (
    <div className="space-y-8">
      {isAdmin && (
        <Card className="border-primary bg-primary/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck/> Admin Panel</CardTitle>
                <CardDescription>You have administrative privileges. Access the admin dashboard to manage users and documents.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/admin/dashboard">Go to Admin Dashboard</Link>
                </Button>
            </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BonusClaimCard amount={claimableBonus} />
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Wallet/> Wallet Balance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <p className="text-3xl font-bold text-foreground">KES {walletBalance.toFixed(2)}</p>
                <WithdrawalModal currentBalance={walletBalance} />
            </CardContent>
        </Card>
        <ReferralCard referralCode={referralCode} />
      </div>

      <DerivConnectionCard initialPoaStatus={derivPoaStatus} />

      <Card>
          <CardHeader>
            <CardTitle>Get Your Proof of Address Documents</CardTitle>
            <CardDescription>Select a document to purchase. Payments are securely handled.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {documents.map((doc) => (
                  <div key={doc.id} className="flex flex-col items-center text-center gap-4 p-4 rounded-lg border bg-background">
                      <div className="text-primary">{doc.icon}</div>
                      <h3 className="font-semibold">{doc.name}</h3>
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                      <PaymentModal document={doc} userId={user._id.toString()} userEmail={user.email} userName={user.name} usedReferralCode={user.usedReferralCode} />
                  </div>
              ))}
          </CardContent>
      </Card>
    </div>
  );
}
