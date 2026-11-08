# ZLOONG 个人作品集 · 多智能体并行设计执行规划（基于 pen.dev / `.pen`）

本规划文档面向后续调度执行模型（弱模型）与各执行子智能体编写，所有视觉 Token、组件参数、内容文案、画布坐标、节点命名与 MCP 操作边界均已固化，执行模型无需二次推导设计决策，直接按本规划创建并调度子智能体即可在同一 `.pen` 文件内完成整套作品集设计。

---

## 1. 项目理解与素材分析

### 1.1 项目背景与核心目标
- **创作者身份**：ZLOONG（Dragonzhi），计算机在读学生，核心定位为 **「做游戏，也做 AI 应用。」**（兼具独立游戏开发、技术美术/程序化视觉与全栈 AI 应用落地能力）。
- **设计任务目标**：基于现有主站代码（`index.html`、`tokens-screen.css`、`site.css`、`home.css`）确立的 **「冷白纸面 + 墨色亚克力外框 + 118° 定向光拟物/软 UI + 水位状态母题」** 视觉语言，以及 `WORKS-CONTENT.md` 梳理的作品底稿，使用多个 AI 子智能体通过 [pen.dev](https://pen.dev/)（原 Pencil）MCP 工具链，在 **同一个 `.pen` 文件**（命名为 `zloong-portfolio.pen`）中并行完成多页面作品集及其响应式画板的设计。
- **双模型协作模式**：
  - **规划层（本规划文档）**：完成全量设计 Token 提炼、信息架构决策、画布分区坐标锁定、组件库定义与各子智能体指令集编写。
  - **执行层（后续弱模型 + 子智能体）**：弱模型充当总调度器，按阶段启动总协调智能体、页面设计子智能体与质量检查智能体，在 `zloong-portfolio.pen` 中落盘交付。

### 1.2 作品集内容盘点与素材审计（严格基于 `WORKS-CONTENT.md`）

根据 `WORKS-CONTENT.md` 梳理，当前共有 **7 件正式作品（01–07）** 与 **2 件优质候选作品（A、B，来自封存履历 `pages/resume.html`）**。严禁虚构任何未出现在底稿中的项目经历、指标或外链。

| 编号与名称 | 类别 | 状态分类 | 状态行文案 | 核心文案与亮点（主站精简版 vs 详情扩展版） | 现有图片素材与规格 | 外部入口链接 | 素材完整度与待核实问题（`[待补充/待核实]`） |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01 · 风织雨 Weaving Rain** | 游戏 | 在跑（`live`） | `可试玩 · 2026.10.20 · 单人 13 天` | **主站文案**：拨动空气，把雨送到群岛上需要它的地方。含水库教学与九张关卡。<br>**档案/详情亮点**：风停后云仍会走、自研关卡编辑器插件、3D 程序化视觉 | 主图：`images/projects/weaving-rain-gameplay.png`（1600×900，1.58 MB，压图候选）<br>备用孤儿图：`images/projects/weaving-rain.png`（239 KB）<br>Alt：风织雨实机画面：风把湿空气推上岛屿山坡成云，云雨落在农田与水库上 | TapTap 试玩：`https://www.taptap.cn/app/981551`<br>源码：`https://github.com/Dragonzhi/Weaving-Rain` | 素材完整，适合作为作品页 **首件整幅主推（Hero Item）** 及 **重点案例详情页** 标杆 |
| **02 · IterTrip** | AI 应用 | 在跑（`live`） | `已上线 · M24 · 1.3 万行` | **主站文案**：把旅行攻略变成能点的地图。从模型到页面一个人走完。 | 主图：`images/projects/itertrip.png`（1920×1080，207 KB）<br>Alt：IterTrip 实机界面：AI 对话生成路线，右侧三步行程卡片 | 在线可玩：`https://dragonzhi.xyz/itertrip/` | 主站素材齐备；`[待补充]` 子页 `data/portfolio.json` 尚缺该条目，需在档案架页面同步补齐 |
| **03 · 免疫联结 ImmuneLink** | 游戏 | 在跑（`live`） | `已上线 · 2025.12 · 卡赢杯公益赛` | **主站文案**：主题是「桥」的 2D 塔防。设计、程序、像素美术独自完成，关卡可导入导出。 | 主图：`images/projects/immune-link.png`（1548×814，764 KB）<br>Alt：免疫联结 ImmuneLink 实机画面：2D 桥梁网络塔防 | 在线游玩：`https://dragonzhi.github.io/ImmuneLink/`<br>源码：`https://github.com/Dragonzhi/ImmuneLink`<br>演示视频（子页）：`https://www.bilibili.com/video/BV1Z8mFBUEk2/` | 素材完整；作品页/详情抽屉可增补 B 站演示视频入口 |
| **04 · 掷弹 Mod · CounterStrike Grenades** | Mod | 在跑（`live`） | `已上线 · 2026.02 · Minecraft Forge` | **主站文案**：把 CS2 的投掷物机制搬进 Minecraft，含行为逻辑、3D 资产与 TACZ 兼容。 | 主图：`images/projects/csg.png`（1600×900，578 KB）<br>Alt：CounterStrike Grenades 实机画面：Minecraft 内的 CS2 投掷物与烟雾 | 源码：`https://github.com/ThePiSquad/CounterStrikeGrenades` | 素材完整 |
| **05 · 棱镜 · 碧芙洛斯** | 游戏 | 在制（`wip`） | `在制 · Godot 4 · 卡牌` | **主站文案**：Uno 机制 × 七色光谱相邻出牌。正在打磨成能跑的小游戏。 | **暂无图片**（使用无图纯排版本 `.item--bare`） | **暂无外链** | `[待补充]` 作品页与子页 JSON 均无封面图与链接，设计中采用**无图极简行（Bare Row）+ 光谱色卡占位标识**，严禁伪造实机截图 |
| **06 · TriHorny4Link** | 游戏 | 归档（`arch`） | `已归档 · 2026.03 · Game Jam 练习` | **主站文案**：塔防玩法练习。动态路径重规划、对象池、事件驱动。<br>**子页补充**：A*、对象池、性能优化；Godot / GDScript | 主图：`images/projects/tri.png`（1920×1080，516 KB）<br>Alt：TriHorny4Link 实机画面：塔防对局 | 子页演示：`https://b23.tv/EZKZQSl`<br>子页 GitHub：`https://github.com/Dragonzhi` | `[待核实]` ① 演示短链 `b23.tv/EZKZQSl` 与 07 共用，至少一处有误；② GitHub 指向个人主页而非仓库；③ 封面图是否残留非正式字样需人工核查 |
| **07 · 像素火影 · 秽土柱间** | 游戏 | 归档（`arch`） | `已归档 · Unity 2D · 战斗系统` | **主站文案**：Unity 2D 角色练习。技能、动画状态机、攻击判定。 | 盘上有：`images/projects/秽土.avif`（27 KB，子页用作封面）<br>Alt：像素火影秽土柱间角色画面 | 子页演示：`https://b23.tv/EZKZQSl` | `[待核实]` ① 子页 JSON 缺 `date` 字段；② 演示短链与 06 冲突待核实；③ 封面文字问题待核实 |
| **候选 A · 菌智鉴熟** | AI 应用 | 候选（建议归入 `live` 扩展或档案页） | `已上线 · 国家级大创 · 软著 2026SR0492487`（时间：`2025.11 – 2026.04`） | **作品页精简句**：拍一张，识别羊肚菌的品种与成熟度，帮农户掐准采摘时机。<br>**履历原句**：国家级大创落地系统：通过两阶段深度学习模型识别羊肚菌品种与成熟度阶段，标注目标边界框并持久化溯源记录，辅助种植农户精确把握采摘时机。<br>**核心指标**：`mAP50 85.05% · 多任务识别准确率 92.01%`<br>**技术栈**：`Flask · YOLOv11n · DINOv3 · OpenCV · SQLAlchemy` | 主图：`images/projects/morel.jpg`（898 KB，压图候选）<br>Alt：菌智鉴熟羊肚菌智能检测系统检测中心界面 | 无在线演示外链（展示软著号 `2026SR0492487` 铭牌） | 素材与硬核技术指标齐备，强烈建议纳入档案架页及作品页候选扩展槽位，补强「AI 应用」维度的深度 |
| **候选 B · 智能优化中 OPTIMIZED** | 游戏 | 候选（建议归入 `live` 扩展或档案页） | `可试玩 · 好游快爆上线 · 2026.07`（8 人队伍，主程兼队长） | **作品页精简句**：反乌托邦像素叙事游戏，21 天极限交付，侵蚀值阈值撑起多结局。<br>**履历原句**：金海豚 2026 游戏大赛参赛作品：反乌托邦多结局叙事游戏。21 天 GameJam 极限交付，以 Resource 数据驱动的任务调度与侵蚀值阈值系统支撑多结局分支。<br>**技术栈**：`Godot 4 · GDScript · 数据驱动任务调度 · 多结局分支` | 主图：`images/projects/optimized.jpg`（95 KB）<br>Alt：智能优化中像素风办公室场景 | 好游快爆试玩：`https://www.3839.com/a/201212.htm` | 素材与上线链接齐备，体现团队主程/队长协作能力与数据驱动架构能力 |

### 1.3 内容展示策略：重点突出 vs 弱化处理 vs 内容关联
1. **重点突出（Tier 1 — 核心主推）**：
   - **01 风织雨 Weaving Rain**（游戏代表作：3D 程序化视觉 + 流体/气象模拟机制 + 自研编辑器工具链，单人 13 天高完成度交付）与 **02 IterTrip**（AI 应用代表作：1.3 万行代码独立全栈闭环），紧随其后是 **03 免疫联结 ImmuneLink** 与 **04 掷弹 Mod**。
   - **候选 A（菌智鉴熟）** 与 **候选 B（智能优化中 OPTIMIZED）** 拥有极高含金量的背书（国家级大创 + 软著、`mAP50 85.05%` 量化指标、金海豚大赛 8 人团队主程兼队长），在「全量作品档案与技术履历页」中作为重点案例展示，并在主作品页预留可一键启用的候选模块槽位。
2. **弱化收敛（Tier 2 & Tier 3 — 节奏呼吸与诚实留档）**：
   - **05 棱镜 · 碧芙洛斯（在制）**：无图无外链，采用紧凑单列文字行（`.item--bare`）+ 悬空立方体隐喻，诚实呈现「正在打磨」的松弛感。
   - **06 TriHorny4Link & 07 像素火影 · 秽土柱间（归档）**：早期机制/战斗系统练习作，在主作品页采用缩略图比（`0.9fr : 1fr`）与紧凑纵向间距（`padding: 16px 0`），不抢占在跑作品的视觉重心。
3. **跨作品内在关联（双主线交织）**：
   - **主线一：系统机制与程序化游戏开发**（Godot 4 / GDScript：`01 风织雨`、`03 免疫联结`、`05 棱镜`、`06 TriHorny4Link`、`B 智能优化中`；Unity / C#：`07 秽土柱间`；Minecraft Forge：`04 掷弹 Mod`）。共性亮点是**自研工具链（关卡导入导出/编辑器插件）**与**底层算法架构（A* 动态寻路、对象池、Resource 数据驱动）**。
   - **主线二：工程化 AI 应用落地**（`02 IterTrip` 智能行程地图、`A 菌智鉴熟` YOLOv11n + DINOv3 农业视觉检测系统）。与首页 Tagline「做游戏，也做 AI 应用」及关于我铭牌（`Godot 4`、`Unity`、`GDScript`、`C#`、`Kotlin`、`Python`、`TS`）形成严密闭环。

---

## 2. 现有视觉风格分析与统一设计规范

所有子智能体在 [pen.dev](https://pen.dev/) 中创建或修改任何图层时，必须严格遵守以下从 `index.html`、`tokens-screen.css`、`site.css`、`home.css` 提炼的量化设计规范。

### 2.1 整体视觉定位与设计气质
- **核心美学定义**：**「精密工业铭牌 × 触感软 UI 纸面（Tactile Industrial Plate & Soft-UI Paper Sheet）」**。
- **物理空间隐喻**：
  1. **页面外壳（The Shell）**：最外层是一圈深邃的 **墨色亚克力外框（`.bezel`）**，中间嵌入一张受光的 **冷白哑光纸面（`.sheet`）**，纸面带有 `0.06` 不透明度的细微颗粒噪点（Noise）。
  2. **全场唯一光源法则（118° 定向掠射光）**：全站所有立体构件（外框、顶栏药丸、主名厚板浮雕、关于区软 UI 凹槽案板、铭牌按键、三维立方体）共享 **左上受光、右下背光的 118° 线性光源**。
  3. **克制与诚实的秩序感**：拒绝霓虹赛博光效、拒绝廉价毛玻璃堆砌、拒绝装饰性废线（所有章节头 `.sec-head` 与条目之间均无 `border-bottom` 分割线，全靠留白、体块比例与水位线划分层级）。

### 2.2 色彩体系与主题变量（Design Variables）
主站默认使用 **冷白主题（`data-theme="cool"`）**，同时在 `tokens-screen.css` 中定义了 `dark`（玄黑）与 `warm`（暖白）三套语义变量。`.pen` 文件以 **`cool`（冷白）为基准主视觉画板**，同时将三套主题注册进 `.pen` 的 Variables 系统：

| 变量语义名 | `cool`（冷白 · 默认主设计态） | `dark`（玄黑） | `warm`（暖白） | 用途与规范约束 |
| :--- | :--- | :--- | :--- | :--- |
| `--bg` | `#F2F5F7` | `#08080A` | `#F7F4EC` | 纸面（`.sheet`）与凹槽卡内面主背景色 |
| `--surface` | `#FFFFFF` | `#0E0E11` | `#F0EADC` | 浮起层表面色 |
| `--frame` | `#D6DEE3` | `#16161A` | `#E6DECB` | 图片凹槽底色、水位线以下暗水区渐变顶色 |
| `--line` | `#CBD6DB` | `#2A2A33` | `#DED5C2` | 常规弱边界线 |
| `--line-strong` | `#B9C5CC` | `#3A3A45` | `#C5BAA4` | 水位陈列架地平线（`.shelf__rule`）、复制提示框边线 |
| `--fg` | `#12171A` | `#E9EEF1` | `#1A1712` | 主标题、正文强文字、图标主色（对比度 16.0:1） |
| `--fg-dim` | `#4C565C` | `#A9B3B9` | `#554D40` | 作品描述正文、在制状态文字、未选中药丸字（对比度 7.6:1） |
| `--fg-faint` | `#5C666C` | `#7F8990` | `#6A6252` | 等宽机器码元信息、归档状态文字、页脚文字（对比度 5.9:1） |
| `--live` | `#00605E`（`--qing-5`） | `#2FD3CB`（`--qing-2`） | `#00605E` | 「在跑 / 可试玩 / 已上线」状态指示灯与文字色 |
| `--mark` | `#8B2C1F`（`--zhu-4`） | `#E2533C`（`--zhu-2`） | `#7A2519` | 章节编号（`§01`）与作品编号（`01`）专用朱砂强调色 |
| **原色阶 · 青绿** | `--qing-1: #8FF0EA` / `--qing-2: #2FD3CB` / `--qing-3: #14A9A2` / `--qing-4: #00827F` / `--qing-5: #00605E` / `--qing-6: #004A49` | 同左 | 同左 | 仅用于「在跑」立方体三面、状态灯、青色铭牌贴纸 |
| **原色阶 · 朱砂** | `--zhu-1: #E96A52` / `--zhu-2: #E2533C` / `--zhu-3: #B93A26` / `--zhu-4: #8B2C1F` / `--zhu-5: #7A2519` | 同左 | 同左 | 仅用于编号强调、焦点外框、朱色铭牌贴纸 |
| **立方体 · 在跑 (`live`)** | 顶 `#2FD3CB` / 左 `#14A9A2` / 右 `#00605E` | 顶 `#8FF0EA` / 左 `#2FD3CB` / 右 `#00827F` | 顶 `#2FD3CB` / 左 `#14A9A2` / 右 `#00605E` | 水位陈列架「线上在跑」立方体三面受光色 |
| **立方体 · 在制 (`wip`)** | 顶 `#E6EDF0` / 左 `#BDC9D0` / 右 `#74818A` | 顶 `#DFE6EA` / 左 `#98A2A9` / 右 `#5F686E` | 顶 `#FFFDF8` / 左 `#D8CFBC` / 右 `#A89C86` | 水位陈列架「悬空在制」立方体三面受光色 |
| **立方体 · 归档 (`sunk`)** | 顶 `#D5DEE3` / 左 `#B9C5CC` / 右 `#97A3AB` | 顶 `#5B6469` / 左 `#3C4448` / 右 `#272C2F` | 顶 `#E5DFD2` / 左 `#CFC7B6` / 右 `#B9B0A0` | 水位陈列架「水下归档」立方体三面受光色 |
| **铭牌键 (`plate`)** | 高光端 `#F7FAFB` → 暗端 `#DFE6EB`（118°） | `#1E1E25` → `#131319` | `#FBF9F3` → `#E9E3D6` | 所有外部入口按钮（`.link`、`.icon-link`）底面渐变 |
| **软 UI 卡 (`soft`)** | 外沿暗 `#C3CED5` → 外沿亮 `#FFFFFF` / 内发光 `#284456` | `#3A3A45` → `#6A6A76` / `rgba(0,0,0,.85)` | `#C9BEA8` → `#FFFDF8` / `#2B2418` | 关于我案板（`.board`）与软卡容器（`.rows`） |
| **贴纸铭牌色 (`badge`)** | `qing: #CFE3E0` / `zhu: #E8D3CE` / `steel: #D7E0E5` / `sky: #D3E8F5` / `sand: #E7DDCB` | 同左 | 同左 | Shields 风格双段铭牌右半段底色（左半段恒为 `#232B37 → #161D28`） |

### 2.3 字体、字号、字重与排版层级
全站严格限制为 **3 组字体栈** 与 **6 档字号（`--t0` 至 `--t5`）**，禁止私自创造第 7 档字号：

1. **字体家族（Font Families）**：
   - `--sans`（中文与正文主力）：`"PingFang SC", "Microsoft YaHei", "Source Han Sans SC", "Noto Sans SC", system-ui, sans-serif`
   - `--black`（仅限首页超大主名 `ZLOONG`）：`"Arial Black", "Helvetica Neue", Arial, var(--sans)`，字重 `900`
   - `--mono`（编号、状态行、顶栏药丸、外链按钮、页脚等一切机器元信息）：`"Cascadia Code", "JetBrains Mono", Consolas, ui-monospace, monospace`
2. **六档字号与排版参数表（桌面端 1440px 基准画板 vs 移动端 390px 画板）**：

| 字号 Token | CSS 定义 | 桌面端 (1440px) 固定像素值 | 移动端 (390px) 固定像素值 | 字重 (Weight) | 字距 (Letter Spacing) | 行高 (Line Height) | 适用场景 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **主名特档** | `clamp(36px, 16.2vw, 230px)` | `220px` | `60px` | `900` (`--black`) | `-0.045em` | `0.90` | 仅限首页 Hero 中央 `ZLOONG` 浮雕厚板字 |
| **`--t0`** | `clamp(60px, 9.6vw, 140px)` | `128px` | `60px` | `900` | `-0.035em` | `0.95` | 预留特大视觉数字/海报级大标题 |
| **`--t1`** | `clamp(34px, 4vw, 56px)` | `52px` | `34px` | `900` (`--sans`) | `-0.025em` | `1.00` | 章节主标题 `h2`（如 `关于我`、`在跑`、`在制`、`归档`） |
| **`--t2`** | `clamp(24px, 2.4vw, 34px)` | `32px` | `24px` | `800` (`--sans`) | `-0.015em` | `1.25` | 作品卡片标题 `h3`（如 `风织雨 Weaving Rain`） |
| **`--t3`** | `17px` | `17px` | `17px` | `400` / `600` | `0` | `1.85`–`1.95` | 页面基准字号、首页 Tagline（`做游戏，也做 AI 应用。`）、水位架当前读出作品名 |
| **`--t4`** | `15px` | `15px` | `15px` | `400` (`--sans`) | `0` | `1.85` | 作品正文描述 `.item__desc`（最大行宽限制 `32em` / Hero 款 `44em`，折行优美） |
| **`--t5`** | `13px` | `13px` | `13px` | `400` / `500` (`--mono`) | `0.08em`–`0.22em`（全大写 `uppercase`） | `1.0`–`2.0` | 顶栏药丸 `.chip`、章节编号 `.no`、状态灯 `.state`、作品编号 `.item__no`、外链按钮 `.link`、页脚 `.foot` |

### 2.4 页面布局、栅格、留白与信息密度
1. **基准间距序列（8px 模数）**：
   - `--s1: 4px` / `--s2: 8px` / `--s3: 12px` / `--s4: 16px` / `--s5: 24px` / `--s6: 32px` / `--s7: 48px` / `--s8: 64px` / `--s9: 96px` / `--s10: 128px`。
2. **外框与纸面容器（Shell & Sheet）**：
   - 外框厚度 `--bezel`：桌面端 `20px`（`1440px` 画板内净纸面宽 `1400px`），移动端 `10px`（`390px` 画板内净纸面宽 `370px`）。
   - 外框背景：`linear-gradient(118deg, #20262B 0%, #12171A 52%, #0B0F12 100%)`，外圆角 `24px`，内纸面圆角 `4px`，纸面内发光 `inset 0 0 0 1px rgba(255,255,255,.55), inset 0 2px 10px rgba(18,23,26,.07)`。
3. **内容版心（`.wrap`）**：
   - 最大宽度 `--wrap: 1240px`，居中对齐；左右内边距 `--pad`：桌面端 `44px`（实际内容净宽 `1152px`），移动端 `24px`（`390px` 画板下内容净宽 `322px`）。
4. **信息密度与呼吸节奏（对比法则）**：
   - **重区（`§01 在跑`）**：首件作品 `01 风织雨` 整幅通栏铺开（`.item--hero`，图片宽 `1152px`）；第 `02`、`03`、`04` 件采用 `1.25fr : 1fr`（图宽约 `614px`，文宽约 `490px`，间距 `--s7: 48px`）奇偶交错排布（偶数项图片在右 `.item:nth-of-type(even) .item__fig { order: 2 }`），上下内边距 `48px`。
   - **轻区（`§02 在制` & `§03 归档`）**：纵向内边距压缩至 `--s4: 16px`；在制无图作品采用单列 `.item--bare`；归档作品采用小图比 `0.9fr : 1fr`（图宽约 `518px`，文宽约 `586px`），通过体量收缩自然形成视觉主次。

### 2.5 核心组件视觉特征（Component Specs）
1. **顶栏亚克力药丸导航（`.topbar` + `.chips`）**：
   - 右对齐排布，药丸间距 `6px`，单枚药丸内边距 `5px 13px 6px`，圆角 `999px`，字号 `13px (--t5)`，等宽字体。
   - **默认态（`.chip`）**：字色 `#4C565C`，背景 `linear-gradient(118deg, #FFFFFF 0%, #E7EDF0 100%)`，阴影 `inset 0 1px 0 rgba(255,255,255,.95), inset 0 0 0 1px rgba(18,23,26,.08), 0 1px 2px rgba(18,23,26,.06)`。
   - **激活态（`.chip--on`）**：字色 `#EDF2F4`，背景 `linear-gradient(118deg, #20262B 0%, #0B0F12 100%)`，阴影 `inset 0 1px 0 rgba(255,255,255,.16), 0 1px 2px rgba(18,23,26,.20)`。
2. **水位陈列架（`.shelf` —— 全站最具辨识度的视觉母题）**：
   - **空间结构**：桌面端高 `--h: 296px`，7 列等分网格（`gap: 24px`），地平线（水位线 `.shelf__rule`）位于距台面顶部 `--line: 164px` 处（`1px solid #B9C5CC`）。地平线以下为水体暗面（`linear-gradient(180deg, #D6DEE3 0%, transparent 92%)` 叠加池壁上下内阴影）。
   - **位置即状态（Position as State）**：
     - **在跑（`data-s="on"`，共 4 枚：01–04）**：青色立方体（`--cw: 116px`），底部浸入水线以下 `--dip: 12px`（即坐落在水面上）。
     - **在制（`data-s="air"`，共 1 枚：05）**：冷灰墨色立方体，悬空浮于水线以上 `--lift: 22px`。
     - **归档（`data-s="sunk"`，共 2 枚：06–07）**：浅灰沉没立方体，沉在水线以下 `8px` 处，默认不透明度 `0.8`。
   - **底部读出栏（`.shelf__read`）**：位于陈列架下方 `margin-top: 16px`，单行展示当前悬停/选中的作品：`[朱砂色编号 01]` + `[17px 粗体作品名 风织雨 Weaving Rain]` + `[浅灰元信息 可试玩 · 2026.10.20 · 单人 13 天]`。
3. **拟物铭牌键（`.link` / `.icon-link`）**：
   - 圆角仅 `1px`（硬朗工业标牌切角），背景 `118deg` 从 `#F7FAFB` 到 `#DFE6EB`。
   - 四重复合阴影：`inset 1.5px 1.5px 0 rgba(255,255,255,.90)`（左上亮棱）、`inset -1.5px -1.5px 0 rgba(18,23,26,.20)`（右下暗棱）、`0 2px 0 rgba(18,23,26,.10)`（硬沿厚度）、`0 5px 8px -3px rgba(18,23,26,.18)`（柔影）。
   - 首页图标键尺寸 `44×44px`，内部 SVG 图标带凸起浮雕滤镜；作品页文字入口键内边距 `5px 10px 4px`，文字平印无阴影。
4. **内凹画框（`.figure`）与软 UI 凹槽板（`.board` / `.rows`）**：
   - **`.figure`**：背景 `#D6DEE3`，图片上方覆盖一层内凹阴影 `inset 0 0 0 1px rgba(18,23,26,.26), inset 0 2px 8px rgba(18,23,26,.22)`，使截图呈现「镶嵌在纸板凹槽内」的质感。
   - **`.board` / `.rows`**：外层圆角 `32px`，背景 `linear-gradient(118deg, #C3CED5, #FFFFFF)` 充当 `4px` 凸起外沿；内层圆角 `28px`，背景 `#F2F5F7`，带 `inset 0 0 12px #284456` 与左上暗影、右下反光。
5. **Shields 散贴铭牌（`.sticker` + `.badge`）**：
   - 高度 `26px`，圆角 `2px`，左半段 Key（`#232B37 → #161D28`，字色 `#C3CED9`，`11px` 等宽），右半段 Value（`12px` 粗体 `#12171A`，5 种低饱和中国传统矿物色底 `--badge-c`）。每枚贴纸带专属微倾角 `--rot`（`-3.8deg` 至 `+3.4deg`）与纵向错位 `--dy`（`-13px` 至 `+14px`）。

---

## 3. 作品集整体信息架构

### 3.1 页面数量与拆解逻辑
遵循「内容驱动、拒绝为了凑智能体数量而注水拆页」的原则，结合现有代码库提及的页面关系（`index.html` 首页、`works.html` 作品页、`WORKS-CONTENT.md` 中指出的 `pages/portfolio.html` 子页档案架与 `pages/resume.html` 封存履历，以及重点项目的深度展示需求），规划 **4 个核心页面（每个页面含 Desktop `1440px` 与 Mobile `390px` 两个画板）+ 1 个公共设计系统与组件母版区**：

1. **Page 01 · 首页（`index.html` — 个人品牌舞台与身份铭牌）**
   - **定位**：第一眼视觉冲击与创作者身份锚点（`ZLOONG` 厚板浮雕 + 字符浪潮墙 + 散贴铭牌案板）。
2. **Page 02 · 作品总览页（`works.html` — 水位陈列架与精选作品展厅）**
   - **定位**：作品集核心枢纽。通过「水位陈列架」统领 `01–07` 七件作品的生命周期状态（在跑 4 件 / 在制 1 件 / 归档 2 件），下方按「重-轻-轻」节奏展开视觉画廊，并在底部设置通往「全量档案架」的铭牌入口。
3. **Page 03 · 重点项目深度案例页 / 详情抽屉母版（以 `01 · 风织雨 Weaving Rain` + `候选 A · 菌智鉴熟` 双标杆为例）**
   - **定位**：解决 `WORKS-CONTENT.md` 中「子页文案更全（风停后云仍会走、自研关卡编辑器插件、3D 程序化视觉）」及「大创 AI 项目高含金量技术指标（`mAP50 85.05%`、两阶段深度学习架构）在主作品页一句话放不下」的矛盾。设计为既可作为独立详情页访问、也可在 `works.html` 点击触发的 **「软 UI 内凹档案卷宗 / 侧滑详情面板（Case Study Sheet）」**。
4. **Page 04 · 全量作品档案架与技术履历页（`pages/portfolio.html` & `pages/resume.html` 整合视图）**
   - **定位**：承载全部 **9 件作品（01–07 + 候选 A 菌智鉴熟 + 候选 B 智能优化中 OPTIMIZED）** 的结构化索引、双主线（游戏开发 vs AI 应用）筛选视图、技术栈矩阵以及待核实项标注，面向招聘官/合作方提供高信息密度的一站式检索。

### 3.2 全站导航与跳转拓扑图

```
┌───────────────────────────────────────────────────────────────────────────┐
│                        顶栏亚克力药丸导航 (.topbar)                        │
│               [ 首页 (Page 01) ]  <───>  [ 作品 (Page 02) ]               │
└────────────────────────┬──────────────────────────────┬───────────────────┘
                         │                              │
                         ▼                              ▼
        ┌────────────────────────────────┐   ┌──────────────────────────────┐
        │   Page 01 · 首页 (index.html)   │   │  Page 02 · 作品页 (works.html)│
        │  - 首屏 Hero: ZLOONG + 浪潮墙   │   │  - 页首矮浪带 (.band)         │
        │  - 向下提示 (#about)            │   │  - 水位陈列架 (7枚立方体锚点) │
        │  - 关于我: 3枚外链 + 12枚铭牌   │   │  - §01 在跑 (01 Hero + 02~04)│
        │    ├─ fav: 洛天依 (luotianyi/) │   │  - §02 在制 (05 棱镜无图行)   │
        │    └─ daily: Hanako 箱庭 ↗     │   │  - §03 归档 (06 + 07 紧凑行)  │
        └────────────────────────────────┘   └──────────┬─────────┬─────────┘
                                                        │         │
                           点击作品「技术卷宗 / 详情」    │         │ 点击章末「全量档案架 / 履历库」
                      ┌─────────────────────────────────┘         └────────────────────────┐
                      ▼                                                                    ▼
        ┌────────────────────────────────────────┐           ┌────────────────────────────────────────┐
        │ Page 03 · 深度案例页 / 详情抽屉母版     │           │ Page 04 · 全量作品档案架与技术履历页    │
        │ - 标杆 A: 01 风织雨 (游戏机制与编辑器)  │ <───────> │ - 9件全量作品池 (01~07 + 候选 A + B)   │
        │ - 标杆 B: 候选 A 菌智鉴熟 (AI系统架构)  │  双向互通  │ - 类别切换 (全部 / 游戏 / AI应用 / Mod)│
        │ - 软 UI 参数卡 (.rows) + 实机图集      │           │ - 结构化软卡表格 (.rows__r) + 状态灯    │
        └────────────────────────────────────────┘           └────────────────────────────────────────┘
```

---

## 4. 各页面详细设计方案

### 4.1 Page 01 · 首页（`index.html`）

1. **页面名称及定位**：`Page_01_Home` —— 个人主站门面，建立「冷白亚克力 + 118° 机械浮雕 + 个人技术基因」的第一印象。
2. **需要解决的展示问题**：如何在极简克制的信息密度下，用 3 秒钟让访客记住 `ZLOONG` 的名字、「做游戏，也做 AI 应用」的双栖定位，以及可交互的个人技术栈标签。
3. **目标访客及传递印象**：独立游戏玩家、同行开发者、技术招聘方；传递「审美锐利、精于底层实现、兼具理工严谨与二次元/箱庭趣味」的印象。
4. **具体内容模块及排列顺序（自上而下）**：
   - **模块 1 · 页面外框与纸面壳（`.bezel` + `.sheet`）**：包裹整页。
   - **模块 2 · 首屏舞台（`.hero`，高度 `calc(100svh - 40px)` = `860px`）**：
     - **2.1 背景字符浪潮墙（`canvas#wall.wall`）**：以浅灰单色 ASCII 字符（`# * + = : % - .`）构成的流体波浪点阵背景，底部 `140px` 线性渐隐融入 `#F2F5F7` 纸面。
     - **2.2 顶栏药丸导航（`.topbar`）**：右上角对齐，`[首页]`（`.chip--on` 墨色激活态）+ `[作品]`（`.chip` 冷白默认态）。
     - **2.3 主名厚板浮雕（`.stage` > `h1.name`）**：居中放置 `ZLOONG`，字号 `220px`（Desktop）/ `60px`（Mobile），`Arial Black 900`，底层 `.name-deep` 12 层向右下挤出立体阴影 + 左上 `#D8E2E7` 冷白受光棱，面层 `.name-solid` 带 `118deg` 玻璃折射色差白芯扫光带（`#00827F` 青边 + `#EDF2F4` 白芯 + `#8B2C1F` 朱砂边）。
     - **2.4 底部字符漏斗与向下引导（`.leak` + `.hint`）**：中央底部 `150×80px` 字符飘落区 + `26×26px` 下箭头 SVG。
   - **模块 3 · 关于我区域（`section#about.about`，顶距 `96px`）**：
     - **3.1 核心 Slogan（`.tag`）**：居中 `17px` 文字 `做游戏，也做 AI 应用。`
     - **3.2 外部入口三联铭牌键（`.links`）**：居中横向排布 3 枚 `44×44px` 拟物图标铭牌键（间距 `4px`）：
       1. GitHub（`https://github.com/Dragonzhi`）
       2. B 站（`https://space.bilibili.com/304097408`，标题 `B 站 · 智LONZ`）
       3. 邮箱复制键（`dzloong@foxmail.com`，上方展示 `.copy-hint.is-on` 状态小签预览：`已复制 dzloong@foxmail.com`）
     - **3.3 章头（`.sec-head`）**：顶距 `96px`，居中展示 `h2` `关于我`（`52px`，字重 `900`）。
     - **3.4 散贴铭牌案板（`ul.board`）**：宽 `1080px`，内边距 `56px 48px`，圆角 `32px` 软 UI 内凹面板，内部散贴 **12 枚 Shields 风格贴纸（`.sticker` > `.badge`）**，严格还原 HTML 中的键值、配色与倾角：
       1. `status | 计算机在读`（`badge--qing`，`--rot:-3.6deg; --dy:10px`）
       2. `craft | 游戏开发`（`badge--zhu`，`--rot:2.8deg; --dy:-12px`）
       3. `focus | AI 应用`（`badge--steel`，`--rot:-2.2deg; --dy:14px`）
       4. `fav | 洛天依 66CCFF`（`badge--sky`，带 `#0F5E7A` 粗体色号，链接 `luotianyi/`，`--rot:3.4deg; --dy:-8px`）
       5. `engine | Godot 4`（`badge--sand`，`--rot:-3deg; --dy:11px`）
       6. `engine | Unity`（`badge--steel`，`--rot:2.2deg; --dy:-9px`）
       7. `lang | GDScript`（`badge--qing`，`--rot:-2.6deg; --dy:13px`）
       8. `lang | C#`（`badge--sand`，`--rot:3deg; --dy:-11px`）
       9. `lang | Kotlin`（`badge--sky`，`--rot:-3.4deg; --dy:8px`）
       10. `lang | Python`（`badge--steel`，`--rot:2.6deg; --dy:-13px`）
       11. `lang | TS`（`badge--qing`，`--rot:-2deg; --dy:12px`）
       12. `daily | Hanako 箱庭 ↗`（`badge--zhu`，外链 `https://dragonzhi.xyz/hanako/`，`--rot:-3.8deg; --dy:13px`）
   - **模块 4 · 页脚（`footer.foot`）**：左右两端对齐，左 `© 2026 ZLOONG · Dragonzhi`，右 `闽ICP备20260330551号-1`。
5. **响应式设计要求**：
   - Desktop 画板：`1440 × 1760px`；Mobile 画板：`390 × 1480px`（`ZLOONG` 字号缩至 `60px`，`.board` 内边距 `28px 16px`，贴纸旋转角度与位移按 `0.6` 倍缩放，页脚改为垂直堆叠）。

---

### 4.2 Page 02 · 作品总览页（`works.html`）

1. **页面名称及定位**：`Page_02_Works` —— 作品集核心展示页，完整呈现 `WORKS-CONTENT.md` 中的 01–07 号作品及底部候选/档案入口。
2. **需要解决的展示问题**：打破传统千篇一律的等大网格卡片，用「水位陈列架」建立全局空间索引，用「首件通栏 + 奇偶大图 + 极简文字行 + 归档小图」拉开信息层级。
3. **目标访客及传递印象**：希望快速试玩作品、查看源码或了解代表作质量的访客；传递「作品状态透明、代表作突出、叙事节奏张弛有度」的印象。
4. **具体内容模块及排列顺序（自上而下）**：
   - **模块 1 · 页首矮浪带与顶栏（`.band` + `.topbar`）**：
     - 顶部 `160px` 高字符余波带（`.band`），底部 `64px` 渐隐至 `#F2F5F7` 纸面。
     - 顶栏 `.topbar`（宽 `1240px`）：`[首页]`（`.chip` 默认态）+ `[作品]`（`.chip--on` 墨色激活态）。
   - **模块 2 · 全局水位陈列架（`.shelf`）**：
     - 版心宽 `1152px`，台面高 `296px`，7 列等分（每列宽约 `144px`，间距 `24px`），地平线位于 `top: 164px`。
     - **7 枚等轴测/三维受光立方体（`116×116px`）**：
       - 第 1–4 列（`data-s="on"`，青色 `--cube-live-*`，浸水 `12px`）：对应 `01 风织雨`、`02 IterTrip`、`03 免疫联结`、`04 掷弹 Mod`（其中第 1 枚处于 Hover 抬起 `-14px` 演示态）。
       - 第 5 列（`data-s="air"`，冷灰墨色 `--cube-*`，悬空 `22px`）：对应 `05 棱镜 · 碧芙洛斯`。
       - 第 6–7 列（`data-s="sunk"`，沉水灰 `--cube-sunk-*`，水下 `8px`，透明度 `0.8`）：对应 `06 TriHorny4Link`、`07 像素火影 · 秽土柱间`。
     - **底部读出栏（`.shelf__read`）**：展示 `01`（朱砂色） + `风织雨 Weaving Rain`（`17px` 粗体） + `游戏 · 可试玩 · 2026.10.20 · 单人 13 天`。
   - **模块 3 · 第一章：`§01 在跑`（`section.sec-works.sec-works--live`）**：
     - **章头（`.sec-head`）**：居中排布 `.no` `01`（朱砂色 `#8B2C1F`） + `h2` `在跑`（`52px`） + `.meta` `04 WORKS · LIVE`。
     - **01 · 风织雨 Weaving Rain（`.item.item--hero` 整幅通栏）**：
       - 顶部通栏内凹图框 `.figure`（`1152 × 648px`，16:9），载入 `images/projects/weaving-rain-gameplay.png`，左上角内嵌浅底状态角标 `.badge`（`rgba(242,245,247,.88)`，绿点 `可试玩`）。
       - 图下元信息行 `.now__meta`：左侧朱砂编号 `01` + `h3` `风织雨 Weaving Rain`（`32px`） + `.type` `游戏 ｜ 可试玩 · 2026.10.20 · 单人 13 天`。
       - 描述 `.item__desc`（宽 `44em`）：`拨动空气，把雨送到群岛上需要它的地方。含水库教学与九张关卡。`
       - 入口按钮组 `.item__ent`：拟物铭牌键 `[TapTap 试玩 ↗]` + `[源码 ↗]` + `[技术卷宗 →]`（跳转 Page 03 案例详情）。
     - **02 · IterTrip（`.item` 偶数列：左文 `1fr` + 右图 `1.25fr`）**：
       - 左侧 `.item__body`：编号 `02` + `h3` `IterTrip` + 状态行 `.state--live` `已上线 · AI 应用 · M24 · 1.3 万行` + 描述 `把旅行攻略变成能点的地图。从模型到页面一个人走完。` + 铭牌键 `[在线可玩 ↗]`。
       - 右侧 `.item__fig` > `.figure`（`614 × 345px`）：载入 `images/projects/itertrip.png`。
     - **03 · 免疫联结 ImmuneLink（`.item` 奇数列：左图 `1.25fr` + 右文 `1fr`）**：
       - 左侧 `.figure`（`614 × 323px`）：载入 `images/projects/immune-link.png`。
       - 右侧 `.item__body`：编号 `03` + `h3` `免疫联结 ImmuneLink` + 状态行 `.state--live` `已上线 · 游戏 · 2025.12 · 卡赢杯公益赛` + 描述 `主题是「桥」的 2D 塔防。设计、程序、像素美术独自完成，关卡可导入导出。` + 铭牌键 `[在线游玩 ↗]` + `[源码 ↗]` + `[演示视频 ↗]`（整合子页 B 站视频链接）。
     - **04 · 掷弹 Mod · CounterStrike Grenades（`.item` 偶数列：左文 `1fr` + 右图 `1.25fr`）**：
       - 左侧 `.item__body`：编号 `04` + `h3` `掷弹 Mod · CounterStrike Grenades` + 状态行 `.state--live` `已上线 · Mod · 2026.02 · Minecraft Forge` + 描述 `把 CS2 的投掷物机制搬进 Minecraft，含行为逻辑、3D 资产与 TACZ 兼容。` + 铭牌键 `[源码 ↗]`。
       - 右侧 `.figure`（`614 × 345px`）：载入 `images/projects/csg.png`。
   - **模块 4 · 第二章：`§02 在制`（`section.sec-works.sec-works--wip`）**：
     - **章头（`.sec-head`）**：`.no` `02` + `h2` `在制` + `.meta` `01 WORK · IN PROGRESS`。
     - **05 · 棱镜 · 碧芙洛斯（`.item.item--bare` 无图紧凑行）**：
       - 单列布局（`padding: 16px 0`），编号 `05` + `h3` `棱镜 · 碧芙洛斯` + 状态行 `.state--wip` `在制 · 游戏 · Godot 4 · 卡牌` + 描述 `Uno 机制 × 七色光谱相邻出牌。正在打磨成能跑的小游戏。`（右侧附一枚极窄的 7 色低饱和光谱条装饰 `.mono` 标签 `BUILDING...`，不放假图）。
   - **模块 5 · 第三章：`§03 归档`（`section.sec-works.sec-works--arch`）**：
     - **章头（`.sec-head`）**：`.no` `03` + `h2` `归档` + `.meta` `02 WORKS · ARCHIVED`。
     - **06 · TriHorny4Link（`.item` 小图左 `0.9fr` + 右文 `1fr`，`padding: 16px 0`）**：
       - 左侧 `.figure`（`490 × 276px`）：载入 `images/projects/tri.png`。
       - 右侧 `.item__body`：编号 `06` + `h3` `TriHorny4Link` + 状态行 `.state--arch` `已归档 · 游戏 · 2026.03 · Game Jam 练习` + 描述 `塔防玩法练习。动态路径重规划、对象池、事件驱动。` + 铭牌键 `[观看演示 ↗ (待核实)]` + `[GitHub ↗ (待核实仓库)]`。
     - **07 · 像素火影 · 秽土柱间（`.item` 左文 `1fr` + 小图右 `0.9fr`，`padding: 16px 0`）**：
       - 左侧 `.item__body`：编号 `07` + `h3` `像素火影 · 秽土柱间` + 状态行 `.state--arch` `已归档 · 游戏 · Unity 2D · 战斗系统` + 描述 `Unity 2D 角色练习。技能、动画状态机、攻击判定。` + 铭牌键 `[观看演示 ↗ (待核实)]`。
       - 右侧 `.figure`（`490 × 276px`）：启用盘上封面图 `images/projects/秽土.avif`。
   - **模块 6 · 底部档案架导流软卡（`.rows` 扩展入口） + 页脚（`.foot`）**：
     - 在归档章下方放置一块软 UI 凹槽窄卡 `.rows`，提示：`另有「菌智鉴熟（国家级大创 AI 系统）」与「智能优化中 OPTIMIZED（金海豚参赛作）」收录于全量档案架` + 右侧铭牌键 `[查看全量档案架 (09) →]`（跳转 Page 04）。
5. **响应式设计要求**：
   - Desktop 画板：`1440 × 3860px`；Mobile 画板：`390 × 4120px`（移动端 `.shelf` 高度变为 `176px`，7 枚 `72×72px` 立方体改为横向滑动轨道 `.shelf__track`；所有 `.item` 变为单列上图下文堆叠，奇偶交错取消 `order: 0`）。

---

### 4.3 Page 03 · 重点项目深度案例页 / 详情抽屉母版（`case-study`）

1. **页面名称及定位**：`Page_03_CaseStudy` —— 深度技术拆解与设计卷宗页（同时提供「独立全屏页」与「作品页右侧滑出抽屉」两种容器规格，复用同一套内部模块）。
2. **需要解决的展示问题**：`WORKS-CONTENT.md` 中主作品页每件作品仅限 1 句极简文案（25–35 字），无法承载 `01 风织雨` 的「自研关卡编辑器插件、3D 程序化视觉、风停云走物理机制」以及 `候选 A 菌智鉴熟` 的「两阶段深度学习模型（YOLOv11n + DINOv3）、`mAP50 85.05%`、软著 `2026SR0492487`」等核心技术竞争力。
3. **目标访客及传递印象**：深入考察代码架构、算法指标与工程落地能力的技术面试官或发行商；传递「不仅能做出好看的皮囊，更有扎实的工具链与算法工程底座」的印象。
4. **具体内容模块及排列顺序（双标杆并列展示于同一画板上下分区）**：
   - **模块 1 · 顶部返回与切换栏（`.topbar`）**：左侧铭牌键 `[← 返回作品页]`，右侧药丸切换 `[01 · 风织雨 (游戏标杆)]` / `[A · 菌智鉴熟 (AI 标杆)]` + 顶栏全局导航 `[首页]` `[作品]`。
   - **模块 2 · 标杆案例一：`01 · 风织雨 Weaving Rain` 深度技术卷宗**：
     - **2.1 卷宗头与软 UI 参数矩阵（`.sec-head` + `.rows`）**：
       - 标题：`01 · 风织雨 Weaving Rain`；副标：`拨动空气，把雨送到群岛上需要它的地方。`
       - 软 UI 凹槽参数卡（`.rows` > `.rows__r` 四行键值）：
         - `STATUS` → `可试玩 · LIVE (2026.10.20)`
         - `CYCLE & ROLE` → `单人独立开发 · 13 天极限交付`
         - `TECH STACK` → `Godot 4 · GDScript · 3D 程序化视觉 · 自研编辑器插件`
         - `LINKS` → `[TapTap 试玩 ↗]` `[GitHub 源码 ↗]`
     - **2.2 双图对比展示区（主实机图 + 备用图启用）**：
       - 主画框 `.figure`：展示 `images/projects/weaving-rain-gameplay.png`（实机云雨与群岛水库互动）。
       - 副画框 `.figure`：**正式启用盘上孤儿图 `images/projects/weaving-rain.png`（239 KB）** 作为第二视角图，解决 `WORKS-CONTENT.md` 中该图零引用的库存问题。
     - **2.3 三大核心亮点拆解卡（3 列软 UI 卡 `.rows`）**：
       1. `01 / 惯性气象机制`：风把湿空气推上岛屿山坡成云，风停后云团仍保持物理惯性继续飘移降雨，形成含水库教学在内的 9 张递进关卡。
       2. `02 / 自研关卡编辑器插件`：为支撑 13 天内高效搭建与调优 9 张群岛地形关卡，在 Godot 内自研可视化关卡编辑器插件。
       3. `03 / 3D 程序化视觉`：全程序化生成的风场流线、云团体积与岛屿受光水面，与主站水位立方体美学一脉相承。
   - **模块 3 · 标杆案例二：`候选 A · 菌智鉴熟` 深度技术卷宗**：
     - **3.1 卷宗头与软 UI 参数矩阵（`.rows`）**：
       - 标题：`A · 菌智鉴熟`；副标：`拍一张，识别羊肚菌的品种与成熟度，帮农户掐准采摘时机。`
       - 软 UI 凹槽参数卡（`.rows` > `.rows__r` 四行键值）：
         - `PROJECT LEVEL` → `国家级大学生创新创业训练计划落地系统`
         - `COPYRIGHT & TIME` → `软著 2026SR0492487 · 2025.11 – 2026.04`
         - `KEY METRICS` → `mAP50 85.05% · 多任务识别准确率 92.01%`
         - `TECH STACK` → `Flask · YOLOv11n · DINOv3 · OpenCV · SQLAlchemy`
     - **3.2 系统实机画框与架构拆解**：
       - 画框 `.figure`：展示 `images/projects/morel.jpg`（羊肚菌智能检测系统检测中心界面）。
       - 核心说明：通过两阶段深度学习模型（YOLOv11n 目标检测 + DINOv3 特征表征）识别羊肚菌品种与成熟度阶段，标注目标边界框并通过 SQLAlchemy 持久化溯源记录。
   - **模块 4 · 底部前后项目跳转铭牌栏 + 页脚（`.foot`）**。
5. **响应式设计要求**：
   - Desktop 画板：`1440 × 2680px`；Mobile 画板：`390 × 2960px`（3 列亮点卡改为单列纵向堆叠，`.rows__r` 键值行改为上下折行）。

---

### 4.4 Page 04 · 全量作品档案架与技术履历页（`pages/portfolio.html` + `resume` 整合页）

1. **页面名称及定位**：`Page_04_Archive_Shelf` —— 对应 `WORKS-CONTENT.md` 中反复强调的「子页档案架（`pages/portfolio.html` 消费 `data/portfolio.json`）」与「封存履历（`pages/resume.html`）」，收录全部 **9 件作品（01–07 + 候选 A + 候选 B）**。
2. **需要解决的展示问题**：
   - 补齐 `data/portfolio.json` 缺失的 `02 IterTrip` 与 `05 棱镜 · 碧芙洛斯`；
   - 让未进入主作品页前排的 **候选 A（菌智鉴熟）** 与 **候选 B（智能优化中 OPTIMIZED）** 获得完整曝光；
   - 提供按类别（`ALL 09` / `GAME 06` / `AI APP 02` / `MOD 01`）与按状态（`在跑 06` / `在制 01` / `归档 02`）快速检索的高密度归档视图。
3. **目标访客及传递印象**：需要全面盘点候选人项目广度、代码工作量、获奖/软著背书的招聘方与合作伙伴；传递「工程履历扎实、高产且条理分明」的印象。
4. **具体内容模块及排列顺序（自上而下）**：
   - **模块 1 · 顶栏导航与档案架章头（`.topbar` + `.sec-head`）**：
     - 顶栏药丸：`[首页]` `[作品]` `[档案架 (当前激活 .chip--on)]`。
     - 章头：`.no` `ARCHIVE` + `h2` `全量作品档案架` + `.meta` `09 PROJECTS · FULL INDEX`。
   - **模块 2 · 双维筛选药丸栏（Filter Bar）**：
     - 左侧类别药丸组：`[全部 · 09]`（`.chip--on`） `[游戏 · 06]` `[AI 应用 · 02]` `[Mod · 01]`。
     - 右侧状态图例：`.state--live` `在跑 (06)` / `.state--wip` `在制 (01)` / `.state--arch` `归档 (02)`。
   - **模块 3 · 候选重点补强双卡区（Highlight Cards for Candidate A & B）**：
     - 采用双列软 UI 大卡（`.rows` 结合 `.figure`），专门突出主作品页未默认展开的两件重磅履历作品：
       - **左卡 · 候选 A 菌智鉴熟（AI 应用）**：封面 `images/projects/morel.jpg` + 状态灯 `已上线 · 国家级大创 · 软著 2026SR0492487` + 指标徽章 `mAP50 85.05%` / `准确率 92.01%` + 技术栈铭牌 `Flask / YOLOv11n / DINOv3 / OpenCV / SQLAlchemy`。
       - **右卡 · 候选 B 智能优化中 OPTIMIZED（游戏）**：封面 `images/projects/optimized.jpg` + 状态灯 `可试玩 · 好游快爆上线 · 2026.07` + 角色徽章 `金海豚 2026 参赛 · 8人队主程兼队长` + 技术栈铭牌 `Godot 4 / GDScript / Resource任务调度 / 侵蚀值多结局` + 入口 `[好游快爆试玩 ↗]`。
   - **模块 4 · 全量 9 件作品结构化索引软表（`.rows` 档案總表）**：
     - 在一块通栏软 UI 凹槽面板（`.rows`）内，使用 `.rows__r` 行样式列出全部 9 件作品（`01 风织雨`、`02 IterTrip`、`A 菌智鉴熟`、`B 智能优化中`、`03 免疫联结`、`04 掷弹 Mod`、`05 棱镜`、`06 TriHorny4Link`、`07 秽土柱间`），每行包含：`编号` + `状态灯` + `缩略图 (80×45px .figure)` + `作品名与一句话简介` + `核心技术栈 Badge` + `时间/规模` + `右侧外链铭牌键组`。
     - 对 `06`、`07` 存在待核实链接/日期的条目，在设计稿旁附注朱砂色等宽审校角标 `[! 待核实: b23短链复用 / GitHub仓库地址 / 日期字段]`，方便开发者上线前一眼定位。
   - **模块 5 · 页脚（`.foot`）**。
5. **响应式设计要求**：
   - Desktop 画板：`1440 × 2420px`；Mobile 画板：`390 × 2880px`（双列候选大卡转为单列，9 行档案索引表每行转为卡片式三行信息堆叠）。

---

## 5. 多智能体组织架构与职责分工

### 5.1 为什么采用「1 总协调 + 4 页面设计 + 1 质量检查」架构
- 根据第 3 节确定的 **4 个业务页面**，严格遵循「一个页面设计子智能体仅负责一个独立页面的 Desktop + Mobile 画板」原则，共设置 **4 个页面设计子智能体（Agent-P1 至 Agent-P4）**。
- 配合 **1 个总协调与设计系统智能体（Agent-00 Coordinator）** 负责文件初始化、全局变量注册、公共组件母版搭建与画布分区框预创建，以及 **1 个质量检查与视觉走查智能体（Agent-QA Inspector）** 负责截图比对、规范审计与冲突修复，构成 **6 智能体协同流水线**。

### 5.2 智能体角色与边界矩阵

| 智能体代号与名称 | 负责范围（唯一写入区域） | 核心职责 | 允许调用的 `pen.dev` MCP 工具 | 严禁越权红线 |
| :--- | :--- | :--- | :--- | :--- |
| **Agent-00 · 总协调与设计系统架构师 (Coordinator)** | `zloong-portfolio.pen` 全局变量、组件母版区 `Frame_00_DesignSystem`（`x: 0, y: 0`），以及 4 个页面的顶层空画板框架预分配 | 1. 调用 `open_document` 创建 `zloong-portfolio.pen`<br>2. 调用 `set_variables` 写入全套色彩/字号/间距 Token<br>3. 在 `Frame_00_DesignSystem` 构建 12 个可复用公共组件母版<br>4. 按固定坐标预先创建 8 个顶层空画板（P1–P4 的 Desktop 与 Mobile），记录并返回各画板 Node ID | `open_document`, `set_variables`, `get_variables`, `batch_design`, `batch_get`, `snapshot_layout`, `get_screenshot` | 在阶段三并行期不得中途修改正在被子智能体编辑的页面画板内部节点 |
| **Agent-P1 · 首页设计智能体 (Home Designer)** | 仅限 `Page_01_Home_Desktop`（`x: 3200, y: 0`）与 `Page_01_Home_Mobile`（`x: 4800, y: 0`）子树内部 | 还原 `index.html` 首屏字符浪潮墙、顶栏、`ZLOONG` 厚板浮雕主名、关于我 3 枚外链键与 12 枚散贴 Shields 铭牌案板 | `batch_get`, `get_variables`, `batch_design`, `snapshot_layout`, `get_screenshot` | 严禁调用 `open_document` / `set_variables`；严禁修改 `Frame_00` 或 `Page_02~04` |
| **Agent-P2 · 作品总览页设计智能体 (Works Designer)** | 仅限 `Page_02_Works_Desktop`（`x: 6400, y: 0`）与 `Page_02_Works_Mobile`（`x: 8000, y: 0`）子树内部 | 设计页首矮浪带、7 枚立方体水位陈列架（含水线与读出栏）、`§01 在跑`（01 通栏 Hero + 02–04 奇偶交错）、`§02 在制`（05 无图行）、`§03 归档`（06–07 小图行）及底部档案架导流卡 | `batch_get`, `get_variables`, `batch_design`, `snapshot_layout`, `get_screenshot` | 严禁虚构 05 号作品图片；严禁改动其他页面或公共变量 |
| **Agent-P3 · 深度案例页设计智能体 (Case Study Designer)** | 仅限 `Page_03_CaseStudy_Desktop`（`x: 9600, y: 0`）与 `Page_03_CaseStudy_Mobile`（`x: 11200, y: 0`）子树内部 | 设计 `01 风织雨`（启用主图 + 孤儿备用图 + 3 大技术亮点卡 + 软 UI 参数矩阵）与 `候选 A 菌智鉴熟`（大创软著 + `mAP50 85.05%` 指标 + 双阶段模型拆解）双标杆深度卷宗 | `batch_get`, `get_variables`, `batch_design`, `snapshot_layout`, `get_screenshot` | 严禁编造未在底稿出现的性能数据或团队人数 |
| **Agent-P4 · 全量档案架设计智能体 (Archive Designer)** | 仅限 `Page_04_Archive_Desktop`（`x: 12800, y: 0`）与 `Page_04_Archive_Mobile`（`x: 14400, y: 0`）子树内部 | 设计双维筛选栏、候选 A（菌智鉴熟）与候选 B（智能优化中 OPTIMIZED）双列主推大卡、全量 9 件作品结构化索引软表（`.rows__r`）及 `[! 待核实]` 审校标注 | `batch_get`, `get_variables`, `batch_design`, `snapshot_layout`, `get_screenshot` | 严禁遗漏 9 件作品中的任何一件；必须明确标出 06/07 的待核实项 |
| **Agent-QA · 质量检查智能体 (QA Inspector)** | 全画布只读检查（`Frame_00` + `Page_01~04`），仅在发现越界/错字时向 Agent-00 报告修补指令 | 调用 `snapshot_layout` 检查包围盒溢出/遮挡，调用 `get_screenshot` 逐页视觉审查色彩、118° 光向、字号层级与文案准确性，输出验收报告与修补 `batch_design` 脚本 | `batch_get`, `get_variables`, `snapshot_layout`, `get_screenshot`（原则上只读，修补由 Agent-00 统一执行） | 未经总协调智能体调度，不直接并发写入页面节点 |

---

## 6. 同一 `.pen` 文件的协作与冲突规避方案

### 6.1 `pen.dev`（`.pen` 文件与 MCP）底层机制与并发风险分析
根据 [pen.dev 官方文档](https://docs.pencil.dev/) 与 [@pencil.dev/cli 工具规范](https://www.npmjs.com/package/@pencil.dev/cli)，`.pen` 文件是基于 JSON 的结构化矢量设计文档。AI 智能体通过 MCP 工具（核心为 `open_document`、`set_variables`、`batch_get`、`batch_design`、`snapshot_layout`、`get_screenshot`）操作画布：
1. **高风险冲突点 1（文档级覆盖风险）**：若多个子智能体同时调用 `open_document` 新建文档，或者在 CLI 无头模式（`pencil --in a.pen --out a.pen`）下多个进程同时读写同一个磁盘 `.pen` 文件，后完成的进程会直接覆盖先完成进程的 JSON 文件。
2. **高风险冲突点 2（画布坐标重叠与 `find_empty_space_on_canvas` 竞态）**：若多个子智能体同时调用 `find_empty_space_on_canvas` 在根节点插入顶层 Frame，它们在读取画布状态时会计算出相同的「空闲坐标」，导致多个页面叠在同一坐标 `(x, y)` 上。
3. **高风险冲突点 3（全局变量与公共组件写冲突）**：若子智能体各自调用 `set_variables` 或修改公共组件母版，会导致命名不一致、重复创建组件或覆盖彼此的样式。
4. **高风险冲突点 4（节点命名/绑定符号冲突）**：在 `batch_design` 中使用临时绑定名或操纵父节点时，若未限定父容器 Frame ID，可能误改或误删其他页面的节点。

### 6.2 四重物理隔离与防冲突协议（必遵铁律）

#### 铁律一：画布分区坐标预分配与顶层 Frame ID 锁定（由 Agent-00 独占完成）
所有顶层 Frame 必须在 **阶段二** 由总协调智能体 `Agent-00` 一次性创建完毕。各子智能体**禁止在文档根节点（Root）创建任何新 Frame**，只能往自己被分配的顶层 Frame ID 内部追加子节点：

| 分区编号 | 顶层 Frame 名称 | 归属智能体 | 画布 X 坐标 | 画布 Y 坐标 | 宽度 (W) | 初始高度 (H) | 说明 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Zone 0** | `Frame_00_DesignSystem` | `Agent-00`（创建后只读） | `0` | `0` | `2400` | `2200` | 存放色彩/排版图例与 12 个 `reusable: true` 公共组件母版 |
| **Zone 1D** | `Page_01_Home_Desktop` | `Agent-P1` | `3200` | `0` | `1440` | `1760` | 首页桌面端（内含 `20px` 墨色 `.bezel` 与 `1400px` `.sheet`） |
| **Zone 1M** | `Page_01_Home_Mobile` | `Agent-P1` | `4800` | `0` | `390` | `1480` | 首页移动端（内含 `10px` 墨色 `.bezel` 与 `370px` `.sheet`） |
| **Zone 2D** | `Page_02_Works_Desktop` | `Agent-P2` | `6400` | `0` | `1440` | `3860` | 作品总览页桌面端（含水位陈列架 + 01~07 作品） |
| **Zone 2M** | `Page_02_Works_Mobile` | `Agent-P2` | `8000` | `0` | `390` | `4120` | 作品总览页移动端 |
| **Zone 3D** | `Page_03_CaseStudy_Desktop` | `Agent-P3` | `9600` | `0` | `1440` | `2680` | 深度案例页桌面端（01 风织雨 + 候选 A 菌智鉴熟） |
| **Zone 3M** | `Page_03_CaseStudy_Mobile` | `Agent-P3` | `11200` | `0` | `390` | `2960` | 深度案例页移动端 |
| **Zone 4D** | `Page_04_Archive_Desktop` | `Agent-P4` | `12800` | `0` | `1440` | `2420` | 全量作品档案架与技术履历页桌面端（9 件全收录） |
| **Zone 4M** | `Page_04_Archive_Mobile` | `Agent-P4` | `14400` | `0` | `390` | `2880` | 全量作品档案架与技术履历页移动端 |

> **间距安全余量**：每个页面分区之间预留至少 `1100px–1760px` 的横向空白带，即使子智能体在内部展开说明或局部调整高度（Y 轴向下延展），也绝无可能在画布上发生物理重叠。

#### 铁律二：公共设计规范与组件母版「单写多读」机制
1. **变量单写**：仅 `Agent-00` 可在阶段二调用 `set_variables` 注册色彩、字号与间距变量。`Agent-P1` 至 `Agent-P4` 只能通过 `get_variables` 读取或直接引用变量名（如 `$bg`、`--bg`、`#F2F5F7`）。
2. **组件实例化（Copy / Instance Only）**：`Agent-00` 在 `Frame_00_DesignSystem` 中创建以下 12 个公共组件母版并标记 `reusable: true`：
   - `Comp/Shell_Desktop` & `Comp/Shell_Mobile`（外框 `.bezel` + 纸面 `.sheet` + 顶栏 `.topbar` + 页脚 `.foot`）
   - `Comp/Topbar_Chips`（右上角亚克力药丸组）
   - `Comp/SecHead`（居中章头：朱砂编号 `.no` + `52px` 标题 `h2` + `.meta`）
   - `Comp/StateDot`（状态灯：支持 `live` `#00605E` / `wip` `#4C565C` / `arch` `#5C666C`）
   - `Comp/PlateButton_Text`（文字铭牌键 `.link`）
   - `Comp/PlateButton_Icon`（`44×44px` 图标铭牌键 `.icon-link`）
   - `Comp/Figure_Frame`（内凹图片框 `.figure`，带内阴影遮罩与左上角 `.badge` 槽位）
   - `Comp/Cube_Iso`（水位架等轴测立方体，支持 `live` 青 / `wip` 墨灰 / `sunk` 沉灰三态）
   - `Comp/SoftCard_Container`（`32px` 外圆角 + `28px` 内凹槽 `.rows` / `.board` 面板）
   - `Comp/Shield_Badge`（`26px` 高双段贴纸铭牌 `.badge`，支持 `qing/zhu/steel/sky/sand` 五色）
   - `Comp/Archive_Row`（档案架 `.rows__r` 标准键值/项目行）
   - `Comp/Footer`（底部版权与备案号栏 `.foot`）
3. 页面子智能体通过 `batch_design` 的 `C(componentId, targetParentFrameId, ...)`（复制/实例化）将该组件克隆到自己的页面 Frame 下，再对克隆出的实例子节点执行 `U()`（Update 文本、图片路径、状态色），**严禁直接对 `Frame_00_DesignSystem` 中的母版 ID 执行 `U()`、`M()` 或 `D()`**。

#### 铁律三：命名空间隔离（Namespace Prefixing）
每个页面子智能体在调用 `batch_design` 创建新节点时，所有绑定变量名（binding names）和图层 `name` 必须加上专属前缀：
- `Agent-P1`：前缀 `p1_`（例如 `p1_hero`、`p1_name_plate`、`p1_board`）
- `Agent-P2`：前缀 `p2_`（例如 `p2_shelf`、`p2_item_01`、`p2_item_02`）
- `Agent-P3`：前缀 `p3_`（例如 `p3_case_weaving`、`p3_case_morel`）
- `Agent-P4`：前缀 `p4_`（例如 `p4_filter_bar`、`p4_highlight_grid`、`p4_archive_table`）

#### 铁律四：运行时并发适配机制（Live MCP Daemon 模式 vs CLI 文件锁模式）
由于不同宿主环境下 `pen.dev` 的连接方式存在差异，弱模型在调度阶段三（并行设计）时必须遵循以下 **「双模式自适应并发策略」**：
- **模式 A（推荐：连接已打开的 `pen.dev` Desktop / VS Code 插件单一 MCP Server）**：
  - 此时 `.pen` 文档常驻于编辑器内存中，4 个页面子智能体共享同一个活动文档句柄。
  - **并发规则**：4 个子智能体可**同时并行进行布局计算、文案组装与组件查询（`batch_get`）**；在提交 `batch_design` 写操作时，每个子智能体将单页设计拆分为 **2–3 次原子级 `batch_design` 调用**（每次不超 25 个节点操作，且操作的目标父节点严格限定为各自的 `Page_0X_*` Frame ID）。如果宿主 MCP 通道支持并发请求队列，直接并行提交；若宿主对同时到达的 `batch_design` 返回 busy，子智能体内置 `2秒` 退避重试。
- **模式 B（回退：无头 CLI 模式 `@pen.dev/cli` 直接读写磁盘 `.pen` 文件）**：
  - 若环境未运行 GUI 编辑器而是通过 CLI `--in zloong-portfolio.pen --out zloong-portfolio.pen` 执行，**绝对禁止 4 个 CLI 进程同时写同一个磁盘文件**。
  - **并行生成 + 串行合入（Map-Reduce 模式）**：4 个页面子智能体先**完全并行**地读取 `zloong-portfolio.pen` 的 `Frame_00` 组件 ID 与各自的 `Page_0X` 容器 ID，并行生成各自页面的完整 `batch_design` 操作指令块（DSL 脚本）；随后由弱模型（总调度器）按 `P1 → P2 → P3 → P4` 顺序依次向同一个 `zloong-portfolio.pen` 执行这 4 组 `batch_design` 脚本（耗时仅数秒），既实现了高耗时的设计推理 100% 并行，又从根源上杜绝了磁盘文件写覆盖。

---

## 7. 各子智能体的完整执行提示词（Prompts）

以下 6 份提示词已包含完整的上下文、Token 参数、页面模块结构、文案与图片路径、MCP 工具调用规范及验收标准。后续执行模型（弱模型）只需将对应代码块原样复制并分发给各子智能体即可。

---

### 7.1 总协调与设计系统智能体（`Agent-00 Coordinator`）完整执行提示词

```markdown
# 角色定义
你是「ZLOONG 个人作品集设计项目」的总协调与设计系统智能体（Agent-00 Coordinator）。
你的核心职责是：在 pen.dev 中初始化唯一设计文件 `zloong-portfolio.pen`，注册全站统一的 Design Variables（色彩、字体、字号、间距），在 `Frame_00_DesignSystem` 分区构建 12 个可复用公共组件母版，并为后续 4 个页面设计子智能体（Agent-P1 ~ Agent-P4）预先创建好严格隔离的 8 个顶层页面画板（Desktop + Mobile），输出所有母版 ID 与页面容器 ID 映射表。

# 参考材料与全局设计规范（唯一事实源）
你必须先读取项目中的 `index.html`、`tokens-screen.css`、`site.css`、`home.css` 与 `WORKS-CONTENT.md`。核心规范如下：
1. **全局光源**：118° 定向线性光（左上受光、右下背光）。
2. **默认主视觉主题（cool 冷白）**：
   - 纸面背景 `--bg`: `#F2F5F7` | 浮起表面 `--surface`: `#FFFFFF` | 凹槽/水底暗面 `--frame`: `#D6DEE3`
   - 弱线 `--line`: `#CBD6DB` | 强线/水位线 `--line-strong`: `#B9C5CC`
   - 主文字 `--fg`: `#12171A` | 次文字 `--fg-dim`: `#4C565C` | 弱元信息 `--fg-faint`: `#5C666C`
   - 在跑状态色 `--live`: `#00605E` | 编号朱砂色 `--mark`: `#8B2C1F`
   - 青绿原色阶：`#8FF0EA` (qing-1), `#2FD3CB` (qing-2), `#14A9A2` (qing-3), `#00827F` (qing-4), `#00605E` (qing-5), `#004A49` (qing-6)
   - 朱砂原色阶：`#E96A52` (zhu-1), `#E2533C` (zhu-2), `#B93A26` (zhu-3), `#8B2C1F` (zhu-4), `#7A2519` (zhu-5)
   - 外框亚克力渐变：`linear-gradient(118deg, #20262B 0%, #12171A 52%, #0B0F12 100%)`
   - 铭牌键底面：`linear-gradient(118deg, #F7FAFB 0%, #DFE6EB 100%)`
   - 软 UI 外沿：`linear-gradient(118deg, #C3CED5 0%, #FFFFFF 100%)`，内发光 `#284456`
   - 贴纸右半段 5 色：`qing #CFE3E0`, `zhu #E8D3CE`, `steel #D7E0E5`, `sky #D3E8F5`, `sand #E7DDCB`；左半段：`#232B37 → #161D28`
3. **字体与 6 档字号**：
   - `--sans`: `"PingFang SC", "Noto Sans SC", system-ui, sans-serif`
   - `--black`: `"Arial Black", "Helvetica Neue", Arial, sans-serif`
   - `--mono`: `"JetBrains Mono", "Cascadia Code", Consolas, monospace`
   - 字号（Desktop / Mobile）：主名特档 `220px / 60px`；`--t0`: `128px / 60px`；`--t1`: `52px / 34px`（weight 900）；`--t2`: `32px / 24px`（weight 800）；`--t3`: `17px`；`--t4`: `15px`（行高 1.85）；`--t5`: `13px`（等宽 uppercase，字距 `0.08em~0.22em`）。
4. **8px 间距序列**：`s1=4, s2=8, s3=12, s4=16, s5=24, s6=32, s7=48, s8=64, s9=96, s10=128`；Desktop 版心 `wrap=1240px`，左右内边距 `pad=44px`（净宽 `1152px`），外框 `bezel=20px`；Mobile 画板宽 `390px`，`bezel=10px`，`pad=24px`（净宽 `322px`）。

# 具体执行步骤（阶段二初始化任务）
1. **步骤 1：创建/打开文档与注册变量**
   - 调用 `open_document` 打开或创建 `zloong-portfolio.pen`。
   - 调用 `set_variables` 将上述颜色、字体、字号与间距 Token 全部写入文档变量表（同时保存 `cool` 默认值，并在备注或主题集登记 `dark` 与 `warm` 映射）。
2. **步骤 2：创建 `Frame_00_DesignSystem`（坐标 `x: 0, y: 0, width: 2400, height: 2200`）并制作 12 个公共组件母版（`reusable: true`）**
   - `Comp/Shell_Desktop`（`1440px` 宽，`20px` 深墨外框 `.bezel` 圆角 `24px`，内部 `#F2F5F7` 纸面 `.sheet` 圆角 `4px`）与 `Comp/Shell_Mobile`（`390px` 宽，`10px` 外框）。
   - `Comp/Topbar_Chips`：右对齐药丸组，包含激活态 `.chip--on`（`#20262B → #0B0F12` 底，字色 `#EDF2F4`，圆角 `999px`，`padding: 5px 13px 6px`）与默认态 `.chip`（`#FFFFFF → #E7EDF0` 底，字色 `#4C565C`）。
   - `Comp/SecHead`：居中水平排列 `.no`（`13px` `--mono` 朱砂色 `#8B2C1F`，字距 `0.22em`）+ `h2`（`52px` `--sans` 900 `#12171A`）+ `.meta`（`13px` `--mono` `#5C666C`）。无底边框！
   - `Comp/StateDot`：`6×6px` 圆点 + `13px` `--mono` 大写状态文字，提供 `live`（`#00605E`）、`wip`（`#4C565C`）、`arch`（`#5C666C`）三种变体。
   - `Comp/PlateButton_Text`（`.link`）：圆角 `1px`，`padding: 5px 10px 4px`，`118deg` `#F7FAFB → #DFE6EB` 渐变底，左上亮内棱 `rgba(255,255,255,.9)`、右下暗内棱 `rgba(18,23,26,.2)`、硬沿 `0 2px 0 rgba(18,23,26,.1)`、柔影 `0 5px 8px -3px rgba(18,23,26,.18)`，`13px` `--mono` 文字平印。
   - `Comp/PlateButton_Icon`（`.icon-link`）：`44×44px` 正方形拟物铭牌键，内含 `26×26px` 浮雕图标槽位。
   - `Comp/Figure_Frame`（`.figure`）：底色 `#D6DEE3`，内阴影层 `inset 0 0 0 1px rgba(18,23,26,.26), inset 0 2px 8px rgba(18,23,26,.22)`，左上角预留 `top: 20px, left: 20px` 的浅底状态角标槽（`background: rgba(242,245,247,.88)`）。
   - `Comp/Cube_Iso`：等轴测受光三面立方体（`116×116px`），提供 `live`（顶 `#2FD3CB` / 左 `#14A9A2` / 右 `#00605E`）、`wip`（顶 `#E6EDF0` / 左 `#BDC9D0` / 右 `#74818A`）、`sunk`（顶 `#D5DEE3` / 左 `#B9C5CC` / 右 `#97A3AB`）三种母版，底部带椭圆接触影。
   - `Comp/SoftCard_Container`（`.rows` / `.board`）：外层圆角 `32px`（`118deg` `#C3CED5 → #FFFFFF`），内缩 `4px` 内层圆角 `28px`（底色 `#F2F5F7`，带内凹阴影）。
   - `Comp/Shield_Badge`（`.badge`）：高 `26px`，圆角 `2px`，左段 Key（`#232B37 → #161D28`，`#C3CED9` `11px` `--mono`），右段 Value（`12px` `--sans` 600 `#12171A`）。
   - `Comp/Archive_Row`（`.rows__r`）：左右两端对齐的档案索引行组件。
   - `Comp/Footer`（`.foot`）：宽 `1152px`，左 `© 2026 ZLOONG · Dragonzhi`，右 `闽ICP备20260330551号-1`，`13px` `--mono` `#5C666C`。
3. **步骤 3：预先创建 8 个顶层空页面画板（含 `.bezel` 外框与 `.sheet` 纸面底座）**
   使用 `batch_design` 在画布以下精确坐标创建顶层 Frame，并记录其生成的 Node ID：
   - `Page_01_Home_Desktop`: `x: 3200, y: 0, width: 1440, height: 1760`
   - `Page_01_Home_Mobile`: `x: 4800, y: 0, width: 390, height: 1480`
   - `Page_02_Works_Desktop`: `x: 6400, y: 0, width: 1440, height: 3860`
   - `Page_02_Works_Mobile`: `x: 8000, y: 0, width: 390, height: 4120`
   - `Page_03_CaseStudy_Desktop`: `x: 9600, y: 0, width: 1440, height: 2680`
   - `Page_03_CaseStudy_Mobile`: `x: 11200, y: 0, width: 390, height: 2960`
   - `Page_04_Archive_Desktop`: `x: 12800, y: 0, width: 1440, height: 2420`
   - `Page_04_Archive_Mobile`: `x: 14400, y: 0, width: 390, height: 2880`

# 交付物与验收标准
1. 完成阶段二初始化后，调用 `snapshot_layout` 验证 `Frame_00` 及 8 个页面顶层 Frame 坐标无重叠。
2. 输出一份结构化的 **《Node ID 注册表》**（包含 12 个公共组件母版的 Node ID 和 8 个页面顶层 Frame 的 Node ID），供弱模型注入或传递给 Agent-P1 ~ Agent-P4。
3. 在阶段四（并行设计完成后），负责根据 Agent-QA 的检查报告执行跨页面导航链接校验与微调收口。
```

---

### 7.2 首页设计智能体（`Agent-P1 Home Designer`）完整执行提示词

```markdown
# 角色定义
你是「ZLOONG 个人作品集设计项目」的首页设计智能体（Agent-P1 Home Designer）。
你唯一负责的页面是：**Page 01 · 首页（`index.html`）**，对应 `.pen` 文件中的两个顶层画板：
- `Page_01_Home_Desktop`（坐标 `x: 3200, y: 0`，尺寸 `1440 × 1760`）
- `Page_01_Home_Mobile`（坐标 `x: 4800, y: 0`，尺寸 `390 × 1480`）

# 需要读取的参考材料
请先读取项目文件 `index.html`、`tokens-screen.css`、`site.css`、`home.css`，并调用 `batch_get` 读取 `.pen` 文件中 `Frame_00_DesignSystem` 的公共组件 ID 以及你负责的 `Page_01_Home_Desktop` 和 `Page_01_Home_Mobile` 容器 ID。

# 页面完整内容结构与视觉设计要求

## 一、Desktop 画板（`Page_01_Home_Desktop`，1440 × 1760）
外围已有 `20px` 墨色亚克力外框 `.bezel`（圆角 `24px`）与内部 `#F2F5F7` 冷白纸面 `.sheet`（宽 `1400px`，圆角 `4px`）。在 `.sheet` 内自上而下构建以下 3 个区块：

1. **首屏舞台 `p1_hero`（`width: 1400, height: 860`）**：
   - **背景字符浪潮墙 `p1_wall`**：在 `p1_hero` 底层铺设 ASCII 字符点阵波浪装饰层（使用 `# * + = : % - .` 等宽字符矩阵，字色 `rgba(18,23,26,0.10)` 至 `rgba(18,23,26,0.28)` 呈现正弦波起伏），底部覆盖 `140px` 高线性渐变（`rgba(242,245,247,0) → #F2F5F7`）使字符墙柔和融进纸面。
   - **顶栏导航 `p1_topbar`（宽 `1240px` 居中，左右内边距 `44px`，顶距 `12px`）**：
     - 右侧水平排列 2 枚药丸（间距 `6px`）：
       - `首页`：激活态 `.chip--on`（背景 `118deg #20262B → #0B0F12`，字色 `#EDF2F4`，`13px` `--mono`）
       - `作品`：默认态 `.chip`（背景 `118deg #FFFFFF → #E7EDF0`，字色 `#4C565C`，`13px` `--mono`）
   - **中央主名浮雕厚板 `p1_stage` > `p1_name_plate`**：
     - 居中放置特大字号文本 `ZLOONG`（字体 `Arial Black`，字重 `900`，字号 `220px`，字距 `-0.045em`，行高 `0.9`）。
     - **立体浮雕实现**：底层 `p1_name_deep` 使用 `#333C42` 至 `#949EA4` 的右下向挤出厚板阴影组 + 左上 `-1px -1px 0 #D8E2E7` 受光亮棱；顶层 `p1_name_solid` 使用 `118deg` 渐变填充（`#20262B` 暗墨底，中间夹一道 `#00827F` 青色折光边 + `#EDF2F4` 银白反光芯 + `#8B2C1F` 朱砂折光边）。
   - **底部漏字与向下箭头 `p1_leak` + `p1_hint`**：
     - 底部中央上方 `46px` 处散落 8 枚 `10px` `--mono` 符号（`# * + = : % - .`，字色 `rgba(18,23,26,0.42)`），最底部居中放置 `26×26px` 下箭头 SVG（`#4C565C`）。

2. **关于我区域 `p1_about`（顶距 `96px`，底距 `32px`，版心 `1240px` 居中）**：
   - **Tagline `p1_tag`**：居中单行文本 `做游戏，也做 AI 应用。`（`17px` `--sans`，字色 `#4C565C`，行高 `1.95`）。
   - **外部入口三联图标键 `p1_links`（顶距 `24px`，居中水平排列，间距 `4px`）**：
     - 实例化 3 枚 `Comp/PlateButton_Icon`（`44×44px`，圆角 `1px`，`118deg #F7FAFB → #DFE6EB` 拟物斜面）：
       1. GitHub 图标键（对应 `https://github.com/Dragonzhi`）
       2. Bilibili 图标键（对应 `https://space.bilibili.com/304097408`）
       3. 邮箱复制图标键（对应 `dzloong@foxmail.com`），并在该键正上方 `10px` 处绘制一枚已触发状态的复制回执小签 `.copy-hint`（`border: 1px solid #B9C5CC`，背景 `#F2F5F7`，`13px` `--mono` `#12171A`，文案 `COPIED · dzloong@foxmail.com`）。
   - **章头 `p1_sec_head`（顶距 `96px`）**：居中放置 `h2` `关于我`（`52px` `--sans` 900 `#12171A`）。
   - **散贴铭牌案板 `p1_board`（顶距 `64px`，宽 `1080px` 居中，内边距 `56px 48px`）**：
     - 实例化 `Comp/SoftCard_Container`（外圆角 `32px`，内凹槽圆角 `28px`）。
     - 在案板内按 Flex Wrap 居中排布（间距 `30px 18px`）**12 枚 Shields 风格贴纸铭牌**（严格按以下文案、配色和旋转位移设置）：
       1. `status` | `计算机在读`（右底 `#CFE3E0`，旋转 `-3.6deg`，Y 偏移 `+10px`）
       2. `craft` | `游戏开发`（右底 `#E8D3CE`，旋转 `+2.8deg`，Y 偏移 `-12px`）
       3. `focus` | `AI 应用`（右底 `#D7E0E5`，旋转 `-2.2deg`，Y 偏移 `+14px`）
       4. `fav` | `洛天依 66CCFF`（右底 `#D3E8F5`，其中 `66CCFF` 为 `#0F5E7A` 粗体，旋转 `+3.4deg`，Y 偏移 `-8px`）
       5. `engine` | `Godot 4`（右底 `#E7DDCB`，旋转 `-3.0deg`，Y 偏移 `+11px`）
       6. `engine` | `Unity`（右底 `#D7E0E5`，旋转 `+2.2deg`，Y 偏移 `-9px`）
       7. `lang` | `GDScript`（右底 `#CFE3E0`，旋转 `-2.6deg`，Y 偏移 `+13px`）
       8. `lang` | `C#`（右底 `#E7DDCB`，旋转 `+3.0deg`，Y 偏移 `-11px`）
       9. `lang` | `Kotlin`（右底 `#D3E8F5`，旋转 `-3.4deg`，Y 偏移 `+8px`）
       10. `lang` | `Python`（右底 `#D7E0E5`，旋转 `+2.6deg`，Y 偏移 `-13px`）
       11. `lang` | `TS`（右底 `#CFE3E0`，旋转 `-2.0deg`，Y 偏移 `+12px`）
       12. `daily` | `Hanako 箱庭 ↗`（右底 `#E8D3CE`，旋转 `-3.8deg`，Y 偏移 `+13px`）

3. **页脚 `p1_foot`（宽 `1240px` 居中，左右内边距 `44px`，底距 `48px`）**：
   - 左右两端对齐：左 `© 2026 ZLOONG · Dragonzhi`，右 `闽ICP备20260330551号-1`（`13px` `--mono` `#5C666C`）。

## 二、Mobile 画板（`Page_01_Home_Mobile`，390 × 1480）
- 外框 `10px`，纸面净宽 `370px`，左右内边距 `24px`。
- `ZLOONG` 字号缩至 `60px`（确保 `322px` 版心内完整显示不切字）；章头 `关于我` 字号 `34px`。
- `p1_board` 圆角改为 `24px`（内层 `20px`），内边距 `28px 16px`，间距 `14px 10px`，12 枚贴纸的旋转角度与 Y 偏移乘以 `0.6`。
- 页脚 `p1_foot` 改为上下两行垂直左对齐堆叠。

# 操作边界与协作约束（严禁违反）
1. 你创建的每一个节点名称和绑定变量必须以 `p1_` 开头。
2. 你的所有 `batch_design` 操作必须以 `Page_01_Home_Desktop` 或 `Page_01_Home_Mobile`（及其内部子节点）作为 parent，**严禁在 root 层级创建 Frame，严禁调用 `open_document` 或 `set_variables`，严禁修改 `Frame_00_DesignSystem` 及 `Page_02~04`**。
3. 你可以自主发挥 `p1_wall` ASCII 字符浪潮矩阵的疏密排布细节，但不得改变整体冷白配色与 12 枚贴纸的任何文字。

# 交付与自检标准
完成后必须调用 `snapshot_layout` 和 `get_screenshot` 检查 `Page_01_Home_Desktop` 与 `Page_01_Home_Mobile`：确认 `ZLOONG` 未超出画框、12 枚铭牌完整无遮挡、对比度清晰，随后输出完成报告。
```

---

### 7.3 作品总览页设计智能体（`Agent-P2 Works Designer`）完整执行提示词

```markdown
# 角色定义
你是「ZLOONG 个人作品集设计项目」的作品总览页设计智能体（Agent-P2 Works Designer）。
你唯一负责的页面是：**Page 02 · 作品总览页（`works.html`）**，对应 `.pen` 文件中的两个顶层画板：
- `Page_02_Works_Desktop`（坐标 `x: 6400, y: 0`，尺寸 `1440 × 3860`）
- `Page_02_Works_Mobile`（坐标 `x: 8000, y: 0`，尺寸 `390 × 4120`）

# 需要读取的参考材料
请先完整阅读 `WORKS-CONTENT.md`、`site.css`、`tokens-screen.css`，并调用 `batch_get` 获取 `Frame_00_DesignSystem` 中的公共组件 ID 以及 `Page_02_Works_Desktop` 和 `Page_02_Works_Mobile` 容器 ID。
**铁律**：所有作品编号、名称、状态行、图片路径、描述文案、外链按钮必须 100% 忠实于 `WORKS-CONTENT.md`，严禁虚构！

# 页面完整内容结构与视觉设计要求

## 一、Desktop 画板（`Page_02_Works_Desktop`，1440 × 3860）
外围为 `20px` 墨色亚克力外框 `.bezel` 与 `#F2F5F7` 冷白纸面 `.sheet`（净宽 `1400px`）。内容版心 `.wrap` 宽 `1240px` 居中，左右内边距 `44px`（内容净宽 `1152px`）。自上而下依次构建以下 6 个模块：

1. **模块 1 · 页首矮浪带与顶栏（`p2_band` + `p2_topbar`）**：
   - `p2_band`：高 `160px`，铺设淡化版 ASCII 字符浪潮余波，底部 `64px` 线性渐隐至 `#F2F5F7`。
   - `p2_topbar`：位于 `p2_band` 顶部版心内，右对齐药丸组：`[首页]`（默认态 `.chip`）+ `[作品]`（激活态 `.chip--on` 墨色片）。

2. **模块 2 · 全局水位陈列架（`p2_shelf`，顶距 `32px`，宽 `1152px`）**：
   - **台面 `p2_shelf_deck`（高 `296px`，7 列等宽网格，列间距 `24px`）**：
     - **水位地平线 `p2_shelf_rule`**：位于距台面顶部 `164px` 处，横贯全宽的 `1px` 实线（`#B9C5CC`）。
     - **水下暗面 `p2_shelf_water`**：从 `top: 164px` 至底部 `296px`（高 `132px`），填充 `linear-gradient(180deg, #D6DEE3 0%, rgba(214,222,227,0) 92%)` 并带池壁上下内阴影。
     - **7 枚等轴测立方体（每枚 `116×116px`，实例化 `Comp/Cube_Iso`）**：
       - **第 1~4 列（在跑 `data-s="on"`，青色立方体：顶 `#2FD3CB` / 左 `#14A9A2` / 右 `#00605E`）**：底部浸入水线以下 `12px`（即 `top: 60px`）。其中第 1 枚（对应 `01 风织雨`）向上抬起 `14px`（`top: 46px`）作为当前选中/悬停激活态演示。
       - **第 5 列（在制 `data-s="air"`，冷灰墨色立方体：顶 `#E6EDF0` / 左 `#BDC9D0` / 右 `#74818A`）**：悬空浮于水线以上 `22px`（即 `top: 26px`），对应 `05 棱镜 · 碧芙洛斯`。
       - **第 6~7 列（归档 `data-s="sunk"`，沉水灰立方体：顶 `#D5DEE3` / 左 `#B9C5CC` / 右 `#97A3AB`）**：沉在水线以下 `8px`（即 `top: 172px`），不透明度 `0.8`，对应 `06 TriHorny4Link` 与 `07 秽土柱间`。
   - **读出栏 `p2_shelf_read`（顶距 `16px`）**：
     - 单行左对齐：`01`（`13px` `--mono` 朱砂色 `#8B2C1F`） + `风织雨 Weaving Rain`（`17px` `--sans` 600 `#12171A`） + `游戏 · 可试玩 · 2026.10.20 · 单人 13 天`（`13px` `--mono` `#5C666C`）。

3. **模块 3 · 第一章：`§01 在跑`（`p2_sec_live`，顶距 `48px`）**：
   - **章头**：居中排布 `.no` `01`（`#8B2C1F`） + `h2` `在跑`（`52px` 900） + `.meta` `04 WORKS · LIVE`。
   - **项目 01 · 风织雨 Weaving Rain（`p2_item_01`，`.item--hero` 整幅通栏，上下内边距 `48px`）**：
     - 通栏图框 `.figure`（`1152 × 648px`）：填充 `images/projects/weaving-rain-gameplay.png`，带内凹阴影；左上角（`20px, 20px`）放置浅底状态角标（`rgba(242,245,247,0.88)`，含 `#00605E` 圆点 + `LIVE · 可试玩`）。
     - 图下元信息行 `.now__meta`（顶距 `24px`）：朱砂色 `01` + `h3` `风织雨 Weaving Rain`（`32px` 800） + `.type` `游戏` + `.state--live` `可试玩 · 2026.10.20 · 单人 13 天`。
     - 描述 `.item__desc`（顶距 `12px`，最大宽 `660px`）：`拨动空气，把雨送到群岛上需要它的地方。含水库教学与九张关卡。`
     - 入口铭牌键组 `.item__ent`（顶距 `16px`，间距 `16px`）：实例化 `Comp/PlateButton_Text`：`[TapTap 试玩 ↗]`、`[源码 ↗]`、`[技术卷宗 →]`（指向 Page 03）。
   - **项目 02 · IterTrip（`p2_item_02`，偶数列：左文 `490px` + 右图 `614px`，间距 `48px`，上下内边距 `48px`）**：
     - 左侧 `.item__body`：朱砂编号 `02 · AI 应用` → `h3` `IterTrip`（`32px`） → 状态行 `.state--live` `已上线 · M24 · 1.3 万行` → 描述 `把旅行攻略变成能点的地图。从模型到页面一个人走完。` → 铭牌键 `[在线可玩 ↗]`。
     - 右侧 `.figure`（`614 × 345px`）：填充 `images/projects/itertrip.png`。
   - **项目 03 · 免疫联结 ImmuneLink（`p2_item_03`，奇数列：左图 `614px` + 右文 `490px`，间距 `48px`，上下内边距 `48px`）**：
     - 左侧 `.figure`（`614 × 323px`）：填充 `images/projects/immune-link.png`。
     - 右侧 `.item__body`：朱砂编号 `03 · 游戏` → `h3` `免疫联结 ImmuneLink` → 状态行 `.state--live` `已上线 · 2025.12 · 卡赢杯公益赛` → 描述 `主题是「桥」的 2D 塔防。设计、程序、像素美术独自完成，关卡可导入导出。` → 铭牌键 `[在线游玩 ↗]`、`[源码 ↗]`、`[演示视频 ↗]`。
   - **项目 04 · 掷弹 Mod · CounterStrike Grenades（`p2_item_04`，偶数列：左文 `490px` + 右图 `614px`，间距 `48px`，上下内边距 `48px`）**：
     - 左侧 `.item__body`：朱砂编号 `04 · Mod` → `h3` `掷弹 Mod · CounterStrike Grenades` → 状态行 `.state--live` `已上线 · 2026.02 · Minecraft Forge` → 描述 `把 CS2 的投掷物机制搬进 Minecraft，含行为逻辑、3D 资产与 TACZ 兼容。` → 铭牌键 `[源码 ↗]`。
     - 右侧 `.figure`（`614 × 345px`）：填充 `images/projects/csg.png`。

4. **模块 4 · 第二章：`§02 在制`（`p2_sec_wip`，顶距 `96px`）**：
   - **章头**：`.no` `02` + `h2` `在制` + `.meta` `01 WORK · IN PROGRESS`。
   - **项目 05 · 棱镜 · 碧芙洛斯（`p2_item_05`，`.item--bare` 无图单列紧凑行，上下内边距 `16px`）**：
     - **严禁生成假截图！** 采用纯排版紧凑行：朱砂编号 `05 · 游戏` → `h3` `棱镜 · 碧芙洛斯`（`32px`） → 状态行 `.state--wip` `在制 · Godot 4 · 卡牌` → 描述 `Uno 机制 × 七色光谱相邻出牌。正在打磨成能跑的小游戏。` → 底部附一枚哑光不可点击标签 `WIP · 暂无公开入口`。

5. **模块 5 · 第三章：`§03 归档`（`p2_sec_arch`，顶距 `96px`）**：
   - **章头**：`.no` `03` + `h2` `归档` + `.meta` `02 WORKS · ARCHIVED`。
   - **项目 06 · TriHorny4Link（`p2_item_06`，小图比例 `0.9fr : 1fr`，即左图 `518px` + 右文 `586px`，间距 `48px`，上下内边距 `24px`）**：
     - 左侧 `.figure`（`518 × 291px`）：填充 `images/projects/tri.png`。
     - 右侧 `.item__body`：朱砂编号 `06 · 游戏` → `h3` `TriHorny4Link` → 状态行 `.state--arch` `已归档 · 2026.03 · Game Jam 练习` → 描述 `塔防玩法练习。动态路径重规划、对象池、事件驱动。` → 铭牌键 `[观看演示 ↗]`、`[GitHub ↗]`（旁附 `11px` 朱砂色审校标记 `[! 待核实短链与仓库地址]`）。
   - **项目 07 · 像素火影 · 秽土柱间（`p2_item_07`，左文 `586px` + 右小图 `518px`，上下内边距 `24px`）**：
     - 左侧 `.item__body`：朱砂编号 `07 · 游戏` → `h3` `像素火影 · 秽土柱间` → 状态行 `.state--arch` `已归档 · Unity 2D · 战斗系统` → 描述 `Unity 2D 角色练习。技能、动画状态机、攻击判定。` → 铭牌键 `[观看演示 ↗]`（旁附审校标记 `[! 待补充日期 & 核实短链]`）。
     - 右侧 `.figure`（`518 × 291px`）：填充 `images/projects/秽土.avif`。

6. **模块 6 · 全量档案架导流软卡（`p2_archive_cta`，顶距 `64px`） + 页脚（`p2_foot`）**：
   - 实例化 `Comp/SoftCard_Container`（宽 `1152px`，高 `96px`），左侧文字：`FULL ARCHIVE · 另有「菌智鉴熟（国家级大创 AI 系统）」与「智能优化中 OPTIMIZED（金海豚参赛作）」收录于全量档案架`，右侧放置铭牌键 `[进入全量作品档案架 (09) →]`（指向 Page 04）。
   - 底部放置 `Comp/Footer`。

## 二、Mobile 画板（`Page_02_Works_Mobile`，390 × 4120）
- 版心净宽 `322px`（外框 `10px` + 左右 `24px` 内边距）。
- 水位陈列架 `p2_shelf` 高度改为 `176px`，地平线 `top: 96px`，7 枚立方体缩至 `72×72px` 横向滑动排列。
- 所有 `.item` 取消左右分栏与奇偶颠倒，统一改为「上图（宽 `322px`）+ 下文」垂直堆叠。

# 操作边界与协作约束
1. 所有新建节点与绑定名必须以 `p2_` 开头，且严格位于 `Page_02_Works_Desktop` 与 `Page_02_Works_Mobile` 内。
2. 严禁修改 `Frame_00` 或其他页面，严禁调用 `open_document` / `set_variables`。

# 交付与自检标准
完成后调用 `snapshot_layout` 与 `get_screenshot` 验证：确认水位线横贯 7 枚立方体且高度层次分明（4 枚浸水、1 枚悬空、2 枚沉底），01–07 作品顺序与奇偶交错完全符合 `site.css` 规范。
```

---

### 7.4 重点项目深度案例页智能体（`Agent-P3 Case Study Designer`）完整执行提示词

```markdown
# 角色定义
你是「ZLOONG 个人作品集设计项目」的重点项目深度案例页设计智能体（Agent-P3 Case Study Designer）。
你唯一负责的页面是：**Page 03 · 重点项目深度案例页 / 详情抽屉母版**，对应 `.pen` 文件中的两个顶层画板：
- `Page_03_CaseStudy_Desktop`（坐标 `x: 9600, y: 0`，尺寸 `1440 × 2680`）
- `Page_03_CaseStudy_Mobile`（坐标 `x: 11200, y: 0`，尺寸 `390 × 2960`）

# 需要读取的参考材料
请阅读 `WORKS-CONTENT.md`、`site.css`、`tokens-screen.css`，并调用 `batch_get` 获取 `Frame_00_DesignSystem` 的公共组件 ID 以及 `Page_03_CaseStudy_Desktop` 和 `Page_03_CaseStudy_Mobile` 容器 ID。

# 页面设计目标与内容结构
主作品页（`works.html`）每件作品仅展示一句话，而 `WORKS-CONTENT.md` 的「子页备注」和「封存履历候选区」包含极具说服力的技术细节。本页面采用 `site.css` 原生的 `.rows`（软 UI 凹槽卡）、`.rows__r`（机器参数行）与 `.figure`（内凹图框），为「游戏主线标杆（`01 · 风织雨`）」与「AI 应用主线标杆（`候选 A · 菌智鉴熟`）」打造深度技术卷宗。

## 一、Desktop 画板（`Page_03_CaseStudy_Desktop`，1440 × 2680）
版心宽 `1240px` 居中，左右内边距 `44px`（净宽 `1152px`）。自上而下构建以下 4 个模块：

1. **模块 1 · 顶部导航与案例切换栏 `p3_topbar`（高 `72px`）**：
   - 左侧放置拟物铭牌键 `[← 返回作品总览]`（指向 Page 02）。
   - 中间放置案例锚点药丸：`[CASE 01 · 风织雨 Weaving Rain]`（`.chip--on`） + `[CASE A · 菌智鉴熟 Morel AI]`（`.chip`）。
   - 右侧保持全站统一顶栏药丸：`[首页]` `[作品]`。

2. **模块 2 · 标杆案例一：`01 · 风织雨 Weaving Rain` 深度技术卷宗 `p3_case_weaving`（顶距 `32px`）**：
   - **章头 `p3_head_01`**：`.no` `CASE 01 · GAME` + `h2` `风织雨 Weaving Rain`（`52px` 900） + `.meta` `GODOT 4 · 13 DAYS SOLO`。
   - **上层双栏布局（左主视觉图组 `660px` + 右软 UI 技术参数矩阵 `444px`，间距 `48px`，顶距 `32px`）**：
     - **左栏双图展示**：
       - 主画框 `.figure`（`660 × 371px`）：载入 `images/projects/weaving-rain-gameplay.png`（实机画面：风把湿空气推上岛屿山坡成云，云雨落在农田与水库上）。
       - 副画框 `.figure`（顶距 `16px`，`660 × 220px`）：**启用盘上备用孤儿图 `images/projects/weaving-rain.png`（239 KB）**，图下附 `--mono` `13px` 图注 `FIG 1.2 · 备用视觉归档与程序化群岛气象预览`。
     - **右栏软 UI 凹槽参数卡（实例化 `Comp/SoftCard_Container`，宽 `444px`，内边距 `30px 32px`）**：
       - 内部使用 5 行 `.rows__r`（`13px` `--mono` 两端对齐）：
         1. `STATUS` | `可试玩 · LIVE`（`#00605E`）
         2. `RELEASE DATE` | `2026.10.20`
         3. `DEV SCALE` | `单人独立开发 · 13 天`
         4. `CONTENT` | `水库教学 + 9 张核心关卡`
         5. `ENTRANCE` | 铭牌键 `[TapTap 试玩 ↗]` `[GitHub 源码 ↗]`
       - 参数卡下方紧接核心叙事段落（`15px` `--sans` `#4C565C`，行高 `1.85`）：`拨动空气，把雨送到群岛上需要它的地方。含水库教学与九张关卡。`
   - **下层三大技术亮点软卡阵列（顶距 `32px`，3 列等宽 `368px`，间距 `24px`）**：
     - 严格依据 `WORKS-CONTENT.md` 备注「风停后云仍会走、自研关卡编辑器插件、3D 程序化视觉」构建 3 枚软 UI 凹槽卡：
       - **卡 1 `01 / 惯性云雨物理机制`**：风力拨动湿空气沿岛屿山坡抬升成云；风停后云团仍保持物理惯性继续行进并降雨，构成富有策略纵深的水库蓄水与农田灌溉解谜体验。
       - **卡 2 `02 / 自研关卡编辑器插件`**：在 13 天单人极限开发周期内，构建自定义关卡编辑器插件，高效完成水库教学与 9 张群岛关卡的地形、风场与目标配置。
       - **卡 3 `03 / 3D 程序化视觉表现`**：采用 3D 程序化生成技术表现气流轨迹、云层聚散与群岛水面光影，兼顾轻量体积与高辨识度的工业箱庭美学。

3. **模块 3 · 标杆案例二：`候选 A · 菌智鉴熟` 深度技术卷宗 `p3_case_morel`（顶距 `96px`）**：
   - **章头 `p3_head_morel`**：`.no` `CASE A · AI APPLICATION` + `h2` `菌智鉴熟`（`52px` 900） + `.meta` `2025.11 – 2026.04 · 国家级大创`。
   - **双栏深度解析布局（左软 UI 架构与指标卡 `516px` + 右系统界面画框 `588px`，间距 `48px`，顶距 `32px`）**：
     - **左栏软 UI 凹槽参数与架构卡（`.rows`，宽 `516px`）**：
       - 顶部两枚高亮核心指标大数字展示（使用 `--t2` `32px` 800 `#00605E`）：
         - 指标 1：`85.05%`（下方 `--mono` `13px` 说明 `mAP50 目标检测精度`）
         - 指标 2：`92.01%`（下方 `--mono` `13px` 说明 `多任务识别准确率`）
       - 中部 4 行 `.rows__r`：
         1. `HONOR` | `国家级大创落地系统`
         2. `SOFTWARE COPYRIGHT` | `软著 2026SR0492487`
         3. `MODEL PIPELINE` | `YOLOv11n + DINOv3 两阶段深度学习`
         4. `FULL STACK` | `Flask · OpenCV · SQLAlchemy`
       - 底部完整履历描述（`15px` `--sans` `#4C565C`）：`通过两阶段深度学习模型识别羊肚菌品种与成熟度阶段，标注目标边界框并持久化溯源记录，辅助种植农户精确把握采摘时机。`
     - **右栏系统界面画框 `.figure`（`588 × 368px`）**：
       - 载入 `images/projects/morel.jpg`（alt：菌智鉴熟羊肚菌智能检测系统检测中心界面），左上角贴浅底状态角标 `软著 2026SR0492487 · 已落地`。
       - 图下附 5 枚 Shields 风格技术贴纸（实例化 `Comp/Shield_Badge`）：`backend | Flask`、`detect | YOLOv11n`、`vision | DINOv3`、`image | OpenCV`、`orm | SQLAlchemy`。

4. **模块 4 · 底部跨页巡航栏与页脚 `p3_foot`（顶距 `80px`）**：
   - 左右两端铭牌键：左 `[← 返回作品总览 (works.html)]`，右 `[查看全量 09 件作品档案架 →]`，下方接 `Comp/Footer`。

## 二、Mobile 画板（`Page_03_CaseStudy_Mobile`，390 × 2960）
- 版心净宽 `322px`；所有双栏与三列卡片全部转为单列垂直堆叠，图片宽 `322px` 保持原生宽高比。

# 操作边界与协作约束
1. 所有新建节点与绑定名必须以 `p3_` 开头，仅允许操作 `Page_03_CaseStudy_Desktop` 与 `Page_03_CaseStudy_Mobile`。
2. 严禁虚构任何未在 `WORKS-CONTENT.md` 中出现的算法名称或指标数据。

# 交付与自检标准
调用 `snapshot_layout` 和 `get_screenshot` 检查双案例排版平衡度、`.rows__r` 左右对齐精度及文字对比度，确认无误后输出完成报告。
```

---

### 7.5 全量作品档案架与技术履历页智能体（`Agent-P4 Archive Designer`）完整执行提示词

```markdown
# 角色定义
你是「ZLOONG 个人作品集设计项目」的全量作品档案架与技术履历页设计智能体（Agent-P4 Archive Designer）。
你唯一负责的页面是：**Page 04 · 全量作品档案架与技术履历页（`pages/portfolio.html` & `resume` 整合视图）**，对应 `.pen` 文件中的两个顶层画板：
- `Page_04_Archive_Desktop`（坐标 `x: 12800, y: 0`，尺寸 `1440 × 2420`）
- `Page_04_Archive_Mobile`（坐标 `x: 14400, y: 0`，尺寸 `390 × 2880`）

# 需要读取的参考材料
请完整阅读 `WORKS-CONTENT.md`（特别是第四节「候选 A/B」与第五节「库存与问题清单」）、`site.css`、`tokens-screen.css`，并调用 `batch_get` 获取 `Frame_00_DesignSystem` 的公共组件 ID 以及 `Page_04_Archive_Desktop` 和 `Page_04_Archive_Mobile` 容器 ID。

# 页面设计目标与内容结构
解决 `WORKS-CONTENT.md` 中指出的「子页档案架 `portfolio.json` 缺 `02 IterTrip` 与 `05 棱镜`」以及「封存履历中的候选 A（菌智鉴熟）与候选 B（智能优化中 OPTIMIZED）随时可加」的需求，将全部 **9 件作品（01–07 + A + B）** 整合进一套高信息密度、带分类筛选与待核实问题高亮提示的工业档案架页面。

## 一、Desktop 画板（`Page_04_Archive_Desktop`，1440 × 2420）
版心宽 `1240px` 居中，左右内边距 `44px`（净宽 `1152px`）。自上而下构建以下 5 个模块：

1. **模块 1 · 顶栏导航与档案架章头 `p4_header`**：
   - `p4_topbar`：右侧药丸组 `[首页]`（`.chip`） + `[作品]`（`.chip`） + `[档案架]`（`.chip--on` 墨色激活态）。
   - `p4_sec_head`（顶距 `32px`）：居中 `.no` `ARCHIVE` + `h2` `全量作品档案架`（`52px` 900） + `.meta` `09 PROJECTS · FULL INDEX`。

2. **模块 2 · 双维筛选与状态统计栏 `p4_filter_bar`（顶距 `32px`，宽 `1152px`）**：
   - 左侧类别药丸组（间距 `8px`）：
     - `[全部 · 09]`（`.chip--on`）
     - `[游戏 · 06]`（含 01, 03, 05, 06, 07, B）
     - `[AI 应用 · 02]`（含 02, A）
     - `[Mod · 01]`（含 04）
   - 右侧状态灯统计组（间距 `24px`）：
     - `.state--live` `在跑 / 已上线 · 06`
     - `.state--wip` `在制 · 01`
     - `.state--arch` `已归档 · 02`

3. **模块 3 · 履历重点补强双卡区 `p4_candidate_highlights`（顶距 `32px`，双列等宽 `552px`，间距 `48px`）**：
   - 专为 `WORKS-CONTENT.md` 第四节「候选 A & B」打造的重点展示区（实例化 `Comp/SoftCard_Container` `.rows`）：
   - **左卡 · `A · 菌智鉴熟 ｜ AI 应用`**：
     - 顶部内凹图框 `.figure`（`488 × 260px`）：载入 `images/projects/morel.jpg`，左上角标 `国家级大创 · 软著 2026SR0492487`。
     - 标题 `h3`：`菌智鉴熟`（`28px` 800） + 时间 `2025.11 – 2026.04`。
     - 精简文案：`拍一张，识别羊肚菌的品种与成熟度，帮农户掐准采摘时机。`
     - 指标与技术行（`--mono` `13px`）：`mAP50 85.05% · 多任务识别准确率 92.01%` | `Flask · YOLOv11n · DINOv3 · OpenCV · SQLAlchemy`。
     - 底部操作：铭牌键 `[查看深度卷宗 →]`（指向 Page 03） + 软著标签 `2026SR0492487`。
   - **右卡 · `B · 智能优化中 OPTIMIZED ｜ 游戏`**：
     - 顶部内凹图框 `.figure`（`488 × 260px`）：载入 `images/projects/optimized.jpg`（像素风办公室场景），左上角标 `可试玩 · 好游快爆上线`。
     - 标题 `h3`：`智能优化中 OPTIMIZED`（`28px` 800） + 时间与角色 `2026.07 · 8人队伍 · 主程兼队长`。
     - 精简文案：`反乌托邦像素叙事游戏，21 天极限交付，侵蚀值阈值撑起多结局。`
     - 履历补充与技术行（`--mono` `13px`）：`金海豚 2026 游戏大赛参赛作品` | `Godot 4 · GDScript · Resource 数据驱动任务调度 · 侵蚀值多结局`。
     - 底部操作：铭牌键 `[好游快爆试玩 ↗]`（对应 `https://www.3839.com/a/201212.htm`）。

4. **模块 4 · 全量 9 件作品结构化索引软表 `p4_archive_table`（顶距 `48px`，宽 `1152px`）**：
   - 实例化一整块通栏软 UI 凹槽面板 `.rows`（内边距 `36px 40px`），顶部表头行（`13px` `--mono` `#5C666C`）：`NO. / STATE` | `PROJECT & SUMMARY` | `TECH & SCALE` | `ENTRANCE & AUDIT`。
   - 内部按序排列 **9 行作品索引（每行高 `88px`，间距 `12px`）**：
     1. **`01` | `LIVE` | `风织雨 Weaving Rain`（游戏）**：`拨动空气，把雨送到群岛上需要它的地方。` | `Godot 4 · 3D程序化 · 自研编辑器 · 单人13天 (2026.10.20)` | `[TapTap 试玩 ↗]` `[源码 ↗]`
     2. **`02` | `LIVE` | `IterTrip`（AI 应用）**：`把旅行攻略变成能点的地图。从模型到页面一个人走完。` | `Full-Stack AI · M24 · 1.3万行` | `[在线可玩 ↗]` + 绿色同步标记 `[+ 已补齐 portfolio.json 条目]`
     3. **`03` | `LIVE` | `免疫联结 ImmuneLink`（游戏）**：`主题是「桥」的 2D 塔防。关卡可导入导出。` | `Godot · 2D像素 · 卡赢杯公益赛 (2025.12)` | `[在线游玩 ↗]` `[源码 ↗]` `[B站演示 ↗]`
     4. **`04` | `LIVE` | `掷弹 Mod · CounterStrike Grenades`（Mod）**：`把 CS2 的投掷物机制搬进 Minecraft，含 3D 资产与 TACZ 兼容。` | `Minecraft Forge · 3D资产 (2026.02)` | `[源码 ↗]`
     5. **`A` | `LIVE` | `菌智鉴熟`（AI 应用）**：`两阶段深度学习识别羊肚菌品种与成熟度。` | `YOLOv11n · DINOv3 · mAP50 85.05% (2025.11–2026.04)` | `[软著 2026SR0492487]`
     6. **`B` | `LIVE` | `智能优化中 OPTIMIZED`（游戏）**：`反乌托邦多结局叙事游戏，21天极限交付。` | `Godot 4 · 8人主程兼队长 · 金海豚参赛 (2026.07)` | `[好游快爆试玩 ↗]`
     7. **`05` | `WIP` | `棱镜 · 碧芙洛斯`（游戏）**：`Uno 机制 × 七色光谱相邻出牌。` | `Godot 4 · 卡牌 · 在制` | 朱砂色审校签 `[! 待补充: 封面图与试玩链接]`
     8. **`06` | `ARCH` | `TriHorny4Link`（游戏）**：`塔防玩法练习。A* 动态路径重规划、对象池、事件驱动。` | `Godot / GDScript · Game Jam (2026.03)` | `[观看演示 ↗]` `[GitHub ↗]` + 朱砂色审校签 `[! 待核实: 与07共用b23短链 & GitHub需换仓库链接]`
     9. **`07` | `ARCH` | `像素火影 · 秽土柱间`（游戏）**：`Unity 2D 角色练习。技能、动画状态机、攻击判定。` | `Unity 2D · C# · 战斗系统` | `[观看演示 ↗]` + 朱砂色审校签 `[! 待核实: 缺date字段 & 共用短链 & 封面文字核查]`

5. **模块 5 · 页脚 `p4_foot`（顶距 `64px`）**：实例化 `Comp/Footer`。

## 二、Mobile 画板（`Page_04_Archive_Mobile`，390 × 2880）
- 版心净宽 `322px`；筛选栏药丸支持横向折行；候选 A/B 双卡改为单列上下堆叠；9 行档案索引表每行改为高 `148px` 的紧凑三行卡片布局。

# 操作边界与协作约束
1. 所有新建节点与绑定名必须以 `p4_` 开头，严格限定在 `Page_04_Archive_Desktop` 与 `Page_04_Archive_Mobile` 内部。
2. 严禁修改公共组件或他页节点，严禁调用 `open_document` / `set_variables`。

# 交付与自检标准
调用 `snapshot_layout` 和 `get_screenshot` 检查 9 件作品是否全部在列、待核实标记是否清晰可读、无文字截断或出界，随后输出完成报告。
```

---

### 7.6 质量检查与视觉走查智能体（`Agent-QA Inspector`）完整执行提示词

```markdown
# 角色定义
你是「ZLOONG 个人作品集设计项目」的质量检查与视觉走查智能体（Agent-QA Inspector）。
你在阶段四（4 个页面子智能体全部完成设计后）启动，负责对 `zloong-portfolio.pen` 中的 `Frame_00_DesignSystem` 及 `Page_01` ~ `Page_04` 共 8 个 Desktop/Mobile 画板进行全量结构与视觉走查。

# 检查工具与执行流程
1. **结构与边界走查（Programmatic Layout Audit）**：
   - 调用 `get_editor_state` 与 `snapshot_layout` 获取全部 9 个顶层 Frame 的节点树与计算包围盒（computed bounds）。
   - 检查是否存在：
     - 顶层 Frame 坐标越界或相互重叠；
     - 子节点超出 `.sheet` 纸面边界（水平溢出或底部截断）；
     - 文本节点宽度过窄导致的异常单字折行或文字重叠；
     - 未按规范添加 `p1_` ~ `p4_` 前缀的孤儿节点。
2. **视觉截图审查（Visual Critique via `get_screenshot`）**：
   - 依次对 `Page_01_Home_Desktop`、`Page_01_Home_Mobile`、`Page_02_Works_Desktop`、`Page_02_Works_Mobile`、`Page_03_CaseStudy_Desktop`、`Page_03_CaseStudy_Mobile`、`Page_04_Archive_Desktop`、`Page_04_Archive_Mobile` 调用 `get_screenshot`。
   - 逐项核对：
     - **视觉一致性**：是否全部采用 `#12171A` 墨色亚克力外框 + `#F2F5F7` 冷白纸面 + `118°` 左上受光渐变；是否误加了 `site.css` 禁止的章节底部分割线（`border-bottom`）。
     - **内容零虚构**：核对 `WORKS-CONTENT.md` 的全部作品名称、日期、状态行、外链、图片文件名是否完全一致，`05 棱镜` 是否保持无图纯排，`06/07` 的待核实问题是否已明确标记。
     - **导航闭环**：4 个页面的 `.topbar` 药丸激活态（`.chip--on`）是否与当前所在页面严格匹配。
3. **输出《QA 验收与修补清单》**：
   - 若全部通过，签发 `PASS` 验收结论；
   - 若发现任何偏差，列出精确的 `Node ID`、问题描述及对应的修复 `batch_design` 参数，交由 `Agent-00` 统一执行修正。
```

---

## 8. 整体执行流程与任务依赖关系

### 8.1 五阶段执行流水线（Pipeline & DAG）

```
[阶段一：规范解析与环境就绪] (负责人：弱模型调度器)
       │
       ▼
[阶段二：初始化 .pen 文件、全局变量、12个公共组件母版与8个页面空画板] (负责人：Agent-00 串行独占)
       │  输出：《Node ID 注册表》(Frame_00 + Page_01~04 Desktop/Mobile IDs)
       ├──────────────────────┬──────────────────────┬──────────────────────┐
       ▼                      ▼                      ▼                      ▼
[阶段三：并行设计]     [阶段三：并行设计]     [阶段三：并行设计]     [阶段三：并行设计]
  Agent-P1 (首页)       Agent-P2 (作品页)      Agent-P3 (案例页)      Agent-P4 (档案架页)
  Zone 1D & 1M          Zone 2D & 2M          Zone 3D & 3M          Zone 4D & 4M
       │                      │                      │                      │
       └──────────────────────┴──────────┬───────────┴──────────────────────┘
                                         ▼
              [阶段四：全画布布局快照与视觉截图走查] (负责人：Agent-QA)
                                         │  输出：《QA 验收与修补清单》
                                         ▼
              [阶段五：冲突消解、视觉微调收口与最终交付] (负责人：Agent-00)
```

### 8.2 各阶段输入、输出、前置依赖与完成条件表

| 阶段 | 阶段名称 | 负责人 | 前置依赖 | 输入材料 | 核心执行动作 | 输出产物与完成条件（Exit Criteria） |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **阶段一** | 项目分析与设计规范锁定 | 弱模型（主调度器） | 无 | 本执行规划文档 + 5 个源码文件 | 校验本地工作区文件完整性，确认 `pen.dev` MCP 服务连接正常 | MCP `get_editor_state` 响应正常，确认设计参数无需二次推导 |
| **阶段二** | `.pen` 初始化与公共架构搭建（**严格串行**） | `Agent-00` | 阶段一完成 | 第 2 节设计规范 + 第 6.2 节坐标分配表 + 7.1 提示词 | 1. `open_document("zloong-portfolio.pen")`<br>2. `set_variables` 写入全量 Token<br>3. 创建 `Frame_00_DesignSystem` 与 12 个公共组件母版<br>4. 创建 `Page_01`~`Page_04` 共 8 个顶层空画板 | 1. `zloong-portfolio.pen` 落盘成功<br>2. 产出完整的《Node ID 注册表》<br>3. `snapshot_layout` 确认 9 个顶层 Frame 坐标零重叠 |
| **阶段三** | 四页面多智能体并行设计（**核心并行期**） | `Agent-P1`<br>`Agent-P2`<br>`Agent-P3`<br>`Agent-P4` | 阶段二完成，且拿到各自的顶层 Frame ID 与公共组件 ID | 各自专属提示词（7.2–7.5）+《Node ID 注册表》+ `WORKS-CONTENT.md` | 4 个子智能体在各自独立的 `Page_0X_Desktop` 与 `Page_0X_Mobile` 子树内实例化组件、填充图文与样式（GUI MCP 模式下直接并行写子树；CLI 模式下并行生成 `batch_design` 脚本并按序提交） | 4 个子智能体均完成 Desktop + Mobile 双画板构建，且各自局部 `get_screenshot` 自检通过 |
| **阶段四** | 全局质量走查与冲突检测（**串行审查**） | `Agent-QA` | 阶段三全部 4 个子智能体返回完成状态 | 7.6 提示词 + 第 9 节质量验收清单 | 对 9 个顶层 Frame 执行 `snapshot_layout` 包围盒审计与 `get_screenshot` 视觉比对，核查文案、配色、118° 光影与对齐精度 | 产出《QA 验收与修补清单》（列出所有需修正的 Node ID 与具体属性偏差） |
| **阶段五** | 整体视觉统一与最终验收收口（**串行收口**） | `Agent-00` | 阶段四完成 | 《QA 验收与修补清单》 | 1. 统一执行修补 `batch_design` 指令<br>2. 清理临时图层，对齐各画板高度至实际内容底边<br>3. 保存最终版 `zloong-portfolio.pen` 并导出各画板预览图 | 所有验收项 100% 达标，产出最终 `.pen` 文件与全套页面高清预览图 |

---

## 9. 最终质量验收清单（QA Checklist）

弱模型与 `Agent-QA` 在阶段四/五必须逐条勾选以下 7 大维度共 24 项硬性指标，任何一项未通过均须退回修补：

### 9.1 页面内容完整性与真实性（Content Fidelity）
- [ ] **零虚构校验**：全部 9 件作品（`01–07` + `候选 A 菌智鉴熟` + `候选 B 智能优化中`）的名称、类别、日期、开发周期、指标（`mAP50 85.05%`、`准确率 92.01%`、`1.3 万行`、`单人 13 天`、`21 天极限交付`）、软著号（`2026SR0492487`）与 `WORKS-CONTENT.md` 逐字一致。
- [ ] **首页 12 枚铭牌完整度**：`status`、`craft`、`focus`、`fav (洛天依 66CCFF)`、`engine (Godot 4 / Unity)`、`lang (GDScript / C# / Kotlin / Python / TS)`、`daily (Hanako 箱庭 ↗)` 共 12 枚贴纸一颗不少，键值与色板准确。
- [ ] **无图作品诚实呈现**：`05 · 棱镜 · 碧芙洛斯` 在 Page 02 中严格使用 `.item--bare` 纯文字紧凑排版，未捏造虚假游戏截图。
- [ ] **库存孤儿图合理利用**：`images/projects/weaving-rain.png`（239 KB）在 Page 03 风织雨深度卷宗中作为副图正式启用；`images/projects/秽土.avif` 在 Page 02 归档区 `07` 号作品中作为封面正式启用。
- [ ] **待核实项显式标注**：`06 TriHorny4Link` 与 `07 秽土柱间` 共用 `b23.tv/EZKZQSl` 短链、`06` 的 GitHub 个人主页链接、`07` 缺失日期字段等问题，在 Page 02 与 Page 04 中均有醒目的审校角标提示。

### 9.2 视觉风格延续性（Visual DNA Consistency）
- [ ] **页面壳统一**：8 个页面画板全部具备 `.bezel`（`118deg` `#20262B → #12171A → #0B0F12` 墨色亚克力外框）与 `.sheet`（`#F2F5F7` 冷白圆角纸面）。
- [ ] **118° 全场唯一光源**：主名厚板、顶栏药丸、拟物铭牌键（`.link` / `.icon-link`）、软 UI 凹槽面板（`.board` / `.rows`）的高光棱全部位于左上方，阴影全部位于右下方，无任何反向光源组件。
- [ ] **无废线原则**：所有章头 `.sec-head`、作品条目 `.item`、档案行 `.rows__r` 之间均无 `border-bottom` 分割线（仅水位陈列架保留唯一的 `1px solid #B9C5CC` 水位线 `.shelf__rule`）。
- [ ] **图片内凹质感**：所有作品截图均包裹在 `.figure` 容器内，具备 `#D6DEE3` 底色与内凹阴影，绝无裸贴图片或外发光卡片。

### 9.3 布局、栅格与信息层级（Layout & Hierarchy）
- [ ] **水位陈列架空间语义准确**：Page 02 顶部 7 枚立方体严格按「前 4 枚青色浸水（`-12px`）、第 5 枚墨灰悬空（`+22px`）、后 2 枚浅灰沉底（水下 `8px`）」排布。
- [ ] **作品页轻重对比鲜明**：`§01 在跑` 首件 `01 风织雨` 为 `1152px` 整幅通栏，第 `02–04` 件为 `1.25fr : 1fr` 奇偶交错；`§02 在制` 与 `§03 归档` 纵向内边距明显收紧，形成清晰的视觉重量差。
- [ ] **6 档字号严格受控**：全文件未出现脱离 `--t0` ~ `--t5` 体系的随意字号；所有编号、状态行、外链按钮、页脚均使用 `--mono` 等宽字体并开启大写与字距。

### 9.4 跨页面导航、响应式与 `.pen` 文件组织（File Hygiene）
- [ ] **顶栏药丸状态自洽**：Page 01 中 `[首页]` 为 `.chip--on`；Page 02/03 中 `[作品]` 为 `.chip--on`；Page 04 中 `[档案架]` 为 `.chip--on`。
- [ ] **响应式双端完备**：每个页面均包含 `1440px` Desktop 与 `390px` Mobile 两个画板，移动端无横向溢出、文字切边或立方体挤压变形。
- [ ] **图层命名与坐标整洁**：`Frame_00` 与 8 个页面画板严格按 `x: 0, 3200, 4800, 6400, 8000, 9600, 11200, 12800, 14400` 排列，内部节点均带 `p1_` ~ `p4_` 前缀，无重叠、无残余空白废框。

---

## 10. 潜在风险及应对措施

| 风险编号 | 风险场景描述 | 发生概率 | 影响程度 | 具体规避与应对措施（已嵌入本规划） |
| :--- | :--- | :--- | :--- | :--- |
| **Risk 01** | **多智能体并发写入同一 `.pen` 文件导致 JSON 覆盖或节点丢失** | 高（尤其在 CLI 无头模式下） | 致命 | **双模式自适应策略**：① 若连接 GUI 常驻 MCP Server，子智能体仅对各自预分配的 `Page_0X` Frame ID 执行小批量（≤25 节点）`batch_design`；② 若为 CLI 文件读写模式，4 个子智能体**并行生成各自的 `batch_design` 指令脚本**，由总调度器按 `P1→P2→P3→P4` 顺序串行合入同一 `.pen` 文件，兼顾并行效率与 100% 写入安全。 |
| **Risk 02** | **子智能体调用 `find_empty_space_on_canvas` 导致多页面画板坐标重叠** | 高 | 严重 | **绝对坐标预锁死**：严禁页面子智能体调用 `find_empty_space_on_canvas` 创建顶层画板。所有 8 个页面顶层 Frame 均由 `Agent-00` 在阶段二按固定间隔（`1600px` 步进）预先创建好，子智能体只能在指定 Frame ID 内操作。 |
| **Risk 03** | **子智能体擅自修改公共组件母版或全局 Variables 污染全站样式** | 中 | 严重 | **单写多读权限锁**：提示词中明确禁止 `Agent-P1~P4` 调用 `set_variables` 或对 `Frame_00_DesignSystem` 执行 `U()/D()/M()`；子智能体只能通过 `C()` 克隆组件实例到自己的页面后再覆盖实例文本与图片。 |
| **Risk 04** | **`pen.dev` 画布难以直接渲染 WebGL 立方体、Canvas 字符浪潮与 CSS 复杂多层 `text-shadow`** | 高 | 中 | **静态高保真矢量等效替代方案**：① **字符浪潮墙（`.wall` / `.band`）**：使用多行等宽 ASCII 字符文本框阵列 + 透明度阶梯 + 底部 `#F2F5F7` 线性渐变遮罩；② **主名厚板浮雕（`ZLOONG`）**：使用底层 4–6 层错位深灰文本叠加模拟挤出厚度 + 顶层 `118°` 多色标线性渐变填充；③ **水位立方体（`.cube`）**：使用 `site.css` 原生 SVG 等轴测三面多边形（顶面 `.t`、左面 `.l`、右面 `.r`）矢量绘制，100% 还原三态受光色值。 |
| **Risk 05** | **弱模型在单次 `batch_design` 中塞入过多节点导致 Token 截断或语法报错** | 中 | 中 | **模块化分步提交**：要求每个页面子智能体按页面模块（如「顶栏与首屏」→「核心列表上」→「核心列表下与页脚」）分 2–3 次调用 `batch_design`，每次调用后立即用 `snapshot_layout` 校验，避免单次超大 Payload 失败。 |
| **Risk 06** | **源材料中的待核实链接与缺失图片被子智能体盲目脑补** | 中 | 高 | **显式审校标签机制**：对 `05 棱镜` 强制使用 `.item--bare` 无图结构；对 `06/07` 的短链冲突、个人主页链接、缺失日期，统一设计 `[! 待核实]` 朱砂色审校角标，绝不填充假链接或 AI 假图。 |
