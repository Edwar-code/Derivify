
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import clientPromise from "@/lib/mongodb";
import { unstable_noStore as noStore } from 'next/cache';

async function getOrders() {
    noStore(); // Ensure data is fetched on every request
    try {
        const client = await clientPromise;
        const db = client.db();
        const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();
        // MongoDB returns _id as an object, we need to convert it to a string for the client component
        return JSON.parse(JSON.stringify(orders));
    } catch (e) {
        console.error("Database error:", e);
        return [];
    }
}

type Order = {
    _id: string;
    documentName: string;
    createdAt: string;
    status: string;
    amount: number;
    currency: string;
}

export default async function OrdersPage() {
    const orders = await getOrders();

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Completed': return 'default';
            case 'Processing': return 'secondary';
            case 'Awaiting Details': return 'destructive';
            default: return 'outline';
        }
    }

  return (
    <div className="space-y-8">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
            <p className="text-muted-foreground">Track the status of your document purchases.</p>
        </div>
        <Card className="border-border bg-card shadow-md">
            <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>A list of your recent document purchases.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Order ID</TableHead>
                            <TableHead>Document</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length > 0 ? orders.map((order: Order) => (
                            <TableRow key={order._id} className="hover:bg-accent">
                                <TableCell className="font-medium text-xs">#{order._id.slice(-6).toUpperCase()}</TableCell>
                                <TableCell>{order.documentName}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{order.currency} {order.amount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {order.status === 'Awaiting Details' && (
                                        <Button asChild size="sm" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                                            <Link href={`/orders/${order._id}`}>Submit Details</Link>
                                        </Button>
                                    )}
                                     {order.status === 'Completed' && (
                                        <Button size="sm">Download</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">No orders found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
