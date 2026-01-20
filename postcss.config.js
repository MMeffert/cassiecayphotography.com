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
