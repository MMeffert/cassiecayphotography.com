# Technology Stack

**Project:** Cassie Cay Photography - Static Site Modernization
**Researched:** 2026-01-19
**Mode:** Ecosystem Research - Stack Dimension

## Executive Summary

This stack recommendation focuses on **adding a build step to an existing jQuery/Bootstrap static site** without requiring a rewrite. The goal is asset optimization, not framework migration. The recommended stack is Vite 7.x with Sharp for image optimization, PostCSS for CSS processing, and content hashing for cache busting.

**Key constraint:** Revolution Slider (11MB) and jQuery dependencies must be preserved. The build system must work WITH the existing code, not replace it.

## Recommended Stack

### Build Tool

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Vite** | ^7.3.1 | Build tool and dev server | Fastest modern bundler with excellent static site support, native ES module serving, multi-page HTML entry point support, and Rollup-based production builds. Zero-config for basic use cases. |

**Confidence:** HIGH - Verified via [official Vite documentation](https://vite.dev/guide/)

**Why Vite over alternatives:**
- **Not Parcel:** While Parcel is truly zero-config, Vite has better plugin ecosystem and more predictable behavior for complex legacy integrations.
- **Not Webpack:** Webpack is the legacy option. Vite is 10-100x faster in development and provides simpler configuration.
- **Not esbuild alone:** esbuild lacks HMR, dev server, and plugin ecosystem. Vite uses esbuild under the hood for speed but adds the features needed.

**Node.js requirement:** Node.js 20.19+ or 22.12+ (per [Vite docs](https://vite.dev/guide/))

### Image Optimization

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Sharp** | ^0.34.5 | Image compression and format conversion | Fastest Node.js image processor (4-5x faster than ImageMagick), supports AVIF/WebP output, libvips-based. |
| **vite-plugin-image-optimizer** | ^1.1.8 | Vite integration for Sharp | Combines Sharp.js and SVGO in one plugin, based on proven webpack patterns. Active maintenance. |

**Confidence:** HIGH - Verified via [Sharp documentation](https://sharp.pixelplumbing.com/) and [vite-plugin-image-optimizer GitHub](https://github.com/FatehAK/vite-plugin-image-optimizer)

**Current site context:** 81MB in `/images/` directory. Photography site with high-resolution JPG/PNG files. AVIF conversion could reduce this by 70%+ while maintaining quality.

**Why Sharp over alternatives:**
- **Not Squoosh:** Squoosh is DEPRECATED and has Node.js 18+ compatibility issues. Do not use.
- **Not imagemin:** imagemin ecosystem is largely unmaintained. Sharp is actively developed.
- **Not browser-based:** Build-time optimization is essential for a photography portfolio with many large images.

### CSS Processing

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **PostCSS** | ^8.5.x | CSS processing pipeline | Industry standard, Vite has built-in support. |
| **Autoprefixer** | ^10.4.x | Vendor prefix injection | Automatic browser compatibility based on browserslist. |
| **cssnano** | ^7.0.x | CSS minification | Modular minifier, works with PostCSS ecosystem. |

**Confidence:** HIGH - Verified via [PostCSS plugins](https://postcss.org/docs/postcss-plugins) and [cssnano docs](https://cssnano.github.io/cssnano/docs/config-file/)

**NOT recommended: Tailwind CSS**
- Site uses Bootstrap 4 with custom theme CSS (style/style.css is part of "Brailie" theme)
- Adding Tailwind would require HTML rewrite - contradicts project goals
- PostCSS + autoprefixer + cssnano provides all needed optimization without framework change

**NOT recommended: Sass/Less**
- Existing CSS is plain CSS (no preprocessor source files found)
- Adding a preprocessor adds complexity without clear benefit
- PostCSS provides modern CSS features (nesting, custom properties) if needed later

### JavaScript Bundling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Vite (Rollup)** | Built-in | JS bundling | Vite uses Rollup for production builds, handles code splitting. |
| **@rollup/plugin-inject** | ^5.0.x | jQuery global injection | Makes jQuery available globally without modifying legacy code. |

**Confidence:** MEDIUM - Multiple approaches exist, verified via [Vite discussions](https://github.com/vitejs/vite/discussions/3744)

**jQuery Strategy:** Keep jQuery loaded via CDN or local file BEFORE Vite bundles. Mark as external:

```javascript
// vite.config.js approach
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['jquery'],
      output: {
        globals: {
          jquery: 'jQuery'
        }
      }
    }
  }
})
```

**Why this approach:**
- Revolution Slider requires jQuery globally (window.jQuery)
- plugins.js (44K+ lines) expects $ to be available
- Bundling jQuery INTO the build breaks plugin initialization order

### Asset Hashing / Cache Busting

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Vite (built-in)** | - | Content-based hashes | Automatic via Rollup output, configurable naming patterns. |

**Confidence:** HIGH - This is default Vite behavior

Vite automatically adds content-based hashes to asset filenames (e.g., `style-[hash].css`). This ensures browsers fetch new assets when content changes while caching unchanged files indefinitely.

**Configuration example:**
```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Keep Revolution Slider assets unhashed to preserve their internal references
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.includes('revolution')) {
            return 'assets/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
```

### Legacy Browser Support (Optional)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **@vitejs/plugin-legacy** | ^7.2.x | IE11/old browser support | Generates SystemJS legacy bundles with polyfills. |

**Confidence:** HIGH - Verified via [plugin-legacy npm](https://www.npmjs.com/package/@vitejs/plugin-legacy)

**Recommendation:** Skip unless analytics show significant old browser traffic. Modern browsers (Chrome, Firefox, Safari, Edge) all support ES modules. Legacy plugin adds ~30% to build time and bundle size.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| Build Tool | Vite | Parcel | Less plugin ecosystem, less predictable for complex legacy integrations |
| Build Tool | Vite | Webpack | Slower, more complex configuration, legacy tool |
| Build Tool | Vite | esbuild | No dev server, no HMR, limited plugin support |
| Image Opt | Sharp | Squoosh | DEPRECATED, Node 18+ compatibility issues |
| Image Opt | Sharp | imagemin | Unmaintained ecosystem |
| CSS | PostCSS | Tailwind | Would require HTML rewrite, contradicts project goals |
| CSS | PostCSS | Sass | No preprocessor source exists, unnecessary complexity |

## Installation

### Core Dependencies

```bash
# Navigate to project root
cd /Users/mitchellmeffert/Git/Personal/cassiecayphotography.com

# Initialize package.json if not exists
npm init -y

# Core build tool
npm install -D vite

# Image optimization
npm install -D vite-plugin-image-optimizer sharp svgo

# CSS processing
npm install -D postcss autoprefixer cssnano

# jQuery handling (if bundling custom JS)
npm install -D @rollup/plugin-inject
```

### Configuration Files

**vite.config.js** (to be created):
```javascript
import { defineConfig } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      external: ['jquery'],
      output: {
        globals: {
          jquery: 'jQuery'
        }
      }
    }
  },
  plugins: [
    ViteImageOptimizer({
      jpg: {
        quality: 80,
      },
      png: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
      avif: {
        quality: 65,
      },
    }),
  ],
})
```

**postcss.config.js** (to be created):
```javascript
export default {
  plugins: {
    autoprefixer: {},
    cssnano: {
      preset: 'default',
    },
  },
}
```

**.browserslistrc** (to be created):
```
> 0.5%
last 2 versions
Firefox ESR
not dead
not IE 11
```

### package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## File Structure Recommendation

```
cassiecayphotography.com/
├── index.html              # Entry point (modify to use Vite)
├── vite.config.js          # NEW: Vite configuration
├── postcss.config.js       # NEW: PostCSS configuration
├── .browserslistrc         # NEW: Browser targets
├── package.json            # NEW or modified
├── images/                 # Optimized during build
├── style/
│   ├── css/               # Processed with PostCSS
│   ├── js/                # Bundled with Rollup
│   └── revolution/        # Kept as-is (external)
└── dist/                  # NEW: Build output
```

## Implementation Notes

### Revolution Slider Handling

Revolution Slider (11MB in `/style/revolution/`) requires special handling:
1. **DO NOT bundle** - It has complex internal asset references
2. **Copy as-is** to dist during build
3. **Keep unhashed** - Internal references would break with hashes

Use Vite's `publicDir` or a copy plugin to preserve Revolution Slider structure.

### jQuery Load Order

Current HTML loads jQuery before plugins:
```html
<script src="style/js/jquery.min.js"></script>
<script src="style/js/popper.min.js"></script>
<script src="style/js/bootstrap.min.js"></script>
<!-- Revolution Slider scripts -->
<script src="style/js/plugins.js"></script>
<script src="style/js/scripts.js"></script>
```

This order MUST be preserved. Options:
1. Keep scripts in HTML (no bundling)
2. Bundle only custom JS, keep vendor scripts external
3. Use Vite's `optimizeDeps.exclude` for jQuery

### Image Optimization Strategy

Current: 81MB of images (JPG/PNG mix)
Target: Generate WebP/AVIF versions, keep original as fallback

Two approaches:
1. **Build-time conversion:** Generate optimized versions during build
2. **Separate optimization script:** Run sharp-cli independently, check in optimized images

Recommend approach #2 for a photography portfolio - more control over quality per image.

## Sources

### Authoritative (HIGH confidence)
- [Vite Official Documentation](https://vite.dev/guide/) - Version 7.3.1, Node 20.19+/22.12+ required
- [Sharp Documentation](https://sharp.pixelplumbing.com/) - Version 0.34.5, Node 18.17.0+ or 20.3.0+
- [cssnano Configuration](https://cssnano.github.io/cssnano/docs/config-file/)
- [Autoprefixer GitHub](https://github.com/postcss/autoprefixer)
- [@vitejs/plugin-legacy npm](https://www.npmjs.com/package/@vitejs/plugin-legacy)

### Community (MEDIUM confidence)
- [vite-plugin-image-optimizer GitHub](https://github.com/FatehAK/vite-plugin-image-optimizer)
- [Vite jQuery Discussion](https://github.com/vitejs/vite/discussions/3744)
- [Better Stack: Vite Comparisons](https://betterstack.com/community/guides/scaling-nodejs/esbuild-vs-vite/)

## Confidence Assessment

| Component | Confidence | Notes |
|-----------|------------|-------|
| Vite as build tool | HIGH | Official docs verified, widely adopted, version 7.3.1 current |
| Sharp for images | HIGH | Official docs verified, actively maintained, proven performance |
| PostCSS stack | HIGH | Industry standard, Vite built-in support |
| jQuery external strategy | MEDIUM | Multiple approaches exist, community-verified patterns |
| Revolution Slider handling | MEDIUM | No official guidance, based on similar plugin patterns |
| Asset hashing | HIGH | Default Vite behavior, well documented |

## Open Questions for Roadmap

1. **Revolution Slider replacement?** If willing to replace slider, could save 11MB. Modern alternatives: Swiper.js (already in plugins.js), Splide, Glide.
2. **Image format strategy:** Convert all to AVIF with JPG fallback, or WebP for broader support?
3. **Build output location:** Deploy from `dist/` or continue deploying from root?
4. **CDN strategy:** Move jQuery/Bootstrap to CDN, or keep local for reliability?
