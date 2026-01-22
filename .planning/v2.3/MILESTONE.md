# v2.3 Tech Debt Cleanup

## Goal
Remove orphaned JS files and unused CSS to reduce bundle size.

## Scope
- Delete orphaned `plugins.js` and `scripts.js` (replaced by custom-* files in Phase 7)
- Extract Swiper CSS from `plugins.css` (only used component)
- Delete `plugins.css` (183KB of mostly unused styles)
- Update build config

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 21 | Delete orphaned JS files | Pending |
| 22 | Extract Swiper CSS & remove plugins.css | Pending |

## Expected Savings
- ~593KB JS (plugins.js + scripts.js)
- ~169KB CSS (plugins.css minus Swiper)
- **Total: ~762KB**

## Success Criteria
- Site functions identically (quote slider, lightbox, portfolio grid, hero slider)
- No 404s in browser console
- Reduced dist/ size

## Analysis Summary
- `plugins.js` / `scripts.js`: 0 references in codebase (only comments mention them)
- `plugins.css`: Contains Swiper (used), SmartMenus/AOS/Plyr/LightGallery/Fotorama/Cocoen (unused)
- Production build copies plugins.css to dist but doesn't load it (bundled CSS used instead)
