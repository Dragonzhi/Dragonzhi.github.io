import os
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES_DIR = ROOT / "files"
MANIFEST_PATH = ROOT / "data" / "files-manifest.json"

SPECIAL_NAMES = {"about", "now", "links", "motto"}
EXCLUDE = {"daily.txt"}
SUPPORTED_EXTENSIONS = {'.md', '.txt'}

def generate_manifest():
    if not os.path.exists(FILES_DIR):
        print(f"错误: 文件夹不存在: {FILES_DIR}")
        return

    entries = []
    for file in sorted(os.listdir(FILES_DIR)):
        file_path = os.path.join(FILES_DIR, file)
        if os.path.isfile(file_path):
            ext = os.path.splitext(file)[1].lower()
            if ext in SUPPORTED_EXTENSIONS and file not in EXCLUDE:
                name = os.path.splitext(file)[0]
                title = file  # 保留扩展名，与现有卡片标题（links.md / motto.txt）风格一致
                is_auto = name not in SPECIAL_NAMES
                entries.append({
                    "filename": file,
                    "title": title,
                    "auto": is_auto
                })
                print(f"  - {file} ({'auto' if is_auto else 'special'})")

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
