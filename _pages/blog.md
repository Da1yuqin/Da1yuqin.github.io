---
permalink: /blog/
title: "Blog"
excerpt: ""
author_profile: true
---

<script>document.body.classList.add('blog-page');</script>

<style>
  body.blog-page { background: var(--day-paper, #fcfbf8); }
  body.blog-page .sidebar { display: none !important; }
  body.blog-page #main { width: min(940px, calc(100% - 48px)); max-width: none; margin: 0 auto; padding: 0 0 64px; }
  body.blog-page .page { float: none; width: 100%; padding: 0; margin: 0; }
  body.blog-page .page .page__inner-wrap { padding: 0; border: 0; background: transparent; box-shadow: none; }
  .az-blog__profile { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,.85fr); gap: 64px; align-items: center; padding: 48px 0 56px; border-bottom: 1px solid var(--day-line); }
  .az-blog__identity { min-width: 0; }
  .az-blog .az-blog__eyebrow { margin: 0 0 28px; font-size: 11px; letter-spacing: .18em; color: var(--day-accent); }
  .az-blog__avatar { width: 88px; height: 106px; margin-bottom: 20px; }
  .az-blog__avatar img { display: block; width: 100%; height: 100%; object-fit: contain; }
  .az-blog .az-blog__quote { margin: 0 0 22px; font-family: "Iowan Old Style", "Palatino Linotype", "Songti SC", "Noto Serif CJK SC", serif; font-size: 34px; font-weight: 500; line-height: 1.55; color: var(--day-ink); }
  .az-blog__quote em { font-weight: 400; }
  .az-blog .az-blog__sub { margin: 8px 0 0; font-size: 13px; line-height: 1.8; color: #707667; }
  .az-blog__socials { display: flex; gap: 18px; margin-top: 22px; }
  .az-blog__socials a { font-size: 11px; letter-spacing: .06em; color: #626d58; text-decoration: none; border-bottom: 1px solid #bbc3b1; padding-bottom: 2px; }
  .az-blog__socials a:hover { color: #293e22; border-color: #293e22; }
  .az-blog__art { min-width: 0; width: 100%; max-width: 330px; margin: 0 auto; }
  .az-blog__art--original { position: relative; aspect-ratio: 1170 / 1590; overflow: hidden; }
  .az-blog__art--original img { position: absolute; top: -36.164%; left: 0; display: block; width: 100%; height: auto; }
  .az-blog .az-blog__section-title { scroll-margin-top: 85px; margin: 36px 0 22px; border: 0; font-size: 25px; font-weight: 500; }
  .az-blog__categories { display: flex; flex-wrap: wrap; gap: 10px 28px; border-bottom: 1px solid var(--day-line); }
  .az-blog__categories button { position: relative; margin: 0 0 -1px; padding: 8px 0 12px; border: 0; border-bottom: 2px solid transparent; border-radius: 0; background: transparent; color: #747c6d; font: inherit; font-size: 13px; cursor: pointer; }
  .az-blog__categories button[aria-selected="true"] { border-color: #526349; color: #303c2a; }
  .az-blog__categories button:hover { color: #526349; }
  .az-blog__category-count { margin-left: 7px; font-size: 10px; opacity: .7; }
  .az-blog .az-blog__category-description { margin: 14px 0 6px; color: #757d6d; font-size: 12px; }
  .az-blog__posts { display: flex; flex-direction: column; }
  .az-post { display: grid; grid-template-columns: 210px minmax(0,1fr); align-items: center; gap: 32px; padding: 28px 0; border-bottom: 1px solid var(--day-line); background: transparent; }
  .az-post__cover { display: block; position: relative; height: 170px; overflow: hidden; background: #fff; }
  .az-post__cover img { display: block; width: 100%; height: 170px; object-fit: contain; }
  .az-post__cover--taichi img { position: absolute; width: 125px; height: auto; top: -36.164%; left: 50%; transform: translateX(-50%); }
  .az-post__body { min-width: 0; }
  .az-post__body:only-child { grid-column: 1 / -1; }
  .az-post__meta { color: #757d6d; font-size: 11px; letter-spacing: .01em; }
  .az-post .az-post__title { margin: 8px 0 10px; font-size: 22px; font-weight: 600; line-height: 1.5; }
  .az-post__title a { color: #30362e; text-decoration: none; }
  .az-post__title a:hover { color: #526349; text-decoration: underline; }
  .az-post .az-post__excerpt { margin: 0; color: #707667; font-size: 13px; line-height: 1.85; }
  .az-post__tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; font-size: 11px; color: #68775b; }
  .az-post__tags span + span:before { content: '·'; margin-right: 10px; color: #b4b7aa; }
  .az-blog__pagination { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin: 24px 0; font-size: 12px; color: #747c6d; }
  .az-blog__pagination button { padding: 6px 0; border: 0; border-bottom: 1px solid #cdd3c6; border-radius: 0; background: transparent; color: #526349; font: inherit; font-size: 12px; cursor: pointer; }
  .az-blog__pagination button:disabled { opacity: .3; cursor: default; }
  .az-blog__empty { margin: 34px 0; font-size: 13px; color: #747c6d; }
  .az-post[hidden], .az-blog__empty[hidden], .az-blog__pagination[hidden] { display: none !important; }
  @media (max-width: 640px) {
    body.blog-page #main { width: calc(100% - 40px); }
    .az-blog__profile { gap: 18px; padding: 32px 0; grid-template-columns: minmax(0,1fr) minmax(0,.8fr); }
    .az-blog .az-blog__eyebrow { margin-bottom: 18px; font-size: 10px; }
    .az-blog__avatar { width: 65px; height: 78px; }
    .az-blog .az-blog__quote { font-size: 23px; }
    .az-blog .az-blog__sub { font-size: 11px; }
    .az-blog__art { max-width: 220px; }
    .az-blog__socials { gap: 12px; }
    .az-blog__categories { gap: 5px 18px; }
    .az-blog__categories button { font-size: 12px; }
    .az-post { grid-template-columns: 110px minmax(0,1fr); gap: 18px; padding: 24px 0; }
    .az-post__cover, .az-post__cover img { height: 120px; }
    .az-post__cover--taichi img { width: 88px; height: auto; }
    .az-post .az-post__title { font-size: 18px; }
    .az-post .az-post__excerpt { font-size: 12px; }
    .az-post__tags { margin-top: 9px; }
  }
  @media (max-width: 380px) {
    .az-blog__profile { grid-template-columns: 1fr; }
    .az-blog__art { max-width: 170px; }
    .az-post { grid-template-columns: 1fr; gap: 12px; }
    .az-post__cover { width: 100%; }
  }
</style>

{% assign blog_posts = site.categories.blog | sort: 'date' | reverse %}
{% assign travel_posts = blog_posts | where: 'blog_category', 'travel' | reverse %}
{% assign planner_posts = blog_posts | where: 'blog_category', 'planner' %}
{% assign misc_posts = blog_posts | where_exp: 'post', "post.blog_category != 'travel'" | where_exp: 'post', "post.blog_category != 'planner'" %}
{% assign misc_count = misc_posts.size %}
{% assign blog_posts = misc_posts | concat: travel_posts | concat: planner_posts %}

<div class="az-blog">
  <section class="az-blog__profile">
    <div class="az-blog__identity">
    <p class="az-blog__eyebrow">DAY / JOURNAL</p>
    <div class="az-blog__avatar">
      {% include site-image.html src='/images/blog-day-plush-avatar.png' alt='Day 的呆呆小狗玩偶，穿着草莓上衣和绿色流苏裙' sizes='160px' loading='eager' %}
    </div>
    <div class="az-blog__intro">
      <p class="az-blog__quote">表达自己，才能<br /><em>make influence!</em></p>
      <p class="az-blog__sub">这里记录我的随笔、研究笔记和项目复盘。</p>
      <p class="az-blog__sub"><a href="#footprints">评论区：聊聊你的想法</a></p>
      <div class="az-blog__socials" aria-label="social links">
        <a href="https://github.com/Da1yuqin" title="GitHub">GH</a>
        <a href="https://scholar.google.com/citations?user=lTE-iwYAAAAJ&hl=zh-CN" title="Google Scholar">GS</a>
        <a href="https://dblp.org/pid/244/9818.html" title="DBLP">DB</a>
        <a href="mailto:{{ site.author.email }}" title="Email">@</a>
      </div>
    </div>
    </div>
    <figure class="az-blog__art az-blog__art--original">
      {% include site-image.html src='/images/blog-taichi-original.jpg' alt='太一骑在暴龙兽头上的原图' sizes='(max-width: 768px) 360px, 410px' loading='eager' %}
    </figure>
  </section>

  <h2 class="az-blog__section-title" id="articles">Articles</h2>

  <div class="az-blog__categories" role="tablist" aria-label="博客分类">
    <button type="button" role="tab" id="blog-tab-all" aria-selected="true" aria-controls="blog-posts" data-blog-filter="all" data-description="这里记录了全部的博客">全部<span class="az-blog__category-count" aria-hidden="true">{{ blog_posts.size }}</span></button>
    <button type="button" role="tab" id="blog-tab-misc" aria-selected="false" aria-controls="blog-posts" tabindex="-1" data-blog-filter="misc" data-description="碎碎念，随便看看">杂七杂八<span class="az-blog__category-count" aria-hidden="true">{{ misc_count }}</span></button>
    <button type="button" role="tab" id="blog-tab-travel" aria-selected="false" aria-controls="blog-posts" tabindex="-1" data-blog-filter="travel" data-description="探索地球中">地球OL打卡<span class="az-blog__category-count" aria-hidden="true">{{ travel_posts.size }}</span></button>
    <button type="button" role="tab" id="blog-tab-planner" aria-selected="false" aria-controls="blog-posts" tabindex="-1" data-blog-filter="planner" data-description="其实，我也有努力工作">J人模式副产物<span class="az-blog__category-count" aria-hidden="true">{{ planner_posts.size }}</span></button>
  </div>
  <p class="az-blog__category-description" id="blog-category-description" role="status" aria-live="polite">这里记录了全部的博客</p>

  {% if blog_posts and blog_posts.size > 0 %}
    <section class="az-blog__posts" id="blog-posts" role="tabpanel" aria-labelledby="blog-tab-all">
      {% for post in blog_posts %}
        {% assign words = post.content | strip_html | number_of_words %}
        {% assign minutes = words | divided_by: 260 | plus: 1 %}
        {% assign blog_category = 'misc' %}
        {% if post.blog_category == 'travel' or post.blog_category == 'planner' %}{% assign blog_category = post.blog_category %}{% endif %}
        <article class="az-post" data-blog-category="{{ blog_category }}"{% if forloop.index > 5 %} hidden{% endif %}>
          {% if post.cover %}<a class="az-post__cover az-post__cover--image{% if post.cover_frame == 'taichi' %} az-post__cover--taichi{% endif %}" href="{{ post.url | relative_url }}" target="_self" aria-label="{{ post.title }}">{% include site-image.html src=post.cover alt=post.title defer=true %}</a>{% endif %}
          <div class="az-post__body">
            <div class="az-post__meta">{{ post.date | date: "%Y-%m-%d" }} · {{ minutes }} min · {{ words }} words</div>
            <h3 class="az-post__title"><a href="{{ post.url | relative_url }}" target="_self">{{ post.title }}</a></h3>
            {% if post.excerpt %}
              <p class="az-post__excerpt">{{ post.excerpt | strip_html | strip_newlines | truncate: 140 }}</p>
            {% endif %}
            {% if post.tags and post.tags.size > 0 %}
              <div class="az-post__tags">
                {% for t in post.tags %}<span>{{ t }}</span>{% endfor %}
              </div>
            {% endif %}
          </div>
        </article>
      {% endfor %}
    </section>
  {% else %}
    <div class="az-blog__empty">这里还没有文章。</div>
  {% endif %}
  <p class="az-blog__empty" id="blog-category-empty" hidden>这个分类还没有文章。</p>
  <nav class="az-blog__pagination" id="blog-pagination" aria-label="文章翻页" hidden>
    <button type="button" id="blog-page-prev" aria-controls="blog-posts">上一页</button>
    <span id="blog-page-status" role="status" aria-live="polite"></span>
    <button type="button" id="blog-page-next" aria-controls="blog-posts">下一页</button>
  </nav>
  <noscript><style>.az-post[hidden] { display: block; } .az-post img[data-src] { display: none; }</style></noscript>
  {% include blog-footprints.html %}
</div>

<script>
  (function () {
    var tabs = Array.from(document.querySelectorAll('[data-blog-filter]'));
    var posts = Array.from(document.querySelectorAll('[data-blog-category]'));
    var panel = document.getElementById('blog-posts');
    var description = document.getElementById('blog-category-description');
    var empty = document.getElementById('blog-category-empty');
    var pagination = document.getElementById('blog-pagination');
    var previous = document.getElementById('blog-page-prev');
    var nextPage = document.getElementById('blog-page-next');
    var status = document.getElementById('blog-page-status');
    var category = 'all';
    var page = 1;
    var pageSize = 5;

    function renderPage() {
      var filtered = posts.filter(function (post) { return category === 'all' || post.dataset.blogCategory === category; });
      var pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
      page = Math.max(1, Math.min(page, pageCount));
      var visible = filtered.slice((page - 1) * pageSize, page * pageSize);
      posts.forEach(function (post) {
        post.hidden = visible.indexOf(post) === -1;
        if (!post.hidden) {
          post.querySelectorAll('img[data-src]').forEach(function (image) {
            if (image.dataset.srcset) image.srcset = image.dataset.srcset;
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
            image.removeAttribute('data-srcset');
          });
        }
      });
      empty.hidden = filtered.length > 0;
      pagination.hidden = filtered.length <= pageSize;
      previous.disabled = page === 1;
      nextPage.disabled = page === pageCount;
      status.textContent = '第 ' + page + ' / ' + pageCount + ' 页';
    }

    function selectTab(tab) {
      category = tab.dataset.blogFilter;
      page = 1;
      tabs.forEach(function (item) {
        var selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      description.textContent = tab.dataset.description;
      if (panel) panel.setAttribute('aria-labelledby', tab.id);
      renderPage();
    }
    function turnPage(direction) {
      page += direction;
      renderPage();
      document.getElementById('articles').scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    previous.addEventListener('click', function () { turnPage(-1); });
    nextPage.addEventListener('click', function () { turnPage(1); });
    renderPage();
    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { selectTab(tab); });
      tab.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        tabs[next].focus();
        selectTab(tabs[next]);
      });
    });
  }());
</script>
