"""Convert editable SVG text to exact Cormorant vector outlines.

The source SVGs keep editable text. Portable exports use paths so browser,
native raster, presentation, and design-tool rendering cannot substitute a
different font.
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
import re
import xml.etree.ElementTree as ET

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont


ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = ROOT / "public/brand/fonts/cormorant-latin-variable.woff2"
SVG_NAMESPACE = "http://www.w3.org/2000/svg"
XLINK_NAMESPACE = "http://www.w3.org/1999/xlink"
SVG_TEXT = f"{{{SVG_NAMESPACE}}}text"
SVG_GROUP = f"{{{SVG_NAMESPACE}}}g"
SVG_PATH = f"{{{SVG_NAMESPACE}}}path"
SVG_STYLE = f"{{{SVG_NAMESPACE}}}style"

ET.register_namespace("", SVG_NAMESPACE)
ET.register_namespace("xlink", XLINK_NAMESPACE)


def number(value: str | None, default: float) -> float:
    if value is None:
        return default
    match = re.search(r"-?\d+(?:\.\d+)?", value)
    return float(match.group()) if match else default


def compact(value: float) -> str:
    return f"{value:.4f}".rstrip("0").rstrip(".")


@lru_cache(maxsize=None)
def font_at_weight(weight: int):
    variable_font = TTFont(FONT_PATH)
    font = instantiateVariableFont(
        variable_font,
        {"wght": max(300, min(700, weight))},
        inplace=False,
    )
    return font, font.getGlyphSet(), font.getBestCmap()


@lru_cache(maxsize=None)
def glyph_data(character: str, weight: int):
    font, glyph_set, character_map = font_at_weight(weight)
    glyph_name = character_map.get(ord(character))
    if glyph_name is None:
        return "", 0

    advance, _ = font["hmtx"][glyph_name]
    pen = SVGPathPen(glyph_set)
    glyph_set[glyph_name].draw(pen)
    return pen.getCommands(), advance


def outline_text_node(
    text_node: ET.Element,
    inherited: dict[str, str],
) -> ET.Element:
    content = text_node.text or ""
    font_size = number(text_node.get("font-size") or inherited.get("font-size"), 16)
    font_weight = round(
        number(text_node.get("font-weight") or inherited.get("font-weight"), 400)
    )
    letter_spacing = number(
        text_node.get("letter-spacing") or inherited.get("letter-spacing"), 0
    )
    anchor = text_node.get("text-anchor") or inherited.get("text-anchor", "start")
    x = number(text_node.get("x"), 0)
    y = number(text_node.get("y"), 0)
    scale = font_size / 1000

    advances = [glyph_data(character, font_weight)[1] for character in content]
    width = sum(advance * scale for advance in advances)
    if len(content) > 1:
        width += letter_spacing * (len(content) - 1)

    if anchor == "middle":
        cursor = x - width / 2
    elif anchor == "end":
        cursor = x - width
    else:
        cursor = x

    group = ET.Element(SVG_GROUP)
    group.set("aria-label", content)

    original_transform = text_node.get("transform")
    if original_transform:
        group.set("transform", original_transform)

    for attribute in ("fill", "stroke", "opacity"):
        value = text_node.get(attribute)
        if value is not None:
            group.set(attribute, value)

    for character, advance in zip(content, advances):
        path_data, _ = glyph_data(character, font_weight)
        if path_data:
            path = ET.SubElement(group, SVG_PATH)
            path.set("d", path_data)
            path.set(
                "transform",
                " ".join(
                    (
                        f"translate({compact(cursor)} {compact(y)})",
                        f"scale({compact(scale)} {compact(-scale)})",
                    )
                ),
            )
        cursor += advance * scale + letter_spacing

    return group


def outline_svg_text(svg: str) -> str:
    root = ET.fromstring(svg)

    inheritable = (
        "fill",
        "stroke",
        "opacity",
        "font-size",
        "font-weight",
        "letter-spacing",
        "text-anchor",
    )

    def visit(parent: ET.Element, inherited: dict[str, str]) -> None:
        current = dict(inherited)
        for attribute in inheritable:
            value = parent.get(attribute)
            if value is not None:
                current[attribute] = value

        for index, child in enumerate(list(parent)):
            if child.tag == SVG_TEXT:
                replacement = outline_text_node(child, current)
                parent.remove(child)
                parent.insert(index, replacement)
            else:
                visit(child, current)

    visit(root, {})

    # Exported artwork no longer depends on a font once every text node has
    # become an exact glyph path. Remove the source-only @font-face block so
    # portable files cannot trigger substitution and stay compact.
    for parent in root.iter():
        for child in list(parent):
            if child.tag == SVG_STYLE and "@font-face" in (child.text or ""):
                parent.remove(child)

    return '<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(
        root,
        encoding="unicode",
    )


if __name__ == "__main__":
    for source in sorted((ROOT / "public/brand/exports").glob("*.svg")):
        source.write_text(
            outline_svg_text(source.read_text(encoding="utf-8")),
            encoding="utf-8",
        )
        print(source)
