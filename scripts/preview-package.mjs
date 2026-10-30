import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
const manifest = JSON.parse(
  await fs.readFile("src/config/assets.json", "utf8"),
);
const release = JSON.parse(
  await fs.readFile("src/config/distribution.json", "utf8"),
);
const index = process.argv.indexOf("--assets");
const source = index < 0 ? undefined : process.argv[index + 1];
const cache = path.resolve(".preview-media");
await fs.mkdir(cache, { recursive: true });
const checksum = (data) => createHash("sha256").update(data).digest("hex");
function verify(name, data) {
  const expected = manifest.files[name];
  if (
    !expected ||
    data.length !== expected.bytes ||
    checksum(data) !== expected.sha256
  )
    throw Error("Checksum mismatch: " + name);
}
try {
  for (const name of Object.keys(manifest.files)) {
    let data;
    if (source) data = await fs.readFile(path.join(source, name));
    else {
      try {
        data = await fs.readFile(path.join(cache, name));
        verify(name, data);
      } catch {
        const response = await fetch(manifest.baseUrl + "/" + name, {
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) throw Error("Media HTTP " + response.status);
        data = Buffer.from(await response.arrayBuffer());
      }
    }
    verify(name, data);
    await fs.mkdir(path.dirname(path.join(cache, name)), { recursive: true });
    await fs.writeFile(path.join(cache, name), data);
  }
} catch (error) {
  if (source) throw error;
  const response = await fetch(release.assetsUrl, {
    signal: AbortSignal.timeout(120000),
  });
  if (!response.ok)
    throw Error("R2 and GitHub fallback are unavailable: " + response.status, {
      cause: error,
    });
  const bytes = Buffer.from(await response.arrayBuffer());
  if (checksum(bytes) !== release.assetsSha256)
    throw Error("Fallback archive checksum mismatch");
  const zip = path.join(cache, "fallback.zip");
  await fs.writeFile(zip, bytes);
  const entries = execFileSync("unzip", ["-Z1", zip], { encoding: "utf8" })
    .trim()
    .split("\n");
  for (const entry of entries)
    if (entry.startsWith("/") || entry.split("/").includes(".."))
      throw Error("Unsafe archive entry");
  execFileSync("unzip", ["-oq", zip, "-d", cache]);
  await fs.unlink(zip);
}
for (const name of Object.keys(manifest.files))
  verify(name, await fs.readFile(path.join(cache, name)));
execFileSync("npm", ["run", "build"], {
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_ASSET_BASE: "/preview-media" },
});
await fs.cp(cache, "out/preview-media", { recursive: true });
await fs.copyFile("scripts/serve-preview.py", "out/serve-preview.py");
await fs.writeFile(
  "out/PREVIEW.txt",
  "Interactive WebGL Portfolio\nRun python3 serve-preview.py then open http://127.0.0.1:3151\nAll media is local. Serve the complete directory over HTTP; file:// is unsupported.\nAI browser: attach this directory using the platform native static-file preview. An internal sandbox localhost is not a user-visible preview.\n",
);
console.log("Portable preview ready in out/.");
