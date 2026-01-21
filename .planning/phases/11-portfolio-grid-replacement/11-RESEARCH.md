# Phase 11: Portfolio Grid Replacement - Research

**Researched:** 2026-01-20
**Domain:** CSS Grid masonry layouts, vanilla JS filtering, portfolio animations
**Confidence:** MEDIUM

## Summary

This phase involves replacing Cubeportfolio (a jQuery-dependent portfolio grid plugin) with a modern CSS Grid layout and vanilla JavaScript filtering system. The current portfolio displays 76 images across 5 categories (Family, Milestone, Senior, Newborn, Couples) with a masonry-style layout and animated filtering.

**Key findings:**
- Native CSS masonry (`grid-template-rows: masonry`) is NOT production-ready (experimental, limited browser support until mid-2026)
- Muuri (23.8KB gzipped) is the best-fit library for masonry + filtering without jQuery
- GLightbox `reload()` method handles post-filter reinitialization
- View Transitions API can enhance filter animations but requires fallback
- Bootstrap 5 breakpoints align well with current Cubeportfolio media queries

**Primary recommendation:** Use Muuri for layout and filtering with CSS Grid fallback styling, integrate with existing GLightbox via `reload()` after filter operations, add View Transitions API as progressive enhancement.

## Current Implementation Audit

### Cubeportfolio Configuration

From `custom-scripts.js` (lines 122-156):

```javascript
$cubemosaic.cubeportfolio({
    filters: '#cube-grid-mosaic-filter',
    loadMore: '#cube-grid-mosaic-more',
    loadMoreAction: 'click',
    layoutMode: 'mosaic',
    mediaQueries: [
        {width: 1440, cols: 4},
        {width: 1024, cols: 4},
        {width: 768, cols: 3},
        {width: 575, cols: 2},
        {width: 320, cols: 1}
    ],
    defaultFilter: '*',
    animationType: 'quicksand',
    gapHorizontal: 0,
    gapVertical: 0,
    gridAdjustment: 'responsive',
    caption: 'fadeIn',
    displayType: 'bottomToTop',
    displayTypeSpeed: 100
});
```

### Current HTML Structure

Filter buttons (lines 205-212):
```html
<div id="cube-grid-mosaic-filter" class="cbp-filter-container text-center">
    <div data-filter="*" class="cbp-filter-item-active cbp-filter-item">All</div>
    <div data-filter=".cat5" class="cbp-filter-item">Couples</div>
    <div data-filter=".cat1" class="cbp-filter-item">Family</div>
    <div data-filter=".cat2" class="cbp-filter-item">Milestone</div>
    <div data-filter=".cat4" class="cbp-filter-item">Newborn</div>
    <div data-filter=".cat3" class="cbp-filter-item">Senior</div>
</div>
```

Portfolio items (76 total):
```html
<div id="cube-grid-mosaic" class="cbp light-gallery">
    <div class="cbp-item cat1">
        <figure class="overlay overlay2">
            <a href="images-optimized/jpeg/full/cassiecay-F1-full.jpg">
                <picture>...</picture>
            </a>
        </figure>
    </div>
    <!-- ... 75 more items ... -->
</div>
```

### Category Distribution

| Category | Class | Count | Percentage |
|----------|-------|-------|------------|
| Family | cat1 | 28 | 37% |
| Milestone | cat2 | 20 | 26% |
| Senior | cat3 | 3 | 4% |
| Newborn | cat4 | 15 | 20% |
| Couples | cat5 | 10 | 13% |
| **Total** | | **76** | 100% |

### GLightbox Integration

Current initialization (lines 111-118):
```javascript
var lightbox = GLightbox({
    selector: '.light-gallery a',
    touchNavigation: true,
    loop: true,
    closeOnOutsideClick: true,
    keyboardNavigation: true,
    slideEffect: 'fade'
});
```

