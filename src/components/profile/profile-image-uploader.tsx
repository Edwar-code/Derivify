'use client';

import { useState, useRef, useTransition } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Pen } from 'lucide-react';
import { uploadProfileImage } from '@/app/actions/profileActions';

interface ProfileImageUploaderProps {
    currentImageUrl: string | null;
    userName: string;
}

export function ProfileImageUploader({ currentImageUrl, userName }: ProfileImageUploaderProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getInitials = (name: string) => {
        if (!name) return "";
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create a temporary URL to show a preview of the selected image
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        startTransition(async () => {
            const result = await uploadProfileImage(formData);
            if (!result.success) {
                setError(result.message);
            } else {
                setPreviewUrl(null); // Clear the preview on successful upload
            }
        });
    };

    const handleEditClick = () => {
        fileInputRef.current?.click(); // Programmatically click the hidden file input
    };

    return (
        <form onSubmit={handleFormSubmit} className="flex flex-col items-center gap-4">
            <div className="relative">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={previewUrl || currentImageUrl || ""} alt={userName} />
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                </Avatar>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full bg-background"
                    onClick={handleEditClick}
                >
                    <Pen className="h-4 w-4" />
                </Button>
            </div>
            {/* Hidden file input */}
            <Input
                id="profileImage"
                name="profileImage"
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleFileChange}
            />
            {previewUrl && (
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save New Picture
                </Button>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
    );
}