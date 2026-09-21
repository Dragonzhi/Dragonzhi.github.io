#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从歌单 Markdown 生成 /luotianyi/ 页面。

数据源：luotianyi/洛天依歌单.md（一行一首，格式 `- 歌名 YYYY-MM-DD[ HH:MM:SS][ 备注]`）
产物：  luotianyi/index.html（纯静态，内容全部内嵌，无 fetch）

页面本身是静态渲染的，没有 JS 也能完整阅读；app.js 只负责搜索过滤和年份高亮。

用法（从仓库根或任意目录均可）：
    python scripts/generate_luotianyi.py
    python scripts/generate_luotianyi.py --src /path/to/洛天依歌单.md
"""

import argparse
import html
import re
import sys
from collections import OrderedDict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_HTML = ROOT / "luotianyi" / "index.html"

DEFAULT_SOURCES = [
    ROOT / "luotianyi" / "洛天依歌单.md",
    Path.home() / "desk" / "洛天依歌单" / "洛天依歌单.md",
]

LINE_RE = re.compile(
    r"^(?:-\s+)?(?P<title>.*?)"
    r"(?P<y>(?:19|20)\d{2})[.\-/](?P<mo>\d{1,2})[.\-/](?P<d>\d{1,2})"
    r"(?:\s*-\s*|\s+)?"
    r"(?:(?P<h>\d{1,2}):(?P<mi>\d{2})(?::(?P<s>\d{2}))?)?"
    r"\s*(?P<tail>.*)$"
)


def pick_source(explicit):
    if explicit:
        p = Path(explicit)
        if not p.exists():
            sys.exit("找不到指定文件: %s" % p)
        return p
    for p in DEFAULT_SOURCES:
        if p.exists():
            return p
    sys.exit("找不到歌单文件，试过:\n  " + "\n  ".join(str(p) for p in DEFAULT_SOURCES))


def parse_songs(path):
    songs = []
    for raw in path.read_text(encoding="utf-8").splitlines():
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


def build_html(songs):
    grouped = OrderedDict()
    for s in songs:
        grouped.setdefault(s["y"], []).append(s)

    years = sorted(grouped, reverse=True)
    peak = max(len(v) for v in grouped.values())
    first, last = songs[-1], songs[0]
    timed = sum(1 for s in songs if s["h"] is not None)

    nav = "".join(
        '<a href="#y%d">%d</a>' % (y, y) for y in years
    )

    blocks = []
    for y in years:
        rows = grouped[y]
        items = []
        for s in rows:
            dl, tl = date_label(s)
            note = ('<span class="song-note">%s</span>' % html.escape(s["note"])) if s["note"] else ""
            tm = ('<span class="song-time">%s</span>' % tl) if tl else ""
            items.append(
                '                <li data-title="%s">'
                '<span class="song-title">%s</span>%s'
                '<span class="song-date">%s%s</span>'
                '</li>' % (html.escape(s["title"], quote=True), html.escape(s["title"]), note, dl, tm)
            )
        bar_grow = max(6, round(len(rows) * 100 / peak))
        blocks.append(
            '        <section class="year" id="y%d">\n'
            '            <span class="year-node"></span>\n'
            '            <div class="year-head">\n'
            '                <span class="year-num">%d</span>\n'
            '                <span class="year-bar" style="flex-grow:%d"></span>\n'
            '                <span class="year-count">%d 首</span>\n'
            '            </div>\n'
            '            <ol class="songs">\n%s\n            </ol>\n'
            '        </section>' % (y, y, bar_grow, len(rows), "\n".join(items))
        )

    lede = ("十二年，从《%s》到《%s》。按投稿日期倒序排列，同一天按投稿时间倒序。"
            % (html.escape(first["title"]), html.escape(last["title"])))

    # 十二年产量微缩图，按时间正向排列
    spark = "".join(
        '<i style="height:%d%%" title="%d 年 · %d 首"></i>'
        % (14 + round(86 * len(grouped[y]) / peak), y, len(grouped[y]))
        for y in sorted(grouped)
    )

    return TEMPLATE.format(
        lede=lede,
        nav=nav,
        count=len(songs),
        span=years[-1],
        end=years[0],
        years=last["y"] - first["y"] + 1,
        timed=timed,
        spark=spark,
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
<meta name="theme-color" content="#080d15">
<link rel="icon" href="../images/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.cn">
<link rel="stylesheet" href="https://fonts.googleapis.cn/css2?family=Noto+Serif+SC:wght@500;700&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="page">

    <header class="hero">
        <div class="eyebrow">{span} &mdash; {end}</div>
        <h1>洛天依歌单</h1>
        <p class="lede">{lede}</p>
        <div class="stats">
            <div class="stat"><b>{count}</b><span>曲目</span></div>
            <div class="stat"><b>{years}</b><span>年跨度</span></div>
            <div class="stat"><b>{timed}</b><span>精确到秒</span></div>
        </div>
        <div class="spark" aria-hidden="true">{spark}</div>
    </header>

    <div class="toolbar">
        <input class="search" type="search" placeholder="搜歌名…" aria-label="按歌名搜索">
        <nav class="years" aria-label="按年份跳转">{nav}</nav>
    </div>

    <main class="timeline">
{blocks}
    </main>

    <p class="empty" hidden>没有匹配的歌名</p>

    <footer class="colophon">
        <a class="back" href="../">&larr; 回 ZLOONG 工房</a><br>
        数据截止 {last_date} · 生成于 {built}<br>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">闽ICP备20260330551号-1</a>
    </footer>

</div>
<script src="app.js"></script>
</body>
</html>
"""


def main():
    ap = argparse.ArgumentParser(description="生成洛天依歌单页面")
    ap.add_argument("--src", help="歌单 Markdown 路径")
    args = ap.parse_args()

    src = pick_source(args.src)
    songs = parse_songs(src)
    if not songs:
        sys.exit("没解析出任何条目，检查文件格式: %s" % src)

    body = build_html(songs)

    OUT_HTML.parent.mkdir(parents=True, exist_ok=True)
    OUT_HTML.write_text(body, encoding="utf-8")

    print("数据源: %s" % src)
    print("条目数: %d" % len(songs))
    print("年份: %d - %d" % (songs[-1]["y"], songs[0]["y"]))
    print("带精确时间: %d" % sum(1 for s in songs if s["h"] is not None))
    print("已生成: %s" % OUT_HTML)


if __name__ == "__main__":
    main()
