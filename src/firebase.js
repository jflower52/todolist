import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpJbK2NczWumZbF8pNgFivt2wEyfdPU_k",
  authDomain: "todolist-ohj.firebaseapp.com",
  projectId: "todolist-ohj",
  storageBucket: "todolist-ohj.firebasestorage.app",
  messagingSenderId: "299107853494",
  appId: "1:299107853494:web:3752dd35e79162475c7217",
};

// 파이어베이스 초기화 및 데이터베이스(Firestore) 연결
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
