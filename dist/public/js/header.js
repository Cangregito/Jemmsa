// ===== HEADER & THEME MANAGEMENT =====

const html = document.documentElement;

// ===== TEMA INICIAL =====
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme ? savedTheme === 'dark' : systemDark;

  html.classList.toggle('dark', isDark);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      html.classList.toggle('dark', e.matches);
    }
  });
}

function initHeader() {
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  const themeTextMobile = document.getElementById('themeTextMobile');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  // Set initial mobile theme text based on current theme
  if (themeTextMobile) {
    const isDark = html.classList.contains('dark');
    themeTextMobile.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
  }

  // 🌙 Theme toggle desktop
  themeToggle?.addEventListener('click', () => {
    const dark = html.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });

  // 🌙 Theme toggle mobile
  themeToggleMobile?.addEventListener('click', () => {
    const dark = html.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    
    // Update the text based on the current theme
    const themeText = document.getElementById('themeTextMobile');
    if (themeText) {
      themeText.textContent = dark ? 'Modo claro' : 'Modo oscuro';
    }
  });

  // ☰ Mobile menu toggle con animación
  menuToggle?.addEventListener('click', () => {
    const menu = document.getElementById('mobileMenu');
    if (!menu) return;
    
    const isOpen = menu.classList.contains('opacity-100');

    if (isOpen) {
      menu.classList.remove(
        'opacity-100',
        'pointer-events-auto',
        'translate-y-0',
      );
      menu.classList.add(
        'opacity-0',
        'pointer-events-none',
        '-translate-y-4',

      );
    } else {
      menu.classList.remove(
        'opacity-0',
        'pointer-events-none',
        '-translate-y-4'
      );
      menu.classList.add(
        'opacity-100',
        'pointer-events-auto',
        'translate-y-0'
      );
    }
    console.log('Menú móvil abierto:', !isOpen);
  });

  // ESC cierra menú
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu) {
      mobileMenu.classList.add('opacity-0', 'pointer-events-none');
      mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
    }
  });
}

// ===== LOAD HEADER COMPONENT =====
async function loadHeader() {
  const container = document.getElementById('header');
  if (!container) return;

  try {
    const currentPath = window.location.pathname;
    const headerPath = currentPath.includes('/dist/')
      ? '../src/pages/header.html'
      : './src/pages/header.html';

    const res = await fetch(headerPath);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const htmlText = await res.text(); // 👈 SE LEE UNA SOLA VEZ
    console.log('HEADER CARGADO:', htmlText); // debug OK

    container.innerHTML = htmlText; // 👈 reutilizamos el texto
    initHeader();
  } catch (error) {
    console.error('Error cargando header:', error);
  }
}


// ===== LOAD FOOTER COMPONENT =====
async function loadFooter() {
  const container = document.getElementById('footer');
  if (!container) return;

  try {
    // Determinar la ruta correcta basada en la ubicación del documento
    const currentPath = window.location.pathname;
    const footerPath = currentPath.includes('/dist/') 
      ? '../src/pages/footer.html'
      : './src/pages/footer.html';
    
    const res = await fetch(footerPath);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    container.innerHTML = await res.text();
  } catch (error) {
    console.error('Error cargando footer:', error);
  }
}

// Inicializar tema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadHeader();
  loadFooter();
});
