# Editing Guide - Quick Navigation

Use **Cmd+F** in your text editor to search for these markers in `index.html`:

## Sections

| To edit... | Search for |
|------------|------------|
| Hero slider images | `[EDIT:HERO]` |
| About me section | `[EDIT:ABOUT]` |
| Photo gallery (76 images) | `[EDIT:PORTFOLIO]` |
| Services & pricing | `[EDIT:SERVICES]` |
| Contact section | `[EDIT:CONTACT]` |

## Services

Jump directly to a specific service:

| Service | Search for |
|---------|------------|
| Full Session ($350) | `[SERVICE:Full-Session]` |
| Wedding/Event ($350/hr) | `[SERVICE:Wedding]` |
| Compact Session ($250) | `[SERVICE:Compact]` |
| Senior portraits ($400) | `[SERVICE:Senior]` |
| Fresh 48 hospital ($300) | `[SERVICE:Fresh48]` |
| Newborn session ($450) | `[SERVICE:Newborn]` |

## Portfolio Categories

Each photo has a category class: `class="portfolio-item CATEGORY"`

Categories: `family`, `newborn`, `senior`, `milestone`, `couples`, `wedding`

## Adding New Photos

1. Upload images to the `new-photos/` folder and push to GitHub
2. The workflow will automatically process and add them
3. Or search for `[EDIT:PORTFOLIO]` and add manually
