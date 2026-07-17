import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
    import { getDatabase, ref, onValue, update } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
    const firebaseConfig = {
      apiKey:            "AIzaSyCtJWFHpz_wSZd7pVxhUdNkGUNjuRXDexc",
      authDomain:        "in-punto.firebaseapp.com",
      databaseURL:       "https://in-punto-default-rtdb.europe-west1.firebasedatabase.app",
      projectId:         "in-punto",
      storageBucket:     "in-punto.firebasestorage.app",
      messagingSenderId: "851521503055",
      appId:             "1:851521503055:web:7e23520cf67641f044cf3a"
    };
    const fbApp = initializeApp(firebaseConfig);
    const db    = getDatabase(fbApp);
    window._db = db;
    window._fbRef = ref;
    window._fbOnValue = onValue;
    window._fbUpdate = update;
    window._fbReady = true;
    console.log('[Cucina] Firebase connesso ✅');

/* =====================================================
   FIREBASE LIVE DATA
===================================================== */
let orders = [];
let currentFilter = 'all';

function initApp() {
  if (window._fbReady && window._db) {
    subscribeFirebase();
  } else {
    setTimeout(initApp, 50);
  }
}
initApp();

/* =====================================================
   CLOCK
===================================================== */
function updateClock() {
  const now = new Date();
  document.getElementById('clockDisplay').textContent =
    now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}
updateClock();
setInterval(updateClock, 1000);

