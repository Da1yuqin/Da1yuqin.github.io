(() => {
  "use strict";
  const mode = document.body.dataset.access;
  if (!mode) return;
  const tokenKey = "happylog-access-token-v1";
  let token = "";
  try { token = sessionStorage.getItem(tokenKey) || ""; } catch {}
  const saveToken = value => {
    const changed = token !== (value || "");
    token = value || "";
    try {
      if (token) sessionStorage.setItem(tokenKey, token);
      else sessionStorage.removeItem(tokenKey);
    } catch {}
    if (changed) document.dispatchEvent(new Event("day-session-changed"));
  };
  const apiUrl = path => {
    const base = String(window.HAPPYLOG_API_BASE || "").replace(/\/+$/, "");
    return base + (base.endsWith("/api") ? path.replace(/^\/api(?=\/)/, "") : path);
  };
  class AccessError extends Error {
    constructor(message, status = 0, details = {}) {
      super(message);
      this.status = status;
      this.requiresTotp = Boolean(details.requiresTotp);
    }
  }
  async function request(path, method = "GET", body) {
    const headers = { Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) headers["Content-Type"] = "application/json";
    let response;
    try {
      response = await fetch(apiUrl(path), {
        method, headers, cache: "no-store",
        ...(body === undefined ? {} : { body: JSON.stringify(body) })
      });
    } catch { throw new AccessError("暂时无法连接，请稍后再试。"); }
    let result;
    try { result = await response.json(); }
    catch { throw new AccessError("服务返回异常，请稍后再试。", response.status); }
    if (!response.ok) throw new AccessError(result.error || "操作没有完成，请重试。", response.status, result);
    return result;
  }
  const status = (node, message = "", kind = "") => {
    if (!node) return;
    node.textContent = message;
    node.dataset.kind = kind;
  };
  const pending = (form, busy) => {
    form.setAttribute("aria-busy", String(busy));
    form.querySelectorAll("button, input, select").forEach(node => { node.disabled = busy; });
  };
  async function logout() {
    try { await request("/api/logout", "POST", {}); }
    finally { saveToken(""); }
  }
  const clearCreatedCode = () => {
    const result = document.getElementById("created-invite");
    if (result) result.hidden = true;
    const code = document.getElementById("created-invite-code");
    if (code) code.textContent = "";
    status(document.getElementById("copy-status"));
  };

  function reader() {
    const bar = document.createElement("div");
    bar.id = "access-reader-bar";
    bar.className = "access-reader-bar";
    const message = document.createElement("span");
    message.setAttribute("role", "status");
    message.setAttribute("aria-live", "polite");
    message.textContent = "正在确认阅读权限……";
    const exit = document.createElement("button");
    exit.className = "access-text-button";
    exit.type = "button";
    exit.textContent = "退出登录";
    bar.append(message, exit);
    const header = document.querySelector(".site-header");
    if (header) header.after(bar);
    else document.body.prepend(bar);
    let checking = false;
    const leaveReader = () => {
      document.dispatchEvent(new Event("day-reader-unloaded"));
      location.reload();
    };
    async function checkSession() {
      if (checking) return;
      if (!token) { leaveReader(); return; }
      checking = true;
      try {
        const session = await request("/api/session");
        if (!session.authenticated) { saveToken(""); leaveReader(); return; }
        if (session.role !== "admin" && !session.allowedStories.includes(document.body.dataset.story)) { leaveReader(); return; }
        message.textContent = session.role === "admin" ? `${session.username || "管理员"} · 阅读中` : "已获阅读权限";
      } catch (error) {
        if (error.status === 401 || error.status === 403) { saveToken(""); leaveReader(); }
        else message.textContent = "暂时无法确认登录状态，返回此页时会重新检查。";
      } finally { checking = false; }
    }
    exit.addEventListener("click", async () => {
      exit.disabled = true;
      document.dispatchEvent(new Event("day-reader-unloaded"));
      try { await logout(); }
      finally { saveToken(""); leaveReader(); }
    });
    window.addEventListener("pageshow", event => { if (event.persisted) checkSession(); });
    document.addEventListener("day-reader-access-denied", leaveReader);
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") checkSession(); });
    setInterval(() => { if (document.visibilityState === "visible") checkSession(); }, 30000);
    checkSession();
  }

  async function gate() {
    const form = document.getElementById("reader-login-form");
    const message = document.getElementById("access-status");
    const slug = document.body.dataset.story;
    if (!form || !slug) return;
    let loading = false;
    async function openStory() {
      const result = await request(`/api/stories/${encodeURIComponent(slug)}`);
      if (typeof result.html !== "string" || !result.html.trim()) throw new AccessError("正文暂时无法载入，请稍后再试。");
      // The server supplies a complete authenticated reader document, including
      // its own scripts. No story HTML is cached in browser storage.
      document.open();
      document.write(result.html);
      document.close();
    }
    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (loading) return;
      const code = new FormData(form).get("code").trim();
      if (!code) { status(message, "请填写邀请码。", "error"); return; }
      loading = true;
      pending(form, true);
      status(message, "正在打开故事……");
      try {
        const result = await request("/api/reader/login", "POST", { code });
        saveToken(result.token);
        form.reset();
        await openStory();
      } catch (error) {
        if (error.status === 401) saveToken("");
        status(message, error.message, "error");
      } finally { loading = false; pending(form, false); }
    });
    if (token) {
      loading = true;
      pending(form, true);
      status(message, "正在恢复阅读……");
      try { await openStory(); }
      catch (error) {
        if (error.status === 401) {
          saveToken("");
          status(message, "阅读凭证已过期，请重新填写邀请码。");
        } else status(message, error.message, "error");
      } finally { loading = false; pending(form, false); }
    }
  }

  async function admin() {
    const byId = id => document.getElementById(id);
    const loginPanel = byId("admin-login-panel");
    const dashboard = byId("admin-dashboard");
    const loginForm = byId("admin-login-form");
    const loginStatus = byId("admin-login-status");
    const inviteForm = byId("invite-form");
    const inviteStatus = byId("invite-status");
    const listStatus = byId("invite-list-status");
    const list = byId("invite-list");
    const permissionList = byId("invite-story-options");
    const passwordForm = byId("admin-password-form");
    const startForm = byId("totp-start-form");
    const confirmForm = byId("totp-confirm-form");
    const disableForm = byId("totp-disable-form");
    const securityStatus = byId("security-status");
    const loadingPanel = document.createElement("div");
    loadingPanel.className = "admin-loading";
    loadingPanel.hidden = true;
    loadingPanel.setAttribute("role", "status");
    loadingPanel.setAttribute("aria-live", "polite");
    const loadingSpinner = document.createElement("span");
    loadingSpinner.className = "admin-loading-spinner";
    loadingSpinner.setAttribute("aria-hidden", "true");
    const loadingMessage = document.createElement("span");
    const loadingRetry = document.createElement("button");
    loadingRetry.className = "access-text-button";
    loadingRetry.type = "button";
    loadingRetry.textContent = "重新载入";
    loadingRetry.hidden = true;
    loadingPanel.append(loadingSpinner, loadingMessage, loadingRetry);
    loginPanel.before(loadingPanel);
    let loadingSession = null;
    function setAdminLoading(busy, message = "", retry = false) {
      loadingPanel.hidden = !busy && !message;
      loadingPanel.dataset.state = busy ? "loading" : "error";
      loadingMessage.textContent = message;
      loadingRetry.hidden = !retry;
      loadingRetry.disabled = busy;
      dashboard.setAttribute("aria-busy", String(busy));
    }
    let stories = [];
    let invites = [];
    let blogPosts = [];
    let editing = "";
    let articlePost = null;
    let articleDraft = null;
    let articleDirty = false;
    let articleMode = "visual";
    let articleLoading = false;
    let articleVersion = 0;
    let security = { totpEnabled: false };
    const sectionIds = ["overview", "blog-posts", "story-library", "invites", "account-security"];
    const storyEntries = () => stories.filter(story => story.kind !== "blog" && !String(story.slug).startsWith("blog-"));
    function renderOverview() {
      const values = {
        "stat-blog-total": blogPosts.length,
        "stat-blog-public": blogPosts.filter(post => post.visibility === "public").length,
        "stat-blog-private": blogPosts.filter(post => post.visibility === "private").length,
        "stat-story-total": storyEntries().length,
        "stat-invite-active": invites.filter(invite => invite.active && (!invite.expiresAt || new Date(invite.expiresAt).getTime() > Date.now())).length
      };
      for (const [id, value] of Object.entries(values)) if (byId(id)) byId(id).textContent = String(value);
    }
    function syncSectionNavigation() {
      const section = location.hash.startsWith("#edit=") ? "blog-posts" : sectionIds.includes(location.hash.slice(1)) ? location.hash.slice(1) : "overview";
      dashboard.querySelectorAll(".admin-section-nav a").forEach(link => {
        if (link.hash === `#${section}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
    function contentLink(route, label) {
      let url;
      try { url = new URL(route, location.href); } catch {}
      const link = document.createElement(url && ["http:", "https:"].includes(url.protocol) ? "a" : "span");
      link.className = "admin-content-link";
      link.textContent = label;
      if (link.tagName === "A") link.href = url.href;
      return link;
    }
    function renderStories() {
      const entries = storyEntries();
      const host = byId("admin-story-list");
      if (!host) return;
      host.replaceChildren();
      byId("admin-story-count").textContent = `${entries.length} 篇`;
      entries.forEach((story, index) => {
        const card = document.createElement("article");
        card.className = "admin-story-card";
        const number = document.createElement("span");
        number.className = "admin-story-number";
        number.textContent = String(index + 1).padStart(2, "0");
        const detail = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = story.title;
        const route = !story.route || story.route === `/${story.slug}.html` ? `/HappyLog/${encodeURIComponent(story.slug)}.html` : story.route;
        const path = document.createElement("p");
        path.className = "access-help";
        path.textContent = route;
        detail.append(title, path);
        card.append(number, detail, contentLink(route, "打开阅读 →"));
        host.append(card);
      });
      if (!entries.length) {
        const empty = document.createElement("p");
        empty.className = "access-empty";
        empty.textContent = "还没有跑团故事。";
        host.append(empty);
      }
      renderOverview();
    }
    const field = (data, name) => String(data.get(name) || "").trim();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dateLabel = value => new Date(value).toLocaleString("zh-CN", {
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZoneName: "longOffset"
    }) + ` (${timezone})`;
    byId("invite-timezone").textContent = `当前时区：${timezone}。留空则长期有效。`;
    function localDate(value) {
      if (!value) return "";
      const date = new Date(value);
      if (!Number.isFinite(date.getTime())) return "";
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
    }
    function syncFactor(form) {
      const selected = form.querySelector('input[name="factor"]:checked')?.value || "otp";
      const busy = form.getAttribute("aria-busy") === "true";
      const required = form === disableForm || form.dataset.requiresTotp === "true";
      form.querySelectorAll("[data-factor-field]").forEach(group => {
        const active = group.dataset.factorField === selected;
        group.hidden = !active;
        group.querySelectorAll("input").forEach(input => {
          input.disabled = !active || busy;
          input.required = active && required;
        });
      });
    }
    for (const form of [loginForm, disableForm]) {
      form.querySelectorAll('input[name="factor"]').forEach(input => input.addEventListener("change", () => syncFactor(form)));
      syncFactor(form);
    }
    function clearSetup() {
      byId("totp-setup").hidden = true;
      byId("totp-qr").replaceChildren();
      byId("totp-secret").textContent = "";
      byId("totp-setup-expiry").textContent = "";
      startForm.reset();
      confirmForm.reset();
      status(byId("totp-confirm-status"));
      startForm.hidden = security.totpEnabled;
    }
    function clearRecoveryCodes() {
      byId("admin-recovery-panel").hidden = true;
      byId("recovery-codes").replaceChildren();
      status(byId("recovery-copy-status"));
    }
    function showLogin(message = "", kind = "") {
      loadingSession = null;
      setAdminLoading(false);
      loginPanel.hidden = false;
      dashboard.hidden = true;
      if (articlePost && articleDirty) articleDraft = { ...articlePost, title: byId("article-editor-title").value, html: currentArticleHtml() };
      clearArticleEditor();
      blogPosts = [];
      byId("admin-blog-list").replaceChildren();
      byId("admin-story-list").replaceChildren();
      list.replaceChildren();
      clearCreatedCode();
      clearSetup();
      clearRecoveryCodes();
      for (const form of [loginForm, inviteForm, passwordForm, disableForm]) form.reset();
      loginForm.dataset.requiresTotp = "false";
      byId("login-factor-details").open = false;
      syncFactor(loginForm);
      syncFactor(disableForm);
      status(loginStatus, message, kind);
    }
    async function adminError(error, node) {
      if (error.status === 401) {
        try {
          const session = await request("/api/session");
          if (session.authenticated && session.role === "admin") { status(node, error.message, "error"); return; }
        } catch { status(node, error.message, "error"); return; }
      }
      if (error.status === 401 || error.status === 403) {
        saveToken("");
        showLogin("管理凭证已失效，请重新登录。", "error");
      } else status(node, error.message, "error");
    }
    function selectForCopy(node) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    async function copyText(text, visibleNode, message) {
      try {
        await navigator.clipboard.writeText(text);
        status(message, "已复制。", "success");
      } catch {
        visibleNode.hidden = false;
        selectForCopy(visibleNode);
        status(message, "已选中内容，请手动复制。");
      }
    }
    function renderPermissions(selected = []) {
      permissionList.replaceChildren();
      for (const [kind, heading] of [["story", "跑团故事"], ["blog", "博客文章"]]) {
        const entries = stories.filter(story => (story.kind === "blog" ? "blog" : "story") === kind);
        if (!entries.length) continue;
        const group = document.createElement("div");
        group.className = "access-permission-group";
        const title = document.createElement("h4");
        title.textContent = heading;
        group.append(title);
        for (const story of entries) {
          const label = document.createElement("label");
          label.className = "access-choice";
          const input = document.createElement("input");
          input.type = "checkbox";
          input.name = "allowedStories";
          input.value = story.slug;
          input.checked = selected.includes(story.slug);
          const text = document.createElement("span");
          text.textContent = story.title;
          label.append(input, text);
          group.append(label);
        }
        permissionList.append(group);
      }
    }
    function resetEditor() {
      editing = "";
      inviteForm.reset();
      renderPermissions();
      byId("invite-form-title").textContent = "创建邀请码";
      byId("invite-submit").textContent = "创建邀请码";
      byId("invite-code-label").textContent = "邀请码 · 可自填";
      byId("invite-code-help").textContent = "留空自动生成；自填需为 6 至 128 个非空白字符。";
      inviteForm.elements.code.placeholder = "自行填写，或留空自动生成";
      byId("invite-cancel").hidden = true;
      status(inviteStatus);
    }
    function editInvite(invite) {
      clearCreatedCode();
      editing = invite.id;
      inviteForm.elements.label.value = invite.label || "";
      inviteForm.elements.code.value = "";
      inviteForm.elements.expiresAt.value = localDate(invite.expiresAt);
      renderPermissions(invite.allowedStories);
      byId("invite-form-title").textContent = "编辑邀请码";
      byId("invite-submit").textContent = "保存修改";
      byId("invite-code-label").textContent = "重新设置邀请码";
      byId("invite-code-help").textContent = "留空保留原码；填写新码后，原码及其已有阅读凭证将失效。";
      inviteForm.elements.code.placeholder = "输入新邀请码，或留空保留原码";
      byId("invite-cancel").hidden = false;
      status(inviteStatus, `正在编辑 ${invite.codeHint}`);
      inviteForm.scrollIntoView({ behavior: "smooth", block: "center" });
      inviteForm.elements.label.focus({ preventScroll: true });
    }
    function actionButton(label, handler) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "access-text-button";
      button.textContent = label;
      button.addEventListener("click", handler);
      return button;
    }
    function renderInvites() {
      list.replaceChildren();
      byId("invite-count").textContent = `${invites.length} 个`;
      renderOverview();
      if (!invites.length) {
        const empty = document.createElement("p");
        empty.className = "access-empty";
        empty.textContent = "还没有邀请码。从创建表单发出第一份阅读邀请。";
        list.append(empty);
        return;
      }
      for (const invite of invites) {
        const expired = invite.expiresAt && new Date(invite.expiresAt).getTime() <= Date.now();
        const card = document.createElement("article");
        card.className = "invite-card";
        const head = document.createElement("div");
        head.className = "invite-card-head";
        const title = document.createElement("h3");
        title.textContent = invite.label || "未命名邀请";
        const state = document.createElement("span");
        state.className = "invite-state";
        state.dataset.active = String(invite.active && !expired);
        state.textContent = !invite.active ? "已停用" : expired ? "已到期" : "使用中";
        head.append(title, state);
        const hint = document.createElement("p");
        hint.className = "invite-hint";
        hint.textContent = invite.codeHint;
        const codeRow = document.createElement("div");
        codeRow.className = "invite-code-row";
        const permitted = document.createElement("p");
        permitted.className = "invite-permissions";
        permitted.textContent = invite.allowedStories.map(slug => stories.find(story => story.slug === slug)?.title || slug).join(" · ") || "未开放内容";
        const bottom = document.createElement("div");
        bottom.className = "invite-card-bottom";
        const expiry = document.createElement("span");
        expiry.textContent = `到期：${invite.expiresAt ? dateLabel(invite.expiresAt) : "长期有效"}`;
        const actions = document.createElement("div");
        actions.className = "invite-actions";
        const message = document.createElement("p");
        message.className = "access-status invite-card-status";
        message.setAttribute("role", "status");
        message.setAttribute("aria-live", "polite");
        if (invite.codeAvailable === false) message.textContent = "旧邀请码需重新设置后才可复制。";
        const fallbackCode = document.createElement("code");
        fallbackCode.className = "invite-copy-code";
        fallbackCode.hidden = true;
        const copy = actionButton("复制", async () => {
          copy.disabled = true;
          fallbackCode.hidden = true;
          fallbackCode.textContent = "";
          status(message, "正在读取邀请码……");
          try {
            const result = await request(`/api/admin/invites/${encodeURIComponent(invite.id)}/code`);
            fallbackCode.textContent = result.code;
            await copyText(result.code, fallbackCode, message);
            if (fallbackCode.hidden) fallbackCode.textContent = "";
          } catch (error) {
            if (error.status === 409) status(message, "重新设置邀请码后可复制。", "error");
            else await adminError(error, message);
          } finally { copy.disabled = false; }
        });
        copy.setAttribute("aria-label", "复制邀请码");
        codeRow.append(hint, copy);
        const edit = actionButton("编辑", () => editInvite(invite));
        const toggle = actionButton(invite.active ? "停用" : "启用", async () => {
          toggle.disabled = true;
          status(message, "正在保存……");
          try {
            const result = await request("/api/admin/invites", "PATCH", { id: invite.id, active: !invite.active });
            invites = invites.map(item => item.id === invite.id ? result.invite : item);
            renderInvites();
            status(listStatus, result.invite.active ? "邀请码已启用。" : "邀请码已停用，已有阅读凭证也将失效。", "success");
          } catch (error) { await adminError(error, message); }
          finally { toggle.disabled = false; }
        });
        const confirmation = document.createElement("div");
        confirmation.className = "invite-delete-confirmation";
        confirmation.hidden = true;
        const question = document.createElement("p");
        question.textContent = "删除这份邀请？它将从列表移除，原有阅读权限也将停止。";
        const confirmDelete = actionButton("确认删除", async () => {
          pending(card, true);
          status(message, "正在删除……");
          try {
            await request(`/api/admin/invites/${encodeURIComponent(invite.id)}`, "DELETE");
            invites = invites.filter(item => item.id !== invite.id);
            if (editing === invite.id) resetEditor();
            clearCreatedCode();
            renderInvites();
            status(listStatus, "邀请码已删除。", "success");
          } catch (error) { await adminError(error, message); }
          finally { pending(card, false); }
        });
        const cancelDelete = actionButton("取消", () => { confirmation.hidden = true; remove.focus(); });
        const remove = actionButton("删除", () => { confirmation.hidden = false; confirmDelete.focus(); });
        remove.classList.add("access-danger");
        confirmDelete.classList.add("access-danger");
        confirmation.append(question, confirmDelete, cancelDelete);
        actions.append(edit, toggle, remove);
        bottom.append(expiry, actions);
        card.append(head, codeRow, permitted, bottom, fallbackCode, confirmation, message);
        list.append(card);
      }
    }
    function renderBlogPosts() {
      const host = byId("admin-blog-list");
      host.replaceChildren();
      byId("admin-blog-count").textContent = `${blogPosts.length} 篇`;
      for (const post of blogPosts) {
        const card = document.createElement("article");
        card.className = "invite-card blog-visibility-card";
        const head = document.createElement("div");
        head.className = "invite-card-head";
        const title = document.createElement("h3");
        title.textContent = post.title;
        const state = document.createElement("span");
        state.className = "invite-state";
        state.dataset.active = String(post.visibility === "public");
        state.textContent = post.visibility === "public" ? "公开" : "私密";
        head.append(title, state);
        const route = document.createElement("p");
        route.className = "access-help";
        route.append(contentLink(post.route, post.route || "查看文章 →"));
        const change = actionButton(post.visibility === "public" ? "设为私密" : "设为公开", async () => {
          pending(card, true);
          status(byId("admin-blog-status"), "正在保存……");
          try {
            await request("/api/admin/blog/posts", "PATCH", { slug: post.slug, visibility: post.visibility === "public" ? "private" : "public" });
            blogPosts = (await request("/api/admin/blog/posts")).posts;
            renderBlogPosts();
            status(byId("admin-blog-status"), "文章公开状态已保存。", "success");
          } catch (error) { await adminError(error, byId("admin-blog-status")); }
          finally { pending(card, false); }
        });
        const actions = document.createElement("div");
        actions.className = "article-card-actions";
        const editArticle = actionButton("编辑文章", () => { location.hash = `edit=${encodeURIComponent(post.slug)}`; });
        actions.append(editArticle, change);
        card.append(head, route, actions);
        host.append(card);
      }
      renderOverview();
    }
    function currentArticleHtml() {
      if (articleMode === "html") return byId("article-editor-source").value;
      const content = byId("article-editor-visual").cloneNode(true);
      content.querySelectorAll(".day-image-loader,.day-image-retry").forEach(node => node.remove());
      content.querySelectorAll("img").forEach(image => {
        image.classList.remove("day-image-managed", "day-image-loading");
        image.removeAttribute("aria-busy");
        if (!image.className) image.removeAttribute("class");
      });
      content.querySelectorAll("span.day-image-frame").forEach(frame => frame.replaceWith(...frame.childNodes));
      return content.innerHTML;
    }
    function clearArticleEditor() {
      ++articleVersion;
      articlePost = null;
      articleDirty = false;
      articleLoading = false;
      byId("admin-article-editor").hidden = true;
      byId("article-editor-title").value = "";
      byId("article-editor-visual").replaceChildren();
      byId("article-editor-source").value = "";
      byId("article-editor-meta").textContent = "";
      byId("article-editor-open").href = "#";
      status(byId("article-editor-status"));
    }
    function safeEditorHtml(html) {
      // Source mode can be previewed without activating scripts, frames, or event handlers.
      // The service applies its canonical HTML policy again when saving.
      const doc = new DOMParser().parseFromString(String(html), "text/html");
      doc.querySelectorAll("script,iframe,object,embed,base,meta,link,form,input,button,textarea,select,svg,math").forEach(node => node.remove());
      doc.querySelectorAll("*").forEach(node => {
        [...node.attributes].forEach(attribute => {
          const name = attribute.name.toLowerCase();
          if (name.startsWith("on") || ["srcdoc", "contenteditable", "autofocus"].includes(name)) node.removeAttribute(attribute.name);
          if (["href", "src", "xlink:href", "action"].includes(name) && /^[\s\u0000-\u001f]*(?:javascript|vbscript|data):/i.test(attribute.value)) node.removeAttribute(attribute.name);
          if (name === "style" && /url\s*\(|expression\s*\(|@import/i.test(attribute.value)) node.removeAttribute(attribute.name);
        });
      });
      return doc.body.innerHTML;
    }
    function setArticleMode(mode) {
      const visual = byId("article-editor-visual"), source = byId("article-editor-source");
      if (mode !== articleMode) {
        if (mode === "html") source.value = currentArticleHtml();
        else visual.innerHTML = safeEditorHtml(source.value);
      }
      articleMode = mode;
      visual.hidden = mode !== "visual";
      visual.contentEditable = "true";
      source.hidden = mode !== "html";
      byId("article-editor-tools").hidden = mode !== "visual";
      byId("article-mode-visual").setAttribute("aria-pressed", String(mode === "visual"));
      byId("article-mode-html").setAttribute("aria-pressed", String(mode === "html"));
    }
    function showArticle(post, message = "") {
      articlePost = post;
      byId("article-editor-heading").textContent = "编辑文章";
      byId("article-editor-title").value = post.title || "";
      byId("article-editor-visual").innerHTML = safeEditorHtml(post.html || "");
      byId("article-editor-source").value = post.html || "";
      articleMode = "html";
      setArticleMode("visual");
      const route = post.route || blogPosts.find(item => item.slug === post.slug)?.route;
      const link = contentLink(route, "");
      byId("article-editor-open").href = link.href || "#";
      byId("article-editor-meta").textContent = `${post.visibility === "private" ? "私密文章" : "公开文章"} · 版本 ${post.revision ?? 0}`;
      byId("article-editor-reload").hidden = true;
      byId("admin-article-editor").hidden = false;
      articleDirty = false;
      status(byId("article-editor-status"), message);
    }
    async function openArticle(slug, reload = false) {
      if (articleLoading || !slug || dashboard.hidden) return;
      if (articlePost?.slug === slug && !reload) return;
      if (articleDirty && !confirm("当前文章有未保存的修改。离开编辑会丢弃这些修改，继续吗？")) {
        history.replaceState(null, "", `#edit=${encodeURIComponent(articlePost.slug)}`);
        return;
      }
      articleLoading = true;
      const version = ++articleVersion;
      status(byId("admin-blog-status"), "正在载入文章……");
      try {
        const result = await request(`/api/admin/blog/posts/${encodeURIComponent(slug)}`);
        if (version !== articleVersion || dashboard.hidden) return;
        if (!result.post || typeof result.post.html !== "string") throw new Error("文章正文没有载入成功。");
        showArticle(result.post);
        if (articleDraft?.slug === slug) {
          const draft = articleDraft;
          showArticle({ ...result.post, ...draft }, "已恢复本次会话尚未保存的输入。保存时会检查版本，避免覆盖其他修改。");
          articleDirty = true;
          articleDraft = null;
        }
        status(byId("admin-blog-status"));
        byId("admin-article-editor").scrollIntoView({ block: "start" });
        byId("article-editor-title").focus({ preventScroll: true });
      } catch (error) { await adminError(error, byId("admin-blog-status")); }
      finally { if (version === articleVersion) articleLoading = false; }
    }
    function articleFromHash() {
      if (!location.hash.startsWith("#edit=")) return;
      let slug;
      try { slug = decodeURIComponent(location.hash.slice(6)); } catch { return; }
      openArticle(slug);
    }
    byId("article-mode-visual").addEventListener("click", () => setArticleMode("visual"));
    byId("article-mode-html").addEventListener("click", () => setArticleMode("html"));
    ["article-editor-title", "article-editor-visual", "article-editor-source"].forEach(id => byId(id).addEventListener("input", () => { articleDirty = true; }));
    byId("article-editor-tools").addEventListener("mousedown", event => { if (event.target.closest("button")) event.preventDefault(); });
    byId("article-editor-tools").addEventListener("click", event => {
      const button = event.target.closest("[data-editor-command]");
      if (!button) return;
      const visual = byId("article-editor-visual");
      const selection = window.getSelection();
      if (!selection?.rangeCount || !visual.contains(selection.anchorNode)) visual.focus();
      const command = button.dataset.editorCommand;
      if (command === "link") {
        const value = prompt("链接地址（https://…）");
        if (!value) return;
        let url;
        try { url = new URL(value, location.origin); } catch { return; }
        if (!["https:", "http:", "mailto:"].includes(url.protocol)) return;
        document.execCommand("createLink", false, url.href);
      } else if (["heading", "paragraph", "quote"].includes(command)) document.execCommand("formatBlock", false, { heading: "h2", paragraph: "p", quote: "blockquote" }[command]);
      else document.execCommand(command, false);
      articleDirty = true;
    });
    byId("article-editor-visual").addEventListener("paste", event => {
      const html = event.clipboardData?.getData("text/html");
      if (!html) return;
      event.preventDefault();
      document.execCommand("insertHTML", false, safeEditorHtml(html));
      articleDirty = true;
    });
    byId("article-editor-form").addEventListener("submit", async event => {
      event.preventDefault();
      if (!articlePost || articleLoading) return;
      articleLoading = true;
      const post = articlePost;
      const form = event.currentTarget;
      const title = byId("article-editor-title").value.trim();
      if (!title) { articleLoading = false; byId("article-editor-title").focus(); return; }
      const html = currentArticleHtml();
      pending(form, true);
      byId("article-editor-close").disabled = true;
      byId("article-editor-visual").contentEditable = "false";
      byId("article-editor-source").disabled = true;
      status(byId("article-editor-status"), "正在保存文章……");
      try {
        const result = await request(`/api/admin/blog/posts/${encodeURIComponent(post.slug)}`, "PUT", { title, html, revision: post.revision ?? 0 });
        if (!result.saved || !result.post || typeof result.post.html !== "string") throw new Error("没有收到保存确认，当前输入已保留。");
        const updated = result.post;
        blogPosts = blogPosts.map(item => item.slug === post.slug ? { ...item, ...updated } : item);
        renderBlogPosts();
        showArticle(updated, "已保存，文章页面现在就可以看到更改。");
        byId("article-editor-status").dataset.kind = "success";
        articleDraft = null;
      } catch (error) {
        if (error.status === 409) {
          status(byId("article-editor-status"), "文章已在别处更新。本次输入已保留；请先复制当前 HTML，再载入最新版本合并修改。", "error");
          byId("article-editor-reload").hidden = false;
        } else await adminError(error, byId("article-editor-status"));
      } finally {
        pending(form, false);
        byId("article-editor-close").disabled = false;
        byId("article-editor-visual").contentEditable = "true";
        byId("article-editor-source").disabled = false;
        articleLoading = false;
      }
    });
    byId("article-editor-close").addEventListener("click", () => {
      if (articleLoading) return;
      if (articleDirty && !confirm("有尚未保存的修改，确定关闭编辑吗？")) return;
      articleDraft = null;
      clearArticleEditor();
      location.hash = "blog-posts";
    });
    byId("article-editor-reload").addEventListener("click", () => openArticle(articlePost?.slug, true));
    byId("article-editor-copy").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(currentArticleHtml()); status(byId("article-editor-status"), "当前 HTML 已复制。"); }
      catch { setArticleMode("html"); byId("article-editor-source").focus(); byId("article-editor-source").select(); status(byId("article-editor-status"), "已选中 HTML，请手动复制。"); }
    });
    window.addEventListener("beforeunload", event => { if (articleDirty) { event.preventDefault(); event.returnValue = ""; } });
    function renderSecurity() {
      const enabled = security.totpEnabled;
      byId("security-state").textContent = enabled ? "已启用" : "未绑定";
      byId("security-state").dataset.active = String(enabled);
      byId("security-description").textContent = enabled
        ? `已使用验证器保护管理员登录。${Number.isInteger(security.recoveryCodesRemaining) ? `剩余恢复码：${security.recoveryCodesRemaining} 个。` : ""}`
        : security.pendingSetup ? "上次绑定尚未完成。验证当前密码后，可以重新生成二维码。" : "绑定验证器后，登录时除密码外，还需要六位验证码或一次性恢复码。";
      startForm.hidden = enabled;
      byId("totp-disable").hidden = !enabled;
    }
    function renderQr(uri) {
      if (typeof window.qrcode !== "function") throw new Error("QR unavailable");
      const qr = window.qrcode(0, "M");
      qr.addData(uri);
      qr.make();
      const count = qr.getModuleCount();
      const size = count + 8;
      const namespace = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(namespace, "svg");
      svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "绑定管理员验证器的二维码");
      const background = document.createElementNS(namespace, "rect");
      background.setAttribute("width", String(size));
      background.setAttribute("height", String(size));
      background.setAttribute("fill", "#fff");
      const pixels = document.createElementNS(namespace, "path");
      let path = "";
      for (let row = 0; row < count; row++) for (let column = 0; column < count; column++) {
        if (qr.isDark(row, column)) path += `M${column + 4} ${row + 4}h1v1h-1z`;
      }
      pixels.setAttribute("d", path);
      pixels.setAttribute("fill", "#17221c");
      pixels.setAttribute("shape-rendering", "crispEdges");
      svg.append(background, pixels);
      byId("totp-qr").replaceChildren(svg);
    }
    function showRecoveryCodes(codes) {
      const container = byId("recovery-codes");
      container.replaceChildren();
      for (const value of codes) {
        const code = document.createElement("code");
        code.textContent = value;
        container.append(code);
      }
      byId("admin-recovery-panel").hidden = false;
      byId("admin-recovery-panel").scrollIntoView({ behavior: "smooth", block: "center" });
    }
    async function openDashboard(session) {
      loadingSession = session;
      setAdminLoading(true, "正在载入管理总览……");
      try {
      const [result, settings, blog] = await Promise.all([request("/api/admin/invites"), request("/api/admin/security"), request("/api/admin/blog/posts")]);
      stories = result.stories;
      invites = result.invites;
      security = settings;
      blogPosts = blog.posts;
      byId("admin-username").textContent = session.username || "管理员";
      resetEditor();
      clearSetup();
      renderInvites();
      renderSecurity();
      renderBlogPosts();
      renderStories();
      loginPanel.hidden = true;
      dashboard.hidden = false;
      loginForm.reset();
      syncFactor(loginForm);
      status(listStatus);
      status(securityStatus);
      status(byId("admin-blog-status"));
      syncSectionNavigation();
      articleFromHash();
      if (sectionIds.includes(location.hash.slice(1))) byId(location.hash.slice(1)).scrollIntoView({ block: "start" });
      setAdminLoading(false);
      } catch (error) {
        setAdminLoading(false, error.message, true);
        throw error;
      }
    }
    loadingRetry.addEventListener("click", async () => {
      loadingRetry.disabled = true;
      try {
        const session = loadingSession || await request("/api/session");
        if (session.role === "admin") await openDashboard(session);
        else showLogin("请使用管理员账号登录。");
      } catch (error) {
        setAdminLoading(false, error.message, true);
        await adminError(error, loadingMessage);
      } finally { loadingRetry.disabled = false; }
    });
    loginForm.addEventListener("submit", async event => {
      event.preventDefault();
      const data = new FormData(loginForm);
      const payload = { username: field(data, "username"), password: String(data.get("password") || "") };
      if (field(data, "factor") === "recovery") {
        if (field(data, "recoveryCode")) payload.recoveryCode = field(data, "recoveryCode");
      } else if (field(data, "otp")) payload.otp = field(data, "otp");
      pending(loginForm, true);
      status(loginStatus, "正在登录……");
      try {
        const result = await request("/api/admin/login", "POST", payload);
        saveToken(result.token);
        await openDashboard(result);
      } catch (error) {
        if (error.requiresTotp) {
          loginForm.dataset.requiresTotp = "true";
          byId("login-factor-details").open = true;
        }
        status(loginStatus, error.message, "error");
      } finally {
        pending(loginForm, false);
        syncFactor(loginForm);
        if (loginForm.dataset.requiresTotp === "true" && !loginPanel.hidden) loginForm.querySelector('[data-factor-field]:not([hidden]) input')?.focus();
      }
    });
    byId("admin-logout").addEventListener("click", async event => {
      if (articleDirty && !confirm("有尚未保存的文章修改，确定退出管理吗？")) return;
      articleDirty = false;
      articleDraft = null;
      event.currentTarget.disabled = true;
      try { await logout(); showLogin("已退出管理。"); }
      catch { showLogin("本机已退出管理。"); }
      finally { event.target.disabled = false; }
    });
    byId("invite-cancel").addEventListener("click", resetEditor);
    inviteForm.addEventListener("submit", async event => {
      event.preventDefault();
      const data = new FormData(inviteForm);
      const allowedStories = data.getAll("allowedStories");
      if (!allowedStories.length) { status(inviteStatus, "请至少选择一篇内容。", "error"); return; }
      const editingId = editing;
      const expires = field(data, "expiresAt");
      const payload = { label: field(data, "label"), allowedStories };
      if (!editingId || expires !== localDate(invites.find(item => item.id === editingId)?.expiresAt)) payload.expiresAt = expires ? new Date(expires).toISOString() : null;
      if (editingId) payload.id = editingId;
      if (field(data, "code")) payload.code = field(data, "code");
      pending(inviteForm, true);
      status(inviteStatus, "正在保存……");
      try {
        const wasEditing = Boolean(editingId);
        const result = await request("/api/admin/invites", wasEditing ? "PATCH" : "POST", payload);
        const { code, ...savedInvite } = result.invite;
        if (wasEditing) invites = invites.map(item => item.id === editingId ? savedInvite : item);
        else invites.unshift(savedInvite);
        if (editing === editingId) resetEditor();
        renderInvites();
        status(inviteStatus, wasEditing ? "修改已保存。" : "邀请码已创建，可以复制给朋友了。", "success");
        if (code) {
          status(byId("copy-status"));
          byId("created-invite-code").textContent = code;
          byId("created-invite").hidden = false;
        }
      } catch (error) { await adminError(error, inviteStatus); }
      finally { pending(inviteForm, false); }
    });
    byId("copy-invite-code").addEventListener("click", () => copyText(byId("created-invite-code").textContent, byId("created-invite-code"), byId("copy-status")));
    byId("dismiss-invite-code").addEventListener("click", clearCreatedCode);
    startForm.addEventListener("submit", async event => {
      event.preventDefault();
      const data = new FormData(startForm);
      pending(startForm, true);
      clearRecoveryCodes();
      status(securityStatus, "正在生成绑定信息……");
      try {
        const result = await request("/api/admin/totp/setup", "POST", { currentPassword: String(data.get("currentPassword") || "") });
        startForm.reset();
        byId("totp-secret").textContent = result.secret;
        byId("totp-setup-expiry").textContent = `本次绑定到期：${dateLabel(result.expiresAt)}`;
        byId("totp-setup").hidden = false;
        startForm.hidden = true;
        try { renderQr(result.otpauthUri); status(securityStatus, "扫描二维码后，输入验证器中的六位验证码。"); }
        catch { byId("totp-qr").replaceChildren(); status(securityStatus, "二维码暂时无法生成，请使用下方手动密钥绑定。"); }
        byId("totp-confirm-code").focus();
      } catch (error) { await adminError(error, securityStatus); }
      finally { pending(startForm, false); }
    });
    byId("totp-setup-cancel").addEventListener("click", () => { clearSetup(); status(securityStatus, "已收起绑定信息。需要时可以重新开始。"); });
    confirmForm.addEventListener("submit", async event => {
      event.preventDefault();
      const code = field(new FormData(confirmForm), "code");
      pending(confirmForm, true);
      status(byId("totp-confirm-status"), "正在确认……");
      try {
        const result = await request("/api/admin/totp/confirm", "POST", { code });
        saveToken(result.token);
        security = { totpEnabled: true, recoveryCodesRemaining: result.recoveryCodes.length };
        clearSetup();
        renderSecurity();
        status(securityStatus, "双重验证已启用。请保存下方恢复码。", "success");
        showRecoveryCodes(result.recoveryCodes);
      } catch (error) { await adminError(error, byId("totp-confirm-status")); }
      finally { pending(confirmForm, false); }
    });
    disableForm.addEventListener("submit", async event => {
      event.preventDefault();
      const data = new FormData(disableForm);
      const payload = { currentPassword: String(data.get("currentPassword") || "") };
      if (field(data, "factor") === "recovery") payload.recoveryCode = field(data, "recoveryCode");
      else payload.code = field(data, "code");
      pending(disableForm, true);
      status(byId("totp-disable-status"), "正在解绑……");
      try {
        await request("/api/admin/totp/disable", "POST", payload);
        saveToken("");
        showLogin("验证器已解绑，所有管理会话已退出。请重新登录。", "success");
      } catch (error) { await adminError(error, byId("totp-disable-status")); }
      finally { pending(disableForm, false); syncFactor(disableForm); }
    });
    byId("copy-recovery-codes").addEventListener("click", () => {
      const text = [...byId("recovery-codes").querySelectorAll("code")].map(node => node.textContent).join("\n");
      copyText(text, byId("recovery-codes"), byId("recovery-copy-status"));
    });
    byId("dismiss-recovery-codes").addEventListener("click", clearRecoveryCodes);
    const passwordStatus = byId("password-status");
    passwordForm.addEventListener("submit", async event => {
      event.preventDefault();
      const data = new FormData(passwordForm);
      if (data.get("newPassword") !== data.get("confirmPassword")) { status(passwordStatus, "两次填写的新密码不一致。", "error"); return; }
      pending(passwordForm, true);
      status(passwordStatus, "正在更改……");
      try {
        await request("/api/admin/password", "POST", { currentPassword: data.get("currentPassword"), newPassword: data.get("newPassword") });
        saveToken("");
        showLogin("密码已更改。所有管理会话已退出，请使用新密码登录。", "success");
      } catch (error) { await adminError(error, passwordStatus); }
      finally { pending(passwordForm, false); }
    });
    window.addEventListener("hashchange", () => { syncSectionNavigation(); articleFromHash(); });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && !dashboard.hidden) renderOverview();
    });
    window.setInterval(() => { if (!dashboard.hidden) renderOverview(); }, 60000);
    if (token) {
      pending(loginForm, true);
      status(loginStatus, "正在恢复管理会话……");
      setAdminLoading(true, "正在确认管理会话……");
      try {
        const session = await request("/api/session");
        if (session.authenticated && session.role === "admin") await openDashboard(session);
        else {
          if (!session.authenticated) saveToken("");
          showLogin(session.authenticated ? "请使用管理员账号登录。" : "请登录管理。");
        }
      } catch (error) {
        setAdminLoading(false, error.message, true);
        await adminError(error, loginStatus);
      }
      finally { pending(loginForm, false); syncFactor(loginForm); }
    }
  }

  if (mode === "gate") gate();
  else if (mode === "admin") admin();
  else if (mode === "reader") reader();
})();
