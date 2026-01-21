# Architecture Research: jQuery Removal Migration

**Project:** Cassie Cay Photography v2.0
**Researched:** 2026-01-20
**Confidence:** HIGH (verified via official documentation and code analysis)

## Executive Summary

The jQuery removal and Bootstrap 5 migration integrates cleanly with the existing static HTML + Vite architecture. The migration should follow an **incremental approach** with jQuery as a bridge during transition, replacing dependencies one by one. The existing Vite build system requires minimal changes--primarily updating static copy targets and removing jQuery from external files. The Dreamweaver workflow is preserved since changes affect only script references, not HTML content structure.

## Migration Strategy

**Recommendation: Incremental migration with jQuery bridge**

**Rationale:** Big-bang migration risks breaking the entire site if any component fails. Incremental migration allows:
1. Testing each component replacement independently
2. Rolling back individual components without full revert
3. Keeping the site functional throughout the migration
4. Detecting regressions early in the process

**jQuery Bridge Approach:**
During migration, temporarily keep jQuery loaded alongside vanilla JS alternatives. This allows:
- Old code to continue working while new code is added
- Gradual replacement of jQuery calls in custom-scripts.js
- Safe removal of jQuery only after all dependencies are eliminated

## Current Architecture

### Script Loading Order (index.html)

```html
<!-- End of body, before closing </body> tag -->
<script src="style/js/jquery.min.js"></script>         <!-- 1. jQuery (85KB) -->
<script src="style/js/popper.min.js"></script>         <!-- 2. Popper.js v1 (20KB) -->
<script src="style/js/bootstrap.min.js"></script>      <!-- 3. Bootstrap 4.4.1 (60KB) -->
<script src="style/js/embla-carousel.umd.js"></script> <!-- 4. Embla (already jQuery-free) -->
<script src="style/js/embla-carousel-autoplay.umd.js"></script>
<script src="style/js/glightbox.min.js"></script>      <!-- 5. GLightbox (already jQuery-free) -->
<script src="style/js/custom-plugins.js"></script>     <!-- 6. Bundled jQuery plugins (250KB) -->
<script src="style/js/custom-scripts.js"></script>     <!-- 7. Site initialization scripts -->
```

### jQuery Dependencies in custom-plugins.js

| Plugin | Purpose | jQuery Required | Vanilla Alternative |
|--------|---------|-----------------|---------------------|
| SmartMenus | Navbar dropdowns | YES | Bootstrap 5 native navbar |
| Headhesive | Sticky header | NO (already vanilla) | Keep as-is |
| jQuery Easing | Smooth scroll animations | YES | CSS `scroll-behavior` or native `scrollTo()` |
| Swiper | Quote slider | NO (supports vanilla) | Already vanilla-compatible |
| Cubeportfolio | Portfolio grid/filtering | YES | Isotope (vanilla JS mode) |
| scrollUp | Back-to-top button | YES | Native `scrollTo()` implementation |
| imagesLoaded | Image load detection | NO (supports vanilla) | Keep or use native `onload` |

### jQuery Dependencies in custom-scripts.js

| Usage | Lines | Replacement |
|-------|-------|-------------|
| `$(document).ready()` | 7 | `DOMContentLoaded` event |
| `$(".selector")` | 52+ | `document.querySelector/querySelectorAll` |
| `$().on("click", ...)` | 73, 76, 219, 233 | `addEventListener` |
| `$().toggleClass/addClass/removeClass` | 74, 78, 198, etc. | `classList.toggle/add/remove` |
| `$().collapse('hide')` | 77 | Bootstrap 5 `Collapse` API |
| `$().css()` | 160, 209, 214 | `element.style` or `setAttribute` |
| `$().data()` | 161 | `dataset` API |
| `$().each()` | 83 | `forEach()` |
| `$().find()` | 84-88 | `querySelector` |
| `$().prepend()` | 107, 149 | `insertAdjacentHTML` |
| `$().outerHeight()` | 203 | `offsetHeight` |
| `$().animate()` | 243 | CSS transitions or Web Animations API |
| `$.scrollUp()` | 167-193 | Custom vanilla implementation |
| `$.SmartMenus.Bootstrap.init` | 62 | Bootstrap 5 native |
| `new Swiper()` | 89 | Keep (already vanilla) |
| `$().cubeportfolio()` | 127 | Isotope vanilla initialization |

### HTML Data Attributes (Bootstrap 4)

