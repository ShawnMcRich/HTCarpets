"""Package all digital logo SVGs as portable, self-contained brand assets."""

import base64
from pathlib import Path

from outline_logo_text import outline_svg_text


ROOT = Path(__file__).resolve().parents[1]
MEDALLION = ROOT / "public/brand/raster/hosseintalab-medallion-transparent.png"
VECTOR_DIR = ROOT / "public/brand/vector"
EXPORT_DIR = ROOT / "public/brand/exports"
LOGO_FILES = (
    "hosseintalab-seal.svg",
    "hosseintalab-lockup-horizontal.svg",
    "hosseintalab-lockup-horizontal-reversed.svg",
    "hosseintalab-lockup-stacked.svg",
)

encoded_medallion = base64.b64encode(MEDALLION.read_bytes()).decode("ascii")

EXPORT_DIR.mkdir(parents=True, exist_ok=True)

for filename in LOGO_FILES:
    svg = (VECTOR_DIR / filename).read_text(encoding="utf-8")
    svg = svg.replace(
        "../raster/hosseintalab-medallion-transparent.png",
        f"data:image/png;base64,{encoded_medallion}",
    )
    svg = outline_svg_text(svg)
    output = EXPORT_DIR / filename
    output.write_text(svg, encoding="utf-8")
    print(output)
