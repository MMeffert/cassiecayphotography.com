# Pitfalls Research: SEO for Photography Portfolio Sites

**Project:** cassiecayphotography.com
**Domain:** Photography portfolio website (single-page application)
**Researched:** 2026-01-21
**Overall Confidence:** HIGH (Google official documentation + current 2026 sources)

## Critical Pitfalls

Mistakes that cause severe SEO damage or require major rework.

---

### Pitfall 1: Empty or Generic Alt Text on All Images

**What goes wrong:** 84 images with `alt=""` attributes means Google cannot understand image content, severely limiting Google Image Search visibility and failing accessibility requirements.

**Why it happens:**
- Bulk export from photo editing software without metadata
- Copy-paste HTML templates with empty alt attributes
- Misconception that alt text is optional for decorative images
- Not understanding that portfolio images are content, not decoration

**Consequences:**
- Zero visibility in Google Image Search (primary discovery method for photographers)
- Failed accessibility compliance (screen readers get no information)
- Lost ranking signals (images contribute to page relevance)
- Missed opportunity for location/subject-based discovery

**Prevention:**
1. **Write descriptive, specific alt text** - "Bride and groom first kiss at sunset ceremony, Madison Arboretum" NOT "wedding photo" or "IMG_4081"
2. **Include location when relevant** - Local SEO signal for Madison-area searches
3. **Describe the emotion/moment** - What makes this image portfolio-worthy?
4. **Keep under 125 characters** - Screen reader optimization
5. **Never keyword stuff** - "Madison wedding photographer Wisconsin wedding photography Madison WI" is spam

**Detection:**
- Run accessibility audit in browser DevTools
- Use `grep -r 'alt=""' *.html` to find empty alt attributes
- Google Search Console may show "Missing alt attributes" warnings

**Phase to address:** Phase 1 (Image SEO Fundamentals) - This is table stakes.

