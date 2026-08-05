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
    background: #f7edf2 url('/images/site-bg.png') center / cover fixed no-repeat !important;
  }

  body.blog-page:before,
  body.blog-page:after {
    display: none !important;
  }

  body.blog-page .masthead {
    margin: 14px auto 0 auto;
    width: min(92vw, 980px);
    border: 1px solid rgba(255,255,255,.36);
    border-radius: 999px;
    background: rgba(32, 24, 32, .42) !important;
    box-shadow: 0 18px 48px rgba(28, 18, 30, .18);
    backdrop-filter: blur(18px) saturate(145%);
    -webkit-backdrop-filter: blur(18px) saturate(145%);
  }

  body.blog-page .masthead a,
  body.blog-page .masthead button {
    color: rgba(255,255,255,.92) !important;
  }

  body.blog-page #main {
    width: min(1040px, 94vw);
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 54vh;
    text-align: center;
  }

  .az-blog__avatar {
    width: 116px;
    height: 116px;
    padding: 5px;
    border-radius: 999px;
    background: rgba(255,255,255,.82);
    box-shadow: 0 18px 48px rgba(60, 36, 56, .24);
  }

  .az-blog__avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 999px;
  }

  .az-blog__intro {
    width: min(620px, 92vw);
    margin-top: -18px;
    padding: 46px 28px 24px 28px;
    border: 1px solid rgba(255,255,255,.35);
    border-radius: 28px;
    color: rgba(255,255,255,.96);
    background: rgba(31, 24, 34, .48);
    box-shadow: 0 20px 60px rgba(45, 25, 45, .20);
    backdrop-filter: blur(20px) saturate(145%);
    -webkit-backdrop-filter: blur(20px) saturate(145%);
  }

  .az-blog__quote {
    margin: 0;
    font-size: 1.15rem;
    line-height: 1.7;
    font-weight: 650;
  }

  .az-blog__sub {
    margin: 10px 0 0 0;
    color: rgba(255,255,255,.76);
    font-size: .96rem;
  }

  .az-blog__socials {
    display: flex;
    justify-content: center;
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
    color: rgba(255,255,255,.94);
    text-decoration: none;
    background: rgba(255,255,255,.16);
    transition: transform .18s ease, background .18s ease;
  }

  .az-blog__socials a:hover {
    transform: translateY(-2px);
    background: rgba(255,255,255,.26);
  }

  .az-blog__section-title {
    margin: 18px 0 14px 0;
    color: rgba(255,255,255,.95);
    text-shadow: 0 2px 16px rgba(0,0,0,.22);
    font-size: 1.45rem;
  }

  .az-blog__posts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .az-post {
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.34);
    border-radius: 24px;
    color: rgba(255,255,255,.94);
    background: rgba(31, 24, 34, .46);
    box-shadow: 0 18px 48px rgba(40, 20, 40, .18);
    backdrop-filter: blur(18px) saturate(145%);
    -webkit-backdrop-filter: blur(18px) saturate(145%);
    transition: transform .18s ease, box-shadow .18s ease;
  }

  .az-post:hover {
    transform: translateY(-3px);
    box-shadow: 0 24px 62px rgba(40, 20, 40, .24);
  }

  .az-post__cover {
    display: block;
    height: 160px;
    background: rgba(255,255,255,.16) url('/images/site-bg.png') center / cover no-repeat;
  }

  .az-post__body {
    padding: 16px 18px 18px 18px;
  }

  .az-post__meta {
    font-size: .84rem;
    color: rgba(255,255,255,.66);
  }

  .az-post__title {
    margin: 8px 0 0 0;
    font-size: 1.12rem;
    line-height: 1.28;
  }

  .az-post__title a {
    color: rgba(255,255,255,.96);
    text-decoration: none;
  }

  .az-post__excerpt {
    margin: 10px 0 0 0;
    color: rgba(255,255,255,.72);
    font-size: .94rem;
  }

  .az-post__tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 12px;
  }

  .az-post__tags span {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: .78rem;
    color: rgba(255,255,255,.78);
    background: rgba(255,255,255,.14);
  }

  .az-blog__empty {
    padding: 18px 22px;
    border-radius: 22px;
    color: rgba(255,255,255,.9);
    background: rgba(31, 24, 34, .46);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
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
      min-height: 58vh;
      justify-content: flex-start;
      padding-top: 34px;
    }

    .az-blog__avatar {
      width: 92px;
      height: 92px;
    }

    .az-blog__intro {
      width: 100%;
      margin-top: -14px;
      padding: 38px 18px 20px 18px;
      border-radius: 24px;
    }

    .az-blog__quote {
      font-size: 1rem;
    }

    .az-blog__posts {
      grid-template-columns: 1fr;
      gap: 12px;
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

<div class="az-blog">
  <section class="az-blog__profile">
    <div class="az-blog__avatar">
      <img src="/{{ site.author.avatar }}" alt="戴语琴 Harper" />
    </div>
    <div class="az-blog__intro">
      <p class="az-blog__quote">请问，你是我的 master 吗？</p>
      <p class="az-blog__sub">这里记录我的随笔、研究笔记和项目复盘。</p>
      <div class="az-blog__socials" aria-label="social links">
        <a href="https://github.com/Da1yuqin" title="GitHub">GH</a>
        <a href="https://scholar.google.com/citations?user=lTE-iwYAAAAJ&hl=zh-CN" title="Google Scholar">GS</a>
        <a href="https://dblp.org/pid/244/9818.html" title="DBLP">DB</a>
        <a href="mailto:{{ site.author.email }}" title="Email">@</a>
      </div>
    </div>
  </section>

  <h2 class="az-blog__section-title">Articles</h2>

  {% if blog_posts and blog_posts.size > 0 %}
    <section class="az-blog__posts">
      {% for post in blog_posts %}
        {% assign words = post.content | strip_html | number_of_words %}
        {% assign minutes = words | divided_by: 260 | plus: 1 %}
        <article class="az-post">
          <a class="az-post__cover" href="{{ post.url | relative_url }}" aria-label="{{ post.title }}"></a>
          <div class="az-post__body">
            <div class="az-post__meta">{{ post.date | date: "%Y-%m-%d" }} · {{ minutes }} min · {{ words }} words</div>
            <h3 class="az-post__title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
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
    <div class="az-blog__empty">这里会展示我的博客文章列表。在 <code>_posts/</code> 下新增 Markdown 文件，并设置 <code>categories: [blog]</code> + <code>layout: post</code> 后会自动出现。</div>
  {% endif %}
</div>
