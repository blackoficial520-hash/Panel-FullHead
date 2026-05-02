import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.error("❌ VITE_FIREBASE_API_KEY no configurada!");
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: "panelfreefire-f90aa.firebaseapp.com",
  projectId: "panelfreefire-f90aa",
  storageBucket: "panelfreefire-f90aa.firebasestorage.app",
  messagingSenderId: "788453326370",
  appId: "1:788453326370:web:b53c27d2fe493e1e9c547b",
  measurementId: "G-W8BTPFCFW4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export let messaging = null;
isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);
  }
});

export { app };
