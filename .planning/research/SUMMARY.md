# Project Research Summary

**Project:** cassiecayphotography.com SEO Enhancements (v2.1)
**Domain:** Photography portfolio website SEO
**Researched:** 2026-01-21
**Confidence:** HIGH

## Executive Summary

SEO for this photography portfolio requires zero runtime dependencies and minimal build process changes. All enhancements are build-time scripts or static inline content. The site already has modern image formats (AVIF/WebP), lazy loading, and basic Open Graph tags. The gaps are: empty alt text on 84 images, missing JSON-LD structured data, no image sitemap, and incomplete Twitter Cards.

The recommended approach is a 4-phase implementation starting with structured data (zero risk, immediate impact), then Twitter Cards (trivial), then image sitemap automation (build process extension), and finally AI-generated alt text (most complex, highest accessibility impact). This order prioritizes quick wins that improve search visibility while deferring the API integration complexity until foundational SEO is solid.

Key risks are: (1) Googlebot not indexing images if lazy loading implementation is incorrect, (2) invalid JSON-LD causing rich result failures, and (3) neglecting alt text which is the single biggest SEO gap. Mitigations include using native `loading="lazy"` attributes, validating JSON-LD with Google's Rich Results Test before deploy, and generating alt text with Claude Vision API for quality and consistency.

## Key Findings

### Recommended Stack

Only 2 new dependencies needed. Everything else uses existing infrastructure or static inline content.

**Core technologies:**
- `sitemap` (v9.0.0): Image sitemap generation with Google's `<image:image>` extensions. Industry standard, 37k+ dependents, ESM-first.
- `@anthropic-ai/sdk`: AI alt text generation for 84 portfolio images. Claude Sonnet excels at describing artistic composition. One-time cost ~$0.29.
- JSON-LD: Manual inline in HTML (no library needed for 3 schema types)
- Twitter Cards: 5-6 static meta tags (no library needed)

**What NOT to add:** jsonld processor package (wrong use case), framework-specific sitemap generators, SEO libraries with runtime overhead.

### Expected Features

**Must have (table stakes):**
- Descriptive alt text with location + service keywords on all portfolio images
- LocalBusiness JSON-LD schema for Google Business Profile integration
- Image sitemap with captions and geo_location for Google Image Search
- Twitter Cards for social sharing previews

**Should have (competitive):**
- ImageGallery JSON-LD schema for rich results
- BreadcrumbList schema for navigation snippets
- AI-generated alt text for quality and consistency
- Geographic coordinates in schema for precise local targeting

**Defer (v2+):**
- Blog platform (only if committing to monthly high-quality posts)
- Review collection system (after Google Business Profile generates organic reviews)
- Image filename renaming (84 images, labor-intensive, alt text has bigger impact)
- FAQ schema (after core SEO foundation is solid)

### Architecture Approach

All SEO features integrate through three patterns: inline JSON-LD in `<head>` (structured data), build-time scripts (sitemap generation, alt text), and static meta tags (Twitter Cards). No major architectural changes needed. The single-page structure works well for photographer portfolios when each section has clear H2 headings with keywords.

**Major components:**
1. **Inline JSON-LD** (index.html `<head>`) - LocalBusiness + ImageGallery schemas, ~10KB added
2. **Image sitemap generator** (scripts/generate-image-sitemap.js) - Runs postbuild, outputs image-sitemap.xml
3. **Alt text generator** (scripts/generate-alt-text.js) - One-time manual run, outputs alt-text.json manifest
4. **Static meta tags** (index.html `<head>`) - Twitter Cards, enhanced OG tags

### Critical Pitfalls

1. **Empty alt text on all 84 images** - Currently `alt=""` means zero Google Image Search visibility. Write descriptive alt text with location + subject: "Bride and groom first kiss at Madison Arboretum" not "wedding photo".

2. **Lazy loading blocking Googlebot** - Verify existing implementation uses native `loading="lazy"` or IntersectionObserver, not scroll event listeners. Test with Google Search Console URL Inspection.

3. **Invalid JSON-LD syntax** - Test with Google Rich Results Test before every deploy. Common errors: relative URLs, missing required properties, incorrect nesting.

4. **No image sitemap** - Current sitemap only has homepage. Google Image Search discovery requires explicit image URLs with captions and geo_location.

5. **Missing og:image** - Social shares currently have no image preview. Add 1200x630 OG image with absolute URL.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Structured Data (JSON-LD)
**Rationale:** Zero build process changes, immediate SEO impact, easy to validate. Foundation for all rich results.
**Delivers:** LocalBusiness schema for local search, ImageGallery schema for portfolio rich results
**Addresses:** Table stakes: JSON-LD schema, local business visibility
**Avoids:** Invalid structured data pitfall (validate before deploy)
**Effort:** 2-3 hours

