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