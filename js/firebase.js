import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getDatabase, ref, onValue, push, set, update, remove } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

// TODO: Inserisci le vere credenziali Firebase
const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_AUTH_DOMAIN",
  databaseURL: "PASTE_DATABASE_URL",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_STORAGE_BUCKET",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

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