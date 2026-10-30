const { chromium, expect } = require("@playwright/test");
const fs = require("node:fs/promises");
const data = require("../src/data/portfolio.json");
(async () => {
  const browser = await chromium.launch({
    args: ["--enable-unsafe-swiftshader"],
  });
  const base = process.env.BASE_URL || "http://127.0.0.1:3151",
    results = [];
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const errors = [],
    external = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (/^https?:/.test(r.url()) && !r.url().startsWith(base))
      external.push(r.url());
  });
  for (const project of data.featured) {
    await page.goto(
      base + "/projects/" + encodeURIComponent(project.slug) + "/",
    );
    await page.locator("canvas").waitFor();
    await page.getByRole("status").waitFor({ state: "detached" });
    await expect(
      page.getByRole("heading", { name: project.title, exact: true }),
    ).toBeVisible();
    results.push({ deepLink: project.slug, passed: true });
  }
  await page.goto(base + "/newsletter/");
  await page.locator("canvas").waitFor();
  await page.getByRole("status").waitFor({ state: "detached" });
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Email address").fill("preview@example.com");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect(
    page.getByText(/Newsletter delivery is not configured/),
  ).toBeVisible();
  results.push({
    newsletter: "Frontend-only status is explicit",
    errors,
    external,
  });
  const fallback = await browser.newPage();
  await fallback.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
      if (kind === "webgl2") return null;
      return original.call(this, kind, ...args);
    };
  });
  await fallback.goto(base);
  await expect(fallback.locator("main [role=alert]")).toContainText(
    "WebGL2 is unavailable",
  );
  results.push({ webglFallback: true });
  await fs.mkdir("artifacts/browser", { recursive: true });
  await fs.writeFile(
    "artifacts/browser/edge-cases.json",
    JSON.stringify(results, null, 2),
  );
  await browser.close();
  console.log(results);
  if (errors.length || external.length) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
