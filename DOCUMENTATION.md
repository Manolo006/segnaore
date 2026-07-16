# Segna Ore - Documentazione Tecnica

Questa documentazione descrive l'architettura, le logiche di sincronizzazione e la struttura del database per il sistema di gestione tavoli e comande "Segna Ore".

## 1. Architettura Generale
Il sistema è una Web App single-page (SPA) scritta in HTML, CSS (Vanilla) e JavaScript.
Si appoggia all'ecosistema **Firebase** per il backend:
- **Firebase Realtime Database:** Gestisce in tempo reale lo stato dei tavoli e le comande.
- **Firebase Firestore:** Utilizzato per l'autenticazione basata su ruoli (Role-Based Access Control) per determinare chi è il proprietario (Owner) e chi no.
- **Firebase Auth:** Gestisce i login degli utenti.

## 2. Struttura del Database (Realtime Database)

### Nodo `tables/`
I tavoli sono salvati come **Oggetto JSON** (non come Array/Lista). Questa scelta architetturale è fondamentale per evitare i problemi di "Array Coercion" di Firebase, in cui chiavi intere possono causare corruzione degli indici.
Ogni tavolo è identificato da una chiave col prefisso testuale `table_` (es. `table_1`, `table_2`).

**Esempio di Struttura:**
```json
{
  "tables": {
    "table_1": {
      "id": 1,
      "status": "occupied",
      "guests": 2,
      "seats": 2,
      "startedAt": 17162352123,
      "slotIds": ["pt_1"],
      "reservedTime": "",
      "reservedGuests": 0
    },
    "table_2": {
      "id": 2,
      "status": "free",
      "guests": 0,
      "seats": 4,
      ...
    }
  }
}
```

### Nodo `orders/`
Le comande (ordini) inviate alla cucina vengono salvate usando chiavi autogenerate (Push ID) da Firebase sotto la radice `orders/`.
Ogni ordine contiene:
- `tableId`: L'ID numerico del tavolo a cui l'ordine appartiene.
- `status`: Lo stato dell'ordine in cucina (`pending`, `preparing`, `ready`, `done`).
- `items`: L'elenco dei piatti.
- `timestamp` / `createdAt`: L'orario in cui l'ordine è stato inviato.

---

## 3. Logiche di Sincronizzazione (Client-Server)

### 3.1 Lettura e Migrazione Automatica (`initSync`)
All'apertura della pagina `index.html`, la funzione `initSync` scarica l'intero nodo `tables`:
1. **Lettura:** Legge i dati. Se è il primo avvio assoluto e il database è vuoto (`null`), inietta un array hardcoded di tavoli di default per inizializzare la mappa.
2. **Auto-Migrazione:** Se rileva che Firebase sta servendo i dati in formato Array legacy (es. `[null, {id:1}]`) o in formato Oggetto coercizzato (es. `{"1": {id:1}}`), ricostruisce localmente la lista, la formatta con le chiavi `table_X` e invia un aggiornamento di massa a Firebase per forzare il formato Oggetto permanente.
3. **Conversione Locale:** Una volta scaricato l'oggetto `tables`, il codice frontend lo converte in un array `tables = Object.values(data)` e lo ordina per ID per l'uso nell'interfaccia utente.

### 3.2 Scrittura e Atomicità (`syncTablesToDB`)
Quando un cameriere modifica lo stato di un tavolo (es. preme "Occupato"), la modifica viene inviata a Firebase:
- Si utilizza **Aggiornamento Multi-Path** direttamente sul nodo `/tables`.
- Costruendo un dizionario come `{"table_1": {...nuovi dati...}}`, Firebase esegue la scrittura in modo **Atomico**. 
- Questo previene qualsiasi conflitto o "Race Condition": se due camerieri modificano due tavoli diversi nello stesso momento, Firebase garantisce che entrambi gli aggiornamenti abbiano successo senza sovrascriversi a vicenda.

---

## 4. Logica "Kitchen Display System" (KDS)

Il sistema include una sincronizzazione in background passiva chiamata "KDS Sync" che monitora il nodo `orders/` per dedurre l'attività reale dei tavoli ed evitare errori umani.

**Regole KDS:**
1. Quando l'app legge gli `orders`, filtra gli ordini associati a un tavolo che NON sono ancora completati (`status !== 'done'`).
2. Se un tavolo ha ordini non completati, ma il cameriere lo ha inavvertitamente segnato come libero, il sistema forza automaticamente il tavolo nello stato `preparing` (o lo mantiene in `ready`).
3. Se il cameriere imposta il tavolo su "Chiede il conto" (`bill`) o "Pagato" (`paid`), il KDS **non interviene** (lascia lo stato scelto dal cameriere).
4. *Nota di attenzione:* Affinché un tavolo possa restare stabilmente "Libero" (`free`), tutti i suoi ordini associati in `orders/` devono essere completati, archiviati o cancellati, altrimenti la logica KDS lo riporterà in stato "In preparazione".

---

## 5. UI e Funzionalità Front-end

- **Mappa Interattiva (Canvas):** La planimetria è gestita con div posizionati in assoluto (`#floor-canvas-pt-dynamic`). La classe CSS `overflow: hidden` previene gli scroll indesiderati e garantisce la reattività dello zoom/pan mantenendo le proporzioni.
- **Pannello Laterale / Bottom Sheet:** L'interfaccia si adatta (Desktop vs Mobile). Cliccando un tavolo, la variabile globale `selectedTableId` viene impostata, e viene popolato l'HTML del pannello. Per salvare la chiusura in base ad azioni esterne si usa la funzione globale `closePanel()`.
- **Prenotazioni:** Il sistema per le prenotazioni imposta i dati sul tavolo (orario, numero persone). Fino a che non è passata l'ora o si cancella la prenotazione, lo stato viene bloccato in `reserved`.
- **Permessi Owner:** Quando `onAuthStateChanged` rileva che un utente connesso ha ruolo `owner` in Firestore, rende visibili i bottoni verso `consumi.html` ed eventuali statistiche. I dipendenti standard non vedono questi elementi.
