# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-22)

**Core value:** The site must remain fast, secure, and easy for Cassie to update.
**Current focus:** v2.4 GitHub-based Content Management

## Current Position

Milestone: v2.4 complete
Status: Shipped
Last activity: 2026-01-23 — GitHub Actions workflow for photo uploads

## Milestones

See: .planning/MILESTONES.md

- **v2.4** GitHub Content Management — SHIPPED 2026-01-23
  - Text editing via GitHub web UI
  - Photo uploads via `new-photos/` folder with automated processing
  - Categories renamed to readable names (family, milestone, senior, newborn, couples)
- **v2.3** Tech Debt Cleanup — SHIPPED 2026-01-22 (Phases 21-22)
- **v2.2** Mobile Navigation — SHIPPED 2026-01-21 (Phase 20)
- **v2.1** SEO — SHIPPED 2026-01-21 (Phases 16-19)
- **v2.0** jQuery Removal & Bootstrap 5 Migration — SHIPPED 2026-01-21 (Phases 1-15)
- **v1.0** Infrastructure & Modernization — SHIPPED 2026-01-20

## Accumulated Context

### Decisions

- Chose GitHub web UI over Decap CMS for simplicity
- Photo workflow: upload to `new-photos/` → auto-process → manual HTML placement
- Image quality: 85 AVIF, 85 WebP, 90 JPEG

### Open Blockers/Concerns

None

### Deferred Features

- Folder-based image galleries
- Dark mode toggle

## Session Continuity

Last session: 2026-01-23
Stopped at: v2.4 milestone complete
