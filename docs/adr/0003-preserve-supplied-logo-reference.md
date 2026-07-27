# ADR 0003: Preserve the Supplied Logo Reference During Prototyping

- **Status:** Accepted
- **Date:** 2026-07-24

## Context

An attempted simplified vector interpretation changed the silhouette, ornament, and overall character of the preferred logo. The available approved-looking source is a raster reference.

## Decision

Use pixel-preserving raster crops from the supplied artwork in the prototype. Do not treat a simplified redraw as the brand master.

The corrected medallion export includes safe space around the full lower point and is used in the header, menu, footer, and favicon.

## Consequences

- The prototype remains visually faithful to the selected direction.
- Raster limitations remain at very small, large, print, reversed, and one-color applications.
- A professional production vector master is still required.
- Future vector approval must use overlays and reproduction tests against the reference.

