# TASKS · ZLOONG 个人主站

status: 进行中
next: 首页已转正为 `index.html`；文档一致性清理完成，合并 main / 部署等你拍板。
updated: 2026-11-03

现行规则见 `AGENTS.md` 和 `DESIGN.md`；历史决策见 `DECISIONS.md`。

## 待办

- [ ] 复查 390 / 320 窄屏：关于卡内边距、作品页去线后的行距是否够。
- [ ] 核实像素火影与 TriHorny4Link 的素材和链接；旧资料记录了封面文字及共用短链的问题。
- [ ] 评估 `images/projects/morel.jpg` 的压缩空间；`秽土.avif` 暂时保留。
- [ ] 合并 `main` / 部署腾讯云：等用户授权（主站从 `main` 取源码，GitHub Pages 留镜像）。
- [ ] 把 `css/site.css` 里残留的首页门牌块（`.hero` 死规则、`.name` 基础、`.name-deep` / `.name-solid`、`.links` / `.icon-link` 与复制回执）迁到 `css/home.css`，让文件归属名副其实。
- [ ] 第一个滚动动效落地时：把 Motion 固定版本 vendor 进 `js/vendor/`（自托管、不走 CDN），按页按需加载，并实测体积。

## 进行中

暂无已开始但未完成的任务。

## 已完成

- [x] 文档一致性清理：`README` 撤掉「首页刻度」与 `recentShip`；`DESIGN` 更正 `t0` 与组件清单；`AGENTS` 的 p5 条目去掉已不存在的 `_lab/`；`TASKS` 只留近期完成；删空的 `docs/`（2026-11-03）
- [x] 更正文档里的 three.js 加载方式（`js/seal.js` 按需从 jsDelivr 取 r159，失败退回 2D），并把 p5.js 的试用边界写进 `AGENTS.md`（2026-11-03）
- [x] 首页转正：`_lab/reboot.html` → `index.html`，`_lab/wall.js` → `js/wall.js`；路径回根目录、title 回「ZLOONG · Dragonzhi」；首页为整屏 hero + 关于区，另附向下提示（裸雪佛龙 + 漏字）与调参台 / 对比页（2026-11-02）
- [x] 首页内联样式抽到 `css/home.css`，类名 `reboot` → `home`（2026-11-02）
- [x] 文档解绑：`DESIGN.md` 重写为「已落地事实 + 8 条硬约束」，旧版的判据 / 反模式 / 验收清单移入 `archive/DESIGN-v2.md`；`AGENTS.md` 撤掉动效与立体物上的审美禁令；`DECISIONS.md` 标注为历史记录（2026-11-01）