```html
<!-- Line 110: Body scroll spy -->
<body class="onepage" data-spy="scroll" data-target=".navbar">

<!-- Line 120: Mobile hamburger menu -->
<button class="hamburger animate" data-toggle="collapse" data-target=".navbar-collapse">

<!-- Line 123: Collapsible nav content -->
<div class="collapse navbar-collapse">
```

### Vite Configuration (Current)

```javascript
// vite.config.js - Current external files copied to dist/
viteStaticCopy({
  targets: [
    { src: 'style/js/jquery.min.js', dest: 'style/js' },
    { src: 'style/js/popper.min.js', dest: 'style/js' },
    { src: 'style/js/bootstrap.min.js', dest: 'style/js' },
    { src: 'style/js/embla-carousel.umd.js', dest: 'style/js' },
    { src: 'style/js/embla-carousel-autoplay.umd.js', dest: 'style/js' },
    { src: 'style/js/glightbox.min.js', dest: 'style/js' },
    { src: 'style/js/custom-plugins.js', dest: 'style/js' },
    { src: 'style/js/custom-scripts.js', dest: 'style/js' },
    // ... CSS and images
  ]
})
```

## Target Architecture

### Script Loading Order (After Migration)

```html
<!-- End of body, before closing </body> tag -->
<script src="style/js/bootstrap.bundle.min.js"></script>  <!-- 1. Bootstrap 5 + Popper (80KB) -->
<script src="style/js/embla-carousel.umd.js"></script>    <!-- 2. Embla (6KB) -->
<script src="style/js/embla-carousel-autoplay.umd.js"></script>
<script src="style/js/glightbox.min.js"></script>         <!-- 3. GLightbox (17KB) -->
<script src="style/js/isotope.pkgd.min.js"></script>      <!-- 4. Isotope (25KB) -->
<script src="style/js/imagesloaded.pkgd.min.js"></script> <!-- 5. imagesLoaded (3KB) -->
<script src="style/js/headhesive.min.js"></script>        <!-- 6. Headhesive (3KB) -->
<script src="style/js/swiper-bundle.min.js"></script>     <!-- 7. Swiper (140KB or custom build) -->
<script src="style/js/site.js"></script>                  <!-- 8. Custom initialization -->
```

**Total estimated size:** ~275KB (vs current ~415KB including jQuery and plugins bundle)
**Reduction:** ~140KB (~34% smaller)

### HTML Data Attributes (Bootstrap 5)

```html
<!-- Body scroll spy (Bootstrap 5 syntax) -->
<body class="onepage" data-bs-spy="scroll" data-bs-target=".navbar">

<!-- Mobile hamburger menu (Bootstrap 5 syntax) -->
<button class="hamburger animate" data-bs-toggle="collapse" data-bs-target=".navbar-collapse">

<!-- Collapsible nav content (no change needed) -->
<div class="collapse navbar-collapse">
```

### Vite Configuration (Target)

```javascript
// vite.config.js - Updated external files
viteStaticCopy({
  targets: [
    // Bootstrap 5 bundle (includes Popper)
    { src: 'style/js/bootstrap.bundle.min.js', dest: 'style/js' },

    // Already jQuery-free
    { src: 'style/js/embla-carousel.umd.js', dest: 'style/js' },
    { src: 'style/js/embla-carousel-autoplay.umd.js', dest: 'style/js' },
    { src: 'style/js/glightbox.min.js', dest: 'style/js' },

    // New vanilla JS libraries
    { src: 'style/js/isotope.pkgd.min.js', dest: 'style/js' },
    { src: 'style/js/imagesloaded.pkgd.min.js', dest: 'style/js' },
    { src: 'style/js/headhesive.min.js', dest: 'style/js' },
    { src: 'style/js/swiper-bundle.min.js', dest: 'style/js' },

    // New unified site script (replaces custom-plugins.js + custom-scripts.js)
    { src: 'style/js/site.js', dest: 'style/js' },

    // CSS and images unchanged
    // ...
  ]
})
```

## Migration Path

### Phase Order Rationale

The migration should proceed in this order based on dependency analysis:

1. **Bootstrap 5 first** - Foundation that enables other changes
2. **Cubeportfolio replacement** - Most complex component, benefits from early attention
3. **SmartMenus removal** - Becomes redundant after Bootstrap 5 navbar
4. **Custom scripts conversion** - Depends on above being complete
5. **jQuery removal** - Final step after all dependencies eliminated

### Dependency Graph

