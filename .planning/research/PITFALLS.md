# Domain Pitfalls: Static Site Modernization

**Domain:** Photography portfolio static site modernization
**Researched:** 2026-01-19 (v1), 2026-01-20 (v2.0 jQuery/Bootstrap 5)
**Project Context:** jQuery/Bootstrap site, owner edits HTML in Dreamweaver

---

## v2.0 Milestone: jQuery Removal & Bootstrap 5 Migration

This section covers pitfalls specific to the v2.0 milestone: removing jQuery dependency entirely and migrating from Bootstrap 4 to Bootstrap 5.

**Executive Summary:** Three critical risk areas: (1) Bootstrap's `data-*` to `data-bs-*` namespace change silently breaks all interactive components, (2) Bootstrap 5's CSS class renaming (left/right to start/end) silently breaks responsive layouts, (3) the contact form's jQuery AJAX submission is the highest-risk custom code requiring careful migration to fetch API.

---

### Critical: Bootstrap Data Attribute Namespace Silent Failures

**Risk level:** HIGH

Bootstrap 5 changed all data attributes from `data-*` to `data-bs-*` (e.g., `data-toggle` to `data-bs-toggle`, `data-target` to `data-bs-target`). Components **silently fail** if old attributes remain - no console errors, just non-working components.

**Warning signs:**
- Mobile hamburger menu stops working (no collapse/expand)
- Modal dialogs don't open
- Tooltips/popovers don't appear
- No JavaScript console errors (Bootstrap 5 just ignores old attributes)

**Prevention strategy:**
1. Create comprehensive list of all `data-toggle`, `data-target`, `data-dismiss`, `data-spy`, `data-parent` attributes in HTML
2. Use find/replace to update ALL occurrences: `data-toggle` -> `data-bs-toggle`, etc.
3. Test every interactive component after migration
4. Add CI check: grep for `data-toggle=` (without `-bs-`) to catch regressions

**Current project impact (lines 110, 120 in index.html):**
```html
<body class="onepage" data-spy="scroll" data-target=".navbar">
<button class="hamburger animate" data-toggle="collapse" data-target=".navbar-collapse">
```

**Recovery if hit:**
- Add missing `data-bs-` prefix to affected elements
- Test all interactive components again

**Phase to address:** Early in Bootstrap 5 migration (first phase)

---

### Critical: Bootstrap CSS Class Renaming Breaks Responsive Layouts

**Risk level:** HIGH

Bootstrap 5 renamed directional classes from left/right to start/end for RTL support. This is a **silent breaking change** - old classes become no-ops.

**Breaking changes:**

| Bootstrap 4 | Bootstrap 5 | Impact |
|-------------|-------------|--------|
| `.ml-*` / `.mr-*` | `.ms-*` / `.me-*` | Margins break |
| `.pl-*` / `.pr-*` | `.ps-*` / `.pe-*` | Padding breaks |
| `.float-left` / `.float-right` | `.float-start` / `.float-end` | Floats break |
| `.text-left` / `.text-right` | `.text-start` / `.text-end` | Text alignment breaks |
| `.border-left` / `.border-right` | `.border-start` / `.border-end` | Borders break |
| `.rounded-left` / `.rounded-right` | `.rounded-start` / `.rounded-end` | Rounded corners break |

**Additional class changes:**

| Bootstrap 4 | Bootstrap 5 |
|-------------|-------------|
| `.sr-only` | `.visually-hidden` |
| `.font-weight-bold` | `.fw-bold` |
| `.font-italic` | `.fst-italic` |
| `.text-monospace` | `.font-monospace` |
| `.no-gutters` | `.g-0` |
| `.btn-block` | Removed (use `.d-grid` wrapper) |
| `.form-group` | Removed (use spacing utilities) |

**Warning signs:**
- Elements misaligned (especially on mobile)
- Spacing inconsistent
- Hidden accessibility elements visible
- Text alignment wrong

**Prevention strategy:**
1. Audit all Bootstrap utility classes in HTML/CSS before migration
2. Create find/replace script for bulk updates
3. Test at all breakpoints after migration

