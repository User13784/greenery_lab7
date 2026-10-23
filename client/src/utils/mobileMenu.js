export function initMobileMenu() {
  const burger = document.getElementById('burgerMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');

  if (!burger || !mobileMenu || !overlay) return;

  function toggleMenu() {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  }

  function closeMenu() {
    burger.classList.remove('active');
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  mobileMenu.querySelectorAll('.menu-item').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}