
/* =========================================
   EcoCampus - ANALYSES.JS
   Connexion HTML -> JavaScript -> Flask
   ========================================= */

(() => {
  const $ = (selector) => document.querySelector(selector);

  // -----------------------------
  // 1. Username
  // -----------------------------
  try {
    const savedName = localStorage.getItem("username");
    if (savedName && $("#username")) {
      $("#username").textContent = savedName;
    }
  } catch (e) {
    console.warn("LocalStorage indisponible");
  }

  // -----------------------------
  // 2. Theme clair / sombre
  // -----------------------------
  const root = document.documentElement;
  const themeButton = $("#theme");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-bs-theme", theme);

    if (themeButton) {
      themeButton.textContent =
        theme === "dark" ? "☀︎˚" : "⏾";
    }

    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }

  let savedTheme = "light";

  try {
    savedTheme = localStorage.getItem("theme") || "light";
  } catch (e) {}

  setTheme(savedTheme);

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const current =
        root.getAttribute("data-theme") || "light";

      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // -----------------------------
  // 3. Fonction de communication
  // avec Flask
  // -----------------------------
  async function api(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erreur HTTP : " + response.status);
      }

      return await response.json();

    } catch (error) {
      console.error("Erreur API :", error);

      return {
        error: true,
        message: error.message
      };
    }
  }

  // -----------------------------
  // 4. Ressources
  // -----------------------------
  const resourceMap = {
    electricite: "Électricité",
    eau: "Eau",
    chauffage: "Chauffage"
  };

  function formatRes(resource) {
    return resourceMap[resource] || resource;
  }

  function formatNumber(value) {
    return Number(value || 0).toFixed(2);
  }

  function getStars(count) {
    count = Math.max(0, Math.min(5, Number(count) || 0));
    return "★".repeat(count) + "☆".repeat(5 - count);
  }

  // -----------------------------
  // 5. ÉVALUATION ANNUELLE
  // Route Flask : /api/evaluation
  // -----------------------------
  const btnEv = $("#ev");

  if (btnEv) {
    btnEv.addEventListener("click", async () => {
      const batiment = $("#eb").value.trim();
      const ressource = $("#er").value;
      const annee = $("#ey").value.trim();
      const output = $("#eo");

      if (!batiment || !annee) {
        output.textContent =
          "Veuillez saisir le bâtiment et l'année.";
        return;
      }

      output.textContent = "Calcul en cours...";

      const params = new URLSearchParams({
        batiment,
        ressource,
        annee
      });

      const data = await api(
        `/api/evaluation?${params.toString()}`
      );

      if (data.error || !data.stars) {
        output.textContent = "Aucune donnée disponible.";
        return;
      }

      output.innerHTML = `
        <div class="p-3 border rounded">
          <div class="fs-3">${getStars(data.stars)}</div>
          <strong>${data.stars} / 5</strong>
        </div>
      `;
    });
  }

  // -----------------------------
  // 6. COMPARAISON DES BÂTIMENTS
  // Route Flask : /api/compare
  // -----------------------------
  const btnCmp = $("#cmp");

  if (btnCmp) {
    btnCmp.addEventListener("click", async () => {
      const batiment1 = $("#b1").value.trim();
      const batiment2 = $("#b2").value.trim();
      const ressource = $("#cr").value;
      const output = $("#co");

      if (!batiment1 || !batiment2) {
        output.textContent =
          "Veuillez saisir les deux bâtiments.";
        return;
      }

      if (batiment1 === batiment2) {
        output.textContent =
          "Choisissez deux bâtiments différents.";
        return;
      }

      output.textContent = "Comparaison en cours...";

      const params = new URLSearchParams({
        batiment1,
        batiment2,
        ressource
      });

      const data = await api(
        `/api/compare?${params.toString()}`
      );

      if (data.error || !data.found1 || !data.found2) {
        output.textContent =
          "Bâtiment introuvable ou données manquantes.";
        return;
      }

      let winnerText = "Les deux bâtiments ont la même consommation.";

      if (data.winner === batiment1) {
        winnerText = `${batiment1} consomme davantage.`;
      } else if (data.winner === batiment2) {
        winnerText = `${batiment2} consomme davantage.`;
      }

      output.innerHTML = `
        <div class="p-3 border rounded">
          <p>
            <strong>${batiment1} :</strong>
            ${formatNumber(data.consommation1)}
          </p>

          <p>
            <strong>${batiment2} :</strong>
            ${formatNumber(data.consommation2)}
          </p>

          <hr>
          <strong>${winnerText}</strong>
        </div>
      `;
    });
  }

  // -----------------------------
  // 7. MAXIMUM / MINIMUM
  // Routes Flask : /api/max et /api/min
  // -----------------------------
  async function fetchMinMax(type) {
    const batiment = $("#mb").value.trim();
    const ressource = $("#mr").value;
    const output = $("#mo");

    if (!batiment) {
      output.textContent = "Veuillez saisir un bâtiment.";
      return;
    }

    output.textContent = "Recherche en cours...";

    const params = new URLSearchParams({
      batiment,
      ressource
    });

    const data = await api(
      `/api/${type}?${params.toString()}`
    );

    if (data.error || !data.found || !data.measure) {
      output.textContent = "Aucune donnée trouvée.";
      return;
    }

    const mesure = data.measure;
    const titre = type === "max" ? "Maximum" : "Minimum";

    output.innerHTML = `
      <div class="p-3 border rounded">
        <strong>${titre}</strong>
        <p class="mb-1">
          Bâtiment : ${mesure.batiment}
        </p>
        <p class="mb-1">
          Ressource : ${formatRes(mesure.ressource)}
        </p>
        <p class="mb-1">
          Valeur : <strong>${formatNumber(mesure.valeur)}</strong>
        </p>
        <p class="mb-0">
          Date : ${mesure.date}
        </p>
      </div>
    `;
  }

  if ($("#mx")) {
    $("#mx").addEventListener("click", () => {
      fetchMinMax("max");
    });
  }

  if ($("#mn")) {
    $("#mn").addEventListener("click", () => {
      fetchMinMax("min");
    });
  }

  // -----------------------------
  // 8. TOTAUX PAR RESSOURCE
  // Route Flask : /api/total/<ressource>
  // -----------------------------
  async function loadTotals() {
    const container = $("#tot");
    if (!container) return;

    container.innerHTML = "Chargement des totaux...";

    const ressources = [
      "electricite",
      "chauffage",
      "eau"
    ];

    let html = "";

    for (const resource of ressources) {
      const data = await api(`/api/total/${resource}`);

      if (data.error) {
        html += `
          <div class="text-danger">
            Erreur de chargement : ${formatRes(resource)}
          </div>
        `;
        continue;
      }

      html += `
        <div class="d-flex justify-content-between border-bottom py-2">
          <span>${formatRes(resource)}</span>
          <strong>${formatNumber(data.total)}</strong>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  // -----------------------------
  // 9. CHARGER LES FILTRES
  // Route Flask : /api/data
  // -----------------------------
  async function loadFilters() {
    const data = await api("/api/data");

    if (!Array.isArray(data)) {
      console.error("Impossible de charger les mesures.");
      return;
    }

    const batiments = [
      ...new Set(
        data.map((m) => m.batiment).filter(Boolean)
      )
    ].sort();

    const ressources = [
      ...new Set(
        data.map((m) => m.ressource).filter(Boolean)
      )
    ].sort();

    const ab = $("#ab");
    const ar = $("#ar");

    if (ab) {
      ab.innerHTML =
        '<option value="">Choisir un bâtiment</option>';

      batiments.forEach((batiment) => {
        const option = document.createElement("option");
        option.value = batiment;
        option.textContent = batiment;
        ab.appendChild(option);
      });
    }

    if (ar) {
      ar.innerHTML =
        '<option value="">Choisir une ressource</option>';

      ressources.forEach((resource) => {
        const option = document.createElement("option");
        option.value = resource;
        option.textContent = formatRes(resource);
        ar.appendChild(option);
      });
    }
  }

  // -----------------------------
  // 10. MOYENNE ANNUELLE
  // Route Flask : /api/average
  // -----------------------------
  const btnAvg = $("#avg");

  if (btnAvg) {
    btnAvg.addEventListener("click", async () => {
      const batiment = $("#ab").value;
      const ressource = $("#ar").value;
      const annee = $("#ay").value;
      const output = $("#ao");

      if (!batiment || !ressource || !annee) {
        output.innerHTML = `
          <div class="alert alert-warning">
            Veuillez sélectionner un bâtiment,
            une ressource et une année.
          </div>
        `;
        return;
      }

      output.textContent = "Calcul de la moyenne en cours...";

      const params = new URLSearchParams({
        batiment,
        ressource,
        annee
      });

      const data = await api(
        `/api/average?${params.toString()}`
      );

      if (data.error || !data.found) {
        output.innerHTML = `
          <div class="alert alert-secondary">
            Aucune donnée pour ces critères.
          </div>
        `;
        return;
      }

      output.innerHTML = `
        <div class="col-12">
          <div class="p-3 border rounded">
            <div>
              <strong>Bâtiment :</strong> ${batiment}
            </div>

            <div>
              <strong>Ressource :</strong> ${formatRes(ressource)}
            </div>

            <div>
              <strong>Année :</strong> ${annee}
            </div>

            <hr>

            <div>
              <strong>Moyenne annuelle :</strong>
              ${formatNumber(data.moyenne)}
            </div>

            <div>
              <strong>Pourcentage du seuil :</strong>
              ${Number(data.pourcentage || 0).toFixed(1)}%
            </div>

            <div>
              <strong>Nombre de mesures :</strong>
              ${data.nombre || 0}
            </div>
          </div>
        </div>
      `;
    });
  }

  // -----------------------------
  // 11. INITIALISATION
  // -----------------------------
  loadFilters();
  loadTotals();

})();
