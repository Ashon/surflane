import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForCatalogReady } from "./catalog-ready";
test.use({ reducedMotion: "reduce" });
const route = "/patterns/error-recovery";
async function option(page: Page, label: string, value: string) {
  await page.getByRole("combobox", { name: label, exact: true }).click();
  await page.getByRole("option", { name: value, exact: true }).click();
}
const draft = (page: Page) =>
  page.getByRole("textbox", { name: "Preview request label", exact: true });
const saved = (page: Page) =>
  page.getByRole("region", { name: "Saved resource preview", exact: true });
const result = (page: Page) =>
  page.getByRole("status", { name: "Recovery result", exact: true });
test("retry is guarded, snapshots the draft and reports fresh data only after completion", async ({
  page,
}) => {
  await page.goto(route);
  await waitForCatalogReady(page);
  await expect(saved(page)).toContainText("May be outdated");
  await draft(page).fill("Updated preview label");
  await page
    .getByRole("button", { name: "Retry preview", exact: true })
    .evaluate((e: HTMLButtonElement) => {
      e.click();
      e.click();
    });
  await expect(
    page.getByText("Preview requests started: 1.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cancel retry" }),
  ).toBeFocused();
  await expect(draft(page)).toBeDisabled();
  await page
    .getByRole("button", { name: "Complete recovery response" })
    .click();
  await expect(saved(page)).toContainText("Updated preview label");
  await expect(saved(page)).toContainText("Revision 2");
  await expect(saved(page)).toContainText("Current preview");
  await expect(
    page.getByRole("heading", { name: "Last saved preview" }),
  ).toBeFocused();
  await expect(result(page)).toContainText("No product resource was changed");
});
test("a completed response queued before cancel cannot overwrite the retained draft or cached version", async ({
  page,
}) => {
  await page.goto(route);
  await waitForCatalogReady(page);
  await draft(page).fill("Unsaved draft");
  await page
    .getByRole("button", { name: "Retry preview", exact: true })
    .click();
  await page.locator(".recovery-example").evaluate((e) => {
    const buttons = Array.from(e.querySelectorAll("button"));
    buttons
      .find((b) => b.textContent?.trim() === "Complete recovery response")!
      .click();
    buttons.find((b) => b.textContent?.trim() === "Cancel retry")!.click();
  });
  await expect(result(page)).toHaveText(
    "Retry canceled. Your draft is retained.",
  );
  await expect(draft(page)).toHaveValue("Unsaved draft");
  await expect(draft(page)).toBeFocused();
  await expect(saved(page)).toContainText("Revision 1");
  await expect(saved(page)).not.toContainText("Unsaved draft");
  await page
    .getByRole("button", { name: "Retry preview", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Complete recovery response" })
    .click();
  await expect(saved(page)).toContainText("Unsaved draft");
  await expect(saved(page)).toContainText("Revision 2");
});
test("failed retries retain drafts, permission clears cached data and restoration requires a fresh request", async ({
  page,
}) => {
  await page.goto(route);
  await waitForCatalogReady(page);
  await draft(page).fill("Retained text");
  await option(page, "Next retry result", "error");
  await page
    .getByRole("button", { name: "Retry preview", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Complete recovery response" })
    .click();
  await expect(
    page.getByRole("button", { name: "Retry preview", exact: true }),
  ).toBeFocused();
  await expect(draft(page)).toHaveValue("Retained text");
  await option(page, "Next retry result", "permission");
  await page
    .getByRole("button", { name: "Retry preview", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Complete recovery response" })
    .click();
  await expect(saved(page)).toHaveCount(0);
  await expect(draft(page)).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Restore preview access" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Restore preview access" }).click();
  await expect(saved(page)).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Load preview", exact: true }),
  ).toBeFocused();
  await option(page, "Next retry result", "success");
  await page.getByRole("button", { name: "Load preview", exact: true }).click();
  await page
    .getByRole("button", { name: "Complete recovery response" })
    .click();
  await expect(saved(page)).toContainText("Retained text");
});
test("offline recovery is explicit and a stale address offers a native list destination instead of retry", async ({
  page,
}) => {
  await page.goto(route);
  await waitForCatalogReady(page);
  await option(page, "Preview recovery state", "offline");
  await expect(saved(page)).toContainText("May be outdated");
  await page.getByRole("button", { name: "Reconnect preview" }).click();
  await page.getByRole("button", { name: "Cancel retry" }).click();
  await expect(
    page.getByRole("button", { name: "Reconnect preview" }),
  ).toBeVisible();
  await option(page, "Preview recovery state", "not-found");
  await expect(saved(page)).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Retry preview", exact: true }),
  ).toHaveCount(0);
  const link = page.getByRole("link", { name: "Browse resource examples" });
  await expect(link).toHaveAttribute("href", "/patterns/resource-list");
  await link.press("Enter");
  await waitForCatalogReady(page);
  await expect(page.locator("#page-title")).toHaveText("Resource list");
  await expect(page.locator("#page-title")).toBeFocused();
});
test("recovery states and safe diagnostics stay bounded and accessible in both themes at320px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.goto(route);
  await waitForCatalogReady(page);
  for (const dark of [false, true]) {
    if (dark) {
      await page.getByRole("button", { name: "Toggle theme: Light" }).click();
      await expect(page.locator("html")).not.toHaveAttribute(
        "data-theme-switching",
      );
    }
    for (const mode of [
      "error",
      "offline",
      "permission",
      "not-found",
      "ready",
    ]) {
      await option(page, "Preview recovery state", mode);
      if (mode === "error") {
        await page
          .getByRole("button", { name: "Preview request details", exact: true })
          .click();
        await expect(
          page.getByRole("region", { name: "Safe preview request details" }),
        ).toContainText("no credentials");
      }
      await expect
        .poll(() =>
          page
            .locator(".catalog-document-scroll")
            .evaluate((e) => e.scrollWidth <= e.clientWidth),
        )
        .toBe(true);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    }
    await page
      .getByRole("button", { name: /^(Refresh|Load) preview$/ })
      .click();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.getByRole("button", { name: "Cancel retry" }).click();
  }
});
