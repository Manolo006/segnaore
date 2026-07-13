// ============================================================
//  firebase.js — Modulo centralizzato Firebase v10 Modulare
//  Importa da qui in tutte le pagine con:
//    import { dbRealtime, ref, push, set } from './js/firebase.js';
// ============================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  update,
  remove
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

// ── Credenziali ────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyCtJWFHpz_wSZd7pVxhUdNkGUNjuRXDexc",
  authDomain:        "in-punto.firebaseapp.com",
  databaseURL:       "https://in-punto-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "in-punto",
  storageBucket:     "in-punto.firebasestorage.app",
  messagingSenderId: "851521503055",
  appId:             "1:851521503055:web:7e23520cf67641f044cf3a"
};

// ── Inizializzazione ───────────────────────────────────────
const app        = initializeApp(firebaseConfig);
const auth       = getAuth(app);
const dbFirestore = getFirestore(app);
const dbRealtime  = getDatabase(app);

console.log('[Firebase] ✅ Inizializzato correttamente (v10 Modular)');

// ── Esporta tutto ──────────────────────────────────────────
export {
  app,
  auth,
  dbFirestore,
  dbRealtime,
  // Auth helpers
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  // Firestore helpers
  doc,
  getDoc,
  setDoc,
  // Realtime Database helpers
  ref,
  onValue,
  push,
  set,
  update,
  remove
};