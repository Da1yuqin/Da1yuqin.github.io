---
permalink: /blog/
title: "Blog"
excerpt: ""
author_profile: true
---

{% assign blog_posts = site.categories.blog | sort: 'date' | reverse %}

<div class="blog-hero">
  <div class="blog-hero__inner">
    <div class="blog-hero__avatar">
      <img src="/{{ site.author.avatar }}" alt="avatar" />
    </div>
    <div class="blog-hero__text">
      <div class="blog-hero__kicker">Article</div>
      <h1 class="blog-hero__title">{{ page.title }}</h1>
      <p class="blog-hero__desc">这里收录我的随笔、项目记录与研究笔记。写得慢，但尽量写清楚。</p>
      <div class="blog-hero__meta">
        {% if blog_posts and blog_posts.size > 0 %}
          <span>{{ blog_posts.size }} 篇文章</span>
        {% else %}
          <span>暂无文章</span>
        {% endif %}
        <span class="dot">·</span>
        <span>持续更新</span>
      </div>
    </div>
  </div>
</div>

{% if blog_posts and blog_posts.size > 0 %}
  <div class="blog-grid">
    {% for post in blog_posts %}
      {% assign words = post.content | strip_html | number_of_words %}
      {% assign minutes = words | divided_by: 260 | plus: 1 %}

      {% assign cover = nil %}
      {% if post.header and post.header.teaser %}
        {% assign cover = post.header.teaser %}
      {% elsif post.image %}
        {% assign cover = post.image %}
      {% endif %}

      <article class="blog-card">
        <a class="blog-card__cover" href="{{ post.url | relative_url }}" aria-label="{{ post.title }}">
          {% if cover %}
            <img src="{{ cover | relative_url }}" alt="cover" loading="lazy" />
          {% else %}
            <div class="blog-card__cover--fallback"></div>
          {% endif %}
        </a>

        <div class="blog-card__body">
          <div class="blog-card__meta">
            <span>{{ post.date | date: "%Y-%m-%d" }}</span>
            <span class="dot">·</span>
            <span>{{ minutes }} 分钟</span>
            <span class="dot">·</span>
            <span>{{ words }} 字</span>
          </div>

          <h2 class="blog-card__title">
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h2>

          {% if post.excerpt %}
            <p class="blog-card__excerpt">{{ post.excerpt | strip_html | strip_newlines | truncate: 160 }}</p>
          {% endif %}

          {% if post.tags and post.tags.size > 0 %}
            <div class="blog-card__tags">
              {% for t in post.tags %}
                <span class="tag">{{ t }}</span>
              {% endfor %}
            </div>
          {% endif %}
        </div>
      </article>
    {% endfor %}
  </div>
{% else %}
  <div class="blog-empty">
    <p>这里会展示我的博客文章列表。你可以在仓库的 <code>_posts/</code> 下新增 Markdown 文件（例如 <code>YYYY-MM-DD-title.md</code>），并在 Front Matter 里写上 <code>categories: [blog]</code> + <code>layout: post</code>，它就会自动出现在这里。</p>
  </div>
{% endif %}
