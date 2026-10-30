import fs from "node:fs/promises";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
const [reference, actual, output = "artifacts/diff"] = process.argv.slice(2);
if (!reference || !actual)
  throw Error(
    "Usage: node scripts/visual-diff.mjs reference-dir actual-dir [output-dir]",
  );
await fs.mkdir(output, { recursive: true });
const report = [];
for (const profile of ["desktop", "mobile"]) {
  const name = profile + "-home.png";
  const before = PNG.sync.read(await fs.readFile(reference + "/" + name)),
    after = PNG.sync.read(await fs.readFile(actual + "/" + name));
  if (before.width !== after.width || before.height !== after.height)
    throw Error("Viewport mismatch");
  const diff = new PNG({ width: before.width, height: before.height });
  const mismatch = pixelmatch(
    before.data,
    after.data,
    diff.data,
    before.width,
    before.height,
    { threshold: 0.1 },
  );
  await fs.writeFile(output + "/" + name, PNG.sync.write(diff));
  report.push({
    profile,
    width: before.width,
    height: before.height,
    mismatchPixels: mismatch,
    mismatchPercent: (100 * mismatch) / (before.width * before.height),
    note: "Diagnostic only: live video frame timing and animated rendering can differ.",
  });
}
await fs.writeFile(output + "/report.json", JSON.stringify(report, null, 2));
console.log(report);
