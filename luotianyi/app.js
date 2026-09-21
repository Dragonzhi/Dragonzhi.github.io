/* 洛天依歌单 · 交互
   页面本身是静态渲染的，没有 JS 也能完整阅读；
   这里只做两件增强：按歌名过滤、年份导航跟随滚动。 */

(function () {
    'use strict';

    var input = document.querySelector('.search');
    var timeline = document.querySelector('.timeline');
    if (!timeline) return;

    var sections = Array.prototype.slice.call(timeline.querySelectorAll('.year'));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.years a'));
    var empty = document.querySelector('.empty');

    function escapeHtml(s) {
        return s.replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    function paint(li, keyword) {
        var span = li.querySelector('.song-title');
        var title = li.getAttribute('data-title') || '';
        if (!keyword) {
            span.textContent = title;
            li.hidden = false;
            return true;
        }
        var at = title.toLowerCase().indexOf(keyword);
        if (at < 0) {
            li.hidden = true;
            return false;
        }
        span.innerHTML =
            escapeHtml(title.slice(0, at)) +
            '<mark>' + escapeHtml(title.slice(at, at + keyword.length)) + '</mark>' +
            escapeHtml(title.slice(at + keyword.length));
        li.hidden = false;
        return true;
    }

    function apply() {
        var keyword = (input.value || '').trim().toLowerCase();
        var total = 0;
        sections.forEach(function (sec) {
            var shown = 0;
            Array.prototype.forEach.call(sec.querySelectorAll('.songs li'), function (li) {
                if (paint(li, keyword)) shown++;
            });
            sec.hidden = shown === 0;
            total += shown;
        });
        if (empty) empty.hidden = total > 0;
    }

    if (input) {
        var timer = null;
        input.addEventListener('input', function () {
            clearTimeout(timer);
            timer = setTimeout(apply, 60);
        });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { input.value = ''; apply(); }
        });
    }

    /* 年份导航：点哪滚哪，滚到哪亮哪 */
    if ('IntersectionObserver' in window && navLinks.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var id = '#' + entry.target.id;
                navLinks.forEach(function (a) {
                    a.classList.toggle('is-active', a.getAttribute('href') === id);
                });
            });
        }, { rootMargin: '-14% 0px -72% 0px', threshold: 0 });

        sections.forEach(function (sec) { io.observe(sec); });
    }

    navLinks.forEach(function (a) {
        a.addEventListener('click', function () {
            navLinks.forEach(function (x) { x.classList.remove('is-active'); });
            a.classList.add('is-active');
        });
    });
})();
