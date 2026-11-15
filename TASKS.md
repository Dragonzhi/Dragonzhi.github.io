# TASKS · ZLOONG 个人主站

status: 进行中
next: 作品区已并入首页；下一步按需继续补作品，main / 部署待授权。
updated: 2026-11-15

现行规则见 `AGENTS.md` 和 `DESIGN.md`；历史决策见 `DECISIONS.md`。

## 待办

- [ ] 核实像素火影与 TriHorny4Link 的素材和链接（共用短链 b23.tv/EZKZQSl、06 的 GitHub 是主页不是仓库、封面文字残留）；问题已汇总在 `WORKS-CONTENT.md` §五。
- [ ] 评估 `images/projects/morel.jpg` 的压缩空间；`秽土.png` 暂时保留。
- [ ] 合并 `main` / 部署腾讯云：等用户授权（主站从 `main` 取源码，GitHub Pages 留镜像）。
- [ ] 第一个滚动动效落地时：把 Motion 固定版本 vendor 进 `js/vendor/`（自托管、不走 CDN），按页按需加载，并实测体积。

## 进行中

暂无已开始但未完成的任务。

## 已完成

- [x] 首页作品区并入 B×D：无顶栏首页、风织雨空间主卡 + IterTrip / 免疫联结双列；新增 `works.css` / `works.js`，清理 `works-lab` 与旧统计文件，文档同步（2026-11-15）
- [x] 清空作品页旧设计（分支 ref/work.html）：删 `works.html` 与 `js/shelf.js` / `js/cube.js` / `js/water.js`，site.css 的全部作品组件（水位陈列 / 立方体 / 作品行 / 状态灯 / 图凹面 / 矮浪带）与 `body.works` 作用域删除，tokens 删立方体色；壳共用件保留、首页不受影响；`WORKS-CONTENT.md` 留作新设计的内容源（2026-11-08）
- [x] 作品页内容底稿 `WORKS-CONTENT.md`：现役七件 + 候选两件（菌智鉴熟 / 智能优化中）的图片路径与文案，问题清单汇总；顺手修 `data/portfolio.json` 风织雨封面路径 `.jpg` → `.png`（2026-11-08）
- [x] 作品页统一到主页外壳：bezel / sheet / 药丸顶栏 / 居中章头 / 页脚与首页同款，页首矮浪带（`data-amp` 调淡）；仪表条与 `.tabs` 退场，在跑数并入 §01 章节头；`site.css` 门牌块迁 `home.css`、`.about-grid` / `.fav` / `.about p strong` 等死规则清理（2026-11-08）
- [x] 首页字符墙改浪潮：sin 场驱动墨色与字形随时间起伏，浪沿 118° 光向推进，浪头泛青换密字、波谷换字；撤掉指针热度与 `#ink` 层，`tools/wall-tuner.html` 同步改浪潮参数（2026-11-08）
- [x] 关于区改居中铭牌案板：12 枚 Shields 式贴纸（status / craft / focus / fav / engine×2 / lang×5 / daily），墨键 + 站点淡彩，手贴角度与错位；每枚各自跟随指针、离开归位；歌单藏进 fav 铭牌作点击彩蛋（2026-11-03）
- [x] 文档一致性清理：`README` 撤掉「首页刻度」与 `recentShip`；`DESIGN` 更正 `t0` 与组件清单；`AGENTS` 的 p5 条目去掉已不存在的 `_lab/`；`TASKS` 只留近期完成；删空的 `docs/`（2026-11-03）
- [x] 更正文档里的 three.js 加载方式（`js/seal.js` 按需从 jsDelivr 取 r159，失败退回 2D），并把 p5.js 的试用边界写进 `AGENTS.md`（2026-11-03）
- [x] 首页转正：`_lab/reboot.html` → `index.html`，`_lab/wall.js` → `js/wall.js`；路径回根目录、title 回「ZLOONG · Dragonzhi」；首页为整屏 hero + 关于区，另附向下提示（裸雪佛龙 + 漏字）与调参台 / 对比页（2026-11-02）
- [x] 首页内联样式抽到 `css/home.css`，类名 `reboot` → `home`（2026-11-02）
- [x] 文档解绑：`DESIGN.md` 重写为「已落地事实 + 8 条硬约束」，旧版的判据 / 反模式 / 验收清单移入 `archive/DESIGN-v2.md`；`AGENTS.md` 撤掉动效与立体物上的审美禁令；`DECISIONS.md` 标注为历史记录（2026-11-01）

## 交接摘要

### 2026-11-15 作品区并入首页

- 变更要点：作品区回到 `index.html`，三件真实作品上线，生产文件与文档完成收口。
- 依据：用户选定 B 排版 × D 空间感，并要求删除卡内分页、英文 HUD 与旧式按钮。
- 验证结果：Chromium 五档无 console / 溢出 / 本地 404；减少动效、无 JS、档案页均通过。
- 未验证或阻塞：外部字体与 CDN 在受限网络下未加载；`main` 合并和部署仍待授权。

## 工作留痕

- 2026-11-15 · Codex：首页作品区并入 B×D 并同步文档；Chromium 五档通过，外部 CDN 未验证。
