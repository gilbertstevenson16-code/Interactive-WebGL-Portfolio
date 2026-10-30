const { chromium } = require("@playwright/test");
const fs = require("node:fs/promises");
(async () => {
  const output = process.env.CAPTURE_OUTPUT || "artifacts/reference";
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({
    args: ["--enable-unsafe-swiftshader"],
  });
  for (const [name, viewport] of [
    ["desktop", { width: 1440, height: 900 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({
      viewport,
      locale: "en-US",
      colorScheme: "dark",
      reducedMotion: "no-preference",
    });
    const failures = [];
    page.on("pageerror", (error) => failures.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400)
        failures.push(response.status() + " " + response.url());
    });
    await page
      .goto(process.env.BASE_URL || "http://127.0.0.1:3150/", {
        waitUntil: "networkidle",
        timeout: 60000,
      })
      .catch((error) => failures.push(error.message));
    await page.waitForTimeout(10000);
    await page.screenshot({ path: `${output}/${name}-home.png` });
    console.log(
      name,
      await page.title(),
      await page.locator("canvas").count(),
      failures,
    );
    await fs.writeFile(
      `${output}/${name}.json`,
      JSON.stringify(
        { failures, text: await page.locator("body").innerText() },
        null,
        2,
      ),
    );
    await page.close();
  }
  await browser.close();
})();
