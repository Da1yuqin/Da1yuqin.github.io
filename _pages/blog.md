---
permalink: /blog/
title: "Blog"
excerpt: ""
author_profile: true
---

<script>document.body.classList.add('blog-page');</script>

<style>
  body.blog-page {
    min-height: 100vh;
    background: #fff !important;
  }

  body.blog-page:before,
  body.blog-page:after {
    display: none !important;
  }

  body.blog-page .masthead {
    margin: 14px auto 0 auto;
    width: min(92vw, 980px);
    border: 1px solid rgba(0,0,0,.08);
    border-radius: 999px;
    background: rgba(255, 255, 255, .85) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, .05);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  body.blog-page .masthead a,
  body.blog-page .masthead button {
    color: rgba(0,0,0,.8) !important;
  }

  body.blog-page #main {
    width: min(800px, 94vw);
    max-width: none;
    margin: 0 auto;
    padding: 34px 0 80px 0;
  }

  body.blog-page .sidebar {
    display: none !important;
  }

  body.blog-page .page {
    float: none !important;
    width: 100% !important;
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  body.blog-page .page .page__inner-wrap {
    padding: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .az-blog {
    min-height: calc(100vh - 140px);
  }

  .az-blog__profile {
    display: grid;
    width: 100%;
    grid-template-columns: minmax(0, .9fr) minmax(0, 1.25fr);
    gap: 20px;
    align-items: center;
    min-height: 560px;
    box-sizing: border-box;
    padding: 28px;
    border-radius: 32px;
    overflow: hidden;
    text-align: left;
    background: #fff;
    box-shadow: 0 16px 48px rgba(0,0,0,.08);
  }

  .az-blog__identity {
    min-width: 0;
  }

  .az-blog__art {
    min-width: 0;
    margin: 0;
  }

  .az-blog__art img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 640px;
    object-fit: contain;
  }

  /* Frame the original screenshot without changing its illustration pixels. */
  .az-blog__art--original {
    position: relative;
    aspect-ratio: 1170 / 1590;
    overflow: hidden;
  }

  .az-blog__art--original img {
    position: absolute;
    top: -36.164%;
    left: 0;
    max-height: none;
  }

  .az-blog__avatar {
    width: 160px;
    height: 190px;
    flex-shrink: 0;
    padding: 0;
  }

  .az-blog__avatar img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .az-blog__intro {
    width: min(620px, 100%);
    margin-top: 14px;
    padding: 0;
    color: #333;
    background: transparent;
  }

  .az-blog__quote {
    margin: 0;
    font-size: 1.15rem;
    line-height: 1.7;
    font-weight: 650;
    color: #333;
  }

  .az-blog__sub {
    margin: 10px 0 0 0;
    color: #666;
    font-size: .96rem;
  }

  .az-blog__socials {
    display: flex;
    justify-content: flex-start;
    gap: 12px;
    margin-top: 18px;
    flex-wrap: wrap;
  }

  .az-blog__socials a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 999px;
    color: rgba(0,0,0,.6);
    text-decoration: none;
    background: rgba(0,0,0,.04);
    transition: transform .18s ease, background .18s ease;
  }

  .az-blog__socials a:hover {
    transform: translateY(-2px);
    background: rgba(0,0,0,.08);
  }

  .az-blog__section-title {
    margin: 18px 0 14px 0;
    color: rgba(0,0,0,.85);
    font-size: 1.45rem;
  }

  .az-blog__posts {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .az-blog__categories {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 0 12px;
    border-bottom: 1px solid #e9e3d9;
  }

  .az-blog__categories button {
    margin: 0;
    padding: 10px 14px;
    border: 1px solid transparent;
    border-radius: 12px;
    color: #70665b;
    background: transparent;
    font: inherit;
    font-size: .9rem;
    cursor: pointer;
  }

  .az-blog__categories button[aria-selected="true"] {
    border-color: #e8d6b5;
    color: #614c2c;
    background: #fff3d9;
  }

  .az-blog__categories button:focus-visible {
    outline: 2px solid #a47b36;
    outline-offset: 3px;
  }

  .az-blog__category-count {
    margin-left: 6px;
    opacity: .6;
    font-size: .8em;
  }

  .az-blog__category-description {
    margin: 14px 0 22px;
    color: #84786a;
    font-size: .92rem;
  }

  .az-post[hidden], .az-blog__empty[hidden] {
    display: none;
  }

  .az-post {
    overflow: hidden;
    border: 1px solid rgba(0,0,0,.06);
    border-radius: 24px;
    color: rgba(0,0,0,.85);
    background: rgba(255, 255, 255, .9);
    box-shadow: 0 12px 32px rgba(0, 0, 0, .05);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: transform .18s ease, box-shadow .18s ease;
  }

  .az-post:hover {
    transform: translateY(-3px);
    box-shadow: 0 18px 48px rgba(0, 0, 0, .1);
  }

  .az-post__cover {
    display: block;
    height: 200px;
    background: rgba(0,0,0,.02);
  }

  .az-post__cover.az-post__cover--image {
    height: auto;
  }

  .az-post__cover img {
    display: block;
    width: 100%;
    height: auto;
  }

  .az-post__body {
    padding: 20px 24px 24px 24px;
  }

  .az-post__meta {
    font-size: .84rem;
    color: rgba(0,0,0,.45);
  }

  .az-post__title {
    margin: 8px 0 0 0;
    font-size: 1.35rem;
    line-height: 1.28;
  }

  .az-post__title a {
    color: rgba(0,0,0,.9);
    text-decoration: none;
  }

  .az-post__excerpt {
    margin: 12px 0 0 0;
    color: rgba(0,0,0,.6);
    font-size: .98rem;
    line-height: 1.6;
  }

  .az-post__tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 16px;
  }

  .az-post__tags span {
    padding: 4px 12px;
    border-radius: 999px;
    font-size: .82rem;
    color: rgba(0,0,0,.5);
    background: rgba(0,0,0,.04);
  }

  .az-blog__empty {
    padding: 24px;
    border-radius: 22px;
    color: rgba(0,0,0,.5);
    background: rgba(255, 255, 255, .9);
    border: 1px solid rgba(0,0,0,.06);
  }

  @media (max-width: 768px) {
    body.blog-page {
      background-attachment: scroll !important;
      background-position: center top !important;
    }

    body.blog-page .masthead {
      width: calc(100vw - 20px);
      margin-top: 10px;
      border-radius: 22px;
    }

    body.blog-page #main {
      width: min(100vw - 20px, 560px);
      padding-top: 24px;
    }

    .az-blog__profile {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
      min-height: 0;
      padding: 24px 18px;
      border-radius: 24px;
      text-align: center;
    }

    .az-blog__avatar {
      width: 112px;
      height: 134px;
      margin: 0 auto;
    }

    .az-blog__art {
      width: 100%;
      max-width: 360px;
      margin: 0 auto;
    }

    .az-blog__socials {
      justify-content: center;
    }

    .az-blog__intro {
      width: 100%;
      margin-top: 12px;
      padding: 0;
    }

    .az-blog__quote {
      font-size: 1rem;
    }

    .az-blog__posts {
      gap: 14px;
    }

    .az-post {
      border-radius: 20px;
    }

    .az-post__cover {
      height: 122px;
    }

    .az-post__body {
      padding: 14px 15px 16px 15px;
    }
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
    <div class="az-blog__avatar">
      <img src="{{ '/images/blog-day-plush-avatar.png' | relative_url }}" alt="Day 的呆呆小狗玩偶，穿着草莓上衣和绿色流苏裙" />
    </div>
    <div class="az-blog__intro">
      <p class="az-blog__quote">表达自己，才能 make influence!</p>
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
      <img src="{{ '/images/blog-taichi-original.jpg' | relative_url }}" alt="太一骑在暴龙兽头上的原图" />
    </figure>
  </section>

  <h2 class="az-blog__section-title" id="articles">Articles</h2>

  <div class="az-blog__categories" role="tablist" aria-label="博客分类">
    <button type="button" role="tab" id="blog-tab-all" aria-selected="true" aria-controls="blog-posts" data-blog-filter="all" data-description="这里记录了全部的博客">全部<span class="az-blog__category-count" aria-hidden="true">{{ blog_posts.size }}</span></button>
    <button type="button" role="tab" id="blog-tab-misc" aria-selected="false" aria-controls="blog-posts" tabindex="-1" data-blog-filter="misc" data-description="碎碎念，随便看看">杂七杂八<span class="az-blog__category-count" aria-hidden="true">{{ misc_count }}</span></button>
    <button type="button" role="tab" id="blog-tab-travel" aria-selected="false" aria-controls="blog-posts" tabindex="-1" data-blog-filter="travel" data-description="探索地球中">地球OL打卡<span class="az-blog__category-count" aria-hidden="true">{{ travel_posts.size }}</span></button>
    <button type="button" role="tab" id="blog-tab-planner" aria-selected="false" aria-controls="blog-posts" tabindex="-1" data-blog-filter="planner" data-description="J人模式副产物">J人模式副产物<span class="az-blog__category-count" aria-hidden="true">{{ planner_posts.size }}</span></button>
  </div>
  <p class="az-blog__category-description" id="blog-category-description" role="status" aria-live="polite">这里记录了全部的博客</p>

  {% if blog_posts and blog_posts.size > 0 %}
    <section class="az-blog__posts" id="blog-posts" role="tabpanel" aria-labelledby="blog-tab-all">
      {% for post in blog_posts %}
        {% assign words = post.content | strip_html | number_of_words %}
        {% assign minutes = words | divided_by: 260 | plus: 1 %}
        {% assign blog_category = 'misc' %}
        {% if post.blog_category == 'travel' or post.blog_category == 'planner' %}{% assign blog_category = post.blog_category %}{% endif %}
        <article class="az-post" data-blog-category="{{ blog_category }}">
          {% if post.cover %}<a class="az-post__cover az-post__cover--image" href="{{ post.url | relative_url }}" target="_self" aria-label="{{ post.title }}"><img src="{{ post.cover | relative_url }}" alt="{{ post.title }}" loading="lazy" /></a>{% endif %}
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
  {% include blog-footprints.html %}
</div>

<script>
  (function () {
    var tabs = Array.from(document.querySelectorAll('[data-blog-filter]'));
    var posts = Array.from(document.querySelectorAll('[data-blog-category]'));
    var panel = document.getElementById('blog-posts');
    var description = document.getElementById('blog-category-description');
    var empty = document.getElementById('blog-category-empty');
    function selectTab(tab) {
      var category = tab.dataset.blogFilter;
      tabs.forEach(function (item) {
        var selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      var visible = 0;
      posts.forEach(function (post) {
        post.hidden = category !== 'all' && post.dataset.blogCategory !== category;
        if (!post.hidden) visible++;
      });
      description.textContent = tab.dataset.description;
      if (panel) panel.setAttribute('aria-labelledby', tab.id);
      empty.hidden = visible > 0;
    }
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
