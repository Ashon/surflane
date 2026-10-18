import { test, expect } from "@playwright/test";
import { waitForCatalogReady } from "./catalog-ready";

const read = (selector: string, names: string[]) =>
  `(() => { const style = getComputedStyle(document.querySelector(${JSON.stringify(selector)})); return ${JSON.stringify(names)}.map((name) => style.getPropertyValue(name).trim()); })()`;
const names = ["--canvas", "--ink", "--surface", "--control-hover-background"];

test("data-theme on any element re-themes its subtree, including alias tokens", async ({
  page,
}) => {
  await page.goto("/");
  await waitForCatalogReady(page);
  await page.evaluate(() => {
    document.documentElement.dataset.theme = "light";
    for (const theme of ["dark", "light"]) {
      const region = document.createElement("div");
      region.dataset.theme = theme;
      region.id = `scoped-${theme}`;
      region.innerHTML = '<span class="probe"></span>';
      document.body.append(region);
    }
  });
  const pageLight = await page.evaluate(read("html", names));
  const scopedDark = await page.evaluate(read("#scoped-dark .probe", names));
  const scopedLight = await page.evaluate(read("#scoped-light .probe", names));
  await page.evaluate(() => (document.documentElement.dataset.theme = "dark"));
  const pageDark = await page.evaluate(read("html", names));
  const scopedLightInDark = await page.evaluate(
    read("#scoped-light .probe", names),
  );
  expect(pageLight).not.toEqual(pageDark);
  expect(scopedDark).toEqual(pageDark);
  expect(scopedLight).toEqual(pageLight);
  expect(scopedLightInDark).toEqual(pageLight);
  // The alias resolves inside the scope instead of inheriting the page's resolved value.
  expect(scopedDark[3]).toBe(scopedDark[2]);
  expect(scopedDark[3]).not.toBe(pageLight[3]);
});
