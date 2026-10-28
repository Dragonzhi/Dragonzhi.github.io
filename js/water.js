/* water.js · 水位下沿的一池水：Canvas2D 物理水面，只在被扰动时重绘 */
(function () {
  'use strict';

  var shelf = document.querySelector('[data-shelf]');
  var deck = shelf && shelf.querySelector('.shelf__deck');
  if (!deck) { return; }

  var cv = document.createElement('canvas');
  cv.className = 'shelf__water';
  cv.setAttribute('aria-hidden', 'true');
  deck.appendChild(cv);
  var ctx = cv.getContext('2d');
  if (!ctx) { deck.removeChild(cv); return; }

  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAD = 14;                       // 水面以上留给波峰的空间，与 site.css 对应
  var GAIN = 1.4;                     // 波幅的视觉放大：物理照算，画出来看得见
  var N = 96;                         // 水体列数
  var h = new Float32Array(N), v = new Float32Array(N);
  var W = 1, H = 1, line = 0, running = false, last = 0, acc = 0, pokeAt = 0;

  function measure() {
    var r = deck.getBoundingClientRect();
    line = parseFloat(getComputedStyle(shelf).getPropertyValue('--line')) || 0;
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height - line + PAD));
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }

  function surface(off) {
    off = off || 0;
    ctx.moveTo(0, PAD + h[0] * GAIN + off);
    for (var i = 1; i < N; i++) {
      ctx.lineTo(W * i / (N - 1), PAD + h[i] * GAIN + off);
    }
  }

  function render() {
    ctx.clearRect(0, 0, W, H);

    var g = ctx.createLinearGradient(0, PAD - 4, 0, H);
    g.addColorStop(0, 'rgba(96,118,130,.30)');
    g.addColorStop(.4, 'rgba(96,118,130,.15)');
    g.addColorStop(1, 'rgba(96,118,130,.05)');

    ctx.beginPath();
    surface();
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();

    // 水面薄光：贴着水线往下一指宽，静止时也读得出这是一层水
    var s = ctx.createLinearGradient(0, PAD - 2, 0, PAD + 14);
    s.addColorStop(0, 'rgba(255,255,255,.30)');
    s.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = s;
    ctx.fillRect(0, PAD - 2, W, 16);

    ctx.beginPath();
    surface();
    ctx.strokeStyle = 'rgba(255,255,255,.70)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 面下两道回声：同一道波形往下错开，读出水的厚度
    ctx.beginPath();
    surface(7);
    ctx.strokeStyle = 'rgba(255,255,255,.10)';
    ctx.stroke();
    ctx.beginPath();
    surface(15);
    ctx.strokeStyle = 'rgba(255,255,255,.05)';
    ctx.stroke();

    ctx.beginPath();
    surface(2);
    ctx.strokeStyle = 'rgba(18,23,26,.12)';
    ctx.stroke();
  }

  function step() {
    for (var i = 1; i < N - 1; i++) {
      v[i] += -h[i] * 0.02 + (h[i - 1] + h[i + 1] - 2 * h[i]) * 0.02;
      v[i] *= 0.94;
      h[i] = Math.max(-6, Math.min(6, h[i] + v[i]));
      if ((h[i] === 6 && v[i] > 0) || (h[i] === -6 && v[i] < 0)) { v[i] = 0; }
    }
    h[0] = 0;
    h[N - 1] = 0;
    v[0] = 0;
    v[N - 1] = 0;
  }

  function energy() {
    var e = 0;
    for (var i = 0; i < N; i++) {
      e = Math.max(e, Math.abs(h[i]), Math.abs(v[i]));
    }
    return e;
  }

  function tick(now) {
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    acc += dt;
    while (acc >= 1 / 60) { step(); acc -= 1 / 60; }
    render();
    if (energy() > 0.05) {
      requestAnimationFrame(tick);
    } else {
      running = false;
      h.fill(0); v.fill(0);
      render();
    }
  }

  function start() {
    if (calm || running) { return; }
    running = true;
    last = performance.now();
    acc = 0;
    requestAnimationFrame(tick);
  }

  function poke(clientX, force) {
    if (calm) { return; }
    var r = cv.getBoundingClientRect();
    var t = (clientX - r.left) / r.width;
    if (!(t >= 0 && t <= 1)) { return; }
    var i = Math.max(1, Math.min(N - 2, Math.round(t * (N - 1))));
    v[i] += force;
    v[i - 1] += force * 0.35;
    v[i + 1] += force * 0.35;
    start();
  }

  shelf.addEventListener('pointermove', function (e) {
    var r = cv.getBoundingClientRect();
    if (e.clientY < r.top + 2) { return; }
    var now = performance.now();
    if (now - pokeAt < 40) { return; }
    pokeAt = now;
    poke(e.clientX, -0.8);
  });

  shelf.addEventListener('pointerdown', function (e) {
    var r = cv.getBoundingClientRect();
    if (e.clientY < r.top) { return; }
    poke(e.clientX, -3);
  });

  var cells = deck.querySelectorAll('.shelf__cell');
  for (var i = 0; i < cells.length; i++) {
    (function (cell) {
      function lift() {
        var r = cell.getBoundingClientRect();
        poke(r.left + r.width / 2, -1.2);
      }
      cell.addEventListener('mouseenter', lift);
      cell.addEventListener('focus', lift);
    }(cells[i]));
  }

  var timer = 0;
  function resize() {
    clearTimeout(timer);
    timer = setTimeout(measure, 120);
  }
  if (window.ResizeObserver) {
    new ResizeObserver(resize).observe(deck);
  } else {
    window.addEventListener('resize', resize);
  }
  measure();
}());
