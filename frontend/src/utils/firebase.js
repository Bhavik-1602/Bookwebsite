// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyABdxUmas8xyfayQjt8M7eyLw5_MbqXYD0",
  authDomain: "fir-3-5a5ac.firebaseapp.com",
  projectId: "fir-3-5a5ac",
  storageBucket: "fir-3-5a5ac.firebasestorage.app",
  messagingSenderId: "328039237750",
  appId: "1:328039237750:web:6045d2a5a48aae5471b757",
  measurementId: "G-HBTVN5SDF1"
};

const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);
