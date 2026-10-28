# ZLOONG · Dragonzhi

个人主站：[dragonzhi.xyz](https://dragonzhi.xyz/) · [GitHub Pages](https://dragonzhi.github.io/)。纯静态 HTML、CSS 和原生 JavaScript，无构建步骤。

## 从哪里开始

- [AGENTS.md](AGENTS.md)：仓库约定、文件归属与硬性约束。
- [DESIGN.md](DESIGN.md)：首页和作品页的现行设计规则。
- [TASKS.md](TASKS.md)：待办和已知的设计与实现差异。
- [DECISIONS.md](DECISIONS.md)：历史设计决策；`archive/` 里的过程稿仅供追溯。

## 日常维护

- 首页刻度数据改 `data/home.json`；文字及静态兜底值在 `index.html`，作品页内容在 `works.html`。`recentShip` 字段暂未在页面显示。两者涉及同一事实时一并核对，确保脚本或网络不可用时仍然正确。
- 档案架数据改 `data/portfolio.json`；封存的履历页文字改 `pages/resume.html`。
- 画廊索引运行 `python scripts/generate_gallery_json.py` 生成；洛天依歌单从外部数据仓库由 `scripts/generate_luotianyi.py` 同步，详见 AGENTS.md。
- 在仓库根目录运行 `python -m http.server 8000`，通过 `http://localhost:8000/` 检查页面。
