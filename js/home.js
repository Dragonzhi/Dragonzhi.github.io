/* ============================================================
   home.js —— 屏首页脚本
   只做三件事：填日期、读 data/home.json 填刻度、复制邮箱。
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

  /* ---- 复制邮箱 ---- */
  (function copyEmail() {
    var btn = document.querySelector('[data-copy-email]');
    if (!btn) { return; }
    var label = btn.textContent;
    var timer = null;

    var flash = function (text) {
      btn.textContent = text;
      if (timer) { clearTimeout(timer); }
      timer = setTimeout(function () { btn.textContent = label; }, 1600);
    };

    btn.addEventListener('click', function () {
      var email = btn.getAttribute('data-email') || '';
      if (!email) { return; }

      var done = function () { flash('已复制'); };
      var fail = function () { flash('复制失败，请手动选中'); };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(function () {
          try {
            var ta = document.createElement('textarea');
            ta.value = email;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            var ok = document.execCommand('copy');
            document.body.removeChild(ta);
            ok ? done() : fail();
          } catch (e) { fail(); }
        });
        return;
      }

      try {
        var ta2 = document.createElement('textarea');
        ta2.value = email;
        ta2.setAttribute('readonly', '');
        ta2.style.position = 'fixed';
        ta2.style.opacity = '0';
        document.body.appendChild(ta2);
        ta2.select();
        var ok2 = document.execCommand('copy');
        document.body.removeChild(ta2);
        ok2 ? done() : fail();
      } catch (e2) { fail(); }
    });
  }());
}());
