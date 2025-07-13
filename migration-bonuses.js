const { MongoClient } = require('mongodb');
const MONGODB_URI = "mongodb+srv://mbesha37:Edward_2004@derivify.xh6xj3w.mongodb.net/test?retryWrites=true&w=majority&appName=Derivify&tls=true"; // PASTE YOUR URI
const DB_NAME = "test"; // PASTE YOUR DB NAME

async function runBonusMigration() {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const result = await db.collection('users').updateMany(
            { referralBonuses: { $exists: false } }, // Find users without the field
            { $set: { referralBonuses: [] } } // Add the empty array
        );
        console.log(`${result.modifiedCount} users updated.`);
    } finally {
        await client.close();
    }
}
runBonusMigration();