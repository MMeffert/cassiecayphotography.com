/**
 * Reference Checker Script
 *
 * Validates that all image and internal link references in index.html
 * point to files that actually exist.
 */

import { parse } from 'node-html-parser';
import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';

const projectRoot = process.cwd();

/**
 * Check if a file exists in the project
 */
function fileExists(relativePath) {
  // Skip external URLs, anchors, and data URIs
  if (
    relativePath.startsWith('http://') ||
    relativePath.startsWith('https://') ||
    relativePath.startsWith('//') ||
    relativePath.startsWith('#') ||
    relativePath.startsWith('data:') ||
    relativePath.startsWith('mailto:') ||
    relativePath.startsWith('tel:')
  ) {
    return true; // Skip external references
  }

  const fullPath = resolve(projectRoot, relativePath);
  return existsSync(fullPath);
}

/**
 * Parse srcset attribute and extract all image paths
 */
function parseSrcset(srcset) {
  if (!srcset) return [];

  // srcset format: "path1 800w, path2 1200w" or "path1 1x, path2 2x"
  return srcset.split(',').map(entry => {
    const parts = entry.trim().split(/\s+/);
    return parts[0]; // First part is the path, second is the width descriptor
  }).filter(Boolean);
}

/**
 * Extract all references from HTML
 */
function extractReferences(html) {
  const root = parse(html);
  const references = [];

  // 1. <img src="..."> attributes
  const images = root.querySelectorAll('img');
  for (const img of images) {
    const src = img.getAttribute('src');
    if (src) {
      references.push({ type: 'img src', path: src, element: img.toString().substring(0, 100) });
    }

    // Also check srcset on img elements
    const srcset = img.getAttribute('srcset');
    if (srcset) {
      for (const path of parseSrcset(srcset)) {
        references.push({ type: 'img srcset', path, element: img.toString().substring(0, 100) });
      }
    }
  }

  // 2. <source srcset="..."> attributes (picture elements)
  const sources = root.querySelectorAll('source');
  for (const source of sources) {
    const srcset = source.getAttribute('srcset');
    if (srcset) {
      for (const path of parseSrcset(srcset)) {
        references.push({ type: 'source srcset', path, element: source.toString().substring(0, 100) });
      }
    }
  }

  // 3. <a href="..."> for internal links (also handles lightbox data-src pattern via href)
  const links = root.querySelectorAll('a');
  for (const link of links) {
    const href = link.getAttribute('href');
    if (href) {
      references.push({ type: 'a href', path: href, element: link.toString().substring(0, 100) });
    }

    // Check data-src for lightbox images
    const dataSrc = link.getAttribute('data-src');
    if (dataSrc) {
      references.push({ type: 'a data-src', path: dataSrc, element: link.toString().substring(0, 100) });
    }
  }

  // 4. data-image-src for background images (used by this template)
  const bgImages = root.querySelectorAll('[data-image-src]');
  for (const el of bgImages) {
    const src = el.getAttribute('data-image-src');
    if (src) {
      references.push({ type: 'data-image-src', path: src, element: el.toString().substring(0, 100) });
    }
  }

  // 5. data-thumb for Revolution Slider thumbnails
  const thumbs = root.querySelectorAll('[data-thumb]');
  for (const el of thumbs) {
    const thumb = el.getAttribute('data-thumb');
    if (thumb) {
      references.push({ type: 'data-thumb', path: thumb, element: el.toString().substring(0, 100) });
    }
  }

  // 6. <link rel="shortcut icon" href="...">
  const icons = root.querySelectorAll('link[rel="shortcut icon"], link[rel="icon"]');
  for (const icon of icons) {
    const href = icon.getAttribute('href');
    if (href) {
      references.push({ type: 'favicon', path: href, element: icon.toString() });
    }
  }

  return references;
}

/**
 * Main validation function
 */
async function checkReferences() {
  const htmlPath = resolve(projectRoot, 'index.html');

  console.log('Checking references...');
  console.log(`File: ${htmlPath}\n`);

  let html;
  try {
    html = readFileSync(htmlPath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
  }

  const references = extractReferences(html);
  const missing = [];
  const checked = new Set();

  for (const ref of references) {
    // Skip duplicates (same path checked multiple times)
    if (checked.has(ref.path)) continue;
    checked.add(ref.path);

    if (!fileExists(ref.path)) {
      missing.push(ref);
    }
  }

  console.log(`Checked ${checked.size} unique references\n`);

  if (missing.length === 0) {
    console.log('All references valid - no missing files found');
    process.exit(0);
  } else {
    console.error(`Found ${missing.length} missing reference(s):\n`);

    for (const ref of missing) {
      console.error(`  MISSING: ${ref.path}`);
      console.error(`    Type: ${ref.type}`);
      console.error(`    Element: ${ref.element}...\n`);
    }

    process.exit(1);
  }
}

checkReferences().catch(error => {
  console.error(`Reference check error: ${error.message}`);
  process.exit(1);
});
