import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, writeBatch } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getDatabase, ref, get, onValue, set } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

const firebaseConfig = {
  apiKey:            "AIzaSyCtJWFHpz_wSZd7pVxhUdNkGUNjuRXDexc",
  authDomain:        "in-punto.firebaseapp.com",
  databaseURL:       "https://in-punto-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "in-punto",
  storageBucket:     "in-punto.firebasestorage.app",
  messagingSenderId: "851521503055",
  appId:             "1:851521503055:web:7e23520cf67641f044cf3a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dbFirestore = getFirestore(app);
const dbRealtime = getDatabase(app);

let currentUser = null;
let allOrders = [];

window.switchOwnerTab = (tabId, evt) => {
  document.querySelectorAll('.owner-tab').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).style.display = 'block';
  if (evt && evt.currentTarget) evt.currentTarget.classList.add('active');
};

// DEMO MODE: Immediately show owner view and initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  const loadingEl = document.getElementById('view-loading');
  const ownerEl = document.getElementById('view-owner');
  if (loadingEl) loadingEl.style.display = 'none';
  if (ownerEl) ownerEl.style.display = 'block';
  initOwnerDashboard();
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    try {
      const userDoc = await getDoc(doc(dbFirestore, "users", user.uid));
      const role = userDoc.exists() ? (userDoc.data().role || '').toLowerCase() : '';
      console.log('[Owner] Auth role:', role);
      document.getElementById('userName').textContent = (user.displayName || "Proprietario") + ` (${role})`;
    } catch (e) {
      console.error('Error fetching user role:', e);
      document.getElementById('userName').textContent = user.displayName || "Proprietario";
    }
  } else {
    document.getElementById('userName').textContent = "Modalità Demo";
  }
});

function initOwnerDashboard() {
  // Load Consumi
  const ordersRef = ref(dbRealtime, 'orders');
  onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      allOrders = Object.keys(data).map(key => ({ id: key, ...data[key] }));
    } else {
      allOrders = [];
    }
    calculateStats();
  });

  // Load Dipendenti (Staff & Turni)
  loadReviewList();
  loadStaffList();
  
  // Load GPS settings
  get(ref(dbRealtime, 'settings/gps')).then(settingsSnap => {
    if (settingsSnap.exists()) {
      const s = settingsSnap.val();
      document.getElementById('lat').value = s.lat;
      document.getElementById('lng').value = s.lng;
      document.getElementById('rad').value = s.radius;
    }
  });
}

// ==========================================
// CONSUMI LOGIC
// ==========================================
function calculateStats() {
  let totalRevenue = 0;
  let totalItemsSold = 0;
  let totalOrders = allOrders.length;
  const itemsMap = {};

  allOrders.forEach(order => {
    if (order.items) {
      order.items.forEach(item => {
        totalItemsSold += item.qty;
        const price = item.price || 0;
        totalRevenue += price * item.qty;

        if (!itemsMap[item.name]) {
          itemsMap[item.name] = { qty: 0, revenue: 0 };
        }
        itemsMap[item.name].qty += item.qty;
        itemsMap[item.name].revenue += price * item.qty;
      });
    }
  });

  document.getElementById('val-revenue').textContent = totalRevenue.toFixed(2) + ' €';
  document.getElementById('val-orders').textContent = totalOrders;
  document.getElementById('val-items').textContent = totalItemsSold;

  const sortedItems = Object.entries(itemsMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.qty - a.qty);

  const listContainer = document.getElementById('itemsList');
  if (sortedItems.length > 0) {
    listContainer.innerHTML = sortedItems.map(item => `
      <div class="item-row">
        <div>
          <div class="item-row__name">${item.name}</div>
          <div class="item-row__revenue">Incasso: ${item.revenue.toFixed(2)} €</div>
        </div>
        <div class="item-row__qty">x${item.qty}</div>
      </div>
    `).join('');
  } else {
    listContainer.innerHTML = '<div style="color:var(--text-2);">Nessun dato di vendita...</div>';
  }
}

