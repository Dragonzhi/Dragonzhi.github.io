/* ============================================================
   wall.js —— 字符海
   海面是一张空白的纸。浪是一道从左上推向右下的锋，
   浪本身不显示成任何符号：它推过一格，就在那一格写下一个字，
   字淡入、停留一会儿、再淡出到完全看不见，纸面重新空出来，
   等下一道浪来再写。已经写下的词片段同理，和散字共用同一套生死。

   浪的形状不是画出来的亮带，而是「刚写下的字」本身：
   锋后一串字正在变实，锋前还是空白，像潮水在沙滩上写字。

   字母表：格宽、波长、推进方向、相速、透明度全站一致，只换字。
   每套字母表自带一张词表。散字负责质感，词负责语义；
   中文只走词层，不进散字池 —— 汉字在等宽方格里字面撑满，
   整片排下来会读成竹简，拉丁才有宽窄与升降部的疏密。

   墙上的 data-alphabet 选字母表；页面上有几个带 data-alphabet 的区块，
   滚到哪个就换哪套字。换字母表时沿浪的方向逐格替换，不是硬切。

   渲染走精灵图 + drawImage，30fps 上限；浪出视口即停帧。
   prefers-reduced-motion：只画一帧，全部字以最实的亮度静止。
   ============================================================ */
