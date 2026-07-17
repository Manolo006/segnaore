document.addEventListener('DOMContentLoaded', () => {
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
      
      // Notify other scripts that navbar is loaded
      document.dispatchEvent(new Event('navbarLoaded'));
    })
    .catch(err => console.error('Error loading navbar:', err));
});