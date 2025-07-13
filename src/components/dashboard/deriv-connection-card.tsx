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
  // We use local state to provide an instant UI update without a full page reload.
  const [status, setStatus] = useState(initialPoaStatus);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // This useEffect hook is the key to the new flow.
  useEffect(() => {
    // 1. Check if the user has been redirected back from Deriv with a code.
    const code = searchParams.get('code');

    if (code) {
      setIsLoading(true);
      toast({ title: "Finishing connection...", description: "Verifying with Deriv, please wait." });

      // 2. Define an async function to send the code to our new backend API.
      const exchangeCodeForStatus = async (authCode: string) => {
        try {
          const response = await fetch('/api/deriv/exchange-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: authCode }),
          });

          if (!response.ok) {
            throw new Error('Server failed to exchange the code.');
          }
          
          const result = await response.json();
          if (result.success) {
            // 3. On success, update the UI instantly and show a success message.
            setStatus(result.status);
            toast({
              title: "Connection Successful!",
              description: "Your Proof of Address status has been updated.",
              className: "bg-green-500 text-white",
            });
          } else {
            throw new Error(result.error || 'An unknown error occurred.');
          }

        } catch (error) {
          toast({ title: "Connection Failed", description: (error as Error).message, variant: "destructive" });
        } finally {
          // 4. Clean the URL by removing the 'code' parameter, so this doesn't run again on refresh.
          router.replace('/dashboard');
          setIsLoading(false);
        }
      };

      exchangeCodeForStatus(code);
    }
  }, []); // This empty dependency array means the effect runs only once when the page loads.

  const handleConnect = () => {
    setIsLoading(true);
    const appId = '85288';
    const scopes = 'read+trading_information';
    // This MUST match exactly what you have set in your Deriv App dashboard.
    const redirectUri = `${window.location.origin}/dashboard`; 

    const derivAuthUrl = `https://oauth.deriv.com/oauth2/authorize?app_id=${appId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Send the user to Deriv to authorize.
    window.location.href = derivAuthUrl;
  };

  const renderStatus = () => {
    if (isLoading) {
       return <Badge variant="secondary" className="text-base"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Verifying...</Badge>;
    }
    switch (status) {
      case 'verified':
        return <Badge variant="success" className="text-base"><CheckCircle2 className="mr-2 h-4 w-4"/>Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-base"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="text-base"><XCircle className="mr-2 h-4 w-4"/>Rejected</Badge>;
      case 'none':
      default:
        return (
          <Button onClick={handleConnect} disabled={isLoading}>
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