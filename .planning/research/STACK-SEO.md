# Stack Research: SEO Features

**Project:** cassiecayphotography.com
**Milestone:** M2.0 SEO Enhancements
**Researched:** 2026-01-21
**Focus:** Stack additions for structured data, image sitemaps, Twitter cards, and AI alt text

## Executive Summary

For comprehensive SEO on a photography portfolio, you need **ZERO external runtime dependencies**. All SEO enhancements are build-time only using Node.js scripts integrated into the existing Vite build pipeline. The project already has Sharp (0.34.5) for image processing and glob (13.0.0) for file matching, so the only additions needed are:

1. **sitemap** (v9.0.0) - Image sitemap generation
2. **@anthropic-ai/sdk** (latest) - AI alt text generation

Everything else (JSON-LD, Twitter cards) requires no libraries—just static meta tags.

## Recommended Stack Additions

### 1. Sitemap Generation (BUILD-TIME ONLY)

| Library | Version | Purpose | Rationale |
|---------|---------|---------|-----------|
| `sitemap` | ^9.0.0 | Generate XML sitemaps with image extensions | Industry standard with 37,843 dependents. Official Google image sitemap support via `<image:image>` tags. v9.0.0 modernized to ESM-first (2 months old), requires Node >=20.19.5 (already met). Streaming API handles 84+ images efficiently. |

**Why sitemap over alternatives:**
- Native support for Google's image sitemap schema (`<image:image>`, `<image:loc>`, `<image:caption>`, `<image:geo_location>`)
- Streaming API for handling 84+ images efficiently without memory issues
- TypeScript definitions included
- Zero runtime overhead (generates static XML at build time)
- 399 other npm packages depend on it (proven stability)

**Why NOT alternatives:**
- `next-sitemap`, `@astrojs/sitemap` - Framework-specific, this is vanilla Vite
- `sitemap-generator` - Crawls deployed sites, overkill when we know paths statically
- Manual XML generation - Error-prone, missing image sitemap validation

**Installation:**
```bash
npm install -D sitemap
```

