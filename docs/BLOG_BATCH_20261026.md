# 2026-10-26 Alternative Tips 第二批（16、15）

## 范围与身份

本批为用户授权每天北京时间22:00启动的第二批：16、15，共两篇。10月25日18/17已在PR #19完成发布，生产记录已核对。本批开始时间为2026-10-26 22:00之后；未到期内容不进入公开目录。

复用当前聊天拥有的干净工作树，路径C:/Users/ermei/.codex/worktrees/blog-20261025/seedance-watermark；origin为teddy920810/seedance-watermark，分支codex/blog-batch-20261026，基线为最新origin/main fb70e72d7ad8daf50c7b479b1490c5f2ac940406。主目录D:/ermei/seedance-watermark中的既有视频增强等用户改动保留且排除。本批开始前目标文章生产路由均404，无本批既有分支或PR，避免重复发布。

| 编号 | 路由 | ZIP SHA256 | 媒体 |
| --- | --- | --- | --- |
| 16 | /blog/seedance-vs-sora-vs-veo-vs-kling | 8449c19bbb2b2108561e49d7860d49109eda371d48b5a07c8a67aed7b11ea951 | Hero 1 + 正文 1 |
| 15 | /blog/seedance-vs-seedream | 3bf17dd62234165a34b2426adb54aa4fcaf9b9718958862c4438e80e09871312 | Hero 1 + 正文 1 |

沿用现有Astro Blog与Pages CMS，发布日期为2026-10-26。运营正文、标题、摘要、FAQ、表格、CTA、阅读时间、正文中的原始日期、所有原图字节/alt/图注/顺序均保留，不改写事实或运营备注。仅解析ZIP中的index.html和清单指定图片，不执行包内脚本，不导入页壳。复用现有导入器与smartypants:false配置，本批不更改运行时、依赖、CMS模型、域名、OAuth或R2配置。

## 原文与媒体完整性

独立parse5源HTML基准锁定元数据、正文字符序列SHA256（仅忽略空白）、语义块数量、每张原图SHA256/alt/顺序，并逐条锁定原文链接href顺序。缺文章时先红测，再导入并验证。

- 16正文字符数10435，SHA256 5befb895156944434877c1b0cb6c9dcc7b9ba7a25b7f611c92f4679fe3f4bdfc；H2 10、H3 6、表格3、正文外链11。
- 15正文字符数10615，SHA256 4a815f2088a01c729aa0b0e57515610e6a7f5ed3a9ac32f0feec4c1455a7862d；H2 9、H3 11、表格1、正文外链7。

完整原图、源HTML与正文基准见src/lib/content/fixtures/alternative-tips-20261026.json。独立批次报告、验收日志及桌面/手机截图保存在设备本地的本轮evidence/20261026目录。

## 六项发布门

| Gate | 本记录编写时状态 |
| --- | --- |
| Code | 定向内容134项、coverage单测233项与构建已通过；69张源图生成335个WebP变体，图片门禁30个HTML/90处引用通过。完整release:verify（包含verify）通过：233项单测、45项Chromium E2E、lint/类型检查0错误、构建与发布审计通过；起始audit为0。新文章1440/390实际构建产物已通过全文/元数据/图注/4图字节SHA、WebP与强制原图fallback、11/7个href顺序、目录实际点击/手机target、复制剪贴板/分享target、列表封面、sitemap与无页面横向溢出检查 |
| Repository | 待本批commit/PR、CI及Preview成功后合并main |
| Deployment | 待Production READY并核对main SHA与正式域名 |
| Domain | 不改配置；发布后检查公开HTTPS |
| Identity | 本批不适用：不改OAuth/凭据，不以公开HTTPS冒充真实登录复测 |
| Production flow | 待逐篇完整正文/全部4图的WebP与实载原图fallback、alt/图注/顺序、目录/复制分享、列表、sitemap与公共smoke |

仅生产验收通过才写ledger为published。最终六门状态、合并SHA及部署身份更新在本批PR描述与设备本地publication-ledger.json；不运行写真实R2的认证smoke。

## 原图哈希

### 16 seedance-vs-sora-vs-veo-vs-kling

源index.html SHA256：64541b981502e77cb19ebf4e2dc47ca288f392a03ec296096cc07cc0a1015fa5

| 路径 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-vs-sora-vs-veo-vs-kling/hero.png | 3be7b093fb0ce858ab25549dd131271271b6e649891052ab818f4dae92128361 |
| /uploads/blog/seedance-vs-sora-vs-veo-vs-kling/figure-1.png | e89d3ac09f4e9a8f21630d1cc9280a075d7d0e57a0f51dd726fa5727db53b396 |

### 15 seedance-vs-seedream

源index.html SHA256：3564a4032dc11c473c00abc6397259eeba2d0931de9b72b1d51ed10a46aa057b

| 路径 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-vs-seedream/hero.png | 088bf062bdf47d3042035d11429e3186890b6703e1e4a67c6f512a20c70416d8 |
| /uploads/blog/seedance-vs-seedream/figure-1.png | fa1dc6f46aa510ad82ac03933bdfb9247a11a04842d8e2333e5585b653022dca |

本地视觉核验：实际检查两篇1440/390的4张top与4张full截图，标题无截断、配图/图注/排版正常。手机4个表格沿用容器内横向滚动：clientWidth335、scrollWidth560，均可滚到scrollLeft225且最后一列到达容器右沿；页面本身无横向溢出。
