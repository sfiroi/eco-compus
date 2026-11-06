/**
 * EcoCampus - Script Unifié (API Flask + Internationalisation + Thème + Filtres Avancés)
 */
(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  let mesures = [];
  let afficherAnomalies = false;

  // Dictionnaire des bâtiments (hérité de mesures.js)
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

  const langueCourante = () =>
    (typeof langue !== "undefined" && langue) ||
    localStorage.getItem("langue") || "fr";

  const traduire = (key) =>
    typeof t === "function" ? t(key) : key;

  const texteBatiment = (nom) => {
    const item = nomsBatiments[String(nom).trim().toLowerCase()];
    return item ? (item[langueCourante()] || item.fr) : nom;
  };

  const texteRessource = (ressource) => {
    const cle = {
      electricite: "resource_electricite",
      eau: "resource_eau",
      chauffage: "resource_chauffage"
    }[String(ressource).trim().toLowerCase()];
    return cle ? traduire(cle) : ressource;
  };

  const normaliser = (v) => String(v ?? "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

  // Configuration du nom d'utilisateur et du thème (provenant de mesures_2.js)
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

  // Helper API Flask
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

  // Logique de filtrage et tri combinée (Frontend + Internationalisation)
  function obtenirMesuresFiltrees() {
    const recherche = normaliser(document.getElementById("q")?.value || "");
    const ressourceFilter = document.getElementById("resourceFilter")?.value || "all";
    const typeTri = document.getElementById("sortType")?.value || "valeur";

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

    if (typeTri === "id") resultat.sort((a, b) => a.id - b.id);
    else if (typeTri === "id_desc") resultat.sort((a, b) => b.id - a.id);
    else resultat.sort((a, b) => a.valeur - b.valeur);

    return resultat;
  }

  // Affichage du tableau et mise à jour du compteur
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

  function mettreAJourCompteur(n, total) {
    const el = document.getElementById("measure-count");
    if (el) el.textContent = traduire("count").replace("{n}", n).replace("{t}", total);
  }

  function echapper(v) {
    return String(v).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  // Suppression connectée à l'API Flask
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

  // Écouteurs d'événements
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("q")?.addEventListener("input", afficherMesures);
    document.getElementById("resourceFilter")?.addEventListener("change", afficherMesures);
    document.getElementById("sortType")?.addEventListener("change", afficherMesures);

    const btnSort = $('#sort');
    if (btnSort) {
      btnSort.addEventListener("click", afficherMesures);
    }

    const btnAnom = $('#anom');
    if (btnAnom) {
      btnAnom.addEventListener('click', (e) => {
        afficherAnomalies = !afficherAnomalies;
        e.currentTarget.classList.toggle("active", afficherAnomalies);
        afficherMesures();
      });
    }

    const btnReset = $('#resetFilters');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if ($("#q")) $("#q").value = "";
        if ($("#resourceFilter")) $("#resourceFilter").value = "all";
        if ($("#sortType")) $("#sortType").value = "valeur";
        afficherAnomalies = false;
        if ($("#anom")) $("#anom").classList.remove("active");
        afficherMesures();
      });
    }

    chargerDonnees();
  });

  // Support externe pour le changement de langue
  window.actualiserMesures = afficherMesures;
})();