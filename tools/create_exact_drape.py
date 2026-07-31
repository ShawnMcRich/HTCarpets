from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps


SOURCE = Path("/Users/shawn/Downloads/Carpets/IMG_7530.JPG")
OUTPUT = Path("/Users/shawn/Documents/Carpets/output/carpet-212x137/full-grey-studio-drape.png")


def make_background(size: tuple[int, int]) -> Image.Image:
    width, height = size
    background = Image.new("RGB", size)
    pixels = background.load()
    for y in range(height):
        vertical = y / max(height - 1, 1)
        for x in range(width):
            horizontal = abs((x / max(width - 1, 1)) - 0.5) * 2
            shade = int(199 - 13 * vertical - 9 * horizontal)
            pixels[x, y] = (shade, shade, shade)
    return background


def build_source_mask(source: Image.Image) -> Image.Image:
    mask = Image.new("L", source.size, 0)
    draw = ImageDraw.Draw(mask)

    scale_x = source.width / 1365.0
    scale_y = source.height / 2048.0

    def point(x: int, y: int) -> tuple[int, int]:
        return round(x * scale_x), round(y * scale_y)

    body = [point(166, 217), point(1080, 217), point(1227, 1709), point(49, 1709)]
    top_fringe = [point(159, 199), point(1087, 199), point(1080, 222), point(166, 222)]
    bottom_fringe = [point(49, 1704), point(1227, 1704), point(1238, 1738), point(39, 1738)]
    draw.polygon(body, fill=255)

    fringe_region = Image.new("L", source.size, 0)
    fringe_draw = ImageDraw.Draw(fringe_region)
    fringe_draw.polygon(top_fringe, fill=255)
    fringe_draw.polygon(bottom_fringe, fill=255)

    value = source.convert("L")
    saturation = source.convert("HSV").split()[1]
    bright = value.point(lambda pixel: 255 if pixel >= 172 else 0)
    low_saturation = saturation.point(lambda pixel: 255 if pixel <= 78 else 0)
    fringe = ImageChops.multiply(ImageChops.multiply(bright, low_saturation), fringe_region)
    fringe = fringe.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.45))
    return ImageChops.lighter(mask, fringe)


def rectify(source: Image.Image, mask: Image.Image) -> Image.Image:
    texture_size = (1100, 1702)
    scale_x = source.width / 1365.0
    scale_y = source.height / 2048.0
    source_quad = (
        159 * scale_x,
        198 * scale_y,
        39 * scale_x,
        1739 * scale_y,
        1238 * scale_x,
        1739 * scale_y,
        1087 * scale_x,
        198 * scale_y,
    )
    texture = source.transform(
        texture_size,
        Image.Transform.QUAD,
        source_quad,
        resample=Image.Resampling.BICUBIC,
    )
    alpha = mask.transform(
        texture_size,
        Image.Transform.QUAD,
        source_quad,
        resample=Image.Resampling.BICUBIC,
    )
    texture.putalpha(alpha)
    return texture


def map_y(normalized: float) -> float:
    top = 82.0
    bend = 0.79
    bend_y = 1280.0
    bottom_y = 1650.0
    if normalized <= bend:
        return top + (bend_y - top) * (normalized / bend)
    floor_t = (normalized - bend) / (1.0 - bend)
    eased = 1.0 - math.cos(floor_t * math.pi / 2.0)
    return bend_y + (bottom_y - bend_y) * eased


def map_width(normalized: float) -> float:
    bend = 0.79
    if normalized <= bend:
        return 904.0 + 55.0 * (normalized / bend)
    floor_t = (normalized - bend) / (1.0 - bend)
    return 959.0 + 196.0 * (floor_t**1.18)


def render_drape(texture: Image.Image, size: tuple[int, int]) -> Image.Image:
    width, height = size
    background = make_background(size).convert("RGBA")

    shadow = Image.new("RGBA", size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.ellipse((105, 1250, width - 70, 1710), fill=(0, 0, 0, 52))
    shadow = shadow.filter(ImageFilter.GaussianBlur(38))
    background = Image.alpha_composite(background, shadow)

    texture_width, texture_height = texture.size
    destination_top = int(map_y(0.0))
    destination_bottom = int(map_y(1.0))

    previous_source_y = 0
    for destination_y in range(destination_top, destination_bottom + 1):
        low = 0.0
        high = 1.0
        for _ in range(16):
            middle = (low + high) / 2.0
            if map_y(middle) < destination_y:
                low = middle
            else:
                high = middle
        normalized = (low + high) / 2.0
        source_y = min(texture_height - 1, max(0, round(normalized * (texture_height - 1))))
        if source_y < previous_source_y:
            source_y = previous_source_y
        previous_source_y = source_y

        row = texture.crop((0, source_y, texture_width, source_y + 1))
        row_width = max(1, round(map_width(normalized)))
        row = row.resize((row_width, 1), Image.Resampling.LANCZOS)
        left = round((width - row_width) / 2)
        background.alpha_composite(row, (left, destination_y))

    return background.convert("RGB")


def main() -> None:
    source = ImageOps.exif_transpose(Image.open(SOURCE)).convert("RGB")
    mask = build_source_mask(source)
    texture = rectify(source, mask)
    result = render_drape(texture, (1400, 1750))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    result.save(OUTPUT, quality=96)


if __name__ == "__main__":
    main()
