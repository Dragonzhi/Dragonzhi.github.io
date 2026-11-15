# WORKS-CONTENT · 作品内容源

> 这里只放能上桌的真实项目事实。作品集页展示什么由用户决定，本文件不承诺一次全部上线。
> 外部母本：`简历素材总库.md`（仓库外）。信息冲突时先核对母本，再改这里和页面，不反向改母本。

## 当前作品集展示

页面：`works/index.html`。首页不重复作品卡。

### 风织雨 Weaving Rain

- 状态：可试玩
- 类型：游戏
- 发布：2026.10
- 制作：单人 13 天
- 封面：`images/projects/weaving-rain-gameplay-1600.webp`；另备 `800w`
- alt：风织雨实机画面：青绿色海面上有一座小岛，云层正向圆形水库与农田降雨
- 简介：拨动空气，把雨送到群岛上需要它的地方。含水库教学与九张关卡。
- 试玩：<https://www.taptap.cn/app/981551>
- 源码：<https://github.com/Dragonzhi/Weaving-Rain>

### IterTrip

- 状态：已上线
- 类型：AI 应用
- 时间：2026.08 起
- 封面：`images/projects/itertrip.png`（1920×1080）
- alt：IterTrip 实机界面：AI 对话生成路线，右侧三步行程卡片
- 简介：把旅行攻略变成能点的地图。从模型到页面一个人走完。
- 在线体验：<https://dragonzhi.xyz/itertrip/>

### 免疫联结 ImmuneLink

- 状态：已上线
- 类型：游戏
- 时间：2025.11–12
- 制作：单人
- 封面：`images/projects/immune-link.png`（1548×814）
- alt：免疫联结 ImmuneLink 实机画面：2D 桥梁网络塔防
- 简介：主题是「桥」的 2D 塔防。设计、程序、像素美术独自完成，关卡可导入导出。
- 在线试玩：<https://dragonzhi.github.io/ImmuneLink/>
- 源码：<https://github.com/Dragonzhi/ImmuneLink>

## 候补项目

### 掷弹 Mod · CounterStrike Grenades

- 状态：已上线 · 2025.12–2026.02
- 类型：Minecraft Forge Mod · ThePiSquad 协作
- 封面：`images/projects/csg.png`
- 简介：把 CS2 的投掷物机制搬进 Minecraft，含行为逻辑、3D 资产与 TACZ 兼容。
- 源码：<https://github.com/ThePiSquad/CounterStrikeGrenades>

### TriHorny4Link《三角渴望被连接》

- 状态：已归档 · 034 GameJam · 最战斗爽塔防游戏奖
- 类型：Godot 塔防 · 团队报名，本人负责主要程序
- 封面：`images/projects/tri.png`（封面文字待核）
- 简介：连接与颜色融合塔防；包含 A* 动态重规划、对象池和事件驱动架构。
- 源码：<https://github.com/ThePiSquad/034-TriHorny4Link>

### 像素火影 · 秽土柱间

- 状态：已归档 · 2026.08.07
- 类型：Unity 2D 同人项目 · 角色参与者
- 封面：`images/projects/秽土.png`
- 简介：参与制作「秽土柱间」一个角色，负责技能、动画状态机和战斗判定。
- 入口：暂无；不要再使用旧共用短链。

### 智能优化中 OPTIMIZED

- 状态：可试玩 · 2026.08.01 上线
- 类型：Godot 4 像素叙事 · 8 人团队，本人程序负责人兼队长
- 封面：`images/projects/optimized.jpg`
- 简介：反乌托邦多结局像素叙事，侵蚀值决定可见真相与结局。
- 试玩：<https://www.3839.com/a/201212.htm>

### 菌智鉴熟

- 状态：已上线 · 国家级大创 · 软著 2026SR0492487
- 类型：AI 应用 · 项目成员 / 核心开发
- 封面：`images/projects/morel.jpg`（上桌前先压缩）
- 简介：上传羊肚菌图片识别品种与成熟度，支持边界框标注和检测记录追溯。
- 入口：暂无外链。

### 棱镜 Prism

- 用户已明确暂不上桌；Godot 4.5 抖音小游戏方向，素材未定。
- 不进入首页，不占位。

## 上桌规则

1. 只使用真实项目、真实截图和可访问入口；没有入口就写“暂无”。
2. 作品集页同一事实要同步到 `data/portfolio.json`；档案架字段结构不改。
3. 作品集页图片优先控制在 300KB 以下，必须有 `alt`、宽高和 `loading="lazy"`。
4. 封面文字正式名未核实的项目先修正素材，再上作品集页。
5. 状态只使用：可试玩 / 已上线 / 已归档；“筹备中”不作为真实作品状态。