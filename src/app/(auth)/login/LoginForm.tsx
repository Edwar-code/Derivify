'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Only useSearchParams is needed now
import { signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false, // This is correct, we handle outcomes manually
        email: email,
        password: password,
      });

      if (result?.error) {
        toast({
          title: "Login Error",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        // On error, we stop and set loading to false.
        setIsLoading(false); 
      } else {
        // --- THIS IS THE FIX ---
        // On success, show the toast and then force a reliable redirect.
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting...",
          className: "bg-green-500 text-white",
        });

        // Use window.location.href instead of router.push for a more robust redirect after login.
        window.location.href = callbackUrl;
      }
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
    // Note: We don't set isLoading(false) in the success 'else' block because the page will navigate away anyway.
  };

  return (
    <Card>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Log In to Your Account</CardTitle>
        <CardDescription>
          Enter your email and password to access your dashboard.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
           <Button type="submit" className="w-full" disabled={isLoading}>
             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log In
          </Button>
        </CardContent>
      </form>
      <CardFooter className="flex flex-col gap-4">
           <p className="text-xs text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="underline text-primary">
                Sign up
              </Link>
            </p>
      </CardFooter>
    </Card>
  );
}