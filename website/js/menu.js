// menu.js — Caricamento menu da Firebase Realtime Database
import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { getLang, categoryNames, t } from './i18n.js';

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
const db  = getDatabase(app);

// Static menu items (same as ordini.js — single source of truth)
export const menuItems = [
  // BRUSCHETTE
  { id: 'br1', cat: 'bruschette', name: 'In Punto',          desc: 'Burrata, prosciutto crudo e glassa balsamica', price: 8.50, img: 'img/br1.png' },
  { id: 'br2', cat: 'bruschette', name: 'Pomodoro e Basilico', desc: 'Pomodoro fresco, aglio e basilico',          price: 5.50, img: 'img/br2.png' },
  { id: 'br3', cat: 'bruschette', name: 'Salmone',            desc: 'Salmone affumicato e formaggio spalmabile',  price: 8.50, img: 'img/br3.png' },

  // FOCACCE
  { id: 'fo1', cat: 'focacce', name: 'Classica',              desc: 'Sale grosso e rosmarino',                    price: 4.00, img: 'img/fo1.png' },
  { id: 'fo2', cat: 'focacce', name: 'Barese',                desc: 'Pomodorini e origano',                       price: 5.00, img: 'img/fo2.png' },
  { id: 'fo3', cat: 'focacce', name: 'Genovese',              desc: 'Formaggio e cipolle',                        price: 5.50, img: 'img/fo3.png' },
  { id: 'fo4', cat: 'focacce', name: 'Focaccia di Recco (per 2)', desc: 'Ripiena di stracchino',                 price: 12.90, img: 'img/fo4.png' },

  // TAGLIERI
  { id: 't1',  cat: 'taglieri', name: 'Tagliere salumi italiani',  desc: 'Selezione di salumi italiani',         price: 24.90, img: 'img/t1.png' },
  { id: 't2',  cat: 'taglieri', name: 'Tagliere formaggi italiani', desc: 'Selezione di formaggi italiani',      price: 22.50, img: 'img/t2.png' },
  { id: 't3',  cat: 'taglieri', name: 'Tagliere misto',            desc: 'Salumi e formaggi italiani',           price: 26.90, img: 'img/t3.png' },

  // PIZZE AL PADELLINO
  { id: 'pz1', cat: 'pizze', name: 'Golosa',     desc: 'Burrata, mortadella e pesto di limone',                  price: 14.50, img: 'img/pz1.png' },
  { id: 'pz2', cat: 'pizze', name: 'Maialosa',   desc: 'Porchetta, pecorino e cipolla caramellata',              price: 14.90, img: 'img/pz2.png' },
  { id: 'pz3', cat: 'pizze', name: 'Tradizione', desc: 'Polpettine, sugo di pomodoro e Grana Padano',            price: 13.90, img: 'img/pz3.png' },
  { id: 'pz4', cat: 'pizze', name: 'Gourmet',    desc: 'Prosciutto Parma, rucola, Grana Padano e glassa balsamica', price: 14.50, img: 'img/pz4.png' },
  { id: 'pz5', cat: 'pizze', name: 'Pinsa (margherita)', desc: 'Salsa di pomodoro, mozzarella e basilico',      price: 15.90, img: 'img/pz5.png' },

  // FRITTI
  { id: 'fr1', cat: 'fritti', name: 'Arancino siciliano',  desc: 'Riso, carne macinata, piselli, formaggio',     price: 7.50, img: 'img/fr1.png' },
  { id: 'fr2', cat: 'fritti', name: 'Cuori di parmigiano', desc: 'Parmigiano fritto',                            price: 7.50, img: 'img/fr2.png' },
  { id: 'fr3', cat: 'fritti', name: 'Olive ascolane',      desc: 'Olive ripiene fritte',                         price: 6.50, img: 'img/fr3.png' },
  { id: 'fr4', cat: 'fritti', name: 'Chicken nuggets',     desc: 'Bocconcini di pollo fritti',                   price: 7.50, img: 'img/fr4.png' },
  { id: 'fr5', cat: 'fritti', name: 'Patatine fritte',     desc: 'Patate fritte',                                price: 4.50, img: 'img/fr5.png' },

  // PRIMI
  { id: 'p1',  cat: 'primi', name: 'Spaghetti alle vongole', desc: 'Vongole fresche, aglio, olio e prezzemolo', price: 16.90, img: 'img/p1.png' },
  { id: 'p2',  cat: 'primi', name: 'Tagliatelle al ragù',   desc: 'Ragù di carne alla bolognese',               price: 14.50, img: 'img/p2.png' },
  { id: 'p3',  cat: 'primi', name: 'Risotto ai funghi',     desc: 'Funghi porcini e parmigiano reggiano',        price: 15.50, img: 'img/p3.png' },
  { id: 'p4',  cat: 'primi', name: 'Gnocchi al pomodoro',   desc: 'Pomodoro fresco e basilico',                  price: 13.90, img: 'img/p4.png' },

  // SECONDI
  { id: 's1',  cat: 'secondi', name: 'Tagliata di manzo',   desc: 'Con rucola, scaglie di parmigiano e glassa balsamica', price: 22.90, img: 'img/s1.png' },
  { id: 's2',  cat: 'secondi', name: 'Salmone alla griglia', desc: 'Con verdure di stagione',                   price: 19.50, img: 'img/s2.png' },
  { id: 's3',  cat: 'secondi', name: 'Pollo alla cacciatora', desc: 'Con olive, capperi e pomodoro',            price: 17.90, img: 'img/s3.png' },

  // DOLCI
  { id: 'd1',  cat: 'dolci', name: 'Tiramisù',             desc: 'Ricetta classica della nonna',                 price: 7.50, img: 'img/d1.png' },
  { id: 'd2',  cat: 'dolci', name: 'Panna cotta',          desc: 'Con coulis di frutti di bosco',                price: 6.50, img: 'img/d2.png' },
  { id: 'd3',  cat: 'dolci', name: 'Cheesecake',           desc: 'Con fragole fresche',                          price: 7.00, img: 'img/d3.png' },

  // BEVANDE
  { id: 'bv1', cat: 'bevande', name: 'Acqua naturale (75cl)',  desc: '',                                         price: 2.00, img: 'img/bv1.png' },
  { id: 'bv2', cat: 'bevande', name: 'Acqua frizzante (75cl)', desc: '',                                         price: 2.00, img: 'img/bv2.png' },
  { id: 'bv3', cat: 'bevande', name: 'Spritz Aperol',          desc: 'Aperol, prosecco, soda',                   price: 6.00, img: 'img/bv3.png' },
  { id: 'bv4', cat: 'bevande', name: 'Sangria',                desc: 'Vino rosso, frutta e spezie',              price: 5.50, img: 'img/bv4.png' },
];

