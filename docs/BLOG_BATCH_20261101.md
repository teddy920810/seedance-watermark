# 2026-11-01 Alternative Tips 第七批（06、05）

本批原定10月31日，按顺延记录于北京时间2026-11-01 22:00后执行，实际发布日期2026-11-01。前批08/07于10月31日完成生产验收；本日只发布06/05两篇，04/03顺延11月2日22:00后，保持编号倒序、每天最多两篇。

复用本轮隔离工作树；origin为teddy920810/seedance-watermark，分支codex/blog-batch-20261101，基线74bab6af5ece0f54e9bb51dd6a2aa69e7a2caadd。开始前无重复分支/PR，两路由404；主目录27项既有改动排除。未来正文和媒体不进入公开目录。

沿用Astro Blog和Pages CMS；原H1/SEO/摘要/全文/FAQ/表格/列表/CTA/阅读时间/正文日期、分类眉题及全部原图字节/alt/图注/顺序保留。只解析HTML和指定媒体数据，不执行源ZIP脚本或README，不导入源导航/页脚/Logo/脚本/样式。未改共享导入器、运行时、依赖、认证、CMS模型、域名或R2。

## 独立源基准与测试

先独立parse5解析源HTML及ZIP原图字节建立完整metadata、忽略布局空白的正文SHA、语义结构和href顺序，ZIP SHA匹配manifest。两篇缺失失败回归先红，导入后首次转绿：新批2项和既有导入器12项共14项通过；不使用导入器输出构造期望。本批全部4张原图共4,548,950字节，源与落地逐张SHA相等，无额外Markdown适配。

### 6 seedance-vs-higgsfield-ai

- 路由：/blog/seedance-vs-higgsfield-ai
- ZIP SHA256：eae69e337691c48ac886107c93b271ee9923166a5268a0179f4d69453474327a
- HTML SHA256：e78abc4b48920b4be14605cb2488a12ddce4539cdef6840fe39dd6d84778aab1
- 正文10608字符，SHA256：36f55c710ae733fad18abfc3fc66ceff78974db6a6442bfb7739b1a86c0109a9
- H2/H3/表格：9/6/2；原链接10；媒体2（Hero1+正文1）。

| 原图路径 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-vs-higgsfield-ai/hero.png | 4bb4909b03cbc7ad3f36ba2c0f95a5b8316cc0e6fafdb5914948f8722bfe88ea |
| /uploads/blog/seedance-vs-higgsfield-ai/figure-1.png | 82491b92beb15f69f205ccf8ad9ecb7f57f55a05ee1e0cf5b3c48f9f87875d9f |

### 5 seedance-vs-grok-imagine

- 路由：/blog/seedance-vs-grok-imagine
- ZIP SHA256：61482f16f614c5d4cb670a98dceb452b7b78887f31aa31cfdcee0deae9f0e8b2
- HTML SHA256：cedf7c12e86a3ff66d3b74189d62a29c22cdf5ea428b68463f2c05ae556731b2
- 正文10595字符，SHA256：5ee4000e4576d867a29fef6b2612af60f6f3c569491c997597d2d19d675eb1d5
- H2/H3/表格：10/6/2；原链接10；媒体2（Hero1+正文1）。

| 原图路径 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-vs-grok-imagine/hero.png | 3afe6aa3f3187bbd75cbb8d170b5f3c2c4218433044341284cf38b9b2f9c921f |
| /uploads/blog/seedance-vs-grok-imagine/figure-1.png | 5d6fddd4c040c78513bc4300133b9ec7d096d66cd8aea6bd176b5e7a91857238 |

## 六项发布门

| Gate | 本记录编写时状态 |
| --- | --- |
| Code | 源回归14、check:content147、完整release:verify通过（248项coverage单测、55项Chromium E2E、lint/类型0错误、构建/图片/发布审计）；90源图生成439WebP、40HTML/115图片引用通过。两路由1440/390实际日期、全文、4原图字节及实载WebP/fallback/alt/图注顺序、10/10href、目录/分享、四次canonical实际剪贴板读回、手机4表格末列、列表封面、sitemap和无溢出通过 |
| Repository | 待commit/push/PR、必需CI和Preview通过且无冲突后合并；禁止force push |
| Deployment | 待精确main SHA的Production READY及正式域名别名 |
| Domain | 配置不变；生产HTTPS及apex308待检查 |
| Identity | 本批不适用：不改认证代码、依赖或配置；公开内容检查不证明登录 |
| Production flow | 待全文、全部4原图逐张实载/WebP/原图fallback/字节SHA/alt/图注/顺序、10/10href、目录/分享/复制、手机4表格末列、Blog封面、sitemap及公开smoke；不运行认证R2写入smoke |

本次依赖审计为16项moderate、0项high/critical；保留原始结果，不声称零漏洞。CI现有阻断门槛为npm audit --audit-level=high，保持不变；未做audit fix或依赖回退。

工具浏览器先做独立literal剪贴板写读探针；若返回空，明确记录实际内容未验证，仍要求真实按钮反馈和canonical目标正确，不以历史结果代替、不修改产品绕过诊断。非空错误值仍失败。全页长截图用于整体视觉概览；逐字正文和媒体证明来自浏览器散列、逐图加载和原图哈希。

最终PR、merge SHA、生产部署及六门结果写本批PR描述和publication-ledger.json。源基准、红绿、完整门禁和桌面/手机证据保存在本轮设备本地evidence/20261101；仅生产内容及媒体通过才记published。
