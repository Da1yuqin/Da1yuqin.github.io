(() => {
  'use strict';
  const root = document.documentElement;
  const theme = document.getElementById('theme-toggle');
  const menu = document.getElementById('menu-toggle');
  const shade = document.getElementById('menu-shade');
  const search = document.getElementById('search');
  const feedback = document.getElementById('search-feedback');
  const sections = [...document.querySelectorAll('[data-searchable]')];
  const navLinks = [...document.querySelectorAll('.sidebar nav a')];
  const stored = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const store = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  let themePreference = stored('researchstart-theme');
  const colorScheme = matchMedia('(prefers-color-scheme: dark)');
  function setTheme(dark) {
    root.classList.toggle('dark', dark);
    theme.setAttribute('aria-pressed', String(dark));
    theme.setAttribute('aria-label', dark ? '切换到浅色模式' : '切换到深色模式');
    document.querySelector('meta[name="theme-color"]').content = dark ? '#19231e' : '#f8f7f2';
  }
  setTheme(themePreference ? themePreference === 'dark' : colorScheme.matches);
  theme.hidden = false;
  theme.addEventListener('click', () => {
    const dark = !root.classList.contains('dark');
    themePreference = dark ? 'dark' : 'light';
    store('researchstart-theme', themePreference); setTheme(dark);
  });
  colorScheme.addEventListener('change', event => { if (!themePreference) setTheme(event.matches); });
  function setMenu(open, restoreFocus = false) {
    document.body.classList.toggle('menu-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? '关闭目录' : '打开目录');
    shade.hidden = !open;
    if (restoreFocus) menu.focus();
  }
  menu.hidden = false;
  menu.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  shade.addEventListener('click', () => setMenu(false, true));
  document.addEventListener('paperbank:notes-open', () => setMenu(false));
  const mobile = matchMedia('(max-width: 820px)');
  mobile.addEventListener('change', () => setMenu(false));
  const reset = document.createElement('button');
  reset.type = 'button'; reset.textContent = '清空搜索';
  function filter() {
    const terms = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let matches = 0;
    sections.forEach(section => {
      const text = section.textContent.toLocaleLowerCase();
      section.hidden = !terms.every(term => text.includes(term));
      if (!section.hidden) matches++;
    });
    feedback.hidden = !terms.length;
    feedback.replaceChildren(document.createTextNode(matches ? `找到 ${matches} 个相关小节。` : '没有找到相关小节，换一个短词试试。'), reset);
  }
  function clearSearch() { search.value = ''; filter(); }
  reset.addEventListener('click', () => { clearSearch(); search.focus(); });
  search.closest('.search').hidden = false;
  search.addEventListener('input', filter);
  search.addEventListener('keydown', event => {
    if (event.key === 'Enter' && search.value.trim()) {
      const first = sections.find(section => !section.hidden);
      (first || feedback).scrollIntoView({block: 'start', behavior: 'smooth'});
      setMenu(false);
    }
  });
  navLinks.forEach(link => link.addEventListener('click', () => { clearSearch(); setMenu(false); }));
  window.addEventListener('hashchange', clearSearch);
  document.addEventListener('paperbank:annotation-focus', clearSearch);
  document.addEventListener('keydown', event => {
    const editing = event.target.closest('input, textarea, select, [contenteditable="true"]');
    if (event.key === '/' && !editing && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault(); search.focus();
    }
    if (event.key === 'Escape') { clearSearch(); setMenu(false, document.body.classList.contains('menu-open')); }
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin: '-15% 0px -65% 0px'});
    [...sections, document.getElementById('reading'), document.getElementById('footprints')].forEach(section => observer.observe(section));
  }
  const copy = document.getElementById('copy-note');
  const note = document.getElementById('note-template');
  const copyStatus = document.getElementById('copy-status');
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(note.textContent);
      copyStatus.textContent = '已复制，可以粘贴到自己的笔记里。';
    } catch {
      const range = document.createRange(); range.selectNodeContents(note);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      copyStatus.textContent = '模板已选中，请按 Ctrl+C（Mac 按 ⌘C）复制。';
    }
  });
})();
