# Phase 20: Offcanvas Navigation - Research

**Researched:** 2026-01-21
**Domain:** Bootstrap 5.3.3 offcanvas component, mobile navigation patterns
**Confidence:** HIGH

## Summary

This phase replaces Bootstrap's traditional navbar collapse component with the offcanvas component for mobile navigation. Bootstrap 5 introduced offcanvas as a native component specifically designed for slide-in drawer navigation, eliminating the need for third-party libraries.

The offcanvas component provides a superior mobile UX compared to the traditional navbar collapse by:
- Sliding in from the viewport edge (left, right, top, or bottom)
- Overlaying content with a dismissible backdrop
- Supporting smooth CSS transitions without JavaScript animation
- Providing accessible keyboard and screen reader support out of the box

For this project, offcanvas will slide from the left side (`.offcanvas-start`) on mobile viewports (<992px) while desktop (≥992px) maintains the traditional horizontal navbar using `.navbar-expand-lg`. The existing sticky header implementation (from Phase 12) will be integrated with offcanvas, ensuring both the original navbar and sticky clone use the same mobile drawer pattern.

**Primary recommendation:** Use Bootstrap 5.3.3 native offcanvas with `.offcanvas-lg` responsive class, `.offcanvas-start` placement, and vanilla JavaScript event listeners to close the menu on navigation link clicks. No additional libraries required.

## Standard Stack

### Core (Already in Project)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Bootstrap | 5.3.3 | UI framework with native offcanvas | De facto standard for responsive components |
| Vanilla JS | ES6+ | Event handling for link clicks | Native browser API, no dependencies |

### No Additional Libraries Needed

Bootstrap 5.3.3's offcanvas is feature-complete and requires no plugins:
- No jQuery required (Bootstrap 5 is jQuery-free)
- No animation libraries (CSS transitions built-in)
- No accessibility libraries (ARIA attributes handled by Bootstrap)

**Installation:** Already installed (Bootstrap 5.3.3 from Phase 10)

```bash
# No new dependencies
# Bootstrap 5.3.3 already includes offcanvas component
```

## Architecture Patterns

### Recommended HTML Structure

```html
<nav class="navbar navbar-expand-lg fixed-top">
  <div class="container">
    <!-- Brand -->
    <a class="navbar-brand" href="#">Brand</a>

    <!-- Toggler button (mobile only) -->
    <button class="navbar-toggler" type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#navbarOffcanvas"
            aria-controls="navbarOffcanvas"
            aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Offcanvas container -->
    <div class="offcanvas offcanvas-start"
         tabindex="-1"
         id="navbarOffcanvas"
         aria-labelledby="offcanvasNavbarLabel">

      <!-- Offcanvas header (mobile only) -->
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
        <button type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"></button>
      </div>

      <!-- Offcanvas body (contains nav items) -->
      <div class="offcanvas-body">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link scroll" href="#home">Home</a>
          </li>
          <!-- More nav items -->
        </ul>
      </div>
    </div>
  </div>
</nav>
```

### Pattern 1: Responsive Offcanvas with `.navbar-expand-lg`

**What:** Offcanvas appears only on mobile (<992px), horizontal navbar on desktop (≥992px)

**When to use:** Sites that need traditional desktop navigation but mobile drawer

**Example:**
```html
<!-- Source: https://getbootstrap.com/docs/5.3/components/navbar/ -->
<nav class="navbar navbar-expand-lg">
  <!-- navbar-expand-lg means: expand to horizontal at lg (992px) and above -->
  <div class="offcanvas offcanvas-start" tabindex="-1" id="navbarOffcanvas">
    <!-- Content behaves as offcanvas below lg, inline at lg+ -->
  </div>
</nav>
```

**Key insight:** The `.navbar-expand-lg` class automatically switches behavior at the breakpoint. Below 992px, the offcanvas component is active. At 992px and above, the content displays inline as a traditional navbar.

### Pattern 2: Closing Offcanvas on Link Click (Single-Page Sites)

**What:** Automatically close offcanvas when navigation links are clicked

**When to use:** Single-page sites with hash-based navigation (like this project)

**Example:**
```javascript
// Source: https://forum.bootstrapstudio.io/t/how-to-offcanvas-close-after-click-on-anchor-link/9139
// Bootstrap 5.2+ requires JavaScript (data-bs-dismiss causes jerky scroll)
document.querySelectorAll('.offcanvas .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const offcanvasElement = document.querySelector('.offcanvas.show');
    if (offcanvasElement) {
      const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
      offcanvas.hide();
    }
  });
});
```

