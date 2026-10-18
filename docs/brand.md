# Brand

Surflane's mark is **Shell**: a near-black rounded square cut into the three regions of an application shell (sidebar, header and content). It abstracts the information architecture the design system serves.

## Mark

- Built on a 64-unit grid with a 4-unit module. At 16 px one module is one pixel, so the gutters stay sharp at favicon size.
- The outline is a superellipse (n = 5), a continuous-curvature corner rather than a circular radius.
- The sidebar is 16 units wide and the header 16 units tall, so they share one module. Both gutters are 4 units and are cut out, so the background shows through them.
- Source: [`demo/public/brand/mark.svg`](../demo/public/brand/mark.svg). It is a single path without masks, so it works in favicons, CSS masks and image renderers.

## Color

| Role       | Value                              | Use                                 |
| ---------- | ---------------------------------- | ----------------------------------- |
| Ink        | `#1b1f23` (`--ink` in light theme) | Mark and wordmark on light surfaces |
| Paper      | `#f6f8fa` (`--ink` in dark theme)  | Mark and wordmark on dark surfaces  |
| Brand cyan | `#50d9ef` (`oklch(0.82 0.12 210)`) | Product accents, not the mark       |

The mark is monochrome. In the catalog it follows `currentColor`, so it inverts with the theme.

## Wordmark and lockup

- "Surflane" in Manrope Medium (500, the system's maximum weight) with −2% tracking.
- The mark is 1.1 × the wordmark's font size and the gap is 0.4 × the font size: a 22 px mark and an 8 px gap at 20 px text.
- Keep clear space of at least a quarter of the mark (the sidebar width) around the lockup. Don't use the mark below 16 px.

## Assets

`npm run build:brand` renders the PNGs from `mark.svg` with the bundled Manrope font:

| File                                        | Size       | Use                                         |
| ------------------------------------------- | ---------- | ------------------------------------------- |
| `demo/public/favicon.svg`                   | vector     | Browser tab; switches to paper in dark mode |
| `demo/public/apple-touch-icon.png`          | 180²       | iOS home screen                             |
| `demo/public/brand/icon-{192,512}.png`      | 192², 512² | Web manifest, maskable safe zone            |
| `demo/public/og.png`                        | 1200×630   | Link previews (Open Graph, Twitter)         |
| `demo/public/brand/lockup-{light,dark}.png` | 456×100    | README and npm headers                      |

Copyright (c) 2026 ashon. The mark and wordmark are covered by the repository license.
