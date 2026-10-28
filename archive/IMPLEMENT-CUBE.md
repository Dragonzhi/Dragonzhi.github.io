> 历史实施稿，仅供追溯；部分交互已变更，现行规则见 [DESIGN.md](../DESIGN.md)。

# IMPLEMENT · 母题立方体：SVG → WebGL2

> 给本地 Agent 的施工说明。
> 设计规则见 `DESIGN.md §7`，本文件只讲怎么落地，不复述为什么。
> 动手前先读 `AGENTS.md` 的「文档结构」与「立方体的画法」两条。

---

## 0. 一句话

把作品页水位陈列的七枚、首页签名的一枚，从「SVG 三个手涂色面」换成「WebGL2 按一个光源算出来的面」。
没有 JS、没有 WebGL、方块小于 72px 时，退回原来的 SVG，布局一个像素都不许塌。

---

## 1. 现状（先看清再动）

**作品页 `works.html`**，第 40 行起：

```html
<div class="shelf" data-shelf>
  <div class="shelf__deck">
    <span class="shelf__rule" aria-hidden="true"></span>
    <a class="shelf__cell" data-s="on" href="#w1" style="--i:0"
       data-no="01" data-name="..." data-meta="..." aria-label="...">
      <span class="shelf__cube">
        <span class="shelf__obj">
          <svg class="cube cube--live" viewBox="-1 -1 2 2" aria-hidden="true">
            <polygon class="t" points="0,-1 .866,-.5 0,0 -.866,-.5"/>
            <polygon class="l" points="-.866,-.5 0,0 0,1 -.866,.5"/>
            <polygon class="r" points=".866,-.5 .866,.5 0,1 0,0"/>
          </svg>
        </span>
      </span>
    </a>
    …共七枚…
  </div>
  <div class="shelf__read">…</div>
</div>
```

**首页 `index.html`**，第 90 行起：

```html
<div class="sign">
  <div class="stateobj" data-s="on" aria-hidden="true">
    <svg class="cube" viewBox="-1 -1 2 2">…三个 polygon…</svg>
  </div>
  <span class="sign__t">已上线 · 此刻落在线上</span>
</div>
```

**`css/site.css`** 里已经定好、本次一行都不许改的部分：

| 类 | 作用 |
|---|---|
| `.cube` | 边长 `var(--cw, 30px)` |
| `.shelf__cell[data-s="on\|air\|sunk"] .shelf__cube` | 用 `bottom` / `top` 把方块放到线上、悬空、沉下 |
| `.shelf__obj` | 入场落位动画 `settle`，`--i` 错峰 70ms |
| `.shelf__cell:hover .shelf__cube` | 抬起 `translate: -50% -14px` |
| `.stateobj[data-s="air\|sunk"] .cube` | 首页签名的两种位移 |

`.shelf` 上的尺寸变量：桌面 `--cw: 116px`，一个断点 `84px`，窄屏 `40px`。

**`js/shelf.js`** 只管读出行文案，与立方体怎么画无关，本次不动。

---

## 2. 文件动作

| 动作 | 文件 |
|---|---|
| 新增 | `js/cube.js` |
| 改 | `works.html`（七处 `<svg class="cube">`） |
| 改 | `index.html`（一处 `<svg class="cube">`） |
| 改 | `css/site.css`（只在末尾追加一段，不改已有规则） |
| 改 | `css/tokens-screen.css`（每组加一个 `--cube-base`） |
| 不改 | `js/shelf.js`、纸材质子页、`seal.js` |

---

## 3. `js/cube.js` 写什么

零依赖，IIFE 包裹，不用模块语法（仓库无构建工具，脚本以 `<script defer>` 引入）。

### 3.1 自动扫描

```js
document.querySelectorAll('[data-cube-host]').forEach(init)
```

在 HTML 里给每个要升级的容器打上 `data-cube-host`，JS 发现它就跑，发现不了就什么也不做，SVG 留在原地。

