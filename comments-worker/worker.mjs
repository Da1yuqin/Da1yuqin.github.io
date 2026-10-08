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
    const validPage = page => typeof page === 'string' && /^\/[\w\-/.%]+\/$/.test(page) && page.length <= 512 && !page.includes('..');
    try {
      if (request.method === 'GET') {
        const page = url.searchParams.get('page');
        if (!validPage(page)) return reply({error: '页面地址无效。'}, 400);
        // Visibility is enforced here, regardless of any visitor-supplied query.
        const result = await env.DB.prepare("SELECT id, name, content, created_at FROM comments WHERE page = ? AND visibility = 'public' ORDER BY id DESC LIMIT 100").bind(page).all();
        return reply({comments: result.results});
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
      const limit = await env.COMMENT_LIMIT.limit({key: request.headers.get('CF-Connecting-IP') || 'unknown'});
      if (!limit.success) return reply({error: '评论提交太频繁，请一分钟后重试。'}, 429);
      await env.DB.prepare('INSERT INTO comments (page, name, content, visibility) VALUES (?, ?, ?, ?)').bind(page, name, content, visibility).run();
      return reply({ok: true}, 201);
    } catch {
      return reply({error: '评论服务暂时不可用，请稍后重试。'}, 503);
    }
  }
};
