# 2026-10-29 Alternative Tips 第五批（10、09）

本批原定北京时间2026-10-29 22:00，前次完成本地验证后尚未提交上线；2026-10-30 22:00后沿用原分支续发，实际发布日期2026-10-30。origin为teddy920810/seedance-watermark，分支codex/blog-batch-20261029，基线73e0d2b71e8682f26c4e5e6b54a8fa08ef03845b。开始前两路由404，无重复分支/PR；主目录27项既有改动排除。

此前12/11于10月28日已经公开并通过全文/原图验收；10月29日仅补记用户在另一浏览器登录成功的直接确认，未重新公开或部署旧文章。10月29日没有新增公开文章，10月30日续发10/9共两篇；08/07顺延至10月31日22:00后，不跳批、不在同日额外补发。旧批次原浏览器报错不声称已修复，成功会话证据来源明确为用户确认。

沿用Astro Blog和Pages CMS，保持运营H1/SEO/摘要/全文/FAQ/表格/CTA/原阅读时间及原文日期。仅解析源HTML并按清单复制原图，不执行包内脚本/指令、不导入页壳。全部图片字节、alt/图注/顺序保留。不改运行时、依赖、CMS模型、域名、OAuth、凭据或R2，未来文章不进入公开目录。

## 独立源基准

先独立parse5解析源HTML与ZIP原图，锁定完整元数据、仅忽略空白的正文SHA、语义结构、href顺序及全部原图哈希。先保存两篇缺失红测，再导入转绿。第09篇源表格中的普通域名被GFM自动链接，原链接顺序回归捕获；使用不可见HTML注释作为Markdown字面域名的语法分隔，抑制自动链接（反斜线转义被GFM归一化，未能奏效，其失败证据已保留），保持可见原文与原有href数量完全一致，不改变共享解析器。

### 10 seedance-ai-fight-video-guide

- 路由：/blog/seedance-ai-fight-video-guide
- ZIP SHA256：706791b143d07b476898d22679c4a7131bd72f27dedc9788a3367c21d3a7c074
- HTML SHA256：7d0bece844234f5aabeaf62f3ca8986c5a29560da1bf5488c864360235890f2f
- 正文：9607字符，SHA256 5be9c51d8999acb0be3a05537d9bbef2187110a1c2975ed0edc4cef287d20771
- H2/H3/表格：6/8/1；原链接8；媒体Hero1+正文1。

| 原图路径 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-ai-fight-video-guide/hero.png | d0cc4449d9e560b6caa4d3be3a3645e8f03e1de182173a76c11407bb8a36fc82 |
| /uploads/blog/seedance-ai-fight-video-guide/figure-1.png | 71b3bd60c2c7a7b1249d79265816587fc12f48d265b8739552f63316e7d0e83a |

### 9 seedance-brand-domain-confusion

- 路由：/blog/seedance-brand-domain-confusion
- ZIP SHA256：5042d3504ad9dcaa0be46f95d953bdaf3483ed138867044ce3de5424776d79f5
- HTML SHA256：51e8c7c00bf143b1568d90d6d8d3e024d4238583cac0da9f919c8011a692101f
- 正文：9840字符，SHA256 bf27b956061701c6779c74a8e98bd507ab1afe5b5664b2cf36c1c0712dc12ab0
- H2/H3/表格：7/9/1；原链接7；媒体Hero1+正文2。

| 原图路径 | SHA256 |
| --- | --- |
| /uploads/blog/seedance-brand-domain-confusion/hero.png | 5119db76596514d3f69f01ca14c71d8befbc1b81f1942c0dfa9a5be7c4fd0cab |
| /uploads/blog/seedance-brand-domain-confusion/figure-1.png | 53c94076544869a4ff937ad714c4c62ceb06cf3d9fa22539c53d237e40af8a84 |
| /uploads/blog/seedance-brand-domain-confusion/figure-2.png | e19330f0a22f62a24f88007a78eb8c144404fa42bf6bff16676fa0f387424ced |

## 六项发布门

| Gate | 本记录编写时状态 |
| --- | --- |
| Code | 10月30日重新执行audit0、check:content143及完整release:verify：244项coverage单测、51项Chromium E2E、lint/类型检查0错误、构建/图片/发布审计通过；82张源图生成399WebP，36HTML/107图片引用通过。两路由1440/390实际10月30日日期、全文、全部5原图哈希与实载WebP/fallback/alt/图注顺序、8/7href、目录、分享、复制反馈及canonical目标、两表格末列、列表封面与sitemap通过。10月29日首次超时与绿色复跑记录保留；10月30日全量门禁首次通过 |
| Repository | 待commit/push/PR、CI和Preview通过后合并；不force push |
| Deployment | 待Production READY、精确main SHA及正式别名 |
| Domain | 配置不变；生产HTTPS/apex跳转待检查 |
| Identity | 本批不适用：不修改认证代码/依赖/配置；不把公开页面检查当真实登录验收 |
| Production flow | 待全文/全部5张原图字节及WebP/fallback/alt/图注/顺序、目录分享、复制反馈与目标、手机表格末列、Blog列表、sitemap和公开smoke。工具原生剪贴板若literal探针返回空，明确标记实际读回未验证，不声称通过；不运行认证R2写入smoke |

生产内容与媒体验收通过才记published。最终PR、merge SHA、部署和六门结果写本批PR描述与publication-ledger.json；源报告、首红/绿、修复前失败、完整门禁日志及桌面/手机证据保存在本轮设备本地evidence/20261029及evidence/20261030。下一批08/07顺延至2026-10-31 22:00后执行。日期续发先将基准日期改为10月30日并观察两项失败，再修改两篇CMS日期转绿；运营正文原日期保持不变。

## 首次门禁失败与复查

10月30日工具浏览器的独立literal剪贴板写读探针返回空，四次实际按钮点击均显示Copied且canonical目标正确，但不声称本次实际剪贴板读回通过。10月29日成功读回属于历史记录，未替代本次验证；不修改产品绕过该限制。10月30日的开发服务器audit工具仍记录fetch诊断错误，51项E2E全部通过；本地静态服务不证明认证API或真实OAuth。

首次release:verify在coverage阶段的verification-workflow既有审计测试超时（15秒阈值，实际约32.6秒）；243项通过、1项失败，后续lint/build/E2E未执行。原始日志完整保留，不视为全量通过。无端口4323/4325冲突，Git未配置自定义hooks、签名或fsmonitor；当时本机可用内存约1GB，但不据此断言超时原因。相同未修改测试定向复查4项全部通过、约3秒，因此不改测试/门禁，保留第一次失败并进行一次完整复跑；完整复跑exit0通过全部244项单测、51项E2E和完整发布审计，未修改原有测试或门禁。首次失败与绿色复跑分别保存独立日志。
