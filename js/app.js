import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref, onValue, set, push, update } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

  window.startGlobalOrder = function() {
    const container = document.getElementById('globalOrderTables');
    container.innerHTML = tables.map(t => {
      const color = STATUS_COLORS[t.status] || '#fff';
      const opacityBg = t.status === 'free' ? 'rgba(34, 197, 94, 0.12)' : 
                        t.status === 'reserved' ? 'rgba(14, 165, 233, 0.12)' :
                        t.status === 'preparing' ? 'rgba(59, 130, 246, 0.12)' :
                        t.status === 'ready' ? 'rgba(168, 85, 247, 0.12)' :
                        t.status === 'occupied' ? 'rgba(176, 2, 2, 0.12)' :
                        t.status === 'bill' ? 'rgba(249, 115, 22, 0.12)' :
                        'rgba(71, 85, 105, 0.12)'; // paid
      
      const borderColor = t.status === 'free' ? 'rgba(34, 197, 94, 0.3)' : 
                          t.status === 'reserved' ? 'rgba(14, 165, 233, 0.3)' :
                          t.status === 'preparing' ? 'rgba(59, 130, 246, 0.3)' :
                          t.status === 'ready' ? 'rgba(168, 85, 247, 0.3)' :
                          t.status === 'occupied' ? 'rgba(176, 2, 2, 0.3)' :
                          t.status === 'bill' ? 'rgba(249, 115, 22, 0.3)' :
                          'rgba(71, 85, 105, 0.25)'; // paid
      
      return `
        <button class="order-modal-table-btn" 
          style="background: ${opacityBg}; color: ${color}; border: 1px solid ${borderColor};"
          onclick="window.location.href='ordini.html?table=${t.id}'">
          <span class="table-status-dot" style="background: ${color};"></span>
          ${t.id}
        </button>
      `;
    }).join('');
    
    document.getElementById('globalOrderModal').classList.add('open');
  };

/* =====================================================
   DATA — Status definitions
===================================================== */
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
  const db = getDatabase(app);
  const auth = getAuth(app);
  const dbFirestore = getFirestore(app);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(dbFirestore, "users", user.uid));
      if (userDoc.exists() && userDoc.data().role === 'owner') {
        const sBtn = document.getElementById('sidebarOwnerBtn');
        const bBtn = document.getElementById('bnavOwnerBtn');
        if (sBtn) sBtn.style.display = 'flex';
        if (bBtn) bBtn.style.display = 'flex';
      }
    }
  });

  window._db = db;
  window._ref = ref;
  window._onValue = onValue;
  window._fbRef = ref;
  window._fbOnValue = onValue;
  window._fbSet = set;
  window._fbPush = push;
  window._fbUpdate = update;
  window._fbReady = true;
  console.log('[Sala] Firebase connesso ✅');

  const STATUS_LABELS = {
  'free':       'Disponibile',
  'reserved':   'Prenotato',
  'preparing':  'In preparazione',
  'ready':      'Pronto da servire',
  'occupied':   'Occupato',
  'bill':       'Attesa conto',
  'paid':       'Pagato / Chiuso'
};

const STATUS_COLORS = {
  'free':       '#22c55e',
  'reserved':   '#0ea5e9',
  'preparing':  '#3b82f6',
  'ready':      '#a855f7',
  'occupied':   '#b00202',
  'bill':       '#f97316',
  'paid':       '#475569'
};

const STATUS_EMOJIS = {
  'free':       '🟢',
  'reserved':   '🩵',
  'preparing':  '🔵',
  'ready':      '🟣',
  'occupied':   '🔴',
  'bill':       '🟠',
  'paid':       '⚫'
};

/* =====================================================
   DATA — Slots & Tables
===================================================== */
const tableSlots = {
  'pt_1': { area: 'Piano Terra', left: '1.3rem', top: '50rem', type: 'sq', baseSeats: 2 },
  'pt_2': { area: 'Piano Terra', left: '1.3rem', top: '36.875rem', type: 'sq', baseSeats: 2 },
  'pt_3': { area: 'Piano Terra', left: '1.3rem', top: '21.25rem', type: 'sq', baseSeats: 2 },
  'pt_4': { area: 'Piano Terra', left: '22.5rem', top: '36.875rem', type: 'sq', baseSeats: 2 },
  'pt_5': { area: 'Piano Terra (Esterno)', left: '1.875rem', top: '1.3rem', type: 'sq', baseSeats: 2 },
  'pt_6': { area: 'Piano Terra (Esterno)', left: '15.625rem', top: '1.3rem', type: 'rect-v', baseSeats: 4 },
  'pt_7': { area: 'Piano Terra (Esterno)', left: '29.375rem', top: '1.3rem', type: 'sq', baseSeats: 2 },
  // Terrazza — nuova disposizione più spaziata
  'tr_20': { area: 'Terrazza', left: '30px', top: '30px', type: 'rect-h', baseSeats: 4 },
  'tr_21': { area: 'Terrazza', left: '340px', top: '30px', type: 'sq', baseSeats: 2 },
  'tr_22': { area: 'Terrazza', left: '30px', top: '200px', type: 'sq', baseSeats: 2 },
  'tr_23': { area: 'Terrazza', left: '340px', top: '200px', type: 'rect-v', baseSeats: 4 },
  'tr_24': { area: 'Terrazza', left: '30px', top: '450px', type: 'sq', baseSeats: 2 },
  'tr_25': { area: 'Terrazza', left: '210px', top: '560px', type: 'sq', baseSeats: 2 },
  'tr_26': { area: 'Terrazza', left: '390px', top: '650px', type: 'sq', baseSeats: 2 },
};

