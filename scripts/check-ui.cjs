const { chromium, expect } = require("@playwright/test");
const fs = require("node:fs/promises");
(async () => {
  const dir = process.env.TEST_OUTPUT || "artifacts/browser";
  await fs.mkdir(dir, { recursive: true });
  const browser = await chromium.launch({
    args: ["--enable-unsafe-swiftshader"],
  });
  const results = [];
  for (const [profile, viewport] of [
    ["desktop", { width: 1440, height: 900 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({
        viewport,
        locale: "en-US",
        colorScheme: "dark",
        reducedMotion: "no-preference",
      }),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.stack));
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(r.status() + " " + r.url());
    });
    await page.goto(process.env.BASE_URL || "http://127.0.0.1:3150");
    await page.locator("canvas").waitFor();
    await page.getByRole("status").waitFor({ state: "detached" });
    await page.waitForTimeout(3500);
    await page.screenshot({ path: dir + "/" + profile + "-home.png" });
    await page.getByRole("link", { name: "Full", exact: true }).click();
    await page.waitForTimeout(2200);
    await page.screenshot({ path: dir + "/" + profile + "-index.png" });
    await page.getByRole("link", { name: "Aero Dynamic", exact: true }).click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: dir + "/" + profile + "-project.png" });
    await expect(
      page.getByRole("heading", { name: "Aero Dynamic", exact: true }),
    ).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(1500);
    await expect(
      page.getByRole("heading", { name: "Lumina Font", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: "Close project", exact: true })
      .click();
    await page.waitForTimeout(1200);
    await page.getByRole("button", { name: "Profile", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    results.push({ profile, errors });
    console.log(profile, errors);
    await page.close();
  }
  await fs.writeFile(dir + "/report.json", JSON.stringify(results, null, 2));
  await browser.close();
  if (results.some((r) => r.errors.length)) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
