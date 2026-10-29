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

- 按材质分 token 源：`css/tokens-screen.css` 为屏（首页 / 作品）的 token 唯一来源（三套配色：玄黑/冷白/暖白，定稿冷白）；`css/tokens.css` 为纸（子页 / Hanako 箱庭）的设计 token 来源，两套不混用。
- `js/date.js`：门牌日期注入脚本（`#today`，`data-date-format="dossier"` 走 2026.10.24 等宽格式，缺省走中文长格式），gallery / portfolio / resume 等子页共用，不要再复制内联日期代码。
- 结构两页：`index.html`（屏，冷白）承担门牌、现在、关于与联系，不陈列作品列表；作品一律在 `works.html`（§01 在跑 / §02 在制 / §03 归档）。两页由静态 HTML + `css/site.css` + `js/home.js` 驱动（`js/shelf.js` 仅作品页加载）；刻度从 `data/home.json` 读取，正文与静态兜底写在 HTML 中；`files/` 下的旧文件保留，子页档案架引用 `data/portfolio.json`。
- 首页 hero 的外部入口（GitHub / B 站 / 邮箱）是三枚内联 SVG 图标，**不用图标字体、不引图标库、不走 CDN**；图标直接写在 `index.html`，热区与 hover 状态在 `css/site.css` 的 `.icon-link`。
- **母题立方体**：屏上唯一的立体物，共两处，规格写在 `DESIGN.md §7`。① `works.html` 开头的水位陈列（`.shelf`），七枚 116px（≤767px 为 72px、一排横向滑动）排成一条地平线，**位置即状态**——坐在线上 = 在跑，悬空 = 在制，沉到线下 = 归档；地平线压在方块前面横过去，所以是「站在水里」而不是「浮在空中」；指一块，下面那行就读出那一块（`js/shelf.js`，无脚本时读出行显示首块、方块照常可点）。七枚都能按下拖动（松手带短惯性，再按下即刹车），拖动不触发跳转。② `index.html` §02 与 §03 之间一枚 74px 签名。**屏上不许再出现第三处立体物**，要加内容就加进那条水线。
- **水线以下是一池水**：`js/water.js` 用 Canvas2D 高度场（96 列，弹簧回正 + 邻居耦合 + 阻尼）在 `.shelf__deck` 里画水面；只在指针划过、按下、方块抬起时起波，衰减到阈值就清空状态并停掉 rAF——**静止时不跑循环**。它只加载于作品页，无 JS 时不存在；面在方块下缘之前（沉到线下的方块在水面之下），颜色走中性灰蓝，不借用青。`prefers-reduced-motion` 下水面静止。
- `js/vendor/`：运行时第三方代码的唯一落点，自托管、文件名带版本号、页面按需 `<script defer>`，**不得改用 CDN**。Motion 尚未 vendor，等第一个滚动动效落地时再放固定版本。
- **立方体的画法**：`js/cube.js` 用裸 WebGL2 渲染（二十四顶点带法线、正交投影、等轴测 45° / 35.264°、单一方向光、Lambert 漫反射、哑光无高光），**不引 Three.js**。入场是手写 2D 物理坠落（重力 + 触线反弹 + 角度回正），落点即设计位、落定即停帧，**坠落只搬方块本体（canvas / SVG），地线与接触影钉在地上不跟**；两页 `<head>` 各有一行内联脚本加 `drop-ready` 钩子做落位前隐藏（只藏方块，不藏线影），无 JS 时直接在位显示。低于 72px 不成立体，改用状态灯。无 JS 或无 WebGL 时降级为静态 SVG 三面块，布局不得塌；`prefers-reduced-motion` 下不播坠落、不自转、松手无惯性；冷白底上允许柔和接触影（浅底下影子是物理事实）。
- **配色语义**（违背它比破坏视觉更严重）：青绿（`--live` / `--cube-live-*`）只给**现在就能玩**的东西；在制与归档一律走灰（`--cube-*` / `--cube-sunk-*`）。`#66CCFF` 全站只出现一次（关于页洛天依那一行），永不作控件色。
- `css/seal.css` + `js/seal.js`：印章组件，**只服务纸材质子页**（从 Hanako 箱庭延续下来的元素，与屏上的立方体母题无关，不要把两者当成一套）。视口右下角一枚 three.js 印章，拖到纸卡上按下即盖章；印子存 localStorage（`zloong-seal-v1`，只记坐标与随机种子，最多 48 枚），清除键 `#seal-clear` 贴在印章上方；窄屏不出现、不加载 three.js，已存印子也不渲染；无 WebGL 退化为 2D 印章。**全站第三方依赖只许两处**：这里的 three.js，与 `js/vendor/` 的 Motion（见工作约定 5）。
- `legacy/`：旧站存档，不得删除（退役博客 `blog.html` + `posts/`，仍 fetch 根 `data/posts.json`；旧主题首页快照与旧作品集 demo）。博客已于 2026-09-30 退役并整体迁入 `legacy/`，根目录 `posts/` 已删除。
- `pages/resume.html` + `css/resume-workshop.css`：封存页，站内不设入口。信息架构是为「筛选者扫读」设计的；改文案直接改 `pages/resume.html`。**简历 PDF 一律不托管到站上**，只保留邮件索取通道，不要往仓库里放。
- `images/画廊/`：画廊图片，索引由 `python scripts/generate_gallery_json.py` 生成，勿手改 `images/gallery-images.json`。
- `luotianyi/` + `scripts/generate_luotianyi.py`：洛天依歌单独立页面（纸面 · 精修编年目录：左侧常驻年份索引轨 + 右侧编年曲目长流，天依碧印点缀）。**数据唯一来源是外部仓库 `Dragonzhi/luotianyi-song-list`（默认分支 master）**，改数据去那个仓库；页面由脚本从该仓库拉取后生成（`style.css` 与 `app.js` 是静态伴生文件，不随脚本生成）。`luotianyi/洛天依歌单.md` 是脚本写入的同步快照（兼作离线回退，线上可直接访问供引用），**不要手改**。
- `scripts/`：本地生成脚本统一归档（manifest / 画廊索引），从仓库根或任意目录运行均可（脚本内按自身位置定位仓库根）。
- `tools/`：本地调参台（`name-tuner.html`，主名浮雕的反光带与微动参数），纯静态单页、复用站点 CSS 的真组件；站内不设入口、不参与部署必需路径，参数存 localStorage，导出结果手工粘回 `css/site.css` / `js/home.js`。
- `pages/`：纸风格子页面（画廊版 / 档案架 / 技术履历），在用；`data/portfolio.json` 是档案架子页的数据。`legacy/` 存档见上条，勿删。
- 合规红线：首页 `<title>` 为「ZLOONG · Dragonzhi」，页脚备案号「闽ICP备20260330551号-1」不得删改。

