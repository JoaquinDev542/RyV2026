const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
}

window.addEventListener('scroll', () => {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
});
 /*
    =====================================================
      CATEGORÍAS — solo cambia los src cuando tengas
      tus propias fotos. Añade o quita { src, alt }
      en cada array libremente.
    =====================================================
    */
    const categories = {
 
      comunidad: {
        label: "Comunidad",
        images: [
          { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop", alt: "Comunidad 1" },
          { src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&auto=format&fit=crop",   alt: "Comunidad 2" },
          { src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&auto=format&fit=crop", alt: "Comunidad 3" },
          { src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&auto=format&fit=crop", alt: "Comunidad 4" },
        ]
      },
 
      ajedrez: {
        label: "Ajedrez",
        images: [
          { src: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1200&auto=format&fit=crop", alt: "Ajedrez 1" },
          { src: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=1200&auto=format&fit=crop", alt: "Ajedrez 2" },
          { src: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=1200&auto=format&fit=crop", alt: "Ajedrez 3" },
          { src: "https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1200&auto=format&fit=crop",   alt: "Ajedrez 4" },
        ]
      },
 
      senderismo: {
        label: "Senderismo",
        images: [
          { src: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&auto=format&fit=crop", alt: "Senderismo 1" },
          { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop", alt: "Senderismo 2" },
          { src: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&auto=format&fit=crop", alt: "Senderismo 3" },
          { src: "https://images.unsplash.com/photo-1510227272981-87123e259b17?w=1200&auto=format&fit=crop", alt: "Senderismo 4" },
        ]
      },
 
      pingpong: {
        label: "Ping pong",
        images: [
          { src: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=1200&auto=format&fit=crop", alt: "Ping pong 1" },
          { src: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=1200&auto=format&fit=crop", alt: "Ping pong 2" },
          { src: "https://images.unsplash.com/photo-1611251135345-18c56206b863?w=1200&auto=format&fit=crop", alt: "Ping pong 3" },
          { src: "https://images.unsplash.com/photo-1540539234-c14a20fb7c7b?w=1200&auto=format&fit=crop",   alt: "Ping pong 4" },
        ]
      },
 
      equipo: {
        label: "Equipo",
        images: [
          { src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&auto=format&fit=crop", alt: "Equipo 1" },
          { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop", alt: "Equipo 2" },
          { src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&auto=format&fit=crop", alt: "Equipo 3" },
          { src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&auto=format&fit=crop",   alt: "Equipo 4" },
        ]
      }
 
    };
    /* ===================================================== */
 
    let currentImages = [];
    let current = 0;
 
    const lb        = document.getElementById('lb');
    const lbImg     = document.getElementById('lb-img');
    const lbDots    = document.getElementById('lb-dots');
    const lbCounter = document.getElementById('lb-counter');
    const lbTitle   = document.getElementById('lb-title');
 
    function buildDots() {
      lbDots.innerHTML = '';
      currentImages.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'lb-dot' + (i === current ? ' active' : '');
        d.setAttribute('aria-label', 'Ir a foto ' + (i + 1));
        d.onclick = () => goTo(i);
        lbDots.appendChild(d);
      });
    }
 
    function goTo(i) {
      current = (i + currentImages.length) % currentImages.length;
      lbImg.src = currentImages[current].src;
      lbImg.alt = currentImages[current].alt;
      lbCounter.textContent = (current + 1) + ' / ' + currentImages.length;
      lbDots.querySelectorAll('.lb-dot').forEach((d, j) =>
        d.classList.toggle('active', j === current)
      );
    }
 
    function openLightbox(categoryKey) {
      const cat = categories[categoryKey];
      if (!cat) return;
      currentImages = cat.images;
      current = 0;
      lbTitle.textContent = cat.label;
      buildDots();
      goTo(0);
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
 
    function closeLightbox() {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    }
 
    document.querySelectorAll('.item[data-category]').forEach(el => {
      el.addEventListener('click', () => openLightbox(el.dataset.category));
    });
 
    document.getElementById('lb-close').onclick = closeLightbox;
    document.getElementById('lb-prev').onclick  = () => goTo(current - 1);
    document.getElementById('lb-next').onclick  = () => goTo(current + 1);
 
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
 
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'ArrowRight') goTo(current + 1);
      else if (e.key === 'ArrowLeft') goTo(current - 1);
      else if (e.key === 'Escape') closeLightbox();
    });
 
    let touchX = null;
    lb.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
      touchX = null;
    }, { passive: true });
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
    // La flecha derecha hace loop: al llegar al final vuelve al inicio.
    nextBtn.disabled = false;

    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => {
    goTo(current - 1);
    resetAutoPlay();
  });
  nextBtn.addEventListener('click', () => {
    const maxIndex = Math.max(0, total - getVisible());
    goTo(current >= maxIndex ? 0 : current + 1);
    resetAutoPlay();
  });

  // Swipe táctil
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      resetAutoPlay();
    }
  });

  // Auto-avance cada 5s
  let autoTimer;
  function startAutoPlay() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      const maxIndex = Math.max(0, total - getVisible());
      goTo(current < maxIndex ? current + 1 : 0);
    }, 5000);
  }

  function resetAutoPlay() {
    startAutoPlay();
  }

  startAutoPlay();

  window.addEventListener('resize', () => {
    visible = getVisible();
    buildDots();
    goTo(current);
  });

  buildDots();
  goTo(0);
})();
