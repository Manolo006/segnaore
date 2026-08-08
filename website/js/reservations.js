// reservations.js — Sistema prenotazioni con Firebase Firestore
import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, addDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { t } from './i18n.js';

const firebaseConfig = {
  apiKey:            "AIzaSyCtJWFHpz_wSZd7pVxhUdNkGUNjuRXDexc",
  authDomain:        "in-punto.firebaseapp.com",
  databaseURL:       "https://in-punto-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "in-punto",
  storageBucket:     "in-punto.firebasestorage.app",
  messagingSenderId: "851521503055",
  appId:             "1:851521503055:web:47c4b0a9aa3e6e2d9d3e59",
  measurementId:     "G-LWNBLLWZR7"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db  = getFirestore(app);

// WhatsApp number for the restaurant owner
const OWNER_WHATSAPP = '+351000000000'; // Replace with actual number

export function initReservations() {
  const form = document.getElementById('reservation-form');
  if (!form) return;

  // Set min date to today
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('res-submit');
  const successBox = document.getElementById('reservation-success');
  const errorBox   = document.getElementById('reservation-error');

  const name   = document.getElementById('res-name')?.value?.trim();
  const email  = document.getElementById('res-email')?.value?.trim();
  const phone  = document.getElementById('res-phone')?.value?.trim();
  const date   = document.getElementById('res-date')?.value;
  const time   = document.getElementById('res-time')?.value;
  const guests = document.getElementById('res-guests')?.value;
  const notes  = document.getElementById('res-notes')?.value?.trim();

  // Validation
  if (!name || !email || !phone || !date || !time || !guests) {
    showError(errorBox, t('form_required'));
    return;
  }

  // Loading state
  submitBtn.disabled = true;
  submitBtn.textContent = t('form_submitting');
  hideBox(successBox);
  hideBox(errorBox);

  try {
    // Save to Firestore
    const docRef = await addDoc(collection(db, 'reservations'), {
      name,
      email,
      phone,
      date,
      time,
      guests: parseInt(guests),
      notes: notes || '',
      status: 'pending',
      createdAt: Timestamp.now(),
      source: 'website'
    });

    console.log('[Prenotazione] Salvata con ID:', docRef.id);

    // Send WhatsApp notification to owner
    sendWhatsAppNotification({ name, date, time, guests, phone, notes });

    // Show success
    showSuccess(successBox);
    e.target.reset();
    if (document.getElementById('res-date')) {
      document.getElementById('res-date').min = new Date().toISOString().split('T')[0];
    }

  } catch (err) {
    console.error('[Prenotazione] Errore:', err);
    showError(errorBox, t('form_error'));
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = t('form_submit');
  }
}

function sendWhatsAppNotification({ name, date, time, guests, phone, notes }) {
  const msg = encodeURIComponent(
    `🍽️ Nuova Prenotazione — In Punto\n\n` +
    `👤 Nome: ${name}\n` +
    `📅 Data: ${date} ore ${time}\n` +
    `👥 Persone: ${guests}\n` +
    `📞 Tel: ${phone}\n` +
    `📝 Note: ${notes || 'Nessuna'}`
  );
  // Open WhatsApp in background tab (won't block the user)
  const link = document.createElement('a');
  link.href = `https://wa.me/${OWNER_WHATSAPP.replace(/\D/g, '')}?text=${msg}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.click();
}

function showSuccess(el) {
  if (!el) return;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideBox(el) {
  if (el) el.style.display = 'none';
}
