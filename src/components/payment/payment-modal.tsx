'use client'

import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
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

interface Document {
  id: string;
  name: string;
  price: number;
}

// --- UPDATED PROPS ---
interface PaymentModalProps {
  document: Document;
  userId: string;
  userEmail: string;
  userName: string;
  usedReferralCode?: string | null;
}

export function PaymentModal({ document, userId, userEmail, userName, usedReferralCode }: PaymentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const config = {
    reference: new Date().getTime().toString(),
    email: userEmail, // Use the logged-in user's email
    amount: document.price * 100, // Paystack amount is in kobo/cents
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    currency: 'KES',
    metadata: {
      // --- CRITICAL METADATA FOR BACKEND ---
      payingUserId: userId, 
      document_name: document.name,
      customer_name: userName,
      usedReferralCode: usedReferralCode || '',
    },
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = () => {
    setIsLoading(false);
    setIsOpen(false);
    toast({
      title: 'Payment Successful!',
      description: `Your order for ${document.name} has been placed. Please check 'My Orders'.`,
      className: 'bg-green-500 text-white',
    });
  };

  const onClose = () => {
    setIsLoading(false);
  };

  const handlePaystackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    initializePayment({ onSuccess, onClose });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 w-24">Purchase</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Confirm Your Purchase</DialogTitle>
          <DialogDescription>
            You are purchasing the <span className="font-bold text-primary">{document.name}</span> for KES {document.price}. The payment details will use your registered name and email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePaystackSubmit}>
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay KES ${document.price}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}