// ==========================================
// DIPENDENTI LOGIC (Turni & Staff)
// ==========================================
async function loadReviewList() {
  const q = query(collection(dbFirestore, "attendance"), where("status", "==", "Da approvare"));
  const snapshot = await getDocs(q);
  const list = document.getElementById('review-list');
  list.innerHTML = '';
  
  if(snapshot.empty) {
    list.innerHTML = '<div style="color:var(--text-2); font-size:0.9rem;">Nessun turno da approvare.</div>';
  }

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    let isLate = false;
    if(data.approvedClockIn && data.expectedIn) {
      if (data.approvedClockIn > data.expectedIn) isLate = true;
    }

    list.innerHTML += `
      <div class="card history-card" style="flex-direction:column; align-items:flex-start; gap:12px;">
        <div style="display:flex; justify-content:space-between; width:100%;">
          <div>
            <div style="font-weight:700;">${data.userName}</div>
            <div style="font-size:0.75rem; color:var(--text-3); margin-top:2px;">Atteso: ${data.expectedIn || '?'} - ${data.expectedOut || '?'}</div>
          </div>
          <div style="font-size:0.8rem; color:var(--text-2); text-align:right;">
            ${data.dateString}
            ${isLate ? \`<div style="color:var(--s-error); font-weight:700; font-size:0.7rem; margin-top:4px;">⚠️ RITARDO</div>\` : ''}
          </div>
        </div>
        
        <div style="display:flex; gap:12px; width:100%;">
          <div style="flex:1;">
            <label style="font-size:0.7rem; color:var(--text-2);">Entrata Effettiva</label>
            <input type="time" id="in_${docSnap.id}" value="${data.approvedClockIn}" class="input">
          </div>
          <div style="flex:1;">
            <label style="font-size:0.7rem; color:var(--text-2);">Uscita Effettiva</label>
            <input type="time" id="out_${docSnap.id}" value="${data.approvedClockOut}" class="input">
          </div>
        </div>

        <div style="width:100%;">
          <input type="text" id="note_${docSnap.id}" placeholder="Nota / Giustificazione (es. Traffico)" value="${data.note || ''}" class="input" style="padding:10px;">
        </div>

        <button class="btn btn-green" onclick="approveShift('${docSnap.id}')" style="padding:12px;">Conferma & Approva</button>
      </div>
    `;
  });
}

window.approveShift = async (id) => {
  const inVal = document.getElementById(`in_${id}`).value;
  const outVal = document.getElementById(`out_${id}`).value;
  const noteVal = document.getElementById(`note_${id}`).value;
  
  let h = 0;
  if (inVal && outVal) {
    const t1 = inVal.split(':');
    const t2 = outVal.split(':');
    const m1 = parseInt(t1[0])*60 + parseInt(t1[1]);
    const m2 = parseInt(t2[0])*60 + parseInt(t2[1]);
    h = Math.max(0, m2 - m1) / 60;
  }

  await updateDoc(doc(dbFirestore, "attendance", id), {
    approvedClockIn: inVal,
    approvedClockOut: outVal,
    note: noteVal,
    status: "Approvato",
    totalHours: h
  });
  loadReviewList();
};

async function loadStaffList() {
  const q = query(collection(dbFirestore, "users"));
  const snapshot = await getDocs(q);
  const list = document.getElementById('staff-list');
  list.innerHTML = '';

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const isPending = data.role === 'pending';
    
    list.innerHTML += `
      <div class="card" style="margin-bottom:12px; ${isPending ? 'border-color:var(--s-new); background:rgba(245,158,11,0.05);' : ''}">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <div style="font-weight:700;">${data.name}</div>
            <div style="font-size:0.75rem; color:var(--text-2);">${data.email}</div>
          </div>
          <div style="font-size:0.75rem; padding:4px 8px; border-radius:12px; background:var(--surface); text-transform:uppercase;">
            ${data.role}
          </div>
        </div>

        <div style="display:flex; gap:8px; margin-bottom:12px;">
          <select id="role_${docSnap.id}" class="input" style="padding:8px; flex:1;">
            <option value="pending" ${data.role === 'pending' ? 'selected' : ''}>In Attesa</option>
            <option value="employee" ${data.role === 'employee' ? 'selected' : ''}>Dipendente</option>
            <option value="owner" ${data.role === 'owner' ? 'selected' : ''}>Proprietario</option>
          </select>
          <select id="contract_${docSnap.id}" class="input" style="padding:8px; flex:1;">
            <option value="fulltime" ${data.contractType === 'fulltime' ? 'selected' : ''}>Full-Time</option>
            <option value="parttime" ${data.contractType === 'parttime' ? 'selected' : ''}>Part-Time</option>
          </select>
        </div>

        <div style="display:flex; gap:8px;">
          <div style="flex:1;">
            <label style="font-size:0.7rem; color:var(--text-2);">Orario Inizio</label>
            <input type="time" id="start_${docSnap.id}" value="${data.shiftStart || '09:00'}" class="input" style="padding:8px;">
          </div>
          <div style="flex:1;">
            <label style="font-size:0.7rem; color:var(--text-2);">Orario Fine</label>
            <input type="time" id="end_${docSnap.id}" value="${data.shiftEnd || '18:00'}" class="input" style="padding:8px;">
          </div>
        </div>

        <button class="btn btn-outline" style="padding:10px; margin-top:8px; font-size:0.85rem;" onclick="saveUser('${docSnap.id}')">💾 Salva Dipendente</button>
      </div>
    `;
  });
}

