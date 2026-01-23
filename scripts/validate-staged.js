/**
 * Staged Validation Script
 *
 * Pre-commit hook validation combining HTML validation and reference checking.
 * Provides user-friendly error messages for non-technical users (Cassie).
 *
 * Runs:
 * 1. HTML validation (structural issues like duplicate IDs, malformed attributes)
 * 2. Reference checking (missing images, broken links)
 *
 * Exit codes:
 * - 0: All validations passed
 * - 1: Validation failed (blocks commit)
 */

import { HtmlValidate } from 'html-validate';
import { parse } from 'node-html-parser';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const projectRoot = process.cwd();

// ============================================================================
// HTML Validation (from validate-html.js)
// ============================================================================

const htmlvalidate = new HtmlValidate({
  rules: {
    // Critical structural validation - these catch real HTML errors
    'no-dup-id': 'error',
    'no-dup-attr': 'error',
    'attr-quotes': 'error',
    'doctype-html': 'error',

    // Disable all other rules for this legacy site
    'close-order': 'off',
    'element-permitted-content': 'off',
    'void-content': 'off',
    'void-style': 'off',
    'element-required-attributes': 'off',
    'no-deprecated-attr': 'off',
    'deprecated': 'off',
    'no-inline-style': 'off',
    'require-sri': 'off',
    'no-implicit-button-type': 'off',
    'no-raw-characters': 'off',
    'no-trailing-whitespace': 'off',
    'attr-case': 'off',
    'attribute-boolean-style': 'off',
    'attribute-allowed-values': 'off',
    'wcag/h30': 'off',
    'wcag/h32': 'off',
    'text-content': 'off',
  }
});

async function validateHTML(html, htmlPath) {
  const report = await htmlvalidate.validateString(html, htmlPath);
  const errors = [];

  if (!report.valid) {
    for (const result of report.results) {
      for (const message of result.messages) {
        if (message.severity === 2) { // Errors only, not warnings
          errors.push({
            type: 'html',
            rule: message.ruleId,
            message: message.message,
            line: message.line,
            column: message.column,
          });
        }
      }
    }
  }

  return errors;
}

// ============================================================================
// Reference Checking (from check-references.js)
// ============================================================================

