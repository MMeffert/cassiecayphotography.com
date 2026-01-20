# Feature Landscape: Photography Portfolio Modernization

**Domain:** Photography portfolio website
**Researched:** 2026-01-19
**Overall confidence:** HIGH

## Executive Summary

Modern photography portfolios require lightweight, performant solutions that replace heavy jQuery-based libraries. The current site uses Revolution Slider (~11MB with dependencies), LightGallery, Swiper, and CubePortfolio - all jQuery-dependent and contributing to significant page weight. Modern alternatives exist that are dependency-free, smaller by 80-95%, and offer better accessibility and mobile support.

---

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Bundle Size | Recommended Solution |
|---------|--------------|------------|-------------|---------------------|
| Hero image/slider | First impression, showcases best work | Low | ~6KB | **Embla Carousel** or CSS-only crossfade |
| Image gallery grid | Core portfolio display | Medium | 0-3KB | CSS Grid + native masonry (2026) or Muuri (~12KB) |
| Lightbox viewer | Full-size image viewing | Low | ~11KB | **GLightbox** |
| Category filtering | Navigate by shoot type (Family, Newborn, etc.) | Medium | 0KB | CSS + vanilla JS (no library needed) |
| Lazy loading | Performance for 80+ images | Low | 0KB | Native `loading="lazy"` attribute |
| Responsive images | Optimal images per device | Medium | 0KB | `srcset` + `sizes` attributes |
| Mobile-first design | 60%+ traffic is mobile | Medium | 0KB | CSS media queries, touch-friendly UI |
| Contact form | Book sessions | Low | Exists | Keep current Lambda implementation |
| Social links | Connect to Instagram/Facebook | Low | 0KB | Keep current implementation |

### Recommended Table Stakes Stack

**Total JavaScript bundle: ~17-20KB** (vs. current ~150KB+)

| Component | Library | Size (gzipped) | Why This One |
|-----------|---------|----------------|--------------|
| Hero slider | Embla Carousel | ~6KB | Dependency-free, accessible, smallest footprint |
| Lightbox | GLightbox | ~11KB | Pure JS, accessible, video support, 11KB total |
| Grid/Filter | Vanilla JS + CSS Grid | 0-3KB custom | Native CSS approach, no library needed |
| Lazy loading | Native | 0KB | `loading="lazy"` has 95%+ browser support |

---

## Differentiators

Features that set product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Bundle Impact | Recommendation |
|---------|-------------------|------------|---------------|----------------|
| AVIF/WebP images | 50-70% smaller files, faster load | Medium | 0KB | **Implement** - use `<picture>` element |
| Blurhash placeholders | Elegant loading experience | Medium | ~3KB | Consider for hero images only |
| View transitions | Smooth page-like feel for SPA | Low | 0KB | **Implement** - native View Transitions API |
| Infinite scroll | Seamless gallery browsing | Medium | ~2KB | Defer - pagination simpler |
| Image zoom/pan | Detail inspection | Medium | +5KB | GLightbox includes this |
| Keyboard navigation | Accessibility, power users | Low | 0KB | GLightbox includes this |
| Print-friendly gallery | Users print favorites | Low | 0KB | CSS print styles |
| Dark/light mode | User preference | Low | 0KB | CSS custom properties |

### Priority Differentiators (High Impact, Low Effort)

1. **AVIF/WebP with JPEG fallback** - Biggest performance win, zero JS
2. **View Transitions API** - Modern feel, native browser support
3. **Keyboard navigation** - Comes free with GLightbox

---

## Anti-Features

