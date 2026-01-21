# Requirements: v2.2 Mobile Navigation

**Defined:** 2026-01-21
**Core Value:** The site must remain fast, secure, and easy for Cassie to update.

## Overview

Modernize the mobile navigation by replacing Bootstrap 5's navbar collapse with an offcanvas component. The menu will slide in from the left side, providing a more native mobile UX while maintaining compatibility with the existing sticky header.

---

## Mobile Navigation

- [ ] **NAV-01**: Replace navbar collapse with offcanvas component (slide from left)
- [ ] **NAV-02**: Hamburger icon opens offcanvas menu on mobile
- [ ] **NAV-03**: Close button and backdrop dismiss menu
- [ ] **NAV-04**: Navigation links close menu after click
- [ ] **NAV-05**: Menu works correctly with existing sticky header
- [ ] **NAV-06**: Smooth animation transitions

---

## Success Criteria

1. On mobile viewport, hamburger icon opens slide-in menu from left
2. Tapping outside menu (backdrop) closes it
3. Clicking a nav link navigates and closes menu
4. Sticky header behavior unchanged
5. No visual glitches during transitions
6. Desktop navigation unchanged

## Out of Scope

| Feature | Reason |
|---------|--------|
| Nested submenus | Current nav has flat structure, not needed |
| Custom animations | Bootstrap defaults are polished enough |
| Breakpoint changes | Keep existing responsive breakpoints |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01 | TBD | Pending |
| NAV-02 | TBD | Pending |
| NAV-03 | TBD | Pending |
| NAV-04 | TBD | Pending |
| NAV-05 | TBD | Pending |
| NAV-06 | TBD | Pending |

**Coverage:**
- v2.2 requirements: 6 total
- Mapped to phases: 0 (awaiting roadmap)
- Unmapped: 6

---
*Requirements defined: 2026-01-21*
