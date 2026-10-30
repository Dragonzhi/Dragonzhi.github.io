/* ============================================================
   home.js —— 屏首页脚本
   只做三件事：填日期、读 data/home.json 填刻度、复制邮箱并给回执。
   全部失败都要容忍：静态 HTML 里的值就是兜底。
   ============================================================ */
(function () {
  'use strict';

  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };

  /* ---- 今天 / 年份：不依赖 JSON，先填，失败也不影响 ---- */
  try {
    var now = new Date();
    var today = now.getFullYear() + '.' + pad(now.getMonth() + 1) + '.' + pad(now.getDate());
    var todayEl = document.getElementById('today');
    if (todayEl) { todayEl.textContent = today; }

    var yearEl = document.querySelector('[data-stat="year"]');
    if (yearEl) { yearEl.textContent = String(now.getFullYear()); }
  } catch (e) { /* 保持 HTML 里的静态值 */ }

  /* ---- 刻度：读 data/home.json ---- */
  (function loadStats() {
    if (typeof fetch !== 'function') { return; }
    fetch('data/home.json', { cache: 'no-cache' })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        if (!data) { return; }
        var set = function (key, value) {
          if (value === undefined || value === null) { return; }
          var nodes = document.querySelectorAll('[data-stat="' + key + '"]');
          for (var i = 0; i < nodes.length; i++) { nodes[i].textContent = value; }
        };
        set('recentShip', data.recentShip);
        var stats = data.stats || {};
        Object.keys(stats).forEach(function (k) { set(k, stats[k]); });
      })
      .catch(function () { /* 断网 / file:// 下静默退回 HTML 静态值 */ });
  }());

  /* ---- 主名浮雕：随整页指针的时差微动。停下衰减归位，归位即停帧 ---- */
  (function nameLift() {
    var plate = document.querySelector('.name-plate');
    var face = document.querySelector('[data-name-solid]');
    if (!plate || !face || !window.matchMedia) { return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

    var MAX = 9;        /* 最大转动角（度） */
    var EASE = 0.125;   /* 跟随系数：越小，时差越长 */
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;

    var write = function () {
      plate.style.transform = 'rotateX(' + cx.toFixed(2) + 'deg) rotateY(' + cy.toFixed(2) + 'deg)';
      face.style.backgroundPosition =
        (50 - cy * 3).toFixed(1) + '% ' + (50 - cx * 2.25).toFixed(1) + '%';
    };

    var tick = function () {
      cx += (tx - cx) * EASE;
      cy += (ty - cy) * EASE;
      if (Math.abs(tx - cx) < 0.02 && Math.abs(ty - cy) < 0.02) {
        cx = tx; cy = ty; write(); raf = 0; return;   /* 归位即停帧 */
      }
      write();
      raf = requestAnimationFrame(tick);
    };

    var aim = function (e) {
      var nx = (e.clientX / window.innerWidth - 0.5) * 2;
      var ny = (e.clientY / window.innerHeight - 0.5) * 2;
      tx = ny * MAX * 0.7;      /* 指针在下方 → 下沿朝观者 */
      ty = -nx * MAX;           /* 指针在右侧 → 右沿朝观者 */
      if (!raf) { raf = requestAnimationFrame(tick); }
    };

    var idle = function () {
      tx = 0; ty = 0;
      if (!raf) { raf = requestAnimationFrame(tick); }
    };

    window.addEventListener('pointermove', aim, { passive: true });
    document.documentElement.addEventListener('mouseleave', idle);
    window.addEventListener('blur', idle);
  }());

  /* ---- 复制邮箱：成功 / 失败都在图标上方的小签里给回执 ---- */
  (function copyMail() {
    var btn = document.querySelector('[data-copy]');
    if (!btn) { return; }
    var hint = btn.querySelector('.copy-hint');
    var timer = 0;

    var flash = function (text) {
      if (!hint) { return; }
      hint.textContent = text;
      hint.classList.add('is-on');
      clearTimeout(timer);
      timer = setTimeout(function () { hint.classList.remove('is-on'); }, 1600);
    };

    var fallbackCopy = function (text) {
      var ok = false;
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '-1000px';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) { ok = false; }
      flash(ok ? '已复制' : '复制失败');
    };

    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy') || '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { flash('已复制'); },
          function () { fallbackCopy(text); }
        );
      } else {
        fallbackCopy(text);
      }
    });
  }());

}());
