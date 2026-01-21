# Milestone v2.2: Mobile Navigation

**Status:** In Progress
**Phases:** 20
**Total Plans:** TBD

## Overview

Modernize the mobile navigation by replacing Bootstrap 5's navbar collapse component with an offcanvas drawer that slides in from the left. This provides a more native mobile UX while maintaining full compatibility with the existing sticky header implementation.

## Phases

### Phase 20: Offcanvas Navigation

**Goal:** Mobile users access navigation via smooth slide-in drawer from left side
**Depends on:** None (modifies existing navbar)
**Plans:** TBD

**Requirements:**
- NAV-01: Replace navbar collapse with offcanvas component (slide from left)
- NAV-02: Hamburger icon opens offcanvas menu on mobile
- NAV-03: Close button and backdrop dismiss menu
- NAV-04: Navigation links close menu after click
- NAV-05: Menu works correctly with existing sticky header
- NAV-06: Smooth animation transitions

**Success Criteria:**
1. On mobile viewport (<992px), tapping hamburger icon opens offcanvas drawer from left side
2. Offcanvas contains all navigation links (Home, About, Portfolio, Services, Schedule, Contact)
3. Close button (X) in offcanvas header dismisses menu
4. Clicking backdrop (outside menu) dismisses menu
5. Clicking any navigation link navigates to section and automatically closes menu
6. Sticky header clone also uses offcanvas (both navbars share same behavior)
7. Offcanvas animations are smooth with Bootstrap default transitions
8. Desktop navigation (≥992px) remains unchanged with horizontal navbar
9. No JavaScript errors on offcanvas open/close
10. Hamburger icon animates (active state) when offcanvas is visible

**Notes:**
- Offcanvas placement: `start` (slides from left)
- Hamburger button updates: `data-bs-toggle="offcanvas"` and `data-bs-target="#offcanvasNav"`
- Sticky header: Cloned navbar must reference same offcanvas element (no duplication)
- Bootstrap 5.3.3 offcanvas API handles show/hide/backdrop automatically
- Existing scroll spy and sticky header logic unchanged

---

## Milestone Summary

**Requirements Coverage:**

| Category | Requirements | Phase |
|----------|--------------|-------|
| Mobile Navigation | NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, NAV-06 | 20 |

**Coverage:** 6/6 requirements mapped (100%)

**Key Implementation Notes:**

- **Single phase delivery:** All requirements are tightly coupled (offcanvas component includes trigger, close button, backdrop, and link behavior by design)
- **Sticky header compatibility:** Cloned navbar references same offcanvas ID to avoid duplicate DOM elements
- **Desktop unaffected:** Offcanvas only applies on mobile breakpoint (<992px)
- **No new dependencies:** Bootstrap 5.3.3 offcanvas is native, no additional plugins needed

**Technical Approach:**

1. Convert `.navbar-collapse` div to offcanvas structure with `id="offcanvasNav"`
2. Update hamburger button to use `data-bs-toggle="offcanvas"` instead of `data-bs-toggle="collapse"`
3. Add offcanvas header with close button
4. Update sticky header clone initialization to reference shared offcanvas element
5. Update JavaScript event handlers for link clicks to use Bootstrap Offcanvas API
6. Test across mobile breakpoints and sticky/non-sticky states

---

_Created: 2026-01-21 for v2.2 milestone_
