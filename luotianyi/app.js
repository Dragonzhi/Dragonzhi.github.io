/* 洛天依歌单 · 交互
   页面本身是静态渲染的，没有 JS 也能完整阅读；
   增强功能：
   1. 歌名与「传说/殿堂」标签快捷搜索过滤
   2. 时间轴电音导轨 + 年份导航 + 顶部 EQ 频谱仪三重联动
   3. 🥟 吃货大人「投喂天依」彩蛋互动与语音气泡 */

(function () {
    'use strict';

    var input = document.querySelector('.search');
    var timeline = document.querySelector('.timeline');
    if (!timeline) return;

    var sections = Array.prototype.slice.call(timeline.querySelectorAll('.year'));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.years a'));
    var sparkBars = Array.prototype.slice.call(document.querySelectorAll('.spark-bar'));
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

        // 快捷标签匹配：传说 / 殿堂
        if (keyword === '传说' || keyword === '传说曲') {
            var isLegend = li.classList.contains('is-legend');
            span.textContent = title;
            li.hidden = !isLegend;
            return isLegend;
        }
        if (keyword === '殿堂' || keyword === '殿堂曲') {
            var isHall = li.classList.contains('is-hall');
            span.textContent = title;
            li.hidden = !isHall;
            return isHall;
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

    /* 年份导航、电音导轨与 EQ 频谱仪：点哪滚哪，滚到哪亮哪 */
    if ('IntersectionObserver' in window && sections.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var id = '#' + entry.target.id;
                var year = entry.target.id.replace('y', '');

                // 激活当前年份的电音导轨光效与声波波纹
                sections.forEach(function (sec) {
                    sec.classList.toggle('is-active', sec === entry.target);
                });

                // 高亮顶部年份导航
                navLinks.forEach(function (a) {
                    a.classList.toggle('is-active', a.getAttribute('href') === id);
                });

                // 联动高亮 EQ 频谱仪对应柱
                sparkBars.forEach(function (bar) {
                    bar.classList.toggle('is-active', bar.getAttribute('data-year') === year);
                });

                // 触发对应年份灵魂意象背景切换
                switchVectorScene(year);
            });
        }, { rootMargin: '-14% 0px -72% 0px', threshold: 0 });

        sections.forEach(function (sec) { io.observe(sec); });

        // 顶部 Hero 回滚监听：回到顶部时恢复标志性八卦星环
        var hero = document.querySelector('.hero');
        if (hero) {
            var heroIo = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    switchVectorScene('hero');
                }
            }, { rootMargin: '0px 0px -60% 0px', threshold: 0 });
            heroIo.observe(hero);
        }
    }

    // 年份链接平滑对齐
    navLinks.forEach(function (a) {
        a.addEventListener('click', function () {
            navLinks.forEach(function (x) { x.classList.remove('is-active'); });
            a.classList.add('is-active');
        });
    });

    sparkBars.forEach(function (bar) {
        bar.addEventListener('click', function (e) {
            var href = bar.getAttribute('href');
            var target = href ? document.querySelector(href) : null;
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ---------------------------------------------------------- 🌟 动态星尘与声波涟漪画布 (方案二) */
    var stardustCanvas = document.getElementById('stardustCanvas');
    if (stardustCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        var sCtx = stardustCanvas.getContext('2d');
        var sw, sh;
        var stars = [];
        var ripples = [];
        var starCount = 65;

        function resizeStardust() {
            sw = stardustCanvas.width = window.innerWidth;
            sh = stardustCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeStardust);
        resizeStardust();

        for (var si = 0; si < starCount; si++) {
            stars.push({
                x: Math.random() * sw,
                y: Math.random() * sh,
                r: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.7 + 0.2,
                dAlpha: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
                vy: -(Math.random() * 0.22 + 0.08),
                vx: (Math.random() - 0.5) * 0.12,
                color: Math.random() > 0.35 ? '102, 204, 255' : '235, 245, 255'
            });
        }

        window.addEventListener('pointermove', function(e) {
            if (Math.random() > 0.72) {
                ripples.push({
                    x: e.clientX,
                    y: e.clientY,
                    r: 4,
                    maxR: 45 + Math.random() * 25,
                    alpha: 0.36
                });
            }
        });

        function stardustLoop() {
            if (document.hidden) {
                requestAnimationFrame(stardustLoop);
                return;
            }
            sCtx.clearRect(0, 0, sw, sh);

            // 绘制星尘
            for (var i = 0; i < stars.length; i++) {
                var s = stars[i];
                s.alpha += s.dAlpha;
                if (s.alpha > 0.85 || s.alpha < 0.15) s.dAlpha *= -1;

                s.y += s.vy;
                s.x += s.vx;
                if (s.y < -10) { s.y = sh + 10; s.x = Math.random() * sw; }
                if (s.x < -10) s.x = sw + 10;
                if (s.x > sw + 10) s.x = -10;

                sCtx.beginPath();
                sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                sCtx.fillStyle = 'rgba(' + s.color + ',' + s.alpha + ')';
                sCtx.shadowBlur = s.r * 3;
                sCtx.shadowColor = '#66ccff';
                sCtx.fill();
            }

            // 绘制鼠标声波涟漪
            for (var j = ripples.length - 1; j >= 0; j--) {
                var rp = ripples[j];
                rp.r += 1.2;
                rp.alpha *= 0.95;
                if (rp.alpha < 0.02 || rp.r > rp.maxR) {
                    ripples.splice(j, 1);
                    continue;
                }
                sCtx.beginPath();
                sCtx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
                sCtx.strokeStyle = 'rgba(102, 204, 255, ' + rp.alpha + ')';
                sCtx.lineWidth = 1;
                sCtx.stroke();
            }

            requestAnimationFrame(stardustLoop);
        }
        stardustLoop();
    }

    /* ---------------------------------------------------------- 🎨 年度灵魂意象背景切换引擎 */
    var vectorStage = document.getElementById('vectorStage');
    var allVectorScenes = vectorStage ? Array.prototype.slice.call(vectorStage.querySelectorAll('.vector-scene')) : [];
    var activeVectorYear = 'hero';

    function switchVectorScene(year) {
        if (!vectorStage || activeVectorYear === year) return;
        activeVectorYear = year;

        allVectorScenes.forEach(function (scene) {
            var match = scene.getAttribute('data-year') === String(year);
            scene.classList.toggle('is-active', match);
        });
    }

    /* ---------------------------------------------------------- 🥟 投喂包子吃货彩蛋 */
    var bunBtn = document.getElementById('bunBtn');
    var bunCountEl = document.getElementById('bunCount');
    var feedCount = 0;
    var toastTimer = null;
    var currentToast = null;

    var feedQuotes = [
        "（嚼嚼嚼）小笼包好吃！天依饱食度 +1 ♪",
        "好香！还要再吃一个~ (๑>◡<๑)",
        "吃货属性大爆发！天依能量正在蓄满 ⚡",
        "「今天又要吃什么？」——《千年食谱颂》共鸣开启！🥟",
        "肚皮圆滚滚~ (嗝) 谢谢投喂，天依要全力为你唱歌啦！✨",
        "投喂成功！天依的心情指数达到了 66CCFF%！💙",
        "世界上最动听的声音，除了你的掌声，还有小笼包出锅的蒸汽声~"
    ];

    function showToast(msg) {
        if (currentToast) {
            currentToast.classList.remove('is-show');
            if (currentToast.parentNode) currentToast.parentNode.removeChild(currentToast);
            currentToast = null;
        }
        var toast = document.createElement('div');
        toast.className = 'bun-toast';
        toast.innerHTML = '<span aria-hidden="true">🥟</span><span>' + escapeHtml(msg) + '</span>';
        document.body.appendChild(toast);
        currentToast = toast;

        void toast.offsetWidth;
        toast.classList.add('is-show');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove('is-show');
            setTimeout(function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
                if (currentToast === toast) currentToast = null;
            }, 360);
        }, 2400);
    }

    function spawnParticle(originX, originY) {
        var icons = ['🥟', '🥟', '♪', '♫', '✨', '💙'];
        var icon = icons[Math.floor(Math.random() * icons.length)];
        var el = document.createElement('span');
        el.className = 'falling-bun';
        el.textContent = icon;

        var driftX = (Math.random() - 0.5) * 180;
        var rot = (Math.random() - 0.5) * 80;
        var startX = originX + (Math.random() - 0.5) * 30;
        var startY = originY + (Math.random() - 0.5) * 20;

        el.style.left = startX + 'px';
        el.style.top = startY + 'px';
        el.style.setProperty('--drift-x', driftX + 'px');
        el.style.setProperty('--rot', rot + 'deg');

        document.body.appendChild(el);
        setTimeout(function () {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 1850);
    }

    if (bunBtn) {
        bunBtn.addEventListener('click', function (e) {
            feedCount++;
            if (bunCountEl) {
                bunCountEl.textContent = feedCount;
                bunCountEl.hidden = false;
            }

            var rect = bunBtn.getBoundingClientRect();
            var originX = rect.left + rect.width / 2;
            var originY = rect.top + rect.height / 2;

            var count = 3 + Math.floor(Math.random() * 3);
            for (var i = 0; i < count; i++) {
                (function (idx) {
                    setTimeout(function () {
                        spawnParticle(originX, originY);
                    }, idx * 55);
                })(i);
            }

            var quote = feedQuotes[(feedCount - 1) % feedQuotes.length];
            showToast(quote);
        });
    }
})();
