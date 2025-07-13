'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function ReferralCardClient({ referralCode }: { referralCode: string }) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied to Clipboard!",
      description: `Your referral code ${referralCode} has been copied.`,
    });
  };

  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader>
          <CardTitle className="flex items-center gap-2"><Gift/> Referral Code</CardTitle>
          <CardDescription>Share this code to earn rewards.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
          <div className="border border-dashed border-border rounded-md p-3 text-center">
              <p className="text-2xl font-mono tracking-widest text-foreground">{referralCode}</p>
          </div>
          <Button variant="outline" className="w-full" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
          </Button>
      </CardContent>
    </Card>
  );
}```

---

### **Step 5: Create a Working Profile Page**

This page proves that navigation between protected pages works correctly.

**Create a new file at `src/app/profile/page.tsx`:**
```tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  // This is the crucial pattern: always pass authOptions to getServerSession
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    // This will protect the page if the middleware somehow fails
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="font-semibold">{session.user.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="font-semibold">{session.user.email}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Role</span>
            <span className="font-semibold capitalize">{session.user.role}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}