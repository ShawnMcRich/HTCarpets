"""Build the responsive raster logo suite from approved master assets."""

from pathlib import Path
import subprocess

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
EXPORT_DIR = ROOT / "public/brand/exports"
MEDALLION = ROOT / "public/brand/raster/hosseintalab-medallion-transparent.png"


def render_svg(filename: str) -> Path:
    """Use the native macOS renderer so SVG viewBox proportions stay intact."""
    source = EXPORT_DIR / filename
    output = source.with_suffix(".png")
    subprocess.run(
        ["sips", "-s", "format", "png", str(source), "--out", str(output)],
        check=True,
        capture_output=True,
        text=True,
    )
    return output


def contain(image: Image.Image, size: int, occupancy: float) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    target = round(size * occupancy)
    copy = image.copy()
    copy.thumbnail((target, target), Image.Resampling.LANCZOS)
    x = (size - copy.width) // 2
    y = (size - copy.height) // 2
    canvas.alpha_composite(copy, (x, y))
    return canvas


def trim_transparent(path: Path, padding: int = 24) -> None:
    image = Image.open(path).convert("RGBA")
    bounds = image.getbbox()
    if not bounds:
        return
    cropped = image.crop(bounds)
    canvas = Image.new(
        "RGBA",
        (cropped.width + padding * 2, cropped.height + padding * 2),
        (0, 0, 0, 0),
    )
    canvas.alpha_composite(cropped, (padding, padding))
    canvas.save(path, optimize=True)


medallion = Image.open(MEDALLION).convert("RGBA")
seal_output = render_svg("hosseintalab-seal.svg")
seal = Image.open(seal_output).convert("RGBA")

for size in (16, 32, 48, 180, 192, 512):
    output = EXPORT_DIR / f"hosseintalab-icon-{size}.png"
    contain(medallion, size, 0.9).save(output, optimize=True)
    print(output)

for size, occupancy in ((512, 0.94), (1080, 0.94)):
    output = EXPORT_DIR / f"hosseintalab-avatar-{size}.png"
    contain(seal, size, occupancy).save(output, optimize=True)
    print(output)

watermark = contain(medallion, 1200, 0.82)
alpha = watermark.getchannel("A").point(lambda value: round(value * 0.12))
watermark.putalpha(alpha)
watermark_output = EXPORT_DIR / "hosseintalab-watermark.png"
watermark.save(watermark_output, optimize=True)
print(watermark_output)

for filename in (
    "hosseintalab-lockup-horizontal.svg",
    "hosseintalab-lockup-horizontal-reversed.svg",
    "hosseintalab-lockup-stacked.svg",
):
    output = render_svg(filename)
    trim_transparent(output)
    print(output)
