import { expect, test } from "@playwright/test";

test("navigates the Adding Fractions curriculum slice", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/student\/home$/);
  await page.getByRole("link", { name: /explore lesson/i }).click();
  await expect(
    page.getByRole("heading", { name: "Adding Fractions" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Subjects" }).first().click();
  await page.getByRole("link", { name: /mathematics/i }).click();
  await expect(
    page.getByRole("heading", { name: "Mathematics" }),
  ).toBeVisible();
  await page.getByRole("link", { name: /open lesson/i }).click();
  await expect(
    page.getByRole("heading", { name: "Your learning path" }),
  ).toBeVisible();
});

test("completes Learn and Flashcards and updates lesson progress", async ({
  page,
}) => {
  await page.goto("/student/lessons/adding-fractions");
  await expect(page.getByText("0 of 4 steps completed")).toBeVisible();

  await page.getByRole("link", { name: /1\. learn/i }).click();
  await page.getByRole("button", { name: /complete learn/i }).click();
  await page.getByRole("link", { name: /continue to flashcards/i }).click();

  for (let card = 1; card < 8; card += 1) {
    await page.getByRole("button", { name: /next card/i }).click();
  }
  await page.getByRole("button", { name: /complete flashcards/i }).click();
  await page
    .getByRole("link", { name: /back to lesson/i })
    .last()
    .click();
  await expect(page).toHaveURL(/\/student\/lessons\/adding-fractions$/);
  await page.reload();

  await expect(page.getByText("2 of 4 steps completed")).toBeVisible();
  await expect(page.getByText("Completed", { exact: true })).toHaveCount(2);
});
