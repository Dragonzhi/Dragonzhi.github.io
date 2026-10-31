# AGENTS.md

本文件约束所有在本仓库工作的 AI 代理（Codex / Claude Code / OpenCode / DSH 等）。
项目是 ZLOONG 个人主站：纯静态 HTML + CSS + 原生 JavaScript，无框架、无构建工具；主站部署在腾讯云（nginx 静态托管，从 `main` 分支取源码），GitHub Pages 保留为镜像。

## 文档结构

四层，职责不重叠，动笔前先认门：

| 文件 | 管什么 | 纪律 |
|---|---|---|
| `DESIGN.md` | 当下的设计规则，唯一源头 | 只写现在成立的。**不许出现「已作废」「已取代」这类句子**，要废的判断直接删掉 |
| `DECISIONS.md` | 为什么变成这样 | 按时间倒序追加。被推翻的判断搬到这里，一条不丢 |
| `TASKS.md` | 还没做完的事 | 只放待办 / 进行中 / 最近完成，老记录不再往上堆 |
| `archive/` | 一次性产物的归档 | BRIEF / HANDOFF / IMPLEMENT 已移入，只作考古，不再作为约束 |

新增设计规则改 `DESIGN.md`，**不要新开一份文档**。技术判断与仓库约定改本文件。

## 项目速览

只回答「东西在哪、改哪里」；设计规格一律以 `DESIGN.md` 为准，这里只留指针。

- **token 两家**：屏（首页 / 作品）在 `css/tokens-screen.css`（冷白定稿）；纸（子页 / Hanako 箱庭）在 `css/tokens.css`。两套不混用。
- **两页**：`index.html` 是门牌 + 关于，联系只由 hero 三枚图标入口承担；作品在 `works.html`（§01 在跑 / §02 在制 / §03 归档）。共用 `css/site.css` + `js/home.js`，`js/shelf.js` 仅作品页；在跑数读 `data/home.json`。
- **母题**：立方体只出现在作品页水线，规格（尺寸、坠落、拖动、水面）见 `DESIGN.md §7`，实现是 `js/cube.js` + `js/water.js`；首页不许出现第二处立体物。
- **日期**：`js/date.js` 注入 `#today`，子页共用；不要再复制内联日期代码。
- **第三方**：只许 `js/vendor/` 的自托管库与印章按需加载的 three.js；入口图标一律内联 SVG，不用图标字体、不引图标库、不走 CDN。
- **纸面**：印章 `css/seal.css` + `js/seal.js` 只服务纸材质子页；`pages/resume.html` 是封存页，站内不设入口，简历 PDF 不托管。
- **数据与生成**：画廊索引跑 `scripts/generate_gallery_json.py`（勿手改 JSON）；洛天依歌单由 `scripts/generate_luotianyi.py` 从外部仓库 `Dragonzhi/luotianyi-song-list` 生成，快照 `luotianyi/洛天依歌单.md` 勿手改；档案架读 `data/portfolio.json`。
- **存档**：`legacy/` 不得删除或覆盖。
- **本地工具**：`tools/` 是调参 / 对比页（每件材质一个），站内无入口、不参与部署必需路径。
- **合规**：首页 `<title>` 为「ZLOONG · Dragonzhi」，页脚备案号「闽ICP备20260330551号-1」不得删改。

## 工作约定

1. 两套材质：屏（首页 / 作品，冷白）与纸（子页 / Hanako 箱庭）。首页与作品页遵循 `DESIGN.md` 的屏幕设计规范，子页仍保留纸感。
2. 改内容：作品页门牌的在跑数改 `data/home.json`（`stats.running`）；首页正文和作品内容改对应 HTML，涉及同一事实时同步核对 HTML 静态兜底；子页作品数据改 `data/portfolio.json`。
3. 核心内容必须纯静态可显示；所有 fetch 必须容忍失败，绝不白屏。
4. 保持响应式与无障碍：窄屏单列退化，尊重 `prefers-reduced-motion`。动效默认用原生 CSS（`@keyframes` + `animation-delay` 错峰）；**允许 Motion（motion.dev）**做原生 CSS 难编排的滚动进出场与视差，自托管固定版本于 `js/vendor/`、不走 CDN；`prefers-reduced-motion` 下所有 Motion 动效直接落终态。动效只表达节奏与信息（落位、抬起、被扰动、进入视口），不劫持滚动、不做常驻循环。母题相关 canvas（`js/cube.js` 拖动、`js/water.js` 水面）只在被碰过后绘制，衰减即停。
5. 无构建工具，**首页与作品页保持原生实现**（不引框架、不引打包器、不用 npm 安装链）。这里的「无构建」指**源码即产物**：编辑后刷新即生效，部署不需要 npm install 或编译步骤；`scripts/` 的离线生成脚本与 `js/vendor/` 的预构建库不算构建。运行时第三方只有两个，且都自托管：`js/vendor/` 下固定版本的 Motion，纸材质印章按需加载的 three.js r159 UMD。新增其他依赖前必须先征得同意并同步更新本条。
6. 本地验证用 `python -m http.server 8000`，不要用 file:// 协议判断 fetch 是否正常。该服务器不发缓存头，改过 CSS / JS 后浏览器可能仍读旧文件：验证前硬刷新（Ctrl+F5），或用 `fetch(url, { cache: 'no-store' })` 取回源码注入再测。

## 硬性约束

- **不要自行合并到 `main`**（直接 `git merge`、`git push origin main`、`gh pr merge` 都算）。除此之外的 git 操作由你自行判断执行：`develop` 等非 main 分支上的 `git add` / `git commit` / `git push` / `git tag` / `git stash` 无需再逐条征询。**提交按功能收口，不按次数收口**：同一个元素、同一项展示效果的多轮调整，攒到这一项做完再提交一次，中途不逐次提交；不同功能之间才拆开。提交后把 commit hash 与 message 报给用户。
- 不要删除或覆盖 `legacy/` 存档目录。
- 不要修改 `LICENSE`、备案号相关内容。
