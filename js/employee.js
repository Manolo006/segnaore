import { db, auth } from './firebase.js';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { formatTime, formatDate } from './utils.js';
import { calculateShiftData } from './attendance.js';

let currentActiveShiftId = null;

export async function initEmployeeDashboard(user, gpsStatus) {
    document.getElementById('employee-welcome').innerText = `Ciao, ${user.name}`;
    await loadEmployeeStatsAndHistory(user.uid);
    await checkActiveShift(user.uid, gpsStatus);
}

async function checkActiveShift(uid, gpsStatus) {
    const q = query(collection(db, "attendance"), where("userId", "==", uid), where("status", "==", "In corso"));
    const querySnapshot = await getDocs(q);
    
    const btnIn = document.getElementById('btn-clock-in');
    const btnOut = document.getElementById('btn-clock-out');
    const badge = document.getElementById('shift-status-badge');

    if (!querySnapshot.empty) {
        const activeShift = querySnapshot.docs[0];
        currentActiveShiftId = activeShift.id;
        badge.innerText = `In Turno dalle ore: ${formatTime(activeShift.data().realClockIn)}`;
        badge.className = "badge badge-progress mt-4";
        btnIn.disabled = true;
        btnOut.disabled = !gpsStatus.valid;
    } else {
        currentActiveShiftId = null;
        badge.innerText = "Nessun turno attivo";
        badge.className = "badge badge-closed mt-4";
        btnIn.disabled = !gpsStatus.valid;
        btnOut.disabled = true;
    }
}

export async function clockIn(uid, gpsCoords) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    
    await addDoc(collection(db, "attendance"), {
        userId: uid,
        userName: auth.currentUser.displayName || "Dipendente",
        dateString: now.toISOString().split('T')[0],
        realClockIn: serverTimestamp(),
        realClockOut: null,
        approvedClockIn: timeStr,
        approvedClockOut: null,
        status: "In corso",
        gpsIn: gpsCoords,
        gpsOut: null,
        totalHours: 0,
        overtimeHours: 0
    });
}

export async function clockOut(gpsCoords) {
    if (!currentActiveShiftId) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

    const shiftRef = doc(db, "attendance", currentActiveShiftId);
    await updateDoc(shiftRef, {
        realClockOut: serverTimestamp(),
        approvedClockOut: timeStr,
        gpsOut: gpsCoords,
        status: "Da approvare"
    });
}

async function loadEmployeeStatsAndHistory(uid) {
    const q = query(collection(db, "attendance"), where("userId", "==", uid), orderBy("realClockIn", "desc"));
    const querySnapshot = await getDocs(q);
    
    let totalMonthHours = 0;
    let totalMonthOvertime = 0;
    const listContainer = document.getElementById('employee-history-list');
    listContainer.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        
        if (data.status === "Approvato" || data.status === "Chiuso") {
            const calculated = calculateShiftData(data.approvedClockIn, data.approvedClockOut);
            totalMonthHours += calculated.totalHours;
            totalMonthOvertime += calculated.overtimeHours;
        }

        let badgeClass = "badge-closed";
        if (data.status === "In corso") badgeClass = "badge-progress";
        if (data.status === "Da approvare") badgeClass = "badge-review";
        if (data.status === "Approvato") badgeClass = "badge-approved";

        const item = document.createElement('div');
        item.className = "list-item";
        item.innerHTML = `
            <div class="item-info">
                <h4>${formatDate(data.realClockIn)}</h4>
                <p>Reale: ${formatTime(data.realClockIn)} - ${formatTime(data.realClockOut)}</p>
                <p style="font-size:0.75rem; color:var(--color-primary)">Conteggiato: ${data.approvedClockIn} - ${data.approvedClockOut || '--:--'}</p>
            </div>
            <div>
                <span class="badge ${badgeClass}">${data.status}</span>
            </div>
        `;
        listContainer.appendChild(item);
    });

    document.getElementById('emp-stat-hours').innerText = totalMonthHours;
    document.getElementById('emp-stat-overtime').innerText = totalMonthOvertime;
}