**Sources:**
- [Google Image SEO Best Practices](https://developers.google.com/search/docs/appearance/google-images) (HIGH confidence - official)
- [Alt Text for SEO](https://alttext.ai/blog/image-alt-text-seo-best-practices) (MEDIUM confidence)

---

### Pitfall 2: Lazy Loading Implementation Blocking Googlebot

**What goes wrong:** Existing lazy loading may prevent Googlebot from indexing images if implementation relies on user scrolling or interaction events.

**Why it happens:**
- Using event listeners (scroll, click, hover) instead of IntersectionObserver
- Googlebot doesn't simulate user actions like scrolling
- Custom JavaScript lazy loading instead of native browser lazy-loading
- Assets taking too long to render within Google's rendering window (a few seconds)

**Consequences:**
- Images don't appear in Google Image Search despite being on page
- Google sees empty image placeholders during rendering
- Delayed indexing by days or weeks (if indexed at all)
- Central portfolio images missing from search results = invisible portfolio

**Prevention:**
1. **Use native browser lazy loading** - `<img loading="lazy">` (Google's recommendation)
2. **Or use IntersectionObserver API** - Triggers when element enters viewport, not on user action
3. **Don't lazy-load above-the-fold images** - Hero images should load immediately
4. **Test with Google Search Console's URL Inspection tool** - See what Google renders
5. **Monitor rendering time** - Images must render within Google's short window

**Detection:**
- Check HTML for lazy loading implementation method
- Use Google Search Console > URL Inspection > View Rendered HTML
- Compare rendered HTML to actual page HTML
- Check image search results for portfolio images

**Phase to address:** Phase 1 (Image SEO Fundamentals) - Critical for existing optimization.

**Sources:**
- [Fix Lazy-Loaded Content - Google Search Central](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading) (HIGH confidence - official, updated Dec 2025)
- [SEO Impact of Lazy Loading](https://www.oncrawl.com/technical-seo/lazy-loading-crawlability-indexing/) (MEDIUM confidence)

---

### Pitfall 3: Missing or Incorrect Structured Data

**What goes wrong:** Missing JSON-LD structured data means Google can't display rich results, and incorrect schema causes validation errors that prevent rich snippet display.

**Why it happens:**
- Not knowing Schema.org exists or how to use it
- Using wrong schema type (LocalBusiness instead of PhotographService)
- Incorrect nested structure in JSON-LD
- Missing required properties for specific schema types
- Not testing with Google's Rich Results Test before publishing

**Consequences:**
- No rich snippets in search results (lower click-through rate)
- Missed opportunities for rich result badges in Google Images
- Google may ignore malformed structured data entirely
- No enhanced local search presence
- AI engines (ChatGPT, Perplexity) can't extract structured information

**Prevention:**
1. **Use correct schema types:**
   - `PhotographService` for the business
   - `Photograph` for individual images
   - `Person` for photographer profile
   - `LocalBusiness` for location-based services
2. **Include critical properties:**
   - Business: name, address, telephone, geo, priceRange, areaServed
   - Photograph: author, dateCreated, contentLocation, locationCreated
3. **Test before publishing** - Use Google Rich Results Test and Schema.org validator
4. **Nest schemas properly** - Business can contain Person (photographer) and multiple Photograph items
5. **Keep URLs absolute** - All URLs must include full protocol and domain

**Detection:**
- Google Search Console > Enhancements > Check for structured data errors
- Run Google Rich Results Test on production URL
- Use Schema.org validator at validator.schema.org
- Check for "Structured Data Validation Errors" in Screaming Frog

**Phase to address:** Phase 2 (Structured Data) - After basic image SEO is solid.

**Sources:**
- [Schema.org Photograph Type](https://schema.org/Photograph) (HIGH confidence - official)
- [Common Schema Markup Errors](https://robertcelt95.medium.com/common-schema-markup-errors-that-kill-your-seo-rankings-cc64a83480af) (MEDIUM confidence)
- [Photography Business JSON-LD Template](https://www.mikecassidyphotography.com/post/a-structured-data-json-ld-template-for-your-photography-business) (LOW confidence - single source)

---

### Pitfall 4: Single-Page Application with No URL Strategy

**What goes wrong:** Single-page site lacks unique URLs for different portfolio sections/galleries, making it impossible for Google to index and rank individual collections.

**Why it happens:**
- All content loaded on one page (index.html)
- No hash-based or history API routing
- Assumption that "one page = simpler SEO"
- Not understanding that Google needs discrete URLs to index discrete content

**Consequences:**
- Only index.html can rank in search results
- Can't target different keywords for different photography types (wedding, portrait, family)
- Users can't link to specific galleries
- No breadcrumb navigation for search snippets
- Reduced crawl budget efficiency (Google sees one giant page instead of organized content)

**Prevention:**
1. **Use History API for routing** - `/weddings`, `/portraits`, `/about` as real URLs
2. **Avoid hash-based routing** - Google ignores `#weddings` as separate page
3. **Ensure each section has unique metadata** - Title, description, og:image per "page"
4. **Implement proper canonicalization** - Point canonical to current "page" URL
5. **Consider converting to multi-page** - True separate HTML files for major sections

**Detection:**
- Check URL bar while navigating - Does URL change?
- View Google Search Console > Pages - How many indexed?
- Run site:cassiecayphotography.com in Google - Only 1 result?
- Check if you can link directly to a gallery and have it load

**Phase to address:** Architecture decision - May need Phase 0 (Pre-SEO refactor) if routing doesn't exist.

**Sources:**
- [SEO for Single Page Applications 2026 Guide](https://jesperseo.com/blog/seo-for-single-page-applications-complete-2026-guide/) (HIGH confidence - comprehensive)
- [Common SPA Crawling Issues](https://www.lumar.io/blog/best-practice/spa-seo/) (MEDIUM confidence)

---

### Pitfall 5: Google Business Profile Misconfiguration

**What goes wrong:** Wrong business category, incorrect service area setup, or missing location data prevents local search visibility for "Madison photographer" queries.

**Why it happens:**
- Choosing generic "Photographer" instead of specific type
- Not understanding difference between physical address, service area, and hybrid business
- Listing home address when operating as mobile service
- Incomplete profile (missing hours, phone, description)
- Not verifying Google Business Profile ownership

**Consequences:**
- Don't appear in Google Maps results for local searches
- Wrong category means wrong local search queries
- Profile suspension if address rules violated (major for location-based businesses)
- Competitors outrank in "near me" searches
- Lost opportunities from high-intent local searchers

**Prevention:**
1. **Choose specific primary category** - "Wedding Photographer" NOT "Photographer"
2. **Set correct business type:**
   - Service Area Business (if traveling to clients)
   - Physical location (if studio exists)
   - Hybrid (if both)
3. **Hide address if service-area-only** - Google policy for mobile businesses
4. **Complete all profile sections** - Hours, phone, website, description, services
5. **Add location-rich photos** - Images with geotagging showing Madison landmarks
6. **Set service area radius** - Madison + surrounding Dane County cities

**Detection:**
- Search "photographer Madison WI" - Do you appear in Map Pack?
- Check Google Business Profile dashboard for warnings
- Verify category is specific, not generic
- Confirm service area matches actual service region
- Check for profile suspension notices

**Phase to address:** Phase 3 (Local SEO) - After on-page SEO foundation.

**Sources:**
- [Google Business Profile for Photographers](https://beccajeanphotography.com/photographers-getting-the-most-out-of-your-google-business-profile/) (MEDIUM confidence)
- [Google Business Profile Common Mistakes](https://favfly.com/post/google-business-profile-mistakes) (MEDIUM confidence - general)
- [GBP Optimization for Photographers](https://modsquare.io/articles/gbp-optimization) (LOW confidence - single source)

---

## Moderate Pitfalls

Mistakes that cause delays, missed opportunities, or technical debt.

---

### Pitfall 6: Missing or Incomplete Open Graph Tags

**What goes wrong:** When portfolio is shared on social media (Facebook, LinkedIn, X, iMessage), no image preview appears or wrong image/title is used.

**Why it happens:**
- Not knowing Open Graph protocol exists
- Assuming social platforms will figure it out
- Missing `og:image`, `og:title`, `og:description` tags
- Wrong image format (not JPEG/PNG/GIF)
- Image URL not absolute or not publicly accessible
- JavaScript-rendered meta tags (social crawlers can't execute JS)

**Consequences:**
- Shared links have no visual appeal in social feeds
- Generic fallback image or no image at all
- Missed click-through opportunities from social referrals
- Unprofessional appearance when sharing portfolio
- Lower engagement on social media marketing efforts

**Prevention:**
1. **Add minimum required OG tags in HTML `<head>`:**
   ```html
   <meta property="og:title" content="Cassie Cay Photography - Madison Wedding Photographer">
   <meta property="og:description" content="Wisconsin wedding and portrait photography">
   <meta property="og:image" content="https://cassiecayphotography.com/images/og-preview.jpg">
   <meta property="og:url" content="https://cassiecayphotography.com">
   <meta property="og:type" content="website">
   ```
2. **Use absolute URLs** - `https://` full path, not relative
3. **Image requirements:**
   - JPEG or PNG format
   - Minimum 1200x630 pixels (Facebook recommendation)
   - Less than 8MB file size
   - Publicly accessible (no authentication required)
4. **Add Twitter Card tags** - Similar to OG but for Twitter/X
5. **Test before publishing** - Use Facebook Sharing Debugger, LinkedIn Post Inspector

**Detection:**
- Share URL on Facebook/LinkedIn - Check preview
- Use Facebook Sharing Debugger tool
- View page source - Are OG tags present in `<head>`?
- Check if og:image URL loads in browser

**Phase to address:** Phase 4 (Social & Meta Tags) - After core SEO complete.

**Sources:**
- [The Open Graph Protocol](https://ogp.me/) (HIGH confidence - official specification)
- [Open Graph SEO Guide](https://nogood.io/blog/open-graph-seo/) (MEDIUM confidence)

---

### Pitfall 7: No Image Sitemap

**What goes wrong:** Google discovers images slowly or not at all, especially if lazy-loaded or embedded in JavaScript.

**Why it happens:**
- Not knowing image sitemaps exist (separate from page sitemap)
- Assuming regular sitemap is enough
- Thinking Google will find all images automatically
- Not submitting sitemap to Google Search Console

**Consequences:**
- Slower image indexing (days/weeks instead of hours)
- Images embedded in JavaScript may never be discovered
- Reduced Google Image Search visibility
- Google allocates crawl budget inefficiently
- New images take longer to appear in search

**Prevention:**
1. **Create dedicated image sitemap XML:**
   ```xml
   <url>
     <loc>https://cassiecayphotography.com/</loc>
     <image:image>
       <image:loc>https://cassiecayphotography.com/images/wedding-001.jpg</image:loc>
       <image:caption>Bride and groom first kiss at Madison Arboretum</image:caption>
       <image:geo_location>Madison, Wisconsin</image:geo_location>
       <image:title>Madison Arboretum Wedding Ceremony</image:title>
     </image:image>
   </url>
   ```
2. **Include all portfolio images** - Up to 1,000 images per URL entry
3. **Use absolute URLs** - Full protocol and domain required
4. **Update regularly** - Automate if possible when adding new images
5. **Submit to Google Search Console** - Don't rely on Google finding it
6. **Keep under limits** - 50,000 URLs or 50MB per sitemap file

**Detection:**
- Check if `/sitemap.xml` or `/image-sitemap.xml` exists
- Google Search Console > Sitemaps - Is image sitemap submitted?
- Validate XML with sitemap validator tool
- Check for `<image:image>` tags in sitemap

**Phase to address:** Phase 1 (Image SEO Fundamentals) - Include with alt text work.

**Sources:**
- [Google Image Sitemaps Documentation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps) (HIGH confidence - official)
- [Image Sitemaps for Photography SEO](https://www.linkedin.com/advice/3/how-can-you-use-image-sitemaps-improve-your-photography) (MEDIUM confidence)

---

### Pitfall 8: Generic or Camera-Generated Filenames

**What goes wrong:** Image files named `IMG_4081.jpg`, `DSC_2847.jpg` provide zero SEO value.

**Why it happens:**
- Direct export from camera/Lightroom without renaming
- Batch processing without filename template
- Not knowing filenames contribute to SEO
- Too many images to rename manually (perceived barrier)

**Consequences:**
- Lost SEO signals (filenames help Google understand image content)
- Missed keyword opportunities
- Harder to manage/organize images
- No context for accessibility tools
- Reduced relevance scoring for image search queries

**Prevention:**
1. **Use descriptive, keyword-rich filenames** - `madison-wedding-ceremony-arboretum.jpg` NOT `IMG_4081.jpg`
2. **Include location when relevant** - Local SEO signal
3. **Use hyphens, not underscores** - `wedding-portrait.jpg` NOT `wedding_portrait.jpg`
4. **Keep lowercase** - Avoid case sensitivity issues
5. **Create naming convention:**
   - Format: `{type}-{location}-{description}-{number}.jpg`
   - Example: `wedding-madison-firstdance-01.jpg`
6. **Batch rename during export** - Lightroom/Bridge can automate this

**Detection:**
- Check image filenames in HTML src attributes
- List files in images directory - Are they descriptive?
- Use `ls images/*.jpg | grep -E '^(IMG_|DSC_)'` to find camera filenames

**Phase to address:** Phase 1 (Image SEO Fundamentals) - Do alongside alt text.

**Sources:**
- [Google Image SEO Best Practices](https://developers.google.com/search/docs/appearance/google-images) (HIGH confidence - official)
- [Image Sitemap Best Practices](https://devrix.com/tutorial/image-sitemaps/) (MEDIUM confidence)

---

### Pitfall 9: Missing Robots.txt or Incorrect Disallow Rules

**What goes wrong:** Either no robots.txt exists (allowing crawlers to waste time on irrelevant paths) or overly aggressive disallow rules block important content.

**Why it happens:**
- Not creating robots.txt at all
- Copy-paste from another site without understanding
- Accidentally blocking `/images/` directory
- Blocking JavaScript/CSS files Google needs to render page
- Not understanding difference between robots.txt and meta robots tag

**Consequences:**
- Important pages/images not crawled (if too restrictive)
- Crawl budget wasted on admin pages, drafts, etc. (if too permissive)
- Google can't render page properly if CSS/JS blocked
- Sitemap location not specified (slower discovery)

**Prevention:**
1. **Create minimal robots.txt:**
   ```
   User-agent: *
   Allow: /
   Disallow: /admin/
   Disallow: /private/

   Sitemap: https://cassiecayphotography.com/sitemap.xml
   Sitemap: https://cassiecayphotography.com/image-sitemap.xml
   ```
2. **Never block image directory** - Don't use `Disallow: /images/`
3. **Never block CSS/JS** - Google needs these to render
4. **Specify sitemap location** - Helps Google discover it faster
5. **Test before deploying** - Use Google's robots.txt Tester in Search Console
6. **Keep it simple** - Only block truly private/admin sections

**Detection:**
- Check `https://cassiecayphotography.com/robots.txt`
- Google Search Console > robots.txt Tester
- Look for blocked resources in URL Inspection tool
- Check for "Disallow: /images/" or "Disallow: /*.js"

**Phase to address:** Phase 5 (Technical SEO) - After content SEO complete.

**Sources:**
- [Google Robots.txt Specifications](https://developers.google.com/search/docs/crawling-indexing/robots/intro) (HIGH confidence - official)

---

### Pitfall 10: No Canonical URL Specified

**What goes wrong:** Multiple URL variations (www vs non-www, http vs https, trailing slash vs none) cause duplicate content issues.

**Why it happens:**
- Not understanding canonical tags
- Server serves same content on multiple URL patterns
- Not setting up proper redirects
- Mixed http/https links internally
- No canonical tag in HTML head

**Consequences:**
- Google splits ranking signals between duplicate URLs
- PageRank dilution across variants
- Confusing search results (wrong URL version ranks)
- With rise of AI engines (ChatGPT, Perplexity), unclear canonical signals affect attribution
- Link equity split instead of consolidated

**Prevention:**
1. **Add canonical tag to every page:**
   ```html
   <link rel="canonical" href="https://cassiecayphotography.com/">
   ```
2. **Use absolute URLs** - Full protocol and domain
3. **Point to preferred version** - Choose https://cassiecayphotography.com (not www)
4. **Set up redirects:**
   - http → https (301 redirect)
   - www → non-www or vice versa (301 redirect)
   - Trailing slash consistency
5. **Link internally to canonical** - Use same URL format throughout site
6. **Include canonical in sitemap** - Only canonical URLs in sitemap.xml

**Detection:**
- Check HTML `<head>` for `<link rel="canonical">`
- Test URL variants - Do they redirect or serve duplicate?
- Google Search Console > Pages > Check for duplicate URLs
- Use `site:cassiecayphotography.com` to see all indexed versions

**Phase to address:** Phase 5 (Technical SEO) - Critical for consolidation.

**Sources:**
- [Google Canonical URL Documentation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) (HIGH confidence - official)
- [Canonicalization SEO Guide 2026](https://searchengineland.com/canonicalization-seo-448161) (HIGH confidence - current)

---

## Minor Pitfalls

Mistakes that cause annoyance but are easily fixable.

---

### Pitfall 11: Missing or Poor Meta Descriptions

**What goes wrong:** Google generates meta description from page content (often poorly) or shows "..." in search results.

**Why it happens:**
- Not adding meta description tag
- Using same description on all pages
- Description too short (<50 chars) or too long (>160 chars)
- Generic description with no compelling call to action

**Consequences:**
- Lower click-through rate from search results
- Less compelling search snippet
- Missed opportunity to include keywords
- Google's auto-generated description may be irrelevant

**Prevention:**
1. **Write unique, compelling descriptions** - 50-160 characters ideal
2. **Include primary keyword naturally** - "Madison wedding photographer"
3. **Add call to action** - "View portfolio" or "Book your session"
4. **Make it click-worthy** - Answer "Why click this result?"
5. **Update for single-page sections** - If using routing, update dynamically

**Example:**
```html
<meta name="description" content="Award-winning Madison wedding photographer capturing authentic moments. View portfolio of Wisconsin wedding, engagement, and portrait photography.">
```

**Detection:**
- View page source - Check meta description tag
- Google search for site - Is description compelling?
- Use Screaming Frog to audit all descriptions

**Phase to address:** Phase 4 (Social & Meta Tags)

**Sources:**
- WebSearch findings (MEDIUM confidence - best practices)

---

### Pitfall 12: Not Tracking SEO Performance

**What goes wrong:** No way to measure if SEO efforts are working or identify new problems.

**Why it happens:**
- Not setting up Google Search Console
- Not setting up Google Analytics
- Not knowing these tools exist or how to use them
- Not monitoring keyword rankings
- Not checking image search impressions

**Consequences:**
- Can't measure ROI of SEO work
- Miss warnings about indexing problems
- Don't know which keywords drive traffic
- Can't identify declining rankings early
- No data to inform future optimizations

**Prevention:**
1. **Set up Google Search Console** - Verify site ownership immediately
2. **Set up Google Analytics 4** - Track traffic sources and behavior
3. **Monitor key metrics:**
   - Total impressions/clicks in Search
   - Image search impressions/clicks
   - Keyword rankings for "Madison photographer", "Wisconsin wedding photographer"
   - Core Web Vitals scores
4. **Set up alerts** - Email notifications for indexing issues
5. **Check monthly** - Review Search Console performance reports

**Detection:**
- Is Google Search Console configured?
- Is Google Analytics installed?
- Can you answer "How many people found site via Google Images last month?"

**Phase to address:** Phase 0 (Setup) - Do this before starting SEO work.

**Sources:**
- [Why Photographers Need SEO 2026](https://thekaizenglobal.com/why-photographers-need-seo) (LOW confidence)

---

### Pitfall 13: Keyword Stuffing in Attempt to "Do SEO"

**What goes wrong:** Over-optimizing by repeating "Madison wedding photographer Wisconsin wedding photography" unnaturally throughout page.

**Why it happens:**
- Outdated SEO advice from early 2000s
- Misconception that more keywords = better rankings
- Keyword cannibalization (same keyword on multiple pages)
- Not understanding modern semantic search

**Consequences:**
- Google penalty for spam
- Terrible user experience (reads like robot wrote it)
- Lower conversion rate (visitors leave)
- Reduced trust and credibility

**Prevention:**
1. **Write for humans first** - Natural, compelling copy
2. **Use keywords naturally** - Include once in title, once in first paragraph, sprinkle throughout
3. **Use semantic variations** - "wedding photography", "wedding photographer", "capture your wedding"
4. **Focus on user intent** - What do visitors want to know/see?
5. **Target one primary keyword per page** - Avoid keyword cannibalization

**Detection:**
- Read page out loud - Does it sound natural?
- Use keyword density checker - Should be <3%
- Search Console may show keyword stuffing warnings

**Phase to address:** Phase 4 (Content Optimization) - Part of meta tag work.

**Sources:**
- [SEO for Photographers Best Practices](https://zenfolio.com/blog/4-seo-mistakes-photographers-make/) (MEDIUM confidence)

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **Phase 1: Image SEO** | Trying to write 84 alt texts at once (burnout) | Batch by gallery: 20 wedding images, then 15 portraits, etc. |
| **Phase 1: Image SEO** | Using same lazy loading fix site-wide (breaking things) | Test on one gallery section first, verify rendering works |
| **Phase 2: Structured Data** | Copy-paste JSON-LD without customizing | Replace ALL placeholder values, test each section |
| **Phase 2: Structured Data** | Adding too many schema types at once (complexity) | Start with PhotographService for business, add Photograph schemas later |
| **Phase 3: Local SEO** | Listing home address publicly (privacy issue) | Use service area business type, hide address in GBP |
| **Phase 3: Local SEO** | Over-optimizing for "Madison" keyword | Also target surrounding cities: Middleton, Verona, Sun Prairie |
| **Phase 4: Meta Tags** | Forgetting to update dynamic OG tags per section | If routing exists, use JavaScript to update OG tags per "page" |
| **Phase 5: Technical SEO** | Breaking existing functionality with redirects | Test all redirects in staging, check for redirect chains |
| **Phase 5: Technical SEO** | Over-complicating robots.txt | Keep it minimal, only block truly private paths |

---

## Cross-Cutting Concerns

### Mobile Performance
**Issue:** Large image files slow mobile load times despite SEO optimization.
**Impact:** Google prioritizes mobile performance for rankings (mobile-first indexing).
**Prevention:** Use responsive images with srcset, serve WebP format, implement proper lazy loading.
**Phase:** Ongoing concern, monitor with PageSpeed Insights throughout all phases.

### Content Freshness
**Issue:** Static portfolio never updated signals inactive business to Google.
**Impact:** Gradual decline in rankings over time, AI engines prefer recent content.
**Prevention:** Add new images quarterly, update descriptions, refresh case studies.
**Phase:** Post-launch maintenance, not one-time fix.

### Accessibility = SEO
**Issue:** SEO work that ignores accessibility misses the point.
**Impact:** Alt text, semantic HTML, proper headings help both users and Google.
**Prevention:** Use WAVE or axe DevTools to test accessibility alongside SEO.
**Phase:** Check accessibility in Phase 1 alongside image SEO work.

---

## Quick Reference: "Don't Do This" Checklist

Before implementing SEO changes, verify you're NOT doing these:

- [ ] Empty alt text (`alt=""`) on portfolio images
- [ ] Camera filenames (IMG_*, DSC_*) instead of descriptive names
- [ ] Lazy loading that requires user scroll events
- [ ] Missing structured data or untested JSON-LD
- [ ] Generic "Photographer" Google Business Profile category
- [ ] No image sitemap submitted to Search Console
- [ ] No canonical URL tag in HTML head
- [ ] Missing Open Graph tags for social sharing
- [ ] Overly restrictive robots.txt blocking images/CSS/JS
- [ ] No Google Search Console setup to monitor issues
- [ ] Keyword stuffing in attempt to rank
- [ ] Single-page app with no URL routing strategy

---

## When to Do Deeper Research

These topics may need phase-specific investigation:

1. **Phase 1** - If site has custom JavaScript lazy loading library, research compatibility with Googlebot rendering
2. **Phase 2** - If using non-standard CMS or framework, research how it handles JSON-LD injection
3. **Phase 3** - Before GBP setup, research Google's current policies for service-area businesses (frequently changes)
4. **Phase 4** - If planning social media ad campaigns, research platform-specific image requirements beyond standard OG tags
5. **Phase 5** - If site has complex CDN/caching, research cache purging strategy for sitemap updates

---

## Sources

### HIGH Confidence (Official Documentation)
- [Google Image SEO Best Practices](https://developers.google.com/search/docs/appearance/google-images) - Official Google guidelines
- [Google Lazy Loading Fix Guide](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading) - Updated Dec 2025
- [Google Image Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps) - Official specification
- [Google Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) - Official documentation
- [Schema.org Photograph Type](https://schema.org/Photograph) - Official schema specification
- [The Open Graph Protocol](https://ogp.me/) - Official OG specification

### MEDIUM Confidence (Verified with Multiple Sources)
- [SEO for Single Page Applications 2026 Guide](https://jesperseo.com/blog/seo-for-single-page-applications-complete-2026-guide/)
- [Canonicalization SEO Guide 2026](https://searchengineland.com/canonicalization-seo-448161)
- [Photography Portfolio SEO Mistakes](https://zenfolio.com/blog/4-seo-mistakes-photographers-make/)
- [Alt Text SEO Best Practices](https://alttext.ai/blog/image-alt-text-seo-best-practices)
- [Google Business Profile for Photographers](https://beccajeanphotography.com/photographers-getting-the-most-out-of-your-google-business-profile/)
- [Common SPA Crawling Issues](https://www.lumar.io/blog/best-practice/spa-seo/)

### LOW Confidence (Single Source or Unverified)
- [Photography Business JSON-LD Template](https://www.mikecassidyphotography.com/post/a-structured-data-json-ld-template-for-your-photography-business)
- [GBP Optimization for Photographers](https://modsquare.io/articles/gbp-optimization)
- [Image Sitemaps for Photography](https://www.linkedin.com/advice/3/how-can-you-use-image-sitemaps-improve-your-photography)

---

## Confidence Assessment

| Area | Confidence | Reason |
|------|-----------|--------|
| Image SEO Pitfalls | **HIGH** | Google official documentation + current 2026 sources |
| Structured Data Pitfalls | **HIGH** | Schema.org official + Google rich results documentation |
| Technical SEO Pitfalls | **HIGH** | Google Search Central documentation, updated 2025-2026 |
| Local SEO Pitfalls | **MEDIUM** | GBP best practices from photographer sources, no official Google 2026 guide found |
| SPA SEO Pitfalls | **HIGH** | Comprehensive 2026 SPA SEO guide + Google official lazy loading docs |

---

## Research Complete

**Date:** 2026-01-21
**Researcher:** Claude (GSD Project Researcher)
**Ready for:** Roadmap creation (Phase structure should address critical pitfalls first)
