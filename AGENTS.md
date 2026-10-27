# AGENTS.md

本文件约束所有在本仓库工作的 AI 代理（Codex / Claude Code / OpenCode / DSH 等）。
项目是 ZLOONG 个人主站：纯静态 HTML + CSS + 原生 JavaScript，无框架、无构建工具，部署在 GitHub Pages。

## 项目速览

- 按材质分 token 源：`css/tokens-screen.css` 为屏（首页 / 作品）的 token 唯一来源（三套配色：玄黑/冷白/暖白，定稿冷白）；`css/tokens.css` 为纸（子页 / Hanako 箱庭）的设计 token 来源，两套不混用。
- `js/date.js`：门牌日期注入脚本（`#today`，`data-date-format="dossier"` 走 2026.10.24 等宽格式，缺省走中文长格式），gallery / portfolio / resume 等子页共用，不要再复制内联日期代码。
- 首页不再有自动成卡。`index.html`（屏，冷白）与 `works.html` 由静态 HTML + `css/site.css` + `js/home.js` + `js/shelf.js` 驱动，数据从 `data/home.json` 读取。`files/` 下的旧文件保留，子页档案架引用 `data/portfolio.json`。
- **水位陈列**（`.shelf`）：全站立体的唯一一处，首页与作品页共用同一个组件，只是尺寸不同。七块等轴测立方体排成一条地平线，**位置即状态**——坐在线上 = 在跑，悬空 = 在制，沉到线下 = 归档；地平线压在方块前面横过去，所以是「站在水里」而不是「浮在空中」。指一块，下面那行就读出那一块（`js/shelf.js`，无脚本时读出行显示首块、方块照常可点）。**不要新增第二处立体物件**，要加内容就加进这一条水线上。
- **配色语义**（违背它比破坏视觉更严重）：青绿（`--live` / `--cube-live-*`）只给**现在就能玩**的东西；在制与归档一律走灰（`--cube-*` / `--cube-sunk-*`）。`#66CCFF` 全站只出现一次（关于页洛天依那一行），永不作控件色。
- `css/seal.css` + `js/seal.js`：工房印章（3D 单物件方向，纸材质子页使用）——视口右下角一枚 three.js 印章，拖到纸卡上按下即盖章；印子存 localStorage（`zloong-seal-v1`，只记坐标与随机种子，最多 48 枚），清除键 `#seal-clear` 贴在印章上方；窄屏不出现、不加载 three.js，已存印子也不渲染；无 WebGL 退化为 2D 印章。**全站唯一的第三方依赖就在这里**（见工作约定 5）。
- `legacy/`：旧站存档，不得删除（退役博客 `blog.html` + `posts/`，仍 fetch 根 `data/posts.json`；旧主题首页快照与旧作品集 demo）。博客已于 2026-09-30 退役并整体迁入 `legacy/`，根目录 `posts/` 已删除。
- `pages/resume.html` + `css/resume-workshop.css`：封存页，站内不设入口。信息架构是为「筛选者扫读」设计的；改文案直接改 `pages/resume.html`。**简历 PDF 一律不托管到站上**，只保留邮件索取通道，不要往仓库里放。
- `images/画廊/`：画廊图片，索引由 `python scripts/generate_gallery_json.py` 生成，勿手改 `images/gallery-images.json`。
- `luotianyi/` + `scripts/generate_luotianyi.py`：洛天依歌单独立页面（工房纸面 · 精修编年目录：左侧常驻年份索引轨 + 右侧编年曲目长流，天依碧印点缀）。**数据唯一来源是外部仓库 `Dragonzhi/luotianyi-song-list`（默认分支 master）**，改数据去那个仓库；页面由脚本从该仓库拉取后生成（`style.css` 与 `app.js` 是静态伴生文件，不随脚本生成）。`luotianyi/洛天依歌单.md` 是脚本写入的同步快照（兼作离线回退，线上可直接访问供引用），**不要手改**。
- `scripts/`：本地生成脚本统一归档（manifest / 画廊索引），从仓库根或任意目录运行均可（脚本内按自身位置定位仓库根）。
- `pages/`：纸风格子页面（画廊版 / 档案架 / 技术履历），在用；`data/portfolio.json` 是档案架子页的数据。`legacy/` 存档见上条，勿删。
- 合规红线：首页 `<title>` 为「ZLOONG · Dragonzhi」，页脚备案号「闽ICP备20260330551号-1」不得删改。

## 工作约定

1. 两套材质：屏（首页 / 作品，冷白）与纸（子页 / Hanako 箱庭）。首页与作品页遵循屏幕设计规范，子页仍保留纸感。
2. 改文案：首页刻度与最新更新改 `data/home.json`；子页作品数据改 `data/portfolio.json`；不要直接改不可同步的硬编码。
3. 核心内容必须纯静态可显示；所有 fetch 必须容忍失败，绝不白屏。
4. 保持响应式与无障碍：窄屏单列退化，尊重 `prefers-reduced-motion`。**动效一律用原生 CSS**（`@keyframes` + `animation-delay` 错峰），不引动画库；动效只准表达信息（落位、抬起），不做装饰性乱动。
5. 无构建工具，**首页与作品页保持零依赖原生实现**；纸材质印章按需加载 three.js r159 UMD。除此之外不得引入任何打包器、框架或 npm 依赖；新增依赖前必须先征得同意并同步更新本条。
6. 本地验证用 `python -m http.server 8000`，不要用 file:// 协议判断 fetch 是否正常。

## 硬性约束

- **不要自行执行 `git commit`**（`git push`、`git tag` 同理）。可以主动提议提交并给出建议的 commit message，但必须等用户明确确认后，由用户自行执行或在当轮对话中获得明确授权后才可执行。`git add` / `git stash` 等改变仓库状态的操作同样先征询。
- 不要删除或覆盖 `legacy/` 存档目录。
- 不要修改 `LICENSE`、备案号相关内容。
