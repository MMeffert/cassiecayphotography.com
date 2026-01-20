# Codebase Concerns

**Analysis Date:** 2025-01-19

## Tech Debt

**Incomplete Domain Migration:**
- Issue: `skipDomainSetup: true` flag prevents domain attachment to CloudFront
- Files: `infrastructure/bin/infrastructure.ts:30`
- Impact: Site may be running on CloudFront default domain instead of custom domain. DNS records (A/AAAA) not created in Route 53.
- Fix approach: Set `skipDomainSetup: false` in `infrastructure/bin/infrastructure.ts` and redeploy after verifying old infrastructure is decommissioned

**Legacy S3 Bucket Permission in IAM Role:**
- Issue: Deployment role grants access to both old (`cassiecayphotography.com`) and new (`cassiecayphotography.com-site-content`) S3 buckets
- Files: `infrastructure/lib/github-oidc-stack.ts:62-67`
- Impact: Unnecessary permissions remain after migration complete; violates least-privilege
- Fix approach: Remove permission for `cassiecayphotography.com` bucket after confirming migration is complete

**Hardcoded Lambda Function URL:**
- Issue: Contact form Lambda URL is hardcoded in HTML instead of being dynamically injected
- Files: `index.html:46`
- Impact: If Lambda is redeployed with new URL, requires manual HTML update. Risk of broken contact form.
- Fix approach: Consider environment variable injection during deployment, or document URL update process

**Outdated jQuery-based Frontend:**
- Issue: Site uses jQuery 3.x and numerous jQuery plugins (Swiper, Revolution Slider, CubePortfolio, etc.)
- Files: `style/js/scripts.js`, `style/js/plugins.js`, `index.html:796-813`
- Impact: Large JavaScript bundle, potential security vulnerabilities in outdated plugins, difficult to maintain
- Fix approach: Long-term: consider modernizing to vanilla JS or modern framework. Short-term: audit and update plugin versions

**Massive Revolution Slider Library:**
- Issue: 11MB+ of Revolution Slider assets, most functionality unused
- Files: `style/revolution/` directory (11MB)
- Impact: Slow initial page load, bandwidth waste, maintenance burden
- Fix approach: Evaluate if simpler slider solution would suffice; remove unused addons and source files

## Known Bugs

**Broken Portfolio Image Link:**
- Symptoms: One portfolio image links to malformed URL
- Files: `index.html:445`
- Trigger: Click on M4 milestone image in portfolio
- Workaround: None - link is broken
- Details: `<a href="images/cassiecay-M4-fullpng">` missing dot before "png"

**Duplicate Message Element IDs:**
- Symptoms: Two elements with `id="message"` in contact form section
- Files: `index.html:731`, `index.html:759`
- Trigger: JavaScript may target wrong element
- Workaround: Works currently but unreliable

## Security Considerations

**reCAPTCHA Site Key Exposed:**
- Risk: reCAPTCHA site key visible in client-side code (expected but worth noting)
- Files: `index.html:5,33`, `infrastructure/lib/contact-form-stack.ts:44`
- Current mitigation: Site key is designed to be public; API key stored in Secrets Manager
- Recommendations: Ensure reCAPTCHA API key in Secrets Manager has proper rotation policy

**SES Wildcard Resource Permission:**
- Risk: Lambda can send email from any SES verified identity (constrained only by FromAddress condition)
- Files: `infrastructure/lib/contact-form-stack.ts:54-63`
- Current mitigation: Condition limits to specific sender address
- Recommendations: Consider tightening to specific SES identity ARN

**CloudFront Invalidation Wildcard:**
- Risk: Deployment role can invalidate any CloudFront distribution in account
- Files: `infrastructure/lib/github-oidc-stack.ts:87-98`
- Current mitigation: None (CloudFront API limitation noted in comment)
- Recommendations: Acceptable given AWS API limitation; ensure role is only assumable by this repo

**No Input Sanitization in Contact Form:**
- Risk: User input passed directly to email body without sanitization
- Files: `infrastructure/lambda/contact-form/index.js:138-144`
- Current mitigation: reCAPTCHA provides spam protection
- Recommendations: Add server-side input validation and sanitization; limit message length

## Performance Bottlenecks

**Large Image Assets:**
- Problem: 81MB of images in repository and deployed to S3
- Files: `images/` directory (222 files)
- Cause: High-resolution photography PNGs and JPGs not optimized for web
- Improvement path: Convert to WebP format, implement responsive images with srcset, consider lazy loading for below-fold images

