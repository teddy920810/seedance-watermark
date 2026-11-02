# 2026-11-02 Alternative Tips 第八批（04、03）

本批原定11月1日，按故障顺延记录于北京时间2026-11-02 22:00后执行，实际发布日期2026-11-02。前批06/05于11月1日生产验收通过；本日只发布04/03，最后02/01顺延11月3日22:00后，继续倒序、每天最多两篇。

复用本轮隔离工作树，基线8c2c3886a3d70497ecaf78438d4bb0dcccdce454，分支codex/blog-batch-20261102，origin为teddy920810/seedance-watermark。开始前无重复分支/PR，两路由均404；主目录27项既有改动保持不动。资产与工作树已按本机要求迁移；应用代码和仓库脚本继续跨平台。未来正文和媒体未加入公开目录。

沿用Astro Blog和Pages CMS。原H1、SEO标题、摘要、阅读时间、分类眉题、原文、FAQ、表格、列表、CTA及图片字节/alt/图注/顺序均保留。仅解析HTML和引用的图片；包内代码和README不执行，导航/页脚/Logo/脚本/样式不导入。没有共享导入器、运行时、依赖、认证、CMS模型、域名或R2变化。

## 独立源基准与测试

独立读取源ZIP/HTML建立metadata、正文散列、结构、href顺序及原图SHA，ZIP哈希匹配manifest。新文章缺失回归先2红，导入后新批2项与既有导入器12项共14项首次转绿；独立复核使用另一ZIP读取与parse5解析，无导入器依赖。两篇原稿各有Hero1张、正文图0张，本批共2张原图、4,422,393字节；全部源与落地SHA相等。

### 4 seedance-2-vs-1-5-pro

- 路由：/blog/seedance-2-vs-1-5-pro
- ZIP SHA256：75c860de6b75d4ce364fdbe73e47d5682d03e791aceef91cbc4db7c14ee52735
- HTML SHA256：884d9ea7c6023a8e750a564894944407a12732a7eeb562f0ece5ae29649da21f
- 正文9057字符，SHA256：b8aadd44db067806910a6f332f586e58492b11c29f763584227269971cd5a000
- H2/H3/表格：8/6/1；原链接10；Hero1，正文图片0。

| 原图路径 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-2-vs-1-5-pro/hero.png | 6bd7cabeb42ae0dad990e388e5a19fe9be81558426535ebb9ce1817e61e9efff |

### 3 seedance-2-mini-vs-fast-vs-standard

- 路由：/blog/seedance-2-mini-vs-fast-vs-standard
- ZIP SHA256：dc12f2bca2fe4c3218a5041a3928505703416bcd7d8d8d71ae5d458fe6ea83da
- HTML SHA256：f965fe530ed689b5f1d0e43bb7ac164b6af8af8ed99d1ea8c78b088ddfef856d
- 正文9679字符，SHA256：6f2637b8776d65d3b8e10e1ef9a019069651b9fe91840d866d3b3dbdd6c59505
- H2/H3/表格：9/6/2；原链接10；Hero1，正文图片0。

| 原图路径 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-2-mini-vs-fast-vs-standard/hero.png | c077fa00df3ea92be818dde100b907ccc1d3cb8dd74e8f0ddf16ab44180a088d |

## 六项发布门

| Gate | 本记录编写时状态 |
| --- | --- |
| Code | 源回归14、check:content149及首次完整release:verify通过（250项单测、57项Chromium E2E、lint/类型0错误、构建/图片/发布审计）。92源图生成451WebP，42HTML/117图片引用通过；两路由1440/390全文9057/9679字符、2原图字节及实际加载/WebP/强制原图fallback/alt/图注、10/10href、目录/分享、4次canonical实际剪贴板读回、手机3表格末列、Blog封面/sitemap、无横向溢出均通过 |
| Repository | 待commit/push/PR、必需CI及Vercel Preview通过且无冲突后合并；禁止force push |
| Deployment | 待精确main SHA的Production READY及正式域名别名 |
| Domain | 配置不变；正式HTTPS/default TLS校验、apex308待确认，不宣称权威DNS审计 |
| Identity | 不适用：本批仅内容；不改认证代码、依赖、配置，不要求登录 |
| Production flow | 待两篇完整正文、2张Hero逐张加载/WebP/强制原图fallback/字节SHA/alt/图注/顺序、10/10href、目录/分享/复制、手机3张表格末列、Blog封面、sitemap及公开smoke；不运行认证R2写入测试 |

本次依赖审计保留16项moderate、0项high/critical。现有CI的npm audit --audit-level=high门槛保持不变，无audit fix、依赖回退或范围扩展。

复制链接先做literal剪贴板独立写读探针；若返回空，保留真实按钮反馈和canonical目标证据并披露实际剪贴板未验证，非空错误值仍失败。长截图只作视觉概览；逐字和图片证据来自浏览器全文散列、逐图实载和原图SHA。

最终PR、merge SHA、部署与六门结果写入本批PR描述和publication-ledger.json；仅生产验收通过后记published。设备本地evidence/20261102保存源基准、红绿、完整门禁及桌面/手机证据。
