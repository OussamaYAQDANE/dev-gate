// Import Firebase SDK functions just once
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// First Firebase app config (Chat app)
const chatFirebaseConfig = {
  apiKey: "AIzaSyC7Jp-JfF5MsbFrP-vvxYzRDyCmbtE-qjQ",
  authDomain: "real-time-chat-7ab21.firebaseapp.com",
  projectId: "real-time-chat-7ab21",
  storageBucket: "real-time-chat-7ab21.firebasestorage.app",
  messagingSenderId: "259475982892",
  appId: "1:259475982892:web:83118b1b4cefbc13a0df89",
  measurementId: "G-Y8082M6GLT"
};

// Second Firebase app config (Dev Gate app)
const devGateFirebaseConfig = {
  apiKey: "AIzaSyCv-cYzecnzY3qKDuoHFvjCxZ7mbHqanhY",
  authDomain: "dev-gate-1.firebaseapp.com",
  projectId: "dev-gate-1",
  storageBucket: "dev-gate-1.firebasestorage.app",
  messagingSenderId: "31762261006",
  appId: "1:31762261006:web:98cf63d36421fcda80c85f",
  measurementId: "G-X1XTH19QW8"
};

// Initialize Firebase apps with different names
const chatApp = initializeApp(chatFirebaseConfig, "chat-app");
const devGateApp = initializeApp(devGateFirebaseConfig, "dev-gate-app");

// Get services from each app
const auth_chat = getAuth(chatApp);
const db_chat = getFirestore(chatApp);

const auth = getAuth(devGateApp);
const db = getFirestore(devGateApp);
const storage = getStorage(devGateApp);

// Export the services
export { 
  auth_chat, db_chat,                  // Chat app services
  auth, db, storage  // Dev Gate app services
};
