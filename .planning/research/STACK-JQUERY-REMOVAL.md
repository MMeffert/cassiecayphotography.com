# Stack Research: jQuery Removal & Bootstrap 5 Migration

**Project:** Cassie Cay Photography
**Researched:** 2026-01-20
**Overall Confidence:** HIGH

## Executive Summary

This migration removes jQuery 3.x and Bootstrap 4.4.1 in favor of Bootstrap 5.3.8 (vanilla JavaScript) and replaces all jQuery-dependent plugins with modern vanilla JS alternatives. The existing Vite 7.x build system requires minimal changes. The most complex replacement is Cubeportfolio (portfolio grid/filtering) which needs MixItUp 3.3.2 - now Apache 2.0 licensed and fully open source. All other replacements are either built into Bootstrap 5 (collapse, dropdowns) or achievable with custom vanilla JS (approximately 50 lines each).

## Recommended Stack Changes

### Remove

| Library | Current Version | Reason for Removal |
|---------|-----------------|-------------------|
| jQuery | 3.x (~97KB) | Bootstrap 5 removes jQuery dependency; all plugins can be replaced with vanilla JS |
| Popper.js v1 | 1.x (~19KB) | Bootstrap 5 bundles @popperjs/core v2 internally |
| SmartMenus jQuery | 1.1.0 | Bootstrap 5 native navbar handles dropdowns; site uses simple single-level nav |
| Headhesive.js | 1.x | CSS \`position: sticky\` + IntersectionObserver (~30 lines of vanilla JS) |
| scrollUp | 2.x | Native \`scrollTo()\` + IntersectionObserver (~20 lines of vanilla JS) |
| Cubeportfolio | 4.x (~547KB in plugins.js) | jQuery plugin; replace with MixItUp 3 |
| jQuery Easing | 1.x | CSS transitions or Web Animations API handle easing |

### Update

| Library | From | To | Breaking Changes |
|---------|------|-----|-----------------|
| Bootstrap CSS | 4.4.1 | 5.3.8 | See Bootstrap 5 Migration Guide section below |
| Bootstrap JS | 4.4.1 | 5.3.8 | Vanilla JS API, namespaced data-bs-* attributes |
| Swiper | Bundled in plugins.js | 12.0.3 (npm) | Already jQuery-free; extract to npm dependency |

### Add

| Library | Version | Purpose | Bundle Size | License |
|---------|---------|---------|-------------|---------|
| bootstrap | 5.3.8 | UI framework (CSS + vanilla JS) | ~25KB gzipped (JS), ~23KB gzipped (CSS) | MIT |
| @popperjs/core | 2.x | Dropdown/tooltip positioning (Bootstrap peer dep) | ~7KB gzipped | MIT |
| mixitup | 3.3.2 | Portfolio grid filtering with animations | ~29KB minified | Apache 2.0 |
| swiper | 12.0.3 | Quote testimonial slider | Tree-shakeable; core ~15KB gzipped | MIT |

## Bootstrap 5 Migration Guide

### Critical Breaking Changes from Bootstrap 4.4.1

**1. jQuery Removal**
- All JavaScript plugins rewritten in vanilla JS
- No \`$().modal()\` or similar jQuery methods
- Use: \`new bootstrap.Modal(element)\` or data attributes

**2. Data Attributes Namespaced**
All data attributes must change from \`data-*\` to \`data-bs-*\`:

\`\`\`html
<!-- Before (Bootstrap 4) -->
<button data-toggle="collapse" data-target="#menu">

<!-- After (Bootstrap 5) -->
<button data-bs-toggle="collapse" data-bs-target="#menu">
\`\`\`

**3. Class Name Changes**

| Bootstrap 4 | Bootstrap 5 | Notes |
|-------------|-------------|-------|
| \`.ml-*\` / \`.mr-*\` | \`.ms-*\` / \`.me-*\` | Logical properties (start/end) |
| \`.pl-*\` / \`.pr-*\` | \`.ps-*\` / \`.pe-*\` | Logical properties |
| \`.text-left\` / \`.text-right\` | \`.text-start\` / \`.text-end\` | RTL support |
| \`.float-left\` / \`.float-right\` | \`.float-start\` / \`.float-end\` | RTL support |
| \`.close\` | \`.btn-close\` | Close button component |
| \`.sr-only\` | \`.visually-hidden\` | Screen reader utility |
| \`.font-weight-*\` | \`.fw-*\` | Shortened utility |
| \`.font-italic\` | \`.fst-italic\` | Font style |
| \`.no-gutters\` | \`.g-0\` | Gutter utility |

**4. Dropped Components**
- Jumbotron (use utilities)
- Media object (use flex utilities)
- \`.card-deck\` (use grid)

**5. Form Changes**
- \`.custom-control\` classes replaced with \`.form-check\`
- \`.custom-select\` becomes \`.form-select\`
- \`.form-group\` removed (use spacing utilities)

### Site-Specific Changes Required

Based on analysis of \`index.html\`:

1. **Navbar**: Update \`data-toggle="collapse"\` to \`data-bs-toggle="collapse"\` and \`data-target\` to \`data-bs-target\`
2. **Collapse**: Update hamburger menu data attributes
3. **Scroll behavior**: Replace jQuery \`.animate()\` with native \`scrollTo()\` or CSS \`scroll-behavior: smooth\`
4. **Form validation**: Update contact form from jQuery selectors to \`document.querySelector()\`
5. **\$.ajax()\`: Replace with native \`fetch()\` API

## Vite Integration

### Current Configuration

The existing \`vite.config.js\` uses \`vite-plugin-static-copy\` to copy vendor JS files. This approach should change to npm imports for better bundling.

### Recommended Configuration Changes

\`\`\`javascript
// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  publicDir: false,

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    }
  },

  // Bootstrap 5 Sass deprecation warnings (optional)
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'mixed-decls'],
      },
    },
  },
})
\`\`\`

### Import Strategy

**Option A: UMD bundles (Simpler, matches current approach)**
\`\`\`html
<!-- In index.html -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
<script type="module" src="/style/js/main.js"></script>
\`\`\`

**Option B: ES Modules with npm (Recommended for tree-shaking)**
\`\`\`javascript
// style/js/main.js
import 'bootstrap/dist/css/bootstrap.min.css'
import { Collapse, Dropdown } from 'bootstrap'
import mixitup from 'mixitup'
import Swiper from 'swiper'
\`\`\`

**Recommendation:** Use Option A initially for simpler migration, then refactor to Option B for optimization in a future milestone.

### Package.json Additions

\`\`\`json
{
  "dependencies": {
    "bootstrap": "^5.3.8",
    "@popperjs/core": "^2.11.8",
    "mixitup": "^3.3.2",
    "swiper": "^12.0.3",
    "embla-carousel": "^8.6.0",
    "embla-carousel-autoplay": "^8.6.0",
    "glightbox": "^3.3.1"
  }
}
\`\`\`

## jQuery Plugin Replacements

### 1. SmartMenus -> Bootstrap 5 Navbar

**Current usage:** Desktop dropdown navigation with hover support

**Replacement:** Bootstrap 5 native navbar already handles collapse/toggle. The site uses single-level navigation (no dropdowns), so SmartMenus is unnecessary overhead. For hover-on-desktop, add ~10 lines CSS:

\`\`\`css
@media (min-width: 992px) {
  .navbar-nav .nav-item:hover > .dropdown-menu {
    display: block;
  }
}
\`\`\`

**Confidence:** HIGH - Bootstrap 5 navbar is well-documented

### 2. Headhesive -> CSS sticky + Intersection Observer

**Current usage:** Clones navbar and shows sticky header after scroll offset

**Replacement:** Modern CSS + vanilla JS:

\`\`\`css
.navbar.sticky {
  position: fixed;
  top: 0;
  /* Sticky styles */
}
\`\`\`

\`\`\`javascript
const navbar = document.querySelector('.navbar');
const observer = new IntersectionObserver(
  ([e]) => navbar.classList.toggle('sticky', !e.isIntersecting),
  { threshold: [1], rootMargin: '-350px 0px 0px 0px' }
);
observer.observe(document.body);
\`\`\`

**Confidence:** HIGH - IntersectionObserver has 97%+ browser support

### 3. scrollUp -> Native scrollTo

**Current usage:** Back-to-top button with fade animation

**Replacement:**

\`\`\`javascript
const scrollBtn = document.getElementById('scrollUp');
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('show', window.scrollY > 300);
});
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
\`\`\`

**Confidence:** HIGH - Native browser API

### 4. jQuery Easing -> CSS Transitions

**Current usage:** Custom easing for smooth scroll

**Replacement:** CSS \`scroll-behavior: smooth\` or Web Animations API for complex cases.

\`\`\`css
html {
  scroll-behavior: smooth;
}
\`\`\`

**Confidence:** HIGH - CSS standard

### 5. Cubeportfolio -> MixItUp 3

**Current usage:** Portfolio grid with mosaic layout, filtering, load more

**Why MixItUp:**
- Vanilla JavaScript (no dependencies)
- Apache 2.0 license (as of November 2024 - fully open source)
- Filtering with animations
- Active ecosystem (though archived)
- Similar API patterns to Cubeportfolio

**Alternative considered:** Isotope.js
- Requires commercial license ($25-$320) for non-GPL projects
- More complex licensing terms
- MixItUp is simpler for this use case

**Migration complexity:** MEDIUM - Requires HTML restructuring and new JS initialization

\`\`\`javascript
// MixItUp initialization
const mixer = mixitup('.portfolio-grid', {
  selectors: {
    target: '.portfolio-item'
  },
  animation: {
    effects: 'fade translateY(-100px)'
  }
});
\`\`\`

**Confidence:** MEDIUM - Requires testing mosaic layout compatibility

### 6. Swiper -> Keep (Already jQuery-free)

**Current usage:** Quote/testimonial slider with pagination

**Action:** Extract from bundled plugins.js to npm dependency for version control and updates. Swiper 12.x is vanilla JS and does not require jQuery.

**Confidence:** HIGH - Swiper never required jQuery

### 7. Contact Form ($.ajax) -> Fetch API

**Current usage:** AJAX form submission with jQuery

**Replacement:**

\`\`\`javascript
async function submitToAPI(e) {
  e.preventDefault();
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  // Handle response
}
\`\`\`

**Confidence:** HIGH - Fetch API is standard

## NOT Recommended

### Do NOT Use These Alternatives

| Alternative | Why Not |
|-------------|---------|
| Isotope.js | GPL/Commercial dual license; MixItUp is simpler and now Apache 2.0 |
| Masonry.js | No filtering; would need additional library |
| vanilla-lazyload | Site already has native \`loading="lazy"\` |
| Any jQuery compatibility shim | Defeats purpose of migration; adds tech debt |
| Bootstrap 4 compatibility mode | Does not exist; full migration required |

### Do NOT Add

| Library | Why Not |
|---------|---------|
| Lodash/Underscore | Native JS methods sufficient (Array.prototype, etc.) |
| Animate.css | CSS transitions handle all needed animations |
| axios | Fetch API is sufficient for single form submission |
| Any state management | Static site does not need it |

## Bundle Size Impact

### Current (Estimated)
- jQuery: ~97KB minified
- Popper v1: ~19KB minified
- Bootstrap 4 JS: ~60KB minified
- plugins.js (includes Cubeportfolio, SmartMenus, etc.): ~547KB minified

**Total JS vendor:** ~723KB

### After Migration (Estimated)
- Bootstrap 5 bundle (includes Popper v2): ~78KB minified
- MixItUp: ~29KB minified
- Swiper (core only): ~40KB minified
- Custom vanilla JS: ~5KB minified

**Total JS vendor:** ~152KB

**Estimated savings:** ~571KB (~79% reduction)

## Sources

### HIGH Confidence (Official Documentation)
- [Bootstrap 5.3 Migration Guide](https://getbootstrap.com/docs/5.3/migration/) - Key breaking changes
- [Bootstrap 5 Vite Setup](https://getbootstrap.com/docs/5.3/getting-started/vite/) - Configuration reference
- [MixItUp GitHub](https://github.com/patrickkunka/mixitup) - Apache 2.0 license confirmation (November 2024)
- [Swiper Official](https://swiperjs.com/) - Version 12.x, vanilla JS

### MEDIUM Confidence (Verified Multiple Sources)
- [Isotope.js](https://isotope.metafizzy.co/) - GPL/Commercial licensing verified
- Bundle sizes from Bundlephobia (approximate)

### LOW Confidence (Single Source / Training Data)
- Custom vanilla JS replacements - Based on standard patterns, needs implementation validation
