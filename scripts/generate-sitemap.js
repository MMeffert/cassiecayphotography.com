/**
 * Sitemap generation script for Cassie Cay Photography
 *
 * Generates:
 * - image-sitemap.xml: Google Image sitemap with all portfolio images
 * - sitemap.xml: Sitemap index referencing image sitemap
 *
 * Each image includes:
 * - <image:loc> - Absolute URL to the image
 * - <image:caption> - Category-based descriptive caption
 * - <image:geo_location> - Madison, Wisconsin, USA
 */

import { SitemapStream, streamToPromise } from 'sitemap';
import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, basename } from 'path';

const SITE_URL = 'https://cassiecayphotography.com';
const DIST_DIR = 'dist';
const IMAGE_PATH = 'images-optimized/jpeg/full';
const GEO_LOCATION = 'Madison, Wisconsin, USA';

// Category mapping from filename prefix to descriptive caption
const CATEGORY_MAP = {
  'F': 'Family portrait',
  'B': 'Bridal portrait',
  'C': 'Corporate portrait',
  'E': 'Event',
  'S': 'Senior portrait',
  'W': 'Wedding',
  'NB': 'Newborn',
  'M': 'Milestone',
  'senior': 'Senior portrait'
};

/**
 * Extract category from filename and generate descriptive caption
 * @param {string} filename - e.g., cassiecay-F1-full.jpg
 * @returns {string} - e.g., "Family portrait photography by Cassie Cay Photography in Madison, WI"
 */
function getCaptionFromFilename(filename) {
  // Pattern: cassiecay-{CATEGORY}{NUMBER}...
  // Examples: cassiecay-F1-full.jpg, cassiecay-NB2-full.jpg, cassiecay-senior1-full.jpg

  // Try two-letter prefix first (NB for Newborn)
  const twoLetterMatch = filename.match(/^cassiecay-([A-Z]{2})\d/i);
  if (twoLetterMatch) {
    const prefix = twoLetterMatch[1].toUpperCase();
    const category = CATEGORY_MAP[prefix];
    if (category) {
      return `${category} photography by Cassie Cay Photography in Madison, WI`;
    }
  }

  // Try "senior" prefix
  const seniorMatch = filename.match(/^cassiecay-senior\d/i);
  if (seniorMatch) {
    return `${CATEGORY_MAP['senior']} photography by Cassie Cay Photography in Madison, WI`;
  }

  // Single letter prefix
  const singleLetterMatch = filename.match(/^cassiecay-([A-Z])\d/i);
  if (singleLetterMatch) {
    const prefix = singleLetterMatch[1].toUpperCase();
    const category = CATEGORY_MAP[prefix];
    if (category) {
      return `${category} photography by Cassie Cay Photography in Madison, WI`;
    }
  }

  // Fallback for any unrecognized pattern
  return 'Professional portrait photography by Cassie Cay Photography in Madison, WI';
}

/**
 * Get list of portfolio images from dist directory
 * @returns {string[]} - Array of filenames
 */
function getPortfolioImages() {
  const imageDir = resolve(DIST_DIR, IMAGE_PATH);

  if (!existsSync(imageDir)) {
    console.warn(`Warning: Image directory not found: ${imageDir}`);
    return [];
  }

  const files = readdirSync(imageDir);

  // Filter to only portfolio images (cassiecay-{CATEGORY}{NUMBER}-full.jpg)
  // Categories: B, C, E, F, S, W, NB, M, senior
  const portfolioPattern = /^cassiecay-(B|C|E|F|S|W|NB|M|senior)\d.*-full\.jpg$/i;

  return files.filter(f => portfolioPattern.test(f));
}

/**
 * Generate image-sitemap.xml with all portfolio images
 */
async function generateImageSitemap() {
  const images = getPortfolioImages();

  if (images.length === 0) {
    console.warn('No portfolio images found. Skipping image sitemap generation.');
    return 0;
  }

  console.log(`Found ${images.length} portfolio images`);

  // Build image entries for Google Image sitemap
  // All images belong to the homepage URL
  const imageEntries = images.map(filename => ({
    url: `${SITE_URL}/${IMAGE_PATH}/${filename}`,
    caption: getCaptionFromFilename(filename),
    geoLocation: GEO_LOCATION
  }));

  // Create sitemap stream with image namespace
  const stream = new SitemapStream({
    hostname: SITE_URL,
    xmlns: {
      image: true
    }
  });

  // Write single URL entry with all images
  stream.write({
    url: '/',
    img: imageEntries
  });

  stream.end();

  // Generate XML
  const data = await streamToPromise(stream);
  const xml = data.toString();

  // Ensure dist directory exists
  if (!existsSync(DIST_DIR)) {
    mkdirSync(DIST_DIR, { recursive: true });
  }

  // Write image sitemap
  const outputPath = resolve(DIST_DIR, 'image-sitemap.xml');
  writeFileSync(outputPath, xml);
  console.log(`Generated: ${outputPath} (${images.length} images)`);

  return images.length;
}

/**
 * Generate sitemap.xml as sitemap index
 */
function generateSitemapIndex() {
  const today = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/page-sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/image-sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  // Ensure dist directory exists
  if (!existsSync(DIST_DIR)) {
    mkdirSync(DIST_DIR, { recursive: true });
  }

  const outputPath = resolve(DIST_DIR, 'sitemap.xml');
  writeFileSync(outputPath, xml);
  console.log(`Generated: ${outputPath}`);
}

/**
 * Generate page-sitemap.xml with homepage
 */
function generatePageSitemap() {
  const today = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  // Ensure dist directory exists
  if (!existsSync(DIST_DIR)) {
    mkdirSync(DIST_DIR, { recursive: true });
  }

  const outputPath = resolve(DIST_DIR, 'page-sitemap.xml');
  writeFileSync(outputPath, xml);
  console.log(`Generated: ${outputPath}`);
}

/**
 * Main sitemap generation function
 */
async function generateSitemap() {
  console.log('\n=== Sitemap Generation ===\n');

  const imageCount = await generateImageSitemap();
  generatePageSitemap();
  generateSitemapIndex();

  console.log(`\nSitemap generation complete: ${imageCount} images indexed`);
}

// Export for potential programmatic use
export { generateSitemap };

// Run if executed directly
generateSitemap().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
