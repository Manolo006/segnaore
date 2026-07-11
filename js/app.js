import { checkAuthState } from './auth.js';
import { watchEmployeePosition } from './gps.js';
import { initEmployeeDashboard, clockIn, clockOut } from './employee.js';
import { initOwnerDashboard, setupModalHandlers } from './owner.js';

let currentGpsStatus = { valid: false, message: "Inizializzazione...", lat: null, lng: null };
let currentUserPayload = null;

// Avvio applicazione e routing in base ai ruoli estratti da Firestore
document.addEventListener("DOMContentLoaded", () => {
    // Se ci troviamo nella pagina di login, lasciamo che auth.js gestisca il flusso
    if (window.location.pathname.includes("login.html")) return;

    checkAuthState((user) => {
        currentUserPayload = user;
        document.getElementById('user-display-name').innerText = user.name;
        
        if (user.role === 'owner') {
            document.getElementById('section-owner').classList.add('active');
            setupModalHandlers();
            initOwnerDashboard();
        } else if (user.role === 'employee') {
            document.getElementById('section-employee').classList.add('active');
            
            // Avvio della localizzazione passiva automatica (regola da specifica: nessun pulsante manuale)
            watchEmployeePosition((gpsState) => {
                currentGpsStatus = gpsState;
                const indicator = document.getElementById('gps-status');
                
                if (indicator) {
                    indicator.innerText = gpsState.message;
                    indicator.className = gpsState.valid ? "geo-indicator active" : "geo-indicator inactive";
                }
                
                // Ricarica lo stato dei pulsanti in base alla posizione GPS aggiornata
                initEmployeeDashboard(currentUserPayload, currentGpsStatus);
            });
            
            setupEmployeeEventHandlers();
        }
    });
});

function setupEmployeeEventHandlers() {
    const btnIn = document.getElementById('btn-clock-in');
    const btnOut = document.getElementById('btn-clock-out');

    btnIn.onclick = async () => {
        if (!currentGpsStatus.valid) return;
        btnIn.disabled = true;
        await clockIn(currentUserPayload.uid, { lat: currentGpsStatus.lat, lng: currentGpsStatus.lng });
        await initEmployeeDashboard(currentUserPayload, currentGpsStatus);
    };

    btnOut.onclick = async () => {
        if (!currentGpsStatus.valid) return;
        btnOut.disabled = true;
        await clockOut({ lat: currentGpsStatus.lat, lng: currentGpsStatus.lng });
        await initEmployeeDashboard(currentUserPayload, currentGpsStatus);
    };
}