```
jQuery 3.x
|-- Bootstrap 4.4.1 (requires jQuery)
|   |-- navbar collapse functionality
|   |-- scroll spy
|-- custom-plugins.js bundle
|   |-- SmartMenus (requires jQuery)
|   |-- Cubeportfolio (requires jQuery)
|   |-- jQuery Easing (requires jQuery)
|   |-- scrollUp (requires jQuery)
|
|   [Already jQuery-free in bundle:]
|   |-- Headhesive (vanilla JS)
|   |-- Swiper (supports vanilla)
|   |-- imagesLoaded (supports vanilla)
|
|-- custom-scripts.js
    |-- All initialization code uses jQuery syntax
```

### Detailed Phase Breakdown

#### Phase 1: Bootstrap 5 Migration

**Changes:**
1. Replace `style/css/bootstrap.min.css` with Bootstrap 5 version
2. Replace `style/js/bootstrap.min.js` + `popper.min.js` with `bootstrap.bundle.min.js`
3. Update HTML data attributes:
   - `data-toggle` -> `data-bs-toggle`
   - `data-target` -> `data-bs-target`
   - `data-spy` -> `data-bs-spy`
4. Update CSS class changes (if any used):
   - `ml-*` -> `ms-*`
   - `mr-*` -> `me-*`
   - `pl-*` -> `ps-*`
   - `pr-*` -> `pe-*`
   - `text-left` -> `text-start`
   - `text-right` -> `text-end`

**Note:** jQuery still required at this point for custom-scripts.js

#### Phase 2: Cubeportfolio -> Isotope Migration

**Changes:**
1. Add `isotope.pkgd.min.js` and `imagesloaded.pkgd.min.js`
2. Update portfolio HTML markup (minimal changes to CSS classes)
3. Replace Cubeportfolio initialization with Isotope:

```javascript
// Before (jQuery/Cubeportfolio)
$('#cube-grid-mosaic').cubeportfolio({
  filters: '#cube-grid-mosaic-filter',
  layoutMode: 'mosaic',
  // ...
});

// After (vanilla JS/Isotope)
var grid = document.querySelector('#cube-grid-mosaic');
var iso = new Isotope(grid, {
  itemSelector: '.cbp-item',
  layoutMode: 'masonry',
  percentPosition: true,
  masonry: { columnWidth: '.cbp-item' }
});

// Filter buttons
var filterButtons = document.querySelectorAll('#cube-grid-mosaic-filter [data-filter]');
filterButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    var filterValue = this.getAttribute('data-filter');
    iso.arrange({ filter: filterValue === '*' ? '*' : filterValue });
  });
});
```

4. Update GLightbox to work with Isotope filtering

#### Phase 3: SmartMenus Removal

**Changes:**
1. Remove SmartMenus from custom-plugins.js
2. Bootstrap 5 native navbar handles all current functionality:
   - Mobile collapse toggle
   - Responsive breakpoints
   - No dropdown menus on this site (single-level nav)

```javascript
// Before (SmartMenus integration)
onStick: function() {
  $($.SmartMenus.Bootstrap.init);
}

// After (Bootstrap 5 native - no initialization needed)
// Navbar collapse works automatically via data-bs-* attributes
```

#### Phase 4: Custom Scripts Conversion

**Changes:**
Convert all jQuery syntax in custom-scripts.js to vanilla JS:

```javascript
// Before
$(document).ready(function() {
  $(".hamburger.animate").on("click", function() {
    $(".hamburger.animate").toggleClass("active");
  });
});

// After
document.addEventListener('DOMContentLoaded', function() {
  var hamburger = document.querySelector('.hamburger.animate');
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  }
});
```

**Key conversions:**
| jQuery | Vanilla JS |
|--------|-----------|
| `$(document).ready(fn)` | `document.addEventListener('DOMContentLoaded', fn)` |
| `$('.class')` | `document.querySelector('.class')` or `querySelectorAll` |
| `$el.on('click', fn)` | `el.addEventListener('click', fn)` |
| `$el.toggleClass('x')` | `el.classList.toggle('x')` |
| `$el.addClass('x')` | `el.classList.add('x')` |
| `$el.removeClass('x')` | `el.classList.remove('x')` |
| `$el.css('prop', val)` | `el.style.prop = val` |
| `$el.data('key')` | `el.dataset.key` |
| `$el.each(fn)` | `els.forEach(fn)` |
| `$el.find('.x')` | `el.querySelector('.x')` |
| `$el.prepend(html)` | `el.insertAdjacentHTML('afterbegin', html)` |
| `$el.outerHeight()` | `el.offsetHeight` |
| `$('html,body').animate({scrollTop: x})` | `window.scrollTo({top: x, behavior: 'smooth'})` |

#### Phase 5: scrollUp Replacement

**Changes:**
Replace jQuery scrollUp plugin with vanilla JS:

```javascript
// Vanilla scroll-to-top implementation
(function() {
  // Create button
  var scrollBtn = document.createElement('a');
  scrollBtn.id = 'scrollUp';
  scrollBtn.innerHTML = '<span style="background:#9A7A7D;" class="btn btn-square btn-full-rounded btn-icon"><i class="fa fa-chevron-up"></i></span>';
  scrollBtn.style.display = 'none';
  scrollBtn.style.position = 'fixed';
  scrollBtn.style.bottom = '20px';
  scrollBtn.style.right = '20px';
  scrollBtn.style.zIndex = '1001';
  scrollBtn.style.cursor = 'pointer';
  document.body.appendChild(scrollBtn);

  // Show/hide on scroll
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      scrollBtn.style.display = 'block';
    } else {
      scrollBtn.style.display = 'none';
    }
  });

  // Scroll to top on click
  scrollBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
```

#### Phase 6: jQuery Removal

**Changes:**
1. Remove `jquery.min.js` from HTML script tags
2. Remove jQuery from vite.config.js static copy targets
3. Delete `style/js/jquery.min.js`
4. Update rollupOptions.external to remove jQuery pattern
5. Final testing of all functionality

### Testing Strategy

**Per-phase testing checklist:**

| Feature | Test |
|---------|------|
| Navbar collapse | Mobile menu opens/closes on hamburger click |
| Navbar links | Smooth scroll to sections works |
| Sticky header | Header becomes fixed after scrolling 350px |
| Hero slider | Embla carousel auto-advances (6s interval) |
| Portfolio grid | Images display in mosaic layout |
| Portfolio filter | Category buttons filter correctly |
| Lightbox | Clicking portfolio images opens fullscreen gallery |
| Quote slider | Swiper cycles through quotes |
| Background images | `data-image-src` backgrounds load |
| Scroll to top | Button appears after scrolling, scrolls to top on click |
| Contact form | Form validation and submission works (jQuery in inline script) |

**Browser testing:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

**Automated validation:**
- Existing `npm run validate:html` - HTML structure
- Existing `npm run validate:refs` - Asset references
- Manual visual regression testing (screenshots)

## Vite Configuration Changes

### Before (Current)

```javascript
// vite.config.js
external: [
  /^style\/js\/jquery\.min\.js$/,
  /^style\/js\/bootstrap\.min\.js$/,
  /^style\/js\/popper\.min\.js$/,
  /^style\/js\/embla-carousel\.umd\.js$/,
  /^style\/js\/embla-carousel-autoplay\.umd\.js$/,
],
```

### After (Target)

```javascript
// vite.config.js
external: [
  /^style\/js\/bootstrap\.bundle\.min\.js$/,
  /^style\/js\/embla-carousel\.umd\.js$/,
  /^style\/js\/embla-carousel-autoplay\.umd\.js$/,
  /^style\/js\/glightbox\.min\.js$/,
  /^style\/js\/isotope\.pkgd\.min\.js$/,
  /^style\/js\/imagesloaded\.pkgd\.min\.js$/,
  /^style\/js\/headhesive\.min\.js$/,
  /^style\/js\/swiper-bundle\.min\.js$/,
],
```

### Static Copy Targets Update

**Remove:**
- `style/js/jquery.min.js`
- `style/js/popper.min.js`
- `style/js/bootstrap.min.js`
- `style/js/custom-plugins.js`

**Add:**
- `style/js/bootstrap.bundle.min.js`
- `style/js/isotope.pkgd.min.js`
- `style/js/imagesloaded.pkgd.min.js`

**Rename/Replace:**
- `style/js/custom-scripts.js` -> `style/js/site.js` (converted to vanilla JS)

## Risk Mitigation

### Rollback Strategy

Each phase should be completed in a separate branch with a working deployment:

```
main (production)
|-- feature/bootstrap-5-migration (Phase 1)
|   |-- Merge only after testing passes
|-- feature/isotope-migration (Phase 2)
|   |-- Merge only after testing passes
|-- feature/vanilla-scripts (Phases 3-5)
|   |-- Merge only after testing passes
|-- feature/jquery-removal (Phase 6)
    |-- Final merge removes jQuery
```

If any phase fails:
1. Do not merge to main
2. Revert branch to last working state
3. Investigate root cause
4. Re-attempt with fixes

### Known Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Bootstrap 5 CSS breaks layout | Medium | High | Audit all Bootstrap classes before migration |
| Isotope filtering differs from Cubeportfolio | Medium | Medium | Test with all filter combinations |
| Smooth scroll animation differs | Low | Low | Use CSS `scroll-behavior: smooth` as baseline |
| Contact form jQuery inline script | High | High | Must convert separately (lines 9-74 in index.html) |
| Third-party script conflicts | Low | Medium | Test in isolation first |

