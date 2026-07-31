from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


SOURCE = Path(
    "/Users/shawn/.codex/generated_images/019fa8ce-c4c9-7331-a048-1f1314da6f97/"
    "exec-4ccdf083-d122-4407-874c-1b38768a5904.png"
)
OUTPUT = Path("/Users/shawn/Documents/Carpets/vertical-draped-rug-exact.png")


def studio_background(width: int, height: int) -> Image.Image:
    y = np.linspace(0.0, 1.0, height, dtype=np.float32)[:, None, None]
    top = np.array([205, 206, 207], dtype=np.float32)[None, None, :]
    bottom = np.array([180, 182, 184], dtype=np.float32)[None, None, :]
    rgb = top * (1.0 - y) + bottom * y
    rgb = np.repeat(rgb, width, axis=1)
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")


def paste_scaled_row(
    dst: Image.Image,
    src: Image.Image,
    src_y: float,
    dst_y: int,
    width: int,
    center_x: int,
    shade: float = 1.0,
) -> None:
    sample_y = max(0, min(src.height - 1, int(round(src_y))))
    row = src.crop((0, sample_y, src.width, sample_y + 1)).resize(
        (width, 1), Image.Resampling.LANCZOS
    )
    if shade != 1.0:
        pixels = np.asarray(row, dtype=np.float32) * shade
        row = Image.fromarray(np.clip(pixels, 0, 255).astype(np.uint8), "RGB")
    dst.paste(row, (center_x - width // 2, dst_y))


def main() -> None:
    source = Image.open(SOURCE).convert("RGB")

    # Exact approved rug bounds, including both fringed ends. Rotating this crop
    # makes the long axis vertical without synthesizing any textile content.
    rug = source.crop((98, 72, 1438, 948)).rotate(90, expand=True)

    canvas_w, canvas_h = 1200, 1600
    canvas = studio_background(canvas_w, canvas_h)

    center_x = canvas_w // 2
    top_y = 110
    wall_width = 820
    scale = wall_width / rug.width
    full_scaled_height = rug.height * scale
    fold_fraction = 0.84
    source_fold_y = rug.height * fold_fraction
    wall_height = int(full_scaled_height * fold_fraction)
    fold_y = top_y + wall_height
    floor_depth = 185

    # Soft shadow follows the exact single surface footprint.
    shadow = Image.new("L", (canvas_w, canvas_h), 0)
    draw = ImageDraw.Draw(shadow)
    left = center_x - wall_width // 2
    right = center_x + wall_width // 2
    near_half_width = (wall_width + 58) // 2
    draw.polygon(
        [
            (left + 10, top_y + 12),
            (right + 10, top_y + 12),
            (right + 10, fold_y),
            (center_x + near_half_width + 16, fold_y + floor_depth + 18),
            (center_x - near_half_width + 16, fold_y + floor_depth + 18),
            (left + 10, fold_y),
        ],
        fill=105,
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(22))
    shadow_layer = Image.new("RGB", (canvas_w, canvas_h), (70, 72, 74))
    canvas.paste(shadow_layer, (0, 0), shadow)

    # Upright part: one-to-one traversal of the first 84% of the approved rug.
    for out_y in range(top_y, fold_y):
        t = (out_y - top_y) / max(1, wall_height - 1)
        src_y = t * (source_fold_y - 1)
        paste_scaled_row(canvas, rug, src_y, out_y, wall_width, center_x)

    # Existing final 16% bends forward. No rows are repeated or invented.
    for depth_y in range(floor_depth):
        visible_t = depth_y / max(1, floor_depth - 1)
        # Perspective mapping compresses the far part of the floor section.
        source_t = visible_t ** 0.82
        src_y = source_fold_y + source_t * (rug.height - 1 - source_fold_y)
        row_width = int(round(wall_width + 58 * visible_t))
        shade = 0.94 + 0.06 * visible_t
        paste_scaled_row(
            canvas,
            rug,
            src_y,
            fold_y + depth_y,
            row_width,
            center_x,
            shade,
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUTPUT, quality=96)
    print(OUTPUT)


if __name__ == "__main__":
    main()
