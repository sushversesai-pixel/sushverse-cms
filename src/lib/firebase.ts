import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXoFOsBr-ypWYAih1iBRzinlFwVvgl3GU",
  authDomain: "portfolio-cms-6ec48.firebaseapp.com",
  projectId: "portfolio-cms-6ec48",
  storageBucket: "portfolio-cms-6ec48.firebasestorage.app",
  messagingSenderId: "903523878548",
  appId: "1:903523878548:web:a56ba94746751fc4cd5681",
};

// Initialize Firebase (Singleton pattern to prevent re-initialization in dev)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
