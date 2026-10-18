import { waitForCatalogReady } from "./catalog-ready";
import { test, expect } from "@playwright/test";

test("theme snapshots share one duration and suppress delayed component transitions", async ({
  page,
}) => {
  await page.emulateMedia({
    reducedMotion: "no-preference",
    colorScheme: "light",
  });
  await page.goto("/patterns/interaction-lab");
  await waitForCatalogReady(page);
  await page.evaluate(() => {
    const original = document.startViewTransition.bind(document);
    (window as any).frames = [];
    document.startViewTransition = ((...args: any[]) => {
      const transition = (original as any)(...args);
      transition.ready
        .then(() => {
          const root = document.documentElement;
          const snapshot = getComputedStyle(
            root,
            "::view-transition-new(root)",
          );
          (window as any).frames.push({
            duration: snapshot.animationDuration,
            name: snapshot.animationName,
            transition: getComputedStyle(document.querySelector(".pui-input")!)
              .transitionDuration,
            active: root.hasAttribute("data-theme-switching"),
          });
        })
        .catch(() => {});
      return transition;
    }) as typeof document.startViewTransition;
  });
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect
    .poll(() => page.evaluate(() => (window as any).frames.length))
    .toBe(1);
  expect(await page.evaluate(() => (window as any).frames[0])).toEqual({
    duration: "0.2s",
    name: "pui-theme-enter",
    transition: "0s",
    active: true,
  });
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-theme-switching",
    "",
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("rapid switches settle on the newest mode and system changes use the same transition", async ({
  page,
}) => {
  await page.emulateMedia({
    reducedMotion: "no-preference",
    colorScheme: "light",
  });
  await page.goto("/patterns/interaction-lab");
  await waitForCatalogReady(page);
  await page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>(
      '[aria-label^="Toggle theme"]',
    )!;
    button.click();
    button.click();
  });
  await expect(
    page.getByRole("button", { name: "Toggle theme" }),
  ).toHaveAccessibleName("Toggle theme: System");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-theme-switching",
    "",
  );
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-theme-switching",
    "",
  );
});

for (const fallback of ["reduced-motion", "unsupported"] as const) {
  test(`${fallback} applies the complete theme without snapshot animation`, async ({
    page,
  }) => {
    await page.emulateMedia({
      reducedMotion: fallback === "reduced-motion" ? "reduce" : "no-preference",
    });
    await page.addInitScript((unsupported) => {
      (window as any).transitionCalls = 0;
      const original = document.startViewTransition?.bind(document);
      document.startViewTransition = unsupported
        ? (undefined as any)
        : (((...args: any[]) => {
            (window as any).transitionCalls++;
            return (original as any)(...args);
          }) as typeof document.startViewTransition);
    }, fallback === "unsupported");
    await page.goto("/patterns/interaction-lab");
    await waitForCatalogReady(page);
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-theme-switching",
      "",
    );
    expect(await page.evaluate(() => (window as any).transitionCalls)).toBe(0);
  });
}
