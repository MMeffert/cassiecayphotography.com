# Architecture Research: SEO Integration for Vite Static Site

**Project:** Cassie Cay Photography - SEO Milestone
**Researched:** 2026-01-21
**Confidence:** HIGH

## Executive Summary

SEO features for this Vite-built photography portfolio integrate through three architectural approaches: inline JSON-LD for structured data, build-time script generation for image sitemaps, and static/dynamic meta tag injection. The existing architecture (single HTML file, Vite build, S3 hosting) supports all SEO features without major structural changes.

**Key Architectural Decision:** All SEO features can be implemented incrementally without disrupting existing build process. Structured data goes inline, sitemap generation extends build scripts, meta tags remain static (already present).

---

## Current Architecture Analysis

### Build Flow (As-Is)

```
Source Files
    ├── index.html (single page app)
    ├── images-optimized/ (84 portfolio images)
    │   ├── jpeg/
    │   ├── webp/
    │   └── avif/
    ├── style/ (CSS + vendored JS)
    └── scripts/ (optimize-images.js, validation scripts)
         ↓
    npm run build (vite build)
         ↓
    dist/
    ├── index.html
    ├── assets/ (hashed JS/CSS)
    ├── images-optimized/ (copied)
    ├── style/ (copied)
    ├── sitemap.xml (existing, manual)
    └── robots.txt (existing, manual)
         ↓
    GitHub Actions deploy
         ↓
    S3 + CloudFront
```

### Existing SEO Foundation

**Already Present:**
- Basic meta tags (description, keywords, author)
- Open Graph tags (og:title, og:description, og:type, og:url)
- Canonical link
- Manual sitemap.xml (exists in vite.config.js copy targets)
- robots.txt
- Semantic HTML5 structure
- Image lazy loading
- Optimized image formats (AVIF, WebP, JPEG)

**Missing (SEO Milestone Goals):**
- JSON-LD structured data (LocalBusiness, ImageGallery)
- Image sitemap with metadata
- Schema.org markup for portfolio images
- Enhanced Open Graph images (og:image missing)

---

## Structured Data Integration

### Recommended Approach: Inline JSON-LD in `<head>`

**Location:** Directly in `index.html` within `<head>` section

**Why Inline:**
- Google's preferred method ([Google SEO docs](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data))
- No build process changes required
- Easier to maintain and validate
- No JavaScript execution needed (works with crawlers)
- Compatible with existing single-page architecture

**Implementation Pattern:**

```html
<head>
  <!-- Existing meta tags -->

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://cassiecayphotography.com/#business",
    "name": "Cassie Cay Photography",
    "description": "Professional photographer in Madison, Wisconsin specializing in family, newborn, senior, milestone, and event photography",
    "url": "https://cassiecayphotography.com",
    "telephone": "",
    "email": "cassiecayphoto@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Waunakee",
      "addressRegion": "WI",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 43.1911,
      "longitude": -89.4526
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 43.0731,
        "longitude": -89.4012
      },
      "geoRadius": "50 miles"
    },
    "priceRange": "$250-$450",
    "image": "https://cassiecayphotography.com/images-optimized/jpeg/full/cassiecay-aboutbw.jpg"
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Featured Photos",
    "description": "Portfolio of family, newborn, senior, milestone, and event photography by Cassie Cay",
    "url": "https://cassiecayphotography.com/#portfolio",
    "associatedMedia": [
      {
        "@type": "ImageObject",
        "contentUrl": "https://cassiecayphotography.com/images-optimized/jpeg/full/cassiecay-F1-full.jpg",
        "thumbnail": "https://cassiecayphotography.com/images-optimized/jpeg/800w/cassiecay-F1.jpg",
        "encodingFormat": "image/jpeg",
        "caption": "Family photography",
        "author": {
          "@type": "Person",
          "name": "Cassie Meffert"
        }
      }
      // ... additional images
    ]
  }
  </script>
</head>
```

**Data Source:** Extract from existing HTML structure
- Portfolio images already have category classes (cat1=Family, cat2=Milestone, etc.)
- Image paths already structured in `images-optimized/`
- Captions can be derived from categories

