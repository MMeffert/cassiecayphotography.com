# Cassie Cay Photography - Website Maintenance & Modernization

## What This Is

A modern, fast, jQuery-free photography portfolio website. Static HTML/CSS/JS hosted on AWS (S3 + CloudFront) with Lambda-powered contact form. Built for performance and easy maintenance.

## Core Value

**The site must remain fast, secure, and easy for Cassie to update.** Everything else supports this goal.

## Current State (v2.2 Shipped)

**Production bundle:** ~389KB (33% reduction from baseline)
**Tech stack:** Bootstrap 5.3.3, Muuri, Embla Carousel, GLightbox, vanilla JS
**Infrastructure:** CDK-managed S3/CloudFront, GitHub Actions CI/CD (OIDC)
**Dependencies eliminated:** jQuery, Cubeportfolio, SmartMenus, Headhesive, Revolution Slider

**SEO features (v2.1):**
- JSON-LD structured data (LocalBusiness + Photographer + ImageGallery schemas)
- Twitter Card and Open Graph meta tags for social sharing
- Image sitemap with 100 portfolio images
- AI-generated alt text for 76 portfolio images

## Requirements

### Validated

**v1.0 — Infrastructure & Modernization:**
- ✓ Static site hosting on S3 + CloudFront — v1.0
- ✓ Contact form with reCAPTCHA spam protection — v1.0
- ✓ GitHub Actions CI/CD deployment (OIDC auth) — v1.0
- ✓ SSL/HTTPS via ACM — v1.0
- ✓ Image optimization pipeline — v1.0
- ✓ Replace Revolution Slider with Embla Carousel — v1.0
- ✓ Build step with Vite bundling — v1.0
- ✓ Pre-commit hooks and deploy notifications — v1.0

**v2.0 — jQuery Removal & Bootstrap 5 Migration:**
- ✓ Migrate from Bootstrap 4 to Bootstrap 5 (no jQuery dependency) — v2.0
- ✓ Replace Cubeportfolio with Muuri portfolio grid — v2.0
- ✓ Replace SmartMenus with Bootstrap 5 native navigation — v2.0
- ✓ Replace Headhesive sticky header with vanilla JS — v2.0
- ✓ Replace scrollUp with vanilla JS scroll-to-top — v2.0
- ✓ Remove jQuery entirely from the build — v2.0

**v2.1 — SEO:**
- ✓ SEO-01 to SEO-04: JSON-LD schemas (LocalBusiness, Photographer, ImageGallery) — v2.1
- ✓ SEO-05 to SEO-06: Social meta tags (og:image, Twitter Cards) — v2.1
- ✓ SEO-07 to SEO-10: Image sitemap generation (100 images) — v2.1
- ✓ SEO-11 to SEO-14: AI alt text for 76 portfolio images — v2.1

**v2.2 — Mobile Navigation:**
- ✓ NAV-01 to NAV-06: Bootstrap 5 offcanvas mobile menu — v2.2

### Active

**v2.3+ — Planned features:**
- [ ] Implement folder-based image galleries (WORK-01 from v1)
- [ ] Dark mode toggle

### Out of Scope

| Feature | Reason |
|---------|--------|
| Full framework rewrite (React, Vue) | Static HTML works, Cassie edits in Dreamweaver |
| CMS or headless content management | Too much complexity for use case |
| Mobile app | Web-only |
| E-commerce/payments | Booking handled externally via Appointy |
| User authentication | Public portfolio site |

## Context

**Cassie's Workflow:**
- Edits HTML manually in Dreamweaver
- Commits via Git (finds this difficult)
- Deploy notifications provide clear feedback

**Technical Environment:**
- AWS Account: 241654197557
- CDK v2 for infrastructure
- GitHub Actions for CI/CD (OIDC auth, no stored credentials)
- Lambda (Node.js 24) for contact form
- SES for email delivery
- Secrets Manager for reCAPTCHA API key

**Known Tech Debt:**
- Orphaned files in repo: `style/js/plugins.js` (534KB), `style/js/scripts.js` (59KB) — not loaded in production

## Constraints

- **Static output**: Site must remain static HTML served from S3/CloudFront
- **Cassie-friendly**: Any changes must not make things harder for her
- **AWS only**: Stay within existing AWS infrastructure
- **Budget**: Personal project, minimize ongoing costs (essentially free-tier)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep static HTML structure | Cassie knows HTML, simpler than learning new framework | ✓ Good |
| Replace Revolution Slider with Embla | 11MB → ~6KB, modern, dependency-free | ✓ Good |
| Add build step (Vite) | Enables optimization without changing source files | ✓ Good |
| Bootstrap 4 → 5 migration | Modern standards, better accessibility, no jQuery dependency | ✓ Good |
| Muuri for portfolio grid | 24KB, masonry layout, filtering, no jQuery dependency | ✓ Good |
| Remove jQuery entirely | ~95KB savings, vanilla JS for everything | ✓ Good |
| Vanilla JS sticky header | IntersectionObserver + CSS, no plugin dependencies | ✓ Good |
| Fetch API for contact form | Native browser API, no jQuery AJAX needed | ✓ Good |
| Folder-based galleries | Reduces HTML editing for common task | — Deferred to v2.3+ |
| additionalType for Photographer | Per Google recommendation, simpler than nested schema | ✓ Good |
| ccproxy for Claude Vision | Uses existing infrastructure for AI alt text generation | ✓ Good |
| Image sitemap with postbuild | Automatically regenerates on every build | ✓ Good |
| Offcanvas mobile navigation | Native mobile app-like drawer UX, Bootstrap 5 API | ✓ Good |
| Shared offcanvas instance | Both navbars target same element, simpler state management | ✓ Good |

---
*Last updated: 2026-01-21 after v2.2 milestone completion and contact form bug fix*