let tables = [
  { id: 1, slotIds: ['pt_1'], status: 'free', guests: 0, seats: 2, startedAt: null },
  { id: 2, slotIds: ['pt_2'], status: 'free', guests: 0, seats: 2, startedAt: null },
  { id: 3, slotIds: ['pt_3'], status: 'free', guests: 0, seats: 2, startedAt: null },
  { id: 4, slotIds: ['pt_4'], status: 'free', guests: 0, seats: 2, startedAt: null },
  { id: 5, slotIds: ['pt_5'], status: 'free', guests: 0, seats: 2, startedAt: null },
  { id: 6, slotIds: ['pt_6'], status: 'free', guests: 0, seats: 4, startedAt: null },
  { id: 7, slotIds: ['pt_7'], status: 'free', guests: 0, seats: 2, startedAt: null },
  { id: 20, slotIds: ['tr_20'], status: 'free', guests: 0, seats: 2, startedAt: null },
  { id: 21, slotIds: ['tr_21'], status: 'free', guests: 0, seats: 4, startedAt: null },
  { id: 22, slotIds: ['tr_22'], status: 'free', guests: 0, seats: 2, startedAt: null },
  { id: 23, slotIds: ['tr_23'], status: 'free', guests: 0, seats: 4, startedAt: null },
  { id: 24, slotIds: ['tr_24'], status: 'free', guests: 0, seats: 2, startedAt: null },
  { id: 25, slotIds: ['tr_25'], status: 'free', guests: 0, seats: 2, startedAt: null },
  { id: 26, slotIds: ['tr_26'], status: 'free', guests: 0, seats: 2, startedAt: null },
];

let selectedTableId = null;

