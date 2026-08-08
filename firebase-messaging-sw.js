// firebase-messaging-sw.js — Background Push Notification Handler for In Punto / RistoGest
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey:            "AIzaSyCtJWFHpz_wSZd7pVxhUdNkGUNjuRXDexc",
  authDomain:        "in-punto.firebaseapp.com",
  databaseURL:       "https://in-punto-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "in-punto",
  storageBucket:     "in-punto.firebasestorage.app",
  messagingSenderId: "851521503055",
  appId:             "1:851521503055:web:7e23520cf67641f044cf3a"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Notifica in background ricevuta:', payload);
  
  const notificationTitle = payload.notification?.title || payload.data?.title || '🍽️ Nuova Prenotazione!';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'Una nuova prenotazione è arrivata dal sito!',
    icon: payload.notification?.icon || './img/icon.jpg',
    badge: './img/icon.jpg',
    vibrate: [300, 100, 300, 100, 300],
    data: { url: payload.data?.url || './owner.html' },
    tag: payload.data?.tag || ('res-' + Date.now())
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('owner.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./owner.html');
      }
    })
  );
});
