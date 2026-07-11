import { db, auth } from './firebase.js';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { formatTime, formatDate } from './utils.js';
import { calculateShiftData } from './attendance.js';

let selectedShiftId = null;

export async function initOwnerDashboard() {
    await loadOwnerKPIs();
    await loadReviewList();
    await loadEmployeesList();
    
    // Configurazione dell'invio modulo impostazioni GPS
    document.getElementById('gps-settings-form').onsubmit = async (e) => {
        e.preventDefault();
        const lat = parseFloat(document.getElementById('setting-lat').value);
        const lng = parseFloat(document.getElementById('setting-lng').value);
        const radius = parseInt(document.getElementById('setting-radius').value);
        
        await setDoc(doc(db, "settings", "gps_config"), { latitude: lat, longitude: lng, radius: radius });
        alert("Configurazione GPS salvata con successo!");
    };
}

async function loadOwnerKPIs() {
    const qSnapshot = await getDocs(collection(db, "attendance"));
    let presenti = 0;
    let daApprovare = 0;
    let totalHours = 0;

    qSnapshot.forEach((d) => {
        const data = d.data();
        if (data.status === "In corso") presenti++;
        if (data.status === "Da approvare") daApprovare++;
        if (data.status === "Approvato" || data.status === "Chiuso") {
            const res = calculateShiftData(data.approvedClockIn, data.approvedClockOut);
            totalHours += res.totalHours;
        }
    });

    document.getElementById('owner-stat-presenti').innerText = presenti;
    document.getElementById('owner-stat-da-approvare').innerText = daApprovare;
    document.getElementById('owner-stat-ore-mese').innerText = totalHours;
}

async function loadReviewList() {
    const q = query(collection(db, "attendance"), where("status", "==", "Da approvare"));
    const querySnapshot = await getDocs(q);
    const container = document.getElementById('owner-review-list');
    container.innerHTML = "";

    if (querySnapshot.empty) {
        container.innerHTML = "<p style='color:var(--color-text-muted); font-size:0.9rem;'>Nessun turno in attesa.</p>";
        return;
    }

    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const item = document.createElement('div');
        item.className = "list-item";
        item.innerHTML = `
            <div class="item-info">
                <h4>${data.userName}</h4>
                <p>Data: ${formatDate(data.realClockIn)} | Reale: ${formatTime(data.realClockIn)} - ${formatTime(data.realClockOut)}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-primary btn-review-trigger" style="padding: 8px 12px; font-size: 0.85rem;" data-id="${docSnap.id}">Esamina</button>
            </div>
        `;
        container.appendChild(item);
    });

    document.querySelectorAll('.btn-review-trigger').forEach(btn => {
        btn.onclick = () => openReviewModal(btn.getAttribute('data-id'));
    });
}

async function openReviewModal(shiftId) {
    selectedShiftId = shiftId;
    const qSnapshot = await getDocs(collection(db, "attendance"));
    let shiftData = null;
    qSnapshot.forEach(d => { if (d.id === shiftId) shiftData = d.data(); });

    if (!shiftData) return;

    document.getElementById('modal-employee-name').innerText = `Turno di ${shiftData.userName}`;
    document.getElementById('modal-real-in').innerText = formatTime(shiftData.realClockIn);
    document.getElementById('modal-real-out').innerText = formatTime(shiftData.realClockOut);
    
    document.getElementById('picker-time-in').value = shiftData.approvedClockIn;
    document.getElementById('picker-time-out').value = shiftData.approvedClockOut || "";

    document.getElementById('review-modal').classList.add('active');
}

export function setupModalHandlers() {
    const modal = document.getElementById('review-modal');
    
    const closeModal = () => modal.classList.remove('active');
    document.getElementById('modal-close-btn').onclick = closeModal;
    document.getElementById('btn-modal-cancel').onclick = closeModal;

    document.getElementById('btn-modal-approve').onclick = async () => {
        if (!selectedShiftId) return;
        
        const newIn = document.getElementById('picker-time-in').value;
        const newOut = document.getElementById('picker-time-out').value;
        
        const qSnapshot = await getDocs(collection(db, "attendance"));
        let oldData = null;
        qSnapshot.forEach(d => { if (d.id === selectedShiftId) oldData = d.data(); });

        const calculated = calculateShiftData(newIn, newOut);

        // Salvataggio audit log modifiche
        await addDoc(collection(db, "logs"), {
            operatorId: auth.currentUser.uid,
            operatorName: auth.currentUser.displayName || "Owner",
            timestamp: serverTimestamp(),
            shiftId: selectedShiftId,
            oldValues: { approvedClockIn: oldData.approvedClockIn, approvedClockOut: oldData.approvedClockOut },
            newValues: { approvedClockIn: newIn, approvedClockOut: newOut }
        });

        // Aggiornamento turno su Firestore
        const shiftRef = doc(db, "attendance", selectedShiftId);
        await updateDoc(shiftRef, {
            approvedClockIn: newIn,
            approvedClockOut: newOut,
            totalHours: calculated.totalHours,
            overtimeHours: calculated.overtimeHours,
            status: "Approvato"
        });

        closeModal();
        await initOwnerDashboard();
    };
}

async function loadEmployeesList() {
    const q = query(collection(db, "users"), where("role", "==", "employee"));
    const querySnapshot = await getDocs(q);
    const container = document.getElementById('owner-employees-list');
    container.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const item = document.createElement('div');
        item.className = "list-item";
        item.innerHTML = `
            <div class="item-info">
                <h4>${data.name}</h4>
                <p>Email: ${data.email}</p>
            </div>
            <div>
                <span class="badge badge-closed">Registrato</span>
            </div>
        `;
        container.appendChild(item);
    });
}