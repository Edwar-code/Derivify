'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { updateAddress } from '@/app/actions/profileActions';

// Define the shape of the address object
interface Address {
    street?: string;
    city?: string;
    postalCode?: string;
    county?: string;
}

interface AddressFormProps {
    currentAddress: Address;
}

export function AddressForm({ currentAddress }: AddressFormProps) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

    const handleFormAction = (formData: FormData) => {
        startTransition(async () => {
            const result = await updateAddress(formData);
            if (result.success) {
                setMessage({ text: result.message, type: 'success' });
            } else {
                setMessage({ text: result.message, type: 'error' });
            }
        });
    };

    return (
        <Card>
            <form action={handleFormAction}>
                <CardHeader>
                    <CardTitle>Proof of Address</CardTitle>
                    <CardDescription>
                        Enter your address details. This information is required for document verification.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="street">Street Address</Label>
                            <Input id="street" name="street" defaultValue={currentAddress.street ?? ''} placeholder="e.g., 123 Main St" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City / Town</Label>
                            <Input id="city" name="city" defaultValue={currentAddress.city ?? ''} placeholder="e.g., Nairobi" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input id="postalCode" name="postalCode" defaultValue={currentAddress.postalCode ?? ''} placeholder="e.g., 00100" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="county">County</Label>
                            <Input id="county" name="county" defaultValue={currentAddress.county ?? ''} placeholder="e.g., Nairobi County" required />
                        </div>
                    </div>
                    <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Address
                    </Button>
                    {message && (
                        <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                            {message.text}
                        </p>
                    )}
                </CardContent>
            </form>
        </Card>
    );
}