// Categories to display in the public menu (only food-relevant ones)
export const publicCategories = [
  'bruschette', 'focacce', 'taglieri', 'pizze', 'fritti', 'primi', 'secondi', 'dolci', 'bevande'
];

// GitHub raw base URL for images
const IMAGE_BASE = 'https://raw.githubusercontent.com/Manolo006/segnaore/main/';

let activeCategory = 'all';

export function initMenu() {
  renderCategoryTabs();
  renderMenuItems('all');
}

export function renderCategoryTabs() {
  const tabsEl = document.getElementById('menu-tabs');
  if (!tabsEl) return;

  const lang = getLang();
  const catNames = categoryNames[lang];

  const allBtn = document.createElement('button');
  allBtn.className = 'menu-tab active';
  allBtn.dataset.cat = 'all';
  allBtn.textContent = t('menu_all');
  allBtn.addEventListener('click', () => selectTab('all', allBtn));
  tabsEl.appendChild(allBtn);

  publicCategories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'menu-tab';
    btn.dataset.cat = cat;
    btn.textContent = catNames[cat] || cat;
    btn.addEventListener('click', () => selectTab(cat, btn));
    tabsEl.appendChild(btn);
  });
}

function selectTab(cat, btnEl) {
  activeCategory = cat;
  document.querySelectorAll('.menu-tab').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');
  renderMenuItems(cat);
}

export function renderMenuItems(cat) {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  const items = cat === 'all'
    ? menuItems.filter(i => publicCategories.includes(i.cat))
    : menuItems.filter(i => i.cat === cat);

  // Animate out
  grid.style.opacity = '0';
  grid.style.transform = 'translateY(12px)';

  setTimeout(() => {
    grid.innerHTML = '';

    if (items.length === 0) {
      grid.innerHTML = '<p class="menu-empty">Nessun piatto in questa categoria.</p>';
    } else {
      items.forEach((item, idx) => {
        const card = createMenuCard(item, idx);
        grid.appendChild(card);
      });
    }

    // Animate in
    grid.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    grid.style.opacity = '1';
    grid.style.transform = 'translateY(0)';
  }, 200);
}

function createMenuCard(item, idx) {
  const card = document.createElement('div');
  card.className = 'menu-card';
  card.style.animationDelay = `${idx * 0.06}s`;

  const imgSrc = IMAGE_BASE + item.img;
  const imgFallback = IMAGE_BASE + item.img.replace('.png', '.jpg');

  card.innerHTML = `
    <div class="menu-card__img-wrap">
      <img 
        src="${imgSrc}" 
        alt="${item.name}" 
        class="menu-card__img"
        loading="lazy"
        onerror="this.onerror=null; this.src='${imgFallback}'; this.onerror=()=>{this.parentElement.classList.add('no-img')}"
      >
      <div class="menu-card__img-overlay"></div>
    </div>
    <div class="menu-card__body">
      <h3 class="menu-card__name">${item.name}</h3>
      ${item.desc ? `<p class="menu-card__desc">${item.desc}</p>` : ''}
      <span class="menu-card__price">€ ${item.price.toFixed(2)}</span>
    </div>
  `;

  return card;
}

export function refreshMenuLang() {
  // Rebuild tabs with new language
  const tabsEl = document.getElementById('menu-tabs');
  if (tabsEl) tabsEl.innerHTML = '';
  renderCategoryTabs();
  renderMenuItems(activeCategory);
}
