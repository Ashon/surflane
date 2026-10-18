import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForCatalogReady } from "./catalog-ready";
test.use({ reducedMotion: "reduce" });
async function state(page: import("@playwright/test").Page, value: string) {
  await page.getByRole("combobox", { name: "Result state" }).click();
  await page.getByRole("option", { name: value, exact: true }).click();
}
test("resource rows preserve native list/link semantics, selection scope and menu focus", async ({
  page,
}) => {
  await page.goto("/patterns/resource-list");
  await waitForCatalogReady(page);
  const list = page.getByRole("list", { name: "Resource examples" }),
    first = list.getByRole("listitem").first(),
    input = page.getByRole("searchbox", { name: "Find resources" }),
    all = page.getByRole("checkbox", {
      name: "Select visible editable resources",
    });
  await expect(list.getByRole("listitem")).toHaveCount(4);
  expect(await first.getAttribute("tabindex")).toBeNull();
  await expect(first.locator("a")).toHaveAttribute(
    "href",
    "/patterns/page-header",
  );
  await expect(first.locator("a button, button button")).toHaveCount(0);
  await first.getByRole("checkbox").check();
  await expect(first).toHaveAttribute("data-selected", "true");
  await expect(all).toHaveAttribute("aria-checked", "mixed");
  await all.check();
  await expect(
    page
      .getByRole("search", { name: "Find resource examples" })
      .getByRole("status"),
  ).toContainText("3 selected");
  await input.fill("Writing");
  await expect(
    page
      .getByRole("search", { name: "Find resource examples" })
      .getByRole("status"),
  ).toContainText("3 selected / 0 visible selections");
  await expect(all).toBeDisabled();
  const readOnly = list.getByRole("listitem");
  await expect(readOnly.getByRole("checkbox")).toBeDisabled();
  const roMenu = readOnly.getByRole("button", {
    name: "Actions for Writing guide",
  });
  await roMenu.click();
  await expect(
    page.getByRole("menuitem", { name: "Mark reviewed" }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(roMenu).toBeFocused();
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(input).toBeFocused();
  const actions = first.getByRole("button", {
    name: "Actions for Platform workspace",
  });
  await actions.click();
  await page
    .getByRole("menuitem", { name: "Mark reviewed", exact: true })
    .click();
  await expect(actions).toBeFocused();
  await expect(first).toContainText("Reviewed");
  await expect(
    page.getByRole("status").filter({ hasText: "Marked Platform workspace" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await expect(input).toBeFocused();
  await expect(first).not.toHaveAttribute("data-selected");
  await first.getByRole("link").click();
  await waitForCatalogReady(page);
  await expect(page.locator("#page-title")).toHaveText("Page header");
  await expect(page.locator("#page-title")).toBeFocused();
});
test("empty, filtered-empty, loading, error and permission states stay distinct and recover focus", async ({
  page,
}) => {
  await page.goto("/patterns/resource-list");
  await waitForCatalogReady(page);
  const input = page.getByRole("searchbox", { name: "Find resources" });
  await input.fill("absent");
  await expect(
    page.getByRole("heading", { name: "No matching resources" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset resource search" }).click();
  await expect(input).toBeFocused();
  await state(page, "Initially empty");
  await expect(
    page.getByRole("heading", { name: "No registered resources" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show sample resources" }).click();
  await expect(input).toBeFocused();
  await input.fill("Platform");
  await state(page, "Loading");
  await expect(page.locator("#resource-preview-results")).toHaveAttribute(
    "aria-busy",
    "true",
  );
  await expect(
    page.getByRole("list", { name: "Resource examples" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("status").filter({ hasText: "Loading resource preview" }),
  ).toBeVisible();
  await state(page, "Error");
  await expect(page.getByRole("alert")).toContainText(
    "Resources could not be loaded",
  );
  await page.getByRole("button", { name: "Retry preview" }).click();
  await expect(input).toHaveValue("Platform");
  await expect(input).toBeFocused();
  await state(page, "Permission restricted");
  await expect(input).toBeDisabled();
  await expect(
    page.getByRole("heading", { name: "Resource access unavailable" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Restore preview access" }).click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue("Platform");
});
for (const theme of ["light", "dark"])
  test(`resource list padding and long names remain stable and accessible in ${theme}`, async ({
    page,
  }) => {
    await page.goto("/patterns/resource-list");
    await waitForCatalogReady(page);
    if (theme === "dark") {
      await page.getByRole("button", { name: "Toggle theme" }).click();
      await expect(page.locator("html")).not.toHaveAttribute(
        "data-theme-switching",
      );
    }
    for (const width of [1440, 760, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      const list = page.getByRole("list", { name: "Resource examples" }),
        row = list.getByRole("listitem").last();
      await row.scrollIntoViewIfNeeded();
      const before = (await row.boundingBox())!;
      await row.hover();
      expect(await row.boundingBox()).toEqual(before);
      expect(
        await list.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
      await expect(row).toHaveCSS("padding-left", "16px");
      await expect(row).toHaveCSS("padding-right", "16px");
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    }
    for (const value of [
      "Loading",
      "Error",
      "Permission restricted",
      "Initially empty",
    ]) {
      await state(page, value);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    }
  });
