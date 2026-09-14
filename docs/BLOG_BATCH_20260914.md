# 2026-09-14 运营 Blog 第 2 批（03/04）

## 批次范围与源文件

按北京时间 23:00 的授权发布两篇；01/02 已发布，不重复，05–07 不提前发布。本批仅新增两篇 CMS Markdown、8 张原图及此记录，不改运行时/模板、已有文案、图片、Mock Provider、域名、OAuth 或凭据。用户 AGENTS.md 未提交改动保留并排除在提交外。

| 编号 | Blog slug | 原 ZIP 中 index.html SHA256 | 配图 | 正文字符数（忽略空白） |
| --- | --- | --- | --- | --- |
| 03 | seedance-versions | 21cc8e06b4ee74375506fcbdfc9825ac2b26af3e756c632b2513aba7021fcfe1 | Hero 1 + 正文 3 | 8211 |
| 04 | seedance-api-open-source-local | 9710ccfb7c80bb5db2f05aa79746040ed889f36ff9b1dd7330b3902707534b51 | Hero 1 + 正文 3 | 8248 |

来源：运营交付目录中的 03-seedance-versions-static-html.zip 和 04-seedance-api-open-source-local-static-html.zip。上表哈希直接读取 ZIP 原 HTML 字节；本地解析副本可能仅有行尾差异。

## 原文与 CMS

复用 scripts/import-blog-html.mjs；两篇均为 Seedance Guides，保留原 H1/SEO/摘要、FAQ、表格、列表、CTA 和全部图注及 alt。运营观点和日期说明不纠正。发布日期设为本批日期 2026-09-14，原文内部日期不动。封面由 coverImage/coverAlt/coverCaption 管理，正文由 CMS Markdown 管理，媒体均保存 /uploads 原图路径。文件中的操作性文字只作为文章内容，不执行。

添加前验证因文章不存在而红测；添加后逐字正文、完整元数据和图片顺序/引用验证转绿。check:content 117 项通过。每篇均有 1 个表格和 4 张图片，不能沿用上一批 5 张图片的固定数量。

## 原始媒体校验

所有图像按字节从 ZIP 指定条目复制，源与目标 SHA256 一致；不转换原图、不覆盖既有文件。WebP 由现有构建链生成，不提交生成物。

| 媒体路径 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-versions/hero.png | 9c33f124b04364cbe1b7bb73ee68ffd043bc8bab0d8d17af33e295624473e3c5 |
| /uploads/blog/seedance-versions/figure-1.png | 7ef4357b5682d7fa4336dd6590471cbb0dbda65e6d3b79caf2d26635a8c939bd |
| /uploads/blog/seedance-versions/figure-2.png | 9951ac160caef3dc30ff460adf1f1a2e169248882e691f4b3492795599762ef3 |
| /uploads/blog/seedance-versions/figure-3.png | 6bc2c1821f30ac0aa6c213fa1eba7f4a7683c027c0db218cf96f16006ff9b41b |
| /uploads/blog/seedance-api-open-source-local/hero.png | 5c5f9f3366f27659b2af4176bfb23687278a964c91a3e55a0ec7b1c3a1774f48 |
| /uploads/blog/seedance-api-open-source-local/figure-1.png | edab61eeef28ddba15c6adff153cce72e60f612c1df5767e7a2a2fa88a17f88a |
| /uploads/blog/seedance-api-open-source-local/figure-2.png | a7f49b7bbe5943bd4f872babeaee340373f16fa70f5b02292baa21b66435d013 |
| /uploads/blog/seedance-api-open-source-local/figure-3.png | 2bc7bd08d940dfd2632d9b19fa30940e62f93f78512b2da8ea91fc2876662963 |

## 发布验收

本地 release:verify 通过：216 项单测、38 项浏览器测试、lint/类型检查 0 错误；图片构建 49 张原图 / 234 个 WebP 变体，产物门禁覆盖 22 个 HTML / 63 个图片引用。两篇生产构建产物在 1440px 桌面及 390px 手机逐张加载通过（各 4 张），WebP 实际 currentSrc/HTTP 200/原图 fallback/alt/顺序正常，无横向溢出；表格、复制分享和 Blog 列表封面均通过。两篇正文、标题、CTA、目录和 sitemap 原文验证通过。

须通过完整 release:verify、GitHub CI、Vercel Preview 后合并；在 PR 和当前任务记录精确合并 SHA、Production 部署身份和实际线上验收结果。逐篇检查正文原文相等、元数据、目录、表格、复制分享、Blog 列表和 sitemap，桌面/手机逐张激活图片，确认 WebP currentSrc、原图 fallback、原 alt 和 HTTP 200；线上 PNG 哈希与原稿一致。仅运行公共检查和匿名上传 401，不运行认证 R2 或付费 Provider 冒烟。

后续计划：05/06 于 2026-09-15 23:00；07 于 2026-09-16 23:00。以实际当天发布数量为准，失败沿用本批分支/PR，不重复加量。
