import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import worker from './worker.mjs';

test('private content stays in storage and never reaches public reads', async () => {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
  const env = {SITE_ORIGIN: 'https://da1yuqin.github.io', COMMENT_LIMIT: {limit: async () => ({success: true})}, DB: {
    prepare(sql) { return {bind(...values) { return {
      all: async () => ({results: db.prepare(sql).all(...values)}),
      run: async () => db.prepare(sql).run(...values)
    }; }}; }
  }};
  const call = (path, body, origin = env.SITE_ORIGIN) => worker.fetch(new Request('https://comments.test/comments' + path, {
    method: body === undefined ? 'GET' : 'POST', headers: {'Origin': origin, 'Content-Type': 'application/json'},
    ...(body === undefined ? {} : {body: JSON.stringify(body)})
  }), env);
  const page = '/blog/welcome-to-my-blog/';
  const publicBody = {page, name: '访客', content: '<img src=x onerror=alert(1)>', visibility: 'public'};
  assert.equal((await call('', publicBody)).status, 201);
  assert.equal((await call('', {...publicBody, content: '只有 Day 能看到', visibility: 'private'})).status, 201);
  assert.equal((await call('', {...publicBody, page: '/blog/another/', content: '另一篇文章'})).status, 201);
  assert.equal(db.prepare("SELECT count(*) AS n FROM comments WHERE visibility = 'private'").get().n, 1);
  for (const suffix of ['', '&visibility=private', '&include_private=true', '&owner=true']) {
    const response = await call('?page=' + encodeURIComponent(page) + suffix);
    const body = await response.json();
    assert.equal(body.comments.length, 1);
    assert.equal(body.comments[0].content, publicBody.content);
    assert.deepEqual(Object.keys(body.comments[0]).sort(), ['anchor', 'content', 'created_at', 'id', 'name', 'parent_id']);
    assert.ok(!JSON.stringify(body).includes('只有 Day'));
  }
  assert.equal((await call('', {...publicBody, visibility: 'admin'})).status, 400);
  assert.equal((await call('', {...publicBody, content: '  '})).status, 400);
  assert.equal((await call('', {...publicBody, content: 'x'.repeat(2001)})).status, 400);
  assert.equal((await call('', publicBody, 'https://other.test')).status, 403);
  assert.equal((await call('?page=' + encodeURIComponent("/blog/' OR 1=1 --/"))).status, 400);
  env.COMMENT_LIMIT.limit = async () => ({success: false});
  assert.equal((await call('', publicBody)).status, 429);
  assert.equal(db.prepare('SELECT count(*) AS n FROM comments').get().n, 3);
  db.close();
});


test('replies and text annotations enforce parent visibility and page boundaries', async () => {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
  const env = {SITE_ORIGIN: 'https://da1yuqin.github.io', COMMENT_LIMIT: {limit: async () => ({success:true})}, DB: {
    prepare(sql) {return {bind(...values) {return {all: async()=>({results:db.prepare(sql).all(...values)}), run:async()=>db.prepare(sql).run(...values)};}};}
  }};
  const post = body => worker.fetch(new Request('https://comments.test/comments', {method:'POST', headers:{Origin:env.SITE_ORIGIN,'Content-Type':'application/json'},body:JSON.stringify(body)}),env);
  const get = page => worker.fetch(new Request('https://comments.test/comments?page='+encodeURIComponent(page)),env);
  const base={page:'/blog/test/',name:'访客',content:'讨论',visibility:'public'};
  assert.equal((await post(base)).status,201);
  assert.equal((await post({...base,visibility:'private',content:'私密根评论'})).status,201);
  assert.equal((await post({...base,parent_id:1,content:'公开回复'})).status,201);
  assert.equal((await post({...base,parent_id:3,content:'多层回复'})).status,201);
  assert.equal((await post({...base,parent_id:1,visibility:'private',content:'私密回复'})).status,201);
  const anchor={exact:'一句正文',prefix:'',suffix:'',start:0,end:4};
  assert.equal((await post({...base,anchor,content:'公开批注'})).status,201);
  assert.equal((await post({...base,anchor,visibility:'private',content:'私密批注'})).status,201);
  for(const body of [{...base,parent_id:2},{...base,parent_id:7},{...base,parent_id:1,page:'/blog/other/'},{...base,parent_id:999},{...base,parent_id:'1'},{...base,parent_id:1,anchor},{...base,anchor:{...anchor,end:8}},{...base,anchor:{...anchor,exact:'x'.repeat(1001),end:1001}}]) {
    assert.equal((await post(body)).status,400);
  }
  const data=await (await get(base.page)).json();
  assert.equal(data.comments.length,4);
  assert.deepEqual(data.comments.find(c=>c.content==='公开批注').anchor,anchor);
  assert.equal(data.comments.find(c=>c.content==='公开回复').parent_id,1);
  assert.equal(data.comments.find(c=>c.content==='多层回复').parent_id,3);
  assert.ok(!JSON.stringify(data).includes('私密'));
  assert.equal((await post({...base,page:'/'})).status,201);
  // Upgrading the old schema keeps the original records intact.
  const old=new DatabaseSync(':memory:');
  old.exec('CREATE TABLE comments (id INTEGER PRIMARY KEY, page TEXT, name TEXT, content TEXT, visibility TEXT, created_at TEXT);');
  old.prepare('INSERT INTO comments VALUES (?, ?, ?, ?, ?, ?)').run(1, '/blog/', '', '保留原留言', 'private', '2026-10-10');
  old.exec(readFileSync(new URL('./migration-replies.sql',import.meta.url),'utf8'));
  assert.equal(old.prepare('SELECT content FROM comments').get().content,'保留原留言');
  old.close(); db.close();
});
