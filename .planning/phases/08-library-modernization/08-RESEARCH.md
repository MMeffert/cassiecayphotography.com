# Phase 8: Library Modernization - Research

**Researched:** 2026-01-20
**Domain:** JavaScript slider/lightbox libraries, jQuery dependency management
**Confidence:** MEDIUM (verified with official docs, some complexity around jQuery removal)

## Summary

This phase involves replacing Revolution Slider (~420KB) with Embla Carousel (~7KB) and LightGallery with GLightbox (~11KB) for the hero slider and portfolio lightbox respectively. The current site uses Revolution Slider 5.4.8 for a simple two-image fullscreen hero with static text overlays, and LightGallery for the portfolio gallery lightbox.

**Key findings:**
- The Revolution Slider implementation is vastly overengineered for the use case (2 images, fade transition, static text overlay)
- LightGallery is already relatively light but GLightbox offers a smaller footprint with equivalent features
- jQuery removal is blocked by Bootstrap 4 and Cubeportfolio dependencies - recommend deferring jQuery removal to separate phase
- Swiper (currently used for quote slider) could be retained or replaced with Embla for consistency

**Primary recommendation:** Replace Revolution Slider with Embla Carousel + CSS for text overlays, replace LightGallery with GLightbox, but retain jQuery for now due to Bootstrap 4 and Cubeportfolio dependencies.

## Current Implementation Audit

### Revolution Slider

**Files loaded (from index.html lines 1323-1335):**
| File | Size | Purpose |
|------|------|---------|
| jquery.themepunch.tools.min.js | 111KB | Core utilities |
| jquery.themepunch.revolution.min.js | 65KB | Main slider engine |
| revolution.extension.actions.min.js | 8KB | Actions extension |
| revolution.extension.carousel.min.js | 8KB | Carousel mode |
| revolution.extension.kenburn.min.js | 4KB | Ken Burns effect |
| revolution.extension.layeranimation.min.js | 56KB | Layer animations |
| revolution.extension.migration.min.js | 26KB | Version migration |
| revolution.extension.navigation.min.js | 26KB | Navigation controls |
| revolution.extension.parallax.min.js | 11KB | Parallax effects |
| revolution.extension.slideanims.min.js | 29KB | Slide animations |
| revolution.extension.video.min.js | 26KB | Video support |
| revolution.addon.filmstrip.min.js | - | Filmstrip addon |
| revolution.addon.typewriter.min.js | - | Typewriter addon |
| **Total** | **~420KB** | |

**Current configuration (from scripts.js lines 387-423):**
```javascript
$('#slider').revolution({
    sliderType: "standard",
    sliderLayout: "fullscreen",
    spinner: "spinner2",
    delay: 9000,  // 9 second auto-advance
    shadow: 0,
    gridwidth: [1140, 1024, 778, 480],
    responsiveLevels: [1240, 1024, 778, 480],
    navigation: {
        arrows: { enable: true, hide_onleave: true, hide_under: 1024, style: 'uranus' },
        touch: { touchenabled: 'on', swipe_threshold: 75 },
        bullets: { enable: true, style: 'zeus', hide_onleave: true }
    }
});
```

**Features actually used:**
- Fullscreen layout
- Fade transition between 2 slides
- 9 second auto-advance delay
- Static text overlays (positioned via data attributes)
- Thumbnail bullets (though decision says not needed)
- Arrows (though decision says not needed)

**Features NOT needed (per CONTEXT.md):**
- Navigation arrows
- Bullet pagination
- Touch/swipe
- Pause on hover (explicitly should be DISABLED)

### LightGallery

**Current configuration (from custom-scripts.js lines 71-86):**
```javascript
$lg.lightGallery({
    thumbnail: false,
    selector: 'a',
    mode: 'lg-fade',
    download: false,
    autoplayControls: false,
    zoom: false,
    fullScreen: false,
    videoMaxWidth: '1000px',
    loop: false,
    hash: true,
    mousewheel: true,
    videojs: true,
    share: false
});
```

**Features used:**
- Fade transition mode
- Gallery navigation (prev/next via mousewheel)
- Hash-based URLs
- No thumbnails, download, zoom, fullscreen, share

**Gallery grouping:** All images in `.light-gallery` container are treated as one gallery.

### jQuery Usage Audit

**Direct jQuery usage in custom-scripts.js (28 occurrences):**

