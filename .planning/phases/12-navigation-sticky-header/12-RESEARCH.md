# Phase 12: Navigation & Sticky Header - Research

**Researched:** 2026-01-20
**Domain:** Vanilla JS sticky header, Bootstrap 5 navigation, smooth scrolling
**Confidence:** HIGH

## Summary

This phase replaces Headhesive (sticky header library) and SmartMenus (jQuery dropdown plugin) with vanilla JavaScript and Bootstrap 5 native components. The current implementation creates a cloned navbar that becomes visible after scrolling 350px, with show/hide behavior on scroll direction. SmartMenus is redundant because this is a single-page site with no dropdown menus.

The recommended approach uses IntersectionObserver for sticky activation (replacing Headhesive's scroll offset detection) and simple scroll position tracking for show/hide behavior. Bootstrap 5's native Scrollspy handles nav link highlighting, and CSS `scroll-behavior: smooth` replaces jQuery animate() for smooth scrolling.

**Key findings:**
- Headhesive creates a cloned navbar element; replacement should use the same pattern to preserve existing CSS
- SmartMenus is completely unused (no dropdowns exist) - can be removed entirely
- Bootstrap 5 Scrollspy now uses `rootMargin` instead of deprecated `offset` option
- CSS `scroll-behavior: smooth` is widely supported (since March 2022) and removes need for jQuery easing
- The hamburger icon animation is custom CSS (`.hamburger.animate.active`) - must preserve

**Primary recommendation:** Replace Headhesive with ~40 lines of vanilla JS using IntersectionObserver + scroll tracking. Remove SmartMenus entirely. Use CSS smooth scroll instead of jQuery animate.

## Current Implementation Audit

### Headhesive Configuration (custom-scripts.js lines 50-69)

```javascript
var options = {
    offset: 350,                    // Activate after 350px scroll
    offsetSide: 'top',
    classes: {
        clone: 'banner--clone fixed',  // Classes for cloned navbar
        stick: 'banner--stick',        // When sticky is active
        unstick: 'banner--unstick'     // When sticky deactivates
    },
    onStick: function() {
        $($.SmartMenus.Bootstrap.init);  // PROBLEM: Calls SmartMenus
    },
    onUnstick: function() {
        $('.navbar .btn-group').removeClass('open');
    }
};
var banner = new Headhesive('.navbar', options);
```

### What Headhesive Does

1. **Clones the navbar** - Creates a hidden copy at document top
2. **Watches scroll position** - Uses scroll event (throttled at 250ms)
3. **Toggles visibility** - Adds/removes `banner--stick` class at offset
4. **Fires callbacks** - `onStick()` and `onUnstick()` for custom behavior

### Current CSS for Sticky Header (style.css lines 870-887)

```css
.banner--clone {
    position: fixed !important;
    z-index: 1039;
    top: 0;
    left: 0;
    transform: translateY(-100%);  /* Hidden by default */
    transition: all 300ms ease-in-out;
}

.banner--stick {
    transform: translateY(0%);     /* Visible when active */
    background: rgba(255, 255, 255, 0.9);
}
```

### SmartMenus Usage

**Current problem:** SmartMenus is initialized in Headhesive's `onStick` callback but serves no purpose:
- Site has NO dropdown menus (flat navigation: Home, About, Portfolio, Services, Schedule, Contact)
- SmartMenus adds keyboard navigation for dropdowns that don't exist
- SmartMenus Bootstrap integration is leftover from template, not site requirements

**Action:** Remove SmartMenus entirely from custom-plugins.js

### Current Smooth Scroll (custom-scripts.js lines 292-315)

```javascript
$('a.scroll[href*=#]:not([href=#])').on('click', function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        smoothScrollTo($(this.hash));
        return false;
    }
});

function smoothScrollTo(target) {
    if (target.length) {
        $('html,body').animate({
            scrollTop: target.offset().top
        }, 1500, 'easeInOutExpo');
    }
}
```

This depends on jQuery and jQuery Easing plugin (`easeInOutExpo`). CSS `scroll-behavior: smooth` can replace it entirely.

### Hamburger Menu (custom-scripts.js lines 71-79)

```javascript
$(".hamburger.animate").on("click", function() {
    $(".hamburger.animate").toggleClass("active");
});

$('.onepage .navbar .nav li a').on('click', function() {
    $('.navbar .navbar-collapse.show').collapse('hide');
    $('.hamburger.animate').removeClass('active');
});
```

Bootstrap 5 handles collapse via `data-bs-toggle="collapse"`. The custom hamburger animation (`.active` class) needs preservation.

## Standard Stack

### Core (No External Libraries)

| Technology | Purpose | Why Standard |
|------------|---------|--------------|
| IntersectionObserver | Detect scroll past hero section | Native API, no scroll event overhead |
| CSS `scroll-behavior: smooth` | Smooth anchor scrolling | Native CSS, no JavaScript needed |
| Bootstrap 5 Scrollspy | Highlight active nav link | Already loaded for navbar |
| Bootstrap 5 Collapse | Mobile menu toggle | Already loaded, handles hamburger |
| Vanilla JS scroll tracking | Show/hide on scroll direction | ~10 lines, no library needed |

### Supporting

| Dependency | Version | Purpose | Notes |
|------------|---------|---------|-------|
| Bootstrap 5.3.3 | existing | Collapse, Scrollspy | Already loaded from Phase 10 |

### Libraries to Remove

| Library | Size | Why Remove |
|---------|------|-----------|
| Headhesive | ~2KB minified | Replaced by IntersectionObserver |
| SmartMenus | ~25KB minified | No dropdowns on site |
| SmartMenus Bootstrap | ~3KB minified | No dropdowns on site |
| jQuery Easing | ~5KB minified | CSS smooth scroll replaces |

**Total removal: ~35KB** (from custom-plugins.js)

## Architecture Patterns

### Pattern 1: IntersectionObserver for Sticky Activation

**What:** Observe a sentinel element to trigger sticky header
**When to use:** Replacing scroll position checks for "show after X pixels"

```javascript
// Create sentinel element at desired offset
var sentinel = document.createElement('div');
sentinel.style.cssText = 'position:absolute;top:350px;height:1px;width:100%;pointer-events:none;';
document.body.insertBefore(sentinel, document.body.firstChild);

// Create cloned navbar
var navbar = document.querySelector('.navbar');
var clone = navbar.cloneNode(true);
clone.classList.add('banner--clone', 'fixed');
document.body.insertBefore(clone, document.body.firstChild);

// Observe sentinel
var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (!entry.isIntersecting) {
            // Scrolled past sentinel - activate sticky
            clone.classList.add('banner--stick');
            clone.classList.remove('banner--unstick');
        } else {
            // Above sentinel - deactivate sticky
            clone.classList.remove('banner--stick');
            clone.classList.add('banner--unstick');
        }
    });
}, { threshold: 0 });

observer.observe(sentinel);
```

Source: [Chrome Developers - Sticky Headers](https://developers.google.com/web/updates/2017/09/sticky-headers)

### Pattern 2: Scroll Direction Detection

**What:** Track last scroll position to determine direction
**When to use:** Hide header on scroll down, show on scroll up

```javascript
var lastScrollY = 0;
var ticking = false;

function updateHeader() {
    var currentScrollY = window.pageYOffset;
    var clone = document.querySelector('.banner--clone');

    if (!clone.classList.contains('banner--stick')) {
        // Not active yet, skip direction check
        ticking = false;
        return;
    }

    if (currentScrollY > lastScrollY && currentScrollY > 400) {
        // Scrolling down - hide header
        clone.classList.add('banner--hidden');
    } else {
        // Scrolling up - show header
        clone.classList.remove('banner--hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
    }
});
```

Source: [Envato Tuts+ - Hide/Reveal Sticky Header](https://webdesign.tutsplus.com/how-to-hide-reveal-a-sticky-header-on-scroll-with-javascript--cms-33756t)

### Pattern 3: CSS Smooth Scroll with Accessibility

**What:** Native smooth scrolling with reduced-motion respect
**When to use:** All anchor link scrolling

```css
/* Enable smooth scroll only when user has no motion preference */
@media (prefers-reduced-motion: no-preference) {
    html {
        scroll-behavior: smooth;
    }
}

/* Offset for fixed header */
section[id] {
    scroll-margin-top: 68px;
}
```

Source: [MDN - scroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior)

### Pattern 4: Bootstrap 5 Scrollspy Configuration

**What:** Highlight active nav link while scrolling
**When to use:** One-page navigation

```javascript
// Initialize with rootMargin for sticky header offset
var scrollSpy = new bootstrap.ScrollSpy(document.body, {
    target: '.navbar',
    rootMargin: '0px 0px -40%',  // Replaced deprecated 'offset'
    smoothScroll: true
});
```

Source: [Bootstrap 5.3 Scrollspy](https://getbootstrap.com/docs/5.3/components/scrollspy/)

### Anti-Patterns to Avoid

- **Throttled scroll events for sticky detection:** IntersectionObserver is more performant
- **jQuery animate() for smooth scroll:** CSS `scroll-behavior` is native and simpler
- **Reinitializing SmartMenus:** Site has no dropdowns; remove entirely
- **Using deprecated `data-bs-offset`:** Bootstrap 5.1.3+ uses `rootMargin`

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll position threshold | Manual scroll event + position check | IntersectionObserver | Off-main-thread, no scroll jank |
| Smooth scrolling | jQuery animate() + easing plugin | CSS `scroll-behavior: smooth` | Zero JavaScript, native browser |
| Nav link highlighting | Custom scroll tracking | Bootstrap 5 Scrollspy | Already loaded, handles edge cases |
| Mobile menu toggle | Custom JS | Bootstrap 5 Collapse | Already loaded, accessibility built-in |

**Key insight:** The current implementation uses jQuery plugins for problems that browsers now solve natively. Modern APIs (IntersectionObserver, CSS smooth scroll) are more performant and require no dependencies.

## Common Pitfalls

### Pitfall 1: Clone Not Updating with Original

**What goes wrong:** Cloned navbar doesn't reflect dynamic changes to original
**Why it happens:** Clone is created once at init, not synchronized
**How to avoid:** Clone is static; ensure hamburger click handlers work on both navbars
**Warning signs:** Mobile menu toggle breaks on sticky header

### Pitfall 2: Scroll Margin Ignored

**What goes wrong:** Anchor links scroll target under fixed header
**Why it happens:** Fixed header covers scroll target
**How to avoid:** Add `scroll-margin-top` CSS to all section elements
**Warning signs:** Clicking nav links hides section heading under header

### Pitfall 3: Scrollspy rootMargin Format

**What goes wrong:** Scrollspy activates wrong nav link
**Why it happens:** Incorrect rootMargin syntax (must match CSS margin format)
**How to avoid:** Use percentage for bottom margin: `'0px 0px -40%'`
**Warning signs:** Nav links highlight too early or too late

### Pitfall 4: requestAnimationFrame Missing

**What goes wrong:** Scroll jank when hiding/showing header
**Why it happens:** Scroll handler modifies DOM without batching
**How to avoid:** Wrap scroll handler updates in `requestAnimationFrame`
**Warning signs:** Visible stuttering during fast scrolls

### Pitfall 5: prefers-reduced-motion Ignored

**What goes wrong:** Users with motion sensitivity experience discomfort
**Why it happens:** Smooth scroll enabled without accessibility check
**How to avoid:** Wrap `scroll-behavior: smooth` in `@media (prefers-reduced-motion: no-preference)`
**Warning signs:** Accessibility audit failures, user complaints

## Code Examples

### Complete Sticky Header Replacement

```javascript
/**
 * Vanilla JS Sticky Header - Replaces Headhesive
 * Activates after scrolling past hero section (~350px)
 * Hides on scroll down, shows on scroll up
 */
(function() {
    'use strict';

    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Create sentinel at activation point
    var sentinel = document.createElement('div');
    sentinel.id = 'sticky-sentinel';
    sentinel.style.cssText = 'position:absolute;top:350px;height:1px;width:100%;pointer-events:none;';
    document.body.insertBefore(sentinel, document.body.firstChild);

    // Clone navbar for sticky version
    var clone = navbar.cloneNode(true);
    clone.classList.add('banner--clone', 'fixed');
    clone.classList.remove('absolute');
    document.body.insertBefore(clone, document.body.firstChild);

    // Observe sentinel for sticky activation
    var stickyObserver = new IntersectionObserver(function(entries) {
        var entry = entries[0];
        if (!entry.isIntersecting) {
            clone.classList.add('banner--stick');
            clone.classList.remove('banner--unstick');
        } else {
            clone.classList.remove('banner--stick');
            clone.classList.add('banner--unstick');
        }
    }, { threshold: 0 });

    stickyObserver.observe(sentinel);

    // Scroll direction detection for show/hide
    var lastScrollY = 0;
    var ticking = false;

    function onScroll() {
        var currentScrollY = window.pageYOffset;

        if (clone.classList.contains('banner--stick')) {
            if (currentScrollY > lastScrollY && currentScrollY > 400) {
                clone.classList.add('banner--hidden');
            } else {
                clone.classList.remove('banner--hidden');
            }
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
})();
```

### CSS for Show/Hide Animation

```css
/* Add to existing banner--clone styles */
.banner--clone.banner--hidden {
    transform: translateY(-100%);
}
```

### Hamburger Menu (Vanilla JS)

```javascript
/**
 * Hamburger menu toggle - replaces jQuery version
 * Works on both original and cloned navbar
 */
document.addEventListener('click', function(e) {
    // Toggle hamburger animation
    if (e.target.closest('.hamburger.animate')) {
        document.querySelectorAll('.hamburger.animate').forEach(function(btn) {
            btn.classList.toggle('active');
        });
    }

    // Close mobile nav on link click (one-page sites)
    if (e.target.closest('.onepage .navbar .nav li a')) {
        var openNav = document.querySelector('.navbar .navbar-collapse.show');
        if (openNav) {
            var collapse = bootstrap.Collapse.getInstance(openNav);
            if (collapse) collapse.hide();
        }
        document.querySelectorAll('.hamburger.animate').forEach(function(btn) {
            btn.classList.remove('active');
        });
    }
});
```

### CSS Smooth Scroll

```css
/* Accessibility-aware smooth scrolling */
@media (prefers-reduced-motion: no-preference) {
    html {
        scroll-behavior: smooth;
    }
}

/* Offset for fixed header */
section[id] {
    scroll-margin-top: 68px;  /* Match shrinked_header_height */
}

/* First section needs full header height offset */
section:first-of-type {
    scroll-margin-top: 0;  /* Hero doesn't need offset */
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Headhesive.js | IntersectionObserver | Browser support 2019 | Remove 2KB library |
| SmartMenus | Remove entirely | N/A | Remove 28KB, site has no dropdowns |
| jQuery animate() | CSS scroll-behavior | Browser support 2022 | Remove jQuery Easing dependency |
| data-bs-offset | data-bs-root-margin | Bootstrap 5.1.3 | Proper offset handling |
| Manual scroll tracking | requestAnimationFrame batching | Best practice | Smoother performance |

**Deprecated/outdated:**
- SmartMenus: Last updated 2017, requires jQuery, unnecessary for flat navigation
- Headhesive: Replaced by native IntersectionObserver which is more performant
- jQuery Easing: CSS `scroll-behavior` handles all common cases

## Open Questions

1. **Header height synchronization**
   - What we know: Original header height is calculated at load time for section offsets
   - What's unclear: Whether to use CSS custom properties for dynamic height
   - Recommendation: Use hardcoded values (68px) since header height is fixed

2. **Cloned navbar and Bootstrap Collapse**
   - What we know: Clone may need separate Collapse instance for mobile menu
   - What's unclear: Whether Bootstrap auto-initializes on cloned elements
   - Recommendation: Test mobile menu on both original and cloned navbar; may need manual init

## Sources

### Primary (HIGH confidence)
- [Bootstrap 5.3 Scrollspy](https://getbootstrap.com/docs/5.3/components/scrollspy/) - rootMargin, smoothScroll options
- [Bootstrap 5.3 Navbar](https://getbootstrap.com/docs/5.3/components/navbar/) - Collapse integration
- [MDN - IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) - API usage, browser support
- [MDN - scroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior) - CSS property, limitations
- [Chrome Developers - Sticky Headers](https://developers.google.com/web/updates/2017/09/sticky-headers) - Sentinel pattern

### Secondary (MEDIUM confidence)
- [Envato Tuts+ - Hide/Reveal Sticky Header](https://webdesign.tutsplus.com/how-to-hide-reveal-a-sticky-header-on-scroll-with-javascript--cms-33756t) - Scroll direction pattern
- [Smashing Magazine - Dynamic Header](https://www.smashingmagazine.com/2021/07/dynamic-header-intersection-observer/) - IntersectionObserver approach
- [CSS-Tricks - prefers-reduced-motion](https://css-tricks.com/almanac/rules/m/media/prefers-reduced-motion/) - Accessibility pattern

### Project-Specific
- `/Users/mitchellmeffert/Git/Personal/cassiecayphotography.com/style/js/custom-scripts.js` - Current implementation
- `/Users/mitchellmeffert/Git/Personal/cassiecayphotography.com/style/js/custom-plugins.js` - Headhesive, SmartMenus source
- `/Users/mitchellmeffert/Git/Personal/cassiecayphotography.com/style/style.css` - Banner CSS (lines 870-905)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All recommendations use native browser APIs with full support
- Architecture: HIGH - Patterns from official documentation and authoritative sources
- Pitfalls: MEDIUM - Based on common issues, but specific to this codebase

**Research date:** 2026-01-20
**Valid until:** 2026-04-20 (90 days - stable APIs, no major changes expected)
