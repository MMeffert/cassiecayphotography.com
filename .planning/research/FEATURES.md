# Features Research: jQuery Plugin Replacements

**Domain:** Photography portfolio website - jQuery removal milestone
**Researched:** 2026-01-20
**Overall confidence:** HIGH

## Executive Summary

The current site uses four jQuery-dependent plugins that need replacement: Cubeportfolio (portfolio grid with filtering), SmartMenus (navigation), Headhesive (sticky header), and scrollUp (back-to-top button). Modern vanilla JavaScript alternatives exist for all four. The most complex replacement is Cubeportfolio due to its masonry layout and category filtering. The simplest are Headhesive (already vanilla JS compatible) and scrollUp (trivial to implement natively). Total current plugin bundle in custom-plugins.js is ~257KB; estimated post-migration is ~20-30KB for external libraries plus ~3KB custom code.

---

## Plugin Replacement Analysis

### Cubeportfolio -> MixItUp 3 / Shuffle.js / Custom CSS Grid

**Current functionality:**
- Masonry/mosaic grid layout for 80+ portfolio images
- Category filtering (All, Couples, Family, Milestone, Newborn, Senior)
- Animated transitions when filtering
- "Load more" pagination support
- GLightbox integration (lightbox reload on filter events)
- Responsive column counts (4 cols desktop, 3 tablet, 2 mobile, 1 small mobile)
- gapHorizontal: 0, gapVertical: 0 (edge-to-edge images)

**Current bundle contribution:** ~80KB minified (estimated from custom-plugins.js)

**Table stakes:**
- Category filtering with smooth transitions
- Responsive grid layout (4/3/2/1 columns by breakpoint)
- Integration with GLightbox (reload on filter)
- Zero-gap mosaic layout
- Lazy loading compatibility
- Touch-friendly on mobile
- Maintain current filter UI (button-style tabs)

**Differentiators:**
- Native CSS masonry (grid-template-rows: masonry) - Safari only as of 2026, needs fallback
- URL hash filtering (deep link to filtered category)
- Filter animations respecting prefers-reduced-motion
- Intersection Observer for staggered reveal animations

**Recommended replacement:** **Custom CSS Grid + Vanilla JS filtering** (~3KB custom code)

**Rationale:**
1. The current filtering is simple (5 categories, show/hide by class)
2. MixItUp 3 is now fully open source (Nov 2024) but at ~86KB minified is nearly as heavy as Cubeportfolio
3. Shuffle.js (~19KB minified) is lighter but still adds external dependency
4. CSS Grid with vanilla JS filtering is ~3KB custom code and gives full control
5. Native CSS masonry (`grid-template-rows: masonry`) is coming but Safari-only in early 2026

**Implementation approach:**
```javascript
// Simple category filter - ~50 lines of vanilla JS
const filterButtons = document.querySelectorAll('[data-filter]');
const items = document.querySelectorAll('.cbp-item');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    items.forEach(item => {
      const show = filter === '*' || item.classList.contains(filter.replace('.', ''));
      item.style.display = show ? '' : 'none';
    });
    // Reload lightbox after filter
    if (window.lightbox) lightbox.reload();
  });
});
```

**Complexity:** Medium
**Bundle size:** ~80KB (Cubeportfolio) -> ~3KB custom code
**Risk:** CSS Grid doesn't do true masonry without JavaScript height calculation. Current mosaic layout may need layout adjustment or small masonry library (~5KB) if true masonry is required.

---

### SmartMenus -> Bootstrap 5 Native Navbar

**Current functionality:**
- Desktop dropdown menus on hover
- Mobile hamburger menu with collapse
- Submenu indicators (arrows)
- Collapsible behavior on mobile
- Click-to-toggle on mobile, hover on desktop
- Keyboard navigation support
- Touch device detection

**Current bundle contribution:** ~15KB minified (SmartMenus core + Bootstrap addon)

**Table stakes:**
- Mobile hamburger menu that collapses/expands
- Click navigation on mobile
- Keyboard accessible (Tab, Enter, Escape)
- Works without jQuery

**Differentiators:**
- Desktop hover dropdowns (current behavior)
- Submenu arrows
- Multi-level nested menus (not currently used)

**Recommended replacement:** **Bootstrap 5 Native Navbar** (0KB additional - included in Bootstrap 5)

**Rationale:**
1. Bootstrap 5 dropped jQuery dependency entirely
2. Bootstrap 5 navbar includes collapse/expand, hamburger, responsive breakpoints
3. Current site only has single-level navigation (no submenus)
4. SmartMenus' advanced features (multi-level dropdowns, hover) aren't needed

**Implementation approach:**
- Migrate to Bootstrap 5 navbar markup
- Use Bootstrap 5's native collapse component
- Remove SmartMenus initialization entirely
- The current navbar already uses Bootstrap classes; primary change is JS initialization

**Current markup already Bootstrap-compatible:**
```html
<nav class="navbar navbar-expand-lg">
  <button class="hamburger" data-toggle="collapse" data-target=".navbar-collapse">
  </button>
  <div class="collapse navbar-collapse">
    <ul class="nav navbar-nav">
      <!-- nav items -->
    </ul>
  </div>
</nav>
```