| Component | jQuery Methods Used | Difficulty to Replace |
|-----------|---------------------|----------------------|
| Sticky header (Headhesive) | `$(".navbar").length`, `$.SmartMenus.Bootstrap.init` | MEDIUM - plugin dependent |
| Hamburger menu | `toggleClass`, `on('click')`, `collapse('hide')` | EASY |
| Swiper init | `$(this).find()`, `addClass` | MEDIUM - Swiper API |
| LightGallery | `$lg.lightGallery()`, `$lg.data()` | WILL BE REPLACED |
| Cubeportfolio | `$cubemosaic.cubeportfolio()`, `on()` | HARD - plugin dependent |
| Background images | `$(".bg-image").css()` | EASY |
| ScrollUp | `$.scrollUp()` | MEDIUM - plugin dependent |
| Mobile detection | `addClass` | EASY |
| Section offsets | `outerHeight()`, `css()` | EASY |
| Smooth scroll | `$('html,body').animate()` | MEDIUM |

**Plugins requiring jQuery (from custom-plugins.js header):**
1. SmartMenus (navbar dropdown)
2. Headhesive (sticky header)
3. jQuery Easing (smooth scroll)
4. Swiper (quote slider) - HAS vanilla JS version
5. LightGallery (lightbox) - WILL BE REPLACED
6. imagesLoaded (Cubeportfolio dependency)
7. Cubeportfolio (portfolio grid)
8. scrollUp (back to top)

**Bootstrap 4 dependency:** Bootstrap 4.x requires jQuery for its JavaScript components (collapse, modal, etc.). The hamburger menu uses Bootstrap's collapse functionality.

**Recommendation:** jQuery removal is OUT OF SCOPE for Phase 8. It would require:
1. Upgrading to Bootstrap 5 (breaking changes)
2. Replacing Cubeportfolio with vanilla JS alternative (Muuri, Isotope)
3. Replacing SmartMenus, Headhesive, scrollUp with vanilla alternatives
4. Significant testing

## Replacement Library Analysis

### Embla Carousel

