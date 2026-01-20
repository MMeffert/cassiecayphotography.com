---
phase: 08-library-modernization
plan: 02
subsystem: ui
tags: [embla-carousel, slider, hero, performance, javascript]

# Dependency graph
requires:
  - phase: 08-01
    provides: GLightbox replaces LightGallery, Vite config patterns
  - phase: 07
    provides: Custom JS structure (custom-scripts.js)
provides:
  - Embla Carousel hero slider replacing Revolution Slider
  - ~400KB JavaScript reduction (420KB Revolution vs 20KB Embla)
  - BUG-03 fix (slider no longer pauses on hover)
  - Static text overlay matching original design
affects: [deploy, performance-monitoring]

# Tech tracking
tech-stack:
  added: [embla-carousel@8.6.0, embla-carousel-autoplay@8.6.0]
  patterns: [umd-vendor-scripts, css-fade-transitions]

key-files:
  created:
    - style/css/hero-slider.css
    - style/js/embla-carousel.umd.js
    - style/js/embla-carousel-autoplay.umd.js
  modified:
    - index.html
    - style/js/custom-scripts.js
    - vite.config.js
    - package.json

key-decisions:
  - "Embla loaded as UMD scripts like other vendors"
  - "Static text overlay instead of animated (simpler, still effective)"
  - "stopOnMouseEnter: false to fix BUG-03"
  - "CSS-based fade effect via is-selected class toggle"

patterns-established:
  - "Lightweight carousel replacement pattern"

# Metrics
duration: 3min
completed: 2026-01-20
---

# Phase 08 Plan 02: Embla Carousel Migration Summary

**Replaced 420KB Revolution Slider with 20KB Embla Carousel for hero slider with fade transitions, autoplay, and BUG-03 fix**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-20T23:04:00Z
- **Completed:** 2026-01-20T23:07:00Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- Replaced Revolution Slider (420KB) with Embla Carousel (20KB) - 95% JS reduction for hero slider
- Fixed BUG-03: Slider no longer pauses on hover (stopOnMouseEnter: false)
- Implemented smooth CSS fade transitions between slides
- Static text overlay preserves original design intent

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Embla Carousel and create slider CSS** - `2bf9d87` (feat)
2. **Task 2: Replace Revolution Slider HTML with Embla structure** - `64c3599` (feat)
3. **Task 3: Add Embla initialization and remove Revolution scripts** - `7c2c9a5` (feat)

## Files Created/Modified

- `style/css/hero-slider.css` - Fullscreen fade slider styles with responsive text overlay
- `style/js/embla-carousel.umd.js` - Embla Carousel UMD bundle (18KB)
- `style/js/embla-carousel-autoplay.umd.js` - Autoplay plugin (2.4KB)
- `index.html` - New Embla HTML structure, removed Revolution CSS/JS links (18 script/link tags removed)
- `style/js/custom-scripts.js` - Embla initialization with autoplay and fade effect
- `vite.config.js` - Updated externals and static copy for Embla, removed Revolution references
- `package.json` - Added embla-carousel and embla-carousel-autoplay dependencies

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Embla as UMD scripts | Consistent with vendor script pattern, easier updates |
| Static text overlay | Original animated text was overly complex; static achieves same visual effect |
| CSS fade via class toggle | Embla handles scroll, custom CSS handles visual fade transition |
| 6 second autoplay delay | Matches original Revolution Slider timing |

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed successfully.

## Next Phase Readiness

- Phase 8 Library Modernization complete
- All optional modernization goals achieved:
  - GLightbox replaces LightGallery (plan 01)
  - Embla replaces Revolution Slider (plan 02)
- Total JavaScript reduction from library modernization: ~530KB
  - LightGallery (93KB) -> GLightbox (44KB): 49KB saved
  - Revolution Slider (420KB) -> Embla (20KB): 400KB saved
- Ready for Phase 9 (final polish) or deployment

---
*Phase: 08-library-modernization*
*Completed: 2026-01-20*
