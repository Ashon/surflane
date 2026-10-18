import { test, expect } from "@playwright/test";
import { waitForCatalogReady } from "./catalog-ready";
test.use({ reducedMotion: "reduce" });
test("theme rotation persists a cookie and restores explicit and system modes", async ({
  page,
  context,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await waitForCatalogReady(page);
  const root = page.locator("html"),
    toggle = page.getByRole("button", { name: "Toggle theme" });
  await toggle.click();
  await expect(root).toHaveAttribute("data-theme", "dark");
  const cookie = (await context.cookies()).find(
    (c) => c.name === "surflane-theme",
  )!;
  expect(cookie.value).toBe("dark");
  expect(cookie.path).toBe("/");
  expect(cookie.sameSite).toBe("Lax");
  expect(cookie.expires).toBeGreaterThan(Date.now() / 1000 + 300 * 86400);
  await page.reload();
  await waitForCatalogReady(page);
  await expect(root).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toHaveAccessibleName("Toggle theme: Dark");
  await toggle.click();
  await expect(root).toHaveAttribute("data-theme-mode", "system");
  await expect(root).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await expect(root).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await waitForCatalogReady(page);
  await expect(root).toHaveAttribute("data-theme-mode", "system");
  await expect(root).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toHaveAccessibleName("Toggle theme: System");
  await toggle.click();
  await expect(root).toHaveAttribute("data-theme", "light");
  expect(
    (await context.cookies()).find((c) => c.name === "surflane-theme")!
      .value,
  ).toBe("light");
});
test("a malformed cookie falls back safely before the app starts", async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      name: "surflane-theme",
      value: "unexpected",
      url: "http://127.0.0.1:8066",
    },
  ]);
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await waitForCatalogReady(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(
    page.getByRole("button", { name: "Toggle theme" }),
  ).toHaveAccessibleName("Toggle theme: Light");
});