window.saveUser = async (id) => {
  const role = document.getElementById(`role_${id}`).value;
  const contract = document.getElementById(`contract_${id}`).value;
  const start = document.getElementById(`start_${id}`).value;
  const end = document.getElementById(`end_${id}`).value;

  await updateDoc(doc(dbFirestore, "users", id), {
    role: role,
    contractType: contract,
    shiftStart: start,
    shiftEnd: end
  });
  alert('Impostazioni dipendente salvate.');
  loadStaffList();
};

window.saveSettings = async () => {
  const lat = parseFloat(document.getElementById('lat').value);
  const lng = parseFloat(document.getElementById('lng').value);
  const rad = parseInt(document.getElementById('rad').value);
  await set(ref(dbRealtime, 'settings/gps'), { lat, lng, radius: rad });
  alert('Impostazioni GPS salvate!');
};

// ==========================================
// CHIUSURA CASSA LOGIC
// ==========================================
window.eseguiChiusuraCassa = async () => {
  const confirmFirst = confirm("ATTENZIONE! Stai per chiudere la cassa di oggi. Tutti gli ordini attuali verranno salvati nello storico permanente e spariranno dalla sala. Vuoi procedere?");
  if (!confirmFirst) return;

  const btn = document.getElementById('btn-chiusura');
  btn.disabled = true;
  btn.textContent = 'Salvataggio in corso...';

  try {
    // 1. Leggi tutti gli ordini correnti da Realtime Database
    const ordersSnap = await get(ref(dbRealtime, 'orders'));
    if (!ordersSnap.exists()) {
      alert("Nessun ordine trovato da salvare. La sala è già vuota.");
      btn.disabled = false;
      btn.textContent = 'Esegui Chiusura Cassa';
      return;
    }

    const currentOrders = ordersSnap.val();
    
    // 2. Prepara il Batch per scrivere su Firestore (historical_orders)
    const batch = writeBatch(dbFirestore);
    const dateStr = new Date().toISOString().split('T')[0];
    
    Object.keys(currentOrders).forEach(key => {
      const docRef = doc(collection(dbFirestore, 'historical_orders'));
      const orderData = currentOrders[key];
      orderData.closedAt = new Date().toISOString();
      orderData.closeDate = dateStr;
      orderData.originalRtdbId = key;
      batch.set(docRef, orderData);
    });

    // 3. Esegui il salvataggio su Firestore
    await batch.commit();

    // 4. Se il salvataggio è andato a buon fine, CANCELLA da Realtime Database
    await set(ref(dbRealtime, 'orders'), null);
    
    // 5. Ripristina tutti i tavoli (li libera tutti)
    const tablesSnap = await get(ref(dbRealtime, 'tables'));
    if (tablesSnap.exists()) {
        const tables = tablesSnap.val();
        let updates = {};
        
        if (Array.isArray(tables)) {
            tables.forEach(t => {
                if(t) updates[`table_${t.id}`] = { ...t, status: 'free', startedAt: null, guests: 0, reservedTime: '', reservedGuests: 0 };
            });
        } else {
            Object.keys(tables).forEach(k => {
                const t = tables[k];
                if(t) updates[k] = { ...t, status: 'free', startedAt: null, guests: 0, reservedTime: '', reservedGuests: 0 };
            });
        }
        await set(ref(dbRealtime, 'tables'), updates);
    }

    alert("Chiusura Cassa completata con successo! Gli ordini sono stati archiviati e la sala è stata azzerata.");

  } catch (error) {
    console.error("Errore durante chiusura cassa:", error);
    alert("Errore critico durante il salvataggio: " + error.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Esegui Chiusura Cassa';
  }
};
