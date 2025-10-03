// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);