**Validation:** Use [Google Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/)

**Build Integration:** None required initially. For future maintainability, consider:
1. Extract image data to JSON file
2. Use Vite plugin to inject at build time
3. For now: manual inline is fastest and Google-recommended

---

## Image Sitemap Generation

### Recommended Approach: Build-Time Node.js Script

**Integration Point:** Extends existing `scripts/` directory pattern

**Architecture:**

```
npm run build
    ↓
1. scripts/optimize-images.js (existing - runs prebuild)
2. vite build
3. scripts/generate-image-sitemap.js (NEW - runs postbuild)
    ↓
    Scans dist/images-optimized/
    Reads portfolio image data
    Generates dist/image-sitemap.xml
    Updates dist/sitemap.xml (index)
```

**Why Build-Time Generation:**
- Images already exist in predictable structure
- Build script can read actual files from `images-optimized/`
- No runtime overhead
- Automatically updates when images change
- Fits existing prebuild/postbuild hook pattern

**Implementation Approach:**

```javascript
// scripts/generate-image-sitemap.js
import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { glob } from 'glob';
import { parse } from 'node-html-parser';
import { readFile } from 'fs/promises';

async function generateImageSitemap() {
  // 1. Parse index.html to extract portfolio images with categories
  const html = await readFile('dist/index.html', 'utf-8');
  const root = parse(html);

  // 2. Extract portfolio items with metadata
  const portfolioItems = root.querySelectorAll('.portfolio-item');
  const images = portfolioItems.map(item => ({
    category: extractCategory(item.getAttribute('class')),
    fullUrl: extractFullImageUrl(item),
    thumbUrl: extractThumbnailUrl(item)
  }));

  // 3. Generate image sitemap using sitemap.js
  const sitemap = new SitemapStream({
    hostname: 'https://cassiecayphotography.com',
    xmlns: {
      image: 'http://www.google.com/schemas/sitemap-image/1.1'
    }
  });

  // 4. Add main portfolio page with all images
  sitemap.write({
    url: '/#portfolio',
    img: images.map(img => ({
      url: img.fullUrl,
      caption: getCategoryCaption(img.category),
      title: `${img.category} Photography by Cassie Cay`,
      geoLocation: 'Madison, Wisconsin'
    }))
  });

  // 5. Write to dist/image-sitemap.xml
  const data = await streamToPromise(sitemap);
  await writeFile('dist/image-sitemap.xml', data.toString());
}
```

