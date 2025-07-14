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
  const [isSyncing, setIsSyncing] = useState(false);
  const effectRan = useRef(false);

  // This useEffect is the key. It runs when the dashboard loads.
  useEffect(() => {
    // Check for the special flag from our new callback page.
    const shouldSync = searchParams.get('action') === 'sync_status';

    if (shouldSync && !effectRan.current) {
      effectRan.current = true; // Prevents running multiple times
      
      const token = localStorage.getItem('deriv_api_token');
      if (!token) {
        toast({ title: "Sync Failed", description: "Could not find Deriv token. Please try connecting again.", variant: "destructive" });
        return;
      }
      
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
          
          setPoaStatus(result.status);
          toast({
            title: "Sync Complete!",
            description: `Your status is now: ${result.status.toUpperCase()}`,
            className: "bg-green-500 text-white",
          });
          
        } catch (error) {
          toast({ title: "Sync Failed", description: (error as Error).message, variant: "destructive" });
        } finally {
          router.replace('/dashboard'); // Clean the URL
          setIsSyncing(false);
        }
      };
      
      syncStatus(token);
    }
  }, [searchParams, router, toast]);

  const handleConnect = () => {
    const appId = '85288';
    const scopes = 'read+trading_information';
    // This MUST now point to our new callback page.
    const redirectUri = `${window.location.origin}/auth/callback`; 
    const derivAuthUrl = `https://oauth.deriv.com/oauth2/authorize?app_id=${appId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = derivAuthUrl;
  };

  const renderStatus = () => {
    if (isSyncing) {
       return <Badge variant="secondary" className="text-base"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Syncing...</Badge>;
    }
    // Check for a token in localStorage to decide if we are "connected".
    const isConnected = typeof window !== 'undefined' && !!localStorage.getItem('deriv_api_token');

    if (!isConnected) {
      return <Button onClick={handleConnect}><LinkIcon className="mr-2 h-4 w-4" />Connect Deriv Account</Button>;
    }
    
    // If connected, show the status from the database.
    switch (poaStatus) {
      case 'verified':
        return <Badge variant="success" className="text-base"><CheckCircle2 className="mr-2 h-4 w-4"/>Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-base"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="text-base"><XCircle className="mr-2 h-4 w-4"/>Rejected</Badge>;
      default:
         return <Badge variant="outline">Unknown Status</Badge>;
    }
  };

  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader><CardTitle className="flex items-center justify-between"><span>Proof of Address Status</span>{renderStatus()}</CardTitle></CardHeader>
      <CardContent><p className="text-sm text-muted-foreground">Connect your Deriv account to automatically fetch your Proof of Address (POA) verification status.</p></CardContent>
    </Card>
  );
}