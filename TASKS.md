# Dragonzhi.github.io

status: 进行中
next: 首页三项优化（auto-shelf 档案卡对齐 resume-card 规范、隐藏 3D 印章与 three.js 引用、重构 desk-reset 按钮为通透虚线极客风）已由用户目视验收并通过 git 提交至 develop 分支；下一步视需要将 develop 推送远程并合入 main 分支上线。
updated: 2026-10-17

## 待办

- [ ] （待定）秽土.avif——清单外像素火影截图，暂保留原样
- [ ] （可选）morel.jpg 877KB 接近 1MB 上限，如需可压缩至 600KB 内

## 进行中

（无）

## 已完成

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
- **首页自发现档案架卡片（#auto-shelf > section）规范化**：
  - 结构（`js/workshop.js`）：`buildAutoCard` 组装卡片时自动注入右上角纸质角标 `.tile-badge`（根据类型显示 `档案 / DOC`、`索引 / LINKS`、`清单 / LIST`、`便签 / NOTE`）。
  - 样式（`css/workshop.css`）：对齐 `#resume-card` 规范，实装左侧 4px 朱砂红装订指示线（`::before`）、硬质纸卡 `3px` 微圆角、真实立体纸影（`box-shadow: 2px 4px 12px rgba(38,34,28,.10)`，hover `translateY(-4px)`）、微型等宽标题 `▤ `、内部链接采用朱砂红虚线下划线（`.resume-btn` 风格），宽度规范为便签卡尺度（`width: min(300px, 100%)`），并在窄屏下自动 100% 适配。
- **隐藏 3D 印章组件与阻断 three.js 外部依赖**：
  - 页面入口（`index.html`）：注释隐藏 `#seal-rig`（3D 画布容器）、`#seal-clear`（清除键）、`seal-hint` 拖拽提示语，并同步注释 `<link rel="stylesheet" href="css/seal.css">` 与 `<script src="js/seal.js"></script>`。
  - 性能与纯粹性：全站彻底阻断了向 jsDelivr 请求 600KB+ `three.js` 的网络开销与 WebGL 上下文初始化，首页完全回归 100% 纯静态零依赖，保留 `css/seal.css` 和 `js/seal.js` 源文件备用。
- **重构台面还原按钮（#desk-reset）**：
  - 样式（`css/workshop.css`）：彻底清除原浅红杂色底与实心大红 hover 块，采用与 `.signal-trigger`、`.skill-proof-tag` 一致的通透极客纸感——完全透明背景 + `1px dashed var(--line)` 细虚线框 + 软墨色等宽字符 + 极简 `↺` 重置符；hover 时虚线转实线朱砂红 + 1px 微浮 + `↺` 45° 优雅回旋。
- **历史已确认事项（仍有效）**：
  - 简历实机图批次、无图卡单栏横跨、Section 04 软著荣誉精炼案卷卡（方案 A）、简历全局「去框化·通透化」重构均已在上一会话实装并推送至 `develop` 与 `main`。
  - `images/projects/秽土.avif`（清单外像素火影截图）保留原样，勿删。

### 验证
- 已执行：
  - 用户本地浏览器目视验收全部通过。
  - 通过临时测试文件 `files/test-shelf.md` 与 `python scripts/generate_manifest.py` 验证了 auto-shelf 的 manifest 生成、异步 fetch 与卡片 DOM 渲染结构，验证完毕后干净移除测试文件并恢复原 manifest。
  - `git diff` 严格核对 `index.html`、`css/workshop.css`、`js/workshop.js`、`TASKS.md`，无多余未预期修改，语法与样式作用域均正常。
  - 执行 `git add` 与 `git commit` 将本次改动完整提交至 `develop` 分支。
- 未验证：
  - 合入 main 分支并部署（待用户后续授权）。

### 未完成或阻塞
- 当前提交已在本地 `develop` 分支完成，待后续推送到远程并合入 `main`。
- `morel.jpg` 877KB 接近 1MB 上限（低优先级可选优化）。

### 接着做
- 第一个动作：视需要将 `develop` 分支推送至 `origin/develop`，并合入 `main` 分支推送到远程触发 GitHub Pages 自动部署上线。
