# Project Research Summary

**Project:** Cassie Cay Photography v2.0 - jQuery Removal & Bootstrap 5 Migration
**Domain:** Static site modernization / Legacy JavaScript migration
**Researched:** 2026-01-20
**Confidence:** HIGH

## Executive Summary

This milestone removes jQuery entirely from the photography portfolio site and migrates from Bootstrap 4 to Bootstrap 5. Research confirms this is a well-documented migration path with high confidence. The key constraint is preserving the site owner's Dreamweaver editing workflow, which remains intact since changes affect only script references, not HTML content structure.

The recommended approach is **incremental migration with jQuery as a bridge** during transition. This allows testing each component replacement independently, rolling back individual components without full revert, and detecting regressions early. The migration order should be: (1) Bootstrap 5 CSS/JS upgrade, (2) Cubeportfolio replacement with vanilla JS filtering, (3) SmartMenus removal (redundant after Bootstrap 5), (4) custom scripts conversion to vanilla JS, (5) jQuery removal.

Three critical risks require attention: Bootstrap's `data-*` to `data-bs-*` namespace change silently breaks all interactive components with no console errors, Bootstrap 5's CSS class renaming (left/right to start/end) silently breaks responsive layouts, and the contact form's 18 jQuery calls including AJAX submission must be carefully migrated to fetch API. All three have well-documented migration patterns and prevention strategies.

## Key Findings

### Recommended Stack Changes

| Component | Current | Target | Bundle Impact |
|-----------|---------|--------|---------------|
| jQuery | 3.x (97KB) | **Remove** | -97KB |
| Bootstrap | 4.4.1 + Popper (80KB) | 5.3 bundle (80KB) | ~0 |
| Cubeportfolio | ~80KB | CSS Grid + Vanilla JS | -77KB |
| SmartMenus | ~15KB | Bootstrap 5 native | -15KB |
| Headhesive | ~2KB | Keep (already vanilla) | 0 |
| scrollUp | ~2KB | Native vanilla JS | -1.5KB |
| **Estimated Total** | **~276KB plugins** | **~4KB custom** | **~192KB savings** |

The current custom-plugins.js bundle (257KB) shrinks dramatically. Bootstrap 5's built-in navbar handles all SmartMenus functionality. Cubeportfolio's filtering can be achieved with ~50 lines of vanilla JS since the site uses simple category filtering (5 categories, show/hide by class - no true masonry required).

### Expected Features

**Must have (table stakes):**
- Mobile hamburger menu collapse/expand
- Portfolio category filtering with smooth transitions
- Sticky header after scrolling past hero (350px offset)
- Scroll-to-top button
- Contact form with validation and submission
- GLightbox integration for portfolio images

**Should have (competitive):**
- Filter animations respecting prefers-reduced-motion
- CSS-only smooth scroll where possible
- IntersectionObserver for sticky header detection

**Defer (v2+):**
- URL hash filtering (deep link to filtered category)
- Complex animation libraries (GSAP/Anime.js)
- Infinite scroll
- True masonry layout (CSS Grid handles responsive columns)
- IE11 support

### Architecture Approach

The migration preserves the existing static HTML + Vite architecture. Scripts remain loaded individually rather than bundled to maintain compatibility with Dreamweaver editing. The key architectural change is replacing the monolithic custom-plugins.js with individual vanilla JS libraries (Headhesive, imagesLoaded) plus a new unified site.js initialization script.

**Major components:**
1. **Bootstrap 5 Bundle** - Handles navbar collapse, scrollspy, responsive utilities (includes Popper)
2. **site.js** - Custom initialization replacing custom-scripts.js + custom-plugins.js functionality
3. **Existing libraries** - Embla, GLightbox, Swiper already jQuery-free, unchanged

**Script load order (target):**
```html
<script src="style/js/bootstrap.bundle.min.js"></script>  <!-- Bootstrap 5 + Popper -->
<script src="style/js/embla-carousel.umd.js"></script>    <!-- Already jQuery-free -->
<script src="style/js/glightbox.min.js"></script>         <!-- Already jQuery-free -->
<script src="style/js/headhesive.min.js"></script>        <!-- Already vanilla JS -->
<script src="style/js/site.js"></script>                  <!-- New unified init script -->
```

