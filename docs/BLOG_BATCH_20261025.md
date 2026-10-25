# 2026-10-25 Alternative Tips 首批（18、17）

## 范围

用户授权北京时间每天22:00启动、每日最多两篇，从18倒序至01。本批为18、17；其余未到期正文与图片不进入公开目录。基于最新origin/main f45420ce7d5dc9f5a1b3fb8b6bc8cc030017ab04建立codex/blog-batch-20261025，隔离主目录已有视频增强等未提交改动。

源包从用户交付目录复制到设备本地的.codex/article-publishing/seedance-2026-10-25/packages，并与manifest逐个SHA256核对。ZIP数据不执行；只复制导入清单指定的原图。沿用/blog与现有CMS模板，不导入包内导航、页脚、脚本、样式或Logo，不改写运营文字。

| 编号 | 路由 | ZIP SHA256 | 图片数 |
| --- | --- | --- | --- |
| 18 | /blog/kling-4-vs-seedance-2-5 | 3db62aa13dfc2d11c2dd53aecbaa6f749f9c08d73ce58dfbdaeed8dfa14f479f | Hero 1 + 正文 2 |
| 17 | /blog/seedance-vs-wan | 3d2535767583c0dfc0817a1b61916ab245a07435f153ca9703cbe16334ccdb3e | Hero 1 + 正文 1 |

publishedAt使用本批实际日期2026-10-25；正文原始日期保持。分类为Seedance Alternative Tips，原眉题保留。

## 实施与证据

原文校验抓到默认smartypants会把直引号/撇号变为弯引号，因此先加入失败回归，再在实际unified处理器设置smartypants:false。未放宽原文基准；构建产物中的两篇全文字符哈希与原稿一致。


- 导入器先加入alternative-tips canonical、分类及完整元数据/原文/媒体回归测试；红测后最小实现，12项通过。
- 内容回归独立解析源HTML生成正文字符摘要、元数据和图片哈希基准；只忽略排版空白，不忽略文字、数字或标点。缺文章时先红，再导入。
- 发布前npm audit发现既有锁文件有18项风险（11高危、7中危），CI的高危审计会阻止发布。只在已有semver范围内修补，不使用force或改动第三方初始化契约；最终锁文件和实际npm ci安装树audit均为0漏洞；Astro锁为7.3.3以保留Node22.19支持，Sharp0.35.5、Vitest/Mocker/Coverage4.1.12、Zod4.6.7、Vite8.3.5。package.json及lock根范围均保持原样，19项最低安全版本/peer/平台回归通过。

## 发布门（合并及生产结果见本批PR/ledger）

Code：check:content 132项、coverage单测231项通过；类型检查0错误。1440桌面/390手机的两篇构建产物已逐一通过正文字符SHA、元数据、全部5图的原字节哈希/WebP currentSrc/移除source后的原图fallback、alt/顺序、目录、实际复制链接、列表封面、sitemap与无页面横向溢出检查，并保存截图。完整release:verify（含verify）通过：231项单测、43项Chromium浏览器场景、lint/类型检查、构建和发布审计通过；生成65张原图的315个WebP变体，图片门禁覆盖28个HTML/84个图片引用。开发工具栏的fetch诊断出现警告，但全部门禁退出0；生产构建产物的独立真实浏览器验收通过。
Repository：待本批commit、PR、必需CI与Preview通过后合并。
Deployment：待核对生产Ready与main SHA。
Domain：配置未更改，发布后检查公开HTTPS。
Identity：本批不改OAuth，真实登录不在内容验收范围。
Production flow：待逐篇全文/全部原图、WebP与fallback、alt/图注/顺序、目录、分享、列表、sitemap和公共smoke；不运行写真实R2的认证smoke。

仅生产验收通过才在本机publication-ledger.json记published。最终合并SHA、生产身份及实测结果记录在本批PR与ledger，不能把本地或commit当成上线成功。

## 原文与原图基准

### 18 kling-4-vs-seedance-2-5

- index.html SHA256：f84013aa511bc41d4f691c239458a8304d7a547f1079e0434ff9d0ef470a2daf
- 正文字符数（仅忽略空白）：12889
- 正文字符 SHA256：98e88e0992b065e7a4649eddeff1df23b23026f11b638cd24d564746b77f64e7

| 原图路径 | SHA256 |
| --- | --- |
| /uploads/blog/kling-4-vs-seedance-2-5/hero.png | c7182c5e9ed6f9413eeab2e4c58e0f838520261242c061cd6d4e8d8284023764 |
| /uploads/blog/kling-4-vs-seedance-2-5/figure-1.png | 4cc6d2a13623d8cffe462e8ca4e2e1300b826ffe1426949c9c0ba2af2a9fd3f4 |
| /uploads/blog/kling-4-vs-seedance-2-5/figure-2.png | 291d464074e372a1f37d4e93040a635a3fbd09ae8195314740690be6aa38dc7d |

### 17 seedance-vs-wan

- index.html SHA256：897bba8f495ac8dac71405e40b7d329ae9e7553bd568b0096979afac880accef
- 正文字符数（仅忽略空白）：10676
- 正文字符 SHA256：a1517af822e7af974be10bfc0ecbd95f2276bfef90413876f2fcc168976be9a9

| 原图路径 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-vs-wan/hero.png | ca1fa64cdcce8eb19e6f0ff8800ea1f46dd411465fafdf989f32d631ff59157c |
| /uploads/blog/seedance-vs-wan/figure-1.jpg | 057d35f50d1c91782fd2b08c8088ba9de0a2cab5a83ef111af4dadbe64bb7799 |
