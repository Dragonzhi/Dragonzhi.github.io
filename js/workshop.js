/* ============================================================
   ZLOONG 工房 · workshop.js
   门牌日期 / about·now 渲染 / 打字机（content.js phrases）/
   复制邮箱 / SIGNAL 彩蛋（按钮、ESC、键入 66CCFF）
   由 preview-workshop-v5.html 内联脚本与 js/site.js 合并而来
   ============================================================ */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var content = window.SITE_CONTENT || {};

    /* ---------- 门牌日期 ---------- */
    var todayEl = document.getElementById("today");
    if (todayEl) {
        var nd = new Date();
        var week = ["日", "一", "二", "三", "四", "五", "六"][nd.getDay()];
        todayEl.textContent = nd.getFullYear() + "年" + (nd.getMonth() + 1) + "月" + nd.getDate() + "日 · 星期" + week;
    }

    /* ---------- 当前年份 ---------- */
    document.querySelectorAll("[data-current-year]").forEach(function (el) {
        el.textContent = String(new Date().getFullYear());
    });

    /* ---------- 今日一言：按日期轮选（同一天所有人同一句，次日自动换） ---------- */
    var dailyQuote = document.querySelector(".daily .quote");
    var dailyWho = document.querySelector(".daily .who");
    var dailies = Array.isArray(content.dailyQuotes) ? content.dailyQuotes : [];
    if ((dailyQuote || dailyWho) && dailies.length) {
        /* 用 UTC 天序号做索引：全球同一天看到同一句，且不受访客时区影响 */
        var item = dailies[Math.floor(new Date().getTime() / 86400000) % dailies.length] || {};
        if (dailyQuote && item.q) { dailyQuote.textContent = item.q; }
        if (dailyWho && item.w) { dailyWho.textContent = item.w; }
    }

    /* ---------- about.md / now.md：文案统一在 data/content.js 里改 ---------- */
    var aboutBody = document.getElementById("about-body");
    if (aboutBody && Array.isArray(content.about)) {
        aboutBody.innerHTML = content.about
            .map(function (p) { return "<p>" + p + "</p>"; })
            .join("");
    }

    var nowList = document.getElementById("now-list");
    if (nowList && Array.isArray(content.now)) {
        nowList.innerHTML = content.now
            .map(function (item) { return '<li><span class="now-dot"></span>' + item + "</li>"; })
            .join("");
    }

    /* ---------- 首屏打字机 ---------- */
    var typedEl = document.getElementById("typed");
    if (typedEl) {
        var phrases = (Array.isArray(content.phrases) && content.phrases.length)
            ? content.phrases
            : ["Hi, I'm Dragonzhi."];
        if (reduceMotion || phrases.length === 1) {
            typedEl.textContent = phrases[0];
        } else {
            var pi = 0, ci = phrases[0].length, deleting = false;
            typedEl.textContent = phrases[0];
            setTimeout(function tick() {
                var word = phrases[pi];
                if (!deleting) {
                    ci += 1;
                    typedEl.textContent = word.slice(0, ci);
                    if (ci >= word.length) {
                        deleting = true;
                        setTimeout(tick, 4200); /* 停在整句上久一点 */
                        return;
                    }
                } else {
                    ci -= 1;
                    typedEl.textContent = word.slice(0, ci);
                    if (ci <= 0) {
                        deleting = false;
                        pi = (pi + 1) % phrases.length;
                    }
                }
                setTimeout(tick, deleting ? 45 : 95);
            }, 1600);
        }
    }

    /* ---------- 复制邮箱 ---------- */
    document.querySelectorAll("[data-copy-email]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var email = btn.getAttribute("data-email") || "";
            var done = function () {
                btn.textContent = "copied";
                btn.classList.add("copied");
                setTimeout(function () {
                    btn.textContent = "copy";
                    btn.classList.remove("copied");
                }, 1500);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(done, done);
            } else {
                var ta = document.createElement("textarea");
                ta.value = email;
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand("copy"); } catch (e) { /* noop */ }
                document.body.removeChild(ta);
                done();
            }
        });
    });

    /* ---------- 隐藏信号：按钮 / ESC / 任意页面键入 66CCFF ---------- */
    var layer = document.querySelector("[data-signal]");
    var triggerBtn = document.querySelector("[data-signal-trigger]");
    var buffer = "";

    function openSignal() {
        if (!layer || layer.classList.contains("open")) return;
        layer.classList.add("open");
        layer.setAttribute("aria-hidden", "false");
        if (triggerBtn) triggerBtn.setAttribute("aria-expanded", "true");
        var closeBtn = layer.querySelector("[data-signal-close]");
        if (closeBtn) closeBtn.focus();
    }

    function closeSignal() {
        if (!layer || !layer.classList.contains("open")) return;
        layer.classList.remove("open");
        layer.setAttribute("aria-hidden", "true");
        if (triggerBtn) {
            triggerBtn.setAttribute("aria-expanded", "false");
            triggerBtn.focus();
        }
    }

    if (triggerBtn) {
        triggerBtn.addEventListener("click", openSignal);
    }
    if (layer) {
        layer.querySelectorAll("[data-signal-close]").forEach(function (el) {
            el.addEventListener("click", closeSignal);
        });
    }
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { closeSignal(); return; }
        if (/^[a-zA-Z0-9]$/.test(e.key)) {
            buffer = (buffer + e.key.toLowerCase()).slice(-6);
            if (buffer === "66ccff") {
                buffer = "";
                openSignal();
            }
        }
    });
})();
