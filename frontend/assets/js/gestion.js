/**
 * EcoCampus - Management Script (Connected with Flask & Module C)
 */
(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // Username and theme initialization
  try {
    const savedName = localStorage.getItem('username');
    if (savedName && $('#username')) $('#username').textContent = savedName;
  } catch (e) {}

  const root = document.documentElement;
  const themeButton = $('#theme');
  function setTheme(name) {
    root.setAttribute('data-theme', name);
    root.setAttribute('data-bs-theme', name);
    if (themeButton) themeButton.textContent = name === 'dark' ? '☀︎˚' : '⏾⋆.˚';
    try { localStorage.setItem('theme', name); } catch (e) {}
  }
  if (themeButton) {
    themeButton.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  }
  setTheme(localStorage.getItem('theme') || 'light');

  // Generic API Helper
  async function api(url, options) {
    try {
      const res = await fetch(url, options);
      return await res.json();
    } catch (e) {
      return { error: true, message: e.message };
    }
  }

  // 13 — Add new measure form submission
  const addForm = $('#add');
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        batiment: formData.get('batiment'),
        ressource: formData.get('ressource'),
        valeur: parseFloat(formData.get('valeur')),
        seuil: parseFloat(formData.get('seuil')),
        date: formData.get('date')
      };

      const res = await api('/api/measure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const addo = $('#addo');
      if (res && res.ok) {
        addo.innerHTML = `<div class="alert alert-success">Mesure ajoutée avec succès (ID: ${res.id})</div>`;
        e.target.reset();
      } else {
        addo.innerHTML = `<div class="alert alert-danger">${res.error || 'Erreur lors de l\'ajout.'}</div>`;
      }
    });
  }

  // 14 — Delete measure by ID action
  const btnDel = $('#del');
  if (btnDel) {
    btnDel.addEventListener('click', async () => {
      const idVal = $('#id').value;
      const delo = $('#delo');
      if (!idVal) {
        delo.innerHTML = '<div class="alert alert-warning">Veuillez entrer un ID.</div>';
        return;
      }
      const res = await api('/api/measure/' + idVal, { method: 'DELETE' });
      if (res && res.ok) {
        delo.innerHTML = `<div class="alert alert-success">Mesure ${idVal} supprimée.</div>`;
      } else {
        delo.innerHTML = `<div class="alert alert-danger">${res.error || 'Mesure introuvable.'}</div>`;
      }
    });
  }

  // 15 — Verify compliance form submission
  const verForm = $('#ver');
  if (verForm) {
    verForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        batiment: formData.get('batiment'),
        ressource: formData.get('ressource'),
        valeur: parseFloat(formData.get('valeur')),
        seuil: parseFloat(formData.get('seuil')),
        date: formData.get('date')
      };

      const res = await api('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const vero = $('#vero');
      if (res && res.valid) {
        let alerteText = res.alerte ? ' (Mais attention : Alerte dépassement de seuil !)' : ' (Conforme et sans alerte)';
        vero.innerHTML = `<div class="alert alert-success">Mesure valide.${alerteText}</div>`;
      } else {
        vero.innerHTML = `<div class="alert alert-danger">Mesure non valide ou incorrecte.</div>`;
      }
    });
  }
})();