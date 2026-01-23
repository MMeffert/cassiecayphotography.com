# v2.4 Decap CMS Integration

## Goal

Add Decap CMS to provide Cassie with a visual admin interface for managing portfolio images without editing HTML or running commands.

## Success Criteria

- [ ] Cassie can log into `/admin/` with her GitHub account
- [ ] She can upload new images through the CMS
- [ ] She can assign categories to images
- [ ] She can reorder images via drag-and-drop
- [ ] Images are automatically optimized on deploy
- [ ] Site remains fully static (no server-side dependencies)

## Scope

**In scope:**
- Decap CMS setup and configuration
- GitHub OAuth authentication
- Image collection schema for portfolio
- Integration with existing image optimization pipeline
- Admin page at `/admin/`

**Out of scope:**
- Editing other site content (about, services, contact) - future enhancement
- Custom CMS styling
- Multiple user roles

## Rollback Plan

If Decap CMS doesn't work well:
1. Delete `/admin/` folder and CMS config
2. Remove any schema files
3. Revert to direct HTML editing via GitHub

No changes to core site structure - easy to remove.

## Technical Approach

1. Add `/admin/index.html` with Decap CMS script
2. Create `/admin/config.yml` with GitHub backend and image collection
3. Configure image widget with upload to `images/` folder
4. GitHub Actions handles optimization on deploy (existing pipeline)
5. Generate portfolio HTML from CMS data or keep hybrid approach

## Open Questions

- Store image data in JSON/YAML files or generate HTML directly?
- How to handle the `<picture>` element complexity with srcsets?
- OAuth app setup - use Netlify Identity or GitHub OAuth directly?
