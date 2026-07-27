# Photography Direction

## Purpose

The current images are production references for the launch photographer. They establish composition, lighting, room context, carpet placement, and the balance between useful product detail and warm domestic atmosphere.

They are not final catalog records. Every carpet sold must ultimately be photographed as the real individual piece.

## Visual principles

- Photograph carpets inside believable Iranian homes, not empty luxury sets.
- Show how the carpet relates to furniture, circulation, light, and room scale.
- Keep colors accurate and natural; avoid heavy cinematic grading.
- Let rooms feel lived in through restrained details such as books, tea, textiles, and plants.
- Show complete carpet edges whenever the image is intended to explain size or placement.
- Use real daylight or a large soft source that behaves like daylight.
- Avoid dark galleries, palatial interiors, glossy showrooms, and artificial symmetry.

## Room applications

### Reception room

Reference: `public/media/rooms/reception-room.jpg`

- Portrait composition
- Large carpet shown beneath the complete seating group
- Clear medallion and border
- Refined but attainable home
- Warm morning light

### Everyday living room

Reference: `public/media/rooms/living-room.jpg`

- Relaxed sofa arrangement
- Front furniture legs resting on the carpet
- Visible signs of daily family use
- Soft afternoon daylight
- Warm, touchable wool texture

### Bedroom

Reference: `public/media/rooms/bedroom-v2.jpg`

- Carpet placed beneath roughly two-thirds of the bed
- Enough pattern visible at the foot and sides
- Quiet palette and diffused morning light
- Natural bedding and restrained styling

### Small space

Reference: `public/media/rooms/small-space.jpg`

- Entire small rug visible
- Slightly elevated camera angle
- Realistic compact-apartment dimensions
- Demonstrate usefulness rather than luxury

## Individual product photography

References:

- `public/media/products/tabriz-navy.jpg`
- `public/media/products/heriz-madder.jpg`
- `public/media/products/nain-ivory.jpg`

For every launch carpet capture:

1. Complete overhead or high three-quarter view
2. Straight-on full-frontal record
3. Front detail showing pile and color
4. Reverse detail showing knots
5. Fringe and edge condition
6. Corner and border detail
7. Hand or neutral scale reference
8. Short video walking around the full piece
9. Short video changing the viewing angle to reveal color variation
10. One appropriate residential application

Use the same neutral floor, color target, camera height, and lighting setup across the catalog.

### Professional five-shot studio set

Market response supports adding a consistent studio set alongside the realistic in-home image. Produce these five views for every carpet:

Project reference files:

- `docs/references/studio-photography/01-corner-construction.jpg`
- `docs/references/studio-photography/02-field-motif-detail.jpg`
- `docs/references/studio-photography/03-border-edge-condition.jpg`
- `docs/references/studio-photography/04-full-three-quarter.jpg`
- `docs/references/studio-photography/05-full-frontal.jpg`

1. **Corner and construction detail:** close view of one corner, the outer guard borders, edge finish, and fringe when present.
2. **Field and motif detail:** shallow diagonal view across the field showing pile, drawing, color transitions, and a recognisable primary motif.
3. **Border and edge condition:** straight close view across a full border section, including edge condition and fringe when present.
4. **Full three-quarter product view:** the complete carpet on a seamless neutral warm-grey studio floor, photographed from a low elevated angle with physically accurate perspective.
5. **Full frontal record:** the complete carpet straight-on against neutral grey, with even margins and no cropping.

The studio set supplements rather than replaces the overhead record, reverse/knots image, scale reference, condition details, video, and residential application.

#### Fidelity standard

- The carpet is documentary evidence. Never regenerate, repaint, symmetrise, repair, clone, or invent its motifs, borders, fringe, wear, damage, or color variation.
- Build derivative angles from the approved high-resolution master using deterministic crop, perspective transform, and compositing. Generative tools may create an empty background plate only; they must not redraw any carpet pixels.
- Preserve visible handmade asymmetry and condition. Dust removal or exposure correction must never conceal restoration, wear, stains, edge loss, or structural irregularity.
- Retain the rectified master and link every derivative to the same inventory ID so fidelity can be audited.
- Compare the field, both primary motifs, all border runs, and each corner against the master at 100% before publication.

The reusable deterministic builder is `scripts/build_exact_carpet_studio_set.py`. It expects a rectified source photograph, an empty neutral studio plate, and a product-specific corner quadrilateral measured from the source image.

The first approved test should always be the full three-quarter product view. Review motif fidelity, border runs, corners, apparent scale, floor contact, and color before producing the remaining four views. The neutral plate may be generated, but the carpet layer must remain source-derived pixels only.

External benchmark: premium antique-rug listings commonly use multi-image galleries with full-product and detail records; see the [1stDibs antique Persian Shiraz rug listing](https://www.1stdibs.com/furniture/rugs-carpets/persian-rugs/antique-persian-shiraz-rug/id-f_13384701/) as one current marketplace example. Treat marketplace imagery as composition research, never as a source of carpet content.

## Expertise and consultation

### Bazaar inspection

Reference: `public/media/story/bazaar-inspection.jpg`

Document real hands checking weave, knots, edges, repairs, and condition. The subject should be working naturally rather than posing.

### Remote consultation

Reference: `public/media/consultation-room-measure-v2.jpg`

Show the customer's simple action: measuring the open floor area, keeping a phone nearby for room photos, and recording only the information needed for a useful recommendation.

## Delivery requirements

- Shoot RAW plus high-quality JPEG
- Record accurate carpet dimensions and inventory ID with every setup
- Keep a neutral color reference in the first frame of each carpet
- Deliver uncropped masters alongside approved website crops
- Capture vertical and horizontal alternatives for Instagram and the website
- Record 8–15 second stable video clips for motion sections
