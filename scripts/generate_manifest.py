import os
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES_DIR = ROOT / "files"
MANIFEST_PATH = ROOT / "data" / "files-manifest.json"

SPECIAL_NAMES = {"about", "now", "links", "motto"}
EXCLUDE = {"daily.txt"}
SUPPORTED_EXTENSIONS = {'.md', '.txt'}

# 自发现卡片 style 字段：与 js/workshop.js 的 AUTO_STYLES 保持一致
VALID_STYLES = {"links", "list", "quote", "doc"}


def valid_style(style):
    """校验手改 style：须为四种样式之一的单值字符串（样式全手动，不做随机/判型）"""
    return isinstance(style, str) and style in VALID_STYLES


def load_old_styles():
    """读旧 manifest，建 filename -> style 映射；文件缺失/坏 JSON 静默跳过"""
    try:
        with open(MANIFEST_PATH, encoding='utf-8') as f:
            old = json.load(f)
        return {
            e.get("filename"): e.get("style")
            for e in old if isinstance(e, dict)
        }
    except (OSError, ValueError):
        return {}


def generate_manifest():
    if not os.path.exists(FILES_DIR):
        print(f"错误: 文件夹不存在: {FILES_DIR}")
        return

    old_styles = load_old_styles()
    entries = []
    for file in sorted(os.listdir(FILES_DIR)):
        file_path = os.path.join(FILES_DIR, file)
        if os.path.isfile(file_path):
            ext = os.path.splitext(file)[1].lower()
            if ext in SUPPORTED_EXTENSIONS and file not in EXCLUDE:
                name = os.path.splitext(file)[0]
                title = file  # 保留扩展名，与现有卡片标题（links.md / motto.txt）风格一致
                is_auto = name not in SPECIAL_NAMES
                entry = {
                    "filename": file,
                    "title": title,
                    "auto": is_auto
                }
                # 重新生成时保留手改的 style；没写/非法值不写字段（前端默认 doc）
                old_style = old_styles.get(file)
                if is_auto and valid_style(old_style):
                    entry["style"] = old_style
                entries.append(entry)
                style_note = f", style={entry['style']}" if "style" in entry else ""
                print(f"  - {file} ({'auto' if is_auto else 'special'}{style_note})")

    if not entries:
        print("没有找到支持的 .md/.txt 文件")
        content = []
    else:
        content = entries

    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

    print(f"\n成功生成: {MANIFEST_PATH}")
    print(f"共 {len(content)} 条")

if __name__ == "__main__":
    generate_manifest()
