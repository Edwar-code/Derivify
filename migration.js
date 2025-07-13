// This is a standalone Node.js script. Run it from your terminal with `node migration.js`

const { MongoClient, ObjectId } = require('mongodb');

// --- IMPORTANT: PASTE YOUR MONGODB CONNECTION STRING HERE ---
// You can copy this from your .env.local file
const MONGODB_URI = "mongodb+srv://mbesha37:Edward_2004@derivify.xh6xj3w.mongodb.net/test?retryWrites=true&w=majority&appName=Derivify&tls=true";

// This is the name of your database
const DB_NAME = "test"; // Replace with your actual database name (e.g., "myApp")

/**
 * Generates a short, uppercase, alphanumeric referral code and ensures it is unique
 * in the users collection.
 * @param {Db} db - The MongoDB database instance.
 * @returns {Promise<string>} A unique referral code.
 */
const generateUniqueReferralCode = async (db) => {
    let referralCode = '';
    let isUnique = false;
    while (!isUnique) {
        referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const existingUser = await db.collection('users').findOne({ referralCode });
        if (!existingUser) {
            isUnique = true;
        }
    }
    return referralCode;
};


async function runMigration() {
    if (!MONGODB_URI || !DB_NAME) {
        console.error("ERROR: Please set your MONGODB_URI and DB_NAME at the top of the script.");
        return;
    }

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const usersCollection = db.collection('users');

        console.log("Connected to database successfully.");

        // 1. Find all users who DO NOT have a referralCode field.
        const usersToUpdate = await usersCollection.find({ 
            referralCode: { $exists: false } 
        }).toArray();

        if (usersToUpdate.length === 0) {
            console.log("All users already have a referral code. No migration needed.");
            return;
        }

        console.log(`Found ${usersToUpdate.length} user(s) without a referral code. Starting update...`);

        // 2. Loop through each user and update them.
        for (const user of usersToUpdate) {
            const newReferralCode = await generateUniqueReferralCode(db);
            
            await usersCollection.updateOne(
                { _id: user._id },
                { $set: { referralCode: newReferralCode } }
            );

            console.log(`Updated user ${user.name} (ID: ${user._id}) with new code: ${newReferralCode}`);
        }

        console.log("\nMigration complete! All existing users now have a unique referral code.");

    } catch (error) {
        console.error("An error occurred during the migration:", error);
    } finally {
        // 3. Ensure the database connection is closed.
        await client.close();
        console.log("Database connection closed.");
    }
}

// Run the main function
runMigration();