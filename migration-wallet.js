// This is a standalone Node.js script. Run it from your terminal with `node migration-wallet.js`

const { MongoClient } = require('mongodb');

// --- IMPORTANT: PASTE YOUR MONGODB CONNECTION STRING HERE ---
// You can copy this from your .env.local file
const MONGODB_URI = "mongodb+srv://mbesha37:Edward_2004@derivify.xh6xj3w.mongodb.net/test?retryWrites=true&w=majority&appName=Derivify&tls=true";

// This is the name of your database
const DB_NAME = "test"; // Replace with your actual database name

async function runWalletMigration() {
    if (!MONGODB_URI || MONGODB_URI.includes('<user>')) {
        console.error("ERROR: Please set your MONGODB_URI at the top of the script.");
        return;
    }
    if (!DB_NAME || DB_NAME === "your_db_name") {
        console.error("ERROR: Please set your DB_NAME at the top of the script.");
        return;
    }

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const usersCollection = db.collection('users');

        console.log("Connected to database successfully.");

        // Find all users where the 'walletBalance' field does NOT exist
        const query = { walletBalance: { $exists: false } };

        // Define the update to set 'walletBalance' to 0
        const updateDoc = {
            $set: { walletBalance: 0 },
        };

        // Use updateMany() to add the field to all matching documents
        const result = await usersCollection.updateMany(query, updateDoc);

        console.log(`\nMigration complete!`);
        console.log(`${result.matchedCount} user(s) were found without a walletBalance field.`);
        console.log(`${result.modifiedCount} user(s) were successfully updated.`);

        if (result.matchedCount === 0) {
            console.log("All users already have a walletBalance field. No updates were needed.");
        }

    } catch (error) {
        console.error("An error occurred during the migration:", error);
    } finally {
        // Ensure the database connection is closed
        await client.close();
        console.log("\nDatabase connection closed.");
    }
}

// Run the main function
runWalletMigration();