/* =====================================================
   RENDER ENGINE
===================================================== */
function renderTables() {
  const containerPT = document.getElementById('floor-canvas-pt-dynamic');
  const containerTR = document.getElementById('floor-canvas-tr-dynamic');
  const gridPT = document.getElementById('floor-canvas-pt-grid');
  const gridTR = document.getElementById('floor-canvas-tr-grid');
  
  if (!containerPT || !containerTR) return;
  
  containerPT.innerHTML = '';
  containerTR.innerHTML = '';
  if(gridPT) gridPT.innerHTML = '';
  if(gridTR) gridTR.innerHTML = '';
  
  tables.forEach(t => {
     // Gather slot objects for this table
     const slots = t.slotIds.map(id => tableSlots[id]).filter(Boolean);

     // If table spans multiple slots positioned on the same row/column, render a combined card
     if (slots.length > 1) {
       const lefts = slots.map(s => s.left ? parseInt(s.left, 10) : null).filter(v => v !== null);
       const tops = slots.map(s => s.top ? parseInt(s.top, 10) : null).filter(v => v !== null);

       const horiz = tops.length && tops.every(v => v === tops[0]);
       const vert = lefts.length && lefts.every(v => v === lefts[0]);

       if (horiz || vert) {
         const minLeft = Math.min(...lefts);
         const minTop = Math.min(...tops);
         const orientation = horiz ? 'h' : 'v';
         let visualClass = 'sq';
         if (t.seats >= 6) visualClass = `wide-${orientation}`;
         else if (t.seats >= 4) visualClass = `rect-${orientation}`;

         const stylePos = `${minLeft !== undefined ? 'left:'+minLeft+'px;' : ''} ${minTop !== undefined ? 'top:'+minTop+'px;' : ''}`;

         const cardHtml = `
           <div class="table-card table-card--${visualClass}${linkingMode !== null && linkingMode !== t.id ? ' link-target' : ''}" 
                data-id="${t.id}" data-status="${t.status}"
                style="${stylePos} opacity:1;"
                onclick="window.handleTableClick(${t.id})">
             <div class="table-card__status-dot" style="background:${STATUS_COLORS[t.status]}"></div>
             <div class="table-card__combine">⛓</div>
             <div class="table-card__num">${t.id}</div>
             <div class="table-card__seats">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                ${t.seats} posti
             </div>
             ${(t.startedAt) ? `<div class="table-card__timer" id="timer-${t.id}">...</div>` : ''}
             ${(t.status === 'reserved' && t.reservedTime) ? `<div style="font-size:0.7rem; color:var(--s-reserved); font-weight:800; margin-top:2px;">${t.reservedTime}</div>` : ''}
           </div>
         `;

         const gridCardHtml = `
           <div class="table-card table-card--${visualClass}${linkingMode !== null && linkingMode !== t.id ? ' link-target' : ''}" 
                data-id="${t.id}" data-status="${t.status}"
                onclick="window.handleTableClick(${t.id})">
             <div class="table-card__status-dot" style="background:${STATUS_COLORS[t.status]}"></div>
             <div class="table-card__combine">⛓</div>
             <div class="table-card__num">${t.id}</div>
             <div class="table-card__seats">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                ${t.seats}p
             </div>
             ${(t.startedAt) ? `<div class="table-card__timer" id="timer-grid-${t.id}">...</div>` : ''}
           </div>
         `;

         if (slots[0].area.startsWith('Piano Terra')) {
           containerPT.innerHTML += cardHtml;
           if (gridPT) gridPT.innerHTML += gridCardHtml;
         } else {
           containerTR.innerHTML += cardHtml;
           if (gridTR) gridTR.innerHTML += gridCardHtml;
         }
         return; // already rendered combined card
       }
     }

     // Fallback: render each slot separately
     t.slotIds.forEach((slotId, index) => {
       const slot = tableSlots[slotId];
       const isMain = index === 0;
       if(!slot) return;
       let cardHtml = `
         <div class="table-card table-card--${slot.type}${linkingMode !== null && linkingMode !== t.id ? ' link-target' : ''}" 
              data-id="${t.id}" data-status="${t.status}"
              style="${slot.left ? 'left:'+slot.left+';' : ''} ${slot.right ? 'right:'+slot.right+';' : ''} top:${slot.top}; opacity: ${isMain ? 1 : 0.8};"
              onclick="window.handleTableClick(${t.id})">
           <div class="table-card__status-dot" style="background:${STATUS_COLORS[t.status]}"></div>
           ${t.slotIds.length > 1 ? '<div class="table-card__combine">⛓</div>' : ''}
           <div class="table-card__num">${t.id}</div>
           <div class="table-card__seats">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
              ${isMain ? t.seats + ' posti' : 'Collegato'}
           </div>
           ${(isMain && t.startedAt) ? `<div class="table-card__timer" id="timer-${t.id}">...</div>` : ''}
           ${(isMain && t.status === 'reserved' && t.reservedTime) ? `<div style="font-size:0.7rem; color:var(--s-reserved); font-weight:800; margin-top:2px;">${t.reservedTime}</div>` : ''}
         </div>
       `;

       let gridCardHtml = isMain ? `
         <div class="table-card table-card--sq${linkingMode !== null && linkingMode !== t.id ? ' link-target' : ''}" 
              data-id="${t.id}" data-status="${t.status}"
              onclick="window.handleTableClick(${t.id})">
           <div class="table-card__status-dot" style="background:${STATUS_COLORS[t.status]}" ></div>
           ${t.slotIds.length > 1 ? '<div class="table-card__combine">⛓</div>' : ''}
           <div class="table-card__num">${t.id}</div>
           <div class="table-card__seats">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
              ${t.seats}p
           </div>
           ${(t.startedAt) ? `<div class="table-card__timer" id="timer-grid-${t.id}">...</div>` : ''}
           ${(t.status === 'reserved' && t.reservedTime) ? `<div style="font-size:0.6rem; color:var(--s-reserved); font-weight:800;">${t.reservedTime}</div>` : ''}
         </div>
       ` : '';

       if(slot.area.startsWith('Piano Terra')) {
          containerPT.innerHTML += cardHtml;
          if(gridPT && gridCardHtml) gridPT.innerHTML += gridCardHtml;
       } else {
          containerTR.innerHTML += cardHtml;
          if(gridTR && gridCardHtml) gridTR.innerHTML += gridCardHtml;
       }
     });
  });
  
  updateTimers();
  updateStats();
  if(selectedTableId) {
    document.querySelectorAll(`[data-id="${selectedTableId}"]`).forEach(c => c.classList.add('selected'));
  }
}

/* =====================================================
   LINK & UNLINK LOGIC
===================================================== */
function promptLinkTable(id, knownTargetId = null) {
  const tableIdx = tables.findIndex(t => t.id === id);
  if (tableIdx === -1) return;
  
  let targetId;
  if(knownTargetId !== null) {
    targetId = knownTargetId;
  } else {
    const targetIdStr = prompt(`Inserisci il numero del tavolo da unire al Tavolo ${id}:`);
    if (!targetIdStr) return;
    targetId = parseInt(targetIdStr);
  }
  const targetIdx = tables.findIndex(t => t.id === targetId);
  
  if (targetIdx === -1) {
    showToast('❌', 'Tavolo non trovato');
    return;
  }
  
  const targetTable = tables[targetIdx];
  const sourceTable = tables[tableIdx];
  
  sourceTable.slotIds.push(...targetTable.slotIds);
  sourceTable.seats += targetTable.seats;
  
  // Delete target table from array
  tables = tables.filter(t => t.id !== targetId);
  
  // NESSUNO SHIFT DEGLI ID! Manteniamo gli ID originali per non rompere i DB orders
  
  renderTables();
  showToast('🔗', `Tavolo ${targetId} unito al Tavolo ${id}!`);
  closePanel();
  if(window.syncTablesToDB) window.syncTablesToDB();
}

