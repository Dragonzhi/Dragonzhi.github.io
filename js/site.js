/* ============================================================
   dz.wiki · site.js
   打字机 / 文案渲染 / 复制邮箱 / 66CCFF 隐藏信号 / 入场动画
   ============================================================ */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var content = window.SITE_CONTENT || {};

    /* ---------- 当前年份 ---------- */
    document.querySelectorAll("[data-current-year]").forEach(function (el) {
        el.textContent = String(new Date().getFullYear());
    });

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
                var old = btn.textContent;
                btn.textContent = "copied!";
                btn.classList.add("copied");
                setTimeout(function () {
                    btn.textContent = old;
                    btn.classList.remove("copied");
                }, 1400);
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

    /* ---------- 入场动画 ---------- */
    var revealEls = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach(function (el) { el.classList.add("visible"); });
    } else {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(function (el) { io.observe(el); });
    }

    /* ---------- 隐藏信号：按钮 / ESC / 输入 66CCFF ---------- */
    var layer = document.querySelector("[data-signal]");
    var triggerBtn = document.querySelector("[data-signal-trigger]");
    var buffer = "";

    function openSignal() {
        if (!layer || layer.classList.contains("open")) return;
        layer.classList.add("open");
        layer.setAttribute("aria-hidden", "false");
        if (triggerBtn) triggerBtn.setAttribute("aria-expanded", "true");
        var closeBtn = layer.querySelector(".signal-close");
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
        /* 任意页面输入 66ccff 唤出 */
        if (/^[a-zA-Z0-9]$/.test(e.key)) {
            buffer = (buffer + e.key.toLowerCase()).slice(-6);
            if (buffer === "66ccff") {
                buffer = "";
                openSignal();
            }
        }
    });
})();