**Version:** 8.6.0 (current)
**Bundle size:** ~7KB gzipped (core), +1KB for autoplay plugin
**Source:** [Embla Carousel](https://www.embla-carousel.com/)

**Capabilities:**
| Feature | Supported | Notes |
|---------|-----------|-------|
| Auto-advance | Yes | Via autoplay plugin |
| Fade transition | Yes | Via CSS or fade plugin |
| Fullscreen | Yes | Via CSS |
| Loop | Yes | Native option |
| Disable pause-on-hover | Yes | `stopOnMouseEnter: false` |
| Disable interaction stop | Yes | `stopOnInteraction: false` |
| Custom timing | Yes | `delay` option in ms |
| Responsive | Yes | Native |
| Touch/swipe | Yes | But can be disabled |
| Dependency-free | Yes | Vanilla JS |

**Autoplay plugin configuration:**
```javascript
import EmblaCarousel from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'

const emblaApi = EmblaCarousel(viewportNode, { loop: true }, [
  Autoplay({
    delay: 6000,               // 6 seconds between slides
    stopOnInteraction: false,  // Don't stop on user interaction
    stopOnMouseEnter: false,   // Don't pause on hover
    playOnInit: true           // Start automatically
  })
])
```

**HTML structure required:**
```html
<div class="embla">
  <div class="embla__viewport">
    <div class="embla__container">
      <div class="embla__slide">Slide 1</div>
      <div class="embla__slide">Slide 2</div>
    </div>
  </div>
</div>
```

**CSS required:**
```css
.embla__viewport { overflow: hidden; }
.embla__container { display: flex; }
.embla__slide { flex: 0 0 100%; min-width: 0; }
```

### GLightbox

**Version:** 3.3.0 (current)
**Bundle size:** ~11KB gzipped
**Source:** [GLightbox GitHub](https://github.com/biati-digital/glightbox)

**Capabilities:**
| Feature | Supported | Notes |
|---------|-----------|-------|
| Gallery navigation | Yes | Arrows, keyboard, swipe |
| Keyboard support | Yes | Escape, arrows, Tab, Enter |
| Loop | Yes | `loop: true` option |
| Fade transition | Yes | Default or configurable |
| Gallery grouping | Yes | `data-gallery` attribute |
| No captions | Yes | Don't set `data-title` |
| Touch/swipe | Yes | Native |
| Dependency-free | Yes | Vanilla JS |

**Initialization:**
```javascript
const lightbox = GLightbox({
  selector: '.light-gallery a',
  touchNavigation: true,
  loop: true,
  keyboardNavigation: true,
  slideEffect: 'fade'
});
```

**HTML structure (minimal change needed):**
```html
<a href="full-image.jpg" class="glightbox" data-gallery="portfolio">
  <img src="thumbnail.jpg" alt="">
</a>
```

## Migration Approach

### HTML Changes Required

**Hero Slider:**
```html
<!-- BEFORE: Revolution Slider -->
<div class="rev_slider_wrapper fullscreen-container">
  <div id="slider" class="rev_slider fullscreenbanner bg-dark" data-version="5.4.8">
    <ul>
      <li data-transition="fade"><img src="..." /></li>
    </ul>
    <div class="tp-static-layers">
      <div class="tp-caption ...">text</div>
    </div>
  </div>
</div>

<!-- AFTER: Embla Carousel -->
<div class="hero-slider embla">
  <div class="embla__viewport">
    <div class="embla__container">
      <div class="embla__slide">
        <img src="..." alt="Cassie Cay Photography" />
      </div>
      <div class="embla__slide">
        <img src="..." alt="Cassie Cay Photography" />
      </div>
    </div>
  </div>
  <div class="hero-overlay">
    <span class="hero-tagline">capturing beautiful moments</span>
    <span class="hero-title">Cassie Cay Photography</span>
  </div>
</div>
```

**Portfolio Lightbox:**
```html
<!-- BEFORE -->
<div class="cbp light-gallery">
  <div class="cbp-item">
    <a href="full.jpg"><img src="thumb.jpg"></a>
  </div>
</div>

<!-- AFTER -->
<div class="cbp" id="portfolio-grid">
  <div class="cbp-item">
    <a href="full.jpg" class="glightbox" data-gallery="portfolio">
      <img src="thumb.jpg">
    </a>
  </div>
</div>
```

### JS Changes Required

**Remove from HTML:**
- All Revolution Slider script tags (lines 1323-1335)
- Revolution Slider initialization from scripts

**Add:**
```javascript
// Embla Carousel for hero
import EmblaCarousel from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'

const heroViewport = document.querySelector('.hero-slider .embla__viewport')
if (heroViewport) {
  const embla = EmblaCarousel(heroViewport, { loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: false })
  ])
}

// GLightbox for portfolio
import GLightbox from 'glightbox'

const portfolioLightbox = GLightbox({
  selector: '.glightbox',
  touchNavigation: true,
  loop: true,
  keyboardNavigation: true
})
```

### CSS Changes Required

**Add hero slider styles:**
```css
.hero-slider {
  position: relative;
  height: 100vh;
}

.hero-slider .embla__viewport {
  overflow: hidden;
  height: 100%;
}

.hero-slider .embla__container {
  display: flex;
  height: 100%;
}

.hero-slider .embla__slide {
  flex: 0 0 100%;
  min-width: 0;
}

.hero-slider .embla__slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Fade transition */
.hero-slider .embla__slide {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.hero-slider .embla__slide.is-selected {
  opacity: 1;
}

/* Text overlay */
.hero-overlay {
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px;
  text-align: right;
  color: white;
  z-index: 10;
}

.hero-tagline {
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 16px;
}

.hero-title {
  font-family: liebegerda, sans-serif;
  font-style: italic;
  font-size: 50px;
}
```

### Potential Breaking Changes

1. **Text overlay animations:** Current Revolution Slider has animated text entry. Embla won't replicate this automatically. Options:
   - Use CSS animations triggered on slide change
   - Keep text static (simpler, still professional)
   - **Recommendation:** Static text is fine per CONTEXT.md ("any smooth transition is acceptable")

2. **Cubeportfolio lightbox reinit:** Current code destroys and recreates LightGallery on "load more". GLightbox may need different approach:
   - GLightbox has `lightbox.reload()` method
   - Or use event delegation

3. **CSS class changes:** Revolution Slider has many CSS classes. Need to ensure no site styles depend on these.

## Recommendations

### jQuery Keep vs Remove Decision

**KEEP jQuery for Phase 8.**

Rationale:
- Bootstrap 4 requires jQuery for collapse (hamburger menu)
- Cubeportfolio requires jQuery (portfolio grid filtering)
- SmartMenus requires jQuery (navbar)
- Headhesive requires jQuery (sticky header)
- ScrollUp requires jQuery (back to top button)

Removing jQuery would require:
1. Upgrade Bootstrap 4 to Bootstrap 5 (breaking changes, CSS updates)
2. Replace Cubeportfolio with Muuri or Isotope (significant refactor)
3. Replace all jQuery plugins with vanilla alternatives

**Recommendation:** Defer jQuery removal to Phase 9 or later. Phase 8 should focus on the slider/lightbox replacement only.

### Implementation Order

1. **Replace LightGallery with GLightbox first** (lower risk)
   - Add GLightbox CSS/JS
   - Update HTML data attributes
   - Update initialization
   - Test gallery navigation
   - Remove LightGallery from custom-plugins.js

2. **Replace Revolution Slider with Embla second** (higher risk)
   - Add Embla CSS/JS
   - Create new hero HTML structure
   - Add text overlay with CSS
   - Test auto-advance and transitions
   - Remove Revolution Slider files

3. **Clean up**
   - Remove unused Revolution Slider CSS files
   - Remove unused Revolution Slider JS files
   - Update build process if applicable

### Risk Mitigation

1. **Test each replacement independently** before removing old code
2. **Keep Revolution Slider files** initially (don't delete until verified)
3. **Git revert** is simple rollback strategy (single-page site, simple deployment)
4. **Test on mobile** - ensure touch behavior works (even though passive viewing)
5. **Test Cubeportfolio integration** - ensure filtering still triggers lightbox correctly

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Embla Carousel | 8.6.0 | Hero slider | Lightweight (~7KB), no dependencies, active maintenance |
| embla-carousel-autoplay | 8.6.0 | Auto-advance | Official plugin, handles all timing |
| GLightbox | 3.3.0 | Portfolio lightbox | Lightweight (~11KB), no dependencies, full-featured |

### Supporting (Retained)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| jQuery | 3.x | Plugin dependency | Required by Bootstrap 4, Cubeportfolio |
| Bootstrap | 4.x | Layout/components | Existing dependency |
| Cubeportfolio | 4.x | Portfolio grid | Filtering functionality |
| Swiper | 5.x+ | Quote slider | Already in use, works well |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Embla | Swiper | Swiper is larger (~45KB) but already used for quotes |
| GLightbox | PhotoSwipe | PhotoSwipe has more features but larger |
| Keep Revolution | - | Massive overkill for 2 images |

**Installation:**
```bash
npm install embla-carousel embla-carousel-autoplay glightbox
```

Or via CDN:
```html
<script src="https://unpkg.com/embla-carousel/embla-carousel.umd.js"></script>
<script src="https://unpkg.com/embla-carousel-autoplay/embla-carousel-autoplay.umd.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css">
<script src="https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js"></script>
```

## Architecture Patterns

### Recommended Project Structure
```
style/
├── css/
│   └── hero-slider.css      # New Embla styles
├── js/
│   ├── custom-plugins.js    # Remove LightGallery, add GLightbox
│   ├── custom-scripts.js    # Update slider/lightbox init
│   └── jquery.min.js        # Keep for now
└── revolution/              # DELETE entire folder after migration
```

### Pattern 1: Embla with CSS Fade Transitions
**What:** Use CSS opacity transitions instead of Embla's default slide
**When to use:** Fullscreen hero sliders with simple transitions
**Example:**
```css
/* Source: Embla docs + custom */
.embla__container {
  display: flex;
  height: 100%;
}

.embla__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
}

.embla__slide.is-selected {
  opacity: 1;
  z-index: 1;
}
```

### Pattern 2: GLightbox with Dynamic Content
**What:** Reinitialize lightbox after content changes (filtering)
**When to use:** When Cubeportfolio filters change visible items
**Example:**
```javascript
// Source: GLightbox docs
let lightbox = GLightbox({ selector: '.glightbox' });

// After Cubeportfolio filter
$cubemosaic.on('onFilterComplete.cbp', function() {
  lightbox.reload();
});
```

### Anti-Patterns to Avoid
- **Building custom slider from scratch:** Use proven library, don't reinvent
- **Keeping Revolution Slider "just in case":** Bloats bundle, remove completely
- **Trying to replicate exact Revolution animations:** Unnecessary complexity

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Auto-advancing slider | Custom setInterval loop | Embla Autoplay plugin | Handles edge cases, cleanup, visibility |
| Image lightbox | Custom modal | GLightbox | Keyboard nav, touch, preloading |
| Fade transitions | Complex JS animation | CSS opacity + transition | GPU accelerated, simpler |
| Gallery grouping | Manual array management | data-gallery attribute | Built into GLightbox |

**Key insight:** The current Revolution Slider is a perfect example of over-engineering. A 420KB library for 2 images with fade transition is excessive.

## Common Pitfalls

### Pitfall 1: Forgetting to Stop Autoplay on Unmount
**What goes wrong:** Memory leaks, multiple timers running
**Why it happens:** Embla autoplay continues after element removed
**How to avoid:** Call `embla.destroy()` on cleanup
**Warning signs:** Console errors, animations continuing after navigation

### Pitfall 2: GLightbox Not Finding Dynamic Elements
**What goes wrong:** Newly filtered images don't open in lightbox
**Why it happens:** GLightbox initializes once, doesn't watch DOM
**How to avoid:** Call `lightbox.reload()` after Cubeportfolio filter events
**Warning signs:** Click on image does nothing after filtering

### Pitfall 3: CSS Specificity Conflicts
**What goes wrong:** Slider styles broken by existing site CSS
**Why it happens:** Revolution Slider had highly specific CSS, new classes don't
**How to avoid:** Use scoped class names (`.hero-slider` not `.slider`)
**Warning signs:** Layout broken, slides stacked incorrectly

### Pitfall 4: Touch Events Conflicting
**What goes wrong:** Scroll blocked, touch not working
**Why it happens:** Embla captures touch events by default
**How to avoid:** Since we don't need touch, consider `draggable: false`
**Warning signs:** Page scroll issues on mobile

## Code Examples

### Complete Embla Hero Slider Setup
```javascript
// Source: Embla Carousel official docs
import EmblaCarousel from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'

document.addEventListener('DOMContentLoaded', function() {
  const heroNode = document.querySelector('.hero-slider')
  if (!heroNode) return

  const viewportNode = heroNode.querySelector('.embla__viewport')

  const emblaApi = EmblaCarousel(
    viewportNode,
    {
      loop: true,
      draggable: false  // No manual navigation per requirements
    },
    [
      Autoplay({
        delay: 6000,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        playOnInit: true
      })
    ]
  )

  // Optional: Add fade effect via class
  const slides = heroNode.querySelectorAll('.embla__slide')
  const setSelectedClass = () => {
    const selected = emblaApi.selectedScrollSnap()
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-selected', index === selected)
    })
  }

  emblaApi.on('select', setSelectedClass)
  setSelectedClass() // Initial state
})
```

### Complete GLightbox Portfolio Setup
```javascript
// Source: GLightbox official docs
import GLightbox from 'glightbox'

document.addEventListener('DOMContentLoaded', function() {
  // Initialize lightbox
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    keyboardNavigation: true,
    closeOnOutsideClick: true,
    slideEffect: 'fade'
  })

  // Reinitialize after Cubeportfolio filtering (if using jQuery still)
  if (typeof $ !== 'undefined') {
    $('#cube-grid-mosaic').on('onFilterComplete.cbp', function() {
      lightbox.reload()
    })
  }
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Revolution Slider 5.x | Embla/Swiper/Glide | 2020+ | 95% size reduction |
| jQuery lightbox | GLightbox/PhotoSwipe | 2019+ | No jQuery dependency |
| jQuery plugins | Vanilla JS | 2018+ | Better performance |
| Bootstrap 4 | Bootstrap 5 | 2021 | jQuery-free option |

**Deprecated/outdated:**
- Revolution Slider: Still maintained but overkill for simple sliders
- LightGallery with jQuery: Has vanilla version but GLightbox is lighter
- jQuery for basic DOM: Modern browsers don't need it

## Open Questions

1. **Swiper retention:**
   - What we know: Swiper is used for quote slider, works well
   - What's unclear: Should it be replaced with Embla for consistency?
   - Recommendation: Keep Swiper - it's already integrated and works

2. **Build process integration:**
   - What we know: Site uses Vite for dist/ build
   - What's unclear: How to best bundle new libraries
   - Recommendation: Use CDN for simplicity, or add to Vite config

## Sources

### Primary (HIGH confidence)
- [Embla Carousel Official Docs](https://www.embla-carousel.com/) - Setup, autoplay plugin
- [GLightbox GitHub](https://github.com/biati-digital/glightbox) - Configuration options
- [npm embla-carousel](https://www.npmjs.com/package/embla-carousel) - Bundle size verification

### Secondary (MEDIUM confidence)
- [Bootstrap 5 jQuery removal announcement](https://getbootstrap.com/docs/5.0/getting-started/javascript/) - jQuery dependency info
- [Bundlephobia](https://bundlephobia.com/) - Size comparisons

### Tertiary (LOW confidence)
- WebSearch results for migration patterns - Cross-referenced with official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official documentation consulted, sizes verified
- Architecture: HIGH - Based on official examples
- Pitfalls: MEDIUM - Based on library docs and general patterns
- jQuery removal scope: HIGH - Verified Bootstrap 4 and Cubeportfolio dependencies

**Research date:** 2026-01-20
**Valid until:** 60 days (libraries are stable, no major changes expected)
