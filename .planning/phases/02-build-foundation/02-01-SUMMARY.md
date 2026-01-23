---
phase: 02-build-foundation
plan: 01
subsystem: infra
tags: [vite, postcss, autoprefixer, cssnano, jquery, revolution-slider]

# Dependency graph
requires:
  - phase: 01-quick-fixes
    provides: Working static site with fixed links and consolidated infrastructure
provides:
  - Vite build system with dev/build/preview scripts
  - PostCSS pipeline with autoprefixer and cssnano
  - jQuery and Revolution Slider preserved as external dependencies
  - Static asset copying for production builds
affects: [02-02-html-processing, 03-css-optimization, 04-js-optimization, 05-image-optimization]

# Tech tracking
tech-stack:
  added: [vite@7.3.1, postcss@8.5.6, autoprefixer@10.4.23, cssnano@7.1.2, vite-plugin-static-copy@3.1.5]
  patterns: [ES module config files, content hashing for cache busting, static copy for legacy vendor scripts]

key-files:
  created:
    - package.json
    - vite.config.js
    - postcss.config.js
    - .browserslistrc
  modified:
    - .gitignore

key-decisions:
  - "jQuery/Bootstrap/Popper loaded via script tags, not bundled (preserves plugin compatibility)"
  - "Revolution Slider copied as-is without hashing (complex internal asset references)"
  - "ES module project (type: module) for modern Vite config"
  - "Browser targets: >0.5%, last 2 versions, Firefox ESR, no IE11"

patterns-established:
  - "External vendor scripts: copy to dist unchanged, do not bundle"
  - "Content hashing: applies to custom assets only, not legacy vendor files"
  - "PostCSS pipeline: autoprefixer for prefixes, cssnano for minification"

# Metrics
duration: 4min
completed: 2026-01-20
---

# Phase 2 Plan 01: Vite Setup Summary

**Vite 7.3.1 build system with jQuery/Revolution Slider preserved as external dependencies, PostCSS pipeline for CSS processing**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-20T06:48:00Z
- **Completed:** 2026-01-20T06:52:00Z
- **Tasks:** 3
- **Files created:** 5 (package.json, package-lock.json, vite.config.js, postcss.config.js, .browserslistrc)
- **Files modified:** 1 (.gitignore)

## Accomplishments

- Initialized npm project with Vite 7.3.1 and build scripts (dev/build/preview)
- Configured Vite to preserve jQuery/Bootstrap/Popper as external scripts (not bundled)
- Set up static copy plugin to copy Revolution Slider (11MB) unchanged to dist
- Added PostCSS pipeline with autoprefixer and cssnano for CSS processing
- Configured browser targets to exclude IE11 and target modern browsers

## Task Commits

Each task was committed atomically:

1. **Task 1: Initialize npm project and install Vite dependencies** - `b79f7b4` (chore)
2. **Task 2: Create Vite configuration with jQuery external and Revolution Slider copy** - `67f38cc` (feat)
3. **Task 3: Create PostCSS configuration and browserslist** - `807fb70` (feat)
4. **Bonus: Add dist/ to .gitignore** - `d41ed75` (chore)

## Files Created/Modified

- `package.json` - npm project with Vite build scripts and dependencies
- `package-lock.json` - Locked dependency versions
- `vite.config.js` - Vite configuration with external jQuery, Revolution Slider copy, content hashing
- `postcss.config.js` - PostCSS with autoprefixer and cssnano
- `.browserslistrc` - Browser targets for autoprefixer
- `.gitignore` - Added dist/ to ignore build output

## Decisions Made

1. **Keep jQuery/Bootstrap/Popper external** - These are loaded via script tags in HTML, not bundled. This preserves the exact load order required by Revolution Slider and plugins.js (44K+ lines of jQuery plugins).

2. **Copy Revolution Slider as-is** - The 11MB Revolution Slider directory has complex internal asset references. Bundling or hashing would break these references.

3. **ES module project** - Set `"type": "module"` in package.json for modern Vite configuration files.

4. **Conservative browser targets** - Targeting >0.5% market share, last 2 versions, excluding IE11. This provides broad compatibility while allowing modern CSS features.

5. **Preserve license comments** - cssnano configured with `discardComments: { removeAll: false }` to keep important license comments.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added static copy for additional style assets**
- **Found during:** Task 2 (Vite configuration)
- **Issue:** Plan only specified copying Revolution Slider and vendor JS, but plugins.js, scripts.js, CSS files, and fonts also need to be copied for the site to work
- **Fix:** Added additional static copy targets for style/css, style/style.css, style/type (fonts), and all JS files
- **Files modified:** vite.config.js
- **Verification:** Build completed successfully with all assets in dist/
- **Committed in:** 67f38cc (Task 2 commit)

**2. [Rule 3 - Blocking] Fixed vite.config.js option name**
- **Found during:** Task 2 verification
- **Issue:** Plan specified `emptyDirFirst: true` but correct Vite option is `emptyOutDir: true`
- **Fix:** Used correct option name `emptyOutDir: true`
- **Files modified:** vite.config.js
- **Verification:** Build succeeded without warnings about unrecognized option
- **Committed in:** 67f38cc (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 missing critical, 1 blocking)
**Impact on plan:** Both auto-fixes necessary for correct operation. No scope creep.

## Issues Encountered

- **CSS syntax warnings during build** - esbuild reported `*display:inline` and `*zoom:1` as syntax errors. These are IE6/7 CSS hacks in the Fotorama plugin. They don't affect modern browsers and the warnings can be safely ignored.

- **Unresolved image references** - Build reported some image references in CSS that "didn't resolve at build time." These are relative paths in vendor CSS that will resolve correctly at runtime since the directory structure is preserved.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Build system operational: `npm run dev` starts dev server, `npm run build` produces dist/
- Ready for Phase 02-02: HTML processing to update asset references for hashed filenames
- Ready for Phase 03: CSS optimization (PostCSS pipeline is in place)
- Ready for Phase 04: JS optimization (external scripts preserved, custom JS can be processed)

**Verification:**
```bash
npm run build  # Produces dist/ with all assets
npm run dev    # Starts dev server at http://localhost:3000
```

---
*Phase: 02-build-foundation*
*Plan: 01-vite-setup*
*Completed: 2026-01-20*
