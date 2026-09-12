# 2026-09-13 首批 Blog 配图补齐

## 原因与范围

首批导入器忽略了 img，且未填写 coverImage/coverAlt，导致两篇 Hero 与正文图缺失。此修复按用户要求导入原 HTML 引用的图片，不修改原文。发布正文日期不变，不增加当天文章数量。

- 01 /blog/seedance-prompts：1 张 Hero + 4 张正文图。
- 02 /blog/how-to-use-seedance：1 张 Hero + 4 张正文图。
- 每张新增 PNG 与 ZIP 对应条目的 SHA256 完全一致。没有修改、裁剪或替换既有媒体；WebP 仅由现有构建管线生成，不提交生成物。
- 两篇 Markdown 渲染正文与运营 HTML 按字符比对一致（仅忽略排版空白），原 alt、图注、标题、摘要及 CTA 保留。
- 封面使用现有 Pages CMS coverImage/coverAlt/coverCaption，正文图片可在 CMS Markdown 编辑；只保存 /uploads 原图路径。
- 导入器现在输出 images 清单，异常媒体路径报错，不静默漏图。站点导航、Logo、脚本不导入。
- 定向红测 9 失败 → 修复后 11/11 通过，覆盖 Hero、正文、顺序、alt、JPG/JPEG 与不安全路径。
- 后续每日两篇按 docs/BLOG_PUBLISHING.md 核对全量配图，自动任务 seedance 同步此要求。下一批仍为 2026-09-14 23:00（北京时间）。

## 原始媒体校验

| 路径 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-prompts/hero.png | 3fca008cb5897a24be8aeeb7ede5dfa99c4273d24689580cad3189b6d8810e92 |
| /uploads/blog/seedance-prompts/figure-1.png | e3b64fc36c408ad5ef652196a6566d4269a85ed6c8aeb4d9b0e3f9092593f963 |
| /uploads/blog/seedance-prompts/figure-2.png | 82884d92733d0cca4e4168b663708749f9c4e59f3d96858f1318c9f8616b955f |
| /uploads/blog/seedance-prompts/figure-3.png | 864a5b69ee8e985af904cbcdb09119fc2898f13628d36d2d421e33c0df7348f7 |
| /uploads/blog/seedance-prompts/figure-4.png | e3fe69adea3f243a27e718a2dec7c2e2e1ad67a70c4a7f88a72e5f7956a2b8c8 |
| /uploads/blog/how-to-use-seedance/hero.png | 5374c6c8cdc5e59aa7e1f377bb8af1d1531d11fb1ceb6d890f4cdef83fd65731 |
| /uploads/blog/how-to-use-seedance/figure-1.png | 228cdd709ff50ae87d9e6960d534c1a47ae01b84f6b2194d2f5ac971471dcd33 |
| /uploads/blog/how-to-use-seedance/figure-2.png | 9f864fd03b2f0aca9d8a3239d1efc56ea5459571597d08b2698d7d22fbb808fa |
| /uploads/blog/how-to-use-seedance/figure-3.png | 48c704eab841586cf450f4536185ff295b60d32840775e7e1e7fd5febc2de44e |
| /uploads/blog/how-to-use-seedance/figure-4.png | e348030d0bf5d8367098c73faf3e8abab9fbe63d8743e180ba3c269def2ca9dd |

## 发布门

生产构建红测另发现：lint/content sync 在新图生成前持久化了普通 img HTML，后续生成 WebP 后，正文未变使 Astro 复用旧内容缓存。现有 images:verify 正确拦下两篇共 8 个正文引用。Blog loader 使用 Astro 官方 deferRender 选项，在页面构建阶段渲染 Markdown，避免把依赖图片清单的 HTML 持久化为内容缓存；增加配置回归测试。参见 https://docs.astro.build/en/reference/content-loader-reference/#deferrender 。此修复不依赖清缓存或修改正文。

完整 release:verify、CI、Vercel Preview、main 合并和 Production 结果记录在此修复 PR 与当前任务。生产验收须逐篇在桌面/手机逐张加载 Hero 和正文图，确认原图 fallback、WebP currentSrc、自然宽度与 HTTP 200，并检查 Blog 列表封面。不将标签存在等同于图片加载成功。

本地 release:verify 已通过：216 项单测、36 项浏览器测试、lint/类型检查 0 错误。生产构建生成 41 张原图的 194 个 WebP 尺寸变体，图片门禁覆盖 20 个 HTML / 53 个图片引用。实际生产构建产物浏览器验证：两篇各 5 张图片在 1440px 桌面与 390px 手机均加载 WebP，原图 fallback 和 alt 保留，无横向溢出，Blog 列表的两张封面在两种视口均通过；逐字正文、标题、CTA、目录、列表与 sitemap 核对通过。

域名、OAuth、Mock Provider、R2 凭据与现有用户 AGENTS.md 改动不在本次提交范围；不运行认证生产 R2 写入测试。
