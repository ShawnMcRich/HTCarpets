#!/usr/bin/env python3
"""Build a five-shot studio set while preserving the supplied carpet pixels.

The carpet is rectified once from the source photograph, then only cropped,
resampled, or perspective-warped. It is never regenerated or repainted.
"""

from pathlib import Path
import argparse

import numpy as np
from PIL import Image, ImageFilter


RESAMPLE = Image.Resampling.LANCZOS
WARP_RESAMPLE = Image.Resampling.BICUBIC


def perspective_coefficients(destination, source):
    matrix = []
    vector = []
    for (dx, dy), (sx, sy) in zip(destination, source):
        matrix.append([dx, dy, 1, 0, 0, 0, -sx * dx, -sx * dy])
        matrix.append([0, 0, 0, dx, dy, 1, -sy * dx, -sy * dy])
        vector.extend([sx, sy])
    return np.linalg.solve(np.asarray(matrix), np.asarray(vector))


def warp_to_quad(image, canvas_size, quad):
    width, height = image.size
    source = [(0, 0), (width, 0), (width, height), (0, height)]
    coeffs = perspective_coefficients(quad, source)
    return image.transform(
        canvas_size,
        Image.Transform.PERSPECTIVE,
        coeffs,
        resample=WARP_RESAMPLE,
        fillcolor=(0, 0, 0, 0),
    )


def grey_plate(size, top=(184, 184, 181), bottom=(225, 224, 220)):
    width, height = size
    strip = Image.new("RGB", (1, height))
    pixels = strip.load()
    for y in range(height):
        t = y / max(height - 1, 1)
        pixels[0, y] = tuple(round(a * (1 - t) + b * t) for a, b in zip(top, bottom))
    return strip.resize(size).filter(ImageFilter.GaussianBlur(18))


