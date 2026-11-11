/* =========================================================
   EcoCampus - ANALYSES.JS   (page "Analyses")

   How this page works, in 4 simple steps:
     1. The page loads ALL measures once from Flask (/api/data).
     2. The lists (buildings, resources) are filled from those measures.
     3. When you click a button, we ask Flask (which runs the C program)
        for the answer: stars, comparison, max / min, average, totals.
     4. We draw the answer nicely: bars, percentages, colors.

   Colors used everywhere:   green  = 80 % of the threshold or less
                             orange = between 80 % and 100 %
                             red    = above the threshold (over 100 %)
   ========================================================= */

(() => {
  "use strict";   // strict mode: JavaScript warns us about common mistakes

  // Short name: $("#id") finds one element of the page
  const $ = (selector) => document.querySelector(selector);

  // ---------------------------------------------------------
  // 1. USER NAME (shown in the sidebar, saved at login)
  // ---------------------------------------------------------
  try {
    const savedName = localStorage.getItem("username");
    if (savedName && $("#username")) $("#username").textContent = savedName;
  } catch (e) {
    console.warn("LocalStorage not available");
  }

  // ---------------------------------------------------------
  // 2. LIGHT / DARK THEME
  // ---------------------------------------------------------
  const root = document.documentElement;
  const themeButton = $("#theme");

  // Applies the theme and remembers it for the other pages
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-bs-theme", theme);
    if (themeButton) themeButton.textContent = theme === "dark" ? "☀︎˚" : "⏾";
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }

  let savedTheme = "light";
  try { savedTheme = localStorage.getItem("theme") || "light"; } catch (e) {}
  setTheme(savedTheme);

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      setTheme((root.getAttribute("data-theme") || "light") === "dark" ? "light" : "dark");
    });
  }

  // ---------------------------------------------------------
  // 3. SMALL HELPERS
  // ---------------------------------------------------------

  // Translate a key (t() comes from i18n.js). {a}, {b}... are replaced by the values in "params".
  const tr = (key, params) => (typeof t === "function" ? t(key, params) : key);

  // Calls the Flask server and returns the JSON answer.
  // It never crashes: if something goes wrong it returns { error: true }.
  async function api(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("HTTP error: " + response.status);
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      return { error: true, message: error.message };
    }
  }

  // Makes text safe before putting it inside HTML (building names come from the data)
  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

  // 12.5 -> "12.50"
  const formatNumber = (value) => Number(value || 0).toFixed(2);

  // "electricite" -> "Électricité" (in the language of the page)
  const formatRes = (resource) => tr(resource);

  // Colors of the three resources (same as the dashboard chart)
  const RES_COLORS = {
    electricite: "var(--s-energy)",
    eau: "var(--s-water)",
    chauffage: "var(--s-waste)"
  };

  // 3 -> "★★★☆☆"
  function getStars(count) {
    count = Math.max(0, Math.min(5, Number(count) || 0));
    return "★".repeat(count) + "☆".repeat(5 - count);
  }

  // ---------------------------------------------------------
  // 4. MEASURES (loaded once) AND PERCENTAGE HELPERS
  // ---------------------------------------------------------

  // All the measures of the project. Filled by loadFilters() below.
  let allData = [];

  // "11/05/2026" (MM/DD/YYYY) -> "2026"
  function yearOf(date) {
    const parts = String(date).split("/");
    return parts.length === 3 ? parts[2] : "";
  }

  // Adds up the value and the threshold of every measure matching the filter.
  // Example: sumFor({ batiment: "Biblio", ressource: "eau", annee: "2026" })
  function sumFor({ batiment, ressource, annee }) {
    let valeur = 0;
    let seuil = 0;
    let count = 0;

    allData.forEach((m) => {
      if (batiment && m.batiment !== batiment) return;
      if (ressource && m.ressource !== ressource) return;
      if (annee && yearOf(m.date) !== String(annee)) return;
      valeur += Number(m.valeur);
      seuil += Number(m.seuil);
      count++;
    });

    return { valeur, seuil, count };
  }

  // value compared to the threshold, in percent:  value 80 and threshold 100 -> 80 %
  // (returns null when we do not know the threshold)
  const percent = (value, seuil) => (seuil > 0 ? (value / seuil) * 100 : null);

  // Chooses the color + the text of the status from a percentage
  function statusOf(pct) {
    if (pct === null) return { color: "var(--muted)", key: "" };
    if (pct <= 80)    return { color: "var(--good)", key: "s_ok" };     // inside the target
    if (pct <= 100)   return { color: "var(--warn)", key: "s_warn" };   // close to the threshold
    return { color: "var(--crit)", key: "s_hi" };                       // above the threshold
  }

  // Small colored label, for example "● Dans la cible"
  const badge = (st) =>
    st.key ? `<span class="badge-s" style="--c:${st.color}">${tr(st.key)}</span>` : "";

  // Progress bar. It goes up to 150 %; the thin mark in the bar is the threshold (100 %).
  // The real width is set later by growMeters() so that the bar grows smoothly.
  function meterHtml(pct, color) {
    const width = pct === null ? 0 : Math.min(pct, 150) / 150 * 100;
    return `<div class="meter" style="--c:${color}"><i data-w="${width.toFixed(1)}"></i></div>`;
  }

  // Makes all bars of a container grow from 0 to their real width
  function growMeters(container) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      container.querySelectorAll(".meter > i").forEach((bar) => {
        bar.style.width = bar.dataset.w + "%";
      });
    }));
  }

  // Shows a short message inside a result area (orange, or red when isError is true)
  function showMsg(out, text, isError) {
    out.innerHTML = `<p class="an-msg${isError ? " err" : ""}">${esc(text)}</p>`;
  }

  // Shows "Loading..." while we wait for the server
  function setLoading(out) {
    out.innerHTML = `<p class="an-hint">${tr("an_loading")}</p>`;
  }

  // ---------------------------------------------------------
  // 5. ANNUAL EVALUATION  (Flask route: /api/evaluation)
  //    The C program gives the stars (1 to 5).
  //    We add the percentage of the threshold with the measures we already have.
  // ---------------------------------------------------------
  const btnEv = $("#ev");

  if (btnEv) {
    btnEv.addEventListener("click", async () => {
      const batiment = $("#eb").value;
      const ressource = $("#er").value;
      const annee = $("#ey").value.trim();
      const out = $("#eo");

      if (!batiment || !annee) return showMsg(out, tr("an_need_eval"));

      setLoading(out);
      const data = await api("/api/evaluation?" + new URLSearchParams({ batiment, ressource, annee }));

      if (data.error) return showMsg(out, tr("an_err"), true);
      if (!data.stars) return showMsg(out, tr("an_no_data"));

      const { valeur, seuil } = sumFor({ batiment, ressource, annee });
      const pct = percent(valeur, seuil);
      const st = statusOf(pct);

      out.innerHTML = `
        <div class="res" style="--c:${st.color}">
          <div class="stars" aria-label="${data.stars} / 5">${getStars(data.stars)}</div>
          <div class="res-title">
            <strong>${data.stars} / 5</strong>
            <span>${tr("an_star" + data.stars)}</span>
          </div>
          ${pct === null ? "" : `
            ${meterHtml(pct, st.color)}
            <div class="meter-row">
              <span><b class="num-anim">${pct.toFixed(1)}%</b> ${tr("an_pct")}</span>
              ${badge(st)}
            </div>
            <p class="res-line">
              ${tr("an_conso")} <strong class="num-anim">${formatNumber(valeur)}</strong>
              · ${tr("an_seuil")} <strong class="num-anim">${formatNumber(seuil)}</strong>
            </p>`}
        </div>`;
      growMeters(out);
    });
  }

  // ---------------------------------------------------------
  // 6. COMPARE TWO BUILDINGS  (Flask route: /api/compare)
  //    For each building we show: consumption, threshold and the
  //    PERCENTAGE between the two (consumption / threshold).
  // ---------------------------------------------------------
  const btnCmp = $("#cmp");

  if (btnCmp) {
    btnCmp.addEventListener("click", async () => {
      const b1 = $("#b1").value;
      const b2 = $("#b2").value;
      const ressource = $("#cr").value;
      const out = $("#co");

      if (!b1 || !b2) return showMsg(out, tr("an_need_two"));
      if (b1 === b2) return showMsg(out, tr("an_need_diff"));

      setLoading(out);
      const data = await api("/api/compare?" + new URLSearchParams({ batiment1: b1, batiment2: b2, ressource }));

      if (data.error) return showMsg(out, tr("an_err"), true);
      if (!data.found1 || !data.found2) return showMsg(out, tr("an_no_data"));

      // Consumption comes from the C program, thresholds from the measures we loaded
      const c1 = Number(data.consommation1);
      const c2 = Number(data.consommation2);
      const s1 = sumFor({ batiment: b1, ressource }).seuil;
      const s2 = sumFor({ batiment: b2, ressource }).seuil;
      const p1 = percent(c1, s1);
      const p2 = percent(c2, s2);

      // 0 = same consumption, 1 = building 1 consumes more, 2 = building 2 consumes more
      const high = c1 > c2 ? 1 : c2 > c1 ? 2 : 0;

      // One building "card": name, consumption / threshold, bar, percentage
      function item(name, c, s, p, isHigh) {
        const st = statusOf(p);
        return `
          <div class="cmp-item${isHigh ? " is-high" : ""}" style="--c:${st.color}">
            <div class="cmp-name" title="${esc(name)}">${esc(name)}</div>
            <div class="cmp-val"><span class="num-anim">${formatNumber(c)}</span><small>/ ${formatNumber(s)}</small></div>
            ${meterHtml(p, st.color)}
            <div class="cmp-pct">${p === null ? "-" : `<span class="num-anim">${p.toFixed(1)}%</span> ${tr("an_pct")}`}</div>
          </div>`;
      }

      // Sentence at the bottom: "Building A uses 23.4% more than Building B."
      let verdict = tr("an_same");
      if (high) {
        const hi = high === 1 ? b1 : b2;
        const lo = high === 1 ? b2 : b1;
        const cHi = high === 1 ? c1 : c2;
        const cLo = high === 1 ? c2 : c1;
        verdict = cLo > 0
          ? tr("an_more", { a: esc(hi), p: (((cHi - cLo) / cLo) * 100).toFixed(1), b: esc(lo) })
          : `${esc(hi)} > ${esc(lo)}`;
      }

      // Gap between the two percentages, in "points" (for example 85 % vs 60 % -> 25 points)
      const gap = p1 !== null && p2 !== null ? tr("an_gap", { p: Math.abs(p1 - p2).toFixed(1) }) : "";

      out.innerHTML = `
        <div class="res">
          <div class="cmp">
            ${item(b1, c1, s1, p1, high === 1)}
            <span class="cmp-vs">VS</span>
            ${item(b2, c2, s2, p2, high === 2)}
          </div>
          <p class="res-line"><strong>${verdict}</strong>${gap ? `<br>${gap}` : ""}</p>
        </div>`;
      growMeters(out);
    });
  }

  // ---------------------------------------------------------
  // 7. MAXIMUM / MINIMUM  (Flask routes: /api/max and /api/min)
  //    Finds the highest (or lowest) measure of a building.
  // ---------------------------------------------------------
  async function fetchMinMax(type) {
    const batiment = $("#mb").value;
    const ressource = $("#mr").value;
    const out = $("#mo");

    if (!batiment) return showMsg(out, tr("an_need_bld"));

    setLoading(out);
    const data = await api(`/api/${type}?` + new URLSearchParams({ batiment, ressource }));

    if (data.error) return showMsg(out, tr("an_err"), true);
    if (!data.found || !data.measure) return showMsg(out, tr("an_no_data"));

    const m = data.measure;
    const pct = percent(Number(m.valeur), Number(m.seuil));
    const st = statusOf(pct);

    out.innerHTML = `
      <div class="res" style="--c:${st.color}">
        <div class="mm-head">
          <span class="mm-type">${tr(type === "max" ? "maximum" : "minimum")}</span>
          <span class="mm-date">${esc(m.date)}</span>
        </div>
        <div class="mm-val num-anim">${formatNumber(m.valeur)}</div>
        <p class="mm-meta">${esc(m.batiment)} · ${esc(formatRes(m.ressource))}</p>
        ${pct === null ? "" : `
          ${meterHtml(pct, st.color)}
          <div class="meter-row">
            <span><b class="num-anim">${pct.toFixed(1)}%</b> ${tr("an_pct")} (${tr("an_seuil")} ${formatNumber(m.seuil)})</span>
            ${badge(st)}
          </div>`}
      </div>`;
    growMeters(out);
  }

  if ($("#mx")) $("#mx").addEventListener("click", () => fetchMinMax("max"));
  if ($("#mn")) $("#mn").addEventListener("click", () => fetchMinMax("min"));

  // ---------------------------------------------------------
  // 8. TOTALS PER RESOURCE  (Flask route: /api/total/<resource>)
  //    Loaded automatically when the page opens.
  //    The bar compares each total with its own total seuil.
  // ---------------------------------------------------------
  async function loadTotals() {
    const box = $("#tot");
    if (!box) return;

    box.textContent = tr("an_loading");

    const list = ["electricite", "eau", "chauffage"];

    // The 3 requests are sent at the same time (faster than one after the other)
    const [measures, ...results] = await Promise.all([
      api("/api/data"),
      ...list.map((r) => api(`/api/total/${r}`)),
    ]);

    if (results.every((d) => d.error)) return showMsg(box, tr("an_err"), true);

    const biggest = Math.max(...results.map((d) => (d.error ? 0 : Number(d.total) || 0)), 1);

    box.innerHTML = list.map((resource, i) => {
      const d = results[i];
      const color = RES_COLORS[resource];
      const total = d.error ? 0 : Number(d.total) || 0;
      // Total seuil = sum of the thresholds of every measure of this resource
      const seuil = Array.isArray(measures)
        ? measures.filter((m) => m.ressource === resource)
                  .reduce((sum, m) => sum + (Number(m.seuil) || 0), 0)
        : null;
      // The bar shows the consumption compared with its own seuil (full bar = seuil reached)
      const width = seuil > 0
        ? Math.min((total / seuil) * 100, 100)
        : (total / biggest) * 100;

      return `
        <div class="tot-row" style="--c:${color}">
          <span class="tot-name">${esc(formatRes(resource))}</span>
          <div class="meter"><i data-w="${width.toFixed(1)}"></i></div>
          <span class="tot-val">${d.error ? "-" : formatNumber(total)}${seuil === null ? "" : ` / ${formatNumber(seuil)}`}</span>
        </div>`;
    }).join("");

    growMeters(box);
  }

  // ---------------------------------------------------------
  // 9. FILL THE LISTS  (Flask route: /api/data)
  //    Buildings and resources come from the real measures.
  // ---------------------------------------------------------

  // Fills one <select>: first an empty "Choose..." option, then one option per value.
  function fillSelect(select, values, i18nKey, labelFn) {
    if (!select) return;

    const previous = select.value;   // remember the current choice
    select.innerHTML = "";

    const first = document.createElement("option");
    first.value = "";
    first.dataset.i18n = i18nKey;    // so the text follows the page language
    first.textContent = tr(i18nKey);
    select.appendChild(first);

    values.forEach((v) => {
      const option = document.createElement("option");
      option.value = v;
      option.textContent = labelFn ? labelFn(v) : v;
      if (labelFn) option.dataset.i18n = v;
      select.appendChild(option);
    });

    if (previous && values.includes(previous)) select.value = previous;
  }

  async function loadFilters() {
    const data = await api("/api/data");

    if (!Array.isArray(data)) {
      console.error("Cannot load the measures.");
      return;
    }

    allData = data;

    // Unique, sorted lists
    const batiments = [...new Set(data.map((m) => m.batiment).filter(Boolean))].sort();
    const ressources = [...new Set(data.map((m) => m.ressource).filter(Boolean))].sort();

    // Every "building" field is a drop-down list (no more typing)
    fillSelect($("#eb"), batiments, "choisir_bld");   // Annual evaluation
    fillSelect($("#b1"), batiments, "batiment_1");    // Comparison
    fillSelect($("#b2"), batiments, "batiment_2");    // Comparison
    fillSelect($("#mb"), batiments, "choisir_bld");   // Max / Min
    fillSelect($("#ab"), batiments, "choisir_bld");   // Annual averages
    fillSelect($("#ar"), ressources, "choisir_res", formatRes);

    // The year fields start with the most recent year found in the data
    const years = data.map((m) => Number(yearOf(m.date))).filter(Boolean);
    if (years.length) {
      const latest = String(Math.max(...years));
      if ($("#ey")) $("#ey").value = latest;
      if ($("#ay")) $("#ay").value = latest;
    }
  }

  // ---------------------------------------------------------
  // 10. ANNUAL AVERAGE  (Flask route: /api/average)
  //     Average value of a building for one resource and one year.
  // ---------------------------------------------------------
  const btnAvg = $("#avg");

  if (btnAvg) {
    btnAvg.addEventListener("click", async () => {
      const batiment = $("#ab").value;
      const ressource = $("#ar").value;
      const annee = $("#ay").value;
      const out = $("#ao");

      if (!batiment || !ressource || !annee) return showMsg(out, tr("an_need_avg"));

      setLoading(out);
      const data = await api("/api/average?" + new URLSearchParams({ batiment, ressource, annee }));

      if (data.error) return showMsg(out, tr("an_err"), true);
      if (!data.found) return showMsg(out, tr("an_no_data"));

      const pct = Number(data.pourcentage || 0);   // already "average / threshold" in percent
      const st = statusOf(pct);

      out.innerHTML = `
        <div class="res" style="--c:${st.color}">
          <p class="avg-head">
            <strong>${esc(batiment)}</strong> · ${esc(formatRes(ressource))} · ${esc(annee)}
          </p>
          <div class="avg-grid">
            <div class="tile">
              <span class="tile-label">${tr("an_avg")}</span>
              <span class="tile-val num-anim">${formatNumber(data.moyenne)}</span>
            </div>
            <div class="tile">
              <span class="tile-label">${tr("an_seuil")} · ${tr("an_status")}</span>
              <span class="tile-val"><span class="num-anim">${pct.toFixed(1)}%</span></span>
              ${meterHtml(pct, st.color)}
              ${badge(st)}
            </div>
            <div class="tile">
              <span class="tile-label">${tr("an_nb")}</span>
              <span class="tile-val num-anim">${data.nombre || 0}</span>
            </div>
          </div>
        </div>`;
      growMeters(out);
    });
  }

  // ---------------------------------------------------------
  // 11. START
  // ---------------------------------------------------------
  loadFilters();
  loadTotals();

  // i18n.js calls this when the language changes: we redraw the totals in the new language
  window.actualiserMesures = loadTotals;
})();
