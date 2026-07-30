# Project Journal

This is a retrospective record of meaningful project outcomes. It is not a transcript of conversations or a list of every implementation step.

## Record prepared — 2026-07-24

### Business and product direction

- Defined Iran as the primary launch market and Persian as the primary language.
- Established two primary customer paths: `فرش برای خانه` for residential buyers and `فرش آنتیک` for collectors, designers, and specialist buyers.
- Kept the purchasing logic separate: room, size, color, and budget for home carpets; authenticity, age, condition, and restoration history for antique pieces.
- Established consultation, nationwide delivery, online purchasing, social inquiry, and store visits as complementary paths.

### Project operations

- Created the `HTCARPETS` Jira software project using a continuous Kanban-style workflow.
- Established eight delivery epics covering foundation, brand, catalog, content, operations, experience, engineering, and launch.
- Created initial project documentation for roadmap, backlog, brand, logo, taxonomy, photography, and decisions.
- Established repository hygiene: no tool or assistant attribution; project authorship remains with Shahin Ghanizadeh.

### Brand exploration

- Explored multiple Latin `HT` logo directions.
- Rejected generic luxury monograms that did not communicate Persian carpets.
- Selected a Persian-medallion direction as the leading route, pending final approval and vector production.
- Integrated the supplied artwork as an exact raster reference rather than accepting an inaccurate redraw.
- Corrected the standalone medallion export so the lower point renders completely in the header, footer, favicon, and mobile menu.
- Approved and produced a circular digital seal using the exact medallion, arched `HOSSEINTALAB`, `PERSIAN HANDWOVEN CARPETS`, and the confirmed establishment year ۱۲۹۰ هجری شمسی.
- Embedded the seal typeface and packaged a self-contained SVG so the typography and alignment remain consistent across devices.

### Experience direction

- Rejected an overly dark, mysterious gallery direction.
- Established a warm residential editorial-commerce direction.
- Built room-based discovery for reception rooms, living rooms, bedrooms, and small spaces.
- Designed expert consultation around a room image, dimensions, colors, and budget.
- Rebuilt the header, persistent navigation, mobile menu, conversion footer, and responsive behavior.
- Added a two-path collection entrance and a dedicated `فرش آنتیک` section without fabricating unavailable antique inventory.

### Catalog architecture

- Researched real Persian-carpet categories and avoided generic groupings such as traditional, handwoven, and modern.
- Separated customer discovery into size, weaving origin, and pattern.
- Added representative images for every launch-facing category.
- Corrected mismatches between category names and visual examples, including the Mahi pattern reference.
- Implemented a modal category preview and fixed the previous incorrect jump to the featured collection.

### Visual-content direction

- Produced representative residential and category imagery to guide future photography.
- Replaced images that appeared unrealistic or did not match the intended room.
- Defined a repeatable production-photography shot list for real inventory.
- Kept a clear distinction between visual references and actual available products.

### Persian content

- Rewrote the complete customer-facing Persian layer.
- Replaced translated syntax, abstract phrasing, and unnatural retail language with contemporary Iranian Persian.
- Preserved specialist carpet terminology while making its practical meaning clearer.
- Added a reusable Persian content and brand-voice standard.

### Engineering and validation

- Implemented the storefront with React, TypeScript, and Vite.
- Added responsive RTL layouts and locally bundled Persian and Latin fonts.
- Added scroll-aware navigation, category tabs, accessible dialogs, Escape handling, and body-scroll locking.
- Verified referenced media assets, internal anchor targets, desktop/mobile layout, horizontal overflow, console output, and production builds.

## Experience and identity overhaul — 2026-07-27

### Identity system

- Expanded the approved logo into a responsive production family without
  altering the supplied Persian medallion.
- Created light and reversed horizontal lockups, a stacked lockup, a ceremonial
  seal, favicon and app-icon sizes, social avatars, and a watermark.
- Assigned each logo version to a deliberate interface context instead of
  shrinking the circular seal everywhere.
- Added reproducible scripts for self-contained SVG packaging and
  native-proportion PNG exports.

### Customer journey

- Reduced repeated discovery sections and established one clear sequence:
  product path, room, market terminology, selected pieces, expertise, and
  consultation.
- Made `فرش برای خانه` the dominant residential path while retaining a distinct
  `فرش آنتیک` route.
- Turned room cards into a real interactive selector with immediate visual
  feedback and practical sizing advice.
- Removed controls that suggested unsupported saving, filtering, or checkout
  behavior.

### Interface standard

- Introduced a responsive layout and component system based on warm ivory,
  Hosseintalab navy, accessible gold, restrained editorial scale, and generous
  residential imagery.
- Added semantic landmarks, skip navigation, one primary heading, robust focus
  states, touch-target sizing, reduced-motion behavior, and properly managed
  dialogs and mobile navigation.
- Prioritized the hero asset, lazy-loaded below-fold images, declared media
  dimensions, and kept fonts local.

### Validation

- Passed the TypeScript and Vite production build.
- Confirmed all referenced images load, all internal anchors resolve, the
  document remains Persian RTL, and no horizontal overflow appears at desktop
  or mobile widths.
- Exercised the mobile menu, room selector, catalog tabs, and category dialog in
  the browser.
- Confirmed the browser console contains no runtime errors.

## Commerce data foundation — 2026-07-31

### Architecture and inventory

- Chose a fully self-hosted PostgreSQL approach on the existing production
  server; no managed backend or third-party database is part of the project.
- Created an isolated `hosseintalab` database, separate owner and application
  roles, and left PostgreSQL bound to localhost only.
- Modeled the actual carpet records needed for operations: SKU, origin, pattern,
  dimensions, Solar Hijri weaving year, estimated age, age classification, dye,
  material roles, price, image records, and collection (`فرش برای خانه` or
  `فرش آنتیک`).
- Defined `چله` correctly as the warp/foundation and kept `ریشه` separate as
  the visible end of the warp.
- Made inventory auditable through immutable stock movements, time-limited
  checkout reservations, and availability calculations that prevent a sale
  being deducted twice.

### Customer and operational readiness

- Added private database records for customer accounts, secure session tokens,
  email verification, password reset, addresses, orders, payments, and audit
  events.
- Restricted the future API role to Hosseintalab data access only; it cannot
  change the database schema or access unrelated server databases.
- Installed and validated a nightly PostgreSQL backup timer, retaining 14 local
  compressed database snapshots. Off-server replication remains required before
  accepting customer orders.

## Evidence still to capture

- Before-and-after screenshots for major design turns
- Final approved logo and brand guide
- Real product photography and catalog records
- Lighthouse and accessibility results
- Analytics baseline and conversion outcomes
- Customer or owner feedback
- Launch metrics at 7, 30, and 90 days
