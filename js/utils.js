// Funzioni di utilità generiche per la gestione delle date e il calcolo degli orari

/**
 * Formatta un oggetto Date o un timestamp Firebase in formato leggibile "HH:MM"
 */
export function formatTime(dateInput) {
    if (!dateInput) return "--:--";
    const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formatta una data in stringa leggibile "DD/MM/YYYY"
 */
export function formatDate(dateInput) {
    if (!dateInput) return "";
    const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Calcola la differenza in minuti tra due stringhe orarie "HH:MM"
 */
export function timeStringToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + minutes;
}

/**
 * Converte i minuti totali in ore e minuti formattati
 */
export function minutesToHoursString(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
}

/**
 * Calcola la differenza tra orario di entrata e uscita in minuti
 */
export function calculateMinutesBetween(inStr, outStr) {
    return timeStringToMinutes(outStr) - timeStringToMinutes(inStr);
}