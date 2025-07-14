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

  // This ref ensures the effect only runs once, even with strict mode re-renders
  const effectRan = useRef(false); 

  useEffect(() => {
    // Check if the effect has already run
    if (effectRan.current === true) {
      return;
    }

    const authCode = searchParams.get('code');

    // If there's a code in the URL, we MUST process it.
    if (authCode) {
      effectRan.current = true; // Mark that we are processing this code
      setIsVerifying(true);
      toast({ title: "Finishing connection...", description: "Securely verifying with Deriv. Please wait." });
      
      // Clean the URL immediately to prevent re-running this on a refresh
      router.replace('/dashboard'); 

      // Define the async function to call our backend
      const exchangeCode = async (code: string) => {
        try {
          const response = await fetch('/api/deriv/exchange-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });
          
          const result = await response.json();

          if (!response.ok || result.error) {
            throw new Error(result.error || 'The server could not complete the connection.');
          }
          
          setPoaStatus(result.status); // Update UI with the new status
          toast({
            title: "Connection Successful!",
            description: `Your Proof of Address status is now: ${result.status.toUpperCase()}`,
            className: "bg-green-500 text-white",
          });

        } catch (error) {
          toast({ title: "Connection Failed", description: (error as Error).message, variant: "destructive" });
        } finally {
          setIsVerifying(false); // Stop the loading spinner
        }
      };

      // Call the function
      exchangeCode(authCode);
    }
  }, [searchParams, router, toast]); // Dependencies are correct

  const handleConnect = () => {
    setIsVerifying(true);
    const appId = '85288';
    const scopes = 'read+trading_information';
    // This MUST match the redirect URL in your Deriv App settings exactly.
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
      <CardHeader><CardTitle className="flex items-center justify-between"><span>Proof of Address Status</span>{renderStatus()}</CardTitle></CardHeader>
      <CardContent><p className="text-sm text-muted-foreground">Connect your Deriv account to automatically fetch your Proof of Address (POA) verification status.</p></CardContent>
    </Card>
  );
}