Features to explicitly NOT build. Common mistakes in this domain.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| jQuery dependency | Adds 30KB+ for no benefit | Use vanilla JS libraries |
| Revolution Slider | 11MB, overkill for 2 slides | Embla Carousel (6KB) or CSS-only |
| Autoplay carousels | Accessibility nightmare, annoying | User-controlled navigation |
| Infinite scroll without pagination fallback | SEO issues, scroll position lost | Offer both or pagination only |
| Custom video player | Complex, unnecessary | Native `<video>` or YouTube embeds |
| Heavy animation libraries | GSAP/Anime.js add 20KB+ | CSS animations, View Transitions API |
| Masonry.js / Isotope.js | Outdated, CSS Grid handles this | Native CSS masonry (grid-lanes) |
| Image sprites | Outdated technique | Individual optimized images |
| Retina-only images | Wastes bandwidth | Responsive images with srcset |
| Flash-style intros | Dated, hurts SEO | Clean, fast hero section |

---

## Detailed Library Comparison

### Slider/Carousel Libraries

| Library | Size (gzipped) | Dependencies | Touch | A11y | Verdict |
|---------|---------------|--------------|-------|------|---------|
| **Embla Carousel** | ~6KB | None | Yes | Yes | **RECOMMENDED** - Smallest, most flexible |
| Keen Slider | ~7KB | None | Yes | Yes | Good alternative |
| Glide.js | ~8KB | None | Yes | Partial | Solid option |
| Swiper.js | 25-70KB | None | Yes | Yes | Too heavy for simple hero |
| Splide | ~12KB | None | Yes | Yes | Good but larger than needed |
| Revolution Slider | ~150KB+ | jQuery | Yes | Partial | **AVOID** - Massively oversized |

**Recommendation:** Use **Embla Carousel** for the hero. For a 2-slide crossfade, consider CSS-only solution (0KB).

### Lightbox Libraries

| Library | Size (gzipped) | Dependencies | Video | Touch | A11y | Verdict |
|---------|---------------|--------------|-------|-------|------|---------|
| **GLightbox** | ~11KB | None | Yes | Yes | Yes | **RECOMMENDED** - Best balance |
| PhotoSwipe 5 | ~15KB | None | No | Yes | Yes | Great for images only |
| Tobii | ~8KB | None | Yes | Yes | Yes | Most accessible option |
| Lity | ~3KB | None | Yes | Yes | Partial | Ultra-light but fewer features |
| LightGallery | ~25KB+ | None | Yes | Yes | Partial | Current site uses - heavy |
| Fancybox | ~20KB | jQuery | Yes | Yes | Partial | **AVOID** - jQuery dependency |

**Recommendation:** Use **GLightbox** - pure JavaScript, 11KB, full feature set including video, keyboard navigation, and accessibility.

### Grid/Filter Solutions

| Solution | Size | Dependencies | Filter | Masonry | Verdict |
|----------|------|--------------|--------|---------|---------|
| **CSS Grid + vanilla JS** | ~1-3KB custom | None | Yes | Partial | **RECOMMENDED** |
| CSS `grid-lanes` (native masonry) | 0KB | None | Manual | Yes | Use with fallback (Safari only Q1 2026) |
| Muuri | ~12KB | None | Yes | Yes | Best if complex filtering needed |
| MixItUp | ~8KB | None | Yes | No | Good filtering, commercial license |
| Isotope | ~25KB | None | Yes | Yes | **AVOID** - Slow with 50+ items |
| CubePortfolio | ~50KB+ | jQuery | Yes | Yes | **AVOID** - Current site, jQuery-based |

**Recommendation:** Use **CSS Grid with vanilla JavaScript filtering** (~1-3KB custom code). The current filtering (5 categories) is simple enough that a library is overkill. Native `grid-lanes` masonry lands mid-2026.

---

## Image Optimization Strategy

### Format Recommendations

| Format | Use Case | Browser Support | Size vs JPEG |
|--------|----------|-----------------|--------------|
| **AVIF** | Primary format | 95%+ (all modern) | 50-60% smaller |
| **WebP** | Fallback | 98%+ | 25-35% smaller |
| **JPEG** | Legacy fallback | 100% | Baseline |
| PNG | Logos with transparency | 100% | Use sparingly |

### Implementation Pattern

```html
<picture>
  <source srcset="photo.avif" type="image/avif">
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="Description" loading="lazy">
</picture>
```

### Responsive Image Breakpoints

For photography portfolios, recommended srcset widths:

