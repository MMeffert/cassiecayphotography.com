#!/usr/bin/env node
/**
 * Image Size Validation Script
 *
 * Scans images/ and images-optimized/ directories and warns about oversized files.
 * This is a WARNING tool, not a blocker. Exits with code 0 regardless.
 *
 * Thresholds:
 * - images-optimized/: 500KB (these should be optimized)
 * - images/: 2MB (originals can be larger, informational only)
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Thresholds in bytes
const OPTIMIZED_THRESHOLD = 500 * 1024; // 500KB for optimized images
const ORIGINAL_THRESHOLD = 2 * 1024 * 1024; // 2MB for originals

// Format bytes to human readable
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

// Check a directory for oversized images
async function checkDirectory(dir, threshold, label) {
  const dirPath = path.join(projectRoot, dir);

  if (!fs.existsSync(dirPath)) {
    console.log(`  [SKIP] ${dir}/ does not exist`);
    return [];
  }

  const patterns = ['**/*.{jpg,jpeg,png,gif,webp,avif,svg}'];
  const files = await glob(patterns, { cwd: dirPath, nodir: true });

  const oversized = [];

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    try {
      const stats = fs.statSync(fullPath);
      if (stats.size > threshold) {
        oversized.push({
          path: path.join(dir, file),
          size: stats.size,
          threshold
        });
      }
    } catch (err) {
      // Skip files that can't be read
    }
  }

  return oversized;
}

async function main() {
  console.log('Image Size Validation');
  console.log('=====================\n');

  let totalWarnings = 0;

  // Check optimized images (stricter threshold)
  console.log('Checking images-optimized/ (threshold: 500KB)...');
  const optimizedWarnings = await checkDirectory('images-optimized', OPTIMIZED_THRESHOLD, 'optimized');

  if (optimizedWarnings.length > 0) {
    console.log('\n  \x1b[33mWarnings:\x1b[0m');
    for (const w of optimizedWarnings) {
      console.log(`  \x1b[33mWARNING:\x1b[0m ${w.path} is ${formatSize(w.size)} (exceeds ${formatSize(w.threshold)})`);
    }
    totalWarnings += optimizedWarnings.length;
  } else {
    console.log('  All optimized images are under 500KB');
  }

  // Check original images (looser threshold)
  console.log('\nChecking images/ (threshold: 2MB)...');
  const originalWarnings = await checkDirectory('images', ORIGINAL_THRESHOLD, 'original');

  if (originalWarnings.length > 0) {
    console.log('\n  \x1b[33mWarnings (informational):\x1b[0m');
    for (const w of originalWarnings) {
      console.log(`  \x1b[33mWARNING:\x1b[0m ${w.path} is ${formatSize(w.size)} (exceeds ${formatSize(w.threshold)})`);
    }
    totalWarnings += originalWarnings.length;
  } else {
    console.log('  All original images are under 2MB');
  }

  // Summary
  console.log('\n=====================');
  if (totalWarnings > 0) {
    console.log(`\x1b[33mFound ${totalWarnings} image(s) exceeding size thresholds\x1b[0m`);
  } else {
    console.log('\x1b[32mAll images within size thresholds\x1b[0m');
  }

  // Always exit 0 - these are warnings, not errors
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(0); // Still exit 0, this is a warning tool
});
