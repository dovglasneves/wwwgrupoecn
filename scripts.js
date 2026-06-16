/* ============================================================
   ECN Gás – scripts.js  (v2)
   ============================================================ */

// ── Mobile menu toggle ──────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Active nav link on scroll ───────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ── Scroll-reveal ───────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.feature-card, .product-card, .quality-inner, .about-inner, .hero-text, .hero-image'
);

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealEls.forEach(el => el.classList.add('will-reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 70);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));
}

// ── City selector → WhatsApp link ──────────────────────────
(function () {
  const citySelect  = document.getElementById('citySelect');
  const heroWppBtn  = document.getElementById('heroWppBtn');
  const wppMessage  = encodeURIComponent('Olá! Gostaria de fazer um pedido de gás.');

  function updateWppLink() {
    const number = citySelect.value;
    heroWppBtn.href = `https://wa.me/${number}?text=${wppMessage}`;
  }

  citySelect.addEventListener('change', updateWppLink);
  updateWppLink(); // initialise on load
})();


(function () {
  const INTERVAL = 6000; // 6 seconds

  const slides   = document.querySelectorAll('.carousel-slide');
  const dots     = document.querySelectorAll('.carousel-dot');
  const prevBtn  = document.querySelector('.carousel-arrow--prev');
  const nextBtn  = document.querySelector('.carousel-arrow--next');
  const progress = document.getElementById('carouselProgress');

  if (!slides.length) return;

  let current   = 0;
  let timer     = null;
  let progTimer = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    resetProgress();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  function resetProgress() {
    // Kill any running animation
    if (progress) {
      progress.style.transition = 'none';
      progress.style.width = '0%';
      // Force reflow then animate
      void progress.offsetWidth;
      progress.style.transition = `width ${INTERVAL}ms linear`;
      progress.style.width = '100%';
    }
  }

  // Arrow clicks — restart timer
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

  // Dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.dataset.index));
      startAuto();
    });
  });

  // Pause on hover
  const carousel = document.getElementById('aboutCarousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => {
      clearInterval(timer);
      if (progress) { progress.style.transition = 'none'; }
    });
    carousel.addEventListener('mouseleave', () => {
      startAuto();
    });
  }

  // Touch swipe support
  let touchStartX = 0;
  if (carousel) {
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); startAuto(); }
    }, { passive: true });
  }

  // Kick off
  resetProgress();
  startAuto();
})();
