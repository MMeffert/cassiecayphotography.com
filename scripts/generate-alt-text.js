/**
 * Alt text generation script for Cassie Cay Photography
 *
 * Uses Claude Vision API (via ccproxy - OpenAI-compatible) to generate
 * descriptive, SEO-optimized alt text for all portfolio images.
 *
 * Usage:
 *   Generate alt text manifest:
 *     node scripts/generate-alt-text.js
 *
 *   Inject alt text into HTML:
 *     node scripts/generate-alt-text.js --inject
 *
 * Configuration:
 *   CCPROXY_URL - Proxy server URL (default: http://10.0.10.42:8000/claude/v1)
 */

import OpenAI from 'openai';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import pLimit from 'p-limit';

// ccproxy server configuration (OpenAI-compatible API)
const BASE_URL = process.env.CCPROXY_URL || 'http://10.0.10.42:8000/claude/v1';
const MODEL = 'claude-sonnet-4-20250514';
const CONCURRENCY = 3; // Lower concurrency for vision requests
const DELAY_BETWEEN_BATCHES = 500; // ms

// Category mapping from filename prefix
const CATEGORY_MAP = {
  'F': 'Family',
  'B': 'Bridal',
  'C': 'Corporate',
  'E': 'Event',
  'S': 'Senior',
  'W': 'Wedding',
  'NB': 'Newborn',
  'M': 'Milestone',
  'senior': 'Senior'
};

/**
 * Extract category from filename
 */
function getCategoryFromFilename(filename) {
  // Try two-letter prefix first (NB for Newborn)
  const twoLetterMatch = filename.match(/^cassiecay-([A-Z]{2})\d/i);
  if (twoLetterMatch) {
    const prefix = twoLetterMatch[1].toUpperCase();
    if (CATEGORY_MAP[prefix]) return CATEGORY_MAP[prefix];
  }

  // Try "senior" prefix
  if (filename.match(/^cassiecay-senior\d/i)) {
    return CATEGORY_MAP['senior'];
  }

  // Single letter prefix
  const singleLetterMatch = filename.match(/^cassiecay-([A-Z])\d/i);
  if (singleLetterMatch) {
    const prefix = singleLetterMatch[1].toUpperCase();
    if (CATEGORY_MAP[prefix]) return CATEGORY_MAP[prefix];
  }

  return 'Portrait';
}

/**
 * Extract portfolio images from index.html that have empty alt attributes
 */
function extractImagesFromHtml() {
  const htmlPath = resolve('index.html');
  const html = readFileSync(htmlPath, 'utf-8');

  // Find all img tags (they span multiple lines)
  const imgTagPattern = /<img[\s\S]*?>/g;
  const images = [];

  // Non-portfolio image patterns to exclude
  const excludePatterns = [
    /cassiecay-about/i,
    /cassiecay-service/i,
    /cassiecay-background/i,
    /cassiecay-logo/i,
    /cassiecay-slider/i,
    /BookaPhotoshoot/i
  ];

  let imgMatch;
  while ((imgMatch = imgTagPattern.exec(html)) !== null) {
    const imgTag = imgMatch[0];

    // Check if this img tag has alt="" (empty alt)
    if (!imgTag.includes('alt=""')) continue;

    // Extract src attribute - look for cassiecay images in jpeg folder (800w or full)
    const srcMatch = imgTag.match(/src="([^"]*images-optimized\/jpeg\/(?:800w|full)\/cassiecay-[^"]+\.jpg)"/);
    if (!srcMatch) continue;

    const src = srcMatch[1];
    const filename = src.split('/').pop();

    // Skip non-portfolio images
    if (excludePatterns.some(pattern => pattern.test(filename))) continue;

    // Only include portfolio image patterns (F, E, NB, M, senior, B, C, S, W)
    if (!filename.match(/^cassiecay-(F|E|NB|M|senior|B|C|S|W)\d/i)) continue;

    const category = getCategoryFromFilename(filename);

    // Avoid duplicates (some images may appear multiple times)
    if (!images.find(img => img.filename === filename)) {
      images.push({
        filename,
        src,
        category
      });
    }
  }

  return images;
}

/**
 * Generate alt text for a single image using Claude Vision via ccproxy
 */
async function generateAltTextForImage(client, image) {
  const imagePath = resolve(image.src);

  if (!existsSync(imagePath)) {
    console.warn(`Warning: Image not found: ${imagePath}`);
    return {
      ...image,
      altText: `${image.category} photography by Cassie Cay Photography in Madison, WI`,
      error: 'Image file not found'
    };
  }

  // Read and base64 encode the image
  const imageData = readFileSync(imagePath);
  const base64Image = imageData.toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64Image}`;

  const prompt = `You are generating alt text for a professional photography portfolio website.

Image context:
- Photographer: Cassie Cay Photography
- Location: Madison, Wisconsin
- Category: ${image.category} photography