### 3.2 单实例初始化顺序

1. 读容器当前的 `--cw`（`getComputedStyle`），**小于 72px 直接返回，不升级**。
2. 读状态色基色 `--cube-base`（见 §5）。
3. `document.createElement('canvas')`，CSS 宽高设成 `--cw`，像素宽高乘 `devicePixelRatio`（上限 2）。
4. 取 `webgl2`，取不到就 `return`，SVG 原样留着。
5. 编译着色器、上传几何、画一帧。
6. 画成功后 `svg.hidden = true`，把 canvas 插进同一个容器。

**顺序很重要**：先画成一帧，再隐藏 SVG。中途任何一步失败，页面保持原状。

### 3.3 几何

立方体边长 1，中心在原点。

24 个顶点（六面各四个），每顶点带法线，索引 36。照抄下面这份：

```js
const P = [
  [-.5,-.5, .5],[ .5,-.5, .5],[ .5, .5, .5],[-.5, .5, .5], // +Z
  [ .5,-.5,-.5],[-.5,-.5,-.5],[-.5, .5,-.5],[ .5, .5,-.5], // -Z
  [ .5,-.5, .5],[ .5,-.5,-.5],[ .5, .5,-.5],[ .5, .5, .5], // +X
  [-.5,-.5,-.5],[-.5,-.5, .5],[-.5, .5, .5],[-.5, .5,-.5], // -X
  [-.5, .5, .5],[ .5, .5, .5],[ .5, .5,-.5],[-.5, .5,-.5], // +Y
  [-.5,-.5,-.5],[ .5,-.5,-.5],[ .5,-.5, .5],[-.5,-.5, .5]  // -Y
];
const N = [
  [0,0,1],[0,0,1],[0,0,1],[0,0,1],
  [0,0,-1],[0,0,-1],[0,0,-1],[0,0,-1],
  [1,0,0],[1,0,0],[1,0,0],[1,0,0],
  [-1,0,0],[-1,0,0],[-1,0,0],[-1,0,0],
  [0,1,0],[0,1,0],[0,1,0],[0,1,0],
  [0,-1,0],[0,-1,0],[0,-1,0],[0,-1,0]
];
// 索引：每组四个顶点两个三角
for (let i = 0; i < 24; i += 4) idx.push(i,i+1,i+2, i,i+2,i+3);
```

### 3.4 着色器

顶点着色器。**法线必须走 `uNrm`（模型的旋转部分），不要用 `uMVP` 的 mat3**，因为正交投影的 z 缩放不均匀，会把法线方向带歪。

```glsl
#version 300 es
in vec3 aPos;
in vec3 aNor;
uniform mat4 uMVP;
uniform mat3 uNrm;
out vec3 vN;
void main(){ vN = uNrm * aNor; gl_Position = uMVP * vec4(aPos, 1.0); }
```

片元着色器。方向光 + 环境项 + sRGB 线性化，哑光，无高光无反射。

```glsl
#version 300 es
precision highp float;
in vec3 vN;
uniform vec3 uBase;
out vec4 outColor;
void main(){
  vec3 n = normalize(vN);
  vec3 l = normalize(vec3(-0.52, 0.72, 0.46));
  float lam = max(dot(n, l), 0.0);
  lam = pow(lam, 0.85);
  vec3 base = pow(uBase, vec3(2.2));
  vec3 c = base * (0.13 + lam * 0.94) + base * 0.05;
  outColor = vec4(pow(c, vec3(1.0/2.2)), 1.0);
}
```

### 3.5 矩阵

列主序 `Float32Array(16)`。三个函数：`rotX`、`rotY`、`ortho`。

```js
function ortho(l,r,b,t,n,f){
  const m = new Float32Array(16);
  m[0]=2/(r-l); m[5]=2/(t-b); m[10]=-2/(f-n);
  m[12]=-(r+l)/(r-l); m[13]=-(t+b)/(t-b); m[14]=-(f+n)/(f-n); m[15]=1;
  return m;
}
```

