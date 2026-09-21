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


VECTOR_SCENES_HTML = """
<div class="vector-stage" id="vectorStage" aria-hidden="true">
    <!-- 默认/顶部总览场景：洛天依标志八卦碧玉光轮 -->
    <div class="vector-scene is-active" data-year="hero">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <g class="anim-spin-slow" style="transform-origin: 800px 220px;">
                <circle cx="800" cy="220" r="250" stroke="#66ccff" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.45"/>
                <circle cx="800" cy="220" r="220" stroke="#66ccff" stroke-width="1" opacity="0.6"/>
                <circle cx="800" cy="220" r="180" stroke="#66ccff" stroke-width="2" stroke-dasharray="1 10" opacity="0.5"/>
                <circle cx="800" cy="220" r="130" stroke="#66ccff" stroke-width="1.5" opacity="0.7"/>
                <path d="M 800 130 A 45 45 0 0 1 800 220 A 45 45 0 0 0 800 310 A 90 90 0 0 1 800 130" stroke="#66ccff" stroke-width="2" fill="none" opacity="0.65"/>
                <circle cx="800" cy="175" r="7" fill="#66ccff"/>
                <circle cx="800" cy="265" r="7" stroke="#66ccff" stroke-width="2" fill="none"/>
            </g>
        </svg>
    </div>

    <!-- 2024: 数字蝶变 · Connect【洛天依的构成】与《蝴蝶》 -->
    <div class="vector-scene" data-year="2024">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <circle cx="750" cy="280" r="220" stroke="#66ccff" stroke-width="1" stroke-dasharray="4 6" class="anim-pulse"/>
            <circle cx="750" cy="280" r="160" stroke="#66ccff" stroke-width="1.5" opacity="0.5"/>
            <g class="anim-flutter" style="transform-origin: 750px 280px;">
                <path d="M 750 280 Q 640 160 560 180 Q 520 260 620 310 Q 680 340 750 280" stroke="#66ccff" stroke-width="2.5" fill="rgba(102,204,255,0.06)"/>
                <path d="M 750 280 Q 650 340 590 390 Q 630 450 710 390 Q 730 350 750 280" stroke="#66ccff" stroke-width="2" fill="rgba(102,204,255,0.04)"/>
                <line x1="750" y1="280" x2="570" y2="200" stroke="#66ccff" stroke-width="1" stroke-dasharray="2 4"/>
                <line x1="750" y1="280" x2="610" y2="400" stroke="#66ccff" stroke-width="1" stroke-dasharray="2 4"/>
                <path d="M 750 280 Q 860 160 940 180 Q 980 260 880 310 Q 820 340 750 280" stroke="#66ccff" stroke-width="2.5" fill="rgba(102,204,255,0.06)"/>
                <path d="M 750 280 Q 850 340 910 390 Q 870 450 790 390 Q 770 350 750 280" stroke="#66ccff" stroke-width="2" fill="rgba(102,204,255,0.04)"/>
                <line x1="750" y1="280" x2="930" y2="200" stroke="#66ccff" stroke-width="1" stroke-dasharray="2 4"/>
                <line x1="750" y1="240" x2="750" y2="320" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
                <path d="M 750 240 Q 735 215 720 210" stroke="#66ccff" stroke-width="1.5" fill="none"/>
                <path d="M 750 240 Q 765 215 780 210" stroke="#66ccff" stroke-width="1.5" fill="none"/>
            </g>
        </svg>
    </div>

    <!-- 2023: 太空纪元 · 《登陆宇宙》与《聚光》 -->
    <div class="vector-scene" data-year="2023">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <path d="M 100 600 Q 650 360 1150 460" stroke="#66ccff" stroke-width="2" fill="none" opacity="0.8"/>
            <path d="M 100 600 Q 650 360 1150 460 L 1150 600 Z" fill="rgba(102,204,255,0.03)"/>
            <circle cx="800" cy="220" r="140" stroke="#66ccff" stroke-width="1" stroke-dasharray="3 6" opacity="0.5" class="anim-spin-slow" style="transform-origin: 800px 220px;"/>
            <circle cx="800" cy="220" r="70" stroke="#66ccff" stroke-width="1.5" opacity="0.6"/>
            <line x1="800" y1="80" x2="800" y2="360" stroke="#66ccff" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
            <polygon points="620,0 840,0 1060,600 520,600" fill="url(#spotlightGrad)" opacity="0.14"/>
        </svg>
    </div>

    <!-- 2022: 纪元回溯 · 《倒转四十六亿年》与《你和我的篇章》 -->
    <div class="vector-scene" data-year="2022">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <g class="anim-spin-slow" style="transform-origin: 640px 280px;">
                <circle cx="640" cy="280" r="80" stroke="#66ccff" stroke-width="2" fill="none"/>
                <circle cx="640" cy="280" r="30" stroke="#66ccff" stroke-width="1"/>
                <line x1="640" y1="200" x2="640" y2="360" stroke="#66ccff" stroke-width="1" stroke-dasharray="4 4"/>
            </g>
            <g class="anim-spin-slow" style="transform-origin: 860px 280px; animation-direction: reverse;">
                <circle cx="860" cy="280" r="80" stroke="#66ccff" stroke-width="2" fill="none"/>
                <circle cx="860" cy="280" r="30" stroke="#66ccff" stroke-width="1"/>
                <line x1="860" y1="200" x2="860" y2="360" stroke="#66ccff" stroke-width="1" stroke-dasharray="4 4"/>
            </g>
            <line x1="640" y1="200" x2="860" y2="200" stroke="#66ccff" stroke-width="2" opacity="0.7"/>
            <line x1="640" y1="360" x2="860" y2="360" stroke="#66ccff" stroke-width="2" opacity="0.7"/>
            <path d="M 350 350 Q 600 120 850 350 T 1200 350" stroke="#66ccff" stroke-width="1" stroke-dasharray="6 8" opacity="0.45"/>
        </svg>
    </div>

    <!-- 2021: 失重空间 · 《失重博物馆》与《人间定律》 -->
    <div class="vector-scene" data-year="2021">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <g class="anim-float" style="transform-origin: 760px 250px;">
                <rect x="680" y="140" width="160" height="220" rx="4" stroke="#66ccff" stroke-width="2" fill="rgba(102,204,255,0.03)" transform="rotate(-15 760 250)"/>
                <rect x="700" y="160" width="120" height="180" stroke="#66ccff" stroke-width="1" stroke-dasharray="4 4" fill="none" transform="rotate(-15 760 250)"/>
            </g>
            <g transform="translate(540, 200) rotate(25)" class="anim-float" style="animation-delay: -2.5s;">
                <polygon points="50,15 90,35 50,55 10,35" stroke="#66ccff" stroke-width="1.5" fill="none"/>
                <polygon points="50,55 90,35 90,80 50,100" stroke="#66ccff" stroke-width="1.5" fill="none"/>
                <polygon points="50,55 10,35 10,80 50,100" stroke="#66ccff" stroke-width="1.5" fill="none"/>
            </g>
        </svg>
    </div>

    <!-- 2020: 曲速航行 · 《夜航星》与《万古生香》 -->
    <div class="vector-scene" data-year="2020">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <g style="transform-origin: 750px 300px;">
                <circle cx="750" cy="300" r="180" stroke="#66ccff" stroke-width="1.5" stroke-dasharray="12 12" opacity="0.6" class="anim-spin-slow"/>
                <circle cx="750" cy="300" r="130" stroke="#ffe680" stroke-width="1" opacity="0.5"/>
                <circle cx="750" cy="300" r="80" stroke="#66ccff" stroke-width="2" opacity="0.8"/>
                <circle cx="750" cy="300" r="8" fill="#fff" class="anim-pulse"/>
                <line x1="750" y1="300" x2="280" y2="70" stroke="#66ccff" stroke-width="1.5" stroke-dasharray="10 15" opacity="0.5"/>
                <line x1="750" y1="300" x2="220" y2="300" stroke="#66ccff" stroke-width="2" stroke-dasharray="15 20" opacity="0.6"/>
                <line x1="750" y1="300" x2="300" y2="530" stroke="#66ccff" stroke-width="1.5" stroke-dasharray="10 15" opacity="0.5"/>
                <line x1="750" y1="300" x2="1100" y2="50" stroke="#66ccff" stroke-width="1.5" stroke-dasharray="20 10" opacity="0.4"/>
                <line x1="750" y1="300" x2="1160" y2="490" stroke="#66ccff" stroke-width="1.5" stroke-dasharray="20 10" opacity="0.4"/>
            </g>
        </svg>
    </div>

    <!-- 2019: 誓约红线 · 《勾指起誓》与《大氿歌》 -->
    <div class="vector-scene" data-year="2019">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <path d="M 150 350 C 420 180, 560 420, 750 280 C 860 200, 960 320, 1120 240" stroke="#ff6b81" stroke-width="2.5" fill="none" class="anim-wave" opacity="0.75"/>
            <path d="M 150 350 C 420 180, 560 420, 750 280 C 860 200, 960 320, 1120 240" stroke="#ff8da1" stroke-width="6" fill="none" opacity="0.16" filter="blur(3px)"/>
            <circle cx="750" cy="280" r="18" stroke="#ff6b81" stroke-width="2" fill="rgba(255,107,129,0.08)" class="anim-pulse"/>
            <circle cx="750" cy="280" r="36" stroke="#66ccff" stroke-width="1" stroke-dasharray="3 5" opacity="0.5"/>
            <line x1="880" y1="80" x2="880" y2="520" stroke="#66ccff" stroke-width="1.5" opacity="0.3" stroke-dasharray="45 4"/>
            <line x1="920" y1="120" x2="920" y2="480" stroke="#66ccff" stroke-width="1" opacity="0.2" stroke-dasharray="35 3"/>
        </svg>
    </div>

    <!-- 2018: 深海繁花 · 《一花依世界》与《深海少女》 -->
    <div class="vector-scene" data-year="2018">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <circle cx="680" cy="450" r="14" stroke="#66ccff" stroke-width="1.5" fill="rgba(102,204,255,0.06)" class="anim-bubble" style="animation-delay: 0s;"/>
            <circle cx="740" cy="380" r="22" stroke="#66ccff" stroke-width="1.5" fill="rgba(102,204,255,0.04)" class="anim-bubble" style="animation-delay: -1.5s;"/>
            <circle cx="820" cy="480" r="18" stroke="#66ccff" stroke-width="1.5" fill="rgba(102,204,255,0.05)" class="anim-bubble" style="animation-delay: -3s;"/>
            <g transform="translate(760, 220)" class="anim-pulse">
                <path d="M 0 0 C -30 -60, -70 -70, -70 -110 C -70 -150, 0 -180, 0 -180 C 0 -180, 70 -150, 70 -110 C 70 -70, 30 -60, 0 0" stroke="#66ccff" stroke-width="2" fill="rgba(102,204,255,0.04)"/>
                <path d="M 0 0 C -50 -30, -110 -20, -130 -60 C -150 -100, -80 -130, -80 -130 C -80 -130, -30 -90, 0 0" stroke="#66ccff" stroke-width="1.5" fill="none"/>
                <path d="M 0 0 C 50 -30, 110 -20, 130 -60 C 150 -100, 80 -130, 80 -130 C 80 -130, 30 -90, 0 0" stroke="#66ccff" stroke-width="1.5" fill="none"/>
            </g>
        </svg>
    </div>

    <!-- 2017: 舞台追光与魔性圣剑 · 《达拉崩吧》与《追光使者》 -->
    <div class="vector-scene" data-year="2017">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <polygon points="480,0 650,0 950,600 600,600" fill="url(#spotlightGrad)" opacity="0.18"/>
            <g transform="translate(760, 240) rotate(45)">
                <line x1="0" y1="-120" x2="0" y2="80" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
                <line x1="0" y1="-120" x2="0" y2="80" stroke="#66ccff" stroke-width="10" opacity="0.3" stroke-linecap="round"/>
                <line x1="-30" y1="30" x2="30" y2="30" stroke="#ffe680" stroke-width="3" stroke-linecap="round"/>
                <circle cx="0" cy="30" r="5" fill="#ffe680"/>
                <path d="M -20 -40 Q -120 -80 -180 -20 Q -140 40 -80 10" stroke="#66ccff" stroke-width="1.5" fill="none" opacity="0.5"/>
            </g>
        </svg>
    </div>

    <!-- 2016: 末世落日与铁轨 · 《世末歌者》 -->
    <div class="vector-scene" data-year="2016">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <circle cx="750" cy="320" r="130" stroke="#ff7744" stroke-width="2" fill="url(#sunsetGrad)" opacity="0.35" class="anim-pulse"/>
            <line x1="350" y1="320" x2="1050" y2="320" stroke="#ff7744" stroke-width="1.5" opacity="0.6"/>
            <line x1="750" y1="320" x2="520" y2="600" stroke="#66ccff" stroke-width="2" opacity="0.7"/>
            <line x1="750" y1="320" x2="980" y2="600" stroke="#66ccff" stroke-width="2" opacity="0.7"/>
            <line x1="700" y1="380" x2="800" y2="380" stroke="#66ccff" stroke-width="1" opacity="0.4"/>
            <line x1="640" y1="440" x2="860" y2="440" stroke="#66ccff" stroke-width="1.5" opacity="0.5"/>
            <line x1="580" y1="510" x2="920" y2="510" stroke="#66ccff" stroke-width="2" opacity="0.6"/>
            <line x1="880" y1="200" x2="880" y2="420" stroke="#66ccff" stroke-width="2" opacity="0.6"/>
            <line x1="850" y1="220" x2="910" y2="220" stroke="#66ccff" stroke-width="2" opacity="0.6"/>
        </svg>
    </div>

    <!-- 2015: 金戈霜雪 · 《权御天下》与《霜雪千年》 -->
    <div class="vector-scene" data-year="2015">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <g transform="translate(680, 180) rotate(-20)">
                <line x1="0" y1="0" x2="0" y2="340" stroke="#ffe680" stroke-width="3" opacity="0.7"/>
                <polygon points="0,20 130,70 0,120" stroke="#ffe680" stroke-width="2" fill="rgba(255,207,64,0.08)"/>
                <circle cx="0" cy="0" r="6" fill="#ffe680"/>
            </g>
            <g transform="translate(850, 200)" class="anim-spin-slow">
                <line x1="-35" y1="0" x2="35" y2="0" stroke="#66ccff" stroke-width="2"/>
                <line x1="0" y1="-35" x2="0" y2="35" stroke="#66ccff" stroke-width="2"/>
                <line x1="-25" y1="-25" x2="25" y2="25" stroke="#66ccff" stroke-width="1.5"/>
                <line x1="-25" y1="25" x2="25" y2="-25" stroke="#66ccff" stroke-width="1.5"/>
                <circle cx="0" cy="0" r="7" stroke="#66ccff" stroke-width="1.5" fill="none"/>
            </g>
            <g transform="translate(740, 390) scale(0.6)" class="anim-spin-slow" style="animation-direction: reverse;">
                <line x1="-35" y1="0" x2="35" y2="0" stroke="#66ccff" stroke-width="2"/>
                <line x1="0" y1="-35" x2="0" y2="35" stroke="#66ccff" stroke-width="2"/>
                <line x1="-25" y1="-25" x2="25" y2="25" stroke="#66ccff" stroke-width="1.5"/>
                <line x1="-25" y1="25" x2="25" y2="-25" stroke="#66ccff" stroke-width="1.5"/>
            </g>
        </svg>
    </div>

    <!-- 2014: 展翅光轨 · 《逐梦之翼》与《CONNECT》 -->
    <div class="vector-scene" data-year="2014">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <g transform="translate(720, 260) scale(1.1)">
                <path d="M 0 0 L 60 -70 L 140 -80 L 110 -30 L 180 -30 L 130 20 L 200 30 L 140 70 L 60 40 Z" stroke="#66ccff" stroke-width="2" fill="rgba(102,204,255,0.05)" class="anim-pulse"/>
                <line x1="0" y1="0" x2="140" y2="-80" stroke="#66ccff" stroke-width="1.5"/>
                <line x1="0" y1="0" x2="180" y2="-30" stroke="#66ccff" stroke-width="1.5"/>
                <line x1="0" y1="0" x2="200" y2="30" stroke="#66ccff" stroke-width="1.5"/>
                <circle cx="0" cy="0" r="16" stroke="#66ccff" stroke-width="2" fill="#060b12"/>
                <circle cx="0" cy="0" r="6" fill="#fff"/>
            </g>
        </svg>
    </div>

    <!-- 2013: 烟雨青巷与月白倒影 · 《巷》与《月白色倒影的少女》 -->
    <div class="vector-scene" data-year="2013">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <path d="M 620 450 L 620 280 L 670 280 L 670 230 L 730 230 L 730 180 L 800 180 L 800 130 L 880 130 L 880 450" stroke="#66ccff" stroke-width="2" fill="rgba(102,204,255,0.03)" opacity="0.6"/>
            <ellipse cx="750" cy="460" rx="90" ry="16" stroke="#66ccff" stroke-width="1.5" fill="none" opacity="0.5" class="anim-pulse"/>
            <path d="M 850 80 A 40 40 0 0 1 890 120 A 40 40 0 1 0 850 80 Z" stroke="#66ccff" stroke-width="2" fill="rgba(232,240,248,0.12)"/>
        </svg>
    </div>

    <!-- 2012: 江南烟雨与油纸伞 · 《三月雨》与《千年食谱颂》 -->
    <div class="vector-scene" data-year="2012">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <g stroke="#66ccff" stroke-width="1.5" opacity="0.45" stroke-linecap="round" class="anim-pulse">
                <line x1="550" y1="60" x2="520" y2="150"/>
                <line x1="680" y1="40" x2="650" y2="130"/>
                <line x1="790" y1="80" x2="760" y2="170"/>
                <line x1="610" y1="200" x2="580" y2="290"/>
                <line x1="740" y1="180" x2="710" y2="270"/>
                <line x1="860" y1="210" x2="830" y2="300"/>
                <line x1="670" y1="340" x2="640" y2="430"/>
                <line x1="800" y1="320" x2="770" y2="410"/>
                <line x1="920" y1="350" x2="890" y2="440"/>
            </g>
            <g transform="translate(780, 240) rotate(15)">
                <path d="M -130 40 Q 0 -60 130 40 Q 0 15 -130 40 Z" stroke="#66ccff" stroke-width="2.5" fill="rgba(102,204,255,0.06)"/>
                <line x1="0" y1="-25" x2="-130" y2="40" stroke="#66ccff" stroke-width="1.2"/>
                <line x1="0" y1="-25" x2="-65" y2="30" stroke="#66ccff" stroke-width="1.2"/>
                <line x1="0" y1="-25" x2="0" y2="20" stroke="#66ccff" stroke-width="1.2"/>
                <line x1="0" y1="-25" x2="65" y2="30" stroke="#66ccff" stroke-width="1.2"/>
                <line x1="0" y1="-25" x2="130" y2="40" stroke="#66ccff" stroke-width="1.2"/>
                <line x1="0" y1="-38" x2="0" y2="140" stroke="#66ccff" stroke-width="2" stroke-linecap="round"/>
                <ellipse cx="0" cy="180" rx="40" ry="8" stroke="#66ccff" stroke-width="1.5" fill="none" opacity="0.6" class="anim-pulse"/>
            </g>
        </svg>
    </div>

    <!-- 渐变定义 -->
    <svg width="0" height="0" style="position: absolute;">
        <defs>
            <radialGradient id="sunsetGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ff7744" stop-opacity="0.6"/>
                <stop offset="60%" stop-color="#ff4477" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="#060b13" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="spotlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#66ccff" stop-opacity="0.4"/>
                <stop offset="40%" stop-color="#ffe680" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="#66ccff" stop-opacity="0"/>
            </linearGradient>
        </defs>
    </svg>
</div>
"""


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
        vector_scenes=VECTOR_SCENES_HTML,
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
<!-- 年度灵魂意象背景舞台（SVG + CSS 风格化矢量动效） -->
{vector_scenes}

<!-- 动态星尘与声波涟漪画布 -->
<canvas id="stardustCanvas" aria-hidden="true"></canvas>

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
