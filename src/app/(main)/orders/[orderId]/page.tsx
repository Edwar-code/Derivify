'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";


async function updateOrderDetails(orderId: string, details: any) {
    const response = await fetch('/api/orders/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, details }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order');
    }

    return response.json();
}


export default function OrderDetailsPage({ params }: { params: { orderId: string } }) {
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const details = {
            fullName: formData.get('fullName'),
            idNumber: formData.get('idNumber'),
            address: formData.get('address'),
            dob: formData.get('dob'),
        };

        try {
            await updateOrderDetails(params.orderId, details);
            toast({
                title: "Details Submitted!",
                description: "Your information has been sent for processing. We will notify you once your document is ready.",
                className: "bg-green-500 text-white",
            });
            setTimeout(() => router.push('/orders'), 2000);
        } catch (error: any) {
             toast({
                title: "Submission Failed",
                description: error.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        }
    }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Submit Your Details</CardTitle>
          <CardDescription>
            Please provide the necessary information to personalize your document. Order ID: #{params.orderId.slice(-6).toUpperCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" placeholder="e.g., John Doe" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="idNumber">National ID Number</Label>
                    <Input id="idNumber" name="idNumber" placeholder="e.g., 12345678" required />
                </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Full Residential Address</Label>
              <Textarea id="address" name="address" placeholder="e.g., Apt 123, 456 Main St, Nairobi, Kenya" required />
              <p className="text-xs text-muted-foreground">
                Make sure this address matches what you need for verification.
              </p>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" name="dob" type="date" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="documentUpload">Upload Supporting Document (Optional)</Label>
                <Input id="documentUpload" name="documentUpload" type="file" />
                <p className="text-xs text-muted-foreground">
                    You can upload a copy of your ID to speed up the process.
                </p>
            </div>

            <Button type="submit" className="w-full">
              Submit for Processing
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
