// pages/settings.js
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [authUrl, setAuthUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("deriv_api_token");
    if (storedToken) {
      setIsConnected(true);
    }

    const APP_ID = 82243; // Replace with your actual app ID
    if (typeof window !== 'undefined') {
      const redirectUri = new URL('/auth/callback', window.location.origin).href;
      const encodedRedirectUri = encodeURIComponent(redirectUri);
      setAuthUrl(`https://oauth.deriv.com/oauth2/authorize?app_id=${APP_ID}&redirect_uri=${encodedRedirectUri}&l=EN&scopes=read,trade`);
    }
    setIsLoading(false);
  }, []);

  const handleDisconnect = () => {
    localStorage.removeItem("deriv_api_token");
    localStorage.removeItem("deriv_account_id");
    localStorage.removeItem("deriv_accounts");
    setIsConnected(false);
    toast({
      title: "Disconnected",
      description: "Your Deriv account has been disconnected.",
    });
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and connections.
        </p>
      </div>
      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Deriv Connection</CardTitle>
            <CardDescription>
              {isConnected
                ? "You are securely connected to Deriv."
                : "Link your Deriv account to start trading."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div>
                <div className="flex items-center p-4 bg-green-500/10 border border-green-500/20 rounded-md mb-4">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <p className="text-sm text-green-400">
                    Status: <span className="font-semibold">Connected</span>
                  </p>
                </div>
                <Button onClick={handleDisconnect} variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" /> Disconnect
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button asChild disabled={!authUrl || isLoading}>
                  <a href={authUrl} target="_top">
                    <LinkIcon className="mr-2 h-4 w-4" /> Connect with Deriv
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Account Information</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
