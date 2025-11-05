// index.js
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeBtn = document.getElementById('theme-button');

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
    { el: liftSelect,  validator: v => v.trim() !== '',       msg: 'Please choose a favorite lift.' },
  ];

  fields.forEach(({ el }) => {
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('change', () => clearError(el));
  });

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

  
    if (!valid) return;

   
    const li = document.createElement('li');
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const guests = Number(guestsInput.value);
    const lift = liftSelect.value;

    li.textContent = `${name} — ${email} — ${guests} guest(s) — Fav Lift: ${lift}`;
    list.appendChild(li);


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
});

