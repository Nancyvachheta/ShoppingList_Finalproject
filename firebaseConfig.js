import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcteBGHrAFxzruC8JnMCONUx_3ZibMqCw",
  authDomain: "quick-list-bab08.firebaseapp.com",
  projectId: "quick-list-bab08",
  storageBucket: "quick-list-bab08.firebasestorage.app",
  messagingSenderId: "27094114789",
  appId: "1:27094114789:web:cb3a2f3f41669f158b0f0c",
  measurementId: "G-PD05HM9TXX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
