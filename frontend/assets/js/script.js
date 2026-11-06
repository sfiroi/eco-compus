/**
 * EcoCampus - Main Dashboard Script
 * Handles SVG gauges initialization, dynamic interactive trend charts,
 * alert filters, building search tables, and global theme synchronization.
 */
(async () => {
  // Utility selector helpers
  const $  = (sel) => document.querySelector(sel); 
  const $$ = (sel) => document.querySelectorAll(sel);
  // ====================================
// 1. Récupération des données depuis Python
// ====================================

async function chargerMesures() {
    try {
        const response = await fetch('/api/data');

        if (!response.ok) {
            throw new Error("Erreur API : " + response.status);
        }

        const mesures = await response.json();

        console.log("Mesures récupérées :", mesures);

        return mesures;

    } catch (error) {
        console.error("Erreur Fetch :", error);
        return [];
    }
}


// ====================================
// 2. Affichage des mesures dans le tableau
// ====================================

function afficherMesures(mesures) {

    const tbody = document.querySelector('table tbody');

    if (!tbody) return;

    tbody.innerHTML = '';

    mesures.forEach(m => {

        const tr = document.createElement('tr');

        tr.dataset.name = m.batiment.toLowerCase();
        tr.dataset.resource = m.ressource;

        tr.innerHTML = `
            <td>${m.batiment}</td>

            <td class="num">
                ${m.valeur}
                <small>${m.ressource}</small>
            </td>

            <td>
                <span class="status"
                    style="--c: ${m.alerte ? 'var(--crit)' : 'var(--good)'}">
                    ${m.alerte ? 'Au-dessus' : 'Dans la cible'}
                </span>
            </td>
        `;

        tbody.appendChild(tr);
    });
}


// ====================================
// 3. Affichage des alertes
// ====================================

function afficherAlertes(mesures) {

    const container = document.getElementById('alerts');

    if (!container) return;

    const alertes = mesures.filter(m => m.alerte === true);

    container.innerHTML = '';

    alertes.forEach(m => {

        const li = document.createElement('li');

        li.style.setProperty('--c', 'var(--crit)');

        li.innerHTML = `
            <span class="dot"></span>

            <span>
                ${m.batiment} : ${m.ressource}
                dépasse le seuil (${m.valeur} / ${m.seuil})
            </span>

            <time>${m.date}</time>
        `;

        container.appendChild(li);
    });
}


// ====================================
// 4. Initialisation du Dashboard
// ====================================

const mesures = await chargerMesures();

afficherMesures(mesures);

afficherAlertes(mesures);

  /* =========================================================
     1. CONFIGURATION DATA (Gauges & Trend Chart)
     ========================================================= */
  // Calcul automatique des objectifs depuis les mesures
const GAUGES = [
      {
          name: 'Électricité',
          resource: 'electricite'
      },
      {
          name: 'Eau',
          resource: 'eau'
      },
      {
          name: 'Chauffage',
          resource: 'chauffage'
      }
  ].map(g => {
      // Récupérer les mesures de cette ressource
      const mesuresRessource = mesures.filter(
          m => m.ressource === g.resource
      );

      // Compter les mesures qui respectent le seuil
      const conformes = mesuresRessource.filter(
          m => Number(m.valeur) <= Number(m.seuil)
      ).length;

      // Calculer le pourcentage actuel
      const pourcentage = mesuresRessource.length > 0
          ? Math.round((conformes / mesuresRessource.length) * 100)
          : 0;

      // El target twalli ttbaddal w tkon m3a el pourcentage bdit
      return {
          name: g.name,
          value: pourcentage,
          target: pourcentage // <-- Haka el target ttwalla nafs el pourcentage eli cht5ouha!
      };
});

  /* =========================================================
   DYNAMIC CHART DATA FROM FLASK API
   ========================================================= */

const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec'
];

const RESOURCE_CONFIG = [
    {
        id: 'energy',
        name: 'Électricité',
        resource: 'electricite',
        color: 'var(--s-energy)'
    },
    {
        id: 'water',
        name: 'Eau',
        resource: 'eau',
        color: 'var(--s-water)'
    },
    {
        id: 'heating',
        name: 'Chauffage',
        resource: 'chauffage',
        color: 'var(--s-waste)'
    }
];

// Extract the year and month from the measurement date
function extraireDate(date) {
    const parts = date.split('/');

    if (parts.length !== 3) return null;

    return {
        month: parseInt(parts[0], 10) - 1,
        year: parseInt(parts[2], 10)
    };
}

// Find the most recent year in the measurements
const annees = mesures
    .map(m => extraireDate(m.date))
    .filter(d => d !== null)
    .map(d => d.year);

const anneeActuelle = annees.length
    ? Math.max(...annees)
    : new Date().getFullYear();
const yearElement = $('#chart-year');

if (yearElement) {
    yearElement.textContent = anneeActuelle;
}
// Calculate monthly consumption
const SERIES = RESOURCE_CONFIG.map(config => {

    const monthlyData = Array(12).fill(0);

    mesures.forEach(m => {

        const date = extraireDate(m.date);

        if (
            date &&
            date.year === anneeActuelle &&
            m.ressource === config.resource
        ) {
            monthlyData[date.month] += Number(m.valeur);
        }

    });

    return {
        ...config,
        data: monthlyData
    };

});

  // Initial visibility state for chart lines
  const visible = {
    energy: true,
    water: true,
    heating: true
};

  /* =========================================================
     2. USER PROFILE SYNCHRONIZATION
     ========================================================= */
  /* 2. USER PROFILE SYNCHRONIZATION */

try {
    // Récupérer le nom envoyé depuis PHP
    const params = new URLSearchParams(window.location.search);
    const usernameFromLogin = params.get('username');

    // Mettre à jour le nom sauvegardé
    if (usernameFromLogin) {
        localStorage.setItem('username', usernameFromLogin);

        // Nettoyer l'URL
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );
    }

    // Afficher le nom actuel
    const savedName = localStorage.getItem('username');

    if (savedName && $('#username')) {
        $('#username').textContent = savedName;
    }

} catch (e) {
    console.error("Erreur de synchronisation du profil :", e);
}

  /* =========================================================
     3. SVG GAUGES RENDERING & ANIMATION
     ========================================================= */
  const CENTER = 70, RADIUS = 54;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const FULL_ARC = CIRCUMFERENCE * 0.75;

  // Calculates target indicator tick coordinates on the circular ring
  function pointOnRing(percent, radius) {
    const angle = (135 + 270 * percent / 100) * Math.PI / 180;
    return {
      x: (CENTER + radius * Math.cos(angle)).toFixed(1),
      y: (CENTER + radius * Math.sin(angle)).toFixed(1),
    };
  }

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
          <figcaption><strong>${g.name}</strong><span>Target ${g.target}%</span></figcaption>
        </figure>`;
    }).join('');

    // Trigger smooth fill animation on page load
    requestAnimationFrame(() => {
      setTimeout(() => {
        GAUGES.forEach((g, i) => {
          const arc = $(`#gauge-arc-${i}`);
          if (arc) arc.setAttribute('stroke-dasharray', `${FULL_ARC * g.value / 100} ${CIRCUMFERENCE}`);
        });
      }, 100);
    });
  }


  /* =========================================================
   4. DYNAMIC SVG TREND CHART
   ========================================================= */

