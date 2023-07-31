import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAQ-NMVv3L6PvHQE0E48tchSIyLjIPh4x8",
  authDomain: "billapp-ab4ea.firebaseapp.com",
  projectId: "billapp-ab4ea",
  storageBucket: "billapp-ab4ea.appspot.com",
  messagingSenderId: "455460526344",
  appId: "1:455460526344:web:4e4089e52eaf6b4f8a34bd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
