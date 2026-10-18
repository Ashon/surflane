import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForCatalogReady } from "./catalog-ready";
test("sidebar hover differs from current selection and neither navigation nor card geometry shifts", async ({
  page,
}) => {
  await page.goto("/");
  await waitForCatalogReady(page);
  const nav = page.getByRole("navigation", {
    name: "Primary navigation",
    exact: true,
  });
  const active = nav.getByRole("link", { name: "Overview", exact: true }),
    layout = nav.getByRole("link", { name: "Foundations", exact: true });
  const background = (el: any) =>
    el.evaluate((node: HTMLElement) => getComputedStyle(node).backgroundColor);
  const selected = await background(active),
    idle = await background(layout),
    before = (await layout.boundingBox())!;
  await layout.hover();
  await expect(layout.locator("svg")).toHaveCount(0);
  await expect.poll(() => background(layout)).not.toBe(idle);
  expect(await background(layout)).not.toBe(idle);
  expect(await background(active)).toBe(selected);
  await expect(active).toHaveAttribute("aria-current", "page");
  await expect(layout).not.toHaveAttribute("aria-current");
  const after = (await layout.boundingBox())!;
  expect(after).toEqual(before);
  const card = page.locator(".catalog-feature-links a").first();
  await card.scrollIntoViewIfNeeded();
  const bounds = (await card.boundingBox())!,
    cardIdle = await background(card);
  await card.hover();
  await expect.poll(() => background(card)).not.toBe(cardIdle);
  expect(await card.boundingBox()).toEqual(bounds);
  await card.click();
  await waitForCatalogReady(page);
  await expect(page.locator("#page-title")).toHaveText("Layout");
  await expect(page.locator("#page-title")).toBeFocused();
});
test("cards retain native link keyboard paths, focus rings, reduced motion and forced-color boundaries", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await waitForCatalogReady(page);
  const cards = page.locator(".catalog-feature-links a");
  await cards.first().focus();
  await page.keyboard.press("Tab");
  await expect(cards.nth(1)).toBeFocused();
  await expect(cards.nth(1)).toHaveCSS("outline-style", "solid");
  await expect(cards.nth(1)).toHaveCSS("transition-duration", "0s");
  await expect(cards.nth(1).locator("svg")).toHaveCSS("translate", "none");
  await page.emulateMedia({ forcedColors: "active" });
  await expect(cards.first()).toHaveCSS("border-top-width", "1px");
  await page.keyboard.press("Enter");
  await waitForCatalogReady(page);
  await expect(page.locator("#page-title")).toHaveText("Typography");
});
for (const theme of ["light", "dark"])
  test(`overview links remain accessible with neutral cards in ${theme}`, async ({
    page,
  }) => {
    await page.goto("/");
    await waitForCatalogReady(page);
    if (theme === "dark") {
      await page.getByRole("button", { name: "Toggle theme" }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(page.locator("html")).not.toHaveAttribute(
        "data-theme-switching",
      );
    }
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
