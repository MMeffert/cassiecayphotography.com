# Phase 22: Extract Swiper CSS & Remove plugins.css

## Objective
Extract the only used CSS (Swiper) from plugins.css, then delete the 183KB file.

## Analysis
plugins.css contains:
- SmartMenus — 0 usages (replaced by Bootstrap 5 nav)
- AOS animations — 0 usages
- Prettify — 0 usages
- Plyr — 0 usages
- LightGallery — 0 usages (replaced by GLightbox)
- Fotorama — 0 usages
- CollageEffect — 0 usages
- Cocoen — 0 usages
- **Swiper — USED** (quote slider, ~14KB)

## Tasks
1. Create `style/css/swiper.css` with Swiper CSS extracted from plugins.css (lines 63-78)
2. Add `<link rel="stylesheet" href="style/css/swiper.css">` to index.html
3. Delete `style/css/plugins.css`
4. Remove plugins.css link from index.html (if present in dev)
5. Run `npm run build`
6. Test quote slider functionality
7. Commit

## Verification
- Quote slider displays and animates correctly
- No CSS 404s in console
- dist/style/css/ no longer contains plugins.css
