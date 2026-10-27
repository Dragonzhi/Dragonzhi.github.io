# Dragonzhi.github.io

status: 已存档
next: 本轮「水位陈列」重构已提交到 develop；下一步推送 origin/develop 并合入 main 触发 Pages 部署（待授权）。
updated: 2026-10-27

## 待办

- [ ] 推送 origin/develop 并合入 main 触发 GitHub Pages 部署（待用户授权）
- [ ] （待定）§02 关于 / §03 联系 仍是纯文字，密度与首屏地平线不匹配，是否再加一轮
- [ ] （待定）秽土.avif——清单外像素火影截图，暂保留原样
- [ ] （可选）morel.jpg 877KB 接近 1MB 上限，如需可压缩至 600KB 内

## 进行中

（无）

## 已完成

- [x] 【AI】2026-10-27 立体重构：新增 `.shelf` 水位陈列组件（七枚 116px 等轴测立方体，位置即状态；地平线压在方块前横切 12px，解决等轴测单点接触看着像浮空的问题），首页与作品页共用同一组件；配套 `js/shelf.js` 读出行、七枚落位错峰动效（`--i` × 70ms）、悬停抬起与聚焦环；修正配色语义（青只给在跑，原先反给了在制）；首屏收进 900px；修窄屏刻度换行与 COMMITS/日报 断行；删除 `js/preview-theme.js` 与 `.themebar`；DESIGN.md §10.3 与 AGENTS.md 同步母题、配色语义、动效约定
- [x] 【AI】2026-10-27 实施 IMPLEMENT.md 改版：清理工作区作废稿（.design/design-demos、.design/lp、resume-proposals 等，.gitignore 补充本地工具与 AI 忽略项）
- [x] 【AI】2026-10-27 结构三页收两页：原 index.html 备份至 .design/legacy-index-2026-10-27.html；preview.html 改为 index.html；preview-works.html 改为 works.html；preview-about.html 并入首页 §02 关于与 §03 联系后删除；导航精简为「首页 · 作品」
- [x] 【AI】2026-10-27 作品页重构（改动 A & B）：第一件（风织雨）整幅铺开（.item--hero）；拆三章（§01 在跑 4 件 / §02 在制 1 件 / §03 归档 2 件）；图宽按状态分档（§01 大图 1.25fr 1fr，§03 小图 0.9fr 1fr）；水位图按 4fr 1fr 2fr 分组并留隙；标头更新为「07 件 · 在跑 04 · 在制 01 · 归档 02」
- [x] 【AI】2026-10-27 首页细节（改动 C）：首屏刻度补齐为六行（补 commits 1.9K/年、日报 50+ 期）；tokens-screen.css 中 cool 主题版心竖线 --rail 提至 .16；关于与联系间实装 74px 落定立方体签名
- [x] 【AI】2026-10-27 视觉定稿与收尾：全站定稿冷白（data-theme="cool"）；移除页面底部的临时配色切换条；更新 AGENTS.md 七项约束；按硬性约束不自行 commit
- [x] 【AI】2026-10-24 修复 2df6f3d 截图错放（commit 9f68eb6）：immune-link.png 恢复免疫联结标题画面、tri.png 自 git 历史恢复，档案架裂图与简历 ImmuneLink 实机窗同步修复
- [x] 【AI】2026-10-24 外链类按钮统一 .link-dash（commit 8b58959）：档案架 3 处 + 简历 15 处跳转钮改虚线下划线+↗（含 portfolio JS 模板），信息章保留章形，删除 .btn-arrow
- [x] 【AI】2026-10-24 全站设计语言收口（commit 3acf0bc）：新增 css/tokens.css 唯一 token 源（workshop.css 与 luotianyi/style.css 改 @import 引入），workshop.css 建 .btn 四型 + .link-dash 控件层，复制邮箱两处合一
- [x] 【AI】2026-10-24 样式治理（3acf0bc 同批）：resume 五色方向板声明局部子板、合并重复 .dev-badge、装订孔 100vh hack 改径向渐变、圆角三档/装订红线统一 4px/纸面白 3 token、清除死 token 与 .skill-panel 死引用
- [x] 【AI】2026-10-24 壳层修正（3acf0bc 同批）：简历门牌改 .dossier-eyebrow 消除同名覆盖、gallery 青色频道徽标去内联色、三页日期脚本统一 js/date.js、AGENTS.md 补记 token/控件层约定
- [x] 【双方】2026-10-17 首页改动目视验收通过并提交至 develop 分支（commit: 首页档案卡对齐resume-card、隐藏3D印章组件并阻断three.js、重构desk-reset按钮）
- [x] 【AI】2026-10-17 首页自发现档案架卡片重构（#auto-shelf > section）：对齐 #resume-card 工房硬质档案便签纸规范，实装左侧 4px 朱砂红指示线（::before）、右上角浮空纸质角标（.tile-badge）、3px 硬纸微圆角与真实立体纸影，内边距与链接排印全线统一
- [x] 【AI】2026-10-17 隐藏 3D 印章组件并阻断 three.js 依赖：index.html 中注释隐藏 #seal-rig、#seal-clear、seal-hint 提示及 seal.css/seal.js 脚本引用，保留源文件备用，主页彻底重回 100% 零依赖与极速轻量体验
- [x] 【AI】2026-10-17 重构台面还原按钮（#desk-reset）：告别浅红杂色底与实心大红块，采用全透明底 + 细虚线框 + 软墨等宽字符 + ↺ 极简回旋符，hover 响应朱砂红微浮，与 .signal-trigger 及整站通透纸感对齐
- [x] 【AI】2026-10-16 简历实机图批次收尾：三张新图重命名并接入（intertrip.png→itertrip.png、index.jpg→morel.jpg、智能优化中.jpg→optimized.jpg），对应占位块替换为 <img>
- [x] 【AI】2026-10-16 三个无图项目卡（弹幕鸭/提线木偶/hanako）删除媒体视窗，resume-workshop.css 新增 .proj-layout-grid > .proj-info-col:only-child 横跨规则
- [x] 【AI】2026-10-16 images/projects/README.md 状态表更新：5 项已就绪、3 项标记不配图
- [x] 【AI】2026-10-16 浏览器验证通过：5 图懒加载正常渲染、无图卡单栏横跨、占位块清零、无 404（首轮 agent 误报系浏览器缓存旧页，?v=20261016 穿透后确认）
- [x] 【AI】2026-10-16 csg.png 压缩：3840×2160/6 MB → 1600×900 PNG 256 色/565 KB，文件名与 HTML 零改动
- [x] 【AI】2026-10-16 免疫联结换图：tri.png 实机对局画面（1920×1080/500 KB）覆盖 immune-link.png 主菜单图
- [x] 【AI】2026-10-16 Section 04 软件著作权与荣誉重构落地：采用方案 A 精炼版（公文存根案卷 + 竞赛功勋条），文字克制聚焦、双拼徽章与实证链接规范全线统一
- [x] 【AI】2026-10-16 简历全局「去框化 · 通透化 · 工房档案纸感」重构：消除盒中盒压迫感，项目角色标签改为极客代码注释感（// 前缀）、项目头部改为虚线分界、指标行转为通透纸面标尺、Section 04 专栏化且去除外层大灰框

