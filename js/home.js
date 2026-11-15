/* ============================================================
   home.js —— 首页脚本
   只做四件事：填日期 / 年份、复制邮箱并给回执、主名漂浮、关于铭牌微动。
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

  /* ---- 主名浮雕：随墙上的浪自己浮。不接指针，不归位，一直在很慢地漂 ----
     位移量按字号走（em），换屏宽时幅度跟着字走，不会在小屏上显得乱晃。
     反光带跟着转动挪窗口：板面倾了，光源与板面的相对角度就变了。
     30fps、离开视口停帧；prefers-reduced-motion 下不挂。 */
  (function nameFloat() {
    var plate = document.querySelector('.name-plate');
    var face = document.querySelector('[data-name-solid]');
    if (!plate || !face || !window.requestAnimationFrame) { return; }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

    var FPS = 30;
    var raf = 0, last = 0, inView = true;

    var paint = function (t) {
      /* 三组互不同步的慢正弦：浮沉、横向漂移、三轴转动 */
      var by = (Math.sin(t * 0.62) * 0.030 + Math.sin(t * 0.41 + 1.3) * 0.013);
      var bx = (Math.sin(t * 0.29 + 2.1) * 0.034 + Math.sin(t * 0.19) * 0.013);
      var rz = Math.sin(t * 0.47 + 0.7) * 0.75;
      var rx = Math.sin(t * 0.53 + 1.1) * 2.1;
      var ry = Math.sin(t * 0.37 + 2.4) * 2.1;

      plate.style.transform =
        'translate3d(' + bx.toFixed(3) + 'em,' + by.toFixed(3) + 'em,0) ' +
        'rotateZ(' + rz.toFixed(3) + 'deg) ' +
        'rotateX(' + rx.toFixed(2) + 'deg) ' +
        'rotateY(' + ry.toFixed(2) + 'deg)';

      face.style.backgroundPosition =
        (50 - ry * 1.45).toFixed(2) + '% ' + (50 - rx * 1.05).toFixed(2) + '%';
    };

    var tick = function (now) {
      raf = 0;
      if (now - last >= 1000 / FPS - 1) {
        last = now;
        paint(now / 1000);
      }
      if (inView) { raf = requestAnimationFrame(tick); }
    };

    var start = function () {
      if (raf || !inView) { return; }
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    paint(0);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        inView = es[0].isIntersecting;
        if (inView) { start(); }
      }, { threshold: 0 }).observe(plate);
    }
    start();

    document.addEventListener('visibilitychange', function () {
      inView = !document.hidden;
      if (inView) { start(); }
    });
  }());

  /* ---- 关于铭牌：每枚各自跟随指针，离开归位即停帧 ---- */
  (function badgeTilt() {
    var items = [].slice.call(document.querySelectorAll('.board .badge'));
    if (!items.length || !window.matchMedia) { return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) { return; }

    var MAX = 7;        /* 单枚最大转动角（度） */
    var EASE = 0.18;
    var resets = [];

    items.forEach(function (el) {
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;

      var write = function () {
        el.style.transform = 'rotateX(' + cx.toFixed(2) + 'deg) rotateY(' + cy.toFixed(2) + 'deg)';
      };

      var tick = function () {
        cx += (tx - cx) * EASE;
        cy += (ty - cy) * EASE;
        if (Math.abs(tx - cx) < 0.02 && Math.abs(ty - cy) < 0.02) {
          cx = tx; cy = ty; write(); raf = 0; return;
        }
        write();
        raf = requestAnimationFrame(tick);
      };

      var aim = function (e) {
        var r = el.getBoundingClientRect();
        if (!r.width || !r.height) { return; }
        var nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        var ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
        tx = ny * MAX * 0.7;
        ty = -nx * MAX;
        if (!raf) { raf = requestAnimationFrame(tick); }
      };

      var reset = function () {
        tx = 0; ty = 0;
        if (!raf) { raf = requestAnimationFrame(tick); }
      };

      resets.push(reset);
      el.addEventListener('pointermove', aim, { passive: true });
      el.addEventListener('pointerleave', reset);
    });

    window.addEventListener('blur', function () {
      for (var i = 0; i < resets.length; i++) { resets[i](); }
    });
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