Post-filter reload (lines 153-156):
```javascript
$cubemosaic.on('onFilterComplete.cbp', function() {
    lightbox.reload();
});
```

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Muuri | 0.9.5 | Layout + filtering | Only vanilla JS lib with masonry + filtering; 23.8KB gzipped |
| CSS Grid | native | Base layout structure | Browser-native, no JS required for basic grid |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| View Transitions API | native | Enhanced animations | Progressive enhancement for filter transitions |
| GLightbox | 3.3.1 | Lightbox (existing) | Already integrated, use `reload()` method |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Muuri | MiniMasonry + custom filtering | MiniMasonry has no filtering; would need custom code |
| Muuri | Native CSS masonry | Not production-ready until mid-2026; no filtering |
| Muuri | Isotope | Similar but more focused on filtering; larger bundle |
| Muuri | Masonry.js + custom filtering | Masonry.js has no built-in filtering |

**Installation:**
```bash
npm install muuri
```

Or CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/muuri@0.9.5/dist/muuri.min.js"></script>
```

## Architecture Patterns

### Recommended Project Structure

Keep filtering and layout code in `custom-scripts.js` to match existing patterns:

```
style/
├── js/
│   ├── custom-scripts.js     # Add Muuri init, filtering logic
│   └── muuri.min.js          # New library (or via CDN)
└── css/
    └── style.css             # Portfolio grid styles (replace cbp styles)
```

### Pattern 1: Muuri Grid Initialization

**What:** Initialize Muuri on existing DOM structure
**When to use:** On page load, after DOM ready

```javascript
// Initialize Muuri grid
var grid = new Muuri('#portfolio-grid', {
    items: '.portfolio-item',
    layout: {
        fillGaps: true,  // Enable masonry-style packing
        horizontal: false,
        alignRight: false,
        alignBottom: false
    },
    showDuration: 300,
    hideDuration: 200,
    visibleStyles: {
        opacity: 1,
        transform: 'scale(1)'
    },
    hiddenStyles: {
        opacity: 0,
        transform: 'scale(0.5)'
    }
});
```

### Pattern 2: Category Filtering with GLightbox Reload

**What:** Filter items by category and refresh lightbox
**When to use:** On filter button click

```javascript
// Filter function with GLightbox integration
function filterPortfolio(category) {
    grid.filter(function(item) {
        if (category === '*') return true;
        return item.getElement().classList.contains(category);
    }, {
        onFinish: function() {
            // Reinitialize GLightbox after filter animation completes
            lightbox.reload();
        }
    });
}

// Bind filter buttons
document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var category = this.dataset.filter;

        // Update active state
        document.querySelectorAll('.filter-btn').forEach(function(b) {
            b.classList.remove('active');
        });
        this.classList.add('active');

        // Apply filter
        filterPortfolio(category === '*' ? '*' : category.replace('.', ''));
    });
});
```

### Pattern 3: Responsive Column Layout via CSS

**What:** CSS Grid with responsive columns matching current breakpoints
**When to use:** Base styling for portfolio grid

```css
#portfolio-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
}