| Breakpoint | Use Case | Notes |
|------------|----------|-------|
| 400w | Mobile thumbnails | Grid view on phones |
| 800w | Tablet/desktop thumbnails | Grid view |
| 1200w | Lightbox medium | Most common viewing |
| 1920w | Lightbox large | Desktop fullscreen |
| 2560w | Lightbox max | Retina displays, max needed |

### Current Site Analysis

- ~220 images totaling 81MB
- Most are PNG (unnecessary for photos)
- No responsive variants
- No modern format support

**Estimated savings with AVIF + responsive images: 60-75%** (~20-30MB total)

---

## Lazy Loading Strategy

### Native Approach (Recommended)

```html
<!-- Above the fold - load immediately -->
<img src="hero.avif" alt="Hero image">

<!-- Below the fold - lazy load -->
<img src="gallery-1.avif" alt="Photo 1" loading="lazy">
```

### Best Practices

1. **Never lazy load above-the-fold images** - Hurts LCP
2. **Use native `loading="lazy"`** - 95%+ browser support, zero JS
3. **Set explicit dimensions** - Prevents Cumulative Layout Shift (CLS)
4. **Consider `decoding="async"`** - Non-blocking decode

### Placeholder Strategy

| Approach | Size Impact | Visual Quality | Recommendation |
|----------|-------------|----------------|----------------|
| No placeholder | 0KB | Poor UX | Not recommended |
| Solid color | 0KB | Acceptable | Use for thumbnails |
| Tiny JPEG (10x10) | ~200B/image | Good | Solid middle ground |
| Blurhash | ~3KB library | Excellent | Hero images only |

**Recommendation:** Use solid color backgrounds matching site theme (0KB), or tiny blurred placeholders for hero.

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance (Table Stakes)

| Requirement | Implementation | Library Support |
|-------------|----------------|-----------------|
| Keyboard navigation | Arrow keys, Enter, Escape | GLightbox: Yes |
| Focus management | Trap focus in lightbox | GLightbox: Yes |
| Alt text | All images must have descriptions | Manual |
| Color contrast | 4.5:1 minimum | CSS |
| Reduced motion | `prefers-reduced-motion` | CSS + Embla |
| Screen reader announcements | ARIA labels | GLightbox: Yes |

### Animation Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance Targets

### Core Web Vitals Goals

| Metric | Target | Current Risk | Mitigation |
|--------|--------|--------------|------------|
| LCP (Largest Contentful Paint) | < 2.5s | High - heavy JS | Reduce JS, optimize hero |
| FID (First Input Delay) | < 100ms | Medium - jQuery | Remove jQuery |
| CLS (Cumulative Layout Shift) | < 0.1 | Medium - no dimensions | Add width/height to images |
| INP (Interaction to Next Paint) | < 200ms | Low | Light JS approach |

### Bundle Size Budget

| Category | Current (Est.) | Target | Savings |
|----------|----------------|--------|---------|
| JavaScript | ~150KB+ | ~20KB | 85%+ |
| CSS | ~100KB+ | ~30KB | 70%+ |
| Images | 81MB | ~25MB | 70%+ |
| Total page weight | ~90MB | ~27MB | 70%+ |

---

## Migration Path from Current Stack

### Current Dependencies to Replace

| Current | Size | Replacement | New Size | Savings |
|---------|------|-------------|----------|---------|
| jQuery | 30KB | Remove | 0KB | 30KB |
| Revolution Slider | 150KB+ | Embla Carousel | 6KB | 144KB+ |
| LightGallery | 25KB | GLightbox | 11KB | 14KB |
| Swiper | 25KB | Embla Carousel | 6KB | 19KB |
| CubePortfolio | 50KB+ | CSS Grid + vanilla JS | 3KB | 47KB+ |
| Bootstrap JS | 25KB | Remove (CSS only) | 0KB | 25KB |

**Total estimated JS savings: ~280KB+**

### CSS Considerations