(function () {
  'use strict';

  var wall = document.getElementById('wall');
  if (!wall) { return; }
  var ctx = wall.getContext('2d');
  if (!ctx) { return; }

  /* ---- 字母表：同一片海，换一套字 ----
     每套取一个页面的关键词当字符池，不是随手抓的符号。
     glyph 是散字字号 / 格宽，拉丁等宽字 0.50 就够。
     词表里的字可以超出散字池（中文只走词层）。 */
  var ALPHABETS = {
    ink: {
      glyphs: '<>/\\.,:;=+-*',
      words: [],
      font: '"Cascadia Code", Consolas, ui-monospace, monospace',
      glyph: 0.50
    },
    self: {
      /* ZLOONG + 66CCFF + 代码符号；词是他的身份、工具与爱好 */
      glyphs: 'ZLONG6CF<>/_',
      words: ['ZLOONG', '66CCFF', 'GODOT', 'GDScript', '洛天依', '方块', '游戏', '代码'],
      font: '"Cascadia Code", Consolas, "PingFang SC", "Microsoft YaHei", monospace',
      glyph: 0.50
    }
  };
  var DEFAULT_ALPHA = 'ink';
  var SWAP_SPREAD = 1.15;        /* 换字母表时逐格过渡的总时长（秒） */

  /* ---- 墙 ---- */
  var FULL_CELL = 24;            /* 桌面格宽 */
  var NARROW_CELL = 20;          /* < 600px 用 */
  var CELL = FULL_CELL;          /* 当前格宽，resize 时按视口定 */
  var INK = '18, 23, 26';
  var CREST = '32, 101, 100';    /* 刚写下的字泛青：色带凉端 #206564 */

  /* ---- 浪 ---- */
  var ANGLE = 118;               /* 推进方向 = 全站那束光 */
  var WAVELEN = 780;             /* 底层连续起伏的波长（px） */
  var WAVE_SPEED = 230;          /* 浪锋速度（px/s，沿推进方向） */
  var WAVE_GAP = 520;            /* 两道浪之间的空档（px） */
  var WAVE_FRONT_W = 105;        /* 锋前的坡半宽（px） */
  var WAVE_TAIL_W = 280;         /* 锋后的水痕半宽（px） */
  var SWELL = 0.22;              /* 水面底下那层很轻的连续起伏 */
  var CROSS = 0.38;              /* 横向慢涌：把直的浪锋揉弯 */
  var TRIGGER = 0.40;            /* 浪锋推到这么亮，这一格被写下 */
  var REARM = 0.06;              /* 浪退到这么暗，重新武装，等下一道 */
  var A_STEPS = 24;              /* 透明度量化档数 = 精灵图行数 */
  var FPS = 30;                  /* 浪很慢，30fps 足够 */

  /* ---- 一个字的生死：写下 → 淡入 → 停留 → 淡出到完全透明 ---- */
  var PEAK = 0.62;               /* 刚写完、停留时的最深墨 */
  var FADE_IN = 0.55;            /* 淡入（秒） */
  var HOLD = 1.60;               /* 停留（秒） */
  var FADE_OUT = 1.90;           /* 淡出（秒） */
  var LIFE = FADE_IN + HOLD + FADE_OUT;
  var FRESH_TIME = 1.50;         /* 新字从青褪回墨的时长（秒） */

  /* ---- 词层 ---- */
  var WORD_GLYPH = 0.56;         /* 词字号 / 格宽，比散字大一档 */
  var WORD_CUT = 0.55;           /* 段内最高浪高过它，这段被浪推到 */
  var WORD_RATE = 0.40;          /* 被推到时写成词的概率，其余时候写散字 */
  var WORD_LINES = 0.45;         /* 有词的行占多少，其余行全是散字 */
  var WORD_SKIP = 0.52;          /* 行内留白概率，词与词之间要断开 */

  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, cols = 0, rows = 0, cells = 0;
  var raf = 0, lastPaint = 0, tNow = 0, inView = true;

  /* 每格常量，resize 时重建 */
  var birth = null, wordBorn = null, armed = null, clock = null, swapAt = null;
  var slotId = null, slotCol = null;
  var colDist = null, rowDist = null, colU = null, colC = null, rowP = null;
  var ux = 0, uy = 0, K = 0, uSpan = 1, cycle = 1;

  var alphaName = wall.getAttribute('data-alphabet') || DEFAULT_ALPHA;
  var cur = null;                /* 正在用的精灵图 */
  var next = null;               /* 换到一半的目标图 */
  var swapEnd = 0;
  var slots = [];                /* 词片段：位置固定，每次浪过决定写词还是写散字 */

  function frac(n) { return n - Math.floor(n); }

  function hash(x, y) {
    return frac(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453);
  }

  /* 精灵图：每字两版，左半墨、右半青，行 = 透明度档。
     词另起一张图：只收词表里去重后的字，字号大一档，同样墨 / 青两版。
     每帧只 drawImage，不再逐格 fillText，几千格也压得住。 */
  function buildAtlas(name, count) {
    var def = ALPHABETS[name] || ALPHABETS[DEFAULT_ALPHA];
    var sw = CELL * dpr;
    var g = def.glyphs;
    var gc = g.length;
    var cv = document.createElement('canvas');
    cv.width = gc * 2 * sw;
    cv.height = A_STEPS * sw;
    var a = cv.getContext('2d');
    a.scale(dpr, dpr);
    a.textAlign = 'center';
    a.textBaseline = 'middle';
    a.font = Math.round(CELL * def.glyph) + 'px ' + def.font;
    for (var i = 0; i < A_STEPS; i++) {
      var al = ((i + 0.5) / A_STEPS).toFixed(3);
      a.fillStyle = 'rgba(' + INK + ',' + al + ')';
      for (var j = 0; j < gc; j++) {
        a.fillText(g.charAt(j), j * CELL + CELL / 2, i * CELL + CELL / 2);
      }
      a.fillStyle = 'rgba(' + CREST + ',' + al + ')';
      for (var q = 0; q < gc; q++) {
        a.fillText(g.charAt(q), (gc + q) * CELL + CELL / 2, i * CELL + CELL / 2);
      }
    }

    /* 词图：词表里出现过的字，去重后按出现顺序排成列 */
    var wl = def.words || [];
    var order = [], seen = {};
    for (var wi = 0; wi < wl.length; wi++) {
      var text = wl[wi];
      for (var wk = 0; wk < text.length; wk++) {
        var ch = text.charAt(wk);
        if (!seen[ch]) { seen[ch] = 1; order.push(ch); }
      }
    }
    var wc = order.length;
    var wordCanvas = null, wordMap = null;
    if (wc) {
      wordCanvas = document.createElement('canvas');
      wordCanvas.width = wc * 2 * sw;
      wordCanvas.height = A_STEPS * sw;
      var wa = wordCanvas.getContext('2d');
      wa.scale(dpr, dpr);
      wa.textAlign = 'center';
      wa.textBaseline = 'middle';
      wa.font = Math.round(CELL * WORD_GLYPH) + 'px ' + def.font;
      for (var wr = 0; wr < A_STEPS; wr++) {
        var wal = ((wr + 0.5) / A_STEPS).toFixed(3);
        wa.fillStyle = 'rgba(' + INK + ',' + wal + ')';
        for (var wm = 0; wm < wc; wm++) {
          wa.fillText(order[wm], wm * CELL + CELL / 2, wr * CELL + CELL / 2);
        }
        wa.fillStyle = 'rgba(' + CREST + ',' + wal + ')';
        for (var wn = 0; wn < wc; wn++) {
          wa.fillText(order[wn], (wc + wn) * CELL + CELL / 2, wr * CELL + CELL / 2);
        }
      }
      wordMap = {};
      for (var wp = 0; wp < wc; wp++) { wordMap[order[wp]] = wp; }
    }

    var idx = new Uint8Array(count);
    for (var k = 0; k < count; k++) {
      idx[k] = (frac(Math.sin((k + 1) * 12.9898) * 43758.5453) * gc) | 0;
    }
    return {
      canvas: cv, sw: sw, gc: gc, idx: idx,
      wordCanvas: wordCanvas, wordMap: wordMap, wordCount: wc
    };
  }

  /* 词布局：横向占 N 格，一格一字，不跨行；词之间留空，行尾放不下就整词不放。
     大部分行没有词。位置固定，每次浪过时决定这一段写词还是写散字。 */
  function layoutWords(sheet) {
    slots.length = 0;
    slotId.fill(0);
    slotCol.fill(0);
    if (!sheet || !sheet.wordMap) { return; }
    var def = ALPHABETS[alphaName] || ALPHABETS[DEFAULT_ALPHA];
    var list = def.words || [];
    if (!list.length) { return; }

    for (var y = 0; y < rows; y++) {
      if (hash(y, 3) > WORD_LINES) { continue; }
      var x = (hash(y, 7) * 7) | 0;
      while (x < cols) {
        var text = list[(hash(y * 5 + x, 11) * list.length) | 0];
        var len = text.length;
        if (x + len > cols) { break; }
        if (hash(y * 9 + x, 17) < WORD_SKIP) {
          x += 2 + ((hash(y * 2 + x, 19) * 7) | 0);
          continue;
        }
        var id = slots.length + 1;
        var slot = { row: y, c0: x, len: len, text: text, peak: 0, armed: 1, mode: 0 };
        for (var k = 0; k < len; k++) {
          var i = y * cols + x + k;
          var col = sheet.wordMap[text.charAt(k)];
          slotId[i] = id;
          slotCol[i] = col === undefined ? 0 : col;
        }
        slots.push(slot);
        x += len + 2 + ((hash(y * 4 + x, 23) * 9) | 0);
      }
    }
  }

  function resize() {
    var r = wall.getBoundingClientRect();
    if (cur && W === r.width && H === r.height) { return; }
    W = r.width;
    H = r.height;
    CELL = W < 600 ? NARROW_CELL : FULL_CELL;
    cols = Math.max(1, Math.ceil(W / CELL));
    rows = Math.max(1, Math.ceil(H / CELL));
    cells = cols * rows;
    wall.width = Math.round(W * dpr);
    wall.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    birth = new Float32Array(cells);
    birth.fill(-99);
    wordBorn = new Uint8Array(cells);
    armed = new Uint8Array(cells);
    armed.fill(1);
    clock = new Float32Array(cells);
    swapAt = new Float32Array(cells);
    slotId = new Uint16Array(cells);
    slotCol = new Uint16Array(cells);
    for (var i = 0; i < cells; i++) {
      clock[i] = hash(i % cols, (i / cols) | 0) * 9.7;
    }

    var rad = ANGLE * Math.PI / 180;
    ux = Math.sin(rad);
    uy = -Math.cos(rad);
    K = Math.PI * 2 / Math.max(120, WAVELEN);
    colDist = new Float32Array(cols);
    colU = new Float32Array(cols);
    colC = new Float32Array(cols);
    for (var x2 = 0; x2 < cols; x2++) {
      colDist[x2] = x2 * CELL * ux;
      colU[x2] = colDist[x2] * K;
      colC[x2] = x2 * CELL * 0.004;
    }
    rowDist = new Float32Array(rows);
    rowP = new Float32Array(rows);
    for (var y2 = 0; y2 < rows; y2++) {
      rowDist[y2] = y2 * CELL * uy;
      rowP[y2] = rowDist[y2] * K;
    }
    uSpan = Math.max(1, colDist[cols - 1] + rowDist[rows - 1]);
    cycle = uSpan + WAVE_GAP;

    /* 尺寸变了就整面重来：正在过渡的旧图直接丢掉，反正整墙都要重画 */
    cur = buildAtlas(alphaName, cells);
    next = null;
    layoutWords(cur);
    paint(tNow);
  }

  /* 换字母表：沿浪的推进方向逐格替换，越靠上游的格子先换 */
  function setAlphabet(name) {
    if (!ALPHABETS[name] || name === alphaName) { return; }
    alphaName = name;
    if (REDUCED) {
      cur = buildAtlas(name, cells);
      layoutWords(cur);
      next = null;
      paint(tNow);
      return;
    }
    var t0 = tNow;
    var span = Math.max(1, cols * 0.55 + rows * 0.45);
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var i = y * cols + x;
        var d = (x * 0.55 + y * 0.45) / span + (hash(x, y) - 0.5) * 0.18;
        if (d < 0) { d = 0; } else if (d > 0.98) { d = 0.98; }
        swapAt[i] = t0 + d * SWAP_SPREAD;
      }
    }
    swapEnd = t0 + SWAP_SPREAD + 0.04;
    next = buildAtlas(name, cells);
    layoutWords(next);
  }

  function paint(t) {
    ctx.clearRect(0, 0, W, H);
    var blending = !!next;
    var wordSheet = next || cur;
    var travel = t * WAVE_SPEED;
    /* 起始相位往前挪一点：打开页面时浪已经在屏幕里，不用干等它从左上角进来 */
    var f0 = (travel + cycle * 0.28) % cycle;
    var f1 = f0 - cycle / 2;
    var i, x, y;

    /* 浪锋前窄后宽的包络：锋前是推起来的坡，锋后是拖出去的水痕 */
    function envelope(d) {
      var w = d < 0 ? WAVE_FRONT_W : WAVE_TAIL_W;
      return Math.exp(-(d * d) / (w * w));
    }

    /* 第一遍：算浪高，浪推到的格子写下一个字；顺手给每个词段记峰值 */
    for (var s = 0; s < slots.length; s++) { slots[s].peak = 0; }
    for (y = 0; y < rows; y++) {
      var wob = CROSS * 80 * Math.sin(y * 0.013 + t * 0.35);
      var baseDist = rowDist[y] + wob;
      var swellPhase = rowP[y] - travel * 0.06;
      var rb0 = y * cols;
      for (x = 0; x < cols; x++) {
        var u = colDist[x] + baseDist;
        var front = Math.max(envelope(u - f0), envelope(u - f1));
        var swell = 0.5 + 0.5 * Math.sin(colU[x] + swellPhase + CROSS * Math.sin(colC[x] * 9 + t * 0.4));
        var v = front + swell * SWELL;
        if (v > 1) { v = 1; }

        i = rb0 + x;
        if (v < REARM) {
          armed[i] = 1;
        } else if (armed[i] && v > TRIGGER) {
          /* 浪推到这里：写一个字，它自己会活一段时间再消失 */
          armed[i] = 0;
          birth[i] = t;
          var sid = slotId[i];
          var useWord = sid && slots[sid - 1].mode === 1;
          wordBorn[i] = useWord ? 1 : 0;
          if (!useWord) {
            var gc0 = cur.gc;
            var ni = (frac(clock[i] * 12.9 + t * 78.2) * gc0) | 0;
            if (ni === cur.idx[i]) { ni = (ni + 1) % gc0; }
            cur.idx[i] = ni;
            if (next) { next.idx[i] = (frac(hash(i, 3) * 91.7) * next.gc) | 0; }
          }
        }

        var sid2 = slotId[i];
        if (sid2) {
          var sp = slots[sid2 - 1];
          if (v > sp.peak) { sp.peak = v; }
        }
      }
    }

    /* 词段：浪扫到就掷一次，这一段这次写成词还是散字 */
    for (var s2 = 0; s2 < slots.length; s2++) {
      var sl = slots[s2];
      if (sl.peak < REARM) { sl.armed = 1; }
      if (sl.armed && sl.peak > WORD_CUT) {
        sl.armed = 0;
        sl.mode = hash(s2 * 7.3, (t * 0.37) | 0) < WORD_RATE ? 1 : 0;
        for (var b = 0; b < sl.len; b++) {
          wordBorn[sl.row * cols + sl.c0 + b] = 0;
        }
      }
    }

    /* 第二遍：只画还活着的字。淡入 → 停留 → 淡出，到点就什么都不留 */
    for (y = 0; y < rows; y++) {
      var dy = y * CELL;
      var rowBase = y * cols;
      for (x = 0; x < cols; x++) {
        i = rowBase + x;
        var age = t - birth[i];
        var k;
        if (REDUCED) {
          k = 1;
        } else {
          if (age < 0 || age >= LIFE) { continue; }
          if (age < FADE_IN) {
            k = age / FADE_IN;
          } else if (age < FADE_IN + HOLD) {
            k = 1;
          } else {
            k = 1 - (age - FADE_IN - HOLD) / FADE_OUT;
          }
          if (k <= 0) { continue; }
        }

        var a = PEAK * k;
        var ck = age < FRESH_TIME ? 1 - age / FRESH_TIME : 0;
        var ai = (a * A_STEPS) | 0;
        if (ai > A_STEPS - 1) { ai = A_STEPS - 1; }
        var aiC = (a * ck * A_STEPS) | 0;
        if (aiC > A_STEPS - 1) { aiC = A_STEPS - 1; }

        if (wordBorn[i] && wordSheet && wordSheet.wordCanvas) {
          var wsw = wordSheet.sw;
          var wcol = slotCol[i];
          ctx.drawImage(wordSheet.wordCanvas,
            wcol * wsw, ai * wsw, wsw, wsw,
            x * CELL, dy, CELL, CELL);
          if (aiC > 0) {
            ctx.drawImage(wordSheet.wordCanvas,
              (wordSheet.wordCount + wcol) * wsw, aiC * wsw, wsw, wsw,
              x * CELL, dy, CELL, CELL);
          }
          continue;
        }

        var sheet = blending && t >= swapAt[i] ? next : cur;
        var gc = sheet.gc;
        var sw = sheet.sw;
        var col = sheet.idx[i];
        ctx.drawImage(sheet.canvas,
          col * sw, ai * sw, sw, sw,
          x * CELL, dy, CELL, CELL);
        if (aiC > 0) {
          ctx.drawImage(sheet.canvas,
            (col + gc) * sw, aiC * sw, sw, sw,
            x * CELL, dy, CELL, CELL);
        }
      }
    }
    if (next && t > swapEnd) { cur = next; next = null; }
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

  /* 区块一进视口中段就换它那套字；只有一个区块时就是初始那套 */
  function watchSections() {
    if (!('IntersectionObserver' in window)) { return; }
    var nodes = [].slice.call(document.querySelectorAll('[data-alphabet]'));
    if (nodes.length < 2) { return; }
    var io = new IntersectionObserver(function (es) {
      for (var i = 0; i < es.length; i++) {
        if (es[i].isIntersecting) {
          setAlphabet(es[i].target.getAttribute('data-alphabet'));
        }
      }
    }, { rootMargin: '-46% 0px -46% 0px', threshold: 0 });
    nodes.forEach(function (el) { io.observe(el); });
  }

  resize();

  if (REDUCED) { return; }                   /* 静帧一屏，不挂循环 */

  watchSections();

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      inView = es[0].isIntersecting;
      if (inView) { start(); }
    }, { threshold: 0 }).observe(wall);
  }
  new ResizeObserver(resize).observe(wall);
}());