**Bootstrap 5 changes:**
- `data-toggle` -> `data-bs-toggle`
- `data-target` -> `data-bs-target`
- No jQuery required

**Complexity:** Low
**Bundle size:** ~15KB (SmartMenus) -> 0KB additional (Bootstrap 5 includes this)
**Risk:** Low - Bootstrap 5 navbar is well-documented and widely used

---

### Headhesive -> CSS position:sticky + Vanilla JS OR Keep Headhesive

**Current functionality:**
- Creates clone of navbar element
- Clone appears fixed at top after scrolling past offset (350px)
- Adds CSS classes: `banner--clone`, `banner--stick`, `banner--unstick`
- onStick callback initializes SmartMenus on the clone
- onUnstick callback cleans up dropdown states
- Throttled scroll handling for performance

**Current bundle contribution:** ~2KB minified (Headhesive is very small)

**Table stakes:**
- Header appears fixed after scrolling past hero section
- Smooth transition when appearing/disappearing
- Works on all devices including mobile
- No layout shift when sticky activates

**Differentiators:**
- IntersectionObserver-based detection (more performant than scroll events)
- CSS-only solution using position: sticky
- Animation when header appears (slide down)

**Recommended replacement:** **Keep Headhesive** (already vanilla JS) OR **Custom IntersectionObserver** (~30 lines)

**Rationale:**
1. Headhesive.js is already dependency-free vanilla JavaScript
2. At ~2KB minified, it's extremely lightweight
3. It's well-tested and handles edge cases (throttling, resize)
4. Alternative: Pure CSS `position: sticky` doesn't support the "clone" pattern (show different header after scroll)

**Why not pure CSS sticky:**
The current implementation clones the navbar and shows a different styled version after scroll. CSS `position: sticky` can't create a clone - it just makes the same element stick. If we want to keep the "transparent navbar -> solid navbar" transition, we need JavaScript.

**IntersectionObserver alternative (~30 lines):**
```javascript
const navbar = document.querySelector('.navbar');
const sentinel = document.createElement('div');
sentinel.style.height = '350px';
document.body.prepend(sentinel);

const observer = new IntersectionObserver(([entry]) => {
  navbar.classList.toggle('navbar--stuck', !entry.isIntersecting);
}, { threshold: 0 });

observer.observe(sentinel);
```

**Complexity:** Low
**Bundle size:** ~2KB (Headhesive) -> ~2KB (keep) OR ~0.5KB (custom IntersectionObserver)
**Risk:** Very low - Headhesive already works without jQuery

---

### scrollUp -> Native Vanilla JS

**Current functionality:**
- Creates scroll-to-top button element dynamically
- Shows button after scrolling 300px from top
- Fade in/out animation
- Smooth scroll to top on click
- Customizable scroll speed and easing
- z-index: 1001 (above other content)

**Current bundle contribution:** ~2KB minified

**Table stakes:**
- Button appears after scrolling down
- Smooth scroll to top on click
- Accessible (focusable, keyboard support)
- Mobile-friendly tap target

**Differentiators:**
- Progress indicator (show scroll position)
- Configurable threshold
- Multiple animation styles

**Recommended replacement:** **Native Vanilla JS** (~20 lines + CSS)

**Rationale:**
1. Modern browsers natively support `window.scrollTo({ behavior: 'smooth' })`
2. The plugin is simple enough that a library is overkill
3. Native implementation gives full control over styling and behavior
4. Removes jQuery dependency completely

**Implementation:**
```javascript
// ~20 lines of vanilla JS
const scrollBtn = document.createElement('button');
scrollBtn.id = 'scrollUp';
scrollBtn.innerHTML = '<span class="btn btn-square"><i class="fa fa-chevron-up"></i></span>';
scrollBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
  scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
}, { passive: true });

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
```

**CSS:**
```css
#scrollUp {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: none;
  z-index: 1001;
  opacity: 0;
  transition: opacity 0.2s;
}
#scrollUp.visible { opacity: 1; }
```

**Complexity:** Low
**Bundle size:** ~2KB (scrollUp plugin) -> ~0.5KB (custom)
**Risk:** Very low - trivial implementation with native APIs

---

## Summary: Bundle Size Impact

| Plugin | Current | Replacement | New Size | Savings |
|--------|---------|-------------|----------|---------|
| Cubeportfolio | ~80KB | CSS Grid + Vanilla JS | ~3KB | 77KB |
| SmartMenus | ~15KB | Bootstrap 5 Native | 0KB | 15KB |
| Headhesive | ~2KB | Keep or IntersectionObserver | ~0.5KB | 1.5KB |
| scrollUp | ~2KB | Native Vanilla JS | ~0.5KB | 1.5KB |
| **Subtotal plugins** | **~99KB** | — | **~4KB** | **~95KB** |
| jQuery | ~97KB | Remove | 0KB | 97KB |
| **Total** | **~196KB** | — | **~4KB** | **~192KB** |

