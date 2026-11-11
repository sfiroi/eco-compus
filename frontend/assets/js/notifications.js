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
    if (themeButton) themeButton.textContent = name === 'dark' ? '☀︎˚' : '⏾⋆.˚';
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
  // Above 130 % of the threshold = red (critical). Otherwise = orange (warning).
  const CRIT_RATIO = 1.3; // >= 130% du seuil = critique, sinon avertissement
  // The list of alerts is refreshed every 30 seconds.
  const REFRESH_MS = 30000;
  // Name under which we remember (in the browser) which alerts were marked as read.
  const READ_KEY = 'notif_read_ids';
  let allRead = false;

  // Safety: makes text harmless before it is put inside HTML.
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));

  // Puts a capital first letter: "eau" -> "Eau".
  const label = (s) => {
    const t = String(s || '');
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  // Les dates du CSV sont au format MM/JJ/AAAA (cf. date_valide dans gestion.c)
  function parseDate(str) {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(str || '');
    return m ? new Date(+m[3], +m[1] - 1, +m[2]) : null;
  }

  // Turns a date into friendly text: "Aujourd'hui", "Hier", "Il y a 5 j"...
  function relativeDate(d) {
    if (!d) return '';
    const days = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (days <= 0) return "Aujourd'hui";
    if (days === 1) return 'Hier';
    if (days < 30) return `Il y a ${days} j`;
    return d.toLocaleDateString('fr-FR');
  }
  function translateBuilding(name) {
    if (!name) return '';
    // Tahwil al-ism al-mawjoud fi al-data ila muftah sghir (lowercase)
    const cleanKey = 'b_' + String(name).trim().toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/\./g, '');
    
    // Idha kan al-muftah mawjud fi t(), ista'milhu, wa illa rji' bil-ism al-asli
    if (typeof t === 'function') {
      const translated = t(cleanKey);
      if (translated !== cleanKey) return translated;
    }
    return name;
  }
  
  // Reads the list of "already read" alert ids from the browser memory.
  function loadReadIds() {
    try { return new Set(JSON.parse(localStorage.getItem(READ_KEY) || '[]')); }
    catch (e) { return new Set(); }
  }

  // Saves that list back into the browser memory.
  function saveReadIds(set) {
    try { localStorage.setItem(READ_KEY, JSON.stringify([...set])); } catch (e) {}
  }

  // Changes the text of the big button ("mark all as read" / "as unread").
  function updateMarkAllLabel() {
  if (markAllBtn) {
    // Tasta3mel fonction t() mta3 l'i18n bech tjib el tarjama s7iha bel lougha el 7aliya
    markAllBtn.textContent = allRead ? t('unread') : t('readall');
  }
}

  // Draws one card per anomaly, newest first. Red when very high, orange otherwise.
 // Tarjamat al-tarikh al-nisbi (Relative Date Translation)
  function relativeDate(d) {
    if (!d) return '';
    const days = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (days <= 0) return t('relative_today');
    if (days === 1) return t('relative_yesterday');
    if (days < 30) return t('relative_days', { days: days });
    return d.toLocaleDateString(document.documentElement.lang === 'ar' ? 'ar-SA' : (document.documentElement.lang === 'en' ? 'en-US' : 'fr-FR'));
  }

  function render(anomalies) {
    if (!container) return;
    const readIds = loadReadIds();

    if (!anomalies.length) {
      container.innerHTML = `<p class="sub" id="notif-status">${t('none_results')} 🎉</p>`;
      return;
    }
    

    const sorted = anomalies.slice().sort((a, b) => {
      const da = parseDate(a.date), db = parseDate(b.date);
      return (db ? db.getTime() : 0) - (da ? da.getTime() : 0);
    });
    
    container.innerHTML = sorted.map((m) => {
      const ratio = m.seuil > 0 ? m.valeur / m.seuil : 0;
      const pct = Math.round((ratio - 1) * 100);
      const color = ratio >= CRIT_RATIO ? 'var(--crit)' : 'var(--warn)';
      const isRead = readIds.has(m.id);
      
      // 1. Déclaration w iste'mal mte' buildingName
      const buildingName = translateBuilding(m.batiment);

      const resKey = 'resource_' + String(m.ressource || '').toLowerCase();
      const resName = typeof t === 'function' && t(resKey) !== resKey ? t(resKey) : label(m.ressource);

      // 2. Houni win "nbread" (sta3melt) el buildingName fi west titleText
      const titleText = t('notif_above', { batiment: esc(buildingName), ressource: esc(resName) });
      const descText = t('notif_desc', { valeur: esc(m.valeur), seuil: esc(m.seuil), pct: pct });
      const timeText = relativeDate(parseDate(m.date)) || m.date;

      return `
        <div class="notif-item${isRead ? ' read' : ''}" data-id="${esc(m.id)}" style="--c: ${color}; cursor: pointer;">
          <div class="notif-content">
            <span class="notif-dot"></span>
            <div class="notif-text">
              <h3>${titleText}</h3>
              <p>${descText}</p>
            </div>
          </div>
          <span class="notif-time">${timeText}</span>
        </div>`;
    }).join('');
    
    allRead = $$('.notif-item').length > 0 && [...$$('.notif-item')].every(i => i.classList.contains('read'));
    updateMarkAllLabel();
  }

  // Asks Flask for the anomalies and draws them. If the server fails, we keep what is already shown.
  async function loadAlerts() {
    if (!container) return;
    try {
      const res = await fetch('/api/anomalies', { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      render(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      if (!container.querySelector('.notif-item')) {
        container.innerHTML = `<p class="sub" id="notif-status">${t('err')}</p>`;
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

  // Start now, then repeat automatically every 30 seconds.
  loadAlerts();
  setInterval(loadAlerts, REFRESH_MS);
  window.chargerAlertesNotifications = loadAlerts;
})();