**Current project impact (line 120):**
```html
<div class="navbar-hamburger ml-auto d-lg-none d-xl-none">
<!-- ml-auto needs to become ms-auto -->
```

**Phase to address:** Same phase as Bootstrap CSS upgrade

---

### Critical: Contact Form jQuery AJAX Migration

**Risk level:** HIGH

The contact form (lines 8-75 in index.html) uses jQuery's `$.ajax()` and multiple jQuery DOM selectors (`$()`, `.val()`, `.prop()`, `.text()`, `.css()`). This is the most complex custom JavaScript to migrate.

**Warning signs:**
- Form validation breaks silently
- Form submission fails (no network request)
- Success/error messages don't display
- Button state doesn't update (loading state)

**Current jQuery dependencies in submitToAPI() - 18 jQuery calls:**
```javascript
// Selectors
$("#name").val()
$("#mail").val()
$("#subject").val()
$("#comment").val()
$("#message").css('color', '...')
$("#message").text('...')
$("#submitmessage").prop('disabled', true/false)
$("#submitmessage").text('...')

// AJAX call
$.ajax({ type: "POST", url: "...", ... })
```

**Prevention strategy:**
1. Create vanilla JS equivalents for ALL jQuery calls before removing jQuery
2. Use fetch API with proper error handling for AJAX
3. Test with network throttling (slow 3G) to catch timing issues
4. Test error scenarios (network failure, server 500, validation errors)

**Vanilla JS migration pattern:**
```javascript
// jQuery: $.ajax({ type: "POST", ... })
// Vanilla:
const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
});

// jQuery: $("#name").val()
// Vanilla: document.getElementById("name").value

// jQuery: $("#message").css('color', 'green').text('Success')
// Vanilla:
const msg = document.getElementById("message");
msg.style.color = "green";
msg.textContent = "Success";

// jQuery: $("#btn").prop('disabled', true)
// Vanilla: document.getElementById("btn").disabled = true;
```

**Phase to address:** Dedicated phase for contact form migration

---

### Critical: Cubeportfolio Replacement Complexity

**Risk level:** HIGH

Cubeportfolio provides filtering, mosaic layout, load-more, and GLightbox integration. Replacing it requires multiple features to work together.

**Warning signs:**
- Portfolio images don't display in grid
- Filter buttons don't filter
- Load More doesn't work
- Lightbox doesn't open for new images
- Mosaic layout breaks at different screen sizes

**Current Cubeportfolio features used (custom-scripts.js lines 121-156):**
```javascript
$cubemosaic.cubeportfolio({
  filters: '#cube-grid-mosaic-filter',    // Filter buttons
  loadMore: '#cube-grid-mosaic-more',     // Load more button
  loadMoreAction: 'click',
  layoutMode: 'mosaic',                   // Masonry-style layout
  mediaQueries: [{width: 1440, cols: 4}, ...],  // Responsive columns
  animationType: 'quicksand',             // Animation
  caption: 'fadeIn'                       // Hover captions
});

// Events for GLightbox integration
$cubemosaic.on('onAfterLoadMore.cbp', ...);
$cubemosaic.on('onFilterComplete.cbp', ...);
```

**Prevention strategy:**
1. Use Isotope.js (vanilla JS mode, no jQuery) - proven replacement
2. Implement features incrementally: (a) grid layout, (b) filtering, (c) load-more, (d) GLightbox integration
3. Keep existing HTML structure (minimal markup changes)
4. Test at all responsive breakpoints
5. Test GLightbox integration after each filter/load-more operation

**Isotope implementation pattern:**
```javascript
// Vanilla JS Isotope (no jQuery)
var iso = new Isotope('.grid', {
  itemSelector: '.grid-item',
  layoutMode: 'masonry',
  masonry: { columnWidth: '.grid-sizer' }
});

// Filtering
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    iso.arrange({ filter: btn.dataset.filter });
  });
});
```

**Phase to address:** Dedicated phase with incremental feature implementation

---

### Moderate: Sticky Header (Headhesive) jQuery Dependency

**Risk level:** MEDIUM

Headhesive is already vanilla JS (no jQuery dependency), but the initialization in custom-scripts.js uses jQuery selectors and SmartMenus callback.

