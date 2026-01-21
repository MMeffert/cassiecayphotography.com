# Requirements: Cassie Cay Photography

**Defined:** 2026-01-19 (v1), Updated 2026-01-20 (v2.0)
**Core Value:** The site must remain fast, secure, and easy for Cassie to update.

## v1 Requirements (COMPLETE)

### Bug Fixes
- [x] **BUG-01**: Fix broken portfolio image link — Phase 1 ✓
- [x] **BUG-02**: Fix duplicate `id="message"` elements — Phase 1 ✓
- [x] **BUG-03**: Fix slider pause-on-hover — Phase 8 ✓

### Infrastructure & Security
- [x] **INFRA-01**: Complete domain migration — Phase 1 ✓
- [x] **INFRA-02**: Update CDK and npm dependencies — Phase 1 ✓
- [x] **INFRA-03**: Remove legacy S3 bucket permission — Phase 1 ✓
- [x] **INFRA-04**: Add dependency vulnerability scanning — Phase 1 ✓

### Automation & Build
- [x] **AUTO-01**: Add build step to bundle and minify CSS/JS — Phase 2 ✓
- [x] **AUTO-02**: Add HTML validation in CI — Phase 4 ✓
- [x] **AUTO-03**: Add image validation in CI — Phase 4 ✓
- [x] **AUTO-04**: Add pre-commit hooks — Phase 6 ✓
- [x] **AUTO-05**: Add deploy notifications — Phase 5 ✓
- [x] **AUTO-06**: Add Lighthouse performance check — Phase 4 ✓

### Performance
- [x] **PERF-01**: Implement image optimization pipeline — Phase 3 ✓
- [x] **PERF-02**: Add lazy loading for below-fold images — Phase 3 ✓
- [x] **PERF-03**: Reduce JavaScript bundle size — Phase 7 ✓

### Frontend Modernization
- [x] **FRONT-01**: Replace Revolution Slider with Embla — Phase 8 ✓
- [x] **FRONT-02**: Replace jQuery plugins with modern equivalents — Phase 8 ✓
- [x] **FRONT-03**: Remove unused JavaScript files — Phase 7 ✓

### Workflow Improvements
- [x] **WORK-02**: Provide clear deploy feedback — Phase 5 ✓

**v1 Status:** 20/21 requirements complete (WORK-01 deferred to v2.1)

---

## v2.0 Requirements

### Bootstrap 5 Migration

- [x] **BS5-01**: Update all `data-*` attributes to `data-bs-*` namespace — Phase 10 ✓
- [x] **BS5-02**: Rename Bootstrap CSS utility classes (`.ml-*` → `.ms-*`, `.mr-*` → `.me-*`, `.float-left` → `.float-start`, etc.) — Phase 10 ✓
- [x] **BS5-03**: Replace Bootstrap 4 JS bundle with Bootstrap 5.3.x — Phase 10 ✓
- [x] **BS5-04**: Verify navbar collapse/expand works correctly on mobile — Phase 10 ✓
- [x] **BS5-05**: Update any deprecated Bootstrap 4 components — Phase 10 ✓

### Portfolio Grid Replacement

- [x] **PORT-01**: Replace Cubeportfolio with CSS Grid + vanilla JS filtering — Phase 11 ✓
- [x] **PORT-02**: Implement category filtering (all, wedding, portrait, etc.) — Phase 11 ✓
- [x] **PORT-03**: Maintain responsive grid layout across breakpoints — Phase 11 ✓
- [x] **PORT-04**: Integrate GLightbox with new portfolio grid — Phase 11 ✓
- [x] **PORT-05**: Add smooth filter transitions/animations — Phase 11 ✓
- [x] **PORT-06**: Implement masonry-style layout (variable height items) — Phase 11 ✓

### Navigation & Sticky Header

- [x] **NAV-01**: Replace SmartMenus with Bootstrap 5 native navigation — Phase 12 ✓
- [x] **NAV-02**: Replace Headhesive with vanilla JS sticky header (IntersectionObserver) — Phase 12 ✓
- [x] **NAV-03**: Maintain sticky header show/hide on scroll behavior — Phase 12 ✓
- [x] **NAV-04**: Verify mobile hamburger menu functionality — Phase 12 ✓

