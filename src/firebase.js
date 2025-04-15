
  
  // Import required Firebase services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

// Export auth instance
export const auth = getAuth(app);
