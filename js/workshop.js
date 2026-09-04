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
            var pi = 0, ci = 0, deleting = false;
            typedEl.textContent = "";
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

    /* ---------- 自发现卡片：按内容判型，复用现有卡片 DOM 结构 ----------
       links 型：全部是列表行且每行含 [文字](链接) 或以 {copy} 结尾
       list  型：全部是列表行（无链接）
       quote 型：全部行以 > 开头
       doc   型：其他（段落、混合内容） */
    function detectCardType(text) {
        var ls = String(text).replace(/\r\n?/g, "\n").split("\n")
            .map(function (l) { return l.trim(); })
            .filter(function (l) { return l; });
        if (!ls.length) { return null; }
        var allList = ls.every(function (l) { return /^-\s+/.test(l); });
        if (allList) {
            var allLink = ls.every(function (l) {
                return /\[[^\]]+\]\([^)\s]+\)/.test(l) || /\{copy\}\s*$/.test(l);
            });
            return allLink ? "links" : "list";
        }
        if (ls.every(function (l) { return /^>\s?/.test(l); })) { return "quote"; }
        return "doc";
    }

    /* links 型列表行：- [label](url) 尾部文字 / 邮箱 {copy} */
    function linksItemHtml(line) {
        var text = line.replace(/^\s*-\s+/, "").trim();
        var copy = /\{copy\}\s*$/.test(text);
        var body = text.replace(/\{copy\}\s*$/, "").trim();
        var m = body.match(/^\[([^\]]+)\]\(([^)\s]+)\)\s*(.*)$/);
        if (m) {
            var url = m[2];
            var dim = m[3] ? ' <span class="dim">' + escHtml(m[3]) + "</span>" : "";
            return "<li><a href=\"" + url + "\"" + (/^https?:/i.test(url) ? " target=\"_blank\" rel=\"noreferrer\"" : "") + ">"
                + escHtml(m[1]) + dim + " ↗</a></li>";
        }
        if (copy && /^\S+@\S+$/.test(body)) {
            return '<li class="link-mail"><span>' + escHtml(body) + '</span><button type="button" class="copy-btn samp" data-copy-email data-email="' + escHtml(body) + '">copy</button></li>';
        }
        return "<li>" + inlineMd(body) + "</li>";
    }

    /* 组装自发现卡片：返回 section 元素，复用现有卡片样式类 */
    function buildAutoCard(filename, body) {
        if (!body || !String(body).trim()) { return null; }
        var type = detectCardType(body);
        if (!type) { return null; }
        var title = "<h2 class=\"tile-title samp\">" + escHtml(filename) + "</h2>";
        var cls = "tile t-2w", inner = title;
        if (type === "links") {
            var items = String(body).replace(/\r\n?/g, "\n").split("\n")
                .map(function (l) { return l.trim(); })
                .filter(function (l) { return l; })
                .map(linksItemHtml);
            inner = title + '<ul class="link-list samp">' + items.join("") + "</ul>";
        } else if (type === "list") {
            var lis = String(body).replace(/\r\n?/g, "\n").split("\n")
                .map(function (l) { return l.replace(/^\s*-\s+/, ""); })
                .filter(function (l) { return l.trim(); })
                .map(function (l) { return '<li><span class="now-dot"></span>' + inlineMd(l) + "</li>"; });
            inner = title + '<ul class="now-list">' + lis.join("") + "</ul>";
        } else if (type === "quote") {
            cls = "tile tile--quote t-2w";
            var blocks = String(body).replace(/\r\n?/g, "\n").split(/\n\s*\n/);
            var quote = [], foot = [];
            blocks.forEach(function (b, i) {
                var ls = b.split("\n")
                    .map(function (l) { return l.replace(/^>\s?/, ""); })
                    .filter(function (l) { return l.trim(); });
                if (!ls.length) { return; }
                if (i === 0) { quote = ls; } else { foot = foot.concat(ls); }
            });
            inner = title + "<blockquote>" + quote.map(escHtml).join("<br>") + "</blockquote>";
            if (foot.length) { inner += '<p class="tile-foot samp">' + escHtml(foot.join(" ")) + "</p>"; }
        } else {
            inner = title + '<div class="tile-body">' + blockMd(body) + "</div>";
        }
        var card = document.createElement("section");
        card.className = cls;
        card.innerHTML = inner;
        return card;
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
        /* ---------- 自发现档案架：读取 manifest，按内容自动判型渲染卡片 ---------- */
        loadText("data/files-manifest.json").then(function (t) {
            if (!t) return;
            var manifest;
            try { manifest = JSON.parse(t); } catch (e) { return; }
            if (!Array.isArray(manifest)) return;
            var shelf = document.getElementById("auto-shelf");
            if (!shelf) return;
            manifest.filter(function (e) { return e.auto; }).forEach(function (entry) {
                loadText("files/" + entry.filename).then(function (body) {
                    if (!body) return;
                    var card = buildAutoCard(entry.filename, body);
                    if (card) { shelf.appendChild(card); }
                });
            });
        });
    }
    bindCopyButtons();
    bootFiles();

    /* ---------- 台面拖动 ----------
       桌面端（≥901px 且 pointer:fine）每张 .paper 可自由拖动；
       位置存 localStorage，刷新不丢；「还原台面」清空存档回到设计稿默认；
       点击不误触：位移超过阈值才算拖动，链接 / 按钮照常可点；
       移动端单列堆叠不绑定；跨过断点进入桌面时再初始化。 */
    var deskMq = window.matchMedia("(min-width: 901px)");
    var fineMq = window.matchMedia("(pointer: fine)");
    if (deskMq.matches && fineMq.matches) {
        initDeskDrag();
    } else if (deskMq.addEventListener) {
        deskMq.addEventListener("change", function (e) {
            if (e.matches && fineMq.matches) { initDeskDrag(); }
        });
    } else {
        deskMq.addListener(function (e) { if (e.matches && fineMq.matches) { initDeskDrag(); } });
    }

    function initDeskDrag() {
        if (document.body.dataset.deskDrag) { return; }   /* 防止重复绑定 */
        document.body.dataset.deskDrag = "1";
        var desk = document.querySelector(".desk");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".paper[data-desk-card]"));
        var resetBtn = document.getElementById("desk-reset");
        var hintEl = document.getElementById("drag-hint");
        var LS_KEY = "zloong-desk-v1";
        var HINT_KEY = "zloong-desk-hint-dismissed";
        var THRESHOLD = 6;   /* px：超过才算拖动，避免吞点击 */
        var cssVar = function (name, fallback) {   /* 读取 workshop.css 顶部的台面拖拽配置 */
            var v = getComputedStyle(document.documentElement).getPropertyValue(name);
            var p = parseInt(v, 10);
            return isNaN(p) ? fallback : p;
        };
        var pad = cssVar("--desk-padding", 24);    /* 活动空间边界留白 */
        var topZ = cssVar("--desk-z-stack", 10);   /* 拖拽栈起点：拖一张 +1，最后拖的在最上 */
        var start = null;

        if (!desk || !cards.length) { return; }

        function clamp(v, min, max) { return Math.min(Math.max(v, min), Math.max(min, max)); }

        function boundsPos(x, y, w, h) {
            var sz = { w: desk.clientWidth, h: desk.clientHeight };
            return {
                x: clamp(x, pad, Math.max(pad, sz.w - w - pad)),
                y: clamp(y, pad, Math.max(pad, sz.h - h - pad))
            };
        }

        /* 统一改成 left/top 定位（沿用当前布局位置），书签不再依赖 right 锚点 */
        function anchorAll() {
            cards.forEach(function (el) {
                if (!el.style.left) {
                    el.style.left = el.offsetLeft + "px";
                    el.style.top = el.offsetTop + "px";
                }
            });
        }

        function readSave() {
            try { return JSON.parse(localStorage.getItem(LS_KEY) || "null"); }
            catch (e) { return null; }
        }

        function writeSave() {
            var map = {};
            cards.forEach(function (el) {
                if (el.style.left && el.dataset.deskCard) {
                    map[el.dataset.deskCard] = {
                        x: parseFloat(el.style.left),
                        y: parseFloat(el.style.top)
                    };
                }
            });
            try { localStorage.setItem(LS_KEY, JSON.stringify(map)); } catch (e) { /* noop */ }
        }

        function restore() {
            var map = readSave();
            if (!map) { return; }
            cards.forEach(function (el) {
                var p = map[el.dataset.deskCard];
                if (!p || typeof p.x !== "number" || typeof p.y !== "number") { return; }
                var pos = boundsPos(p.x, p.y, el.offsetWidth, el.offsetHeight);
                el.style.left = pos.x + "px";
                el.style.top = pos.y + "px";
            });
        }

        function clampAll() {
            cards.forEach(function (el) {
                if (!el.style.left) { return; }
                var pos = boundsPos(parseFloat(el.style.left), parseFloat(el.style.top),
                                    el.offsetWidth, el.offsetHeight);
                el.style.left = pos.x + "px";
                el.style.top = pos.y + "px";
            });
            writeSave();
        }

        function dismissHint() {
            if (hintEl) { hintEl.classList.add("is-hidden"); }
            try { localStorage.setItem(HINT_KEY, "1"); } catch (e) { /* noop */ }
        }
        try {
            if (localStorage.getItem(HINT_KEY)) { hintEl.classList.add("is-hidden"); }
        } catch (e) { /* noop */ }

        function onDown(e) {
            if (e.button !== undefined && e.button !== 0) { return; }
            /* 链接 / 按钮上不启拖，避免吞掉点击 */
            if (e.target.closest && e.target.closest("a, button")) { return; }
            var el = e.currentTarget;
            start = {
                el: el,
                px: e.clientX,
                py: e.clientY,
                ox: el.offsetLeft,
                oy: el.offsetTop,
                moved: false
            };
            try { el.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
        }

        function onMove(e) {
            if (!start) { return; }
            var dx = e.clientX - start.px;
            var dy = e.clientY - start.py;
            if (!start.moved) {
                if (Math.sqrt(dx * dx + dy * dy) < THRESHOLD) { return; }
                start.moved = true;
                start.el.classList.add("is-dragging");
                dismissHint();
                document.body.style.userSelect = "none";
                document.body.style.cursor = "grabbing";
            }
            var pos = boundsPos(start.ox + dx, start.oy + dy,
                                start.el.offsetWidth, start.el.offsetHeight);
            start.el.style.left = pos.x + "px";
            start.el.style.top = pos.y + "px";
        }

        function onUp() {
            if (!start) { return; }
            var el = start.el;
            var moved = start.moved;
            start = null;
            if (el.classList.contains("is-dragging")) {
                el.classList.remove("is-dragging");
                document.body.style.userSelect = "";
                document.body.style.cursor = "";
                if (moved) {
                    topZ += 1;
                    el.style.zIndex = String(topZ);
                    writeSave();
                }
            }
        }

        cards.forEach(function (el) {
            el.addEventListener("pointerdown", onDown);
        });
        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);
        document.addEventListener("pointercancel", onUp);

        if (resetBtn) {
            resetBtn.addEventListener("click", function () {
                try { localStorage.removeItem(LS_KEY); } catch (e) { /* noop */ }
                cards.forEach(function (el) {
                    el.style.removeProperty("left");
                    el.style.removeProperty("top");
                    el.style.removeProperty("z-index");
                });
                topZ = cssVar("--desk-z-stack", 10);
                dismissHint();
            });
        }

        /* 窗口尺寸变化时兜底夹回台面内（防横向溢出）；
           仅桌面模式生效，避免把移动端流式布局误写成存档 */
        var rzT;
        window.addEventListener("resize", function () {
            clearTimeout(rzT);
            rzT = setTimeout(function () {
                if (!deskMq.matches) { return; }
                clampAll();
            }, 180);
        });

        anchorAll();
        restore();
    }
})();
