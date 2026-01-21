# Phase 10: Bootstrap 5 Migration - Research

**Researched:** 2026-01-20
**Domain:** Bootstrap 4.4.1 to Bootstrap 5.3.x migration
**Confidence:** HIGH

## Summary

This research provides a comprehensive inventory of Bootstrap 4 components and attributes that need updating for Bootstrap 5 migration. The codebase has a small, well-defined surface area for migration: 4 data attributes need `data-bs-*` prefixes, 4 CSS utility classes need renaming, and 3 `.form-group` elements should be updated (though they can remain for compatibility with custom CSS).

The migration is straightforward because the site uses minimal Bootstrap JavaScript functionality (only navbar collapse and scrollspy) and basic utility classes. The custom CSS in `style/style.css` references some Bootstrap classes that need consideration during migration.

**Primary recommendation:** Update data attributes first (silent failure risk), then CSS classes, then replace Bootstrap CSS/JS files. Test navbar collapse immediately after file replacement since it's the only interactive component.

## Current Bootstrap Usage Inventory

### Bootstrap Files Currently Loaded

| File | Version | Size | Purpose |
|------|---------|------|---------|
| `style/css/bootstrap.min.css` | 4.4.1 | ~155KB | Bootstrap CSS framework |
| `style/js/bootstrap.min.js` | 4.4.1 | ~60KB | Bootstrap JS (requires jQuery) |
| `style/js/popper.min.js` | v1 | ~19KB | Popper.js for dropdowns/tooltips |
| `style/js/jquery.min.js` | 3.x | ~97KB | jQuery (Bootstrap 4 dependency) |

### Data Attributes Requiring `data-bs-*` Conversion

**Total: 4 occurrences across 2 lines**

| Line | Current Attribute | New Attribute | Element |
|------|-------------------|---------------|---------|
| 110 | `data-spy="scroll"` | `data-bs-spy="scroll"` | `<body>` |
| 110 | `data-target=".navbar"` | `data-bs-target=".navbar"` | `<body>` |
| 120 | `data-toggle="collapse"` | `data-bs-toggle="collapse"` | hamburger `<button>` |
| 120 | `data-target=".navbar-collapse"` | `data-bs-target=".navbar-collapse"` | hamburger `<button>` |

**Code context (line 110):**
```html
<body class="onepage" data-spy="scroll" data-target=".navbar">
```

**Code context (line 120):**
```html
<button class="hamburger animate" data-toggle="collapse" data-target=".navbar-collapse">
```

### Non-Bootstrap Data Attributes (DO NOT CHANGE)

These data attributes are NOT Bootstrap-specific and should remain unchanged:

| Attribute | Count | Purpose |
|-----------|-------|---------|
| `data-filter` | 6 | Cubeportfolio filtering |
| `data-image-src` | 3 | Background image lazy loading |
| `data-sub-html` | 2 | GLightbox captions |

### CSS Utility Classes Requiring Renaming

**Total: 4 occurrences across 4 lines**

| Line | Current Class | New Class | Element |
|------|---------------|-----------|---------|
| 120 | `ml-auto` | `ms-auto` | `.navbar-hamburger` div |
| 124 | `ml-auto` | `ms-auto` | `.nav.navbar-nav` ul |
| 1225 | `pr-10` | `pe-10` | form column div |
| 1232 | `pl-10` | `ps-10` | form column div |

**Note:** `pr-10` and `pl-10` are NOT standard Bootstrap classes (Bootstrap uses 0-5 scale). These appear to be custom classes defined in `style/style.css`. Verify if they need renaming or are custom-defined.

### Bootstrap 4 Deprecated Classes Found

| Line | Class | Bootstrap 5 Alternative | Notes |
|------|-------|------------------------|-------|
| 1226, 1233, 1240 | `.form-group` | `mb-3` (margin utility) | Has custom CSS overrides in style.css |

**Custom CSS Dependencies (from style/style.css):**
```css
/* Lines 4205-4218 define custom .form-group styles */
.form-group .custom-select { ... }
.form-group .btn { ... }
.form-group { margin-bottom: 1rem; }
```

**Recommendation:** Keep `.form-group` class in HTML since custom CSS defines it. Bootstrap 5 CSS will ignore it (no conflict), and custom styles will still apply.

## Standard Stack

### Core
| Library | Version | Purpose | CDN URL |
|---------|---------|---------|---------|
| Bootstrap CSS | 5.3.3 | UI framework styles | `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css` |
| Bootstrap JS Bundle | 5.3.3 | UI framework JS (includes Popper) | `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js` |

### Replacement Strategy

