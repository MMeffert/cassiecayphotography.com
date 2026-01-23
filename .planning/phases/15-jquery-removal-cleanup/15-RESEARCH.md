---
phase: 15-jquery-removal-cleanup
researched: 2026-01-21T10:20:00Z
---

# Phase 15 Research: jQuery Removal & Cleanup

## Summary

This phase completes the jQuery elimination started in phases 10-14. The source `index.html` contact form has already been migrated to vanilla JS. The remaining jQuery usage is in `custom-scripts.js` (10 jQuery patterns across 6 functional areas). After removing these, jQuery 3.x (~97KB) can be deleted from the project.

**Key Finding:** No separate Popper.js v1 file exists - Bootstrap 5.3's `bootstrap.bundle.min.js` includes Popper v2 internally. Requirement JQ-02 is already satisfied.

## Current jQuery/Popper References

### jQuery Script Tags

| File | Line | Reference |
|------|------|-----------|
| `index.html` | 1445 | `<script src="style/js/jquery.min.js"></script>` |
| `dist/index.html` | 1432 | `<script src="style/js/jquery.min.js"></script>` |

### jQuery File Location

- Source: `style/js/jquery.min.js` (97,134 bytes / ~95KB)
- Dist: `dist/style/js/jquery.min.js` (copied by Vite)

### Popper.js v1 References

**None found.** Bootstrap 5.3's `bootstrap.bundle.min.js` bundles Popper v2 internally. No separate Popper v1 script exists in the project.

## Vite Configuration

**File:** `vite.config.js`

### Current jQuery-related Configuration (lines 20-26)

```javascript
// Keep vendor JS files external - loaded via script tags
external: [
  /^style\/js\/jquery\.min\.js$/,        // <-- REMOVE THIS
  /^style\/js\/bootstrap\.bundle\.min\.js$/,
  /^style\/js\/embla-carousel\.umd\.js$/,
  /^style\/js\/embla-carousel-autoplay\.umd\.js$/,
  /^style\/js\/muuri\.min\.js$/,
],
```

### Current jQuery Copy Target (lines 40-43)

```javascript
{
  src: 'style/js/jquery.min.js',        // <-- REMOVE THIS BLOCK
  dest: 'style/js'
},
```

## Remaining jQuery Patterns

### In `custom-scripts.js` (10 patterns, 6 areas)

| Line | Pattern | Purpose | Vanilla JS Replacement |
|------|---------|---------|------------------------|
| 7 | `$(document).ready(function() {` | DOM ready wrapper | `document.addEventListener('DOMContentLoaded', function() {` |
| 139-158 | `$(".basic-slider").each(...)` | Swiper initialization | `document.querySelectorAll('.basic-slider').forEach(...)` |
| 163 | `$('.overlay > a, .overlay > span').prepend(...)` | Add bg spans | `document.querySelectorAll('...').forEach(el => el.insertAdjacentHTML('afterbegin', ...))` |
| 283-285 | `$(".bg-image").css('background-image', ...)` | Set background images | `document.querySelectorAll('.bg-image').forEach(...)` |
| 291 | `$('.image-wrapper').addClass('mobile')` | Add mobile class | `document.querySelectorAll('.image-wrapper').forEach(el => el.classList.add('mobile'))` |
| 296 | `$('.navbar:not(.banner--clone)').outerHeight()` | Get navbar height | `document.querySelector('.navbar:not(.banner--clone)').offsetHeight` |
| 302 | `$('.onepage section').css(firstStyle)` | Set section styles | `document.querySelectorAll('.onepage section').forEach(...)` |
| 307 | `$('.onepage section:first-of-type').css(secondStyle)` | Set first section style | `document.querySelector('.onepage section:first-of-type').style...` |

### In `dist/index.html` Contact Form (17 patterns)

The **source** `index.html` already uses vanilla JS (lines 9-78, async/await with fetch API).
The **dist** version still has old jQuery code because the build hasn't been run since Phase 14 migration.

