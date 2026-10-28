# IMPLEMENT · 本轮实施说明

> 交给实施方（Gemini）执行。执行者不需要重做设计决策——**改动点已经定死，按 §2 / §3 做即可**。
> 设计依据见 [DESIGN.md](DESIGN.md)；本轮讨论结论见 [HANDOFF.md](HANDOFF.md)。
> 必须遵守：**不执行 `git commit` / `git push` / `git add`**。只改文件，交回用户自己提交。

---

## 0. 本轮一句话

把「首页 / 作品 / 关于」三页收成**两页**（首页 / 作品），并把作品页的节奏打散。
同时清掉工作区里上一轮留下的作废稿。

---

## 1. 先做：清理工作区

当前 `git status` 显示 19 条未跟踪项、展开约 138 个文件。大部分是上一轮已被否决的试验稿。
**先清理，再实施**——否则实施方的 diff 会混在垃圾里，没人看得清改了什么。

### 1.1 删除（作废产物，可直接删）

| 路径 | 内容 | 为什么删 |
|---|---|---|
| `.design/design-demos/` | 82 文件 / 10M | 「工房 + 新拟物 + 键帽」那一整轮的方向稿，已全部否决 |
| `.design/lp/` | 9 文件 / 1.5M | letterpress 压印纸研究稿，结论已写进 DESIGN.md §6.1，原件不再需要 |
| `.design/resume-arch-proposals.html`<br>`.design/resume-honors-proposals.html`<br>`.design/resume-proposals.html`<br>`.design/resume-showcase-proposals.html` | 4 个文件 | 更早的简历改版提案，已被封存的 resume 取代 |
| `.design/directions-2026-10-27/` 下这 10 个：<br>`d1-screen.html` `d1-screen-v2.html` `d1-v4-rings.html` `d1-v4-shape.html` `d1-v5-material.html` `d2-board.html` `d3-frame.html` `embed-test.html` `gen-bg.py` `gen-v5.py` | 10 个文件 | 方向比稿的中间态，结论已落进 DESIGN.md |
| `.dsh-ops/` | 8 文件 / 3.4M | 工具运行缓存，不属于站点内容 |

### 1.2 保留（还有参考价值）

- `.design/directions-2026-10-27/palette.html` —— 三套配色的色阶与对比度表
- `.design/directions-2026-10-27/material.html` —— 四个表面状态的配方
- `.design/directions-2026-10-27/motif-cube.html` —— 立方体母题样张
- `.design/home-preview/*.webp` —— 九张截图（实施完成后按新结构重拍替换）

### 1.3 加进 `.gitignore`（本地工具目录，不提交）

**`.agents/skills/isle/` 要留下**（项目级 skill，进版本库），`.agents` 下的其余内容和另外三个工具目录一律忽略。

在 `.gitignore` 末尾追加：

```gitignore
# 本地工具运行缓存
.dsh-ops/

# 本地 AI 工具配置（.agents 下只保留项目级 skill）
.claude/
.trae/
.agents/*
!.agents/skills/
.agents/skills/*
!.agents/skills/isle/
```

> 注意 git 的规则：父目录被排除时无法再包含其子文件，所以必须逐级 `!` 回来——上面四行是一组，缺一行 `isle` 就不会被跟踪。
> 写完用 `git check-ignore -v .agents/skills/isle/SKILL.md` 验证：**应当没有输出**（没被忽略）；再 `git check-ignore -v .claude/` 验证**有输出**。

### 1.4 绝对不要碰

`legacy/`、`LICENSE`、`images/`、`pages/`、`luotianyi/`、`css/tokens.css`、`css/workshop.css`、`data/portfolio.json`、`js/date.js`。

`css/workshop.css` 仍被 `pages/*.html` 引用，**不是孤儿，别删**。

---

## 2. 结构：三页 → 两页

```
首页 /        门牌 → §01 现在 → §02 关于 → §03 联系      ← 三屏
作品 /works   §01 在跑 · §02 在制 · §03 归档             ← 七件
```

### 2.1 文件动作

| 动作 | 从 | 到 |
|---|---|---|
| 备份 | `index.html` | `.design/legacy-index-2026-10-27.html`（**必须做**） |
| 改名为首页 | `preview.html` | `index.html` |
| 改名为作品页 | `preview-works.html` | `works.html` |
| 并入后删除 | `preview-about.html` | 内容并进 `index.html` 的 §02 / §03，然后删掉本文件 |

### 2.2 导航

仪表条右侧只留两个链接：**首页（品牌字）· 作品**。
删掉「关于」链接；关于内容现在就在首页上。所有页面内部链接同步更新（`preview.html` → `index.html`，`preview-works.html` → `works.html`）。

### 2.3 首页第三节

`preview-about.html` 的 `.about` 与 `.door` 两节整体搬进 `index.html`，编号接在「现在」之后：

- `§02 关于` —— 三段话 + 七行刻度表
- `§03 联系` —— 一句话 + 复制邮箱 + GitHub / B 站
- 那枚 **74px 落定立方体**（`.sign`）放在 §02 与 §03 之间，作为页面签名

---

## 3. 三处改动

### 改动 A · 作品页：第一件整幅铺开

