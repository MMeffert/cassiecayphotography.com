# Phase 7: JavaScript Cleanup - Research

**Researched:** 2026-01-20
**Domain:** JavaScript bundle optimization, unused code removal
**Confidence:** HIGH

## Summary

This phase focuses on reducing JavaScript bundle size by removing unused code from `plugins.js` and `scripts.js`. The current setup uses a monolithic plugins file (547KB) containing 31 jQuery plugins, but the site only uses approximately 8-10 of them. The `scripts.js` file (61KB) contains initialization code for 17 different Revolution Slider configurations, but only one (`#slider`) is actually used.

The primary optimization opportunity is creating a custom plugins file containing only the plugins actually used by the site, and trimming the scripts.js initialization code to only what's needed. Tree-shaking is not viable because these are jQuery plugins using IIFE/CommonJS patterns, not ES modules.

**Primary recommendation:** Manually extract only the used plugins from plugins.js and remove unused slider initializations from scripts.js. Expected reduction: 50-70% of custom JS files.

## Current State Analysis

### JavaScript Files in Project

| File | Size | Lines | Purpose |
|------|------|-------|---------|
| jquery.min.js | 97KB | - | jQuery 3.x (external, keep) |
| bootstrap.min.js | 60KB | - | Bootstrap 4 (external, keep) |
| popper.min.js | 19KB | - | Bootstrap dependency (external, keep) |
| plugins.js | 547KB | 375 | 31 bundled plugins (optimize) |
| scripts.js | 61KB | 1803 | Site initialization (optimize) |
| **Total** | **784KB** | - | |

### Plugins in plugins.js (31 total)

**Table of Contents from file:**
1. SMARTMENUS
2. STICKY HEADER (Headhesive)
3. HAMBURGER MENU ICON
4. PICTUREFILL RETINA IMAGE
5. AOS (Animate on Scroll)
6. PLYR (Video Player)
7. WAYPOINTS
8. COUNTER UP
9. PROGRESSBAR
10. COUNTDOWN
11. PRETTIFY (Code Highlighting)
12. VIDEO WRAPPER
13. GO TO TOP (scrollUp)
14. LIGHTGALLERY
15. MOUSEWHEEL
16. LAZY LOAD GOOGLE MAPS
17. VANILLA (Form Validation)
18. CUBE PORTFOLIO
19. ISOTOPE
20. IMAGESLOADED
21. SWIPER
22. (22 missing in TOC)
23. FLICKR FEED
24. TYPER
25. COCOEN (Before/After Comparison)
26. SLIDE PORTFOLIO
27. EASING (jQuery Easing)
28. BACKSTRETCH
29. ISCROLL
30. FOOTER REVEAL
31. COLLAGEPLUS

### Features Actually Used in index.html

Based on class/id analysis of index.html:

| Feature | HTML Elements | Plugin Required |
|---------|---------------|-----------------|
| Navbar/Menu | `.navbar`, `.hamburger.animate` | SmartMenus, Headhesive |
| Revolution Slider | `#slider.rev_slider` | (Revolution Slider - separate) |
| Portfolio Grid | `#cube-grid-mosaic.cbp` | Cube Portfolio |
| Lightbox Gallery | `.light-gallery` | lightGallery, mousewheel |
| Quote Slider | `.basic-slider`, `.swiper-container` | Swiper |
| Background Images | `.bg-image` | (Native CSS, no plugin) |
| Scroll Navigation | `.scroll` | jQuery Easing |
| One-page Layout | `.onepage` | (Native Bootstrap) |

### Features NOT Used (can be removed)

| Plugin | Evidence | Safe to Remove |
|--------|----------|----------------|
| AOS | No `data-aos` attributes | YES |
| Plyr | No `.js-player` elements | YES |
| Progressbar | No `.progressbar` elements | YES |
| Countdown | No `.countdown` elements | YES |
| Counter Up | No `.counter` elements | YES |
| Prettify | No code blocks | YES |
| Video Wrapper | No `video-wrapper` elements | YES |
| Lazy Load Google Maps | No Google Maps | YES |
| Vanilla Form | No `form.vanilla-form` (comment only, not class) | YES |
| Isotope | No `.grid .isotope` elements | YES |
| jFlickrFeed | No `#flickrfeed` elements | YES |
| Typer | No typer usage | YES |
| Cocoen | No `.cocoen` elements | YES |
| Slide Portfolio | Not used | YES |
| Backstretch | No backstretch usage | YES |
| iScroll | No iScroll usage | YES |
| Footer Reveal | No `.footer-reveal` elements | YES |
| CollagePlus | No `#collage-large/medium` elements | YES |
| Picturefill | Browser support good, native `<picture>` used | YES |

