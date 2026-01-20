---
phase: 02-build-foundation
plan: 02
type: execute
wave: 2
depends_on: ["02-01"]
files_modified: []
autonomous: false

must_haves:
  truths:
    - "npm run build produces working dist/ that can be deployed"
    - "Revolution Slider hero animation plays on page load"
    - "All jQuery plugins initialize without console errors"
    - "Contact form submission still works"
    - "HTML source files remain editable (not overwritten by build)"
  artifacts:
    - path: "dist/index.html"
      provides: "Built HTML with optimized asset references"
      min_lines: 100
    - path: "dist/style/revolution/js/jquery.themepunch.revolution.min.js"
      provides: "Revolution Slider core JS (copied, not bundled)"
      min_lines: 10
  key_links:
    - from: "dist/index.html"
      to: "dist/style/js/jquery.min.js"
      via: "script tag preserved"
      pattern: 'src="style/js/jquery\\.min\\.js"'
    - from: "dist/index.html"
      to: "Revolution Slider"
      via: "script tags in correct order"
      pattern: "jquery\\.themepunch"
---

<objective>
Verify Vite build produces a working site with Revolution Slider and jQuery plugins functioning correctly.

Purpose: Confirm the build system works WITHOUT breaking existing functionality. This is a critical verification step before any deployment changes. Catching issues now prevents production breakage.

Output: Verified build that matches current site behavior.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/roadmap/ROADMAP.md
@.planning/STATE.md
@.planning/phases/02-build-foundation/02-01-SUMMARY.md
@vite.config.js
</context>

<tasks>

<task type="auto">
  <name>Task 1: Run build and verify output structure</name>
  <files></files>
  <action>
Run the Vite build:

```bash
cd /Users/mitchellmeffert/Git/Personal/cassiecayphotography.com
npm run build
```

Verify the dist/ directory structure:

```bash
ls -la dist/
ls -la dist/assets/
ls -la dist/style/
ls -la dist/style/revolution/
ls -la dist/style/js/
ls -la dist/images/ | head -20
```

Expected structure:
```
dist/
  index.html
  assets/
    *.css (hashed)
    *.js (hashed, if any bundled JS)
  style/
    revolution/  (full copy, unhashed)
    js/
      jquery.min.js
      popper.min.js
      bootstrap.min.js
  images/
    (all images)
  robots.txt
  sitemap.xml
```

Check that:
- dist/index.html exists and has content
- dist/style/revolution/ contains the full Revolution Slider directory
- dist/style/js/jquery.min.js exists (not bundled into assets)
- dist/images/ contains the portfolio images

If build fails, read error output and fix vite.config.js accordingly.
  </action>
  <verify>
`ls dist/index.html` returns the file
`ls dist/style/revolution/js/jquery.themepunch.revolution.min.js` returns the file
`ls dist/style/js/jquery.min.js` returns the file
  </verify>
  <done>Build completes successfully with expected directory structure</done>
</task>

<task type="auto">
  <name>Task 2: Verify script order in built HTML</name>
  <files></files>
  <action>
Examine the built index.html to verify script loading order is preserved:

```bash
grep -n "script.*src" dist/index.html
```

The order MUST be:
1. Google reCAPTCHA (external CDN)
2. Google Analytics (external CDN)
3. jquery.min.js
4. popper.min.js
5. bootstrap.min.js
6. Revolution Slider scripts (jquery.themepunch.*)
7. plugins.js
8. scripts.js

If Vite has reordered or bundled these incorrectly, the site will break.

Also verify CSS link order:
```bash
grep -n "link.*stylesheet" dist/index.html
```

CSS order matters for cascade:
1. bootstrap.min.css
2. plugins.css
3. Revolution Slider CSS
4. icons.css
5. style.css
6. color theme (oasis.css)

If order is wrong or assets are missing, vite.config.js needs adjustment.
  </action>
  <verify>
`grep "jquery.min.js" dist/index.html` shows script tag (not bundled reference)
`grep "themepunch.revolution" dist/index.html` shows Revolution Slider script
  </verify>
  <done>Script and CSS load order in dist/index.html matches source</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Vite build system with Revolution Slider and jQuery preserved as external dependencies. The build produces a dist/ folder that should be functionally identical to the current live site.</what-built>
  <how-to-verify>
1. Start the preview server:
   ```bash
   cd /Users/mitchellmeffert/Git/Personal/cassiecayphotography.com
   npm run preview
   ```
   This serves the built dist/ folder.

2. Open http://localhost:4173 in browser

3. Verify Revolution Slider:
   - Hero slideshow auto-advances (fade transition between images)
   - Text overlay appears with animation
   - No blank slider or missing images

4. Verify jQuery plugins work:
   - Scroll down - navbar becomes sticky/changes
   - Portfolio filtering works (click category buttons)
   - Lightbox opens when clicking portfolio images
   - Smooth scroll works when clicking nav links

5. Verify Contact form:
   - Fill in name, email, subject, message
   - Click "Send Message"
   - Should show "Sending..." then success/error message
   - (Don't need to actually send - just verify JS runs)

6. Check browser console (F12 -> Console):
   - No JavaScript errors
   - No failed network requests (404s)
   - Revolution Slider should log "Revolution Slider initialized" or similar

7. Test dev server (separate from preview):
   ```bash
   npm run dev
   ```
   - Opens http://localhost:3000
   - Make a CSS change (e.g., in style/style.css)
   - Verify hot reload updates the page without full refresh
  </how-to-verify>
  <resume-signal>Type "approved" if all checks pass, or describe any issues found</resume-signal>
</task>

</tasks>

<verification>
After all tasks complete:
1. Build produces dist/ with correct structure
2. Script loading order preserved in dist/index.html
3. Human verification confirms:
   - Revolution Slider works
   - jQuery plugins work
   - Contact form works
   - No console errors
   - Dev server hot reload works
</verification>

<success_criteria>
- `npm run build` succeeds without errors
- dist/ contains Revolution Slider copied as-is
- dist/ contains vendor JS files (jquery, popper, bootstrap) not bundled
- Built site functions identically to source site
- Dev server provides hot reload for development
- Source HTML files remain unmodified (build output is separate)
</success_criteria>

<output>
After completion, create `.planning/phases/02-build-foundation/02-02-SUMMARY.md`
</output>
