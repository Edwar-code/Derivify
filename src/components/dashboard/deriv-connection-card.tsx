'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, Loader2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DerivConnectionCardProps {
    initialPoaStatus?: string;
}

// A helper component to display the status visually
const StatusDisplay = ({ status }: { status: string }) => {
    switch (status) {
        case 'verified':
            return <div className="flex items-center gap-2 text-green-500"><CheckCircle size={16} /> Verified</div>;
        case 'pending':
            return <div className="flex items-center gap-2 text-yellow-500"><Loader2 size={16} className="animate-spin" /> Pending</div>;
        case 'rejected':
            return <div className="flex items-center gap-2 text-red-500"><XCircle size={16} /> Rejected</div>;
        default:
            return <div className="flex items-center gap-2 text-muted-foreground"><AlertTriangle size={16} /> Not Connected</div>;
    }
};

export function DerivConnectionCard({ initialPoaStatus = 'none' }: DerivConnectionCardProps) {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStatus, setCurrentStatus] = useState(initialPoaStatus);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // This sends the user's private token to your secure backend.
        // It is never exposed in the frontend code.
        const response = await fetch('/api/deriv/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });

        const result = await response.json();
        setIsLoading(false);

        if (!response.ok) {
            setError(result.message || 'Failed to connect. Please check your token.');
        } else {
            setCurrentStatus(result.poaStatus);
            // Refresh the page data from the server to ensure UI is up to date
            router.refresh(); 
        }
    };

    return (
        <Card className="border-border bg-card shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Link size={20}/> Deriv Account Connection</CardTitle>
                <CardDescription>Connect your Deriv account to verify your proof of address status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                    <span className="text-sm font-medium">Proof of Address Status:</span>
                    <span className="font-bold"><StatusDisplay status={currentStatus} /></span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="deriv-token">Deriv API Token</Label>
                        <Input
                            id="deriv-token"
                            type="password"
                            placeholder="Enter your token with 'read' scope"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            disabled={isLoading}
                        />
                         <p className="text-xs text-muted-foreground pt-1">
                            Your token is kept private and only used for status checks.
                        </p>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading || !token}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {currentStatus !== 'none' ? 'Reconnect / Refresh Status' : 'Connect Account'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}