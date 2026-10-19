(() => {
  "use strict";
  const root = document.documentElement;
  const storageKey = (document.body.dataset.story || "ragged-man") + "-reader-v1";
  let preferences = { font: "normal", theme: "day", chapter: "" };
  let storageAvailable = true;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (saved && typeof saved === "object") {
      if (["small", "normal", "large"].includes(saved.font)) preferences.font = saved.font;
      if (["day", "night"].includes(saved.theme)) preferences.theme = saved.theme;
      if (typeof saved.chapter === "string") preferences.chapter = saved.chapter;
    }
  } catch { storageAvailable = false; }
  const bookmarkNote = document.getElementById("bookmark-note");
  const save = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(preferences)); }
    catch {
      storageAvailable = false;
      bookmarkNote.textContent = "当前浏览器未允许保存；本次仍可正常阅读。";
    }
  };
  if (!storageAvailable) bookmarkNote.textContent = "当前浏览器未允许保存；本次仍可正常阅读。";
  const themeButton = document.getElementById("theme-toggle");
  const applyPreferences = () => {
    root.dataset.font = preferences.font;
    root.dataset.theme = preferences.theme;
    document.querySelectorAll("button[data-font]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.font === preferences.font)));
    const night = preferences.theme === "night";
    themeButton.setAttribute("aria-pressed", String(night));
    themeButton.innerHTML = night ? '<span aria-hidden="true">☀</span> 日间阅读' : '<span aria-hidden="true">☾</span> 夜间阅读';
  };
  applyPreferences();
  document.getElementById("reader-tools").hidden = false;
  document.querySelectorAll("button[data-font]").forEach(button => button.addEventListener("click", () => {
    preferences.font = button.dataset.font;
    applyPreferences();
    save();
  }));
  themeButton.addEventListener("click", () => {
    preferences.theme = preferences.theme === "night" ? "day" : "night";
    applyPreferences();
    save();
  });

  document.querySelectorAll(".roster-portrait").forEach(button => button.addEventListener("click", () => {
    const unmasked = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(unmasked));
    button.setAttribute("aria-label", button.dataset.portraitName + (unmasked ? "，当前摘下面具，点击戴上面具" : "，当前戴着面具，点击摘下面具"));
    button.querySelector(".portrait-hint").innerHTML = (unmasked ? "点击戴上面具" : "点击摘下面具") + ' <span>↻</span>';
  }));

  const chapters = [...document.querySelectorAll("[data-chapter], #afterword")];
  const chapterLinks = [...document.querySelectorAll(".chapter-nav a")];
  const storyboardButton = document.getElementById("storyboard-toggle");
  let fullTextChapter = "";
  const setStoryMode = (storyboard, target) => {
    root.dataset.readingMode = storyboard ? "storyboard" : "full";
    storyboardButton?.setAttribute("aria-pressed", String(storyboard));
    if (storyboardButton) storyboardButton.textContent = storyboard ? "返回图文阅读" : "看图回顾";
    target?.scrollIntoView({ block: "start" });
    requestReadingUpdate();
  };
  storyboardButton?.addEventListener("click", () => {
    const storyboard = root.dataset.readingMode !== "storyboard";
    const visible = chapters.find(chapter => chapter.getBoundingClientRect().bottom > 100);
    if (storyboard) fullTextChapter = visible?.id || "chapter-1";
    const target = storyboard
      ? chapters.find(chapter => chapter.querySelector(".scene-illustration") && chapter.getBoundingClientRect().bottom > 100)
      : document.getElementById(fullTextChapter);
    setStoryMode(storyboard, target);
  });
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener("click", () => {
    if (root.dataset.readingMode !== "storyboard") return;
    const target = document.getElementById(link.hash.slice(1));
    if (target && !target.querySelector(".scene-illustration")) setStoryMode(false);
  }));
  const resumeLink = document.getElementById("resume-link");
  const savedChapter = chapters.find(chapter => chapter.id === preferences.chapter);
  if (savedChapter) {
    resumeLink.href = "#" + savedChapter.id;
    resumeLink.textContent = "继续读：" + (savedChapter.dataset.chapter || "骰子停下之后") + " ↗";
    resumeLink.hidden = false;
  }
  const progressBar = document.getElementById("progress-bar");
  let scheduled = false;
  const updateReading = () => {
    scheduled = false;
    const scrollRoom = document.documentElement.scrollHeight - innerHeight;
    progressBar.style.width = (scrollRoom > 0 ? Math.max(0, Math.min(100, scrollY / scrollRoom * 100)) : 100) + "%";
    const readingLine = Math.min(180, innerHeight * .24);
    const active = chapters.filter(chapter => chapter.getClientRects().length && chapter.getBoundingClientRect().top <= readingLine).at(-1);
    chapterLinks.forEach(link => {
      const current = Boolean(active && link.hash === "#" + active.id);
      link.classList.toggle("is-active", current);
      if (current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    if (active && preferences.chapter !== active.id) {
      preferences.chapter = active.id;
      save();
    }
  };
  const requestReadingUpdate = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateReading); } };
  addEventListener("scroll", requestReadingUpdate, { passive: true });
  addEventListener("resize", requestReadingUpdate, { passive: true });
  addEventListener("load", requestReadingUpdate, { once: true });
  updateReading();

  const photoButtons = [...document.querySelectorAll(".photo-open")];
  const dialog = document.getElementById("photo-dialog");
  const fullPhoto = document.getElementById("photo-full");
  const counter = document.getElementById("photo-counter");
  const caption = document.getElementById("photo-caption");
  if (!photoButtons.length || !dialog) return;
  let currentPhoto = 0;
  let returnFocus = null;
  const showPhoto = index => {
    currentPhoto = (index + photoButtons.length) % photoButtons.length;
    const button = photoButtons[currentPhoto];
    const image = button.querySelector("img");
    fullPhoto.src = image.src;
    fullPhoto.alt = image.alt;
    caption.textContent = button.closest("figure").querySelector("figcaption").textContent.trim();
    counter.textContent = String(currentPhoto + 1).padStart(2, "0") + " / " + String(photoButtons.length).padStart(2, "0");
  };
  photoButtons.forEach((button, index) => button.addEventListener("click", () => {
    if (typeof dialog.showModal !== "function") {
      window.open(button.querySelector("img").src, "_blank", "noopener,noreferrer");
      return;
    }
    returnFocus = button;
    showPhoto(index);
    dialog.showModal();
    document.getElementById("photo-close").focus();
  }));
  document.getElementById("photo-close").addEventListener("click", () => dialog.close());
  document.getElementById("photo-prev").addEventListener("click", () => showPhoto(currentPhoto - 1));
  document.getElementById("photo-next").addEventListener("click", () => showPhoto(currentPhoto + 1));
  dialog.addEventListener("click", event => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
  });
  dialog.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") { event.preventDefault(); showPhoto(currentPhoto - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); showPhoto(currentPhoto + 1); }
  });
  dialog.addEventListener("close", () => { fullPhoto.src = ""; returnFocus?.focus(); });
})();
