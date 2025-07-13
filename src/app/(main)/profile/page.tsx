import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache"; // Import revalidatePath

// --- SERVER-SIDE DATA FETCHING ---
export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

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
        redirect("/login?error=DatabaseError");
    }

    if (!user) {
        redirect("/login");
    }

    // --- SERVER-SIDE ACTION FOR UPDATING THE PROFILE ---
    async function updateProfile(formData: FormData) {
        'use server'; // This directive marks the function as a Next.js Server Action

        // 1. Get the current session to ensure the user is still logged in.
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            // It's good practice to handle this edge case.
            throw new Error("You must be signed in to perform this action.");
        }
        
        // 2. Extract the new name from the form data.
        const newName = formData.get("name") as string;
        
        // 3. Basic validation.
        if (!newName || newName.trim().length < 2) {
            throw new Error("Name must be at least 2 characters long.");
        }

        // 4. Update the document in the database.
        try {
            const client = await clientPromise;
            const db = client.db();
            await db.collection("users").updateOne(
                { _id: new ObjectId(session.user.id) },
                { $set: { name: newName.trim() } }
            );
        } catch (error) {
            console.error("Failed to update user profile:", error);
            // In a real app, you might want to return a more user-friendly error.
            throw new Error("Failed to update profile in the database.");
        }
        
        // 5. Revalidate the path to refresh the UI with the new data.
        // This tells Next.js to re-render the page on the server with the updated
        // information from the database.
        revalidatePath("/profile"); 
    }

    // Helper to get initials from a name string
    const getInitials = (name: string) => {
        if (!name) return "";
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }
    
    const userName = user.name ?? "Anonymous User";
    const userEmail = user.email ?? "No email provided";
    const userInitials = getInitials(userName);

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
                <p className="text-muted-foreground">View and manage your account details.</p>
            </div>
            {/* The form now wraps the content that needs to be submitted */}
            <form action={updateProfile}>
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
                                {/* The `name` attribute is crucial for accessing form data */}
                                <Input id="name" name="name" defaultValue={userName} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue={userEmail} disabled />
                            </div>
                        </div>
                        {/* The button is now of type "submit" */}
                        <Button type="submit">Update Profile</Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}