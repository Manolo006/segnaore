function initNavbar() {
  const placeholder = document.getElementById('navbar-placeholder');
  if (!placeholder) return;

  fetch('navbar.html')
    .then(response => response.text())
    .then(html => {
      placeholder.outerHTML = html;

      const path = window.location.pathname;
      let activeTab = 'sala';
      if (path.includes('lista-ordini') || path.includes('ordini')) activeTab = 'ordini';
      else if (path.includes('cucina')) activeTab = 'cucina';
      else if (path.includes('presenze')) activeTab = 'presenze';
      else if (path.includes('consumi') || path.includes('owner')) activeTab = 'owner';

      const nav = document.getElementById('bottomNav');
      if (nav) {
        nav.querySelectorAll('.bnav-item').forEach(btn => {
          if (btn.dataset.tab === activeTab) btn.classList.add('active');
          else btn.classList.remove('active');
        });
      }

      function updateOwnerButton(role) {
        const bBtn = document.getElementById('bnavOwnerBtn');
        if (!bBtn) return;
        if (role === 'owner') {
          bBtn.style.setProperty('display', 'flex', 'important');
        } else {
          bBtn.style.setProperty('display', 'none', 'important');
        }
      }

      // Check current cached role
      const cachedRole = localStorage.getItem('userRole');
      updateOwnerButton(cachedRole);

      // Listen to dynamic role changes
      document.addEventListener('userRoleLoaded', (e) => {
        updateOwnerButton(e.detail.role);
      });

      // Notify other scripts that navbar is loaded
      document.dispatchEvent(new Event('navbarLoaded'));
    })
    .catch(err => console.error('Error loading navbar:', err));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbar);
} else {
  initNavbar();
}