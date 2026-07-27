# ADR 0001: React, TypeScript, and Vite for the Storefront Prototype

- **Status:** Accepted
- **Date:** 2026-07-24

## Context

The project needs a fast, portable Persian-first storefront prototype while commerce-platform, payment, shipping, and inventory requirements remain open.

## Decision

Build the current experience with React 19, TypeScript, and Vite.

## Consequences

- Product and visual decisions can be tested without committing to a final commerce backend.
- RTL components and interaction behavior can be implemented and validated directly.
- Type checking and production builds provide an engineering baseline.
- Catalog, checkout, and operations integrations remain future decisions.
- Migration cost must be considered if a different production commerce platform is selected.

