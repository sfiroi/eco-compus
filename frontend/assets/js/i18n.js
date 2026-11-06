/* Traduction FR / AR / EN : attributs data-i18n, data-i18n-placeholder, data-i18n-aria
   Boutons de langue : <button data-lang="fr|ar|en"> dans #translation-menu */
const TRADUCTIONS = {
 "fr": {
  "translation": "Traduction",
  "user": "Utilisateur",
  "dash": "Dashboard",
  "notifs": "Notifications",
  "ai": "Assistant AI",
  "logout": "Déconnexion",
  "goals": "Objectifs cette année",
  "goals_sub": "Les repères indiquent l'objectif 2026.",
  "alerts": "Alertes",
  "last7": "7 derniers jours",
  "trend": "Tendance de consommation",
  "trend_sub": "Indice, moyenne mensuelle 2025 = 100.",
  "bld": "Bâtiments",
  "bld_sub": "Consommation électrique en octobre.",
  "th_bld": "Bâtiment",
  "th_status": "Statut",
  "b1": "Bibliothèque",
  "b2": "Hall des Sciences",
  "b3": "Résidence Étudiante",
  "b4": "Centre Sportif",
  "s_ok": "Dans la cible",
  "s_hi": "Au-dessus",
  "s_warn": "À surveiller",
  "a1": "Hall des Sciences : charge nocturne +12%",
  "a2": "Réservoir d'eau de pluie rempli à 82%",
  "a3": "Bloc C : collecte des déchets retardée",
  "d1": "Lun",
  "d2": "Dim",
  "d3": "Ven",
  "readall": "Tout marquer comme lu",
  "unread": "Tout marquer comme non lu",
  "new_n": "{n} nouveaux",
  "all_read": "Tous lus",
  "m_title": "Mesures de consommation",
  "m_sub_data": "Données générées par le module C (data.json).",
  "search_ph": "Rechercher un bâtiment ou une ressource...",
  "all_res": "Toutes les ressources",
  "electricite": "Électricité",
  "eau": "Eau",
  "chauffage": "Chauffage",
  "only_alerts": "Anomalies seulement",
  "reset": "Réinitialiser",
  "captcha_txt": "Combien font {a} + {b} ?",
  "th_res": "Ressource",
  "th_val": "Valeur",
  "th_thr": "Seuil",
  "th_date": "Date",
  "st_alert": "Alerte",
  "st_norm": "Normal",
  "none_results": "Aucun résultat",
  "err": "Impossible de charger data.json. Lancez un serveur local (Live Server).",
  "count": "{n} / {t} mesure(s)",
  "nc_title": "Centre de notifications",
  "nc_sub": "Historique des alertes et des événements récents du campus.",
  "nsearch_ph": "Rechercher une notification...",
  "c_card": "Posez vos questions sur le campus",
  "c_sub": "Énergie, eau, déchets et objectifs 2026.",
  "new_chat": "Nouvelle discussion",
  "send": "Envoyer",
  "type_ph": "Tapez votre question…",
  "lg_tag": "UN CAMPUS PLUS VERT COMMENCE ICI",
  "lg_h1": "Chaque goutte et chaque watt comptent.",
  "lg_p": "Une gestion intelligente des ressources pour un campus plus durable.",
  "lg_foot": "Suivre. Réduire. Agir pour l'impact.",
  "lg_badge": "BON RETOUR",
  "lg_h2": "Connexion",
  "lg_sub": "Entrez vos identifiants pour continuer.",
  "lg_email": "Adresse e-mail",
  "lg_pass": "Mot de passe",
  "lg_pass_ph": "Votre mot de passe",
  "lg_cap_ph": "Votre réponse",
  "lg_btn": "Se connecter →",
  "eval_ann": "Évaluation annuelle",
  "comp_bld": "Comparer deux bâtiments",
  "max_min": "Max / Min",
  "totaux": "Totaux",
  "moy_ann": "Moyennes annuelles",
  "evaluer": "Évaluer",
  "comparer": "Comparer",
  "maximum": "Maximum",
  "minimum": "Minimum",
  "choisir_bld": "Choisir un bâtiment",
  "choisir_res": "Choisir une ressource",
  "annee": "Année",
  "afficher": "Afficher",
  "add_mes": "Ajouter une mesure",
  "supp_id": "Supprimer par ID",
  "verif_conf": "Vérifier la conformité",
  "valeur": "Valeur",
  "seuil": "Seuil",
  "date": "Date",
  "actions": "Actions",
  "trier": "Trier",
  "batiment_1": "Bâtiment 1",
  "batiment_2": "Bâtiment 2",
  "analyses": "Analyses",
  "gestion": "Gestion",
  "mesures": "Mesures",
  "m_sub": "Rechercher, filtrer et trier les mesures de consommation.",
  "filter_res": "Filtrer par ressource",
  "sort_value": "Valeur croissante",
  "sort_id": "ID croissant",
  "sort_id_desc": "ID décroissant",
  "none": "Aucune mesure trouvée",
  "delete": "Supprimer",
  "confirm_delete": "Supprimer cette mesure de l'affichage ?",
  "load_error": "Impossible de charger measures_in.csv. Lancez la page avec Live Server.",
  "resource_electricite": "Électricité",
  "resource_eau": "Eau",
  "resource_chauffage": "Chauffage",
  "m_subtitle": "Affichage · Anomalies · Tri · Recherche · Filtre"
 },
 "ar": {
  "translation": "ترجمة",
  "user": "المستخدم",
  "dash": "لوحة القيادة",
  "notifs": "الإشعارات",
  "ai": "المساعد الذكي",
  "logout": "تسجيل الخروج",
  "goals": "أهداف هذه السنة",
  "goals_sub": "العلامات تشير إلى هدف 2026.",
  "alerts": "التنبيهات",
  "last7": "آخر 7 أيام",
  "trend": "اتجاه الاستهلاك",
  "trend_sub": "المؤشر: المتوسط الشهري لسنة 2025 = 100.",
  "bld": "المباني",
  "bld_sub": "استهلاك الكهرباء في أكتوبر.",
  "th_bld": "المبنى",
  "th_status": "الحالة",
  "b1": "المكتبة",
  "b2": "قاعة العلوم",
  "b3": "الإقامة الجامعية",
  "b4": "المركز الرياضي",
  "s_ok": "ضمن الهدف",
  "s_hi": "أعلى من الهدف",
  "s_warn": "يحتاج مراقبة",
  "a1": "قاعة العلوم: ارتفاع الحمل الليلي +12%",
  "a2": "خزان مياه الأمطار ممتلئ بنسبة 82%",
  "a3": "الكتلة C: تأخر جمع النفايات",
  "d1": "الاثنين",
  "d2": "الأحد",
  "d3": "الجمعة",
  "readall": "تعليم الكل كمقروء",
  "unread": "تعليم الكل كغير مقروء",
  "new_n": "{n} جديدة",
  "all_read": "الكل مقروء",
  "m_title": "قياسات الاستهلاك",
  "m_sub_data": "بيانات من وحدة C (data.json).",
  "search_ph": "ابحث عن مبنى أو مورد...",
  "all_res": "كل الموارد",
  "electricite": "الكهرباء",
  "eau": "الماء",
  "chauffage": "التدفئة",
  "only_alerts": "الحالات الشاذة فقط",
  "reset": "إعادة تعيين",
  "th_res": "المورد",
  "th_val": "القيمة",
  "th_thr": "العتبة",
  "th_date": "التاريخ",
  "st_alert": "تنبيه",
  "st_norm": "عادي",
  "none_results": "لا توجد نتائج",
  "captcha_txt": "كم تساوي {a} + {b}؟",
  "err": "تعذّر تحميل data.json. شغّل خادمًا محليًا (Live Server).",
  "count": "{n} / {t} قياس",
  "nc_title": "مركز الإشعارات",
  "nc_sub": "سجل التنبيهات وأحدث أحداث الحرم الجامعي.",
  "nsearch_ph": "ابحث في الإشعارات...",
  "c_card": "اسأل عن حرمك الجامعي",
  "c_sub": "الطاقة والماء والنفايات وأهداف 2026.",
  "new_chat": "محادثة جديدة",
  "send": "إرسال",
  "type_ph": "اكتب سؤالك…",
  "lg_tag": "حرم جامعي أكثر خضرة يبدأ من هنا",
  "lg_h1": "كل قطرة وكل واط مهمّ.",
  "lg_p": "إدارة ذكية للموارد من أجل حرم جامعي أكثر استدامة.",
  "lg_foot": "تابع. قلّل. تحرّك من أجل الأثر.",
  "lg_badge": "مرحبًا بعودتك",
  "lg_h2": "تسجيل الدخول",
  "lg_sub": "أدخل بيانات الدخول للمتابعة.",
  "lg_email": "البريد الإلكتروني",
  "lg_pass": "كلمة المرور",
  "lg_pass_ph": "كلمة المرور",
  "lg_cap_ph": "إجابتك",
  "lg_btn": "تسجيل الدخول →",
  "eval_ann": "التقييم السنوي",
  "comp_bld": "مقارنة مبنيين",
  "max_min": "الحد الأقصى / الأدنى",
  "totaux": "المجاميع",
  "moy_ann": "المتوسطات السنوية",
  "evaluer": "تقييم",
  "comparer": "مقارنة",
  "maximum": "الحد الأقصى",
  "minimum": "الحد الأدنى",
  "choisir_bld": "اختر المبنى",
  "choisir_res": "اختر المورد",
  "annee": "السنة",
  "afficher": "عرض",
  "add_mes": "إضافة قياس",
  "supp_id": "الحذف بواسطة المعرف",
  "verif_conf": "التحقق من المطابقة",
  "valeur": "القيمة",
  "seuil": "العتبة",
  "date": "التاريخ",
  "actions": "الإجراءات",
  "trier": "ترتيب",
  "batiment_1": "المبنى 1",
  "batiment_2": "المبنى 2",
  "analyses": "التحليلات",
  "gestion": "الإدارة",
  "mesures": "القياسات",
  "m_sub": "ابحث عن قياسات الاستهلاك وصفّها ورتّبها.",
  "filter_res": "تصفية حسب المورد",
  "sort_value": "القيمة تصاعديًا",
  "sort_id": "المعرّف تصاعديًا",
  "sort_id_desc": "المعرّف تنازليًا",
  "none": "لم يتم العثور على قياسات",
  "delete": "حذف",
  "confirm_delete": "هل تريد حذف هذا القياس من العرض؟",
  "load_error": "تعذّر تحميل measures_in.csv. افتح الصفحة باستعمال Live Server.",
  "resource_electricite": "الكهرباء",
  "resource_eau": "الماء",
  "resource_chauffage": "التدفئة",
  "m_subtitle": "عرض · حالات شاذة · ترتيب · بحث · تصفية"
 },
 "en": {
  "translation": "Translation",
  "user": "User",
  "dash": "Dashboard",
  "notifs": "Notifications",
  "captcha_txt": "How much is {a} + {b}?",
  "ai": "AI Assistant",
  "logout": "Log out",
  "goals": "Goals this year",
  "goals_sub": "Markers show the 2026 target.",
  "alerts": "Alerts",
  "last7": "Last 7 days",
  "trend": "Consumption trend",
  "trend_sub": "Index, 2025 monthly average = 100.",
  "bld": "Buildings",
  "bld_sub": "Electricity use in October.",
  "th_bld": "Building",
  "th_status": "Status",
  "b1": "Library",
  "b2": "Science Hall",
  "b3": "Student Residence",
  "b4": "Sports Center",
  "s_ok": "On target",
  "s_hi": "Above target",
  "s_warn": "Needs attention",
  "a1": "Science Hall: night load +12%",
  "a2": "Rainwater tank filled to 82%",
  "a3": "Block C: waste collection delayed",
  "d1": "Mon",
  "d2": "Sun",
  "d3": "Fri",
  "readall": "Mark all as read",
  "unread": "Mark all as unread",
  "new_n": "{n} new",
  "all_read": "All read",
  "m_title": "Consumption measures",
  "m_sub_data": "Data from the C module (data.json).",
  "search_ph": "Search a building or resource...",
  "all_res": "All resources",
  "electricite": "Electricity",
  "eau": "Water",
  "chauffage": "Heating",
  "only_alerts": "Anomalies only",
  "reset": "Reset",
  "th_res": "Resource",
  "th_val": "Value",
  "th_thr": "Threshold",
  "th_date": "Date",
  "st_alert": "Alert",
  "st_norm": "Normal",
  "none_results": "No results",
  "err": "Unable to load data.json. Start a local server (Live Server).",
  "count": "{n} / {t} measures",
  "nc_title": "Notification center",
  "nc_sub": "History of alerts and recent campus events.",
  "nsearch_ph": "Search notifications...",
  "c_card": "Ask about your campus",
  "c_sub": "Energy, water, waste and 2026 targets.",
  "new_chat": "New chat",
  "send": "Send",
  "type_ph": "Type your question…",
  "lg_tag": "A GREENER CAMPUS STARTS HERE",
  "lg_h1": "Every drop and every watt counts.",
  "lg_p": "Smart resource management for a more sustainable campus.",
  "lg_foot": "Track. Reduce. Act for impact.",
  "lg_badge": "WELCOME BACK",
  "lg_h2": "Sign in",
  "lg_sub": "Enter your credentials to continue.",
  "lg_email": "Email address",
  "lg_pass": "Password",
  "lg_pass_ph": "Your password",
  "lg_cap_ph": "Your answer",
  "lg_btn": "Sign in →",
  "eval_ann": "Annual evaluation",
  "comp_bld": "Compare two buildings",
  "max_min": "Max / Min",
  "totaux": "Totals",
  "moy_ann": "Annual averages",
  "evaluer": "Evaluate",
  "comparer": "Compare",
  "maximum": "Maximum",
  "minimum": "Minimum",
  "choisir_bld": "Choose a building",
  "choisir_res": "Choose a resource",
  "annee": "Year",
  "afficher": "Display",
  "add_mes": "Add a measurement",
  "supp_id": "Delete by ID",
  "verif_conf": "Verify compliance",
  "valeur": "Value",
  "seuil": "Threshold",
  "date": "Date",
  "actions": "Actions",
  "trier": "Sort",
  "batiment_1": "Building 1",
  "batiment_2": "Building 2",
  "analyses": "Analyses",
  "gestion": "Management",
  "mesures": "Measures",
  "m_sub": "Search, filter and sort consumption measurements.",
  "filter_res": "Filter by resource",
  "sort_value": "Value: ascending",
  "sort_id": "ID: ascending",
  "sort_id_desc": "ID: descending",
  "none": "No measurements found",
  "delete": "Delete",
  "confirm_delete": "Remove this measurement from the display?",
  "load_error": "Unable to load measures_in.csv. Open the page with Live Server.",
  "resource_electricite": "Electricity",
  "resource_eau": "Water",
  "resource_chauffage": "Heating",
  "m_subtitle": "Display · Anomalies · Sort · Search · Filter"
 }
};