function unlinkTable(id) {
  const tableIdx = tables.findIndex(t => t.id === id);
  if (tableIdx === -1) return;
  const t = tables[tableIdx];
  
  if (t.slotIds.length <= 1) {
    showToast('⚠️', 'Questo tavolo non è unito ad altri.');
    return;
  }
  
  // Pop the last slot
  const splitSlotId = t.slotIds.pop();
  const splitSlot = tableSlots[splitSlotId];
  if (!splitSlot) {
    showToast('⚠️', 'Errore nella divisione: slot non valido.');
    return;
  }
  
  t.seats -= splitSlot.baseSeats;
  
  // Trova un ID univoco nuovo senza rompere gli altri
  const maxId = Math.max(...tables.map(tb => tb.id));
  const newId = maxId + 1;
  
  // Insert new table at the end
  const newTable = {
    id: newId,
    slotIds: [splitSlotId],
    status: 'free',
    guests: 0,
    seats: splitSlot.baseSeats,
    reservedTime: '',
    reservedGuests: 0,
    startedAt: null
  };
  tables.push(newTable);
  
  // Ordina i tavoli per ID così il DOM li renderizza correttamente (opzionale ma utile)
  tables.sort((a,b) => a.id - b.id);
  
  renderTables();
  showToast('✂️', `Tavolo diviso. Creato nuovo Tavolo ${newId}`);
  closePanel();
  if(window.syncTablesToDB) window.syncTablesToDB();
}

let activeResTableId = null;

function setReservation(id) {
  const t = tables.find(tb => tb && tb.id === id);
  if(!t) return;
  
  activeResTableId = id;
  document.getElementById('resTableNum').textContent = id;
  document.getElementById('resTime').value = t.reservedTime || "20:00";
  document.getElementById('resGuests').value = t.reservedGuests || t.seats;
  
  document.getElementById('reservationModal').classList.add('open');
}

function closeReservationModal() {
  document.getElementById('reservationModal').classList.remove('open');
  activeResTableId = null;
}

function confirmReservation() {
  const tableId = activeResTableId;
  if(!tableId) return;
  const t = tables.find(tb => tb && tb.id === tableId);
  if(!t) return;
  
  const time = document.getElementById('resTime').value;
  const guests = document.getElementById('resGuests').value;
  
  if(!time || !guests) {
    showToast('⚠️', 'Compila tutti i campi');
    return;
  }
  
  t.status = 'reserved';
  t.reservedTime = time;
  t.reservedGuests = parseInt(guests);
  t.guests = 0;
  t.startedAt = null;
  
  renderTables();
  showToast('📅', `Tavolo ${tableId} prenotato per le ${time}`);
  closeReservationModal();
  closePanel();
  if(window.syncTablesToDB) window.syncTablesToDB([tableId]);
}

function editTableId(oldId) {
   const parsedOldId = parseInt(oldId);
   const newIdStr = prompt("Inserisci il nuovo numero per questo tavolo:", parsedOldId);
   if(!newIdStr) return;
   const newId = parseInt(newIdStr);
   if(isNaN(newId) || tables.find(t => t && t.id === newId)) {
      showToast('❌', 'Numero non valido o già in uso');
      return;
   }
   const t = tables.find(t => t && t.id === parsedOldId);
   if(t) t.id = newId;
   tables.sort((a,b) => a.id - b.id);
   renderTables();
   closePanel();
   showToast('✅', `Tavolo rinominato in ${newId}`);
   if(window.syncTablesToDB) window.syncTablesToDB();
}
window.editTableId = editTableId;

/* =====================================================
   CLOCK & TIMERS
===================================================== */

