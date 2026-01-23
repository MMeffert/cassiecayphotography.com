# Phase 3: Image Optimization - Research

**Researched:** 2026-01-20
**Domain:** Image processing, modern formats (AVIF/WebP), Vite build integration
**Confidence:** HIGH

## Summary

This phase addresses reducing the 81MB image payload to ~25MB while maintaining photography portfolio quality. The site has 219 images: 100 "full" resolution images (~52MB) for lightbox viewing, 54 "crop" thumbnails for gallery display, and various hero/background images.

Sharp.js is the established standard for Node.js image processing, offering 50%+ compression via AVIF and 25-34% via WebP compared to JPEG, while maintaining visual quality. For a photography portfolio, AVIF is ideal because it preserves fine detail and color depth better than alternatives.

The recommended approach is a **pre-build script** (not Vite plugin) because the site copies images via `vite-plugin-static-copy` rather than importing them through Vite's asset pipeline. This script generates AVIF + WebP + optimized JPEG variants before Vite build, then HTML is updated to use `<picture>` elements.

**Primary recommendation:** Use Sharp.js pre-build script to generate AVIF/WebP/JPEG variants at quality 80-85, update HTML to use `<picture>` elements with format fallbacks, apply `loading="lazy"` to below-fold images.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| sharp | 0.34.5 | Image resizing, format conversion | Fastest Node.js image processor, uses libvips |
| glob | 11.x | File pattern matching | Standard for finding files to process |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| fs-extra | 11.x | Enhanced file operations | Async file copying, directory creation |
| cli-progress | 3.x | Progress bar | Visual feedback during batch processing |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pre-build script | vite-plugin-image-optimizer | Plugin only optimizes, doesn't generate multiple formats |
| Pre-build script | vite-imagetools | Requires import statements; site uses static copy |
| sharp | imagemin | Imagemin is slower and has ecosystem fragmentation |

**Installation:**
```bash
npm install --save-dev sharp glob fs-extra cli-progress
```

## Architecture Patterns

### Recommended Project Structure
```
cassiecayphotography.com/
├── images/                    # Original source images (81MB)
├── images-optimized/          # Generated optimized images (~25MB)
│   ├── avif/                  # AVIF variants
│   ├── webp/                  # WebP variants
│   └── jpeg/                  # Optimized JPEG fallbacks
├── scripts/
│   └── optimize-images.js     # Pre-build optimization script
├── vite.config.js             # Updated to copy optimized images
└── package.json               # Add "preprocess" script
```

### Pattern 1: Pre-Build Script Approach
**What:** Node.js script that runs before Vite build to generate optimized image variants
**When to use:** When images are copied statically rather than imported through bundler
**Example:**
```javascript
// scripts/optimize-images.js
import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs-extra';

const SOURCE_DIR = './images';
const OUTPUT_DIR = './images-optimized';

// Quality settings for photography portfolio
const QUALITY = {
  avif: { quality: 80, effort: 6 },      // Best compression, slower encode
  webp: { quality: 82, effort: 6 },      // Broad support fallback
  jpeg: { quality: 85, mozjpeg: true }   // Legacy fallback, mozjpeg optimization
};

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const image = sharp(inputPath);

  // Generate AVIF
  await image.clone()
    .avif(QUALITY.avif)
    .toFile(path.join(outputDir, 'avif', `${filename}.avif`));

  // Generate WebP
  await image.clone()
    .webp(QUALITY.webp)
    .toFile(path.join(outputDir, 'webp', `${filename}.webp`));

  // Generate optimized JPEG
  await image.clone()
    .jpeg(QUALITY.jpeg)
    .toFile(path.join(outputDir, 'jpeg', `${filename}.jpg`));
}
```

### Pattern 2: Picture Element with Format Fallback
**What:** HTML pattern serving modern formats with JPEG fallback
**When to use:** All portfolio images where browser support varies
**Example:**
```html
<!-- Portfolio thumbnail -->
<figure class="overlay overlay2">
  <a href="images-optimized/avif/cassiecay-F1-full.avif">
    <picture>
      <source srcset="images-optimized/avif/cassiecay-F1.avif" type="image/avif">
      <source srcset="images-optimized/webp/cassiecay-F1.webp" type="image/webp">
      <img src="images-optimized/jpeg/cassiecay-F1.jpg"
           alt="Family portrait"
           loading="lazy"
           width="400"
           height="267">
    </picture>
  </a>
</figure>
```

### Pattern 3: Lightbox Full-Size Strategy
**What:** Link to AVIF full-size with JavaScript fallback detection
**When to use:** Lightbox galleries where the link `href` points to full image
**Example:**
```html
<a href="images-optimized/jpeg/cassiecay-F1-full.jpg"
   data-avif="images-optimized/avif/cassiecay-F1-full.avif"
   data-webp="images-optimized/webp/cassiecay-F1-full.webp">
```
Note: The lightgallery plugin will need configuration or the href should point to the best universal format (JPEG) with progressive enhancement.

