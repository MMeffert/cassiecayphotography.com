# Phase 13: Utility Scripts Conversion - Research

**Researched:** 2026-01-21
**Domain:** Vanilla JS scroll-to-top button, smooth scrolling, easing alternatives
**Confidence:** HIGH

## Summary

This phase was originally planned to replace three jQuery-dependent utilities with vanilla JavaScript. After auditing the current codebase following Phase 12, the scope is significantly reduced:

1. **UTIL-02 (Smooth scroll):** ALREADY COMPLETE - Phase 12 added CSS `scroll-behavior: smooth` with `prefers-reduced-motion` media query (style.css lines 6145-6153)
2. **UTIL-03 (jQuery Easing):** ALREADY COMPLETE - Phase 12 removed jQuery Easing from the plugins bundle; CSS transitions now handle all easing needs
3. **UTIL-01 (scrollUp replacement):** NEEDS IMPLEMENTATION - The scrollUp jQuery plugin was removed from the bundle, and its initialization code was removed from custom-scripts.js. However, no vanilla JS replacement was added. The scroll-to-top functionality is currently missing from the site.

The only remaining work is to implement a vanilla JS scroll-to-top button to replace the removed scrollUp plugin. The CSS styles for `#scrollUp` already exist in style.css (lines 4837-4859), so only JavaScript implementation and HTML are needed.

**Primary recommendation:** Implement a ~20 line vanilla JS scroll-to-top button using `window.scrollTo({ behavior: 'smooth' })` with IntersectionObserver for visibility toggle. Reuse existing CSS.

## Current State Audit

### What Phase 12 Completed

**CSS Smooth Scroll (UTIL-02):**
```css
/* style.css lines 6145-6153 */
@media (prefers-reduced-motion: no-preference) {
    html {
        scroll-behavior: smooth;
    }
}

section[id] {
    scroll-margin-top: 68px;
}
```
- Native CSS smooth scroll for all anchor links
- Respects `prefers-reduced-motion` accessibility preference
- scroll-margin-top compensates for fixed header

**jQuery Easing Removal (UTIL-03):**
- Removed from custom-plugins.js in Phase 12
- No easing references remain in custom-scripts.js
- CSS transitions handle all animation easing via `ease-in-out`, `ease`

### What Still Needs Work

**scrollUp Button (UTIL-01):**
- scrollUp jQuery plugin: REMOVED from bundle
- scrollUp initialization: REMOVED from custom-scripts.js
- Scroll-to-top button HTML: DOES NOT EXIST in index.html (was dynamically created by plugin)
- `#scrollUp` CSS styles: STILL EXIST in style.css (lines 4837-4859), orphaned

**Current orphaned CSS:**
```css
#scrollUp {
    bottom: 15px;
    right: 15px;
    transition: background 150ms ease-in-out;
    -webkit-backface-visibility: hidden;
}
#scrollUp .btn {
    font-size: 12px;
    margin: 0;
    letter-spacing: normal;
    padding: 12px 14px 14px 14px;
}
```

### Remaining jQuery Usage

custom-scripts.js still uses jQuery for these non-utility operations:
- Line 7: `$(document).ready()`
- Lines 139-159: Swiper initialization
- Line 163: Image overlay prepend
- Lines 283-307: Background image, parallax mobile, header offset

These jQuery usages are NOT part of Phase 13 scope (utility scripts). They belong to future phases (likely Phase 14 final jQuery removal).

## Standard Stack

### Core (No External Libraries)

| Technology | Purpose | Why Standard |
|------------|---------|--------------|
| `window.scrollTo({ top: 0, behavior: 'smooth' })` | Smooth scroll to top | Native API, no library needed |
| IntersectionObserver | Show/hide button based on scroll position | Native API, performant |
| CSS `scroll-behavior: smooth` | Already implemented | Phase 12 added this |

### Supporting

None required. All utilities use native browser APIs.

### Libraries NOT Needed

| Library | Size | Why Not Needed |
|---------|------|----------------|
| scrollUp jQuery plugin | ~2KB | Native `scrollTo()` is simpler |
| jQuery Easing | ~5KB | CSS `transition` handles easing |
| smooth-scroll libraries | 5-15KB | CSS `scroll-behavior` suffices |

## Architecture Patterns

### Pattern 1: Vanilla JS Scroll-to-Top Button

**What:** Fixed button that appears after scrolling, scrolls to top on click
**When to use:** Replacing scrollUp jQuery plugin