**Important:** The `data-bs-dismiss="offcanvas"` attribute on links causes jerky page scrolling on some devices in Bootstrap 5.2+. Use the JavaScript `.hide()` method instead for smooth behavior.

### Pattern 3: Sticky Header Integration

**What:** Multiple navbars (original + sticky clone) share the same offcanvas

**When to use:** Sites with sticky header that clones the navbar on scroll

**Example:**
```javascript
// Each navbar's toggler can target the same offcanvas ID
// Original navbar toggler:
<button data-bs-toggle="offcanvas" data-bs-target="#navbarOffcanvas">

// Sticky clone toggler:
<button data-bs-toggle="offcanvas" data-bs-target="#navbarOffcanvas">

// Single offcanvas shared by both:
<div class="offcanvas offcanvas-start" id="navbarOffcanvas">
```

**Anti-pattern:** Don't create separate offcanvas instances for each navbar. Bootstrap's offcanvas only allows one visible at a time, and managing multiple instances creates state synchronization issues.

**Better approach:** Use a single offcanvas container outside both navbars, or clone the offcanvas when cloning the sticky navbar.

### Pattern 4: Hamburger Icon Animation

**What:** Toggle active state on hamburger icon when offcanvas opens/closes

**When to use:** Custom hamburger icons that animate (not using Bootstrap's default toggler-icon)

**Example:**
```javascript
// Source: Project's existing pattern from Phase 12
const offcanvasElement = document.getElementById('navbarOffcanvas');
const hamburger = document.querySelector('.hamburger.animate');

offcanvasElement.addEventListener('show.bs.offcanvas', () => {
  hamburger.classList.add('active');
});

offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
  hamburger.classList.remove('active');
});
```

### Anti-Patterns to Avoid

- **Multiple offcanvas instances visible:** Bootstrap only supports one offcanvas at a time (similar to modals). Don't try to show multiple drawers simultaneously.

- **Using margin/translate on `.offcanvas`:** Cannot use these CSS properties on the offcanvas element itself due to animation constraints. Use it as an independent wrapper instead.

- **Forgetting `tabindex="-1"`:** The offcanvas container requires `tabindex="-1"` for proper keyboard accessibility and focus management.

- **Missing ARIA attributes:** Always include `aria-labelledby` (referencing the title) and `aria-controls` (on the toggler).

- **Using `data-bs-dismiss="offcanvas"` on navigation links:** Causes jerky scroll behavior on mobile devices in Bootstrap 5.2+. Use JavaScript `.hide()` method instead.

## Don't Hand-Roll

Problems that look simple but have existing Bootstrap solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Slide-in drawer animation | Custom CSS transitions with transform | Bootstrap `.offcanvas` component | Edge cases: backdrop management, focus trapping, keyboard handling, screen reader announcements, scroll locking |
| Backdrop click detection | Click handlers on overlay div | Bootstrap `data-bs-backdrop` option | Edge cases: escape key, multiple overlays, z-index conflicts, reduced motion preferences |
| Responsive collapse/expand | Media query + JS toggle logic | Bootstrap `.navbar-expand-lg` class | Edge cases: resize events, orientation changes, window resize during transition |
| Focus management | Custom focus trap logic | Bootstrap's built-in focus management | Edge cases: tab order, screen reader navigation, return focus on close, nested focusable elements |
| Close on navigation | Manual hide() calls + state tracking | Bootstrap events (`shown.bs.offcanvas`, `hidden.bs.offcanvas`) | Edge cases: animation timing, state synchronization, preventing double-close |

**Key insight:** Offcanvas looks like "just a sliding div" but involves complex accessibility requirements (ARIA roles, focus trapping, keyboard navigation), animation timing (waiting for CSS transitions), and state management (backdrop, body scroll-locking, z-index). Bootstrap handles all of this in ~400 lines of battle-tested JavaScript.

## Common Pitfalls

### Pitfall 1: Z-Index Conflicts with Sticky Header

**What goes wrong:** Sticky header appears on top of offcanvas backdrop or the offcanvas drawer itself overlaps incorrectly with other fixed/sticky elements.

**Why it happens:** Bootstrap uses a specific z-index scale:
- Sticky: 1020
- Fixed: 1030
- Offcanvas backdrop: 1040
- Offcanvas: 1045

Custom sticky headers often use arbitrary z-index values (like 1039 from Phase 12's `.banner--clone`) that can conflict with Bootstrap's layering.

**How to avoid:**
1. Use Bootstrap's standard z-index values: sticky elements should use 1020 or lower
2. Adjust custom sticky header to use `z-index: 1020` or create a new stacking context with `isolation: isolate`
3. Never use z-index values between 1040-1055 (reserved for offcanvas and modal system)

**Warning signs:**
- Sticky header visible through offcanvas backdrop
- Offcanvas backdrop appears above offcanvas content
- Multiple overlays layering incorrectly

**Reference:** [Bootstrap Z-Index Documentation](https://getbootstrap.com/docs/5.3/layout/z-index/)

### Pitfall 2: Stacking Context Issues with Sticky-Top

**What goes wrong:** Elements with `.sticky-top` class don't fade properly when offcanvas opens, appearing to overlay the backdrop.

**Why it happens:** CSS stacking contexts. When multiple elements use `.sticky-top` without an intervening stacking context, markup order determines layering regardless of z-index values.

**How to avoid:**
1. Add `isolation: isolate` to the sticky element's container
2. Add `contain: layout` to create a new stacking context
3. Apply z-index to a positioned parent element

**Example fix:**
```html
<!-- Problem: sticky-top overlays backdrop -->
<div class="sticky-top">Content</div>

<!-- Solution: create stacking context -->
<div class="sticky-top" style="isolation: isolate;">Content</div>
```

**Warning signs:**
- Sticky elements visible when offcanvas is open
- Backdrop doesn't cover sticky content
- Strange layering when scrolling with offcanvas open

**Reference:** [GitHub Issue #37920](https://github.com/twbs/bootstrap/issues/37920)

### Pitfall 3: Jerky Scroll with data-bs-dismiss on Links

**What goes wrong:** Adding `data-bs-dismiss="offcanvas"` to navigation links causes jerky/jumpy page scrolling when navigating to hash anchors.

**Why it happens:** Race condition between Bootstrap's offcanvas closing animation (300ms default) and the browser's scroll-to-anchor behavior. The offcanvas starts closing, changing the page layout, while the browser is calculating scroll position.

**How to avoid:**
Use JavaScript to hide the offcanvas AFTER navigation:
```javascript
// DON'T: Causes jerky scroll
<a href="#section" data-bs-dismiss="offcanvas">Section</a>

// DO: Smooth navigation
<a href="#section" class="nav-link">Section</a>

// JavaScript:
document.querySelectorAll('.offcanvas .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const offcanvas = bootstrap.Offcanvas.getInstance(
      document.querySelector('.offcanvas.show')
    );
    if (offcanvas) offcanvas.hide();
  });
});
```

**Warning signs:**
- Page "jumps" when clicking nav links on mobile
- Scroll position inconsistent after navigation
- Visible layout shift during menu close

**Reference:** [Bootstrap Studio Forum](https://forum.bootstrapstudio.io/t/how-to-offcanvas-close-after-click-on-anchor-link/9139)

### Pitfall 4: Only One Offcanvas at a Time

**What goes wrong:** Attempting to show multiple offcanvas instances simultaneously (e.g., separate instances for original and sticky navbar).

**Why it happens:** Bootstrap's design limitation—offcanvas shares code with modals and only supports one visible instance at a time.

**How to avoid:**
- Use a single offcanvas instance shared by all togglers
- Don't create separate offcanvas elements for original and cloned navbars
- If cloning navbar, clone the offcanvas too or keep it as a singleton

**Warning signs:**
- Second offcanvas doesn't open when first is visible
- Backdrop stacking issues
- JavaScript console errors about existing instances

**Reference:** [Bootstrap Offcanvas Documentation](https://getbootstrap.com/docs/5.3/components/offcanvas/)

### Pitfall 5: Missing Responsive Class

**What goes wrong:** Offcanvas appears on all screen sizes, including desktop where horizontal navbar is intended.

**Why it happens:** Forgetting to add `.navbar-expand-lg` to the navbar or `.offcanvas-lg` to the offcanvas element.

**How to avoid:**
```html
<!-- WRONG: Offcanvas on all screen sizes -->
<nav class="navbar">
  <div class="offcanvas offcanvas-start">

<!-- RIGHT: Offcanvas only below lg (992px) -->
<nav class="navbar navbar-expand-lg">
  <div class="offcanvas offcanvas-start">
```

**Warning signs:**
- Desktop shows hamburger icon instead of horizontal nav
- Offcanvas drawer appears on large screens
- Navigation links don't display inline on desktop

### Pitfall 6: Forgetting Accessibility Attributes

**What goes wrong:** Screen readers can't properly announce or navigate the offcanvas menu.

**Why it happens:** Missing required ARIA attributes (`aria-labelledby`, `aria-controls`, `aria-label`).

**How to avoid:**
```html
<!-- Complete accessibility attributes -->
<button class="navbar-toggler" type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#navbarOffcanvas"
        aria-controls="navbarOffcanvas"
        aria-label="Toggle navigation">
  <span class="navbar-toggler-icon"></span>
</button>

<div class="offcanvas offcanvas-start"
     tabindex="-1"
     id="navbarOffcanvas"
     aria-labelledby="offcanvasNavbarLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
    <button type="button" class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"></button>
  </div>
</div>
```

**Warning signs:**
- Screen reader testing shows unlabeled regions
- WAVE or axe accessibility tools flag missing labels
- Keyboard navigation doesn't work as expected

## Code Examples

Verified patterns from official sources:

### Basic Offcanvas Navbar (Mobile Only)

```html
<!-- Source: https://getbootstrap.com/docs/5.3/components/navbar/ -->
<nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Offcanvas navbar</a>
    <button class="navbar-toggler" type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="offcanvas offcanvas-end" tabindex="-1"
         id="offcanvasNavbar"
         aria-labelledby="offcanvasNavbarLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Offcanvas</h5>
        <button type="button" class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>
```

### Close Offcanvas on Navigation Link Click

```javascript
// Source: Community pattern (Bootstrap Studio Forum)
// For single-page sites with hash navigation
document.addEventListener('DOMContentLoaded', () => {
  const offcanvasElement = document.querySelector('.offcanvas');
  const navLinks = document.querySelectorAll('.offcanvas .nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    });
  });
});
```

### Hamburger Icon Active State Sync

```javascript
// Source: Project's existing pattern from Phase 12 (adapted)
const offcanvasElement = document.getElementById('navbarOffcanvas');
const hamburgerButtons = document.querySelectorAll('.hamburger.animate');

// Add active class when offcanvas opens
offcanvasElement.addEventListener('show.bs.offcanvas', () => {
  hamburgerButtons.forEach(btn => btn.classList.add('active'));
});

// Remove active class when offcanvas closes
offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
  hamburgerButtons.forEach(btn => btn.classList.remove('active'));
});
```

### Offcanvas with Custom Options

```javascript
// Source: https://getbootstrap.com/docs/5.3/components/offcanvas/
const offcanvasElement = document.getElementById('myOffcanvas');
const offcanvas = new bootstrap.Offcanvas(offcanvasElement, {
  backdrop: true,     // Show backdrop (default: true)
  keyboard: true,     // Close on ESC key (default: true)
  scroll: false       // Prevent body scroll when open (default: false)
});

// Programmatic control
offcanvas.show();
offcanvas.hide();
offcanvas.toggle();
```

### Event Listeners for Lifecycle Hooks

```javascript
// Source: https://getbootstrap.com/docs/5.3/components/offcanvas/
const myOffcanvas = document.getElementById('myOffcanvas');

myOffcanvas.addEventListener('show.bs.offcanvas', event => {
  // Fires immediately when show() is called
  console.log('Offcanvas is about to show');
});

myOffcanvas.addEventListener('shown.bs.offcanvas', event => {
  // Fires when offcanvas is fully visible (after CSS transition)
  console.log('Offcanvas is now visible');
});

myOffcanvas.addEventListener('hide.bs.offcanvas', event => {
  // Fires immediately when hide() is called
  console.log('Offcanvas is about to hide');
});

myOffcanvas.addEventListener('hidden.bs.offcanvas', event => {
  // Fires when offcanvas is fully hidden (after CSS transition)
  console.log('Offcanvas is now hidden');
});

myOffcanvas.addEventListener('hidePrevented.bs.offcanvas', event => {
  // Fires when backdrop is static and user clicks outside
  console.log('User tried to close but backdrop is static');
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| jQuery offcanvas plugins (e.g., Drawer.js) | Bootstrap 5 native offcanvas | Bootstrap 5.0 (May 2021) | No jQuery dependency, native accessibility, smaller bundle |
| Navbar collapse for mobile nav | Offcanvas for mobile drawer | Bootstrap 5.0+ (May 2021) | Better UX with slide-in drawer vs. push-down collapse |
| `data-bs-dismiss="offcanvas"` on links | JavaScript `.hide()` method | Bootstrap 5.2+ (July 2022) | Fixes jerky scroll on mobile devices |
| Dark variant classes (`.text-bg-dark`) | `data-bs-theme="dark"` | Bootstrap 5.3.0 (May 2023) | Unified color mode system |
| Manual z-index management | Bootstrap z-index scale | Bootstrap 5.0+ | Consistent layering across components |

**Deprecated/outdated:**
- **`.offcanvas.show` for default visibility:** Use `.show` class carefully—offcanvas should typically be hidden on page load. If you need it visible by default, ensure it's intentional and not a mistake.
- **Manual backdrop creation:** Bootstrap handles backdrop automatically; don't create custom overlay divs.
- **jQuery-based offcanvas plugins:** Bootstrap 5's native implementation is superior and doesn't require jQuery.

## Open Questions

Things that couldn't be fully resolved:

1. **Sticky header clone offcanvas strategy**
   - What we know: Phase 12 created a cloned navbar for sticky header (`.banner--clone`). Both navbars will need to trigger the same offcanvas.
   - What's unclear: Should we clone the offcanvas element when cloning the navbar, or use a single shared offcanvas instance?
   - Recommendation: Start with single shared instance (simplest). If state synchronization issues arise (e.g., hamburger active states not syncing), consider cloning the offcanvas with the navbar.

2. **Animation timing with smooth scroll**
   - What we know: Closing offcanvas takes 300ms (default transition). Smooth scroll to hash anchors also animates.
   - What's unclear: Does closing offcanvas before or during smooth scroll cause any visual artifacts?
   - Recommendation: Test both approaches: (a) close offcanvas, then scroll, vs. (b) close and scroll simultaneously. Choose based on visual smoothness.

3. **Custom hamburger icon CSS compatibility**
   - What we know: Project uses custom `.hamburger.animate` with `.active` state (from Phase 12)
   - What's unclear: Does Bootstrap's default toggler-icon need to be replaced, or can it coexist with custom styles?
   - Recommendation: Keep existing hamburger CSS, replace `data-bs-toggle="collapse"` with `data-bs-toggle="offcanvas"` in markup, add JavaScript to sync `.active` class with offcanvas events.

## Sources

### Primary (HIGH confidence)
- [Bootstrap 5.3 Offcanvas Component Documentation](https://getbootstrap.com/docs/5.3/components/offcanvas/) - Official API reference
- [Bootstrap 5.3 Navbar Documentation](https://getbootstrap.com/docs/5.3/components/navbar/) - Offcanvas navbar integration
- [Bootstrap 5.3 Z-Index Documentation](https://getbootstrap.com/docs/5.3/layout/z-index/) - Component layering values
- Phase 12 Research - Current sticky header implementation

### Secondary (MEDIUM confidence)
- [Bootstrap Studio Forum - Close Offcanvas on Link Click](https://forum.bootstrapstudio.io/t/how-to-offcanvas-close-after-click-on-anchor-link/9139) - Community pattern (verified with official docs)
- [GitHub Issue #37920 - Offcanvas and Sticky-Top Conflict](https://github.com/twbs/bootstrap/issues/37920) - Official issue tracker
- [GitHub Issue #35073 - Offcanvas Navbar Z-Index](https://github.com/twbs/bootstrap/issues/35073) - Official issue tracker

### Tertiary (LOW confidence)
- [W3Schools Bootstrap 5 Offcanvas](https://www.w3schools.com/bootstrap5/bootstrap_offcanvas.php) - Tutorial examples (not authoritative)
- [MDBootstrap Offcanvas Examples](https://mdbootstrap.com/docs/standard/extended/offcanvas/) - Extended examples (third-party)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Bootstrap 5.3.3 native component, no additional libraries
- Architecture: HIGH - Official Bootstrap documentation and community-verified patterns
- Pitfalls: HIGH - Official GitHub issues and documented z-index conflicts
- Integration with sticky header: MEDIUM - Requires testing single vs. cloned offcanvas approach

**Research date:** 2026-01-21
**Valid until:** 2026-07-21 (6 months - Bootstrap releases ~every 3-4 months, but offcanvas API is stable)

**Bootstrap version specificity:**
This research is specific to Bootstrap 5.3.3. Key features used:
- Offcanvas component (available since 5.0)
- Responsive offcanvas classes (available since 5.2)
- Z-index scale (stable since 5.0, refined in 5.1)
- `data-bs-theme` for dark mode (5.3.0+, replaces deprecated dark variant classes)