const chartHost = $('#chart');

const MARGIN = {
    left: 45,
    right: 45,
    top: 20,
    bottom: 30
};

// Dynamic Y-axis values
function getChartScale() {

    const values = SERIES.flatMap(s => s.data);

    const maxValue = Math.max(...values, 0);

    const yMax = Math.max(10, Math.ceil(maxValue / 10) * 10);

    const step = yMax / 4;

    return {
        min: 0,
        max: yMax,
        labels: [0, step, step * 2, step * 3, yMax]
    };
}

function drawChart() {

    if (!chartHost) return;

    const width = Math.floor(chartHost.clientWidth);

    if (width < 10) return;

    const isSmall = width < 420;

    const height = isSmall ? 220 : 280;

    const left = MARGIN.left;
    const right = width - MARGIN.right;

    const top = MARGIN.top;
    const bottom = height - MARGIN.bottom;

    const scale = getChartScale();

    const x = i =>
        left + (right - left) * i / (MONTHS.length - 1);

    const y = value =>
        bottom - (bottom - top) *
        (value - scale.min) / (scale.max - scale.min);

    const px = n => n.toFixed(1);

    let svg = `
        <svg width="${width}"
             height="${height}"
             viewBox="0 0 ${width} ${height}">
    `;

    // Y-axis and grid
    svg += '<g class="ax">';

    scale.labels.forEach(value => {

        svg += `
            <line
                class="grid-l"
                x1="${left}"
                x2="${right}"
                y1="${px(y(value))}"
                y2="${px(y(value))}"
            />

            <text
                x="${left - 8}"
                y="${px(y(value) + 4)}"
                text-anchor="end"
            >${value.toFixed(0)}</text>
        `;

    });

    // X-axis months
    MONTHS.forEach((month, i) => {

        if (!(isSmall && i % 2 === 1)) {

            svg += `
                <text
                    x="${px(x(i))}"
                    y="${height - 6}"
                    text-anchor="middle"
                >${month}</text>
            `;

        }

    });

    svg += '</g>';

    // Draw resource curves
    SERIES.filter(s => visible[s.id]).forEach(s => {

        const path = s.data.map((value, i) => {

            return `${i === 0 ? 'M' : 'L'}${px(x(i))} ${px(y(value))}`;

        }).join(' ');

        const last = s.data.length - 1;

        svg += `
            <path
                class="chart-line"
                d="${path}"
                fill="none"
                style="stroke:${s.color}"
                stroke-width="2.5"
                stroke-linejoin="round"
                stroke-linecap="round"
            />
        `;

        // Monthly points
        s.data.forEach((value, i) => {

            svg += `
                <circle
                    cx="${px(x(i))}"
                    cy="${px(y(value))}"
                    r="3.5"
                    style="fill:${s.color};stroke:var(--surface)"
                    stroke-width="2"
                />
            `;

        });

        // Last value
        svg += `
            <text
                class="end-v"
                x="${px(x(last) + 8)}"
                y="${px(y(s.data[last]) - 8)}"
            >${s.data[last].toFixed(1)}</text>
        `;

    });

    chartHost.innerHTML = svg + '</svg>';

    // Animate curves
    requestAnimationFrame(() => {

        chartHost.querySelectorAll('.chart-line').forEach(path => {

            const length = path.getTotalLength();

            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;

            path.getBoundingClientRect();

            path.style.transition =
                'stroke-dashoffset 1.4s ease';

            path.style.strokeDashoffset = '0';

        });

    });

}

