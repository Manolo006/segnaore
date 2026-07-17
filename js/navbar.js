function initNavbar() {
  const placeholder = document.getElementById('navbar-placeholder');
  if (!placeholder) return;

  fetch('navbar.html')
    .then(response => response.text())
    .then(html => {
      placeholder.outerHTML = html;

      const path = window.location.pathname;
      let activeTab = 'sala';
      if (path.includes('lista-ordini') || path.includes('ordini')) activeTab = 'ordini';
      else if (path.includes('cucina')) activeTab = 'cucina';
      else if (path.includes('presenze')) activeTab = 'presenze';
      else if (path.includes('consumi') || path.includes('owner')) activeTab = 'owner';

      const nav = document.getElementById('bottomNav');
      if (nav) {
        nav.querySelectorAll('.bnav-item').forEach(btn => {
          if (btn.dataset.tab === activeTab) btn.classList.add('active');
          else btn.classList.remove('active');
        });
      }

      // Firebase configuration to dynamically check owner status
      const firebaseConfig = {
        apiKey:            "AIzaSyCtJWFHpz_wSZd7pVxhUdNkGUNjuRXDexc",
        authDomain:        "in-punto.firebaseapp.com",
        databaseURL:       "https://in-punto-default-rtdb.europe-west1.firebasedatabase.app",
        projectId:         "in-punto",
        storageBucket:     "in-punto.firebasestorage.app",
        messagingSenderId: "851521503055",
        appId:             "1:851521503055:web:7e23520cf67641f044cf3a"
      };

      // Dynamically load Firebase modules to avoid scope/version conflicts
      Promise.all([
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'),
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
      ]).then(([appMod, authMod, fsMod]) => {
        // Initialize a named Firebase app instance specifically for the navbar to prevent DEFAULT app collisons
        const app = appMod.getApps().find(a => a.name === 'navbar') || appMod.initializeApp(firebaseConfig, 'navbar');
        const auth = authMod.getAuth(app);
        const dbFirestore = fsMod.getFirestore(app);

        authMod.onAuthStateChanged(auth, async (user) => {
          const bBtn = document.getElementById('bnavOwnerBtn');
          if (user) {
            try {
              const userDoc = await fsMod.getDoc(fsMod.doc(dbFirestore, "users", user.uid));
              if (userDoc.exists() && userDoc.data().role === 'owner') {
                if (bBtn) bBtn.style.setProperty('display', 'flex', 'important');
              } else {
                if (bBtn) bBtn.style.setProperty('display', 'none', 'important');
              }
            } catch (e) {
              console.error('Error fetching role in navbar:', e);
            }
          } else {
            if (bBtn) bBtn.style.setProperty('display', 'none', 'important');
          }
        });
      }).catch(err => {
        console.error('Failed to load Firebase modules in navbar:', err);
      });

      // Notify other scripts that navbar is loaded
      document.dispatchEvent(new Event('navbarLoaded'));
    })
    .catch(err => console.error('Error loading navbar:', err));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbar);
} else {
  initNavbar();
}