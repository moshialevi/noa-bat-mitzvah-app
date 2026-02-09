import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// --- PASTE YOUR FIREBASE CONFIGURATION HERE ---
// Replace the object below with the one you copied from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSy...", 
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
// ---------------------------------------------

const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);