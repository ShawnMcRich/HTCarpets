# Liquid Glass Carousel Design QA

- Source visual truth: `docs/design-references/liquid-glass-selected.png`
- Implementation screenshot: `public/media/carousel-info/ht-ksh-0001-liquid-glass-info.png`
- Combined comparison evidence: `docs/design-references/liquid-glass-design-comparison-final.png`
- Renderer: `docs/liquid-glass-carousel-renderer.html`
- State: static Instagram carousel information slide for `HT-KSH-0001`
- Destination size: 1080 × 1350 CSS pixels and output pixels at device scale 1
- Source pixels: 1092 × 1440; normalized with `object-fit: contain` in the combined comparison because the generated concept did not return the requested exact 4:5 ratio
- Implementation pixels: 1080 × 1350
- Comparison viewport: 2200 × 1500
- Browser evidence: headless Firefox loaded the renderer, authoritative product image, approved SVG lockup, and all text without runtime/resource errors
- Primary interactions tested: none; this deliverable is an intentionally static social image

## Findings

No actionable P0, P1, or P2 findings remain.

The implementation preserves the selected hierarchy: approved logo above, complete carpet as the dominant subject, five compact Latin provenance plaques on the left, smoked translucent surfaces, warm-gold hairlines, off-white serif values, and a dark restrained backdrop.

### Required fidelity surfaces

- Fonts and typography: Cormorant Variable reproduces the editorial serif hierarchy; compact sans-serif labels use controlled tracking and consistent optical weight. Long verified values receive a reduced size without clipping.
- Spacing and layout rhythm: the logo, carpet plate, card stack, card gaps, radii, and margins follow the selected composition. All 20 outputs were browser-rendered with automated card-overflow checks.
- Colors and visual tokens: forest-charcoal, warm gold, ivory, and smoked brown map to the Hosseintalab identity and the selected mock.
- Image quality and asset fidelity: every output uses the untouched catalog `full-frontal.png` and the approved `hosseintalab-lockup-horizontal-reversed.svg`. No carpet, motif, border, fringe, or logo is AI-redrawn in the production files.
- Copy and content: Latin facts are sourced from the catalog. Unknown dimensions, materials, or ages are omitted and replaced only by another verified fact; no placeholder or uncertain claim is shown as fact.

## Focused-region evidence

- Logo region: the approved medallion-and-wordmark lockup is legible, centered, and scaled to match the selected target.
- Glass stack: reference, origin, dimensions/design, material, and age remain readable at feed size; `HT-ISF-0001` verifies the longest material value.
- Variable-data cases: `HT-SHB-0001` and `HT-BJR-0001` verify four-card layouts when facts are incomplete; `HT-KSH-0004` verifies the twentieth catalog product and pictorial photography.
- Carpet region: full outlines and fringes remain visible in the sampled light, dark, pictorial, geometric, and floral carpets.

## Comparison history

1. Initial render: P2 — logo underscaled, glass cards too tall/wide, carpet too small. Fix: enlarged the approved lockup, reduced card dimensions, tightened stack rhythm, and expanded/shifted the carpet stage.
2. Second render: P2 — product plate began beneath the logo and created a visual collision. Fix: moved the product plate down, adjusted horizontal placement, and preserved the larger carpet scale.
3. Third render: P2 — logo remained smaller than the selected target and age values wrapped too aggressively. Fix: increased logo scale, moved it upward, removed balanced wrapping, and applied a compact long-value size.
4. Final render: no actionable P0/P1/P2 differences. The remaining background difference is intentional: the generated concept invented a dark gallery wall and altered the product, while production uses the real catalog photograph on an explicit archival plate.

## Implementation checklist

- [x] Twenty 1080 × 1350 PNGs generated.
- [x] Approved logo used everywhere.
- [x] Real full-frontal carpet photographs used without crop or stretch.
- [x] Verified Latin facts only.
- [x] No text overflow or browser resource/runtime errors.
- [x] Download gallery and reproducible renderer included.

## Follow-up polish

- P3: a future photography pass could capture each carpet directly against a dark wall, removing the visible neutral source-photo plate while retaining product truth.

final result: passed

---

## V2 art-directed collection — 2026-08-01

- Renderer: `docs/liquid-glass-carousel-proof-v2.html`
- Gallery: `docs/liquid-glass-carousel-gallery-v2.html`
- Scene assets: `public/media/carousel-scenes-v2/`
- Final exports: `public/media/carousel-info-v2/`
- Output: 20 of 20 PNG files verified at 1080 × 1350

### V2 corrections verified

- Each carpet has an individually art-directed architectural environment rather than the repeated neutral photo plate.
- The approved SVG logo and verified catalog facts remain deterministic browser overlays.
- References, dimensions and ages use Cormorant lining/tabular numeral features (`lnum` and `tnum`), eliminating the uneven old-style digit heights.
- Inline scripts in both the renderer and gallery parse successfully; the renderer's automated export pass detected no missing scene/logo assets, card overflow, or unexpected viewport size.
- Representative QA covered pale, dark, pictorial, hunting-scene, striped, long-material and narrow-format carpets.
- The initial V2 Nahavand scene collided with the logo; its scene was regenerated with explicit top and left safe zones and the final export was visually rechecked.

### Commerce-use boundary

The V2 scenes are generative editorial composites, not documentary condition photographs. They are suitable as carousel title slides and should be followed by the existing untouched full-frontal, context and detail photographs when published.

V2 final result: passed
