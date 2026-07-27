# Hosseintalab Brand Assets

## Source of truth

The approved Persian medallion is preserved from the supplied artwork. It must
not be redrawn, simplified, traced loosely, or replaced with a generic `HT`
monogram.

The logo system combines that exact transparent medallion with purpose-built
vector typography and geometry. The SVG files are therefore vector
compositions containing the approved raster medallion; they do not claim that
the medallion itself has been vectorized.

## Master files

| Asset | Purpose |
|---|---|
| `public/brand/source/hosseintalab-logo-reference.png` | Untouched stakeholder reference |
| `public/brand/raster/hosseintalab-medallion-exact-v2.png` | Complete pixel-preserving medallion crop |
| `public/brand/raster/hosseintalab-medallion-transparent.png` | Transparent approved medallion used in compositions |
| `public/brand/vector/hosseintalab-seal.svg` | Editable circular ceremonial seal |
| `public/brand/vector/hosseintalab-lockup-horizontal.svg` | Editable light-background horizontal lockup |
| `public/brand/vector/hosseintalab-lockup-horizontal-reversed.svg` | Editable dark-background horizontal lockup |
| `public/brand/vector/hosseintalab-lockup-stacked.svg` | Editable stacked lockup |
| `public/brand/fonts/cormorant-latin-variable.woff2` | Editable-source Latin brand typeface |

## Portable exports

The files in `public/brand/exports/` are ready to move outside the repository.
Each SVG contains the medallion data and converts the approved Cormorant
lettering to exact vector outlines. It therefore has no external image or font
dependency and cannot substitute a different typeface when opened, printed, or
rasterized.

### Full logo family

- `hosseintalab-seal.svg` and `.png` — formal seal for heritage, certificates,
  project identity, profile imagery, and large ceremonial placements
- `hosseintalab-lockup-horizontal.svg` and `.png` — primary website header,
  stationery, and other wide light-background placements
- `hosseintalab-lockup-horizontal-reversed.svg` and `.png` — footer and dark
  photography or navy fields
- `hosseintalab-lockup-stacked.svg` and `.png` — narrow layouts, presentations,
  packaging panels, and mobile menu

### Digital small-format family

- `hosseintalab-icon-16.png`
- `hosseintalab-icon-32.png`
- `hosseintalab-icon-48.png`
- `hosseintalab-icon-180.png`
- `hosseintalab-icon-192.png`
- `hosseintalab-icon-512.png`
- `hosseintalab-avatar-512.png`
- `hosseintalab-avatar-1080.png`
- `hosseintalab-watermark.png`

The icon family uses the medallion alone because circular-seal typography cannot
remain legible at favicon or app-icon scale. The avatar family uses the full
seal because social and project-profile placements render at a larger size.

## Required wording

- Name: `HOSSEINTALAB`
- Descriptor: `PERSIAN HANDWOVEN CARPETS`
- Establishment line: `EST. 1290 · SH`

Do not strike through `EST.` or `SH`. The arched name follows the circular seal
geometry and the medallion remains optically centered inside it.

## Website usage

- Desktop header: light horizontal lockup
- Mobile header: medallion icon
- Mobile menu: stacked lockup
- Heritage section: complete circular seal
- Dark footer: reversed horizontal lockup
- Browser and device icons: responsive icon suite
- Decorative use: low-opacity watermark only

## Clear space and minimum size

- Keep clear space around a logo equal to at least the width of the central `H`
  stem in the medallion.
- Do not render the full circular seal below 120 CSS pixels.
- Do not render the horizontal lockup below 220 CSS pixels.
- Below those sizes, use the medallion icon.
- Never stretch, crop, recolor, rotate, add a drop shadow, or place the logo
  inside an unrelated badge.

## Working colors

| Role | Value |
|---|---|
| Hosseintalab navy | `#072A51` |
| Brand gold | `#B78B3F` |
| Warm ivory | `#F8F1E5` |

The storefront uses a darker accessible gold for small interface text. That
interface color is not a replacement for the gold inside the logo.

## Rebuilding exports

```bash
python3 scripts/package_brand_seal.py
python3 scripts/build_logo_rasters.py
```

The packaging script embeds the exact medallion and converts editable Cormorant
text to font-independent vector outlines. The raster script produces
native-proportion PNG lockups, favicons, avatars, and the watermark from those
outlined exports.
