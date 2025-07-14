'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { LinkIcon, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface DerivConnectionCardProps {
  initialPoaStatus: 'none' | 'pending' | 'verified' | 'rejected';
}

export function DerivConnectionCard({ initialPoaStatus }: DerivConnectionCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // This state tracks the current status, providing instant UI feedback
  const [poaStatus, setPoaStatus] = useState(initialPoaStatus);
  // This state is ONLY for the moment we are talking to our backend
  const [isVerifying, setIsVerifying] = useState(false);

  // This is the core of the fix. It runs ONCE when the dashboard loads.
  useEffect(() => {
    // 1. Check if the user was just redirected from Deriv with a 'code'.
    const authCode = searchParams.get('code');

    if (authCode) {
      setIsVerifying(true); // Show "Verifying..." status immediately
      toast({ title: "Finishing connection...", description: "Securely verifying with Deriv. Please wait." });

      // 2. Call our backend API to exchange the code for the real status.
      const exchangeCode = async (code: string) => {
        try {
          const response = await fetch('/api/deriv/exchange-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });
          
          const result = await response.json();

          if (!response.ok || result.error) {
            throw new Error(result.error || 'The server could not verify your connection.');
          }
          
          // 3. On success, update the UI instantly and show success toast.
          setPoaStatus(result.status);
          toast({
            title: "Connection Successful!",
            description: "Your Proof of Address status has been updated.",
            className: "bg-green-500 text-white",
          });

        } catch (error) {
          toast({ title: "Connection Failed", description: (error as Error).message, variant: "destructive" });
        } finally {
          // 4. Clean the URL so this doesn't run again on a page refresh.
          router.replace('/dashboard');
          setIsVerifying(false);
        }
      };

      exchangeCode(authCode);
    }
  }, []); // The empty array `[]` is crucial and correct. It means this runs only once on mount.

  // The function to start the connection process
  const handleConnect = () => {
    setIsVerifying(true); // Set loading state immediately on click
    const appId = '85288';
    const scopes = 'read+trading_information';
    const redirectUri = `${window.location.origin}/dashboard`; 

    const derivAuthUrl = `https://oauth.deriv.com/oauth2/authorize?app_id=${appId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    window.location.href = derivAuthUrl;
  };

  const renderStatus = () => {
    // Show a loading state BOTH when initially clicking AND when returning from redirect.
    if (isVerifying) {
       return <Badge variant="secondary" className="text-base"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Verifying...</Badge>;
    }
    // Render the status based on our local state variable
    switch (poaStatus) {
      case 'verified':
        return <Badge variant="success" className="text-base"><CheckCircle2 className="mr-2 h-4 w-4"/>Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-base"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="text-base"><XCircle className="mr-2 h-4 w-4"/>Rejected</Badge>;
      case 'none':
      default:
        return (
          <Button onClick={handleConnect}>
            <LinkIcon className="mr-2 h-4 w-4" />
            Connect Deriv Account
          </Button>
        );
    }
  };

  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Proof of Address Status</span>
          {renderStatus()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Connect your Deriv account to automatically fetch and display your Proof of Address (POA) verification status.
        </p>
      </CardContent>
    </Card>
  );
}