function formatTimer(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateTimers() {
  const now = Date.now();
  tables.forEach(d => {
    const el = document.getElementById(`timer-${d.id}`);
    if (el && d.startedAt) el.textContent = formatTimer(now - d.startedAt);
    const elGrid = document.getElementById(`timer-grid-${d.id}`);
    if (elGrid && d.startedAt) elGrid.textContent = formatTimer(now - d.startedAt);
  });
}
setInterval(updateTimers, 1000);

/* =====================================================
   STATS
===================================================== */
function updateStats() {
  const counts = { free: 0, reserved: 0, preparing: 0, ready: 0, bill: 0, paid: 0 };
  let total = 0, occupied = 0;

  tables.forEach(d => {
    counts[d.status] = (counts[d.status] || 0) + 1;
    total++;
    if (d.status !== 'free' && d.status !== 'paid' && d.status !== 'reserved') occupied++;
  });

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-free').textContent = counts.free || 0;
  document.getElementById('stat-occupied').textContent = occupied;
  document.getElementById('stat-ready').textContent = counts.ready || 0;
  
  // Legend
  const legendMap = {
    'lc-free': 'free', 'lc-prep': 'preparing', 
    'lc-ready': 'ready', 'lc-occupied': 'occupied', 'lc-bill': 'bill', 'lc-paid': 'paid'
  };
  Object.entries(legendMap).forEach(([elId, stat]) => {
     const el = document.getElementById(elId);
     if(el) el.textContent = counts[stat] || 0;
  });

  // Area badges
  const ptCount = tables.filter(t => {
    const slot = t.slotIds && t.slotIds[0] ? tableSlots[t.slotIds[0]] : null;
    return slot && slot.area && slot.area.startsWith('Piano Terra') && t.status !== 'free';
  }).length;
  
  const terrCount = tables.filter(t => {
    const slot = t.slotIds && t.slotIds[0] ? tableSlots[t.slotIds[0]] : null;
    return slot && slot.area && slot.area.startsWith('Terrazza') && t.status !== 'free';
  }).length;
  
  document.getElementById('badge-piano-terra').textContent = ptCount;
  document.getElementById('badge-terrazza').textContent = terrCount;
}

/* =====================================================
   PANEL RENDERING
===================================================== */
// Tracks which table is in "link mode" or "reserve mode"
let linkingMode = null; // null | tableId
let reservingMode = null; // null | tableId

function buildPanelContent(id) {
  const d = tables.find(t => t && t.id === id);
  if(!d) return '';
  const elapsed = d.startedAt ? formatTimer(Date.now() - d.startedAt) : '—';
  const baseSlot = d.slotIds && d.slotIds[0] ? tableSlots[d.slotIds[0]] : null;
  const areaLabel = baseSlot ? baseSlot.area : 'Generale';
  const isOccupied = !['free','reserved','paid'].includes(d.status);
  const isReserved = d.status === 'reserved';
  const isFree     = d.status === 'free';

  // Build order list HTML (loaded async from Firebase or from local orders store)
  const ordersHtml = buildOrdersList(id);

  return `
    <!-- Status + Timer -->
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
      <span class="status-badge" data-s="${d.status}">
        <span style="width:7px;height:7px;border-radius:50%;background:currentColor;"></span>
        ${STATUS_LABELS[d.status]}
      </span>
      <span style="font-size:0.75rem;color:var(--text-3);font-variant-numeric:tabular-nums;">${elapsed !== '—' ? '⏱ '+elapsed : ''}</span>
    </div>

    ${isReserved ? `
    <div class="info-row" style="background:var(--s-reserved-bg); border-color:var(--s-reserved-border); margin-bottom:8px;">
      <span style="color:var(--s-reserved); font-weight:700;">📅 ${d.reservedTime}</span>
      <span style="color:var(--text-2);">👥 ${d.reservedGuests} persone</span>
    </div>` : ''}

    <!-- === PRIMARY ACTIONS (most important first) === -->
    <div class="panel-actions" style="margin-top:8px;">

      <!-- 1. NUOVO ORDINE — only when table is NOT free/reserved -->
      <button class="pact-btn pact-btn--primary" 
        onclick="window.location.href='ordini.html?table=${id}'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
        Nuovo Ordine
      </button>

      <!-- 2. RICHIEDI CONTO — only if occupied -->
      <button class="pact-btn pact-btn--orange"
        ${!isOccupied ? 'disabled title="Nessun tavolo attivo"' : ''}
        onclick="window.setTableStatus(${id}, 'bill')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        Richiedi Conto
      </button>

      <!-- 3. LIBERA TAVOLO -->
      <button class="pact-btn pact-btn--ghost"
        ${isFree ? 'disabled' : ''}
        onclick="window.freeTable(${id})">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        Libera Tavolo
      </button>

      <!-- SEPARATOR -->
      <div style="height:1px;background:var(--border);margin:4px 0;"></div>

      <!-- 4. PRENOTA + COLLEGA/SCOLLEGA — secondary actions -->
      <div style="display:flex;gap:8px;">

        <!-- PRENOTA: disabled if table is occupied -->
        <button class="pact-btn pact-btn--ghost" style="flex:1; justify-content:center; color:var(--s-reserved); border-color:var(--s-reserved-border);"
          ${isOccupied ? 'disabled title="Tavolo occupato, non puoi prenotarlo"' : ''}
          onclick="window.startReservationMode(${id})">
          📅 Prenota
        </button>

        <!-- COLLEGA/SCOLLEGA: disabled if reserved -->
        ${d.slotIds.length > 1 ? `
        <button class="pact-btn pact-btn--ghost" style="flex:1; justify-content:center; color:#f87171; border-color:rgba(248,113,113,0.3);"
          ${isReserved ? 'disabled title="Tavolo prenotato, non puoi scollegarlo"' : ''}
          onclick="window.unlinkTable(${id})">✂️ Scollega</button>
        ` : `
        <button class="pact-btn pact-btn--ghost" style="flex:1; justify-content:center; color:var(--accent); border-color:rgba(59,130,246,0.3);"
          ${isReserved ? 'disabled title="Tavolo prenotato, non puoi collegarlo"' : ''}
          onclick="window.startLinkMode(${id})">⛓ Collega</button>
        `}
      </div>
    </div>

    <!-- === ORDINI === -->
    <div class="panel-section-lbl" style="margin-top:16px;">Ordini del Tavolo</div>
    <div id="orders-list-${id}" style="display:flex; flex-direction:column; gap:6px;">
      ${ordersHtml}
    </div>


    <div class="panel-section-lbl" style="margin-top:16px;">Cambia Stato</div>
    <div class="status-selector">
      ${Object.entries(STATUS_LABELS).map(([s, lbl]) => `
        <button class="status-btn ${d.status === s ? 'active' : ''}"
                style="${d.status === s ? `border-color:${STATUS_COLORS[s]}; background:${STATUS_COLORS[s]}1a;` : ''}"
                onclick="window.setTableStatus(${id}, '${s}')">
          <div class="status-btn__dot" style="background:${STATUS_COLORS[s]};"></div>
          ${lbl}
        </button>
      `).join('')}
    </div>
  `;
}

// ---- LINK MODE ----
function startLinkMode(id) {
  const d = tables.find(t => t && t.id === id);
  if(d && d.status === 'reserved') { showToast('⚠️', 'Non puoi collegare un tavolo prenotato.'); return; }
  linkingMode = id;
  renderTables();
  showToast('⛓', `Modalità collegamento attiva — clicca il tavolo da unire al Tavolo ${id}`);
}

function cancelLinkMode() {
  linkingMode = null;
  renderTables();
}

function startReservationMode(id) {
  const d = tables.find(t => t && t.id === id);
  if(d && !['free','paid'].includes(d.status)) { showToast('⚠️', 'Non puoi prenotare un tavolo occupato.'); return; }
  setReservation(id);
}

// ---- SAVE NOTE ----
function saveNote(id) {
  const t = tables.find(tb => tb && tb.id === id);
  if(!t) return;
  const el = document.getElementById(`note-input-${id}`);
  if(!el) return;
  t.note = el.value.trim();
  showToast('💾', 'Nota salvata');
  // Firebase sync
  if(window._fbReady && window._db) {
    const r = window._fbRef(window._db, `tables/${id}/note`);
    window._fbSet(r, t.note);
  }
}

// ---- ORDERS LIST from Firebase Realtime DB ----
function buildOrdersList(id) {
  const t = tables.find(tb => tb && tb.id === id);
  if(!t || !t.orders || t.orders.length === 0) {
    return `<div style="color:var(--text-3); font-size:0.82rem; padding:6px 0;">Nessun ordine registrato</div>`;
  }
  return t.orders.map(o => `
    <div style="background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div style="font-size:0.88rem; font-weight:600;">${o.name}</div>
        ${o.note ? `<div style="font-size:0.75rem; color:var(--text-3);">📝 ${o.note}</div>` : ''}
      </div>
      <div style="text-align:right;">
        <div style="font-size:0.8rem; color:var(--accent); font-weight:700;">x${o.qty}</div>
        <div style="font-size:0.75rem; color:var(--text-3);">${(o.price * o.qty).toFixed(2)} €</div>
      </div>
    </div>
  `).join('');
}

function subscribeTableOrders(id) {
  if(!window._fbReady || !window._db) return;
  const r = window._fbRef(window._db, `orders/table_${id}`);
  window._fbOnValue(r, (snapshot) => {
    const data = snapshot.val();
    const t = tables.find(tb => tb && tb.id === id);
    if(t) t.orders = data ? Object.values(data) : [];
    // Refresh order list in panel if still open
    const el = document.getElementById(`orders-list-${id}`);
    if(el) el.innerHTML = buildOrdersList(id);
  });
}

function openPanel(id) {
  selectedTableId = id;
  const d = tables.find(t => t && t.id === id);
  if(!d) return;
  // Init orders array if needed
  if(!d.orders) d.orders = [];

  document.getElementById('panelTitle').innerHTML = `Tavolo ${id} <span style="font-size:0.9rem; margin-left:8px; cursor:pointer; opacity:0.6;" onclick="editTableId('${id}')" title="Rinomina Tavolo">✏️</span>`;
  document.getElementById('panelSub').innerHTML = `
    <span style="color:${STATUS_COLORS[d.status]}">${STATUS_LABELS[d.status]}</span>
    <span style="opacity:0.5; margin:0 6px;">•</span>
    <span>${d.guests > 0 ? d.guests : d.seats} persone</span>
  `;
  document.getElementById('panelBody').innerHTML = buildPanelContent(id);
  document.getElementById('sidePanel').classList.add('open');
  document.getElementById('panelOverlay').classList.add('show');

  document.querySelectorAll('.table-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll(`[data-id="${id}"]`).forEach(c => c.classList.add('selected'));
  // Subscribe to real-time orders from Firebase
  subscribeTableOrders(id);
}

function closePanel() {
  document.getElementById('sidePanel').classList.remove('open');
  document.getElementById('panelOverlay').classList.remove('show');
  document.querySelectorAll('.table-card').forEach(c => c.classList.remove('selected'));
  selectedTableId = null;
}

function setTableStatus(id, newStatus) {
  const d = tables.find(t => t && t.id === id);
  if(!d) return;
  d.status = newStatus;
  
  if (newStatus === 'free' || newStatus === 'paid' || newStatus === 'reserved') {
    d.startedAt = null;
    
    // Mark all active orders for this table as PAID in Firebase
    if(window._fbReady && window._db) {
      window._onValue(window._ref(window._db, 'orders'), (snapshot) => {
        const data = snapshot.val();
        if(data) {
          const now = Date.now();
          const updates = {};
          Object.entries(data).forEach(([orderId, o]) => {
            if (o.tableId === id && !o.paidAt) {
              updates[`${orderId}/paidAt`] = now;
              updates[`${orderId}/paymentStatus`] = 'paid';
            }
          });
          if(Object.keys(updates).length > 0) {
            window._fbUpdate(window._ref(window._db, 'orders'), updates);
          }
        }
      }, { onlyOnce: true });
    }
  } else if (!d.startedAt) {
    d.startedAt = Date.now();
  }

  if(newStatus === 'free' || newStatus === 'paid') {
     d.reservedTime = '';
     d.reservedGuests = 0;
  }

  renderTables();
  if (selectedTableId === id) openPanel(id);
  showToast(STATUS_EMOJIS[newStatus], `Tavolo ${id}: ${STATUS_LABELS[newStatus]}`);
  if(window.syncTablesToDB) window.syncTablesToDB([id]);
}

function changeGuests(id, delta) {
  const d = tables.find(t => t && t.id === id);
  if(!d) return;
  d.guests = Math.max(0, Math.min(d.seats, d.guests + delta));
  const el = document.getElementById(`guest-val-${id}`);
  if (el) el.textContent = d.guests;
  if(window.syncTablesToDB) window.syncTablesToDB([id]);
}

function freeTable(id) {
  const d = tables.find(t => t && t.id === id);
  if(d) d.guests = 0;
  setTableStatus(id, 'free');
  closePanel();
}

/* =====================================================
   EVENT LISTENERS & INIT
===================================================== */
document.getElementById('areaTabs').addEventListener('click', (e) => {
  const btn = e.target.closest('.area-tab');
  if (!btn) return;
  const area = btn.dataset.area;
  document.querySelectorAll('.area-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.floor-area').forEach(a => a.classList.remove('active'));
  document.getElementById(`area-${area}`)?.classList.add('active');
  closePanel();
});

/* =====================================================
   GLOBAL TABLE CLICK HANDLER (direct onclick — no event delegation)
===================================================== */
window.handleTableClick = function(id) {
  id = parseInt(id);
  // LINK MODE
  if (linkingMode !== null && linkingMode !== id) {
    promptLinkTable(linkingMode, id);
    linkingMode = null;
    return;
  }
  if (linkingMode === id) { cancelLinkMode(); return; }
  // Normal: toggle panel
  if (selectedTableId === id) closePanel();
  else openPanel(id);
};

// Keep floorWrap listener only for closing panel when clicking empty space
document.getElementById('floorWrap').addEventListener('click', (e) => {
  const card = e.target.closest('.table-card');
  if (!card) {
    if (!e.target.closest('.side-panel') && !e.target.closest('#bottomSheet')) {
      if (linkingMode) cancelLinkMode();
      else closePanel();
    }
  }
});

document.getElementById('panelClose').addEventListener('click', closePanel);
document.getElementById('panelOverlay').addEventListener('click', closePanel);

document.querySelectorAll('.legend-item, .filter-chip').forEach(el => {
  el.addEventListener('click', () => {
    const filter = el.dataset.filter;
    if (!filter || filter === 'all') {
      document.querySelectorAll('.table-card').forEach(c => c.style.display = '');
    } else {
      document.querySelectorAll('.table-card').forEach(c => {
        const match = c.dataset.status === filter || (filter === 'occupied' && !['free','paid','reserved'].includes(c.dataset.status));
        c.style.display = match ? '' : 'none';
      });
    }
  });
});

document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('.table-card').forEach(card => {
    card.style.display = (!q || card.dataset.id.includes(q)) ? '' : 'none';
  });
});