**Heavy JavaScript Bundle:**
- Problem: Multiple large JS files loaded synchronously
- Files: `index.html:796-813` (14+ script tags)
- Cause: Revolution Slider, jQuery plugins, multiple extensions
- Improvement path: Bundle and minify scripts; defer non-critical scripts; remove unused functionality

**No Build Process for Static Assets:**
- Problem: CSS/JS served as-is without minification or bundling
- Files: All files in `style/` directory
- Cause: No frontend build pipeline exists
- Improvement path: Implement build step (Vite, Parcel, or similar) to bundle, minify, and optimize assets

**Cache Headers Set After Upload:**
- Problem: Cache headers applied via separate S3 copy command for HTML only
- Files: `.github/workflows/deploy.yml:57-62`
- Cause: S3 sync applies immutable cache to all files, then HTML is re-copied with short cache
- Improvement path: Consider setting cache headers per file type during sync, or use CloudFront cache policies

## Fragile Areas

**Contact Form JavaScript:**
- Files: `index.html:8-74`
- Why fragile: Inline JavaScript depends on jQuery, specific element IDs, and external Lambda URL
- Safe modification: Test form submission thoroughly; verify reCAPTCHA flow; check error handling
- Test coverage: None - no automated tests for frontend

**Revolution Slider Configuration:**
- Files: `style/js/scripts.js:343-1103`
- Why fragile: 760+ lines of slider configuration; multiple interdependent options
- Safe modification: Test on multiple device sizes; verify transitions work
- Test coverage: None

**GitHub Actions Deployment:**
- Files: `.github/workflows/deploy.yml`
- Why fragile: Depends on CloudFormation stack outputs, specific S3 bucket name, IAM role
- Safe modification: Test in non-production environment first; verify OIDC authentication
- Test coverage: None

## Scaling Limits

**Lambda Function URL:**
- Current capacity: Burst to 1000 concurrent (AWS default)
- Limit: Contact form could be rate-limited under high traffic
- Scaling path: Current setup adequate for photography portfolio; add throttling/WAF if needed

**S3/CloudFront:**
- Current capacity: Effectively unlimited for static content
- Limit: No known limits for expected traffic
- Scaling path: Current architecture appropriate

## Dependencies at Risk

**Revolution Slider:**
- Risk: Commercial plugin, version unknown, potentially abandoned or requiring license
- Impact: Core homepage functionality depends on it
- Migration plan: Evaluate modern alternatives (Swiper standalone, vanilla JS slider)

**jQuery and Plugins:**
- Risk: jQuery 3.x ecosystem aging; plugins may have security vulnerabilities
- Impact: Entire frontend JavaScript depends on jQuery
- Migration plan: Audit plugin versions; consider gradual migration to vanilla JS

**Node.js 24.x in Lambda:**
- Risk: Recently upgraded to bleeding-edge Node.js version
- Impact: May encounter compatibility issues with AWS SDK
- Migration plan: If issues arise, downgrade to Node.js 20.x (LTS)

## Missing Critical Features

**No 404 Page:**
- Problem: CloudFront error handling redirects all errors to index.html
- Files: `infrastructure/lib/static-site-stack.ts:81-94`
- Blocks: Proper error handling, SEO for missing pages

**No Monitoring/Alerting:**
- Problem: No CloudWatch alarms, no error tracking (Sentry, etc.)
- Blocks: Awareness of issues; Lambda errors go unnoticed

**No SES Verification Status Check:**
- Problem: Lambda assumes SES domain/email is verified
- Files: `infrastructure/lib/contact-form-stack.ts:39`
- Blocks: Contact form silently fails if SES not configured

## Test Coverage Gaps

**No Tests:**
- What's not tested: Everything - frontend, Lambda, CDK infrastructure
- Files: No test files exist in project (only template files in node_modules)
- Risk: Any change could break functionality unnoticed
- Priority: High

**Infrastructure Tests Missing:**
- What's not tested: CDK stack synthesis, CloudFormation template validation
- Files: `infrastructure/` - no test directory
- Risk: CDK deployments could fail or create incorrect resources
- Priority: Medium

**Lambda Tests Missing:**
- What's not tested: Contact form handler, reCAPTCHA verification, email sending
- Files: `infrastructure/lambda/contact-form/index.js`
- Risk: Form submissions could fail silently; reCAPTCHA bypass possible
- Priority: High

**No E2E Tests:**
- What's not tested: Full user flow from form submission to email receipt
- Risk: Integration issues between frontend, Lambda, SES, reCAPTCHA
- Priority: Medium

---

*Concerns audit: 2025-01-19*
