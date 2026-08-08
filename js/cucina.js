// js/cucina.js — KDS Cucina Hands-Free & Touch-Max
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

// =====================================================
// STATE
// =====================================================
let orders = [];
let currentFilter = 'all';
let soundEnabled = true;
let voiceActive = false;
let speechRecognition = null;
let previousOrdersCount = 0;

// Web Audio Synthesizer (no external mp3 files needed)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playChime(type = 'new') {
  if (!soundEnabled) return;
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'new') {
      // High double chime for new order
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } else {
      // Short click sound for state advance
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    }
  } catch (e) {
    console.warn('[Audio] Impostazione audio non avviata:', e);
  }
}

// =====================================================
// CLOCK
// =====================================================
function updateClock() {
  const now = new Date();
  const clockEl = document.getElementById('clockDisplay');
  if (clockEl) {
    clockEl.textContent = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  }
}
setInterval(updateClock, 1000);
updateClock();

// =====================================================
// TIMER FORMATTING
// =====================================================
function formatElapsed(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// =====================================================
// RENDER TICKETS
// =====================================================
function renderTickets() {
  const grid = document.getElementById('kdsGrid');
  if (!grid) return;

  const now = Date.now();

  const filtered = currentFilter === 'all'
    ? orders.filter(o => o.status !== 'done')
    : orders.filter(o => o.status === currentFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="kds-empty">
        <div class="kds-empty__icon"><i class="fa-solid fa-utensils" style="font-size:3rem; color:var(--text-3);"></i></div>
        <div class="kds-empty__title" style="margin-top:12px; font-weight:700;">Cucina libera!</div>
        <div style="color:var(--text-2); font-size:0.9rem;">Nessuna comanda ${currentFilter === 'all' ? 'in corso' : 'in questa categoria'}.</div>
      </div>`;
    updateStats();
    return;
  }

  grid.innerHTML = filtered.map((order, idx) => {
    const elapsed = now - (order.createdAt || now);
    const isUrgent = elapsed > 15 * 60000 && order.status !== 'ready';
    const timerStr = formatElapsed(elapsed);
    const statusLabel = { new: 'In attesa', cooking: 'In cottura', ready: 'Pronta ✅' }[order.status] || '';
    const itemsList = order.items || [];
    const shortcutNum = idx < 9 ? idx + 1 : null;

    const itemsHtml = itemsList.map(item => {
      const isDone = item.status === 'done';
      const isSelected = item.selected;
      const statusIcon = item.status === 'ready' ? '🟢' : item.status === 'cooking' ? '🔵' : '🟡';
      return `
      <div class="ticket__item">
        <div style="flex:1;">
          <div class="ticket__item-name" style="${isDone ? 'text-decoration:line-through; opacity:0.5;' : ''}">${statusIcon} ${escapeHtml(item.name)}</div>
          ${item.note ? `<div class="ticket__item-note">📝 ${escapeHtml(item.note)}</div>` : ''}
        </div>
        <div class="ticket__item-qty">×${item.qty}</div>
        <button class="ticket__item-check ${isSelected ? 'done' : ''}"
          onclick="event.stopPropagation(); toggleItem('${order.id}', '${item.id}')">
          ${isSelected ? '<i class="fa-solid fa-check"></i>' : ''}
        </button>
      </div>`;
    }).join('');

    const nextStatus = order.status === 'new' ? 'cooking' : order.status === 'cooking' ? 'ready' : 'done';
    const actionLabel = order.status === 'new' ? '🔵 Inizia Cottura' : order.status === 'cooking' ? '🟢 Segna Pronta' : '✅ Consegnata';

    return `
      <div class="ticket" data-status="${order.status}" data-order="${order.id}" onclick="handleTicketClick('${order.id}', '${nextStatus}')">
        ${shortcutNum ? `<div class="ticket__shortcut-badge">${shortcutNum}</div>` : ''}
        <div class="ticket__header">
          <div class="ticket__table"><i class="fa-solid fa-utensils"></i> Tavolo ${escapeHtml(String(order.tableId))}</div>
          <div class="ticket__meta">
            <span class="ticket__timer ${isUrgent ? 'urgent' : ''}" id="timer-${order.id}">${timerStr}</span>
            <span class="ticket__status-badge">${statusLabel}</span>
          </div>
        </div>
        <div class="ticket__items">${itemsHtml}</div>
        ${order.tableNote ? `<div class="ticket__table-note">⚠️ ${escapeHtml(order.tableNote)}</div>` : ''}
        <div class="ticket__actions">
          <button class="ticket__btn ticket__btn--${order.status === 'new' ? 'start' : order.status === 'cooking' ? 'ready' : 'done'}">
            ${actionLabel}
          </button>
        </div>
      </div>
    `;
  }).join('');

  updateStats();
}

// =====================================================
// TICKET CLICK / ADVANCE
// =====================================================
window.handleTicketClick = function(orderId, nextStatus) {
  playChime('click');
  advanceOrder(orderId, nextStatus);
};

function advanceOrder(orderId, newStatus) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const itemsList = order.items || [];
  const selectedItems = itemsList.filter(i => i.selected);
  const targets = selectedItems.length > 0 ? selectedItems : itemsList;

  targets.forEach(item => {
    item.status = newStatus;
    item.selected = false;
  });

  const allDone = itemsList.every(i => i.status === 'done');
  const allReadyOrDone = itemsList.every(i => i.status === 'ready' || i.status === 'done');
  const anyCookingOrReady = itemsList.some(i => i.status === 'cooking' || i.status === 'ready');

  if (allDone) order.status = 'done';
  else if (allReadyOrDone) order.status = 'ready';
  else if (anyCookingOrReady) order.status = 'cooking';
  else order.status = 'new';

  if (window._fbReady && window._db) {
    window._fbUpdate(window._fbRef(window._db, `orders/${orderId}`), { 
      status: order.status,
      items: order.items 
    });

    const tId = order.tableId;
    if (tId && tId !== 'Asporto') {
      const tableOrders = orders.filter(o => o.tableId === tId && !o.paidAt);
      const anyNew     = tableOrders.some(o => o.status === 'new');
      const anyCooking = tableOrders.some(o => o.status === 'cooking');
      const allOrdersDone = tableOrders.every(o => o.status === 'done' || o.status === 'ready');
      const anyReady   = tableOrders.some(o => o.status === 'ready' || o.status === 'done');

      let tableStatus = null;
      if (anyCooking || anyNew) {
        tableStatus = 'preparing';
      } else if (allOrdersDone && anyReady) {
        tableStatus = 'ready';
      }

      if (tableStatus) {
        window._fbUpdate(window._fbRef(window._db, `tables/${tId}`), { status: tableStatus });
      }
    }
  }

  renderTickets();
}

window.toggleItem = function(orderId, itemId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  const item = (order.items || []).find(i => i.id === itemId);
  if (!item) return;
  item.selected = !item.selected;
  renderTickets();
};

// =====================================================
// KEYBOARD / NUMPAD SHORTCUTS
// =====================================================
document.addEventListener('keydown', (e) => {
  // If user is typing in an input field, ignore
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

  const key = e.key;

  // Spacebar or Enter -> Advance oldest active order
  if (key === ' ' || key === 'Enter') {
    e.preventDefault();
    const active = orders.filter(o => o.status !== 'done');
    if (active.length > 0) {
      const oldest = active[0];
      const nextStatus = oldest.status === 'new' ? 'cooking' : oldest.status === 'cooking' ? 'ready' : 'done';
      handleTicketClick(oldest.id, nextStatus);
    }
    return;
  }

  // Numpad or number keys 1-9 -> Advance visible ticket #N
  if (key >= '1' && key <= '9') {
    const num = parseInt(key) - 1;
    const filtered = currentFilter === 'all'
      ? orders.filter(o => o.status !== 'done')
      : orders.filter(o => o.status === currentFilter);

    if (filtered[num]) {
      const target = filtered[num];
      const nextStatus = target.status === 'new' ? 'cooking' : target.status === 'cooking' ? 'ready' : 'done';
      handleTicketClick(target.id, nextStatus);
    }
  }
});

// =====================================================
// VOICE CONTROL (Web Speech API)
// =====================================================
window.toggleVoice = function() {
  const banner = document.getElementById('voiceBanner');
  const btnLabel = document.getElementById('voiceLabel');
  
  if (voiceActive) {
    stopVoice();
  } else {
    startVoice();
  }
};

function startVoice() {
  const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Speech) {
    alert('I comandi vocali non sono supportati su questo browser. Usa Chrome, Edge o Safari.');
    return;
  }

  speechRecognition = new Speech();
  speechRecognition.lang = 'it-IT';
  speechRecognition.continuous = true;
  speechRecognition.interimResults = false;

  speechRecognition.onstart = () => {
    voiceActive = true;
    document.getElementById('voiceBanner').style.display = 'flex';
    document.getElementById('voiceLabel').textContent = 'Vocale ON';
  };

  speechRecognition.onresult = (event) => {
    const lastResult = event.results[event.results.length - 1];
    if (lastResult.isFinal) {
      const text = lastResult[0].transcript.toLowerCase().trim();
      processVoiceCommand(text);
    }
  };

  speechRecognition.onerror = (e) => {
    console.warn('[Vocale] Errore:', e.error);
  };

  speechRecognition.onend = () => {
    // Auto-restart if voice is still active
    if (voiceActive) {
      try { speechRecognition.start(); } catch(err) {}
    }
  };

  try {
    speechRecognition.start();
  } catch (err) {
    console.error('[Vocale] Impossibile avviare:', err);
  }
}

function stopVoice() {
  voiceActive = false;
  if (speechRecognition) {
    try { speechRecognition.stop(); } catch(err) {}
  }
  document.getElementById('voiceBanner').style.display = 'none';
  document.getElementById('voiceLabel').textContent = 'Vocale OFF';
}

function processVoiceCommand(text) {
  const statusText = document.getElementById('voiceStatusText');
  if (statusText) statusText.textContent = `🎤 Ho ascoltato: "${text}"`;

  const numberMap = { 'uno': 1, 'due': 2, 'tre': 3, 'quattro': 4, 'cinque': 5, 'sei': 6, 'sette': 7, 'otto': 8, 'nove': 9, 'dieci': 10 };
  
  // Extract number from command (e.g., "tavolo 3", "tavolo tre")
  let tableNum = null;
  const match = text.match(/\d+/);
  if (match) {
    tableNum = parseInt(match[0]);
  } else {
    for (const [word, val] of Object.entries(numberMap)) {
      if (text.includes(word)) { tableNum = val; break; }
    }
  }

  if (tableNum) {
    // Find order matching table number
    const targetOrder = orders.find(o => String(o.tableId) === String(tableNum) && o.status !== 'done');
    if (targetOrder) {
      const nextStatus = targetOrder.status === 'new' ? 'cooking' : targetOrder.status === 'cooking' ? 'ready' : 'done';
      handleTicketClick(targetOrder.id, nextStatus);
      if (statusText) statusText.textContent = `✅ Avanzata comanda Tavolo ${tableNum}!`;
      return;
    }
  }

  // Keywords "pronto", "cottura", "avanza"
  if (text.includes('spazio') || text.includes('avanza') || text.includes('prossima')) {
    const active = orders.filter(o => o.status !== 'done');
    if (active.length > 0) {
      const oldest = active[0];
      const nextStatus = oldest.status === 'new' ? 'cooking' : oldest.status === 'cooking' ? 'ready' : 'done';
      handleTicketClick(oldest.id, nextStatus);
      if (statusText) statusText.textContent = `✅ Avanzata comanda più vecchia!`;
    }
  }
}

// =====================================================
// AUDIO TOGGLE
// =====================================================
window.toggleSound = function() {
  soundEnabled = !soundEnabled;
  const soundLabel = document.getElementById('soundLabel');
  if (soundLabel) soundLabel.textContent = soundEnabled ? 'Suono ON' : 'Suono OFF';
};

// =====================================================
// FILTER CHIPS & STATS
// =====================================================
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentFilter = chip.dataset.filter;
    renderTickets();
  });
});

function updateStats() {
  const active = orders.filter(o => o.status !== 'done');
  document.getElementById('cnt-new').textContent    = active.filter(o => o.status === 'new').length;
  document.getElementById('cnt-cooking').textContent = active.filter(o => o.status === 'cooking').length;
  document.getElementById('cnt-ready').textContent   = active.filter(o => o.status === 'ready').length;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// =====================================================
// FIREBASE LIVE SUBSCRIBE
// =====================================================
function subscribeFirebase() {
  if (!window._fbReady || !window._db) return;
  const r = window._fbRef(window._db, 'orders');
  window._fbOnValue(r, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      orders = Object.entries(data).map(([id, o]) => ({ id, ...o }));
      
      // Play chime if new order arrived
      const currentActiveCount = orders.filter(o => o.status === 'new').length;
      if (currentActiveCount > previousOrdersCount && previousOrdersCount !== 0) {
        playChime('new');
      }
      previousOrdersCount = currentActiveCount;
    } else {
      orders = [];
    }
    renderTickets();
  });
}

function initApp() {
  if (window._fbReady && window._db) {
    subscribeFirebase();
  } else {
    setTimeout(initApp, 50);
  }
}
initApp();

window.advanceOrder = advanceOrder;
window.toggleItem = toggleItem;