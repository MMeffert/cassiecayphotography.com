import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  publicDir: false, // Don't copy public folder (we manage assets explicitly)

  build: {
    outDir: 'dist',
    emptyOutDir: true,

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
        // Copy other style JS files
        {
          src: 'style/js/plugins.js',
          dest: 'style/js'
        },
        {
          src: 'style/js/scripts.js',
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
