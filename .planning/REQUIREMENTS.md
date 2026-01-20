# Requirements: Cassie Cay Photography

## v1 Requirements

### Bug Fixes

| ID | Requirement | Priority |
|----|-------------|----------|
| BUG-01 | Fix broken portfolio image link (`cassiecay-M4-fullpng` -> `cassiecay-M4-full.png`) | High |
| BUG-02 | Fix duplicate `id="message"` elements in contact form HTML | Medium |
| BUG-03 | Fix Revolution Slider pause-on-hover for full-page hero (should not pause when cursor over page) | Medium |

### Infrastructure & Security

| ID | Requirement | Priority |
|----|-------------|----------|
| INFRA-01 | Complete domain migration (set `skipDomainSetup: false`, delete old CloudFront) | High |
| INFRA-02 | Update CDK and npm dependencies to latest versions | Medium |
| INFRA-03 | Remove legacy S3 bucket permission from GitHub OIDC role | Low |
| INFRA-04 | Add dependency vulnerability scanning (Dependabot security alerts) | Medium |

### Automation & Build

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTO-01 | Add build step to bundle and minify CSS/JS | High |
| AUTO-02 | Add HTML validation in CI (catch broken links, malformed tags before deploy) | Medium |
| AUTO-03 | Add image validation in CI (missing files, oversized images) | Medium |
| AUTO-04 | Add pre-commit hooks for local validation | Low |
| AUTO-05 | Add deploy notifications (email when deploy succeeds/fails) | Medium |
| AUTO-06 | Add Lighthouse performance check in CI pipeline | Low |

### Performance

| ID | Requirement | Priority |
|----|-------------|----------|
| PERF-01 | Implement image optimization pipeline (compress existing images, convert to WebP/AVIF) | High |
| PERF-02 | Add lazy loading for below-fold images | Medium |
| PERF-03 | Reduce JavaScript bundle size | Medium |

### Frontend Modernization

| ID | Requirement | Priority |
|----|-------------|----------|
| FRONT-01 | Replace Revolution Slider (11MB) with lightweight alternative (Embla or similar) | Low |
| FRONT-02 | Replace/update jQuery plugins with modern equivalents | Low |
| FRONT-03 | Remove unused JavaScript files and code | Medium |

### Workflow Improvements

| ID | Requirement | Priority |
|----|-------------|----------|
| WORK-01 | Implement folder-based image galleries (adding photos shouldn't require HTML editing) | Low |
| WORK-02 | Provide clear deploy feedback for Cassie (notifications, status page, or similar) | Medium |

## v2+ (Out of Scope)

- Full framework rewrite (React, Vue, etc.)
- CMS or headless content management
- Mobile app
- E-commerce/payments
- User authentication
- Dark mode toggle
- Blurhash image placeholders
- Infinite scroll galleries

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BUG-01 | Phase 1 | Complete ✓ |
| BUG-02 | Phase 1 | Complete ✓ |
| INFRA-01 | Phase 1 | Complete ✓ |
| INFRA-02 | Phase 1 | Complete ✓ |
| INFRA-03 | Phase 1 | Complete ✓ |
| INFRA-04 | Phase 1 | Complete ✓ |
| AUTO-01 | Phase 2 | Complete ✓ |
| PERF-01 | Phase 3 | Complete ✓ |
| PERF-02 | Phase 3 | Complete ✓ |
| AUTO-02 | Phase 4 | Pending |
| AUTO-03 | Phase 4 | Pending |
| AUTO-06 | Phase 4 | Pending |
| AUTO-05 | Phase 5 | Pending |
| WORK-02 | Phase 5 | Pending |
| AUTO-04 | Phase 6 | Pending |
| PERF-03 | Phase 7 | Pending |
| FRONT-03 | Phase 7 | Pending |
| FRONT-01 | Phase 8 | Pending |
| FRONT-02 | Phase 8 | Pending |
| WORK-01 | Phase 9 | Pending |
| BUG-03 | Phase 8 | Pending |

**Coverage:** 21/21 v1 requirements mapped to phases

---
*Requirements extracted: 2026-01-19*
*Source: PROJECT.md Active Requirements*
