/* =========================================================
   EcoCampus - login.js   (login page)

   What it does:
   1. Sends the e-mail + password to login.php WITHOUT reloading the page.
   2. Wrong password or wrong captcha  ->  the login box shakes + a red message.
   3. Correct login  ->  a "Welcome" animation, then the dashboard opens.
   ========================================================= */
(function () {
  // Get the elements of the page we need to work with.
  var form = document.getElementById('loginForm');
  if (!form) return;

  var box     = document.querySelector('.login-box');
  var errBox  = document.getElementById('loginError');
  var btn     = form.querySelector('button[type="submit"]');
  var emailEl = document.getElementById('email');
  var passEl  = document.getElementById('password');
  var capEl   = document.getElementById('captcha');
  var goodEl  = document.getElementById('captchaCorrect');
  var reduce  = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Translated text of a key (t() is defined in i18n.js).
  function tr(key, fallback) { return (typeof t === 'function') ? t(key) : fallback; }

  /* ----- error message + shake ----- */
  // Makes an element shake (CSS class "eco-shake", defined in animations.css).
  function shake(el) {
    el.classList.remove('eco-shake');
    void el.offsetWidth;
    el.classList.add('eco-shake');
    setTimeout(function () { el.classList.remove('eco-shake'); }, 700);
  }
  // Hides the error message and removes the red borders.
  function clearError() {
    errBox.classList.remove('show');
    errBox.removeAttribute('data-i18n');
    [emailEl, passEl, capEl].forEach(function (i) { i.classList.remove('eco-invalid'); });
  }
  // Shows an error: message + red borders on the given fields + the shake.
  function fail(key, fallback, fields) {
    errBox.setAttribute('data-i18n', key);          // the message is translated again if the language changes
    errBox.textContent = tr(key, fallback);
    errBox.classList.add('show');
    fields.forEach(function (i) { i.classList.add('eco-invalid'); });
    shake(box);
  }
  [emailEl, passEl, capEl].forEach(function (i) { i.addEventListener('input', clearError); });

  // Makes a new addition for the captcha and empties the answer field.
  // The button comes back into the form; the next hover sends it away again
  // until the visitor types this new sum.
  function newCaptcha() {
    if (typeof genererCaptcha === 'function') genererCaptcha();
    capEl.value = '';
    releaseLoginButton();
  }

  /* ----- runaway login button -----
     Joke on the login page:
     - Captcha empty or wrong  ->  moving the pointer onto "Se connecter" teleports the button.
     - Captcha equal to the hidden correct answer  ->  the button returns to the form and stays.
     The real check still happens on submit (here and in login.php). This only blocks the click. */
  var anchor = document.getElementById('loginBtnAnchor');

  // True only when the visitor typed the exact sum stored by captcha.js.
  function captchaIsRight() {
    var typed = String(capEl.value).trim();
    var good = String(goodEl.value).trim();
    return typed !== '' && typed === good;
  }

  // Puts the button back inside .login-btn-anchor (clears the fixed position).
  function releaseLoginButton() {
    btn.classList.remove('is-fleeing');
    btn.style.left = '';
    btn.style.top = '';
    btn.style.width = '';
  }

  // Teleports the button to a random spot that is NOT under the pointer.
  // px, py = where the mouse is, in window pixels.
  function fleeLoginButton(px, py) {
    if (captchaIsRight() || btn.disabled) {
      releaseLoginButton();
      return;
    }

    // Remember the size before leaving the form, so the button keeps its shape.
    var w = btn.offsetWidth || (anchor ? anchor.clientWidth : 220);
    var h = btn.offsetHeight || 48;
    var margin = 12;
    var maxX = Math.max(margin, window.innerWidth - w - margin);
    var maxY = Math.max(margin, window.innerHeight - h - margin);
    var x = margin;
    var y = margin;

    // Try spots until one is clear of the cursor (padding so it does not land on the fingertip).
    for (var attempt = 0; attempt < 30; attempt++) {
      x = margin + Math.random() * Math.max(1, maxX - margin);
      y = margin + Math.random() * Math.max(1, maxY - margin);
      var overPointer = px >= x - 24 && px <= x + w + 24 && py >= y - 24 && py <= y + h + 24;
      if (!overPointer) break;
    }

    btn.style.width = w + 'px';
    btn.style.left = Math.round(x) + 'px';
    btn.style.top = Math.round(y) + 'px';
    btn.classList.add('is-fleeing');
  }

  // Hover (mouse or pen): the button leaves. A second move catches it if it landed on the cursor.
  btn.addEventListener('pointerenter', function (e) {
    fleeLoginButton(e.clientX, e.clientY);
  });
  btn.addEventListener('pointermove', function (e) {
    if (!captchaIsRight()) fleeLoginButton(e.clientX, e.clientY);
  });
  // Right number: the button comes home and further hovers do nothing.
  // Wrong number while the pointer is already on the button: it leaves immediately.
  capEl.addEventListener('input', function () {
    if (captchaIsRight()) {
      releaseLoginButton();
      return;
    }
    if (btn.matches(':hover')) {
      var r = btn.getBoundingClientRect();
      fleeLoginButton(r.left + r.width / 2, r.top + r.height / 2);
    }
  });
  // While waiting for the server the button is disabled and shows "Connexion...".
  function setBusy(on) {
    btn.disabled = on;
    btn.textContent = on ? tr('lg_wait', 'Connexion…') : tr('lg_btn', 'Se connecter →');
  }

  /* ----- welcome animation (shown after a correct login) ----- */
  var LEAF = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>';
  // Shows the full-screen welcome (check mark, name, leaves), then opens the dashboard after 3 seconds.
  function welcome(name, url) {
    name = name || '';
    try { localStorage.setItem('username', name); } catch (e) {}

    var o = document.createElement('div');
    o.className = 'eco-welcome';
    o.setAttribute('role', 'status');
    o.innerHTML =
      '<div class="ew-icon"><i class="ew-ring"></i><i class="ew-ring"></i><i class="ew-ring"></i>' +
      '<svg class="ew-check" viewBox="0 0 52 52"><circle class="ew-c" cx="26" cy="26" r="23" fill="none"/>' +
      '<path class="ew-p" fill="none" d="M14 27l8 8 16-17"/></svg></div>' +
      '<h2 class="ew-title"></h2><p class="ew-sub"></p><div class="ew-bar"><i></i></div>';

    var sep = document.documentElement.lang === 'ar' ? '، ' : ', ';
    o.querySelector('.ew-title').textContent = tr('lg_welcome', 'Bienvenue') + (name ? sep + name : '') + ' 👋';
    o.querySelector('.ew-sub').textContent = tr('lg_welcome_sub', 'Chargement de votre tableau de bord…');

    if (!reduce) {
      for (var i = 0; i < 18; i++) {
        var a = (Math.PI * 2 * i) / 18 + Math.random() * .4, d = 140 + Math.random() * 190;
        var l = document.createElement('span');
        l.className = 'ew-leaf';
        l.style.setProperty('--dx', Math.round(Math.cos(a) * d) + 'px');
        l.style.setProperty('--dy', Math.round(Math.sin(a) * d) + 'px');
        l.style.setProperty('--r', Math.round(Math.random() * 540 - 270) + 'deg');
        l.style.setProperty('--d', (Math.random() * .35).toFixed(2) + 's');
        l.innerHTML = LEAF;
        o.appendChild(l);
      }
    }
    document.body.appendChild(o);
    void o.offsetWidth;
    o.classList.add('show');

    setTimeout(function () {
      o.classList.add('out');
      setTimeout(function () { window.location.href = url; }, 450);
    }, reduce ? 1200 : 3000);
  }

  /* ----- address of login.php -----
     Page opened through Apache (http://localhost/.../frontend/login.html)
        -> we use the relative path ../backend/login.php (works whatever the folder is called).
     Page opened through Flask (http://127.0.0.1:5000) or elsewhere
        -> we use the full address below (change it if your folder has another name). */
  var PHP_LOGIN_URL = 'http://localhost/EcoCampus/backend/login.php';
  function loginUrl() {
    var fromApache = (location.port === '' || location.port === '80') && /\/frontend\//.test(location.pathname);
    return fromApache ? new URL('../backend/login.php', location.href).href : PHP_LOGIN_URL;
  }

  /* ----- when the form is sent ----- */
  // This runs when the user clicks "Se connecter".
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();

    // 1) check the captcha right away (no need to call the server)
    var good = String(goodEl.value).trim();
    if (good !== '' && String(capEl.value).trim() !== good) {
      fail('lg_err_cap', 'Réponse du calcul incorrecte.', [capEl]);
      newCaptcha();
      capEl.focus();
      return;
    }

    // 2) the server checks the e-mail and the password
    setBusy(true);
    var fd = new FormData(form);
    fd.append('ajax', '1');

    fetch(loginUrl(), { method: 'POST', body: fd })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.ok) { welcome(d.name, d.redirect); return; }
        setBusy(false);
        if (d && d.error === 'captcha') {
          fail('lg_err_cap', 'Réponse du calcul incorrecte.', [capEl]);
          newCaptcha();
        } else {
          fail('lg_err_cred', 'Email ou mot de passe incorrect.', [emailEl, passEl]);
          passEl.value = '';
          passEl.focus();
        }
      })
      .catch(function () {
        // login.php not found (404), Apache stopped, PHP error...
        setBusy(false);
        fail('lg_err_srv', 'Serveur de connexion introuvable. Vérifiez qu\'Apache (XAMPP) est démarré.', []);
      });
  });

  /* ----- coming back from login.php with ?error=... (classic form send) ----- */
  var m = /[?&]error=([a-z]+)/i.exec(location.search);
  if (m) {
    var cap = m[1] === 'captcha';
    var go = function () {
      fail(cap ? 'lg_err_cap' : 'lg_err_cred',
           cap ? 'Réponse du calcul incorrecte.' : 'Email ou mot de passe incorrect.',
           cap ? [capEl] : [emailEl, passEl]);
    };
    // wait until the loading screen is gone so the shake can be seen
    var wait = setInterval(function () {
      if (document.documentElement.classList.contains('page-ready')) { clearInterval(wait); setTimeout(go, 250); }
    }, 100);
    setTimeout(function () { clearInterval(wait); }, 6000);
    try { history.replaceState({}, document.title, location.pathname); } catch (e) {}
  }
})();
