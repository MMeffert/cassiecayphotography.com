#!/usr/bin/env node
/**
 * Crop an image to 500x500 square for service icons.
 * Uses 'attention' position to focus on the most interesting part of the image.
 *
 * Usage: node scripts/crop-service-image.js <input> <output>
 */

import sharp from 'sharp';

const [,, inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error('Usage: node crop-service-image.js <input> <output>');
  process.exit(1);
}

try {
  await sharp(inputPath)
    .resize(500, 500, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 90 })
    .toFile(outputPath);
  console.log(`Cropped ${inputPath} -> ${outputPath}`);
} catch (err) {
  console.error(`Failed to crop ${inputPath}:`, err.message);
  process.exit(1);
}
