from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps


SOURCE = Path("/Users/shawn/Downloads/Carpets/IMG_7530.JPG")
OUTPUT = Path("/Users/shawn/Documents/Carpets/output/carpet-212x137/full-grey-studio-drape-exact.png")


def rectified_carpet() -> Image.Image:
    source = ImageOps.exif_transpose(Image.open(SOURCE)).convert("RGB")
    quad = (
        415, 545,
        90, 4365,
        3115, 4350,
        2715, 545,
    )
    carpet = source.transform(
        (1370, 2120),
        Image.Transform.QUAD,
        quad,
        resample=Image.Resampling.BICUBIC,
    )
    return carpet


def gray_studio(size: tuple[int, int], horizon: int) -> Image.Image:
    width, height = size
    background = Image.new("RGB", size)
    pixels = background.load()
    for y in range(height):
        if y < horizon:
            value = int(204 - 15 * (y / max(horizon, 1)))
        else:
            value = int(189 + 13 * ((y - horizon) / max(height - horizon, 1)))
        for x in range(width):
            vignette = int(6 * abs(x - width / 2) / (width / 2))
            pixels[x, y] = (max(value - vignette, 0),) * 3
    return background


def paste_scaled(canvas: Image.Image, layer: Image.Image, box: tuple[int, int, int, int]) -> None:
    resized = layer.resize((box[2] - box[0], box[3] - box[1]), Image.Resampling.LANCZOS)
    canvas.paste(resized, (box[0], box[1]))


def create_drape() -> Image.Image:
    carpet = rectified_carpet()
    canvas_width, canvas_height = 1600, 1700
    top_y = 105
    hanging_width = 890
    split_y = 1655
    hanging_source = carpet.crop((0, 0, carpet.width, split_y))
    hanging_height = round(hanging_width * (split_y / carpet.width))
    left = (canvas_width - hanging_width) // 2
    bend_y = top_y + hanging_height
    studio = gray_studio((canvas_width, canvas_height), bend_y)

    shadow = Image.new("L", studio.size, 0)
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rectangle((left + 14, top_y + 14, left + hanging_width + 14, bend_y + 18), fill=90)
    shadow_draw.polygon(
        ((left + 10, bend_y), (left + hanging_width + 10, bend_y), (1320, 1570), (280, 1570)),
        fill=75,
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))
    shadow_layer = Image.new("RGB", studio.size, (85, 85, 85))
    studio.paste(shadow_layer, (0, 0), shadow)

    floor_source = carpet.crop((0, split_y, carpet.width, carpet.height))
    strip_count = 72
    floor_depth = 305
    for index in range(strip_count):
        t0 = index / strip_count
        t1 = (index + 1) / strip_count
        source_y0 = round(floor_source.height * t0)
        source_y1 = round(floor_source.height * t1)
        if source_y1 <= source_y0:
            continue
        curve0 = 0.34 * t0 + 0.66 * t0 * t0
        curve1 = 0.34 * t1 + 0.66 * t1 * t1
        destination_y0 = round(bend_y + floor_depth * curve0)
        destination_y1 = round(bend_y + floor_depth * curve1)
        destination_y1 = max(destination_y1, destination_y0 + 1)
        width0 = round(hanging_width + 125 * t0)
        width1 = round(hanging_width + 125 * t1)
        destination_width = max(width0, width1)
        strip = floor_source.crop((0, source_y0, floor_source.width, source_y1))
        destination_x = (canvas_width - destination_width) // 2
        paste_scaled(
            studio,
            strip,
            (destination_x, destination_y0, destination_x + destination_width, destination_y1),
        )

    paste_scaled(studio, hanging_source, (left, top_y, left + hanging_width, bend_y + 1))
    return studio


OUTPUT.parent.mkdir(parents=True, exist_ok=True)
create_drape().save(OUTPUT, quality=96)
print(OUTPUT)
