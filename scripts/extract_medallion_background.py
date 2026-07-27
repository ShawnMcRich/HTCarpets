"""Remove only the connected pale background around the approved logo crop.

The artwork itself is not redrawn or recolored. A closed mask is built from the
navy and gold outer silhouette, then the enclosed ivory details are retained.
"""

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/brand/raster/hosseintalab-medallion-exact-v2.png"
OUTPUT = ROOT / "public/brand/raster/hosseintalab-medallion-transparent.png"


def is_brand_color(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, _ = pixel
    navy = blue <= 125 and red <= 105 and green <= 125
    gold = red >= 125 and green >= 75 and blue <= 145 and red - blue >= 28
    return navy or gold


image = Image.open(SOURCE).convert("RGBA")
pixels = image.load()
width, height = image.size
boundary = Image.new("L", image.size)
boundary_pixels = boundary.load()

for y in range(height):
    for x in range(width):
        boundary_pixels[x, y] = 255 if is_brand_color(pixels[x, y]) else 0

# Close tiny anti-aliased gaps in the gold outline before finding the exterior.
boundary = boundary.filter(ImageFilter.MaxFilter(9))
boundary_pixels = boundary.load()
visited = bytearray(width * height)
queue: deque[tuple[int, int]] = deque()


def enqueue(x: int, y: int) -> None:
    index = y * width + x
    if not visited[index] and boundary_pixels[x, y] == 0:
        visited[index] = 1
        queue.append((x, y))


for x in range(width):
    enqueue(x, 0)
    enqueue(x, height - 1)

for y in range(height):
    enqueue(0, y)
    enqueue(width - 1, y)

while queue:
    x, y = queue.popleft()
    if x:
        enqueue(x - 1, y)
    if x + 1 < width:
        enqueue(x + 1, y)
    if y:
        enqueue(x, y - 1)
    if y + 1 < height:
        enqueue(x, y + 1)

for y in range(height):
    for x in range(width):
        red, green, blue, _ = pixels[x, y]
        alpha = 0 if visited[y * width + x] else 255
        pixels[x, y] = (red, green, blue, alpha)

image.save(OUTPUT, optimize=True)
print(OUTPUT)
