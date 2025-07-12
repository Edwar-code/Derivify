
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

export default function DashboardPage() {
  const walletBalance = 1250.00;
  const referralCode = "DERIVIFY-A8X3B";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-border bg-card shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle className="text-lg">My Wallet</CardTitle>
                    <CardDescription>
                        Your available referral earnings.
                    </CardDescription>
                </div>
                <Wallet className="w-8 h-8 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-3xl font-bold text-foreground">KES {walletBalance.toFixed(2)}</p>
                <WithdrawalModal currentBalance={walletBalance} />
            </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle className="text-lg">Refer & Earn</CardTitle>
                    <CardDescription>
                        Share your code and earn commissions.
                    </CardDescription>
                </div>
                 <Gift className="w-8 h-8 text-muted-foreground" />
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
              <CardTitle className="text-lg">Purchase a Document</CardTitle>
              <CardDescription>
                  Select a document to generate. Your proof of address, delivered instantly.
              </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between space-x-4 p-4 rounded-lg border border-border bg-background">
                      <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-md`}>
                             {doc.icon}
                          </div>
                          <div className="flex flex-col">
                              <p className="font-semibold text-foreground">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.description}</p>
                          </div>
                      </div>
                      <PaymentModal document={doc} />
                  </div>
              ))}
          </CardContent>
      </Card>
    </div>
  );
}
