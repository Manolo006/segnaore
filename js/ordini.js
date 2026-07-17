/* =====================================================
       FIREBASE — Inizializzazione diretta (GitHub Pages safe)
    ===================================================== */
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
    import { getDatabase, ref, push, set, update } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

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
    console.log('[Ordini] Firebase connesso ✅');

    /* =====================================================
       DATI DEL MENU
    ===================================================== */
    const categories = [
      { id: 'antipasti', name: 'Antipasti', icon: '🥓' },
      { id: 'primi',     name: 'Primi',     icon: '🍝' },
      { id: 'secondi',   name: 'Secondi',   icon: '🍖' },
      { id: 'taglieri',  name: 'Taglieri',  icon: '🧀' },
      { id: 'pizze',     name: 'Pizze al Padellino', icon: '🍕' },
      { id: 'bevande',   name: 'Bevande',   icon: '🥤' }
    ];

    const topCategoryMap = {
      bruschette: 'antipasti',
      focacce: 'focacce',
      taglieri: 'taglieri',
      pizze: 'pizze',
      fritti: 'antipasti',
      primi: 'primi',
      secondi: 'secondi',
      dolci: 'dolci',
      bevande: 'bevande',
      bollicine: 'bevande',
      birre: 'bevande',
      aperitivi: 'bevande',
      softdrinks: 'bevande',
      caffetteria: 'bevande',
      liquori: 'bevande',
      cocktails: 'bevande',
      gin: 'bevande',
      bevande: 'bevande'
    };

    const sectionTitles = {
      bruschette: 'Bruschette',
      focacce: 'Focacce',
      vini: 'Vini',
      bollicine: 'Bollicine',
      birre: 'Birre',
      aperitivi: 'Aperitivi e Sangria',
      softdrinks: 'Soft Drinks e Acqua',
      caffetteria: 'Caffetteria',
      liquori: 'Liquori e Digestivi',
      cocktails: 'Cocktails',
      gin: 'Gin Selection',
      bevande: 'Bevande'
    };

    function getTopCategory(item) {
      return topCategoryMap[item.cat] || item.cat;
    }

    function formatSectionTitle(section) {
      return sectionTitles[section] || section
        .split(/[- ]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    const menuItems = [
     // BRUSCHETTE
{ id: 'br1', cat: 'bruschette', name: 'Bruschetta vegetariana', desc: 'Stracciatella, pomodori secchi, zucchine grigliate e basilico', price: 8.50, img: 'http://googleusercontent.com/image_collection/image_retrieval/13892565192973452929_1' },
{ id: 'br2', cat: 'bruschette', name: 'Bruschetta italiana', desc: 'Pomodori, aglio e basilico', price: 5.50, img: 'http://googleusercontent.com/image_collection/image_retrieval/13892565192973452929_0' },
{ id: 'br3', cat: 'bruschette', name: 'Bruschetta In Punto', desc: 'Prosciutto di Parma, burrata e glassa balsamica', price: 10.50, img: 'img/bruschetta_in_punto.png' },

// FOCACCE
{ id: 'fo1', cat: 'focacce', name: 'Focaccia Capri', desc: 'Prosciutto di Parma, mozzarella di bufala e pomodoro', price: 11.90, img: 'img/focaccia_capri.png' },
{ id: 'fo2', cat: 'focacce', name: 'Focaccia Alpina', desc: 'Prosciutto cotto, asiago e funghi porcini', price: 11.50, img: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=600&q=80' },
{ id: 'fo3', cat: 'focacce', name: 'Focaccia Calabra', desc: 'Salame piccante, scamorza affumicata e cipolla di Tropea', price: 10.90, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
{ id: 'fo4', cat: 'focacce', name: 'Focaccia di Recco (per 2 persone)', desc: 'Ripiena di stracchino', price: 12.90, img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80' },

// TAGLIERI
{ id: 't1', cat: 'taglieri', name: 'Tagliere salumi italiani', desc: 'Selezione di salumi italiani', price: 24.90, img: 'http://googleusercontent.com/image_collection/image_retrieval/4612288917924318343_1' },
{ id: 't2', cat: 'taglieri', name: 'Tagliere formaggi italiani', desc: 'Selezione di formaggi italiani', price: 22.50, img: 'http://googleusercontent.com/image_collection/image_retrieval/4612288917924318343_2' },
{ id: 't3', cat: 'taglieri', name: 'Tagliere misto', desc: 'Salumi e formaggi italiani', price: 26.90, img: 'img/tagliere_misto.png' },

// PIZZE AL PADELLINO
{ id: 'pz1', cat: 'pizze', name: 'Golosa', desc: 'Burrata, mortadella e pesto di limone', price: 14.50, img: 'img/golosa.png' },
{ id: 'pz2', cat: 'pizze', name: 'Maialosa', desc: 'Porchetta, pecorino e cipolla caramellata', price: 14.90, img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80' },
{ id: 'pz3', cat: 'pizze', name: 'Tradizione', desc: 'Polpettine, sugo di pomodoro e Grana Padano', price: 13.90, img: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80' },
{ id: 'pz4', cat: 'pizze', name: 'Gourmet', desc: 'Prosciutto Parma, rucola, Grana Padano e glassa balsamica', price: 14.50, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },

// FRITTI
{ id: 'fr1', cat: 'fritti', name: 'Arancino siciliano', desc: 'Riso, carne macinata, piselli, formaggio', price: 7.50, img: 'img/arancino_siciliano.png' },
{ id: 'fr2', cat: 'fritti', name: 'Cuori di parmigiano', desc: 'Parmigiano fritto', price: 7.50, img: 'img/cuore_di_parmigiano.png' },
{ id: 'fr3', cat: 'fritti', name: 'Olive ascolane', desc: 'Olive ripiene fritte', price: 6.50, img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80' },
{ id: 'fr4', cat: 'fritti', name: 'Chicken nuggets', desc: 'Bocconcini di pollo fritti', price: 7.50, img: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80' },
{ id: 'fr5', cat: 'fritti', name: 'Patatine fritte', desc: 'Patate fritte', price: 4.50, img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80' },

// PRIMI
{ id: 'p1', cat: 'primi', name: 'Tagliolini funghi e tartufo', desc: 'Pasta fresca con funghi e tartufo', price: 21.50, img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80' },
{ id: 'p2', cat: 'primi', name: 'Tagliolino polpettine e melanzane', desc: 'Sugo con polpettine e melanzane', price: 15.50, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80' },
{ id: 'p3', cat: 'primi', name: 'Maccheroncino Gargato carbonara', desc: 'Uova, guanciale e pecorino', price: 14.90, img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80' },
{ id: 'p4', cat: 'primi', name: 'Maccheroncino Gargato cacio e pepe', desc: 'Pecorino e pepe', price: 14.50, img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80' },
{ id: 'p5', cat: 'primi', name: 'Agnolotto di brasato', desc: 'Con demi-glace e parmigiano', price: 20.50, img: 'https://images.unsplash.com/photo-1587740985167-739e99a70718?auto=format&fit=crop&w=600&q=80' },
{ id: 'p6', cat: 'primi', name: 'Raviolo di branzino', desc: 'Pomodoro, olive e capperi', price: 20.90, img: 'https://images.unsplash.com/photo-1587740985167-739e99a70718?auto=format&fit=crop&w=600&q=80' },
{ id: 'p7', cat: 'primi', name: 'Lasagna bolognese', desc: 'Classica lasagna al ragù', price: 13.90, img: 'http://googleusercontent.com/image_collection/image_retrieval/1451776102721036873_1' },

// SECONDI
{ id: 's1', cat: 'secondi', name: 'Parmigiana di melanzane', desc: 'Melanzane, pomodoro e parmigiano', price: 15.90, img: 'https://images.unsplash.com/photo-1625938146369-adc83368bda7?auto=format&fit=crop&w=600&q=80' },
{ id: 's2', cat: 'secondi', name: 'Frittura mista di gamberi e calamari', desc: 'Pesce fritto misto', price: 19.90, img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80' },

// DOLCI
{ id: 'd1', cat: 'dolci', name: 'Cheesecake', desc: 'Torta al formaggio', price: 6.90, img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80' },
{ id: 'd2', cat: 'dolci', name: 'Profiterole', desc: 'Bignè con crema e cioccolato', price: 6.90, img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80' },
{ id: 'd3', cat: 'dolci', name: 'Tiramisù', desc: 'Dolce al caffè e mascarpone', price: 6.90, img: 'http://googleusercontent.com/image_collection/image_retrieval/18169031594575410063_2' },
{ id: 'd4', cat: 'dolci', name: 'Gelato cioccolato', desc: 'Gelato al cioccolato', price: 6.90, img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80' },
{ id: 'd5', cat: 'dolci', name: 'Gelato crema', desc: 'Gelato alla crema', price: 6.90, img: 'https://images.unsplash.com/photo-1505394033343-40a690729713?auto=format&fit=crop&w=600&q=80' },
{ id: 'd6', cat: 'dolci', name: 'Gelato limone', desc: 'Gelato al limone', price: 6.90, img: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80' },
{ id: 'd7', cat: 'dolci', name: 'doce de limão', desc: 'dolce al limone', price: 6.90, img: 'https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?auto=format&fit=crop&w=600&q=80' },

// VINI DELLA CASA
{ id: 'b1', cat: 'vini', name: 'Vino della Casa (Calice)', desc: 'Toscana Rosso', price: 4.90, img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80' },
{ id: 'b2', cat: 'vini', name: 'Vino della Casa (Calice)', desc: 'Toscana Rosso', price: 4.90, img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80' },
{ id: 'b3', cat: 'vini', name: 'Vino della Casa (Bottiglia)', desc: 'Toscana Branco', price: 18.90, img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80' },
{ id: 'b4', cat: 'vini', name: 'Vino della Casa (Bottiglia)', desc: 'Toscana Branco', price: 18.90, img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80' },

// VINI ITALIANI
{ id: 'vi1', cat: 'vini', name: 'Primitivo di Puglia zin', desc: 'Vino rosso italiano', price: 25.90, img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80' },
{ id: 'vi2', cat: 'vini', name: 'Valpolicella superiore ripasso', desc: 'Vino rosso italiano', price: 29.90, img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80' },
{ id: 'vi3', cat: 'vini', name: 'Chianti classico peppoli', desc: 'Vino rosso italiano', price: 35.90, img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80' },
{ id: 'vi4', cat: 'vini', name: 'Pinot grigio', desc: 'Vino bianco italiano', price: 23.90, img: 'https://images.unsplash.com/photo-1569919650476-f5421c00d1b4?auto=format&fit=crop&w=600&q=80' },
{ id: 'vi5', cat: 'vini', name: 'Gewurtztraminer', desc: 'Vino bianco italiano', price: 34.90, img: 'https://images.unsplash.com/photo-1569919650476-f5421c00d1b4?auto=format&fit=crop&w=600&q=80' },
{ id: 'vi6', cat: 'vini', name: 'Pinot grigio blash rose (Calice)', desc: 'Vino rosato italiano al calice', price: 5.20, img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80' },
{ id: 'vi7', cat: 'vini', name: 'Pinot grigio blash rose (Bottiglia)', desc: 'Vino rosato italiano in bottiglia', price: 22.90, img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80' },

// VINI PORTOGHESI E VERDI
{ id: 'vp1', cat: 'vini', name: 'Conde Vilar verde (Bottiglia)', desc: 'Vinho Verde portoghese', price: 17.90, img: 'https://images.unsplash.com/photo-1569919650476-f5421c00d1b4?auto=format&fit=crop&w=600&q=80' },
{ id: 'vp2', cat: 'vini', name: 'Conde Vilar verde (Calice)', desc: 'Vinho Verde portoghese al calice', price: 4.90, img: 'https://images.unsplash.com/photo-1569919650476-f5421c00d1b4?auto=format&fit=crop&w=600&q=80' },
{ id: 'vp3', cat: 'vini', name: 'Conde Vilar alvarinho', desc: 'Vinho Verde portoghese', price: 21.90, img: 'https://images.unsplash.com/photo-1569919650476-f5421c00d1b4?auto=format&fit=crop&w=600&q=80' },
{ id: 'vp4', cat: 'vini', name: 'Soalheiro alvarinho', desc: 'Vinho Verde portoghese', price: 27.90, img: 'https://images.unsplash.com/photo-1569919650476-f5421c00d1b4?auto=format&fit=crop&w=600&q=80' },
{ id: 'vp5', cat: 'vini', name: 'Monte da peceguina (Tinto)', desc: 'Vino rosso portoghese', price: 28.90, img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80' },
{ id: 'vp6', cat: 'vini', name: 'Esporão reserva (Tinto)', desc: 'Vino rosso portoghese', price: 33.90, img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80' },
{ id: 'vp7', cat: 'vini', name: 'Beyra sauvignon Blanc', desc: 'Vino bianco portoghese', price: 26.90, img: 'https://images.unsplash.com/photo-1569919650476-f5421c00d1b4?auto=format&fit=crop&w=600&q=80' },
{ id: 'vp8', cat: 'vini', name: 'Monte da peceguina (Bianco)', desc: 'Vino bianco portoghese', price: 28.90, img: 'https://images.unsplash.com/photo-1569919650476-f5421c00d1b4?auto=format&fit=crop&w=600&q=80' },
{ id: 'vp9', cat: 'vini', name: 'Monte da peseguina R (Rosé)', desc: 'Vino rosato portoghese', price: 28.90, img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80' },

// BOLLICINE (ESPUMANTE)
{ id: 'bo1', cat: 'bollicine', name: 'Bosco Brut', desc: 'Spumante', price: 19.90, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'bo2', cat: 'bollicine', name: 'Prosecco', desc: 'Spumante prosecco', price: 21.90, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },

// BIRRE
{ id: 'bi1', cat: 'birre', name: 'Birra alla spina Imperial (Pressão)', desc: 'Birra alla spina piccola/media', price: 3.20, img: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=600&q=80' },
{ id: 'bi2', cat: 'birre', name: 'Birra alla spina Caneca (Pressão)', desc: 'Birra alla spina grande', price: 4.50, img: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=600&q=80' },
{ id: 'bi3', cat: 'birre', name: 'Birra Moretti', desc: 'Birra in bottiglia', price: 4.50, img: 'https://images.unsplash.com/photo-1608270176050-12ec057de108?auto=format&fit=crop&w=600&q=80' },
{ id: 'bi4', cat: 'birre', name: 'Birra Peroni', desc: 'Birra in bottiglia', price: 4.50, img: 'https://images.unsplash.com/photo-1608270176050-12ec057de108?auto=format&fit=crop&w=600&q=80' },
{ id: 'bi5', cat: 'birre', name: 'Birra Corona', desc: 'Birra in bottiglia', price: 4.50, img: 'https://images.unsplash.com/photo-1608270176050-12ec057de108?auto=format&fit=crop&w=600&q=80' },
{ id: 'bi6', cat: 'birre', name: 'Birra Heineken', desc: 'Birra in bottiglia', price: 4.50, img: 'https://images.unsplash.com/photo-1608270176050-12ec057de108?auto=format&fit=crop&w=600&q=80' },
{ id: 'bi7', cat: 'birre', name: 'Birra Sagres 0.0', desc: 'Birra analcolica in bottiglia', price: 4.50, img: 'https://images.unsplash.com/photo-1608270176050-12ec057de108?auto=format&fit=crop&w=600&q=80' },
{ id: 'bi8', cat: 'birre', name: 'Birra Somersby', desc: 'Sidro in bottiglia', price: 4.20, img: 'https://images.unsplash.com/photo-1608270176050-12ec057de108?auto=format&fit=crop&w=600&q=80' },

// APERITIVI E SANGRIA
{ id: 'ap1', cat: 'bevande', section: 'aperitivi', name: 'Sangria Bianca (1L)', desc: 'Sangria bianca da 1 litro', price: 17.90, img: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=600&q=80' },
{ id: 'ap2', cat: 'bevande', section: 'aperitivi', name: 'Sangria Tinta (1L)', desc: 'Sangria rossa da 1 litro', price: 17.90, img: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=600&q=80' },
{ id: 'ap3', cat: 'bevande', section: 'aperitivi', name: 'Sangria Rosé (1L)', desc: 'Sangria rosata da 1 litro', price: 17.90, img: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=600&q=80' },
{ id: 'ap4', cat: 'bevande', section: 'aperitivi', name: 'Sangria Espumante (1L)', desc: 'Sangria con spumante da 1 litro', price: 19.90, img: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=600&q=80' },
{ id: 'ap5', cat: 'bevande', section: 'aperitivi', name: 'Martini Rosso', desc: 'Aperitivo', price: 6.00, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'ap6', cat: 'bevande', section: 'aperitivi', name: 'Martini Dry', desc: 'Aperitivo', price: 6.00, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'ap7', cat: 'bevande', section: 'aperitivi', name: 'Martini Bianco', desc: 'Aperitivo', price: 6.00, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'ap8', cat: 'bevande', section: 'aperitivi', name: 'Vino di Porto Down\'s Tawny', desc: 'Vino liquoroso', price: 5.00, img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80' },
{ id: 'ap9', cat: 'bevande', section: 'aperitivi', name: 'Vino di Porto Down\'s Ruby', desc: 'Vino liquoroso', price: 5.00, img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80' },
{ id: 'ap10', cat: 'bevande', section: 'aperitivi', name: 'Vino di Porto Down\'s LBV', desc: 'Vino liquoroso tardivo imbottigliato', price: 5.00, img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80' },

// SOFT DRINKS E ACQUA
{ id: 'sd1', cat: 'bevande', section: 'softdrinks', name: 'Coca Cola', desc: 'Soft drink', price: 3.50, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80' },
{ id: 'sd2', cat: 'bevande', section: 'softdrinks', name: 'Coca Cola Zero', desc: 'Soft drink senza zuccheri', price: 3.50, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80' },
{ id: 'sd3', cat: 'bevande', section: 'softdrinks', name: 'Fanta', desc: 'Soft drink', price: 3.50, img: 'https://images.unsplash.com/photo-1624514231843-c0d66006f157?auto=format&fit=crop&w=600&q=80' },
{ id: 'sd4', cat: 'bevande', section: 'softdrinks', name: 'Sprite', desc: 'Soft drink', price: 3.50, img: 'https://images.unsplash.com/photo-1625772291427-f64805e324c5?auto=format&fit=crop&w=600&q=80' },
{ id: 'sd5', cat: 'bevande', section: 'softdrinks', name: 'Lipton Mango', desc: 'Tè freddo al mango', price: 3.50, img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80' },
{ id: 'sd6', cat: 'bevande', section: 'softdrinks', name: 'Lipton Limone', desc: 'Tè freddo al limone', price: 3.50, img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80' },
{ id: 'sd7', cat: 'bevande', section: 'softdrinks', name: 'Lipton Pesca', desc: 'Tè freddo alla pesca', price: 3.50, img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80' },
{ id: 'sd8', cat: 'bevande', section: 'softdrinks', name: 'Ginger Ale', desc: 'Soft drink al ginger', price: 3.40, img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80' },
{ id: 'sd9', cat: 'bevande', section: 'softdrinks', name: 'Tonica Schweppes', desc: 'Acqua tonica', price: 3.40, img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80' },
{ id: 'sd10', cat: 'bevande', section: 'softdrinks', name: 'Succo d\'arancia naturale', desc: 'Spremuta fresca d\'arancia', price: 4.50, img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80' },
{ id: 'sd11', cat: 'bevande', section: 'softdrinks', name: 'Succo di frutta', desc: 'Gusti assortiti', price: 3.90, img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80' },
{ id: 'sd12', cat: 'bevande', section: 'softdrinks', name: 'Acqua Luso 1L', desc: 'Acqua naturale', price: 3.50, img: 'https://images.unsplash.com/photo-1608885898957-a599fb18ec3f?auto=format&fit=crop&w=600&q=80' },
{ id: 'sd13', cat: 'bevande', section: 'softdrinks', name: 'Acqua Luso 0.50L', desc: 'Acqua naturale', price: 2.50, img: 'https://images.unsplash.com/photo-1608885898957-a599fb18ec3f?auto=format&fit=crop&w=600&q=80' },
{ id: 'sd14', cat: 'bevande', section: 'softdrinks', name: 'Acqua San Pellegrino 0.50L', desc: 'Acqua frizzante', price: 4.20, img: 'https://images.unsplash.com/photo-1608885898957-a599fb18ec3f?auto=format&fit=crop&w=600&q=80' },
{ id: 'sd15', cat: 'bevande', section: 'softdrinks', name: 'Acqua Luso Gas 1L', desc: 'Acqua frizzante', price: 3.90, img: 'https://images.unsplash.com/photo-1608885898957-a599fb18ec3f?auto=format&fit=crop&w=600&q=80' },

// CAFFETTERIA
{ id: 'cf1', cat: 'caffetteria', name: 'Caffè Espresso', desc: 'Espresso classico', price: 1.50, img: 'https://images.unsplash.com/photo-1510972527409-cac5d420b414?auto=format&fit=crop&w=600&q=80' },
{ id: 'cf2', cat: 'caffetteria', name: 'Caffè Descafeinado', desc: 'Espresso decaffeinato', price: 1.50, img: 'https://images.unsplash.com/photo-1510972527409-cac5d420b414?auto=format&fit=crop&w=600&q=80' },
{ id: 'cf3', cat: 'caffetteria', name: 'Cappuccino', desc: 'Cappuccino classico', price: 2.50, img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80' },
{ id: 'cf4', cat: 'caffetteria', name: 'Gallao', desc: 'Caffellatte tipico portoghese', price: 2.50, img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80' },
{ id: 'cf5', cat: 'caffetteria', name: 'Americano', desc: 'Caffè lungo', price: 2.50, img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80' },
{ id: 'cf6', cat: 'caffetteria', name: 'Irish Coffee', desc: 'Caffè speciale con whiskey e panna', price: 7.50, img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80' },
{ id: 'cf7', cat: 'caffetteria', name: 'Baileys Coffee', desc: 'Caffè speciale con Baileys e panna', price: 7.50, img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80' },
{ id: 'cf8', cat: 'caffetteria', name: 'Calipso Coffee', desc: 'Caffè speciale con liquore al caffè/rum e panna', price: 7.50, img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80' },

// LIQUORI E DIGESTIVI
{ id: 'li1', cat: 'liquori', name: 'Limoncello', desc: 'Liquore al limone', price: 5.20, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'li2', cat: 'liquori', name: 'Grappa', desc: 'Grappa classica', price: 5.50, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'li3', cat: 'liquori', name: 'Grappa barricata', desc: 'Grappa invecchiata', price: 6.50, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'li4', cat: 'liquori', name: 'Whiskey Jack Daniels', desc: 'Bourbon whiskey', price: 9.00, img: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80' },
{ id: 'li5', cat: 'liquori', name: 'Whiskey Jameson', desc: 'Irish whiskey', price: 8.00, img: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80' },
{ id: 'li6', cat: 'liquori', name: 'Whiskey Black Label', desc: 'Scotch whiskey', price: 11.00, img: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80' },
{ id: 'li7', cat: 'liquori', name: 'Whiskey Red Label', desc: 'Scotch whiskey', price: 10.00, img: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80' },
{ id: 'li8', cat: 'liquori', name: 'Whiskey J&B', desc: 'Scotch whiskey', price: 7.00, img: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80' },
{ id: 'li9', cat: 'liquori', name: 'Sambuca', desc: 'Liquore all\'anice', price: 5.50, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'li10', cat: 'liquori', name: 'Amaretto Disaronno', desc: 'Liquore alle mandorle', price: 5.50, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'li11', cat: 'liquori', name: 'Baileys', desc: 'Crema di whiskey', price: 5.50, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'li12', cat: 'liquori', name: 'Montenegro', desc: 'Amaro italiano', price: 5.50, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'li13', cat: 'liquori', name: 'Averna', desc: 'Amaro siciliano', price: 5.50, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'li14', cat: 'liquori', name: 'Fernet Branca', desc: 'Amaro d\'erbe', price: 5.50, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },

// COCKTAILS
{ id: 'ck1', cat: 'cocktails', name: 'Aperol Spritz', desc: 'Cocktail spritz classico', price: 9.00, img: 'http://googleusercontent.com/image_collection/image_retrieval/14328947519542503099_0' },
{ id: 'ck2', cat: 'cocktails', name: 'Campari Spritz', desc: 'Cocktail spritz al Campari', price: 9.00, img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80' },
{ id: 'ck3', cat: 'cocktails', name: 'Limoncello Spritz', desc: 'Cocktail spritz al limoncello', price: 9.00, img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80' },
{ id: 'ck4', cat: 'cocktails', name: 'Negroni', desc: 'Campari, Vermouth rosso, Gin', price: 9.00, img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80' },
{ id: 'ck5', cat: 'cocktails', name: 'Americano', desc: 'Campari, Vermouth rosso, soda', price: 9.00, img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80' },
{ id: 'ck6', cat: 'cocktails', name: 'Mojito', desc: 'Rum, menta, lime, zucchero di canna, soda', price: 9.00, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'ck7', cat: 'cocktails', name: 'Sex on the Beach', desc: 'Vodka, liquore alla pesca, succo d\'arancia e mirtillo', price: 9.00, img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80' },
{ id: 'ck8', cat: 'cocktails', name: 'Tequila Sunrise', desc: 'Tequila, succo d\'arancia, granatina', price: 9.00, img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80' },
{ id: 'ck9', cat: 'cocktails', name: 'Pina Colada', desc: 'Rum, succo d\'ananas, crema di cocco', price: 9.00, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'ck10', cat: 'cocktails', name: 'Moscow Mule', desc: 'Vodka, ginger beer, succo di lime', price: 9.00, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'ck11', cat: 'cocktails', name: 'Disaronno Sour', desc: 'Disaronno, succo di limone, sciroppo di zucchero', price: 9.00, img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80' },
{ id: 'ck12', cat: 'cocktails', name: 'Virgen Mojito (Analcolico)', desc: 'Menta, lime, zucchero di canna, soda', price: 7.00, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
{ id: 'ck13', cat: 'cocktails', name: 'Virgen Colada (Analcolico)', desc: 'Succo d\'ananas, crema di cocco', price: 7.00, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },

// GIN SELECTION
{ id: 'gn1', cat: 'gin', name: 'Gordons', desc: 'Gin', price: 9.00, img: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80' },
{ id: 'gn2', cat: 'gin', name: 'Gordons Pink', desc: 'Gin rosa', price: 9.00, img: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80' },
{ id: 'gn3', cat: 'gin', name: 'Tanqueray', desc: 'Gin', price: 10.00, img: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80' },
{ id: 'gn4', cat: 'gin', name: 'Bulldog', desc: 'Gin', price: 11.00, img: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80' },
{ id: 'gn5', cat: 'gin', name: 'Bombay Saphire', desc: 'Gin', price: 12.00, img: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80' },
{ id: 'gn6', cat: 'gin', name: 'Hendricks', desc: 'Gin', price: 12.00, img: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80' },
{ id: 'gn7', cat: 'gin', name: 'Gin Sul', desc: 'Gin', price: 15.00, img: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80' }
];

    /* =====================================================
       STATO DELL'APP
    ===================================================== */
    let currentCat = 'tutte';
    let cart = [];
    let searchTerm = '';

    const urlParams = new URLSearchParams(window.location.search);
    const tableId = urlParams.get('table');
    if(tableId) {
      document.getElementById('tableIndicator').textContent = `Tavolo ${tableId}`;
    }

    /* =====================================================
       RENDERING
    ===================================================== */
    function renderCategories() {
      const catList = document.getElementById('catList');
      let html = `<button class="cat-btn ${currentCat === 'tutte' ? 'active' : ''}" onclick="setCat('tutte')">
                    Tutte
                    <span class="cat-badge">${menuItems.length}</span>
                  </button>`;
      categories.forEach(c => {
        const count = menuItems.filter(m => getTopCategory(m) === c.id).length;
        html += `<button class="cat-btn ${currentCat === c.id ? 'active' : ''}" onclick="setCat('${c.id}')">
                   <span>${c.icon} ${c.name}</span>
                   <span class="cat-badge">${count}</span>
                 </button>`;
      });
      catList.innerHTML = html;
    }

    function renderMenu() {
      const grid = document.getElementById('menuGrid');
      const title = document.getElementById('currentCatTitle');
      if(currentCat === 'tutte') {
        title.innerHTML = `<span>🍽️</span> Tutte le categorie`;
      } else {
        const c = categories.find(x => x.id === currentCat);
        title.innerHTML = `<span>${c.icon}</span> ${c.name}`;
      }
      let items = currentCat === 'tutte' ? menuItems : menuItems.filter(m => getTopCategory(m) === currentCat);
      
      // Apply search filter
      if (searchTerm) {
        items = items.filter(item =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.desc.toLowerCase().includes(searchTerm)
        );
      }
      
      if (items.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; color:var(--text-3); text-align:center; padding:40px;">Nessun prodotto in questa categoria</div>`;
        return;
      }
      const grouped = items.reduce((acc, item) => {
        const section = item.section || item.cat;
        if (!acc[section]) acc[section] = [];
        acc[section].push(item);
        return acc;
      }, {});
      grid.innerHTML = Object.entries(grouped).map(([section, sectionItems]) => `
        <div class="menu-section-heading">${formatSectionTitle(section)}</div>
        ${sectionItems.map(item => `
          <div class="menu-card">
            <div class="menu-card__img">
              <div class="menu-card__img-placeholder">${categories.find(c => c.id === item.cat)?.icon || '🍽️'}</div>
              <img src="${item.img}" alt="${item.name}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; opacity: 0.5;" onerror="this.style.display='none'">
            </div>
            <div class="menu-card__info">
              <div class="menu-card__title">${item.name}</div>
              <div class="menu-card__desc">${item.desc}</div>
              <div class="menu-card__bottom">
                <div class="menu-card__price">${item.price.toFixed(2)} €</div>
                <button class="menu-card__add" onclick="addToCart('${item.id}')">+</button>
              </div>
            </div>
          </div>
        `).join('')}
      `).join('');
    }

    /* =====================================================
       CARRELLO
    ===================================================== */
    function setCat(id) {
      currentCat = id;
      renderCategories();
      renderMenu();
    }

    function addToCart(itemId) {
      const item = menuItems.find(i => i.id === itemId);
      const existing = cart.find(c => c.item.id === itemId);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ item, qty: 1, note: '' });
      }
      renderCart();
    }

    function changeQty(itemId, delta) {
      const idx = cart.findIndex(c => c.item.id === itemId);
      if (idx === -1) return;
      cart[idx].qty += delta;
      if (cart[idx].qty <= 0) {
        cart.splice(idx, 1);
      }
      renderCart();
    }

    window.updateItemNote = function(itemId, noteStr) {
      const idx = cart.findIndex(c => c.item.id === itemId);
      if (idx !== -1) {
        cart[idx].note = noteStr.trim();
      }
    };

    function renderCart() {
      const container = document.getElementById('cartItems');
      const totalEl = document.getElementById('cartTotal');
      const btnSend = document.getElementById('btnSend');
      const mobileBtn = document.getElementById('mobileCartBtn');
      const mobileTotal = document.getElementById('mobileCartTotal');

      if (cart.length === 0) {
        container.innerHTML = `<div class="cart-empty">Il carrello è vuoto</div>`;
        totalEl.textContent = '0.00 €';
        mobileTotal.textContent = '0.00 €';
        btnSend.disabled = true;
        mobileBtn.style.display = 'none';
        return;
      }

      mobileBtn.style.display = window.innerWidth <= 900 ? 'flex' : 'none';
      btnSend.disabled = false;

      let total = 0;
      container.innerHTML = cart.map(c => {
        total += c.item.price * c.qty;
        return `
          <div class="cart-item">
            <div class="cart-item__info">
              <span class="cart-item__name">${c.item.name}</span>
              <span class="cart-item__price">${c.item.price.toFixed(2)} €</span>
              <input type="text" class="cart-item__note" placeholder="Note (es. ben cotto)" value="${c.note || ''}" onchange="updateItemNote('${c.item.id}', this.value)" />
            </div>
            <div class="cart-item__actions">
              <button class="cart-btn" onclick="changeQty('${c.item.id}', -1)">-</button>
              <span class="cart-qty">${c.qty}</span>
              <button class="cart-btn" onclick="changeQty('${c.item.id}', 1)">+</button>
            </div>
          </div>
        `;
      }).join('');
      totalEl.textContent = total.toFixed(2) + ' €';
      mobileTotal.textContent = total.toFixed(2) + ' €';
    }

    async function sendOrder() {
      if (cart.length === 0) return;
      const orderData = {
        tableId: (tableId && tableId !== 'Asporto') ? parseInt(tableId) : 'Asporto',
        status: 'new',
        timestamp: Date.now(),
        tableNote: '',
        items: cart.map(c => ({
          id: c.item.id,
          name: c.item.name,
          price: c.item.price,
          qty: c.qty,
          note: c.note || '',
          status: 'new'
        }))
      };
      try {
        const newOrderRef = push(ref(db, 'orders'));
        await set(newOrderRef, orderData);

        // Aggiorna status tavolo → Occupato (se non è Asporto)
        if (tableId && tableId !== 'Asporto') {
          const tableRef = ref(db, `tables/${tableId}`);
          // Leggi prima per preservare startedAt se esiste già
          const { get } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js');
          const snap = await get(tableRef);
          const existing = snap.val() || {};
          const tableUpdate = {
            status: 'occupied',
            startedAt: existing.startedAt || Date.now()
          };
          await update(tableRef, tableUpdate);
        }

        window.location.href = 'index.html';
      } catch (e) {
        console.error("Errore invio ordine:", e);
        alert("Errore: " + e.message);
      }
    }

    /* =====================================================
       MOBILE CART TOGGLE
    ===================================================== */
    const cartPanel = document.getElementById('cartPanel');
    const overlay = document.getElementById('cartOverlay');

    function toggleMobileCart() {
      if(window.innerWidth > 900) return;
      cartPanel.classList.toggle('open');
      overlay.classList.toggle('show');
    }

    document.getElementById('mobileCartBtn').addEventListener('click', toggleMobileCart);
    document.getElementById('cartCloseBtn').addEventListener('click', toggleMobileCart);
    overlay.addEventListener('click', toggleMobileCart);

    window.addEventListener('resize', () => {
      if(window.innerWidth > 900) {
        cartPanel.classList.remove('open');
        overlay.classList.remove('show');
        renderCart(); // Fixes mobile FAB display state
      }
    });

    /* =====================================================
       INIT & EXPORTS — Necessario perché script è type="module"
       Le funzioni module non sono globali, vanno esposte su window
    ===================================================== */
    window.setCat         = setCat;
    window.addToCart      = addToCart;
    window.changeQty      = changeQty;
    window.sendOrder      = sendOrder;
    window.toggleMobileCart = toggleMobileCart;

    renderCategories();
    renderMenu();
    renderCart();
    
    // Search input handler
    const searchInput = document.getElementById('orderSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        renderMenu();
      });
    }