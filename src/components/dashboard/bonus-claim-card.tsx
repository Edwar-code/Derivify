'use client';
import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { claimReferralBonuses } from '@/app/actions/walletActions';

export function BonusClaimCard({ amount }: { amount: number }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleClaim = () => {
        startTransition(async () => {
            const result = await claimReferralBonuses();
            if (result.success) {
                toast({ title: 'Success!', description: result.message, className: 'bg-green-500 text-white' });
            } else {
                toast({ title: 'Error', description: result.message, variant: 'destructive' });
            }
        });
    }

    if (amount <= 0) {
        return null; // Don't show the card if there's nothing to claim
    }

    return (
        <Card className="col-span-1 md:col-span-2 border-green-500 bg-green-500/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gift /> Referral Bonus</CardTitle>
                <CardDescription>You have unclaimed referral bonuses!</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                <p className="text-2xl font-bold">KES {amount.toFixed(2)}</p>
                <Button onClick={handleClaim} disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Claim to Wallet
                </Button>
            </CardContent>
        </Card>
    );
}