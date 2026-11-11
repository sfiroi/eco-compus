/**
 * EcoCampus - Script Unifié (API Flask + Internationalisation + Thème + Filtres Avancés)
 */
// Everything is wrapped in a function so our variables stay private (they cannot clash with other scripts).
(() => {
  "use strict";

  // Short names: $("#id") finds ONE element, $$(".class") finds ALL matching elements.
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // mesures = the list of all measures loaded from Flask.
  let mesures = [];
  // afficherAnomalies = true when the "Anomalies seulement" filter is switched on.
  let afficherAnomalies = false;

  // Building names in 3 languages (French / Arabic / English). Used to display AND search buildings.
  const nomsBatiments = {
    "biblio": { fr: "Biblio", ar: "المكتبة", en: "Library" },
    "bibliotheque annexe": { fr: "Bibliothèque annexe", ar: "المكتبة الفرعية", en: "Annex Library" },
    "resto": { fr: "Resto", ar: "المطعم", en: "Cafeteria" },
    "restaurant": { fr: "Restaurant", ar: "المطعم", en: "Restaurant" },
    "dep. info": { fr: "Dep. info", ar: "قسم الإعلامية", en: "IT Department" },
    "dep. mec": { fr: "Dep. mec", ar: "قسم الميكانيك", en: "Mechanical Department" },
    "buvette": { fr: "Buvette", ar: "المشرب", en: "Refreshment Bar" },
    "amphi a": { fr: "Amphi A", ar: "مدرج أ", en: "Lecture Hall A" },
    "amphi b": { fr: "Amphi B", ar: "مدرج ب", en: "Lecture Hall B" },
    "laboratoire": { fr: "Laboratoire", ar: "المخبر", en: "Laboratory" },
    "atelier": { fr: "Atelier", ar: "الورشة", en: "Workshop" },
    "administration": { fr: "Administration", ar: "الإدارة", en: "Administration" },
    "salle info 1": { fr: "Salle info 1", ar: "قاعة الإعلامية 1", en: "Computer Room 1" },
    "internat": { fr: "Internat", ar: "المبيت", en: "Dormitory" },
    "bloc c": { fr: "Bloc C", ar: "الجناح C", en: "Block C" },
    "bloc d": { fr: "Bloc D", ar: "الجناح D", en: "Block D" },
    "salle reunion": { fr: "Salle reunion", ar: "قاعة الاجتماعات", en: "Meeting Room" },
    "gymnase": { fr: "Gymnase", ar: "القاعة الرياضية", en: "Gymnasium" },
    "laboratoire reseau": { fr: "Laboratoire réseau", ar: "مخبر الشبكات", en: "Network Laboratory" }
  };

  // Returns the language chosen on the page: "fr", "ar" or "en".
  const langueCourante = () =>
    (typeof langue !== "undefined" && langue) ||
    localStorage.getItem("langue") || "fr";

  // Gives the translated text of a key (uses t() from i18n.js).
  const traduire = (key) =>
    typeof t === "function" ? t(key) : key;

  // Returns the building name in the current language (or the original name if there is no translation).
  const texteBatiment = (nom) => {
    const item = nomsBatiments[String(nom).trim().toLowerCase()];
    return item ? (item[langueCourante()] || item.fr) : nom;
  };

  // Returns the resource name (électricité / eau / chauffage) in the current language.
  const texteRessource = (ressource) => {
    const cle = {
      electricite: "resource_electricite",
      eau: "resource_eau",
      chauffage: "resource_chauffage"
    }[String(ressource).trim().toLowerCase()];
    return cle ? traduire(cle) : ressource;
  };

  // Makes text easy to compare: removes accents and capitals, so "Électricité" matches "electricite".
  const normaliser = (v) => String(v ?? "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

  try {
    // Show the logged-in user name in the sidebar (it was saved at login).
    const savedName = localStorage.getItem('username');
    if (savedName && $('#username')) $('#username').textContent = savedName;
  } catch (e) {}

  // ---- Light / dark theme ----
  const root = document.documentElement;
  const themeButton = $('#theme');
  // Applies the theme (light or dark) and remembers the choice for the next page.
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

  // Small helper to call the Flask server. It never crashes: on an error it returns { error: true }.
  async function api(url, options) {
    try {
      const res = await fetch(url, options);
      return await res.json();
    } catch (e) {
      return { error: true, message: e.message };
    }
  }

  // Chargement initial des données depuis Flask
  async function chargerDonnees() {
    const data = await api('/api/data');
    if (Array.isArray(data)) {
      mesures = data;
      afficherMesures();
    } else {
      const tbody = document.getElementById("tb");
      if (tbody) tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">${traduire("load_error")}</td></tr>`;
    }
  }

  // Fonction pour exécuter le tri via le Backend Python/C (Flask)
  // Sorts the measures with the C program (through Flask).
  // It is called ONLY when the user clicks the "Trier" button (not when the sort list changes).
  async function executerTriBackend() {
    const typeTri = document.getElementById("sortType")?.value || "valeur";
    let endpoint = '/api/sort'; // par défaut valeur croissante

    if (typeTri === "id") {
      endpoint = '/api/sort-id';
    } else if (typeTri === "id_desc") {
      endpoint = '/api/sort-id-desc';
    }

    const res = await api(endpoint, { method: 'POST' });
    if (Array.isArray(res)) {
      mesures = res;
      afficherMesures();
    } else {
      // Si le backend renvoie une erreur ou format inattendu, on recharge les données normales
      await chargerDonnees();
    }
  }

  // Returns only the measures that match the search box, the resource filter and the "anomalies only" button.
  function obtenirMesuresFiltrees() {
    const recherche = normaliser(document.getElementById("q")?.value || "");
    const ressourceFilter = document.getElementById("resourceFilter")?.value || "all";

    let resultat = mesures.filter(m => {
      const batimentTraduit = texteBatiment(m.batiment);
      const ressourceTraduit = texteRessource(m.ressource);
      
      const correspondRecherche = !recherche ||
        normaliser(m.id).includes(recherche) ||
        normaliser(m.batiment).includes(recherche) ||
        normaliser(batimentTraduit).includes(recherche) ||
        normaliser(m.ressource).includes(recherche) ||
        normaliser(ressourceTraduit).includes(recherche) ||
        normaliser(m.date).includes(recherche);

      const correspondRessource = ressourceFilter === "all" || m.ressource === ressourceFilter;
      const correspondAnomalie = !afficherAnomalies || m.alerte;

      return correspondRecherche && correspondRessource && correspondAnomalie;
    });

    return resultat;
  }

  // Draws the table (one row per measure) and updates the counter under the table.
  function afficherMesures() {
    const tbody = document.getElementById("tb");
    if (!tbody) return;

    const mesuresAffichees = obtenirMesuresFiltrees();

    if (mesuresAffichees.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">${traduire("none")}</td></tr>`;
      mettreAJourCompteur(0, mesures.length);
      return;
    }

    tbody.innerHTML = mesuresAffichees.map(m => `
      <tr>
        <td>${m.id}</td>
        <td>${echapper(texteBatiment(m.batiment))}</td>
        <td>${echapper(texteRessource(m.ressource))}</td>
        <td>${m.valeur}</td>
        <td>${m.seuil}</td>
        <td>${echapper(m.date)}</td>
        <td><span class="badge ${m.alerte ? "bg-danger" : "bg-success"}">${m.alerte ? traduire("st_alert") : traduire("st_norm")}</span></td>
        <td><button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteMeasure(${m.id})">${traduire("delete")}</button></td>
      </tr>
    `).join("");

    mettreAJourCompteur(mesuresAffichees.length, mesures.length);
  }

  // Updates the text under the table, for example "12 measures displayed out of 40".
  function mettreAJourCompteur(n, total) {
    const el = document.getElementById("measure-count");
    if (el) el.textContent = traduire("count").replace("{n}", n).replace("{t}", total);
  }

  // Safety: turns special characters (< > & quotes) into harmless text so data can never inject HTML into the page.
  function echapper(v) {
    return String(v).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  // Called by the red "Supprimer" button of each row: asks for confirmation, then deletes the measure.
  window.deleteMeasure = async (id) => {
    if (!confirm(traduire("confirm_delete"))) return;
    const res = await api('/api/measure/' + id, { method: 'DELETE' });
    const msg = $('#msg');
    if (msg) {
      if (res.ok) {
        msg.innerHTML = '<div class="alert alert-success">Mesure supprimée avec succès.</div>';
        await chargerDonnees();
      } else {
        msg.innerHTML = `<div class="alert alert-danger">${res.error || 'Erreur lors de la suppression.'}</div>`;
      }
    }
  };

  // When the page is ready: connect the search box, the filters and the buttons.
  document.addEventListener("DOMContentLoaded", () => {
    // Typing in the search box, or changing the resource filter, updates the table immediately.
    document.getElementById("q")?.addEventListener("input", afficherMesures);
    document.getElementById("resourceFilter")?.addEventListener("change", afficherMesures);
    

    // The sort is applied ONLY when the user clicks "Trier".
    const btnSort = $('#sort');
    if (btnSort) {
      btnSort.addEventListener("click", executerTriHeader);
    }

    // Sorts, then shows a small success message for 3 seconds.
    async function executerTriHeader() {
      await executerTriBackend();
      const msg = $('#msg');
      if(msg) {
        msg.innerHTML = '<div class="alert alert-success py-1 mb-2">Tri effectué avec succès via le backend.</div>';
        setTimeout(() => { msg.innerHTML = ''; }, 3000);
      }
    }

    // "Anomalies seulement" button: switches the filter on / off.
    const btnAnom = $('#anom');
    if (btnAnom) {
      btnAnom.addEventListener('click', (e) => {
        afficherAnomalies = !afficherAnomalies;
        e.currentTarget.classList.toggle("active", afficherAnomalies);
        afficherMesures();
      });
    }

    // Finally: load the measures from the server.
    chargerDonnees();
  });

  // Lets i18n.js redraw the table when the language changes.
  window.actualiserMesures = afficherMesures;
})();