Generate concise alt text (10-20 words) that:
1. Describes the subjects and setting
2. Conveys the mood/emotion
3. Naturally includes "Madison, WI" or "Madison, Wisconsin"
4. Mentions the photography type (${image.category.toLowerCase()} portrait/photography)
5. Does NOT start with "A photo of" or "An image of"

Respond with ONLY the alt text, no quotes or explanation.`;

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: dataUrl
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ]
    });

    const altText = response.choices[0].message.content.trim();
    return {
      ...image,
      altText
    };
  } catch (error) {
    console.error(`Error generating alt text for ${image.filename}: ${error.message}`);
    return {
      ...image,
      altText: `${image.category} photography by Cassie Cay Photography in Madison, WI`,
      error: error.message
    };
  }
}

/**
 * Generate alt text for all images
 */
async function generateAltTextManifest() {
  console.log('\n=== Alt Text Generation ===\n');
  console.log(`Using proxy: ${BASE_URL}`);
  console.log(`Model: ${MODEL}\n`);

  // Extract images from HTML
  const images = extractImagesFromHtml();
  console.log(`Found ${images.length} portfolio images with empty alt text`);

  if (images.length === 0) {
    console.log('No images need alt text. Exiting.');
    return;
  }

  // Initialize OpenAI client with ccproxy base URL
  const client = new OpenAI({
    apiKey: 'dummy', // Not used by ccproxy, but required by SDK
    baseURL: BASE_URL
  });

  // Process images with concurrency limit
  const limit = pLimit(CONCURRENCY);
  let processed = 0;

  const tasks = images.map((image, index) =>
    limit(async () => {
      // Add delay between batches to avoid rate limits
      if (index > 0 && index % CONCURRENCY === 0) {
        await new Promise(r => setTimeout(r, DELAY_BETWEEN_BATCHES));
      }

      const result = await generateAltTextForImage(client, image);
      processed++;
      console.log(`[${processed}/${images.length}] ${image.filename}: ${result.altText.substring(0, 50)}...`);
      return result;
    })
  );

  const imageResults = await Promise.all(tasks);

  // Build manifest
  const manifest = {
    generated: new Date().toISOString(),
    model: MODEL,
    proxy: BASE_URL,
    totalImages: imageResults.length,
    images: imageResults.map(img => ({
      filename: img.filename,
      fullPath: img.src,
      category: img.category,
      altText: img.altText,
      ...(img.error && { error: img.error })
    }))
  };

  // Write manifest
  const manifestPath = resolve('alt-text.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nGenerated: ${manifestPath}`);

  // Summary
  const errors = imageResults.filter(img => img.error);
  console.log(`\nSummary: ${imageResults.length - errors.length} successful, ${errors.length} errors`);

  return manifest;
}

/**
 * Inject alt text from manifest into index.html
 *
 * Uses a two-pass approach:
 * 1. Build a lookup map from src paths to alt text
 * 2. Match each img tag, check if it has alt="" and a known src, then replace
 */
function injectAltText() {
  console.log('\n=== Alt Text Injection ===\n');

  const manifestPath = resolve('alt-text.json');
  if (!existsSync(manifestPath)) {
    console.error('Error: alt-text.json not found. Run generation first.');
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  console.log(`Loaded ${manifest.images.length} alt text entries`);

  const htmlPath = resolve('index.html');
  let html = readFileSync(htmlPath, 'utf-8');
  let updated = 0;

  // Build a map of src -> altText for quick lookup
  const altTextMap = new Map();
  for (const image of manifest.images) {
    altTextMap.set(image.fullPath, image.altText);
  }

  // Find all img tags and process them individually
  // This avoids regex crossing tag boundaries
  html = html.replace(/<img[\s\S]*?>/g, (imgTag) => {
    // Check if this img tag has alt=""
    if (!imgTag.includes('alt=""')) return imgTag;

    // Extract the src attribute
    const srcMatch = imgTag.match(/src="([^"]+)"/);
    if (!srcMatch) return imgTag;
    const src = srcMatch[1];

    // Look up alt text in manifest
    const altText = altTextMap.get(src);
    if (!altText) return imgTag;

    // Escape special characters for HTML attribute
    const escapedAlt = altText
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Replace alt="" with the new alt text within this specific tag
    updated++;
    return imgTag.replace('alt=""', `alt="${escapedAlt}"`);
  });

  // Write updated HTML
  writeFileSync(htmlPath, html);
  console.log(`Updated ${updated} alt attributes in index.html`);

  // Verify
  const remaining = (html.match(/alt=""/g) || []).length;
  console.log(`Remaining empty alt attributes: ${remaining}`);

  return updated;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--inject')) {
    injectAltText();
  } else {
    await generateAltTextManifest();
  }
}

// Export for potential programmatic use
export { generateAltTextManifest, injectAltText };

// Run if executed directly
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
