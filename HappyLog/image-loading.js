(() => {
  "use strict";
  const tracked = new WeakMap();
  let originalDialog;
  let originalImage;
  let originalStatus;
  let originalRetry;
  let returnFocus;
  let originalVersion = 0;
  function openOriginal(image, trigger) {
    let url;
    try { url = new URL(image.dataset.originalSrc || image.getAttribute("src"), location.href); } catch { return; }
    if (!["http:", "https:"].includes(url.protocol)) return;
    if (!originalDialog) {
      originalDialog = document.createElement("dialog");
      originalDialog.className = "image-original-dialog";
      originalDialog.setAttribute("aria-label", "查看原图");
      originalDialog.dataset.imageLoading = "off";
      const tools = document.createElement("div");
      tools.className = "image-original-tools";
      const external = document.createElement("a");
      external.className = "image-original-external";
      external.textContent = "新标签页打开原图 ↗";
      external.target = "_blank";
      external.rel = "noopener noreferrer";
      const close = document.createElement("button");
      close.type = "button";
      close.textContent = "关闭 ×";
      close.addEventListener("click", () => originalDialog.close());
      tools.append(external, close);
      const stage = document.createElement("div");
      stage.className = "image-original-stage";
      originalImage = document.createElement("img");
      originalImage.decoding = "async";
      originalStatus = document.createElement("p");
      originalStatus.className = "image-original-status";
      originalStatus.setAttribute("role", "status");
      originalRetry = document.createElement("button");
      originalRetry.className = "image-original-retry";
      originalRetry.type = "button";
      originalRetry.textContent = "重新加载原图";
      originalRetry.hidden = true;
      originalRetry.addEventListener("click", () => loadOriginal(originalDialog.dataset.originalUrl));
      stage.append(originalImage, originalStatus, originalRetry);
      originalDialog.append(tools, stage);
      originalImage.addEventListener("load", async () => {
        const version = originalVersion;
        try { await originalImage.decode(); } catch {}
        if (version !== originalVersion || !originalDialog.open) return;
        originalImage.hidden = false;
        originalStatus.hidden = true;
        originalRetry.hidden = true;
      });
      originalImage.addEventListener("error", () => {
        if (!originalDialog.open) return;
        originalStatus.textContent = "原图暂时无法载入，可以重试或在新标签页打开。";
        originalRetry.hidden = false;
      });
      originalDialog.addEventListener("click", event => {
        if (event.target !== originalDialog) return;
        const bounds = originalDialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) originalDialog.close();
      });
      originalDialog.addEventListener("close", () => {
        originalVersion += 1;
        originalImage.removeAttribute("src");
        returnFocus?.focus();
      });
      document.body.append(originalDialog);
    }
    if (typeof originalDialog.showModal !== "function") { window.open(url.href, "_blank", "noopener,noreferrer"); return; }
    returnFocus = trigger;
    originalDialog.dataset.originalUrl = url.href;
    originalDialog.querySelector(".image-original-external").href = url.href;
    originalImage.alt = image.alt;
    if (!originalDialog.open) originalDialog.showModal();
    loadOriginal(url.href);
  }
  function loadOriginal(url) {
    originalVersion += 1;
    originalImage.hidden = true;
    originalStatus.hidden = false;
    originalStatus.textContent = "正在载入原图……";
    originalRetry.hidden = true;
    originalImage.src = url;
  }
  const hasSource = image => Boolean(image.getAttribute("src")?.trim() || image.getAttribute("srcset")?.trim() || image.closest("picture")?.querySelector("source[srcset]"));
  function setState(record, state) {
    record.frame.dataset.imageState = state;
    record.frame.setAttribute("aria-busy", String(state === "loading"));
    record.overlay.hidden = state === "ready";
    record.label.textContent = state === "error" ? "图片暂未载入" : "图片载入中";
    record.retryPanel.hidden = state !== "error";
    record.retry.disabled = state !== "error";
  }
  function failed(record) {
    record.version += 1;
    setState(record, "error");
  }
  async function decoded(record) {
    const version = record.version;
    const selected = record.image.currentSrc || record.image.src;
    try { if (typeof record.image.decode === "function") await record.image.decode(); }
    catch {
      if (version !== record.version) return;
      if (!record.image.complete || !record.image.naturalWidth) { failed(record); return; }
    }
    if (version !== record.version || selected !== (record.image.currentSrc || record.image.src)) return;
    if (record.image.naturalWidth) setState(record, "ready");
    else failed(record);
  }
  function begin(record, inspect = true) {
    record.version += 1;
    setState(record, "loading");
    if (inspect && record.image.complete) {
      if (record.image.naturalWidth) decoded(record);
      else if (hasSource(record.image)) failed(record);
    }
  }
  function watch(image) {
    if (tracked.has(image) || !hasSource(image) || image.closest("dialog, [data-image-loading='off']")) return;
    const media = image.parentElement?.tagName === "PICTURE" ? image.parentElement : image;
    const action = media.closest("a, button");
    const frame = document.createElement("span");
    frame.className = "image-load-frame";
    const overlay = document.createElement("span");
    overlay.className = "image-load-overlay";
    overlay.setAttribute("aria-hidden", "true");
    const runner = document.createElement("span");
    runner.className = "image-load-runner";
    const dog = document.createElement("span");
    dog.className = "image-load-dog";
    const treadmill = document.createElement("span");
    treadmill.className = "image-load-treadmill";
    runner.append(dog, treadmill);
    const label = document.createElement("span");
    overlay.append(runner, label);
    const retryPanel = document.createElement("span");
    retryPanel.className = "image-load-retry";
    retryPanel.hidden = true;
    const error = document.createElement("span");
    error.textContent = "图片未能加载。";
    const retry = document.createElement("button");
    retry.type = "button";
    retry.textContent = "重试";
    retry.setAttribute("aria-label", image.alt ? `重新加载图片：${image.alt}` : "重新加载图片");
    retryPanel.append(error, retry);
    const record = { image, frame, overlay, label, retryPanel, retry, version: 0 };
    tracked.set(image, record);
    media.before(frame);
    frame.append(media, overlay);
    // Retry controls sit outside existing cover links and photo buttons.
    (action || frame).after(retryPanel);
    if (!action && image.matches(".scene-illustration img, .hero-image img, .story-photo img")) {
      frame.classList.add("image-original-open");
      frame.tabIndex = 0;
      frame.setAttribute("role", "button");
      frame.setAttribute("aria-label", `查看原图：${image.alt || "故事插画"}`);
      frame.addEventListener("click", () => openOriginal(image, frame));
      frame.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openOriginal(image, frame); }
      });
    }
    image.addEventListener("load", () => decoded(record));
    image.addEventListener("error", () => failed(record));
    retry.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      begin(record, false);
      const picture = image.closest("picture");
      picture?.querySelectorAll("source[srcset]").forEach(source => source.setAttribute("srcset", source.getAttribute("srcset")));
      for (const attribute of ["srcset", "src"]) {
        if (image.hasAttribute(attribute)) image.setAttribute(attribute, image.getAttribute(attribute));
      }
    });
    begin(record);
  }
  function scan(node) {
    if (node.nodeType !== 1) return;
    if (node.tagName === "IMG") watch(node);
    node.querySelectorAll("img").forEach(watch);
  }
  document.querySelectorAll("main").forEach(main => {
    scan(main);
    new MutationObserver(changes => {
      const refresh = new Set();
      for (const change of changes) {
        if (change.type === "childList") change.addedNodes.forEach(scan);
        else {
          const image = change.target.tagName === "IMG" ? change.target : change.target.closest("picture")?.querySelector("img");
          if (image) refresh.add(image);
        }
      }
      for (const image of refresh) {
        if (tracked.has(image)) begin(tracked.get(image));
        else watch(image);
      }
    }).observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ["src", "srcset", "sizes", "media"] });
  });
})();