**Action:** Running `npm run build` will update dist with the vanilla JS contact form.

### In `custom-plugins.js`

**Zero jQuery patterns found.** Swiper 5.3.6 included in this bundle is self-contained and does not require jQuery.

## Bundle Structure

### Current JS Loading Order (index.html lines 1445-1452)

```html
<script src="style/js/jquery.min.js"></script>           <!-- REMOVE -->
<script src="style/js/bootstrap.bundle.min.js"></script>
<script src="style/js/embla-carousel.umd.js"></script>
<script src="style/js/embla-carousel-autoplay.umd.js"></script>
<script src="style/js/glightbox.min.js"></script>
<script src="style/js/muuri.min.js"></script>
<script src="style/js/custom-plugins.js"></script>
<script src="style/js/custom-scripts.js"></script>
```

### File Sizes (current vendor scripts)

| File | Size | Keep/Remove |
|------|------|-------------|
| `jquery.min.js` | 97,134 bytes (95KB) | **REMOVE** |
| `bootstrap.bundle.min.js` | 80,721 bytes (79KB) | Keep |
| `muuri.min.js` | 84,257 bytes (82KB) | Keep |
| `glightbox.min.js` | 56,343 bytes (55KB) | Keep |
| `embla-carousel.umd.js` | 17,946 bytes (18KB) | Keep |
| `embla-carousel-autoplay.umd.js` | 2,451 bytes (2KB) | Keep |
| `custom-plugins.js` | 139,915 bytes (137KB) | Keep |
| `custom-scripts.js` | 15,636 bytes (15KB) | Keep |

## Size Impact

### Expected Savings

| Item | Before | After | Savings |
|------|--------|-------|---------|
| jQuery 3.x | 95 KB | 0 KB | **-95 KB** |
| Popper v1 | 0 KB | 0 KB | N/A (already removed) |
| **Total** | 95 KB | 0 KB | **-95 KB** |

### Before/After Total JS Bundle

- **Before:** ~483 KB (all vendor + custom scripts)
- **After:** ~388 KB (without jQuery)
- **Reduction:** ~20% smaller JS footprint

## Removal Strategy

### Recommended Order

1. **Convert `custom-scripts.js` to vanilla JS** (10 patterns)
   - Replace `$(document).ready()` wrapper
   - Convert Swiper initialization
   - Convert overlay prepend
   - Convert background image setter
   - Convert mobile class addition
   - Convert navbar height measurement
   - Convert section style setters

2. **Remove jQuery from index.html**
   - Delete `<script src="style/js/jquery.min.js"></script>` line

3. **Update vite.config.js**
   - Remove jQuery from `external` array
   - Remove jQuery from `viteStaticCopy` targets

4. **Delete jQuery file**
   - Remove `style/js/jquery.min.js`

5. **Rebuild and verify**
   - Run `npm run build`
   - Test all functionality in browser

### Conversion Patterns Reference

**DOM Ready:**
```javascript
// jQuery
$(document).ready(function() { ... });

// Vanilla JS
document.addEventListener('DOMContentLoaded', function() { ... });
```

**Each/ForEach:**
```javascript
// jQuery
$('.selector').each(function(index, element) { ... });

// Vanilla JS
document.querySelectorAll('.selector').forEach(function(element, index) { ... });
```

**CSS Setting:**
```javascript
// jQuery
$('.selector').css('property', 'value');

// Vanilla JS
document.querySelectorAll('.selector').forEach(function(el) {
    el.style.property = 'value';
});
```

**Prepend HTML:**
```javascript
// jQuery
$('.selector').prepend('<span class="bg"></span>');

// Vanilla JS
document.querySelectorAll('.selector').forEach(function(el) {
    el.insertAdjacentHTML('afterbegin', '<span class="bg"></span>');
});
```