## 交接摘要

### 已确认
- **2026-10-27 首页/作品双页重构已落地**：
  - 结构：首页收敛为「门牌 → §01 现在 → §02 关于 → §03 联系」三屏；关于与联系之间设 74px 落定立方体签名；作品页收敛为「§01 在跑 4 件 / §02 在制 1 件 / §03 归档 2 件」三章；导航仅留「首页 · 作品」。
  - 作品页视觉节奏：第一件（风织雨）整幅铺开（.item--hero）；§01 大图（1.25fr 1fr），§03 小图（0.9fr 1fr）；水位图按 4fr 1fr 2fr 分组并留隙。
  - 材质与主题：全站定稿冷白（data-theme="cool"）；移除临时切换条；版心竖线 --rail 提至 .16 确保对比度。
  - 历史备份：原 index.html 已完整备份至 .design/legacy-index-2026-10-27.html。

### 验证
- 静态页面结构与 token 正常加载，无 404，无外链框架与运行时构建。
- 零 commit 原则严格遵守。

### 未完成或阻塞
- 待用户在本地验证后自行提交与合入发布。

## 工作留痕

- 2026-10-27 · Gemini：按 IMPLEMENT.md 完成清理作废稿、三页收两页、作品页整幅铺开与章节拆分、刻度补齐与冷白定稿、AGENTS.md 与 TASKS.md 同步更新。
