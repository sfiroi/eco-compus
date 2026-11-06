/**
 * EcoCampus - Notifications Script
 * Handles theme synchronization and interactive "mark all as read" toggles for notifications.
 */
(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // Username sync
  try {
    const savedName = localStorage.getItem('username');
    if (savedName && $('#username')) $('#username').textContent = savedName;
  } catch (e) {}

  // Theme configuration
  const root = document.documentElement;
  const themeButton = $('#theme');

  function setTheme(name) {
    root.setAttribute('data-theme', name);
    root.setAttribute('data-bs-theme', name);
    if (themeButton) themeButton.textContent = name === 'dark' ? '☀︎˚t' : '⏾⋆.˚';
    try { localStorage.setItem('theme', name); } catch (e) {}
  }

  if (themeButton) {
    themeButton.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  }
  setTheme(localStorage.getItem('theme') || 'light');

  // ---------------------------------------------------------
  // Alertes dynamiques : /api/anomalies -> api.c -> gestion.c
  // (une mesure est une anomalie quand valeur > seuil)
  // ---------------------------------------------------------
  const container = $('#notifications-container');
  const markAllBtn = $('#mark-all-read');
  const CRIT_RATIO = 1.3; // >= 130% du seuil = critique, sinon avertissement
  const REFRESH_MS = 30000;
  const READ_KEY = 'notif_read_ids';
  let allRead = false;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));

  const label = (s) => {
    const t = String(s || '');
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  // Les dates du CSV sont au format MM/JJ/AAAA (cf. date_valide dans gestion.c)
  function parseDate(str) {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(str || '');
    return m ? new Date(+m[3], +m[1] - 1, +m[2]) : null;
  }

  function relativeDate(d) {
    if (!d) return '';
    const days = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (days <= 0) return "Aujourd'hui";
    if (days === 1) return 'Hier';
    if (days < 30) return `Il y a ${days} j`;
    return d.toLocaleDateString('fr-FR');
  }

  function loadReadIds() {
    try { return new Set(JSON.parse(localStorage.getItem(READ_KEY) || '[]')); }
    catch (e) { return new Set(); }
  }

  function saveReadIds(set) {
    try { localStorage.setItem(READ_KEY, JSON.stringify([...set])); } catch (e) {}
  }

  function updateMarkAllLabel() {
    if (markAllBtn) {
      markAllBtn.textContent = allRead ? 'Tout marquer comme non lu' : 'Tout marquer comme lu';
    }
  }

  function render(anomalies) {
    if (!container) return;
    const readIds = loadReadIds();

    if (!anomalies.length) {
      container.innerHTML = '<p class="sub" id="notif-status">Aucune anomalie détectée. 🎉</p>';
      return;
    }

    // Plus récentes d'abord
    const sorted = anomalies.slice().sort((a, b) => {
      const da = parseDate(a.date), db = parseDate(b.date);
      return (db ? db.getTime() : 0) - (da ? da.getTime() : 0);
    });

    container.innerHTML = sorted.map((m) => {
      const ratio = m.seuil > 0 ? m.valeur / m.seuil : 0;
      const pct = Math.round((ratio - 1) * 100);
      const color = ratio >= CRIT_RATIO ? 'var(--crit)' : 'var(--warn)';
      const isRead = readIds.has(m.id);
      return `
        <div class="notif-item${isRead ? ' read' : ''}" data-id="${esc(m.id)}" style="--c: ${color}; cursor: pointer;">
          <div class="notif-content">
            <span class="notif-dot"></span>
            <div class="notif-text">
              <h3>${esc(m.batiment)} : ${esc(label(m.ressource))} au-dessus du seuil</h3>
              <p>Consommation de ${esc(m.valeur)} pour un seuil de ${esc(m.seuil)} (+${pct}%).</p>
            </div>
          </div>
          <span class="notif-time">${esc(relativeDate(parseDate(m.date)) || m.date)}</span>
        </div>`;
    }).join('');

    allRead = $$('.notif-item').length > 0 && [...$$('.notif-item')].every(i => i.classList.contains('read'));
    updateMarkAllLabel();
  }

  async function loadAlerts() {
    if (!container) return;
    try {
      const res = await fetch('/api/anomalies', { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      render(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      // On garde l'affichage actuel lors d'un rafraîchissement raté
      if (!container.querySelector('.notif-item')) {
        container.innerHTML = '<p class="sub" id="notif-status">Impossible de charger les alertes. Vérifiez que le serveur est démarré.</p>';
      }
    }
  }

  // Clic sur une alerte : lue / non lue (mémorisé)
  if (container) {
    container.addEventListener('click', (e) => {
      const item = e.target.closest('.notif-item');
      if (!item) return;
      const id = Number(item.dataset.id);
      const ids = loadReadIds();
      const nowRead = item.classList.toggle('read');
      if (nowRead) ids.add(id); else ids.delete(id);
      saveReadIds(ids);
      allRead = [...$$('.notif-item')].every(i => i.classList.contains('read'));
      updateMarkAllLabel();
    });
  }

  // Bouton "Tout marquer comme lu"
  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      allRead = !allRead;
      const ids = loadReadIds();
      $$('.notif-item').forEach((item) => {
        item.classList.toggle('read', allRead);
        const id = Number(item.dataset.id);
        if (allRead) ids.add(id); else ids.delete(id);
      });
      saveReadIds(ids);
      updateMarkAllLabel();
    });
  }

  loadAlerts();
  setInterval(loadAlerts, REFRESH_MS);
})();