### Utility Scripts

- [x] **UTIL-01**: Replace scrollUp jQuery plugin with vanilla JS scroll-to-top — Phase 13 ✓
- [x] **UTIL-02**: Replace jQuery smooth scroll with native `scrollTo({ behavior: 'smooth' })` — Phase 12 ✓
- [x] **UTIL-03**: Remove jQuery Easing dependency (use CSS transitions or native easing) — Phase 12 ✓

### Contact Form Migration

- [x] **FORM-01**: Convert jQuery `$.ajax()` to fetch API — Phase 14 ✓
- [x] **FORM-02**: Maintain reCAPTCHA v2 integration with fetch — Phase 14 ✓
- [x] **FORM-03**: Convert jQuery DOM selectors to `querySelector`/`querySelectorAll` — Phase 14 ✓
- [x] **FORM-04**: Maintain form validation and error display behavior — Phase 14 ✓

### jQuery Removal

- [ ] **JQ-01**: Remove jQuery 3.x from vendor scripts
- [ ] **JQ-02**: Remove Popper.js v1 (Bootstrap 5 uses Popper v2 internally)
- [ ] **JQ-03**: Update Vite config to remove jQuery external declaration
- [ ] **JQ-04**: Verify no jQuery references remain in any scripts

---

## v2.1+ (Deferred)

- **WORK-01**: Implement folder-based image galleries (deferred from v1)
- Bootstrap 5 offcanvas mobile menu (enhancement)
- Portfolio load-more pagination (if needed)
- Dark mode toggle

## Out of Scope

| Feature | Reason |
|---------|--------|
| Full framework rewrite (React, Vue) | Static HTML structure works, Cassie edits in Dreamweaver |
| CMS or headless content management | Too much complexity for use case |
| Mobile app | Web-only |
| E-commerce/payments | Booking handled externally via Appointy |
| User authentication | Public portfolio site |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BS5-01 | Phase 10 | Complete ✓ |
| BS5-02 | Phase 10 | Complete ✓ |
| BS5-03 | Phase 10 | Complete ✓ |
| BS5-04 | Phase 10 | Complete ✓ |
| BS5-05 | Phase 10 | Complete ✓ |
| PORT-01 | Phase 11 | Complete ✓ |
| PORT-02 | Phase 11 | Complete ✓ |
| PORT-03 | Phase 11 | Complete ✓ |
| PORT-04 | Phase 11 | Complete ✓ |
| PORT-05 | Phase 11 | Complete ✓ |
| PORT-06 | Phase 11 | Complete ✓ |
| NAV-01 | Phase 12 | Complete ✓ |
| NAV-02 | Phase 12 | Complete ✓ |
| NAV-03 | Phase 12 | Complete ✓ |
| NAV-04 | Phase 12 | Complete ✓ |
| UTIL-01 | Phase 13 | Complete ✓ |
| UTIL-02 | Phase 12 | Complete ✓ |
| UTIL-03 | Phase 12 | Complete ✓ |
| FORM-01 | Phase 14 | Complete ✓ |
| FORM-02 | Phase 14 | Complete ✓ |
| FORM-03 | Phase 14 | Complete ✓ |
| FORM-04 | Phase 14 | Complete ✓ |
| JQ-01 | Phase 15 | Pending |
| JQ-02 | Phase 15 | Pending |
| JQ-03 | Phase 15 | Pending |
| JQ-04 | Phase 15 | Pending |

**v2.0 Coverage:** 24 requirements across 6 phases (Phases 10-15)

---
*Requirements defined: 2026-01-19*
*Updated: 2026-01-20 — Phase 10 complete (5 requirements)*
*Updated: 2026-01-21 — Phase 11 complete (6 requirements)*
*Updated: 2026-01-21 — Phase 12 complete (4 requirements)*
*Updated: 2026-01-21 — Phase 13 complete (3 requirements, 2 completed in Phase 12)*
*Updated: 2026-01-21 — Phase 14 complete (4 requirements)*