**Google Image Sitemap Spec:**
- Each `<url>` can contain up to 1,000 `<image:image>` tags ([Google Image Sitemaps docs](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps))
- Critical tags: `<image:loc>` (required), `<image:caption>`, `<image:title>`, `<image:geo_location>`
- For photography portfolios, use separate sitemap file ([Best practices 2026](https://www.clickrank.ai/image-sitemap-structure-google-lens/))

**Sitemap Index Pattern:**

```xml
<!-- dist/sitemap.xml (main index) -->
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://cassiecayphotography.com/pages-sitemap.xml</loc>
    <lastmod>2026-01-21</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://cassiecayphotography.com/image-sitemap.xml</loc>
    <lastmod>2026-01-21</lastmod>
  </sitemap>
</sitemapindex>
```

**Required npm Package:** `sitemap` ([npm: sitemap](https://www.npmjs.com/package/sitemap))
- Supports image extensions with `xmlns:image` namespace
- Used by 1.7M+ projects, well-maintained
- HIGH confidence (verified in official docs)

---

## Meta Tags Enhancement

### Recommended Approach: Static Inline (Current) + Validation

**Current State (Already Good):**
```html
<meta name="description" content="...">
<meta property="og:title" content="Cassie Cay Photography">
<meta property="og:description" content="...">
<meta property="og:type" content="website">
<meta property="og:url" content="https://cassiecayphotography.com">
<link rel="canonical" href="https://cassiecayphotography.com">
```

**Missing but Critical:**
```html
<!-- Add to index.html <head> -->
<meta property="og:image" content="https://cassiecayphotography.com/images-optimized/jpeg/full/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Cassie Cay Photography portfolio">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://cassiecayphotography.com/images-optimized/jpeg/full/og-image.jpg">
```

**OG Image Specifications ([OpenGraph best practices](https://www.opengraph.xyz/)):**
- Size: 1200x630px (1.91:1 aspect ratio)
- Format: JPEG (best compatibility)
- Max size: 8MB (but aim for <300KB)
- For photography: Use a compelling portfolio image or brand composite

**No Build Changes Required:**
- Static meta tags work best for single-page sites
- Already in `<head>`, crawlers parse correctly
- Dynamic injection only needed for multi-page apps

**Alternative (Future):** If content becomes dynamic, use `vite-plugin-html-injection` ([GitHub](https://github.com/altrusl/vite-plugin-html-injection)) to inject from external JSON config

---

## Build Process Changes

### Required Modifications

**1. package.json Scripts:**

```json
{
  "scripts": {
    "preprocess": "node scripts/optimize-images.js",
    "prebuild": "npm run preprocess",
    "build": "vite build",
    "postbuild": "node scripts/generate-image-sitemap.js",
    "validate:seo": "node scripts/validate-structured-data.js"
  }
}
```

**2. New Dependencies:**

```json
{
  "devDependencies": {
    "sitemap": "^8.0.0"
  }
}
```

**3. New Scripts:**

- `scripts/generate-image-sitemap.js` - Build-time sitemap generator
- `scripts/validate-structured-data.js` - Pre-deploy JSON-LD validation

**4. Vite Config (No changes needed):**

Current `viteStaticCopy` already copies `sitemap.xml` and `robots.txt`. After postbuild script runs, new files automatically included.

**5. GitHub Actions (No changes needed):**

Current workflow runs `npm run build`, which will trigger:
1. prebuild: optimize images
2. build: vite build
3. postbuild: generate image sitemap

Then syncs `dist/` to S3 (already includes all XML files).

---

## Implementation Order (Recommended Phase Sequence)

### Phase 1: Meta Tags (Lowest Risk, Immediate Impact)

**Why First:**
- Zero build process changes
- Immediate SEO benefit
- Easy to validate
- No deployment risk

**Tasks:**
1. Add missing og:image meta tags to index.html
2. Create/select og-image.jpg (1200x630)
3. Add Twitter Card tags
4. Test with [OpenGraph Preview](https://www.opengraph.xyz/)

**Estimated Effort:** 30 minutes
**Risk:** None
**SEO Impact:** Medium (improves social sharing)

---

### Phase 2: Structured Data (Medium Risk, High Impact)

**Why Second:**
- Inline JSON-LD in `<head>` (no build changes)
- Requires content mapping but straightforward
- High SEO value for local business + portfolio
- Can validate before deploy

**Tasks:**
1. Add LocalBusiness JSON-LD to index.html
2. Add ImageGallery JSON-LD with top 10-20 portfolio images
3. Validate with Google Rich Results Test
4. Deploy and test

**Estimated Effort:** 2-3 hours
**Risk:** Low (validation tools catch errors)
**SEO Impact:** High (rich results, local search)

**Data Extraction Strategy:**

```javascript
// Helper to generate ImageGallery JSON from HTML
const portfolioItems = document.querySelectorAll('.portfolio-item');
const images = Array.from(portfolioItems).slice(0, 20).map(item => {
  const img = item.querySelector('img');
  const link = item.querySelector('a');
  const category = item.className.match(/cat\d+/)[0];

  return {
    "@type": "ImageObject",
    "contentUrl": link.href,
    "thumbnail": img.src,
    "encodingFormat": "image/jpeg",
    "caption": getCategoryName(category)
  };
});
```

---

### Phase 3: Image Sitemap (Higher Risk, Automation Benefit)

**Why Third:**
- Requires build process extension
- Needs testing to ensure correct XML output
- Provides long-term automation benefit
- Lower immediate SEO impact than structured data

**Tasks:**
1. Create `scripts/generate-image-sitemap.js`
2. Install `sitemap` npm package
3. Add postbuild script to package.json
4. Test build output locally
5. Update robots.txt to reference sitemap index
6. Deploy and submit to Google Search Console

**Estimated Effort:** 4-6 hours (includes testing)
**Risk:** Medium (build process change, XML validation)
**SEO Impact:** Medium-High (image search visibility)

**Testing Strategy:**
1. Run `npm run build` locally
2. Verify `dist/image-sitemap.xml` exists
3. Validate XML structure with [XML Sitemap Validator](https://www.xml-sitemaps.com/)
4. Check Google Search Console after deploy

---

### Phase 4: Validation & Monitoring (Continuous)

**Why Last:**
- Builds on all previous phases
- Establishes quality gates
- Prevents regression

**Tasks:**
1. Create `scripts/validate-structured-data.js`
2. Add validation to GitHub Actions (pre-deploy)
3. Set up Google Search Console monitoring
4. Schedule monthly SEO audits

**Estimated Effort:** 2-3 hours
**Risk:** Low
**SEO Impact:** Low direct, high indirect (prevents errors)

---

## Integration Points Summary

| SEO Feature | Integration Point | Build Impact | Risk | Priority |
|-------------|------------------|--------------|------|----------|
| **Meta Tags** | index.html `<head>` | None | None | P0 (now) |
| **JSON-LD** | index.html `<head>` | None | Low | P0 (now) |
| **Image Sitemap** | postbuild script | Medium | Medium | P1 (next) |
| **Validation** | GitHub Actions | Low | Low | P2 (later) |

---

## Architecture Patterns to Follow

### Pattern 1: Static-First, Generate When Needed

**Principle:** Prefer static inline content over build-time generation unless content is dynamic or repetitive.

**Application:**
- Meta tags: Static (content doesn't change often)
- JSON-LD: Static for LocalBusiness, consider generation for ImageGallery if >50 images
- Sitemap: Generated (changes with every image update)

### Pattern 2: Validate Before Deploy

**Principle:** All SEO changes should be validated in CI/CD before reaching production.

**Application:**
- HTML validation (already exists)
- JSON-LD validation (add to validate:seo script)
- Sitemap XML validation (add to postbuild)
- OpenGraph preview testing (manual for now)

### Pattern 3: Single Source of Truth

**Principle:** Image data should be extracted from existing HTML structure, not duplicated in separate config.

**Application:**
- Portfolio images defined in index.html (SSOT)
- Image sitemap script reads from dist/index.html after build
- JSON-LD extracts metadata from same source
- No separate image inventory file needed

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Dynamic Meta Tag Injection (Not Needed Here)

**Problem:** Using Vite plugins to dynamically inject meta tags adds build complexity without benefit for single-page site.

**Why Bad:**
- Static meta tags work fine for single HTML file
- Dynamic injection only needed for multi-page or SSR apps
- Adds build dependencies and potential failure points

**Instead:** Keep meta tags inline in index.html for now. Revisit if site becomes multi-page.

### Anti-Pattern 2: Manual Sitemap Maintenance

**Problem:** Manually updating sitemap.xml when images change.

**Why Bad:**
- Error-prone (easy to forget)
- Doesn't scale (84 images, more added over time)
- Sitemap becomes stale

**Instead:** Automate sitemap generation in build process (Phase 3).

### Anti-Pattern 3: Overly Complex JSON-LD

**Problem:** Generating elaborate schema markup for every single portfolio image.

**Why Bad:**
- Bloated HTML size
- Diminishing SEO returns beyond 20-30 images
- Google's limit: 1000 images per URL anyway

**Instead:** Include representative sample (10-20 top images) in ImageGallery schema. Full inventory goes in image sitemap.

### Anti-Pattern 4: Separate SEO Config Files

**Problem:** Creating separate JSON files for SEO data that duplicate index.html content.

**Why Bad:**
- Creates synchronization problems
- Extra maintenance burden
- Data drift between HTML and config

**Instead:** Extract from HTML (single source of truth) or embed inline.

---

## Scalability Considerations

### At Current Scale (84 images, 1 page)

**Structured Data:**
- Inline JSON-LD: 10-20 representative images
- Total size: ~5-10KB added to HTML
- Performance impact: Negligible

**Image Sitemap:**
- All 84 images in single sitemap
- Well under 1000 image limit
- File size: ~15-20KB
- No need for sitemap sharding

**Build Time:**
- Image sitemap generation: <1 second
- No impact on Vite build

### At 500 images, 1 page

**Structured Data:**
- Still inline, still 10-20 representative images
- No change needed

**Image Sitemap:**
- All 500 images in single sitemap
- Still under 1000 limit
- File size: ~80-100KB
- Build time: ~2-3 seconds

### At 1000+ images, multiple galleries

**Structured Data:**
- Consider splitting into multiple ImageGallery schemas per category
- Each gallery page gets own JSON-LD

**Image Sitemap:**
- Need sitemap sharding (multiple image sitemaps)
- Sitemap index with multiple image sitemap files
- Build script enhancement needed

**At this scale, likely need multi-page architecture anyway.**

---

## Performance Impact

### HTML Size Impact

| Component | Size | Impact |
|-----------|------|--------|
| Current index.html | ~45KB | Baseline |
| + JSON-LD LocalBusiness | +1KB | Negligible |
| + JSON-LD ImageGallery (20 images) | +8KB | Minimal |
| + Enhanced meta tags | +0.5KB | Negligible |
| **Total** | **~54.5KB** | **<1% impact on load time** |

### Build Time Impact

| Phase | Current | With SEO | Impact |
|-------|---------|----------|--------|
| Image optimization (prebuild) | 15-30s | 15-30s | None |
| Vite build | 5-10s | 5-10s | None |
| Sitemap generation (postbuild) | 0s | <1s | Negligible |
| **Total** | **20-40s** | **20-41s** | **<5% increase** |

### Runtime Performance

- JSON-LD: Parsed by crawlers, not executed by browser (zero runtime cost)
- Sitemaps: Not loaded by users (zero runtime cost)
- Meta tags: Minimal parsing overhead (negligible)

**Conclusion:** SEO enhancements add <10KB to HTML and <1s to build, with zero runtime performance impact.

---

## Validation & Testing Strategy

### Pre-Deploy Validation (Automated)

**HTML Validation:**
```bash
npm run validate:html  # Already exists
```

**JSON-LD Validation:**
```bash
npm run validate:seo    # New script needed
```

**Sitemap Validation:**
```javascript
// In scripts/generate-image-sitemap.js
import { XMLValidator } from 'fast-xml-parser';

const isValid = XMLValidator.validate(sitemapXML);
if (!isValid) {
  throw new Error('Invalid sitemap XML');
}
```

### Post-Deploy Validation (Manual)

**Structured Data:**
1. [Google Rich Results Test](https://search.google.com/test/rich-results)
2. [Schema Markup Validator](https://validator.schema.org/)

**Open Graph:**
1. [OpenGraph Preview](https://www.opengraph.xyz/)
2. [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

**Sitemaps:**
1. [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
2. Google Search Console → Sitemaps → Submit

### Continuous Monitoring

**Google Search Console:**
- Rich results status
- Image indexing status
- Coverage reports
- Performance metrics

**Lighthouse CI (Already in GitHub Actions):**
- SEO score tracking
- Best practices validation
- Automated regression detection

---

## Dependency Analysis

### New Dependencies Required

```json
{
  "devDependencies": {
    "sitemap": "^8.0.0"          // Image sitemap generation
  }
}
```

**Confidence:** HIGH (sitemap.js used by 1.7M+ projects)

### Optional Dependencies (Future)

```json
{
  "devDependencies": {
    "vite-plugin-html-injection": "^1.0.1",  // If meta tags become dynamic
    "fast-xml-parser": "^4.3.0"              // For sitemap validation
  }
}
```

**Confidence:** MEDIUM (not immediately needed)

---

## Risk Assessment

### Low Risk (Implement Immediately)

- Adding meta tags to index.html
- Adding JSON-LD to index.html
- Creating OG image

**Mitigation:** Validate before deploy, easy to revert

### Medium Risk (Test Thoroughly)

- Build-time sitemap generation
- postbuild script integration

**Mitigation:**
- Test locally before committing
- Add validation step
- Monitor build in GitHub Actions

### Known Pitfalls

**Pitfall 1: Invalid JSON-LD Syntax**
- **Detection:** Google Rich Results Test shows errors
- **Prevention:** Use linter, test in validator before deploy
- **Recovery:** Fix and redeploy (fast iteration)

**Pitfall 2: Build Script Failure in CI**
- **Detection:** GitHub Actions build fails
- **Prevention:** Test postbuild script locally with `npm run build`
- **Recovery:** Fix script, commit (CI prevents bad deploy)

**Pitfall 3: Sitemap Not Updated After Image Changes**
- **Detection:** Google Search Console shows stale image count
- **Prevention:** Ensure postbuild runs after vite build
- **Recovery:** Re-run build, sitemap regenerates

---

## Sources

### Structured Data & JSON-LD
- [SEO Optimization for React + Vite Apps](https://dev.to/ali_dz/optimizing-seo-in-a-react-vite-project-the-ultimate-guide-3mbh)
- [Using structured data for SEO in 2026](https://comms.thisisdefinition.com/insights/ultimate-guide-to-structured-data-for-seo)
- [JSON-LD For SEO: A Beginner's Guide](https://www.gtechme.com/insights/json-ld-for-seo-structured-data-guide/)
- [Schema.org ImageGallery Type](https://schema.org/ImageGallery)
- [Schema.org Photograph Type](https://schema.org/Photograph)
- [JSON-LD Template For Photography Business](https://www.mikecassidyphotography.com/post/a-structured-data-json-ld-template-for-your-photography-business)

### Image Sitemaps
- [Google Image Sitemaps Documentation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps)
- [Best Image Sitemap Structure for Google Lens 2026](https://www.clickrank.ai/image-sitemap-structure-google-lens/)
- [XML Image Sitemap Explained](https://www.xml-sitemaps.com/images-sitemap.html)
- [sitemap.js npm package](https://www.npmjs.com/package/sitemap)
- [sitemap.js GitHub](https://github.com/ekalinin/sitemap.js/)

### Vite Integration
- [vite-plugin-sitemap](https://github.com/jbaubree/vite-plugin-sitemap)
- [vite-plugin-html-injection](https://github.com/altrusl/vite-plugin-html-injection)
- [vite-plugin-meta-tags](https://github.com/byr0n3/vite-plugin-meta-tags)

### Open Graph & Meta Tags
- [The Open Graph Protocol](https://ogp.me/)
- [Open Graph Meta Tags Best Practices](https://digitalguider.com/blog/open-graph-meta-tags/)
- [Open Graph Preview Tool](https://www.opengraph.xyz/)

---

## Conclusion

**Recommended Architecture:** Hybrid approach combining static inline content (JSON-LD, meta tags) with build-time generation (image sitemap). This leverages existing build infrastructure while minimizing complexity.

**Key Strengths:**
- No major architectural changes needed
- Incremental implementation path (can ship Phase 1 tomorrow)
- Low risk (validation gates, easy rollback)
- Scales to 1000+ images before requiring refactor

**Implementation Sequence:**
1. **Now:** Meta tags + JSON-LD (static inline, zero risk)
2. **Next:** Image sitemap (build-time, medium complexity)
3. **Later:** Validation automation (quality gates)

**Total Effort Estimate:** 8-12 hours across 3 phases
**SEO Impact:** High (rich results, image search, local visibility)
**Performance Impact:** Negligible (<10KB HTML, <1s build time)
**Maintenance Burden:** Low (automated sitemap, static structured data)

**Ready for roadmap creation.** All SEO features architecturally feasible with existing Vite static site infrastructure.
