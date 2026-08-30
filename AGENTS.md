# AGENTS.md

本文件约束所有在本仓库工作的 AI 代理（Codex / Claude Code / OpenCode / DSH 等）。
项目是 ZLOONG 工房个人主站：纯静态 HTML + CSS + 原生 JavaScript，无框架、无构建工具，部署在 GitHub Pages。

## 项目速览

- `index.html` + `css/workshop.css` + `js/workshop.js` + `data/content.js` + `files/` + `data/files-manifest.json`：工房首页及其数据流（about / now / links / motto / 今日一言的文案在 `files/` 下的 .md/.txt，打字机句子在 `data/content.js`，`files/` 新增 `.md` 通过 `scripts/generate_manifest.py` 生成的索引自动成为档案架卡片，样式按内容自动判型：链接列表/圆点列表/便签/段落）。
- `posts/` + `data/posts.json`：博客文章（Markdown + JSON 索引）。
- `images/画廊/`：画廊图片，索引由 `python scripts/generate_gallery_json.py` 生成，勿手改 `images/gallery-images.json`。
- `scripts/`：本地生成脚本统一归档（manifest / 画廊索引），从仓库根或任意目录运行均可（脚本内按自身位置定位仓库根）。
- `pages/`、`legacy/`、`data/portfolio.json`：旧主题子页面与存档，改动需谨慎。
- 合规红线：`<title>` 固定为「ZLOONG 工房 · Hanako箱庭」，页脚备案号「闽ICP备20260330551号-1」不得删改。

## 工作约定

1. 遵循现有「工房 Workshop」设计定稿：暖纸台面 + 朱砂点缀 + 双轨编号；发光效果只允许出现在 SIGNAL 彩蛋一处，不要新增。
2. 改文案：about / now / links / motto / 今日一言改 `files/` 下的源文件（`about.md` / `now.md` / `links.md` / `motto.txt` / `daily.txt`），打字机句子改 `data/content.js` 的 `phrases`；不要直接改 HTML（HTML 里的静态内容只是无 JS 兜底，可不同步）。
3. 发新博客：在 `posts/` 建 Markdown，并在 `data/posts.json` 登记记录。
4. 核心内容必须纯静态可显示；所有 fetch 必须容忍失败，绝不白屏。
5. 保持响应式与无障碍：窄屏单列退化，尊重 `prefers-reduced-motion`。
6. 无构建工具，不要引入打包器、框架或 npm 依赖；保持零依赖原生实现。
7. 本地验证用 `python -m http.server 8000`，不要用 file:// 协议判断 fetch 是否正常。

## 硬性约束

- **不要自行执行 `git commit`**（`git push`、`git tag` 同理）。可以主动提议提交并给出建议的 commit message，但必须等用户明确确认后，由用户自行执行或在当轮对话中获得明确授权后才可执行。`git add` / `git stash` 等改变仓库状态的操作同样先征询。
- 不要删除或覆盖 `legacy/` 存档目录。
- 不要修改 `LICENSE`、备案号相关内容。
