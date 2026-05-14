/**
 * portfolio — app.js
 * Navbar · Typed effect · Scroll reveal · Scroll-top · Contact form
 */

'use strict';

/* =============================================
   HELPERS
   ============================================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

/* =============================================
   NAVBAR — sticky + active section indicator
   ============================================= */
(function initNavbar() {
  const navbar    = $('#navbar');
  const toggle    = $('#navToggle');
  const navLinks  = $('#navLinks');
  const links     = $$('.nav-link');
  const sections  = $$('section[id]');

  // Scrolled class
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActive();
    toggleScrollTop();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  toggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // Active section highlight
  function highlightActive() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 100) current = sec.id;
    });
    links.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }
})();

/* =============================================
   TYPED EFFECT — hero title
   ============================================= */
(function initTyped() {
  const el = $('#typed');
  if (!el) return;

  const phrases = [
    'Desarrollador Junior',
    'Web Developer',
    'Autodidacta &amp; Curioso',
    'Python Enthusiast',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function tick() {
    const current = phrases[phraseIdx];
    const displayLen = deleting ? charIdx-- : ++charIdx;
    el.innerHTML = current.slice(0, displayLen);

    if (!deleting && charIdx === current.length) {
      paused = true;
      setTimeout(() => { paused = false; deleting = true; loop(); }, 2200);
      return;
    }

    if (deleting && charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }

    loop();
  }

  function loop() {
    if (paused) return;
    const speed = deleting ? 42 : 78;
    setTimeout(tick, speed);
  }

  loop();
})();

/* =============================================
   SCROLL REVEAL — IntersectionObserver
   ============================================= */
(function initReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(item => observer.observe(item));
})();

/* =============================================
   SCROLL TO TOP BUTTON
   ============================================= */
function toggleScrollTop() {
  const btn = $('#scrollTop');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}

$('#scrollTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =============================================
   FOOTER YEAR
   ============================================= */
const yearEl = $('#footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =============================================
   CONTACT FORM — validation + feedback
   ============================================= */
(function initContactForm() {
  const form      = $('#contactForm');
  const submitBtn = $('#submitBtn');
  const note      = $('#formNote');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    // Validate
    if (!name || !email || !message) {
      showNote('Por favor, completa todos los campos.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showNote('Por favor, introduce un email válido.', 'error');
      return;
    }

    // Simulate send
    setLoading(true);
    await sleep(1400);
    setLoading(false);

    showNote('✓ ¡Mensaje enviado! Te responderé pronto.', 'success');
    form.reset();

    // NOTE: Replace the simulation above with your preferred
    // backend / Formspree / EmailJS integration:
    //
    // const res = await fetch('https://formspree.io/f/YOUR_ID', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    //   body: JSON.stringify({ name, email, message }),
    // });
    // if (res.ok) { ... } else { showNote('Error al enviar.', 'error'); }
  });

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.querySelector('.btn-text').textContent =
      loading ? 'Enviando…' : 'Enviar mensaje';
  }

  function showNote(text, type) {
    note.textContent = text;
    note.className   = `form-note ${type}`;
    setTimeout(() => {
      note.textContent = '';
      note.className   = 'form-note';
    }, 5000);
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
})();

/* =============================================
   AVATAR PLACEHOLDER — inline SVG fallback
   ============================================= */
(function initAvatar() {
  const img = $('.hero-photo');
  if (!img) return;

  img.addEventListener('error', () => {
    // Replace with an inline SVG avatar if image fails
    const wrapper = img.parentElement;
    const size    = img.width || 120;
    const svg = `
      <svg
        class="hero-photo"
        width="${size}" height="${size}"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Avatar del desarrollador"
        style="border-radius:50%;background:#1c2128;border:3px solid #0f1117;position:relative;z-index:1;"
      >
        <circle cx="60" cy="46" r="24" fill="#3b82f6" opacity=".3"/>
        <circle cx="60" cy="46" r="18" fill="#3b82f6" opacity=".6"/>
        <ellipse cx="60" cy="98" rx="36" ry="22" fill="#3b82f6" opacity=".2"/>
        <text x="60" y="55" text-anchor="middle" font-size="28" font-family="Poppins,sans-serif" fill="#f5f5f5" font-weight="700">👤</text>
      </svg>`;
    img.insertAdjacentHTML('afterend', svg);
    img.remove();
  });
})();

/* =============================================
   PROJECTS — dynamic injection helper
   (call addProject({...}) to add new cards)
   ============================================= */
window.addProject = function ({ name, desc, techs = [], demo = '#', repo = '#', img = null } = {}) {
  const grid = $('#projectsGrid');
  if (!grid) return;

  const techTags = techs.map(t => `<span class="tech-tag">${t}</span>`).join('');
  const thumbContent = img
    ? `<img src="${img}" alt="Preview de ${name}" loading="lazy"/>`
    : `<div class="project-thumb-inner" aria-hidden="true">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
           <rect x="2" y="3" width="20" height="14" rx="2"/>
           <path d="M8 21h8M12 17v4"/>
         </svg>
         <span>Preview próximamente</span>
       </div>`;

  const card = document.createElement('article');
  card.className = 'project-card reveal visible';
  card.setAttribute('aria-label', name);
  card.innerHTML = `
    <div class="project-thumb ${img ? '' : 'project-thumb--placeholder'}">${thumbContent}</div>
    <div class="project-body">
      <h3 class="project-name">${name}</h3>
      <p class="project-desc">${desc}</p>
      <div class="project-tech" aria-label="Tecnologías usadas">${techTags}</div>
      <div class="project-links">
        <a href="${demo}" class="btn btn-sm btn-primary" target="_blank" rel="noopener">Demo</a>
        <a href="${repo}" class="btn btn-sm btn-ghost" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          GitHub
        </a>
      </div>
    </div>`;

  grid.appendChild(card);
};
