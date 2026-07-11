// Logica di core business per l'elaborazione dei turni e regole aziendali orari
import { timeStringToMinutes } from './utils.js';

/**
 * Calcola le ore ordinarie e gli straordinari applicando la regola del troncamento giornaliero.
 * Lo straordinario NON accumula minuti residui inferiori all'ora intera tra giorni diversi.
 */
export function calculateShiftData(timeInStr, timeOutStr) {
    if (!timeInStr || !timeOutStr) return { totalHours: 0, overtimeHours: 0 };

    const totalMinutesWorked = timeStringToMinutes(timeOutStr) - timeStringToMinutes(timeInStr);
    if (totalMinutesWorked <= 0) return { totalHours: 0, overtimeHours: 0 };

    const baseHoursLimit = 8; // Limite standard giornaliero per calcolo straordinari
    const totalHoursFloat = totalMinutesWorked / 60;

    let totalHours = Number(totalHoursFloat.toFixed(2));
    let overtimeHours = 0;

    if (totalHoursFloat > baseHoursLimit) {
        const extraMinutes = totalMinutesWorked - (baseHoursLimit * 60);
        // Regola stringente: scarto dei minuti residui non interi (es. 67 min -> 1 ora, 23 min -> 0 ore)
        overtimeHours = Math.floor(extraMinutes / 60);
        // Le ore lavorate calcolate includono la base standard più lo straordinario intero convalidato
        totalHours = baseHoursLimit + overtimeHours;
    }

    return { totalHours, overtimeHours };
}