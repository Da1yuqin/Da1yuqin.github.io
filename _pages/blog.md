---
permalink: /blog/
title: "Blog"
excerpt: ""
author_profile: true
---

<style>
  .blog-list { margin: 0; padding: 0; list-style: none; }
  .blog-item {
    margin: 0 0 16px 0;
    padding: 14px 16px;
    border: 1px solid rgba(0,0,0,.08);
    border-radius: 12px;
    background: rgba(255,255,255,.7);
  }
  .blog-item a { text-decoration: none; }
  .blog-title { font-size: 1.05rem; font-weight: 700; margin: 0 0 6px 0; }
  .blog-meta { font-size: .9rem; color: rgba(0,0,0,.6); margin: 0 0 8px 0; }
  .blog-excerpt { margin: 0; color: rgba(0,0,0,.8); }
  .blog-tags { margin-top: 8px; font-size: .85rem; color: rgba(0,0,0,.6); }
  .blog-tags code { font-size: .85rem; }
</style>

{% assign blog_posts = site.categories.blog %}

{% if blog_posts and blog_posts.size > 0 %}
<ul class="blog-list">
  {% for post in blog_posts %}
    <li class="blog-item">
      <div class="blog-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></div>
      <div class="blog-meta">{{ post.date | date: "%Y-%m-%d" }}</div>
      {% if post.excerpt %}
        <p class="blog-excerpt">{{ post.excerpt | strip_html | strip_newlines | truncate: 180 }}</p>
      {% endif %}
      {% if post.tags and post.tags.size > 0 %}
        <div class="blog-tags">Tags: {% for t in post.tags %}<code>{{ t }}</code>{% if forloop.last == false %} {% endif %}{% endfor %}</div>
      {% endif %}
    </li>
  {% endfor %}
</ul>
{% else %}
<p>这里会展示我的博客文章列表。你可以在仓库的 <code>_posts/</code> 下新增 Markdown 文件（例如 <code>YYYY-MM-DD-title.md</code>），并在 Front Matter 里写上 <code>categories: [blog]</code>，它就会自动出现在这里。</p>
{% endif %}
