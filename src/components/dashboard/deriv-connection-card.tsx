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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const derivStatus = searchParams.get('deriv_status');
    if (derivStatus === 'success') {
      toast({
        title: "Connection Successful",
        description: "Your Deriv account has been linked.",
        className: "bg-green-500 text-white",
      });
      router.replace('/dashboard');
    } else if (derivStatus === 'error') {
      toast({
        title: "Connection Failed",
        description: "Could not link your Deriv account. Please try again.",
        variant: "destructive",
      });
      router.replace('/dashboard');
    }
  }, [searchParams, router, toast]);

  const handleConnect = () => {
    setIsLoading(true);
    
    // --- CORRECTED APP ID ---
    const appId = '85288'; 
    
    // --- CORRECTED SCOPES ---
    const scopes = 'read+payments+trade+trading_information+admin';

    const redirectUri = `${window.location.origin}/api/deriv/callback`;
    
    const derivAuthUrl = `https://oauth.deriv.com/oauth2/authorize?app_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}`;
    
    window.location.href = derivAuthUrl;
  };

  const renderStatus = () => {
    // ... (This part remains the same as before) ...
    switch (initialPoaStatus) {
      case 'verified':
        return <Badge variant="success" className="text-lg"><CheckCircle2 className="mr-2 h-5 w-5"/>Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-lg"><Loader2 className="mr-2 h-5 w-5 animate-spin"/>Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="text-lg"><XCircle className="mr-2 h-5 w-5"/>Rejected</Badge>;
      case 'none':
      default:
        return (
          <Button onClick={handleConnect} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LinkIcon className="mr-2 h-4 w-4" />}
            Connect to Deriv
          </Button>
        );
    }
  };

  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Deriv Account Connection</span>
          {renderStatus()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Connect your Deriv account to automatically check the status of your Proof of Address (POA) verification.
        </p>
      </CardContent>
    </Card>
  );
}