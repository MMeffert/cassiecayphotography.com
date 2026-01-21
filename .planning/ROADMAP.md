# Milestone v2.1: SEO

**Status:** In Progress
**Phases:** 16-19
**Target:** Improve search engine discoverability through technical SEO and image optimization

## Overview

Add structured data, social meta tags, image sitemap, and AI-generated alt text to improve Google search visibility and social sharing previews. All changes are build-time or static content—no runtime dependencies added.

## Phases

### Phase 16: Structured Data (JSON-LD) ✓

**Goal:** Site has valid JSON-LD schemas for LocalBusiness, Photographer, and ImageGallery

**Depends on:** None (foundation phase)
**Plans:** 1 plan
**Status:** COMPLETE (2026-01-21)

Plans:
- [x] 16-01-PLAN.md — Add JSON-LD schemas and validate with Rich Results Test

**Requirements:**
- SEO-01: LocalBusiness schema
- SEO-02: Photographer schema
- SEO-03: ImageGallery schema
- SEO-04: Validation with Rich Results Test

**Success Criteria:**
1. Google Rich Results Test shows valid LocalBusiness with geographic coordinates
2. Photographer schema nested correctly within LocalBusiness
3. ImageGallery references portfolio images
4. No JSON-LD syntax errors in browser console

**Notes:** Zero build process changes. Inline JSON-LD in `<head>` section. Madison, WI coordinates: 43.0731, -89.4012.

---

### Phase 17: Social Meta Tags ✓

**Goal:** Social shares show complete preview with title, description, and image

**Depends on:** None (independent of Phase 16)
**Plans:** 1 plan
**Status:** COMPLETE (2026-01-21)

Plans:
- [x] 17-01-PLAN.md — Add Twitter Card and og:image meta tags

**Requirements:**
- SEO-05: og:image meta tag
- SEO-06: Twitter Card meta tags

**Success Criteria:**
1. Twitter Card Validator shows summary_large_image card with preview
2. Facebook/LinkedIn share shows image preview
3. All required meta tags present (twitter:card, twitter:site, twitter:image, twitter:title, twitter:description)

**Notes:** Uses existing hero image (cassiecay-background1.jpg, 2000x1333). Social platforms handle cropping.

---

### Phase 18: Image Sitemap Generation ✓

**Goal:** Google Image Search can discover all 84 portfolio images via sitemap

**Depends on:** None (independent, but build process extension)
**Plans:** 1 plan
**Status:** COMPLETE (2026-01-21)

Plans:
- [x] 18-01-PLAN.md — Create sitemap generation script with image extensions and postbuild hook

**Requirements:**
- SEO-07: Build-time sitemap script
- SEO-08: Captions and geo_location
- SEO-09: Sitemap index pattern
- SEO-10: Postbuild hook integration

**Success Criteria:**
1. `image-sitemap.xml` generated in dist/ with all 100 portfolio images ✓
2. Each image has `<image:caption>` and `<image:geo_location>` ✓
3. Main `sitemap.xml` updated to sitemap index format referencing image sitemap ✓
4. `npm run build` automatically generates current sitemap ✓

**Notes:** Uses `sitemap` npm package (v9.0.0). Found 100 portfolio images (more than original 84 estimate).

---

### Phase 19: AI Alt Text Generation

**Goal:** All 84 portfolio images have descriptive, SEO-optimized alt text

**Depends on:** None (can run standalone, not in CI/CD)
**Plans:** 1 plan

**Requirements:**
- SEO-11: Alt text generation script
- SEO-12: Generate for 84 images
- SEO-13: Location/service keywords
- SEO-14: HTML update

**Success Criteria:**
1. Script generates alt text for all 84 portfolio images
2. Alt text includes location keywords (Madison, WI) and service type
3. Alt text describes subjects (e.g., "Bride and groom first kiss at Madison Arboretum")
4. All `alt=""` attributes in index.html updated with generated text
5. No empty alt attributes on portfolio images

**Notes:** Uses Claude Vision API via `@anthropic-ai/sdk`. One-time manual run, ~$0.29 cost. Outputs alt-text.json manifest for review before HTML injection.

---

## Milestone Summary

**Requirements Coverage:**

| Category | Requirements | Phase |
|----------|--------------|-------|
| Structured Data | SEO-01, SEO-02, SEO-03, SEO-04 | 16 |
| Social Meta Tags | SEO-05, SEO-06 | 17 |
| Image Sitemap | SEO-07, SEO-08, SEO-09, SEO-10 | 18 |
| Alt Text | SEO-11, SEO-12, SEO-13, SEO-14 | 19 |

**Coverage:** 14/14 requirements mapped (100%)

**Phase Ordering Rationale:**
- Phases 16-17 require zero dependencies and no build changes (quick wins)
- Phase 18 extends build process but follows existing pattern (low risk)
- Phase 19 is standalone script (can run manually, not in CI/CD)
- Order delivers incremental value: rich results → social sharing → image search → accessibility

**New Dependencies:**
- `sitemap` v9.0.0 (Phase 18)
- `@anthropic-ai/sdk` (Phase 19, dev dependency only)

**Estimated Effort:**
- Phase 16: 2-3 hours
- Phase 17: 30 minutes
- Phase 18: 3-4 hours
- Phase 19: 3-4 hours
- Total: ~10 hours

---

*For current project status, see .planning/PROJECT.md*
