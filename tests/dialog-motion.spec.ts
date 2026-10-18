import { waitForCatalogReady } from "./catalog-ready";
import { test, expect } from "@playwright/test";

test("dialog fades upward on entry and dismisses without an exit animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/patterns/interaction-lab");
  await waitForCatalogReady(page);
  const trigger = page.getByRole("button", {
    name: "Open dialog",
    exact: true,
  });
  for (const interrupt of [true, false]) {
    await trigger.click();
    const popup = page.locator(".pui-dialog-popup");
    await expect(popup).toBeVisible();
    await expect
      .poll(() => popup.evaluate((el) => el.getAnimations().length))
      .toBeGreaterThan(0);
    const motion = await popup.evaluate((el) =>
      el.getAnimations().map((a) => ({
        duration: a.effect!.getTiming().duration,
        keyframes: a.effect!.getKeyframes(),
      })),
    );
    expect(motion.every((a) => a.duration === 200)).toBe(true);
    expect(motion.some((a) => a.keyframes.some((k) => k.opacity === "0"))).toBe(
      true,
    );
    expect(
      motion.some((a) => a.keyframes.some((k) => k.translate === "0px 8px")),
    ).toBe(true);
    if (!interrupt)
      await popup.evaluate((el) =>
        Promise.all(el.getAnimations().map((a) => a.finished.catch(() => {}))),
      );
    await page
      .getByRole("button", {
        name: interrupt ? "Dismiss deployment plan" : "Close dialog",
        exact: true,
      })
      .evaluate((el) => el.click());
    const remaining = await page.evaluate(async () => {
      for (let i = 0; i < 3; i++) await new Promise(requestAnimationFrame);
      return document.querySelectorAll(".pui-dialog-popup,.pui-dialog-backdrop")
        .length;
    });
    expect(remaining).toBe(0);
    await expect(trigger).toBeFocused();
  }
});

test("reduced motion removes the dialog entry transition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/patterns/interaction-lab");
  await waitForCatalogReady(page);
  await page.getByRole("button", { name: "Open dialog", exact: true }).click();
  const popup = page.locator(".pui-dialog-popup");
  await expect(popup).toBeVisible();
  expect(
    await popup.evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  expect(await popup.evaluate((el) => el.getAnimations().length)).toBe(0);
  await page.keyboard.press("Escape");
  await expect(popup).toBeHidden();
});
