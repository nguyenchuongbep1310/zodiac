import shutil
import os

src_dir = "/Users/chuongnguyen/.gemini/antigravity-ide/brain/623eb2a3-9de3-4b45-a53e-08dc3342d6fb"
dst_dir = "/Users/chuongnguyen/Downloads/Coding/Zodiac/frontend/public/images"

os.makedirs(dst_dir, exist_ok=True)

files = {
    "learn_sun_venus_1785340963904.png": "learn_sun_venus.png",
    "learn_venus_mars_1785340980310.png": "learn_venus_mars.png",
    "learn_moon_mars_1785340996686.png": "learn_moon_mars.png"
}

for src_name, dst_name in files.items():
    src_path = os.path.join(src_dir, src_name)
    dst_path = os.path.join(dst_dir, dst_name)
    if os.path.exists(src_path):
        shutil.copyfile(src_path, dst_path)
        print(f"Copied {src_name} -> {dst_name}")
    else:
        print(f"File not found: {src_path}")
