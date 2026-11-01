/* ============================================================
   wall.js —— 格子墙 + 指针色块（lab）
   墙：一次画完，3200 个字形不进循环。
   色块：指针附近加一团热，按帧衰减；热降到阈值以下就停帧。
   色相跟热度走：刚碰到的格子是朱砂，凉下来变青绿——红是「刚发生」，青绿是「已经冷掉的介质」。
   prefers-reduced-motion：只画墙，不挂指针。
   ============================================================ */
(function () {
  'use strict';

  var wall = document.getElementById('wall');
  var ink = document.getElementById('ink');
  if (!wall || !ink) { return; }

  var wctx = wall.getContext('2d');
  var ictx = ink.getContext('2d');

  var CELL = 18;                 /* 格子边长 */
  var GLYPHS = '<>/\\.,:;=+-*';
  var INK = '18, 23, 26';
  var FILL = '#00827F';          /* 凉下来的青绿 */
  var HOT = '#8B2C1F';           /* 刚被碰到的朱砂 */
  var DECAY = 0.94;              /* 每帧余热；越小尾巴越短 */
  var CUT = 0.12;                /* 出块阈值 */
  var HOT_CUT = 0.6;             /* 高于它才是红的；越小红的拖头越长 */
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, cols = 0, rows = 0;
  var heat = null;
  var raf = 0, moved = false, pointerIn = false;
  var px = -999, py = -999;

  function hash(x, y) {
    var n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }

  function drawWall() {
    wctx.clearRect(0, 0, W, H);
    wctx.font = Math.round(CELL * 0.56) + 'px "Cascadia Code", Consolas, ui-monospace, monospace';
    wctx.textAlign = 'center';
    wctx.textBaseline = 'middle';
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var h = hash(x, y);
        /* 低频明暗：墙面有薄有厚，不是均匀噪点 */
        var band = 0.5 + 0.5 * Math.sin(x * 0.09) * Math.cos(y * 0.11);
        var a = 0.04 + band * 0.09 * (0.4 + h * 0.6);
        wctx.fillStyle = 'rgba(' + INK + ',' + a.toFixed(3) + ')';
        wctx.fillText(GLYPHS.charAt(Math.floor(h * GLYPHS.length)), x * CELL + CELL / 2, y * CELL + CELL / 2);
      }
    }
  }

  function resize() {
    var r = wall.getBoundingClientRect();
    W = r.width;
    H = r.height;
    CELL = W < 600 ? 12 : 18;      /* 窄屏用小格，否则一块盖住半个字 */
    cols = Math.ceil(W / CELL);
    rows = Math.ceil(H / CELL);

    var list = [wall, ink];
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
      c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    heat = new Float32Array(cols * rows);
    drawWall();
    if (REDUCED) { return; }
    ictx.clearRect(0, 0, W, H);
  }

  function poke() {
    var R = 3.2;
    var cx = px / CELL, cy = py / CELL;
    var x0 = Math.max(0, Math.floor(cx - R - 1));
    var x1 = Math.min(cols - 1, Math.ceil(cx + R + 1));
    var y0 = Math.max(0, Math.floor(cy - R - 1));
    var y1 = Math.min(rows - 1, Math.ceil(cy + R + 1));
    for (var y = y0; y <= y1; y++) {
      for (var x = x0; x <= x1; x++) {
        var dx = x - cx, dy = y - cy;
        var d = Math.sqrt(dx * dx + dy * dy);
        /* 半径按格子噪声浮动，边缘才是团状而不是正圆 */
        var v = 1 - d / (R + hash(x, y) * 1.6);
        if (v > 0) {
          var i = y * cols + x;
          heat[i] = Math.min(1, heat[i] + v * 0.75);
        }
      }
    }
  }

  function paint() {
    ictx.clearRect(0, 0, W, H);
    var painted = 0;
    /* 两遍：先青绿，再朱砂盖上去。红的格子不先铺底，否则红里会透青。 */
    for (var pass = 0; pass < 2; pass++) {
      var hot = pass === 1;
      var min = hot ? HOT_CUT : CUT;
      ictx.fillStyle = hot ? HOT : FILL;
      for (var y = 0; y < rows; y++) {
        var row = y * cols;
        for (var x = 0; x < cols; x++) {
          var h = heat[row + x];
          if (h <= min) { continue; }
          if (!hot && h > HOT_CUT) { continue; }
          /* 单次掠过就要读成实心，只有最外一圈半透明 */
          ictx.globalAlpha = Math.min(0.96, 0.18 + h * 1.15);
          ictx.fillRect(x * CELL + 0.5, y * CELL + 0.5, CELL - 1, CELL - 1);
          painted++;
        }
      }
    }
    ictx.globalAlpha = 1;
    return painted;
  }

  function frame() {
    raf = 0;
    var alive = 0;
    for (var i = 0; i < heat.length; i++) {
      heat[i] *= DECAY;
      if (heat[i] < 0.02) {
        heat[i] = 0;
      } else if (heat[i] > CUT) {
        alive++;
      }
    }
    if (moved) { poke(); moved = false; }
    var painted = paint();
    /* 只按「还有东西要画」继续；指针停在页面里不算，否则就成常驻空转 */
    if (painted > 0 || alive > 0) {
      raf = requestAnimationFrame(frame);
    }
  }

  function start() {
    if (REDUCED || raf) { return; }
    raf = requestAnimationFrame(frame);
  }

  function onMove(e) {
    var r = wall.getBoundingClientRect();
    px = e.clientX - r.left;
    py = e.clientY - r.top;
    pointerIn = px >= 0 && py >= 0 && px <= W && py <= H;
    if (pointerIn) { moved = true; start(); }
  }

  resize();
  if (REDUCED) { return; }

  new ResizeObserver(resize).observe(wall);
  window.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('mouseleave', function () { pointerIn = false; });
  window.addEventListener('blur', function () { pointerIn = false; });
}());
