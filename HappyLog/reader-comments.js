(function () {
  'use strict';
  const section = document.getElementById('footprints');
  if (!section || document.body.dataset.access !== 'reader') return;
  const slug = document.body.dataset.story;
  if (!/^[a-z0-9-]+$/.test(slug || '') || section.dataset.page !== '/HappyLog/' + slug + '/') return;
  const api = String(window.HAPPYLOG_API_BASE || section.dataset.api || '').replace(/\/+$/, '');
  const page = section.dataset.page, authorAvatar = 'https://da1yuqin.github.io/blog/images/blog-day-plush-avatar.png';
  const mainForm = section.querySelector('form'), list = section.querySelector('.blog-comments__list');
  const body = document.querySelector('[data-annotatable]');
  let comments = [], pending = null, ranges = [], lastFocus;
  let active = false, activating = false, restartActivation = false;
  let generation = 0, notesController;
  let admin = false, anonymous = false, sessionToken = '', sessionCheck, sessionVersion = 0;
  const requests = new Set();
  let visitorId = '';
  try {
    visitorId = localStorage.getItem('happylog-comment-visitor-v1') || '';
    if (!/^[0-9a-f-]{36}$/i.test(visitorId)) { visitorId = crypto.randomUUID(); localStorage.setItem('happylog-comment-visitor-v1', visitorId); }
  } catch (_) { try { visitorId = crypto.randomUUID(); } catch (_) {} }
  const element = (tag, className, text) => {
    const el = document.createElement(tag); if (className) el.className = className;
    if (text !== undefined) el.textContent = text; return el;
  };
  const action = (label, handler) => {
    const button = element('button', 'blog-comments__link', label); button.type = 'button';
    button.addEventListener('click', handler); return button;
  };
  const commentName = comment => comment.author_role === 'admin' ? 'Me' : comment.name || '匿名';
  function accessToken() {
    try { return typeof window.getHappylogAccessToken === 'function' ? window.getHappylogAccessToken() : sessionStorage.getItem('happylog-access-token-v1') || ''; }
    catch (_) { return ''; }
  }
  async function request(path, options) {
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 12000);
    requests.add(controller);
    const headers = new Headers(options?.headers);
    const token = accessToken();
    if (token) headers.set('Authorization', 'Bearer ' + token);
    try {
      const response = await fetch(api.replace(/\/api$/, '') + path, {...options, headers, cache: 'no-store', signal: controller.signal});
      const result = await response.json();
      if (!response.ok) {
        const error = new Error(result.error || '评论服务暂时不可用。'); error.status = response.status;
        if (response.status === 401 || response.status === 403) accessDenied();
        throw error;
      }
      return result;
    } finally { clearTimeout(timer); requests.delete(controller); }
  }
  function updateAuthorForms() {
    [mainForm, noteForm].filter(Boolean).forEach(form => {
      const controls = form.querySelector('[data-comment-author]');
      const name = form.elements.name, usingAuthor = admin && !anonymous;
      controls.hidden = !admin;
      controls.querySelector('input').checked = anonymous;
      if (usingAuthor && !name.readOnly) { form._visitorName = name.value; name.value = 'Me'; }
      if (!usingAuthor && name.readOnly) name.value = form._visitorName || '';
      name.readOnly = usingAuthor;
      form.querySelector('[data-comment-author-avatar]').hidden = !usingAuthor;
      controls.querySelector('[data-comment-author-label]').textContent = usingAuthor ? '以 Me 发表评论' : '使用普通评论入口';
    });
  }
  function setAdmin(value) {
    const changed = admin !== value;
    admin = value;
    if (!admin) anonymous = false;
    updateAuthorForms();
    if (changed && active) render();
  }
  async function refreshAdmin() {
    const token = accessToken();
    if (!api || !token) { sessionToken = ''; sessionVersion++; setAdmin(false); accessDenied(); return; }
    if (token !== sessionToken) { sessionToken = token; sessionVersion++; setAdmin(false); sessionCheck = null; }
    if (sessionCheck) return sessionCheck;
    const current = sessionVersion;
    const check = request('/api/session').then(session => {
      if (current !== sessionVersion || token !== accessToken()) return;
      if (session.authenticated !== true || (session.role !== 'admin' && !session.allowedStories?.includes(slug))) { accessDenied(); return; }
      setAdmin(session.role === 'admin');
    }).catch(error => {
      if (current === sessionVersion && (error.status === 401 || error.status === 403)) setAdmin(false);
      throw error;
    });
    sessionCheck = check;
    try { await check; } finally { if (sessionCheck === check) sessionCheck = null; }
  }
  function checkSession() { if (active) refreshAdmin().catch(() => {}); }
  function accessDenied() {
    deactivate();
    setAdmin(false);
    document.dispatchEvent(new Event('day-reader-access-denied'));
  }
  function setContext(form, parent, anchor) {
    form._parent = parent || null; form._anchor = anchor || null;
    const box = form.querySelector('.blog-comments__context');
    box.hidden = !parent && !anchor;
    box.querySelector('span').textContent = parent ? '回复 ' + commentName(parent) : anchor ? '批注所选正文' : '';
  }
  function bindForm(form) {
    const button = form.querySelector('[type=submit]'), status = form.querySelector('.blog-comments__status');
    button.disabled = !api || !active;
    form.querySelector('[data-comment-anonymous]').addEventListener('change', event => {
      anonymous = event.target.checked; updateAuthorForms();
    });
    form.querySelector('[data-cancel-context]').addEventListener('click', () => {
      setContext(form, null, null); if (form === noteForm) {form.hidden = true; quotePreview.hidden = true; noteList.hidden = false;}
    });
    form.addEventListener('submit', async event => {
      event.preventDefault(); if (!active || button.disabled || !form.reportValidity()) return;
      const current = generation;
      const intendedAuthor = admin && !anonymous;
      button.disabled = true; status.textContent = '正在发布…';
      const visibility = 'public';
      try {
        // The server confirms the session; a stored token alone never grants author status.
        await refreshAdmin();
        if (!active || current !== generation) return;
        if (intendedAuthor && !admin) throw new Error('管理员登录已失效，请重新登录，或选择普通评论入口。');
        await request('/comments', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
          page, name: form.elements.name.value, content: form.elements.content.value, visibility,
          parent_id: form._parent ? form._parent.id : null, anchor: form._anchor || null,
          ...(admin && !anonymous ? {author_mode: 'admin'} : {})
        })});
        if (!active || current !== generation) return;
        form.elements.content.value = '';
        status.textContent = '已发布，本篇读者可见。';
        document.dispatchEvent(new Event('day-comment-published'));
        setContext(form, null, null);
        if (visibility === 'public') {
          try { await load(); } catch (_) { status.textContent += ' 列表暂时加载失败，请稍后刷新。'; }
        }
        if (form === noteForm) { panelStatus.textContent = status.textContent; form.hidden = true; quotePreview.hidden = true; noteList.hidden = false; }
      } catch (error) {
        if (!active || current !== generation) return;
        status.textContent = error.name === 'AbortError' || error.message === 'Failed to fetch' ? '连接失败，请稍后重试；输入内容已保留。' : error.message;
      } finally { button.disabled = !api || !active; }
    });
  }
  let panel, noteForm, noteList, quotePreview, selectButton, toggle, panelStatus;
  function openNotes(focus = true) {
    if (!active || !panel) return;
    if (panel.hidden) lastFocus = document.activeElement;
    panel.hidden = false; toggle?.setAttribute('aria-expanded','true'); document.body.classList.add('day-notes-open');
    if (focus) panel.querySelector('[data-close-notes]').focus();
  }
  function closeNotes() {
    if (!panel) return;
    panel.hidden = true; toggle?.setAttribute('aria-expanded','false'); document.body.classList.remove('day-notes-open');
    if (lastFocus && lastFocus.isConnected) lastFocus.focus();
  }
  function replyTo(comment, inNotes) {
    const form = inNotes ? noteForm : mainForm;
    setContext(form, comment, null); form.hidden = false;
    if (inNotes) { noteList.hidden = false; quotePreview.hidden = true; openNotes(false); }
    else form.scrollIntoView({block:'center', behavior:'smooth'});
    form.elements.content.focus();
  }
  function renderComment(comment, host, inNotes, parent) {
    const item = element('article', 'blog-comments__item'); item.dataset.commentId = comment.id;
    const time = element('time', '', new Date(comment.created_at).toLocaleDateString('zh-CN')); time.dateTime = comment.created_at;
    const meta = element('div', 'blog-comments__meta');
    if (comment.author_role === 'admin') {
      const avatar = element('img', 'blog-comments__avatar'); avatar.src = authorAvatar; avatar.alt = 'Me 的头像'; avatar.width = avatar.height = 32; avatar.loading = 'lazy'; avatar.dataset.imageLoading = 'off';
      meta.append(avatar); item.classList.add('blog-comments__item--author');
    }
    meta.append(element('strong', '', commentName(comment)), time);
    if (comment.author_role === 'admin' && comment.edited_at) {
      const edited = element('span', 'blog-comments__edited', '已编辑'); edited.title = new Date(comment.edited_at).toLocaleString('zh-CN'); meta.append(edited);
    }
    item.append(meta);
    if (parent) item.append(element('span', 'blog-comments__reply-to', '回复 ' + commentName(parent)));
    const content = element('p', '', comment.content), actions = element('div', 'blog-comments__item-actions');
    actions.append(action('回复', () => replyTo(comment, inNotes)));
    const like = action((comment.liked ? '已赞 ' : '赞 ') + (comment.likes || 0), async () => {
      if (!active || like.disabled || !visitorId) return;
      const current = generation; like.disabled = true;
      try {
        const result = await request('/comments?action=like', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({page, comment_id:comment.id, visitor_id:visitorId})});
        if (!active || current !== generation) return;
        comment.likes = result.likes; comment.liked = result.liked;
        like.textContent = (comment.liked ? '已赞 ' : '赞 ') + comment.likes;
        like.setAttribute('aria-pressed', String(Boolean(comment.liked)));
      } catch (error) {
        if (active && current === generation) mainForm.querySelector('.blog-comments__status').textContent = error.message;
      } finally { like.disabled = !active || Boolean(comment.liked); }
    });
    like.disabled = Boolean(comment.liked) || !visitorId;
    like.setAttribute('aria-label','赞同这条评论'); like.setAttribute('aria-pressed',String(Boolean(comment.liked))); actions.append(like);
    if (admin && comment.author_role === 'admin') actions.append(action('编辑', () => editComment(comment, item, content, actions)));
    item.append(content, actions); host.append(item);
    return item;
  }
  function editComment(comment, item, content, actions) {
    if (!admin || comment.author_role !== 'admin' || item.querySelector('.blog-comments__edit')) return;
    const form = element('form', 'blog-comments__edit'), label = element('label', '', '编辑评论');
    const input = element('textarea'); input.value = comment.content; input.required = true; input.maxLength = 2000; input.rows = 4; label.append(input);
    const buttons = element('div', 'blog-comments__edit-actions'), save = element('button', 'blog-footprints__button', '保存修改'); save.type = 'submit';
    const status = element('p', 'blog-comments__status'); status.setAttribute('role', 'status');
    const cancel = action('取消', () => { form.remove(); content.hidden = actions.hidden = false; });
    buttons.append(save, cancel); form.append(label, buttons, status); content.hidden = actions.hidden = true; actions.after(form); input.focus();
    form.addEventListener('submit', async event => {
      event.preventDefault(); if (save.disabled || !form.reportValidity()) return;
      const current = generation; save.disabled = true; cancel.disabled = true; status.textContent = '正在保存…';
      try {
        await refreshAdmin();
        if (!active || current !== generation) return;
        if (!admin) throw new Error('管理员登录已失效，请重新登录后编辑。');
        const result = await request('/comments?id=' + encodeURIComponent(comment.id), {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({content: input.value})});
        if (!active || current !== generation) return;
        if (!result.comment || result.comment.author_role !== 'admin' || result.comment.id !== comment.id) throw new Error('保存结果暂时无法确认，请稍后刷新；修改内容已保留。');
        comments = comments.map(value => value.id === comment.id ? result.comment : value);
        render(); document.dispatchEvent(new Event('day-comment-published'));
        load().catch(() => {});
      } catch (error) {
        if (active && current === generation && form.isConnected) status.textContent = error.message === 'Failed to fetch' || error.name === 'AbortError' ? '保存失败，请稍后重试；修改内容已保留。' : error.message;
      } finally { save.disabled = cancel.disabled = false; }
    });
  }
  function renderThread(root, host, inNotes) {
    const first = renderComment(root, host, inNotes), children = element('div', 'blog-comments__replies');
    const visited = new Set([root.id]);
    // Keep the visual indentation constant even when a conversation has many levels.
    function walk(parent) {
      comments.filter(c => c.parent_id === parent.id && !visited.has(c.id)).sort((a,b) => a.id-b.id).forEach(c => {
        visited.add(c.id); renderComment(c, children, inNotes, parent); walk(c);
      });
    }
    walk(root); if (children.childElementCount) first.append(children);
  }
  function textIndex() {
    const nodes = [], walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    let node, text = '';
    while ((node = walker.nextNode())) {
      if (node.parentElement.closest('script, style, [hidden], [aria-hidden="true"], [data-annotation-exclude], button, input, textarea, select, nav')) continue;
      nodes.push({node, start:text.length, end:text.length + node.length}); text += node.data;
    }
    return {nodes, text};
  }
  function offsetAt(index, container, offset) {
    const prefix = document.createRange(); prefix.selectNodeContents(body); prefix.setEnd(container, offset);
    let end = 0;
    for (const entry of index.nodes) {
      if (entry.node === container) return entry.start + offset;
      if (prefix.comparePoint(entry.node, entry.node.length) === 0) end = entry.end;
    }
    return end;
  }
  function locate(anchor, text) {
    if (text.slice(anchor.start, anchor.end) === anchor.exact &&
        text.slice(Math.max(0,anchor.start-anchor.prefix.length), anchor.start) === anchor.prefix &&
        text.slice(anchor.end, anchor.end+anchor.suffix.length) === anchor.suffix) return anchor.start;
    const candidates = []; let at = text.indexOf(anchor.exact);
    while (at !== -1) { candidates.push(at); at = text.indexOf(anchor.exact, at+1); }
    const matched = candidates.filter(pos => (!anchor.prefix || text.slice(Math.max(0,pos-anchor.prefix.length),pos).endsWith(anchor.prefix)) &&
      (!anchor.suffix || text.slice(pos+anchor.exact.length,pos+anchor.exact.length+anchor.suffix.length).startsWith(anchor.suffix)));
    return matched.length === 1 ? matched[0] : candidates.length === 1 ? candidates[0] : -1;
  }
  function makeRange(index, start, end) {
    const first = index.nodes.find(n => n.start <= start && n.end > start);
    const last = index.nodes.find(n => n.start < end && n.end >= end);
    if (!first || !last) return null;
    const range = document.createRange(); range.setStart(first.node, start-first.start); range.setEnd(last.node, end-last.start); return range;
  }
  function highlight(roots) {
    if (!body) return;
    body.querySelectorAll('mark.day-text-highlight').forEach(mark => mark.replaceWith(...mark.childNodes)); body.normalize();
    const index = textIndex(); ranges = [];
    roots.forEach(c => {
      const start = locate(c.anchor,index.text), range = start < 0 ? null : makeRange(index,start,start+c.anchor.exact.length);
      if (range) ranges.push({comment:c, range, start, end:start+c.anchor.exact.length});
    });
    if (window.CSS && CSS.highlights && window.Highlight) CSS.highlights.set('day-notes', new Highlight(...ranges.map(r => r.range)));
    else {
      // Split text only; never replace links, images or other article elements.
      index.nodes.slice().reverse().forEach(n => {
        const segments = ranges.filter(r => r.start < n.end && r.end > n.start).map(r => [Math.max(0,r.start-n.start),Math.min(n.node.length,r.end-n.start)]).sort((a,b)=>a[0]-b[0]);
        const merged=[]; segments.forEach(s => {const last=merged[merged.length-1]; if(last && s[0]<=last[1]) last[1]=Math.max(last[1],s[1]); else merged.push(s);});
        merged.reverse().forEach(([start,end]) => {const text=n.node.splitText(start); text.splitText(end-start); const mark=element('mark','day-text-highlight'); text.replaceWith(mark); mark.append(text);});
      });
    }
    return ranges;
  }
  function render() {
    list.replaceChildren(); if (noteList) noteList.replaceChildren();
    const ids = new Set(comments.map(c => c.id));
    const roots = comments.filter(c => !c.parent_id || !ids.has(c.parent_id));
    const notes = roots.filter(c => c.anchor);
    const resolved = highlight(notes) || [];
    roots.filter(c => !c.anchor).forEach(c => renderThread(c,list,false));
    section.querySelector('.blog-comments__empty').hidden = list.childElementCount > 0;
    if (noteList) {
      section.querySelector('[data-note-count]').textContent = notes.length; toggle.textContent = '✎ 批注 ' + notes.length;
      if (!notes.length) noteList.append(element('p','day-notes__intro','选中一句正文，留下你的想法。'));
      notes.forEach(c => {
        const thread = element('section', 'day-notes__thread'), quote = action('', () => {
          const found = ranges.find(r => r.comment.id === c.id); if (!found) return;
          const rect = found.range.getBoundingClientRect(); window.scrollBy({top:rect.top-120, behavior:'smooth'});
        });
        quote.className = 'day-notes__quote'; quote.append(element('blockquote','',c.anchor.exact)); thread.append(quote);
        if (!resolved.some(r=>r.comment.id===c.id)) thread.append(element('p','day-notes__notice','正文已变动，保留原文引用。'));
        renderThread(c,thread,true); noteList.append(thread);
      });
    }
  }
  async function load() {
    if (!active) return;
    const current = generation;
    const result = await request('/comments?page=' + encodeURIComponent(page) + (visitorId ? '&visitor_id=' + encodeURIComponent(visitorId) : ''));
    if (!active || current !== generation) return;
    comments = Array.isArray(result.comments) ? result.comments : []; render();
  }
  function setupNotes() {
    if (!body || panel) return;
    notesController = new AbortController();
    const signal = notesController.signal;
    section.querySelector('.blog-comments__annotation-hint').hidden = false;
    panel = element('aside','day-notes'); panel.id = 'reader-notes'; panel.hidden = true; panel.setAttribute('aria-label','正文批注');
    panel.innerHTML = '<div class="day-notes__header"><h2>正文批注</h2><button type="button" class="blog-comments__link" data-close-notes aria-label="关闭批注">关闭 ×</button></div><p class="day-notes__intro">选中正文后留下批注；批注会在正文中高亮显示，仅本篇读者可见。</p>';
    noteList = element('div','day-notes__list'); quotePreview = element('blockquote','day-notes__draft-quote'); quotePreview.hidden = true;
    noteForm = mainForm.cloneNode(true); noteForm.hidden = true;
    noteForm.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    panelStatus = element('p','day-notes__notice'); panelStatus.setAttribute('role','status'); panel.append(panelStatus,noteList,quotePreview,noteForm); document.body.append(panel);
    panel.querySelector('[data-close-notes]').addEventListener('click',closeNotes);
    toggle = action('✎ 批注 0', () => panel.hidden ? openNotes() : closeNotes()); toggle.className = 'day-annotation-toggle'; toggle.setAttribute('aria-controls', 'reader-notes'); toggle.setAttribute('aria-expanded', 'false'); document.body.append(toggle);
    section.querySelector('[data-open-notes]').addEventListener('click', () => openNotes(), {signal});
    selectButton = action('批注', () => {
      if (!pending) return;
      panelStatus.textContent=''; noteList.hidden=true; setContext(noteForm,null,pending); quotePreview.textContent = pending.exact; quotePreview.hidden = false; noteForm.hidden = false;
      selectButton.hidden = true; openNotes(false); noteForm.elements.content.focus();
    });
    selectButton.className = 'day-annotation-selection'; selectButton.hidden = true; document.body.append(selectButton);
    selectButton.addEventListener('pointerdown',event => event.preventDefault());
    function selection() {
      if (!active || !selectButton) return;
      const selected = window.getSelection();
      if (!selected.rangeCount || selected.isCollapsed) {selectButton.hidden=true; return;}
      const range=selected.getRangeAt(0);
      if (!body.contains(range.startContainer) || !body.contains(range.endContainer)) {selectButton.hidden=true;return;}
      const exact=range.toString(); if (!exact.trim()) {selectButton.hidden=true;return;}
      const index=textIndex();
      const start=offsetAt(index,range.startContainer,range.startOffset), end=offsetAt(index,range.endContainer,range.endOffset);
      // Selection and replay share the same text-node index; hidden controls never shift anchors.
      if (end-start!==exact.length || index.text.slice(start,end)!==exact) {selectButton.hidden=true;return;}
      pending={exact,start,end,prefix:index.text.slice(Math.max(0,start-48),start),suffix:index.text.slice(end,end+48)};
      const rect=range.getBoundingClientRect(); selectButton.style.top=Math.max(70,Math.min(window.innerHeight-40,rect.bottom+7))+'px';
      selectButton.style.left=Math.max(8,Math.min(window.innerWidth-125,rect.left))+'px';
      selectButton.disabled=exact.length>1000; selectButton.textContent=exact.length>1000?'最多选 1000 字':'批注'; selectButton.hidden=false;
    }
    document.addEventListener('selectionchange',selection,{signal});
    document.addEventListener('scroll',()=>{selectButton.hidden=true;},{capture:true,signal});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'){selectButton.hidden=true;closeNotes();}},{signal});
    body.addEventListener('click',event=>{
      if(event.target.closest('button, a, input, textarea, select, summary'))return;
      if(!window.getSelection().isCollapsed)return;
      let caret=document.caretRangeFromPoint ? document.caretRangeFromPoint(event.clientX,event.clientY) : null;
      if (!caret && document.caretPositionFromPoint) { const pos=document.caretPositionFromPoint(event.clientX,event.clientY); if(pos){caret=document.createRange();caret.setStart(pos.offsetNode,pos.offset);} }
      if(!caret || !body.contains(caret.startContainer))return;
      const offset=offsetAt(textIndex(),caret.startContainer,caret.startOffset), found=ranges.find(r=>offset>=r.start && offset<r.end);
      if(found){openNotes(false);const target=noteList.querySelector('[data-comment-id="'+found.comment.id+'"]');if(target)target.scrollIntoView({block:'nearest'});}
    },{signal});
    bindForm(noteForm);
    updateAuthorForms();
  }
  function deactivate() {
    active = false; generation++;
    requests.forEach(controller => controller.abort()); requests.clear();
    notesController?.abort();
    if (window.CSS && CSS.highlights) CSS.highlights.delete('day-notes');
    if (body) {
      body.querySelectorAll('mark.day-text-highlight').forEach(mark => mark.replaceWith(...mark.childNodes));
      body.normalize();
    }
    panel?.remove(); toggle?.remove(); selectButton?.remove();
    panel = noteForm = noteList = quotePreview = selectButton = toggle = panelStatus = undefined;
    document.body.classList.remove('day-notes-open');
    comments = []; pending = null; ranges = []; lastFocus = null;
    list.replaceChildren(); mainForm.reset(); setContext(mainForm,null,null);
    mainForm.elements.name.readOnly = false; updateAuthorForms();
    mainForm.querySelector('[type=submit]').disabled = true;
    mainForm.querySelector('.blog-comments__status').textContent = '';
    section.querySelector('.blog-comments__annotation-hint').hidden = true;
    section.hidden = true;
  }
  async function activate() {
    if (activating || !body || !api || !accessToken()) return;
    activating = true;
    const current = generation;
    try {
      const policy = await request('/api/stories/comment-access?page=' + encodeURIComponent(page));
      if (current !== generation) return;
      if (policy.allowed !== true || policy.slug !== slug || policy.visibility !== 'private') throw new Error('阅读权限暂时无法确认。');
      active = true; section.hidden = false;
      section.querySelector('[data-retry-comments]').hidden = true;
      mainForm.querySelector('.blog-comments__status').textContent = '';
      setupNotes();
      mainForm.querySelector('[type=submit]').disabled = false;
      checkSession();
      await load();
    } catch (error) {
      if (current === generation && error.name !== 'AbortError') {
        section.hidden = false;
        mainForm.querySelector('.blog-comments__status').textContent = '评论暂时加载失败，请稍后重试。';
        section.querySelector('[data-retry-comments]').hidden = false;
      }
    } finally {
      activating = false;
      if (restartActivation) { restartActivation = false; activate(); }
    }
  }
  bindForm(mainForm);
  document.addEventListener('day-reader-unloaded', deactivate);
  document.addEventListener('day-session-changed', () => {
    deactivate(); sessionVersion++; sessionCheck = null; setAdmin(false);
    if (activating) restartActivation = true;
    else activate();
  });
  section.querySelector('[data-retry-comments]').addEventListener('click', () => { deactivate(); activate(); });
  window.addEventListener('pageshow', event => { if (event.persisted) checkSession(); });
  window.addEventListener('focus', checkSession);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) checkSession(); });
  setInterval(() => { if (active && !document.hidden) checkSession(); }, 30000);
  activate();
}());