**Add Class:**
```javascript
// jQuery
$('.selector').addClass('classname');

// Vanilla JS
document.querySelectorAll('.selector').forEach(function(el) {
    el.classList.add('classname');
});
```

**Get Height (outerHeight):**
```javascript
// jQuery
var height = $('.selector').outerHeight();

// Vanilla JS
var el = document.querySelector('.selector');
var height = el ? el.offsetHeight : 0;
```

**Find Within Element:**
```javascript
// jQuery
var $this = $(this);
$this.find('.child').addClass('class');

// Vanilla JS
var children = this.querySelectorAll('.child');
children.forEach(function(child) { child.classList.add('class'); });
```

## Risk Assessment

### Low Risk

- **Swiper 5.3.6 has no jQuery dependency** - It's self-contained in custom-plugins.js
- **Bootstrap 5.3 has no jQuery dependency** - Confirmed by Bootstrap 5 migration in Phase 10
- **GLightbox, Muuri, Embla have no jQuery dependencies** - All vanilla JS libraries
- **Contact form already converted** - Source index.html uses vanilla JS

### Medium Risk

- **Swiper initialization** - Uses jQuery for dynamic class assignment
  - Mitigation: Test quote slider after conversion
  - Fallback: Swiper works without dynamic classes if only one slider

### Potential Gotchas

1. **outerHeight() vs offsetHeight** - jQuery's `outerHeight()` includes padding and border by default. Vanilla `offsetHeight` also includes padding and border, so it's a direct replacement.

2. **css() callback function** - jQuery's `.css()` accepts a callback. Vanilla JS requires explicit iteration.

3. **Multiple elements vs single element** - jQuery methods work on collections. Vanilla JS `querySelector` returns single element, `querySelectorAll` returns NodeList.

4. **DOMContentLoaded timing** - If script is at end of body (which it is), DOM is already ready. Could simplify to IIFE instead of DOMContentLoaded listener.

## Verification Checklist

After removal, verify:

- [ ] Hero slider auto-advances correctly
- [ ] Quote slider (Swiper) works
- [ ] Portfolio grid filters work
- [ ] Portfolio lightbox opens
- [ ] Background images load on scroll sections
- [ ] Mobile detection adds class correctly
- [ ] Sticky header appears at correct scroll position
- [ ] Scroll-to-top button works
- [ ] Contact form submits successfully
- [ ] No console errors

## Sources

### Primary (HIGH confidence)

- **Codebase analysis:**
  - `/Users/mitchellmeffert/Git/Personal/cassiecayphotography.com/index.html` (lines 1445-1452)
  - `/Users/mitchellmeffert/Git/Personal/cassiecayphotography.com/style/js/custom-scripts.js` (all jQuery patterns)
  - `/Users/mitchellmeffert/Git/Personal/cassiecayphotography.com/vite.config.js` (lines 20-26, 40-43)
  - `/Users/mitchellmeffert/Git/Personal/cassiecayphotography.com/package.json` (no jQuery dependency listed)

- **File size verification:**
  - `ls -la style/js/*.js` output confirmed file sizes

### Verified Facts

- jQuery 3.x file size: 97,134 bytes (verified via `ls -la`)
- No Popper v1 separate file exists (verified via `find` command)
- Bootstrap 5.3 bundles Popper v2 internally (standard Bootstrap 5 architecture)
- custom-plugins.js has 0 jQuery patterns (verified via `grep -c`)
- custom-scripts.js has 10 jQuery patterns (verified via `grep -n`)

## Metadata

**Confidence breakdown:**
- jQuery locations: HIGH - verified via grep
- Popper status: HIGH - verified no separate file exists
- Vite config changes: HIGH - verified exact line numbers
- Conversion patterns: HIGH - standard vanilla JS equivalents
- Size savings: HIGH - based on actual file sizes

**Research date:** 2026-01-21
**Valid until:** N/A - codebase-specific research
