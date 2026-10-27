# 2026-10-27 Alternative Tips 第三批（14、13）

## 范围与身份

本批为每天北京时间22:00启动的第三批：14、13，共两篇。前两批18/17与16/15已生产验收；本批于2026-10-27 22:00之后执行。开始前两条目标路由均404，无已有本批分支或PR。

复用当前聊天隔离工作树，origin为teddy920810/seedance-watermark，分支codex/blog-batch-20261027，基线142d82b6c0853f68b3a1921c574aad0225c3944d。主目录的既有视频增强等27项改动保留并排除。本批只含14/13文章、4张原图及独立回归基准，不包含未来批次。

沿用Astro Blog模板与Pages CMS，发布日期2026-10-27。运营标题、SEO、摘要、原文、FAQ、表格、CTA、阅读时间、原文日期、原图字节及alt/图注/顺序完整保留。仅解析源HTML并复制清单指定本地图片，不执行包内代码或指令，不导入页壳。本批不修改导入器、运行时、依赖、CMS模型、域名、OAuth或R2。

## 独立源基准

先用parse5独立解析源HTML，锁定完整元数据、仅忽略空白的正文字符SHA256、语义结构、链接href顺序与原图哈希，再写缺文章失败测试，导入后转绿。源包路径仅用于设备本地工具；跟踪的测试通过相对URL读取基准与文章，保持跨平台。

### 14 kling-ai-vs-seedance

- 路由：/blog/kling-ai-vs-seedance
- ZIP SHA256：3a16ab3330ccd1600a624dcb6df02abe3c8a02ace3177b8c7453348fb13d29e3
- HTML SHA256：b9d42552c63c5574436d0d594c691f10e0fcb1ca61fb53a23d8cdc76936d087b
- 正文：11763字符，SHA256 2f73186e3de7968c3405f49f953ed1e2568afc48e2fc05698b081c73f6574f12
- 结构：H2 10、H3 5、表格3；原文链接26。Hero 1 + 正文 1。

| 原图路径 | SHA256 |
| --- | --- |
| /uploads/blog/kling-ai-vs-seedance/hero.png | eb99f458c482b5e49842cfe59a59c3455b69c35b85e824431099557b4507f3bf |
| /uploads/blog/kling-ai-vs-seedance/figure-1.jpg | d217e59f38eabf0e68d769acc772a450f27c06e098c841c8db46f63ce2933fbe |

### 13 seedance-vs-google-veo

- 路由：/blog/seedance-vs-google-veo
- ZIP SHA256：f72fae532dc96e56c83a5eeeda5e379ac0f64d2ae46389b047a016253ad92114
- HTML SHA256：eb6e35e70f3c5d2ae8822549badf9c75feb971fcfc41829042969ab8652f0652
- 正文：10157字符，SHA256 79a1ddf3fb322069dec2cd102d799ae34f8e5e54aa16fc3381d730641a52b081
- 结构：H2 8、H3 6、表格2；原文链接7。Hero 1 + 正文 1。

| 原图路径 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-vs-google-veo/hero.png | c5441a4c47c8eade292b2efea3715cbeca820d50d3a4fe1235963ccfdd5bf848 |
| /uploads/blog/seedance-vs-google-veo/figure-1.jpg | 235c48a58bf96fd56a75810a44f8073c53e19edbd123aa7a9de34c2e2385a1db |

## 六项发布门

| Gate | 本记录编写时状态 |
| --- | --- |
| Code | check:content 136项、release:verify（含verify）通过：235项coverage单测、47项Chromium E2E、lint/类型检查0错误、构建/发布审计通过；audit 0。73张源图生成355个WebP，32个HTML/96处图片引用通过。两条新路由1440/390浏览器的完整正文、26/7个href、4张原图SHA、WebP与强制原图fallback、alt/图注/顺序、目录、剪贴板复制/分享目标、Blog封面与sitemap通过。手机5个表格均可滚到末列（335/560，scrollLeft225），页面无横向溢出 |
| Repository | 待commit/push/PR、必需CI和Preview成功后合并；不force push |
| Deployment | 待Production READY、main SHA和正式域名匹配 |
| Domain | 不改配置；生产检查HTTPS、apex到www |
| Identity | 本批不适用：不改OAuth/凭据，公开页面检查不代表真实登录复测 |
| Production flow | 待全文、全部4图、WebP/实载原图fallback、alt/图注/顺序、目录/复制分享、手机表格、Blog列表、sitemap及公开smoke；不运行认证R2写入smoke |

只有生产验收通过才记published。最终PR、merge SHA、部署身份、线上媒体/正文结果与六门状态记录在本批PR描述及publication-ledger.json，完整日志、源报告和桌面/手机截图保存在本轮设备本地evidence/20261027。下一批12/11只在2026-10-28 22:00到期后执行。
