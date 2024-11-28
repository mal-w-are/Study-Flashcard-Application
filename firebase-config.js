// Import required Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsHyYYgkMSrYo2xgufZ2wzSygYfZxrJWY",
    authDomain: "study-flashcard-application.firebaseapp.com",
    databaseURL: "https://study-flashcard-application-default-rtdb.asia-southeast1.firebasedatabase.app/",  // Realtime Database URL
    projectId: "study-flashcard-application",
    storageBucket: "study-flashcard-application.appspot.com",
    messagingSenderId: "698845137592",
    appId: "1:698845137592:web:a577e50b043edda67e024d",
    measurementId: "G-FE16XLHB78"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Google Provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Initialize Firebase Realtime Database
export const db = getDatabase(app);
