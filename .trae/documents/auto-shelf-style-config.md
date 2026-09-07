# 档案架卡片样式配置化（files-manifest.json 加 style 字段 + 刷新随机）

## 摘要

给自发现档案架卡片加样式配置能力：在 `data/files-manifest.json` 条目上新增可选 `style` 字段，支持「固定一种」「从数组随机」「从全部随机」「按内容判型（默认，现状）」四种模式；随机发生在**每次页面加载**（JS 端）。`generate_manifest.py` 重新生成时**保留**手改的 `style`。复用现有四种渲染器（links/list/quote/doc），不加新 CSS。

## 现状分析

- `scripts/generate_manifest.py`：扫描 `files/` 生成 `data/files-manifest.json`，条目仅 `{filename, title, auto}`，**整体覆盖写**——手改任何字段都会丢。
- `js/workshop.js`：
  - `detectCardType()`（L235-249）按内容自动判型：全 `- ` 带链接 → links；全 `- ` → list；全 `> ` → quote；否则 doc。
  - `buildAutoCard(filename, body)`（L270-308）按判型结果套四种现成渲染器；调用点在 `bootFiles()` 的 manifest 加载处（约 L498-504）。
  - **没有任何样式覆盖入口** → 实际文件多为段落混合内容，全部落 doc 型，即用户说的「只有一种类型、不适配文本」。
- 四种渲染器均有优雅降级：links 渲染器对非链接行回退纯文本 `<li>`；list 渲染器剥 `- ` 前缀即可；quote 渲染器把非 `> ` 行当正文；doc 渲染器 `blockMd` 全兼容 → 固定/随机套用任意渲染器都不会坏。
- CSS：`.paper--shelf .tile` 系列样式齐全；`.tile--quote` / `.t-2w` 目前无专属规则（quote 型用通用 tile 样式，现状如此，不属本次范围）。
- 当前 `files/` 内 5 个文件全部是内置卡（manifest 4 条均 `auto:false`），自动档案架实际为空——验证时需造临时测试文件。

## 拟定改动

### 1. 配置格式（data/files-manifest.json，手改）

条目新增可选 `style` 字段（只对 `auto: true` 的条目生效）：

| style 取值 | 行为 |
|---|---|
| 不写 / `"auto"` | 按内容自动判型（现状，默认） |
| `"links"` / `"list"` / `"quote"` / `"doc"` | 固定用该渲染器 |
| 如 `["list", "quote", "doc"]` | **每次刷新**从数组内随机挑一种 |
| `"random"` | 每次刷新从四种里随机挑一种 |

示例：

```json
[
  { "filename": "工具箱.md", "title": "工具箱.md", "auto": true, "style": ["list", "quote"] },
  { "filename": "随想.md", "title": "随想.md", "auto": true, "style": "quote" }
]
```

### 2. scripts/generate_manifest.py —— 保留手改的 style

- 新增 `VALID_STYLES = {"links", "list", "quote", "doc"}` 与校验函数（单值须为四种之一或 `auto`/`random`；数组须非空且每项合法）。
- 生成前先读旧 manifest（try/except，坏 JSON 静默跳过），建 `filename → 旧 style` 映射；重新生成时旧条目 `style` 合法则原样带过来（值为 `"auto"` 时不写字段，保持 manifest 干净），非法/缺失则不写。
- 其余逻辑（扫描、SPECIAL_NAMES、EXCLUDE、输出格式）不动。

### 3. js/workshop.js —— 渲染时解析 style

- 顶部（自发现卡片区块附近）新增：

```js
var AUTO_STYLES = ["links", "list", "quote", "doc"];
/* 配置 style → 生效渲染器：数组/"random" 每次加载随机；
   单值固定；不写/"auto"/非法 → null 走内容判型 */
function resolveAutoStyle(cfg) {
    var pool = [];
    if (Array.isArray(cfg)) {
        pool = cfg.filter(function (s) { return AUTO_STYLES.indexOf(s) >= 0; });
    } else if (cfg === "random") {
        pool = AUTO_STYLES;
    } else if (AUTO_STYLES.indexOf(cfg) >= 0) {
        return cfg;
    }
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}
```

- `buildAutoCard(filename, body)` → `buildAutoCard(filename, body, styleCfg)`，内部 `var type = resolveAutoStyle(styleCfg) || detectCardType(body);`，后续四种渲染分支不动。
- 调用点改为 `buildAutoCard(entry.filename, body, entry.style)`。
- 随机用 `Math.random()`，不落盘、不持久化——每次刷新独立。

### 4. README.md —— 更新「新增档案架卡片」小节

- 在现有「样式按内容自动匹配」表格后补 `style` 字段说明（取值表 + 示例 + 「重新生成会保留手改 style」「随机发生在每次刷新」两点注意）。

## 假设与决策

- 随机时机 = 每次页面加载（用户已确认）；样式集合 = 现有四种（已确认）；配置载体 = 扩展 manifest + 脚本保留手改（已确认）。
- 不给 quote 型补专属 CSS（`.tile--quote` 无规则属现状，且用户选择不加新样式）。
- `AGENTS.md` 不动——「样式按内容自动判型」仍是默认行为，配置只是覆盖入口。
- 内置卡（about/now/links/motto/daily）不受 style 影响，前端本来就只渲染 `auto:true` 条目。

## 验证步骤

1. **脚本保留验证**：手改 `data/files-manifest.json` 给某条目加 `"style": "quote"`，跑 `python scripts/generate_manifest.py`，确认该字段仍在且格式正确。
2. **渲染验证**：往 `files/` 丢临时测试文件（段落混合内容，正常判型会落 doc），manifest 配三种模式各测：
   - `"style": "quote"` → 固定便签渲染；
   - `"style": ["list", "quote"]` → 刷新多次可见两种样式切换；
   - `"style": "随便写"` → 回退按内容判型，控制台无报错。
   用 `python -m http.server 8000` + 浏览器实测（841px 视口下单列堆叠，档案架卡片照常渲染，可验证）。
3. **清理**：删除临时测试文件 → 重跑生成脚本 → `git diff` 仅剩本次三个文件的预期改动。
