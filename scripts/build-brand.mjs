import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
// Renders the raster brand assets from demo/public/brand/mark.svg.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pub = resolve(root, "demo/public");
const d = readFileSync(resolve(pub, "brand/mark.svg"), "utf8").match(
  / d="([^"]+)"/,
)[1];
const font = (path) =>
  `data:font/woff2;base64,${readFileSync(resolve(root, "node_modules", path)).toString("base64")}`;
const ink = "#1b1f23",
  paper = "#f6f8fa",
  muted = "#3b434b";
const mark = (size, fill) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 64 64"><path fill="${fill}" d="${d}"/></svg>`;
const page = (body, background) => `<!doctype html><style>
@font-face { font-family: Manrope; src: url(${font("@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2")}); font-weight: 200 800; }
html, body { margin: 0; background: ${background}; }
body { font-family: Manrope, sans-serif; color: ${ink}; }
.center { display: grid; place-items: center; width: 100vw; height: 100vh; }
/* Lockup: mark 1.1em, gap 0.4em (docs/brand.md). */
.lockup { display: inline-flex; align-items: center; gap: 0.4em; padding: 4px; font-weight: 500; font-size: 84px; letter-spacing: -0.02em; line-height: 1; }
</style><body>${body}</body>`;
const lockup = (color) =>
  page(
    `<div class="lockup" style="color:${color}">${mark(92, color)}Surflane</div>`,
    "transparent",
  );
const og = page(
  `<div style="position:relative;width:1200px;height:630px;overflow:hidden">
  <div style="position:absolute;left:96px;top:96px;font-size:72px" class="lockup">${mark(79, ink)}Surflane</div>
  <div style="position:absolute;left:96px;top:276px;font:500 56px/1.2 Manrope;letter-spacing:-0.02em">Design system for<br>platform development</div>
  <div style="position:absolute;left:96px;bottom:88px;font:500 26px Manrope;color:${muted}">React components · Design tokens · Patterns</div>
  <div style="position:absolute;right:-150px;top:150px;opacity:.08">${mark(560, ink)}</div>
</div>`,
  paper,
);
const icon = (size, scale) =>
  page(
    `<div class="center">${mark(Math.round(size * scale), ink)}</div>`,
    paper,
  );
const assets = [
  ["og.png", og, 1200, 630],
  ["apple-touch-icon.png", icon(180, 0.62), 180, 180],
  // Maskable icons keep the mark inside the 80% safe zone.
  ["brand/icon-192.png", icon(192, 0.5), 192, 192],
  ["brand/icon-512.png", icon(512, 0.5), 512, 512],
  ["brand/lockup-light.png", lockup(ink), null, null],
  ["brand/lockup-dark.png", lockup(paper), null, null],
];
const browser = await chromium.launch();
const tab = await browser.newPage({ deviceScaleFactor: 1 });
for (const [file, html, width, height] of assets) {
  await tab.setViewportSize({ width: width ?? 800, height: height ?? 200 });
  await tab.setContent(html);
  await tab.evaluate(() => document.fonts.ready);
  const target = width ? tab : tab.locator(".lockup");
  await target.screenshot({
    path: resolve(pub, file),
    omitBackground: !width,
  });
  console.log(`demo/public/${file}`);
}
await browser.close();