/* Match current Cubeportfolio breakpoints */
@media (max-width: 1439px) {
    #portfolio-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 1023px) {
    #portfolio-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 767px) {
    #portfolio-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 574px) {
    #portfolio-grid {
        grid-template-columns: 1fr;
    }
}
```

### Pattern 4: View Transitions Enhancement (Progressive)

**What:** Use View Transitions API for smoother filter animations
**When to use:** Modern browsers only, as enhancement

```javascript
function filterWithTransition(category) {
    if (document.startViewTransition) {
        document.startViewTransition(function() {
            filterPortfolio(category);
        });
    } else {
        // Fallback for older browsers
        filterPortfolio(category);
    }
}
```

### Anti-Patterns to Avoid

- **Hand-rolling masonry calculations:** Muuri handles bin-packing algorithm; don't reimplement
- **Using display:none for filtering:** Breaks animations; use opacity/transform via Muuri's show/hide
- **Multiple GLightbox instances:** Keep single instance, use `reload()` method
- **Synchronous layout on each filter:** Muuri batches DOM operations; don't interfere with queuing

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Masonry layout | Custom position calculations | Muuri `fillGaps: true` | Bin-packing algorithm is complex; handles edge cases |
| Filter animations | CSS transition toggling | Muuri show/hide with Web Animations API | Batched DOM ops prevent layout thrashing |
| Responsive columns | JS resize listeners | CSS Grid + media queries | Browser handles resize; no JS overhead |
| Lightbox refresh | Manual element tracking | GLightbox `reload()` | Handles all edge cases internally |

**Key insight:** With 76 items, manual DOM manipulation during filtering causes significant layout thrashing. Muuri's batched operations and Web Animations API (running off main thread) are essential for smooth 60fps animations.

## Common Pitfalls

### Pitfall 1: Lazy Loading Interference

**What goes wrong:** Muuri calculates initial layout before images load, causing incorrect item dimensions
**Why it happens:** Images with `loading="lazy"` don't have dimensions at init time
**How to avoid:** Either:
1. Remove `loading="lazy"` from portfolio images (current Cubeportfolio approach)
2. Use explicit width/height on images
3. Use `imagesLoaded` library to trigger `grid.refreshItems().layout()` after load
**Warning signs:** Items overlap or have gaps after page load

### Pitfall 2: GLightbox Not Updating After Filter

**What goes wrong:** Clicking filtered image doesn't open lightbox, or wrong images shown
**Why it happens:** GLightbox caches element references; doesn't auto-detect visibility changes
**How to avoid:** Call `lightbox.reload()` in Muuri's `onFinish` callback
**Warning signs:** Lightbox shows hidden items or skips visible ones

### Pitfall 3: Filter Button State Not Updating

**What goes wrong:** Multiple buttons appear active, or none appear active
**Why it happens:** Not removing active class from all buttons before adding to clicked
**How to avoid:** Clear all active states, then set on clicked button
**Warning signs:** UI shows wrong filter state

### Pitfall 4: CSS Grid Conflicting with Muuri

**What goes wrong:** Items positioned incorrectly or layout "jumps"
**Why it happens:** Muuri uses absolute positioning; CSS Grid tries to flow items
**How to avoid:** Muuri container should have `position: relative`; items get `position: absolute` from Muuri
**Warning signs:** Double-layout effect, items in wrong positions

### Pitfall 5: Mobile Performance Issues

**What goes wrong:** Filter animations stutter on mobile devices
**Why it happens:** Too many DOM operations or heavy animations
**How to avoid:**
- Use Muuri's default 300ms duration (not longer)
- Test on real devices, not just DevTools throttling
- Consider reducing visible items on mobile via "load more" pattern
**Warning signs:** >16ms frame times, visible jank on filter

## Code Examples

Verified patterns from official sources:

### Full Muuri Initialization with Options

```javascript
// Source: https://docs.muuri.dev/grid-options.html
var grid = new Muuri('#portfolio-grid', {
    // Item elements
    items: '.portfolio-item',

    // Layout algorithm
    layout: {
        fillGaps: true,     // Pack items without strict order
        horizontal: false,  // Column-based layout
        alignRight: false,
        alignBottom: false
    },

    // Animation settings
    showDuration: 300,
    hideDuration: 200,
    layoutDuration: 300,

    // Visibility styles (animated)
    visibleStyles: {
        opacity: 1,
        transform: 'scale(1)'
    },
    hiddenStyles: {
        opacity: 0,
        transform: 'scale(0.5)'
    },

    // Item class configuration
    itemClass: 'portfolio-item',
    itemVisibleClass: 'portfolio-item--visible',
    itemHiddenClass: 'portfolio-item--hidden'
});
```

### Filter Method with Callback

```javascript
// Source: https://docs.muuri.dev/grid-methods.html
grid.filter(function(item) {
    var element = item.getElement();
    return element.classList.contains('cat1');
}, {
    instant: false,         // Animate the transition
    syncWithLayout: true,   // Sync with layout animation
    onFinish: function() {
        console.log('Filter complete');
        lightbox.reload();  // Refresh GLightbox
    },
    layout: true            // Trigger layout after filter
});
```

### Event Listeners for Animation Completion

```javascript
// Source: https://docs.muuri.dev/grid-events.html

// When filter operation completes (items shown/hidden)
grid.on('filter', function(shownItems, hiddenItems) {
    console.log('Filtered: ' + shownItems.length + ' shown, ' + hiddenItems.length + ' hidden');
});

// When show animations complete
grid.on('showEnd', function(items) {
    console.log('Show animation complete for ' + items.length + ' items');
});

// When hide animations complete
grid.on('hideEnd', function(items) {
    console.log('Hide animation complete for ' + items.length + ' items');
});

