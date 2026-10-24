/* ============================================================
   ZLOONG 工房 · date.js —— 门牌日期注入（全站共用）
   用法：页面放 <span id="today">，再引入本脚本。
   data-date-format：
     缺省 / "cn"      → 2026年10月24日 · 星期六（子页门牌）
     "dossier"        → 2026.10.24（履历档案等宽格式）
   ============================================================ */
(function () {
    "use strict";
    var el = document.getElementById("today");
    if (!el) { return; }
    var nd = new Date();
    if (el.getAttribute("data-date-format") === "dossier") {
        var m = String(nd.getMonth() + 1).padStart(2, "0");
        var d = String(nd.getDate()).padStart(2, "0");
        el.textContent = nd.getFullYear() + "." + m + "." + d;
        return;
    }
    var week = "日一二三四五六".charAt(nd.getDay());
    el.textContent = nd.getFullYear() + "年" + (nd.getMonth() + 1) + "月" + nd.getDate() + "日 · 星期" + week;
})();
