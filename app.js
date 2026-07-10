const storageKeys = {
  employees: "segnaOreEmployees",
  records: "segnaOreRecords",
  settings: "segnaOreSettings",
  session: "segnaOreSession"
};

const defaultSettings = {
  companyName: "Locale",
  companyAddress: "",
  siteLat: 37.09403472831769,
  siteLng: -8.125283116840542,
  siteRadius: 120
};

let employees = load(storageKeys.employees, []);
let records = load(storageKeys.records, []);
let settings = load(storageKeys.settings, defaultSettings);
let currentEmployeeId = localStorage.getItem(storageKeys.session);
let securityInterval = null;

const $ = (id) => document.getElementById(id);

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function hashPin(pin) {
  return btoa([...pin].reverse().join("") + ":segna-ore");
}

function currentEmployee() {
  return employees.find((employee) => employee.id === currentEmployeeId) || null;
}

function openRecordFor(employeeId) {
  return records.find((record) => record.employeeId === employeeId && !record.clockOut);
}

function formatDate(value) {
  return value ? new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "—";
}

function hoursBetween(start, end) {
  if (!start || !end) return "—";
  const hours = (new Date(end) - new Date(start)) / 36e5;
  return `${hours.toFixed(2)} h`;
}

function distanceMeters(aLat, aLng, bLat, bLng) {
  const earth = 6371000;
  const toRad = (deg) => deg * Math.PI / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earth * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function setMessage(element, text, ok) {
  element.textContent = text;
  element.className = `message ${ok ? "ok" : "bad"}`;
}

async function checkSecurity() {
  console.log("Controllo GPS", new Date().toLocaleTimeString());
  settings = { ...defaultSettings, ...load(storageKeys.settings, defaultSettings) };
  let gpsOk = false;
  let distance = null;

  if (!navigator.geolocation) {
    updateSecurity({ gpsOk, distance, error: "GPS non supportato" });
    return lastSecurity;
  }

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 5000 });
    });
    distance = distanceMeters(position.coords.latitude, position.coords.longitude, settings.siteLat, settings.siteLng);
    gpsOk = distance <= settings.siteRadius;
    updateSecurity({ gpsOk, distance });
  } catch (error) {
    updateSecurity({ gpsOk, distance, error: "Autorizza posizione GPS per timbrare" });
  }

  return lastSecurity;
}

function updateSecurity(result = lastSecurity) {
  lastSecurity = { ...result, checkedAt: new Date().toISOString() };
  const allOk = lastSecurity.gpsOk
  const dot = $("securityDot");
  dot.className = `dot ${allOk ? "ok" : "bad"}`;
  $("securityTitle").textContent = allOk ? "Sicurezza OK" : "Sicurezza non completa";
  $("securityText").textContent = lastSecurity.error || (lastSecurity.distance === null ? "Verifica GPS" : `Distanza: ${Math.round(lastSecurity.distance)} m`);

  $("gpsBadge").className = `badge ${lastSecurity.gpsOk ? "ok" : "bad"}`;
  $("gpsText").textContent = lastSecurity.distance === null ? "Non verificato" : `${lastSecurity.gpsOk ? "Dentro" : "Fuori"} area (${Math.round(lastSecurity.distance)} m)`;
  renderEmployeeState();
}

function renderEmployeeState() {
  const employee = currentEmployee();
  const canPunch = Boolean(employee && lastSecurity.gpsOk);
  const open = employee ? openRecordFor(employee.id) : null;

  $("currentEmployee").textContent = employee ? employee.name : "Nessun dipendente";
  $("avatar").textContent = employee ? employee.name.trim()[0].toUpperCase() : "?";
  $("currentState").textContent = !employee ? "Accedi per timbrare" : open ? "Attualmente in servizio" : "Fuori servizio";
  $("clockInBtn").disabled = !canPunch || Boolean(open);
  $("clockOutBtn").disabled = !canPunch || !open;
  $("logoutBtn").hidden = !employee;
}

