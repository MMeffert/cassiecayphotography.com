/**
 * HTML Validation Script
 *
 * Uses html-validate to check index.html for structural issues.
 * Configured for legacy site with Revolution Slider compatibility.
 */

import { HtmlValidate } from 'html-validate';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Configure html-validate with rules appropriate for this legacy site
// Focus on critical structural issues, not style/accessibility (which are deferred to future phases)
const htmlvalidate = new HtmlValidate({
  rules: {
    // Critical structural validation - these catch real HTML errors
    'no-dup-id': 'error',
    'no-dup-attr': 'error',
    'attr-quotes': 'error',
    'doctype-html': 'error',

    // Disable all other rules for this legacy site
    // Trailing whitespace, accessibility, and code style are out of scope for CI validation
    'close-order': 'off',             // Legacy HTML has some unclosed elements that don't break rendering
    'element-permitted-content': 'off', // Legacy uses deprecated elements like <center>
    'void-content': 'off',            // Allow self-closing void elements
    'void-style': 'off',              // Allow <br/> style
    'element-required-attributes': 'off',
    'no-deprecated-attr': 'off',
    'deprecated': 'off',
    'no-inline-style': 'off',
    'require-sri': 'off',
    'no-implicit-button-type': 'off',
    'no-raw-characters': 'off',
    'no-trailing-whitespace': 'off',
    'attr-case': 'off',               // Allow data-textAlign, onClick etc
    'attribute-boolean-style': 'off',
    'attribute-allowed-values': 'off',
    'wcag/h30': 'off',                // Accessibility is deferred
    'wcag/h32': 'off',
    'text-content': 'off',
  }
});

async function validateHTML() {
  const htmlPath = resolve(process.cwd(), 'index.html');

  console.log('Validating HTML...');
  console.log(`File: ${htmlPath}\n`);

  let html;
  try {
    html = readFileSync(htmlPath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
  }

  const report = await htmlvalidate.validateString(html, htmlPath);

  if (report.valid) {
    console.log('HTML validation passed - no errors found');
    process.exit(0);
  } else {
    console.error('HTML validation failed:\n');

    for (const result of report.results) {
      for (const message of result.messages) {
        const severity = message.severity === 2 ? 'ERROR' : 'WARN';
        console.error(`  ${severity}: Line ${message.line}:${message.column} - ${message.message}`);
        console.error(`    Rule: ${message.ruleId}\n`);
      }
    }

    const errorCount = report.results.reduce((sum, r) =>
      sum + r.messages.filter(m => m.severity === 2).length, 0);
    const warnCount = report.results.reduce((sum, r) =>
      sum + r.messages.filter(m => m.severity === 1).length, 0);

    console.error(`\nSummary: ${errorCount} error(s), ${warnCount} warning(s)`);

    // Exit with error code only if there are errors (not just warnings)
    process.exit(errorCount > 0 ? 1 : 0);
  }
}

validateHTML().catch(error => {
  console.error(`Validation error: ${error.message}`);
  process.exit(1);
});
