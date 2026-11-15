# ZLOONG · Dragonzhi

个人主站：[dragonzhi.xyz](https://dragonzhi.xyz/) · [GitHub Pages](https://dragonzhi.github.io/)。纯静态 HTML、CSS 和原生 JavaScript，无构建步骤。

## 从哪里开始

- [AGENTS.md](AGENTS.md)：仓库约定、文件归属与硬性约束。
- [DESIGN.md](DESIGN.md)：首页与作品区的现行设计规则。
- [TASKS.md](TASKS.md)：待办和已知的设计与实现差异。
- [DECISIONS.md](DECISIONS.md)：历史设计决策；`archive/` 里的过程稿仅供追溯。

## 日常维护

- 首页结构在 `index.html`：hero 与关于区样式在 `css/home.css`，作品区在 `css/works.css` + `js/works.js`，背景在 `js/terrain.js`；子页共用壳在 `css/site.css`。
- 作品内容先把 `WORKS-CONTENT.md` 对齐，再改首页静态卡片；档案架数据同步改 `data/portfolio.json`。
- 封存的履历页文字改 `pages/resume.html`。
- 画廊索引运行 `python scripts/generate_gallery_json.py` 生成；洛天依歌单从外部数据仓库由 `scripts/generate_luotianyi.py` 同步，详见 AGENTS.md。
- 在仓库根目录运行 `python -m http.server 8000`，通过 `http://localhost:8000/` 检查页面。
