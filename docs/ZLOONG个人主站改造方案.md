# ZLOONG 个人主站改造方案

> 状态：**已定稿 · 主站已部署上线** · 2026-08-30
> 背景：看到 lvy010（GitHub: lvy010）的 GitHub 主页与个人网站，触发对自身 GitHub 主页、个人主站、箱庭关系的重新规划。
> 设计定稿：`preview-workshop-v5.html`（与本文件同目录树，见下）
> 部署状态：主站已上线 https://dragonzhi.xyz/（腾讯云 nginx，git clone 部署），箱庭互链完成

## 〇、交接实施说明（给 Harness）

可直接使用的材料：

| 材料 | 用途 |
|---|---|
| `preview-workshop-v5.html` | **设计定稿**：结构、CSS、文案的完整参照，照此实施 |
| `data/content.js` | 现有文案数据（打字机 phrases / about / now），**继续沿用** |
| `index.html`（旧） | 结构参考，将被 v5 结构替换 |
| `css/site.css`（旧） | 将被 v5 内联样式抽取为 `css/workshop.css` 替换 |
| `images/`、`pages/`、`legacy/` | 不动 |

实施要点：

1. **index.html 按 v5 重写**：门牌报眉 → 报头墙（大字+双线+印章）→ 今日一言 → 台面标注 + bento（hero 胶带卡 / 琥珀屏终端 / about.md / now.md / projects 档案架 / links / motto 便签）→ 本区导览（壹贰叁肆 + 状态徽章）→ 报尾（工房不关门 + 备案号）
2. **CSS 落地**：把 v5 的 `<style>` 抽成 `css/workshop.css`，index.html 引用它（不再用旧 site.css；旧文件保留不删）
3. **JS 保留现有能力**：打字机（读 content.js 的 phrases）、日期、复制邮箱、SIGNAL 彩蛋开关，v5 文件底部有现成实现可直接搬
4. **content.js 兼容**：about/now 卡片改成了静态内联（v5 如此），若想继续走 content.js 数据流，把 v5 的 about/now 内容填回 content.js 结构即可，二选一
5. **projects 数据**：v5 用静态 HTML（免疫联结/棱镜/TriHorny/CSG 四件）。若要恢复 portfolio.json 数据驱动，用 JS 渲染但必须满足渐进增强（见下）
6. **不要引入**：框架、构建工具、外部大依赖。纯静态 HTML+CSS+原生 JS，与箱庭同哲学

## 一、总体架构

- **GitHub 个人页**（Dragonzhi/Dragonzhi 同名仓库）= 门面，给人看「你是谁」
- **主站 / 工房**（dragonzhi.xyz 根路径）= 作品工作台，空间性存在，常开
- **箱庭**（dragonzhi.xyz/hanako/）= 每日日报，时间性存在，每日出报

主站部署在**腾讯云**（不用 Vercel：国内访问是硬伤，vercel.app 被 DNS 污染；受众在国内）。腾讯云轻量服务器可跑后端（箱庭 server.py 已是先例），serverless 非刚需。

## 二、仓库布局：一份代码，两种部署

| 仓库 | 定位 | 部署目标 |
|---|---|---|
| `Dragonzhi/Dragonzhi` | GitHub 个人页门面 README | GitHub 个人页（已生效） |
| `Dragonzhi/Dragonzhi.github.io` | 工房源码，一份代码双部署 | GitHub Pages（静态镜像）+ 腾讯云根路径（带后端） |
| `Dragonzhi/hanako-diorama` | 箱庭源码 | 腾讯云 `/hanako/` 子路径（不动） |

**是「一份源码往两处部署」，不是两套代码**，避免维护分叉。

## 三、渐进增强（双部署成立的前提）

页面核心展示（作品、文字、笔记）**纯静态即可完整显示**。后端能力（排行榜、留言、订阅）做成「有就用，没有就不打扰」：

- GitHub Pages 上：正常浏览，API 功能静默隐藏
- 腾讯云上：同样的页面，API 功能自动亮出

纪律：**所有 fetch API 调用必须容忍失败**，失败走 fallback，绝不白屏。

## 四、设计定稿：工房 Workshop（v5）

世界观：**主站是一间铺着暖纸的工作台（工房），持久存在、常开不关门；箱庭是每日出报的日报。日报管每天，工房管作品。** 同院不同屋，一脉两支。

### 家族基因（与箱庭共享的设计令牌）

```css
--desk: #f3eee4;   /* 台面垫 */
--card: #fbf8f2;   /* 纸卡 */
--ink: #26221c;
--ink-soft: #6b6158;
--line: #d8cfbe;
--red: #8b2c1f;    /* 朱砂：编号、状态、印章 */
--blue: #2f5d8a;   /* 链接 */
```

字体三轨：衬线（Georgia/Noto Serif SC，庄重处）+ 楷体 LXGW WenKai（界面正文）+ 等宽 Cascadia/JetBrains（代码、标注、日期）。

### 版面结构（墙与台面的节奏）

