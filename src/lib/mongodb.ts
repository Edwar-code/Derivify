// This file is located at lib/mongodb.ts

import { MongoClient } from 'mongodb'

// Check if the environment variable for the URI is set.
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Add TypeScript interface for global augmentation
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}
/**
 * A function to connect to the database and log the result.
 * This will run once when the application starts.
 */
async function connectToDB(): Promise<MongoClient> {
  try {
    const mongoClient = new MongoClient(uri, options);
    await mongoClient.connect();
    
    // This is the success message you will look for in your Vercel logs.
    console.log("✅ MongoDB successfully connected!"); 
    
    return mongoClient;
  } catch (error) {
    // This is the error message you will see if the connection fails.
    console.error("❌ MongoDB connection FAILED:", error);
    
    // Exit the process if we can't connect to the database.
    // This will cause the Vercel function to crash, which is what we want on a fatal error.
    process.exit(1);
  }
}

// This logic handles connecting in different environments.
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the client
  // across module reloads caused by Hot Module Replacement (HMR).
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connectToDB();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode (on Vercel), it's best to not use a global variable.
  // The connectToDB function will be called once per serverless function instance.
  clientPromise = connectToDB();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;