import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { ProfileImageUploader } from "@/components/profile/profile-image-uploader";
import { AddressForm } from "@/components/profile/address-form"; // Import the new component

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    let user = null;
    try {
        const client = await clientPromise;
        const db = client.db();
        user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) });
    } catch (error) {
        console.error("Profile Page: Error querying database.", error);
        redirect("/login?error=DatabaseError");
    }

    if (!user) redirect("/login");

    async function updateProfileName(formData: FormData) {
        'use server';
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) throw new Error("Unauthorized");
        const newName = formData.get("name") as string;
        if (!newName || newName.trim().length < 2) throw new Error("Name is too short.");
        try {
            const client = await clientPromise;
            const db = client.db();
            await db.collection("users").updateOne({ _id: new ObjectId(session.user.id) }, { $set: { name: newName.trim() } });
        } catch (error) {
            throw new Error("Database update failed.");
        }
        revalidatePath("/profile");
    }

    const userName = user.name ?? "Anonymous User";
    const userEmail = user.email ?? "No email provided";
    const userImage = user.image ?? null;
    // Fetch the user's address, providing a default empty object if it doesn't exist
    const userAddress = user.address ?? {};

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
                <p className="text-muted-foreground">View and manage your account details.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Upload a new profile picture.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileImageUploader currentImageUrl={userImage} userName={userName} />
                </CardContent>
            </Card>

            {/* --- NEW ADDRESS FORM CARD --- */}
            <AddressForm currentAddress={userAddress} />

            <Card>
                <form action={updateProfileName}>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>Update your personal and contact information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" defaultValue={userName} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue={userEmail} disabled />
                            </div>
                        </div>
                        <Button type="submit">Update Name</Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}