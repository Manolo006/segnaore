/* =====================================================
       FIREBASE — Inizializzazione diretta (GitHub Pages safe)
    ===================================================== */
    import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
    import { getDatabase, ref, push, set, update, onValue } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

    const firebaseConfig = {
      apiKey:            "AIzaSyCtJWFHpz_wSZd7pVxhUdNkGUNjuRXDexc",
      authDomain:        "in-punto.firebaseapp.com",
      databaseURL:       "https://in-punto-default-rtdb.europe-west1.firebasedatabase.app",
      projectId:         "in-punto",
      storageBucket:     "in-punto.firebasestorage.app",
      messagingSenderId: "851521503055",
      appId:             "1:851521503055:web:7e23520cf67641f044cf3a"
    };
    const fbApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
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
      vini: 'bevande',
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

    export const menuItems = [
     // BRUSCHETTE
{ id: 'br1', cat: 'bruschette', name: 'Bruschetta vegetariana', desc: 'Stracciatella, pomodori secchi, zucchine grigliate e basilico', price: 8.50, img: 'img/br1.png' },
{ id: 'br2', cat: 'bruschette', name: 'Bruschetta italiana', desc: 'Pomodori, aglio e basilico', price: 5.50, img: 'img/br2.png' },
{ id: 'br3', cat: 'bruschette', name: 'Bruschetta In Punto', desc: 'Prosciutto di Parma, burrata e glassa balsamica', price: 10.50, img: 'img/br3.png' },

// FOCACCE
{ id: 'fo1', cat: 'focacce', name: 'Focaccia Capri', desc: 'Prosciutto di Parma, mozzarella di bufala e pomodoro', price: 11.90, img: 'img/fo1.png' },
{ id: 'fo2', cat: 'focacce', name: 'Focaccia Alpina', desc: 'Prosciutto cotto, asiago e funghi porcini', price: 11.50, img: 'img/fo2.png' },
{ id: 'fo3', cat: 'focacce', name: 'Focaccia Calabra', desc: 'Salame piccante, scamorza affumicata e cipolla di Tropea', price: 10.90, img: 'img/fo3.png' },
{ id: 'fo4', cat: 'focacce', name: 'Focaccia di Recco (per 2 persone)', desc: 'Ripiena di stracchino', price: 12.90, img: 'img/fo4.png' },

// TAGLIERI
{ id: 't1', cat: 'taglieri', name: 'Tagliere salumi italiani', desc: 'Selezione di salumi italiani', price: 24.90, img: 'img/t1.png' },
{ id: 't2', cat: 'taglieri', name: 'Tagliere formaggi italiani', desc: 'Selezione di formaggi italiani', price: 22.50, img: 'img/t2.png' },
{ id: 't3', cat: 'taglieri', name: 'Tagliere misto', desc: 'Salumi e formaggi italiani', price: 26.90, img: 'img/t3.png' },

// PIZZE AL PADELLINO
{ id: 'pz1', cat: 'pizze', name: 'Golosa', desc: 'Burrata, mortadella e pesto di limone', price: 14.50, img: 'img/pz1.png' },
{ id: 'pz2', cat: 'pizze', name: 'Maialosa', desc: 'Porchetta, pecorino e cipolla caramellata', price: 14.90, img: 'img/pz2.png' },
{ id: 'pz3', cat: 'pizze', name: 'Tradizione', desc: 'Polpettine, sugo di pomodoro e Grana Padano', price: 13.90, img: 'img/pz3.png' },
{ id: 'pz4', cat: 'pizze', name: 'Gourmet', desc: 'Prosciutto Parma, rucola, Grana Padano e glassa balsamica', price: 14.50, img: 'img/pz4.png' },

// FRITTI
{ id: 'fr1', cat: 'fritti', name: 'Arancino siciliano', desc: 'Riso, carne macinata, piselli, formaggio', price: 7.50, img: 'img/fr1.png' },
{ id: 'fr2', cat: 'fritti', name: 'Cuori di parmigiano', desc: 'Parmigiano fritto', price: 7.50, img: 'img/fr2.png' },
{ id: 'fr3', cat: 'fritti', name: 'Olive ascolane', desc: 'Olive ripiene fritte', price: 6.50, img: 'img/fr3.png' },
{ id: 'fr4', cat: 'fritti', name: 'Chicken nuggets', desc: 'Bocconcini di pollo fritti', price: 7.50, img: 'img/fr4.png' },
{ id: 'fr5', cat: 'fritti', name: 'Patatine fritte', desc: 'Patate fritte', price: 4.50, img: 'img/fr5.png' },

// PRIMI
{ id: 'p1', cat: 'primi', name: 'Tagliolini funghi e tartufo', desc: 'Pasta fresca con funghi e tartufo', price: 21.50, img: 'img/p1.png' },
{ id: 'p2', cat: 'primi', name: 'Tagliolino polpettine e melanzane', desc: 'Sugo con polpettine e melanzane', price: 15.50, img: 'img/p2.png' },
{ id: 'p3', cat: 'primi', name: 'Maccheroncino Gargato carbonara', desc: 'Uova, guanciale e pecorino', price: 14.90, img: 'img/p3.png' },
{ id: 'p4', cat: 'primi', name: 'Maccheroncino Gargato cacio e pepe', desc: 'Pecorino e pepe', price: 14.50, img: 'img/p4.png' },
{ id: 'p5', cat: 'primi', name: 'Agnolotto di brasato', desc: 'Con demi-glace e parmigiano', price: 20.50, img: 'img/p5.png' },
{ id: 'p6', cat: 'primi', name: 'Raviolo di branzino', desc: 'Pomodoro, olive e capperi', price: 20.90, img: 'img/p6.png' },
{ id: 'p7', cat: 'primi', name: 'Lasagna bolognese', desc: 'Classica lasagna al ragù', price: 13.90, img: 'img/p7.png' },

// SECONDI
{ id: 's1', cat: 'secondi', name: 'Parmigiana di melanzane', desc: 'Melanzane, pomodoro e parmigiano', price: 15.90, img: 'img/s1.png' },
{ id: 's2', cat: 'secondi', name: 'Frittura mista di gamberi e calamari', desc: 'Pesce fritto misto', price: 19.90, img: 'img/s2.png' },

// DOLCI
{ id: 'd1', cat: 'dolci', name: 'Cheesecake', desc: 'Torta al formaggio', price: 6.90, img: 'img/d1.png' },
{ id: 'd2', cat: 'dolci', name: 'Profiterole', desc: 'Bignè con crema e cioccolato', price: 6.90, img: 'img/d2.png' },
{ id: 'd3', cat: 'dolci', name: 'Tiramisù', desc: 'Dolce al caffè e mascarpone', price: 6.90, img: 'img/d3.png' },
{ id: 'd4', cat: 'dolci', name: 'Gelato cioccolato', desc: 'Gelato al cioccolato', price: 6.90, img: 'img/d4.png' },
{ id: 'd5', cat: 'dolci', name: 'Gelato crema', desc: 'Gelato alla crema', price: 6.90, img: 'img/d5.png' },
{ id: 'd6', cat: 'dolci', name: 'Gelato limone', desc: 'Gelato al limone', price: 6.90, img: 'img/d6.png' },
{ id: 'd7', cat: 'dolci', name: 'doce de limão', desc: 'dolce al limone', price: 6.90, img: 'img/d7.png' },

// VINI DELLA CASA
{ id: 'b1', cat: 'vini', name: 'Vino della Casa (Calice) rosso', desc: 'Toscana Rosso', price: 4.90, img: 'img/b1.png' },
{ id: 'b2', cat: 'vini', name: 'Vino della Casa (Calice) bianco', desc: 'Toscana Branco', price: 4.90, img: 'img/b2.png' },
{ id: 'b3', cat: 'vini', name: 'Vino della Casa (Bottiglia) rosso', desc: 'Toscana Rosso', price: 18.90, img: 'img/b3.png' },
{ id: 'b4', cat: 'vini', name: 'Vino della Casa (Bottiglia) bianco', desc: 'Toscana Branco', price: 18.90, img: 'img/b4.png' },

// VINI ITALIANI
{ id: 'vi1', cat: 'vini', name: 'Primitivo di Puglia zin', desc: 'Vino rosso italiano', price: 25.90, img: 'img/vi1.png' },
{ id: 'vi2', cat: 'vini', name: 'Valpolicella superiore ripasso', desc: 'Vino rosso italiano', price: 29.90, img: 'img/vi2.png' },
{ id: 'vi3', cat: 'vini', name: 'Chianti classico peppoli', desc: 'Vino rosso italiano', price: 35.90, img: 'img/vi3.png' },
{ id: 'vi4', cat: 'vini', name: 'Pinot grigio', desc: 'Vino bianco italiano', price: 23.90, img: 'img/vi4.png' },
{ id: 'vi5', cat: 'vini', name: 'Gewurtztraminer', desc: 'Vino bianco italiano', price: 34.90, img: 'img/vi5.png' },
{ id: 'vi6', cat: 'vini', name: 'Pinot grigio blash rose (Calice)', desc: 'Vino rosato italiano al calice', price: 5.20, img: 'img/vi6.png' },
{ id: 'vi7', cat: 'vini', name: 'Pinot grigio blash rose (Bottiglia)', desc: 'Vino rosato italiano in bottiglia', price: 22.90, img: 'img/vi7.png' },

// VINI PORTOGHESI E VERDI
{ id: 'vp1', cat: 'vini', name: 'Conde Vilar verde (Bottiglia)', desc: 'Vinho Verde portoghese', price: 17.90, img: 'img/vp1.png' },
{ id: 'vp2', cat: 'vini', name: 'Conde Vilar verde (Calice)', desc: 'Vinho Verde portoghese al calice', price: 4.90, img: 'img/vp2.png' },
{ id: 'vp3', cat: 'vini', name: 'Conde Vilar alvarinho', desc: 'Vinho Verde portoghese', price: 21.90, img: 'img/vp3.png' },
{ id: 'vp4', cat: 'vini', name: 'Soalheiro alvarinho', desc: 'Vinho Verde portoghese', price: 27.90, img: 'img/vp4.png' },
{ id: 'vp5', cat: 'vini', name: 'Monte da peceguina (Tinto)', desc: 'Vino rosso portoghese', price: 28.90, img: 'img/vp5.png' },
{ id: 'vp6', cat: 'vini', name: 'Esporão reserva (Tinto)', desc: 'Vino rosso portoghese', price: 33.90, img: 'img/vp6.png' },
{ id: 'vp7', cat: 'vini', name: 'Beyra sauvignon Blanc', desc: 'Vino bianco portoghese', price: 26.90, img: 'img/vp7.png' },
{ id: 'vp8', cat: 'vini', name: 'Monte da peceguina (Bianco)', desc: 'Vino bianco portoghese', price: 28.90, img: 'img/vp8.png' },
{ id: 'vp9', cat: 'vini', name: 'Monte da peseguina R (Rosé)', desc: 'Vino rosato portoghese', price: 28.90, img: 'img/vp9.png' },

// BOLLICINE (ESPUMANTE)
{ id: 'bo1', cat: 'bollicine', name: 'Bosco Brut', desc: 'Spumante', price: 19.90, img: 'img/bo1.png' },
{ id: 'bo2', cat: 'bollicine', name: 'Prosecco', desc: 'Spumante prosecco', price: 21.90, img: 'img/bo2.png' },

// BIRRE
{ id: 'bi1', cat: 'birre', name: 'Birra alla spina Imperial (Pressão)', desc: 'Birra alla spina piccola/media', price: 3.20, img: 'img/bi1.png' },
{ id: 'bi2', cat: 'birre', name: 'Birra alla spina Caneca (Pressão)', desc: 'Birra alla spina grande', price: 4.50, img: 'img/bi2.png' },
{ id: 'bi3', cat: 'birre', name: 'Birra Moretti', desc: 'Birra in bottiglia', price: 4.50, img: 'img/bi3.png' },
{ id: 'bi4', cat: 'birre', name: 'Birra Peroni', desc: 'Birra in bottiglia', price: 4.50, img: 'img/bi4.png' },
{ id: 'bi5', cat: 'birre', name: 'Birra Corona', desc: 'Birra in bottiglia', price: 4.50, img: 'img/bi5.png' },
{ id: 'bi6', cat: 'birre', name: 'Birra Heineken', desc: 'Birra in bottiglia', price: 4.50, img: 'img/bi6.png' },
{ id: 'bi7', cat: 'birre', name: 'Birra Sagres 0.0', desc: 'Birra analcolica in bottiglia', price: 4.50, img: 'img/bi7.png' },
{ id: 'bi8', cat: 'birre', name: 'Birra Somersby', desc: 'Sidro in bottiglia', price: 4.20, img: 'img/bi8.png' },

// APERITIVI E SANGRIA
{ id: 'ap1', cat: 'bevande', section: 'aperitivi', name: 'Sangria Bianca (1L)', desc: 'Sangria bianca da 1 litro', price: 17.90, img: 'img/ap1.png' },
{ id: 'ap2', cat: 'bevande', section: 'aperitivi', name: 'Sangria Tinta (1L)', desc: 'Sangria rossa da 1 litro', price: 17.90, img: 'img/ap2.png' },
{ id: 'ap3', cat: 'bevande', section: 'aperitivi', name: 'Sangria Rosé (1L)', desc: 'Sangria rosata da 1 litro', price: 17.90, img: 'img/ap3.png' },
{ id: 'ap4', cat: 'bevande', section: 'aperitivi', name: 'Sangria Espumante (1L)', desc: 'Sangria con spumante da 1 litro', price: 19.90, img: 'img/ap4.png' },
{ id: 'ap5', cat: 'bevande', section: 'aperitivi', name: 'Martini Rosso', desc: 'Aperitivo', price: 6.00, img: 'img/ap5.png' },
{ id: 'ap6', cat: 'bevande', section: 'aperitivi', name: 'Martini Dry', desc: 'Aperitivo', price: 6.00, img: 'img/ap6.png' },
{ id: 'ap7', cat: 'bevande', section: 'aperitivi', name: 'Martini Bianco', desc: 'Aperitivo', price: 6.00, img: 'img/ap7.png' },
{ id: 'ap8', cat: 'bevande', section: 'aperitivi', name: 'Vino di Porto Down\'s Tawny', desc: 'Vino liquoroso', price: 5.00, img: 'img/ap8.png' },
{ id: 'ap9', cat: 'bevande', section: 'aperitivi', name: 'Vino di Porto Down\'s Ruby', desc: 'Vino liquoroso', price: 5.00, img: 'img/ap9.png' },
{ id: 'ap10', cat: 'bevande', section: 'aperitivi', name: 'Vino di Porto Down\'s LBV', desc: 'Vino liquoroso tardivo imbottigliato', price: 5.00, img: 'img/ap10.png' },

// SOFT DRINKS E ACQUA
{ id: 'sd1', cat: 'bevande', section: 'softdrinks', name: 'Coca Cola', desc: 'Soft drink', price: 3.50, img: 'img/sd1.png' },
{ id: 'sd2', cat: 'bevande', section: 'softdrinks', name: 'Coca Cola Zero', desc: 'Soft drink senza zuccheri', price: 3.50, img: 'img/sd2.png' },
{ id: 'sd3', cat: 'bevande', section: 'softdrinks', name: 'Fanta', desc: 'Soft drink', price: 3.50, img: 'img/sd3.png' },
{ id: 'sd4', cat: 'bevande', section: 'softdrinks', name: 'Sprite', desc: 'Soft drink', price: 3.50, img: 'img/sd4.png' },
{ id: 'sd5', cat: 'bevande', section: 'softdrinks', name: 'Lipton Mango', desc: 'Tè freddo al mango', price: 3.50, img: 'img/sd5.png' },
{ id: 'sd6', cat: 'bevande', section: 'softdrinks', name: 'Lipton Limone', desc: 'Tè freddo al limone', price: 3.50, img: 'img/sd6.png' },
{ id: 'sd7', cat: 'bevande', section: 'softdrinks', name: 'Lipton Pesca', desc: 'Tè freddo alla pesca', price: 3.50, img: 'img/sd7.png' },
{ id: 'sd8', cat: 'bevande', section: 'softdrinks', name: 'Ginger Ale', desc: 'Soft drink al ginger', price: 3.40, img: 'img/sd8.png' },
{ id: 'sd9', cat: 'bevande', section: 'softdrinks', name: 'Tonica Schweppes', desc: 'Acqua tonica', price: 3.40, img: 'img/sd9.png' },
{ id: 'sd10', cat: 'bevande', section: 'softdrinks', name: 'Succo d\'arancia naturale', desc: 'Spremuta fresca d\'arancia', price: 4.50, img: 'img/sd10.png' },
{ id: 'sd11', cat: 'bevande', section: 'softdrinks', name: 'Succo di frutta', desc: 'Gusti assortiti', price: 3.90, img: 'img/sd11.png' },
{ id: 'sd12', cat: 'bevande', section: 'softdrinks', name: 'Acqua Luso 1L', desc: 'Acqua naturale', price: 3.50, img: 'img/sd12.png' },
{ id: 'sd13', cat: 'bevande', section: 'softdrinks', name: 'Acqua Luso 0.50L', desc: 'Acqua naturale', price: 2.50, img: 'img/sd13.png' },
{ id: 'sd14', cat: 'bevande', section: 'softdrinks', name: 'Acqua San Pellegrino 0.50L', desc: 'Acqua frizzante', price: 4.20, img: 'img/sd14.png' },
{ id: 'sd15', cat: 'bevande', section: 'softdrinks', name: 'Acqua Luso Gas 1L', desc: 'Acqua frizzante', price: 3.90, img: 'img/sd15.png' },

// CAFFETTERIA
{ id: 'cf1', cat: 'caffetteria', name: 'Caffè Espresso', desc: 'Espresso classico', price: 1.50, img: 'img/cf1.png' },
{ id: 'cf2', cat: 'caffetteria', name: 'Caffè Descafeinado', desc: 'Espresso decaffeinato', price: 1.50, img: 'img/cf2.png' },
{ id: 'cf3', cat: 'caffetteria', name: 'Cappuccino', desc: 'Cappuccino classico', price: 2.50, img: 'img/cf3.png' },
{ id: 'cf4', cat: 'caffetteria', name: 'Gallao', desc: 'Caffellatte tipico portoghese', price: 2.50, img: 'img/cf4.png' },
{ id: 'cf5', cat: 'caffetteria', name: 'Americano', desc: 'Caffè lungo', price: 2.50, img: 'img/cf5.png' },
{ id: 'cf6', cat: 'caffetteria', name: 'Irish Coffee', desc: 'Caffè speciale con whiskey e panna', price: 7.50, img: 'img/cf6.png' },
{ id: 'cf7', cat: 'caffetteria', name: 'Baileys Coffee', desc: 'Caffè speciale con Baileys e panna', price: 7.50, img: 'img/cf7.png' },
{ id: 'cf8', cat: 'caffetteria', name: 'Calipso Coffee', desc: 'Caffè speciale con liquore al caffè/rum e panna', price: 7.50, img: 'img/cf8.png' },

// LIQUORI E DIGESTIVI
{ id: 'li1', cat: 'liquori', name: 'Limoncello', desc: 'Liquore al limone', price: 5.20, img: 'img/li1.png' },
{ id: 'li2', cat: 'liquori', name: 'Grappa', desc: 'Grappa classica', price: 5.50, img: 'img/li2.png' },
{ id: 'li3', cat: 'liquori', name: 'Grappa barricata', desc: 'Grappa invecchiata', price: 6.50, img: 'img/li3.png' },
{ id: 'li4', cat: 'liquori', name: 'Whiskey Jack Daniels', desc: 'Bourbon whiskey', price: 9.00, img: 'img/li4.png' },
{ id: 'li5', cat: 'liquori', name: 'Whiskey Jameson', desc: 'Irish whiskey', price: 8.00, img: 'img/li5.png' },
{ id: 'li6', cat: 'liquori', name: 'Whiskey Black Label', desc: 'Scotch whiskey', price: 11.00, img: 'img/li6.png' },
{ id: 'li7', cat: 'liquori', name: 'Whiskey Red Label', desc: 'Scotch whiskey', price: 10.00, img: 'img/li7.png' },
{ id: 'li8', cat: 'liquori', name: 'Whiskey J&B', desc: 'Scotch whiskey', price: 7.00, img: 'img/li8.png' },
{ id: 'li9', cat: 'liquori', name: 'Sambuca', desc: 'Liquore all\'anice', price: 5.50, img: 'img/li9.png' },
{ id: 'li10', cat: 'liquori', name: 'Amaretto Disaronno', desc: 'Liquore alle mandorle', price: 5.50, img: 'img/li10.png' },
{ id: 'li11', cat: 'liquori', name: 'Baileys', desc: 'Crema di whiskey', price: 5.50, img: 'img/li11.png' },
{ id: 'li12', cat: 'liquori', name: 'Montenegro', desc: 'Amaro italiano', price: 5.50, img: 'img/li12.png' },
{ id: 'li13', cat: 'liquori', name: 'Averna', desc: 'Amaro siciliano', price: 5.50, img: 'img/li13.png' },
{ id: 'li14', cat: 'liquori', name: 'Fernet Branca', desc: 'Amaro d\'erbe', price: 5.50, img: 'img/li14.png' },

// COCKTAILS
{ id: 'ck1', cat: 'cocktails', name: 'Aperol Spritz', desc: 'Cocktail spritz classico', price: 9.00, img: 'img/ck1.png' },
{ id: 'ck2', cat: 'cocktails', name: 'Campari Spritz', desc: 'Cocktail spritz al Campari', price: 9.00, img: 'img/ck2.png' },
{ id: 'ck3', cat: 'cocktails', name: 'Limoncello Spritz', desc: 'Cocktail spritz al limoncello', price: 9.00, img: 'img/ck3.png' },
{ id: 'ck4', cat: 'cocktails', name: 'Negroni', desc: 'Campari, Vermouth rosso, Gin', price: 9.00, img: 'img/ck4.png' },
{ id: 'ck5', cat: 'cocktails', name: 'Americano', desc: 'Campari, Vermouth rosso, soda', price: 9.00, img: 'img/ck5.png' },
{ id: 'ck6', cat: 'cocktails', name: 'Mojito', desc: 'Rum, menta, lime, zucchero di canna, soda', price: 9.00, img: 'img/ck6.png' },
{ id: 'ck7', cat: 'cocktails', name: 'Sex on the Beach', desc: 'Vodka, liquore alla pesca, succo d\'arancia e mirtillo', price: 9.00, img: 'img/ck7.png' },
{ id: 'ck8', cat: 'cocktails', name: 'Tequila Sunrise', desc: 'Tequila, succo d\'arancia, granatina', price: 9.00, img: 'img/ck8.png' },
{ id: 'ck9', cat: 'cocktails', name: 'Pina Colada', desc: 'Rum, succo d\'ananas, crema di cocco', price: 9.00, img: 'img/ck9.png' },
{ id: 'ck10', cat: 'cocktails', name: 'Moscow Mule', desc: 'Vodka, ginger beer, succo di lime', price: 9.00, img: 'img/ck10.png' },
{ id: 'ck11', cat: 'cocktails', name: 'Disaronno Sour', desc: 'Disaronno, succo di limone, sciroppo di zucchero', price: 9.00, img: 'img/ck11.png' },
{ id: 'ck12', cat: 'cocktails', name: 'Virgen Mojito (Analcolico)', desc: 'Menta, lime, zucchero di canna, soda', price: 7.00, img: 'img/ck12.png' },
{ id: 'ck13', cat: 'cocktails', name: 'Virgen Colada (Analcolico)', desc: 'Succo d\'ananas, crema di cocco', price: 7.00, img: 'img/ck13.png' },

// GIN SELECTION
{ id: 'gn1', cat: 'gin', name: 'Gordons', desc: 'Gin', price: 9.00, img: 'img/gn1.png' },
{ id: 'gn2', cat: 'gin', name: 'Gordons Pink', desc: 'Gin rosa', price: 9.00, img: 'img/gn2.png' },
{ id: 'gn3', cat: 'gin', name: 'Tanqueray', desc: 'Gin', price: 10.00, img: 'img/gn3.png' },
{ id: 'gn4', cat: 'gin', name: 'Bulldog', desc: 'Gin', price: 11.00, img: 'img/gn4.png' },
{ id: 'gn5', cat: 'gin', name: 'Bombay Saphire', desc: 'Gin', price: 12.00, img: 'img/gn5.png' },
{ id: 'gn6', cat: 'gin', name: 'Hendricks', desc: 'Gin', price: 12.00, img: 'img/gn6.png' },
{ id: 'gn7', cat: 'gin', name: 'Gin Sul', desc: 'Gin', price: 15.00, img: 'img/gn7.png' }
];

    /* =====================================================
       STATO DELL'APP
    ===================================================== */
    let currentCat = 'tutte';
    let cart = [];
    let searchTerm = '';

    // Formatta automaticamente tutti gli URL delle immagini usando l'ID del piatto (es. img/d1.png)
    menuItems.forEach(item => {
      item.img = `img/${item.id}.png`;
    });

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
              <img src="${item.img}" alt="${item.name}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; opacity: 0.5;" onerror="if(this.src.indexOf('.png') !== -1) { this.src = this.src.replace('.png', '.jpg'); } else { this.style.display='none'; }">
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
      if(!cartPanel || !overlay || window.innerWidth > 900) return;
      cartPanel.classList.toggle('open');
      overlay.classList.toggle('show');
    }

    const mobBtn = document.getElementById('mobileCartBtn');
    if (mobBtn) mobBtn.addEventListener('click', toggleMobileCart);
    const closeBtn = document.getElementById('cartCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', toggleMobileCart);
    if (overlay) overlay.addEventListener('click', toggleMobileCart);

    window.addEventListener('resize', () => {
      if(cartPanel && overlay && window.innerWidth > 900) {
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

    // Ascolto per eventuali immagini personalizzate caricate da database
    onValue(ref(db, 'menu_images'), (snapshot) => {
      const overrides = snapshot.val();
      if (overrides) {
        menuItems.forEach(item => {
          if (overrides[item.id]) {
            item.img = overrides[item.id];
          }
        });
      }
      if (document.getElementById('menuGrid')) {
        renderCategories();
        renderMenu();
      }
    });

    if (document.getElementById('cartItems')) {
      renderCart();
    }
    
    // Search input handler
    const searchInput = document.getElementById('orderSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        renderMenu();
      });
    }