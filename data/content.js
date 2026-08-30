/* ============================================================
   站点文案配置 —— 想改 about.md / now.md / 首屏打字机的内容，
   只需要改这个文件，不用动 HTML。
   字符串里可以写行内 HTML（比如 <code class="tag">、<span class="state">）。
   ============================================================ */

window.SITE_CONTENT = {

    /* 首屏打字机轮播的句子 */
    phrases: [
        "Hi, I'm Dragonzhi.",
        "make games, have fun.",
        "vibe coding…"
    ],

    /* 今日一言：按日期轮选 —— 同一天所有人看到同一句，次日自动换下一句。
       q = 正文，w = 落款。这里用 textContent 渲染，只写纯文本，不要放 HTML。
       数组顺序即轮选顺序，从第 1 条开始。 */
    dailyQuotes: [
        { q: "「 make games, have fun, and ship it someday. 」", w: "— 钉在墙上的话 · 手机电量与动力同步下降中 (˶ᵔ ᵕ ᵔ˶)" },
        { q: "「 the best way to predict the future is to build it. 」", w: "— 墙上的英文课 · 所以我在敲代码" },
        { q: "「 bug 不是错误，是还没读完的文档。 」", w: "— 台面笔记 · 用 console.log 审讯它" },
        { q: "「 把自己的兴趣做成能摸到的作品。 」", w: "— now.md 的注脚 · 在制中" },
        { q: "「 ship it someday — someday is today. 」", w: "— 便签 · 尽量让 someday 早一点" },
        { q: "「 add oil，今天也要开工。 」", w: "— 刻在桌面的一句 · 给今天也给自己" }
    ],

    /* about.md 卡片：一段一个字符串 */
    about: [
        "我是一名对游戏开发感兴趣的大学生，目前主要在学习游戏引擎和AI开发相关内容。常用 AI Agent（DeepSeek Harness、Codex）辅助拆任务、查代码、验证方案，重要逻辑还是自己检查和测试。"
    ],

    /* now.md 卡片：一行一个字符串 */
    now: [
        "棱镜：碧芙洛斯 · 卡牌打磨中 <span class=\"state\">在制</span>",
        "正在学游戏引擎",
        "摸鱼 Minecraft Mod（Forge · Kotlin）",
        "♪ now playing：洛天依 <code class=\"tag samp\">#66CCFF</code>"
    ]
};
