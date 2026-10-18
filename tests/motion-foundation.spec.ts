import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForCatalogReady } from "./catalog-ready";

test("preview cycles the shared theme and preserves a modal draft and active control", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("/foundations/motion");
  await waitForCatalogReady(page);
  await expect(
    page.locator('[data-motion-token="--dialog-exit-duration"]'),
  ).toHaveText("0ms");
  await page
    .getByRole("button", { name: "Open motion dialog", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Dialog motion preview" });
  await dialog
    .getByRole("textbox", { name: "Preview draft" })
    .fill("유지되는 초안 / retained draft");
  const cycle = dialog.getByRole("button", { name: "Cycle theme in dialog" });
  await cycle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(cycle).toBeFocused();
  await cycle.click();
  await expect(
    page.locator('button[aria-label^="Toggle theme:"]'),
  ).toHaveAttribute("aria-label", "Toggle theme: System");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("[data-motion-theme]")).toHaveText("dark");
  await expect(dialog.getByRole("textbox")).toHaveValue(
    "유지되는 초안 / retained draft",
  );
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open motion dialog", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Cycle preview theme" }).click();
  await expect(page.locator("[data-motion-theme]")).toHaveText("light");
  await page
    .getByRole("button", { name: "Open motion dialog", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Preview draft" }),
  ).toHaveValue("유지되는 초안 / retained draft");
});

test("OS reduced motion changes update the guide and remove actual popup transitions without rewriting tokens", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/foundations/motion");
  await waitForCatalogReady(page);
  await expect(page.locator("[data-motion-preference]")).toHaveText(
    "No preference",
  );
  await page
    .getByRole("button", { name: "Open motion dialog", exact: true })
    .click();
  const popup = page.locator(".pui-dialog-popup");
  await expect(popup).toBeVisible();
  expect(
    await popup.evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0.2s, 0.2s");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-motion-preference]")).toHaveText("Reduce");
  expect(
    await popup.evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  await expect(
    page.locator('[data-motion-token="--dialog-enter-duration"]'),
  ).toHaveText("200ms");
  await page.keyboard.press("Escape");
  await expect(popup).toBeHidden();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("[data-motion-preference]")).toHaveText(
    "No preference",
  );
});

test("sheet uses its shared directional transition and honors reduced motion and focus restoration", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/foundations/motion");
  await waitForCatalogReady(page);
  const trigger = page.getByRole("button", {
    name: "Open motion sheet",
    exact: true,
  });
  await trigger.click();
  const panel = page.locator(".pui-panel");
  await expect(panel).toHaveAttribute("data-side", "right");
  expect(
    await panel.evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0.2s");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await panel.evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
});

for (const width of [1440, 320])
  for (const dark of [false, true]) {
    test(`motion guide and open panels remain accessible at ${width}px dark=${dark}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/foundations/motion");
      await waitForCatalogReady(page);
      if (dark)
        await page.getByRole("button", { name: "Cycle preview theme" }).click();
      expect(
        await page.evaluate(() => document.body.scrollWidth <= innerWidth),
      ).toBe(true);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      for (const kind of ["dialog", "sheet"]) {
        await page
          .getByRole("button", { name: `Open motion ${kind}`, exact: true })
          .click();
        await expect(page.getByRole("dialog")).toBeVisible();
        await expect(
          page.locator(".pui-dialog-popup, .pui-panel"),
        ).not.toHaveAttribute("data-starting-style");
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual(
          [],
        );
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toHaveCount(0);
      }
    });
  }

test("unsupported View Transitions API is accurately described and theme actions remain usable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    document.startViewTransition = undefined as any;
  });
  await page.goto("/foundations/motion");
  await waitForCatalogReady(page);
  await expect(page.locator("[data-motion-support]")).toHaveText("Unavailable");
  await page.getByRole("button", { name: "Cycle preview theme" }).click();
  await expect(page.locator("[data-motion-theme]")).toHaveText("dark");
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-theme-switching",
  );
  await page
    .getByRole("link", { name: "--dialog-enter-offset", exact: true })
    .click();
  await waitForCatalogReady(page);
  await expect(page).toHaveURL(/tokens\?q=--dialog-enter-offset/);
  await page.goBack();
  await waitForCatalogReady(page);
  await expect(page.locator("#page-title")).toHaveText("Motion / theme");
});