// Generate resource selection buttons
const togglesContainer = $('#toggles');

if (togglesContainer) {

    togglesContainer.innerHTML = SERIES.map(s => `

        <label class="chk" style="--c:${s.color}">

            <input
                type="checkbox"
                id="t-${s.id}"
                data-s="${s.id}"
                checked
            >

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

// Responsive chart
if (chartHost) {

    if (window.ResizeObserver) {

        new ResizeObserver(drawChart).observe(chartHost);

    } else {

        window.addEventListener('resize', drawChart);

    }

    drawChart();

}

  /* =========================================================
     5. ALERTS MANAGEMENT
     ========================================================= */
  const alertItems = $$('#alerts li');
  const countBadge = $('#count');
  const readAllButton = $('#readall');
  let allRead = false;

  if (readAllButton) {
    readAllButton.addEventListener('click', () => {
      allRead = !allRead;
      alertItems.forEach((li) => li.classList.toggle('read', allRead));
      if (countBadge) countBadge.textContent = allRead ? 'Tous lus' : `${alertItems.length} nouveaux`;
      readAllButton.textContent = allRead ? 'Marquer comme non lu' : 'Tout marquer comme lu';
    });
    if (countBadge) countBadge.textContent = `${alertItems.length} nouveaux`;
  }

  /* =========================================================
     6. GLOBAL THEME TOGGLE (Light / Dark)
     ========================================================= */
  const root = document.documentElement;
  const themeButton = $('#theme');

  function setTheme(name) {
    root.setAttribute('data-theme', name);
    root.setAttribute('data-bs-theme', name);
    if (themeButton) themeButton.textContent = name === 'dark' ? '☀︎˚࿔' : '⏾⋆.˚';
    try { localStorage.setItem('theme', name); } catch (e) {}
    drawChart(); // Redraw chart to match new theme colors
  }

  if (themeButton) {
    themeButton.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  }
  setTheme(localStorage.getItem('theme') || 'light');

  /* =========================================================
     7. BUILDINGS TABLE FILTERING
     ========================================================= */
  const searchInput = $('#search-building');
  const resourceSelect = $('#filter-resource'); 
  const tableRows = $$('table tbody tr');

  function filterTable() {
    const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const res = resourceSelect ? resourceSelect.value : '';
    tableRows.forEach((row) => {
      const matchSearch = (row.dataset.name || '').includes(term);
      const matchRes = !res || row.dataset.resource === res;
      row.style.display = (matchSearch && matchRes) ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterTable);
  if (resourceSelect) resourceSelect.addEventListener('change', filterTable);
})();