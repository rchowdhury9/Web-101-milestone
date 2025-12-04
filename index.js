// index.js
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeBtn = document.getElementById('theme-button');

  // THEME TOGGLE ---------------------------------
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    updateThemeButton(false);
  } else {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
    updateThemeButton(true);
  }

  themeBtn.addEventListener('click', () => {
    const isDark = body.classList.contains('dark-mode');
    if (isDark) {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      updateThemeButton(false);
    } else {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      updateThemeButton(true);
    }
  });

  function updateThemeButton(isDark) {
    themeBtn.setAttribute('aria-pressed', String(isDark));
    themeBtn.textContent = isDark ? 'Dark Mode: ON' : 'Dark Mode: OFF';
  }

  // RSVP FORM + VALIDATION -----------------------
  const form = document.getElementById('rsvp-form');
  const list = document.getElementById('rsvp-list');

  const nameInput = document.getElementById('rsvp-name');
  const emailInput = document.getElementById('rsvp-email');
  const guestsInput = document.getElementById('rsvp-guests');
  const liftSelect = document.getElementById('rsvp-lift');

  const fields = [
    { el: nameInput,   validator: v => v.trim().length >= 2,  msg: 'Please enter your full name.' },
    { el: emailInput,  validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Enter a valid email (e.g., you@example.com).' },
    { el: guestsInput, validator: v => Number(v) >= 1,        msg: 'Guests must be at least 1.' },
    { el: liftSelect,  validator: v => v.trim() !== '',       msg: 'Please choose a favorite lift.' }
  ];

  fields.forEach(({ el }) => {
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('change', () => clearError(el));
  });

  // MODAL ELEMENTS --------------------------------
  const modalOverlay = document.getElementById('modal-overlay');
  const modalName = document.getElementById('modal-name');
  const modalMessage = document.getElementById('modal-message');
  let modalTimeoutId = null;

  function showModal(name, guests, lift) {
    // personalized message
    modalName.textContent = name || 'Lifter';

    const liftNice = {
      'deadlift': 'Deadlift',
      'bench-press': 'Bench Press',
      'weighted-pullup': 'Weighted Pull Up'
    }[lift] || 'lifting';

    modalMessage.textContent = `${guests} spot(s) locked in. See you at the ${liftNice} mayhem!`;

    // reset any previous timer
    if (modalTimeoutId !== null) {
      clearTimeout(modalTimeoutId);
    }

    modalOverlay.classList.remove('hidden');
    // force reflow so transition always triggers
    void modalOverlay.offsetWidth;
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');

    // Auto-hide after a few seconds (no user input required)
    modalTimeoutId = setTimeout(hideModal, 3500);
  }

  function hideModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      modalOverlay.classList.add('hidden');
    }, 300); // matches CSS transition duration
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    fields.forEach(({ el, validator, msg }) => {
      const value = el.value || '';
      if (!validator(value)) {
        showError(el, msg);
        valid = false;
      } else {
        clearError(el);
      }
    });

    // If invalid, DO NOT show modal
    if (!valid) return;

    // Valid RSVP -> update list AND show modal
    const li = document.createElement('li');
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const guests = Number(guestsInput.value);
    const lift = liftSelect.value;

    li.textContent = `${name} — ${email} — ${guests} guest(s) — Fav Lift: ${lift}`;
    list.appendChild(li);

    // show personalized modal (rubric requirement)
    showModal(name, guests, lift);

    // reset form
    form.reset();
    guestsInput.value = 1;
  });

  function showError(el, message) {
    el.classList.add('invalid');
    el.setAttribute('aria-invalid', 'true');
    const msgNode = el.parentElement.querySelector('.error-text');
    if (msgNode) msgNode.textContent = message;
  }

  function clearError(el) {
    el.classList.remove('invalid');
    el.removeAttribute('aria-invalid');
    const msgNode = el.parentElement.querySelector('.error-text');
    if (msgNode) msgNode.textContent = '';
  }

  // SCROLL ANIMATIONS FOR SECTIONS ----------------
  const animatedSections = document.querySelectorAll('.anim-section');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // fade in + move up
            entry.target.classList.add('in-view');
          } else {
            // remove when scrolling away so animation can repeat
            entry.target.classList.remove('in-view');
          }
        });
      },
      {
        threshold: 0.2
      }
    );

    animatedSections.forEach(sec => observer.observe(sec));
  } else {
    // Fallback: just show all sections if IntersectionObserver not supported
    animatedSections.forEach(sec => sec.classList.add('in-view'));
  }
});