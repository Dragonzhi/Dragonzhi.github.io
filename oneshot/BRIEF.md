# BRIEF · 个人网站（一次性交付）

> 这份文件就是全部输入。不要修改它，不要补充它，不要问问题。读完直接交文件。

## 交付物

两个页面：

- `index.html` —— 主页
- `works.html` —— 作品集

每个页面都是**单文件**：CSS 与 JS 全部内联，不引用任何外部样式表、脚本、字体、CDN、网络请求。

- 允许：原生 HTML / CSS / JS、内联 SVG、`<canvas>`、手写 WebGL。
- 不允许：任何库或框架、构建步骤、外部字体、外链资源。
- 图片用相对路径引用：`../../images/...`
- 这两页是**概念草图**，之后会在真实站点里重新实现。不必考虑长期维护、不必做组件化、不必写构建配置。
- 页面必须能在 `python -m http.server` 起的本地服务里直接打开，断网也照样显示完整。

## 这个站要回答的问题

**每一件作品都要回答「现在跑到哪了」。**

这是这个站存在的理由。作品不是奖状墙，是进度条。

## 站点信息

| 项 | 内容 |
|---|---|
| 标题 | `ZLOONG · Dragonzhi` |
| 一句话 | 做游戏，也做 AI 应用。 |
| 署名 | ZLOONG / Dragonzhi |
| 身份 | 计算机在读 |
| 方向 | 游戏开发 · AI 应用 |
| 引擎 | Godot 4、Unity |
| 语言 | GDScript、C#、Kotlin、Python、TypeScript |
| 偏好 | 洛天依 66CCFF |
| 头像 | `../../images/avatar.png` |
| 页脚 | `© 2026 ZLOONG · Dragonzhi` 与 `闽ICP备20260330551号-1`（备案号不得删改） |

外部入口（全部要有可达的入口，图标用内联 SVG）：

| 名称 | 链接 |
|---|---|
| GitHub | https://github.com/Dragonzhi |
| B 站 | https://space.bilibili.com/304097408 |
| 邮箱 | dzloong@foxmail.com |
| 每日站 Hanako 箱庭 | https://dragonzhi.xyz/hanako/ |

## 作品（全部内容，就是这六件）

状态用三个词：**在跑 / 在制 / 归档**。在制当前没有条目。

### 01 · 风织雨 Weaving Rain ｜ 游戏 ｜ 在跑

- 状态行：可试玩 · 2026.10.20 · 单人 13 天（评审期 2026.10.25 – 12.03，奖项待出）
- 图：`../../images/projects/weaving-rain-gameplay.png`（1600×900）
- alt：风织雨实机画面：风把湿空气推上岛屿山坡成云，云雨落在农田与水库上
- 文案：拨动空气，把雨送到群岛上需要它的地方。含水库教学与九张关卡。
- 入口：试玩 https://www.taptap.cn/app/981551 ｜ 源码 https://github.com/Dragonzhi/Weaving-Rain
- 措辞：开发期写「13 天」，不写 21 天；脚本总量含 AI 辅助验证，不要写成手写工程能力

### 02 · IterTrip ｜ AI 应用 ｜ 在跑

- 状态行：已上线 · 2026.08 起持续迭代 · 约 1.3 万行仓库代码
- 图：`../../images/projects/itertrip.png`（1920×1080）
- alt：IterTrip 实机界面：AI 对话生成路线，右侧三步行程卡片
- 文案：把旅行攻略变成能点的地图。从模型到页面一个人走完。
- 入口：在线可玩 https://dragonzhi.xyz/itertrip/
- 措辞：规模只写「约 1.3 万行仓库代码」

### 03 · 免疫联结 ImmuneLink ｜ 游戏 ｜ 在跑

- 状态行：已上线 · 2025.11 – 2025.12 · 卡赢杯公益赛（G-Star 公益行 2025）· 最佳创意游戏奖
- 图：`../../images/projects/immune-link.png`（1548×814）
- alt：免疫联结 ImmuneLink 实机画面：2D 桥梁网络塔防
- 文案：主题是「桥」的 2D 塔防。设计、程序、像素美术独自完成，关卡可导入导出。
- 入口：在线游玩 https://dragonzhi.github.io/ImmuneLink/ ｜ 源码 https://github.com/Dragonzhi/ImmuneLink（MIT）

### 04 · 掷弹 Mod · CounterStrike Grenades ｜ Mod ｜ 在跑

- 状态行：已上线 · 2025.12 – 2026.02 · Minecraft Forge · ThePiSquad 协作
- 图：`../../images/projects/csg.png`（1600×900）
- alt：CounterStrike Grenades 实机画面：Minecraft 内的 CS2 投掷物与烟雾
- 文案：把 CS2 的投掷物机制搬进 Minecraft，含行为逻辑、3D 资产与 TACZ 兼容。
- 入口：源码 https://github.com/ThePiSquad/CounterStrikeGrenades
- 措辞：协作项目，本人参与开发，Kotlin

### 05 · TriHorny4Link《三角渴望被连接》 ｜ 游戏 ｜ 归档

- 状态行：已归档 · 2026.03 · 034 GameJam · 最战斗爽塔防游戏奖
- 图：`../../images/projects/tri.png`（1920×1080）
- alt：TriHorny4Link 实机画面：塔防对局
- 文案：034 GameJam 期间诞生的塔防，富含连接与颜色融合玩法；本人承担主要程序实现。
- 入口：仓库 https://github.com/ThePiSquad/034-TriHorny4Link
- 措辞：团队报名参赛，不写「独立开发」；没有视频

### 06 · 像素火影 · 秽土柱间 ｜ 游戏 ｜ 归档

- 状态行：已归档 · 2026.08.07 · Unity 2D · 参与制作「秽土柱间」角色
- 图：`../../images/projects/秽土.png`（子页在用作封面）
- alt：像素火影秽土柱间角色画面
- 文案：像素火影参与制作——仅「秽土柱间」一个角色：技能系统与动画状态机。
- 入口：无
- 措辞：角色参与者，不是项目作者，不写「开发了整个游戏」

不要自己新增第七件，不要写示例项目，不要用 lorem 或占位文案。

## 不能破的几条

1. **零横向溢出**：1440 / 1024 / 768 / 390 / 320 五个宽度都不出现横向滚动条。
2. **静态可读**：关掉 JS，标题、人名、六件作品与页脚仍在。
3. **可访问**：尊重 `prefers-reduced-motion`；只有图标的入口热区 ≥44×44 且带 `aria-label`。
4. **不劫持原生滚动**：不拦 wheel、不接管滚动条、不做滚动吸附。
5. **法务**：页脚备案号原样保留。

## 不要做

- 不要在页面里写注释解释你的设计思路，不要加「设计理念」区块。
- 不要在回答里附方案说明、备选、建议。只交文件路径。
