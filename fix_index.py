import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix FAB button
content = content.replace(
    """<button class="fab" id="fabBtn" title="Nuovo ordine" onclick="window.location.href='lista-ordini.html'">""",
    """<button class="fab" id="fabBtn" title="Nuovo ordine" onclick="window.startGlobalOrder()">"""
)

# 2. Expose startGlobalOrder to window
content = content.replace(
    "function startGlobalOrder() {",
    "window.startGlobalOrder = function() {"
)

# 3. Remove wait-order from legend HTML
wait_order_legend = r"""<div class="legend-item" data-filter="wait-order">
            <div class="legend-dot" style="background: var\(--s-wait-order\)"></div>
            Attesa ordine
            <span class="legend-count" id="lc-wait">1</span>
          </div>"""
content = re.sub(wait_order_legend, "", content, flags=re.DOTALL)

# 4. Remove wait-order from STATUS objects
content = re.sub(r"\s*'wait-order': 'Attesa ordine',", "", content)
content = re.sub(r"\s*'wait-order': '#f59e0b',", "", content)
content = re.sub(r"\s*'wait-order': '🟡',", "", content)

# 5. Make "Nuovo ordine" button ALWAYS active
content = re.sub(
    r"""<button class="pact-btn pact-btn--primary"\s+\$\{isFree \|\| isReserved \? 'disabled title="Prima imposta il tavolo come attivo"' : ''\}""",
    """<button class="pact-btn pact-btn--primary" """,
    content
)

# 6. Add red X button to mobile sheet header
old_sheet_header = r"""<div style="padding:16px 20px 8px;">
        <h3 style="font-size:1.1rem;font-weight:700;">Tavolo \$\{id\}</h3>
        <p style="font-size:0.8rem;color:var\(--text-2\);margin-top:2px;">\$\{d.seats\} posti</p>
      </div>"""
new_sheet_header = """<div style="padding:16px 20px 8px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="font-size:1.1rem;font-weight:700;">Tavolo ${id}</h3>
          <p style="font-size:0.8rem;color:var(--text-2);margin-top:2px;">${d.seats} posti</p>
        </div>
        <button onclick="closePanel()" style="background:var(--s-danger); color:white; border:none; width:32px; height:32px; border-radius:50%; font-weight:bold; cursor:pointer;">X</button>
      </div>"""
content = content.replace(old_sheet_header, new_sheet_header)

# 7. Update initSync logic to jump straight to preparing
content = content.replace(
    "t.status = 'wait-order';",
    "t.status = 'preparing';"
)

# 8. Update updateStats
content = content.replace(
    "const counts = { free: 0, reserved: 0, 'wait-order': 0, preparing: 0, ready: 0, bill: 0, paid: 0 };",
    "const counts = { free: 0, reserved: 0, preparing: 0, ready: 0, bill: 0, paid: 0 };"
)
content = content.replace(
    "'lc-free': 'free', 'lc-wait': 'wait-order', 'lc-prep': 'preparing',",
    "'lc-free': 'free', 'lc-prep': 'preparing',"
)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
