(() => {
  const $  = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  /* Username insertion */
  try {
    const saved = localStorage.getItem('username');
    if (saved) $('#username').textContent = saved;
  } catch (e) {}

  /* Theme toggle synced with dashboard */
  const root = document.documentElement;
  const themeButton = $('#theme');

  function setTheme(name) {
    root.setAttribute('data-theme', name);
    root.setAttribute('data-bs-theme', name);
    if (themeButton) {
      themeButton.textContent = name === 'dark' ? '☀︎˚࿔' : '⏾⋆.˚';
    }
    try { localStorage.setItem('theme', name); } catch (e) {}
  }

  if (themeButton) {
    themeButton.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Load saved theme or default to light
  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem('theme') || 'light';
  } catch (e) {}
  setTheme(savedTheme);


  /* =========================================================
     CHAT LOGIC
     ========================================================= */
  const log = $('#log');
  const form = $('#form');
  const input = $('#input');
  const sendBtn = $('#send');
  const chips = $('#chips');
  const WELCOME = "Hi! I'm your EcoCampus assistant. Ask me about energy, water, waste or your 2026 targets.";
  const history = [];
  let busy = false;

  function addMessage(role, text) {
    const row = document.createElement('div');
    row.className = 'msg ' + (role === 'user' ? 'mine' : 'ai');
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    row.appendChild(bubble);
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  function showTyping() {
    const row = document.createElement('div');
    row.className = 'msg ai';
    row.innerHTML = '<div class="bubble typing" aria-label="Assistant is typing"><i></i><i></i><i></i></div>';
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  async function getReply(text) {
    const t = text.toLowerCase();
    let reply = "I'm a demo for now, so I only know a few things. Try asking about electricity, recycling, water or this month's summary.";
    if (t.includes('electric') || t.includes('building') || t.includes('energy')) {
      reply = 'Science Hall uses the most electricity at 31.8 kWh/m², up 12% since September. The Library is the best at 14.2 kWh/m².';
    } else if (t.includes('recycl') || t.includes('waste')) {
      reply = 'Recycling is at 64% against a 70% target. Better sorting bins in Block Co would help.';
    } else if (t.includes('water')) {
      reply = 'Water reuse is at 31% against a 40% target. The rainwater tank is back to 82%.';
    } else if (t.includes('summar') || t.includes('month')) {
      reply = 'October: electricity index 82, water 88, waste 94 (2025 average = 100). All three keep trending down. Watch the Science Hall night-time load.';
    }
    return new Promise((resolve) => setTimeout(() => resolve(reply), 600));
  }

  async function send(text) {
    text = text.trim();
    if (!text || busy) return;
    busy = true;
    sendBtn.disabled = true;
    chips.hidden = true;
    addMessage('user', text);
    history.push({ role: 'user', content: text });
    input.value = '';
    resize();

    const typing = showTyping();
    try {
      const reply = await getReply(text);
      history.push({ role: 'assistant', content: reply });
      typing.remove();
      addMessage('ai', reply);
    } catch (e) {
      history.pop();
      typing.remove();
      addMessage('ai', 'Sorry, something went wrong. Please try again.');
    }
    busy = false;
    sendBtn.disabled = false;
    input.focus();
  }

  function reset() {
    log.innerHTML = '';
    history.length = 0;
    addMessage('ai', WELCOME);
    chips.hidden = false;
  }

  function resize() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 140) + 'px';
  }
  input.addEventListener('input', resize);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    send(input.value);
  });

  $$('.chip').forEach((chip) => chip.addEventListener('click', () => send(chip.textContent)));
  $('#clear').addEventListener('click', reset);

  reset();
})();