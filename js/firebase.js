import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getDatabase, ref, onValue, push, set, update, remove } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

// TODO: Inserisci le vere credenziali Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCtJWFHpz_wSZd7pVxhUdNkGUNjuRXDexc",
  authDomain: "in-punto.firebaseapp.com",
  databaseURL: "https://in-punto-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "in-punto",
  storageBucket: "in-punto.firebasestorage.app",
  messagingSenderId: "851521503055",
  appId: "1:851521503055:web:7e23520cf67641f044cf3a",
  measurementId: "G-31TMYBR9RF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let app, auth, dbFirestore, dbRealtime;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  dbFirestore = getFirestore(app);
  dbRealtime = getDatabase(app);
  console.log('[Firebase] Inizializzato (v10 Modular)');
} catch (error) {
  console.warn('[Firebase] Errore inizializzazione:', error.message);
}

export {
  app,
  auth,
  dbFirestore,
  dbRealtime,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  ref,
  onValue,
  push,
  set,
  update,
  remove
};