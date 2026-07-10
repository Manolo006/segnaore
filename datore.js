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
  siteRadius: 120,
};

const $ = (id) => document.getElementById(id);
let employees = [];
let records = [];
let settings = defaultSettings;

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function refreshData() {
  employees = load(storageKeys.employees, []);
  records = load(storageKeys.records, []);
  settings = { ...defaultSettings, ...load(storageKeys.settings, defaultSettings) };
}

function formatDate(value) {
  return value ? new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "—";
}

function rawHours(start, end) {
  if (!start || !end) return 0;
  return Math.max(0, (new Date(end) - new Date(start)) / 36e5);
}

function formatHours(hours) {
  return `${hours.toFixed(2)} h`;
}

function employeeName(id) {
  return employees.find((employee) => employee.id === id)?.name || "Dipendente rimosso";
}

function isActive(employeeId) {
  return records.some((record) => record.employeeId === employeeId && !record.clockOut);
}

function employeeHours(employeeId) {
  return records
    .filter((record) => record.employeeId === employeeId)
    .reduce((sum, record) => sum + rawHours(record.clockIn, record.clockOut || new Date().toISOString()), 0);
}

function renderSettings() {
  $("companyName").value = settings.companyName;
  $("companyAddress").value = settings.companyAddress;
  $("siteLat").value = settings.siteLat;
  $("siteLng").value = settings.siteLng;
  $("siteRadius").value = settings.siteRadius;
  $("companyNameView").textContent = settings.companyName || "Locale";
  $("companyPlaceView").textContent = settings.companyAddress || `${settings.siteLat}, ${settings.siteLng}`;
}

function renderStats() {
  const activeCount = employees.filter((employee) => isActive(employee.id)).length;
  const totalHours = records.reduce((sum, record) => sum + rawHours(record.clockIn, record.clockOut), 0);
  $("totalEmployees").textContent = employees.length;
  $("activeEmployees").textContent = activeCount;
  $("totalHours").textContent = formatHours(totalHours);
  $("totalRecords").textContent = records.length;
}

function renderEmployees() {
  const list = $("employeeList");
  list.innerHTML = employees.length ? "" : `<p>Nessun dipendente registrato.</p>`;
  employees.forEach((employee) => {
    const active = isActive(employee.id);
    const row = document.createElement("div");
    row.className = "employee-row";
    row.innerHTML = `
      <div>
        <strong>${employee.name}</strong>
        <div class="meta">Creato: ${formatDate(employee.createdAt)} · Ore: ${formatHours(employeeHours(employee.id))}</div>
      </div>
      <span class="pill ${active ? "ok" : "bad"}">${active ? "In servizio" : "Fuori"}</span>
    `;
    list.appendChild(row);
  });
}

function renderRecords() {
  const body = $("recordsBody");
  body.innerHTML = records.length ? "" : `<tr><td colspan="6">Nessuna timbratura registrata.</td></tr>`;
  [...records].reverse().forEach((record) => {
    const open = !record.clockOut;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${employeeName(record.employeeId)}</td>
      <td>${formatDate(record.clockIn)}</td>
      <td>${formatDate(record.clockOut)}</td>
      <td>${formatHours(rawHours(record.clockIn, record.clockOut))}</td>
      <td>GPS ${record.security?.gpsOk ? "OK" : "NO"}</td>
      <td><span class="pill ${open ? "ok" : ""}">${open ? "Aperta" : "Chiusa"}</span></td>
    `;
    body.appendChild(row);
  });
}

function renderAll() {
  refreshData();
  renderSettings();
  renderStats();
  renderEmployees();
  renderRecords();
}

function saveSettings() {
  settings = {
    ...settings,
    companyName: $("companyName").value.trim() || "Locale",
    companyAddress: $("companyAddress").value.trim(),
    siteLat: Number($("siteLat").value),
    siteLng: Number($("siteLng").value),
    siteRadius: Number($("siteRadius").value),
  };
  save(storageKeys.settings, settings);
  $("settingsMessage").textContent = "Impostazioni salvate.";
  $("settingsMessage").className = "message ok";
  renderAll();
}

function exportCsv() {
  const rows = [["Dipendente", "Entrata", "Uscita", "Ore", "GPS", "Stato"]];
  records.forEach((record) => rows.push([
    employeeName(record.employeeId),
    formatDate(record.clockIn),
    formatDate(record.clockOut),
    formatHours(rawHours(record.clockIn, record.clockOut)),
    record.security?.gpsOk ? "OK" : "NO",
    record.clockOut ? "Chiusa" : "Aperta"
  ]));
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "registro-presenze-datore.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

function resetRecords() {
  if (!confirm("Cancellare tutte le timbrature? Operazione non reversibile.")) return;
  save(storageKeys.records, []);
  renderAll();
}

function resetAll() {
  if (!confirm("Cancellare dipendenti, timbrature, impostazioni e sessione? Operazione non reversibile.")) return;
  Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
  renderAll();
}

$("saveSettingsBtn").addEventListener("click", saveSettings);
$("exportBtn").addEventListener("click", exportCsv);
$("refreshBtn").addEventListener("click", renderAll);
$("resetRecordsBtn").addEventListener("click", resetRecords);
$("resetAllBtn").addEventListener("click", resetAll);

renderAll();