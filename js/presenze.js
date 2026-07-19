/* =====================================================
       FIREBASE INITIALIZATION
    ===================================================== */
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
    import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
    import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, where, getDocs, updateDoc, serverTimestamp, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
    import { getDatabase, ref, set, get } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

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
    
    window._auth = auth;
    window._dbFirestore = dbFirestore;
    window._dbRealtime = dbRealtime;
    window._googleProvider = new GoogleAuthProvider();
    window._signInWithPopup = signInWithPopup;
    window._signOut = signOut;
    window._doc = doc;
    window._getDoc = getDoc;
    window._setDoc = setDoc;
    window._collection = collection;
    window._addDoc = addDoc;
    window._query = query;
    window._where = where;
    window._getDocs = getDocs;
    window._updateDoc = updateDoc;
    window._serverTimestamp = serverTimestamp;
    window._orderBy = orderBy;
    window._ref = ref;
    window._set = set;
    window._get = get;

    window.addEventListener('DOMContentLoaded', initApp);

    /* =====================================================
       CORE LOGIC
    ===================================================== */
    let currentUser = null;
    let userRole = null;
    let userData = null;
    let gpsStatus = { valid: false, lat: null, lng: null };
    let currentShiftId = null;

    function initApp() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          currentUser = user;
          document.getElementById('view-login').style.display = 'none';
          
          const userDoc = await getDoc(doc(dbFirestore, "users", user.uid));
          if (!userDoc.exists()) {
            await setDoc(doc(dbFirestore, "users", user.uid), {
              name: user.displayName || "Utente",
              email: user.email,
              role: "pending", // NEW ACCOUNTS START AS PENDING
              shiftStart: "09:00",
              shiftEnd: "18:00",
              contractType: "fulltime",
              createdAt: new Date()
            });
            userRole = "pending";
            userData = { shiftStart: "09:00", shiftEnd: "18:00", contractType: "fulltime" };
          } else {
            const data = userDoc.data();
            userRole = data.role;
            userData = data;
          }

          localStorage.setItem('userRole', userRole);
          document.dispatchEvent(new CustomEvent('userRoleLoaded', { detail: { role: userRole } }));

          document.getElementById('userName').textContent = user.displayName || "Utente";
          
          if (userRole === "owner" || userRole === "employee") {
            document.getElementById('view-employee').style.display = 'block';
            startGpsTracking();
            loadEmployeeDashboard();
          } else {
            // PENDING
            document.getElementById('view-pending').style.display = 'block';
          }

        } else {
          currentUser = null;
          userRole = null;
          userData = null;
          localStorage.removeItem('userRole');
          document.dispatchEvent(new CustomEvent('userRoleLoaded', { detail: { role: null } }));
          document.getElementById('view-login').style.display = 'flex';
          document.getElementById('view-employee').style.display = 'none';
          document.getElementById('view-pending').style.display = 'none';
        }
      });
    }

    window.loginWithGoogle = async () => {
      try {
        await signInWithPopup(auth, window._googleProvider);
      } catch (error) {
        console.error("Errore login", error);
        alert("Errore durante il login con Google");
      }
    };

    window.logout = async () => {
      await signOut(auth);
      window.location.reload();
    };

    /* =====================================================
       EMPLOYEE LOGIC
    ===================================================== */
    async function startGpsTracking() {
      if ("geolocation" in navigator) {
        const gpsLabel = document.getElementById('gps-status-label');
        
        const settingsSnap = await get(ref(dbRealtime, 'settings/gps'));
        const settings = settingsSnap.val() || { lat: 37.069253, lng: -8.106154, radius: 100 };

        navigator.geolocation.watchPosition(
          (position) => {
            const distance = calculateDistance(position.coords.latitude, position.coords.longitude, settings.lat, settings.lng);
            if (distance <= settings.radius) {
              gpsStatus = { valid: true, lat: position.coords.latitude, lng: position.coords.longitude };
              gpsLabel.innerHTML = '📍 Posizione valida (Ristorante)';
              gpsLabel.className = 'status-badge valid';
              updateClockButtons();
            } else {
              gpsStatus = { valid: false, lat: position.coords.latitude, lng: position.coords.longitude };
              gpsLabel.innerHTML = '⚠️ Troppo lontano dal ristorante';
              gpsLabel.className = 'status-badge invalid';
              updateClockButtons();
            }
          },
          (error) => {
            gpsLabel.innerHTML = '❌ Attiva il GPS per timbrare';
            gpsLabel.className = 'status-badge invalid';
            gpsStatus.valid = false;
            updateClockButtons();
          },
          { enableHighAccuracy: true }
        );
      }
    }

    async function loadEmployeeDashboard() {
      const q = query(collection(dbFirestore, "attendance"), where("userId", "==", currentUser.uid), where("status", "==", "In corso"));
      const snapshot = await getDocs(q);
      
      const badge = document.getElementById('shift-badge');
      if (!snapshot.empty) {
        currentShiftId = snapshot.docs[0].id;
        badge.innerHTML = `🟢 Turno In Corso`;
      } else {
        currentShiftId = null;
        badge.innerHTML = `⚪ Nessun turno attivo`;
      }
      updateClockButtons();
      loadHistory();
    }

    function updateClockButtons() {
      const btnIn = document.getElementById('btn-in');
      const btnOut = document.getElementById('btn-out');
      
      if (!gpsStatus.valid) {
        btnIn.disabled = true;
        btnOut.disabled = true;
        return;
      }

      if (currentShiftId) {
        btnIn.disabled = true;
        btnOut.disabled = false;
      } else {
        btnIn.disabled = false;
        btnOut.disabled = true;
      }
    }

    window.clockIn = async () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      
      await addDoc(collection(dbFirestore, "attendance"), {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        dateString: now.toISOString().split('T')[0],
        realClockIn: serverTimestamp(),
        realClockOut: null,
        approvedClockIn: timeStr,
        approvedClockOut: null,
        expectedIn: userData.shiftStart || "09:00", // Save for owner comparison
        expectedOut: userData.shiftEnd || "18:00",
        status: "In corso",
        note: "",
        gpsIn: { lat: gpsStatus.lat, lng: gpsStatus.lng },
        totalHours: 0
      });
      loadEmployeeDashboard();
    };

    window.clockOut = async () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      
      const shiftRef = doc(dbFirestore, "attendance", currentShiftId);
      await updateDoc(shiftRef, {
        realClockOut: serverTimestamp(),
        approvedClockOut: timeStr,
        status: "Da approvare",
        gpsOut: { lat: gpsStatus.lat, lng: gpsStatus.lng }
      });
      loadEmployeeDashboard();
    };

    function calculateShiftHours(data) {
      try {
        if (!data.approvedClockIn || !data.approvedClockOut) {
          return { regular: 0, overtime: 0, total: 0 };
        }

        const tIn = String(data.approvedClockIn);
        const tOut = String(data.approvedClockOut);

        if (!tIn.includes(':') || !tOut.includes(':')) {
          return { regular: 0, overtime: 0, total: 0 };
        }

        const [inH, inM] = tIn.split(':').map(Number);
        const [outH, outM] = tOut.split(':').map(Number);
        
        if (isNaN(inH) || isNaN(inM) || isNaN(outH) || isNaN(outM)) {
          return { regular: 0, overtime: 0, total: 0 };
        }

        const workedMinutes = (outH * 60 + outM) - (inH * 60 + inM);
        const totalWorkedHours = Math.max(0, workedMinutes) / 60;

        // Standard shift duration
        const expIn = String(data.expectedIn || "09:00");
        const expOut = String(data.expectedOut || "18:00");
        
        if (!expIn.includes(':') || !expOut.includes(':')) {
          return { regular: totalWorkedHours, overtime: 0, total: totalWorkedHours };
        }

        const [expInH, expInM] = expIn.split(':').map(Number);
        const [expOutH, expOutM] = expOut.split(':').map(Number);

        if (isNaN(expInH) || isNaN(expInM) || isNaN(expOutH) || isNaN(expOutM)) {
          return { regular: totalWorkedHours, overtime: 0, total: totalWorkedHours };
        }

        const expectedMinutes = (expOutH * 60 + expOutM) - (expInH * 60 + expInM);

        let overtime = 0;
        let regular = totalWorkedHours;

        const extraMinutes = workedMinutes - expectedMinutes;
        if (extraMinutes >= 30) {
          const overtimeMinutes = Math.floor(extraMinutes / 30) * 30;
          overtime = overtimeMinutes / 60;
          regular = Math.max(0, totalWorkedHours - overtime);
        }

        return {
          regular: regular,
          overtime: overtime,
          total: totalWorkedHours
        };
      } catch (err) {
        console.error("Error calculating shift hours for:", data, err);
        return { regular: 0, overtime: 0, total: 0 };
      }
    }

    async function loadHistory() {
      try {
        console.log("[Presenze] Caricamento storico per utente:", currentUser?.uid);
        const q = query(collection(dbFirestore, "attendance"), where("userId", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        const list = document.getElementById('history-list');
        if (!list) {
          console.warn("[Presenze] Elemento 'history-list' non trovato nel DOM.");
          return;
        }
        list.innerHTML = '';
        
        let totalRegular = 0;
        let totalOvertime = 0;

        console.log("[Presenze] Record trovati nel database:", snapshot.size);

        // Ordina in memoria per evitare errori di indice composto su Firestore
        const sortedDocs = [...snapshot.docs].sort((a, b) => {
          const timeA = a.data().realClockIn?.seconds || 0;
          const timeB = b.data().realClockIn?.seconds || 0;
          return timeB - timeA;
        });

        sortedDocs.forEach(docSnap => {
          const data = docSnap.data();
          let color = data.status === 'Approvato' ? 'var(--s-ready)' : (data.status === 'In corso' ? 'var(--s-prep)' : 'var(--s-new)');
          
          let statsHtml = '';
          if (data.approvedClockIn && data.approvedClockOut) {
            const stats = calculateShiftHours(data);
            
            if (data.status === 'Approvato') {
              totalRegular += stats.regular;
              totalOvertime += stats.overtime;
            }

            statsHtml = `
              <div style="font-size:0.8rem; color:var(--text-2); margin-top:4px;">
                Ore lavorate: <strong style="color:var(--text);">${stats.total.toFixed(2)}h</strong> 
                (Ordinarie: <strong>${stats.regular.toFixed(2)}h</strong>${stats.overtime > 0 ? `, Straordinari: <strong style="color:var(--s-new);">+${stats.overtime.toFixed(2)}h</strong>` : ''})
              </div>
            `;
          }

          list.innerHTML += `
            <div class="card history-card" style="margin-bottom: 12px; padding: 14px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div style="font-weight:700;">${data.dateString || 'Data non disponibile'}</div>
                  <div style="font-size:0.8rem; color:var(--text-2); margin-top:4px;">In: ${data.approvedClockIn || '--:--'} - Out: ${data.approvedClockOut || '--:--'}</div>
                  ${statsHtml}
                  ${data.note ? `<div style="font-size:0.75rem; color:var(--s-new); margin-top:4px;">Nota: ${data.note}</div>` : ''}
                </div>
                <div style="color: ${color}; font-size: 0.8rem; font-weight:700;">${data.status || 'Stato sconosciuto'}</div>
              </div>
            </div>
          `;
        });

        // Aggiorna riepilogo ore a schermo
        const regEl = document.getElementById('sum-regular-hours');
        const ovEl = document.getElementById('sum-overtime-hours');
        if (regEl) regEl.textContent = totalRegular.toFixed(2) + 'h';
        if (ovEl) ovEl.textContent = totalOvertime.toFixed(2) + 'h';
        console.log("[Presenze] Storico caricato con successo. Totale ordinarie:", totalRegular, "Straordinari:", totalOvertime);
      } catch (err) {
        console.error("[Presenze] Errore critico nel caricamento dello storico:", err);
      }
    }

    /* UTILS */
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371e3;
      const f1 = lat1 * Math.PI/180;
      const f2 = lat2 * Math.PI/180;
      const df = (lat2-lat1) * Math.PI/180;
      const dl = (lon2-lon1) * Math.PI/180;
      const a = Math.sin(df/2) * Math.sin(df/2) + Math.cos(f1) * Math.cos(f2) * Math.sin(dl/2) * Math.sin(dl/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }