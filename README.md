# ZLOONG 工房

[dragonzhi.xyz](https://dragonzhi.xyz/) · [GitHub Pages 镜像](https://dragonzhi.github.io/)

---

## 徽章与统计

[![GitHub last commit](https://img.shields.io/github/last-commit/Dragonzhi/Dragonzhi.github.io)](https://github.com/Dragonzhi/Dragonzhi.github.io/commits/main)
[![GitHub repo size](https://img.shields.io/github/repo-size/Dragonzhi/Dragonzhi.github.io)](https://github.com/Dragonzhi/Dragonzhi.github.io)

### 技术栈
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B7?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 关于项目

这是 ZLOONG 的个人主站（**工房**）：作品、Mod 练习和一点 vibe coding 的痕迹，都摆在这张台面上。

纯静态 HTML + CSS + 原生 JavaScript，无框架、无构建工具、零第三方依赖。设计遵循「工房 Workshop」定稿：暖纸台面 + 朱砂点缀 + 双轨编号（中文数字 × mono）；geek 元素纸化——终端和打字机天然存在，发光只允许出现在 SIGNAL 彩蛋一处。

> 备案合规：备案名称「Hanako箱庭」，`<title>` 固定写作「ZLOONG 工房 · Hanako箱庭」，
> 页脚挂 [闽ICP备20260330551号-1](https://beian.miit.gov.cn/)。

### 部署

推送 `main` 分支即自动发布：GitHub Actions 通过 SSH 到腾讯云服务器拉取最新代码（`.github/workflows/deploy.yml`），主站为 <https://dragonzhi.xyz/>，GitHub Pages 同步作为镜像。无构建步骤，推什么部署什么。

---

## 目录结构

| 路径 | 说明 |
|---|---|
| `index.html` | 工房首页：报头墙 → 今日一言 → 可拖动贴贴台面 → 本区导览 → 报尾 |
| `css/workshop.css` | 首页样式（自 workshop v5 设计定稿抽取） |
| `js/workshop.js` | 打字机、门牌日期、迷你 Markdown 解析 + files/ 读取、台面拖动与自适应撑大、复制邮箱、SIGNAL 彩蛋 |
| `data/content.js` | 打字机 phrases（其余卡片文案在 `files/`） |
| `data/desk-config.js` | 台面尺寸配置：最小高/宽与四周留白，只改这一个文件，刷新即生效 |
| `files/` | 卡片文案源文件：`about.md` / `now.md` / `links.md` / `motto.txt` / `daily.txt`；新增 `.md` 自动成为档案架卡片 |
| `scripts/` | 本地生成脚本：`generate_manifest.py`（files/ 索引）、`generate_gallery_json.py`（画廊索引） |
| `data/files-manifest.json` | `files/` 目录索引：丢新文件后跑 `python scripts/generate_manifest.py` 重新生成 |
| `pages/` | 子页面（博客版、画廊版、作品集存档），已迁移至工房设计系统，从首页导览牌进入 |
| `posts/` + `data/posts.json` | 博客文章（Markdown + JSON 索引，marked.js 渲染） |
| `legacy/` | 旧版主页与作品集存档（legacy 作品集仍由 `data/portfolio.json` 驱动） |
| `images/` | 头像、favicon、项目图；`画廊/` 目录的索引由脚本生成 |

---

## 主要功能

* **工房首页**：报头墙 + 「常开 OPEN」印章、今日一言（按 UTC 日期轮选，同一天所有人看到同一句）、纸卡台面（hero 胶带卡 / about / now / projects 档案架 / links / motto / 自发现档案架）。about / now / links / motto / 今日一言 的文案是 `files/` 下的真实 .md/.txt，页面自动读取渲染；`files/` 里新增的任意 `.md` 文件会自动变成一张档案架卡片。
* **可拖动台面**：桌面端（≥901px 且鼠标精准）每张贴贴可自由拖动，位置存 localStorage 刷新不丢，「还原台面」一键复位；台面随内容自动撑大，尺寸可在 `data/desk-config.js` 调整；窄屏 / 触屏自动退化为单列流式。
* **本区导览**：菜单式目录牌（壹～伍），通向博客版、画廊版、作品集存档与 IterTrip。
* **隐藏信号**：点页脚 `SIGNAL / 66.00 MHz`，或在任意位置键入 `66CCFF`，唤出工房角落的收音机。
* **渐进增强**：核心内容纯静态即可完整显示；所有 fetch 容忍失败，绝不白屏。
* **响应式 + 无障碍**：窄屏退化为单列；尊重 `prefers-reduced-motion`。

---

## 常用改动

### 改卡片文案（about / now / links / motto / 今日一言）

改 `files/` 下的源文件即可，不用动 HTML（HTML 里的静态内容只是无 JS 兜底，可不同步）：

| 文件 | 对应卡片 | 格式 |
|---|---|---|
| `files/about.md` | about 卡片 | 段落，空行分隔 |
| `files/now.md` | now 卡片 | `- ` 无序列表 |
| `files/links.md` | links 卡片 | `- [文字](链接)`；邮箱行末尾加 `{copy}` 生成复制按钮 |
| `files/motto.txt` | motto 便签 | 第一段进正文（行内自动换行），空行后第二段进落款 |
| `files/daily.txt` | 今日一言 | 每条 2 行（正文 + 落款），条目间空行分隔；按日期轮选，次日自动换 |

首页用自带的迷你 Markdown 解析器（无第三方依赖），支持：`` `code` `` → 等宽标签、`**粗体**`、`[[在制]]` → 朱砂状态徽章、`[文字](链接)`。**其余一律按纯文本显示，不解析原始 HTML**（规避 XSS）。改完推送后，Fastly CDN 最多缓存 10 分钟，稍候即生效。

### 新增档案架卡片

在 `files/` 里新建一个 `.md` 文件（如 `工具箱.md`），然后运行：

```bash
python scripts/generate_manifest.py
```

推送到仓库后，首页 bento 网格会自动多一张卡片，**样式按内容自动匹配**，不用记任何约定：

| 文件内容 | 渲染成 |
|---|---|
| 全部是 `- ` 列表且每行含 `[文字](链接)` 或以 `{copy}` 结尾 | links 风格链接列表卡（外链自动新窗口） |
| 全部是 `- ` 列表 | now 风格圆点列表卡 |
| 全部以 `> ` 开头 | motto 风格便签卡（空行后的引用块作落款） |
| 其他（段落、混合） | 段落卡 |

**dim 灰字约定**：链接后的尾部文字自动变灰并补 ↗，写法 `- [blog](pages/blog.html) / 博客`。卡片标题即文件名（带扩展名）。`about` / `now` / `links` / `motto` / `daily` 是内置卡片名，不会被重复生成。

### 改打字机句子

在 [`data/content.js`](data/content.js) 的 `phrases` 里改。

### 调台面尺寸

台面的最小高度 / 宽度与四周留白都在 [`data/desk-config.js`](data/desk-config.js) 里改，无需动 CSS/JS，刷新即生效；台面内容超出配置范围时会自动撑大。

### 改作品档案架

`index.html` 的 `projects/` 区块为静态四件，直接编辑即可；中文数字编号（第壹件～第肆件）与「获奖 / 在制」徽章手工维护。

### 发博客文章

1. 在 `posts/` 新建一篇 Markdown；
2. 在 [`data/posts.json`](data/posts.json) 加一条记录（slug、标题、日期、摘要、文件路径）。

### 更新画廊索引

把图片放进 `images/画廊/`，然后运行：

```bash
python scripts/generate_gallery_json.py
```

### 本地预览

```bash
python -m http.server 8000
```

打开 <http://127.0.0.1:8000/>。直接双击 HTML 时，浏览器可能会阻止读取 JSON，请务必走 HTTP 服务。

---

## 最近更新

- **台面贴贴可拖动**：桌面端卡片自由拖拽、localStorage 存档、一键还原；台面尺寸支持 `data/desk-config.js` 配置，自适应撑大并修复布局棘轮问题。
- **子页面统一**：博客版 / 画廊版 / 作品集迁移至工房设计系统，统一设计令牌与样式。
- **导览扩充**：目录牌新增 IterTrip 启程（/itertrip/）。
