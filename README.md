# Cassie Cay Photography

Professional photography website for [cassiecayphotography.com](https://cassiecayphotography.com) - Madison, Wisconsin photographer specializing in family, newborn, senior, milestone, and couples photography.

## Tech Stack

- Static HTML/CSS/JS site
- Vite for build tooling
- Bootstrap 5
- Hosted on AWS (S3 + CloudFront)
- GitHub Actions for CI/CD

## Development

```bash
npm install
npm run dev      # Start dev server
npm run build    # Production build
```

## Image Processing

Images are automatically optimized on build:
- AVIF, WebP, and JPEG formats
- 800w responsive variants for portfolio
- Full-size for lightbox viewing

## Deployment

Pushes to `main` automatically deploy via GitHub Actions.

## For Cassie

See [EDITING-GUIDE.md](EDITING-GUIDE.md) for instructions on updating text and adding photos.
