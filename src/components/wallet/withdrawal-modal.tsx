
'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface WithdrawalModalProps {
  currentBalance: number;
}

async function createWithdrawalRequest(amount: number) {
    const response = await fetch('/api/withdrawals/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create withdrawal request');
    }

    return response.json();
}

export function WithdrawalModal({ currentBalance }: WithdrawalModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const MINIMUM_WITHDRAWAL = 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const withdrawalAmount = parseFloat(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
        toast({
            title: "Invalid Amount",
            description: "Please enter a valid withdrawal amount.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    if (withdrawalAmount < MINIMUM_WITHDRAWAL) {
        toast({
            title: "Minimum Withdrawal",
            description: `The minimum withdrawal amount is KES ${MINIMUM_WITHDRAWAL}.`,
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

     if (withdrawalAmount > currentBalance) {
        toast({
            title: "Insufficient Funds",
            description: "Your withdrawal amount exceeds your available balance.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    try {
        await createWithdrawalRequest(withdrawalAmount);
        toast({
            title: "Request Submitted!",
            description: "Your withdrawal request has been sent for processing.",
            className: "bg-green-500 text-white",
        });
        setIsOpen(false);
        setAmount('');
    } catch (error: any) {
         toast({
            title: "Submission Failed",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Withdraw Funds</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
          <DialogDescription>
            Enter the amount you wish to withdraw. Minimum is KES {MINIMUM_WITHDRAWAL}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="amount">Amount (KES)</Label>
                <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`e.g., ${MINIMUM_WITHDRAWAL}`}
                    required
                />
            </div>
            <p className="text-sm text-muted-foreground">
                Available Balance: <span className="font-bold text-foreground">KES {currentBalance.toFixed(2)}</span>
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
