const { chromium } = require("@playwright/test");
const fs = require("node:fs/promises");
(async () => {
  const output = process.env.DEMO_OUTPUT || "artifacts/demo";
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({
    args: ["--enable-unsafe-swiftshader"],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: output, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto(process.env.BASE_URL || "http://127.0.0.1:3151");
  await page.locator("canvas").waitFor();
  await page.getByRole("status").waitFor({ state: "detached" });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: output + "/cover.png" });
  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(1800);
  }
  await page.getByRole("link", { name: "Full", exact: true }).click();
  await page.waitForTimeout(2200);
  await page.getByRole("link", { name: "Aero Dynamic", exact: true }).click();
  await page.waitForTimeout(2500);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(2500);
  await page.getByRole("link", { name: "Close project", exact: true }).click();
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Profile", exact: true }).click();
  await page.waitForTimeout(2200);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1500);
  const video = page.video();
  await context.close();
  await video.saveAs(output + "/demo.webm");
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
