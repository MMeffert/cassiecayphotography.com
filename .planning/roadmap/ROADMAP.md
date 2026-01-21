# Roadmap: Cassie Cay Photography - Website Modernization

## Overview

This roadmap transforms a working but aging photography portfolio into a fast, maintainable site with automated quality gates. The journey starts with quick wins (bug fixes, infrastructure cleanup), establishes a build system foundation, then progressively optimizes images, modernizes libraries, and adds CI/CD automation. Every phase preserves Cassie's ability to edit HTML directly in Dreamweaver.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Quick Fixes** - Bug fixes and infrastructure cleanup (low risk, immediate value) ✓ Complete 2026-01-20
- [x] **Phase 2: Build Foundation** - Vite setup with Revolution Slider exclusions ✓ Complete 2026-01-20
- [x] **Phase 3: Image Optimization** - Sharp pipeline, AVIF/WebP conversion, responsive images ✓ Complete 2026-01-20
- [x] **Phase 4: CI Validation** ✓ Complete 2026-01-20 - HTML/image validation, Lighthouse checks
- [x] **Phase 5: Notifications & Feedback** ✓ Complete 2026-01-20 - Deploy notifications and status for Mitchell
- [x] **Phase 6: Pre-commit Hooks** ✓ Complete 2026-01-20 - Local validation before CI
- [x] **Phase 7: JavaScript Cleanup** ✓ Complete 2026-01-20 - Remove unused code, reduce bundle size
- [x] **Phase 8: Library Modernization** - Replace Revolution Slider and heavy plugins (OPTIONAL) ✓ Complete 2026-01-20
- [ ] **Phase 9: Workflow Enhancement** - Folder-based galleries (OPTIONAL)

## Phase Details

### Phase 1: Quick Fixes
**Goal**: Eliminate known bugs and clean up infrastructure debt with zero risk to site functionality
**Depends on**: Nothing (first phase)
**Requirements**: BUG-01, BUG-02, INFRA-01, INFRA-02, INFRA-03, INFRA-04
**Research needed**: No (straightforward fixes)
**Success Criteria** (what must be TRUE):
  1. Portfolio image `cassiecay-M4-full.png` displays and links correctly
  2. Contact form has unique element IDs (no duplicate `id="message"`)
  3. Site serves from custom domain via CDK-managed CloudFront (old CloudFront deleted)
  4. CDK and npm dependencies are current (no critical/high vulnerabilities)
  5. GitHub OIDC role has least-privilege S3 permissions (legacy bucket removed)
  6. Dependabot security alerts enabled on repository
**Plans**: 3 plans

Plans:
- [x] 01-01-bug-fixes-PLAN.md — Fix broken image link and duplicate element IDs ✓
- [x] 01-02-domain-migration-PLAN.md — Update CDK deps, delete old CloudFront, enable domain ✓
- [x] 01-03-post-migration-cleanup-PLAN.md — Remove legacy S3 permission, verify Dependabot ✓

### Phase 2: Build Foundation
**Goal**: Establish Vite build system that optimizes assets without breaking Revolution Slider or Dreamweaver workflow
**Depends on**: Phase 1
**Requirements**: AUTO-01
**Research needed**: No (STACK.md provides complete Vite config with jQuery externals)
**Success Criteria** (what must be TRUE):
  1. `npm run build` produces minified CSS/JS in `dist/` directory
  2. `npm run dev` serves site locally with hot reload
  3. Revolution Slider animations work identically to current site
  4. HTML files remain editable in Dreamweaver (no source/output confusion)
  5. All existing jQuery plugins function correctly
**Plans**: 2 plans

Plans:
- [x] 02-01-vite-setup-PLAN.md — Initialize npm, configure Vite with jQuery external, PostCSS setup ✓
- [x] 02-02-verify-build-PLAN.md — Test build output, verify Revolution Slider works, human verification ✓

### Phase 3: Image Optimization
**Goal**: Reduce image payload from 81MB to ~25MB while maintaining photography portfolio quality
**Depends on**: Phase 2
**Requirements**: PERF-01, PERF-02
**Research needed**: Yes - quality settings vary by image type (portraits vs landscapes); may need per-image tuning
**Success Criteria** (what must be TRUE):
  1. All portfolio images have AVIF and WebP variants with JPEG fallback
  2. Images use `<picture>` elements with appropriate srcset/sizes
  3. Below-fold images use native `loading="lazy"` attribute
  4. Total image payload reduced by at least 60% (81MB -> 32MB or less)
  5. No visible quality degradation on photography portfolio images
**Plans**: 4 plans

