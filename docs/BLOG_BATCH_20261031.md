# 2026-10-31 Alternative Tips 第六批（08、07）

本批原定10月30日，按此前顺延记录于北京时间2026-10-31 22:00后执行，实际发布日期2026-10-31。前批10/09于10月30日生产验收，本日仅发布08/07两篇；06/05顺延11月1日22:00后，保持编号倒序、每天最多两篇。

隔离工作树复用本轮已附着checkout，origin为teddy920810/seedance-watermark；分支codex/blog-batch-20261031，基线39e95c6c7848d261204a1003befdd064974e2967。开始前无重复分支/PR，两路由404；主目录27项既有改动排除。只导入本批两篇，未来正文及图片不进入公开目录。

沿用Astro Blog和Pages CMS；原H1/SEO/摘要/正文/FAQ/表格/列表/CTA/阅读时间/正文日期、眉题和全部原图字节/alt/图注/顺序保留。只解析HTML和媒体数据，不执行源包脚本或README，不导入导航/页脚/Logo/脚本/样式。未改共享导入器、运行时、依赖、认证、CMS模型、域名或R2。

## 独立源基准与测试

先独立parse5解析源HTML建立完整metadata、忽略布局空白的正文SHA、结构及href顺序和原图清单，ZIP SHA匹配manifest。先写两篇缺失失败回归，再导入转绿：新批2项和既有导入器12项共14项通过；不使用导入器输出构造期望。原图共4张、4,387,214字节，源与落地逐张SHA相等。

### 8 seedance-vs-runway

- 路由：/blog/seedance-vs-runway
- ZIP SHA256：27ce174f112f5a5e8e34a82abaa443c4581bb771915b80c3895c4f9d194db316
- HTML SHA256：02cb3ab0750e8a4b9addf7527651c5793d0e2fdf901e458972afd108651a90c0
- 正文9967字符，SHA256：38461fb8f6ab384bf17dda6ca96fc64534e9249925f8e3ca5e38c1b094add953
- H2/H3/表格：9/6/2；原链接9；原图2（Hero1+正文1）。

| 原图路径 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-vs-runway/hero.png | 0dd81a41b7e3f56f4c58fee7e0bb5ae94294bb872f2887e2b3018d805a496a69 |
| /uploads/blog/seedance-vs-runway/figure-1.png | 16513b29a99bdbd2c90719102aa98c4766f5f992dbdb18010961717e16e0cde1 |

### 7 seedance-2-vs-ltx-2-3

- 路由：/blog/seedance-2-vs-ltx-2-3
- ZIP SHA256：54c27c59495a684db11c3731be241f63e4d88704a9f71cebe35a8fbbc187e812
- HTML SHA256：943002b205508a751c515155d5f63af643128ddf244457074b3f2ff0be3d06f5
- 正文10073字符，SHA256：4e41ba5880a48e0609d576bb5c4b390faa1b791636e29aea3e6eda31133021bf
- H2/H3/表格：9/6/2；原链接8；原图2（Hero1+正文1）。

| 原图路径 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-2-vs-ltx-2-3/hero.png | 81c106cb42df1f59b79e9a814101c62e152f9425979add0d3003a043d87871b1 |
| /uploads/blog/seedance-2-vs-ltx-2-3/figure-1.png | fffba20083c3e0a98ba1c5ef520687b4658c17eedf51f7cd9280c150d25baa5c |

## 六项发布门

| Gate | 本记录编写时状态 |
| --- | --- |
| Code | 源回归14、check:content145、完整release:verify通过（246项coverage单测、53项Chromium E2E、lint/类型0错误、构建/图片/发布审计）；86张源图生成419WebP、38HTML/111图片引用通过。两路由1440/390实际日期、全文、4原图字节及实载WebP/fallback/alt/图注顺序、9/8href、目录/分享、四次canonical实际剪贴板读回、手机4表格末列、列表封面、sitemap和无溢出通过 |
| Repository | 待commit/push/PR、必需CI和Preview通过、无冲突后合并；禁止force push |
| Deployment | 待精确main SHA的Production READY及正式域名别名 |
| Domain | 配置不变，生产HTTPS及apex308检查待执行 |
| Identity | 本批不适用：不改认证代码、依赖或配置；公开内容检查不等于登录验收 |
| Production flow | 待全文、全部4原图逐张实载/WebP/原图fallback/字节SHA/alt/图注/顺序、9/8href、目录/分享/复制、手机4表格末列、Blog封面、sitemap及公开smoke；不运行认证R2写入smoke |

依赖审计报告16项moderate、0项high/critical；保留原始结果，不声称零漏洞。CI现有门槛为npm audit --audit-level=high；本批不改依赖或绕过门禁。建议的自动修复涉及多个主要版本回退，未执行audit fix或force。

工具浏览器剪贴板先做独立literal写读探针；实际读回若为空，记录未验证，只报告真实按钮点击反馈及canonical目标，不以历史结果代替，也不修改产品绕过诊断。非空错误值仍视为失败。长截图作为整体视觉概览，逐字正文和媒体证据来自实际浏览器散列及逐图加载。

最终PR、merge SHA、生产部署和六门结果写本批PR描述及publication-ledger.json；源码基准、首红/绿、完整门禁日志和桌面/手机证据保存在本轮设备本地evidence/20261031。仅生产内容与媒体通过才记published。
