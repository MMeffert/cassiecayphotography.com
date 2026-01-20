# Cassie Cay Photography - Website Maintenance & Modernization

## What This Is

A comprehensive maintenance and modernization project for Cassie's photography portfolio website. The site is a static HTML/CSS/JS site hosted on AWS (S3 + CloudFront) with a Lambda-powered contact form. This project addresses accumulated tech debt, improves performance, modernizes the frontend tooling, and adds automation to make ongoing maintenance easier—especially for Cassie, who edits the site with Dreamweaver.

## Core Value

**The site must remain fast, secure, and easy for Cassie to update.** Everything else (modernization, automation) supports this goal. A photography portfolio lives and dies by its images loading quickly and the site staying online.

## Requirements

### Validated

- ✓ Static site hosting on S3 + CloudFront — existing
- ✓ Contact form with reCAPTCHA spam protection — existing
- ✓ GitHub Actions CI/CD deployment — existing
- ✓ SSL/HTTPS via ACM — existing

### Active

**Bug Fixes:**
- [ ] Fix broken portfolio image link (`cassiecay-M4-fullpng` → `cassiecay-M4-full.png`)
- [ ] Fix duplicate `id="message"` elements in contact form HTML

**Infrastructure & Security:**
- [ ] Complete domain migration (set `skipDomainSetup: false`, delete old CloudFront)
- [ ] Update CDK and npm dependencies to latest versions
- [ ] Remove legacy S3 bucket permission from GitHub OIDC role
- [ ] Add dependency vulnerability scanning (Dependabot security alerts)

**Automation & Build Checks:**
- [ ] Add build step to bundle and minify CSS/JS
- [ ] Add HTML validation in CI (catch broken links, malformed tags before deploy)
- [ ] Add image validation in CI (missing files, oversized images)
- [ ] Add pre-commit hooks for local validation
- [ ] Add deploy notifications (email when deploy succeeds/fails)
- [ ] Add Lighthouse performance check in CI pipeline

**Performance:**
- [ ] Implement image optimization pipeline (compress existing images, convert to WebP)
- [ ] Add lazy loading for below-fold images
- [ ] Reduce JavaScript bundle size

**Frontend Modernization:**
- [ ] Replace Revolution Slider (11MB) with lightweight alternative (Swiper or similar)
- [ ] Replace/update jQuery plugins with modern equivalents
- [ ] Remove unused JavaScript files and code

**Workflow Improvements:**
- [ ] Implement folder-based image galleries (adding photos shouldn't require HTML editing)
- [ ] Provide clear deploy feedback for Cassie (notifications, status page, or similar)

### Out of Scope

- Full framework rewrite (React, Vue, etc.) — keeping static HTML structure
- CMS or headless content management — too much complexity for the use case
- Mobile app — web-only
- E-commerce/payments — booking handled externally via Appointy
- User authentication — public portfolio site

## Context

**Current State:**
- Site works but has accumulated tech debt
- 81MB of images not optimized for web
- 11MB Revolution Slider library (most functionality unused)
- jQuery 3.x with multiple plugins of unknown vintage
- Zero test coverage
- No build process for frontend assets
- Domain still pointing to old manually-created CloudFront (CDK infrastructure ready but not fully migrated)

**Cassie's Workflow:**
- Edits HTML manually in Dreamweaver
- Commits via Git (finds this difficult)
- Rarely updates because the process is painful
- Needs clear feedback that deploys succeeded

**Technical Environment:**
- AWS Account: 241654197557
- CDK v2 for infrastructure
- GitHub Actions for CI/CD (OIDC auth, no stored credentials)
- Lambda (Node.js 24) for contact form
- SES for email delivery
- Secrets Manager for reCAPTCHA API key

## Constraints

- **Static output**: Site must remain static HTML served from S3/CloudFront — no server-side rendering or dynamic backends (except existing Lambda for contact form)
- **Cassie-friendly**: Any changes to workflow must not make things harder for her
- **AWS only**: Stay within existing AWS infrastructure (no new cloud providers)
- **Budget**: Personal project, minimize ongoing costs (current setup is essentially free-tier)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep static HTML structure | Cassie knows HTML, simpler than learning new framework | — Pending |
| Replace Revolution Slider with Swiper | 11MB → ~200KB, modern, well-maintained | — Pending |
| Add build step | Enables optimization without changing source files | — Pending |
| Folder-based galleries | Reduces HTML editing for common task (adding photos) | — Pending |

---
*Last updated: 2026-01-19 after initialization*
