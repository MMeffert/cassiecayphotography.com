# Phase 8: Library Modernization - Context

**Gathered:** 2026-01-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace Revolution Slider and LightGallery with modern lightweight alternatives (targeting Embla Carousel ~6KB and GLightbox ~11KB). Remove jQuery if no longer needed after migration. Preserve all current visual and interaction behavior that users experience.

</domain>

<decisions>
## Implementation Decisions

### Slider feature scope
- Hero slider is essential showcase piece — must feel polished and intentional
- Auto-advance only (no manual navigation arrows/dots needed)
- No pause-on-hover — continuous play
- No touch/swipe support needed — auto-advance only on mobile too
- Minimal feature set: auto-advance through images with smooth transitions

### Migration strategy
- Replace all heavy libraries at once (slider + lightbox together)
- Remove jQuery if possible after migration
- Claude decides: if jQuery removal requires significant changes beyond slider/lightbox, judge based on scope
- Claude decides rollback approach (likely git revert + redeploy given simple deployment)

### Visual fidelity tolerance
- Any smooth transition is acceptable — doesn't need to match Revolution Slider exactly
- Text overlays on slides: needs audit to see what exists; Claude decides if complex overlays should be preserved or simplified
- Standard 5-7 second timing between slides (not necessarily matching current)
- Focus: professional, smooth, not jarring

### Lightbox behavior
- All aspects equally important: gallery navigation, image quality, fast loading
- Opens whole gallery with prev/next navigation (not single image)
- Claude decides gallery grouping based on site structure
- No captions — clean, image-only view

### Claude's Discretion
- Rollback strategy (likely simple git revert)
- jQuery removal decision based on actual usage audit
- Text overlay handling based on what actually exists
- Gallery grouping logic based on site structure
- Specific library choices if alternatives to Embla/GLightbox prove better

</decisions>

<specifics>
## Specific Ideas

- Slider is the "showcase piece" first impression — needs to feel polished
- Lightbox should be clean, image-focused (no captions/text overlays)
- Mobile experience is passive (auto-advance, no swipe gestures needed)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-library-modernization*
*Context gathered: 2026-01-20*
