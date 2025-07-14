'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { LinkIcon, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface DerivConnectionCardProps {
  initialPoaStatus: 'none' | 'pendiing' | 'verified' | 'rejected';
}

export function DerivConnectionCard({ initialPoaStatus }: DerivConnectionCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [isSyncing, setIsSyncing] = useState(false);

  // This hook now only does one thing: trigger the backend sync.
  useEffect(() => {
    const shouldSync = searchParams.get('action') === 'sync_status';
    const token = localStorage.getItem('deriv_api_token');

    if (shouldSync && token) {
      setIsSyncing(true);
      toast({ title: "Syncing Status...", description: "Fetching latest Proof of Address status from Deriv." });
      
      const syncStatus = async (apiToken: string) => {
        try {
          const response = await fetch('/api/deriv/sync-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: apiToken }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error);

          // On success, we simply reload the page.
          // Because the revalidatePath() function ran on the server,
          // this reload is guaranteed to fetch the new, updated page.
          window.location.href = '/dashboard'; 
          
        } catch (error) {
          toast({ title: "Sync Failed", description: (error as Error).message, variant: "destructive" });
          setIsSyncing(false);
          router.replace('/dashboard'); // Clean URL on failure too
        }
      };
      
      syncStatus(token);
      // Remove the token after using it for sync to enforce reconnecting for fresh data if needed.
      localStorage.removeItem('deriv_api_token');
    }
  }, []); // Run only once

  const handleConnect = () => {
    const appId = '85288';
    const scopes = 'read+trading_information';
    const redirectUri = `${window.location.origin}/auth/callback`; 
    const derivAuthUrl = `https://oauth.deriv.com/oauth2/authorize?app_id=${appId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = derivAuthUrl;
  };

  const renderStatus = () => {
    if (isSyncing) {
       return <Badge variant="secondary" className="text-base"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Syncing...</Badge>;
    }
    
    switch (initialPoaStatus) {
      case 'verified':
        return <Badge variant="success" className="text-base"><CheckCircle2 className="mr-2 h-4 w-4"/>Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-base"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="text-base"><XCircle className="mr-2 h-4 w-4"/>Rejected</Badge>;
      default:
        return <Button onClick={handleConnect}><LinkIcon className="mr-2 h-4 w-4" />Connect Deriv Account</Button>;
    }
  };

  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader><CardTitle className="flex items-center justify-between"><span>Proof of Address Status</span>{renderStatus()}</CardTitle></CardHeader>
      <CardContent><p className="text-sm text-muted-foreground">Connect your Deriv account to fetch your Proof of Address (POA) status.</p></CardContent>
    </d>
  );
}