### Phase 2: Twitter Cards + Enhanced Meta
**Rationale:** Trivial implementation (5-6 meta tags), complements existing OG tags, immediate social sharing impact.
**Delivers:** Twitter summary_large_image cards, og:image tag, complete social preview
**Addresses:** Table stakes: social sharing visibility
**Avoids:** Missing OG image pitfall
**Effort:** 30 minutes

### Phase 3: Image Sitemap Generation
**Rationale:** Requires one new dependency and build process hook, but well-documented pattern. Critical for Google Image Search.
**Delivers:** Automated image-sitemap.xml with captions and geo_location, sitemap index pattern
**Uses:** `sitemap` npm package, existing glob/sharp infrastructure
**Implements:** Build-time script architecture pattern
**Avoids:** Manual sitemap maintenance anti-pattern
**Effort:** 3-4 hours

### Phase 4: AI Alt Text Generation
**Rationale:** Most complex (API integration, rate limiting, error handling) but highest accessibility and image SEO impact. Do last when foundation is solid.
**Delivers:** alt-text.json manifest with 84 descriptive alt texts, injection into HTML
**Uses:** `@anthropic-ai/sdk`, Claude Sonnet Vision API
**Addresses:** Critical pitfall: empty alt text on all images
**Effort:** 3-4 hours (script dev + testing)
**Cost:** ~$0.29 one-time for 84 images

### Phase Ordering Rationale

- Phases 1-2 require zero dependencies and no build changes. Ship in 3-4 hours total.
- Phase 3 extends build process but follows existing prebuild/postbuild pattern. Well-documented, low risk.
- Phase 4 is standalone (can run manually, not in CI/CD). Defer until after validating other SEO features work.
- This order delivers incremental value: rich results first, then social sharing, then image search, then accessibility.

### Research Flags

Phases with standard patterns (skip research-phase):
- **Phase 1:** JSON-LD is Google's recommended approach, well-documented, paste-and-validate workflow
- **Phase 2:** Twitter Cards are 5 meta tags, official docs are clear
- **Phase 3:** sitemap.js is industry standard, Google image sitemap spec is stable

Phases potentially needing validation during planning:
- **Phase 4:** If existing lazy loading is custom JavaScript (not native `loading="lazy"`), verify Googlebot rendering compatibility before alt text work. Check with URL Inspection tool.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official npm packages, verified versions, existing infrastructure supports all additions |
| Features | HIGH | Google official docs + multiple 2026 photographer SEO guides agree on table stakes |
| Architecture | HIGH | Inline JSON-LD + build-time scripts is Google-recommended, fits existing Vite pipeline |
| Pitfalls | HIGH | Google Search Central docs + current 2026 sources, all critical pitfalls have official documentation |

**Overall confidence:** HIGH

### Gaps to Address

- **Lazy loading verification:** Current implementation needs testing with Google Search Console URL Inspection to confirm Googlebot renders images. If custom JS, may need fix before Phase 4.
- **Google Business Profile:** Not in scope for this milestone but is table stakes for local SEO. Recommend setting up in parallel.
- **Image filenames:** Currently using camera filenames (DSC_*, etc). Defer renaming to v2+ but document as technical debt.

## Sources

### Primary (HIGH confidence)
- [Google Structured Data Documentation](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) - JSON-LD is preferred format
- [Google Image Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps) - Image sitemap spec with `<image:image>` tags
- [Google Image SEO Best Practices](https://developers.google.com/search/docs/appearance/google-images) - Alt text, filenames, lazy loading
- [Google Lazy Loading Fix Guide](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading) - Updated Dec 2025
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started) - Official markup reference
- [Schema.org LocalBusiness](https://schema.org/LocalBusiness) - Required properties
- [sitemap.js npm](https://www.npmjs.com/package/sitemap) - v9.0.0, image extension support

### Secondary (MEDIUM confidence)
- [SEO for Single Page Applications 2026](https://jesperseo.com/blog/seo-for-single-page-applications-complete-2026-guide/) - SPA-specific considerations
- [Photography SEO Best Practices](https://loganix.com/seo-for-photographers/) - Industry-specific patterns
- [Anthropic API Pricing 2026](https://www.metacto.com/blogs/anthropic-api-pricing-a-full-breakdown-of-costs-and-integration) - Cost estimates

### Tertiary (LOW confidence)
- [Photography Business JSON-LD Template](https://www.mikecassidyphotography.com/post/a-structured-data-json-ld-template-for-your-photography-business) - Example implementation

---
*Research completed: 2026-01-21*
*Ready for roadmap: yes*
