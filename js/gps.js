import { db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * Calcola la distanza in metri tra due coordinate geografiche (Formula di Haversine)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Raggio della Terra in metri
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Avvia il tracciamento in tempo reale della posizione GPS del dipendente
 */
export function watchEmployeePosition(onStatusChange) {
    if (!navigator.geolocation) {
        onStatusChange({ valid: false, message: "GPS non supportato dal browser" });
        return;
    }

    // Monitoraggio continuo della posizione nativa dello smartphone
    navigator.geolocation.watchPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                
                // Recupero i parametri di configurazione impostati dal proprietario
                const settingsDoc = await getDoc(doc(db, "settings", "gps_config"));
                if (!settingsDoc.exists()) {
                    onStatusChange({ valid: false, message: "Configurazione sede mancante" });
                    return;
                }
                
                const config = settingsDoc.data();
                const distance = calculateDistance(latitude, longitude, config.latitude, config.longitude);

                if (distance <= config.radius) {
                    onStatusChange({ valid: true, message: "Posizione valida (Sei nella sede)", lat: latitude, lng: longitude });
                } else {
                    onStatusChange({ valid: false, message: `Fuori raggio di circa ${Math.round(distance - config.radius)}m`, lat: latitude, lng: longitude });
                }
            } catch (error) {
                onStatusChange({ valid: false, message: "Errore di connessione al database" });
            }
        },
        (error) => {
            let msg = "Errore nel rilevamento GPS";
            if (error.code === 1) msg = "Permesso GPS negato dal dispositivo";
            onStatusChange({ valid: false, message: msg });
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
}
