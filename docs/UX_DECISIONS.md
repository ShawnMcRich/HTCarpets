# UX Decision Record

This document records customer-experience decisions that affect the storefront. Technical architecture decisions live in `docs/adr/`.

## UX-001 — Residential commerce, not a mysterious luxury gallery

**Status:** Confirmed

The visual direction must feel premium and distinctive without resembling a museum, fashion-house teaser, or inaccessible collector gallery.

**Reasoning:** The primary customer is furnishing a home. The interface must create desire while remaining warm, useful, and easy to shop.

## UX-002 — Persian-first and RTL from the beginning

**Status:** Confirmed

Persian is the primary interface language and RTL behavior is treated as a design requirement rather than a later translation layer.

**Evidence:** Navigation, typography, content hierarchy, component alignment, and responsive behavior are implemented directly in RTL.

## UX-003 — Begin with the room

**Status:** Confirmed

Customers can begin with reception room, living room, bedroom, or small-space needs.

**Reasoning:** A non-specialist usually knows the room they are furnishing before they know a weaving origin or pattern name.

## UX-004 — Preserve real carpet terminology

**Status:** Confirmed

The catalog uses actual market categories—size, weaving origin, and pattern—instead of relying on vague labels such as traditional, modern, or luxury.

**Reasoning:** Accurate terminology builds trust and supports both beginners and experienced buyers.

## UX-005 — Separate taxonomy dimensions

**Status:** Confirmed

Size, origin, and pattern are presented as distinct browsing paths.

**Reasoning:** A term such as Tabriz, six-square-meter, and Afshan answers three different questions. Mixing them in one menu makes comparison harder.

## UX-006 — Show an image for every category

**Status:** Confirmed

Each customer-facing category has a representative image. Selecting a category opens a dedicated preview instead of navigating to an unrelated section.

**Validation:** Preview interaction supports background click, close control, Escape, mobile layout, and background-scroll locking.

## UX-007 — Consultation is a primary conversion path

**Status:** Confirmed

The customer is invited to send a room image, approximate dimensions, color context, and budget.

**Reasoning:** Expert narrowing reduces purchase anxiety and reflects the business's real advantage.

## UX-008 — Use realistic residential visual references

**Status:** Confirmed for prototype; replacement required for launch

Reference images show carpets in believable lived-in homes and illustrate the photographs required from the production team.

**Constraint:** Reference images are not product records and cannot imply availability of a specific carpet.

## UX-009 — Use the supplied logo artwork faithfully

**Status:** Confirmed for prototype

The interface uses pixel-preserving crops from the supplied raster reference. Simplified or reinterpreted vector artwork is not accepted as the brand source.

## UX-010 — Make navigation persistent and functional

**Status:** Confirmed

The desktop header remains available while scrolling and exposes the two collection paths, guidance, story, and consultation. Mobile navigation uses a focused side panel with keyboard dismissal, focus containment, focus restoration, and background-scroll control.

## UX-011 — Use natural Iranian Persian

**Status:** Confirmed

Customer-facing text must sound written in Persian rather than translated into Persian. Abstract English-derived phrasing and exaggerated luxury language are rejected.

## UX-012 — Treat the footer as a conversion and trust surface

**Status:** Confirmed

The footer provides a final consultation prompt, site navigation, trust signals, location context, and a clear return-to-top action.

## UX-013 — Use a responsive logo system

**Status:** Confirmed

One logo is not scaled indiscriminately across the interface. The horizontal
lockup is used where the name must be readable, the seal is reserved for
heritage placements, and the medallion is used at icon scale.

## UX-014 — Keep the first decision simple

**Status:** Confirmed

The hero presents two clear routes—`فرش برای خانه` and `فرش آنتیک`—while the
primary action serves the residential shopper. Deeper taxonomy is introduced
only after the customer has understood the room-based path.

## UX-015 — Do not imply unavailable commerce functions

**Status:** Confirmed

Prototype product cards lead to consultation and inquiry. Save buttons,
checkout controls, self-links, and filters that do not produce a real result
are excluded until the supporting product and commerce systems exist.

## UX-016 — Meet interaction and accessibility baselines

**Status:** Confirmed

- Persian direction is declared at the document level.
- The page has one descriptive `h1`, semantic landmarks, logical heading order,
  and a skip link.
- Interactive targets are at least 24 by 24 CSS pixels and primary controls are
  generally 44 pixels or larger.
- Focus is visible and is not hidden by the sticky header.
- Tabs use tab semantics and arrow-key navigation.
- Dialogs and mobile navigation support Escape, focus containment, focus
  restoration, and body-scroll locking.
- Reduced-motion preferences are respected.
- Small interface text meets WCAG AA contrast against its background.

## UX-017 — Design for performance from the first render

**Status:** Confirmed

The hero image is preloaded and prioritized. Below-fold imagery is lazy-loaded,
all content images declare dimensions to limit layout shift, fonts are bundled
locally, and the application ships without a UI framework or icon library.