let langue = "fr";
try { const m = localStorage.getItem("langue"); if (TRADUCTIONS[m]) langue = m; } catch (e) {}

/* Texte dans la langue courante ; {n} {t} = paramètres ; repli : français puis clé */
function t(cle, p) {
  let s = (TRADUCTIONS[langue] && TRADUCTIONS[langue][cle]) || TRADUCTIONS.fr[cle] || cle;
  if (p) Object.keys(p).forEach(k => { s = s.split("{" + k + "}").join(p[k]); });
  return s;
}

// Noms d'affichage des langues (bouton)
const NOMS_LANGUES = {
  "fr": "Français",
  "ar": "العربية",
  "en": "English"
};

function appliquerTraductions() {
  let nom = null;
  try { nom = localStorage.getItem("username"); } catch (e) {}

  document.querySelectorAll("[data-i18n]").forEach(el => {
    if (el.id === "username" && nom) return;
    if (el.id === "translation-btn") return;
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  document.documentElement.lang = langue;
  document.documentElement.dir = langue === "ar" ? "rtl" : "ltr";

  const btn = document.getElementById("translation-btn");
  if (btn) btn.textContent = NOMS_LANGUES[langue] || "Français";
}

function changerLangue(l) {
  if (!TRADUCTIONS[l]) return;
  langue = l;
  try { localStorage.setItem("langue", l); } catch (e) {}
  arreterParole();   // stoppe la lecture en cours (mauvaise langue sinon)
  appliquerTraductions();
  if (typeof window.actualiserMesures === "function") window.actualiserMesures();
  if (typeof window.genererCaptcha === "function") window.genererCaptcha();

  const menu = document.getElementById("translation-menu");
  if (menu) menu.classList.remove("active");
}

/* ==========================================================
   SYNTHÈSE VOCALE (suit automatiquement la langue de la page)
   ========================================================== */

const synth = (typeof window !== "undefined") ? window.speechSynthesis : null;
let voix = [];

// Langues de la page -> locales de la synthèse vocale
const LOCALES_VOIX = {
  fr: "fr-FR",
  ar: "ar-SA",   // arabe standard : les voix tunisiennes (ar-TN) sont très rares
  en: "en-US"
};

function chargerVoix() {
  if (synth) voix = synth.getVoices();
}

function choisirVoix(locale) {
  const norm = l => l.replace("_", "-").toLowerCase();   // Android écrit en_US
  const voulu = norm(locale);
  const base = voulu.split("-")[0];
  return voix.find(v => norm(v.lang) === voulu)          // correspondance exacte (fr-fr)
      || voix.find(v => norm(v.lang).startsWith(base))   // même langue (fr-ca, ar-eg...)
      || null;                                           // sinon : voix par défaut
}

/* Lit un texte dans la langue courante de la page */
function parler(texte) {
  if (!synth || !texte) return;
  synth.cancel();                                        // évite les chevauchements

  const lang = document.documentElement.lang || "fr";
  const locale = LOCALES_VOIX[lang] || "fr-FR";

  const u = new SpeechSynthesisUtterance(texte);
  u.lang = locale;

  const v = choisirVoix(locale);
  if (v) u.voice = v;
  else console.warn("Aucune voix installée pour " + locale);

  synth.speak(u);
  return u;
}

/* Lit le texte d'un élément (ex : parlerElement("#a1")) */
function parlerElement(selecteur) {
  const el = document.querySelector(selecteur);
  if (el) parler((el.innerText || el.textContent).trim());
}

/* Lit une clé de traduction (ex : parlerCle("goals")) */
function parlerCle(cle, params) {
  parler(t(cle, params));
}

function arreterParole() {
  if (synth) synth.cancel();
  const b = document.getElementById("btnLire");
  if (b) b.textContent = "🕪";
}

if (synth) {
  chargerVoix();
  synth.onvoiceschanged = chargerVoix;   // Chrome charge les voix de façon asynchrone
}

/* ==========================================================
   INITIALISATION
   ========================================================== */

function initTraductions() {
  appliquerTraductions();

  const btn = document.getElementById("translation-btn");
  const menu = document.getElementById("translation-menu");

  // Bouton principal : ouvre / ferme le menu
  if (btn && menu) {
    btn.addEventListener("click", e => { e.stopPropagation(); menu.classList.toggle("active"); });
    document.addEventListener("click", () => menu.classList.remove("active"));
    document.addEventListener("keydown", e => { if (e.key === "Escape") menu.classList.remove("active"); });
  }

  // Boutons de langue : <button data-lang="fr|ar|en">
  document.querySelectorAll("[data-lang]").forEach(el => {
    el.addEventListener("click", e => {
      e.stopPropagation();
      changerLangue(el.dataset.lang);
    });
  });

  // Bouton de lecture vocale : #btnLire
  const btnLire = document.getElementById("btnLire");
  if (btnLire && synth) {
    btnLire.addEventListener("click", () => {
      if (synth.speaking) { arreterParole(); return; }

      const zone = document.querySelector("main") || document.body;
      const u = parler(zone.innerText.trim());
      btnLire.textContent = "⏹";
      if (u) u.onend = u.onerror = () => { btnLire.textContent = "🕪"; };
    });
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTraductions);
  } else {
    initTraductions();
  }
}

if (typeof module !== "undefined") module.exports = { TRADUCTIONS, t };