Plans:
- [x] 03-01-PLAN.md — Install Sharp.js, create optimization script with conservative quality settings ✓
- [x] 03-02-PLAN.md — Human quality verification checkpoint (Cassie approves image quality) ✓
- [x] 03-03-PLAN.md — Update HTML with picture elements, wire optimized images into build ✓
- [x] 03-04-PLAN.md — Gap closure: fix srcset paths and logo fallback ✓

### Phase 4: CI Validation
**Goal**: Catch broken links, malformed HTML, and image issues before deployment
**Depends on**: Phase 3 (validation rules should reflect optimized asset structure)
**Requirements**: AUTO-02, AUTO-03, AUTO-06
**Research needed**: No (ARCHITECTURE.md includes complete workflow examples)
**Success Criteria** (what must be TRUE):
  1. CI fails if HTML contains malformed tags or broken internal links
  2. CI fails if HTML references images that do not exist
  3. CI warns if images exceed size threshold (e.g., >500KB)
  4. Lighthouse performance score visible in PR/deploy output
  5. All validation completes in under 2 minutes
**Plans**: 2 plans

Plans:
- [x] 04-01-PLAN.md — HTML validation and reference checking ✓
- [x] 04-02-PLAN.md — Image size warnings and Lighthouse integration ✓

### Phase 5: Notifications & Feedback
**Goal**: Mitchell knows immediately when deploys succeed or fail without checking GitHub
**Depends on**: Phase 4
**Requirements**: AUTO-05, WORK-02
**Research needed**: No (uses existing AWS SES infrastructure)
**Success Criteria** (what must be TRUE):
  1. Mitchell receives email when deploy succeeds (with link to site)
  2. Mitchell receives email when deploy fails (with error summary)
  3. Lighthouse score included in success notification
  4. Notifications arrive within 2 minutes of deploy completion
**Plans**: 1 plan

Plans:
- [x] 05-01-PLAN.md — Add SES permissions and workflow notification steps ✓

### Phase 6: Pre-commit Hooks
**Goal**: Catch errors locally before they reach CI, faster feedback loop
**Depends on**: Phase 4 (uses same validations learned from CI experience)
**Requirements**: AUTO-04
**Research needed**: No (Husky setup is straightforward)
**Success Criteria** (what must be TRUE):
  1. Git commit blocked if referenced images are missing
  2. Git commit blocked if HTML has obvious errors (unclosed tags)
  3. Pre-commit runs in under 5 seconds for typical changes
  4. Clear error messages tell Cassie what to fix
**Plans**: 1 plan

Plans:
- [x] 06-01-PLAN.md — Install Husky, create staged validation script, test hook ✓

### Phase 7: JavaScript Cleanup
**Goal**: Reduce JavaScript bundle by removing unused code and plugins
**Depends on**: Phase 2
**Requirements**: PERF-03, FRONT-03
**Research needed**: Partial - need to audit which JS files are actually used
**Parallelizable with**: Phases 4-6 (independent work stream)
**Success Criteria** (what must be TRUE):
  1. Unused JavaScript files identified and removed
  2. JavaScript bundle size reduced by at least 30%
  3. All existing site functionality preserved
  4. No console errors in browser
**Plans**: 1 plan

Plans:
- [x] 07-01-PLAN.md — Extract only used plugins and scripts, wire into build ✓

### Phase 8: Library Modernization (OPTIONAL)
**Goal**: Replace heavy jQuery plugins with modern lightweight alternatives
**Depends on**: Phase 7
**Requirements**: FRONT-01, FRONT-02, BUG-03
**Research needed**: Yes - Revolution Slider replacement requires understanding all current slider features
**Risk level**: HIGH - potential to break existing functionality
**Success Criteria** (what must be TRUE):
  1. Hero slider uses Embla Carousel (~8KB) instead of Revolution Slider (~420KB)
  2. Lightbox uses GLightbox (~11KB) instead of LightGallery (~25KB)
  3. Slider auto-advances with smooth fade transitions
  4. Slider does NOT pause on hover (BUG-03 fix)
  5. All gallery filtering works correctly with lightbox
  6. Total JavaScript reduced by >350KB
**Plans**: 3 plans

Plans:
- [x] 08-01-PLAN.md — Replace LightGallery with GLightbox ✓
- [x] 08-02-PLAN.md — Replace Revolution Slider with Embla Carousel ✓
- [x] 08-03-PLAN.md — Cleanup and human verification ✓

