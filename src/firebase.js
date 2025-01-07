import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOfQQgqqaxRsx_jtTeIQFeUnlK__EE7IY",
  authDomain: "eam-ntantades-f97be.firebaseapp.com",
  databaseURL: "https://eam-ntantades-f97be-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "eam-ntantades-f97be",
  storageBucket: "eam-ntantades-f97be.firebasestorage.app",
  messagingSenderId: "727603062139",
  appId: "1:727603062139:web:9fde7ee7888a377b6309de",
  measurementId: "G-XH4W5B6BF2"
};

const app = initializeApp(firebaseConfig);

// Export Firebase services for use in your app
const auth = getAuth(app); // Authentication
const db = getFirestore(app); // Firestore Database

export { app, auth, db };