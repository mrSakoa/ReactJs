// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDgMrugQhb06mQ5-4G80eO6kI6w1ZET4cY",
  authDomain: "kovacz-sebastian-reactjs.firebaseapp.com",
  projectId: "kovacz-sebastian-reactjs",
  storageBucket: "kovacz-sebastian-reactjs.firebasestorage.app",
  messagingSenderId: "547793726577",
  appId: "1:547793726577:web:5de373bf26bc4387d9ffd0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;