1. **门牌**（报眉语法）：站名 + 日期 +「编辑：ZLOONG · 排印：Hanako」+「● 常开」
2. **报头墙**：超大朱砂衬线「ZLOONG 工房」+ 宽字距英文副题 + 双线 rule-double + 斜贴印章「验收中 WORKSHOP」
3. **今日一言**：钉在墙上的一句话（引言 + 出处小字）
4. **台面标注**：「台 · 01 进门」mono 编号 + 中文题 + 英文小注
5. **bento 台面**（纸卡材质，非玻璃）：
   - hero 胶带卡：`~/workshop` + 打字机 + 三链接（Email / 隔壁箱庭 / GitHub）
   - 琥珀屏终端卡（neofetch，暖墨底 #2b2620 + 琥珀 #d98e4a，红绿点改一枚朱砂）
   - about.md / now.md 笔记卡（now 含「在制」状态徽章）
   - projects 档案架（第壹件～第肆件中文数字编号 + 状态徽章：获奖/在制）
   - links.md 门牌卡 + motto 便签（微旋转 + 胶带）
6. **本区导览**（箱庭菜单语法）：边框盒 +「本区导览 CONTENTS」头 + 壹贰叁肆行式条目 + 状态徽章 + hover 变红箭头；箱庭条目挂「今日已发」
7. **报尾**：「— 工房不关门 —」+ 家族署名 + 备案号 +「隔壁箱庭每日出报 · 明晨八时再会」+ SIGNAL 66.00 MHz 入口

### geek 元素的纸化原则

工房里屏幕天然存在，所以终端、打字机自洽；发光只允许出现在 SIGNAL 彩蛋（工房角落的收音机）一处。不引入框架、毛玻璃、大圆角、彩色模糊背景。

### 双轨编号

- 中文数字（第壹件 / 壹贰叁肆）= 家族记号，用于档案与导览
- 等宽 mono（01 / ~/workshop / .md）= 工房方言，用于技术标注

## 五、备案合规（零变更）

- 现有备案：**闽ICP备20260330551号-1**，网站名称「Hanako箱庭」，**不改名**
- 工房 `<title>` 必须含备案名：`ZLOONG 工房 · Hanako箱庭`（v5 已如此；工信部核查比对 `<title>` 标签）
- 页脚挂备案号 + 链接 `https://beian.miit.gov.cn/`（v5 已挂）
- 箱庭现状合规，不动

## 六、部署管线（已落地）

```
Dragonzhi/Dragonzhi.github.io（一份源码）
  ├─ GitHub Actions → GitHub Pages（静态镜像，可选）
  └─ 腾讯云 nginx：git clone 到 /var/www/dragonzhi，属主 ubuntu
```

- 工房 = `dragonzhi.xyz/`（/var/www/dragonzhi，nginx 静态）
- 箱庭 = `dragonzhi.xyz/hanako/`（systemd 端口 8421，不动）

### 日常更新流程（本地改 → push → 服务器 pull）

1. 本地/云端改代码，push 到 GitHub `Dragonzhi/Dragonzhi.github.io`
2. 服务器执行：`cd /var/www/dragonzhi && git pull`
3. 属主已是 ubuntu，普通用户可直接 pull（无需 sudo）；仅首次部署需要 sudo
4. nginx 无需 reload（静态文件直接生效），仅在改 nginx 配置时才 `sudo nginx -t && sudo systemctl reload nginx`

### 已完成的互链

- 工房 → 箱庭：首页 hero「隔壁箱庭 ↗」+ 导览牌肆（dragonzhi.xyz/hanako）
- 箱庭 → 工房：报尾新增「隔壁：ZLOONG 工房 · dragonzhi.xyz」（已 push 至 hanako-diorama 仓库）

## 七、GitHub 个人页（已完成项）

`Dragonzhi/Dragonzhi` 同名仓库 README 已是 lvy010 风格（typing-svg + code 标签 + samp 链接行 + 洛天依彩蛋）。待小改：Home 链接从 dragonzhi.github.io 改为 dragonzhi.xyz；定位语可加上「工房」概念。

## 八、实施清单

- [x] index.html 按 v5 重写（Harness 施工完成，已验收）
- [x] v5 内联样式抽取为 css/workshop.css
- [x] `<title>` 确认为「ZLOONG 工房 · Hanako箱庭」
- [x] 页脚备案号 + 工信部链接
- [x] content.js 数据流接入（phrases 打字机必接；about/now 可静态可数据化）
- [x] projects 静态四件（免疫联结/棱镜/TriHorny/CSG）
- [x] 腾讯云部署：git clone 到 /var/www/dragonzhi，属主 ubuntu
- [x] nginx 根路径指向工房静态目录（/hanako/ 保持反代 8421）
- [x] 互链：工房→箱庭（已内置）+ 箱庭→工房（已 push）
- [ ] 箱庭首页「本版目录」加一条「隔壁：ZLOONG 工房」互链（已放报尾，如需菜单项再加）
- [x] Dragonzhi/Dragonzhi README 更新 Home 链接与定位语（如需再补）
- [x] 全部上线后：四个 preview-*.html 从仓库删除（Harness 已清理）

## 附：过程版本存档（已否决，仅供参考）

- `preview-newspaper.html`（v1）：报纸皮 + 玻璃芯，拼贴生硬，否决
- `preview-newspaper-v2.html`（v2）：1920 年代旧报纸，太简朴少 geek，否决
- `preview-journal-v3.html`（v3）：技术期刊，「期」的时间切片与主站持久性冲突，否决
- `preview-workshop-v4.html`（v4）：工房方向正确但仅换皮布局单调，被 v5 取代
- **`preview-workshop-v5.html`（v5）：✅ 设计定稿**