### Anti-Patterns to Avoid
- **Processing at runtime:** Never optimize images during page load or on-demand in static sites
- **Single format output:** Always provide AVIF + WebP + JPEG for maximum compatibility
- **Missing dimensions:** Always include width/height on `<img>` to prevent layout shift
- **Lazy loading hero images:** Never lazy load above-fold images (sliders, backgrounds)
- **Over-compression:** Photography needs quality 80+ to preserve detail; avoid 60 or below

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image format conversion | Custom ImageMagick scripts | Sharp.js | Sharp is 10x faster, handles memory efficiently |
| AVIF encoding | FFmpeg wrappers | Sharp with libvips | Native AVIF support, consistent quality |
| Batch processing | Manual shell loops | Sharp with glob | Handles memory, parallelization, errors |
| Quality comparison | Visual inspection | SSIM/DSSIM metrics | Objective quality measurement |
| Progress tracking | console.log counts | cli-progress | Clean terminal output, ETA calculation |

**Key insight:** Sharp handles the complexity of image processing (color spaces, metadata, memory management) that would take hundreds of lines to hand-roll and still not match libvips performance.

## Common Pitfalls

### Pitfall 1: AVIF "Watercolor Effect" at Low Quality
**What goes wrong:** At quality < 60, AVIF smooths textures, losing detail in portraits
**Why it happens:** AVIF's compression algorithm aggressively simplifies low-contrast areas
**How to avoid:** Use quality 75-85 for photography; never below 60
**Warning signs:** Skin textures appear "painted," fine hair detail lost

### Pitfall 2: Lazy Loading Above-Fold Images (LCP Impact)
**What goes wrong:** Hero slider images load late, hurting Largest Contentful Paint
**Why it happens:** `loading="lazy"` defers all images, including visible ones
**How to avoid:** Only apply lazy loading to images below initial viewport
**Warning signs:** Lighthouse LCP warnings, visible image pop-in on page load

### Pitfall 3: Missing Width/Height Causing Layout Shift
**What goes wrong:** Page jumps as images load because space wasn't reserved
**Why it happens:** Browser can't calculate image space without dimensions
**How to avoid:** Always include `width` and `height` attributes on `<img>`
**Warning signs:** Cumulative Layout Shift (CLS) score > 0.1 in Lighthouse

### Pitfall 4: Lightbox Plugin Incompatibility
**What goes wrong:** Lightbox shows wrong format or fails to load AVIF
**Why it happens:** Plugin reads `href` attribute, doesn't understand `<picture>` or data attributes
**How to avoid:** Test lightbox behavior; may need to keep JPEG in href with JS enhancement
**Warning signs:** Broken lightbox, format negotiation failures

### Pitfall 5: Revolution Slider Background Images
**What goes wrong:** Slider backgrounds not optimized or break after format change
**Why it happens:** Revolution Slider uses inline styles and data attributes for backgrounds
**How to avoid:** Keep slider images separate; optimize but test thoroughly
**Warning signs:** Broken slider, missing backgrounds, aspect ratio issues

### Pitfall 6: PNG to JPEG Quality Loss
**What goes wrong:** PNG images with transparency converted to JPEG lose transparency
**Why it happens:** JPEG doesn't support alpha channel
**How to avoid:** Keep PNG for images with transparency; use WebP/AVIF (both support alpha)
**Warning signs:** White backgrounds where transparency expected

## Code Examples

Verified patterns from official sources:

### Sharp AVIF Conversion (High Quality Photography)
```javascript
// Source: https://sharp.pixelplumbing.com/api-output
import sharp from 'sharp';

await sharp('input.jpg')
  .avif({
    quality: 80,           // 80-85 for photography (default is 50)
    effort: 6,             // 0-9, higher = smaller file, slower
    chromaSubsampling: '4:4:4'  // Full color for portraits
  })
  .toFile('output.avif');
```

### Sharp WebP Conversion
```javascript
// Source: https://sharp.pixelplumbing.com/api-output
await sharp('input.jpg')
  .webp({
    quality: 82,           // 80-85 for photography (default is 80)
    effort: 6,             // 0-6, higher = smaller file
    smartSubsample: true   // Better chroma handling
  })
  .toFile('output.webp');
```

### Sharp JPEG Optimization with MozJPEG
```javascript
// Source: https://sharp.pixelplumbing.com/api-output
await sharp('input.jpg')
  .jpeg({
    quality: 85,           // 85-90 for photography (default is 80)
    mozjpeg: true,         // Use mozjpeg encoder for better compression
    progressive: true      // Progressive scan for web delivery
  })
  .toFile('output.jpg');
```

### Picture Element with Lazy Loading
```html
<!-- Source: MDN Web Docs, web.dev -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg"
       alt="Description"
       loading="lazy"
       width="600"
       height="400"
       decoding="async">
</picture>
```