function fileExists(relativePath) {
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

function parseSrcset(srcset) {
  if (!srcset) return [];
  return srcset.split(',').map(entry => {
    const parts = entry.trim().split(/\s+/);
    return parts[0];
  }).filter(Boolean);
}

function extractReferences(html) {
  const root = parse(html);
  const references = [];

  // <img src="...">
  const images = root.querySelectorAll('img');
  for (const img of images) {
    const src = img.getAttribute('src');
    if (src) references.push({ type: 'img src', path: src });

    const srcset = img.getAttribute('srcset');
    if (srcset) {
      for (const path of parseSrcset(srcset)) {
        references.push({ type: 'img srcset', path });
      }
    }
  }

  // <source srcset="...">
  const sources = root.querySelectorAll('source');
  for (const source of sources) {
    const srcset = source.getAttribute('srcset');
    if (srcset) {
      for (const path of parseSrcset(srcset)) {
        references.push({ type: 'source srcset', path });
      }
    }
  }

  // <a href="..."> and data-src
  const links = root.querySelectorAll('a');
  for (const link of links) {
    const href = link.getAttribute('href');
    if (href) references.push({ type: 'a href', path: href });

    const dataSrc = link.getAttribute('data-src');
    if (dataSrc) references.push({ type: 'a data-src', path: dataSrc });
  }

  // data-image-src
  const bgImages = root.querySelectorAll('[data-image-src]');
  for (const el of bgImages) {
    const src = el.getAttribute('data-image-src');
    if (src) references.push({ type: 'data-image-src', path: src });
  }

  // data-thumb
  const thumbs = root.querySelectorAll('[data-thumb]');
  for (const el of thumbs) {
    const thumb = el.getAttribute('data-thumb');
    if (thumb) references.push({ type: 'data-thumb', path: thumb });
  }

  // favicon
  const icons = root.querySelectorAll('link[rel="shortcut icon"], link[rel="icon"]');
  for (const icon of icons) {
    const href = icon.getAttribute('href');
    if (href) references.push({ type: 'favicon', path: href });
  }

  return references;
}

function checkReferences(html) {
  const references = extractReferences(html);
  const missing = [];
  const checked = new Set();

  for (const ref of references) {
    if (checked.has(ref.path)) continue;
    checked.add(ref.path);

    if (!fileExists(ref.path)) {
      missing.push(ref);
    }
  }

  return missing;
}

// ============================================================================
// User-Friendly Output
// ============================================================================

function formatErrors(htmlErrors, missingRefs) {
  const lines = [];

  lines.push('');
  lines.push('========================================');
  lines.push('  PRE-COMMIT VALIDATION FAILED');
  lines.push('========================================');
  lines.push('');

  if (htmlErrors.length > 0) {
    lines.push('HTML ERRORS:');
    lines.push('');

    for (const err of htmlErrors) {
      lines.push(`  [Error] ${friendlyMessage(err.rule, err.message)}`);
      lines.push(`     -> Location: index.html, line ${err.line}, column ${err.column}`);
      lines.push(`     -> Fix: ${friendlyFix(err.rule)}`);
      lines.push('');
    }
  }

  if (missingRefs.length > 0) {
    lines.push('MISSING FILES:');
    lines.push('');

    for (const ref of missingRefs) {
      lines.push(`  [Missing] ${ref.path}`);
      lines.push(`     -> Referenced as: ${ref.type} in index.html`);
      lines.push(`     -> Fix: Add the file or update/remove the reference`);
      lines.push('');
    }
  }

  lines.push('----------------------------------------');
  lines.push('Please fix the above issues and try committing again.');
  lines.push('');

  return lines.join('\n');
}

function friendlyMessage(rule, message) {
  // Make technical error messages more understandable
  const friendly = {
    'no-dup-id': 'Duplicate ID found - each id must be unique',
    'no-dup-attr': 'Duplicate attribute on element',
    'attr-quotes': 'Attribute value missing quotes',
    'doctype-html': 'Missing or invalid DOCTYPE',
  };

  return friendly[rule] || message;
}

function friendlyFix(rule) {
  const fixes = {
    'no-dup-id': 'Change one of the duplicate IDs to be unique (e.g., add a number suffix)',
    'no-dup-attr': 'Remove the duplicate attribute from the element',
    'attr-quotes': 'Add double quotes around the attribute value',
    'doctype-html': 'Ensure <!DOCTYPE html> is the first line of the file',
  };

  return fixes[rule] || 'Review and fix the error in the HTML';
}

function formatSuccess() {
  return '\nValidation passed - commit proceeding\n';
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  const startTime = Date.now();
  const htmlPath = resolve(projectRoot, 'index.html');

  // Read HTML file
  let html;
  try {
    html = readFileSync(htmlPath, 'utf-8');
  } catch (error) {
    console.error(`Error reading index.html: ${error.message}`);
    process.exit(1);
  }

  // Run validations in parallel
  const [htmlErrors, missingRefs] = await Promise.all([
    validateHTML(html, htmlPath),
    Promise.resolve(checkReferences(html)),
  ]);

  const duration = Date.now() - startTime;

  // Check results
  const hasErrors = htmlErrors.length > 0 || missingRefs.length > 0;

  if (hasErrors) {
    console.error(formatErrors(htmlErrors, missingRefs));
    process.exit(1);
  } else {
    console.log(formatSuccess());
    console.log(`  Completed in ${duration}ms`);
    process.exit(0);
  }
}

main().catch(error => {
  console.error(`Validation error: ${error.message}`);
  process.exit(1);
});
