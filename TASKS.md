# Dragonzhi.github.io

status: 进行中
next: 设计收口/外链统一/截图修复三提交已在本地 develop；下一步推送 origin 并合入 main 触发 Pages 部署（待授权）。
updated: 2026-10-24

## 待办

- [ ] 推送 origin/develop 并合入 main 触发 GitHub Pages 部署（待用户授权）
- [ ] （待定）秽土.avif——清单外像素火影截图，暂保留原样
- [ ] （可选）morel.jpg 877KB 接近 1MB 上限，如需可压缩至 600KB 内

## 进行中

（无）

## 已完成

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
- **设计语言收口（3acf0bc）**：`css/tokens.css` 为全站唯一 token 源（workshop.css 与 luotianyi/style.css `@import` 引入，改值只改此文件）；workshop.css 建 `.btn` 四型（ghost/line/ink/solid）+ `.link-dash` 控件层；圆角收敛三档、动效三档、纸面白 3 token、装订红线统一 4px；resume 五色方向板为局部子板，重复 `.dev-badge` 合并，装订孔 100vh hack 改径向渐变；简历门牌改 `.dossier-eyebrow`，三页日期脚本统一 `js/date.js`。
- **外链钮统一（8b58959）**：档案架与简历 18 处跳转类按钮统一 `.link-dash`（朱砂虚线下划线+↗，含 portfolio JS 渲染模板）；软著/获奖信息章保留章形；控件语义分工已记入 AGENTS.md。
- **截图修复（9f68eb6）**：2df6f3d 曾将 TriHorny 截图错放进 immune-link.png 并删除 tri.png；已自 git 历史归位两图，档案架裂图与简历 ImmuneLink 实机窗同步修复。
- **历史仍有效**：2026-10-17 首页三项改动（auto-shelf 档案卡对齐、隐藏 3D 印章阻断 three.js、desk-reset 通透虚线重构）与更早简历去框化批次均已实装；`images/projects/秽土.avif` 保留勿删。

### 验证
- 已执行：本地 http.server + 浏览器截图核对首页/简历/画廊/档案架/洛天依五页与 390px 窄屏，渲染正常；CSS 花括号配平、旧类名零残留；截图修复后四项目图 loaded:true 且内容正确（排查中 tri.png 与秽土.avif 的 404 系 curl 未做 URL 编码的误报）。
- 未验证：推送远程与合入 main 部署。

### 未完成或阻塞
- 三个提交均在本地 `develop`，待推送 `origin/develop` 并合入 `main` 触发 GitHub Pages 部署（待用户授权）。
- `morel.jpg` 877KB 接近 1MB 上限（低优先级可选优化）。

### 接着做
- 第一个动作：推送 `origin/develop` 并合入 `main`，触发 Pages 自动部署上线。

## 工作留痕

- 2026-10-24 · Zcode：token 收口+控件层统一（3acf0bc）；外链钮统一 .link-dash（8b58959）；修复截图错放（9f68eb6）。浏览器五页与窄屏验证通过；未推送远程。
