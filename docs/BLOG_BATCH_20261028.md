# 2026-10-28 Alternative Tips 第四批（12、11）

本批于北京时间2026-10-28 22:00到期后执行，两篇沿用Astro Blog和Pages CMS，实际发布日期2026-10-28。origin为teddy920810/seedance-watermark，分支codex/blog-batch-20261028，基线8e1243725191b81482eed093b6fadc68bcbd92e6。开始前路由均404且无重复分支/PR；前三批6篇已生产验收。主目录27项既有改动保留，未来文章不进入公开目录。

仅解析源HTML并复制清单指定原图，不执行包内代码。运营H1/SEO/摘要/原文/FAQ/表格/CTA/阅读时间/原文日期与所有图片字节、alt/图注/顺序均保留。独立parse5源基准先锁元数据、仅忽略空白的正文SHA、语义结构、href顺序和原图哈希，缺文章2项红测后导入转绿。

## 发布门禁所需依赖修复

当日npm audit新报告better-auth及适配器共3项（critical1、low2），会阻断CI。先给dependency-security测试添加最低安全版本，原锁文件出现3项预期失败，再仅将better-auth锁至官方最低修复1.7.7及所需依赖；package.json原范围^1.6.26保持不变。未修改auth.ts、第三方初始化配置、域名、OAuth控制台、凭据或R2。

官方安全公告：https://github.com/better-auth/better-auth/security/advisories/GHSA-965c-763c-88jm

官方发布说明：https://github.com/better-auth/better-auth/releases/tag/v1.7.7

官方升级指南：https://better-auth.com/docs/guides/1-7-upgrade-guide

本站仅Google、无MagicLink/OAuthProxy/数据库，不声称已证实满足公告利用条件。官方当前指南确认直接升级无需数据库迁移。定向25项通过，包含安全版本、Google授权callback/PKCE/state HttpOnly cookie、匿名会话和无绑定state回调拒绝；audit修复后0。认证依赖发生变化，Identity单独验收，不写N/A；授权跳转检查不冒充Google回跳和会话验证。

## 源基准与全部原图

### 12 seedance-vs-gemini-omni-flash

- 路由：/blog/seedance-vs-gemini-omni-flash
- ZIP SHA256：0bf2fe293cd97fb1380239eeac0056d8e0340e5c703c7f9c0bdc2e795c79d4a3
- HTML SHA256：0ddc26bb2bcfcc3bdda16898f29c61f14e74492d411d11e80262ab1873dbb59a
- 正文：10343字符，SHA256 f3ab6a3230d717c2257856ccfb17748626423ab84878c2901aa8d0fe514bf073
- H2/H3/表格：10/6/1；原链接14；图片2（Hero1+正文1）。

| 原图 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-vs-gemini-omni-flash/hero.png | 32a4dde59e62ecf7ce702a153dd53658782dc8e6a30c16856fd4e8eb045a7c1e |
| /uploads/blog/seedance-vs-gemini-omni-flash/figure-1.png | 1fb2c3a5f2dfe43390960ccee04a3b7c368ac1bb9fdb39e6dd0522dc5e81f744 |

### 11 seedance-vs-adjacent-ai-tools

- 路由：/blog/seedance-vs-adjacent-ai-tools
- ZIP SHA256：a587d89cf038755b24194b5ca50d6f9ee29d803232b4edef2502195378ddb505
- HTML SHA256：713a8096a2b741e8e98025d12e2087f4814af833e3829e160c9435bc7fa00a5f
- 正文：11104字符，SHA256 70cf3f265289c59ef4848f5b79f5b964ede0b037fad2b719565ce18666127a17
- H2/H3/表格：7/13/1；原链接11；图片2（Hero1+正文1）。

| 原图 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-vs-adjacent-ai-tools/hero.png | ed4c7950ca1a37cf1bb764c485473921807a6e3fd2c6f88c80b3821198e6b5d7 |
| /uploads/blog/seedance-vs-adjacent-ai-tools/figure-1.png | ee3f73737b4f99c6d50700df21a2d944799bf71959d38250387170c488b57147 |

## 六项发布门

| Gate | 本记录编写时状态 |
| --- | --- |
| Code | check:content141、依赖/认证25项、audit0通过；一次release:verify（含verify）全部通过：242项coverage单测、49项Chromium E2E、lint/类型检查0错误、构建与发布审计通过，77张源图生成375个WebP，34HTML/102图片引用通过；1440/390两路由的全文SHA、4图原字节/WebP/强制fallback/alt/图注顺序、14/11href、TOC、分享目标、复制按钮反馈与目标、手机表格末列、列表封面、sitemap均通过；系统剪贴板独立literal写读也为空，实际复制读回保留为工具环境未验证，不冒充通过 |
| Repository | 待commit/push/PR、CI和Preview通过后合并main；不force push |
| Deployment | 待Production READY、精确main SHA和正式别名 |
| Domain | 配置未改；生产HTTPS与apex跳转待核验 |
| Identity | 依赖补丁后本地协议测试通过；生产OAuth授权启动、Google回跳与会话待验收 |
| Production flow | 待全文/全部4图原字节与WebP/fallback、alt/图注/顺序、目录/复制分享、手机表格、Blog列表、sitemap及公开smoke；不运行认证R2写入smoke |

生产验收通过才记published。最终PR、merge SHA、部署和各门状态写本批PR描述与publication-ledger.json；源报告、首红/绿、完整门禁日志和桌面/手机证据保存本轮设备本地evidence/20261028。下一批10/9仅在2026-10-29 22:00后执行。
