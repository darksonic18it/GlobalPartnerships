/* ============================================================
   GlobalPartnerships Hub – SDG 17 | main.js
   ============================================================ */

/* ---------- Navbar scroll effect ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ---------- Hamburger / mobile menu ---------- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

/* ---------- Fade-in on scroll ---------- */
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => fadeObserver.observe(el));

/* ---------- Map tooltips ---------- */
const tooltip   = document.getElementById('mapTooltip');
const mapWrapper = document.getElementById('mapWrapper');
const pins       = document.querySelectorAll('.map-pin');

pins.forEach(pin => {
  pin.addEventListener('mouseenter', (e) => {
    const { country, project, category, progress, status } = pin.dataset;

    tooltip.innerHTML = `
      <div class="tooltip-country">📍 ${country}</div>
      <div class="tooltip-project">${project}</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:8px">${category} · ${status}</div>
      <div class="tooltip-progress">
        <div class="tooltip-fill" style="width:${progress}%"></div>
      </div>
      <div class="tooltip-meta">
        <span>Progress</span>
        <span>${progress}%</span>
      </div>
    `;
    tooltip.style.display = 'block';
    updateTooltipPos(e);
  });

  pin.addEventListener('mousemove', updateTooltipPos);

  pin.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
});

function updateTooltipPos(e) {
  const rect = mapWrapper.getBoundingClientRect();
  const tw = 210;
  let x = e.clientX - rect.left + 12;
  let y = e.clientY - rect.top  - 80;

  if (x + tw > rect.width) x = e.clientX - rect.left - tw - 12;
  if (y < 0) y = 4;

  tooltip.style.left = x + 'px';
  tooltip.style.top  = y + 'px';
}

/* ---------- Animated stat counters ---------- */
function animateCount(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;

  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(eased * target);

    el.querySelector('.stat-number').innerHTML =
      formatNum(current) + `<span>${suffix}</span>`;

    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

function formatNum(n) {
  return n >= 1000 ? (n / 1000).toFixed(0) : n;
}

const statsSection  = document.getElementById('stats');
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    const cards    = document.querySelectorAll('.stat-card');
    const targets  = [193, 10000, 500, 17];
    const suffixes = ['+', 'K+', '+', ''];

    cards.forEach((card, i) => {
      setTimeout(() => animateCount(card, targets[i], suffixes[i]), i * 100);
    });

    statsObserver.disconnect();
  }
}, { threshold: 0.4 });

statsObserver.observe(statsSection);

/* ---------- Smooth scroll for anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});