import re

with open('tavoli.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. ADD CSS FOR RESERVED
css_reserved = """
      --s-reserved:        #0ea5e9;
      --s-reserved-bg:     rgba(14,165,233,0.12);
      --s-reserved-border: rgba(14,165,233,0.30);
"""
# Insert after --s-free block
content = content.replace("--s-free-border: rgba(34,197,94,0.30);", "--s-free-border: rgba(34,197,94,0.30);\n" + css_reserved)

# Add reserved modifier to table-card CSS
css_card_res = '.table-card[data-status="reserved"]      { border-color: var(--s-reserved-border);   background: var(--s-reserved-bg); }'
content = content.replace('.table-card[data-status="free"]', css_card_res + '\n    .table-card[data-status="free"]')
# Add dot animation (pulse)
css_dot_res = '[data-status="reserved"]   .table-card__status-dot { background: var(--s-reserved); box-shadow: 0 0 6px var(--s-reserved); }'
content = content.replace('[data-status="free"]       .table-card__status-dot', css_dot_res + '\n    [data-status="free"]       .table-card__status-dot')
# Add status badge CSS
css_badge_res = '.status-badge[data-s="reserved"]      { background: var(--s-reserved-bg);      color: var(--s-reserved);      border: 1px solid var(--s-reserved-border); }'
content = content.replace('.status-badge[data-s="free"]', css_badge_res + '\n    .status-badge[data-s="free"]')

# 2. REMOVE WAITER SECTION IN HTML
waiter_section_regex = r'<div class="sidebar-section">\s*<div class="sidebar__label">Camerieri</div>\s*<div.*?id="waiterList">.*?</div>\s*</div>'
content = re.sub(waiter_section_regex, '', content, flags=re.DOTALL)

# 3. EMPTY OUT FLOOR CANVASES HTML
# For Piano Terra
pt_canvas_start = '<div class="floor-canvas" style="height: 720px;">'
pt_canvas_end = '</div><!-- end floor-canvas -->'
pt_match = re.search(r'(<div class="floor-canvas" style="height: 720px;">)(.*?)(</div><!-- end floor-canvas -->)', content, flags=re.DOTALL)
if pt_match:
    # Keep the architectural elements, remove tables
    pt_inner = pt_match.group(2)
    # Remove everything from <!-- TABLE 1 --> onwards
    pt_clean = re.sub(r'<!-- TABLE 1 -->.*', '', pt_inner, flags=re.DOTALL)
    # Append the dynamic container
    pt_clean += '\n<div id="floor-canvas-pt-dynamic"></div>\n'
    content = content.replace(pt_match.group(0), pt_canvas_start + pt_clean + pt_canvas_end)

# For Terrazza
tr_canvas_start = '<div class="floor-canvas" style="height: 700px;">'
tr_match = re.search(r'(<div class="floor-canvas" style="height: 700px;">)(.*?)(</div><!-- end floor-canvas -->)', content, flags=re.DOTALL)
if tr_match:
    tr_inner = tr_match.group(2)
    tr_clean = re.sub(r'<!-- TABLE 20.*', '', tr_inner, flags=re.DOTALL)
    
    # We must keep the Stage element at the end!
    stage_html = """
          <!-- Stage / decorative element -->
          <div class="arch-wall arch-wall--label"
               style="bottom:60px; right:20px; width:260px; height:80px; border-radius:8px 8px 0 0; opacity:0.5;">
            AREA PALCO
          </div>
          <!-- Stage lines -->
          <div style="position:absolute; bottom:0; right:20px; width:260px; display:flex; gap:20px; pointer-events:none; padding: 0 8px;">
            <div style="width:2px; height:60px; background:rgba(255,255,255,0.05);"></div>
            <div style="width:2px; height:60px; background:rgba(255,255,255,0.05);"></div>
            <div style="width:2px; height:60px; background:rgba(255,255,255,0.05);"></div>
            <div style="width:2px; height:60px; background:rgba(255,255,255,0.05);"></div>
            <div style="width:2px; height:60px; background:rgba(255,255,255,0.05);"></div>
            <div style="width:2px; height:60px; background:rgba(255,255,255,0.05);"></div>
            <div style="width:2px; height:60px; background:rgba(255,255,255,0.05);"></div>
          </div>
"""
    tr_clean += '\n<div id="floor-canvas-tr-dynamic"></div>\n' + stage_html
    content = content.replace(tr_match.group(0), tr_canvas_start + tr_clean + pt_canvas_end)


# 4. REPLACE JAVASCRIPT BLOCK
new_js = """
/* =====================================================
   DATA — Status definitions
===================================================== */
const STATUS_LABELS = {
  'free':       'Disponibile',
  'reserved':   'Prenotato',
  'wait-order': 'Attesa ordine',
  'preparing':  'In preparazione',
  'ready':      'Pronto da servire',
  'bill':       'Attesa conto',
  'paid':       'Pagato / Chiuso'
};

const STATUS_COLORS = {
  'free':       '#22c55e',
  'reserved':   '#0ea5e9',
  'wait-order': '#f59e0b',
  'preparing':  '#3b82f6',
  'ready':      '#a855f7',
  'bill':       '#f97316',
  'paid':       '#475569'
};

const STATUS_EMOJIS = {
  'free':       '🟢',
  'reserved':   '🩵',
  'wait-order': '🟡',
  'preparing':  '🔵',
  'ready':      '🟣',
  'bill':       '🟠',
  'paid':       '⚫'
};

/* =====================================================
   DATA — Slots & Tables
===================================================== */
const tableSlots = {
  'pt_1': { area: 'Piano Terra', left: '20px', top: '440px', type: 'sq', baseSeats: 2 },
  'pt_2': { area: 'Piano Terra', left: '20px', top: '340px', type: 'sq', baseSeats: 2 },
  'pt_3': { area: 'Piano Terra', left: '20px', top: '240px', type: 'sq', baseSeats: 2 },
  'pt_4': { area: 'Piano Terra', left: '160px', top: '340px', type: 'sq', baseSeats: 2 },
  'pt_5': { area: 'Piano Terra (Esterno)', left: '100px', top: '600px', type: 'sq', baseSeats: 2 },
  'pt_6': { area: 'Piano Terra (Esterno)', left: '220px', top: '600px', type: 'sq', baseSeats: 4 },
  'pt_7': { area: 'Piano Terra (Esterno)', left: '340px', top: '600px', type: 'sq', baseSeats: 2 },
  'tr_20': { area: 'Terrazza', left: '20px', top: '390px', type: 'sq', baseSeats: 2 },
  'tr_21a': { area: 'Terrazza', left: '60px', top: '240px', type: 'sq', baseSeats: 4 },
  'tr_21b': { area: 'Terrazza', left: '160px', top: '240px', type: 'sq', baseSeats: 2 },
  'tr_22': { area: 'Terrazza', right: '120px', top: '120px', type: 'sq', baseSeats: 2 },
  'tr_23': { area: 'Terrazza', right: '120px', top: '260px', type: 'sq', baseSeats: 4 },
};

let tables = [
  { id: 1, slotIds: ['pt_1'], status: 'free', guests: 0, seats: 2, reservedTime: '', reservedGuests: 0, startedAt: null },
  { id: 2, slotIds: ['pt_2'], status: 'preparing', guests: 2, seats: 2, reservedTime: '', reservedGuests: 0, startedAt: Date.now() - 32*60000 },
  { id: 3, slotIds: ['pt_3'], status: 'ready', guests: 2, seats: 2, reservedTime: '', reservedGuests: 0, startedAt: Date.now() - 48*60000 },
  { id: 4, slotIds: ['pt_4'], status: 'wait-order', guests: 2, seats: 2, reservedTime: '', reservedGuests: 0, startedAt: Date.now() - 8*60000 },
  { id: 5, slotIds: ['pt_5'], status: 'preparing', guests: 2, seats: 2, reservedTime: '', reservedGuests: 0, startedAt: Date.now() - 22*60000 },
  { id: 6, slotIds: ['pt_6'], status: 'free', guests: 0, seats: 4, reservedTime: '', reservedGuests: 0, startedAt: null },
  { id: 7, slotIds: ['pt_7'], status: 'free', guests: 0, seats: 2, reservedTime: '', reservedGuests: 0, startedAt: null },
  { id: 20, slotIds: ['tr_20'], status: 'free', guests: 0, seats: 2, reservedTime: '', reservedGuests: 0, startedAt: null },
  { id: 21, slotIds: ['tr_21a', 'tr_21b'], status: 'preparing', guests: 6, seats: 6, reservedTime: '', reservedGuests: 0, startedAt: Date.now() - 15*60000 },
  { id: 22, slotIds: ['tr_22'], status: 'free', guests: 0, seats: 2, reservedTime: '', reservedGuests: 0, startedAt: null },
  { id: 23, slotIds: ['tr_23'], status: 'bill', guests: 3, seats: 4, reservedTime: '', reservedGuests: 0, startedAt: Date.now() - 55*60000 },
];

let selectedTableId = null;

/* =====================================================
   RENDER ENGINE
===================================================== */
function renderTables() {
  const containerPT = document.getElementById('floor-canvas-pt-dynamic');
  const containerTR = document.getElementById('floor-canvas-tr-dynamic');
  
  if (!containerPT || !containerTR) return;
  
  containerPT.innerHTML = '';
  containerTR.innerHTML = '';
  
  tables.forEach(t => {
     t.slotIds.forEach((slotId, index) => {
       const slot = tableSlots[slotId];
       const isMain = index === 0;
       
       let cardHtml = `
         <div class="table-card table-card--${slot.type}" 
              data-id="${t.id}" data-status="${t.status}"
              style="${slot.left ? 'left:'+slot.left+';' : ''} ${slot.right ? 'right:'+slot.right+';' : ''} top:${slot.top}; opacity: ${isMain ? 1 : 0.8};">
           <div class="table-card__status-dot"></div>
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
       
       if(slot.area.startsWith('Piano Terra')) {
          containerPT.innerHTML += cardHtml;
       } else {
          containerTR.innerHTML += cardHtml;
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
function promptLinkTable(id) {
  const tableIdx = tables.findIndex(t => t.id === id);
  if (tableIdx === -1) return;
  
  const targetIdStr = prompt(`Inserisci il numero del tavolo da unire al Tavolo ${id}:`);
  if (!targetIdStr) return;
  const targetId = parseInt(targetIdStr);
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
  tables.splice(targetIdx, 1);
  
  // Shift tables downwards to close gap
  tables.forEach(t => {
     if (t.id > targetId) t.id--;
  });
  
  renderTables();
  showToast('✅', `Tavolo ${targetId} unito al Tavolo ${id}!`);
  closePanel();
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
  
  t.seats -= splitSlot.baseSeats;
  const newId = id + 1;
  
  // Shift tables upwards to make space
  tables.forEach(table => {
     if (table.id >= newId) table.id++;
  });
  
  // Insert new table directly after current
  tables.splice(tableIdx + 1, 0, {
    id: newId,
    slotIds: [splitSlotId],
    status: 'free',
    guests: 0,
    seats: splitSlot.baseSeats,
    reservedTime: '',
    reservedGuests: 0,
    startedAt: null
  });
  
  renderTables();
  showToast('✂️', `Tavolo diviso. Creato nuovo Tavolo ${newId}`);
  closePanel();
}

function setReservation(id) {
  const t = tables.find(tb => tb.id === id);
  if(!t) return;
  
  const time = prompt("Inserisci orario prenotazione (es. 20:30):", t.reservedTime || "20:00");
  if(!time) return;
  const guests = prompt("Numero di persone:", t.reservedGuests || t.seats);
  if(!guests) return;
  
  t.status = 'reserved';
  t.reservedTime = time;
  t.reservedGuests = parseInt(guests);
  t.guests = 0;
  t.startedAt = null;
  
  renderTables();
  showToast('📅', `Tavolo ${id} prenotato per le ${time}`);
  openPanel(id);
}

/* =====================================================
   CLOCK & TIMERS
===================================================== */
function updateClock() {
  const now = new Date();
  document.getElementById('clockDisplay').textContent = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}
updateClock();
setInterval(updateClock, 1000);

function formatTimer(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateTimers() {
  const now = Date.now();
  tables.forEach(d => {
    const el = document.getElementById(`timer-${d.id}`);
    if (el && d.startedAt) el.textContent = formatTimer(now - d.startedAt);
  });
}
setInterval(updateTimers, 1000);

/* =====================================================
   STATS
===================================================== */
function updateStats() {
  const counts = { free: 0, reserved: 0, 'wait-order': 0, preparing: 0, ready: 0, bill: 0, paid: 0 };
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
    'lc-free': 'free', 'lc-wait': 'wait-order', 'lc-prep': 'preparing', 
    'lc-ready': 'ready', 'lc-bill': 'bill', 'lc-paid': 'paid'
  };
  Object.entries(legendMap).forEach(([elId, stat]) => {
     const el = document.getElementById(elId);
     if(el) el.textContent = counts[stat] || 0;
  });

  // Area badges
  const ptCount = tables.filter(t => tableSlots[t.slotIds[0]].area.startsWith('Piano Terra') && t.status !== 'free').length;
  const terrCount = tables.filter(t => tableSlots[t.slotIds[0]].area.startsWith('Terrazza') && t.status !== 'free').length;
  document.getElementById('badge-piano-terra').textContent = ptCount;
  document.getElementById('badge-terrazza').textContent = terrCount;
}

/* =====================================================
   PANEL RENDERING
===================================================== */
function buildPanelContent(id) {
  const d = tables.find(t => t.id === id);
  if(!d) return '';
  const elapsed = d.startedAt ? formatTimer(Date.now() - d.startedAt) : '—';
  const areaLabel = tableSlots[d.slotIds[0]].area;

  return `
    <div style="display:flex; align-items:center; justify-content:space-between;">
      <span class="status-badge" data-s="${d.status}">
        <span style="width:7px;height:7px;border-radius:50%;background:currentColor;"></span>
        ${STATUS_LABELS[d.status]}
      </span>
      <span style="font-size:0.75rem;color:var(--text-3);font-variant-numeric:tabular-nums;">${elapsed !== '—' ? '⏱ '+elapsed : ''}</span>
    </div>

    ${d.status === 'reserved' ? `
    <div class="panel-section-lbl" style="color:var(--s-reserved); margin-top:12px;">Dettagli Prenotazione</div>
    <div class="info-row" style="background:var(--s-reserved-bg); border-color:var(--s-reserved-border)">
      <span class="info-row__label" style="color:var(--text)">Orario: <strong>${d.reservedTime}</strong></span>
      <span class="info-row__label" style="color:var(--text)">Persone: <strong>${d.reservedGuests}</strong></span>
    </div>
    ` : ''}

    <div class="panel-section-lbl" style="margin-top:12px;">Coperti</div>
    <div>
      <div class="guest-counter">
        <button class="counter-btn" onclick="changeGuests(${id}, -1)">−</button>
        <div><div class="counter-val" id="guest-val-${id}">${d.guests}</div></div>
        <button class="counter-btn" onclick="changeGuests(${id}, +1)">+</button>
      </div>
      <div class="counter-lbl">/ ${d.seats} posti disponibili</div>
    </div>

    <div class="panel-section-lbl">Dettagli</div>
    <div class="info-row"><span class="info-row__label">📍 Area</span><span class="info-row__val">${areaLabel}</span></div>
    <div class="info-row"><span class="info-row__label">🪑 Posti</span><span class="info-row__val">${d.seats}</span></div>
    <div class="info-row"><span class="info-row__label">🧩 Composizione</span><span class="info-row__val">${d.slotIds.length} slot</span></div>

    <div class="panel-section-lbl">Cambia Stato</div>
    <div class="status-selector">
      ${Object.entries(STATUS_LABELS).map(([s, lbl]) => `
        <button class="status-btn ${d.status === s ? 'active' : ''}"
                style="${d.status === s ? `border-color:${STATUS_COLORS[s]}; background:${STATUS_COLORS[s]}1a;` : ''}"
                onclick="setTableStatus(${id}, '${s}')">
          <div class="status-btn__dot" style="background:${STATUS_COLORS[s]};"></div>
          ${lbl}
        </button>
      `).join('')}
    </div>

    <div class="panel-section-lbl">Azioni Rapide</div>
    <div class="panel-actions">
      <div style="display:flex;gap:8px;">
        <button class="pact-btn pact-btn--ghost" style="flex:1; justify-content:center; color:var(--text); border-color:var(--s-reserved)" onclick="setReservation(${id})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          Prenota
        </button>
        ${d.slotIds.length > 1 ? `
        <button class="pact-btn pact-btn--ghost" style="flex:1; justify-content:center; color:var(--text); border-color:#ef4444" onclick="unlinkTable(${id})">
          ✂️ Scollega
        </button>
        ` : `
        <button class="pact-btn pact-btn--ghost" style="flex:1; justify-content:center; color:var(--text); border-color:var(--accent)" onclick="promptLinkTable(${id})">
          ⛓ Collega
        </button>
        `}
      </div>
      <button class="pact-btn pact-btn--primary" onclick="showToast('🍽️', 'Apertura menu ordini per Tavolo ${id}')">Nuovo Ordine</button>
      <button class="pact-btn pact-btn--orange" onclick="setTableStatus(${id}, 'bill')">Richiedi Conto</button>
      <button class="pact-btn pact-btn--ghost" onclick="freeTable(${id})">Libera Tavolo</button>
    </div>
  `;
}

function openPanel(id) {
  selectedTableId = id;
  const d = tables.find(t => t.id === id);
  if(!d) return;

  const isMobile = window.innerWidth <= 900;
  if (isMobile) {
    document.getElementById('sheetBody').innerHTML = `
      <div style="padding:16px 20px 8px;">
        <h3 style="font-size:1.1rem;font-weight:700;">Tavolo ${id}</h3>
        <p style="font-size:0.8rem;color:var(--text-2);margin-top:2px;">${d.seats} posti</p>
      </div>
      <div style="padding:0 20px 20px;">${buildPanelContent(id)}</div>
    `;
    document.getElementById('bottomSheet').classList.add('open');
    document.getElementById('sheetOverlay').classList.add('show');
  } else {
    document.getElementById('panelTitle').textContent = `Tavolo ${id}`;
    document.getElementById('panelSub').textContent   = `${d.seats} posti`;
    document.getElementById('panelBody').innerHTML    = buildPanelContent(id);
    document.getElementById('sidePanel').classList.add('open');
  }
  
  document.querySelectorAll('.table-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll(`[data-id="${id}"]`).forEach(c => c.classList.add('selected'));
}

function closePanel() {
  document.getElementById('sidePanel').classList.remove('open');
  document.getElementById('bottomSheet').classList.remove('open');
  document.getElementById('sheetOverlay').classList.remove('show');
  document.querySelectorAll('.table-card').forEach(c => c.classList.remove('selected'));
  selectedTableId = null;
}

function setTableStatus(id, newStatus) {
  const d = tables.find(t => t.id === id);
  if(!d) return;
  d.status = newStatus;
  
  if (newStatus === 'free' || newStatus === 'paid' || newStatus === 'reserved') {
    d.startedAt = null;
  } else if (!d.startedAt) {
    d.startedAt = Date.now();
  }

  if(newStatus === 'free' || newStatus === 'paid') {
     d.reservedTime = '';
  }

  renderTables();
  if (selectedTableId === id) openPanel(id);
  showToast(STATUS_EMOJIS[newStatus], `Tavolo ${id}: ${STATUS_LABELS[newStatus]}`);
}

function changeGuests(id, delta) {
  const d = tables.find(t => t.id === id);
  if(!d) return;
  d.guests = Math.max(0, Math.min(d.seats, d.guests + delta));
  const el = document.getElementById(`guest-val-${id}`);
  if (el) el.textContent = d.guests;
}

function freeTable(id) {
  const d = tables.find(t => t.id === id);
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

document.getElementById('floorWrap').addEventListener('click', (e) => {
  const card = e.target.closest('.table-card');
  if (!card) {
    if (!e.target.closest('.side-panel')) closePanel();
    return;
  }
  const id = parseInt(card.dataset.id);
  if (selectedTableId === id) closePanel();
  else openPanel(id);
});

document.getElementById('panelClose').addEventListener('click', closePanel);
document.getElementById('sheetOverlay').addEventListener('click', closePanel);

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

let toastTimer = null;
function showToast(icon, msg) {
  const wrap = document.getElementById('toastWrap');
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastMsg').textContent = msg;
  wrap.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => wrap.classList.remove('show'), 3000);
}

document.querySelectorAll('.bnav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
    item.classList.add('active');
  });
});

// INITIAL RENDER
renderTables();

setTimeout(() => {
  const readyTables = tables.filter(t => t.status === 'ready');
  if (readyTables.length > 0) {
    showToast('🟣', `Tavolo ${readyTables[0].id}: piatto pronto da servire!`);
  }
}, 2000);
"""

# Replace the entire old <script> block with the new_js
content = re.sub(r'<script>.*?</script>', f'<script>\n{new_js}\n</script>', content, flags=re.DOTALL)

with open('tavoli.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("tavoli.html fully refactored!")
