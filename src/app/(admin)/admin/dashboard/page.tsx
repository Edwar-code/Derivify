
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListOrdered, Wallet, CheckCircle } from "lucide-react";
import clientPromise from "@/lib/mongodb";
import { unstable_noStore as noStore } from 'next/cache';
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getStats() {
    noStore();
    try {
        const client = await clientPromise;
        const db = client.db();
        const pendingOrders = await db.collection("orders").countDocuments({ status: 'Processing' });
        const awaitingDetails = await db.collection("orders").countDocuments({ status: 'Awaiting Details' });
        const pendingWithdrawals = await db.collection("withdrawals").countDocuments({ status: 'Pending' });

        return { pendingOrders: pendingOrders + awaitingDetails, pendingWithdrawals };
    } catch (e) {
        console.error("Database error:", e);
        return { pendingOrders: 0, pendingWithdrawals: 0 };
    }
}


export default async function AdminDashboardPage() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">An overview of your application's activity.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Orders
                        </CardTitle>
                        <ListOrdered className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Orders that need processing or details.
                        </p>
                         <Button asChild size="sm" className="mt-4">
                            <Link href="/admin/orders">View Orders</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Withdrawals
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingWithdrawals}</div>
                        <p className="text-xs text-muted-foreground">
                            Withdrawal requests that need approval.
                        </p>
                         <Button asChild size="sm" className="mt-4">
                            <Link href="/admin/withdrawals">View Withdrawals</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