## 工作约定

1. 两套材质：屏（首页 / 作品，冷白）与纸（子页 / Hanako 箱庭）。首页与作品页遵循 `DESIGN.md` 的屏幕设计规范，子页仍保留纸感。
2. 改内容：首页刻度改 `data/home.json`（`recentShip` 字段目前没有对应的页面元素）；首页正文和作品内容改对应 HTML，涉及同一事实时同步核对 HTML 静态兜底；子页作品数据改 `data/portfolio.json`。
3. 核心内容必须纯静态可显示；所有 fetch 必须容忍失败，绝不白屏。
4. 保持响应式与无障碍：窄屏单列退化，尊重 `prefers-reduced-motion`。动效默认用原生 CSS（`@keyframes` + `animation-delay` 错峰）；**允许 Motion（motion.dev）**做原生 CSS 难编排的滚动进出场与视差，自托管固定版本于 `js/vendor/`、不走 CDN；`prefers-reduced-motion` 下所有 Motion 动效直接落终态。动效只表达节奏与信息（落位、抬起、被扰动、进入视口），不劫持滚动、不做常驻循环。母题相关 canvas（`js/cube.js` 拖动、`js/water.js` 水面）只在被碰过后绘制，衰减即停。
5. 无构建工具，**首页与作品页保持原生实现**（不引框架、不引打包器、不用 npm 安装链）。这里的「无构建」指**源码即产物**：编辑后刷新即生效，部署不需要 npm install 或编译步骤；`scripts/` 的离线生成脚本与 `js/vendor/` 的预构建库不算构建。运行时第三方只有两个，且都自托管：`js/vendor/` 下固定版本的 Motion，纸材质印章按需加载的 three.js r159 UMD。新增其他依赖前必须先征得同意并同步更新本条。
6. 本地验证用 `python -m http.server 8000`，不要用 file:// 协议判断 fetch 是否正常。

## 硬性约束

- **不要自行合并到 `main`**（直接 `git merge`、`git push origin main`、`gh pr merge` 都算）。除此之外的 git 操作由你自行判断执行：`develop` 等非 main 分支上的 `git add` / `git commit` / `git push` / `git tag` / `git stash` 无需再逐条征询。**提交按功能收口，不按次数收口**：同一个元素、同一项展示效果的多轮调整，攒到这一项做完再提交一次，中途不逐次提交；不同功能之间才拆开。提交后把 commit hash 与 message 报给用户。
- 不要删除或覆盖 `legacy/` 存档目录。
- 不要修改 `LICENSE`、备案号相关内容。