**Confidence:** HIGH - Version 9.0.0 verified from [npm](https://www.npmjs.com/package/sitemap), published 2 months ago (Nov 2025)

---

### 2. Structured Data (NO LIBRARY NEEDED)

| Approach | Dependencies | Purpose | Rationale |
|----------|--------------|---------|-----------|
| Manual JSON-LD | None | Schema.org structured data | For static sites with <5 schema types, hand-written JSON-LD is simpler and more maintainable than a library. Google explicitly recommends JSON-LD embedded in `<script type="application/ld+json">` tags. |
| `schema-dts` (optional) | ^1.1.5 | TypeScript types for Schema.org | Only if you want type checking. 334k weekly downloads, but NOT required for a small static site. |

**Why manual over schema-dts:**
- Photography portfolio needs only 3 schema types: `ProfessionalService` (or `Organization`), `ImageObject`, `BreadcrumbList`
- Hand-written JSON-LD is more readable, easier to validate with Google's Rich Results Test
- No build-time dependency to maintain
- Google's validator works on raw JSON-LD—no compilation needed
- For 3 schemas, a library adds complexity without benefit

**If using schema-dts (optional):**
```bash
npm install -D schema-dts
```

**Confidence:** HIGH - Google's official recommendation is JSON-LD, verified from [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

**schema-dts confidence:** MEDIUM - Version 1.1.5 verified from [npm](https://www.npmjs.com/package/schema-dts), but low maintenance (last updated 10 months ago). Stable but not actively developed.

---

### 3. Twitter Cards (NO LIBRARY NEEDED)

| Approach | Dependencies | Purpose | Rationale |
|----------|--------------|---------|-----------|
| Static meta tags | None | Twitter/X card metadata | Twitter cards are 4-6 meta tags. No library needed. Hand-write them with proper fallback to Open Graph tags. |

**Required tags for photography portfolio:**
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[Page title, max 68 chars]">
<meta name="twitter:description" content="[Description, max 200 chars]">
<meta name="twitter:image" content="[Image URL, < 5MB, JPG/PNG/GIF/WebP]">
<meta name="twitter:image:alt" content="[Alt text for image]">
```

**Twitter falls back to Open Graph** if Twitter-specific tags are missing, so the priority is:
1. Ensure good Open Graph tags (already present in index.html)
2. Add Twitter-specific tags only where behavior differs (e.g., `summary_large_image` card type)

**Why NOT a library:**
- No React/Vue/framework, so no need for react-helmet or vue-meta
- No dynamic content—static meta tags work perfectly
- Meta tag "generators" are online tools, not npm packages
- Adding a library for 5 meta tags is extreme overengineering

**Confidence:** HIGH - Official Twitter/X documentation at [developer.twitter.com](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started)

---

### 4. AI Alt Text Generation (BUILD-TIME ONLY)

| Service | Cost | API Package | Purpose | Rationale |
|---------|------|-------------|---------|-----------|
| Anthropic Claude Vision | $3 input / $15 output per 1M tokens | `@anthropic-ai/sdk` | Generate descriptive alt text for 84 images | Claude Sonnet 4.5 excels at describing artistic composition, lighting, and mood (critical for photography). For 84 images with ~100 tokens per description, cost is ~$0.01-0.05 total. You already have Anthropic API access (using Claude Code). |

**Why Anthropic Claude over OpenAI Vision:**
- Superior understanding of artistic composition and lighting (critical for photography portfolios)
- More natural, descriptive language for creative content
- You already have Anthropic API credentials (no new account setup)
- Slightly lower pricing: Claude Sonnet 4.5 is $3/$15 per 1M tokens vs OpenAI GPT-4 Vision at ~$5-10 per 1M
- Claude handles image analysis with a focus on aesthetics, not just object detection

**Why NOT alternatives:**
- OpenAI Vision - Comparable but slightly more expensive, more object-detection focused
- Microsoft Azure Computer Vision - Generic alt text, not suitable for artistic photography
- Google Cloud Vision - Similar issue, generic descriptions
- Manual alt text - 84 images is too many for quality manual work at scale
- Free online tools (AltText.ai, etc.) - Require uploading images, can't automate in build pipeline

**Implementation approach:**
1. Build-time Node.js script (`scripts/generate-alt-text.js`)
2. Reads existing image metadata with Sharp (already installed at 0.34.5)
3. Calls Claude Vision API with custom prompt optimized for photography
4. Writes alt text to JSON manifest (`alt-text.json`)
5. Vite build or separate script injects alt text into HTML `<img>` tags

**Installation:**
```bash
npm install -D @anthropic-ai/sdk
```

**Environment setup:**
```bash
# Add to .env (DO NOT commit)
ANTHROPIC_API_KEY=your_key_here
```

**Confidence:** HIGH - Claude Vision documentation verified at [docs.anthropic.com](https://platform.claude.com/docs/en/build-with-claude/vision). Pricing verified from [MetaCTO pricing breakdown](https://www.metacto.com/blogs/anthropic-api-pricing-a-full-breakdown-of-costs-and-integration) (Jan 2026).

---

## Integration with Existing Vite Build

The project already has a sophisticated Vite build pipeline with Sharp image optimization. All SEO additions integrate as **build-time scripts** that run before or during Vite build.

### Current Build Process (from package.json)

```
npm run preprocess → optimize-images.js (Sharp processing)
npm run build → vite build
```

### Proposed SEO Integration

```
npm run preprocess → optimize-images.js (existing)
npm run generate:alt-text → NEW: AI alt text generation (run manually, not in CI/CD)
npm run generate:sitemap → NEW: sitemap.xml with <image:image> tags
npm run build → vite build (injects JSON-LD, meta tags if using plugin)
```

### Integration Points

| Script | Hook | What It Does | Files Affected | Frequency |
|--------|------|--------------|----------------|-----------|
| `generate-alt-text.js` | Manual (one-time) | Scans images-optimized/, calls Claude API, writes alt-text.json | New: `alt-text.json` | Run once, update when adding new images |
| `generate-sitemap.js` | Pre-build | Reads images-optimized/, generates sitemap.xml with `<image:image>` tags | Replaces: `sitemap.xml` | Every build |
| `inject-structured-data.js` (optional) | Vite plugin (transformIndexHtml) | Injects JSON-LD into index.html during build | Modifies: `index.html` (in dist/) | Every build |
| Twitter card tags | Manual (one-time) | Add 5 meta tags to index.html `<head>` | Edits: `index.html` | One-time edit |

### Vite Plugin for JSON-LD (Optional, NOT Recommended)

You CAN inject JSON-LD dynamically with a Vite plugin:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    {
      name: 'inject-structured-data',
      transformIndexHtml(html) {
        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "Cassie Cay Photography",
          // ... rest of schema
        }
        return html.replace(
          '</head>',
          `<script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script></head>`
        )
      }
    }
  ]
})
```

**HOWEVER:** For a simple static site, **hardcode JSON-LD in index.html** rather than adding a Vite plugin. Reasons:
- Easier to validate with Google's Rich Results Test (view source and copy/paste)
- No build complexity
- JSON-LD doesn't change frequently—no need for dynamic generation
- Simpler to debug if something breaks

---

## What NOT to Add

| Library/Approach | Why Avoid |
|------------------|-----------|
| `jsonld` (npm package) | This is a JSON-LD **processor** for expanding/compacting linked data. You don't need processing—you need generation. It's for semantic web applications, not SEO. Overkill and wrong use case. |
| `next-sitemap`, `@astrojs/sitemap`, `@nuxtjs/sitemap` | Framework-specific sitemap generators. This is a vanilla Vite project, not Next.js/Astro/Nuxt. |
| React Helmet, vue-meta, @vueuse/head | No framework = no need for meta tag management libraries. These are for dynamic single-page apps. |
| SEO libraries (react-seo, vue-seo, gatsby-plugin-seo) | Runtime overhead for what should be static build-time generation. Wrong paradigm for a static site. |
| OpenAI DALL-E | This is image **generation**, not vision/alt text. Wrong API entirely. |
| Separate sitemap-generator tools that crawl deployed sites | Overcomplicated. You know your image paths statically at build time. Generate directly with sitemap package. |
| `schema-dts-gen` | This generates TypeScript types from custom Schema.org schemas. You don't need custom types—use the pre-built schema-dts package if you want types at all. |
| `vite-plugin-compile-time` | Overkill for simple build scripts. Just run Node.js scripts with npm scripts. |

---

## Version Verification & Confidence

| Package | Version | Last Updated | Weekly Downloads | Confidence | Source |
|---------|---------|--------------|------------------|------------|--------|
| `sitemap` | 9.0.0 | 2 months ago (Nov 2025) | Not specified | HIGH | [npm](https://www.npmjs.com/package/sitemap), [GitHub](https://github.com/ekalinin/sitemap.js/) |
| `schema-dts` | 1.1.5 | 10 months ago (Mar 2025) | 334,344 | MEDIUM | [npm](https://www.npmjs.com/package/schema-dts), [GitHub](https://github.com/google/schema-dts) |
| `sharp` | 0.34.5 | Already installed | Not specified | HIGH | Project package.json |
| `glob` | 13.0.0 | Already installed (2 months ago) | Not specified | HIGH | Project package.json |
| `@anthropic-ai/sdk` | Latest (TBD) | To be installed | Not specified | HIGH | Official Anthropic SDK |

**All versions verified as of 2026-01-21.**

---

## Installation Commands

```bash
# Required additions (sitemap + AI SDK)
npm install -D sitemap @anthropic-ai/sdk

# Optional (only if you want TypeScript checking for JSON-LD)
npm install -D schema-dts
```

**Total new dependencies:** 1-2 (sitemap required, @anthropic-ai/sdk required for AI alt text, schema-dts optional)

---

## Code Examples

### Example 1: Image Sitemap Generation

```javascript
// scripts/generate-sitemap.js
import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { readFileSync } from 'fs';
import { glob } from 'glob';
import { resolve } from 'path';

async function generateSitemap() {
  const hostname = 'https://cassiecayphotography.com';
  const sitemap = new SitemapStream({ hostname });
  const writeStream = createWriteStream(resolve('sitemap.xml'));
  sitemap.pipe(writeStream);

  // Read alt text manifest (generated by generate-alt-text.js)
  let altTextMap = {};
  try {
    altTextMap = JSON.parse(readFileSync('alt-text.json', 'utf-8'));
  } catch (e) {
    console.warn('alt-text.json not found, using filenames as captions');
  }

  // Find all images
  const images = await glob('images-optimized/**/*.{jpg,jpeg,png,webp}');

  // Homepage with all images
  sitemap.write({
    url: '/',
    changefreq: 'monthly',
    priority: 1.0,
    img: images.map(imgPath => ({
      url: `${hostname}/${imgPath}`,
      caption: altTextMap[imgPath] || imgPath.split('/').pop().replace(/\.[^.]+$/, ''),
      title: imgPath.split('/').pop().replace(/\.[^.]+$/, ''),
      // Optional: add geo_location if you have location data
      // geo_location: 'Madison, Wisconsin'
    }))
  });

  sitemap.end();
  await streamToPromise(sitemap);
  console.log('✓ Sitemap generated with', images.length, 'images');
}

generateSitemap().catch(console.error);
```

**Add to package.json:**
```json
{
  "scripts": {
    "generate:sitemap": "node scripts/generate-sitemap.js"
  }
}
```

---

### Example 2: JSON-LD Structured Data (Manual in HTML)

```html
<!-- In index.html <head>, after existing meta tags -->

<!-- Organization/ProfessionalService Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Cassie Cay Photography",
  "description": "Professional photographer in Madison, Wisconsin specializing in family, newborn, senior, milestone, and event photography.",
  "url": "https://cassiecayphotography.com",
  "logo": "https://cassiecayphotography.com/images/logo.jpg",
  "image": "https://cassiecayphotography.com/images/hero-image.jpg",
  "telephone": "+1-XXX-XXX-XXXX",
  "email": "cassie@cassiecayphotography.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Madison",
    "addressRegion": "WI",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "addressLocality": "Madison, Wisconsin"
  },
  "sameAs": [
    "https://www.facebook.com/cassiecayphotography",
    "https://www.instagram.com/cassiecayphotography"
  ],
  "priceRange": "$$"
}
</script>

<!-- BreadcrumbList Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://cassiecayphotography.com"
  }]
}
</script>

<!-- ImageGallery Schema (for portfolio) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "Cassie Cay Photography Portfolio",
  "url": "https://cassiecayphotography.com",
  "image": [
    "https://cassiecayphotography.com/images-optimized/portfolio-1.jpg",
    "https://cassiecayphotography.com/images-optimized/portfolio-2.jpg"
  ]
}
</script>
```

**Validation:** Paste into [Google's Rich Results Test](https://search.google.com/test/rich-results)

---

### Example 3: Twitter Card Meta Tags (Manual in HTML)

```html
<!-- In index.html <head>, after existing Open Graph tags -->

<!-- Twitter Card Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@cassiecayphoto"> <!-- If you have a Twitter account -->
<meta name="twitter:title" content="Cassie Cay Photography | Madison, WI Professional Photographer">
<meta name="twitter:description" content="Professional photographer specializing in family, newborn, senior, milestone, and event photography in Madison, Wisconsin. Capturing beautiful moments that last a lifetime.">
<meta name="twitter:image" content="https://cassiecayphotography.com/images/hero-image.jpg">
<meta name="twitter:image:alt" content="Portfolio showcase of professional photography by Cassie Cay featuring family and newborn portraits">
```

**Note:** Twitter falls back to `og:title`, `og:description`, `og:image` if Twitter-specific tags are missing. The above tags are optional but give you more control (e.g., different image for Twitter than Facebook).

**Validation:** Use [Twitter Card Validator](https://cards-dev.twitter.com/validator) (may require Twitter/X login)

---

### Example 4: Claude Vision API for Alt Text Generation

```javascript
// scripts/generate-alt-text.js
import Anthropic from '@anthropic-ai/sdk';
import { glob } from 'glob';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import pLimit from 'p-limit'; // Already installed

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY // Load from .env
});

// Limit concurrent API calls to avoid rate limits
const limit = pLimit(3);

async function generateAltTextForImage(imgPath) {
  try {
    console.log(`Processing: ${imgPath}`);

    const imageBuffer = readFileSync(imgPath);
    const base64Image = imageBuffer.toString('base64');

    // Determine media type
    const ext = imgPath.split('.').pop().toLowerCase();
    const mediaType = ext === 'png' ? 'image/png' :
                      ext === 'webp' ? 'image/webp' : 'image/jpeg';

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Image
            }
          },
          {
            type: 'text',
            text: `Generate a concise, descriptive alt text for this professional photography portfolio image. Focus on:
- Subject (who/what)
- Composition and framing
- Lighting and mood
- Emotional tone

Keep it under 125 characters for accessibility. Be specific and vivid.`
          }
        ]
      }]
    });

    return message.content[0].text.trim();
  } catch (error) {
    console.error(`Error processing ${imgPath}:`, error.message);
    return `Photography by Cassie Cay - ${imgPath.split('/').pop().replace(/\.[^.]+$/, '')}`;
  }
}

async function generateAltText() {
  console.log('Starting alt text generation with Claude Vision API...');

  // Find all portfolio images
  const images = await glob('images-optimized/**/*.{jpg,jpeg,png,webp}');
  console.log(`Found ${images.length} images`);

  // Check if alt-text.json already exists
  let altTextMap = {};
  try {
    altTextMap = JSON.parse(readFileSync('alt-text.json', 'utf-8'));
    console.log(`Loaded ${Object.keys(altTextMap).length} existing alt texts`);
  } catch (e) {
    console.log('No existing alt-text.json found, starting fresh');
  }

  // Process images in parallel (limited concurrency)
  const tasks = images.map(imgPath =>
    limit(async () => {
      // Skip if already processed
      if (altTextMap[imgPath]) {
        console.log(`Skipping (already processed): ${imgPath}`);
        return;
      }

      const altText = await generateAltTextForImage(imgPath);
      altTextMap[imgPath] = altText;
      console.log(`✓ ${imgPath}: "${altText}"`);
    })
  );

  await Promise.all(tasks);

  // Save results
  writeFileSync(
    resolve('alt-text.json'),
    JSON.stringify(altTextMap, null, 2)
  );

  console.log(`\n✓ Alt text generation complete: ${Object.keys(altTextMap).length} images`);
  console.log('Results saved to alt-text.json');
}

generateAltText().catch(console.error);
```

**Add to package.json:**
```json
{
  "scripts": {
    "generate:alt-text": "node scripts/generate-alt-text.js"
  }
}
```

**Usage:**
```bash
# Set API key (or add to .env)
export ANTHROPIC_API_KEY=your_key_here

# Generate alt text (run once, or when adding new images)
npm run generate:alt-text
```

**Cost estimate for 84 images:**
- Input: 84 images × ~1000 tokens = ~84,000 tokens = $0.25
- Output: 84 descriptions × ~30 tokens = ~2,520 tokens = $0.04
- **Total: ~$0.29** (one-time cost)

---

## Roadmap Integration Recommendations

Based on stack research, suggested phase structure for SEO milestone:

### Phase 1: Structured Data (JSON-LD)
- **Effort:** 1-2 hours
- **Dependencies:** None
- **Approach:** Manual JSON-LD in HTML
- **Rationale:** Zero dependencies, easy to validate with Google Rich Results Test. Foundation for all other SEO work.

### Phase 2: Twitter Cards
- **Effort:** 30 minutes
- **Dependencies:** None
- **Approach:** Add 5-6 meta tags to HTML
- **Rationale:** Simple extension of existing OG tags. No dependencies, immediate impact on social sharing.

### Phase 3: Image Sitemap
- **Effort:** 2-3 hours
- **Dependencies:** `sitemap` (1 new devDependency)
- **Approach:** Build-time script generates sitemap.xml with `<image:image>` tags
- **Rationale:** Requires one new dependency but no runtime overhead. Critical for image discoverability in Google Image Search.

### Phase 4: AI Alt Text Generation
- **Effort:** 3-4 hours (script development + API testing)
- **Dependencies:** `@anthropic-ai/sdk` (1 new devDependency)
- **Approach:** Build-time script calls Claude Vision API, generates alt-text.json
- **Rationale:** Most complex (API integration, rate limiting, error handling). One-time cost ~$0.29 for 84 images. Biggest accessibility and SEO impact but should be last due to complexity.

**Phase ordering rationale:**
- Phases 1-2: Zero dependencies, can be done in 2 hours total
- Phase 3: Adds one simple dependency, builds on existing glob/sharp infrastructure
- Phase 4: Most complex, requires API key setup, error handling, rate limiting. Do last.

**No research flags needed:** All technologies are well-documented and proven.

---

## Sources

### Official Documentation (HIGH Confidence)
- [Google Structured Data Documentation](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Google Image Sitemaps Specification](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps)
- [Google Image Sitemap XSD Schema](https://www.google.com/schemas/sitemap-image/1.1/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started)
- [Twitter Card Markup Reference](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup)
- [Anthropic Claude Vision API Documentation](https://platform.claude.com/docs/en/build-with-claude/vision)
- [Sharp Image Processing Documentation](https://sharp.pixelplumbing.com/)
- [Vite Plugin API](https://vite.dev/guide/api-plugin)

### npm Packages (HIGH Confidence)
- [sitemap on npm](https://www.npmjs.com/package/sitemap) - v9.0.0
- [sitemap.js GitHub](https://github.com/ekalinin/sitemap.js/) - Official repo
- [schema-dts on npm](https://www.npmjs.com/package/schema-dts) - v1.1.5
- [schema-dts GitHub](https://github.com/google/schema-dts) - Google open source
- [sharp on npm](https://www.npmjs.com/package/sharp) - v0.34.5
- [glob on npm](https://www.npmjs.com/package/glob) - v13.0.0

### Community Resources (MEDIUM Confidence)
- [Best Image Sitemap Structure for Google Lens 2026](https://www.clickrank.ai/image-sitemap-structure-google-lens/)
- [Ultimate Guide to Social Meta Tags](https://www.everywheremarketer.com/blog/ultimate-guide-to-social-meta-tags-open-graph-and-twitter-cards)
- [DigitalOcean: Twitter Card and Open Graph Tutorial](https://www.digitalocean.com/community/tutorials/how-to-add-twitter-card-and-open-graph-social-metadata-to-your-webpage-with-html)
- [Anthropic API Pricing 2026](https://www.metacto.com/blogs/anthropic-api-pricing-a-full-breakdown-of-costs-and-integration)

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Sitemap package choice | HIGH | Industry standard, 37k+ dependents, official Google support, recent v9 update |
| Manual JSON-LD approach | HIGH | Google's official recommendation, no library needed for 3 schema types |
| Twitter Cards (manual) | HIGH | Official docs clear, 5-6 static meta tags, no library needed |
| Claude Vision for alt text | HIGH | Official API, proven for image description tasks, $0.29 for 84 images |
| Build integration | HIGH | Existing Vite + Sharp pipeline, scripts run via npm scripts |
| Cost estimate | MEDIUM | Based on 84 images × 1000 tokens input + 30 tokens output, actual may vary |

---

## Open Questions (None)

All technologies are well-documented, proven, and straightforward to implement. No additional research needed for roadmap phases.
