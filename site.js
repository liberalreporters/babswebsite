(() => {
  'use strict';
  document.querySelectorAll('[data-current-year]').forEach(n => n.textContent = String(new Date().getFullYear()));
  document.querySelectorAll('[data-menu-toggle]').forEach(button => {
    const target = document.getElementById(button.getAttribute('aria-controls'));
    if (!target) return;
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      target.hidden = expanded;
    });
  });
  document.querySelectorAll('form[data-demo-form]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    const message = form.querySelector('[data-form-message]');
    if (message) { message.textContent = 'This sample form is not connected. Configure a secure form endpoint before collecting submissions.'; message.setAttribute('role','status'); }
  }));
})();
