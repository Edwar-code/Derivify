
'use client'

import React, { useState, useEffect } from 'react';
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

interface PaymentModalProps {
  document: Document;
}

export function PaymentModal({ document }: PaymentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Mock user for now since auth is disabled
  const user = {
    uid: 'mock-user-id',
    displayName: 'John Doe',
    email: 'john.doe@example.com'
  }

  useEffect(() => {
    // We can pre-fill this if we have user data later
    // For now, it will be empty initially
  }, []);

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: document.price * 100, // Paystack amount is in kobo/cents
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    currency: 'KES',
    metadata: {
      user_id: user?.uid, // Using mock user ID
      document_name: document.name,
      customer_name: name,
    },
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    console.log('Payment successful on client. Reference:', reference);
    setIsLoading(false);
    setIsOpen(false);
    toast({
      title: 'Payment Successful!',
      description: `Your order for ${document.name} has been placed. Please check your orders to submit details.`,
      className: 'bg-green-500 text-white',
    });
    // The webhook will handle creating the order in the database.
  };

  const onClose = () => {
    console.log('Payment modal closed.');
    setIsLoading(false);
  };

  const handlePaystackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
        toast({
            title: "Error",
            description: "Please fill in your name and email.",
            variant: "destructive",
        })
        return;
    }
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
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            You are purchasing the <span className="font-bold text-primary">{document.name}</span> for KES {document.price}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePaystackSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <DialogFooter>
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
