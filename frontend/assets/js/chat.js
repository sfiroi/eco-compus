/**
 * EcoCampus - AI Assistant Script
 * Manages conversational chat logic, message bubbles rendering, typing animations,
 * quick prompt chips, and conversation resets.
 */
(() => {
  const $  = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  /* 1. Username synchronization */
  try {
    const savedName = localStorage.getItem('username');
    if (savedName && $('#username')) {
      $('#username').textContent = savedName;
    }
  } catch (e) {}

  /* 2. Global theme sync */
  const root = document.documentElement;
  const themeButton = $('#theme');

  function setTheme(name) {
    root.setAttribute('data-theme', name);
    root.setAttribute('data-bs-theme', name);
    if (themeButton) {
      themeButton.textContent = name === 'dark' ? '☀︎˚' : '⏾⋆.˚';
    }
    try {
      localStorage.setItem('theme', name);
    } catch (e) {}
  }

  if (themeButton) {
    themeButton.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem('theme') || 'light';
  } catch (e) {}
  setTheme(savedTheme);

  /* 3. AI Assistant chat interactions */
  const log = $('#log');
  const form = $('#form');
  const input = $('#input');
  const sendBtn = $('#send');
  const chips = $('#chips');
  // First message written by the assistant.
  const WELCOME = "Hi! I'm your EcoCampus assistant. Ask me about energy, water, waste or your 2026 targets.";
  // history = all the messages of the conversation. It is sent to the AI so it remembers the context.
  const history = [];
  // busy = true while we wait for an answer (prevents sending two messages at once).
  let busy = false;
  // Name under which the conversation is saved in the browser (localStorage).
  const CHAT_KEY = 'ecocampus_chat_history';

// Charger l'historique sauvegardé
function loadHistory() {
    try {
        const saved = localStorage.getItem(CHAT_KEY);

        if (saved) {
            const messages = JSON.parse(saved);

            history.push(...messages);

            messages.forEach(msg => {
                addMessage(
                    msg.role === 'user' ? 'user' : 'ai',
                    msg.content
                );
            });
        } else {
            addMessage('ai', WELCOME);
        }
    } catch (e) {
        console.error("Erreur chargement historique:", e);
        addMessage('ai', WELCOME);
    }
}

// Sauvegarder l'historique
function saveHistory() {
    localStorage.setItem(
        CHAT_KEY,
        JSON.stringify(history)
    );
}

  // Adds ONE speech bubble to the chat. role "user" = right side, anything else = left side (the AI).
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

  // Shows the three animated dots while the AI is "thinking".
  function showTyping() {
    const row = document.createElement('div');
    row.className = 'msg ai';
    row.innerHTML = '<div class="bubble typing" aria-label="Assistant is typing"><i></i><i></i><i></i></div>';
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  // Simulated AI responses based on keywords
  // 8. Envoyer le message au serveur Flask
    // Sends the question + the previous messages to Flask (/api/conseil) and returns the AI answer.
    async function getReply(text) {
        const response = await fetch(
            'http://127.0.0.1:5000/api/conseil',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: text,
                    historique: history.slice(0, -1)
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                'Erreur API : ' + response.status
            );
        }

        const data = await response.json();

        if (!data.reply) {
            throw new Error("Réponse AI vide.");
        }

        return data.reply;
    }

  // Complete sending: show my message, show the dots, wait for the answer, then show it.
  async function send(text) {
    text = text.trim();
    if (!text || busy) return;
    busy = true;
    sendBtn.disabled = true;
    chips.hidden = true;
    addMessage('user', text);
    history.push({ role: 'user', content: text });
    saveHistory();
    input.value = '';
    resize();

    const typing = showTyping();
    try {
      const reply = await getReply(text);
      history.push({ role: 'assistant', content: reply });
      saveHistory();
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

  // "New chat" button: empties the conversation and the saved history.
  function reset() {
    log.innerHTML = '';
    history.length = 0;

    localStorage.removeItem(CHAT_KEY);

    addMessage('ai', WELCOME);
    chips.hidden = false;
}

  // The text box grows with the text (up to 140 pixels high).
  function resize() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 140) + 'px';
  }

  input.addEventListener('input', resize);

  // Enter sends the message, Shift + Enter makes a new line.
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

  // Clicking a suggestion button ("chip") sends its text as a question.
  $$('.chip').forEach((chip) => chip.addEventListener('click', () => send(chip.textContent)));
  if ($('#clear')) $('#clear').addEventListener('click', reset);

  // Start: show the saved conversation (or the welcome message if there is none).
  loadHistory();
})();