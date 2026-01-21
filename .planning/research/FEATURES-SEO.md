# SEO Features Research: Photography Portfolio

**Domain:** Photography portfolio website
**Project:** cassiecayphotography.com (Madison, WI)
**Researched:** 2026-01-21
**Context:** Single-page site with 84 portfolio images, contact form, service listings

## Table Stakes

Features that clients expect when searching for photographers. Missing these means the site is invisible or uncompetitive in search.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Image alt text with location + service** | Google uses alt text for image search and AI recommendations; photographers found via image search | Low | Pattern: "business portrait in Madison Wisconsin office" not just "portrait" |
| **Descriptive image filenames** | Signals to search engines what images contain before processing | Low | "madison-family-photography-fall-2025.jpg" not "IMG_001.jpg" |
| **Local Business JSON-LD schema** | Required for Google Business Profile integration, local search results, rich snippets | Medium | Must include: name, address, geo coordinates, telephone, priceRange, openingHours |
| **Google Business Profile** | 90%+ of users never go past first page; GBP is cornerstone of local SEO for photographers | Low | Must be claimed, fully filled out with services, hours, location |
| **Location keywords in content** | Clients search "[city] [service] photographer" - high-intent queries | Low | "Madison Wisconsin family photographer" in headings, descriptions, meta |
| **Mobile optimization** | Google uses mobile-first indexing since July 2024; most photography searches on mobile | Medium | Fast loading (<3s), responsive images, touch-friendly navigation |
| **Core Web Vitals compliance** | Confirmed ranking factors; 64% of sites fail all three metrics | High | LCP, FID, CLS must meet thresholds; critical for image-heavy sites |
| **HTTPS + valid SSL** | Table stakes for trust signals and ranking | Low | Already in place for site |
| **Canonical URLs** | Prevents duplicate content issues, especially for single-page sites | Low | Already in place |
| **Service-specific descriptions** | Each service needs 100-150 words minimum describing intent, style, location | Low | Homepage has vague "capturing joy" - needs specific service language |
| **Enhanced sitemap with images** | Current sitemap only has homepage; needs image URLs for Google Images | Medium | Include image metadata (title, caption, geo location, license) |

## Differentiators

Features that provide competitive advantage in search rankings. Not expected, but highly valued when present.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **ImageObject structured data** | Enables rich results in Google Images with photographer credit, licensing info | Medium | Include photographer, copyrightNotice, creditText, contentUrl, thumbnailUrl |
| **BreadcrumbList schema** | Shows navigation path in search results; increases CTR by 10-15% | Low | Helps single-page sites show structure to search engines |
| **Review/Rating schema** | Rich snippets with star ratings; 14% average CTR improvement | Medium | Requires actual review collection system; can integrate with GBP reviews |
| **FAQ schema for services** | Appears in "People Also Ask" boxes; captures broader searches | Medium | Add FAQ section for common questions per service type |
| **Modern image formats (AVIF/WebP)** | 30-50% smaller file sizes = faster loading = better rankings | Low | Already implemented! Maintain this. |
| **Service-specific landing sections** | Separate optimizable sections for each service type with unique keywords | Medium | Current single-page structure works but needs clear H2 sections per service |
| **Geographic coordinates in schema** | More precise local search targeting than address alone | Low | Latitude/longitude with 5+ decimal places |
| **Testimonial/Review section** | Builds E-E-A-T signals (Experience, Expertise, Authority, Trust) | Low | User-generated content helps with long-tail keywords |
| **Lazy loading + srcset** | Dramatically improves initial page load for 84-image portfolio | Low | Partially implemented; ensure all images use loading="lazy" |
| **Behind-the-scenes content** | Demonstrates expertise and experience for E-E-A-T | Medium | "How I photograph newborns" or "Best Madison locations for family photos" |
| **Alt text with photography style** | Captures style-based searches "natural light family photography Madison" | Low | Current alt text is empty - big opportunity |

## Anti-Features