function renderRecords() {
  const body = $("recordsBody");
  body.innerHTML = records.length ? "" : `<tr><td colspan="5">Nessuna timbratura registrata.</td></tr>`;
  [...records].reverse().forEach((record) => {
    const employee = employees.find((item) => item.id === record.employeeId);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${employee?.name || "Dipendente rimosso"}</td>
      <td>${formatDate(record.clockIn)}</td>
      <td>${formatDate(record.clockOut)}</td>
      <td>${hoursBetween(record.clockIn, record.clockOut)}</td>
      <td>GPS ${record.security.gpsOk ? "OK" : "NO"} </td>
    `;
    body.appendChild(row);
  });
}

function loginOrCreate(event) {
  event.preventDefault();
  const name = $("employeeName").value.trim();
  const pin = $("employeePin").value.trim();
  const accountMessage = $("accountMessage");
  if (!name || pin.length < 4) return setMessage(accountMessage, "Nome e PIN minimo 4 cifre richiesti.", false);

  let employee = employees.find((item) => item.name.toLowerCase() === name.toLowerCase());
  if (employee && employee.pinHash !== hashPin(pin)) return setMessage(accountMessage, "PIN errato.", false);
  if (!employee) {
    employee = { id: crypto.randomUUID(), name, pinHash: hashPin(pin), createdAt: new Date().toISOString() };
    employees.push(employee);
    save(storageKeys.employees, employees);
  }

  currentEmployeeId = employee.id;
  localStorage.setItem(storageKeys.session, currentEmployeeId);
  $("employeePin").value = "";
  setMessage(accountMessage, `Accesso effettuato: ${employee.name}.`, true);
  renderEmployeeState();
}

async function punch(type) {
  const employee = currentEmployee();
  if (!employee) return setMessage($("punchMessage"), "Prima accedi con account dipendente.", false);
  const security = await checkSecurity();
  if (!security.gpsOk) return setMessage($("punchMessage"), "Timbratura bloccata: GPS non valido.", false);

  const now = new Date().toISOString();
  const open = openRecordFor(employee.id);
  if (type === "in" && !open) {
    records.push({ id: crypto.randomUUID(), employeeId: employee.id, clockIn: now, clockOut: null, security });
    setMessage($("punchMessage"), "Entrata registrata.", true);
  }
  if (type === "out" && open) {
    open.clockOut = now;
    open.security = security;
    setMessage($("punchMessage"), "Uscita registrata.", true);
  }
  save(storageKeys.records, records);
  renderEmployeeState();
  renderRecords();
}

function exportCsv() {
  const rows = [["Dipendente", "Entrata", "Uscita", "Ore", "GPS"]];
  records.forEach((record) => {
    const employee = employees.find((item) => item.id === record.employeeId);
    rows.push([
      employee?.name || "Dipendente rimosso",
      formatDate(record.clockIn),
      formatDate(record.clockOut),
      hoursBetween(record.clockIn, record.clockOut),
      record.security.gpsOk ? "OK" : "NO",
    ]);
  });
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "registro-presenze.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

function startSecurityMonitoring() {
  // Primo controllo immediato
  checkSecurity();

  // Evita di creare più intervalli
  if (securityInterval) {
    clearInterval(securityInterval);
  }

  // Aggiorna ogni secondo
  securityInterval = setInterval(() => {
    checkSecurity();
  }, 1000);
}

function stopSecurityMonitoring() {
  if (securityInterval) {
    clearInterval(securityInterval);
    securityInterval = null;
  }
}

$("employeeForm").addEventListener("submit", loginOrCreate);
$("logoutBtn").addEventListener("click", () => {
  currentEmployeeId = null;
  localStorage.removeItem(storageKeys.session);
  renderEmployeeState();
});
$("clockInBtn").addEventListener("click", () => punch("in"));
$("clockOutBtn").addEventListener("click", () => punch("out"));
$("checkSecurityBtn").addEventListener("click", checkSecurity);
$("exportBtn").addEventListener("click", exportCsv);

updateSecurity();
renderEmployeeState();
renderRecords();
startSecurityMonitoring();

