import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpJbK2NczWumZbF8pNgFivt2wEyfdPU_k",
  authDomain: "todolist-ohj.firebaseapp.com",
  projectId: "todolist-ohj",
  storageBucket: "todolist-ohj.firebasestorage.app",
  messagingSenderId: "299107853494",
  appId: "1:299107853494:web:3752dd35e79162475c7217",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
