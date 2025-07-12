
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

type Withdrawal = {
    _id: string;
    amount: number;
    currency: string;
    status: string;
    requestedAt: string;
    // userId and userEmail would be here in a real app
};

async function getWithdrawals() {
    const res = await fetch('/api/admin/withdrawals/list');
    if (!res.ok) {
        throw new Error('Failed to fetch withdrawals');
    }
    return res.json();
}

async function updateWithdrawalStatus(withdrawalId: string, status: string) {
    const response = await fetch('/api/admin/withdrawals/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawalId, status }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update withdrawal status');
    }
    return response.json();
}

export default function AdminWithdrawalsPage() {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchWithdrawals = async () => {
        setIsLoading(true);
        try {
            const data = await getWithdrawals();
            setWithdrawals(data);
        } catch (error) {
            toast({
                title: "Error fetching withdrawals",
                description: "Could not retrieve withdrawal data.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

     useEffect(() => {
        fetchWithdrawals();
    }, []);

    const handleStatusChange = async (withdrawalId: string, status: 'Approved' | 'Rejected') => {
        try {
            await updateWithdrawalStatus(withdrawalId, status);
             toast({
                title: "Status Updated",
                description: `Withdrawal has been ${status}.`,
                className: "bg-green-500 text-white",
            });
            fetchWithdrawals(); // Refresh list
        } catch (error: any) {
             toast({
                title: "Update Failed",
                description: error.message,
                variant: "destructive",
            });
        }
    };


    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Approved': return 'default';
            case 'Pending': return 'secondary';
            case 'Rejected': return 'destructive';
            default: return 'outline';
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Withdrawals</CardTitle>
                <CardDescription>Approve or reject withdrawal requests from users.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                     <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">Loading requests...</TableCell>
                            </TableRow>
                        ) : withdrawals.length > 0 ? withdrawals.map((w: Withdrawal) => (
                            <TableRow key={w._id}>
                                <TableCell className="font-mono text-xs">#{w._id.slice(-6).toUpperCase()}</TableCell>
                                <TableCell>{new Date(w.requestedAt).toLocaleDateString()}</TableCell>
                                <TableCell>{w.currency} {w.amount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(w.status) as any}>{w.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {w.status === 'Pending' && (
                                        <div className="flex gap-2 justify-end">
                                            <Button size="sm" variant="outline" onClick={() => handleStatusChange(w._id, 'Approved')}>
                                                <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleStatusChange(w._id, 'Rejected')}>
                                                <XCircle className="mr-2 h-4 w-4" /> Reject
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No withdrawal requests found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
