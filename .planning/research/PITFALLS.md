# Domain Pitfalls: Static Site Modernization

**Domain:** Photography portfolio static site modernization
**Researched:** 2026-01-19
**Project Context:** jQuery/Bootstrap/Revolution Slider site, owner edits HTML in Dreamweaver

---

## Critical Pitfalls

Mistakes that cause rewrites, major breakage, or workflow disasters.

---

### Pitfall 1: Breaking Revolution Slider During Modernization

**What goes wrong:** Revolution Slider (version 5.4.8 detected in this site) has tight jQuery dependencies and specific initialization timing. Adding a build step or module bundler can break the slider entirely by:
- Loading jQuery after Revolution Slider scripts
- Tree-shaking away required jQuery methods
- Breaking the global `$` and `jQuery` references
- Changing script load order

**Why it happens:** Modern bundlers like Vite and Webpack optimize and tree-shake by default. Revolution Slider expects jQuery to be globally available before its scripts run. The slider also uses many undocumented internal APIs.

**Consequences:**
- Slider displays blank or throws console errors like "jQuery is not defined"
- Site hero section completely broken
- Major visual impact on homepage

**Warning signs:**
- Console errors mentioning `jQuery is not defined` or `revapi undefined`
- Slider not initializing on page load
- Blank space where slider should be

**Prevention:**
1. **Do NOT bundle Revolution Slider scripts** - Keep them as external `<script>` tags
2. **Ensure jQuery loads first and globally** - Use `window.jQuery = window.$ = jQuery` if using modules
3. **Test slider initialization after ANY build changes**
4. **Keep original script loading order exactly as-is**
5. Consider treating `/style/revolution/` as a "do not touch" zone initially

**Phase to address:** Phase 1 (Build Setup) - Must establish bundler exclusion patterns before any other changes

