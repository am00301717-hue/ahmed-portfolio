// ============================================
// Mobile navigation
// ============================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// ============================================
// Terminal deploy-log animation (hero)
// ============================================
const terminalBody = document.getElementById('terminalBody');

const logLines = [
  { text: '$ git push origin main', delay: 250 },
  { text: '[ci] building image...', delay: 500, cls: '' },
  { text: '[ci] running tests', delay: 450 },
  { text: '  ✓ 42 tests passed', delay: 350, cls: 'line-ok' },
  { text: '[cd] deploying to <cluster>', delay: 500, cls: 'line-tag' },
  { text: '  kubectl rollout status', delay: 450 },
  { text: '  ✓ deployment successful', delay: 400, cls: 'line-ok' },
  { text: '$ app is live', delay: 300 },
];

function runTerminalSequence() {
  if (!terminalBody) return;
  terminalBody.innerHTML = '';
  let i = 0;

  function typeLine() {
    if (i >= logLines.length) {
      terminalBody.innerHTML += '<span class="cursor"></span>';
      return;
    }
    const { text, delay, cls } = logLines[i];
    const lineEl = document.createElement('div');
    if (cls) lineEl.className = cls;
    terminalBody.appendChild(lineEl);

    let charIndex = 0;
    const typeChar = setInterval(() => {
      lineEl.textContent = text.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex >= text.length) {
        clearInterval(typeChar);
        i++;
        setTimeout(typeLine, delay);
      }
    }, 18);
  }

  typeLine();
}

// Respect reduced-motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion && terminalBody) {
  terminalBody.innerHTML = logLines
    .map((l) => `<div class="${l.cls || ''}">${l.text}</div>`)
    .join('');
} else {
  runTerminalSequence();
}

// ============================================
// Navbar active-link highlighting on scroll
// ============================================
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);

sections.forEach((section) => sectionObserver.observe(section));

// ============================================
// Contact form (front-end only demo handling)
// ============================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = 'Please fill in every field before sending.';
    formStatus.style.color = '#f87171';
    return;
  }

  formStatus.style.color = '';
  formStatus.textContent = `Thanks, ${name.split(' ')[0]} — message received. I'll reply by email shortly.`;
  contactForm.reset();
});

// ============================================
// Footer year
// ============================================
document.getElementById('year').textContent = new Date().getFullYear();
