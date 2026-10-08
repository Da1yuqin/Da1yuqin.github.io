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
    assert.deepEqual(Object.keys(body.comments[0]).sort(), ['content', 'created_at', 'id', 'name']);
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
