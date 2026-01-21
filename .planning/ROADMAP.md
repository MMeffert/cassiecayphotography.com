# Roadmap: Cassie Cay Photography

## Milestone v2.0: jQuery Removal & Bootstrap 5 Migration

**Target:** Remove jQuery dependency entirely, migrate to Bootstrap 5, reduce bundle size by ~350KB
**Phases:** 6 (Phase 10-15)
**Requirements:** 24
**Estimated effort:** 15-24 hours total

### Phase 10: Bootstrap 5 Migration

**Goal:** Site runs on Bootstrap 5.3.x with all interactive components working

**Requirements:** BS5-01, BS5-02, BS5-03, BS5-04, BS5-05

**Plans:** 1 plan

Plans:
- [x] 10-01-PLAN.md — Migrate Bootstrap 4.4.1 to 5.3.x (data attributes, CSS classes, JS bundle)

**Success Criteria:**
1. Navbar hamburger menu opens and closes on mobile devices
2. All dropdown menus function correctly on desktop
3. Page layout matches pre-migration appearance (no visual regressions)
4. Console shows no Bootstrap-related JavaScript errors

**Dependencies:** None (foundation phase)

**Notes:** jQuery remains during this phase for custom-scripts.js compatibility. Bootstrap 5 bundle includes Popper v2 internally.

---

### Phase 11: Portfolio Grid Replacement

**Goal:** Portfolio displays and filters using Muuri + vanilla JS instead of Cubeportfolio

**Requirements:** PORT-01, PORT-02, PORT-03, PORT-04, PORT-05, PORT-06

**Plans:** 3 plans

Plans:
- [x] 11-01-PLAN.md — Add Muuri library and create portfolio grid CSS ✓
- [x] 11-02-PLAN.md — Update HTML structure and implement Muuri filtering with GLightbox ✓
- [x] 11-03-PLAN.md — Human verification and Cubeportfolio cleanup ✓

**Success Criteria:**
1. User can filter portfolio by category (all, wedding, portrait, etc.) and images animate smoothly
2. Portfolio displays correctly at all breakpoints (4/3/2/1 columns)
3. Clicking portfolio image opens GLightbox with correct image
4. Variable-height images display in masonry-style layout without gaps

**Dependencies:** Phase 10 (Bootstrap 5 utilities and grid system)

**Notes:** Using Muuri 0.9.5 (23.8KB) for masonry layout and filtering. Research confirmed native CSS masonry not production-ready until mid-2026.

---

### Phase 12: Navigation & Sticky Header

**Goal:** Navigation and sticky header work without SmartMenus or jQuery dependencies

**Requirements:** NAV-01, NAV-02, NAV-03, NAV-04

**Plans:** 2 plans

Plans:
- [x] 12-01-PLAN.md — Implement vanilla JS sticky header and CSS smooth scroll ✓
- [x] 12-02-PLAN.md — Remove obsolete plugins and verify navigation functionality ✓

**Success Criteria:**
1. Sticky header appears after scrolling past hero section (~350px)
2. Header hides when scrolling down, shows when scrolling up
3. Mobile hamburger menu opens/closes with animation
4. All navigation links scroll smoothly to their targets

**Dependencies:** Phase 10 (Bootstrap 5 navbar), Phase 11 (may share scroll behavior code)

**Notes:** SmartMenus becomes redundant after Bootstrap 5 migration. Headhesive initialization callback that calls SmartMenus must be removed.

---

### Phase 13: Utility Scripts Conversion

**Goal:** All utility functions use vanilla JS instead of jQuery plugins

**Requirements:** UTIL-01, UTIL-02, UTIL-03

**Plans:** 1 plan

Plans:
- [x] 13-01-PLAN.md — Implement vanilla JS scroll-to-top button (UTIL-01) ✓

**Success Criteria:**
1. Scroll-to-top button appears when page is scrolled and scrolls smoothly to top when clicked
2. All anchor links scroll smoothly to targets using native scrollTo()
3. Scroll animations feel consistent (no jarring easing changes)

**Dependencies:** Phase 10 (Bootstrap 5), Phase 11 (portfolio may use smooth scroll)

**Notes:** UTIL-02 (CSS smooth scroll) and UTIL-03 (jQuery Easing removal) were completed in Phase 12. Only UTIL-01 (scrollUp replacement) remains - ~30 lines of vanilla JS.

---

### Phase 14: Contact Form Migration

**Goal:** Contact form submits and validates using fetch API instead of jQuery AJAX

**Requirements:** FORM-01, FORM-02, FORM-03, FORM-04

**Plans:** 1 plan

Plans:
- [x] 14-01-PLAN.md — Convert submitToAPI() from jQuery AJAX to fetch API ✓

**Success Criteria:**
1. User can submit contact form and receives success/error feedback
2. Form validation prevents submission of incomplete/invalid data
3. reCAPTCHA v2 challenge displays and blocks bots
4. Error messages display correctly for each field type

**Dependencies:** None (isolated component, can run parallel to Phase 13)

**Notes:** 18 jQuery calls need conversion. Test with slow network and error scenarios.

---

### Phase 15: jQuery Removal & Cleanup

**Goal:** Site runs without jQuery, all dependencies eliminated

**Requirements:** JQ-01, JQ-02, JQ-03, JQ-04

**Success Criteria:**
1. Page loads with no console errors
2. All interactive features work (portfolio, lightbox, contact form, navigation)
3. grep for "jQuery" and "$(" returns zero matches in production scripts
4. Bundle size reduced by ~350KB compared to v1 baseline

**Dependencies:** Phase 10, 11, 12, 13, 14 (all jQuery usage must be eliminated first)

**Notes:** Final verification phase. Remove jQuery script tag, Popper v1, update Vite config.

---

## Progress

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 10 | Bootstrap 5 Migration | 5 | Complete |
| 11 | Portfolio Grid Replacement | 6 | Complete |
| 12 | Navigation & Sticky Header | 4 | Complete |
| 13 | Utility Scripts Conversion | 3 | Complete |
| 14 | Contact Form Migration | 4 | Complete |
| 15 | jQuery Removal & Cleanup | 4 | Pending |

**Total:** 24 requirements across 6 phases

---

## Coverage Validation

All 24 v2.0 requirements mapped:

| Category | Requirements | Phase |
|----------|--------------|-------|
| Bootstrap 5 Migration | BS5-01, BS5-02, BS5-03, BS5-04, BS5-05 | 10 |
| Portfolio Grid Replacement | PORT-01, PORT-02, PORT-03, PORT-04, PORT-05, PORT-06 | 11 |
| Navigation & Sticky Header | NAV-01, NAV-02, NAV-03, NAV-04 | 12 |
| Utility Scripts | UTIL-01, UTIL-02, UTIL-03 | 13 |
| Contact Form Migration | FORM-01, FORM-02, FORM-03, FORM-04 | 14 |
| jQuery Removal | JQ-01, JQ-02, JQ-03, JQ-04 | 15 |

**Coverage:** 24/24 requirements mapped (100%)
**Orphaned:** None

---

*Roadmap created: 2026-01-20*
*Phase 10 complete: 2026-01-20*
*Phase 11 complete: 2026-01-21*
*Phase 12 complete: 2026-01-21*
*Phase 13 complete: 2026-01-21*
*Phase 14 complete: 2026-01-21*
