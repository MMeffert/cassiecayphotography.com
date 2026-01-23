/**
 * Image optimization script for Cassie Cay Photography portfolio
 *
 * Generates responsive width variants in AVIF, WebP, and JPEG formats
 * with CONSERVATIVE quality settings to preserve photography quality.
 *
 * Quality settings:
 * - AVIF: 85 quality, effort 6, 4:4:4 chroma (highest fidelity)
 * - WebP: 85 quality, effort 6, smart subsample
 * - JPEG: 90 quality, mozjpeg, progressive
 *
 * Width variants:
 * - full/ - original dimensions (for lightbox)
 * - 1800w/ - large screens
 * - 1200w/ - medium screens
 * - 800w/ - small screens, thumbnails
 */

import sharp from 'sharp';
import { glob } from 'glob';
import fs from 'fs-extra';
import path from 'path';
import cliProgress from 'cli-progress';
import pLimit from 'p-limit';

// Configuration
const SOURCE_DIR = 'images';
const OUTPUT_DIR = 'images-optimized';
const CONCURRENCY = 4; // Limit concurrent processing for memory management

// CONSERVATIVE quality settings for photography portfolio
const QUALITY = {
  avif: { quality: 85, effort: 6, chromaSubsampling: '4:4:4' },
  webp: { quality: 85, effort: 6, smartSubsample: true },
  jpeg: { quality: 90, mozjpeg: true, progressive: true }
};

// Responsive width variants
const WIDTHS = [
  { name: 'full', width: null }, // Original dimensions
  { name: '1800w', width: 1800 },
  { name: '1200w', width: 1200 },
  { name: '800w', width: 800 }
];

// Statistics tracking
const stats = {
  totalImages: 0,
  processedImages: 0,
  skippedImages: 0,
  originalSize: 0,
  optimizedSize: {
    avif: { full: 0, '1800w': 0, '1200w': 0, '800w': 0 },
    webp: { full: 0, '1800w': 0, '1200w': 0, '800w': 0 },
    jpeg: { full: 0, '1800w': 0, '1200w': 0, '800w': 0 }
  },
  variantCounts: {
    avif: { full: 0, '1800w': 0, '1200w': 0, '800w': 0 },
    webp: { full: 0, '1800w': 0, '1200w': 0, '800w': 0 },
    jpeg: { full: 0, '1800w': 0, '1200w': 0, '800w': 0 }
  },
  errors: []
};

/**
 * Check if PNG image has alpha channel (transparency)
 */
async function hasAlphaChannel(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    return metadata.hasAlpha === true;
  } catch (error) {
    console.warn(`Warning: Could not check alpha for ${imagePath}: ${error.message}`);
    return false;
  }
}

/**
 * Check if output file exists (skip if it does)
 * Note: We check existence only, not mtime, because git checkout
 * resets all file mtimes making mtime comparisons unreliable in CI.
 */
async function shouldSkip(sourcePath, outputPath) {
  try {
    await fs.access(outputPath);
    return true; // Output exists, skip
  } catch {
    return false; // Output doesn't exist, process it
  }
}

/**
 * Process a single image into all format and width variants
 */
