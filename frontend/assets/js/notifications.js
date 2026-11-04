(() => {
  const $ = (s) => document.querySelector(s); const $$ = (s) => document.querySelectorAll(s);

  // 1. Récupération du nom d'utilisateur depuis le localStorage
  try {
    const savedName = localStorage.getItem('username');
    if (savedName && $('#username')) {
      $('#username').textContent = savedName;
    }
  } catch (e) {}

  // 2. Gestion du mode sombre (synchronisé avec les autres pages)
  const root = document.documentElement;
  const themeButton = $('#theme');

  function setTheme(name) {
    root.setAttribute('data-theme', name);
    root.setAttribute('data-bs-theme', name);
    if (themeButton) {
      themeButton.textContent = name === 'dark' ? '☀︎˚t' : '⏾⋆.˚';
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

  // 3. Interactivité pour marquer les notifications comme lues
  const markAllBtn = $('#mark-all-read'); const items = $$('.notif-item');
  let allRead = false;

  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      allRead = !allRead;
      items.forEach(item => {
        if (allRead) {
          item.classList.add('read');
        } else {
          item.classList.remove('read');
        }
      });
      markAllBtn.textContent = allRead ? 'Tout marquer comme non lu' : 'Tout marquer comme lu';
    });
  }
})();