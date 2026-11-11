/* Traduction FR / AR / EN : attributs data-i18n, data-i18n-placeholder, data-i18n-aria
   Boutons de langue : <button data-lang="fr|ar|en"> dans #translation-menu */
// TRADUCTIONS = the dictionary of the site. For each language (fr / ar / en): key -> text.
// In the HTML, data-i18n="key" tells which text to show in that place.
const TRADUCTIONS = {
 "fr": {
  "b_biblio": "Biblio",
  "b_bibliotheque_annexe": "Bibliothèque annexe",
  "b_resto": "Resto",
  "b_restaurant": "Restaurant",
  "b_dep_info": "Dep. info",
  "b_dep_mec": "Dep. mec",
  "b_buvette": "Buvette",
  "b_amphi_a": "Amphi A",
  "b_amphi_b": "Amphi B",
  "b_laboratoire": "Laboratoire",
  "b_atelier": "Atelier",
  "b_administration": "Administration",
  "b_salle_info_1": "Salle info 1",
  "b_internat": "Internat",
  "b_bloc_c": "Bloc C",
  "b_bloc_d": "Bloc D",
  "b_salle_reunion": "Salle reunion",
  "b_gymnase": "Gymnase",
  "b_laboratoire_reseau": "Laboratoire réseau",
  "notif_above": "{batiment} : {ressource} au-dessus du seuil",
  "notif_desc": "Consommation de {valeur} pour un seuil de {seuil} (+{pct}%).",
  "relative_today": "Aujourd'hui",
  "relative_yesterday": "Hier",
  "relative_days": "Il y a {days} j",
  "readall": "Tout marquer comme lu",
"unread": "Tout marquer comme non lu",
  "del_mes": "Supprimer une mesure",
  "ajouter": "Ajouter",
  "mesure_id": "ID de la mesure",
  "date_ph": "MM/DD/YYYY",
  "g_added": "Mesure ajoutée avec succès (ID: {id})",
  "g_add_err": "Erreur lors de l'ajout.",
  "g_need_id": "Veuillez entrer un ID.",
  "g_deleted": "Mesure {id} supprimée.",
  "g_not_found": "Mesure introuvable.",
  "g_invalid": "Mesure non valide ou incorrecte.",
  "translation": "Traduction",
  "user": "Utilisateur",
  "dash": "Tableau de Bord",
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
  "lg_err_cred": "Email ou mot de passe incorrect.",
  "lg_err_cap": "Réponse du calcul incorrecte.",
  "lg_welcome": "Bienvenue",
  "lg_welcome_sub": "Chargement de votre tableau de bord…",
  "lg_wait": "Connexion…",
  "lg_err_srv": "Serveur de connexion introuvable. Vérifiez qu'Apache (XAMPP) est démarré.",
  "an_hint": "Le résultat s'affichera ici.",
  "an_loading": "Chargement…",
  "an_err": "Impossible de joindre le serveur.",
  "an_no_data": "Aucune donnée pour ces critères.",
  "an_need_eval": "Choisissez un bâtiment et une année.",
  "an_need_two": "Choisissez deux bâtiments.",
  "an_need_diff": "Choisissez deux bâtiments différents.",
  "an_need_bld": "Choisissez un bâtiment.",
  "an_need_avg": "Choisissez un bâtiment, une ressource et une année.",
  "an_conso": "Consommation",
  "an_seuil": "Seuil",
  "an_pct": "du seuil",
  "an_star5": "Excellent",
  "an_star4": "Très bien",
  "an_star3": "Bien",
  "an_star2": "Moyen",
  "an_star1": "Trop élevé",
  "an_more": "{a} consomme {p}% de plus que {b}.",
  "an_same": "Les deux bâtiments consomment autant.",
  "an_gap": "Écart entre les deux : {p} points de %",
  "an_avg": "Moyenne",
  "an_nb": "Mesures",
  "an_status": "Statut",
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
  "b_biblio": "المكتبة",
  "b_bibliotheque_annexe": "المكتبة الفرعية",
  "b_resto": "المطعم",
  "b_restaurant": "المطعم",
  "b_dep_info": "قسم الإعلامية",
  "b_dep_mec": "قسم الميكانيك",
  "b_buvette": "المشرب",
  "b_amphi_a": "مدرج أ",
  "b_amphi_b": "مدرج ب",
  "b_laboratoire": "المخبر",
  "b_atelier": "الورشة",
  "b_administration": "الإدارة",
  "b_salle_info_1": "قاعة الإعلامية 1",
  "b_internat": "المبيت",
  "b_bloc_c": "الجناح C",
  "b_bloc_d": "الجناح D",
  "b_salle_reunion": "قاعة الاجتماعات",
  "b_gymnase": "القاعة الرياضية",
  "b_laboratoire_reseau": "مخبر الشبكات",
  "notif_above": "{batiment} : تجاوز المورد {ressource} العتبة المحددة",
  "notif_desc": "الاستهلاك بلغ {valeur} بينما العتبة هي {seuil} (+{pct}%).",
  "relative_today": "اليوم",
  "relative_yesterday": "أمس",
  "relative_days": "منذ {days} أيام",
  "readall": "تحديد الكل كمقروء",
"unread": "تحديد الكل غير مقروء",
  "del_mes": "حذف قياس",
  "ajouter": "إضافة",
  "mesure_id": "معرّف القياس",
  "date_ph": "شهر/يوم/سنة (MM/DD/YYYY)",
  "g_added": "تمت إضافة القياس بنجاح (المعرّف: {id})",
  "g_add_err": "حدث خطأ أثناء الإضافة.",
  "g_need_id": "الرجاء إدخال معرّف.",
  "g_deleted": "تم حذف القياس {id}.",
  "g_not_found": "القياس غير موجود.",
  "g_invalid": "القياس غير صالح أو غير صحيح.",
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
  "lg_err_cred": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "lg_err_cap": "إجابة العملية الحسابية غير صحيحة.",
  "lg_welcome": "مرحبًا بك",
  "lg_welcome_sub": "جارٍ تحميل لوحة التحكم…",
  "lg_wait": "جارٍ الاتصال…",
  "lg_err_srv": "تعذّر الوصول إلى خادم تسجيل الدخول. تحقق من تشغيل Apache (XAMPP).",
  "an_hint": "ستظهر النتيجة هنا.",
  "an_loading": "جارٍ التحميل…",
  "an_err": "تعذّر الوصول إلى الخادم.",
  "an_no_data": "لا توجد بيانات لهذه المعايير.",
  "an_need_eval": "اختر مبنى وسنة.",
  "an_need_two": "اختر مبنيين.",
  "an_need_diff": "اختر مبنيين مختلفين.",
  "an_need_bld": "اختر مبنى.",
  "an_need_avg": "اختر مبنى ومورداً وسنة.",
  "an_conso": "الاستهلاك",
  "an_seuil": "العتبة",
  "an_pct": "من العتبة",
  "an_star5": "ممتاز",
  "an_star4": "جيد جداً",
  "an_star3": "جيد",
  "an_star2": "متوسط",
  "an_star1": "مرتفع جداً",
  "an_more": "{a} يستهلك {p}% أكثر من {b}.",
  "an_same": "المبنيان يستهلكان نفس القدر.",
  "an_gap": "الفرق بينهما: {p} نقطة مئوية",
  "an_avg": "المتوسط",
  "an_nb": "القياسات",
  "an_status": "الحالة",
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
  "b_biblio": "Library",
  "b_bibliotheque_annexe": "Annex Library",
  "b_resto": "Cafeteria",
  "b_restaurant": "Restaurant",
  "b_dep_info": "IT Department",
  "b_dep_mec": "Mechanical Department",
  "b_buvette": "Refreshment Bar",
  "b_amphi_a": "Lecture Hall A",
  "b_amphi_b": "Lecture Hall B",
  "b_laboratoire": "Laboratory",
  "b_atelier": "Workshop",
  "b_administration": "Administration",
  "b_salle_info_1": "Computer Room 1",
  "b_internat": "Dormitory",
  "b_bloc_c": "Block C",
  "b_bloc_d": "Block D",
  "b_salle_reunion": "Meeting Room",
  "b_gymnase": "Gymnasium",
  "b_laboratoire_reseau": "Network Laboratory",
  "notif_above": "{batiment}: {ressource} above threshold",
  "notif_desc": "Consumption of {valeur} for a threshold of {seuil} (+{pct}%).",
  "relative_today": "Today",
  "relative_yesterday": "Yesterday",
  "relative_days": "{days} days ago",
  "readall": "Mark all as read",
"unread": "Mark all as unread",
  "del_mes": "Delete a measurement",
  "ajouter": "Add",
  "mesure_id": "Measurement ID",
  "date_ph": "MM/DD/YYYY",
  "g_added": "Measurement added successfully (ID: {id})",
  "g_add_err": "Error while adding.",
  "g_need_id": "Please enter an ID.",
  "g_deleted": "Measurement {id} deleted.",
  "g_not_found": "Measurement not found.",
  "g_invalid": "Invalid or incorrect measurement.",
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
  "lg_err_cred": "Incorrect email or password.",
  "lg_err_cap": "Wrong answer to the math question.",
  "lg_welcome": "Welcome",
  "lg_welcome_sub": "Loading your dashboard…",
  "lg_wait": "Signing in…",
  "lg_err_srv": "Login server not found. Check that Apache (XAMPP) is running.",
  "an_hint": "The result will appear here.",
  "an_loading": "Loading…",
  "an_err": "Cannot reach the server.",
  "an_no_data": "No data for these criteria.",
  "an_need_eval": "Choose a building and a year.",
  "an_need_two": "Choose two buildings.",
  "an_need_diff": "Choose two different buildings.",
  "an_need_bld": "Choose a building.",
  "an_need_avg": "Choose a building, a resource and a year.",
  "an_conso": "Consumption",
  "an_seuil": "Threshold",
  "an_pct": "of the threshold",
  "an_star5": "Excellent",
  "an_star4": "Very good",
  "an_star3": "Good",
  "an_star2": "Average",
  "an_star1": "Too high",
  "an_more": "{a} uses {p}% more than {b}.",
  "an_same": "Both buildings use the same amount.",
  "an_gap": "Gap between the two: {p} percentage points",
  "an_avg": "Average",
  "an_nb": "Measures",
  "an_status": "Status",
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

// langue = current language ("fr", "ar" or "en"). It is remembered between visits.
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

// Goes through the page and replaces every data-i18n text and placeholder by the current language.
// For Arabic it also switches the whole page to right-to-left.
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

// Called by the language menu: saves the new language and updates the page.
function changerLangue(l) {
  if (!TRADUCTIONS[l]) return;
  langue = l;
  try { localStorage.setItem("langue", l); } catch (e) {}
  arreterParole();   // stoppe la lecture en cours (mauvaise langue sinon)
  appliquerTraductions();
  if (typeof window.actualiserMesures === "function") window.actualiserMesures();
  if (typeof window.genererCaptcha === "function") window.genererCaptcha();
  if (typeof window.chargerAlertesNotifications === "function") {
    window.chargerAlertesNotifications();
  } else if (typeof loadAlerts === "function") {
    loadAlerts();
  }
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