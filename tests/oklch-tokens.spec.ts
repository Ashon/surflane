import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import postcss from "postcss";
// @ts-ignore Culori is a build/test-only color conversion utility.
import { converter } from "culori";
test("all source color tokens and shadow colors use OKLCH or semantic aliases", () => {
  for (const file of ["tokens.css", "foundation-tokens.css", "motion.css"]) {
    const ast = postcss.parse(readFileSync(`packages/tokens/${file}`, "utf8"));
    ast.walkDecls(/^--/, (decl) => {
      expect(decl.value, decl.prop).not.toMatch(
        /#[\da-f]{3,8}\b|\b(?:rgba?|hsla?)\(|\btransparent\b/i,
      );
    });
  }
});
test("OKLCH accent and status roles retain their configured channels and alpha", () => {
  const ast = postcss.parse(readFileSync("packages/tokens/tokens.css", "utf8"));
  const rgb = converter("rgb");
  const expected = {
    "--brand": "oklch(0.82 0.12 210)",
    "--caution": "#ffd527",
    "--danger": "#ff3333",
  };
  ast.walkDecls(/^--/, (decl) => {
    if (!(decl.prop in expected)) return;
    const original = rgb(expected[decl.prop as keyof typeof expected]);
    const actual = rgb(decl.value);
    for (const channel of ["r", "g", "b"])
      expect(actual[channel]).toBeCloseTo(original[channel], 6);
  });
  const tints: string[] = [];
  ast.walkDecls("--brand-tint", (decl) => {
    tints.push(decl.value);
  });
  expect(tints.map((value) => rgb(value).alpha)).toEqual([
    expect.closeTo(64 / 255, 7),
    expect.closeTo(77 / 255, 7),
    expect.closeTo(77 / 255, 7),
  ]);
});

test("theme JSON is generated from the CSS palette without hex-only parsing", () => {
  const catalog = JSON.parse(
    readFileSync("packages/tokens/catalog.json", "utf8"),
  );
  const theme = JSON.parse(readFileSync("packages/tokens/theme.json", "utf8"));
  const chrome = catalog.tokens.find(
    (token: { name: string }) => token.name === "--chrome",
  );
  expect(theme.dark.chrome).toBe(
    chrome.variants.find(
      (variant: { context: string }) => variant.context === ":root",
    ).value,
  );
  expect(theme.light.chrome).toBe(
    chrome.variants.find(
      (variant: { context: string }) =>
        variant.context === ':root[data-theme="light"]',
    ).value,
  );
  expect(theme.dark.chrome).toMatch(/^oklch\(/);
  expect(theme.light.chrome).toMatch(/^oklch\(/);
});
