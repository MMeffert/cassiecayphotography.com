# Phase 21: Delete Orphaned JS Files

## Objective
Remove `plugins.js` and `scripts.js` that were replaced by `custom-plugins.js` and `custom-scripts.js` in Phase 7.

## Files to Delete
- `style/js/plugins.js` (534KB, 375 lines)
- `style/js/scripts.js` (59KB, 1803 lines)

## Verification (Pre-Delete)
- [x] No script tags load these files in index.html
- [x] No imports reference these files
- [x] custom-plugins.js contains Swiper (active replacement)
- [x] custom-scripts.js contains site initializations (active replacement)

## Tasks
1. Delete `style/js/plugins.js`
2. Delete `style/js/scripts.js`
3. Run `npm run build`
4. Verify site works locally
5. Commit

## Rollback
Files exist in git history if needed.
