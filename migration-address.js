// This is a standalone Node.js script. Run it from your terminal with `node migration-address.js`

const { MongoClient } = require('mongodb');

// --- IMPORTANT: PASTE YOUR MONGODB CONNECTION STRING HERE ---
const MONGODB_URI = "mongodb+srv://mbesha37:Edward_2004@derivify.xh6xj3w.mongodb.net/test?retryWrites=true&w=majority&appName=Derivify&tls=true";
const DB_NAME = "test"; // Replace with your actual database name

async function runAddressMigration() {
    if (!MONGODB_URI || MONGODB_URI.includes('<user>') || !DB_NAME || DB_NAME === "your_db_name") {
        console.error("ERROR: Please configure your MONGODB_URI and DB_NAME at the top of the script.");
        return;
    }

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const usersCollection = db.collection('users');
        console.log("Connected to database successfully.");

        // Find all users where the 'address' field does NOT exist
        const query = { address: { $exists: false } };

        // Define the update to set 'address' to an empty object
        const updateDoc = {
            $set: { 
                address: {
                    street: "",
                    city: "",
                    postalCode: "",
                    county: ""
                } 
            },
        };

        const result = await usersCollection.updateMany(query, updateDoc);
        console.log(`\nMigration complete! ${result.modifiedCount} user(s) were updated.`);

    } catch (error) {
        console.error("An error occurred during the migration:", error);
    } finally {
        await client.close();
        console.log("\nDatabase connection closed.");
    }
}

runAddressMigration();