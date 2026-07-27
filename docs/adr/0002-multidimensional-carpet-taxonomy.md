# ADR 0002: Separate Carpet Taxonomy into Independent Dimensions

- **Status:** Accepted
- **Date:** 2026-07-24

## Context

Persian-carpet retailers often mix sizes, weaving origins, construction terms, and patterns inside a single navigation hierarchy. This makes the catalog difficult to understand and produces inconsistent product data.

## Decision

Model and present carpet discovery through separate dimensions:

1. product family;
2. size and format;
3. weaving origin or tradition;
4. pattern and structural design;
5. color;
6. material and construction;
7. room suitability and customer-facing collections.

The initial prototype exposes size, origin, and pattern as three clear browsing paths.

## Consequences

- Customers can begin with the information they already know.
- Product data remains useful for filters, search, SEO, and expert records.
- Each product can belong to multiple customer journeys without duplicate catalog entries.
- Real inventory must be audited before all documented terms become public filters.

