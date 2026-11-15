# ZLOONG · Dragonzhi

个人主站：[dragonzhi.xyz](https://dragonzhi.xyz/) · [GitHub Pages](https://dragonzhi.github.io/)。纯静态 HTML、CSS 与原生 JavaScript，无构建步骤。

## 文档入口

- [AGENTS.md](AGENTS.md)：仓库约定、文件地图与硬约束。
- [DESIGN.md](DESIGN.md)：现行视觉与交互规则。
- [DECISIONS.md](DECISIONS.md)：当前设计取舍的历史原因。
- [TASKS.md](TASKS.md)：待办、交接与最近工作。
- [WORKS-CONTENT.md](WORKS-CONTENT.md)：作品集页的真实内容源。

## 日常维护

- 首页在 `index.html`；作品集在 `works/index.html`。首页背景由 `js/terrain.js` 驱动，作品页主卡视差由 `js/works.js` 驱动，两页共用 `js/home.js` 的年份与基础交互。
- 首页与作品集页通过 `css/page-transition.css` 的跨文档 View Transition 切换；不支持时自动退化为普通导航。
- 作品文案先改 `WORKS-CONTENT.md`，再改 `works/index.html` 与 `data/portfolio.json`。
- 子页共用纸材质样式；不要混用首页的 `tokens-screen.css`。
- 画廊索引与洛天依歌单由 `scripts/` 的离线脚本生成，不手改生成结果。
- 本地在仓库根目录运行 `python -m http.server 8000`，访问 `http://localhost:8000/` 检查。