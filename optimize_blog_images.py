"""Generate responsive WebP assets for images referenced by the blog."""
import json
import re
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent


def main():
    sources = [ROOT / "_pages/blog.md", *sorted((ROOT / "_posts").glob("*.md"))]
    paths = set()
    for source in sources:
        paths.update(re.findall(r"/images/[\w./-]+\.(?:png|jpe?g)", source.read_text(), re.I))
    metadata = {}
    total_before = total_after = 0
    for url in sorted(paths):
        source = ROOT / url.lstrip("/")
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original)
            image = image.convert("RGBA" if "A" in image.getbands() or "transparency" in image.info else "RGB")
            widths = sorted({min(width, image.width) for width in (480, 960, 1600)})
            variants = []
            for width in widths:
                resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
                target = source.with_name(f"{source.stem}-{width}.webp")
                resized.save(target, "WEBP", quality=88, method=6, lossless="outtakes" in source.stem)
                variants.append(("/" + target.relative_to(ROOT).as_posix(), width, resized.height))
            largest, width, height = variants[-1]
            metadata[url] = {"src": largest, "srcset": ", ".join(f"{path} {w}w" for path, w, _ in variants), "width": width, "height": height}
            before, after = source.stat().st_size, (ROOT / largest.lstrip("/")).stat().st_size
            total_before += before
            total_after += after
            print(f"{source.name}: {before // 1024} KB -> {after // 1024} KB")
    (ROOT / "_data").mkdir(exist_ok=True)
    (ROOT / "_data/blog_images.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n")
    print(f"Largest variants total: {total_before // 1024} KB -> {total_after // 1024} KB")


if __name__ == "__main__":
    main()
