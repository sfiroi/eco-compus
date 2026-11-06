/**
 * EcoCampus - Measures Script (Connected with Flask & Module C)
 */
(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // Username and theme setup
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

  // API helper function
  async function api(url, options) {
    try {
      const res = await fetch(url, options);
      return await res.json();
    } catch (e) {
      return { error: true, message: e.message };
    }
  }

  let allMeasures = [];

  async function loadData() {
    const data = await api('/api/data');
    if (Array.isArray(data)) {
      allMeasures = data;
      renderTable(allMeasures);
    }
  }

  // Renders rows into the HTML table
  function renderTable(data) {
    const tb = $('#tb');
    if (!tb) return;
    tb.innerHTML = data.map((m) => `
      <tr>
        <td>${m.id}</td>
        <td>${m.batiment}</td>
        <td>${m.ressource}</td>
        <td>${m.valeur}</td>
        <td>${m.seuil}</td>
        <td>${m.date}</td>
        <td><span class="badge ${m.alerte ? 'bg-danger' : 'bg-success'}">${m.alerte ? 'ALERTE' : 'OK'}</span></td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="deleteMeasure(${m.id})">Supprimer</button></td>
      </tr>
    `).join('');
  }

  // Global scope helper for deleting a measure
  window.deleteMeasure = async (id) => {
    const res = await api('/api/measure/' + id, { method: 'DELETE' });
    await loadData();
    const msg = $('#msg');
    if (msg) {
      if (res.ok) {
        msg.innerHTML = '<div class="alert alert-success">Mesure supprimée avec succès.</div>';
      } else {
        msg.innerHTML = `<div class="alert alert-danger">${res.error || 'Erreur lors de la suppression.'}</div>`;
      }
    }
  };

  // Live search input listener
  const q = $('#q');
  if (q) {
    q.addEventListener('input', async () => {
      const val = q.value.trim();
      if (val === '') {
        renderTable(allMeasures);
      } else {
        const res = await api('/api/search?q=' + encodeURIComponent(val));
        if (Array.isArray(res)) renderTable(res);
      }
    });
  }

  // Sorting button listener
  // Sorting button listener
  const btnSort = $('#sort');
  if (btnSort) {
    btnSort.addEventListener('click', async () => {
      const type = $('#sortType').value;
      let endpoint = '/api/sort'; // Default: valeur croissante

      if (type === 'id') {
        endpoint = '/api/sort-id';
      } else if (type === 'id_desc') {
        endpoint = '/api/sort-id-desc';
      }

      // Nsta3mlo POST wela GET 7asab el backend, houni POST kif ma mawjoud f app.py
      const res = await api(endpoint, { method: 'POST' });
      
      if (res && res.data && Array.isArray(res.data)) {
        allMeasures = res.data;
        renderTable(allMeasures);
      } else if (Array.isArray(res)) {
        allMeasures = res;
        renderTable(allMeasures);
      } else {
        const msg = $('#msg');
        if (msg) msg.innerHTML = '<div class="alert alert-danger">Erreur lors du tri des données.</div>';
      }
    });
  }

  // Anomaly check button listener
  const btnAnom = $('#anom');
  if (btnAnom) {
    btnAnom.addEventListener('click', async () => {
      const res = await api('/api/anomalies');
      const msg = $('#msg');
      if (msg) {
        if (res && typeof res.count !== 'undefined') {
          msg.innerHTML = `<div class="alert alert-warning">${res.count} anomalie(s) détectée(s).</div>`;
          if (Array.isArray(res.data)) renderTable(res.data);
        } else {
          msg.innerHTML = `<div class="alert alert-danger">Erreur lors de la récupération des anomalies.</div>`;
        }
      }
    });
  }

  loadData();
})();