// =====================================================
// EXPOSE FUNCTIONS TO GLOBAL (needed because script type=module is scoped)
// =====================================================
window.openPanel = openPanel;
window.closePanel = closePanel;
window.setTableStatus = setTableStatus;
window.setReservation = setReservation;
window.closeReservationModal = closeReservationModal;
window.confirmReservation = confirmReservation;
window.freeTable = freeTable;
window.startReservationMode = startReservationMode;
window.unlinkTable = unlinkTable;
window.startLinkMode = startLinkMode;
window.editTableId = editTableId;
window.cancelLinkMode = cancelLinkMode;
window.setTableStatus = setTableStatus;
window.freeTable = freeTable;
window.changeGuests = changeGuests;
window.saveNote = saveNote;
window.startReservationMode = startReservationMode;
window.startLinkMode = startLinkMode;
window.unlinkTable = unlinkTable;
window.cancelLinkMode = cancelLinkMode;
window.showToast = showToast;
window.promptLinkTable = promptLinkTable;
window.editTableId = editTableId;

let toastTimer = null;
function showToast(icon, msg) {
  const wrap = document.getElementById('toastWrap');
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastMsg').textContent = msg;
  wrap.style.display = 'block';
  wrap.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { wrap.classList.remove('show'); setTimeout(() => wrap.style.display = 'none', 400); }, 3000);
}

