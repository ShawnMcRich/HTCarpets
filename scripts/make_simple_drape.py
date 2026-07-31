from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps


SOURCE = Path("/Users/shawn/Downloads/Carpets/IMG_7530.JPG")
OUTPUT = Path("/Users/shawn/Documents/Carpets/output/carpet-212x137/full-grey-studio-drape.png")


def perspective_coefficients(output_points, input_points):
    matrix = []
    values = []
    for (output_x, output_y), (input_x, input_y) in zip(output_points, input_points):
        matrix.append(
            [
                output_x,
                output_y,
                1,
                0,
                0,
                0,
                -input_x * output_x,
                -input_x * output_y,
            ]
        )
        values.append(input_x)
        matrix.append(
            [
                0,
                0,
                0,
                output_x,
                output_y,
                1,
                -input_y * output_x,
                -input_y * output_y,
            ]
        )
        values.append(input_y)
    return np.linalg.solve(np.asarray(matrix), np.asarray(values))


source = ImageOps.exif_transpose(Image.open(SOURCE)).convert("RGB")

source_corners = [(425, 537), (2712, 519), (3094, 4340), (99, 4368)]
rectified_size = (1370, 2120)
rectified_corners = [(0, 0), (1370, 0), (1370, 2120), (0, 2120)]
rectified = source.transform(
    rectified_size,
    Image.Transform.PERSPECTIVE,
    perspective_coefficients(rectified_corners, source_corners),
    resample=Image.Resampling.BICUBIC,
)

canvas_width, canvas_height = 1600, 1900
bend_y = 1450
canvas = Image.new("RGB", (canvas_width, canvas_height))
pixels = canvas.load()
for y in range(canvas_height):
    if y < bend_y:
        value = round(202 + 16 * (y / bend_y))
    else:
        value = round(218 - 14 * ((y - bend_y) / (canvas_height - bend_y)))
    for x in range(canvas_width):
        vignette = int(8 * abs(x - canvas_width / 2) / (canvas_width / 2))
        shade = max(0, value - vignette)
        pixels[x, y] = (shade, shade, shade)

rug_width = 1080
vertical_source_height = 1740
vertical_height = round(vertical_source_height * rug_width / rectified_size[0])
vertical = rectified.crop((0, 0, rectified_size[0], vertical_source_height)).resize(
    (rug_width, vertical_height), Image.Resampling.LANCZOS
)
vertical_x = (canvas_width - rug_width) // 2
vertical_y = bend_y - vertical_height

wall_shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
shadow_draw = ImageDraw.Draw(wall_shadow)
shadow_draw.rounded_rectangle(
    (vertical_x + 14, vertical_y + 12, vertical_x + rug_width + 24, bend_y + 18),
    radius=14,
    fill=(0, 0, 0, 72),
)
wall_shadow = wall_shadow.filter(ImageFilter.GaussianBlur(20))
canvas = Image.alpha_composite(canvas.convert("RGBA"), wall_shadow)
canvas.alpha_composite(vertical.convert("RGBA"), (vertical_x, vertical_y))

floor_source = rectified.crop((0, vertical_source_height, rectified_size[0], rectified_size[1])).convert("RGBA")
floor_width, floor_height = 1180, 235
floor_quad = [(50, 0), (1130, 0), (1180, 225), (0, 225)]
floor_rectangle = [(0, 0), (floor_source.width, 0), (floor_source.width, floor_source.height), (0, floor_source.height)]
floor_piece = floor_source.transform(
    (floor_width, floor_height),
    Image.Transform.PERSPECTIVE,
    perspective_coefficients(floor_quad, floor_rectangle),
    resample=Image.Resampling.BICUBIC,
)
floor_mask = Image.new("L", (floor_width, floor_height), 0)
ImageDraw.Draw(floor_mask).polygon(floor_quad, fill=255)
floor_mask = floor_mask.filter(ImageFilter.GaussianBlur(0.6))
floor_piece.putalpha(floor_mask)
floor_piece = ImageEnhance.Brightness(floor_piece).enhance(0.97)

floor_x = (canvas_width - floor_width) // 2
floor_y = bend_y - 2
floor_shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
shadow_draw = ImageDraw.Draw(floor_shadow)
shadow_draw.polygon(
    [
        (floor_x + 18, floor_y + 14),
        (floor_x + floor_width - 18, floor_y + 14),
        (floor_x + floor_width - 6, floor_y + 236),
        (floor_x + 6, floor_y + 236),
    ],
    fill=(0, 0, 0, 60),
)
floor_shadow = floor_shadow.filter(ImageFilter.GaussianBlur(18))
canvas = Image.alpha_composite(canvas, floor_shadow)
canvas.alpha_composite(floor_piece, (floor_x, floor_y))

bend_shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
bend_draw = ImageDraw.Draw(bend_shadow)
bend_draw.rectangle((vertical_x, bend_y - 5, vertical_x + rug_width, bend_y + 12), fill=(0, 0, 0, 58))
bend_shadow = bend_shadow.filter(ImageFilter.GaussianBlur(7))
canvas = Image.alpha_composite(canvas, bend_shadow)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
canvas.convert("RGB").save(OUTPUT, quality=95)
