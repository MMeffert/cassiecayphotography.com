# Project Research Summary

**Project:** Cassie Cay Photography - Static Site Modernization
**Domain:** Photography portfolio website (existing jQuery/Bootstrap site)
**Researched:** 2026-01-19
**Confidence:** HIGH

## Executive Summary

This is a **modernization project for an existing jQuery/Bootstrap/Revolution Slider static site**, not a greenfield build. The site owner edits HTML directly in Dreamweaver and expects to continue doing so. The primary goals are asset optimization (81MB of images), CI/CD validation, and improved caching — without breaking the existing workflow or functionality.

The recommended approach is a **conservative, additive modernization**: keep jQuery and Revolution Slider intact, add Vite for asset optimization only (not HTML transformation), implement image compression with AVIF/WebP fallbacks, and enhance the GitHub Actions pipeline with validation and notifications. The build system must work WITH the existing code, preserving the owner's ability to edit and preview locally.

The key risks are (1) breaking Revolution Slider by disrupting jQuery load order or bundling its scripts, (2) destroying the Dreamweaver edit workflow by introducing source/output file confusion, and (3) degrading image quality through over-aggressive compression on a photography portfolio. All three are mitigated by treating Revolution Slider as a "do not touch" zone, keeping HTML files editable in-place, and using conservative quality settings with A/B testing before deployment.

## Key Findings

### Recommended Stack

From [STACK.md](./STACK.md): The build tool recommendation is **Vite 7.x** for its speed, zero-config defaults, and native ES module support. Sharp handles image optimization (4-5x faster than alternatives), and PostCSS with autoprefixer/cssnano processes CSS. The critical constraint is that jQuery must remain globally available as an external script — do not bundle it.

**Core technologies:**
- **Vite 7.3.1**: Build tool — Fastest modern bundler, multi-page HTML support, Rollup production builds
- **Sharp 0.34.5**: Image optimization — AVIF/WebP generation, 70%+ size reduction potential
- **PostCSS + cssnano**: CSS processing — Minification and autoprefixing without framework change
- **jQuery (external)**: Keep as-is — Revolution Slider dependency, mark as external in Vite config

**NOT recommended:** Tailwind CSS (would require HTML rewrite), Webpack (slower, legacy), Sass (no preprocessor source exists).

### Expected Features

From [FEATURES.md](./FEATURES.md): Modern photography portfolios require lightweight, dependency-free components. The current stack (Revolution Slider, LightGallery, CubePortfolio) totals 150KB+ JavaScript. Modern replacements achieve the same functionality in ~20KB.

**Must have (table stakes):**
- Native `loading="lazy"` for all below-fold images — 0KB, 95%+ browser support
- Responsive images with `srcset`/`sizes` — 0KB, per-device optimization
- AVIF/WebP images with JPEG fallback — 60-75% bandwidth reduction
- GLightbox for image viewing — 11KB, replaces 25KB LightGallery

**Should have (competitive):**
- Embla Carousel for hero — 6KB, replaces 150KB+ Revolution Slider
- CSS Grid filtering — ~3KB custom code, replaces 50KB+ CubePortfolio
- View Transitions API — native, modern navigation feel

**Defer (v2+):**
- Dark mode toggle — low impact, easy addition later
- Blurhash placeholders — medium effort, marginal UX improvement
- Infinite scroll — pagination simpler and sufficient

### Architecture Approach

From [ARCHITECTURE.md](./ARCHITECTURE.md): A three-stage CI/CD pipeline (Validate -> Deploy -> Notify) with validation completing in under 2 minutes to avoid blocking frequent image updates. Email notifications provide clear success/failure feedback to the non-technical site owner.

**Major components:**
1. **Validation Stage** — HTML validation (proof-html), link checking, image reference verification
2. **Deploy Stage** — S3 sync with cache headers, selective CloudFront invalidation
3. **Notify Stage** — Email notifications for success/failure, Lighthouse (informational)
4. **Pre-commit Hooks** — Husky with image validation to catch errors before CI

### Critical Pitfalls

From [PITFALLS.md](./PITFALLS.md):

1. **Breaking Revolution Slider** — Do NOT bundle Revolution Slider scripts. Keep jQuery as external global. Maintain exact script load order. Treat `/style/revolution/` as "do not touch" initially.

2. **Destroying Dreamweaver Workflow** — Build step must enhance, not replace HTML. Keep HTML editable in-place. Preserve relative paths for local preview. Document workflow clearly.

3. **Image Quality Destruction** — Use conservative settings (JPEG 85+, AVIF 60+). Optimize from original masters, not deployed images. A/B test before full rollout. Keep originals in backup.

4. **CloudFront Cache Issues** — Current 1-year cache on assets requires content hashing. Use selective invalidation for cost efficiency. Add invalidation completion verification.

