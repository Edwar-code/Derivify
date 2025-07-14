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
  
  // This local state will provide an INSTANT UI update.
  const [poaStatus, setPoaStatus] = useState(initialPoaStatus);
  const [isSyncing, setIsSyncing] = useState(false);
  const effectRan = useRef(false);

  // This hook runs when the dashboard loads after the redirect from Deriv.
  useEffect(() => {
    // Only run this logic once, even if the component re-renders.
    if (effectRan.current) return;

    const shouldSync = searchParams.get('action') === 'sync_status';
    const token = localStorage.getItem('deriv_api_token');

    if (shouldSync && token) {
      effectRan.current = true; // Mark as "processed" to prevent re-running.
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

          // --- THIS IS THE KEY FIX ---
          // 1. Instantly update the UI with the new status from the API.
          setPoaStatus(result.status);
          
          toast({
            title: "Sync Complete!",
            description: `Your status is now: ${result.status.toUpperCase()}`,
            className: "bg-green-500 text-white",
          });
          
          // 2. Silently refresh the server-side data in the background.
          // This ensures the page is consistent with the database without a jarring full reload.
          router.refresh(); 

        } catch (error) {
          toast({ title: "Sync Failed", description: (error as Error).message, variant: "destructive" });
        } finally {
          setIsSyncing(false);
          // 3. Clean the URL so this logic doesn't run again on a manual refresh.
          router.replace('/dashboard'); 
        }
      };
      
      syncStatus(token);
    }
  }, [searchParams, router, toast]);

  const handleConnect = () => {
    const appId = '85288';
    const scopes = 'read+trading_information';
    // This MUST point to our temporary callback page.
    const redirectUri = `${window.location.origin}/auth/callback`; 
    const derivAuthUrl = `https://oauth.deriv.com/oauth2/authorize?app_id=${appId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = derivAuthUrl;
  };

  const renderStatus = () => {
    if (isSyncing) {
       return <Badge variant="secondary" className="text-base"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Syncing...</Badge>;
    }
    
    // The UI now renders based on the `poaStatus` state, which we update instantly.
    switch (poaStatus) {
      case 'verified':
        return <Badge variant="success" className="text-base"><CheckCircle2 className="mr-2 h-4 w-4"/>Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-base"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="text-base"><XCircle className="mr-2 h-4 w-4"/>Rejected</Badge>;
      // If we are not syncing and the status is 'none', it means we need to connect.
      // This also correctly handles the initial state of the page.
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
      <CardContent>
        <p className="text-sm text-muted-foreground">
            Connect your Deriv account to automatically fetch your Proof of Address (POA) verification status.
        </p>
      </CardContent>
    </Card> 
  );
}