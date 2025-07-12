
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import clientPromise from "@/lib/mongodb";
import { unstable_noStore as noStore } from 'next/cache';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";


type Order = {
    _id: string;
    documentName: string;
    createdAt: string;
    status: string;
    amount: number;
    currency: string;
    customerEmail: string;
    details?: {
        fullName: string;
        idNumber: string;
        address: string;
        dob: string;
    }
}

async function getOrders() {
    // This fetch call will be replaced by a direct db query in a server component version
    const res = await fetch('/api/admin/orders/list');
    if (!res.ok) {
        throw new Error('Failed to fetch orders');
    }
    return res.json();
}

async function updateOrderStatus(orderId: string, status: string) {
    const response = await fetch('/api/admin/orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order status');
    }
    return response.json();
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            toast({
                title: "Error fetching orders",
                description: "Could not retrieve order data.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, status: string) => {
        try {
            await updateOrderStatus(orderId, status);
            toast({
                title: "Status Updated",
                description: `Order has been marked as ${status}.`,
                className: "bg-green-500 text-white",
            });
            fetchOrders(); // Refresh the list
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
            case 'Completed': return 'default';
            case 'Processing': return 'secondary';
            case 'Awaiting Details': return 'destructive';
            default: return 'outline';
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Orders</CardTitle>
                <CardDescription>View, manage, and process all customer orders.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Document</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">Loading orders...</TableCell>
                            </TableRow>
                        ) : orders.length > 0 ? orders.map((order: Order) => (
                            <TableRow key={order._id}>
                                <TableCell>
                                    <div className="font-medium">{order.details?.fullName || 'N/A'}</div>
                                    <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                                </TableCell>
                                <TableCell>{order.documentName}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onSelect={() => alert(JSON.stringify(order.details, null, 2))}>
                                                View Details
                                            </DropdownMenuItem>
                                             <DropdownMenuSeparator />
                                            <DropdownMenuItem onSelect={() => handleStatusChange(order._id, 'Processing')}>
                                                Mark as Processing
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleStatusChange(order._id, 'Completed')}>
                                                Mark as Completed
                                            </DropdownMenuItem>
                                            {order.status === 'Completed' && (
                                                <DropdownMenuItem>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download Document
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No orders found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