document.querySelectorAll('.bnav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
    item.classList.add('active');
  });
});

// INITIAL RENDER
renderTables();

// Polling per Firebase Sync
window.syncTablesToDB = async function(changedTableIds = null) {
  if (window._fbReady && window._db) {
    try {
      if (changedTableIds && Array.isArray(changedTableIds)) {
        const updates = {};
        changedTableIds.forEach(id => {
          const t = tables.find(tb => tb && tb.id === id);
          if (t) {
            const tCopy = { ...t };
            delete tCopy.orders; // MUST STRIP LOCAL UI ARRAYS BEFORE SYNCING TO FIREBASE!
            updates[`table_${id}`] = tCopy; 
          }
        });
        if (Object.keys(updates).length > 0) {
          // Atomic multi-path update directly on the 'tables' node to respect Security Rules
          await window._fbUpdate(window._ref(window._db, 'tables'), updates);
        }
      } else {
        const allTablesObj = {};
        tables.forEach(t => {
          if (t) {
            const tCopy = { ...t };
            delete tCopy.orders;
            allTablesObj[`table_${t.id}`] = tCopy;
          }
        });
        await window._fbSet(window._ref(window._db, 'tables'), allTablesObj);
      }
    } catch(e) { console.error("Error saving tables", e); }
  }
};