// When layout positioning completes
grid.on('layoutEnd', function(items) {
    // Filter out inactive items
    var activeItems = items.filter(function(item) {
        return item.isActive();
    });
    console.log('Layout complete for ' + activeItems.length + ' active items');
});
```

### Responsive Layout Refresh on Resize

```javascript
// Debounced resize handler
var resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        grid.refreshItems().layout();
    }, 200);
});
```

### HTML Structure Migration

**From (Cubeportfolio):**
```html
<div id="cube-grid-mosaic" class="cbp light-gallery">
    <div class="cbp-item cat1">
        <figure class="overlay overlay2">
            <a href="full-image.jpg"><picture>...</picture></a>
        </figure>
    </div>
</div>
```

**To (Muuri):**
```html
<div id="portfolio-grid" class="light-gallery">
    <div class="portfolio-item cat1">
        <div class="portfolio-item-content">
            <figure class="overlay overlay2">
                <a href="full-image.jpg"><picture>...</picture></a>
            </figure>
        </div>
    </div>
</div>
```

Note: Muuri wraps item content in an inner div during initialization, but you can pre-wrap for CSS control.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| jQuery + Cubeportfolio | Muuri (vanilla JS) | N/A (migration) | Remove ~80KB of jQuery + plugin code |
| CSS masonry polyfills | Native CSS masonry | Mid-2026 (projected) | Future: can remove Muuri for layout |
| Manual filter animations | View Transitions API | Firefox 144 (Jan 2026) | Cross-browser support now available |
| imagesLoaded + manual layout | Native lazy loading + explicit dimensions | 2020+ | Simpler approach if dimensions known |

**Deprecated/outdated:**
- Cubeportfolio: Last updated 2018, requires jQuery, no longer maintained
- CSS column-count masonry: Breaks reading order (top-to-bottom instead of left-to-right)
- `display: masonry` proposal: Replaced by `display: grid-lanes` (consensus Jan 2025)

## Open Questions

Things that couldn't be fully resolved:

1. **Exact image dimensions for Muuri layout**
   - What we know: Current images have variable dimensions (masonry style)
   - What's unclear: Whether to add explicit width/height attributes or use imagesLoaded
   - Recommendation: Test both approaches; explicit dimensions preferred for CLS

2. **"Load More" functionality**
   - What we know: Cubeportfolio has loadMore option (not currently used extensively)
   - What's unclear: Whether to implement load more or show all 76 items
   - Recommendation: Show all; 76 items with lazy loading is manageable

3. **View Transitions API adoption**
   - What we know: Now supported in all major browsers (Chrome 111+, Firefox 144+, Safari 18+)
   - What's unclear: Performance on mobile with 76 items
   - Recommendation: Implement as progressive enhancement; test on real devices

## Sources

### Primary (HIGH confidence)
- [Muuri Docs - Grid Methods](https://docs.muuri.dev/grid-methods.html) - filter(), show(), hide() documentation
- [Muuri Docs - Grid Options](https://docs.muuri.dev/grid-options.html) - layout, animation configuration
- [Muuri Docs - Grid Events](https://docs.muuri.dev/grid-events.html) - event listeners for filtering
- [GLightbox GitHub](https://github.com/biati-digital/glightbox) - reload() method for dynamic content

### Secondary (MEDIUM confidence)
- [MDN - Masonry Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Masonry_layout) - native CSS masonry status
- [Chrome Developers - View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions) - API usage
- [Bootstrap 5 Breakpoints](https://getbootstrap.com/docs/5.3/layout/breakpoints/) - responsive tier definitions

### Tertiary (LOW confidence)
- [CSS-Tricks - Masonry Layout is Now grid-lanes](https://css-tricks.com/masonry-layout-is-now-grid-lanes/) - future direction
- [Best of JS - Muuri](https://bestofjs.org/projects/muuri) - bundle size (23.8KB gzipped)
- Web search results for filtering patterns - various blog posts

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM - Muuri is well-documented but migration from Cubeportfolio untested
- Architecture: HIGH - Patterns are well-established in official docs
- Pitfalls: MEDIUM - Based on common issues in GitHub issues and community posts

**Research date:** 2026-01-20
**Valid until:** 2026-03-20 (60 days - Muuri stable, CSS masonry still evolving)