**Warning signs:**
- Header doesn't become sticky on scroll
- Clone header styling broken
- SmartMenus init callback fails (console errors)

**Current implementation (lines 52-69):**
```javascript
if ($(".navbar").length) {  // jQuery selector
  var options = {
    // ...
    onStick: function() {
      $($.SmartMenus.Bootstrap.init);  // SmartMenus dependency
    },
    onUnstick: function() {
      $('.navbar .btn-group').removeClass('open');  // jQuery
    }
  };
  var banner = new Headhesive('.navbar', options);  // Headhesive is vanilla JS
}
```

**Prevention strategy:**
1. Replace jQuery selector with `document.querySelector`
2. Remove SmartMenus callback entirely (SmartMenus being replaced with Bootstrap 5 native)
3. Test scroll behavior at various page positions
4. Consider CSS `position: sticky` as simpler alternative

**Phase to address:** jQuery removal phase

---

### Moderate: Smooth Scroll jQuery Dependency

**Risk level:** MEDIUM

Current smooth scroll (lines 225-248) uses jQuery's `.animate()` with easeInOutExpo easing.

**Warning signs:**
- Scroll anchor links jump instead of smooth scroll
- Easing feels different (linear vs eased)
- Hash URL handling broken

**Current implementation:**
```javascript
$('html,body').animate({
  scrollTop: target.offset().top
}, 1500, 'easeInOutExpo');
```

**Prevention strategy:**
1. Use CSS `scroll-behavior: smooth` for basic smooth scroll
2. For custom easing, use `window.scrollTo({ top: y, behavior: 'smooth' })`
3. For complex easing, use requestAnimationFrame with easing function
4. Test all anchor links in navbar

**Phase to address:** jQuery removal phase

---

### Moderate: Event Delegation Pattern Changes

**Risk level:** MEDIUM

jQuery's `.on()` provides easy event delegation. Vanilla JS requires explicit delegation setup.

**Warning signs:**
- Dynamically added elements don't respond to clicks
- Events fire multiple times (bound multiple times)
- Events stop working after DOM changes

**Current patterns requiring migration:**
```javascript
$('.navbar .nav li a').on('click', function() { ... });
$(".hamburger.animate").on("click", function() { ... });
```

**Prevention strategy:**
1. Use event delegation on parent elements
2. Check for event listener cleanup on dynamic content
3. Test with dynamically added content (load-more)

**Vanilla JS pattern:**
```javascript
// Delegate to parent
document.querySelector('.navbar').addEventListener('click', (e) => {
  if (e.target.matches('.nav li a')) {
    // handle click
  }
});
```

**Phase to address:** jQuery removal phase

---

### Moderate: Bootstrap 5 Navbar Container Requirement

**Risk level:** MEDIUM

Bootstrap 5 requires a container within navbars. Missing this causes spacing issues.

**Warning signs:**
- Navbar content not centered
- Horizontal padding inconsistent
- Mobile layout broken

**Current project status:** Container already present (lines 113-135 in index.html) - LOW RISK
```html
<nav class="navbar ...">
  <div class="container">  <!-- Already correct -->
    ...
  </div>
</nav>
```

**Phase to address:** Bootstrap upgrade phase (verify only)

---

### Minor: Scroll Position and Offset Calculations

**Risk level:** LOW

jQuery's `.offset()` and `.outerHeight()` have slightly different behavior than vanilla equivalents.

**Warning signs:**
- Scroll targets off by pixels
- Header offset calculations wrong
- Elements positioned incorrectly

**Current usage (lines 203-214):**
```javascript
target.offset().top
$('.navbar:not(.banner--clone)').outerHeight();
```

**Prevention strategy:**
1. Use `element.getBoundingClientRect()` for positions
2. Use `element.offsetHeight` for dimensions
3. Account for scroll position: `rect.top + window.scrollY`
4. Test scroll targets are accurate

**Phase to address:** jQuery removal phase

---

### Minor: scrollUp Plugin Replacement

**Risk level:** LOW

scrollUp jQuery plugin (lines 167-193) provides scroll-to-top button with animation.