def add_shadow(base, alpha, offset=(0, 18), blur=24, opacity=72):
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    shifted = Image.new("L", base.size, 0)
    shifted.paste(alpha, offset)
    shifted = shifted.filter(ImageFilter.GaussianBlur(blur)).point(lambda p: p * opacity // 255)
    shadow.putalpha(shifted)
    shadow.paste((26, 24, 22), (0, 0, base.width, base.height), shifted)
    return Image.alpha_composite(base.convert("RGBA"), shadow)


def save_jpeg(image, path):
    image.convert("RGB").save(path, quality=95, subsampling=0, optimize=True)


def smooth_edge(values, size=31):
    row = Image.fromarray(np.asarray(values, dtype=np.uint16).reshape(1, -1))
    return np.asarray(row.filter(ImageFilter.MedianFilter(size))).reshape(-1)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--background", required=True, type=Path)
    parser.add_argument("--out-dir", required=True, type=Path)
    args = parser.parse_args()
    args.out_dir.mkdir(parents=True, exist_ok=True)

    source = Image.open(args.source).convert("RGB")

    # Corners measured on the supplied 3024 x 4032 HEIC conversion.
    # PIL QUAD order: upper-left, lower-left, lower-right, upper-right.
    # Deliberately include a narrow safety margin outside every physical edge.
    # The earlier crop clipped the waviness on the right selvedge, which is
    # unacceptable for a condition-faithful product record.
    carpet_quad = (320, 220, 34, 3926, 2702, 3926, 2282, 214)
    carpet = source.transform((1800, 2760), Image.Transform.QUAD, carpet_quad, WARP_RESAMPLE)

    # Remove the source floor on all four sides. Boundaries are measured from
    # the first chromatic/dark carpet pixels when scanning inward, then gently
    # median-smoothed. This preserves the actual edge rather than inventing one.
    sample = np.asarray(carpet)
    chroma = sample.max(axis=2) - sample.min(axis=2)
    candidates = (chroma > 28) | (sample.mean(axis=2) < 135)
    left_edge = smooth_edge(np.argmax(candidates, axis=1), 31)
    right_edge = carpet.width - 1 - smooth_edge(
        np.argmax(candidates[:, ::-1], axis=1), 31
    )
    top_edge = smooth_edge(np.argmax(candidates, axis=0), 31)
    bottom_edge = carpet.height - 1 - smooth_edge(
        np.argmax(candidates[::-1, :], axis=0), 31
    )
    yy, xx = np.indices((carpet.height, carpet.width))
    alpha_array = (
        (xx >= left_edge[:, None] - 2)
        & (xx <= right_edge[:, None] + 2)
        & (yy >= top_edge[None, :] - 2)
        & (yy <= bottom_edge[None, :] + 2)
    ).astype(np.uint8) * 255
    carpet = carpet.convert("RGBA")
    carpet.putalpha(Image.fromarray(alpha_array))
    carpet.save(args.out_dir / "rectified-master.png", optimize=True)

    # 01 — corner / edge construction detail.
    corner = carpet.crop((980, 1900, 1800, 2760)).resize((1120, 1180), RESAMPLE)
    plate = grey_plate((1600, 1400), (169, 170, 169), (211, 211, 208)).convert("RGBA")
    corner = corner.rotate(
        -7,
        resample=Image.Resampling.BICUBIC,
        expand=True,
        fillcolor=(0, 0, 0, 0),
    )
    alpha = corner.getchannel("A")
    layer = Image.new("RGBA", plate.size, (0, 0, 0, 0))
    layer.paste(corner, (360, 70), alpha)
    plate = add_shadow(plate, layer.getchannel("A"), (10, 16), 20, 66)
    save_jpeg(Image.alpha_composite(plate, layer), args.out_dir / "01-corner-construction.jpg")

    # 02 — diagonal field / motif detail, exact crop from the rectified master.
    field = carpet.convert("RGB").crop((250, 340, 1550, 1900)).resize((1500, 1800), RESAMPLE)
    field = field.rotate(-5, resample=Image.Resampling.BICUBIC, expand=False)
    save_jpeg(field.crop((80, 150, 1420, 1050)), args.out_dir / "02-field-motif-detail.jpg")

    # 03 — lower border and edge condition detail.
    edge = carpet.convert("RGB").crop((70, 2020, 1730, 2760)).resize((1600, 714), RESAMPLE)
    edge_plate = grey_plate((1600, 860), (197, 197, 194), (226, 225, 221))
    edge_plate.paste(edge, (0, 0))
    save_jpeg(edge_plate, args.out_dir / "03-border-edge-condition.jpg")

    # 04 — full low three-quarter studio view on the generated neutral plate.
    studio = Image.open(args.background).convert("RGB").resize((1800, 1200), RESAMPLE).convert("RGBA")
    # Keep the complete silhouette inside frame and below the cyclorama's
    # horizon so the carpet reads as resting on the floor, never floating.
    quad = [(374, 390), (1426, 390), (1690, 1080), (110, 1080)]
    rug_rgba = carpet.convert("RGBA")
    warped = warp_to_quad(rug_rgba, studio.size, quad)
    # A flat carpet needs only restrained floor contact, not a drop shadow.
    studio = add_shadow(studio, warped.getchannel("A"), (0, 3), 4, 24)
    save_jpeg(Image.alpha_composite(studio, warped), args.out_dir / "04-full-three-quarter.jpg")

    # 05 — straight full-product record on neutral grey with even margin.
    full_plate = grey_plate((1600, 2100), (181, 182, 181), (218, 218, 215)).convert("RGBA")
    full = carpet.resize((1180, 1810), RESAMPLE).convert("RGBA")
    layer = Image.new("RGBA", full_plate.size, (0, 0, 0, 0))
    layer.paste(full, (210, 145), full)
    full_plate = add_shadow(full_plate, layer.getchannel("A"), (10, 16), 20, 70)
    save_jpeg(Image.alpha_composite(full_plate, layer), args.out_dir / "05-full-frontal.jpg")


if __name__ == "__main__":
    main()
