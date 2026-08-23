# Seedance Watermark Remover

Seedance Watermark Remover 是独立部署在 [www.seedances.co](https://www.seedances.co) 的 Seedance 水印处理站点。项目采用 Astro、React islands、Vercel 与私有 Cloudflare R2，并通过 Pages CMS 维护博客和 SEO 落地页。

> 当前状态：用户可以匿名选择和预览一张 JPG、PNG 或 WebP 图片，创建处理任务时需要 Google 登录。上传、私有临时存储、任务归属和下载流程已实现，但处理器仍是 Mock Provider，会返回未修改的副本。当前不支持 MP4/MOV 等视频文件，不应对外宣称已经真实移除 Seedance 水印或支持视频处理。

## 站点边界

- 正式域名：[www.seedances.co](https://www.seedances.co)，根域名 308 跳转到 `www`
- GitHub：[teddy920810/seedance-watermark](https://github.com/teddy920810/seedance-watermark)
- 部署：独立 Vercel 项目
- Google OAuth 与 R2：与原图片站共享凭据/基础设施
- 站点身份：`SITE_URL` 和 `BETTER_AUTH_URL` 独立使用 `https://www.seedances.co`
- OAuth 回调：`https://www.seedances.co/api/auth/callback/google`
- Analytics：默认关闭，配置本站独立 GA4 ID 后才启用

共享 R2 时，必须在 Bucket CORS 中同时保留两个站点的明确来源。R2 密钥只允许服务端使用；上传、结果和任务记录仍应由 24 小时生命周期规则清理。两个站点的 Vercel 项目、域名、内容和发布历史相互独立。

## 本地开发

需要 Node.js 22 和 npm 10 或更高版本：

```sh
git clone https://github.com/teddy920810/seedance-watermark.git
cd seedance-watermark
npm ci
cp .env.example .env.local
npm run dev
```

Windows 可用 `Copy-Item .env.example .env.local`，但项目实现和脚本本身必须保持跨平台。

Google 登录需要 `GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET`、`BETTER_AUTH_SECRET` 和 `BETTER_AUTH_URL`。R2 需要 `.env.example` 中列出的 `R2_*` 变量。真实凭据通过安全渠道获取，不得提交 `.env.local`、OAuth JSON、`S3-info.txt` 或任何访问密钥。

## 架构

```text
浏览器
  ├─ Astro 静态 SEO 与内容页面
  ├─ React 图片上传/Google 登录岛
  └─ Better Auth 加密会话
       ├─ Vercel API 生成 R2 预签名地址
       ├─ 浏览器直传私有 R2
       └─ Vercel API 创建并查询用户归属任务
                         └─ WatermarkProvider（当前为 Mock）
```

原站和 Seedance 站共享 Google/R2 并不意味着共享域名配置：每个 Vercel 项目都要分别设置自己的 `SITE_URL` 与 `BETTER_AUTH_URL`，Google OAuth Web Client 需要同时允许两个正式回调。

## 内容与质量

- `src/content/homepage/`：首页内容
- `src/content/landing-pages/`：Seedance SEO 落地页
- `src/content/blog/`：Seedance 指南
- `src/content/legal/`：隐私政策和条款
- `src/content/settings/`：品牌、导航、Footer、SEO 与 CMS 设置
- `src/lib/providers/`：可替换处理 Provider
- `src/pages/api/`：服务端 API

行为或配置变化遵循 TDD。提交前运行：

```sh
npm run check:content # 内容、SEO、素材或 Blog 本地迭代
npm run check:ui      # 公共视觉改动的代表页面抽查
npm run check:fast    # 开发中快速回归
npm run site:validate
npm run verify
npm run release:verify # 合并 main 前的完整门禁与敏感文件审计
```

开发中按改动风险选择定向命令，避免反复执行完整套件；合并 `main` 前仍必须执行完整发布门禁。所有新增或修改的路由逐一检查，共享样式和组件的未修改使用方按“复杂页面 + 历史页面 + 桌面端 + 移动端”抽查，任一抽查失败即扩大到全部受影响页面。

生产域名、R2、CORS 或 Vercel 环境变量变化后，部署完成再运行 `npm run test:smoke:production`。该命令会向真实 Bucket 写入临时测试对象，不要试探性反复执行。

详细规则见 [开发者指南](docs/DEVELOPER_GUIDE.md)、[运维手册](docs/OPERATIONS_RUNBOOK.md)、[测试指南](docs/TESTING_GUIDE.md)、[Pages CMS 教程](docs/PAGES_CMS_GUIDE.md) 和 [贡献指南](CONTRIBUTING.md)。