```javascript
/**
 * Scroll-to-Top Button - Replaces scrollUp jQuery plugin
 * Shows button after scrolling 300px, smooth scrolls to top on click
 */
(function() {
    'use strict';

    // Create button element
    var scrollUpBtn = document.createElement('div');
    scrollUpBtn.id = 'scrollUp';
    scrollUpBtn.innerHTML = '<a class="btn btn-circle btn-dark"><i class="icon-arrow-up"></i></a>';
    scrollUpBtn.style.opacity = '0';
    scrollUpBtn.style.visibility = 'hidden';
    scrollUpBtn.style.position = 'fixed';
    scrollUpBtn.style.transition = 'opacity 300ms ease, visibility 300ms ease';
    scrollUpBtn.style.zIndex = '9999';
    document.body.appendChild(scrollUpBtn);

    // Show/hide based on scroll position using IntersectionObserver
    var sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:300px;height:1px;width:100%;pointer-events:none;';
    document.body.insertBefore(sentinel, document.body.firstChild);

    var observer = new IntersectionObserver(function(entries) {
        var entry = entries[0];
        if (!entry.isIntersecting) {
            scrollUpBtn.style.opacity = '1';
            scrollUpBtn.style.visibility = 'visible';
        } else {
            scrollUpBtn.style.opacity = '0';
            scrollUpBtn.style.visibility = 'hidden';
        }
    }, { threshold: 0 });

    observer.observe(sentinel);

    // Scroll to top on click
    scrollUpBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();
```

