from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps


SOURCE = Path("/Users/shawn/Downloads/Carpets/IMG_7540.JPG")
RECTIFIED = Path("/Users/shawn/Documents/Carpets/IMG_7540-rectified-exact.png")
OUTPUT = Path("/Users/shawn/Documents/Carpets/IMG_7540-vertical-draped-exact.png")


def homography_dest_to_source(dst: np.ndarray, src: np.ndarray) -> tuple[float, ...]:
    rows = []
    values = []
    for (x, y), (u, v) in zip(dst, src):
        rows.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        values.append(u)
        rows.append([0, 0, 0, x, y, 1, -v * x, -v * y])
        values.append(v)
    coeffs = np.linalg.solve(np.asarray(rows, dtype=np.float64), np.asarray(values))
    return tuple(float(value) for value in coeffs)


def studio_background(width: int, height: int) -> Image.Image:
    y = np.linspace(0.0, 1.0, height, dtype=np.float32)[:, None, None]
    top = np.asarray([210, 211, 212], dtype=np.float32)[None, None, :]
    bottom = np.asarray([184, 186, 188], dtype=np.float32)[None, None, :]
    rgb = np.repeat(top * (1.0 - y) + bottom * y, width, axis=1)
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8))


def paste_row(
    canvas: Image.Image,
    texture: Image.Image,
    source_y: float,
    output_y: int,
    width: int,
    center_x: int,
    shade: float,
) -> None:
    sy = max(0, min(texture.height - 1, int(round(source_y))))
    row = texture.crop((0, sy, texture.width, sy + 1)).resize(
        (width, 1), Image.Resampling.LANCZOS
    )
    if shade != 1.0:
        pixels = np.asarray(row, dtype=np.float32) * shade
        row = Image.fromarray(np.clip(pixels, 0, 255).astype(np.uint8))
    canvas.paste(row, (center_x - width // 2, output_y))


def main() -> None:
    original = ImageOps.exif_transpose(Image.open(SOURCE)).convert("RGB")

    # Outer red binding corners measured directly on IMG_7540 after applying EXIF
    # orientation. This removes only the photographed stone floor and corrects
    # camera perspective; the rug pixels themselves are not generated.
    source_corners = np.asarray(
        [
            [504.0, 504.0],   # top-left
            [2924.0, 500.0],  # top-right
            [3412.0, 4588.0], # bottom-right
            [192.0, 4640.0],  # bottom-left
        ]
    )
    texture_width, texture_height = 1800, 2700
    destination_corners = np.asarray(
        [
            [0.0, 0.0],
            [texture_width - 1.0, 0.0],
            [texture_width - 1.0, texture_height - 1.0],
            [0.0, texture_height - 1.0],
        ]
    )
    coefficients = homography_dest_to_source(destination_corners, source_corners)
    texture = original.transform(
        (texture_width, texture_height),
        Image.Transform.PERSPECTIVE,
        coefficients,
        resample=Image.Resampling.BICUBIC,
    )
    texture.save(RECTIFIED, quality=97)

    canvas_width, canvas_height = 1536, 2048
    canvas = studio_background(canvas_width, canvas_height)
    center_x = canvas_width // 2
    rug_width = 1060
    scale = rug_width / texture_width
    full_height = texture_height * scale
    fold_fraction = 0.85
    texture_fold_y = texture_height * fold_fraction
    wall_height = int(round(full_height * fold_fraction))
    floor_depth = 230
    top_y = 120
    fold_y = top_y + wall_height

    # A restrained shadow grounds the fixed pixel surface without repainting it.
    shadow_mask = Image.new("L", (canvas_width, canvas_height), 0)
    draw = ImageDraw.Draw(shadow_mask)
    half = rug_width // 2
    front_half = (rug_width + 72) // 2
    draw.polygon(
        [
            (center_x - half + 16, top_y + 14),
            (center_x + half + 16, top_y + 14),
            (center_x + half + 16, fold_y),
            (center_x + front_half + 22, fold_y + floor_depth + 12),
            (center_x - front_half + 22, fold_y + floor_depth + 12),
            (center_x - half + 16, fold_y),
        ],
        fill=62,
    )
    shadow_mask = shadow_mask.filter(ImageFilter.GaussianBlur(28))
    canvas.paste(Image.new("RGB", canvas.size, (80, 82, 84)), (0, 0), shadow_mask)

    for y in range(top_y, fold_y):
        t = (y - top_y) / max(1, wall_height - 1)
        paste_row(
            canvas,
            texture,
            t * (texture_fold_y - 1),
            y,
            rug_width,
            center_x,
            1.0,
        )

    # The last 15% of the original image is consumed once and projected forward.
    for dy in range(floor_depth):
        visible_t = dy / max(1, floor_depth - 1)
        source_t = visible_t ** 0.86
        source_y = texture_fold_y + source_t * (
            texture.height - 1 - texture_fold_y
        )
        width = int(round(rug_width + 72 * visible_t))
        paste_row(
            canvas,
            texture,
            source_y,
            fold_y + dy,
            width,
            center_x,
            0.95 + 0.05 * visible_t,
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUTPUT, quality=97)
    print(RECTIFIED)
    print(OUTPUT)


if __name__ == "__main__":
    main()
