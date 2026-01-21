# Requirements: v2.1 SEO

**Defined:** 2026-01-21
**Core Value:** The site must remain fast, secure, and easy for Cassie to update.

## Overview

Improve search engine discoverability through technical SEO and image optimization. Based on research, the site has modern image formats and basic Open Graph tags but is missing: descriptive alt text on 84 images, JSON-LD structured data, image sitemap, and Twitter Cards.

---

## Structured Data (JSON-LD)

- [ ] **SEO-01**: Add LocalBusiness JSON-LD schema with business info, geographic coordinates, and service area
- [ ] **SEO-02**: Add Photographer schema nested within LocalBusiness
- [ ] **SEO-03**: Add ImageGallery schema for portfolio rich results
- [ ] **SEO-04**: Validate JSON-LD with Google Rich Results Test before deploy

## Social Meta Tags

- [ ] **SEO-05**: Add og:image meta tag with 1200x630 preview image
- [ ] **SEO-06**: Add Twitter Card meta tags (twitter:card, twitter:site, twitter:image)

## Image Sitemap

- [ ] **SEO-07**: Create build-time script to generate image-sitemap.xml
- [ ] **SEO-08**: Include image captions and geo_location in sitemap
- [ ] **SEO-09**: Update main sitemap.xml to reference image sitemap (sitemap index)
- [ ] **SEO-10**: Add sitemap generation to postbuild hook

## Alt Text Generation

- [ ] **SEO-11**: Create alt text generation script using Claude Vision API
- [ ] **SEO-12**: Generate descriptive alt text for all 84 portfolio images
- [ ] **SEO-13**: Include location and service keywords in alt text (e.g., "Bride and groom first kiss at Madison Arboretum")
- [ ] **SEO-14**: Update HTML with generated alt text

---

## Success Criteria

1. Google Rich Results Test validates all JSON-LD schemas without errors
2. Twitter Card Validator shows complete preview with image
3. Image sitemap includes all 84 portfolio images with captions
4. All portfolio images have descriptive alt text (none empty)
5. No new runtime dependencies added (build-time only)

## Dependencies

| Requirement | Dependency |
|-------------|------------|
| SEO-07 to SEO-10 | `sitemap` npm package (v9.0.0) |
| SEO-11 to SEO-14 | `@anthropic-ai/sdk` for Claude Vision API |

## Cost Estimate

- **AI Alt Text:** ~$0.29 one-time for 84 images using Claude Sonnet Vision
- **Infrastructure:** No ongoing costs (static files, build-time generation)

## Out of Scope (Deferred to v2.2+)

| Feature | Reason |
|---------|--------|
| Image filename renaming | Labor-intensive for 84 images; alt text has bigger impact |
| Blog platform | Only valuable with monthly high-quality content commitment |
| FAQ schema | After core SEO foundation is solid |
| Google Business Profile setup | Parallel activity, not code-related |

---

*Last updated: 2026-01-21*