**Note:** These estimates exclude Swiper (~25KB minified) which is also in custom-plugins.js but wasn't mentioned in the replacement scope. Swiper is already jQuery-free.

---

## Anti-Features

Features to explicitly NOT build during this migration:

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Complex animation library for filtering | GSAP/Anime.js add 20KB+ | CSS transitions are sufficient |
| MixItUp or Isotope for simple filtering | 86KB and 25KB+ respectively when CSS Grid + ~50 lines JS works | Custom vanilla JS filtering |
| Custom dropdown menu system | Reinventing Bootstrap 5 navbar | Use Bootstrap 5 native |
| Scroll position library | Overkill for one button | Native window.scrollTo |
| jQuery slim build | Still 70KB+ for no benefit | Remove jQuery entirely |
| IE11 compatibility shims | Project already targets modern browsers only | No polyfills needed |
| Infinite scroll | Adds complexity, SEO issues | Keep current pagination |
| Masonry.js for grid | CSS Grid handles responsive columns | CSS-only solution |

---

## Feature Dependencies

```
jQuery Removal
    ├── SmartMenus -> Bootstrap 5 Navbar (depends on Bootstrap 5 migration)
    ├── Cubeportfolio -> CSS Grid + Vanilla JS
    │       └── GLightbox reload integration
    ├── Headhesive -> Keep (already vanilla) or IntersectionObserver
    └── scrollUp -> Native Vanilla JS

Bootstrap 5 Migration
    └── SmartMenus -> Bootstrap 5 Navbar
    └── data-toggle -> data-bs-toggle attribute updates
```

**Recommended order:**
1. **scrollUp** - Simplest, no dependencies, quick win
2. **Headhesive** - Already vanilla JS, may only need SmartMenus callback removal
3. **SmartMenus** - Requires Bootstrap 5 migration to happen first
4. **Cubeportfolio** - Most complex, do last after other patterns established

---

## Complexity Assessment by Plugin

| Plugin | Complexity | Effort Estimate | Risk |
|--------|------------|-----------------|------|
| scrollUp | Low | 1 hour | Very Low |
| Headhesive | Low | 1-2 hours | Very Low |
| SmartMenus | Low-Medium | 2-3 hours | Low (Bootstrap 5 is mature) |
| Cubeportfolio | Medium-High | 4-8 hours | Medium (layout may need adjustment) |

**Total estimated effort:** 8-14 hours for all four replacements

---

## Sources

### Portfolio Grid Libraries
- [Isotope](https://isotope.metafizzy.co/) - Official documentation (verified vanilla JS support) - **HIGH confidence**
- [MixItUp GitHub](https://github.com/patrickkunka/mixitup) - Now fully open source as of Nov 2024 - **HIGH confidence**
- [Shuffle.js](https://shuffle.js.org/) - Vanilla JS since v4.0 - **HIGH confidence**
- [MixItUp size issue #370](https://github.com/patrickkunka/mixitup/issues/370) - 86KB minified confirmed - **HIGH confidence**

### Sticky Header Solutions
- [Headhesive.js GitHub](https://github.com/markgoodyear/headhesive.js) - Vanilla JS, no dependencies - **HIGH confidence**
- [IntersectionObserver sticky detection](https://developer.chrome.com/docs/css-ui/sticky-headers) - Chrome for Developers - **HIGH confidence**
- [Sticky-js](https://github.com/rgalus/sticky-js) - Alternative vanilla library - **MEDIUM confidence**

### Navigation
- [Bootstrap 5 Navbar](https://getbootstrap.com/docs/5.3/components/navbar/) - Official documentation - **HIGH confidence**
- [Bootstrap 5 dropped jQuery](https://getbootstrap.com/docs/5.0/migration/) - Migration guide - **HIGH confidence**

### Scroll to Top
- [Vanilla JS Scroll to Top](https://dev.to/dailydevtips1/vanilla-javascript-scroll-to-top-3mkd) - Dev.to tutorial - **HIGH confidence**
- [window.scrollTo MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo) - Native API - **HIGH confidence**

### Bundle Sizes
- [jQuery size analysis](https://mathiasbynens.be/demo/jquery-size) - Mathias Bynens - **HIGH confidence**
- Current custom-plugins.js measured at 257KB uncompressed - **HIGH confidence** (direct measurement)
- Current jquery.min.js measured at 97KB uncompressed - **HIGH confidence** (direct measurement)

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Cubeportfolio replacement | MEDIUM | CSS Grid + vanilla JS is straightforward but masonry layout may need adjustment |
| SmartMenus replacement | HIGH | Bootstrap 5 navbar is well-documented, current site only uses basic nav |
| Headhesive replacement | HIGH | Already vanilla JS, minimal changes needed |
| scrollUp replacement | HIGH | Trivial native implementation |
| Bundle size estimates | HIGH | Based on direct file measurements and official sources |
| Bootstrap 5 compatibility | HIGH | Bootstrap 5 is mature (v5.3), well-documented |
