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
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ensure this import is present

// The page component is now async
export default async function ProfilePage() {
    // Always pass your authOptions to getServerSession to get the full session object
    const session = await getServerSession(authOptions);

    // This check will now work correctly because session.user.id will exist
    if (!session?.user?.id) {
      redirect("/login");
    }

    const userId = session.user.id;
    let user = null;

    try {
        const client = await clientPromise;
        const db = client.db();
        user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    } catch (error) {
        console.error("Profile Page: Error querying database.", error);
        // It's good practice to redirect on database error as well
        redirect("/login?error=DatabaseError");
    }

    // This handles the case where the user ID in the session is no longer in the database
    if (!user) {
      redirect("/login");
    }

    // Helper to get initials from a name string
    const getInitials = (name: string) => {
        if (!name) return "";
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }
    
    // Use the fetched user data with sensible fallbacks
    const userName = user.name ?? "Anonymous User";
    const userEmail = user.email ?? "No email provided";
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
                            <AvatarImage src={user.image ?? ""} alt={userName} />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                        <div>
                             <h3 className="text-lg font-semibold">{userName}</h3>
                             <p className="text-sm text-muted-foreground">{userEmail}</p>
                        </div>
                    </div>
                     <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={userName} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue={userEmail} disabled />
                        </div>
                    </div>
                     <Button>Update Profile</Button>
                </CardContent>
            </Card>
        </div>
    );
}