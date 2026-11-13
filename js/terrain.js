/* ============================================================
   terrain.js —— 首页背景：程序化黑洞
   不加载任何图片。每个格子按极坐标算一个密度：
     中心事件视界 = 空白（主名压在这里，对比最强）
     外面一圈细亮的光子环 = 最密的字
     再外面是压扁的吸积盘，亮度往外衰减，一侧更亮（多普勒）
   密度映射到 97 级字符阶梯，盘的湍流纹理随时间缓慢旋转，
   整片再加一层很轻的呼吸（只动密度，不动颜色）。
   颜色以墨色为底：盘偏暖，环偏青，星点是中性墨。
   30fps；出视口或页面隐藏停帧；prefers-reduced-motion 只画一帧。
   ============================================================ */
(function () {
  'use strict';

  var cv = document.getElementById('wall');
  if (!cv) { return; }
  var ctx = cv.getContext('2d');
  if (!ctx) { return; }

  /* 97 级密度阶梯，从空到最重 */
  var RAMP = " `.-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@";

  /* ---- 黑洞形状（都以画布短边的一半为 1）----
     正交投影 + 倾斜视角：黑洞是正圆，吸积盘按倾角压成椭圆，
     没有透视收缩，盘的内外圈等宽。 */
  var HOLE_R = 0.54;             /* 事件视界半径 */
  var RING_R = 0.60;             /* 光子环半径，紧贴黑心 */
  var RING_W = 0.042;            /* 光子环半宽 */
  var DISK_IN = 0.62;            /* 吸积盘内缘 */
  var DISK_OUT = 1.45;           /* 吸积盘外缘 */
  var DISK_TILT = 0.45;          /* 盘的纵向压缩，1 = 正面，0 = 正侧 */
  var DOPPLER = 0.45;            /* 盘面一侧更亮 */
  var SPIN = 0.35;               /* 盘面纹理旋转速度 */
  var BREATH = 0.10;             /* 全局呼吸幅度 */

  var FPS = 30;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 字号与格宽随视口走；格宽取等宽字 0.6em 的整数近似 */
  var FONT = 13, CW = 8, CH = 13;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, cols = 0, rows = 0, n = 0;
  var density = null, diskK = null, diskA = null, hole = null, colorStr = null;
  var built = false;
  var raf = 0, last = 0, inView = true;

  function frac(v) { return v - Math.floor(v); }

  function hash(x, y) {
    return frac(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453);
  }

  /* 把黑洞算进格子：静态形状 + 每盘格的相位。每帧只更新相位和呼吸。
     坐标按像素归一化（不是格子数）——格宽 8、格高 13，
     用格子数会让正圆被拉成竖椭圆。 */
  function build() {
    var halfW = W / 2;
    var halfH = H / 2;
    var scale = Math.max(1, Math.min(halfW, halfH));
    var i, x, y;

    for (y = 0; y < rows; y++) {
      var ny = (y * CH + CH / 2 - halfH) / scale;
      var rb = y * cols;
      for (x = 0; x < cols; x++) {
        i = rb + x;
        var nx = (x * CW + CW / 2 - halfW) / scale;
        var r = Math.sqrt(nx * nx + ny * ny);

        var d = 0, k = 0, ph = 0, tone = 0;

        /* 星点：极稀疏，给黑心外的空白一点质感 */
        if (hash(x * 3.1, y * 7.7) > 0.9982) { d = 0.20; }

        /* 吸积盘：正交投影下的椭圆环，纵向按倾角压扁。
           没有透视，所以内外圈等宽；一侧因多普勒更亮。 */
        var ey = ny / DISK_TILT;
        var rd = Math.sqrt(nx * nx + ey * ey);
        if (rd > DISK_IN && rd < DISK_OUT) {
          var tt = (rd - DISK_IN) / (DISK_OUT - DISK_IN);
          var disk = Math.pow(1 - tt, 1.8);
          disk *= 1 + DOPPLER * (nx / Math.max(0.001, r));
          if (disk > 1) { disk = 1; }
          if (disk > d) {
            d = disk;
            k = disk;
            ph = Math.atan2(ey, nx) * 9 + rd * 14;
            tone = 1;
          }
        }

        /* 光子环：一圈细的亮线，字符最密 */
        var dr = (r - RING_R) / RING_W;
        var ring = Math.exp(-dr * dr);
        if (ring > d) { d = ring; k = 0; tone = 2; }

        /* 事件视界吃掉一切 */
        if (r < HOLE_R) { d = 0; k = 0; tone = 0; hole[i] = 1; } else { hole[i] = 0; }

        density[i] = d;
        diskK[i] = k;
        diskA[i] = ph;

        var cr = 18, cg = 23, cb = 26;
        if (tone === 1) { cr = 58; cg = 34; cb = 16; }        /* 盘：暖褐 */
        else if (tone === 2) { cr = 6; cg = 46; cb = 56; }    /* 环：青 */
        var al = (0.32 + d * 0.58).toFixed(2);
        colorStr[i] = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + al + ')';
      }
    }
    built = true;
    paint(REDUCED ? 1.2 : performance.now() / 1000);
  }

  function resize() {
    W = cv.clientWidth;
    H = cv.clientHeight;
    if (!W || !H) { return; }

    var narrow = window.innerWidth < 700;
    FONT = narrow ? 11 : 13;
    CW = narrow ? 7 : 8;
    CH = FONT;

    var nc = Math.max(1, Math.ceil(W / CW));
    var nr = Math.max(1, Math.ceil(H / CH));
    if (nc === cols && nr === rows && built) { return; }

    cols = nc;
    rows = nr;
    n = cols * rows;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    density = new Float32Array(n);
    diskK = new Float32Array(n);
    diskA = new Float32Array(n);
    hole = new Uint8Array(n);
    colorStr = new Array(n);

    build();
  }

  function paint(t) {
    ctx.clearRect(0, 0, W, H);
    var len = RAMP.length - 1;
    var spin = t * SPIN;
    var i, x, y;

    ctx.font = FONT + 'px "Cascadia Code", Consolas, ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (y = 0; y < rows; y++) {
      var ny = y / rows;
      var dy = y * CH + CH / 2;
      var rowBase = y * cols;
      for (x = 0; x < cols; x++) {
        i = rowBase + x;
        if (hole[i]) { continue; }
        /* 只有盘、环、星点才画；空白就是空白，不让呼吸漏出碎字 */
        if (density[i] <= 0.002) { continue; }

        var v = density[i];

        /* 盘面的湍流：转的是纹理，不是形状 */
        if (diskK[i] > 0) {
          v = density[i] * (0.82 + 0.18 * Math.sin(diskA[i] - spin));
        }

        /* 很轻的呼吸，只动密度 */
        var nx = x / cols;
        var w1 = Math.sin(nx * 3.0 + t * 0.60) * 0.5 + 0.5;
        var w2 = Math.sin(ny * 2.5 + nx * 1.0 + t * 0.45) * 0.5 + 0.5;
        var w3 = Math.sin((nx + ny) * 4.0 + t * 0.35) * 0.5 + 0.5;
        var w = w1 * 0.55 + w2 * 0.25 + w3 * 0.2;
        v += (w - 0.5) * BREATH;

        if (v <= 0.01) { continue; }
        if (v > 1) { v = 1; }

        var ci = (v * len + 0.5) | 0;
        if (ci < 0) { ci = 0; } else if (ci > len) { ci = len; }
        var ch = RAMP.charAt(ci);
        if (ch === ' ') { continue; }

        ctx.fillStyle = colorStr[i];
        ctx.fillText(ch, x * CW + CW / 2, dy);
      }
    }
  }

  function frame(now) {
    raf = 0;
    if (now - last >= 1000 / FPS - 1) {
      last = now;
      paint(now / 1000);
    }
    if (inView) { raf = requestAnimationFrame(frame); }
  }

  function start() {
    if (REDUCED || raf || !inView) { return; }
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  resize();

  if (REDUCED) { return; }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      inView = es[0].isIntersecting;
      if (inView) { start(); }
    }, { threshold: 0 }).observe(cv);
  }
  start();

  document.addEventListener('visibilitychange', function () {
    inView = !document.hidden;
    if (inView) { start(); }
  });

  new ResizeObserver(function () { resize(); }).observe(cv);
}());
