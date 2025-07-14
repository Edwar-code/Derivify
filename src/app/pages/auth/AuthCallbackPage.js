// pages/auth/callback.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search || window.location.hash.substring(1));
    const accounts = [];
    let i = 1;

    while (params.has(`acct${i}`) && params.has(`token${i}`)) {
      accounts.push({
        id: params.get(`acct${i}`),
        token: params.get(`token${i}`),
        currency: params.get(`cur${i}`),
      });
      i++;
    }

    const error = params.get('error');
    const errorDescription = params.get('error_description');

    if (accounts.length > 0) {
      localStorage.setItem('deriv_api_token', accounts[0].token);
      localStorage.setItem('deriv_accounts', JSON.stringify(accounts));
      toast({ title: "Connection Successful!", description: "Your Deriv account has been securely linked." });
      router.push('/dashboard');
    } else {
      toast({ title: "Connection Failed", description: errorDescription || error || 'No accounts found in the redirect.', variant: "destructive" });
      router.push('/dashboard/settings');
    }
  }, [router, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
