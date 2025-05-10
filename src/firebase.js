import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRG3s2RVyXi5GTC-OorAAsbMlRKmQshEc",
  authDomain: "smarttracker-f77dc.firebaseapp.com",
  projectId: "smarttracker-f77dc",
  storageBucket: "smarttracker-f77dc.firebasestorage.app",
  messagingSenderId: "782371283945",
  appId: "1:782371283945:web:c407bea00ad338db08e178",
  measurementId: "G-JFK19EYKGD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);