# Codebase Structure

**Analysis Date:** 2026-01-19

## Directory Layout

```
cassiecayphotography.com/
├── .github/                    # GitHub configuration
│   ├── workflows/              # CI/CD pipelines
│   │   ├── deploy.yml          # Main deployment workflow
│   │   └── dependabot-auto-merge.yml
│   └── dependabot.yml          # Dependency updates config
├── .planning/                  # GSD planning documents
│   └── codebase/               # Architecture analysis docs
├── images/                     # Photography images (~220 files)
├── infrastructure/             # AWS CDK infrastructure
│   ├── bin/                    # CDK app entry point
│   ├── lib/                    # CDK stack definitions
│   ├── lambda/                 # Lambda function code
│   │   └── contact-form/       # Contact form handler
│   ├── cdk.json                # CDK configuration
│   ├── package.json            # Infrastructure dependencies
│   └── tsconfig.json           # TypeScript config
├── style/                      # CSS, JS, and assets
│   ├── css/                    # Stylesheets
│   │   ├── color/              # Color theme variations
│   │   └── font/               # Font files
│   ├── js/                     # JavaScript libraries
│   ├── revolution/             # Revolution Slider plugin
│   ├── type/                   # Typography assets
│   └── style.css               # Main custom styles
├── CLAUDE.md                   # Project instructions
├── index.html                  # Main website (single page)
├── robots.txt                  # Search engine directives
└── sitemap.xml                 # SEO sitemap
```

## Directory Purposes

**`/` (Root):**
- Purpose: Static site content that gets deployed to S3
- Contains: HTML, SEO files, project config
- Key files: `index.html`, `robots.txt`, `sitemap.xml`, `CLAUDE.md`

**`/images/`:**
- Purpose: Photography portfolio images
- Contains: JPG, PNG files (backgrounds, portfolio, logo)
- Key files: `cassiecay-*.jpg`, `cassiecay-*.png`, `cassiecaylogobw2.png` (logo)
- Note: ~220 image files totaling ~80MB

**`/style/`:**
- Purpose: Frontend styling and JavaScript
- Contains: CSS, JS, fonts, Revolution Slider
- Key files: `style.css` (main custom styles, 140KB)

**`/style/css/`:**
- Purpose: Third-party CSS frameworks
- Contains: Bootstrap, plugins, color themes
- Key files: `bootstrap.min.css`, `plugins.css`

**`/style/js/`:**
- Purpose: JavaScript libraries
- Contains: jQuery, Bootstrap JS, Popper, custom scripts
- Key files: `jquery.min.js`, `bootstrap.min.js`, `scripts.js`, `plugins.js`

**`/style/revolution/`:**
- Purpose: Revolution Slider image carousel
- Contains: CSS, JS, extensions, addons, fonts, assets
- Key files: `js/jquery.themepunch.revolution.min.js`, `css/settings.css`

**`/infrastructure/`:**
- Purpose: AWS CDK infrastructure code
- Contains: TypeScript stacks, Lambda code, configs
- Key files: `bin/infrastructure.ts`, `lib/*.ts`, `package.json`

**`/infrastructure/lib/`:**
- Purpose: CDK stack definitions
- Contains: TypeScript stack classes
- Key files:
  - `static-site-stack.ts` - S3, CloudFront, Route 53, ACM
  - `github-oidc-stack.ts` - IAM role for GitHub Actions
  - `contact-form-stack.ts` - Lambda, Function URL, Secrets Manager

**`/infrastructure/lambda/contact-form/`:**
- Purpose: Contact form Lambda handler
- Contains: Node.js handler code
- Key files: `index.js` (exports.handler)

**`/.github/workflows/`:**
- Purpose: GitHub Actions CI/CD
- Contains: YAML workflow definitions
- Key files: `deploy.yml` (main deployment pipeline)

## Key File Locations

**Entry Points:**
- `index.html`: Main website (single-page, ~45KB)
- `infrastructure/bin/infrastructure.ts`: CDK app entry
- `infrastructure/lambda/contact-form/index.js`: Lambda handler

**Configuration:**
- `infrastructure/cdk.json`: CDK settings and context
- `infrastructure/package.json`: Infrastructure dependencies
- `infrastructure/tsconfig.json`: TypeScript compiler config
- `.github/workflows/deploy.yml`: CI/CD pipeline config

**Core Logic:**
- `index.html` lines 8-75: Contact form JavaScript (submitToAPI)
- `infrastructure/lib/static-site-stack.ts`: Static hosting setup
- `infrastructure/lambda/contact-form/index.js`: Form processing

**Styling:**
- `style/style.css`: Main custom styles (140KB)
- `style/css/bootstrap.min.css`: Bootstrap framework
- `style/css/color/oasis.css`: Color theme

**Testing:**
- No test files present (infrastructure or frontend)

## Naming Conventions

**Files:**
- HTML: lowercase (`index.html`)
- TypeScript stacks: kebab-case (`static-site-stack.ts`)
- Lambda handlers: `index.js`
- CSS: lowercase (`style.css`, `plugins.css`)
- Images: prefix with `cassiecay-` (e.g., `cassiecay-slider7.jpg`)

**Directories:**
- lowercase with hyphens (`contact-form`, `github-oidc`)
- Third-party: original names preserved (`revolution`, `bootstrap`)

**CDK Resources:**
- PascalCase IDs (`SiteBucket`, `ContactFormFunction`)
- Stack names: `CassiePhoto*Stack` pattern
- Export names: `CassiePhoto*` pattern

## Where to Add New Code

**New Static Page:**
- Add HTML file in root directory
- Reference from navigation in `index.html`
- Update `sitemap.xml` with new URL

**New Image:**
- Add to `/images/` directory
- Follow naming: `cassiecay-{category}-{name}.{ext}`
- Reference in HTML with lazy loading

**New CSS Styles:**
- Add to `style/style.css` (preferred)
- Or create new file in `style/css/` and link in HTML

**New Lambda Function:**
- Create directory in `infrastructure/lambda/{function-name}/`
- Add `index.js` with `exports.handler`
- Create stack in `infrastructure/lib/{function-name}-stack.ts`
- Register in `infrastructure/bin/infrastructure.ts`

**New CDK Stack:**
- Create `infrastructure/lib/{name}-stack.ts`
- Export class `{Name}Stack`
- Import and instantiate in `infrastructure/bin/infrastructure.ts`
- Add appropriate tags (Application, Environment, ManagedBy, Repository)

**New GitHub Workflow:**
- Create `/.github/workflows/{name}.yml`
- Include OIDC permissions if AWS access needed

## Special Directories

**`/infrastructure/cdk.out/`:**
- Purpose: CDK synthesis output (CloudFormation templates)
- Generated: Yes (by `cdk synth`)
- Committed: No (in `.gitignore`)

**`/infrastructure/node_modules/`:**
- Purpose: Infrastructure dependencies
- Generated: Yes (by `npm install`)
- Committed: No (in `.gitignore`)

**`/infrastructure/dist/`:**
- Purpose: Compiled TypeScript output
- Generated: Yes (by `npm run build`)
- Committed: No (in `.gitignore`)

**`/.planning/`:**
- Purpose: GSD planning and analysis documents
- Generated: By GSD commands
- Committed: Yes

---

*Structure analysis: 2026-01-19*