- Bootstrap CSS can be reduced to grid/utilities only (~20KB vs 160KB)
- Or replace with modern CSS (Grid, Flexbox, custom properties)
- Revolution Slider CSS can be completely removed

---

## Feature Priority Matrix

### Phase 1: Foundation (Must Have)

| Feature | Effort | Impact | Notes |
|---------|--------|--------|-------|
| Remove jQuery | Medium | High | Unlocks modern libraries |
| Replace Revolution Slider | Low | High | Biggest visual component |
| Implement GLightbox | Low | Medium | Drop-in replacement |
| Native lazy loading | Low | High | Add `loading="lazy"` |
| Responsive images | Medium | High | Requires image processing |

### Phase 2: Optimization (Should Have)

| Feature | Effort | Impact | Notes |
|---------|--------|--------|-------|
| AVIF/WebP conversion | Medium | Very High | 60%+ bandwidth savings |
| CSS Grid filtering | Medium | Medium | Replace CubePortfolio |
| Remove Bootstrap JS | Low | Medium | Further JS reduction |
| Explicit image dimensions | Low | Medium | CLS improvement |

### Phase 3: Enhancement (Nice to Have)

| Feature | Effort | Impact | Notes |
|---------|--------|--------|-------|
| View Transitions API | Low | Low | Modern navigation feel |
| Dark mode | Low | Low | User preference |
| Blurhash placeholders | Medium | Low | Polish |
| Print styles | Low | Low | Niche use case |

---

## Sources

### Slider/Carousel Research
- [Embla Carousel](https://www.embla-carousel.com) - Official documentation
- [Best React Carousel Libraries 2026](https://blog.croct.com/post/best-react-carousel-slider-libraries) - Croct Blog
- [Scaleflex Best Slider Plugins 2025](https://blog.scaleflex.com/best-slider-plugin/)

### Lightbox Research
- [GLightbox GitHub](https://github.com/biati-digital/glightbox) - Official repository
- [Tobii GitHub](https://github.com/midzer/tobii) - Accessible lightbox
- [Top JavaScript Lightbox Galleries](https://www.lightgalleryjs.com/blog/top-6-javascript-lightbox-galleries./)

### Image Formats
- [AVIF vs WebP 2026](https://elementor.com/blog/webp-vs-avif/) - Elementor
- [Modern Image Formats](https://www.smashingmagazine.com/2021/09/modern-image-formats-avif-webp/) - Smashing Magazine
- [Can I Use - AVIF](https://caniuse.com/avif)
- [Can I Use - WebP](https://caniuse.com/webp)

### Lazy Loading
- [MDN Lazy Loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading)
- [Lazy Loading Images Complete Guide](https://imagekit.io/blog/lazy-loading-images-complete-guide/) - ImageKit
- [Vanilla LazyLoad](https://github.com/verlok/vanilla-lazyload)

### CSS Masonry/Grid
- [CSS Grid Lanes](https://byteiota.com/css-grid-lanes-kills-masonry-js-webkit-ships-native-css/)
- [MDN Masonry Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Masonry_layout)
- [Masonry Things You Won't Need a Library For](https://www.smashingmagazine.com/2025/12/masonry-things-you-wont-need-library-anymore/) - Smashing Magazine

### Performance
- [High Performance Images 2026](https://requestmetrics.com/web-performance/high-performance-images/) - Request Metrics
- [Responsive Images Best Practices 2025](https://dev.to/razbakov/responsive-images-best-practices-in-2025-4dlb)
- [Bundlephobia](https://bundlephobia.com) - Package size analysis

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Slider recommendations | HIGH | Embla well-documented, multiple sources confirm |
| Lightbox recommendations | HIGH | GLightbox thoroughly researched, 11KB verified |
| Image format strategy | HIGH | AVIF/WebP support verified via Can I Use |
| CSS Grid/Masonry | MEDIUM | Native masonry timeline uncertain (mid-2026) |
| Bundle size estimates | MEDIUM | Based on Bundlephobia + search results |
| Performance targets | HIGH | Based on Core Web Vitals standards |
