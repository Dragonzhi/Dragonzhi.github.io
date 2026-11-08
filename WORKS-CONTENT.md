# WORKS-CONTENT · 作品页内容底稿

> 作品页重构的内容源：页面可以摆放哪些项目、每件的图片路径与文案。
> **改文案先改这里，再同步到 `works.html`**（页面是显示端）；子页档案架另有一份 `data/portfolio.json`（`pages/portfolio.html` 消费），同一件作品两边都写时互相核对。
> 整理自 2026-11-08 的 `works.html` / `data/portfolio.json` / `pages/resume.html` 现状。

## 一、在跑（04 件）

### 01 · 风织雨 Weaving Rain ｜ 游戏

- 状态行：可试玩 · 2026.10.20 · 单人 13 天
- 图片：`images/projects/weaving-rain-gameplay.png`（1600×900，1.58 MB，压图候选）
- alt：风织雨实机画面：风把湿空气推上岛屿山坡成云，云雨落在农田与水库上
- 文案：拨动空气，把雨送到群岛上需要它的地方。含水库教学与九张关卡。
- 入口：TapTap 试玩 → <https://www.taptap.cn/app/981551> ｜ 源码 → <https://github.com/Dragonzhi/Weaving-Rain>
- 备注：子页（portfolio.json）文案更全（风停后云仍会走、自研关卡编辑器插件、3D 程序化视觉）；另有备用图 `images/projects/weaving-rain.png`（239 KB）全站零引用，留作轮换或删

### 02 · IterTrip ｜ AI 应用

- 状态行：已上线 · M24 · 1.3 万行
- 图片：`images/projects/itertrip.png`（1920×1080，207 KB）
- alt：IterTrip 实机界面：AI 对话生成路线，右侧三步行程卡片
- 文案：把旅行攻略变成能点的地图。从模型到页面一个人走完。
- 入口：在线可玩 → <https://dragonzhi.xyz/itertrip/>
- 备注：子页档案架还没有这件（portfolio.json 缺条目）；要两边齐就补一条 JSON

### 03 · 免疫联结 ImmuneLink ｜ 游戏

- 状态行：已上线 · 2025.12 · 卡赢杯公益赛
- 图片：`images/projects/immune-link.png`（1548×814，764 KB）
- alt：免疫联结 ImmuneLink 实机画面：2D 桥梁网络塔防
- 文案：主题是「桥」的 2D 塔防。设计、程序、像素美术独自完成，关卡可导入导出。
- 入口：在线游玩 → <https://dragonzhi.github.io/ImmuneLink/> ｜ 源码 → <https://github.com/Dragonzhi/ImmuneLink>
- 备注：子页还有一条 演示视频 → <https://www.bilibili.com/video/BV1Z8mFBUEk2/>，作品页没用

### 04 · 掷弹 Mod · CounterStrike Grenades ｜ Mod

- 状态行：已上线 · 2026.02 · Minecraft Forge
- 图片：`images/projects/csg.png`（1600×900，578 KB）
- alt：CounterStrike Grenades 实机画面：Minecraft 内的 CS2 投掷物与烟雾
- 文案：把 CS2 的投掷物机制搬进 Minecraft，含行为逻辑、3D 资产与 TACZ 兼容。
- 入口：源码 → <https://github.com/ThePiSquad/CounterStrikeGrenades>

## 二、在制（01 件）

### 05 · 棱镜 · 碧芙洛斯 ｜ 游戏

- 状态行：在制 · Godot 4 · 卡牌
- 图片：暂无
- 文案：Uno 机制 × 七色光谱相邻出牌。正在打磨成能跑的小游戏。
- 入口：暂无
- 备注：作品页与档案架都没有图和链接；子页 JSON 也没这条，动工前可以先补

## 三、归档（02 件）

### 06 · TriHorny4Link ｜ 游戏

- 状态行：已归档 · 2026.03 · Game Jam 练习
- 图片：`images/projects/tri.png`（1920×1080，516 KB）
- alt：TriHorny4Link 实机画面：塔防对局
- 文案：塔防玩法练习。动态路径重规划、对象池、事件驱动。
- 入口：作品页暂无；子页有 观看演示 → <https://b23.tv/EZKZQSl>（⚠ 与 07 共用同一短链，待核实）｜ GitHub → <https://github.com/Dragonzhi>（⚠ 是个人主页不是仓库，待换成仓库地址）
- 备注：子页文案更全（A*、对象池、性能优化；Godot / GDScript）