**角度与范围（照抄，别自己调）：**

| 参数 | 值 |
|---|---|
| 俯仰 `ISO_X` | `+35.264°` |
| 偏航 `ISO_Y` | `+45°` |
| 正交范围 | `ortho(-0.94, 0.94, -0.94, 0.94, -10, 10)` |

立方体边长 1、等轴测投影下来是个正六边形，宽 `√2 ≈ 1.414`、高 `√3 ≈ 1.732`。`±0.94` 让它刚好铺满画布、四周留一指白。

### 3.6 渲染设置

```js
gl.clearColor(0,0,0,0);          // 透明，背景交给 CSS
gl.enable(gl.DEPTH_TEST);
gl.disable(gl.CULL_FACE);        // 见 §6 第 1 条
```

Canvas 用 `getContext('webgl2', { antialias:true, alpha:true, premultipliedAlpha:false })`。

### 3.7 一次渲染，不跑循环

**七枚水位不做任何持续绘制。** 初始化时画一帧就结束。落位、抬起、hover 全部由现有 CSS 在外层容器上做，GPU 零开销。

**只有首页签名那一枚**支持拖动旋转：`pointerdown` 记起点，`pointermove` 改 yaw/pitch 并在 `requestAnimationFrame` 里重画，`pointerup` 停手。松手后停在当前角度，**不自动回位、不自转、不呼吸**。

---

## 4. HTML 怎么改

七枚水位，把 `<svg class="cube">` 外面那层 `<span class="shelf__obj">` 加上 `data-cube-host`：

```html
<span class="shelf__obj" data-cube-host>
  <svg class="cube cube--live" viewBox="-1 -1 2 2" aria-hidden="true">…</svg>
</span>
```

首页签名同样：

```html
<div class="stateobj" data-s="on" aria-hidden="true" data-cube-host>
  <svg class="cube" viewBox="-1 -1 2 2">…</svg>
</div>
```

拖动只给首页签名，加 `data-cube-drag`：

```html
<div class="stateobj" data-s="on" data-cube-host data-cube-drag aria-hidden="true">
```

`aria-hidden`、`data-s`、`--i`、`href`、`data-no/name/meta` 全部不动。

在 `works.html` 与 `index.html` 的 `</body>` 前加 `<script src="js/cube.js" defer></script>`（`works.html` 放在 `shelf.js` 之前或之后都行，两者互不依赖）。

---

## 5. CSS 与 token 怎么改

### 5.1 新加基色

`css/tokens-screen.css` 里，三组立方体色各补一个基色。初值取该组 `--cube-left` 的值：

```css
--cube-base: <现有 --cube-left 的值>;
--cube-live-base: <现有 --cube-live-left 的值>;
--cube-sunk-base: <现有 --cube-sunk-left 的值>;
```

`--cube-top/left/right` 三组**保留不动**，SVG 降级时还要用。

### 5.2 追加画布样式

`css/site.css` 末尾追加，不改任何已有规则：

```css
/* WebGL 升级后顶替 SVG 的画布 */
.shelf__obj > canvas.cube,
.stateobj > canvas.cube {
  display: block;
  width: var(--cw, 30px);
  height: var(--cw, 30px);
}

/* 冷白底上的接触影：浅底下影子是物理事实，不是装饰 */
.shelf__obj { position: relative; }
.shelf__obj::after,
.stateobj::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -0.04em;
  width: 66%;
  height: 9%;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, rgba(18,23,26,.18), transparent 70%);
  filter: blur(2px);
  pointer-events: none;
  z-index: -1;
}
```

注意 `.stateobj` 已经有一个 `::after` 画地平线（`border-bottom` 那条），改名或改用 `::before`，别覆盖掉。**优先用 `::before`。**

