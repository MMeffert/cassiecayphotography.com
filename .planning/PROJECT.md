# Cassie Cay Photography - Website Maintenance & Modernization

## What This Is

A comprehensive maintenance and modernization project for Cassie's photography portfolio website. The site is a static HTML/CSS/JS site hosted on AWS (S3 + CloudFront) with a Lambda-powered contact form. This project addresses accumulated tech debt, improves performance, modernizes the frontend tooling, and adds automation to make ongoing maintenance easier—especially for Cassie, who edits the site with Dreamweaver.

## Core Value

**The site must remain fast, secure, and easy for Cassie to update.** Everything else (modernization, automation) supports this goal. A photography portfolio lives and dies by its images loading quickly and the site staying online.

## Current Milestone: v2.0 jQuery Removal & Bootstrap 5 Migration

**Goal:** Remove jQuery dependency entirely by migrating to Bootstrap 5 and replacing all jQuery-dependent plugins with modern vanilla JS alternatives.

**Target features:**
- Migrate from Bootstrap 4 to Bootstrap 5 (no jQuery dependency)
- Replace Cubeportfolio with modern portfolio grid (Isotope or CSS grid + vanilla JS)
- Replace SmartMenus with Bootstrap 5 native navigation or vanilla JS
- Replace Headhesive sticky header with vanilla JS
- Replace scrollUp with vanilla JS scroll-to-top
- Remove jQuery entirely from the build

## Requirements

### Validated

- ✓ Static site hosting on S3 + CloudFront — existing
- ✓ Contact form with reCAPTCHA spam protection — existing
- ✓ GitHub Actions CI/CD deployment — existing
- ✓ SSL/HTTPS via ACM — existing

### Active

**v2.0 — jQuery Removal & Bootstrap 5 Migration:**
- [ ] Migrate from Bootstrap 4 to Bootstrap 5 (no jQuery dependency)
- [ ] Replace Cubeportfolio with modern portfolio grid solution
- [ ] Replace SmartMenus with Bootstrap 5 native or vanilla JS navigation
- [ ] Replace Headhesive sticky header with vanilla JS
- [ ] Replace scrollUp with vanilla JS scroll-to-top
- [ ] Remove jQuery entirely from the build

**Deferred to v2.1+:**
- [ ] Implement folder-based image galleries (WORK-01 from v1)

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
| Keep static HTML structure | Cassie knows HTML, simpler than learning new framework | ✓ Good |
| Replace Revolution Slider with Embla | 11MB → ~6KB, modern, dependency-free | ✓ Good |
| Add build step | Enables optimization without changing source files | ✓ Good |
| Folder-based galleries | Reduces HTML editing for common task (adding photos) | — Deferred to v2.1 |
| Remove jQuery entirely | ~90KB savings, Bootstrap 5 doesn't need it, fewer dependencies | — Pending |
| Bootstrap 4 → 5 migration | Modern standards, better accessibility, no jQuery dependency | — Pending |

---
*Last updated: 2026-01-20 after v2.0 milestone start*