**Warning signs:**
- Scroll-to-top button doesn't appear
- Button doesn't scroll smoothly
- Animation missing

**Prevention strategy:**
1. Create simple vanilla JS replacement (trivial ~20 lines)
2. Use CSS `scroll-behavior: smooth` for scroll animation
3. Use IntersectionObserver or scroll event for show/hide

**Phase to address:** jQuery removal phase (lowest priority)

---

## Bootstrap 4 to 5 Breaking Changes Summary

| Category | Change | Migration |
|----------|--------|-----------|
| **Data attributes** | `data-*` -> `data-bs-*` | Find/replace all |
| **Margins** | `.ml-*`, `.mr-*` -> `.ms-*`, `.me-*` | Find/replace |
| **Padding** | `.pl-*`, `.pr-*` -> `.ps-*`, `.pe-*` | Find/replace |
| **Float** | `.float-left/right` -> `.float-start/end` | Find/replace |
| **Text align** | `.text-left/right` -> `.text-start/end` | Find/replace |
| **SR classes** | `.sr-only` -> `.visually-hidden` | Find/replace |
| **Font weight** | `.font-weight-*` -> `.fw-*` | Find/replace |
| **Gutters** | `.no-gutters` -> `.g-0` | Find/replace |
| **Buttons** | `.btn-block` removed | Use `.d-grid` wrapper |
| **Forms** | `.form-group` removed | Use spacing utilities |
| **Forms** | Labels need `.form-label` | Add class |
| **Navbar** | `.navbar-dark` deprecated | Use `data-bs-theme="dark"` |
| **Close btn** | `.close` -> `.btn-close` | Replace element |
| **Badges** | `.badge-*` removed | Use `.bg-*` |
| **Grid** | Added `.xxl` breakpoint | Optional use |

---

## jQuery Plugin Replacement Priority

| Plugin | Risk | Replacement | Complexity | Priority |
|--------|------|-------------|------------|----------|
| **Cubeportfolio** | HIGH | Isotope.js (vanilla) | Complex - filtering + masonry + events | Phase 1 |
| **Contact form AJAX** | HIGH | fetch API + vanilla DOM | Medium - 18 jQuery calls | Phase 2 |
| **SmartMenus** | LOW | Bootstrap 5 native navbar | Simple - BS5 has hover support | Phase 3 |
| **Headhesive** | LOW | Keep (already vanilla) or CSS sticky | Simple - just update selectors | Phase 3 |
| **scrollUp** | LOW | Vanilla JS ~20 lines | Trivial | Phase 4 |
| **jQuery.easing** | LOW | CSS animations or custom function | Simple | With smooth scroll |

---

## v2.0 Testing Checklist

### After Bootstrap 5 CSS Migration
- [ ] Navbar displays correctly on desktop
- [ ] Hamburger menu visible on mobile
- [ ] All spacing/margins look correct
- [ ] Text alignment preserved
- [ ] Form layout intact
- [ ] Responsive breakpoints work (xs, sm, md, lg, xl, xxl)

### After Bootstrap 5 JS Migration
- [ ] Mobile nav collapse/expand works
- [ ] Nav links close mobile menu when clicked
- [ ] Scroll spy updates active nav item
- [ ] No console errors

### After jQuery Removal
- [ ] Contact form validates inputs
- [ ] Contact form submits successfully
- [ ] Contact form shows success/error messages
- [ ] Button shows loading state during submit
- [ ] Sticky header appears on scroll
- [ ] Smooth scroll works on nav links
- [ ] Hamburger menu icon animates

### After Cubeportfolio Replacement
- [ ] Portfolio grid displays correctly
- [ ] All filter buttons work
- [ ] Default filter (all) shows all items
- [ ] Load More button adds items
- [ ] GLightbox opens on portfolio images
- [ ] GLightbox works after filtering
- [ ] GLightbox works on load-more items
- [ ] Responsive columns at each breakpoint

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] iOS Safari (mobile)
- [ ] Android Chrome (mobile)

---

## v2.0 Sources

