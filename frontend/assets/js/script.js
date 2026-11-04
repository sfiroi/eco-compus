(() => {
  const $  = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // Gauges: value and target, in percent
  const GAUGES = [
    { name: 'Taux de recyclage',   value: 64, target: 70 },
    { name: 'Énergie renouvelable', value: 48, target: 60 },
    { name: 'Eau réutilisée',     value: 31, target: 40 },
];

  // Chart
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const SERIES = [
    { id: 'energy', name: 'Électricité', color: 'var(--s-energy)', data: [103, 101, 98, 96, 93, 94, 90, 88, 85, 82] },
    { id: 'water',  name: 'Eau',        color: 'var(--s-water)',  data: [100, 104, 99, 97, 98, 94, 96, 92, 90, 88] },
    { id: 'waste',  name: 'Déchets',    color: 'var(--s-waste)',  data: [108, 106, 105, 101, 102, 99, 98, 97, 95, 94] },
  ];

  const VIEWS = {
    dashboard: { title: 'Dashboard', series: ['energy', 'water', 'waste'] },
    energy:    { title: 'Energy',    series: ['energy'] },
    water:     { title: 'Water',     series: ['water'] },
    waste:     { title: 'Waste',     series: ['waste'] },
  };

  try {
    const savedName = localStorage.getItem('username');
    if (savedName) $('#username').textContent = savedName;
  } catch (e) {}

  const CENTER = 70;
  const RADIUS = 54;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const FULL_ARC = CIRCUMFERENCE * 0.75;

  function pointOnRing(percent, radius) {
    const angle = (135 + 270 * percent / 100) * Math.PI / 180;
    return {
      x: (CENTER + radius * Math.cos(angle)).toFixed(1),
      y: (CENTER + radius * Math.sin(angle)).toFixed(1),
    };
  }

  function ringHTML(cssClass, arcLength) {
    return `<circle class="${cssClass}" cx="${CENTER}" cy="${CENTER}" r="${RADIUS}" fill="none"
              stroke-width="10" stroke-linecap="round" transform="rotate(135 ${CENTER} ${CENTER})"
              stroke-dasharray="${arcLength} ${CIRCUMFERENCE}"/>`;
  }

  function gaugeHTML({ name, value, target }) {
    const tickStart = pointOnRing(target, RADIUS - 9);
    const tickEnd   = pointOnRing(target, RADIUS + 9);
    return `
      <figure class="gauge">
        <svg viewBox="0 0 140 140" role="img" aria-label="${name} ${value} percent, target ${target} percent">
          ${ringHTML('g-track', FULL_ARC)}
          ${ringHTML('g-val', FULL_ARC * value / 100)}
          <line class="g-tick" x1="${tickStart.x}" y1="${tickStart.y}" x2="${tickEnd.x}" y2="${tickEnd.y}"
                stroke-width="2.5" stroke-linecap="round"/>
          <text class="gv" x="${CENTER}" y="80" text-anchor="middle">${value}<tspan class="gp">%</tspan></text>
        </svg>
        <figcaption><strong>${name}</strong><span>Target ${target}%</span></figcaption>
      </figure>`;
  }

  if ($('#gauges')) {
    $('#gauges').innerHTML = GAUGES.map(gaugeHTML).join('');
  }

  const chartHost = $('#chart');
  const Y_MIN = 75, Y_MAX = 110;
  const Y_LABELS = [80, 90, 100, 110];
  const MARGIN = { left: 34, right: 40, top: 14, bottom: 26 };
  const visible = { energy: true, water: true, waste: true };

  function drawChart() {
    if (!chartHost) return;
    const width = Math.floor(chartHost.clientWidth);
    if (width < 10) return;

    const isSmall = width < 420;
    const height = isSmall ? 220 : 280;
    const left = MARGIN.left, right = width - MARGIN.right;
    const top = MARGIN.top,   bottom = height - MARGIN.bottom;

    const x = (i) => left + (right - left) * i / (MONTHS.length - 1);
    const y = (v) => bottom - (bottom - top) * (v - Y_MIN) / (Y_MAX - Y_MIN);
    const px = (n) => n.toFixed(1);

    const shown = SERIES.filter((s) => visible[s.id]);
    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">`;

    svg += '<g class="ax">';
    Y_LABELS.forEach((v) => {
      svg += `<line class="${v === 100 ? 'base' : 'grid-l'}" x1="${left}" x2="${right}" y1="${px(y(v))}" y2="${px(y(v))}"/>`;
      svg += `<text x="${left - 8}" y="${px(y(v) + 4)}" text-anchor="end">${v}</text>`;
    });

    MONTHS.forEach((month, i) => {
      if (isSmall && i % 2 === 1) return;
      svg += `<text x="${px(x(i))}" y="${height - 6}" text-anchor="middle">${month}</text>`;
    });
    svg += '</g>';

    shown.forEach((s) => {
      const path = s.data.map((v, i) => `${i ? 'L' : 'M'}${px(x(i))} ${px(y(v))}`).join(' ');
      const last = s.data.length - 1;
      svg += `<path d="${path}" fill="none" style="stroke:${s.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
      svg += `<circle cx="${px(x(last))}" cy="${px(y(s.data[last]))}" r="4.5" style="fill:${s.color};stroke:var(--surface)" stroke-width="2"/>`;
      svg += `<text class="end-v" x="${px(x(last) + 10)}" y="${px(y(s.data[last]) + 4)}">${s.data[last]}</text>`;
    });

    chartHost.innerHTML = svg + '</svg>';
  }

  if ($('#toggles')) {
    $('#toggles').innerHTML = SERIES.map((s) => `
      <label class="chk" style="--c: ${s.color}">
        <input type="checkbox" id="t-${s.id}" data-s="${s.id}" checked>${s.name}
      </label>`).join('');

    $$('#toggles input').forEach((box) => {
      box.addEventListener('change', () => {
        visible[box.dataset.s] = box.checked;
        drawChart();
      });
    });
  }

  function showSeries(ids) {
    SERIES.forEach((s) => {
      visible[s.id] = ids.includes(s.id);
      if ($('#t-' + s.id)) $('#t-' + s.id).checked = visible[s.id];
    });
    drawChart();
  }

  if (chartHost) {
    if (window.ResizeObserver) new ResizeObserver(drawChart).observe(chartHost);
    else window.addEventListener('resize', drawChart);
    drawChart();
  }

  $$('#nav a[data-view]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const view = VIEWS[link.dataset.view];
      $$('#nav a').forEach((a) => a.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'page');
      if ($('#title')) $('#title').textContent = view.title;
      showSeries(view.series);
    });
  });

  const alertItems = $$('#alerts li');
  const countBadge = $('#count');
  const readAllButton = $('#readall');
  let allRead = false;

  function updateAlerts() {
    if (!readAllButton) return;
    alertItems.forEach((li) => li.classList.toggle('read', allRead));
    if (countBadge) countBadge.textContent = allRead ? 'Tous lus' : `${alertItems.length} nouveaux`;
    readAllButton.textContent = allRead ? 'Marquer comme non lu' : 'Tout marquer comme lu';
  }

  if (readAllButton) {
    readAllButton.addEventListener('click', () => {
      allRead = !allRead;
      updateAlerts();
    });
    updateAlerts();
  }

  const root = document.documentElement;
  const themeButton = $('#theme');

  function isDark() {
    const chosen = root.getAttribute('data-theme');
    return chosen ? chosen === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function setTheme(name) {
    root.setAttribute('data-theme', name);
    root.setAttribute('data-bs-theme', name);
    if (themeButton) themeButton.textContent = name === 'dark' ? '☀︎˚࿔' : '⏾⋆.˚';
    drawChart();
  }

  if (themeButton) {
    themeButton.addEventListener('click', () => setTheme(isDark() ? 'light' : 'dark'));
    setTheme(isDark() ? 'dark' : 'light');
  }
})();