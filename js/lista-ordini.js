import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
    import { getDatabase, ref, onValue, update, remove } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

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

    let allOrders = [];
    let currentTab = 'attivi';

    const catalogPrices = {
      "Bruschetta vegetariana": 8.50, "Bruschetta italiana": 5.50, "Bruschetta In Punto": 10.50,
      "Focaccia Capri": 11.90, "Focaccia Alpina": 11.50, "Focaccia Calabra": 10.90,
      "Focaccia di Recco (per 2 persone)": 12.90, "Tagliere salumi italiani": 24.90,
      "Tagliere formaggi italiani": 22.50, "Tagliere misto": 26.90,
      "Golosa": 14.50, "Maialosa": 14.90, "Tradizione": 13.90, "Gourmet": 14.50,
      "Arancino siciliano": 7.50, "Cuori di parmigiano": 7.50, "Olive ascolane": 6.50,
      "Chicken nuggets": 7.50, "Patatine fritte": 4.50,
      "Tagliolini funghi e tartufo": 21.50, "Tagliolino polpettine e melanzane": 15.50,
      "Maccheroncino Gargato carbonara": 14.90, "Maccheroncino Gargato cacio e pepe": 14.50,
      "Agnolotto di brasato": 20.50, "Raviolo di branzino": 20.90,
      "Lasagna bolognese": 13.90, "Parmigiana di melanzane": 15.90,
      "Frittura mista di gamberi e calamari": 19.90,
      "Cheesecake": 6.90, "Profiterole": 6.90, "Tiramisù": 6.90,
      "Gelato cioccolato": 6.90, "Gelato crema": 6.90, "Gelato limone": 6.90,
      "doce de limão ": 6.90,
      "Vino della Casa (Calice)": 4.90, "Vino della Casa (Bottiglia)": 18.90,
      "Primitivo di Puglia zin": 25.90, "Valpolicella superiore ripasso": 29.90,
      "Chianti classico peppoli": 35.90, "Pinot grigio": 23.90, "Gewurtztraminer": 34.90,
      "Pinot grigio blash rose (Calice)": 5.20, "Pinot grigio blash rose (Bottiglia)": 22.90,
      "Conde Vilar verde (Bottiglia)": 17.90, "Conde Vilar verde (Calice)": 4.90,
      "Conde Vilar alvarinho": 21.90, "Soalheiro alvarinho": 27.90,
      "Monte da peceguina (Tinto)": 28.90, "Esporão reserva (Tinto)": 33.90,
      "Beyra sauvignon Blanc": 26.90, "Monte da peceguina (Bianco)": 28.90,
      "Monte da peseguina R (Rosé)": 28.90,
      "Bosco Brut": 19.90, "Prosecco": 21.90,
      "Birra alla spina Imperial (Pressão)": 3.20, "Birra alla spina Caneca (Pressão)": 4.50,
      "Birra Moretti": 4.50, "Birra Peroni": 4.50, "Birra Corona": 4.50,
      "Birra Heineken": 4.50, "Birra Sagres 0.0": 4.50, "Birra Somersby": 4.20,
      "Sangria Bianca (1L)": 17.90, "Sangria Tinta (1L)": 17.90,
      "Sangria Rosé (1L)": 17.90, "Sangria Espumante (1L)": 19.90,
      "Martini Rosso": 6.00, "Martini Dry": 6.00, "Martini Bianco": 6.00,
      "Vino di Porto Down's Tawny": 5.00, "Vino di Porto Down's Ruby": 5.00,
      "Vino di Porto Down's LBV": 5.00,
      "Coca Cola": 3.50, "Coca Cola Zero": 3.50, "Fanta": 3.50,
      "Sprite": 3.50, "Lipton Mango": 3.50, "Lipton Limone": 3.50,
      "Lipton Pesca": 3.50, "Ginger Ale": 3.40, "Tonica Schweppes": 3.40,
      "Succo d'arancia naturale": 4.50, "Succo di frutta": 3.90,
      "Acqua Luso 1L": 3.50, "Acqua Luso 0.50L": 2.50,
      "Acqua San Pellegrino 0.50L": 4.20, "Acqua Luso Gas 1L": 3.90,
      "Caffè Espresso": 1.50, "Caffè Descafeinado": 1.50,
      "Cappuccino": 2.50, "Gallao": 2.50,
      "Americano": 9.00, "Irish Coffee": 7.50, "Baileys Coffee": 7.50, "Calipso Coffee": 7.50,
      "Limoncello": 5.20, "Grappa": 5.50, "Grappa barricata": 6.50,
      "Whiskey Jack Daniels": 9.00, "Whiskey Jameson": 8.00,
      "Whiskey Black Label": 11.00, "Whiskey Red Label": 10.00, "Whiskey J&B": 7.00,
      "Sambuca": 5.50, "Amaretto Disaronno": 5.50, "Baileys": 5.50,
      "Montenegro": 5.50, "Averna": 5.50, "Fernet Branca": 5.50,
      "Aperol Spritz": 9.00, "Campari Spritz": 9.00, "Limoncello Spritz": 9.00,
      "Negroni": 9.00, "Mojito": 9.00, "Sex on the Beach": 9.00,
      "Tequila Sunrise": 9.00, "Pina Colada": 9.00, "Moscow Mule": 9.00,
      "Disaronno Sour": 9.00, "Virgen Mojito (Analcolico)": 7.00,
      "Virgen Colada (Analcolico)": 7.00,
      "Gordons": 9.00, "Gordons Pink": 9.00, "Tanqueray": 10.00,
      "Bulldog": 11.00, "Bombay Saphire": 12.00, "Hendricks": 12.00, "Gin Sul": 15.00
    };

    function subscribeFirebase() {
      const r = ref(db, 'orders');
      onValue(r, (snapshot) => {
        const data = snapshot.val();
        allOrders = data ? Object.entries(data).map(([id, o]) => ({ id, ...o })) : [];
        renderReceipts();
      });
    }

    function switchTab(tab) {
      currentTab = tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('tab-' + tab).classList.add('active');
      renderReceipts();
    }
    window.switchTab = switchTab;

    // ─── CONFERMA PAGAMENTO ────────────────────────────────────────────────
    async function confirmPayment(tableId) {
      const btn = document.getElementById(`pay-btn-${tableId}`);
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Elaborazione…';
      }

      const now = Date.now();
      const tableOrders = allOrders.filter(o => String(o.tableId) === String(tableId) && !o.paidAt);

      // 1. Marca ogni ordine come paidAt
      const updatePromises = tableOrders.map(o =>
        update(ref(db, `orders/${o.id}`), { paidAt: now })
      );
      await Promise.all(updatePromises);

      // 2. Aggiorna tavolo → paid + azzera startedAt
      if (tableId !== 'Asporto') {
        await update(ref(db, `tables/${tableId}`), {
          status: 'paid',
          startedAt: null,
          guests: 0
        });
      }

      showToast('✅ Pagamento confermato!');
    }
    window.confirmPayment = confirmPayment;

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2800);
    }

    function calcTotal(items) {
      return (items || []).reduce((sum, item) => {
        const p = item.price > 0 ? item.price : (catalogPrices[item.name] || 0);
        return sum + p * item.qty;
      }, 0);
    }

    function renderReceipts() {
      const container = document.getElementById('receipts-container');

      const ordersToShow = currentTab === 'attivi'
        ? allOrders.filter(o => !o.paidAt)
        : allOrders.filter(o => o.paidAt);

      if (ordersToShow.length === 0) {
        container.innerHTML = `
          <div style="text-align:center; padding: 60px 20px; color:var(--text-2); grid-column:1/-1;">
            <div style="font-size:3.5rem; margin-bottom:14px;">${currentTab === 'attivi' ? '🍽️' : '✅'}</div>
            <h3 style="font-weight:700; font-size:1.1rem; color:var(--text);">Nessun scontrino ${currentTab === 'attivi' ? 'attivo' : 'pagato'}</h3>
            <p style="margin-top:6px; font-size:0.85rem;">Gli ordini appariranno qui in tempo reale</p>
          </div>
        `;
        return;
      }

      // Raggruppa per tavolo (attivi) o tavolo+orario (pagati)
      const groups = {};
      ordersToShow.forEach(o => {
        const tId = String(o.tableId);
        const key = currentTab === 'pagati' ? `${tId}_${o.paidAt}` : tId;

        if (!groups[key]) {
          groups[key] = { id: tId, items: [], paidAt: o.paidAt, orderIds: [] };
        }
        groups[key].orderIds.push(o.id);

        (o.items || []).forEach(item => {
          const existing = groups[key].items.find(i => i.name === item.name && i.note === (item.note || ''));
          if (existing) {
            existing.qty += item.qty;
          } else {
            groups[key].items.push({
              name: item.name,
              qty: item.qty,
              price: item.price > 0 ? item.price : (catalogPrices[item.name] || 0),
              note: item.note || ''
            });
          }
        });
      });

      // Ordina
      const sortedGroups = Object.values(groups);
      if (currentTab === 'pagati') {
        sortedGroups.sort((a, b) => b.paidAt - a.paidAt);
      } else {
        sortedGroups.sort((a, b) => (a.id === 'Asporto' ? 9999 : +a.id) - (b.id === 'Asporto' ? 9999 : +b.id));
      }

      let html = '';
      sortedGroups.forEach(group => {
        const total = group.items.reduce((s, i) => s + i.price * i.qty, 0);

        const itemsHtml = group.items.map(item => {
          const rowTotal = item.price * item.qty;
          const priceStr = item.price > 0 ? `${rowTotal.toFixed(2)} €` : '— €';
          const noteHtml = item.note ? `<div class="item-note">📝 ${item.note}</div>` : '';
          return `
            <div class="receipt__row">
              <div class="receipt__item">
                <span class="receipt__qty">${item.qty}×</span>
                <div>
                  <span class="receipt__name">${item.name}</span>
                  ${noteHtml}
                </div>
              </div>
              <div class="receipt__price">${priceStr}</div>
            </div>
          `;
        }).join('');

        let headerExtra = '';
        if (currentTab === 'pagati' && group.paidAt) {
          const d = new Date(group.paidAt);
          headerExtra = `<div class="receipt__paid-time">🕒 Pagato: ${d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} — ${d.toLocaleDateString('it-IT')}</div>`;
        }

        const isAsporto = group.id === 'Asporto';
        const tableLabel = isAsporto ? '🛍️ Asporto' : `Tavolo ${group.id}`;

        const payBtn = currentTab === 'attivi' ? `
          <button class="pay-btn" id="pay-btn-${group.id}" onclick="confirmPayment('${group.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            Conferma Pagamento
          </button>
        ` : '';

        html += `
          <div class="receipt ${currentTab === 'pagati' ? 'receipt--paid' : ''}">
            <div class="receipt__header">
              <div class="receipt__header-top">
                <div class="receipt__table">${tableLabel}</div>
                <div class="receipt__total">${total.toFixed(2)} €</div>
              </div>
              ${headerExtra}
            </div>
            <div class="receipt__divider"></div>
            <div class="receipt__body">
              ${itemsHtml || '<div style="color:var(--text-2); font-size:0.85rem; text-align:center; padding:10px 0;">(Ordine vuoto)</div>'}
            </div>
            ${payBtn}
          </div>
        `;
      });

      container.innerHTML = html;
    }

    subscribeFirebase();