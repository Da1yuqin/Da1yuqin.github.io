export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const headers = {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', Vary: 'Origin'};
    if (origin === env.SITE_ORIGIN) headers['Access-Control-Allow-Origin'] = origin;
    const reply = (body, status = 200) => new Response(JSON.stringify(body), {status, headers});
    const url = new URL(request.url);
    if (url.pathname !== '/comments') return reply({error: 'Not found'}, 404);
    if (origin && origin !== env.SITE_ORIGIN) return reply({error: '来源不允许。'}, 403);
    if (request.method === 'OPTIONS') {
      return new Response(null, {status: 204, headers: {...headers,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'}});
    }
    const validPage = page => typeof page === 'string' && (page === '/' || /^\/[\w\-/.%]+\/$/.test(page)) && page.length <= 512 && !page.includes('..');
    try {
      if (request.method === 'GET') {
        const page = url.searchParams.get('page');
        if (!validPage(page)) return reply({error: '页面地址无效。'}, 400);
        // Visibility is enforced here, regardless of any visitor-supplied query.
        const result = await env.DB.prepare("SELECT id, name, content, created_at, parent_id, anchor FROM comments WHERE page = ? AND visibility = 'public' ORDER BY id DESC LIMIT 500").bind(page).all();
        return reply({comments: result.results.map(row => ({...row, anchor: row.anchor ? JSON.parse(row.anchor) : null}))});
      }
      if (request.method !== 'POST') return reply({error: 'Method not allowed'}, 405);
      if (origin !== env.SITE_ORIGIN) return reply({error: '来源不允许。'}, 403);
      if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply({error: '请求格式无效。'}, 415);
      const text = await request.text();
      if (new TextEncoder().encode(text).length > 12000) return reply({error: '评论过长。'}, 413);
      let input;
      try { input = JSON.parse(text); } catch { return reply({error: '请求格式无效。'}, 400); }
      if (!input || typeof input !== 'object') return reply({error: '请求格式无效。'}, 400);
      const {page, visibility} = input;
      const name = typeof input.name === 'string' ? input.name.trim() : '';
      const content = typeof input.content === 'string' ? input.content.trim() : '';
      if (!validPage(page) || name.length > 40 || !content || content.length > 2000 || !['public', 'private'].includes(visibility)) {
        return reply({error: '请填写有效评论，并选择公开或私密。'}, 400);
      }
      const parentId = input.parent_id ?? null;
      let anchor = null;
      if (parentId !== null) {
        if (!Number.isSafeInteger(parentId) || parentId < 1 || input.anchor != null) return reply({error: '回复对象无效。'}, 400);
        // Never reveal or accept a visitor-supplied private parent, including across pages.
        const parent = await env.DB.prepare("SELECT id FROM comments WHERE id = ? AND page = ? AND visibility = 'public'").bind(parentId, page).all();
        if (!parent.results.length) return reply({error: '回复对象无效。'}, 400);
      } else if (input.anchor != null) {
        const a = input.anchor;
        if (!a || typeof a.exact !== 'string' || !a.exact.trim() || a.exact.length > 1000 ||
            typeof a.prefix !== 'string' || a.prefix.length > 64 || typeof a.suffix !== 'string' || a.suffix.length > 64 ||
            !Number.isSafeInteger(a.start) || a.start < 0 || a.start > 1000000 ||
            !Number.isSafeInteger(a.end) || a.end <= a.start || a.end - a.start !== a.exact.length) {
          return reply({error: '请选择有效正文（最多 1000 字）。'}, 400);
        }
        anchor = JSON.stringify({exact:a.exact, prefix:a.prefix, suffix:a.suffix, start:a.start, end:a.end});
      }
      const limit = await env.COMMENT_LIMIT.limit({key: request.headers.get('CF-Connecting-IP') || 'unknown'});
      if (!limit.success) return reply({error: '评论提交太频繁，请一分钟后重试。'}, 429);
      await env.DB.prepare('INSERT INTO comments (page, name, content, visibility, parent_id, anchor) VALUES (?, ?, ?, ?, ?, ?)').bind(page, name, content, visibility, parentId, anchor).run();
      return reply({ok: true}, 201);
    } catch {
      return reply({error: '评论服务暂时不可用，请稍后重试。'}, 503);
    }
  }
};
