/**
 * Artsy Baku - Əsas Skript (main.js)
 * Naviqasiya, ümumi interaktivlik və dinamik konfiqurasiya məlumatlarını idarə edir.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Konfiqurasiya məlumatlarını yüklə
  const store = await Config.getStore();
  
  // 2. Dinamik biznes məlumatlarını səhifəyə tətbiq et
  applyBusinessData(store);

  // 3. Header və Mobil Menyu
  setupNavigation();

  // 4. Scroll effekti
  setupScrollEffects();

  // 5. Toast konteynerini yarat
  setupToastContainer();
});

/**
 * store.json məlumatlarını HTML-dəki müvafiq elementlərə yazır
 */
function applyBusinessData(store) {
  if (!store || !store.business) return;

  const { business } = store;

  // WhatsApp linkləri
  const waClean = business.whatsapp.replace(/\D/g, '');
  const waUrl = `https://wa.me/${waClean}`;
  
  document.querySelectorAll('[data-business="whatsapp-link"]').forEach(el => {
    el.href = waUrl;
  });

  document.querySelectorAll('[data-business="whatsapp-number"]').forEach(el => {
    el.textContent = business.whatsappDisplay || business.whatsapp;
  });

  // Instagram linkləri
  document.querySelectorAll('[data-business="instagram-link"]').forEach(el => {
    el.href = business.instagram;
  });
  document.querySelectorAll('[data-business="instagram-handle"]').forEach(el => {
    el.textContent = business.instagramDisplay || '@artsybaku';
  });

  // TikTok linkləri
  document.querySelectorAll('[data-business="tiktok-link"]').forEach(el => {
    el.href = business.tiktok;
  });
  document.querySelectorAll('[data-business="tiktok-handle"]').forEach(el => {
    el.textContent = business.tiktokDisplay || '@artsybaku';
  });

  // Avtomatik Cari İl
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/**
 * Mobil menyu açılıb-bağlanması
 */
function setupNavigation() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-menu-drawer');
  const overlay = document.querySelector('.mobile-menu-overlay');

  if (!toggleBtn || !drawer || !overlay) return;

  function toggleMenu() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    toggleBtn.classList.add('open');
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggleBtn.classList.remove('open');
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Mobil linklərə basıldıqda menyunu bağla
  drawer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * Header scroll kölgəsi
 */
function setupScrollEffects() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * Toast bildiriş mexanizmi
 */
function setupToastContainer() {
  if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

function showToast(message, type = 'info', duration = 3500) {
  const container = document.querySelector('.toast-container') || document.body;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  // Animasiya ilə göstər
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

window.showToast = showToast;
