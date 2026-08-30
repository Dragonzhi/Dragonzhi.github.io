import os
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GALLERY_PATH = ROOT / "images" / "画廊"
JSON_PATH = ROOT / "images" / "gallery-images.json"

SUPPORTED_FORMATS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'}

def generate_gallery_json():
    if not os.path.exists(GALLERY_PATH):
        print(f"错误: 画廊文件夹不存在: {GALLERY_PATH}")
        return

    image_files = []

    for file in sorted(os.listdir(GALLERY_PATH)):
        file_path = os.path.join(GALLERY_PATH, file)

        if os.path.isfile(file_path):
            ext = os.path.splitext(file)[1].lower()

            if ext in SUPPORTED_FORMATS:
                title = os.path.splitext(file)[0]

                image_info = {
                    "filename": file,
                    "title": title,
                    "description": "点击查看大图"
                }

                image_files.append(image_info)
                print(f"  - {file}")

    if not image_files:
        print(f"警告: 在 {GALLERY_PATH} 中没有找到支持的图片文件")
        json_content = []
    else:
        print(f"找到 {len(image_files)} 个图片文件")
        json_content = image_files

    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(json_content, f, ensure_ascii=False, indent=2)

    print(f"\n成功生成 JSON 文件: {JSON_PATH}")
    print(f"共包含 {len(image_files)} 个图片")

if __name__ == "__main__":
    generate_gallery_json()
