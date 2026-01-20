---
phase: 01-quick-fixes
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - index.html
autonomous: true

must_haves:
  truths:
    - "Portfolio image cassiecay-M4-full.png displays when clicked"
    - "Contact form message elements have unique IDs"
    - "No HTML validation errors for duplicate IDs"
  artifacts:
    - path: "index.html"
      provides: "Fixed image link and unique element IDs"
      contains: "cassiecay-M4-full.png"
  key_links:
    - from: "index.html:445"
      to: "images/cassiecay-M4-full.png"
      via: "href attribute"
      pattern: 'href="images/cassiecay-M4-full\.png"'
---

<objective>
Fix two HTML bugs: broken portfolio image link and duplicate element IDs in contact form.

Purpose: Eliminate user-facing bugs that affect portfolio navigation and could cause JavaScript issues
Output: index.html with corrected href and unique element IDs
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/roadmap/ROADMAP.md
@.planning/REQUIREMENTS.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix broken portfolio image link</name>
  <files>index.html</files>
  <action>
  On line 445, change the malformed href from:
  `href="images/cassiecay-M4-fullpng"`
  to:
  `href="images/cassiecay-M4-full.png"`

  The issue is a missing dot before "png" in the filename.
  </action>
  <verify>
  1. `grep -n "cassiecay-M4-fullpng" index.html` returns no results
  2. `grep -n "cassiecay-M4-full.png" index.html` returns line 445
  3. Verify the target file exists: `ls images/cassiecay-M4-full.png`
  </verify>
  <done>Portfolio link points to existing image file with correct .png extension</done>
</task>

<task type="auto">
  <name>Task 2: Fix duplicate message element IDs</name>
  <files>index.html</files>
  <action>
  There are two elements with `id="message"` in the contact form section:
  - Line 731: `<p id="message"></p>` (appears to be unused/legacy)
  - Line 759: `<p id="message" style="margin-top:10px;"></p>` (active message display)

  Fix by removing the first duplicate (line 731) entirely since it appears to be legacy/unused.
  The element on line 759 is the active one used for displaying form submission feedback.

  Delete line 731: `<p id="message"></p>`
  </action>
  <verify>
  1. `grep -c 'id="message"' index.html` returns exactly 1
  2. `grep -n 'id="message"' index.html` shows only one occurrence (around line 758 after deletion)
  3. The remaining element has `style="margin-top:10px;"` attribute
  </verify>
  <done>Contact form has exactly one element with id="message"</done>
</task>

</tasks>

<verification>
1. HTML validation: No duplicate ID errors
2. Portfolio link verified: `grep 'cassiecay-M4-full\.png' index.html` returns match
3. Single message ID: `grep -c 'id="message"' index.html` returns 1
</verification>

<success_criteria>
- BUG-01: Image link corrected from `cassiecay-M4-fullpng` to `cassiecay-M4-full.png`
- BUG-02: Only one element with `id="message"` exists in contact form
- All changes committed to git
</success_criteria>

<output>
After completion, create `.planning/phases/01-quick-fixes/01-01-SUMMARY.md`
</output>