Source: Native browser APIs - [MDN scrollTo()](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo), [MDN IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

### Pattern 2: Native scrollTo() with Smooth Behavior

**What:** Native smooth scrolling for programmatic scroll
**When to use:** Any JS-triggered scroll action

```javascript
// Smooth scroll to top
window.scrollTo({ top: 0, behavior: 'smooth' });

// Smooth scroll to element
element.scrollIntoView({ behavior: 'smooth', block: 'start' });
```

Source: [MDN scrollTo()](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo)

### Pattern 3: Accessibility-Aware Scroll

**What:** Respect user's motion preferences in JavaScript
**When to use:** When smooth scroll might cause discomfort

```javascript
// Check if user prefers reduced motion
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var scrollBehavior = prefersReducedMotion ? 'instant' : 'smooth';

window.scrollTo({ top: 0, behavior: scrollBehavior });
```

### Anti-Patterns to Avoid

- **jQuery animate() for scroll:** Native `scrollTo()` is simpler and doesn't require jQuery
- **requestAnimationFrame scroll loops:** Native `behavior: 'smooth'` handles animation
- **Multiple scroll handlers:** Use IntersectionObserver instead of scroll events for visibility
- **Fixed position calculations:** Let browser handle smooth scroll duration

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth scrolling | Custom animation loop | `window.scrollTo({ behavior: 'smooth' })` | Native, handles easing |
| Show/hide on scroll position | Scroll event + position check | IntersectionObserver | Off-main-thread, no scroll jank |
| Easing functions | Custom bezier curves | CSS `ease-in-out` | Native CSS, no JS needed |
| Scroll progress detection | Manual scroll tracking | IntersectionObserver | Browser-optimized |

**Key insight:** The scrollUp plugin was ~2KB of code to do what `window.scrollTo({ behavior: 'smooth' })` does in one line. Modern browser APIs make most scroll utilities obsolete.

## Common Pitfalls

### Pitfall 1: Scroll Position Check on Every Frame

**What goes wrong:** Performance issues from scroll event listener checking position
**Why it happens:** Legacy patterns from before IntersectionObserver
**How to avoid:** Use IntersectionObserver with sentinel element at threshold position
**Warning signs:** Scroll jank, high CPU usage during scroll

### Pitfall 2: Ignoring prefers-reduced-motion

**What goes wrong:** Users with vestibular disorders experience discomfort
**Why it happens:** Developer assumes smooth scroll is always better
**How to avoid:** Check `window.matchMedia('(prefers-reduced-motion: reduce)')` for JS-triggered scrolls. CSS `scroll-behavior: smooth` inside `@media (prefers-reduced-motion: no-preference)` already handles this for CSS-triggered scrolls.
**Warning signs:** Accessibility audit failures

### Pitfall 3: Z-Index Conflicts

**What goes wrong:** Scroll-to-top button hidden behind other elements
**Why it happens:** Multiple fixed/sticky elements with z-index
**How to avoid:** Use z-index lower than modals (9999 is typical, modals use 10000+)
**Warning signs:** Button not visible even when it should be

### Pitfall 4: Double Smooth Scroll

**What goes wrong:** Smooth scroll applied twice (CSS + JS)
**Why it happens:** Both `scroll-behavior: smooth` CSS and `behavior: 'smooth'` in scrollTo()
**How to avoid:** This is fine - they don't conflict. JS `scrollTo` with `behavior: 'smooth'` works even when CSS has `scroll-behavior: smooth`.
**Warning signs:** None, this is not actually a problem

## Code Examples

### Complete Scroll-to-Top Implementation

```javascript
/**
 * Scroll-to-Top Button - Vanilla JS
 * Replaces scrollUp jQuery plugin (~2KB saved)
 */
(function() {
    'use strict';

    // Create button matching existing CSS structure
    var scrollUpBtn = document.createElement('div');
    scrollUpBtn.id = 'scrollUp';
    scrollUpBtn.innerHTML = '<a class="btn btn-circle btn-dark"><i class="icon-arrow-up"></i></a>';
    document.body.appendChild(scrollUpBtn);

    // Initial hidden state (CSS can also handle this)
    scrollUpBtn.style.opacity = '0';
    scrollUpBtn.style.visibility = 'hidden';
    scrollUpBtn.style.transition = 'opacity 300ms ease, visibility 300ms ease';
    scrollUpBtn.style.position = 'fixed';
    scrollUpBtn.style.zIndex = '9999';

    // Sentinel element at scroll threshold (300px)
    var sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    sentinel.style.cssText = 'position:absolute;top:300px;height:1px;width:100%;pointer-events:none;';
    document.body.insertBefore(sentinel, document.body.firstChild);

    // Show/hide button based on sentinel visibility
    var observer = new IntersectionObserver(function(entries) {
        var entry = entries[0];
        if (!entry.isIntersecting) {
            // Past 300px - show button
            scrollUpBtn.style.opacity = '1';
            scrollUpBtn.style.visibility = 'visible';
        } else {
            // Before 300px - hide button
            scrollUpBtn.style.opacity = '0';
            scrollUpBtn.style.visibility = 'hidden';
        }
    }, { threshold: 0 });

    observer.observe(sentinel);

    // Scroll to top on click, respecting reduced-motion preference
    scrollUpBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'instant' : 'smooth'
        });
    });
})();
```

### CSS Already in style.css (Reuse)

```css
/* Lines 4837-4859 - Already exists, no changes needed */
#scrollUp {
    bottom: 15px;
    right: 15px;
    transition: background 150ms ease-in-out;
    -webkit-backface-visibility: hidden;
}
#scrollUp .btn {
    font-size: 12px;
    margin: 0;
    letter-spacing: normal;
    padding: 12px 14px 14px 14px;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| scrollUp jQuery plugin | Native `window.scrollTo()` | Browser support complete ~2019 | Remove ~2KB |
| jQuery Easing plugin | CSS `transition` | Always available | Remove ~5KB |
| jQuery animate() for scroll | CSS `scroll-behavior: smooth` | March 2022 (full support) | Remove jQuery dependency |
| Scroll event position checks | IntersectionObserver | Browser support 2019 | Better performance |

**Deprecated/outdated:**
- scrollUp: Replaced by native scrollTo() with behavior option
- jQuery Easing: CSS transitions handle all common easing functions
- jQuery animate(): CSS scroll-behavior is native and simpler

## Phase Scope Summary

### Already Complete (From Phase 12)

| Requirement | Status | Evidence |
|-------------|--------|----------|
| UTIL-02: CSS smooth scroll | COMPLETE | style.css lines 6145-6153 |
| UTIL-03: jQuery Easing removal | COMPLETE | No easing references in custom-scripts.js |

### Remaining Work

| Requirement | Status | Work Needed |
|-------------|--------|-------------|
| UTIL-01: scrollUp replacement | NEEDS WORK | ~30 lines vanilla JS |

### Estimated Effort

- **UTIL-01 implementation:** 1 task (~15 minutes)
- **Total phase:** Very small, possibly merge with Phase 14

## Open Questions

1. **Merge with Phase 14?**
   - What we know: Phase 13 is now just one small task (UTIL-01)
   - What's unclear: Whether to merge with Phase 14 (final jQuery removal) for efficiency
   - Recommendation: Implement UTIL-01 as a single task; consider if Phase 13/14 should merge

2. **Icon availability**
   - What we know: scrollUp used `icon-arrow-up` class
   - What's unclear: Is this icon defined in the icon font?
   - Recommendation: Check style/type/icons.css or use Font Awesome arrow icon if not

## Sources

### Primary (HIGH confidence)
- [MDN - scrollTo()](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo) - Native smooth scroll API
- [MDN - IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) - Visibility detection
- [MDN - scroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior) - CSS smooth scroll
- [MDN - prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) - Accessibility

### Project-Specific
- `/Users/mitchellmeffert/Git/Personal/cassiecayphotography.com/style/style.css` - Existing #scrollUp CSS (lines 4837-4859)
- `/Users/mitchellmeffert/Git/Personal/cassiecayphotography.com/style/js/custom-scripts.js` - No scrollUp code remains
- `/Users/mitchellmeffert/Git/Personal/cassiecayphotography.com/.planning/phases/12-navigation-sticky-header/12-02-SUMMARY.md` - Confirms scrollUp removal

### Phase 12 Reference
- Phase 12 VERIFICATION.md confirms CSS smooth scroll working
- Phase 12 02-SUMMARY.md confirms scrollUp plugin and initialization removed

## Metadata

**Confidence breakdown:**
- Remaining work assessment: HIGH - Verified by reading current codebase
- Implementation approach: HIGH - Native APIs, well-documented
- CSS reuse: HIGH - Verified existing styles

**Research date:** 2026-01-21
**Valid until:** 2026-07-21 (6 months - stable native APIs)