**Bootstrap 5 includes Popper v2 internally.** The bundle file eliminates need for separate popper.min.js.

**Before (4 script files):**
```html
<script src="style/js/jquery.min.js"></script>
<script src="style/js/popper.min.js"></script>
<script src="style/js/bootstrap.min.js"></script>
```

**After (jQuery still needed for other plugins, Bootstrap now standalone):**
```html
<script src="style/js/jquery.min.js"></script>
<script src="style/js/bootstrap.bundle.min.js"></script>
<!-- popper.min.js no longer needed -->
```

**Download commands:**
```bash
# Download Bootstrap 5.3.3 CSS
curl -o style/css/bootstrap.min.css https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css

# Download Bootstrap 5.3.3 JS bundle (includes Popper)
curl -o style/js/bootstrap.bundle.min.js https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js

# Remove old popper.min.js (optional, but recommended)
rm style/js/popper.min.js
```

## Architecture Patterns

### Recommended Migration Order

```
1. Update data-* attributes in index.html
   |
2. Update CSS utility classes (ml-*, pr-*, pl-*)
   |
3. Download new Bootstrap 5.3.3 files
   |
4. Replace bootstrap.min.css
   |
5. Replace bootstrap.min.js with bootstrap.bundle.min.js
   |
6. Remove popper.min.js reference
   |
7. Update script tag in index.html
   |
8. Test navbar collapse on mobile
   |
9. Test scrollspy functionality
```

### Navbar Structure (Current - Already Bootstrap 5 Compatible)

The navbar markup is already close to Bootstrap 5 requirements:

```html
<nav class="navbar transparent absolute nav-wrapper-dark inverse-text navbar-expand-lg text-uppercase">
  <div class="container">
    <div class="navbar-header">
      <div class="navbar-brand">...</div>
      <div class="navbar-hamburger ms-auto d-lg-none d-xl-none">
        <button class="hamburger animate" data-bs-toggle="collapse" data-bs-target=".navbar-collapse">
          <span></span>
        </button>
      </div>
    </div>
    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link scroll" href="#home">Home</a></li>
        ...
      </ul>
    </div>
  </div>
</nav>
```

**No structural changes required** - only attribute updates.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Popper positioning | Include separate Popper.js | Bootstrap bundle | Bundle includes Popper v2 |
| Collapse animation | Custom JS animation | Bootstrap Collapse API | Native smooth animations |
| Scrollspy tracking | Custom scroll handler | Bootstrap ScrollSpy | Handles edge cases |

## Common Pitfalls

### Pitfall 1: Silent Data Attribute Failures

**What goes wrong:** Hamburger menu and scrollspy stop working with no console errors
**Why it happens:** Bootstrap 5 looks for `data-bs-*` attributes, ignores `data-*`
**How to avoid:** Update ALL data attributes before replacing Bootstrap files
**Warning signs:** Menu doesn't toggle, nav links don't highlight during scroll

### Pitfall 2: Custom CSS Overrides Conflict

**What goes wrong:** Form styling breaks after migration
**Why it happens:** Custom `.form-group` styles may conflict with new Bootstrap styles
**How to avoid:** Test forms immediately after CSS replacement; custom styles should take precedence
**Warning signs:** Form spacing changes, input styles look different

### Pitfall 3: jQuery Removal Too Early

**What goes wrong:** Site functionality breaks
**Why it happens:** Other plugins (SmartMenus, Swiper, scrollUp, etc.) still need jQuery
**How to avoid:** Keep jQuery during Bootstrap 5 migration; remove in later phase
**Warning signs:** Console errors about jQuery undefined

### Pitfall 4: Scrollspy Configuration Change

**What goes wrong:** Scrollspy doesn't work
**Why it happens:** Bootstrap 5 Scrollspy requires explicit rootMargin or target
**How to avoid:** Test scrollspy immediately; may need JavaScript initialization
**Warning signs:** Nav links don't highlight as you scroll

### Pitfall 5: Forgetting to Remove Popper Script Tag

**What goes wrong:** Popper loaded twice (in bundle + separate file)
**Why it happens:** Old script tag left in HTML
**How to avoid:** Remove `<script src="style/js/popper.min.js"></script>` line
**Warning signs:** Console warnings about Popper, slightly larger page size

## Code Examples

### Data Attribute Updates (Find/Replace)

```bash
# Run these sed commands to update data attributes
sed -i '' 's/data-toggle=/data-bs-toggle=/g' index.html
sed -i '' 's/data-target=/data-bs-target=/g' index.html
sed -i '' 's/data-spy=/data-bs-spy=/g' index.html
sed -i '' 's/data-dismiss=/data-bs-dismiss=/g' index.html
```