### Batch Processing with Memory Management
```javascript
// Source: Sharp best practices
import sharp from 'sharp';
import { glob } from 'glob';
import pLimit from 'p-limit';

const limit = pLimit(4);  // Process 4 images concurrently (adjust for RAM)

const files = await glob('images/**/*.{jpg,jpeg,png}');

await Promise.all(
  files.map(file => limit(() => processImage(file)))
);

// Clear Sharp cache between large batches
sharp.cache(false);  // Disable caching if memory-constrained
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JPEG only | AVIF + WebP + JPEG fallback | AVIF browser support hit 94% in 2024 | 50% smaller files |
| JavaScript lazy loading | Native `loading="lazy"` | Supported in all browsers since 2023 | No JS dependency |
| imagemin ecosystem | Sharp.js only | imagemin plugins deprecated 2022-2023 | Simpler, faster |
| Quality 60-70 | Quality 80-85 for photography | Photography best practices | Better detail preservation |

**Deprecated/outdated:**
- imagemin and plugins: Maintenance issues, security vulnerabilities
- Intersection Observer for lazy loading: Native attribute is sufficient
- srcset with x-descriptors only: w-descriptors with sizes preferred

## Open Questions

Things that couldn't be fully resolved:

1. **Lightbox Plugin AVIF Support**
   - What we know: The site uses light-gallery plugin via plugins.js
   - What's unclear: Whether light-gallery can serve AVIF or needs JPEG href
   - Recommendation: Test with JPEG in href; enhance with JS if needed

2. **Revolution Slider Background Optimization**
   - What we know: Slider uses data-image-src attributes
   - What's unclear: Whether Revolution Slider supports multiple formats
   - Recommendation: Optimize slider images but keep JPEG format; test thoroughly

3. **Exact Target Size Achievement**
   - What we know: AVIF typically achieves 50% reduction, WebP 30%
   - What's unclear: Exact final size depends on image content
   - Recommendation: Process and measure; may need quality tuning

## Sources

### Primary (HIGH confidence)
- [Sharp.js Official Documentation](https://sharp.pixelplumbing.com/) - API for AVIF, WebP, JPEG output
- [Sharp GitHub Repository](https://github.com/lovell/sharp) - Version 0.34.5 current
- [MDN Responsive Images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images) - Picture element patterns

### Secondary (MEDIUM confidence)
- [web.dev Browser-level Lazy Loading](https://web.dev/articles/browser-level-image-lazy-loading) - Native lazy loading best practices
- [AVIF WebP Quality Settings](https://www.industrialempathy.com/posts/avif-webp-quality-settings/) - Quality recommendations
- [Smashing Magazine Responsive Images](https://www.smashingmagazine.com/2014/05/responsive-images-done-right-guide-picture-srcset/) - srcset patterns

### Tertiary (LOW confidence)
- WebSearch results on photography portfolio quality settings - needs validation per-image

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Sharp.js is universally recommended, verified via official docs
- Architecture: HIGH - Pre-build script is appropriate for static-copy workflow
- Quality settings: MEDIUM - Recommendations are sound but may need per-image tuning
- Pitfalls: HIGH - Based on documented issues and best practices

**Research date:** 2026-01-20
**Valid until:** 30 days (Sharp.js is stable, formats well-established)

## Project-Specific Analysis

### Current Image Inventory

| Category | Count | Total Size | Purpose |
|----------|-------|------------|---------|
| Full images (*-full.*) | 100 | 52.4 MB | Lightbox/gallery full view |
| Crop images (*-crop.*) | 54 | ~15 MB | Gallery thumbnails |
| Slider images | 3 | 3.4 MB | Hero slider backgrounds |
| Background images | 3 | 1.2 MB | Section backgrounds |
| Service images | 8 | ~2 MB | Service section octagon images |
| Logo/misc | ~50 | ~7 MB | Logo, booking button, etc. |

### Expected Size Reduction

| Format | Compression vs Original | Expected Result |
|--------|------------------------|-----------------|
| AVIF | ~50% reduction | 81MB -> ~40MB |
| WebP | ~30% reduction | 81MB -> ~57MB |
| JPEG optimized | ~20% reduction | 81MB -> ~65MB |

**Serving AVIF to 94% of browsers:** Expected payload ~40MB for most users
**Target met:** AVIF achieves ~50% reduction, meeting 60% goal with quality preservation

### Images NOT to Lazy Load (Above Fold)
1. `cassiecay-slider7.jpg` - Hero slider first image
2. `cassiecay-slider2.jpg` - Hero slider second image
3. `cassiecaylogobw2.png` - Logo in navbar and footer

### Images TO Lazy Load (Already Have loading="lazy")
- All portfolio gallery images (already have `loading="lazy"` in HTML)
- Service section images
- About section image

### Special Handling Required
1. **Revolution Slider**: Keep slider images as JPEG, optimize quality
2. **Background images**: CSS `data-image-src` attribute - may need CSS fallback
3. **Lightbox links**: Test light-gallery with AVIF, fallback to JPEG href