### 07 · 像素火影 · 秽土柱间 ｜ 游戏

- 状态行：已归档 · Unity 2D · 战斗系统（⚠ 子页 JSON 无日期字段）
- 图片：作品页暂无；盘上有 `images/projects/秽土.avif`（27 KB，子页在用作封面）——作品页重构时可直接上
- alt（子页用的）：像素火影秽土柱间角色画面
- 文案：Unity 2D 角色练习。技能、动画状态机、攻击判定。
- 入口：作品页暂无；子页有 观看演示 → <https://b23.tv/EZKZQSl>（⚠ 与 06 共用，待核实）

## 四、候选（页面上没有、素材与文案齐备，要放随时可加）

### A · 菌智鉴熟 ｜ AI 应用

- 来源：仅存在于封存履历 `pages/resume.html`（`#proj-morel`）
- 状态行建议：已上线 · 国家级大创 · 软著 2026SR0492487
- 图片：`images/projects/morel.jpg`（898 KB，⚠ TASKS 里挂着的压图候选）
- alt：菌智鉴熟羊肚菌智能检测系统检测中心界面
- 文案（履历原句）：国家级大创落地系统：通过两阶段深度学习模型识别羊肚菌品种与成熟度阶段，标注目标边界框并持久化溯源记录，辅助种植农户精确把握采摘时机。
- 作品页一句话可压成：拍一张，识别羊肚菌的品种与成熟度，帮农户掐准采摘时机。
- 指标：mAP50 85.05% · 多任务识别准确率 92.01%
- 技术：Flask · YOLOv11n · DINOv3 · OpenCV · SQLAlchemy
- 入口：履历里无外链（有软著号、无在线演示）
- 时间：2025.11 – 2026.04

### B · 智能优化中 OPTIMIZED ｜ 游戏

- 来源：仅存在于封存履历 `pages/resume.html`（`#proj-optimized`）
- 状态行建议：可试玩 · 好游快爆上线 · 2026.07
- 图片：`images/projects/optimized.jpg`（95 KB）
- alt：智能优化中像素风办公室场景
- 文案（履历原句）：金海豚 2026 游戏大赛参赛作品：反乌托邦多结局叙事游戏。21 天 GameJam 极限交付，以 Resource 数据驱动的任务调度与侵蚀值阈值系统支撑多结局分支。
- 作品页一句话可压成：反乌托邦像素叙事游戏，21 天极限交付，侵蚀值阈值撑起多结局。
- 技术：Godot 4 · GDScript · 数据驱动任务调度 · 多结局分支
- 入口：好游快爆试玩 → <https://www.3839.com/a/201212.htm>
- 时间：2026.07（8 人队伍，主程兼队长）

## 五、库存与问题清单

- `images/projects/weaving-rain.png`（239 KB）：全站零引用的孤儿图，留作轮换或删。
- `data/portfolio.json` 风织雨的 `image` 写的是 `weaving-rain-gameplay.jpg`，盘上只有 `.png`——子页 `pages/portfolio.html` 的风织雨封面现在是挂的（本次已顺手修正为 `.png`）。
- ⚠ `https://b23.tv/EZKZQSl` 被 06 与 07 两件共用为「观看演示」，至少一处是错的（TASKS 待核实项）。
- ⚠ 06 的 GitHub 链接是个人主页 `github.com/Dragonzhi`，不是仓库。
- 07 在子页 JSON 里没有 `date` 字段。
- TASKS 里另一条待核实：旧资料记录的「封面文字问题」——06/07 封面图上是否残留非正式字样，动工前过一眼两张图。

## 同步规则

1. 文案改动：先改这份 → 同步 `works.html` 对应面板；同一事实在 `data/portfolio.json` 也出现时两边一起改。
2. 新增项目：编号按「01 · 名称 ｜ 类别」顺延；图放 `images/projects/`，压到 300 KB 以下优先。
3. 状态只有三种：在跑 / 在制 / 归档——面板材质与状态灯跟着状态走，不新增第四种。
