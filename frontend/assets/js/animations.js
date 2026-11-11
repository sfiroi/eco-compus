/* =========================================================
   EcoCampus - animations.js
   Loader, page transitions, ripple, theme fade, count-up numbers,
   skeleton shimmer, toasts, AI typing effect, login shake,
   scroll-to-top button, floating leaves.
   ========================================================= */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MIN_LOADER_MS = 700;           // minimum loader time
  var start = Date.now();
  var finished = false;
  var readyQueue = [];

  root.classList.add('page-loading');

  function isReady() { return root.classList.contains('page-ready'); }
  function onReady(fn) { if (isReady()) fn(); else readyQueue.push(fn); }

  function finish() {
    if (finished) return;
    finished = true;
    var wait = Math.max(0, MIN_LOADER_MS - (Date.now() - start));
    setTimeout(function () {
      root.classList.remove('page-loading', 'page-leaving');
      root.classList.add('page-ready');
      document.dispatchEvent(new Event('eco:ready'));   // other scripts (like the dashboard chart) wait for this
      readyQueue.splice(0).forEach(function (f) { try { f(); } catch (e) {} });
    }, wait);
  }
  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish);
  setTimeout(finish, 5000);          // safety net

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { root.classList.remove('page-leaving'); root.classList.add('page-ready'); }
  });

  /* ---------- Count-up numbers ---------- */
  // Numbers inside these elements count up from 0. Add class "num-anim" to any element to animate its numbers.
  var COUNT_SEL = '.gv, td.num, .num-anim';

  function countNode(node) {
    var v = node.nodeValue;
    if (v === node.__cur || v === node.__final || !/\d/.test(v)) return;
    if (!isReady()) { onReady(function () { countNode(node); }); return; }
    node.__final = v;

    var tokens = [], last = 0, m, re = /-?\d+(?:[.,]\d+)?/g, animatable = false;
    while ((m = re.exec(v))) {
      var raw = m[0], parts = raw.split(/[.,]/);
      var tok = {
        pre: v.slice(last, m.index), raw: raw,
        sep: raw.indexOf(',') > -1 ? ',' : '.',
        dec: parts[1] ? parts[1].length : 0,
        val: parseFloat(raw.replace(',', '.')),
        fixed: /^(19|20)\d\d$/.test(raw)          // keep years untouched
      };
      if (!tok.fixed) animatable = true;
      tokens.push(tok);
      last = re.lastIndex;
    }
    if (!animatable) return;
    var tail = v.slice(last), t0 = null, DUR = 1100, done = false;

    function write(s) { node.__cur = s; node.nodeValue = s; }
    function finalize() { if (done) return; done = true; write(v); }
    function frame(ts) {
      if (done) return;
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / DUR), e = 1 - Math.pow(1 - p, 3);
      if (p >= 1) return finalize();
      write(tokens.map(function (k) {
        if (k.fixed) return k.pre + k.raw;
        return k.pre + (k.val * e).toFixed(k.dec).replace('.', k.sep);
      }).join('') + tail);
      requestAnimationFrame(frame);
    }
    if (reduce) return;
    requestAnimationFrame(frame);
    setTimeout(finalize, DUR + 300);
  }

  function scanCount(el) {
    if (!el || el.nodeType !== 1) return;
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(countNode);
  }

  function countFromMutations(muts) {
    muts.forEach(function (mu) {
      var el = mu.target.nodeType === 3 ? mu.target.parentElement : mu.target;
      var host = el && el.closest && el.closest(COUNT_SEL);
      if (host) scanCount(host);
      Array.prototype.forEach.call(mu.addedNodes, function (nd) {
        if (nd.nodeType !== 1) return;
        var h = nd.closest && nd.closest(COUNT_SEL);
        if (h) scanCount(h);
        else if (nd.querySelectorAll) nd.querySelectorAll(COUNT_SEL).forEach(scanCount);
      });
    });
  }

  /* ---------- AI typing effect ---------- */
  var chatLive = false;   // becomes true once the user sends a message (so saved history is NOT retyped)
  function initChatLive() {
    var f = document.getElementById('form');
    if (f) f.addEventListener('submit', function () { chatLive = true; }, true);
    document.querySelectorAll('.chip, #clear').forEach(function (c) {
      c.addEventListener('click', function () { chatLive = true; }, true);
    });
  }

  function typeBubble(b) {
    if (reduce || b.dataset.ecoTyped) return;
    if (!chatLive && b.closest('.chat-log')) return;
    if (!b.textContent.trim()) return;           // typing dots / empty bubble
    b.dataset.ecoTyped = '1';
    var nodes = [], w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) { nodes.push({ n: n, t: n.nodeValue }); n.nodeValue = ''; }
    var total = nodes.reduce(function (a, x) { return a + x.t.length; }, 0);
    var shown = 0, step = Math.max(1, Math.ceil(total / 140));
    var log = b.closest('.chat-log');
    b.classList.add('eco-typing');
    var iv = setInterval(function () {
      shown = Math.min(total, shown + step);
      var left = shown;
      nodes.forEach(function (x) {
        var k = Math.max(0, Math.min(x.t.length, left));
        x.n.nodeValue = x.t.slice(0, k);
        left -= x.t.length;
      });
      if (log) log.scrollTop = log.scrollHeight;
      if (shown >= total) { clearInterval(iv); b.classList.remove('eco-typing'); }
    }, 20);
  }

  function typingFromMutations(muts) {
    muts.forEach(function (mu) {
      var el = mu.target.nodeType === 3 ? mu.target.parentElement : mu.target;
      var b = el && el.closest && el.closest('.msg.ai .bubble');
      if (b) typeBubble(b);
      Array.prototype.forEach.call(mu.addedNodes, function (nd) {
        if (nd.nodeType !== 1) return;
        var c = nd.closest && nd.closest('.msg.ai .bubble');
        if (c) typeBubble(c);
        if (nd.querySelectorAll) nd.querySelectorAll('.msg.ai .bubble').forEach(typeBubble);
      });
    });
  }

  /* ---------- Toasts ---------- */
  var toastBox = null;
  function ecoToast(msg, type) {
    if (!msg) return;
    if (!toastBox) {
      toastBox = document.createElement('div');
      toastBox.className = 'eco-toasts';
      toastBox.setAttribute('role', 'status');
      toastBox.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastBox);
    }
    type = type || 'info';
    var t = document.createElement('div');
    t.className = 'eco-toast t-' + type;
    var ic = document.createElement('span');
    ic.className = 'ic';
    ic.textContent = type === 'success' ? '✓' : (type === 'error' || type === 'warning') ? '!' : 'i';
    var tx = document.createElement('span');
    tx.textContent = msg;
    t.appendChild(ic); t.appendChild(tx);
    toastBox.appendChild(t);
    setTimeout(function () {
      t.classList.add('leaving');
      setTimeout(function () { t.remove(); }, 320);
    }, 3800);
  }
  window.ecoToast = ecoToast;

  function toastType(text) {
    if (/erreur|error|échec|echec|invalide|invalid|fail|impossible|introuvable|not found|خطأ/i.test(text)) return 'error';
    if (/ajout|supprim|succ|enregistr|added|deleted|removed|saved|success|تم|✓/i.test(text)) return 'success';
    if (/veuillez|attention|warning|please|يرجى|الرجاء/i.test(text)) return 'warning';
    return 'info';
  }

  function initToasts() {
    ['addo', 'delo', 'msg'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var timer;
      new MutationObserver(function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          var text = el.textContent.trim();
          if (text) ecoToast(text.slice(0, 140), toastType(text));
        }, 120);
      }).observe(el, { childList: true, characterData: true, subtree: true });
    });
  }

  /* ---------- Skeleton shimmer ---------- */
  function loadingLike(el) {
    var txt = el.textContent.trim();
    return !el.children.length && (!txt || /^(chargement|loading|جارٍ|جار )/i.test(txt));
  }
  function initSkeleton() {
    ['#gauges', '#chart', '#tot', '#tb'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el || !loadingLike(el)) return;
      var host = sel === '#tb' ? el.closest('.tbl-wrap') : el;
      if (!host) return;
      host.classList.add('eco-skel');
      var obs = new MutationObserver(function () {
        if (!loadingLike(el)) stop();
      });
      function stop() { host.classList.remove('eco-skel'); obs.disconnect(); }
      obs.observe(el, { childList: true, characterData: true, subtree: true });
      setTimeout(stop, 8000);
    });
  }

  /* ---------- Scroll-to-top button ---------- */
  function initScrollTop() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'eco-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
    document.body.appendChild(btn);
    function check() { btn.classList.toggle('show', (window.scrollY || root.scrollTop) > 300); }
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ---------- Floating leaves ---------- */
  function initLeaves() {
    if (reduce) return;
    var wrap = document.createElement('div');
    wrap.className = 'eco-leaves';
    wrap.setAttribute('aria-hidden', 'true');
    var svg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>';
    for (var i = 0; i < 14; i++) {
      var s = document.createElement('span'), size = 16 + Math.random() * 22;
      s.className = 'eco-leaf';
      s.style.left = (Math.random() * 100) + '%';
      s.style.width = s.style.height = size + 'px';
      s.style.setProperty('--dur', (20 + Math.random() * 18) + 's');
      s.style.setProperty('--delay', (-Math.random() * 30) + 's');
      s.style.setProperty('--sway', (25 + Math.random() * 60) + 'px');
      s.style.setProperty('--rot', ((Math.random() > .5 ? 1 : -1) * (240 + Math.random() * 240)) + 'deg');
      s.style.opacity = (.12 + Math.random() * .16).toFixed(2);
      s.innerHTML = svg;
      wrap.appendChild(s);
    }
    document.body.insertBefore(wrap, document.body.firstChild);
  }

  /* ---------- DOM ready ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    // Page transition when clicking a sidebar link
    document.querySelectorAll('.nav a[href]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#' || a.target === '_blank' ||
            e.ctrlKey || e.metaKey || e.shiftKey || a.getAttribute('aria-current') === 'page') return;
        e.preventDefault();
        root.classList.remove('page-ready');
        root.classList.add('page-leaving');
        setTimeout(function () { window.location.href = href; }, 380);
      });
    });

    // Ripple effect on buttons
    var sel = '.pill, .btn, .btn-soft, .chip, .theme, button[type="submit"]';
    document.addEventListener('click', function (e) {
      var b = e.target.closest(sel);
      if (!b || b.closest('.dropdown-menu')) return;
      b.classList.add('has-ripple');
      var r = b.getBoundingClientRect(), size = Math.max(r.width, r.height);
      var s = document.createElement('span');
      s.className = 'eco-ripple';
      s.style.width = s.style.height = size + 'px';
      s.style.left = (e.clientX - r.left - size / 2) + 'px';
      s.style.top = (e.clientY - r.top - size / 2) + 'px';
      b.appendChild(s);
      setTimeout(function () { s.remove(); }, 650);
    });

    // Theme button: spin + smooth color fade
    var t = document.getElementById('theme');
    if (t) t.addEventListener('click', function () {
      root.classList.add('theme-fade');
      t.classList.add('spin');
      setTimeout(function () { root.classList.remove('theme-fade'); t.classList.remove('spin'); }, 650);
    });

    initLeaves();
    initSkeleton();
    initToasts();
    initChatLive();
    initScrollTop();

    // Count-up + AI typing share one observer
    new MutationObserver(function (muts) {
      countFromMutations(muts);
      typingFromMutations(muts);
    }).observe(document.body, { childList: true, characterData: true, subtree: true });

    // Count-up for numbers already in the page
    onReady(function () { document.querySelectorAll(COUNT_SEL).forEach(scanCount); });
  });
})();
