'use client';

import { useState, useEffect, useRef } from 'react';
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
  
  const [poaStatus, setPoaStatus] = useState(initialPoaStatus);
  const [isVerifying, setIsVerifying] = useState(false);
  const hasRun = useRef(false); // Prevents running the effect multiple times

  useEffect(() => {
    const authCode = searchParams.get('code');

    // Only run if there is a code AND we haven't already tried to process it.
    if (authCode && !hasRun.current) {
      hasRun.current = true; // Mark as "processed" immediately
      setIsVerifying(true);
      toast({ title: "Finishing connection...", description: "Securely verifying with Deriv. Please wait." });

      const exchangeCode = async (code: string) => {
        try {
          const response = await fetch('/api/deriv/exchange-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });
          
          const result = await response.json();

          if (!response.ok || result.error) {
            // Throw the specific error message from the server
            throw new Error(result.error || 'The server could not verify your connection.');
          }
          
          setPoaStatus(result.status);
          toast({
            title: "Connection Successful!",
            description: "Your Proof of Address status has been updated.",
            className: "bg-green-500 text-white",
          });

        } catch (error) {
          // Display the specific error message in the toast
          toast({ title: "Connection Failed", description: (error as Error).message, variant: "destructive" });
        } finally {
          router.replace('/dashboard');
          setIsVerifying(false);
        }
      };

      exchangeCode(authCode);
    }
  }, [searchParams, router, toast]);

  const handleConnect = () => {
    setIsVerifying(true);
    const appId = '85288';
    const scopes = 'read+trading_information';
    const redirectUri = `${window.location.origin}/dashboard`; 
    const derivAuthUrl = `https://oauth.deriv.com/oauth2/authorize?app_id=${appId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = derivAuthUrl;
  };

  const renderStatus = () => {
    if (isVerifying) {
       return <Badge variant="secondary" className="text-base"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Verifying...</Badge>;
    }
    switch (poaStatus) {
      case 'verified':
        return <Badge variant="success" className="text-base"><CheckCircle2 className="mr-2 h-4 w-4"/>Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-base"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="text-base"><XCircle className="mr-2 h-4 w-4"/>Rejected</Badge>;
      case 'none':
      default:
        return <Button onClick={handleConnect}><LinkIcon className="mr-2 h-4 w-4" />Connect Deriv Account</Button>;
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
      <CardContent><p className="text-sm text-muted-foreground">Connect your Deriv account to automatically fetch your Proof of Address (POA) verification status.</p></CardContent>
    </Card>
  );
}