### scripts.js Analysis

**Used Initializations:**
- Sticky Header (Headhesive) - line 6-23 - USED (`.navbar` exists)
- Hamburger Menu - line 27-33 - USED (`.hamburger.animate` exists)
- Basic Slider (Swiper) - line 37-57 - USED (`.basic-slider` exists)
- Revolution Slider `#slider` - line 387-423 - USED
- Overlay Hover - line 1207 - USED (`.overlay > a`)
- lightGallery - line 1308-1323 - USED (`.light-gallery` exists)
- Cube Portfolio Mosaic - line 1502-1545 - USED (`#cube-grid-mosaic` exists)
- Background Image - line 1672-1675 - USED (`.bg-image` exists)
- scrollUp - line 1679-1705 - USED (Go to Top button)
- Parallax Mobile - line 1709-1711 - USED (responsive)
- One-page Header Offset - line 1740-1751 - USED (`.onepage` exists)
- One-page Nav Links - line 1755-1758 - USED
- Smooth Scroll - line 1762-1785 - USED

**UNUSED Initializations (can remove):**
- 12 Swiper configurations (swiper-col3, swiper-col4, etc.) - lines 58-339
- Revolution Slider `#slider-carousel` - line 343-386
- Revolution Slider `#slider2` through `#slider17` - lines 424-1148
- jFlickrFeed (4 configurations) - lines 1152-1203
- Countdown - line 1211
- Counter Up - lines 1215-1218
- AOS - lines 1222-1226
- Cocoen - line 1230
- Plyr - line 1234
- Progressbar - lines 1238-1287
- Video Wrapper - lines 1291-1297
- Tooltip/Popover - lines 1301-1304
- Cube Grid (7 unused configurations) - lines 1327-1501, 1546-1632
- Isotope - lines 1637-1663
- Prettify - line 1667
- CollagePlus - lines 1715-1736
- Footer Reveal - lines 1789-1793
- Page Loading - lines 1797-1798
- VanillaForm - lines 1802-1803

## Standard Stack

### Core (Keep External)
| Library | Version | Purpose | Why Keep |
|---------|---------|---------|----------|
| jQuery | 3.x | DOM manipulation | Required by all plugins |
| Bootstrap | 4.x | CSS framework | Layout, responsive |
| Popper.js | 1.x | Bootstrap dependency | Dropdowns, tooltips |

### Required Plugins (Extract to custom bundle)
| Library | Approx Size | Purpose | Why Required |
|---------|-------------|---------|--------------|
| SmartMenus | ~15KB | Navbar dropdown | Navigation works |
| Headhesive | ~3KB | Sticky header | Fixed nav on scroll |
| Swiper | ~100KB | Quote slider | `.basic-slider` section |
| lightGallery | ~40KB | Image lightbox | Portfolio zoom |
| Cube Portfolio | ~50KB | Portfolio grid | Filter/layout |
| imagesLoaded | ~5KB | Image load detection | Cube Portfolio dependency |
| scrollUp | ~3KB | Back to top button | UX feature |
| jQuery Easing | ~5KB | Smooth scroll easing | Scroll animations |
| Mousewheel | ~2KB | lightGallery dependency | Gallery navigation |

**Estimated optimized plugins.js: ~220KB (60% reduction)**

### Not Required (Remove)
| Library | Size Est | Reason |
|---------|----------|--------|
| AOS | ~15KB | No `data-aos` attributes used |
| Plyr | ~30KB | No video players |
| Progressbar | ~10KB | No progress bars |
| Countdown | ~8KB | No countdowns |
| Counter Up | ~5KB | No counters |
| Prettify | ~15KB | No code blocks |
| Video Wrapper | ~5KB | No video backgrounds |
| Lazy Maps | ~3KB | No Google Maps |
| Vanilla | ~10KB | Form uses custom inline JS |
| Isotope | ~40KB | Not used, Cube Portfolio handles grid |
| jFlickrFeed | ~5KB | No Flickr integration |
| Typer | ~8KB | No typing effects |
| Cocoen | ~10KB | No before/after comparisons |
| Slide Portfolio | ~15KB | Not used |
| Backstretch | ~10KB | Not used |
| iScroll | ~25KB | Not used |
| Footer Reveal | ~5KB | No footer reveal |
| CollagePlus | ~10KB | No collage layouts |
| Picturefill | ~8KB | Native `<picture>` has support |

