/* ============================================================
   ZLOONG 工房 · js/seal.js
   工房印章（case 3 · 单物件）：一块 168×168 的 three.js 画布，
   固定在视口右下角。拖到任意纸卡上按下 → 触纸那一帧在卡上留一枚
   朱砂印（田字格「验收完成」+ SHIPPED · NO.xx），盖完自动归位。
   印子持久化在 localStorage（zloong-seal-v1），刷新还在；
   印章上方挂着一枚清除键，有印子才出现。

   四条边界，刻意写死在这里：
   1. 窄屏（≤1080px）不出现、**不下载 three.js**，已存的印子也不渲染；
   2. 无 WebGL 或 three.js 加载失败 → 退化成 2D 印章，功能照旧；
   3. 静止时一个 rAF 都不跑（按需渲染）；
   4. 存档只记坐标 + 随机种子（不存图片），最多 48 枚，超出丢最早的。

   要撤掉这个方向：删本文件 + css/seal.css + index.html 里的 .seal-rig 区块。
   ============================================================ */
(function () {
  "use strict";

  var RIG = document.getElementById("seal-rig");
  var CANVAS = document.getElementById("seal-canvas");
  if (!RIG || !CANVAS) return;

  var RED = "#8b2c1f";
  var THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.min.js";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 0. 存档：印子只记「盖在哪张卡、卡内坐标、角度、种子」 ----------
     不存图片（一张 384px 的 PNG 转 base64 要十几 KB，几十枚就撑爆配额）；
     印面的随机缺口由种子复现，刷新后长回来一模一样。 */
  var STORE_KEY = "zloong-seal-v1";
  var MAX_MARKS = 48;
  var marks = readStore();
  var stampCount = marks.reduce(function (a, m) { return Math.max(a, m.n || 0); }, 0);

  function readStore() {
    var out = [];
    try {
      var arr = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (Array.isArray(arr)) {
        out = arr.filter(function (m) {
          return m && typeof m.c === "string" &&
            isFinite(m.x) && isFinite(m.y) && isFinite(m.n) && isFinite(m.s);
        }).slice(-MAX_MARKS);
      }
    } catch (e) { out = []; }     /* 隐私模式 / 配额满：当没有存档，不报错 */
    return out;
  }
  function saveStore() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(marks.slice(-MAX_MARKS))); } catch (e) {}
  }

  /* 固定种子的伪随机：同一枚印子每次画出来都一样 */
  function seeded(seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- 1. 印面图案（3D 贴图与印子共用同一套画法） ---------- */
  function makeSealArt(S, serial, seed) {
    var cv = document.createElement("canvas");
    cv.width = cv.height = S;
    var ctx = cv.getContext("2d");
    var rnd = seed === undefined ? Math.random : seeded(seed);   /* 有种子 = 可复现 */
    var M = Math.round(S * 0.055);
    ctx.fillStyle = RED;
    ctx.fillRect(0, 0, S, S);
    ctx.clearRect(M, M, S - M * 2, S - M * 2);
    var M2 = M + Math.round(S * 0.03), T = Math.max(2, Math.round(S * 0.009));
    ctx.fillStyle = RED;
    ctx.fillRect(M2, M2, S - M2 * 2, T);
    ctx.fillRect(M2, S - M2 - T, S - M2 * 2, T);
    ctx.fillRect(M2, M2, T, S - M2 * 2);
    ctx.fillRect(S - M2 - T, M2, T, S - M2 * 2);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = RED;
    /* 四字田字格：验收 / 完成 */
    ctx.font = '700 ' + Math.round(S * 0.235) + 'px Georgia,"Noto Serif SC",serif';
    var cx = S / 2, cy = S * 0.4, dx = S * 0.16, dy = S * 0.135;
    ctx.fillText("验", cx - dx, cy - dy);
    ctx.fillText("收", cx + dx, cy - dy);
    ctx.fillText("完", cx - dx, cy + dy);
    ctx.fillText("成", cx + dx, cy + dy);
    /* 分隔线 + 底部小字 */
    ctx.fillRect(M2 + S * 0.022, S * 0.69, S - (M2 + S * 0.022) * 2, Math.max(1, S * 0.006));
    ctx.font = '600 ' + Math.round(S * 0.085) + 'px "Cascadia Code",Consolas,monospace';
    ctx.fillText(serial ? "SHIPPED · NO." + serial : "SHIPPED", S / 2, S * 0.795);
    /* 印泥没吃满：边框与笔画上的随机缺口 */
    ctx.globalCompositeOperation = "destination-out";
    for (var i = 0; i < 190; i++) {
      var edge = rnd() < 0.72, x, y;
      if (edge) {
        var side = Math.floor(rnd() * 4), t = rnd() * S;
        if (side === 0) { x = t; y = rnd() * M * 1.6; }
        else if (side === 1) { x = t; y = S - rnd() * M * 1.6; }
        else if (side === 2) { x = rnd() * M * 1.6; y = t; }
        else { x = S - rnd() * M * 1.6; y = t; }
      } else { x = rnd() * S; y = rnd() * S; }
      ctx.beginPath();
      ctx.arc(x, y, 0.6 + rnd() * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    return cv;
  }
  var FACE_ART = makeSealArt(512, 0);
  var ART_URL = FACE_ART.toDataURL("image/png");

  /* 3D 印面用镜像（真实印章刻的是反字） */
  function mirrored(cv) {
    var c2 = document.createElement("canvas");
    c2.width = cv.width; c2.height = cv.height;
    var x = c2.getContext("2d");
    x.translate(cv.width, 0); x.scale(-1, 1);
    x.drawImage(cv, 0, 0);
    return c2;
  }

  /* ---------- 2. 盖印 + 存档 ---------- */
  function cardAt(x, y) {
    var list = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [document.elementFromPoint(x, y)];
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (!el || !el.closest) continue;
      var card = el.closest(".paper[data-desk-card]");
      if (card && !RIG.contains(card)) return card;
    }
    return null;
  }
  function cardByKey(key) {
    var all = document.querySelectorAll(".paper[data-desk-card]");
    for (var i = 0; i < all.length; i++) {
      if (all[i].getAttribute("data-desk-card") === key) return all[i];
    }
    return null;
  }
  /* 卡内坐标用 px（相对卡片左上角）而不是百分比：
     档案架是自上而下长高的容器，加一篇 .md 就会把百分比印子往下推；
     用 px 记，印子就钉在纸上原来那一处。 */
  function drawMark(card, mark, animate) {
    var el = document.createElement("span");
    el.className = "seal-print";
    el.style.left = mark.x + "px";
    el.style.top = mark.y + "px";
    el.style.setProperty("--r", mark.r + "deg");
    el.style.setProperty("--o", mark.o);
    el.style.backgroundImage = "url(" + makeSealArt(384, mark.n, mark.s).toDataURL("image/png") + ")";
    el.setAttribute("aria-hidden", "true");
    if (!animate) el.classList.add("on");     /* 回填的印子直接就是清晰状态 */
    card.appendChild(el);
    if (animate) requestAnimationFrame(function () { el.classList.add("on"); });
  }
  function clearRendered() {
    Array.prototype.forEach.call(document.querySelectorAll(".seal-print"), function (m) { m.remove(); });
  }
  /* 刷新后把存档里的印子贴回去；窄屏不参与（印章整块不出现） */
  function renderMarks() {
    clearRendered();
    if (mq.matches) return;
    marks.forEach(function (m) {
      var card = cardByKey(m.c);
      if (card) drawMark(card, m, false);
    });
    syncClear();
  }
  function stampAt(card, clientX, clientY) {
    var r = card.getBoundingClientRect();
    stampCount += 1;
    var mark = {
      c: card.getAttribute("data-desk-card"),
      x: Math.round(Math.max(6, Math.min(r.width - 6, clientX - r.left))),
      y: Math.round(Math.max(6, Math.min(r.height - 6, clientY - r.top))),
      r: Number((Math.random() * 10 - 5).toFixed(1)),
      o: Number((0.72 + Math.random() * 0.2).toFixed(2)),
      n: stampCount,
      s: Math.floor(Math.random() * 4294967295)
    };
    marks.push(mark);
    while (marks.length > MAX_MARKS) marks.shift();
    saveStore();
    drawMark(card, mark, true);
    syncClear();
  }

  /* 清除键：贴在印章上方。抹掉是不可逆的，所以第一次点只是「上膛」 */
  var clearBtn = document.getElementById("seal-clear");
  var armed = false, armTimer = null;
  function syncClear() {
    if (!clearBtn) return;
    var n = document.querySelectorAll(".seal-print").length;
    if (!n) armed = false;
    clearBtn.hidden = !n;
    clearBtn.classList.toggle("is-armed", armed);
    clearBtn.textContent = !n ? "抹掉印章" : (armed ? "再点一次抹掉" : "已盖 " + n + " 枚 · 抹掉");
  }
  if (clearBtn) clearBtn.addEventListener("click", function () {
    if (!armed) {
      armed = true;
      syncClear();
      clearTimeout(armTimer);
      armTimer = setTimeout(function () { armed = false; syncClear(); }, 4000);
      return;
    }
    clearTimeout(armTimer);
    armed = false;
    marks = [];
    stampCount = 0;
    saveStore();
    clearRendered();
    syncClear();
  });

  /* ---------- 3. 位置与拖动（视口右下角，随时能抓起来） ---------- */
  var SIZE = 168, INSET = 28;
  var home = { x: 0, y: 0 }, pos = { x: 0, y: 0 };

  function computeHome() {
    home.x = window.innerWidth - SIZE - INSET;
    home.y = window.innerHeight - SIZE - INSET;
  }
  function place(x, y) {
    pos.x = x; pos.y = y;
    RIG.style.left = x + "px";
    RIG.style.top = y + "px";
    RIG.style.right = "auto";
    RIG.style.bottom = "auto";
  }
  function clampTo(x, y) {
    return {
      x: Math.max(0, Math.min(window.innerWidth - SIZE, x)),
      y: Math.max(0, Math.min(window.innerHeight - SIZE, y))
    };
  }
  function goHome(animate) {
    computeHome();
    var c = clampTo(home.x, home.y);
    if (animate && !reduce) {
      RIG.style.transition = "left .42s cubic-bezier(.2,.8,.3,1), top .42s cubic-bezier(.2,.8,.3,1), transform .18s ease";
      setTimeout(function () { RIG.style.transition = ""; }, 460);
    }
    place(c.x, c.y);
    lift(false);
  }

  var drag = null;
  RIG.addEventListener("pointerdown", function (ev) {
    if (ev.button !== undefined && ev.button !== 0) return;
    var r = RIG.getBoundingClientRect();
    drag = { dx: ev.clientX - r.left, dy: ev.clientY - r.top, moved: false };
    RIG.classList.add("dragging");
    try { RIG.setPointerCapture(ev.pointerId); } catch (e) {}
    lift(true);
    ev.preventDefault();
  });
  RIG.addEventListener("pointermove", function (ev) {
    if (!drag) return;
    var c = clampTo(ev.clientX - drag.dx, ev.clientY - drag.dy);
    if (Math.hypot(c.x - pos.x, c.y - pos.y) > 3) drag.moved = true;
    place(c.x, c.y);
  });
  function endDrag() {
    if (!drag) return;
    RIG.classList.remove("dragging");
    var moved = drag.moved;
    drag = null;
    var r = RIG.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height * 0.72;   /* 印面大致位置 */
    if (moved) {
      var card = cardAt(cx, cy);
      if (card) { press(card, cx, cy); return; }
    }
    lift(false);
  }
  RIG.addEventListener("pointerup", endDrag);
  RIG.addEventListener("pointercancel", function () { RIG.classList.remove("dragging"); drag = null; lift(false); });
  RIG.addEventListener("dblclick", function () { goHome(true); });

  /* 键盘：Enter / 空格 → 盖在离印章最近的纸卡上 */
  RIG.addEventListener("keydown", function (ev) {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    ev.preventDefault();
    var r = RIG.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var best = null, bestD = Infinity;
    Array.prototype.forEach.call(document.querySelectorAll(".paper[data-desk-card]"), function (card) {
      var b = card.getBoundingClientRect();
      if (!b.width) return;
      var d = Math.hypot(b.left + b.width / 2 - cx, b.top + b.height / 2 - cy);
      if (d < bestD) { bestD = d; best = card; }
    });
    if (!best) return;
    var b = best.getBoundingClientRect();
    press(best, b.left + b.width * 0.5, b.top + b.height * 0.32);
  });

  /* ---------- 4. 3D：一枚印章 ---------- */
  var api = {
    lift: function () {},
    press: function (cb) { if (cb) setTimeout(cb, 60); },   /* 无 WebGL 时也要能盖 */
    render: function () {}
  };
  function lift(on) { api.lift(on); }
  function press(card, x, y) {
    RIG.classList.add("pressing");
    setTimeout(function () { RIG.classList.remove("pressing"); }, 220);
    /* 落印发生在「触纸那一帧」，动作和结果对得上 */
    api.press(function () { stampAt(card, x, y); });
    setTimeout(function () { goHome(true); }, reduce ? 0 : 660);
  }

  function webglOK() {
    try {
      var t = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (t.getContext("webgl2") || t.getContext("webgl")));
    } catch (e) { return false; }
  }

  function start2D() {
    RIG.classList.add("flat");
    RIG.style.backgroundImage = "url(" + ART_URL + ")";
    RIG.style.backgroundSize = "72%";
    RIG.style.backgroundPosition = "center";
    RIG.style.backgroundRepeat = "no-repeat";
    CANVAS.style.display = "none";
  }

  function start3D() {
    var renderer = new THREE.WebGLRenderer({ canvas: CANVAS, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 30);
    camera.position.set(0.14, 1.52, 2.92);
    camera.lookAt(0, 0.58, 0);

    scene.add(new THREE.HemisphereLight(0xfff8ec, 0xcfc3ad, 1.5));
    var key = new THREE.DirectionalLight(0xfff1da, 2.4);
    key.position.set(-2.4, 3.6, 2.6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -1.4; key.shadow.camera.right = 1.4;
    key.shadow.camera.top = 1.6; key.shadow.camera.bottom = -0.6;
    key.shadow.camera.near = 0.5; key.shadow.camera.far = 12;
    key.shadow.bias = -0.0012;
    key.shadow.radius = 3;
    scene.add(key);
    var fill = new THREE.DirectionalLight(0xdfe8ff, 0.55);
    fill.position.set(2.6, 1.6, -2);
    scene.add(fill);

    /* 只接影子的"隐形纸面"：画布其余部分透明，印章看起来直接落在页面纸上 */
    var ground = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4),
      new THREE.ShadowMaterial({ opacity: 0.3 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    /* 木纹：竖向长纹 */
    function makeWoodTex(base, dark) {
      var S = 256, cv = document.createElement("canvas");
      cv.width = cv.height = S;
      var x = cv.getContext("2d");
      x.fillStyle = base; x.fillRect(0, 0, S, S);
      for (var i = 0; i < 150; i++) {
        x.strokeStyle = "rgba(" + dark + "," + (0.03 + Math.random() * 0.07).toFixed(3) + ")";
        x.lineWidth = 0.6 + Math.random() * 1.7;
        var xx = Math.random() * S;
        x.beginPath();
        x.moveTo(xx, -4);
        x.bezierCurveTo(xx + (Math.random() - 0.5) * 16, S * 0.34, xx + (Math.random() - 0.5) * 16, S * 0.66, xx + (Math.random() - 0.5) * 12, S + 4);
        x.stroke();
      }
      var t = new THREE.CanvasTexture(cv);
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(2, 1);
      return t;
    }
    var wood = new THREE.MeshStandardMaterial({ map: makeWoodTex("#8b6b4a", "60,40,24"), color: 0xffffff, roughness: 0.74, metalness: 0.04 });
    var woodDark = new THREE.MeshStandardMaterial({ map: makeWoodTex("#6b4f35", "36,24,14"), color: 0xffffff, roughness: 0.82 });
    var brass = new THREE.MeshStandardMaterial({ color: 0xb08d57, roughness: 0.32, metalness: 0.88 });
    var faceTex = new THREE.CanvasTexture(mirrored(FACE_ART));
    faceTex.colorSpace = THREE.SRGBColorSpace;

    var seal = new THREE.Group();
    function part(geo, mat, y) {
      var m = new THREE.Mesh(geo, mat);
      m.position.y = y; m.castShadow = true; m.receiveShadow = true;
      seal.add(m); return m;
    }
    /* 印身：方座 + 上沿唇边 */
    part(new THREE.BoxGeometry(0.66, 0.4, 0.66), woodDark, 0.2);
    part(new THREE.BoxGeometry(0.73, 0.05, 0.73), woodDark, 0.428);
    /* 铜箍：上下两圈，中间一道槽 */
    part(new THREE.CylinderGeometry(0.2, 0.2, 0.055, 30), brass, 0.474);
    part(new THREE.CylinderGeometry(0.182, 0.182, 0.026, 30), woodDark, 0.514);
    part(new THREE.CylinderGeometry(0.2, 0.2, 0.055, 30), brass, 0.554);
    /* 手柄：按剖面车出来的木把 */
    var profile = [
      [0.000, 0.580], [0.148, 0.580], [0.168, 0.606], [0.150, 0.636],
      [0.118, 0.668], [0.106, 0.780], [0.128, 0.828], [0.110, 0.872],
      [0.142, 0.930], [0.186, 1.000], [0.192, 1.062], [0.166, 1.122],
      [0.116, 1.172], [0.058, 1.202], [0.000, 1.208]
    ].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var handle = new THREE.Mesh(new THREE.LatheGeometry(profile, 44), wood);
    handle.castShadow = true; handle.receiveShadow = true;
    seal.add(handle);
    /* 印面（镜像贴图 = 反字） */
    var face = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 0.6),
      new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.9 })
    );
    face.rotation.x = Math.PI / 2;
    face.position.y = -0.002;
    seal.add(face);
    scene.add(seal);

    /* 按需渲染：静止时一个 rAF 都不跑 */
    var raf = null, anim = null;
    function render() {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = null; renderer.render(scene, camera); });
    }
    function resize() {
      renderer.setSize(SIZE, SIZE, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      render();
    }

    /* 抬起 = 后仰露印面；盖章 = 摆正 → 落下 → 触纸压住 → 直起 */
    var tilt = 0, tiltTo = 0, pressT = -1, pressCb = null;
    api.lift = function (on) { tiltTo = on ? -0.42 : 0; run(); };
    api.press = function (onContact) { pressT = 0; pressCb = onContact || null; tiltTo = 0; run(); };
    api.render = render;

    function run() {
      if (anim) return;
      var last = performance.now();
      anim = requestAnimationFrame(function step(now) {
        var dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        var k = reduce ? 1 : (1 - Math.pow(0.0015, dt));
        tilt += (tiltTo - tilt) * k;

        var h = 0, sq = 1, wob = 0;
        if (pressT >= 0) {
          pressT += dt;
          var T = pressT;
          if (T < 0.15) {                       /* 落下 */
            var u = T / 0.15;
            h = 0.14 * (1 - u * u);
          } else if (T < 0.36) {                /* 触纸：压住 */
            var u2 = (T - 0.15) / 0.21;
            sq = 1 - 0.085 * Math.min(1, u2 * 2.2);
            wob = Math.sin(u2 * 30) * 0.012 * (1 - u2);
          } else if (T < 0.64) {                /* 直起：抬起并回弹 */
            var u3 = (T - 0.36) / 0.28;
            var e = 1 - Math.pow(1 - u3, 3);
            h = 0.13 * e;
            sq = 1 - 0.085 * (1 - e) + 0.02 * Math.sin(u3 * Math.PI);
          } else {
            pressT = -1; h = 0; sq = 1; wob = 0;
          }
          if (pressCb && T >= 0.155) { pressCb(); pressCb = null; }
          seal.position.y = h;
          seal.scale.set(1 + (1 - sq) * 0.32, sq, 1 + (1 - sq) * 0.32);
          seal.rotation.z = wob;
        } else {
          seal.position.y = 0;
          seal.scale.set(1, 1, 1);
          seal.rotation.z = 0;
        }
        seal.rotation.x = tilt;

        renderer.render(scene, camera);
        var busy = Math.abs(tiltTo - tilt) > 0.002 || pressT >= 0;
        if (busy) { anim = requestAnimationFrame(step); } else { anim = null; }
      });
    }

    resize();
    run();
  }

  /* ---------- 5. 懒加载 three.js + 窄屏闸门 ---------- */
  function loadThree(done) {
    if (typeof THREE !== "undefined") { done(true); return; }
    var s = document.createElement("script");
    var settled = false;
    function finish(ok) { if (settled) return; settled = true; done(ok); }
    s.src = THREE_URL;
    s.async = true;
    s.onload = function () { finish(typeof THREE !== "undefined"); };
    s.onerror = function () { finish(false); };
    setTimeout(function () { finish(typeof THREE !== "undefined"); }, 8000);  /* 网络卡住也不空等 */
    document.head.appendChild(s);
  }

  var mq = window.matchMedia("(max-width: 1080px)");
  var started = false;
  function applyMode() {
    if (mq.matches) {                 /* 窄屏：卡片重排，印章与印子整块不参与 */
      RIG.removeAttribute("data-ready");
      clearRendered();
      syncClear();
      return;
    }
    renderMarks();                    /* 进桌面就先把存档里的印子贴回纸上 */
    if (started) { RIG.setAttribute("data-ready", "1"); return; }
    started = true;
    loadThree(function (ok) {
      if (ok && webglOK()) { try { start3D(); } catch (e) { start2D(); } }
      else { start2D(); }
      RIG.setAttribute("data-ready", "1");
      computeHome();
      var c = clampTo(home.x, home.y);
      place(c.x, c.y);
    });
  }
  if (mq.addEventListener) mq.addEventListener("change", applyMode);
  else if (mq.addListener) mq.addListener(applyMode);
  applyMode();

  window.addEventListener("resize", function () {
    if (drag || !RIG.hasAttribute("data-ready")) return;
    var c = clampTo(pos.x, pos.y);
    place(c.x, c.y);
  });
})();