### CSS Class Updates (Find/Replace)

```bash
# Run these sed commands to update utility classes
sed -i '' 's/ml-auto/ms-auto/g' index.html
sed -i '' 's/mr-auto/me-auto/g' index.html
# Note: pr-10 and pl-10 appear custom, verify before changing
```

### Script Tag Update

**Before:**
```html
<script src="style/js/jquery.min.js"></script>
<script src="style/js/popper.min.js"></script>
<script src="style/js/bootstrap.min.js"></script>
```

**After:**
```html
<script src="style/js/jquery.min.js"></script>
<script src="style/js/bootstrap.bundle.min.js"></script>
```

### Custom Scripts Update (line 77)

The `.collapse('hide')` call in custom-scripts.js needs verification:

```javascript
// Current (jQuery Bootstrap 4 syntax)
$('.navbar .navbar-collapse.show').collapse('hide');

// This syntax SHOULD still work with Bootstrap 5 + jQuery
// Bootstrap 5 exposes .collapse() method when jQuery is present
```

## Testing Checklist

### Critical Tests (must pass before merge)

- [ ] Mobile hamburger menu opens/closes navbar
- [ ] Desktop nav links visible and clickable
- [ ] Scrollspy highlights current section in nav
- [ ] Page layout matches pre-migration (no visual regressions)
- [ ] No JavaScript console errors

### Secondary Tests

- [ ] Contact form displays correctly
- [ ] Form inputs have proper spacing
- [ ] Responsive breakpoints work (xs, sm, md, lg, xl)
- [ ] Background images load via data-image-src
- [ ] Portfolio filtering works (uses data-filter, not Bootstrap)
- [ ] GLightbox captions work (uses data-sub-html, not Bootstrap)

### Browser Testing Matrix

| Browser | Viewport | Priority |
|---------|----------|----------|
| Chrome Mobile | 375px | HIGH |
| Safari iOS | 375px | HIGH |
| Chrome Desktop | 1440px | HIGH |
| Safari Desktop | 1440px | MEDIUM |
| Firefox Desktop | 1440px | LOW |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `data-toggle` | `data-bs-toggle` | Bootstrap 5.0 (2021) | Must update |
| Separate Popper.js | Bundled in bootstrap.bundle.js | Bootstrap 5.0 (2021) | Simplifies dependencies |
| jQuery required | jQuery optional | Bootstrap 5.0 (2021) | Can remove later |
| `.ml-*` / `.mr-*` | `.ms-*` / `.me-*` | Bootstrap 5.0 (2021) | RTL support |
| `.form-group` | Spacing utilities | Bootstrap 5.0 (2021) | Custom CSS overrides this |

## Open Questions

1. **Custom `pr-10` and `pl-10` classes**
   - What we know: Used on form columns (lines 1225, 1232)
   - What's unclear: Whether these are custom-defined or expecting Bootstrap
   - Recommendation: Check style.css for `.pr-10` and `.pl-10` definitions. If custom, no change needed. If expecting Bootstrap (which doesn't have `-10`), may need custom CSS.

2. **Scrollspy initialization**
   - What we know: Currently uses `data-spy="scroll"` on body
   - What's unclear: Whether Bootstrap 5 automatic initialization will work
   - Recommendation: Test after migration; may need explicit JS initialization if broken.

## Sources

### Primary (HIGH confidence)
- [Bootstrap 5.3 Migration Guide](https://getbootstrap.com/docs/5.3/migration/) - Official documentation for all breaking changes
- [Bootstrap 5.3 Forms Documentation](https://getbootstrap.com/docs/5.3/forms/overview/) - Form markup changes

### Secondary (MEDIUM confidence)
- [Bootstrap 5.0 Migration Guide](https://getbootstrap.com/docs/5.0/migration/) - Original v5 breaking changes
- [Moodle Bootstrap 5 Migration](https://moodledev.io/docs/5.0/guides/bs5migration) - Backwards compatibility patterns

### Project-Specific
- `/Users/mitchellmeffert/Git/Personal/cassiecayphotography.com/.planning/research/PITFALLS.md` - Prior v2.0 milestone research
- `/Users/mitchellmeffert/Git/Personal/cassiecayphotography.com/.planning/research/ARCHITECTURE.md` - Migration phase breakdown

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Bootstrap documentation
- Data attribute changes: HIGH - Verified against codebase grep
- CSS class changes: HIGH - Verified against codebase grep
- Testing checklist: HIGH - Based on component inventory

**Research date:** 2026-01-20
**Valid until:** 90 days (Bootstrap 5.3 is stable release)