## Architecture Patterns

### Recommended Approach: Manual Extraction

Since these are jQuery plugins (IIFE/CommonJS), tree-shaking won't work. The approach is:

1. **Create custom-plugins.js** - Extract only required plugins
2. **Create custom-scripts.js** - Remove unused initializations
3. **Preserve load order** - jQuery -> Bootstrap dependencies -> Plugins -> Scripts

### Project Structure After Cleanup
```
style/js/
├── jquery.min.js        # External - unchanged
├── popper.min.js        # External - unchanged
├── bootstrap.min.js     # External - unchanged
├── plugins.js           # REPLACE with custom-plugins.js
└── scripts.js           # REPLACE with custom-scripts.js
```

### Pattern: Safe Plugin Extraction

```javascript
// Extract each plugin as a complete unit
// Look for these markers in plugins.js:

/*-----------------------------------------------------------------------------------*/
/*	NN. PLUGIN NAME
/*-----------------------------------------------------------------------------------*/
// ... plugin code ...
// (ends at next marker or EOF)
```

### Pattern: Conditional Initialization

Keep the conditional checks in scripts.js:
```javascript
// Good - only runs if element exists
if ($(".navbar").length) {
    var banner = new Headhesive('.navbar', options);
}

// Already safe - jQuery .each() on empty set does nothing
$(".basic-slider").each(function(index, element) {
    // ...
});
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JS dead code detection | Custom analysis | Manual + grep/inspection | jQuery plugins aren't tree-shakable |
| Plugin splitting | Dynamic imports | Static extraction | jQuery plugins are IIFE, not ESM |
| Load order management | Defer/async | Script tag order | jQuery dependencies are synchronous |

**Key insight:** These are legacy jQuery plugins that must be manually curated. Modern bundler optimizations (tree-shaking, code splitting) don't apply to this codebase.

## Common Pitfalls

### Pitfall 1: Removing Plugin Dependencies
**What goes wrong:** Remove a plugin that another plugin depends on
**Why it happens:** Hidden dependencies (e.g., imagesLoaded is needed by Cube Portfolio)
**How to avoid:** Test each removal individually, check browser console for errors
**Warning signs:** "undefined is not a function" errors

### Pitfall 2: Breaking Load Order
**What goes wrong:** Plugins loaded before jQuery
**Why it happens:** Moving script tags or changing import order
**How to avoid:** Keep strict order: jQuery -> Popper -> Bootstrap -> Plugins -> Scripts
**Warning signs:** "$ is not defined" errors

### Pitfall 3: Removing Used Selectors
**What goes wrong:** Remove initialization for element that exists
**Why it happens:** Selector is used but not obvious (e.g., dynamic elements)
**How to avoid:** Search both HTML and CSS for selectors before removing
**Warning signs:** Elements don't animate, galleries don't open

### Pitfall 4: Breaking Revolution Slider
**What goes wrong:** Accidentally modify Revolution Slider scripts
**Why it happens:** Revolution Slider is complex, has many dependencies
**How to avoid:** Revolution Slider is in separate directory - DO NOT TOUCH in Phase 7
**Warning signs:** Slider doesn't initialize, images don't load

## Code Examples

### Extracting SmartMenus Plugin
```javascript
// Source: plugins.js line 38-45
// Extract complete block including the Bootstrap addon

/*! SmartMenus jQuery Plugin - v1.1.0 ... */
(function(t){"function"==typeof define&&define.amd?...})(jQuery)

/*! SmartMenus jQuery Plugin Bootstrap 4 Addon - v0.1.0 ... */
(function(t){"function"==typeof define&&define.amd?...})(jQuery)

