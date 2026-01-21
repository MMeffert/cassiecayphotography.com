# Next Milestone: jQuery Removal & Bootstrap 5 Migration

**Status:** Proposed
**Complexity:** Medium-High (5-7 phases estimated)

## Goal

Remove jQuery dependency entirely by migrating to Bootstrap 5 and replacing all jQuery-dependent plugins with modern vanilla JS alternatives.

## Current jQuery Dependencies

| Plugin | Purpose | Replacement Candidate |
|--------|---------|----------------------|
| jQuery 3.x | Foundation | Remove entirely |
| Bootstrap 4 | UI framework | Bootstrap 5 (no jQuery) |
| Cubeportfolio | Portfolio grid/filtering | Isotope, or CSS grid + vanilla JS |
| SmartMenus | Navigation dropdowns | Bootstrap 5 native, or vanilla JS |
| Headhesive | Sticky header | Vanilla JS (10 lines) |
| scrollUp | Scroll-to-top | Vanilla JS (15 lines) |
| Swiper | Quote slider | Already jQuery-free (keep as-is) |

## Why

- **Maintainability** — jQuery is legacy; fewer dependencies = easier updates
- **Bundle size** — jQuery is ~90KB minified
- **Modern standards** — Bootstrap 5 uses vanilla JS, better accessibility

## To Start

```bash
/clear
/gsd:new-milestone
```

Then describe: "Remove jQuery and migrate to Bootstrap 5 by replacing all jQuery-dependent plugins with modern alternatives"

## Risk Notes

- Cubeportfolio replacement is highest risk (complex filtering + masonry layout)
- Bootstrap 4→5 has breaking CSS changes (check spacing utilities, grid classes)
- Test navigation thoroughly on mobile after SmartMenus replacement