### Critical: Contact Form Inline Script

The contact form submission (`submitToAPI` function) uses jQuery (`$()` syntax) directly in index.html:

```html
<script>
function submitToAPI(e) {
    // Uses: $("#name"), $("#mail"), $("#subject"), $("#comment")
    // Uses: $.ajax() for form submission
    // Uses: $("#message").css() and .text()
    // Uses: $("#submitmessage").prop() and .text()
}
</script>
```

This inline script MUST be converted to vanilla JS before jQuery can be removed:

```javascript
function submitToAPI(e) {
  e.preventDefault();

  var name = document.getElementById('name');
  var mail = document.getElementById('mail');
  var subject = document.getElementById('subject');
  var comment = document.getElementById('comment');
  var message = document.getElementById('message');
  var submitBtn = document.getElementById('submitmessage');

  // Validation
  var nameRe = /[A-Za-z]{1}[A-Za-z]/;
  if (!nameRe.test(name.value)) {
    alert("Name cannot be less than 2 characters");
    return;
  }
  if (mail.value === "") {
    alert("Please enter your email");
    return;
  }
  var emailRe = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
  if (!emailRe.test(mail.value)) {
    alert("Please enter a valid email address");
    return;
  }

  // Disable button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  // reCAPTCHA and fetch
  grecaptcha.enterprise.ready(function() {
    grecaptcha.enterprise.execute('6LchXjYsAAAAANiJ_B8AKMUp7vwsJx_8HnKLBzr2', {action: 'contact_submit'})
      .then(function(token) {
        var data = {
          site: 'cassiecayphotography.com',
          name: name.value,
          email: mail.value,
          subject: subject.value,
          message: comment.value,
          recaptchaToken: token
        };

        fetch('https://7qcdrfk7uctpaqw36i5z2kwxha0rgrnx.lambda-url.us-east-1.on.aws/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        .then(function(response) {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(function() {
          message.style.color = 'green';
          message.textContent = 'Message Sent Successfully';
          name.value = '';
          mail.value = '';
          subject.value = '';
          comment.value = '';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        })
        .catch(function() {
          message.style.color = 'red';
          message.textContent = 'Error. Your message was not sent.';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        });
      })
      .catch(function() {
        message.style.color = 'red';
        message.textContent = 'reCAPTCHA error. Please try again.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      });
  });
}
```

## Dreamweaver Workflow Preservation

The migration preserves Cassie's Dreamweaver workflow:

| Aspect | Impact | Notes |
|--------|--------|-------|
| HTML content editing | None | Content structure unchanged |
| Adding images | None | Same image paths and markup |
| CSS class usage | Minimal | Some Bootstrap utility classes renamed |
| Script references | One-time update | Script src paths change once |
| Portfolio items | Minimal | May need `data-filter` attribute updates |

**Training needed:**
- One-time update to script references in HTML template
- If Bootstrap utility class renames affect existing content

## Sources

**Bootstrap 5 Migration:**
- [Bootstrap 5 Migration Guide](https://getbootstrap.com/docs/5.3/migration/) - HIGH confidence
- [Bootstrap 5 vs Bootstrap 4 Key Differences](https://www.vincentschmalbach.com/bootstrap-5-vs-bootstrap-4-key-differences-and-migration-guide/) - MEDIUM confidence
- [Bootstrap 5 data-bs-* Attribute Change](https://www.vincentschmalbach.com/bootstrap-5-change-from-data-to-data-bs-attributes/) - HIGH confidence

**Isotope:**
- [Isotope Official Documentation](https://isotope.metafizzy.co/) - HIGH confidence
- [Isotope vanilla JS usage](https://isotope.metafizzy.co/extras.html) - HIGH confidence

**Headhesive:**
- [Headhesive.js](https://webscripts.softpedia.com/blog/Script-of-the-Day-Headhesive-js-455192.shtml) - Already vanilla JS, HIGH confidence

**Swiper:**
- [Swiper Getting Started](https://swiperjs.com/get-started) - HIGH confidence, no jQuery dependency

**Vanilla JS Scroll:**
- [Vanilla JavaScript Scroll to Top](https://dev.to/dailydevtips1/vanilla-javascript-scroll-to-top-3mkd) - MEDIUM confidence
- [You Might Not Need jQuery](https://youmightnotneedjquery.com/) - HIGH confidence for syntax conversions