let isFirstLoad = true;

function initSync() {
  if(window._fbReady) {
    // 1. Sync Tables
    window._onValue(window._ref(window._db, 'tables'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let isLegacy = false;
        let parsedTables = [];
        
        if (Array.isArray(data)) {
           isLegacy = true;
           parsedTables = data.filter(t => t);
        } else {
           const keys = Object.keys(data);
           if (keys.length > 0 && !keys[0].startsWith('table_')) {
              isLegacy = true;
           }
           parsedTables = Object.values(data).filter(t => t);
        }
        
        tables = parsedTables;
        tables.sort((a, b) => a.id - b.id);
        
        if (isLegacy) {
           window.syncTablesToDB();
        }
        
        renderTables();
        if(selectedTableId) buildPanelContent(selectedTableId);
      } else if (isFirstLoad) {
        window.syncTablesToDB();
      }
      isFirstLoad = false;
    });

    // 2. Sync Orders to compute real-time status from KDS
    window._onValue(window._ref(window._db, 'orders'), (snapshot) => {
      const data = snapshot.val();
      const allOrders = data ? Object.values(data) : [];
      
      const changedIds = [];
      tables.forEach(t => {
        // Find all active orders for the table (not done)
        const tAllActiveOrders = allOrders.filter(o => o.tableId === t.id && o.status !== 'done');
        
        // Orders that are active AND not yet paid
        const tOrdersUnpaid = tAllActiveOrders.filter(o => o.paymentStatus !== 'paid');
        
        if (tOrdersUnpaid.length > 0) {
          if (t.status !== 'bill' && t.status !== 'paid' && t.status !== 'occupied') {
            const firstOrderTime = Math.min(...tOrdersUnpaid.map(o => o.timestamp || o.createdAt || Date.now()));
            if (!t.startedAt) t.startedAt = firstOrderTime;
            
            const allItems = tOrdersUnpaid.flatMap(o => o.items || []);
            let newStatus = 'preparing';
            if (allItems.length > 0 && allItems.some(i => i.status === 'ready')) {
              newStatus = 'ready';
            }
            if (t.status !== newStatus) {
              t.status = newStatus;
              changedIds.push(t.id);
            }
          }
        } else {
          // No unpaid active orders.
          if (t.status === 'preparing' || t.status === 'ready') {
            t.status = 'occupied'; // When kitchen finishes, people eat
            changedIds.push(t.id);
          } else if (tAllActiveOrders.length > 0 && (t.status === 'occupied' || t.status === 'bill')) {
            // All active orders have been marked as PAID!
            t.status = 'paid';
            changedIds.push(t.id);
          }
        }
      });
      if (changedIds.length > 0) {
        window.syncTablesToDB(changedIds);
      }
      renderTables();
    });
  } else {
    setTimeout(initSync, 100);
  }
}
initSync();

/* =====================================================
   NIGHTLY RESET (02:00 AM)
===================================================== */
function checkNightlyReset() {
  const now = new Date();
  const todayStr = now.toLocaleDateString();
  const lastReset = localStorage.getItem('lastNightlyReset');
  
  if (now.getHours() === 2 && now.getMinutes() === 0) {
    if (lastReset !== todayStr) {
      tables.forEach(t => {
        t.status = 'free';
        t.guests = 0;
        t.startedAt = null;
        t.reservedTime = '';
        t.reservedGuests = 0;
      });
      renderTables();
      localStorage.setItem('lastNightlyReset', todayStr);
      showToast('🧹', 'Reset notturno eseguito: i tavoli sono tornati liberi.');
      if(window.syncTablesToDB) window.syncTablesToDB();
    }
  }
}
setInterval(checkNightlyReset, 30000); // controlla ogni 30 secondi

setTimeout(() => {
  const readyTables = tables.filter(t => t.status === 'ready');
  if (readyTables.length > 0) {
    showToast('🟣', `Tavolo ${readyTables[0].id}: piatto pronto da servire!`);
  }
}, 2000);

document.addEventListener('DOMContentLoaded', () => {
  const fw = document.getElementById('floorWrap');
  if (fw) {
    new ResizeObserver(() => {
      const availW = fw.clientWidth - 32;
      const availH = fw.clientHeight - 32;
      let scale = Math.min(availW / 600, availH / 950);
      if (scale > 1.3) scale = 1.3;
      document.querySelectorAll('.floor-canvas').forEach(c => c.style.transform = `scale(${scale})`);
    }).observe(fw);
  }

  // Bind PWA install button
  const installBtn = document.getElementById('installPwaBtn');
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        const { outcome } = await window.deferredPrompt.userChoice;
        console.log(`User ${outcome} the install prompt`);
        window.deferredPrompt = null;
        installBtn.style.display = 'none';
      }
    });
  }
});

/* =====================================================
   PWA INSTALLATION EVENT
===================================================== */
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  const installBtn = document.getElementById('installPwaBtn');
  if (installBtn) {
    installBtn.style.display = 'flex';
  }
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then((registration) => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, (err) => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}