import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1uuBpcPsVXF17I5CxQV7AfIYO0n3hQBA",
  authDomain: "huertohogar-4fe45.firebaseapp.com",
  projectId: "huertohogar-4fe45",
  storageBucket: "huertohogar-4fe45.firebasestorage.app",
  messagingSenderId: "162428008541",
  appId: "1:162428008541:web:b2107dd129a293acd975b4",
  measurementId: "G-L2SETE9BJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Offline persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser doesn\'t support offline persistence.');
  }
});

export { db, auth, analytics };