import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFwB477uAjHAHCqCvwkxoGBprXoPVCya8",
  authDomain: "tracker-2567e.firebaseapp.com",
  projectId: "tracker-2567e",
  storageBucket: "tracker-2567e.firebasestorage.app",
  messagingSenderId: "248434786914",
  appId: "1:248434786914:web:3f32cfe584edbd9753873b",
  measurementId: "G-P66MW2MHMQ"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);
