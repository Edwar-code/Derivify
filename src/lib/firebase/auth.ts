
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut as firebaseSignOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    Auth,
    User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all required environment variables are present
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    throw new Error("Missing Firebase configuration. Please check your environment variables (NEXT_PUBLIC_FIREBASE_...).");
}


// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();


// Sign up with email and password
const signUpWithEmail = async (name: string, email: string, password: string, referralCode?: string): Promise<User | null> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Now, call our API to create the user document in MongoDB
        await fetch('/api/users/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: user.uid,
                email: user.email,
                name: name,
                usedReferralCode: referralCode,
            }),
        });
        
        return user;
    } catch (error: any) {
         if (error.code === 'auth/email-already-in-use') {
            throw new Error('This email address is already in use.');
        }
        console.error("Error signing up: ", error);
        throw new Error("An unknown error occurred during sign-up.");
    }
};

// Sign in with email and password
const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        // Provide a more specific error message for wrong password/user not found
        if (error.code === 'auth/invalid-credential') {
            throw new Error("Invalid email or password.");
        }
        console.error("Error signing in: ", error);
        throw new Error("An unknown error occurred during sign-in.");
    }
}

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
     // Check if user exists in our DB, if not, create them
    const apiRes = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
        }),
    });

    if (!apiRes.ok && apiRes.status !== 409) { // 409 is conflict/user exists, which is fine
        throw new Error("Failed to sync user account.");
    }

    return user;

  } catch (error) {
    console.error("Error signing in with Google: ", error);
    return null;
  }
};

const logout = () => {
  return firebaseSignOut(auth);
};

export { 
    auth, 
    db, 
    signInWithGoogle, 
    logout,
    signUpWithEmail,
    signInWithEmail,
    onAuthStateChanged,
};
export type { User };
