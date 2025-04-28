// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCv-cYzecnzY3qKDuoHFvjCxZ7mbHqanhY",
  authDomain: "dev-gate-1.firebaseapp.com",
  projectId: "dev-gate-1",
  storageBucket: "dev-gate-1.firebasestorage.app",
  messagingSenderId: "31762261006",
  appId: "1:31762261006:web:98cf63d36421fcda80c85f",
  measurementId: "G-X1XTH19QW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, storage, db };