**Sources:**
- [Slider Revolution Changelog](https://www.sliderrevolution.com/documentation/changelog/)
- [Slider Revolution Troubleshooting](https://www.sliderrevolution.com/faq/how-to-troubleshoot-slider-revolution/)

---

### Pitfall 2: Destroying Dreamweaver Edit Workflow

**What goes wrong:** Adding a build step creates a disconnect between what the site owner edits and what gets deployed. If she edits `index.html` in Dreamweaver:
- Build step overwrites her changes
- Source files are in one place, output in another
- WYSIWYG preview in Dreamweaver no longer matches production
- She can't see her changes without running a build

**Why it happens:** Build tools assume developers who use CLI, version control, and understand source-vs-output distinction. Dreamweaver users expect "edit file, upload, done."

**Consequences:**
- Owner can no longer update her own site
- Every text change requires developer involvement
- Site becomes unmaintainable for non-technical user
- Relationship friction between owner and developer

**Warning signs:**
- "I made a change but it didn't show up on the site"
- "The file I edited disappeared"
- "What's this 'dist' folder?"

**Prevention:**
1. **Keep HTML files editable in-place** - Build step should enhance, not replace
2. **Use build for assets only** - Images, CSS optimization, not HTML transformation
3. **Preserve Dreamweaver's live preview capability** - Relative paths must still work locally
4. **Document the workflow clearly** - Create a simple guide: "Edit HTML, push to GitHub, wait 2 minutes"
5. Consider a **zero-build approach** for HTML - only optimize images/assets

**Phase to address:** Phase 1 (Planning) - Define workflow before implementing any build step

**Detection:** Ask owner to make a test edit before finalizing any workflow changes

---

### Pitfall 3: Image Optimization Quality Destruction

**What goes wrong:** Automated image optimization destroys photo quality, which is catastrophic for a photography portfolio. Common failures:
- Over-aggressive compression creates visible artifacts
- Color profile loss/conversion makes photos look flat or wrong
- Re-encoding already-compressed JPEGs compounds degradation
- Cropping or resizing breaks carefully composed images

**Why it happens:**
- Default optimization settings prioritize file size over quality
- Photography requires higher quality thresholds than typical web images
- PNG photos (detected in this site) are often already optimized by Lightroom/Photoshop
- Re-compressing from JPEG source accumulates artifacts

**Consequences:**
- Portfolio photos look amateurish
- Owner's professional reputation damaged
- Difficult to detect until after deployment
- May need to re-upload all 218 original images

**Warning signs:**
- Banding in gradient areas (sky, skin tones)
- Loss of detail in shadows/highlights
- Colors look "off" compared to originals
- File sizes dropped dramatically (>60% reduction is suspicious)

**Prevention:**
1. **Never re-encode from deployed images** - Always optimize from original masters
2. **Use conservative quality settings** - JPEG quality 85-90, WebP quality 85-90
3. **Preserve color profiles** - Always use sRGB, don't strip ICC profiles
4. **A/B test before deployment** - Compare optimized vs original side-by-side
5. **Create a test batch first** - Optimize 10 representative images before all 218
6. **Keep originals accessible** - Store unoptimized backups in S3

**Phase to address:** Phase 2 (Image Optimization) - Needs dedicated testing phase before rollout

**Quality thresholds for photography:**
- JPEG/WebP: minimum quality 82-85
- AVIF: minimum quality 50-60 (AVIF quality scale differs)
- Maximum acceptable PSNR loss: <2dB from original

---

### Pitfall 4: CloudFront Cache Invalidation Failures

**What goes wrong:** Site updates don't appear after deployment due to:
- Cached old versions persisting at edge locations
- Browser caching old versions locally
- Incomplete invalidation paths
- Invalidation completing for some edge locations but not others

**Why it happens:**
- CloudFront caches for 24 hours by default (current workflow sets `max-age=31536000` for most assets)
- Invalidations take 10-100 seconds and aren't guaranteed immediate
- Browser respects Cache-Control headers independent of CDN
- Invalidation paths are case-sensitive and must match exactly

**Consequences:**
- Owner says "I updated the site but nothing changed"
- Different users see different versions
- Debugging nightmare ("works for me, not for you")
- False assumption that deployment failed

**Warning signs:**
- Changes appear after hard refresh but not normal browsing
- "It worked yesterday, now it's showing old content"
- Console shows old file versions being served

**Prevention:**
1. **Use content hashing for assets** - `styles.abc123.css` instead of `styles.css`
2. **Short TTL for HTML** - Current workflow correctly uses 5-minute TTL for index.html
3. **Document "clear cache" steps for owner** - Hard refresh instructions
4. **Add cache-busting query strings** - `?v=2` for manual updates
5. **Wait for invalidation completion** - Add `aws cloudfront wait invalidation-completed` to workflow

**Phase to address:** Phase 3 (CI/CD Enhancement) - Improve caching strategy during pipeline improvements

**Current workflow analysis:**
- HTML files: 5-minute cache (good)
- All other assets: 1-year cache with `immutable` (problematic without content hashing)
- Invalidation runs but completion isn't verified

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or require rollback.

---

### Pitfall 5: jQuery Migration Breaking Existing Functionality

**What goes wrong:** Upgrading jQuery or removing it breaks:
- Contact form (uses `$.ajax()`)
- Portfolio grid filtering (cubeportfolio.js depends on jQuery)
- Smooth scrolling
- All swiper/slider interactions
- LightGallery image viewer
- Counter animations
- All 1800+ lines of scripts.js

**Why it happens:**
- jQuery 3.0+ removed deprecated APIs that older plugins use
- jQuery 4.0 made significant breaking changes
- Many plugins use internal jQuery APIs that change between versions
- The site uses at least 15 different jQuery plugins

**Consequences:**
- Portfolio filtering stops working
- Contact form fails silently
- Lightbox gallery broken
- Site appears functional but interactions fail

**Warning signs:**
- Console errors about undefined jQuery methods
- Click handlers not firing
- AJAX requests failing

**Prevention:**
1. **Don't upgrade jQuery version** - Current version works, leave it
2. **Don't remove jQuery** - Too many dependencies
3. **Use jQuery Migrate if upgrading** - Provides compatibility shims
4. **Test ALL interactive features** after any JS changes:
   - [ ] Contact form submission
   - [ ] Portfolio filter buttons
   - [ ] Image lightbox opening
   - [ ] Smooth scroll navigation
   - [ ] Slider transitions
5. **Keep jQuery as external script** - Don't bundle it

**Phase to address:** All phases - Any JS change requires full regression testing

**Sources:**
- [jQuery 3.0 Upgrade Guide](https://jquery.com/upgrade-guide/3.0/)
- [jQuery Migrate Plugin](https://wordpress.org/plugins/enable-jquery-migrate-helper/)

---

### Pitfall 6: WebP/AVIF Compatibility Breaking Older Browsers

**What goes wrong:** Converting all images to modern formats without fallbacks breaks images on:
- Safari < 14 (WebP)
- Firefox < 86 (AVIF)
- Older iOS devices
- Some email clients rendering shared links

**Why it happens:**
- Enthusiasm for new formats without understanding adoption
- Single-format conversion instead of multi-format with `<picture>` element
- Forgetting that photography clients may have older devices

**Consequences:**
- Blank or broken images for some visitors
- Portfolio appears empty on older devices
- Professional embarrassment

**Warning signs:**
- "Images don't load on my phone" complaints
- Analytics showing high bounce rate from iOS users

**Prevention:**
1. **Always provide JPEG/PNG fallbacks** using `<picture>` element:
   ```html
   <picture>
     <source srcset="photo.avif" type="image/avif">
     <source srcset="photo.webp" type="image/webp">
     <img src="photo.jpg" alt="description">
   </picture>
   ```
2. **Test on actual older devices** - Not just browser dev tools
3. **Generate all three formats** - AVIF, WebP, and original
4. **Consider WebP-only first** - AVIF support still maturing

**Phase to address:** Phase 2 (Image Optimization) - Must include fallback strategy

**Sources:**
- [WebP vs AVIF Comparison](https://speedvitals.com/blog/webp-vs-avif/)
- [Image Optimization 2025](https://aibudwp.com/image-optimization-in-2025-webp-avif-srcset-and-preload/)

---

### Pitfall 7: Build Tool Configuration Complexity

**What goes wrong:** Over-engineering the build setup with complex Webpack/Vite configuration that:
- Takes longer to configure than the time it saves
- Breaks when dependencies update
- No one can maintain after initial setup
- Introduces bugs that didn't exist before

**Why it happens:**
- Copy-pasting "modern" configurations without understanding them
- Adding features that aren't needed (hot reload for a simple static site)
- Treating a 1-page photography portfolio like a SPA

**Consequences:**
- Build failures block all deployments
- Developer time spent on tooling, not features
- Fragile pipeline that breaks unexpectedly

**Warning signs:**
- Build configuration exceeds 100 lines
- Multiple environment-specific configurations
- Frequent "works locally, fails in CI"

**Prevention:**
1. **Start minimal** - One optimization task at a time
2. **Consider no bundler** - Shell scripts for image optimization may suffice
3. **If using Vite, use defaults** - Don't customize what you don't need
4. **Document every configuration choice** - Future you will forget why

**Phase to address:** Phase 1 (Build Setup) - Resist over-engineering

---

### Pitfall 8: GitHub Actions Workflow Failures

**What goes wrong:** Deployment pipeline fails silently or partially:
- OIDC authentication failures
- S3 sync fails but invalidation runs on old content
- Workflow succeeds but wrong files deployed
- Branch protection rules blocking deployment

**Why it happens:**
- IAM role permissions too restrictive or too broad
- Workflow steps not properly dependent on each other
- No verification that deployment actually succeeded
- Secrets/environment configuration issues

**Consequences:**
- Site not updating despite "successful" workflow
- Partial deployments with broken references
- Hard to debug remote failures

**Warning signs:**
- Green checkmark but site unchanged
- Intermittent deployment failures
- "Access Denied" errors in workflow logs

**Prevention:**
1. **Add deployment verification step** - Fetch deployed page and check content
2. **Chain dependent steps properly** - Use `needs:` in workflow jobs
3. **Add meaningful error messages** - Don't let failures pass silently
4. **Test workflow changes in a branch first** - Don't push directly to main
5. **Review current workflow** (already well-structured, but could add verification)

**Phase to address:** Phase 3 (CI/CD Enhancement)

---

## Minor Pitfalls

Annoyances that are easily fixed but worth knowing about.

---

### Pitfall 9: Relative Path Breakage

**What goes wrong:** Build process outputs files to different directory structure, breaking relative paths:
- `src="../images/photo.jpg"` no longer resolves
- CSS `url()` references break
- Dreamweaver preview stops working

**Prevention:**
- Maintain exact directory structure between source and output
- Use absolute paths from root (`/images/`) where possible
- Test local preview after any path changes

**Phase to address:** Phase 1 (Build Setup)

---

### Pitfall 10: Font and Icon Loading Issues

**What goes wrong:** Optimization removes or breaks:
- Google Fonts loading
- Adobe Typekit fonts (`xzi7yjp.css`)
- Icon fonts in `/style/type/icons.css`
- Font preloading order

**Prevention:**
- Don't modify font loading in initial phases
- Test all icon displays after any CSS changes
- Keep external font references intact

**Phase to address:** Later phases - Low priority, high risk

---

### Pitfall 11: reCAPTCHA Integration Breaks

**What goes wrong:** Contact form's reCAPTCHA Enterprise stops working:
- Script loading order changed
- grecaptcha.enterprise not available
- Token generation fails
- Form submits fail silently

**Prevention:**
- Don't modify the inline script in `<head>`
- Keep reCAPTCHA script as external async load
- Test form submission after any JS changes

**Phase to address:** All phases - Test contact form after every change

---

### Pitfall 12: Local Development Mismatch

**What goes wrong:** Developer setup doesn't match production, leading to:
- "Works on my machine" issues
- Dreamweaver user can't run build tools
- Two different workflows for dev vs owner

**Prevention:**
- Keep production deployment independent of local build
- If owner needs to preview, ensure it works without build step
- Document both workflows clearly

**Phase to address:** Phase 1 (Planning)

---

## Phase-Specific Risk Summary

| Phase | Critical Risks | Testing Required |
|-------|---------------|------------------|
| Build Setup | Revolution Slider breaks, workflow disrupted | All interactive features, owner preview |
| Image Optimization | Quality loss, format compatibility | A/B quality comparison, cross-browser |
| CI/CD Enhancement | Cache issues, deployment failures | Full deployment verification |
| Performance | Breaking existing functionality | Complete regression test |

---

## Pre-Modernization Checklist

Before touching anything:

- [ ] Full site backup in S3 or separate location
- [ ] Screenshot all pages for comparison
- [ ] Document current owner workflow step-by-step
- [ ] List all interactive features that must keep working
- [ ] Test contact form submission (verify it reaches email)
- [ ] Note current Lighthouse scores for comparison
- [ ] Have rollback plan ready (git revert strategy)

---

## Testing Matrix

After each phase, verify:

| Feature | How to Test |
|---------|-------------|
| Revolution Slider | Homepage loads, slider transitions |
| Portfolio Grid | Filter buttons change displayed images |
| Lightbox | Clicking image opens full-size viewer |
| Smooth Scroll | Nav links scroll to sections |
| Contact Form | Submit form, verify email received |
| Mobile Nav | Hamburger menu opens/closes |
| Image Loading | All 218 images load correctly |
| Dreamweaver Preview | Owner can edit and preview locally |

---

## Sources

**jQuery Migration:**
- [jQuery 3.0 Upgrade Guide](https://jquery.com/upgrade-guide/3.0/)
- [10 Common jQuery Mistakes](https://www.nexgismo.com/blog/10-common-jquery-mistakes)

**Image Optimization:**
- [WebP vs AVIF Comparison](https://speedvitals.com/blog/webp-vs-avif/)
- [Image Optimization 2025](https://aibudwp.com/image-optimization-in-2025-webp-avif-srcset-and-preload/)
- [Ultimate Compression Strategy 2025](https://unifiedimagetools.com/en/articles/ultimate-image-compression-strategy-2025)

**CloudFront/Caching:**
- [AWS CloudFront Cache Control](https://docs.aws.amazon.com/whitepapers/latest/build-static-websites-aws/controlling-how-long-amazon-s3-content-is-cached-by-amazon-cloudfront.html)
- [CloudFront Invalidation Issues](https://repost.aws/questions/QUG__vuLtlS-Wf_z2iNxOFtw/cloudfront-continues-to-serve-old-content-after-invalidation-and-s3-update)

**Revolution Slider:**
- [Slider Revolution Troubleshooting](https://www.sliderrevolution.com/faq/how-to-troubleshoot-slider-revolution/)
- [SR7 Migration Issues](https://www.sliderrevolution.com/sr7-velocity-frontend-engine-update/)

**Build Tools:**
- [Vite vs Webpack Comparison](https://dev.to/mohitdecodes/vite-vs-webpack-modern-build-tools-compared-2025-26e)
- [Why Vite](https://vite.dev/guide/why)

**Non-Technical User Workflow:**
- [Static Sites for Non-Technical Users](https://buttercms.com/blog/static-site-generators-for-non-technical-users/)
- [Static Site Generator vs CMS](https://buttercms.com/blog/static-site-generator-vs-cms-which-is-right-for-you/)
