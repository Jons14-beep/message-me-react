import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  addDoc,
  getDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHnjg95feqwM8C4fm28W31morPKwN54L0",
  authDomain: "ktu-hub-c2f61.firebaseapp.com",
  projectId: "ktu-hub-c2f61",
  storageBucket: "ktu-hub-c2f61.firebasestorage.app",
  messagingSenderId: "51416161248",
  appId: "1:51416161248:web:927169d4107c5c3fe82985",
  measurementId: "G-EDGTNH846D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const provider = new GoogleAuthProvider();

export {
  app,
  auth,
  db,
  provider,
  signInWithPopup,
  collection,
  setDoc,
  doc,
  serverTimestamp,
  signOut,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  getDoc,
};
