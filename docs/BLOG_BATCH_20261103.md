# 2026-11-03 Alternative Tips 第九批（02、01，末批）

按故障顺延记录，北京时间2026-11-03 22:00后执行末批，实际发布日期2026-11-03。前批04/03于11月2日验收；本日只发布02/01，保持18→1倒序、每天最多两篇。两篇生产验收后，核对全轮18篇已完成，再停用唯一自动任务seedance-18并把当前聊天状态改为已完成。

复用本轮D盘隔离发布工作树，origin为teddy920810/seedance-watermark，分支codex/blog-batch-20261103，基线836a34ff037f8660460099718b12d165952151cf。开始前无重复分支/PR，两个正式路由均404，主目录27项既有改动排除。应用代码、测试和仓库脚本继续跨平台；本机工作位置仅是设备配置。

沿用Astro Blog与Pages CMS。H1、SEO标题、摘要、原文、FAQ、表格、列表、CTA、阅读时间、分类眉题及全部原图字节/alt/图注/顺序保留。只解析HTML与指定媒体，不执行源ZIP代码/README，不导入源导航/页脚/Logo/脚本/样式。没有共享导入器、运行时、依赖、认证、CMS模型、域名、R2或凭据变化。

## 独立源基准与测试

独立读取ZIP/HTML建立metadata、正文散列、语义结构、href顺序和原图SHA，ZIP与manifest逐一相等。新增缺稿回归先2红，导入后新批2项及既有导入器12项共14项首次转绿。另由独立复核者不调用导入器，核对实际Astro渲染的逐字原文/表格单元格/FAQ/CTA、链接和媒体。两篇各Hero1张和正文1张，本批4原图共4,672,953字节，源/落地逐张SHA相等。

### 2 happy-horse-vs-seedance-2

- 路由：/blog/happy-horse-vs-seedance-2
- ZIP SHA256：c7fe4f489a1a80523113e516e47c7303a465a2fa635f47f00ca758e57a5a1e66
- HTML SHA256：cb33e8ce3b275fb4fc95d136c9c6bfc87a8f3f203a2246622e3043ad15d9a7e4
- 正文10187字符，SHA256：1c3282b31a2fe7d20b01f0d8adcf3d4ca1870277579bb0a939ca2b47c15c2e9f
- H2/H3/表格：9/6/2；原链接12；Hero1，正文图片1。

| 原图路径 | SHA256 |
| --- | --- |
| /uploads/blog/happy-horse-vs-seedance-2/hero.png | d290d34e478a0e13a9c9803c4abfe1397092b7781170d025d792900dcf6ea74a |
| /uploads/blog/happy-horse-vs-seedance-2/figure-1.png | f3eef73c49691f55b8ef6272887d1c79fdbbb8a485d7fd2595f536fc14e3e2f9 |

### 1 best-seedance-alternatives

- 路由：/blog/best-seedance-alternatives
- ZIP SHA256：9309b868274624f69a5154988c22bad3c1fad40563375c0d2684c787fe6a6341
- HTML SHA256：ad321426f0622f33cc035b2555ef8cd2d2decb3707f6fb0e5c3a3cac3d7b87da
- 正文10636字符，SHA256：1c4026022f2504cf9d36cd012c02045d5449210a7ccf009122fe626113cda6b8
- H2/H3/表格：7/11/2；原链接17；Hero1，正文图片1。

| 原图路径 | SHA256 |
| --- | --- |
| /uploads/blog/best-seedance-alternatives/hero.png | 77906328fe59787fd20df3b7dc85e6ad9b36cbc2fa8fa4c3365d94d6a8196662 |
| /uploads/blog/best-seedance-alternatives/figure-1.png | fc678ba1faa53cdd50211a1b1e6d8b2b43c7629eff327337b2abe6706959e7fd |

## 六项发布门

| Gate | 本记录编写时状态 |
| --- | --- |
| Code | 源回归14、check:content151及首次完整release:verify通过（252项单测、59项Chromium E2E、lint/类型0错误、构建/图片/发布审计）。96源图生成471WebP，44HTML/121图片引用通过。两路由1440/390全文10187/10636字符、4原图逐张实载/原字节SHA/WebP/强制原图fallback/alt/图注顺序、12/17href、目录/分享、4次canonical实际剪贴板读回、手机4表格末列、列表封面/sitemap、无溢出均通过 |
| Repository | 待commit/push/PR、必需CI及Vercel Preview通过且无冲突后合并；禁止force push |
| Deployment | 待精确main SHA的Production READY及正式www别名 |
| Domain | 配置不变；正式HTTPS/default TLS校验、apex308待检查，不宣称权威DNS审计 |
| Identity | 不适用：仅内容；无认证代码、依赖或配置变化，不要求登录 |
| Production flow | 待完整正文、4张原图逐一实载/WebP/强制原图fallback/字节SHA/alt/图注/顺序、12/17href、目录/分享/复制、手机4张表格末列、Blog封面、sitemap和公开smoke；不运行认证R2写入测试 |

当前依赖审计为16项moderate、0项high/critical，原始报告已保留；保留现有CI的npm audit --audit-level=high门槛，不以内容批次做audit fix、依赖回退或范围扩展。

复制链接先做独立literal剪贴板写读探针；若返回空，披露实际剪贴板未验证，仍核对真实按钮反馈和canonical目标，非空错误值失败。长截图仅用于视觉概览，逐字/媒体证据来自浏览器散列和原图逐张加载/SHA。

本批PR描述与publication-ledger.json记录最终PR、merge SHA、部署、线上验收与六门结果；仅生产验收通过后记published。设备本地evidence/20261103保留源基准、红绿、完整门禁、CI/部署/公开smoke、桌面/手机图文证据。全轮完成记录另核对18个编号无遗漏/重复、所有正式路由和sitemap，再结束自动任务。