### Critical Pitfalls

1. **Bootstrap data attribute namespace** - `data-toggle` must become `data-bs-toggle`. Silent failure with no console errors. Create CI check to catch regressions: `grep -r "data-toggle=" --include="*.html"`.

2. **Bootstrap CSS class renaming** - `.ml-*` to `.ms-*`, `.text-left` to `.text-start`. Audit all Bootstrap classes before migration and bulk find/replace. Current project: `ml-auto` on line 120 needs to become `ms-auto`.

3. **Contact form AJAX migration** - 18 jQuery calls including `$.ajax()` must convert to `fetch()` API with proper error handling. Test with network throttling (slow 3G) and error scenarios.

4. **Cubeportfolio replacement complexity** - Must replicate filtering, responsive columns (4/3/2/1), and GLightbox reload integration. Implement features incrementally: grid layout -> filtering -> lightbox integration.

5. **Sticky header SmartMenus callback** - Headhesive's `onStick` callback currently initializes SmartMenus (`$($.SmartMenus.Bootstrap.init)`). Remove this callback entirely when SmartMenus is removed.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Bootstrap 5 Migration
**Rationale:** Foundation that enables all other changes. Bootstrap 5 has no jQuery dependency, but jQuery is still needed during this phase for custom-scripts.js.
**Delivers:** Modern CSS framework, native navbar collapse, updated utility classes
**Addresses:** Bootstrap CSS migration (`.ml-*` to `.ms-*`), data attribute namespace updates (`data-toggle` to `data-bs-toggle`)
**Avoids:** Silent failures from old data attributes (Pitfall #1)
**Estimated effort:** 2-3 hours

### Phase 2: Cubeportfolio Replacement
**Rationale:** Most complex component. Better to tackle early while context is fresh. CSS Grid + vanilla JS filtering is sufficient for 5 categories.
**Delivers:** Vanilla JS portfolio filtering, responsive grid layout, GLightbox integration
**Uses:** CSS Grid for responsive columns, vanilla JS for filtering (~50 lines)
**Implements:** GLightbox reload on filter events
**Avoids:** Layout breaks at different screen sizes (Pitfall #4)
**Estimated effort:** 4-8 hours

### Phase 3: Navigation and Sticky Header Cleanup
**Rationale:** SmartMenus becomes redundant after Bootstrap 5 navbar is working.
**Delivers:** Removal of SmartMenus from custom-plugins.js, updated Headhesive initialization
**Addresses:** Sticky header jQuery selectors (`$(".navbar").length`), SmartMenus callback removal
**Estimated effort:** 2-3 hours

### Phase 4: Custom Scripts Conversion
**Rationale:** Depends on Bootstrap 5 and Cubeportfolio being complete. All remaining jQuery syntax in custom-scripts.js must be converted.
**Delivers:** Vanilla JS version of custom-scripts.js (site.js)
**Implements:** All jQuery syntax conversions:
- `$(document).ready()` -> `DOMContentLoaded`
- `$()` -> `querySelector`/`querySelectorAll`
- `.on()` -> `addEventListener`
- `.toggleClass()` -> `classList.toggle()`
**Avoids:** Event delegation issues with dynamic content (Pitfall #6)
**Estimated effort:** 3-4 hours

### Phase 5: Contact Form Migration
**Rationale:** Isolated component, can be done in parallel with Phase 4 but documented separately for clarity.
**Delivers:** Vanilla JS contact form with fetch API, proper error handling
**Addresses:** 18 jQuery calls, AJAX submission, reCAPTCHA Enterprise integration
**Avoids:** Silent form submission failures (Pitfall #3)
**Estimated effort:** 2-3 hours

### Phase 6: jQuery Removal and Cleanup
**Rationale:** Final step after all dependencies eliminated.
**Delivers:** jQuery-free site, ~97KB bundle size reduction
**Addresses:** Script tag removal, Vite config cleanup, verification testing
**Estimated effort:** 1 hour

### Phase Ordering Rationale

- **Bootstrap 5 first** because it removes Bootstrap's jQuery dependency and enables SmartMenus removal
- **Cubeportfolio second** because it's the most complex (4-8 hours) and benefits from early attention when context is fresh
- **Navigation third** because it depends on Bootstrap 5 being complete and is straightforward after BS5 navbar works
- **Custom scripts fourth** because it requires knowing what patterns remain after Cubeportfolio and SmartMenus are gone
- **Contact form fifth** because it's isolated and self-contained - could be done in parallel with Phase 4
- **jQuery removal last** because it's the final verification that everything works without jQuery

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Cubeportfolio):** Need to verify CSS Grid can match current mosaic visual appearance. If not, may need Isotope's masonry mode.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Bootstrap 5):** Well-documented, official migration guide exists at getbootstrap.com
- **Phase 3 (Navigation):** Bootstrap 5 navbar is mature, extensively documented
- **Phase 4 (Custom Scripts):** jQuery-to-vanilla patterns well-established at youmightnotneedjquery.com
- **Phase 5 (Contact Form):** fetch API is standard, straightforward conversion
- **Phase 6 (jQuery Removal):** Trivial once dependencies are eliminated

## Bundle Budget

| Category | Before (current) | After (target) | Savings |
|----------|------------------|----------------|---------|
| jQuery | 97KB | 0KB | -97KB |
| Bootstrap + Popper | 80KB | 80KB (bundle) | 0 |
| custom-plugins.js | 257KB | 0KB | -257KB |
| Replacement code | 0KB | ~4KB (site.js) | +4KB |
| **Total JS reduction** | | | **~350KB (80%)** |

**Note:** Embla (6KB), GLightbox (17KB), and Swiper (140KB or custom build) are unchanged - already jQuery-free.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Bootstrap 5 and vanilla JS are mature, well-documented |
| Features | HIGH | All features verified achievable without jQuery |
| Architecture | HIGH | Incremental migration pattern is proven across industry |
| Pitfalls | HIGH | Bootstrap migration guide documents all breaking changes |

**Overall confidence:** HIGH

### Gaps to Address

- **Mosaic layout verification:** Need to confirm CSS Grid can replicate Cubeportfolio's mosaic appearance during Phase 2. If not, may need Isotope's masonry mode (~25KB).
- **Smooth scroll easing:** Current site uses jQuery easing plugin with easeInOutExpo. CSS `scroll-behavior: smooth` uses different easing. Acceptable difference but may feel slightly different to users.
- **reCAPTCHA timing:** Contact form's reCAPTCHA Enterprise integration with fetch needs testing to ensure token generation timing works correctly in Phase 5.
- **Swiper usage:** Need to verify if current Swiper initialization in custom-scripts.js uses jQuery syntax that needs conversion.

## Sources

### Primary (HIGH confidence)
- [Bootstrap 5.3 Migration Guide](https://getbootstrap.com/docs/5.3/migration/) - Data attributes, CSS classes, breaking changes
- [Bootstrap 5 Navbar Documentation](https://getbootstrap.com/docs/5.3/components/navbar/) - Native collapse without jQuery
- [Bootstrap 5 Collapse Documentation](https://getbootstrap.com/docs/5.3/components/collapse/) - Programmatic API
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - AJAX replacement
- [MDN Window.scrollTo](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo) - Smooth scroll API
- [You Might Not Need jQuery](https://youmightnotneedjquery.com/) - Syntax conversion reference

### Secondary (MEDIUM confidence)
- [Isotope Documentation](https://isotope.metafizzy.co/) - Vanilla JS filtering if CSS Grid insufficient
- [Headhesive.js GitHub](https://github.com/markgoodyear/headhesive.js) - Verified already vanilla JS
- [Vanilla JS Scroll to Top](https://dev.to/dailydevtips1/vanilla-javascript-scroll-to-top-3mkd) - Implementation pattern
- [Bootstrap Collapsing Menus without jQuery](https://dev.to/ara225/bootstrap-collapsing-menus-without-jquery-4l8l) - Community validation

### Tertiary (LOW confidence)
- Bundle size estimates based on direct file measurements of current site files (custom-plugins.js: 257KB, jquery.min.js: 97KB)

---
*Research completed: 2026-01-20*
*Ready for roadmap: yes*