Features to deliberately NOT build. Common mistakes in photography SEO.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Blog for the sake of blogging** | Time-intensive; only valuable if it supports service pages with high-quality, specific content | Write 3-5 cornerstone articles about local photography topics (best Madison photo locations, seasonal family photo tips) instead of weekly generic posts |
| **Keyword stuffing** | Triggers spam detection; modern NLP identifies unnatural keyword density instantly | Use conversational language with location + service naturally integrated. "Madison Wisconsin family photographer" once per section, not repeated |
| **Separate page per photo category** | Unnecessary for 84 images; creates thin content pages; single-page site structure is fine | Keep single-page with filtered sections; optimize each section heading as virtual "page" |
| **Flash or slideshow portfolio** | Poor for SEO (no individual image URLs); slow loading; bad mobile UX | Current lightbox gallery + filter approach is good; maintain it |
| **Generic homepage copy** | "Capturing joy" and "moments you'll treasure" are SEO-useless; nobody searches for these | Replace with specific services + location: "Madison Wisconsin photographer specializing in family, newborn, senior, and event photography" |
| **Multiple pages with same keyword** | Keyword cannibalization: pages compete with each other, both rank lower | One optimized section per service type on single page is better than multiple weak pages |
| **Hiding images in JavaScript** | If images load via JS after page load, Google may not index them | Current implementation is fine - images in HTML with lazy loading |
| **Over-optimization** | Using exact-match keywords unnaturally reduces rankings | Write for humans first; let keywords appear naturally in context |
| **Portfolio-only site** | Without clear service descriptions, contact info, pricing signals, site appears non-commercial | Current site structure is good - has about, services, contact sections |
| **Neglecting image compression** | Photography sites often have 5MB+ images; kills Core Web Vitals | Current site uses modern formats - maintain this discipline |
| **Adding services you don't offer** | Keyword targeting for services not provided reduces trust, increases bounce rate | Only optimize for actual services (family, newborn, senior, events, weddings) |

## Feature Dependencies

```
Core Technical Foundation
├── HTTPS + SSL (✓ already in place)
├── Mobile responsiveness (✓ already in place)
└── Modern image formats (✓ AVIF/WebP in place)

Image SEO Layer (depends on Core)
├── Alt text with keywords (HIGH PRIORITY - currently missing)
├── Descriptive filenames (MEDIUM - requires renaming 84 images)
├── Lazy loading (✓ partial - complete implementation)
└── ImageObject schema (depends on alt text being added)

Local SEO Layer (depends on Core)
├── Google Business Profile (REQUIRED first step)
├── LocalBusiness schema (depends on GBP being set up)
│   ├── Basic properties (name, address, phone)
│   ├── Geographic coordinates
│   ├── Opening hours
│   └── Price range
└── Location keywords in content (depends on service descriptions)

Content Optimization Layer (depends on Local SEO)
├── Service-specific descriptions (HIGH PRIORITY)
├── About page location context (update existing content)
└── FAQ section (optional enhancement)

Advanced Schema Layer (depends on all above)
├── BreadcrumbList
├── Review/Rating schema (requires review collection)
└── Article schema for blog posts (if blog is added)
```

## MVP Recommendation

For this milestone (subsequent SEO implementation on existing site), prioritize:

### Phase 1: Critical Table Stakes (Week 1)
1. **Google Business Profile** - Set up and claim immediately
2. **LocalBusiness JSON-LD schema** - Add to `<head>` with complete properties
3. **Alt text for all 84 images** - Madison + service + descriptive keywords
4. **Service descriptions rewrite** - Replace vague language with specific keywords
5. **Enhanced sitemap** - Add all portfolio images with metadata

### Phase 2: Quick Wins (Week 2)
6. **Image filename audit** - Document current names; rename on next image update
7. **ImageObject structured data** - Add to each portfolio image
8. **Meta descriptions** - Enhance existing with location + service keywords
9. **Complete lazy loading** - Ensure all images have loading="lazy"

### Phase 3: Differentiators (Week 3+)
10. **Testimonial section with schema** - Add to homepage
11. **FAQ section with schema** - Common questions per service type
12. **Behind-the-scenes content** - 1-2 articles about Madison photography

### Defer to Post-MVP
- **Blog platform** - Only if photographer commits to monthly high-quality posts
- **Review collection system** - After GBP is established and generating organic reviews
- **Image filename renaming** - Labor-intensive; defer until next content update
- **Multiple service pages** - Single-page structure is working; don't break it

## Single-Page Site Considerations

This site uses a **single-page application structure** with sections for Home, About, Portfolio, Services, Contact. This is **NOT an SEO disadvantage** if done correctly:

### Works For SEO When:
- Each section has clear H2 headings with keywords ("Madison Family Photography Services")
- Sections are deep-linkable with IDs (#services, #portfolio, etc.)
- Content is in HTML, not loaded via AJAX
- Schema markup defines structure
- Sitemap includes section anchors

### Current Site Status:
- ✓ HTML content (not AJAX)
- ✓ Section IDs for deep linking
- ✓ Modern image formats
- ✗ Needs H2 headings with keywords
- ✗ Needs schema markup
- ✗ Needs enhanced sitemap

### Recommendation:
**Keep single-page structure.** It works well for photographer portfolios. Focus on optimizing each section as a virtual "page" through:
1. Keyword-rich H2 headings per section
2. LocalBusiness schema defining the business
3. ImageObject schema for each portfolio category
4. Enhanced meta descriptions mentioning all services

## Confidence Assessment

| Area | Confidence | Source |
|------|------------|--------|
| Table stakes features | HIGH | Google official docs, consistent across 10+ recent photographer SEO guides |
| LocalBusiness schema requirements | HIGH | Google Search Central official documentation |
| Image SEO best practices | HIGH | Multiple 2026 sources agree on alt text, filenames, modern formats |
| Single-page SEO approach | MEDIUM | Works per sources, but less common than multi-page; requires careful implementation |
| Anti-features | HIGH | Well-documented mistakes across multiple photographer-specific SEO guides |
| Core Web Vitals impact | HIGH | Google confirmed ranking factor; 64% of sites fail - big opportunity |

## Open Questions

- **Image filename renaming priority**: 84 images to rename - worth the effort now or defer?
  - **Recommendation**: Defer. Alt text has bigger impact and is easier to implement.

- **Blog necessity**: Sources conflict on whether blog is essential for photographers
  - **Recommendation**: Skip for MVP. Focus on 3-5 cornerstone articles instead of weekly posts.

- **Review collection method**: How to systematically collect reviews for schema markup?
  - **Recommendation**: Start with Google Business Profile reviews; can add schema later.

## Sources

### Official Documentation
- [Google LocalBusiness Structured Data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Schema.org LocalBusiness](https://schema.org/LocalBusiness)

### Photography SEO Best Practices (2026)
- [SEO for Photographers: 5 Best Practices — Squarespace](https://www.squarespace.com/blog/seo-for-photographers)
- [Why Photographers Need SEO in 2026 - The Kaizen Global](https://thekaizenglobal.com/why-photographers-need-seo)
- [SEO for Photographers: Marketing Guide 2026 - Loganix](https://loganix.com/seo-for-photographers/)
- [SEO for Photographers: A Practical Beginner's Guide - Honcho](https://thehoncho.app/blog/seo-for-photographers/)
- [The SEO Starter Kit for Photographers - ASMP Colorado](https://www.asmp.org/colorado/the-seo-starter-kit-for-photographers/)

### Image SEO
- [SEO for Photographers: 8 Steps to Rank #1 on Google - Adventure Instead](https://adventureinstead.com/academy/blog/seo-for-photographers/)
- [SEO Tips for Photographers: 5 Website Mistakes To Avoid - Jaime Bugbee Photography](https://jaimebugbeephotography.com/2025/11/19/seo-tips-for-photographers/)

### Structured Data Implementation
- [A Structured Data JSON-LD Template For Your Photography Business - Mike Cassidy Photography](https://www.mikecassidyphotography.com/post/a-structured-data-json-ld-template-for-your-photography-business)
- [Structured Data for SEO in 2026 - O8 Agency](https://www.o8.agency/blog/using-structured-data-google-seo-dont-miss-out-benefits)

### Local SEO
- [SEO for Photographers: 15 Expert Tips to Help You Rank in 2024 - Aftershoot](https://aftershoot.com/blog/seo-for-photographers/)
- [10 Important SEO tips for photographers - Pixieset Blog](https://blog.pixieset.com/blog/seo-for-photographers/)

### Common Mistakes
- [SEO Mistakes and Common Errors to Avoid in 2026 - Content Whale](https://content-whale.com/blog/seo-mistakes-and-common-errors-to-avoid-in-2026/)
- [The Biggest SEO Mistakes to Avoid in 2026 - Lucid Media](https://www.lucidmedia.co.nz/blog/the-biggest-seo-mistakes-to-avoid-in-2026-that-could-tank-your-rankings)
