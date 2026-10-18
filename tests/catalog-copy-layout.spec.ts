import { test, expect } from "@playwright/test";
import { waitForCatalogReady } from "./catalog-ready";
test.use({ reducedMotion: "reduce" });
test("global rail stays separate from the document and shares its content columns", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const route of ["/", "/coverage", "/components/button"]) {
    await page.goto(route);
    await waitForCatalogReady(page);
    const rail = (await page.locator(".catalog-toprail").boundingBox())!;
    const sheet = (await page.getByRole("main").boundingBox())!;
    const sidebar = (await page.locator(".catalog-sidebar").boundingBox())!;
    const brand = (await page.locator(".catalog-brand").boundingBox())!;
    if (route === "/") {
      // The landing hero sits between the rail and the document sheet.
      const hero = (await page.locator(".landing-hero").boundingBox())!;
      expect(hero.y).toBeGreaterThanOrEqual(rail.y + rail.height);
      expect(sheet.y).toBeGreaterThanOrEqual(hero.y + hero.height);
    } else expect(sheet.y).toBe(rail.y + rail.height + 12);
    expect(brand.x).toBe(sidebar.x);
    expect(sheet.x - sidebar.x - sidebar.width).toBe(24);
  }
});
test("section paragraphs fill UI content width and long copy wraps naturally across page families", async ({
  page,
}) => {
  for (const width of [1440, 1024, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/coverage",
      "/components/button",
      "/foundations/accessibility",
      "/foundations/motion",
      "/patterns/filter-bar",
    ]) {
      await page.goto(route);
      await waitForCatalogReady(page);
      const measurements = await page
        .locator(".catalog-page-body > section > p")
        .evaluateAll((nodes) =>
          nodes.map((p) => ({
            width: p.getBoundingClientRect().width,
            parent: p.parentElement!.clientWidth,
            clipped:
              p.scrollWidth > p.clientWidth + 1 ||
              p.scrollHeight > p.clientHeight + 1,
          })),
        );
      expect(measurements.length).toBeGreaterThan(0);
      for (const item of measurements) {
        expect(item.width).toBeCloseTo(item.parent, 0);
        expect(item.clipped).toBe(false);
      }
      expect(
        await page
          .locator(".catalog-document-scroll")
          .evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
    }
  }
});
