# AGENTS.md

本文件约束所有在本仓库工作的 AI 代理（Codex / Claude Code / OpenCode / ZCode 等）。
项目是 ZLOONG 个人主站：纯静态 HTML + CSS + 原生 JavaScript，无框架、无构建；腾讯云静态托管从 `main` 部署，GitHub Pages 保留镜像。当前开发分支是 `develop`。

## 先看哪里

- 现行设计与约束：`DESIGN.md`
- 历史取舍：`DECISIONS.md`
- 待办与交接：`TASKS.md`
- 首页作品内容源：`WORKS-CONTENT.md`

同一规则只保留一处。新增规则先查这些文件，不要另开新文档。

## 文件地图

- `index.html`：首页 hero → 关于 → 作品 → 页脚；首页不挂顶栏。
- `css/tokens-screen.css`：屏（首页）token，冷白定稿。
- `css/site.css`：页面壳、子页顶栏、章头、铭牌键、页脚等共用件。
- `css/home.css`：hero、主名浮雕、关于区与铭牌案板。
- `css/works.css`：首页作品区、空间舞台、作品卡与平面按钮。
- `js/terrain.js`：首页程序化黑洞字符背景。
- `js/home.js`：年份、复制邮箱、主名与铭牌微动。
- `js/works.js`：风织雨主卡的精细指针视差。
- `css/tokens.css` / `css/workshop.css`：纸材质子页与洛天依页共用的 token / 基础样式。
- `pages/gallery.html`、`pages/portfolio.html`、`pages/resume.html`：画廊、档案架、封存履历。
- `luotianyi/`：洛天依歌单与画廊入口。
- `data/portfolio.json`：档案架作品数据；与首页同一事实要同步。
- `data/posts.json`：只服务受保护的 `legacy/`，不要据它恢复旧博客。
- `scripts/`：只保留画廊 JSON 与洛天依歌单的离线生成脚本。
- `legacy/`：历史存档，不得删除、覆盖或顺手修复。

## 不能破坏

1. **无构建**：源码即产物，刷新即生效；部署不跑 npm、不编译。
2. **两套材质**：首页用 `tokens-screen.css` 的屏；子页与洛天依用 `tokens.css` 的纸。不要混用。
3. **静态可读**：核心内容必须在 HTML 中有静态兜底；所有 fetch 必须容错，失败不能白屏。
4. **响应式与无障碍**：移动端可用，无横向溢出；尊重 `prefers-reduced-motion`；无文字图标必须有 `aria-label`，可交互热区不低于 44×44。
5. **视觉语言**：冷白纸、单一 118° 光源、青绿状态、朱砂强调；颜色、字号、间距优先复用现有 token。
6. **作品文案**：先改 `WORKS-CONTENT.md`；没有真实的项目、截图和链接就不要造卡片。
7. **依赖**：新增运行时依赖先征得同意；当前站点没有第三方运行时依赖。
8. **法务**：`LICENSE` 与页脚备案号不得删改。

## 工作方式

- 改首页先读 `index.html`、`css/tokens-screen.css`、`css/home.css`、`css/works.css`，不要凭记忆改。
- 改子页先确认它使用的 token 与样式链，保持纸材质，不把首页组件直接搬过去。
- 动效优先 CSS；需要编排时再用原生 JS。所有循环、视差和常驻动画都必须可暂停，并支持减少动效。
- 不劫持原生滚动；不用 canvas 空转维持画面。
- 新代码先搜现有实现；能复用旧组件就不要复制一套。
- 删除前先搜索引用；一次性文件、旧计划、已停用的数据链直接清理，历史交给 Git。

## 本地验证

- 在仓库根目录运行 `python -m http.server 8000`，通过 `http://localhost:8000/` 检查，不要用 `file://` 判断 fetch。
- 改过 CSS / JS 后硬刷新，或给资源加查询参数，避免读到浏览器缓存。
- 涉及布局时至少检查 1440×900、768×1024、390×844；同时看 Console、404、横向溢出和 Tab 焦点。

## Git

- 不自行合并或推送 `main`；`develop` 及其他非 main 分支的常规提交与推送可直接执行。
- 按功能收口提交，不按每轮微调提交；提交后把 commit hash 与 message 报给用户。
- 不执行破坏性历史改写；需要回滚时说明风险并先征得同意。

<!-- isle:begin -->
## 案屿（Isle）项目交接

本项目用案屿管理任务与交接记录。开工或收工前，先读取 `.agents/skills/isle/SKILL.md` 并按规范维护根目录 `TASKS.md`。
<!-- isle:end -->
