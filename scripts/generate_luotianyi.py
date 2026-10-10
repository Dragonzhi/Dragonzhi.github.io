#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从歌单 Markdown 生成 /luotianyi/ 页面。

数据源：luotianyi/洛天依歌单.md（一行一首，格式 `- 歌名 YYYY-MM-DD[ HH:MM:SS][ 备注]`）
产物：  luotianyi/index.html（纯静态，内容全部内嵌，无 fetch）

设计方向：「精修编年目录」——
工房纸面美学（米黄纸底、红墨朱砂、天依碧印），左侧常驻年份索引轨，
右侧编年曲目长流；歌名自适应多行，虚线导引 + 右侧日期时刻。
样式与交互是静态伴生文件（不随本脚本生成）：
    luotianyi/style.css  精修编年目录样式
    luotianyi/app.js     即时搜索 / 标签过滤 / 年份轨联动高亮

页面本身是静态渲染的，没有 JS 也能完整阅读；app.js 只负责搜索过滤和年份高亮。

用法（从仓库根或任意目录均可）：
    python scripts/generate_luotianyi.py
    python scripts/generate_luotianyi.py --src /path/to/洛天依歌单.md
    python scripts/generate_luotianyi.py --offline   # 用上次同步的本地快照
"""

import argparse
import html
import re
import sys
import urllib.parse
import urllib.request
from collections import OrderedDict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_HTML = ROOT / "luotianyi" / "index.html"
# 同步下来的快照，同时用作离线回退；不手改，由本脚本写入
CACHE_MD = ROOT / "luotianyi" / "洛天依歌单.md"

# 歌单数据的唯一来源（数据改动都在这个仓库里做）
GITHUB_REPO = "Dragonzhi/luotianyi-song-list"
GITHUB_BRANCH = "master"
GITHUB_FILE = "洛天依歌单.md"

LINE_RE = re.compile(
    r"^(?:-\s+)?(?P<title>.*?)"
    r"(?P<y>(?:19|20)\d{2})[.\-/](?P<mo>\d{1,2})[.\-/](?P<d>\d{1,2})"
    r"(?:\s*-\s*|\s+)?"
    r"(?:(?P<h>\d{1,2}):(?P<mi>\d{2})(?::(?P<s>\d{2}))?)?"
    r"\s*(?P<tail>.*)$"
)


def raw_url():
    return "https://raw.githubusercontent.com/%s/%s/%s" % (
        GITHUB_REPO, GITHUB_BRANCH, urllib.parse.quote(GITHUB_FILE))


def sync_from_github(dest):
    """拉取歌单仓库最新数据，写入本地快照，返回文本。"""
    req = urllib.request.Request(raw_url(), headers={"User-Agent": "luotianyi-page-generator"})
    with urllib.request.urlopen(req, timeout=25) as resp:
        text = resp.read().decode("utf-8")
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(text, encoding="utf-8")
    return text


def load_songs(args):
    """数据来源优先级：--src > GitHub 同步 > 上次同步的本地快照。"""
    if args.src:
        p = Path(args.src)
        if not p.exists():
            sys.exit("找不到指定文件: %s" % p)
        return "%s (指定)" % p, p.read_text(encoding="utf-8")

    if not args.offline:
        try:
            return "%s@%s (GitHub)" % (GITHUB_REPO, GITHUB_BRANCH), sync_from_github(CACHE_MD)
        except Exception as exc:
            print("从 GitHub 同步失败：%s" % exc)
            print("改用上次同步的本地快照。")

    if CACHE_MD.exists():
        return "%s (本地快照)" % CACHE_MD, CACHE_MD.read_text(encoding="utf-8")

    sys.exit("没有可用数据源：联网同步失败，且本地快照不存在")


def parse_songs(text):
    songs = []
    for raw in text.splitlines():
        s = raw.strip()
        if not s.startswith("- "):
            continue
        m = LINE_RE.match(s)
        if not m:
            continue
        g = m.groupdict()
        if not g["title"].strip():
            continue
        songs.append({
            "title": g["title"].strip(),
            "y": int(g["y"]), "mo": int(g["mo"]), "d": int(g["d"]),
            "h": int(g["h"]) if g["h"] is not None else None,
            "mi": int(g["mi"]) if g["mi"] is not None else None,
            "s": int(g["s"] or 0) if g["h"] is not None else None,
            "note": g["tail"].strip(),
        })
    return songs


def date_label(song):
    """年份已由分组标题承担，行内只显示月日，带时间的再缀上时刻。"""
    label = "%02d-%02d" % (song["mo"], song["d"])
    if song["h"] is not None:
        return label, "%02d:%02d" % (song["h"], song["mi"])
    return label, ""


LEGEND_SONGS = {
    "权御天下", "达拉崩吧", "勾指起誓", "世末歌者", "霜雪千年",
    "夜航星", "三月雨", "大氿歌", "干物女", "东京不太热", "万古生香"
}

HALL_SONGS = {
    "千年食谱颂", "66ccff", "一花依世界", "前尘如梦", "追光使者",
    "深海少女", "夏夕空", "夏风", "心跳同步的时光", "九尾妖狐",
    "夜行者们", "遥远的相遇", "登陆宇宙", "Connect【洛天依的构成】",
    "末日DISCO", "明日DISCO", "梦回古城", "天行健", "starlight",
    "Henceforth", "step on your heart"
}

# 单字朱印：传说（百万）/ 殿堂（十万）
LEGEND_BADGE = '<span class="badge badge-legend" title="VOCALOID 中文传说曲（百万达成）">传</span>'
HALL_BADGE = '<span class="badge badge-hall" title="VOCALOID 中文殿堂曲（十万达成）">殿</span>'


def build_html(songs):
    # 保证「按投稿日期倒序 · 同一天按时间倒序」，不依赖文件顺序
    songs = sorted(
        songs,
        key=lambda s: (s["y"], s["mo"], s["d"], s["h"] or 0, s["mi"] or 0, s["s"] or 0),
        reverse=True,
    )

    grouped = OrderedDict()
    for s in songs:
        grouped.setdefault(s["y"], []).append(s)

    years = sorted(grouped, reverse=True)
    peak = max(len(v) for v in grouped.values())
    first, last = songs[-1], songs[0]
    timed = sum(1 for s in songs if s["h"] is not None)
    legend_n = sum(1 for s in songs if s["title"] in LEGEND_SONGS)
    hall_n = sum(1 for s in songs if s["title"] in HALL_SONGS and s["title"] not in LEGEND_SONGS)

    # 左侧年份刻度轨（倒序；条长按峰值年份归一）
    rail_items = []
    for y in years:
        rows = grouped[y]
        bar = int(len(rows) * 100 / peak)
        rail_items.append(
            '        <a href="#year-%d" class="rail-item" data-year="%d" id="rail-%d" aria-label="%d 年，共 %d 首">\n'
            '            <span class="rail-indicator" aria-hidden="true"></span>\n'
            '            <span class="rail-year">%d</span>\n'
            '            <span class="rail-bar-wrap" aria-hidden="true">\n'
            '                <span class="rail-bar-fill" style="width: %d%%"></span>\n'
            '            </span>\n'
            '            <span class="rail-count">%d</span>\n'
            '            <span class="rail-match-count" hidden>0</span>\n'
            '        </a>' % (y, y, y, y, len(rows), y, bar, len(rows))
        )
    rail = "\n".join(rail_items)

    # 右侧编年曲目区
    blocks = []
    for y in years:
        rows = grouped[y]
        newest, oldest = rows[0], rows[-1]
        items = []
        for s in rows:
            dl, tl = date_label(s)
            note = ('<span class="song-note">%s</span>' % html.escape(s["note"])) if s["note"] else ""

            # 殿堂 / 传说：单字朱印（搜索仍靠 data-* 属性）
            classes = ["song-row"]
            badge = ""
            if s["title"] in LEGEND_SONGS:
                classes.append("is-legend")
                badge = LEGEND_BADGE
            elif s["title"] in HALL_SONGS:
                classes.append("is-hall")
                badge = HALL_BADGE

            tm = ('<span class="song-time">%s</span>' % tl) if tl else ""
            items.append(
                '            <li class="%s" data-title="%s" data-legend="%s" data-hall="%s" data-has-time="%s">\n'
                '                <div class="song-main">\n'
                '                    <span class="song-title">%s</span>%s%s\n'
                '                </div>\n'
                '                <span class="song-leader" aria-hidden="true"></span>\n'
                '                <span class="song-date-wrap">\n'
                '                    <span class="song-date">%s</span>%s\n'
                '                </span>\n'
                '            </li>' % (
                    " ".join(classes),
                    html.escape(s["title"], quote=True),
                    "true" if s["title"] in LEGEND_SONGS else "false",
                    "true" if s["title"] in HALL_SONGS else "false",
                    "true" if tl else "false",
                    html.escape(s["title"]), badge, note, dl, tm,
                )
            )
        blocks.append(
            '        <section class="year-section" id="year-%d" data-year="%d">\n'
            '            <header class="year-header">\n'
            '                <div class="year-title-wrap">\n'
            '                    <span class="year-seal" aria-hidden="true">卷</span>\n'
            '                    <h2 class="year-num">%d</h2>\n'
            '                    <span class="year-meta samp">%02d-%02d &rarr; %02d-%02d · 本年 %d 首</span>\n'
            '                </div>\n'
            '                <div class="year-rule" aria-hidden="true"></div>\n'
            '            </header>\n'
            '            <ol class="song-list">\n%s\n'
            '            </ol>\n'
            '        </section>' % (
                y, y, y,
                oldest["mo"], oldest["d"], newest["mo"], newest["d"], len(rows),
                "\n".join(items),
            )
        )

    lede = ("十二年，从《%s》到《%s》。"
            % (html.escape(first["title"]), html.escape(last["title"])))
    lede_note = "按投稿日期倒序 · 同一天按时间倒序"

    return TEMPLATE.format(
        lede=lede,
        lede_note=lede_note,
        count=len(songs),
        span=years[-1],
        end=years[0],
        years=last["y"] - first["y"] + 1,
        legend=legend_n,
        hall=hall_n,
        timed=timed,
        rail=rail,
        blocks="\n".join(blocks),
        built=date.today().isoformat(),
        last_date="%04d-%02d-%02d" % (last["y"], last["mo"], last["d"]),
    )


TEMPLATE = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>洛天依歌单 · ZLOONG 工房</title>
<meta name="description" content="十二年，{count} 首。按投稿日期整理的洛天依曲目编年史。">
<meta name="theme-color" content="#f5f0e6">
<link rel="icon" href="../images/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.cn">
<link href="https://fonts.googleapis.cn/css2?family=Averia+Gruesa+Libre&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.css" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>

<div class="layout-container">

    <!-- 左侧常驻目录索引轨 -->
    <aside class="sidebar" aria-label="编年目录索引">
        <div class="sidebar-brand">
            <span class="sidebar-tag samp">ARCHIVE INDEX</span>
            <div class="sidebar-title">曲目编年典藏</div>
        </div>

        <div class="search-box">
            <div class="search-input-wrap">
                <input type="search" class="search-input" id="searchInput" placeholder="搜索歌名、殿堂、传说…" aria-label="搜索歌名或标签">
                <button type="button" class="search-clear" id="searchClear" aria-label="清空搜索" hidden>&times;</button>
            </div>

            <div class="filter-chips" role="toolbar" aria-label="快速筛选">
                <button type="button" class="chip-btn is-active" data-filter="all">全部 {count}</button>
                <button type="button" class="chip-btn" data-filter="legend">传说 {legend}</button>
                <button type="button" class="chip-btn" data-filter="hall">殿堂 {hall}</button>
                <button type="button" class="chip-btn" data-filter="time">时刻 {timed}</button>
            </div>

            <div class="search-status samp" id="searchStatus" role="status" aria-live="polite">
                当前显示全部 {count} 首
            </div>
        </div>

        <div class="rail-heading samp">YEARLY TIMELINE</div>
        <nav class="rail-list" id="railNav" aria-label="年份刻度跳转">
{rail}
        </nav>
    </aside>

    <!-- 右侧主编年流 -->
    <main class="main-stream">

        <!-- 报头卡片 -->
        <header class="stream-hero">
            <div class="stream-hero-top">
                <span>ZLOONG 工房 · 洛天依文献目录</span>
                <span>{span} &mdash; {end}</span>
                <span>整理：ZLOONG · 排印：Hanako</span>
            </div>

            <div class="stream-hero-title-area">
                <div class="stream-title-group">
                    <h1>洛天依曲目编年</h1>
                    <div class="stream-subtitle samp">LUO TIAN YI &middot; CHRONOLOGICAL SONGBOOK</div>
                </div>
                <div class="stream-ornament" aria-hidden="true">
                    <svg viewBox="0 0 54 34" width="54" height="34" fill="none" stroke="#2e7fa6" stroke-width="1.6">
                        <path d="M14 26 V9 L40 4.8 V21.8"/>
                        <path d="M14 11.5 L40 7.3" stroke-width="3.6"/>
                        <ellipse cx="10" cy="26" rx="4.2" ry="3.2" fill="#2e7fa6" stroke="none"/>
                        <ellipse cx="36" cy="21.8" rx="4.2" ry="3.2" fill="#2e7fa6" stroke="none"/>
                    </svg>
                </div>
            </div>

            <div class="stream-quote">
                <span>「{lede}」</span>
                <span class="samp" style="font-size:12px; color:var(--ink-faint);">{lede_note}</span>
            </div>

            <div class="stream-stats">
                <div class="stat-pill"><b>{count}</b><span>收录曲目</span></div>
                <div class="stat-pill"><b>{years}</b><span>年度跨度</span></div>
                <div class="stat-pill"><b>{legend}</b><span>传说典藏</span></div>
                <div class="stat-pill"><b>{hall}</b><span>殿堂代表</span></div>
                <div class="stat-pill"><b>{timed}</b><span>精确至时刻</span></div>
            </div>
        </header>

        <!-- 各年份曲目区 -->
        <div class="stream-content" id="streamContent">
{blocks}
        </div>

        <div class="empty-box" id="emptyNotice" hidden>
            <p>未找到符合条件的曲目记录</p>
            <button type="button" class="reset-btn" id="emptyReset">恢复显示全部曲目</button>
        </div>

        <footer class="stream-colophon">
            <a class="back" href="../">&larr; 回 ZLOONG 工房</a><br>
            数据截止 {last_date} · 排印于 {built}<br>
            <span class="credit">歌迷整理 · 曲目版权归各创作者及版权方所有</span><br>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">闽ICP备20260330551号-1</a>
        </footer>

    </main>

</div>

<script src="app.js"></script>
</body>
</html>
"""


def main():
    ap = argparse.ArgumentParser(description="生成洛天依歌单页面")
    ap.add_argument("--src", help="指定歌单 Markdown 路径（绕过 GitHub 同步）")
    ap.add_argument("--offline", action="store_true", help="不联网，直接用上次同步的本地快照")
    args = ap.parse_args()

    origin, text = load_songs(args)
    songs = parse_songs(text)
    if not songs:
        sys.exit("没解析出任何条目，检查数据格式")

    body = build_html(songs)

    OUT_HTML.parent.mkdir(parents=True, exist_ok=True)
    OUT_HTML.write_text(body, encoding="utf-8")

    print("数据源: %s" % origin)
    print("条目数: %d" % len(songs))
    print("年份: %d - %d" % (songs[-1]["y"], songs[0]["y"]))
    print("传说/殿堂/带时间: %d/%d/%d" % (
        sum(1 for s in songs if s["title"] in LEGEND_SONGS),
        sum(1 for s in songs if s["title"] in HALL_SONGS and s["title"] not in LEGEND_SONGS),
        sum(1 for s in songs if s["h"] is not None)))
    print("已生成: %s" % OUT_HTML)


if __name__ == "__main__":
    main()