作品页的第一件（风织雨）不再走图文分栏，改成和首页「现在」一样的整幅版式：
图占满版心宽度，标题 / 状态 / 一句话 / 入口在图**下方**。

实现：给它加一个 `item--hero` 类，内部结构复用 `index.html` 里 `.now` 的排版（`.figure` + `.now__meta`）。第二件起沿用现有 `.item`。

**验收**：作品页第一屏能看到一整张大图，且它与下面任何一行的结构都不同。

### 改动 B · 作品页：拆三章，章节 = 状态

当前七件全挤在 `§01 作品` 一章里。改成三章，每章内的立方体状态是统一的：

| 章 | 名称 | 件数 | 成员 | 立方体 |
|---|---|---|---|---|
| §01 | 在跑 | 4 | 风织雨、IterTrip、免疫联结、掷弹 Mod | 全部坐在线上 |
| §02 | 在制 | 1 | 棱镜·碧芙洛斯 | 悬空（青色） |
| §03 | 归档 | 2 | TriHorny4Link、像素火影 | 全部沉到线下 |

同时：

1. **图宽按状态分档**（不要"跟着内容走"，那没有判据）：§01 用大图 `grid-template-columns: 1.25fr 1fr`，§03 用小图 `0.9fr 1fr`。
2. **水位图保留**，但按三章分组：`grid-template-columns` 改成 `4fr 1fr 2fr` 的三段，段间留一个 `--s6` 的间隙（分组视觉），编号 01–07 不变。
3. 顶部 `.sec-head` 的 meta 改为 `07 件 · 在跑 04 · 在制 01 · 归档 02`，与仪表条的「在跑 04」口径一致。

**验收**：三个章头都有编号与件数；每章内立方体状态一致；全页仍只有七件作品，一件不少。

### 改动 C · 首页细节

1. **刻度从四行加到六行**：在「B 站 30k」后补 `commits 1.9K / 年`、`日报 50+ 期`。数值从 `data/home.json` 读，补对应 key。
2. **版心竖线加深**：`--rail` 在 `cool` 主题下从 `rgba(18,23,26,.08)` 提到 `.16`（对比度 1.18 → 1.40）。`dark` / `warm` 两套同步检查一遍，不要出现刺眼的深线。

---

## 4. 收尾

1. **定稿主题为冷白**：三个页面 `<html>` 标签加 `data-theme="cool"`。
2. **删掉页面的配色切换条**：移除每页底部的 `.themebar` 块和 `<script src="js/preview-theme.js">`。
   **但保留** `js/preview-theme.js` 文件和 `tokens-screen.css` 里的 dark / warm 两套 token——将来想换回来只要加回两行。
3. **更新 `AGENTS.md` 七处**：
   - `<title>`：首页改为 `ZLOONG · Dragonzhi`
   - 「工房 Workshop 设计定稿」整条 → 改写为「两套材质：屏（首页 / 作品，冷白）与纸（子页 / Hanako 箱庭）」
   - 「`css/tokens.css` 全站唯一 token 源」→ 按材质分文件：`tokens-screen.css`（屏）/ `tokens.css`（纸）
   - 「首页自动档案架」条款删除 → 替换为「首页不再有自动成卡」
   - 台面拖拽 / 打字机 / `data/desk-config.js` 相关描述删除
   - `pages/resume.html` → 标注为「封存页，站内不设入口」
   - SIGNAL 彩蛋条款删除
4. **更新 `TASKS.md`**：记录本轮已完成项与剩余项。
5. **不 commit。** 执行完把 `git status` 结果交给用户。

---

## 5. 验收清单

- [ ] `index.html` / `works.html` 两个页面，导航只有「首页 · 作品」
- [ ] `preview-*.html` 三个文件已不存在；`.design/legacy-index-2026-10-27.html` 存在
- [ ] 首页三屏：门牌 → 现在 → 关于 → 联系，落定立方体在关于与联系之间
- [ ] 作品页三章，件数 4 / 1 / 2，合计 7
- [ ] 作品页第一件整幅铺开，与其余行结构不同
- [ ] 水位图七枚立方体，按 4 / 1 / 2 分三组
- [ ] 全站默认冷白（`data-theme="cool"`），无配色切换条
- [ ] 可见字号仍是 6 档；间距仍是 10 档
- [ ] 1440 / 1024 / 390 / 320 零横向溢出
- [ ] 零失败请求；断网时首屏文字可读
- [ ] 所有「可试玩 / 已上线」的入口点进去真的能用（风织雨 → TapTap、IterTrip → itertrip、免疫联结 → ImmuneLink、掷弹 → GitHub）
- [ ] TriHorny4Link 的「演示待补」是 disabled 按钮，点了没反应
- [ ] `prefers-reduced-motion` 下无过渡
- [ ] 备案号「闽ICP备20260330551号-1」仍在页脚

---

## 6. 红线

1. **不要重新设计。** 母题、配色、四态、字号阶梯都已定稿；觉得哪里不对就停下问，不要自己发挥。
2. **不要引入任何依赖**：框架、打包器、CDN 字体、图标库、npm 包，一律不加。
3. **不要加动画**：全站只有「按下」一种过渡。
4. **不要碰 `legacy/`**、不要改 `LICENSE` 与备案号。
5. **不要 commit / push / add。**
6. 关于页已经并进首页——**不要再单独造一个 about 页**。
