// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
function closeMobile() {
  mobileMenu.classList.remove('open');
}

// Cerrar menú al hacer scroll
window.addEventListener('scroll', () => {
  mobileMenu.classList.remove('open');
});

// Formulario feedback
function handleSubmit(btn) {
  const original = btn.textContent;
  btn.textContent = '¡Enviado! Nos ponemos en contacto contigo pronto ✓';
  btn.style.background = '#059669';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    btn.disabled = false;
  }, 4000);
}

// Animación de entrada suave al hacer scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.act-card, .test-card, .sede-card, .stat-box, .gal-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ===== CARRUSEL TESTIMONIOS =====
(function() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('carouselDots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.test-card'));
  let current = 0;

  function getVisible() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  let visible = getVisible();
  const total = cards.length;

  function buildDots() {
    dotsWrap.innerHTML = '';
    const pages = total - visible + 1;
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', 'Ir al testimonio ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(index) {
    visible = getVisible();
    const maxIndex = Math.max(0, total - visible);
    current = Math.max(0, Math.min(index, maxIndex));

    const cardWidth = cards[0].offsetWidth;
    const gap = 24;
    track.style.transform = `translateX(-${current * (cardWidth + gap)}px)`;

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIndex;

    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Swipe táctil
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
  });

  // Auto-avance cada 5s
  let autoTimer = setInterval(() => {
    const maxIndex = Math.max(0, total - getVisible());
    goTo(current < maxIndex ? current + 1 : 0);
  }, 5000);

  [prevBtn, nextBtn].forEach(btn => btn.addEventListener('click', () => {
    clearInterval(autoTimer);
  }));

  window.addEventListener('resize', () => {
    visible = getVisible();
    buildDots();
    goTo(current);
  });

  buildDots();
  goTo(0);
})();