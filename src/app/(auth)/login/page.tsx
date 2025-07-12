'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false, // Handle redirect manually
        email: email,
        password: password,
      });

      if (result?.error) {
        throw new Error(result.error);
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          className: "bg-green-500 text-white",
        });
        router.push(callbackUrl);
      }
    } catch (error: any) {
      toast({
        title: "Login Error",
        // 'CredentialsSignin' is the default error code from next-auth
        description: error.message === 'CredentialsSignin' ? "Invalid email or password." : error.message,
        variant: "destructive",
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    // The user will be redirected to Google and then back to the callbackUrl
    await signIn('google', { callbackUrl });
    // No need to handle success/error here as the page will redirect.
    // The loading state will persist until the redirect happens.
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
              disabled={isLoading || isGoogleLoading}
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
              disabled={isLoading || isGoogleLoading}
            />
          </div>
           <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log In
          </Button>
        </CardContent>
      </form>
       <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                Or continue with
                </span>
            </div>
        </div>
        <CardFooter className="flex flex-col gap-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
                {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                   <Image src="/google.svg" width={16} height={16} alt="Google logo" className="mr-2" />
                )}
                Google
            </Button>
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