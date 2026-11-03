# AGENTS.md

本文件约束所有在本仓库工作的 AI 代理（Codex / Claude Code / OpenCode / DSH 等）。
项目是 ZLOONG 个人主站：纯静态 HTML + CSS + 原生 JavaScript，无框架、无构建工具；主站部署在腾讯云（nginx 静态托管，从 `main` 分支取源码），GitHub Pages 保留为镜像。

## 文档结构

四层，职责不重叠，动笔前先认门：

| 文件 | 管什么 | 纪律 |
|---|---|---|
| `DESIGN.md` | 已经落地的事实 + 硬约束 | 重建期只写现状和不能动的东西，不写禁令；方向没定就不写 |
| `DECISIONS.md` | 为什么变成这样 | 按主题分组，组内时间倒序。**历史记录，不是现在的约束**，「否掉」只说明当时为什么没走那条路 |
| `TASKS.md` | 还没做完的事 | 只放待办 / 进行中 / 最近完成，老记录不再往上堆 |
| `archive/` | 一次性产物的归档 | BRIEF / HANDOFF / IMPLEMENT 已移入，只作考古，不再作为约束 |

新增设计规则改 `DESIGN.md`，**不要新开一份文档**。技术判断与仓库约定改本文件。

## 项目速览

只回答「东西在哪、改哪里」；设计规格一律以 `DESIGN.md` 为准，这里只留指针。

- **token 两家**：屏（首页 / 作品）在 `css/tokens-screen.css`（冷白定稿）；纸（子页 / Hanako 箱庭）在 `css/tokens.css`。两套不混用。
- **两页**：`index.html` 是整屏 hero（主名 + 字符墙 + 指针痕迹）+ 下滑的关于区，联系入口在关于区；作品在 `works.html`（§01 在跑 / §02 在制 / §03 归档）。共用 `css/site.css` + `js/home.js`，首页样式另有 `css/home.css`，`js/wall.js` 仅首页，`js/shelf.js` 仅作品页；在跑数读 `data/home.json`。
- **母题**：立方体在作品页水线，实现是 `js/cube.js` + `js/water.js`。
- **日期**：`js/date.js` 注入 `#today`，子页共用；不要再复制内联日期代码。
- **第三方**：运行时第三方只有 three.js r159 UMD——`js/seal.js` 只在 >1080px 的纸张页懒加载（固定版本，jsDelivr），失败 / 无 WebGL / 窄屏退回 2D 印章；`js/vendor/` 目前为空，新增依赖先征得同意。其余一律原生，入口图标内联 SVG，不用图标字体、不引图标库。
- **纸面**：印章 `css/seal.css` + `js/seal.js` 只服务纸材质子页；`pages/resume.html` 是封存页，站内不设入口，简历 PDF 不托管。
- **数据与生成**：画廊索引跑 `scripts/generate_gallery_json.py`（勿手改 JSON）；洛天依歌单由 `scripts/generate_luotianyi.py` 从外部仓库 `Dragonzhi/luotianyi-song-list` 生成，快照 `luotianyi/洛天依歌单.md` 勿手改；档案架读 `data/portfolio.json`。
- **存档**：`legacy/` 不得删除或覆盖。
- **本地工具**：`tools/` 是调参 / 对比页（每件材质一个），站内无入口、不参与部署必需路径。
- **合规**：首页 `<title>` 为「ZLOONG · Dragonzhi」，页脚备案号「闽ICP备20260330551号-1」不得删改。

## 工作约定

1. 两套材质：屏（首页 / 作品，冷白）与纸（子页 / Hanako 箱庭）。首页与作品页遵循 `DESIGN.md` 的屏幕设计规范，子页仍保留纸感。
2. 改内容：作品页门牌的在跑数改 `data/home.json`（`stats.running`）；首页正文和作品内容改对应 HTML，涉及同一事实时同步核对 HTML 静态兜底；子页作品数据改 `data/portfolio.json`。
3. 核心内容必须纯静态可显示；所有 fetch 必须容忍失败，绝不白屏。
4. 保持响应式与无障碍：窄屏单列退化，尊重 `prefers-reduced-motion`。动效用原生 CSS 优先；需要编排（滚动进出场、视差）时可用 Motion（motion.dev），自托管固定版本于 `js/vendor/`、不走 CDN，`prefers-reduced-motion` 下直接落终态。常驻动画、循环、指针跟随都可以用——只要不劫持原生滚动，并且能一句话说清它在表达什么。canvas 空转时停帧是为了省电，不是规矩。
5. 无构建工具，**首页与作品页保持原生实现**（不引框架、不引打包器、不用 npm 安装链）。这里的「无构建」指**源码即产物**：编辑后刷新即生效，部署不需要 npm install 或编译步骤；`scripts/` 的离线生成脚本与 `js/vendor/` 的预构建库不算构建。运行时第三方目前只有一个：纸材质印章按需加载的 three.js r159 UMD（`js/seal.js`，固定版本、失败退化为 2D）。`js/vendor/` 目录还没建，Motion 等第一个滚动动效落地时再 vendor 进去。新增其他依赖前必须先征得同意并同步更新本条。
   - **p5.js 的试用边界**：以后遇到需要快速探索生成图形的时候（粒子、场、噪声、生成图案、矢量草图），可以先在 `tools/` 或 `_lab/` 里用 p5.js 画原型——它省掉 DPR / resize / 状态机这些样板。但 p5 是 1.03 MB（min，v1.11.3）的框架，自带 60fps 的 `draw()` 常转循环，**不进首页与作品页的运行时**；要让 p5 进部署必需路径，先说明原生 Canvas 2D 为什么不够，再征得同意。
6. 本地验证用 `python -m http.server 8000`，不要用 file:// 协议判断 fetch 是否正常。该服务器不发缓存头，改过 CSS / JS 后浏览器可能仍读旧文件：验证前硬刷新（Ctrl+F5），或用 `fetch(url, { cache: 'no-store' })` 取回源码注入再测。

## 硬性约束

- **不要自行合并到 `main`**（直接 `git merge`、`git push origin main`、`gh pr merge` 都算）。除此之外的 git 操作由你自行判断执行：`develop` 等非 main 分支上的 `git add` / `git commit` / `git push` / `git tag` / `git stash` 无需再逐条征询。**提交按功能收口，不按次数收口**：同一个元素、同一项展示效果的多轮调整，攒到这一项做完再提交一次，中途不逐次提交；不同功能之间才拆开。提交后把 commit hash 与 message 报给用户。
- 不要删除或覆盖 `legacy/` 存档目录。
- 不要修改 `LICENSE`、备案号相关内容。

<!-- isle:begin -->
## 案屿（Isle）项目交接

本项目用案屿管理任务与交接记录。开工或收工前，先读取 `.agents/skills/isle/SKILL.md` 并按其规范执行；任务、交接摘要与工作留痕在项目根目录的 `TASKS.md`。
<!-- isle:end -->
