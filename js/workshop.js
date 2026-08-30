/* ============================================================
   ZLOONG 工房 · workshop.js
   门牌日期 / files/ 读取（about·now·links·motto·daily 迷你 Markdown）/
   打字机（content.js phrases）/ 复制邮箱 / SIGNAL 彩蛋
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

    /* ---------- 迷你 Markdown（工房专用子集） ----------
       支持：段落（空行分隔）/ `- ` 无序列表
       行内：`code` → <code class="tag samp"> / **粗体** / [[状态]] → <span class="state"> / [文字](链接)
       其余一律先转义 HTML，不解析原始 HTML（规避 XSS）。 */
    function escHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    function inlineMd(s) {
        s = escHtml(s);
        s = s.replace(/`([^`]+)`/g, '<code class="tag samp">$1</code>');
        s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
        s = s.replace(/\[\[([^\]]+)\]\]/g, '<span class="state">$1</span>');
        s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, url) {
            var ok = /^(https?:|mailto:)\S+$/i.test(url)
                || /^\/(?!\/)/.test(url)
                || /^(?!\/\/)(\.{0,2}\/)?[a-zA-Z0-9._\-\/]+\.html?$/.test(url);
            if (!ok) { return m; } /* 拒绝 javascript: 等危险协议 */
            return '<a href="' + url + '"' + (/^https?:/i.test(url) ? ' target="_blank" rel="noreferrer"' : "") + ">" + label + "</a>";
        });
        return s;
    }
    function blockMd(md) {
        var lines = String(md).replace(/\r\n?/g, "\n").split("\n");
        var html = "", i = 0, ln, lis, paras;
        while (i < lines.length) {
            ln = lines[i];
            if (!ln.trim()) { i += 1; continue; }
            if (/^\s*-\s+/.test(ln)) {
                lis = [];
                while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
                    lis.push("<li>" + inlineMd(lines[i].replace(/^\s*-\s+/, "")) + "</li>");
                    i += 1;
                }
                html += "<ul>" + lis.join("") + "</ul>";
            } else {
                paras = [];
                while (i < lines.length && lines[i].trim() && !/^\s*-\s+/.test(lines[i])) {
                    paras.push(inlineMd(lines[i]));
                    i += 1;
                }
                html += "<p>" + paras.join("<br>") + "</p>";
            }
        }
        return html;
    }

    /* ---------- files/ 目标元素 ---------- */
    var aboutBody = document.getElementById("about-body");
    var nowList = document.getElementById("now-list");
    var linksList = document.getElementById("links") && document.querySelector("#links .link-list");
    var mottoQuote = document.getElementById("motto-quote");
    var mottoFoot = document.getElementById("motto-foot");
    var dailyQuote = document.querySelector(".daily .quote");
    var dailyWho = document.querySelector(".daily .who");

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

    /* ---------- 复制邮箱（可复用：links 异步加载后要重新绑定） ---------- */
    function bindCopyButtons() {
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
    }

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

    /* ---------- files/ 加载器 ----------
       每个卡片独立 try/catch：单个文件失败不影响其他，绝不自屏。
       Pages 的 404 劫持（HTTP 200 + 404 页面 HTML）用 sentinel 兜住。 */
    function loadText(url) {
        return fetch(url)
            .then(function (r) {
                if (!r.ok) { throw new Error(url + " HTTP " + r.status); }
                return r.text();
            })
            .then(function (t) {
                if (/^\s*<(!DOCTYPE|html)/i.test(t)) { throw new Error(url + " 是 404 页面"); }
                return t;
            })
            .catch(function () { return null; });
    }
    /* 把 blockMd 产出的 <ul>...</ul> 解析成 li 数组（用分离 DOM 树，不靠正则提 HTML） */
    function lisFromHtml(html) {
        var host = document.createElement("ul");
        host.innerHTML = html;
        var out = [], lis = host.querySelectorAll("li"), i;
        for (i = 0; i < lis.length; i += 1) { out.push(lis[i].outerHTML); }
        return out;
    }
    function bootFiles() {
        loadText("files/about.md").then(function (t) {
            if (aboutBody && t) { aboutBody.innerHTML = blockMd(t); }
        });
        loadText("files/now.md").then(function (t) {
            if (nowList && t) {
                var lis = lisFromHtml(blockMd(t));
                if (lis.length) {
                    nowList.innerHTML = lis.map(function (li) {
                        return li.replace(/^<li>/, '<li><span class="now-dot"></span>');
                    }).join("");
                }
            }
        });
        loadText("files/links.md").then(function (t) {
            if (linksList && t) {
                var html = blockMd(t)
                    .replace(/<li>((?:(?!<\/li>).)*?)\{copy\}((?:(?!<\/li>).)*?)<\/li>/g, function (m, pre, post) {
                        var mail = (pre + post).replace(/<[^>]+>/g, "").trim();
                        if (!/^\S+@\S+$/.test(mail)) { return m; }
                        return '<li class="link-mail"><span>' + mail +
                            '</span><button type="button" class="copy-btn samp" data-copy-email data-email="' + mail + '">copy</button></li>';
                    })
                    .replace(/\{copy\}/g, "");
                var lis = lisFromHtml(html);
                if (lis.length) { linksList.innerHTML = lis.join(""); }
                bindCopyButtons(); /* 新按钮需要重新绑定 */
            }
        });
        loadText("files/motto.txt").then(function (t) {
            if (mottoQuote && t) {
                var parts = t.split(/\n\s*\n/);
                if (parts[0]) {
                    mottoQuote.innerHTML = parts[0].split("\n").filter(function (l) { return l.trim(); })
                        .map(escHtml).join("<br>");
                }
                if (mottoFoot && parts[1]) { mottoFoot.innerHTML = escHtml(parts[1]); }
            }
        });
        loadText("files/daily.txt").then(function (t) {
            if ((dailyQuote || dailyWho) && t) {
                var entries = t.split(/\n\s*\n/)
                    .map(function (g) { return g.split("\n").filter(function (l) { return l.trim(); }); })
                    .filter(function (ls) { return ls.length; })
                    .map(function (ls) { return { q: ls[0], w: ls.slice(1).join(" ") }; });
                if (entries.length) {
                    /* UTC 天序号取模：同一天所有人同一句，次日自动换 */
                    var it = entries[Math.floor(new Date().getTime() / 86400000) % entries.length];
                    if (dailyQuote && it.q) { dailyQuote.textContent = it.q; }
                    if (dailyWho && it.w) { dailyWho.textContent = it.w; }
                }
            }
        });
    }
    bindCopyButtons();
    bootFiles();
})();