async function processImage(imagePath, progressBar) {
  const filename = path.basename(imagePath);
  const ext = path.extname(filename).toLowerCase();
  const baseName = path.basename(filename, ext);
  const isPng = ext === '.png';

  try {
    // Get source file size
    const sourceStats = await fs.stat(imagePath);
    stats.originalSize += sourceStats.size;

    // Check for alpha channel (PNG only)
    const hasAlpha = isPng ? await hasAlphaChannel(imagePath) : false;

    // Determine which formats to generate
    // JPEG doesn't support transparency - skip for transparent PNGs
    const formats = hasAlpha
      ? ['avif', 'webp']
      : ['avif', 'webp', 'jpeg'];

    // Get source image metadata for dimensions
    const metadata = await sharp(imagePath).metadata();
    const sourceWidth = metadata.width;

    // Process each format
    for (const format of formats) {
      for (const { name: widthName, width } of WIDTHS) {
        // Skip if source is smaller than target width
        if (width && sourceWidth < width) {
          continue;
        }

        const outputExt = format === 'jpeg' ? '.jpg' : `.${format}`;
        const outputPath = path.join(OUTPUT_DIR, format, widthName, `${baseName}${outputExt}`);

        // Check if we should skip (output newer than source)
        if (await shouldSkip(imagePath, outputPath)) {
          stats.skippedImages++;
          continue;
        }

        // Ensure output directory exists
        await fs.ensureDir(path.dirname(outputPath));

        // Create sharp pipeline
        let pipeline = sharp(imagePath);

        // Resize if not full width
        if (width) {
          pipeline = pipeline.resize({
            width: width,
            withoutEnlargement: true, // Never upscale
            fit: 'inside'
          });
        }

        // Apply format-specific conversion
        switch (format) {
          case 'avif':
            pipeline = pipeline.avif(QUALITY.avif);
            break;
          case 'webp':
            pipeline = pipeline.webp(QUALITY.webp);
            break;
          case 'jpeg':
            pipeline = pipeline.jpeg(QUALITY.jpeg);
            break;
        }

        // Write output file
        await pipeline.toFile(outputPath);

        // Track output size
        const outputStats = await fs.stat(outputPath);
        stats.optimizedSize[format][widthName] += outputStats.size;
        stats.variantCounts[format][widthName]++;
      }
    }

    stats.processedImages++;
    progressBar.increment();

  } catch (error) {
    stats.errors.push({ file: imagePath, error: error.message });
    progressBar.increment();
  }
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Calculate percentage reduction
 */
function percentReduction(original, optimized) {
  if (original === 0) return 0;
  return ((original - optimized) / original * 100).toFixed(1);
}

/**
 * Main optimization function
 */
async function optimizeImages() {
  console.log('\n=== Cassie Cay Photography - Image Optimization ===\n');
  console.log(`Quality settings (CONSERVATIVE for photography):`);
  console.log(`  AVIF: quality ${QUALITY.avif.quality}, effort ${QUALITY.avif.effort}, chroma ${QUALITY.avif.chromaSubsampling}`);
  console.log(`  WebP: quality ${QUALITY.webp.quality}, effort ${QUALITY.webp.effort}`);
  console.log(`  JPEG: quality ${QUALITY.jpeg.quality}, mozjpeg, progressive\n`);

  // Find all images
  const pattern = `${SOURCE_DIR}/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}`;
  const images = await glob(pattern);
  stats.totalImages = images.length;

  console.log(`Found ${images.length} images in ${SOURCE_DIR}/`);
  console.log(`Output: ${OUTPUT_DIR}/ with format and width subdirectories\n`);

  if (images.length === 0) {
    console.log('No images found. Exiting.');
    return;
  }

  // Create progress bar
  const progressBar = new cliProgress.SingleBar({
    format: 'Processing |{bar}| {percentage}% | {value}/{total} images',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  });

  progressBar.start(images.length, 0);

  // Process images with concurrency limit
  const limit = pLimit(CONCURRENCY);
  const tasks = images.map(imagePath =>
    limit(() => processImage(imagePath, progressBar))
  );

  await Promise.all(tasks);
  progressBar.stop();

  // Print results
  console.log('\n=== Optimization Complete ===\n');

  console.log(`Original images: ${formatBytes(stats.originalSize)} (${stats.totalImages} files)`);
  console.log(`Processed: ${stats.processedImages}, Skipped (cached): ${stats.skippedImages}`);

  if (stats.errors.length > 0) {
    console.log(`\nErrors: ${stats.errors.length}`);
    stats.errors.forEach(e => console.log(`  - ${e.file}: ${e.error}`));
  }

  // Size breakdown by format
  console.log('\n--- Size by Format ---');
  for (const format of ['avif', 'webp', 'jpeg']) {
    const formatTotal = Object.values(stats.optimizedSize[format]).reduce((a, b) => a + b, 0);
    if (formatTotal > 0) {
      console.log(`\n${format.toUpperCase()}:`);
      for (const width of ['full', '1800w', '1200w', '800w']) {
        const size = stats.optimizedSize[format][width];
        const count = stats.variantCounts[format][width];
        if (count > 0) {
          console.log(`  ${width}: ${formatBytes(size)} (${count} files) - ${percentReduction(stats.originalSize, size)}% reduction`);
        }
      }
      console.log(`  TOTAL: ${formatBytes(formatTotal)}`);
    }
  }

  // Total optimized size
  const totalOptimized = Object.values(stats.optimizedSize).reduce((formatAcc, widths) =>
    formatAcc + Object.values(widths).reduce((a, b) => a + b, 0), 0);

  console.log(`\n--- Summary ---`);
  console.log(`Total optimized output: ${formatBytes(totalOptimized)}`);
  console.log(`\nRecommended serving strategy:`);
  console.log(`  Gallery thumbnails: 800w AVIF (${formatBytes(stats.optimizedSize.avif['800w'])})`);
  console.log(`  Lightbox/modal: full AVIF (${formatBytes(stats.optimizedSize.avif.full)})`);
  console.log(`  Fallback: WebP variants for Safari < 16`);

  // Calculate practical payload reduction
  const thumbnailPayload = stats.optimizedSize.avif['800w'] || stats.optimizedSize.webp['800w'];
  const fullPayload = stats.optimizedSize.avif.full || stats.optimizedSize.webp.full;
  const practicalPayload = thumbnailPayload + fullPayload;

  console.log(`\nPractical payload (thumbnails + lightbox originals):`);
  console.log(`  ${formatBytes(practicalPayload)} vs original ${formatBytes(stats.originalSize)}`);
  console.log(`  Reduction: ${percentReduction(stats.originalSize, practicalPayload)}%`);
}

// Export for potential programmatic use
export { optimizeImages };

// Run if executed directly
optimizeImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
