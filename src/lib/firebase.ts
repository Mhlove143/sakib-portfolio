import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with the provisioned databaseId
const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const auth = getAuth(app);

// Attempt anonymous auth in the background so writes are authenticated if required
signInAnonymously(auth).catch((err) => {
  console.warn("Anonymous auth notice:", err.message);
});

export { app, db, auth, doc, setDoc, getDoc, onSnapshot, collection, addDoc, deleteDoc, updateDoc };
