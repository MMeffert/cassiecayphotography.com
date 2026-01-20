import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { resolve } from 'path'

// Custom plugin to preserve Revolution Slider CSS as link tags (not module scripts)
function preserveRevolutionSliderCSS() {
  return {
    name: 'preserve-revolution-slider-css',
    enforce: 'post',
    transformIndexHtml(html) {
      // Fix Revolution Slider CSS that Vite incorrectly converts to module scripts
      // Convert: <script async type="module" crossorigin src="style/revolution/...css"></script>
      // Back to: <link rel="stylesheet" type="text/css" href="style/revolution/...css">
      return html.replace(
        /<script async type="module" crossorigin src="(style\/revolution\/[^"]+\.css)"><\/script>/g,
        '<link rel="stylesheet" type="text/css" href="$1">'
      )
    }
  }
}

export default defineConfig({
  root: '.',
  publicDir: false, // Don't copy public folder (we manage assets explicitly)

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Don't process Revolution Slider CSS - keep as external links
    cssCodeSplit: false,

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },

      // Keep jQuery, Revolution Slider JS and CSS external - loaded via script/link tags
      external: [
        /^style\/js\/jquery\.min\.js$/,
        /^style\/js\/bootstrap\.min\.js$/,
        /^style\/js\/popper\.min\.js$/,
        /^style\/revolution\//,
        // Exclude Revolution Slider CSS from processing
        /style\/revolution\/css\/.*/,
        /style\/revolution\/revolution-addons\/.*/,
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
    // Fix Revolution Slider CSS links that Vite incorrectly converts to module scripts
    preserveRevolutionSliderCSS(),
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
        // Copy GLightbox (Phase 8 - replaced LightGallery)
        {
          src: 'style/js/glightbox.min.js',
          dest: 'style/js'
        },
        // Copy custom JS files (Phase 7 - extracted from plugins.js and scripts.js)
        {
          src: 'style/js/custom-plugins.js',
          dest: 'style/js'
        },
        {
          src: 'style/js/custom-scripts.js',
          dest: 'style/js'
        },
        // Copy CSS files
        {
          src: 'style/css',
          dest: 'style'
        },
        {
          src: 'style/style.css',
          dest: 'style'
        },
        {
          src: 'style/type',
          dest: 'style'
        },
        // Copy images directory (original - safety during migration)
        {
          src: 'images',
          dest: '.'
        },
        // Copy optimized images directory (AVIF, WebP, JPEG in responsive widths)
        {
          src: 'images-optimized',
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
