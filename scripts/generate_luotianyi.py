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


def build_html(songs):
    grouped = OrderedDict()
    for s in songs:
        grouped.setdefault(s["y"], []).append(s)

    years = sorted(grouped, reverse=True)
    peak = max(len(v) for v in grouped.values())
    peak_year = next(y for y in sorted(grouped) if len(grouped[y]) == peak)
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

            # 殿堂 / 传说曲徽标与标记
            badge_html = ""
            classes = []
            if s["title"] in LEGEND_SONGS:
                classes.append("is-legend")
                badge_html = '<span class="song-badge badge-legend" title="VOCALOID 中文传说曲（百万达成）">传说</span>'
            elif s["title"] in HALL_SONGS:
                classes.append("is-hall")
                badge_html = '<span class="song-badge badge-hall" title="VOCALOID 中文殿堂曲">殿堂</span>'

            class_attr = (' class="%s"' % " ".join(classes)) if classes else ""

            items.append(
                '                <li%s data-title="%s">'
                '<span class="song-title">%s</span>%s%s'
                '<span class="song-date">%s%s</span>'
                '</li>' % (class_attr, html.escape(s["title"], quote=True), html.escape(s["title"]), badge_html, note, dl, tm)
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

    # 产量音频频谱仪（EQ Spectrum Visualizer）
    sorted_years = sorted(grouped)
    spark_bars = []
    for y in sorted_years:
        cnt = len(grouped[y])
        pct = 14 + round(86 * cnt / peak)
        is_peak = (cnt == peak)
        peak_tag = " · 巅峰" if is_peak else ""
        spark_bars.append(
            '<a href="#y%d" class="spark-bar%s" style="height:%d%%" '
            'data-year="%d" title="%d 年 · %d 首%s" aria-label="%d 年 · %d 首%s">'
            '<span class="spark-cap"></span>'
            '<span class="spark-fill"></span>'
            '</a>' % (y, " is-peak" if is_peak else "", pct, y, y, cnt, peak_tag, y, cnt, peak_tag)
        )
    spark = "".join(spark_bars)

    mid_year = sorted_years[len(sorted_years) // 2]

    return TEMPLATE.format(
        lede=lede,
        nav=nav,
        count=len(songs),
        span=years[-1],
        end=years[0],
        years=last["y"] - first["y"] + 1,
        timed=timed,
        spark=spark,
        peak_year=peak_year,
        peak_count=peak,
        mid_year=mid_year,
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
        <div class="hero-top">
            <div class="eyebrow">{span} &mdash; {end}</div>
            <button class="tianyi-bun-btn" type="button" id="bunBtn" title="投喂吃货大人小笼包" aria-label="投喂天依">
                <span class="bun-icon" aria-hidden="true">🥟</span>
                <span class="bun-text">投喂天依</span>
                <span class="bun-badge" id="bunCount" hidden>0</span>
            </button>
        </div>
        <h1>洛天依歌单</h1>
        <p class="lede">{lede}</p>
        <div class="stats">
            <div class="stat"><b>{count}</b><span>曲目</span></div>
            <div class="stat"><b>{years}</b><span>年跨度</span></div>
            <div class="stat"><b>{timed}</b><span>精确到秒</span></div>
        </div>
        <div class="spectrum-box">
            <div class="spectrum-meta">
                <span class="spectrum-title"><i class="eq-icon" aria-hidden="true"></i>AUDIO SPECTRUM // 创作频段</span>
                <span class="spectrum-legend">PEAK: {peak_year} ({peak_count} 首)</span>
            </div>
            <div class="spark" role="img" aria-label="各年份投稿数量音频频谱图">{spark}</div>
            <div class="spectrum-axis">
                <span>{span}</span>
                <span>{mid_year}</span>
                <span>{end}</span>
            </div>
        </div>
    </header>

    <div class="toolbar">
        <input class="search" type="search" placeholder="搜歌名、传说、殿堂…" aria-label="按歌名搜索">
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
    print("带精确时间: %d" % sum(1 for s in songs if s["h"] is not None))
    print("已生成: %s" % OUT_HTML)


if __name__ == "__main__":
    main()
