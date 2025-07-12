
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

// This is a placeholder component. In a real application, you would fetch user data.
export default function ProfilePage() {

    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        initials: 'JD'
    }

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
                            <AvatarImage src="https://placehold.co/100x100.png" alt="@shadcn" />
                            <AvatarFallback>{user.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                             <h3 className="text-lg font-semibold">{user.name}</h3>
                             <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                     <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={user.name} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue={user.email} disabled />
                        </div>
                    </div>
                     <Button>Update Profile</Button>
                </CardContent>
            </Card>
        </div>
    );
}
