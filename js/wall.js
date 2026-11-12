/* ============================================================
   wall.js —— 格子墙浪潮
   墙不再等指针：一组 sin 让每格的墨色深浅与字形随时间起伏。
   浪沿 118° 光向（左上 → 右下）推进，横向慢涌把浪头揉弯；
   波谷趁最暗换字，浪头换密字并泛青。读完是潮水漫过纸面，
   不是噪点闪烁。不与指针互动。
   渲染走精灵图 + drawImage，30fps 上限；浪出视口即停帧。
   prefers-reduced-motion：只画一帧静浪，不挂循环。
   调参在 tools/wall-tuner.html。
   ============================================================ */
(function () {
  'use strict';

  var wall = document.getElementById('wall');
  if (!wall) { return; }
  var ctx = wall.getContext('2d');
  if (!ctx) { return; }

  /* ---- 墙 ---- */
  var FULL_CELL = 24;            /* 桌面格宽 */
  var NARROW_CELL = 20;          /* < 600px 用 */
  var CELL = FULL_CELL;          /* 当前格宽，resize 时按视口定 */
  var GLYPH = 0.50;              /* 字形 / 格宽 */
  var GLYPHS = '<>/\\.,:;=+-*';
  var GLYPH_RAMP = ':-=+*#%@';   /* 浪头的密字，由淡到密 */
  var INK = '18, 23, 26';
  var CREST = '32, 101, 100';    /* 浪头泛青：色带凉端 #206564 */

  /* ---- 浪 ---- */
  var ANGLE = 118;               /* 推进方向 = 全站那束光 */
  var WAVELEN = 780;             /* 波长（px） */
  var SPEED = 0.55;              /* 相速（rad/s），浪头约 59px/s */
  var CROSS = 0.38;              /* 横向慢涌：把直浪揉出水面感 */
  var AMP = parseFloat(wall.getAttribute('data-amp')) || 0.34;
  /* 浪的透明度幅度；作品页页首矮带用 data-amp 调淡，首页不写属性走默认 */
  var BASE = 0.10;               /* 波谷还剩的墨 */
  var BAND = 0.10;               /* 静态低频薄厚（墙面的旧地色） */
  var CREST_CUT = 0.74;          /* 高于它换密字、泛青 */
  var CREST_MAX = 0.92;          /* 浪头最深处续接到的透明度 */
  var TROUGH = 0.16;             /* 低于它才换字，换字藏在最暗处 */
  var A_STEPS = 24;              /* 透明度量化档数 = 精灵图行数 */
  var FPS = 30;                  /* 浪很慢，30fps 足够 */

  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, cols = 0, rows = 0;
  var raf = 0, lastPaint = 0, tNow = 0, inView = true;

  /* 每格常量，resize 时重建 */
  var jit = null, band = null, glyphIdx = null, lastK = null, clock = null;
  var colU = null, colC = null, rowP = null;
  var atlas = null, SW = 0;
  var ux = 0, uy = 0, K = 0;
  var GCOUNT = GLYPHS.length, RCOUNT = GLYPH_RAMP.length;

  function frac(n) { return n - Math.floor(n); }

  function hash(x, y) {
    return frac(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453);
  }

  /* 精灵图：列 = 底字（墨）+ 密字（青），行 = 透明度档。
     每帧只 drawImage，不再逐格 fillText，几千格也压得住。 */
  function buildAtlas() {
    SW = CELL * dpr;
    var ncol = GCOUNT + RCOUNT;
    atlas = document.createElement('canvas');
    atlas.width = ncol * SW;
    atlas.height = A_STEPS * SW;
    var a = atlas.getContext('2d');
    a.scale(dpr, dpr);
    a.textAlign = 'center';
    a.textBaseline = 'middle';
    a.font = Math.round(CELL * GLYPH) + 'px "Cascadia Code", Consolas, ui-monospace, monospace';
    for (var r = 0; r < A_STEPS; r++) {
      var al = ((r + 0.5) / A_STEPS).toFixed(3);
      a.fillStyle = 'rgba(' + INK + ',' + al + ')';
      for (var g = 0; g < GCOUNT; g++) {
        a.fillText(GLYPHS.charAt(g), g * CELL + CELL / 2, r * CELL + CELL / 2);
      }
      a.fillStyle = 'rgba(' + CREST + ',' + al + ')';
      for (var q = 0; q < RCOUNT; q++) {
        a.fillText(GLYPH_RAMP.charAt(q), (GCOUNT + q) * CELL + CELL / 2, r * CELL + CELL / 2);
      }
    }
  }

  function resize() {
    var r = wall.getBoundingClientRect();
    if (atlas && W === r.width && H === r.height) { return; }
    W = r.width;
    H = r.height;
    CELL = W < 600 ? NARROW_CELL : FULL_CELL;
    cols = Math.max(1, Math.ceil(W / CELL));
    rows = Math.max(1, Math.ceil(H / CELL));
    wall.width = Math.round(W * dpr);
    wall.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var n = cols * rows;
    jit = new Float32Array(n);
    band = new Float32Array(n);
    glyphIdx = new Uint8Array(n);
    lastK = new Int32Array(n);
    clock = new Float32Array(n);
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var i = y * cols + x;
        var h = hash(x, y);
        jit[i] = h * 1.9;                    /* 相位去格点化 */
        /* 低频明暗：墙面有薄有厚，不是均匀噪点 */
        band[i] = BAND * (0.5 + 0.5 * Math.sin(x * 0.09) * Math.cos(y * 0.11)) * (0.4 + h * 0.6);
        glyphIdx[i] = Math.floor(h * GCOUNT) % GCOUNT;
        clock[i] = h * 9.7;                  /* 换字钟的相位，错峰 */
      }
    }

    var rad = ANGLE * Math.PI / 180;
    ux = Math.sin(rad);
    uy = -Math.cos(rad);
    K = Math.PI * 2 / Math.max(120, WAVELEN);
    colU = new Float32Array(cols);
    colC = new Float32Array(cols);
    for (var x2 = 0; x2 < cols; x2++) {
      colU[x2] = x2 * CELL * ux * K;
      colC[x2] = x2 * CELL * 0.004;
    }
    rowP = new Float32Array(rows);
    for (var y2 = 0; y2 < rows; y2++) {
      rowP[y2] = y2 * CELL * uy * K;
    }

    buildAtlas();
    paint(tNow);                             /* 任何时刻都先有一帧正确的浪 */
  }

  function paint(t) {
    ctx.clearRect(0, 0, W, H);
    var phase = SPEED * t;
    var crestSpan = 1 - CREST_CUT;
    for (var y = 0; y < rows; y++) {
      var dy = y * CELL;
      var rp = rowP[y];
      var rc = dy * 0.006 + phase * 0.37;    /* 横向慢涌随行走的部分 */
      var rowBase = y * cols;
      for (var x = 0; x < cols; x++) {
        var i = rowBase + x;
        var v = 0.5 + 0.5 * Math.sin(
          colU[x] + rp - phase +
          CROSS * Math.sin(rc + colC[x]) +
          jit[i] * 0.18
        );
        if (v < TROUGH) {
          /* 波谷换字：钟走到整点才换，藏在最暗处 */
          var ck = (phase * 0.12 + clock[i]) | 0;
          if (ck !== lastK[i]) {
            lastK[i] = ck;
            glyphIdx[i] = (frac(clock[i] * 12.9 + ck * 78.2) * GCOUNT) | 0;
          }
        }
        var a = BASE + AMP * v + band[i];
        var col;
        if (v > CREST_CUT) {
          var ct = (v - CREST_CUT) / crestSpan;
          a += ct * (CREST_MAX - a);         /* 浪头续接到近实心 */
          col = GCOUNT + Math.min(RCOUNT - 1, (ct * RCOUNT) | 0);
        } else {
          col = glyphIdx[i];
        }
        var ai = (a * A_STEPS) | 0;
        if (ai > A_STEPS - 1) { ai = A_STEPS - 1; }
        ctx.drawImage(atlas,
          col * SW, ai * SW, SW, SW,
          x * CELL, dy, CELL, CELL);
      }
    }
  }

  function frame(now) {
    raf = 0;
    if (now - lastPaint >= 1000 / FPS - 1) {
      lastPaint = now;
      tNow = now / 1000;
      paint(tNow);
    }
    if (inView) { raf = requestAnimationFrame(frame); }
  }

  function start() {
    if (REDUCED || raf || !inView) { return; }
    lastPaint = 0;
    raf = requestAnimationFrame(frame);
  }

  resize();

  if (REDUCED) { return; }                   /* 静浪一帧，不挂循环 */

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      inView = es[0].isIntersecting;
      if (inView) { start(); }
    }, { threshold: 0 }).observe(wall);
  }
  new ResizeObserver(resize).observe(wall);
}());
