import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  enableIndexedDbPersistence,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

var firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_PROJECT_ID + ".firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_PROJECT_ID + ".appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Firestore
const db = getFirestore(app);

// Enabling persistenc
enableIndexedDbPersistence(db).catch((err) => {
  console.log("Firebase persistence error", err.code);
});

// Firestore collections
const usersCollection = collection(db, "users");
const songsCollection = collection(db, "songs");
const commentsCollection = collection(db, "comments");

// Cloud storage
const storage = getStorage(app);

// Get the currently logged in user
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

export {
  auth,
  db,
  usersCollection,
  songsCollection,
  commentsCollection,
  storage,
  getCurrentUser,
};