5. **jQuery Breaking Changes** — Do NOT upgrade jQuery version. Do NOT remove jQuery. Test all 15+ jQuery plugins after any JS change.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation (Build Setup)
**Rationale:** Must establish build tooling before any optimization work. Vite configuration with Revolution Slider exclusions prevents the most critical pitfall.
**Delivers:** package.json, vite.config.js, PostCSS config, build/dev scripts
**Addresses:** Build tool setup (STACK.md), infrastructure foundation
**Avoids:** Revolution Slider breakage (Pitfall #1) by establishing exclusion patterns first

### Phase 2: Image Optimization
**Rationale:** Images are 81MB — the largest optimization opportunity. Requires careful quality testing.
**Delivers:** AVIF/WebP variants for all 218 images, `<picture>` element implementation, responsive srcset
**Uses:** Sharp for image processing, vite-plugin-image-optimizer
**Avoids:** Quality destruction (Pitfall #3) through A/B testing batch before full conversion

### Phase 3: Library Replacement (Optional)
**Rationale:** Replace heavy jQuery plugins with modern alternatives. This is optional — current site works, this is optimization.
**Delivers:** Embla Carousel (6KB) replaces Revolution Slider (150KB+), GLightbox (11KB) replaces LightGallery (25KB)
**Risk:** HIGH — significant testing required, potential to break existing functionality
**Avoids:** jQuery migration issues (Pitfall #5) by testing all interactive features

### Phase 4: CI/CD Enhancement
**Rationale:** Validation catches errors before deployment; notifications keep owner informed.
**Delivers:** HTML/link validation, image reference checking, email notifications, Lighthouse reporting
**Uses:** proof-html, action-send-mail, lighthouse-ci-action
**Avoids:** Deployment failures (Pitfall #8) through verification steps

### Phase 5: Pre-commit Hooks
**Rationale:** Catches errors before they reach CI, faster feedback for owner.
**Delivers:** Husky with image validation hook
**Avoids:** Missing image errors caught locally instead of in CI

### Phase Ordering Rationale

- **Foundation first** (Phase 1): All other phases depend on having a build system that respects Revolution Slider boundaries
- **Images before libraries** (Phase 2 before 3): Image optimization has highest ROI (60-75% savings) with lower risk than library replacement
- **Library replacement optional** (Phase 3): Current site works; this phase is pure optimization and carries the highest risk
- **CI/CD after optimization** (Phase 4): Validation rules should reflect the optimized asset structure
- **Pre-commit last** (Phase 5): Depends on understanding what validations are most valuable from CI experience

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Image Optimization):** Quality settings vary by image type (portraits vs landscapes). May need per-image quality tuning.
- **Phase 3 (Library Replacement):** Revolution Slider replacement requires understanding all current slider features (transitions, layers, etc.)

Phases with standard patterns (skip research-phase):
- **Phase 1 (Build Setup):** Vite configuration is well-documented; STACK.md provides complete config
- **Phase 4 (CI/CD Enhancement):** ARCHITECTURE.md includes complete workflow examples
- **Phase 5 (Pre-commit Hooks):** Husky setup is straightforward

## Key Decisions

| Decision | Choice | Rationale | Source |
|----------|--------|-----------|--------|
| Build tool | Vite 7.x | Fastest, zero-config, ES module support | STACK.md |
| Image optimizer | Sharp 0.34.5 | 4-5x faster than alternatives, AVIF support | STACK.md |
| Slider replacement | Embla Carousel (6KB) | Smallest footprint, dependency-free | FEATURES.md |
| Lightbox replacement | GLightbox (11KB) | Pure JS, accessible, video support | FEATURES.md |
| Grid filtering | CSS Grid + vanilla JS | No library needed for 5 categories | FEATURES.md |
| Image format | AVIF primary, WebP, JPEG fallback | 60-75% savings with compatibility | FEATURES.md |
| Validation tool | proof-html v2 | Combined HTML + link checking | ARCHITECTURE.md |
| Notifications | Email (dawidd6/action-send-mail) | Simpler than Slack for non-technical user | ARCHITECTURE.md |
| jQuery handling | Keep external, do not bundle | Revolution Slider dependency | STACK.md, PITFALLS.md |

## Bundle Budget

| Category | Current (Est.) | Target | Savings |
|----------|----------------|--------|---------|
| JavaScript | ~150KB+ | ~20KB | 85%+ |
| CSS | ~100KB+ | ~30KB | 70%+ |
| Images | 81MB | ~25MB | 70%+ |
| Total page weight | ~90MB | ~27MB | 70%+ |

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Vite, Sharp, PostCSS all verified via official docs |
| Features | HIGH | Library comparisons verified via Bundlephobia, GitHub repos |
| Architecture | HIGH | All GitHub Actions verified from official repositories |
| Pitfalls | HIGH | Based on documented issues and current site analysis |

**Overall confidence:** HIGH

### Gaps to Address

- **Revolution Slider feature parity:** If replacing slider (Phase 3), need inventory of current slider features (transitions, layers, timing)
- **Owner workflow testing:** Before finalizing any workflow changes, have owner make a test edit to validate Dreamweaver compatibility
- **Image quality thresholds:** May need per-image tuning for portraits vs landscapes vs detail shots
- **Email delivery:** Gmail App Password or AWS SES setup required for notifications

## Sources

### Primary (HIGH confidence)
- [Vite Official Documentation](https://vite.dev/guide/) — version 7.3.1, Node 20.19+
- [Sharp Documentation](https://sharp.pixelplumbing.com/) — version 0.34.5
- [proof-html GitHub](https://github.com/anishathalye/proof-html) — v2.2.3
- [GLightbox GitHub](https://github.com/biati-digital/glightbox) — pure JS lightbox
- [Embla Carousel](https://www.embla-carousel.com) — dependency-free carousel
- [GitHub Actions official docs](https://docs.github.com/en/actions)

### Secondary (MEDIUM confidence)
- [vite-plugin-image-optimizer](https://github.com/FatehAK/vite-plugin-image-optimizer) — Vite+Sharp integration
- [Vite jQuery Discussion](https://github.com/vitejs/vite/discussions/3744) — external jQuery patterns
- [Bundlephobia](https://bundlephobia.com) — package size analysis
- [Can I Use - AVIF/WebP](https://caniuse.com/avif) — browser support data

### Tertiary (LOW confidence)
- Revolution Slider internal behavior — limited official documentation, based on community patterns

---
*Research completed: 2026-01-19*
*Ready for roadmap: yes*