// SmartMenus mod - hide the menus on document click...
$.SmartMenus.prototype._docClick=...
```

### Trimmed scripts.js Structure
```javascript
$(document).ready(function() {
    'use strict';

    // STICKY HEADER - keep
    if ($(".navbar").length) { ... }

    // HAMBURGER MENU - keep
    $(".hamburger.animate").on("click", ...);

    // SWIPER basic-slider only - keep
    $(".basic-slider").each(function(index, element) { ... });

    // REVOLUTION SLIDER #slider only - keep
    $('#slider').revolution({ ... });

    // IMAGE ICON HOVER - keep
    $('.overlay > a, .overlay > span').prepend(...);

    // LIGHTGALLERY - keep
    var $lg = $('.light-gallery');
    $lg.lightGallery({ ... });

    // CUBE PORTFOLIO mosaic only - keep
    var $cubemosaic = $('#cube-grid-mosaic');
    $cubemosaic.cubeportfolio({ ... });

    // BACKGROUND IMAGE - keep
    $(".bg-image").css('background-image', ...);

    // GO TO TOP - keep
    $.scrollUp({ ... });

    // PARALLAX MOBILE - keep
    if (navigator.userAgent.match(/Android/i) ...) { ... }

    // ONEPAGE HEADER OFFSET - keep
    var header_height = ...;

    // ONEPAGE NAV LINKS - keep
    var empty_a = ...;

    // SMOOTH SCROLL - keep
    $(function() { ... });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Monolithic plugin files | Modular ES imports | 2018+ | Tree-shakable bundles |
| jQuery plugins | Vanilla JS / React | 2016+ | Smaller bundles |
| Manual concatenation | Bundler (Vite/Webpack) | 2015+ | Automatic optimization |

**This project context:**
The site uses jQuery + legacy plugins, which is appropriate for:
- Simple static sites
- Non-technical maintainers (Dreamweaver workflow)
- Existing template code

The optimization here is manual curation, not modernization.

## Estimated Impact

### Before Optimization
| File | Size | Gzipped |
|------|------|---------|
| plugins.js | 547KB | ~95KB |
| scripts.js | 61KB | ~15KB |
| **Total Custom JS** | **608KB** | **~110KB** |

### After Optimization (Estimated)
| File | Size | Gzipped | Reduction |
|------|------|---------|-----------|
| custom-plugins.js | ~220KB | ~40KB | 60% |
| custom-scripts.js | ~25KB | ~6KB | 60% |
| **Total Custom JS** | **~245KB** | **~46KB** | **60%** |

**Note:** jQuery (97KB), Bootstrap (60KB), and Popper (19KB) remain unchanged as they are external dependencies.

## Open Questions

1. **Swiper version verification**
   - What we know: plugins.js contains Swiper 5.3.6
   - What's unclear: Is this the exact version needed, or can it be updated?
   - Recommendation: Keep current version to avoid breaking changes

2. **lightGallery dependencies**
   - What we know: Uses mousewheel plugin
   - What's unclear: Are there other hidden dependencies?
   - Recommendation: Test thoroughly after extraction

## Sources

### Primary (HIGH confidence)
- Local file analysis: `style/js/plugins.js` (547KB, 31 plugins listed)
- Local file analysis: `style/js/scripts.js` (61KB, 1803 lines)
- Local file analysis: `index.html` (class/id usage)

### Secondary (MEDIUM confidence)
- [Vite tree shaking discussion](https://github.com/vitejs/vite/discussions/13171)
- [8 Ways to Optimize JavaScript Bundle Size](https://about.codecov.io/blog/8-ways-to-optimize-your-javascript-bundle-size/)
- [KeyCDN Tree Shaking Guide](https://www.keycdn.com/blog/tree-shaking)
- [web.dev Remove unused code](https://web.dev/codelab-remove-unused-code/)
- [lightGallery documentation](https://www.lightgalleryjs.com/)

### Tertiary (LOW confidence)
- WebSearch general patterns for jQuery plugin optimization

## Metadata

**Confidence breakdown:**
- Current state analysis: HIGH - direct file inspection
- Used vs unused mapping: HIGH - HTML/JS correlation verified
- Size estimates: MEDIUM - based on typical plugin sizes
- Optimization approach: HIGH - standard practice for legacy jQuery

**Research date:** 2026-01-20
**Valid until:** 90 days (stable, legacy code)
