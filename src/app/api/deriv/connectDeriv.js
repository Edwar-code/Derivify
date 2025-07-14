import clientPromise from '../../../lib/mongodb'; // Adjust the path as necessary
import { ObjectId } from 'mongodb';

export default async function connectDerivAccount(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId } = req.body; // Ensure userId is passed in the request body

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const client = await clientPromise;
    const db = client.db(); // Use the appropriate database name if needed

    // Logic to connect to Deriv
    const response = await fetch('https://api.deriv.com/connect', {
        method: 'POST',
        body: JSON.stringify({ userId }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const data = await response.json();
        const poaStatus = data.status; // e.g., 'verified', 'pending', etc.

        // Update user's POA status in the database
        await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $set: { derivPoaStatus: poaStatus } }
        );

        return res.status(200).json({ message: 'Connection successful', poaStatus });
    } else {
        // Handle error, e.g., set status to 'rejected'
        await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $set: { derivPoaStatus: 'rejected' } }
        );

        return res.status(400).json({ message: 'Connection failed', poaStatus: 'rejected' });
    }
}
