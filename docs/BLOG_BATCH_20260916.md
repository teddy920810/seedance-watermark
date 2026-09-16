# 2026-09-16 运营 Blog 第 3 批（05/06）

## 范围与排期核对

发布前核对 canonical checkout D:\ermei\seedance-watermark、origin teddy920810/seedance-watermark、main/origin/main 均为 e75cf81ecea29b4ccfafcd5908cb7238ab762530；只有用户既有 AGENTS.md 改动，保留且不纳入本批。没有开放 PR，05/06 的生产路由均返回 404，文章尚未导入。因此从最新 main 建 codex/blog-batch-20260916，顺延发布 05/06；不把原计划 07 同时加入，确保北京时间自然日最多两篇。07 顺延至 2026-09-17 23:00，08–11 未授权。

本批只新增两篇 CMS Markdown、8 张原图及此发布记录。不改已有运营内容、模板/运行时、CMS 配置、Mock Provider、域名、OAuth、凭据或已有媒体。

## 来源与内容

| 编号 | Blog slug | ZIP 原始 index.html SHA256 | 图片 | 正文字符数（忽略空白） |
| --- | --- | --- | --- | --- |
| 05 | where-to-use-seedance | 8d556e6913b2d980daeb6f80ef2c32045cca29977bd2677f3e159de2826dbb96 | Hero 1 + 正文 4 | 8506 |
| 06 | best-ai-video-upscalers | 290741fcc572d0507526ed2ee254a62eaf7f47c3b7fbbf545e04e1b5c4a43f46 | Hero 1 + 正文 2 | 9373 |

来源为运营交付目录中的 05-where-to-use-seedance-static-html.zip 和 06-best-ai-video-upscalers-static-html.zip。哈希直接读取 ZIP 中原始 HTML 字节。复用 scripts/import-blog-html.mjs，不执行源脚本，不复制页面导航/页脚/Logo。

保留原 H1、SEO 标题、摘要、正文、FAQ、表格、列表、图注、alt 和 CTA。包括运营的 Before publication 等编辑说明及原文日期，不纠正或改写。发布日期为实际批次 2026-09-16；分类均为 Seedance Guides。现有 Pages CMS 的封面字段和 Markdown 正文可管理，媒体引用保持 /uploads 原图路径。

## 原图校验

只按导入器媒体清单从 ZIP 指定条目复制原字节；拒绝覆盖和路径越界，源/目标 SHA256 一致，不裁剪、不压缩原图。WebP 由构建链生成，不提交生成物。05 为 5 张、06 为 3 张，不能套用上批固定图片数。

| 媒体路径 | SHA256 |
| --- | --- |
| /uploads/blog/where-to-use-seedance/hero.png | e28ee8750f21fadabee9889e0c9b2325792553b928b4163464fcc713bd773dec |
| /uploads/blog/where-to-use-seedance/figure-1.png | e3ce8fdc672e8ee0a49f32a8802b5b55c8babbb0869e07f814f37bb43faa94bd |
| /uploads/blog/where-to-use-seedance/figure-2.png | ed287f3f1a81b6ce8e39f38df95f1be07b2f81ae870d11972bf82141649ee2ad |
| /uploads/blog/where-to-use-seedance/figure-3.png | dd376d0551de30e1f96aa47aef93209c49359bef9a3dcd3e4c425c980505178c |
| /uploads/blog/where-to-use-seedance/figure-4.png | be71ea5b3e06630016b740866ddbc99861af6644d810f5b9abf3dcde8dd42eb3 |
| /uploads/blog/best-ai-video-upscalers/hero.png | f5081e48be3bdef50cd0931fa5f4104304cc9e49e5a08b4ddc78a42ea63a8372 |
| /uploads/blog/best-ai-video-upscalers/figure-1.png | 353ac41b9c87722e89aa9df329b4ff5936f274bd4eca780c53079a2dc9cdae54 |
| /uploads/blog/best-ai-video-upscalers/figure-2.png | 5bcba62549d0f72289d4e10b83f1086fb37719ff21e1233fa308604a037c4bd2 |

## 验证与交付要求

- 添加前本批验证因文章缺失而失败；导入后元数据深比较、渲染正文逐字比较（仅忽略空白）、图片顺序/alt/路径/文件存在检查通过。
- check:content：117 项通过，site:validate：26 个内容文件 / 73 个上传资源通过。
- 完整 release:verify 通过：216 项单测、40 项 E2E、lint/类型检查 0 错误；依赖审计 0 漏洞。生产构建生成 57 张原图 / 275 个 WebP 变体，图片门禁覆盖 24 个 HTML / 73 个图片引用。
- 两篇生产构建产物在 1440px 桌面和 390px 手机逐张加载通过（分别 5 / 3 张），实际 WebP currentSrc、原图 fallback、alt、顺序、HTTP 200 正常；无横向溢出。表格、复制链接、Blog 列表封面、原文/标题/CTA/目录/sitemap 和所有原图哈希验证通过。
- PR 必需 CI 和 Vercel Preview 通过且无冲突才合并。精确合并 SHA、Production 部署身份、生产逐张 currentSrc/原图哈希及六门结果记录在 PR 交付评论和当前任务。
- 仅运行公共 HTTP 检查及匿名签名 401；不运行认证 R2 写入或消耗额度的 Provider 测试。OAuth/域名配置不改，公开 HTTPS 检查不代表登录验收。
