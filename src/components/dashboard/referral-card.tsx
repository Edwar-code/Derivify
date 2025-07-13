'use client'; // This directive marks it as a Client Component

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Copy, CheckCircle } from 'lucide-react';

// Define the properties the component will accept
interface ReferralCardProps {
    referralCode: string;
}

export function ReferralCard({ referralCode }: ReferralCardProps) {
    const [isCopied, setIsCopied] = useState(false);

    // This function handles the copy-to-clipboard logic
    const handleCopy = () => {
        // Ensure there is a valid code to copy
        if (referralCode && referralCode !== 'N/A') {
            navigator.clipboard.writeText(referralCode)
                .then(() => {
                    // Set the state to true to show feedback to the user
                    setIsCopied(true);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Optionally, add user feedback for errors, like a toast notification
                });
        }
    };
    
    // This effect resets the "Copied!" message back to "Copy Code" after 2 seconds
    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => {
                setIsCopied(false);
            }, 2000); // 2000 milliseconds = 2 seconds
            
            // Cleanup function to clear the timer if the component unmounts
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    return (
        <Card className="border-border bg-card shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gift/> Referral Code</CardTitle>
                <CardDescription>Share this code to earn rewards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="border border-dashed border-border rounded-md p-3 text-center">
                    <p className="text-2xl font-mono tracking-widest text-foreground">{referralCode}</p>
                </div>
                <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleCopy}
                    // Disable the button briefly after copying or if there's no code
                    disabled={isCopied || referralCode === 'N/A'}
                >
                    {isCopied ? (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Code
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}