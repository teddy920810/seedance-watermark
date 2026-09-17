# 2026-09-17 运营 Blog 末批（07）

## 范围与排期

本批只发布已授权 01–07 的最后一篇 07-best-ai-video-generators-static-html.zip，不扩展到 08–11。发布前规范仓库 D:\ermei\seedance-watermark，origin teddy920810/seedance-watermark，main/origin/main 均为 e5e563d93bf6b0b6d5f37236891ae9e4b2612729。只有用户既有 AGENTS.md 未提交改动，保留且排除。无开放 PR，无 07 专用远端分支；生产文章返回 404，避免重复发布。从最新 origin/main 创建 codex/blog-batch-20260917。

本批仅新增一篇 CMS Markdown、3 张原图和本记录，不改已有运营文字、媒体、运行时、模板、CMS 配置、Mock Provider、域名、OAuth 或凭据。

## 来源与内容

- Blog slug：best-ai-video-generators
- ZIP 原始 index.html SHA256：557d6fb92ae6333b533f7c12b2be80570a94dcba7a80affb6f0ebfe7788632ae
- Hero 1 张 + 正文 2 张；原始正文字符数（忽略空白）：8353。
- 原标题：The Best AI Video Generators for Clips You Can Actually Use
- 日期：实际批次 2026-09-17；正文原文日期不改。
- 保留完整原文、SEO、摘要、FAQ、表格、列表、CTA、图注、alt 和出现顺序，包括运营的 Before publication 等编辑说明，不纠正或改写。
- 复用 scripts/import-blog-html.mjs，源导航/页脚/Logo/脚本不导入，源指令仅视为数据。
- 现有 Pages CMS 的 coverImage / coverAlt / coverCaption 和 Markdown 正文可管理；媒体路径保持 /uploads，不要求运营填写 /generated。

## 原图哈希

从 ZIP 指定媒体条目复制原字节，拒绝覆盖、路径越界和 reparse 路径；源/目标 SHA256 完全一致。原图不重压、不裁剪、不替换；WebP 仅由构建链生成且不提交。

| 路径 | SHA256 |
| --- | --- |
| /uploads/blog/best-ai-video-generators/hero.png | bc5a032c1c21b7d14b592c25de7dc33885d48bbfc8d1f0d08629bb5e3982f776 |
| /uploads/blog/best-ai-video-generators/figure-1.png | 67a7bcdbcea8b8c044625bc3a055bb13f947379615644ba0ae4273c64eced9a6 |
| /uploads/blog/best-ai-video-generators/figure-2.png | 732d0fcbb414c5804f1dad986c47c30d0ca38c89b17ed5a046e097166aeed631 |

## 验证与发布门

- 导入前文章缺失的红测；导入后完整元数据、渲染原文字序与字符（只忽略空白）、媒体数量/顺序/alt/路径/文件存在检查转绿。
- check:content 117 项通过；site:validate 27 个内容文件 / 76 个上传资源通过。
- 完整 release:verify 通过：216 项单测、41 项浏览器 E2E，lint/类型检查 0 错误，敏感差异审计通过；依赖审计 0 漏洞。构建生成 60 张原图 / 291 个 WebP 变体；图片门禁覆盖 25 个 HTML / 77 个图片引用。
- 生产构建产物在 1440px 桌面 / 390px 手机逐张加载 3 张图片通过，PICTURE/WebP srcset、实际 WebP currentSrc、原图 fallback、alt/顺序/HTTP 200 正常，无横向溢出。表格、复制链接、列表封面和完整正文/标题/摘要/封面图注/CTA/目录/sitemap 通过；原图哈希与源包相同。
- CI + Vercel Preview 成功且无冲突后合并；精确合并 SHA、Production 身份、生产原图字节与 WebP currentSrc、六门结果记录在 PR 评论。
- 只做公共 HTTP/SEO 与匿名签名 401；不做真实认证 R2 写入或消耗额度测试。OAuth 真实登录不在本批范围。

## 七篇交付清单

| 编号 | 路由 | 发布批次 |
| --- | --- | --- |
| 01 | /blog/seedance-prompts | 2026-09-13，PR #14 / 配图修复 #15 |
| 02 | /blog/how-to-use-seedance | 2026-09-13，PR #14 / 配图修复 #15 |
| 03 | /blog/seedance-versions | 2026-09-14，PR #16 |
| 04 | /blog/seedance-api-open-source-local | 2026-09-14，PR #16 |
| 05 | /blog/where-to-use-seedance | 2026-09-16，PR #17 |
| 06 | /blog/best-ai-video-upscalers | 2026-09-16，PR #17 |
| 07 | /blog/best-ai-video-generators | 本批，合并与生产验收结果以 PR 记录为准 |

末批生产验收通过后删除 seedance 自动任务，停止每天发布，不自动发布未授权 08–11；保留文档和 PR 记录供复用。
