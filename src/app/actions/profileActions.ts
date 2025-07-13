'use server';

import { put } from '@vercel/blob';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

// --- Existing function for image upload ---
export async function uploadProfileImage(formData: FormData) {
    // ... (no changes to this function)
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, message: 'Unauthorized.' };
    }
    const file = formData.get('profileImage') as File;
    if (!file || file.size === 0) {
        return { success: false, message: 'No file selected.' };
    }
    const blob = await put(file.name, file, { access: 'public' });
    try {
        const client = await clientPromise;
        const db = client.db();
        await db.collection('users').updateOne(
            { _id: new ObjectId(session.user.id) },
            { $set: { image: blob.url } }
        );
    } catch (error) {
        console.error("Database update failed:", error);
        return { success: false, message: 'Failed to update profile picture in database.' };
    }
    revalidatePath('/profile');
    return { success: true, message: 'Profile picture updated!', url: blob.url };
}

// --- NEW FUNCTION TO UPDATE ADDRESS ---
export async function updateAddress(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, message: 'Unauthorized.' };
    }

    // 1. Extract data from the form
    const address = {
        street: formData.get('street') as string,
        city: formData.get('city') as string,
        postalCode: formData.get('postalCode') as string,
        county: formData.get('county') as string,
    };

    // 2. Basic Validation
    if (!address.street || !address.city || !address.postalCode || !address.county) {
        return { success: false, message: 'All address fields are required.' };
    }

    // 3. Update the database
    try {
        const client = await clientPromise;
        const db = client.db();
        await db.collection('users').updateOne(
            { _id: new ObjectId(session.user.id) },
            { $set: { address: address } } // Save the entire address object
        );
    } catch (error) {
        console.error("Address update failed:", error);
        return { success: false, message: 'Failed to save address.' };
    }

    // 4. Revalidate and return success
    revalidatePath('/profile');
    return { success: true, message: 'Address updated successfully!' };
}