### Bootstrap Migration (HIGH confidence)
- [Bootstrap 5.3 Migration Guide](https://getbootstrap.com/docs/5.3/migration/) - Official documentation
- [Bootstrap 5.0 Migration Guide](https://getbootstrap.com/docs/5.0/migration/) - Original v5 changes
- [Bootstrap 5 Navbar Documentation](https://getbootstrap.com/docs/5.3/components/navbar/)
- [Bootstrap 5 Collapse Documentation](https://getbootstrap.com/docs/5.3/components/collapse/)

### jQuery Migration (HIGH confidence)
- [jQuery Migrate Plugin](https://github.com/jquery/jquery-migrate) - Official migration helper
- [jQuery Core 3.0 Upgrade Guide](https://jquery.com/upgrade-guide/3.0/) - Official upgrade guide
- [MDN - Sending forms through JavaScript](https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript) - Fetch API forms

### Plugin Replacements (MEDIUM confidence)
- [Isotope Documentation](https://isotope.metafizzy.co/) - Official docs (vanilla JS mode)
- [Masonry Documentation](https://masonry.desandro.com/) - Official docs (vanilla JS mode)
- [Headhesive.js GitHub](https://github.com/markgoodyear/headhesive.js) - Already vanilla JS
- [scrollUp GitHub](https://github.com/markgoodyear/scrollup) - jQuery plugin docs

### Vanilla JS DOM (MEDIUM confidence)
- [SitePoint - DOM Manipulation in Vanilla JavaScript](https://www.sitepoint.com/dom-manipulation-vanilla-javascript-no-jquery/)
- [Go Make Things - Fetch API](https://gomakethings.com/how-to-use-the-fetch-api-with-vanilla-js/)
- [DEV Community - Bootstrap Collapsing Menus without jQuery](https://dev.to/ara225/bootstrap-collapsing-menus-without-jquery-4l8l)

---

## v1 Pitfalls (Reference - Completed Phases)

The following pitfalls were identified during v1 research and have been addressed or remain relevant context.

---

### Pitfall: Breaking Revolution Slider During Modernization (RESOLVED)

**Status:** RESOLVED in Phase 8 - Revolution Slider replaced with Embla Carousel

This pitfall was resolved by replacing Revolution Slider entirely rather than trying to maintain compatibility. Embla Carousel is dependency-free and reduced bundle size from ~11MB to ~6KB.

---

### Pitfall: Destroying Dreamweaver Edit Workflow

**Status:** ADDRESSED - Build step enhances rather than replaces HTML editing

The Vite build system was configured to:
- Keep HTML files editable in-place
- Use build for asset optimization only
- Preserve relative paths for Dreamweaver preview

**Ongoing vigilance:** Any v2.0 changes must maintain this workflow.

---

### Pitfall: Image Optimization Quality Destruction

**Status:** ADDRESSED in Phase 3 with conservative settings

Quality settings applied:
- JPEG: 90 quality
- WebP: 85 quality
- AVIF: 85 quality

All images use `<picture>` element with fallbacks.

---

### Pitfall: CloudFront Cache Invalidation Failures

**Status:** ADDRESSED in Phase 2 with content hashing

Build process now generates hashed filenames for assets, making cache invalidation unnecessary for changed assets.

---

### Pitfall: jQuery Migration Breaking Existing Functionality

**Status:** v2.0 ACTIVE - This is the focus of the v2.0 milestone

See v2.0 pitfalls section above for detailed migration guidance.

---

### Pitfall: WebP/AVIF Compatibility Breaking Older Browsers

**Status:** ADDRESSED in Phase 3 with `<picture>` fallbacks

All optimized images use:
```html
<picture>
  <source srcset="photo.avif" type="image/avif">
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="description">
</picture>
```

---

### Pitfall: reCAPTCHA Integration Breaks

**Status:** ACTIVE - Must be tested after jQuery removal

The contact form's reCAPTCHA Enterprise integration uses jQuery for DOM manipulation. When migrating to vanilla JS, test:
- [ ] reCAPTCHA token generation works
- [ ] Token is included in form submission
- [ ] Form submission succeeds
- [ ] Error handling displays correctly

---

*Last updated: 2026-01-20 (v2.0 jQuery/Bootstrap 5 research)*
