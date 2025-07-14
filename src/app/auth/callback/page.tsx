// File Path: src/app/auth/callback/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Deriv sends tokens in the URL's hash (#) part. We must parse it.
    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get('token1'); // The token is in `token1`
    const accountId = params.get('acct1');
    const error = params.get('error');

    if (token && accountId) {
      // SUCCESS: We got the token. Save it.
      localStorage.setItem('deriv_api_token', token);
      localStorage.setItem('deriv_account_id', accountId);

      toast({
        title: "Authorization Successful!",
        description: "Your Deriv account is now linked.",
      });
      
      // Redirect to the dashboard with a special flag to trigger the status sync.
      router.push('/dashboard?action=sync_status');

    } else {
      // FAILURE: Something went wrong on Deriv's side.
      toast({
        title: "Connection Failed",
        description: `Could not connect to Deriv. Reason: ${error || 'No account information was returned.'}`,
        variant: "destructive",
      });
      router.push('/dashboard'); 
    }
  }, [router, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
       <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
           <CardTitle className="text-2xl text-center">Finalizing Connection</CardTitle>
          <CardDescription className="text-center">
            Please wait while we securely process your information. Do not close this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}