# 测试与质量指南

本指南面向开发者、内容共创者和运维人员。目标不是追求测试数量，而是让测试能够阻止真实线上故障。

## 测试分层

| 层级 | 命令 | 覆盖内容 | 是否访问生产 |
|---|---|---|---|
| 内容定向检查 | `npm run check:content` | Site 配置、内容 schema、资源引用、内容相关单元测试 | 否 |
| UI 风险抽样 | `npm run check:ui` | 首页、工具页、Blog 列表、新旧文章、桌面和移动端富文本 | 否，本地 Astro |
| 快速回归 | `npm run check:fast` | Site 校验与全部单元测试，不重复 Build/E2E | 否 |
| 单元/集成 | `npm test` | 内容 schema、环境变量、API、Job、Provider、R2 命令与安全错误 | 否 |
| 覆盖率 | `npm run test:coverage` | 核心服务与 API，强制阈值 | 否 |
| 浏览器 E2E | `npm run test:e2e` | 上传 UI、失败提示、GA page_view、SEO、路由、无障碍 | 否，本地 Astro |
| 完整验证 | `npm run verify` | 覆盖率、Lint、Build、E2E | 否 |
| 发布验证 | `npm run release:verify` | Site 校验、完整验证、diff 与敏感路径/秘密审计 | 否 |
| Production Smoke（公共） | `npm run test:smoke:production:public` | 正式域名、robots、sitemap、匿名 API 鉴权；只读且不创建 R2 对象 | 是，只读 |
| Production Smoke（登录） | `npm run test:smoke:production:auth` | 有效测试会话下的真实 R2 上传/处理/下载 | 是，会写临时对象 |

## 首次准备

```sh
npm ci
npx playwright install chromium
npm run verify
```

不要安装或提交浏览器二进制。Playwright 会把浏览器放在用户缓存目录，GitHub Actions 会在 CI 中自动安装。

## 动态验证与风险抽样

开发阶段使用最小充分验证，发布阶段保持完整门禁：

| 改动范围 | 开发中先运行 | 需要检查的页面或行为 |
|---|---|---|
| 单篇或批量内容、SEO、素材引用 | `npm run check:content` | 所有新增或修改的路由、Blog 列表、标题、图片和链接 |
| Blog 或公共视觉样式 | `npm run check:ui` | 结构最复杂的新页面、一个历史页面、桌面端和移动端 |
| API、认证、上传、Provider | 对应 Vitest 文件，再运行 `npm run check:fast` | 成功、失败、越权和清理分支 |
| 路由生成、内容 schema、导航、Sitemap | 定向测试 + Build | 全部生成路由、404、Canonical、H1 和可访问性 |
| 依赖、构建、CI、安全头 | `npm run verify` | 完整测试、构建和浏览器回归 |

风险抽样不是随机抽查。所有新增或修改的路由必须逐一验证；抽样只用于共享代码或 CSS 的未修改使用方。默认选择“最复杂页面 + 历史哨兵页面 + 桌面端 + 移动端”。发现一个问题后，立即扩大到完整受影响页面集合。

本地迭代可以在定向绿测后交付本地结果；合并 `main` 前必须运行 `npm run release:verify`，并继续等待 GitHub CI、Vercel Production 和范围相关的线上验证。不得用本地抽样代替最终发布门禁。

## 共创者应该做什么

### Pages CMS 内容编辑

Pages CMS 保存会提交到 `main`，随后触发 GitHub Actions 和 Vercel。内容编辑不需要在本地运行测试，但必须等待：

1. GitHub Actions 的 **CI / verify** 成功。
2. Vercel Production 状态变成 **Ready**。
3. 打开正式页面检查标题、图片、链接和移动端排版。

任一状态为 Error/Failed 时，停止重复保存，把文章名称、提交链接和错误截图交给开发者。

### 开发者

行为变更遵循 TDD：先添加会因目标行为缺失而失败的测试，再实现并运行范围匹配的定向检查；准备交付时再运行完整门禁。第三方集成必须验证真实信号，不能只检查脚本存在。

### 运维人员

环境变量、域名、R2 或 CORS 变更后，重新部署 Production 并运行 `npm run test:smoke:production`。公共检查始终执行；登录检查仅在配置 `SMOKE_SESSION_COOKIE` 时执行，否则明确标记为跳过。只有登录检查会产生临时对象，因此只在明确的运维检查中提供有效测试会话。

## 自动化保护

- `.github/workflows/ci.yml`：每次 PR 和 `main` 推送运行完整 `verify`。
- `.github/workflows/production-smoke.yml`：每天定时及手工运行生产 Smoke。
- `vercel.json`：Vercel 构建先运行 `verify:deploy`，单元测试、覆盖率、Lint 或 Build 失败时不发布新版本。
- 覆盖率门槛：核心代码 lines/functions/statements ≥ 80%，branches ≥ 70%。当前结果应高于最低线，不能通过降低阈值掩盖缺失测试。
- `scripts/release-audit.mjs`：跨平台执行 diff check，阻止敏感路径和明显秘密材料进入发布变更。

## 如何处理失败

- Vitest：定位失败用例，先确认是预期行为变化还是回归。
- Coverage：为未覆盖的重要分支补测试，不要先降低阈值。
- Build：检查 Astro content schema、Pages CMS 日期和必填字段。
- E2E：查看 `test-results/` 中的截图、错误上下文和 trace；这些目录不提交 Git。
- GA：确认 `g/collect` 中存在 `en=page_view` 和正确 Measurement ID，再看 GA Realtime。
- Production Smoke：先区分公共检查失败、登录检查跳过和登录检查失败；登录检查失败时再依次检查测试会话、Vercel Production 变量作用域、最新部署、R2 凭据、CORS 和生命周期。

## 安全边界

- 测试代码、日志和 CI 中不得出现真实 R2 凭据或签名 URL。
- Production Smoke 只报告状态，不打印会话 Cookie、对象 Key、结果 URL 或下载 URL。
- 本地 `.env.local` 和 `S3-info.txt` 永远不能提交。
- 不使用真实用户图片作为夹具，只使用仓库内生成或内嵌的无敏感测试图片。
