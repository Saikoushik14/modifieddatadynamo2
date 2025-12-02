// ===== Smooth scroll for internal links =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Register / apply buttons scroll or open
const regScrollBtn = document.getElementById('register-scroll');
const applyTeamBtn = document.getElementById('apply-team');
const registerOpenBtns = document.querySelectorAll('.register-btn, #apply-team, #register-scroll');

registerOpenBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const regEl = document.getElementById('register');
    if (regEl) {
      regEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// If a direct registration link button is clicked (in the original single-file it opened forms.gle)
document.querySelectorAll('.register-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    window.open('https://forms.gle/jmQy37MxzVzES8AG8', '_blank');
  });
});

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ===== Stat counters =====
const counterEls = document.querySelectorAll('[data-count]');
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;

  counterEls.forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    let current = 0;
    const isMoney = target > 5000;

    const step = () => {
      const increment = Math.max(1, Math.floor(target / 80));
      current += increment;
      if (current >= target) current = target;

      if (isMoney) {
        el.textContent = '₹' + current.toLocaleString('en-IN');
      } else {
        el.textContent = current.toLocaleString('en-IN') + '+';
      }

      if (current < target) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

const statsSection = document.getElementById('about');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

if (statsSection) statsObserver.observe(statsSection);

// ===== FAQ accordion =====
document.querySelectorAll('#faq-list .faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const open = item.classList.contains('open');
    document.querySelectorAll('#faq-list .faq-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

// ===== Countdown timer (event start date) =====
// eventDate uses IST offset (UTC+5:30)
const eventDate = new Date('2026-01-30T09:00:00+05:30').getTime();
const cdContainer = document.getElementById('countdown');
const timebarFill = document.getElementById('timebar-fill');
const timebarLabel = document.getElementById('timebar-label');
const initialDiff = Math.max(eventDate - Date.now(), 1);

function updateCountdown() {
  const now = Date.now();
  const diff = eventDate - now;

  const units = {
    days: cdContainer.querySelector('[data-unit="days"]'),
    hours: cdContainer.querySelector('[data-unit="hours"]'),
    minutes: cdContainer.querySelector('[data-unit="minutes"]'),
    seconds: cdContainer.querySelector('[data-unit="seconds"]')
  };

  if (diff <= 0) {
    units.days.textContent = '00';
    units.hours.textContent = '00';
    units.minutes.textContent = '00';
    units.seconds.textContent = '00';
    if (timebarFill) timebarFill.style.width = '0%';
    if (timebarLabel) timebarLabel.textContent = 'Hackathon started';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  units.days.textContent = String(days).padStart(2, '0');
  units.hours.textContent = String(hours).padStart(2, '0');
  units.minutes.textContent = String(minutes).padStart(2, '0');
  units.seconds.textContent = String(seconds).padStart(2, '0');

  if (timebarLabel) timebarLabel.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

  if (timebarFill) {
    const remainingRatio = diff / initialDiff;
    const widthPercent = Math.max(0, Math.min(100, remainingRatio * 100));
    timebarFill.style.width = widthPercent + '%';
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== Custom cursor logic (desktop only) =====
(function () {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (!cursorDot || !cursorRing) return;

  const isCoarsePointer =
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
    'ontouchstart' in window;

  if (isCoarsePointer) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateRing() {
    const speed = 0.16;
    ringX += (mouseX - ringX) * speed;
    ringY += (mouseY - ringY) * speed;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = document.querySelectorAll('a, button, .track-card, .primary-btn, .secondary-link');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
  });

  window.addEventListener('mousedown', () => cursorRing.classList.add('cursor-down'));
  window.addEventListener('mouseup', () => cursorRing.classList.remove('cursor-down'));
})();
