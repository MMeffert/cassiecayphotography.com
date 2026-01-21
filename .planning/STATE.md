# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-21)

**Core value:** The site must remain fast, secure, and easy for Cassie to update.
**Current focus:** v2.1 SEO — Technical SEO and image optimization

## Current Position

Phase: 18 of 19 (Image Sitemap Generation)
Plan: 1 of 1 complete
Status: Phase 18 complete
Last activity: 2026-01-21 — Completed 18-01-PLAN.md

Progress: [||||||||||||....] 3/4 SEO phases (75%)

## Milestones

See: .planning/MILESTONES.md

- **v2.1** SEO — IN PROGRESS (Phase 18 complete)
- **v2.0** jQuery Removal & Bootstrap 5 Migration — SHIPPED 2026-01-21
- **v1.0** Infrastructure & Modernization — SHIPPED 2026-01-20

## Accumulated Context

### Decisions

Decisions logged in PROJECT.md Key Decisions table.
Full decision log archived in phase SUMMARY.md files.

| Phase | Decision | Rationale |
|-------|----------|-----------|
| 18-01 | 100 portfolio images | Scan found more images than original 84 estimate |
| 18-01 | Separate page-sitemap.xml | Clean separation between page and image sitemaps |
| 17-01 | Hero image for social preview | cassiecay-background1.jpg (2000x1333) already optimized, prominent in site |
| 17-01 | Omit twitter:site | Business has no Twitter/X handle |
| 16-01 | Photographer via additionalType | Google recommendation for specialized local businesses |
| 16-01 | Empty telephone field | Business uses booking system, not direct calls |

### Open Blockers/Concerns

- **Dreamweaver workflow**: Build step must enhance, not replace HTML editing.
- **Tech debt**: Orphaned files in repo (style/js/plugins.js, style/js/scripts.js) not loaded in production.

### SEO Current State

Baseline (discovered during research):
- ✓ Meta description and OG tags present (partial)
- ✓ Structured data (JSON-LD) added — Phase 16 COMPLETE
- ✓ Twitter Card meta tags added — Phase 17 COMPLETE
- ✓ og:image added — Phase 17 COMPLETE
- ✓ Image sitemap with 100 portfolio images — Phase 18 COMPLETE
- ✗ 100 portfolio images have empty alt text → Phase 19

### Deferred Features (v2.2+)

- Folder-based image galleries (WORK-01 from v1)
- Bootstrap 5 offcanvas mobile menu
- Dark mode toggle

## Session Continuity

Last session: 2026-01-21
Stopped at: Completed 18-01-PLAN.md
Resume file: None
Next step: Plan and execute Phase 19 (AI Alt Text Generation)
