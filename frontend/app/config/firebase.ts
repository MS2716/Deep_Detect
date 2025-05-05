import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCP4gnlRyLtq-AgGmA6-qUpKwg9ccNq4GQ",
    authDomain: "deepdetect-f9fb8.firebaseapp.com",
    projectId: "deepdetect-f9fb8",
    storageBucket: "deepdetect-f9fb8.firebasestorage.app",
    messagingSenderId: "726950523019",
    appId: "1:726950523019:web:c95e1fce355a75f234a48e",
    measurementId: "G-QVHYS5X3PG"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export { auth };