/* =====================================================
   TIMER FORMATTING
===================================================== */
function formatElapsed(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/* =====================================================
   RENDER
===================================================== */
function renderTickets() {
  const grid = document.getElementById('kdsGrid');
  const now = Date.now();

  const filtered = currentFilter === 'all'
    ? orders.filter(o => o.status !== 'done')
    : orders.filter(o => o.status === currentFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="kds-empty">
        <div class="kds-empty__icon">👨‍🍳</div>
        <div class="kds-empty__title">Cucina libera!</div>
        <div>Nessuna comanda ${currentFilter === 'all' ? 'in corso' : 'in questa categoria'}.</div>
      </div>`;
    updateStats();
    return;
  }

  grid.innerHTML = filtered.map(order => {
    const elapsed = now - order.createdAt;
    const isUrgent = elapsed > 15 * 60000 && order.status !== 'ready';
    const timerStr = formatElapsed(elapsed);
    const statusLabel = { new: 'In attesa', cooking: 'In cottura', ready: 'Pronta ✅' }[order.status] || '';
    const itemsList = order.items || [];
    const allDone = itemsList.length > 0 && itemsList.every(i => i.done);

    const itemsHtml = itemsList.map(item => {
      const isDone = item.status === 'done';
      const isSelected = item.selected;
      const statusIcon = item.status === 'ready' ? '🟢' : item.status === 'cooking' ? '🔵' : '🟡';
      return `
      <div class="ticket__item">
        <div style="flex:1;">
          <div class="ticket__item-name" style="${isDone ? 'text-decoration:line-through; opacity:0.5;' : ''}">${statusIcon} ${item.name}</div>
          ${item.note ? `<div class="ticket__item-note">📝 ${item.note}</div>` : ''}
        </div>
        <div class="ticket__item-qty">×${item.qty}</div>
        <button class="ticket__item-check ${isSelected ? 'done' : ''}"
          onclick="toggleItem('${order.id}', '${item.id}')">
          ${isSelected ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </button>
      </div>
    `}).join('');

    const actionsHtml = order.status === 'new' ? `
      <button class="ticket__btn ticket__btn--start" onclick="advanceOrder('${order.id}', 'cooking')">🔵 Inizia cottura</button>
    ` : order.status === 'cooking' ? `
      <button class="ticket__btn ticket__btn--ready" onclick="advanceOrder('${order.id}', 'ready')">🟢 Segna Pronta</button>
    ` : order.status === 'ready' ? `
      <button class="ticket__btn ticket__btn--done" onclick="advanceOrder('${order.id}', 'done')">✅ Consegnata</button>
    ` : '';

    return `
      <div class="ticket" data-status="${order.status}" data-order="${order.id}">
        <div class="ticket__header">
          <div class="ticket__table">🍽️ Tavolo ${order.tableId}</div>
          <div class="ticket__meta">
            <span class="ticket__timer ${isUrgent ? 'urgent' : ''}" id="timer-${order.id}">${timerStr}</span>
            <span class="ticket__status-badge">${statusLabel}</span>
          </div>
        </div>
        <div class="ticket__items">${itemsHtml}</div>
        ${order.tableNote ? `<div class="ticket__table-note">⚠️ ${order.tableNote}</div>` : ''}
        <div class="ticket__actions">${actionsHtml}</div>
      </div>
    `;
  }).join('');

  updateStats();
}

/* =====================================================
   INTERACTIONS
===================================================== */
function advanceOrder(orderId, newStatus) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  // Selezionati oppure tutti (se nessuno è selezionato)
  const itemsList = order.items || [];
  const selectedItems = itemsList.filter(i => i.selected);
  const targets = selectedItems.length > 0 ? selectedItems : itemsList;

  targets.forEach(item => {
    item.status = newStatus;
    item.selected = false; // Deseleziona dopo l'azione
  });

  // Ricalcola stato ordine
  const allDone = itemsList.every(i => i.status === 'done');
  const allReadyOrDone = itemsList.every(i => i.status === 'ready' || i.status === 'done');
  const anyCookingOrReady = itemsList.some(i => i.status === 'cooking' || i.status === 'ready');

  if (allDone) order.status = 'done';
  else if (allReadyOrDone) order.status = 'ready';
  else if (anyCookingOrReady) order.status = 'cooking';
  else order.status = 'new';

  // Firebase sync — ordine
  if(window._fbReady && window._db) {
    window._fbUpdate(window._fbRef(window._db, `orders/${orderId}`), { 
      status: order.status,
      items: order.items 
    });

    // Aggiorna status tavolo in base allo stato aggregato di tutti gli ordini del tavolo
    const tId = order.tableId;
    if (tId && tId !== 'Asporto') {
      // Raccogli tutti gli ordini attivi per questo tavolo
      const tableOrders = orders.filter(o => o.tableId === tId && !o.paidAt);

      // Determina lo status globale del tavolo
      const anyNew     = tableOrders.some(o => o.status === 'new');
      const anyCooking = tableOrders.some(o => o.status === 'cooking');
      const allOrdersDone = tableOrders.every(o => o.status === 'done' || o.status === 'ready');
      const anyReady   = tableOrders.some(o => o.status === 'ready' || o.status === 'done');

      let tableStatus = null;
      if (anyCooking || anyNew) {
        tableStatus = 'preparing'; // almeno uno in cottura → tavolo "In preparazione"
      } else if (allOrdersDone && anyReady) {
        tableStatus = 'ready';     // tutti pronti/consegnati → "Pronto da servire"
      }

      if (tableStatus) {
        window._fbUpdate(window._fbRef(window._db, `tables/${tId}`), { status: tableStatus });
      }
    }
  }

  renderTickets();
}

function toggleItem(orderId, itemId) {
  const order = orders.find(o => o.id === orderId);
  if(!order) return;
  const item = (order.items || []).find(i => i.id === itemId);
  if(!item) return;
  
  item.selected = !item.selected;
  renderTickets();
}

/* =====================================================
   FILTER CHIPS
===================================================== */
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentFilter = chip.dataset.filter;
    renderTickets();
  });
});

/* =====================================================
   STATS
===================================================== */
function updateStats() {
  const active = orders.filter(o => o.status !== 'done');
  document.getElementById('cnt-new').textContent    = active.filter(o => o.status === 'new').length;
  document.getElementById('cnt-cooking').textContent = active.filter(o => o.status === 'cooking').length;
  document.getElementById('cnt-ready').textContent   = active.filter(o => o.status === 'ready').length;
}

/* =====================================================
   LIVE TIMERS
===================================================== */
setInterval(() => {
  const now = Date.now();
  orders.forEach(order => {
    if(order.status === 'done') return;
    const el = document.getElementById(`timer-${order.id}`);
    if(!el) return;
    const orderTime = order.timestamp || order.createdAt || now;
    const elapsed = now - orderTime;
    el.textContent = formatElapsed(elapsed);
    if(elapsed > 15 * 60000 && order.status !== 'ready') {
      el.classList.add('urgent');
    }
  });
}, 1000);

/* =====================================================
   FIREBASE LIVE SUBSCRIBE (when ready)
===================================================== */
function subscribeFirebase() {
  if(!window._fbReady || !window._db) return;
  const r = window._fbRef(window._db, 'orders');
  window._fbOnValue(r, (snapshot) => {
    const data = snapshot.val();
    if(data) {
      orders = Object.entries(data).map(([id, o]) => ({ id, ...o }));
    } else {
      orders = [];
    }
    renderTickets();
  });
}

/* =====================================================
   INIT
===================================================== */
window.advanceOrder = advanceOrder;
window.toggleItem = toggleItem;

renderTickets();
subscribeFirebase();