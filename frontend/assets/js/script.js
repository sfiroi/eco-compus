/**
 * EcoCampus - Main Dashboard Script
 */
(async () => {
  const $  = (sel) => document.querySelector(sel); 
  const $$ = (sel) => document.querySelectorAll(sel);

  async function chargerMesures() {
      try {
          const response = await fetch('/api/data');
          if (!response.ok) throw new Error("Erreur API : " + response.status);
          return await response.json();
      } catch (error) {
          console.error("Erreur Fetch :", error);
          return [];
      }
  }

  const mesures = await chargerMesures();

  // 1. Tableau
  function afficherMesures(dataMesures) {
      const tbody = document.querySelector('table tbody');
      if (!tbody) return;
      tbody.innerHTML = '';

      dataMesures.forEach(m => {
          const tr = document.createElement('tr');
          tr.dataset.name = m.batiment.toLowerCase();
          tr.dataset.resource = m.ressource;

          const batimentKey = 'b_' + m.batiment.toLowerCase().replace(/[^a-z0-9]/g, '_');
          const batimentTraduit = t(batimentKey) !== batimentKey ? t(batimentKey) : m.batiment;
          const ressourceTraduits = t(m.ressource) || m.ressource;
          const statutTexte = m.alerte ? t('s_hi') : t('s_ok');

          tr.innerHTML = `
              <td>${batimentTraduit}</td>
              <td class="num">${m.valeur}<small>${ressourceTraduits}</small></td>
              <td><span class="status" style="--c: ${m.alerte ? 'var(--crit)' : 'var(--good)'}">${statutTexte}</span></td>
          `;
          tbody.appendChild(tr);
      });
  }

  // 2. Alertes
  function afficherAlertes(dataMesures) {
      const container = document.getElementById('alerts');
      if (!container) return;
      const alertes = dataMesures.filter(m => m.alerte === true);
      container.innerHTML = '';

      alertes.forEach(m => {
          const li = document.createElement('li');
          li.style.setProperty('--c', 'var(--crit)');

          const batimentKey = 'b_' + m.batiment.toLowerCase().replace(/[^a-z0-9]/g, '_');
          const batimentTraduit = t(batimentKey) !== batimentKey ? t(batimentKey) : m.batiment;
          const ressourceNom = t(m.ressource) || m.ressource;

          li.innerHTML = `
              <span class="dot"></span>
              <span><strong>${batimentTraduit}</strong> : ${ressourceNom} (${m.valeur} / ${m.seuil})</span>
              <time>${m.date}</time>
          `;
          container.appendChild(li);
      });

      setupAlertsButton(alertes.length);
  }

  function setupAlertsButton(totalAlerts) {
      const countBadge = $('#count');
      const readAllButton = $('#readall');
      const alertItems = $$('#alerts li');
      let allRead = false;

      if (countBadge) countBadge.textContent = allRead ? t('all_read') : t('new_n').replace('{n}', totalAlerts);

      if (readAllButton) {
          const newButton = readAllButton.cloneNode(true);
          readAllButton.parentNode.replaceChild(newButton, readAllButton);
          newButton.textContent = t('readall');

          newButton.addEventListener('click', () => {
              allRead = !allRead;
              alertItems.forEach((li) => li.classList.toggle('read', allRead));
              if (countBadge) countBadge.textContent = allRead ? t('all_read') : t('new_n').replace('{n}', totalAlerts);
              newButton.textContent = allRead ? t('unread') : t('readall');
          });
      }
  }

  // 3. Jauges
  const CENTER = 70, RADIUS = 54;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const FULL_ARC = CIRCUMFERENCE * 0.75;

  function pointOnRing(percent, radius) {
    const angle = (135 + 270 * percent / 100) * Math.PI / 180;
    return {
      x: (CENTER + radius * Math.cos(angle)).toFixed(1),
      y: (CENTER + radius * Math.sin(angle)).toFixed(1),
    };
  }

  function renderGauges() {
      const GAUGES = [
          { name: t('electricite'), resource: 'electricite' },
          { name: t('eau'), resource: 'eau' },
          { name: t('chauffage'), resource: 'chauffage' }
      ].map(g => {
          const mesuresRessource = mesures.filter(m => m.ressource === g.resource);
          const conformes = mesuresRessource.filter(m => Number(m.valeur) <= Number(m.seuil)).length;
          const pourcentage = mesuresRessource.length > 0 ? Math.round((conformes / mesuresRessource.length) * 100) : 0;
          return { name: g.name, value: pourcentage, target: pourcentage };
      });

      const gaugesContainer = $('#gauges');
      if (gaugesContainer) {
          gaugesContainer.innerHTML = GAUGES.map((g, i) => {
              const tickStart = pointOnRing(g.target, RADIUS - 9);
              const tickEnd   = pointOnRing(g.target, RADIUS + 9);
              return `
                <figure class="gauge">
                  <svg viewBox="0 0 140 140">
                    <circle class="g-track" cx="${CENTER}" cy="${CENTER}" r="${RADIUS}" fill="none" stroke-width="10" stroke-linecap="round" transform="rotate(135 ${CENTER} ${CENTER})" stroke-dasharray="${FULL_ARC} ${CIRCUMFERENCE}"/>
                    <circle class="g-val" id="gauge-arc-${i}" cx="${CENTER}" cy="${CENTER}" r="${RADIUS}" fill="none" stroke-width="10" stroke-linecap="round" transform="rotate(135 ${CENTER} ${CENTER})" stroke-dasharray="0 ${CIRCUMFERENCE}"/>
                    <line class="g-tick" x1="${tickStart.x}" y1="${tickStart.y}" x2="${tickEnd.x}" y2="${tickEnd.y}" stroke-width="2.5" stroke-linecap="round"/>
                    <text class="gv" x="${CENTER}" y="80" text-anchor="middle">${g.value}<tspan class="gp">%</tspan></text>
                  </svg>
                  <figcaption><strong>${g.name}</strong></figcaption>
                </figure>`;
          }).join('');

          requestAnimationFrame(() => {
              setTimeout(() => {
                  GAUGES.forEach((g, i) => {
                      const arc = $(`#gauge-arc-${i}`);
                      if (arc) arc.setAttribute('stroke-dasharray', `${FULL_ARC * g.value / 100} ${CIRCUMFERENCE}`);
                  });
              }, 100);
          });
      }
  }

  // 4. Trend Chart (Graphique)
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartHost = $('#chart');
  const MARGIN = { left: 45, right: 45, top: 20, bottom: 30 };
  const visible = { energy: true, water: true, heating: true };

  function extraireDate(date) {
      const parts = date.split('/');
      if (parts.length !== 3) return null;
      return { month: parseInt(parts[0], 10) - 1, year: parseInt(parts[2], 10) };
  }

  const annees = mesures.map(m => extraireDate(m.date)).filter(d => d !== null).map(d => d.year);
  const anneeActuelle = annees.length ? Math.max(...annees) : new Date().getFullYear();

  function renderChart() {
      const RESOURCE_CONFIG = [
          { id: 'energy', name: t('electricite'), resource: 'electricite', color: 'var(--s-energy)' },
          { id: 'water', name: t('eau'), resource: 'eau', color: 'var(--s-water)' },
          { id: 'heating', name: t('chauffage'), resource: 'chauffage', color: 'var(--s-waste)' }
      ];

      const SERIES = RESOURCE_CONFIG.map(config => {
          const monthlyData = Array(12).fill(0);
          mesures.forEach(m => {
              const date = extraireDate(m.date);
              if (date && date.year === anneeActuelle && m.ressource === config.resource) {
                  monthlyData[date.month] += Number(m.valeur);
              }
          });
          return { ...config, data: monthlyData };
      });

      function getChartScale() {
          const values = SERIES.flatMap(s => s.data);
          const maxValue = Math.max(...values, 0);
          const yMax = Math.max(10, Math.ceil(maxValue / 10) * 10);
          const step = yMax / 4;
          return { min: 0, max: yMax, labels: [0, step, step * 2, step * 3, yMax] };
      }

      function drawChart() {
          if (!chartHost) return;
          const width = Math.floor(chartHost.clientWidth);
          if (width < 10) return;
          const isSmall = width < 420;
          const height = isSmall ? 220 : 280;
          const left = MARGIN.left, right = width - MARGIN.right;
          const top = MARGIN.top, bottom = height - MARGIN.bottom;
          const scale = getChartScale();

          const x = i => left + (right - left) * i / (MONTHS.length - 1);
          const y = value => bottom - (bottom - top) * (value - scale.min) / (scale.max - scale.min);
          const px = n => n.toFixed(1);

          let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
          svg += '<g class="ax">';
          scale.labels.forEach(value => {
              svg += `<line class="grid-l" x1="${left}" x2="${right}" y1="${px(y(value))}" y2="${px(y(value))}"/><text x="${left - 8}" y="${px(y(value) + 4)}" text-anchor="end">${value.toFixed(0)}</text>`;
          });
          MONTHS.forEach((month, i) => {
              if (!(isSmall && i % 2 === 1)) {
                  svg += `<text x="${px(x(i))}" y="${height - 6}" text-anchor="middle">${month}</text>`;
              }
          });
          svg += '</g>';

          SERIES.filter(s => visible[s.id]).forEach((s, seriesIndex) => {
              const path = s.data.map((value, i) => `${i === 0 ? 'M' : 'L'}${px(x(i))} ${px(y(value))}`).join(' ');
              const last = s.data.length - 1;
              const area = `${path} L${px(x(last))} ${px(bottom)} L${px(x(0))} ${px(bottom)} Z`;

              svg += `<g class="chart-series" style="--i:${seriesIndex}">`;
              svg += `<path class="chart-area" d="${area}" style="fill:${s.color}" fill-opacity="0.12"/>`;
              svg += `<path class="chart-line" pathLength="1" d="${path}" fill="none" style="stroke:${s.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
              
              s.data.forEach((value, i) => {
                  svg += `<circle class="chart-dot" cx="${px(x(i))}" cy="${px(y(value))}" r="3.5" style="fill:${s.color};stroke:var(--surface);--k:${i}" stroke-width="2"><title>${s.name} - ${MONTHS[i]} : ${value.toFixed(1)}</title></circle>`;
              });
              svg += `<text class="end-v" x="${px(x(last) + 8)}" y="${px(y(s.data[last]) - 8)}">${s.data[last].toFixed(1)}</text>`;
              svg += '</g>';
          });

          chartHost.innerHTML = svg + '</svg>';
      }

      drawChart();

      // Toggles checkboxes under chart
      const togglesContainer = $('#toggles');
      if (togglesContainer) {
          togglesContainer.innerHTML = SERIES.map(s => `
              <label class="chk" style="--c:${s.color}">
                  <input type="checkbox" id="t-${s.id}" data-s="${s.id}" ${visible[s.id] ? 'checked' : ''}>
                  ${s.name}
              </label>
          `).join('');

          $$('#toggles input').forEach(box => {
              box.addEventListener('change', () => {
                  visible[box.dataset.s] = box.checked;
                  drawChart();
              });
          });
      }
  }

  // Initial execution
  afficherMesures(mesures);
  afficherAlertes(mesures);
  renderGauges();
  renderChart();

  if (chartHost && window.ResizeObserver) {
      new ResizeObserver(renderChart).observe(chartHost);
  }

  // Theme toggle
  const root = document.documentElement;
  const themeButton = $('#theme');
  function setTheme(name) {
      root.setAttribute('data-theme', name);
      root.setAttribute('data-bs-theme', name);
      if (themeButton) themeButton.textContent = name === 'dark' ? '☀︎˚࿔' : '⏾⋆.˚';
      try { localStorage.setItem('theme', name); } catch (e) {}
      renderChart();
  }
  if (themeButton) {
      themeButton.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  }
  setTheme(localStorage.getItem('theme') || 'light');

  // Search & Filter
  const searchInput = $('#search-building');
  const resourceSelect = $('#filter-resource'); 
  function filterTable() {
      const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const res = resourceSelect ? resourceSelect.value : '';
      $$('table tbody tr').forEach((row) => {
          const matchSearch = (row.dataset.name || '').includes(term);
          const matchRes = !res || row.dataset.resource === res;
          row.style.display = (matchSearch && matchRes) ? '' : 'none';
      });
  }
  if (searchInput) searchInput.addEventListener('input', filterTable);
  if (resourceSelect) resourceSelect.addEventListener('change', filterTable);

  // **Hetha el 7all**: El function hethi tet3ayet awtomatikiyen ki tenzel aal button mta traduction!
  window.actualiserMesures = () => {
      afficherMesures(mesures);
      afficherAlertes(mesures);
      renderGauges();
      renderChart(); // باش الـ Graph w Toggles يتبدلوا فوراً من غير ما تعمل Reload للبيج!
  };
})();