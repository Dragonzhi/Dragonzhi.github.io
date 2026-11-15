# ZLOONG · Dragonzhi

个人主站：[dragonzhi.xyz](https://dragonzhi.xyz/) · [GitHub Pages](https://dragonzhi.github.io/)。纯静态 HTML、CSS 与原生 JavaScript，无构建步骤。

## 文档入口

- [AGENTS.md](AGENTS.md)：仓库约定、文件地图与硬约束。
- [DESIGN.md](DESIGN.md)：现行视觉与交互规则。
- [DECISIONS.md](DECISIONS.md)：当前设计取舍的历史原因。
- [TASKS.md](TASKS.md)：待办、交接与最近工作。
- [WORKS-CONTENT.md](WORKS-CONTENT.md)：首页作品的真实内容源。

## 日常维护

- 首页在 `index.html`；背景、关于区和作品区分别由 `js/terrain.js`、`js/home.js`、`js/works.js` 驱动。
- 作品文案先改 `WORKS-CONTENT.md`，再改首页与 `data/portfolio.json`。
- 子页共用纸材质样式；不要混用首页的 `tokens-screen.css`。
- 画廊索引与洛天依歌单由 `scripts/` 的离线脚本生成，不手改生成结果。
- 本地在仓库根目录运行 `python -m http.server 8000`，访问 `http://localhost:8000/` 检查。