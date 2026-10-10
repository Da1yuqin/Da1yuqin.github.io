# Blog 评论与正文批注

公开评论显示在文章下方，可点击“回复”继续讨论；选中正文后可在侧栏添加批注，公开批注会高亮原文。回复和批注都可选择私密。私密评论保存在 D1，只有登录网站所有者的 Cloudflare 账号才能查看。网站没有读取私密评论的接口。

服务使用 Cloudflare 免费计划：Worker `day-comments`，D1 数据库 `day-comments`。评论接口为 `https://day-comments.thpv54ng76.workers.dev/comments`，每个 IP 每分钟最多提交 5 次，不在评论数据库保存 IP。

作者查看留言：[打开留言数据库](https://dash.cloudflare.com/622a927a4fb267283f026d49be2afc1b/workers/d1/databases/94141aa6-f6d2-409d-a642-6a1b0e38fa6d/studio)，选择 `comments` 表；`visibility` 为 `private` 的是私密留言。

更新接口：在 Cloudflare 的 Workers & Pages → day-comments → Edit code 中粘贴 `worker.mjs` 并 Deploy。保留 D1 绑定 `DB`、限流绑定 `COMMENT_LIMIT`（namespace 1001，5 次/60 秒）和变量 `SITE_ORIGIN=https://da1yuqin.github.io`。数据库结构在 `schema.sql`。从旧版升级时，先逐条执行 `migration-replies.sql` 的两条 ALTER TABLE，再部署 Worker；旧留言保留。重复升级前先检查 `PRAGMA table_info(comments)`，不要重复添加字段。

也可以在本目录使用 Wrangler 登录后更新：

```sh
npx wrangler login
npx wrangler deploy
```

网站 `_config.yml` 的 `blog_comments_api` 已配置 Worker HTTPS 地址。作者也可以在 Cloudflare 的 D1 Console 中查询评论：

```sql
SELECT page, name, content, visibility, created_at FROM comments ORDER BY id DESC;
```

验证权限隔离（Node 24）：

```sh
node --test test.mjs
```
