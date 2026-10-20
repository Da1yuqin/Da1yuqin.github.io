(() => {
  "use strict";
  const mode = document.body.dataset.access;
  if (!mode) return;
  const tokenKey = "happylog-access-token-v1";
  let token = "";
  try { token = sessionStorage.getItem(tokenKey) || ""; } catch {}
  const saveToken = value => {
    token = value || "";
    try {
      if (token) sessionStorage.setItem(tokenKey, token);
      else sessionStorage.removeItem(tokenKey);
    } catch {}
  };
  const apiUrl = path => {
    const base = String(window.HAPPYLOG_API_BASE || "").replace(/\/+$/, "");
    return base + (base.endsWith("/api") ? path.replace(/^\/api(?=\/)/, "") : path);
  };
  class AccessError extends Error {
    constructor(message, status = 0) { super(message); this.status = status; }
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
    if (!response.ok) throw new AccessError(result.error || "操作没有完成，请重试。", response.status);
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
    async function checkSession() {
      if (checking) return;
      if (!token) { location.reload(); return; }
      checking = true;
      try {
        const session = await request("/api/session");
        if (!session.authenticated) { saveToken(""); location.reload(); return; }
        if (session.role !== "admin" && !session.allowedStories.includes(document.body.dataset.story)) { location.reload(); return; }
        message.textContent = session.role === "admin" ? `${session.username || "管理员"} · 阅读中` : "已获阅读权限";
      } catch (error) {
        if (error.status === 401 || error.status === 403) { saveToken(""); location.reload(); }
        else message.textContent = "暂时无法确认登录状态，返回此页时会重新检查。";
      } finally { checking = false; }
    }
    exit.addEventListener("click", async () => {
      exit.disabled = true;
      try { await logout(); }
      finally { saveToken(""); location.reload(); }
    });
    window.addEventListener("pageshow", event => { if (event.persisted) checkSession(); });
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") checkSession(); });
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
    const loginPanel = document.getElementById("admin-login-panel");
    const dashboard = document.getElementById("admin-dashboard");
    const loginForm = document.getElementById("admin-login-form");
    const loginStatus = document.getElementById("admin-login-status");
    const inviteForm = document.getElementById("invite-form");
    const inviteStatus = document.getElementById("invite-status");
    const listStatus = document.getElementById("invite-list-status");
    const list = document.getElementById("invite-list");
    const permissionList = document.getElementById("invite-story-options");
    let stories = [];
    let invites = [];
    let editing = "";
    const showLogin = (message = "", kind = "") => {
      loginPanel.hidden = false;
      dashboard.hidden = true;
      list.replaceChildren();
      clearCreatedCode();
      loginForm.reset();
      status(loginStatus, message, kind);
    };
    function adminError(error, node) {
      if (error.status === 401 || error.status === 403) {
        saveToken("");
        showLogin("管理凭证已失效，请重新登录。", "error");
      } else status(node, error.message, "error");
    }
    function renderPermissions(selected = []) {
      permissionList.replaceChildren();
      for (const story of stories) {
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
        permissionList.append(label);
      }
    }
    function resetEditor() {
      editing = "";
      inviteForm.reset();
      renderPermissions();
      document.getElementById("invite-form-title").textContent = "创建邀请码";
      document.getElementById("invite-submit").textContent = "创建邀请码";
      document.getElementById("invite-code-field").hidden = false;
      inviteForm.elements.code.disabled = false;
      document.getElementById("invite-cancel").hidden = true;
      status(inviteStatus);
    }
    function localDate(value) {
      if (!value) return "";
      const date = new Date(value);
      if (!Number.isFinite(date.getTime())) return "";
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }
    const dateLabel = value => value ? new Date(value).toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "长期有效";
    function editInvite(invite) {
      clearCreatedCode();
      editing = invite.id;
      inviteForm.elements.label.value = invite.label || "";
      inviteForm.elements.expiresAt.value = localDate(invite.expiresAt);
      renderPermissions(invite.allowedStories);
      document.getElementById("invite-form-title").textContent = "编辑邀请码";
      document.getElementById("invite-submit").textContent = "保存修改";
      document.getElementById("invite-code-field").hidden = true;
      inviteForm.elements.code.disabled = true;
      document.getElementById("invite-cancel").hidden = false;
      status(inviteStatus, `正在编辑 ${invite.codeHint}`);
      inviteForm.scrollIntoView({ behavior: "smooth", block: "center" });
      inviteForm.elements.label.focus({ preventScroll: true });
    }
    function renderInvites() {
      list.replaceChildren();
      document.getElementById("invite-count").textContent = `${invites.length} 个`;
      if (!invites.length) {
        const empty = document.createElement("p");
        empty.className = "access-empty";
        empty.textContent = "还没有邀请码。从左侧创建第一张阅读邀请。";
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
        const permitted = document.createElement("p");
        permitted.className = "invite-permissions";
        permitted.textContent = invite.allowedStories.map(slug => stories.find(story => story.slug === slug)?.title || slug).join(" · ") || "未开放故事";
        const bottom = document.createElement("div");
        bottom.className = "invite-card-bottom";
        const expiry = document.createElement("span");
        expiry.textContent = invite.expiresAt ? `到期：${dateLabel(invite.expiresAt)}` : "长期有效";
        const actions = document.createElement("div");
        actions.className = "invite-actions";
        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "access-text-button";
        edit.textContent = "编辑";
        edit.addEventListener("click", () => editInvite(invite));
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "access-text-button";
        toggle.textContent = invite.active ? "停用" : "启用";
        toggle.addEventListener("click", async () => {
          toggle.disabled = true;
          status(listStatus, "正在保存……");
          try {
            const result = await request("/api/admin/invites", "PATCH", { id: invite.id, active: !invite.active });
            invites = invites.map(item => item.id === invite.id ? result.invite : item);
            renderInvites();
            status(listStatus, result.invite.active ? "邀请码已启用。" : "邀请码已停用，已有阅读凭证也将失效。", "success");
          } catch (error) { adminError(error, listStatus); }
          finally { toggle.disabled = false; }
        });
        actions.append(edit, toggle);
        bottom.append(expiry, actions);
        card.append(head, hint, permitted, bottom);
        list.append(card);
      }
    }
    async function openDashboard(session) {
      const result = await request("/api/admin/invites");
      stories = result.stories;
      invites = result.invites;
      document.getElementById("admin-username").textContent = session.username || "管理员";
      resetEditor();
      renderInvites();
      loginPanel.hidden = true;
      dashboard.hidden = false;
      loginForm.reset();
      status(listStatus);
    }
    loginForm.addEventListener("submit", async event => {
      event.preventDefault();
      const data = new FormData(loginForm);
      pending(loginForm, true);
      status(loginStatus, "正在登录……");
      try {
        const result = await request("/api/admin/login", "POST", { username: data.get("username").trim(), password: data.get("password") });
        saveToken(result.token);
        await openDashboard(result);
      } catch (error) { status(loginStatus, error.message, "error"); }
      finally { pending(loginForm, false); }
    });
    document.getElementById("admin-logout").addEventListener("click", async event => {
      event.currentTarget.disabled = true;
      try { await logout(); showLogin("已退出管理。"); }
      catch { showLogin("本机已退出管理。"); }
      finally { event.target.disabled = false; }
    });
    document.getElementById("invite-cancel").addEventListener("click", resetEditor);
    inviteForm.addEventListener("submit", async event => {
      event.preventDefault();
      const data = new FormData(inviteForm);
      const allowedStories = data.getAll("allowedStories");
      if (!allowedStories.length) { status(inviteStatus, "请至少选择一篇故事。", "error"); return; }
      const expires = data.get("expiresAt");
      const payload = { label: data.get("label").trim(), allowedStories, expiresAt: expires ? new Date(expires).toISOString() : null };
      if (editing) payload.id = editing;
      else if (data.get("code").trim()) payload.code = data.get("code").trim();
      pending(inviteForm, true);
      status(inviteStatus, "正在保存……");
      try {
        const wasEditing = Boolean(editing);
        const result = await request("/api/admin/invites", wasEditing ? "PATCH" : "POST", payload);
        const { code, ...savedInvite } = result.invite;
        if (wasEditing) invites = invites.map(item => item.id === editing ? savedInvite : item);
        else invites.unshift(savedInvite);
        resetEditor();
        renderInvites();
        status(inviteStatus, wasEditing ? "修改已保存。" : "邀请码已创建，请保存下方完整邀请码。", "success");
        if (!wasEditing && code) {
          status(document.getElementById("copy-status"));
          document.getElementById("created-invite-code").textContent = code;
          document.getElementById("created-invite").hidden = false;
        }
      } catch (error) { adminError(error, inviteStatus); }
      finally {
        pending(inviteForm, false);
        inviteForm.elements.code.disabled = Boolean(editing);
      }
    });
    document.getElementById("copy-invite-code").addEventListener("click", async () => {
      const code = document.getElementById("created-invite-code");
      try {
        await navigator.clipboard.writeText(code.textContent);
        status(document.getElementById("copy-status"), "已复制。", "success");
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
        status(document.getElementById("copy-status"), "已选中邀请码，请手动复制。");
      }
    });
    document.getElementById("dismiss-invite-code").addEventListener("click", clearCreatedCode);
    const passwordForm = document.getElementById("admin-password-form");
    const passwordStatus = document.getElementById("password-status");
    passwordForm.addEventListener("submit", async event => {
      event.preventDefault();
      const data = new FormData(passwordForm);
      if (data.get("newPassword") !== data.get("confirmPassword")) { status(passwordStatus, "两次填写的新密码不一致。", "error"); return; }
      pending(passwordForm, true);
      status(passwordStatus, "正在更改……");
      try {
        await request("/api/admin/password", "POST", { currentPassword: data.get("currentPassword"), newPassword: data.get("newPassword") });
        passwordForm.reset();
        saveToken("");
        showLogin("密码已更改。所有管理会话已退出，请使用新密码登录。", "success");
      } catch (error) {
        if (error.message === "当前密码不正确。") status(passwordStatus, error.message, "error");
        else adminError(error, passwordStatus);
      }
      finally { pending(passwordForm, false); }
    });
    if (token) {
      pending(loginForm, true);
      status(loginStatus, "正在恢复管理会话……");
      try {
        const session = await request("/api/session");
        if (session.authenticated && session.role === "admin") await openDashboard(session);
        else {
          if (!session.authenticated) saveToken("");
          showLogin(session.authenticated ? "请使用管理员账号登录。" : "请登录管理。");
        }
      } catch (error) { adminError(error, loginStatus); }
      finally { pending(loginForm, false); }
    }
  }

  if (mode === "gate") gate();
  else if (mode === "admin") admin();
  else if (mode === "reader") reader();
})();
