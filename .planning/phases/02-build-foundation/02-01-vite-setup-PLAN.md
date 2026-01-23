---
phase: 02-build-foundation
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - vite.config.js
  - postcss.config.js
  - .browserslistrc
autonomous: true

must_haves:
  truths:
    - "npm run dev starts Vite dev server serving index.html"
    - "npm run build produces minified CSS/JS in dist/"
    - "jQuery remains global (window.jQuery) and not bundled"
    - "Revolution Slider directory copied unchanged to dist/"
  artifacts:
    - path: "package.json"
      provides: "npm project with Vite scripts"
      contains: "vite"
    - path: "vite.config.js"
      provides: "Vite configuration with jQuery external"
      exports: ["default"]
    - path: "postcss.config.js"
      provides: "PostCSS with autoprefixer and cssnano"
      exports: ["default"]
    - path: ".browserslistrc"
      provides: "Browser targets for autoprefixer"
      min_lines: 3
  key_links:
    - from: "package.json"
      to: "vite.config.js"
      via: "vite CLI reads config"
      pattern: '"dev":\\s*"vite"'
    - from: "vite.config.js"
      to: "index.html"
      via: "root entry point"
      pattern: "root:\\s*['\"]\\.['\"]"
---

<objective>
Initialize Vite build system with jQuery/Revolution Slider preserved as external dependencies.

Purpose: Enable CSS/JS minification and dev server without breaking existing jQuery plugin ecosystem or Revolution Slider functionality. This is the foundation for all future optimization phases.

Output: Working Vite configuration with dev and build scripts, PostCSS for CSS processing.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/roadmap/ROADMAP.md
@.planning/STATE.md
@.planning/research/STACK.md
@index.html
</context>

<tasks>

<task type="auto">
  <name>Task 1: Initialize npm project and install Vite dependencies</name>
  <files>package.json</files>
  <action>
Initialize npm project at repository root (NOT in infrastructure/):

```bash
cd /Users/mitchellmeffert/Git/Personal/cassiecayphotography.com
npm init -y
```

Then install Vite and PostCSS dependencies:

```bash
npm install -D vite vite-plugin-static-copy postcss autoprefixer cssnano
```

Update package.json with scripts:
- "dev": "vite"
- "build": "vite build"
- "preview": "vite preview"

Also update:
- "name": "cassiecayphotography"
- "type": "module" (required for ES module config files)
- "private": true (prevent accidental publishing)

Do NOT install @rollup/plugin-inject - jQuery will remain a script tag in HTML, not bundled.
  </action>
  <verify>
`cat package.json | grep vite` shows vite in devDependencies
`cat package.json | grep '"dev"'` shows "vite" script
  </verify>
  <done>package.json exists with Vite installed and build/dev scripts configured</done>
</task>

<task type="auto">
  <name>Task 2: Create Vite configuration with jQuery external and Revolution Slider copy</name>
  <files>vite.config.js</files>
  <action>
Create vite.config.js at repository root with this configuration:

```javascript
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  publicDir: false, // Don't copy public folder (we manage assets explicitly)

  build: {
    outDir: 'dist',
    emptyDirFirst: true,

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },

      // Keep jQuery and Revolution Slider external - they're loaded via script tags
      external: [
        /^style\/js\/jquery\.min\.js$/,
        /^style\/js\/bootstrap\.min\.js$/,
        /^style\/js\/popper\.min\.js$/,
        /^style\/revolution\//,
      ],

      output: {
        // Content hashing for cache busting
        assetFileNames: (assetInfo) => {
          // Keep Revolution Slider assets unhashed
          if (assetInfo.name?.includes('revolution')) {
            return 'assets/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    }
  },

  plugins: [
    // Copy Revolution Slider directory as-is (preserves internal references)
    viteStaticCopy({
      targets: [
        {
          src: 'style/revolution',
          dest: 'style'
        },
        // Copy vendor JS files that should not be bundled
        {
          src: 'style/js/jquery.min.js',
          dest: 'style/js'
        },
        {
          src: 'style/js/popper.min.js',
          dest: 'style/js'
        },
        {
          src: 'style/js/bootstrap.min.js',
          dest: 'style/js'
        },
        // Copy images directory
        {
          src: 'images',
          dest: '.'
        },
        // Copy other static files
        {
          src: 'robots.txt',
          dest: '.'
        },
        {
          src: 'sitemap.xml',
          dest: '.'
        },
      ]
    })
  ],

  // Dev server configuration
  server: {
    open: true, // Open browser on start
    port: 3000,
  },
})
```

Key decisions:
- jQuery/Bootstrap/Popper loaded via script tags, NOT bundled (preserves plugin compatibility)
- Revolution Slider copied as-is (11MB, complex internal asset references)
- Only bundle-worthy files: style.css, plugins.css, plugins.js, scripts.js
- Content hashing on custom assets, but NOT on Revolution Slider
  </action>
  <verify>
`cat vite.config.js | grep "defineConfig"` shows config is ES module
`cat vite.config.js | grep "revolution"` shows Revolution Slider handling
  </verify>
  <done>vite.config.js exists with proper external declarations and Revolution Slider copy configuration</done>
</task>

<task type="auto">
  <name>Task 3: Create PostCSS configuration and browserslist</name>
  <files>postcss.config.js, .browserslistrc</files>
  <action>
Create postcss.config.js at repository root:

```javascript
export default {
  plugins: {
    autoprefixer: {},
    cssnano: {
      preset: ['default', {
        // Preserve important comments (licenses)
        discardComments: {
          removeAll: false,
        },
      }],
    },
  },
}
```

Create .browserslistrc at repository root:

```
# Modern browsers (no IE11)
> 0.5%
last 2 versions
Firefox ESR
not dead
not IE 11
```

These files enable:
- Automatic vendor prefixes (autoprefixer)
- CSS minification in production builds (cssnano)
- Target browsers for both tools via browserslist
  </action>
  <verify>
`cat postcss.config.js | grep "autoprefixer"` shows plugin configured
`cat .browserslistrc | grep "not IE"` shows IE excluded
  </verify>
  <done>PostCSS configuration and browser targets exist</done>
</task>

</tasks>

<verification>
After all tasks complete:
1. `npm run build` should execute without errors
2. `dist/` directory should contain:
   - index.html (processed)
   - assets/ (bundled CSS/JS with hashes)
   - style/revolution/ (copied as-is)
   - style/js/jquery.min.js, popper.min.js, bootstrap.min.js (copied)
   - images/ (copied)
3. `npm run dev` should start dev server at http://localhost:3000
</verification>

<success_criteria>
- package.json has vite in devDependencies with dev/build/preview scripts
- vite.config.js configures jQuery as external and copies Revolution Slider
- postcss.config.js enables autoprefixer and cssnano
- .browserslistrc targets modern browsers
- No TypeScript errors in config files (pure JS configs)
</success_criteria>

<output>
After completion, create `.planning/phases/02-build-foundation/02-01-SUMMARY.md`
</output>