---

## 6. 坑（都是我踩过的，照着躲）

1. **背面剔除会把立方体整个剔光。** 你这套角度下某些旋转会让三角形绕序反过来，`CULL_FACE` 一开就是一片空白，且不报错。直接 `gl.disable(gl.CULL_FACE)`，靠深度测试。
2. **法线不能用 `uMVP` 的 mat3 变换。** 正交投影矩阵里 x/y 和 z 的缩放不同，取 mat3 会把法线带歪，明暗看着「说不出来哪里不对」。单独传一个只含旋转的 `uNrm`。
3. **俯仰角符号反了会看到底面。** 用 `+35.264°`。用负数时立方体照样画得出来，只是你看到的是底部，很容易误以为「还行」。
4. **着色器里 `out` 变量重复声明会整份编译失败。** 报错信息在 `getShaderInfoLog` 里，别吞掉，把它 `console.error` 出来。
5. **正交范围直接决定视觉大小。** `±0.94` 时六边形刚好铺满。改了这个数字，方块要么变小要么出界。
6. **canvas 尺寸要乘 `devicePixelRatio`，CSS 尺寸由 `--cw` 决定。** 只设 CSS 不设 `canvas.width` 会糊成一团。
7. **`alpha:true` + `clearColor(0,0,0,0)`**，背景透明交给 CSS 渐变，否则方块周围会有一块白。
8. **`prefers-reduced-motion` 下不要有任何自动运动。** 本方案默认就是静态的，只需确认拖动仍可用（拖动是用户动作，不算动效）。

---

## 7. 验收

- [ ] 作品页七枚立方体渲染出来，位置（在线上 / 悬空 / 沉下）、悬停抬起、读出行联动与现在完全一致。
- [ ] 首页签名那一枚渲染出来，能拖动旋转，松手停住。
- [ ] 七枚里在跑的是青色，在制是灰，归档是更淡的灰，与 SVG 版颜色观感一致。
- [ ] 每枚方块下方有柔和接触影，不挡地平线。
- [ ] **关掉 JS**：七枚 SVG 照常显示、位置正确、读出行显示首块。布局不塌。
- [ ] **禁用 WebGL**（`chrome://flags` 关掉硬件加速，或临时在 `getContext` 前返回 null）：同 JS 关闭。
- [ ] **窄屏 390 / 320**：`--cw` 降到 72 以下时走 SVG，观感不跳。
- [ ] 1440 / 1024 / 768 / 390 / 320 五档无横向溢出。
- [ ] 页面截图转灰度，七枚的明暗层级仍然分得开。
- [ ] 控制台无 WebGL 警告与着色器错误。
- [ ] 页面体积：`js/cube.js` 不超过 6KB 未压缩，不新增任何第三方文件。

---

## 8. 红线

1. **不引 Three.js、不引任何库。** 裸 WebGL2，与仓库「首页与作品页零依赖」的约定一致。
2. **不改 `.shelf` 的定位逻辑**：`--h` / `--line` / `--cw` / `--lift` / `--dip`、`data-s` 三态、`bottom`/`top` 的取值，一律不动。
3. **不改 `js/shelf.js`**，读出行是另一件事。
4. **不动纸材质子页**（档案架 / 履历 / 画廊 / 洛天依）与 `seal.js` 那枚 three.js 印章，两者与屏上母题无关。
5. **不动 `<title>`、备案号、`legacy/`、`LICENSE`。**
6. **不自行 `git commit`。** 改完跑验收，把结果贴给用户，等明确授权。

---

## 9. 做完之后

- 在 `TASKS.md` 的「母题」小节把对应条目打勾。
- 把实测数据补进来：七枚实渲的观感、72px 门槛是否站得住、`js/cube.js` 的实际体积。
- 如果 72px 门槛被证伪，改 `DESIGN.md §7.3` 的数字，并在 `DECISIONS.md` 记一条。
