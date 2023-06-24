// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQ-NMVv3L6PvHQE0E48tchSIyLjIPh4x8",
  authDomain: "billapp-ab4ea.firebaseapp.com",
  projectId: "billapp-ab4ea",
  storageBucket: "billapp-ab4ea.appspot.com",
  messagingSenderId: "455460526344",
  appId: "1:455460526344:web:4e4089e52eaf6b4f8a34bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
