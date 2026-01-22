// Shared site script: component loader + responsive sidebar toggle

async function loadComponent(containerId, componentPath) {
  try {
    const res = await fetch(componentPath);
    const html = await res.text();
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = html;
  } catch (err) {
    console.error('Error loading component', componentPath, err);
  }
}

function initResponsiveNav() {
  const sidebar = document.getElementById('sidebar-nav');
  const toggleBtn = document.getElementById('menu-toggle');

  if (!sidebar || !toggleBtn) return;

  let backdrop = document.getElementById('nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'nav-backdrop';
    backdrop.className = 'fixed inset-0 bg-black/40 hidden lg:hidden z-30';
    document.body.appendChild(backdrop);
  }

  const openNav = () => {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
    backdrop.classList.remove('hidden');
    document.documentElement.classList.add('overflow-hidden');
  };
  const closeNav = () => {
    sidebar.classList.add('-translate-x-full');
    sidebar.classList.remove('translate-x-0');
    backdrop.classList.add('hidden');
    document.documentElement.classList.remove('overflow-hidden');
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = sidebar.classList.contains('translate-x-0');
    if (isOpen) closeNav(); else openNav();
  });
  backdrop.addEventListener('click', closeNav);
  document.addEventListener('keyup', (e) => { if (e.key === 'Escape') closeNav(); });

  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      backdrop.classList.add('hidden');
      sidebar.classList.add('translate-x-0');
      sidebar.classList.remove('-translate-x-full');
    } else {
      sidebar.classList.add('-translate-x-full');
      sidebar.classList.remove('translate-x-0');
    }
  };
  window.addEventListener('resize', handleResize);
  handleResize();
}

async function initSite() {
  await Promise.all([
    loadComponent('header-container', '../src/header.html'),
    loadComponent('navbar-container', '../src/navbar.html'),
    loadComponent('footer-container', '../src/footer.html')
  ]);
  initResponsiveNav();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}
