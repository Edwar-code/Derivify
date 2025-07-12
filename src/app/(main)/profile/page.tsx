import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// --- SERVER-SIDE DATA FETCHING ---
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// The page component is now async
export default async function ProfilePage() {
    const session = await getServerSession();

    if (!session || !session.user || !(session.user as any).id) {
      redirect("/login");
    }

    const userId = (session.user as any).id;

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      redirect("/login");
    }

    // Helper to get initials from name
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }
    
    // Use real user data with fallbacks
    const userName = user.name ?? "User";
    const userEmail = user.email ?? "No email";
    const userInitials = getInitials(userName);

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
                <p className="text-muted-foreground">View and manage your account details.</p>
            </div>
            <Card className="border-border bg-card shadow-md">
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Your personal and contact information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            {/* You can use a real avatar URL if you store one */}
                            <AvatarImage src={user.image ?? ""} alt={userName} />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                        <div>
                             {/* DYNAMIC DATA */}
                             <h3 className="text-lg font-semibold">{userName}</h3>
                             <p className="text-sm text-muted-foreground">{userEmail}</p>
                        </div>
                    </div>
                     <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            {/* DYNAMIC DATA */}
                            <Input id="name" defaultValue={userName} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                             {/* DYNAMIC DATA */}
                            <Input id="email" type="email" defaultValue={userEmail} disabled />
                        </div>
                    </div>
                     <Button>Update Profile</Button>
                </CardContent>
            </Card>
        </div>
    );
}