### Phase 9: Workflow Enhancement (OPTIONAL)
**Goal**: Cassie can add photos to galleries by dropping images in folders
**Depends on**: Phase 3
**Requirements**: WORK-01
**Research needed**: Yes - need to determine gallery generation approach
**Success Criteria** (what must be TRUE):
  1. Adding image to designated folder automatically includes it in gallery
  2. No HTML editing required for common photo additions
  3. Gallery maintains proper responsive image handling
  4. Works with Dreamweaver workflow (no build step confusion)
**Plans**: TBD

Plans:
- [ ] 09-01: Folder-based gallery implementation

## Coverage

| Requirement | Phase | Description |
|-------------|-------|-------------|
| BUG-01 | 1 | Fix broken portfolio image link |
| BUG-02 | 1 | Fix duplicate message element IDs |
| INFRA-01 | 1 | Complete domain migration |
| INFRA-02 | 1 | Update CDK and npm dependencies |
| INFRA-03 | 1 | Remove legacy S3 bucket permission |
| INFRA-04 | 1 | Add Dependabot security alerts |
| AUTO-01 | 2 | Build step for CSS/JS |
| PERF-01 | 3 | Image optimization pipeline |
| PERF-02 | 3 | Lazy loading |
| AUTO-02 | 4 | HTML validation in CI |
| AUTO-03 | 4 | Image validation in CI |
| AUTO-06 | 4 | Lighthouse performance check |
| AUTO-05 | 5 | Deploy notifications |
| WORK-02 | 5 | Deploy feedback for Mitchell |
| AUTO-04 | 6 | Pre-commit hooks |
| PERF-03 | 7 | Reduce JS bundle size |
| FRONT-03 | 7 | Remove unused JavaScript |
| FRONT-01 | 8 | Replace Revolution Slider |
| FRONT-02 | 8 | Update jQuery plugins |
| BUG-03 | 8 | Fix slider pause-on-hover behavior |
| WORK-01 | 9 | Folder-based galleries |

**Coverage:** 21/21 requirements mapped

## Parallelization Opportunities

The following phases can be worked in parallel after Phase 2 completes:

```
Phase 1: Quick Fixes (sequential - must be first)
    |
    v
Phase 2: Build Foundation (sequential - enables all optimization)
    |
    +---> Phase 3: Image Optimization
    |         |
    |         v
    |     Phase 4: CI Validation
    |         |
    |         v
    |     Phase 5: Notifications
    |         |
    |         v
    |     Phase 6: Pre-commit Hooks
    |
    +---> Phase 7: JS Cleanup (parallel with 3-6)
              |
              v
          Phase 8: Library Modernization (OPTIONAL)

Phase 9: Workflow Enhancement (can start after Phase 3)
```

## Research Flags

Phases needing deeper research during planning:
- **Phase 3**: Image quality settings (portraits vs landscapes, per-image tuning)
- **Phase 8**: Revolution Slider feature inventory (transitions, layers, timing)
- **Phase 9**: Gallery generation approach

Phases with standard patterns (skip research):
- **Phase 1**: Bug fixes and CDK updates
- **Phase 2**: Vite configuration (STACK.md provides complete config)
- **Phase 4**: CI/CD validation (ARCHITECTURE.md has examples)
- **Phase 5**: Email notifications
- **Phase 6**: Husky setup
- **Phase 7**: JavaScript audit

## Progress

**Execution Order:**
Phases 1-2 sequential, then parallel tracks possible per diagram above.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Quick Fixes | 3/3 | Complete | 2026-01-20 |
| 2. Build Foundation | 2/2 | Complete | 2026-01-20 |
| 3. Image Optimization | 4/4 | Complete | 2026-01-20 |
| 4. CI Validation | 2/2 | Complete | 2026-01-20 |
| 5. Notifications & Feedback | 1/1 | Complete | 2026-01-20 |
| 6. Pre-commit Hooks | 1/1 | Complete | 2026-01-20 |
| 7. JavaScript Cleanup | 1/1 | Complete | 2026-01-20 |
| 8. Library Modernization | 3/3 | Complete | 2026-01-20 |
| 9. Workflow Enhancement | 0/1 | Not started | - |

---
*Roadmap created: 2026-01-19*
*Phase 1 planned: 2026-01-19*
*Phase 2 planned: 2026-01-20*
*Phase 3 planned: 2026-01-20*
*Phase 4 planned: 2026-01-20*
*Phase 5 planned: 2026-01-20*
*Phase 6 planned: 2026-01-20*
*Phase 7 planned: 2026-01-20*
*Phase 8 planned: 2026-01-20*
*Depth: Comprehensive (9 phases)*
*Mode: YOLO*
