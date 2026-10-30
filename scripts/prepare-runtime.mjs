import fs from "node:fs/promises";
import path from "node:path";
const manifest = JSON.parse(
  await fs.readFile("src/config/assets.json", "utf8"),
);
const mapping = JSON.parse(
  await fs.readFile("src/config/asset-paths.json", "utf8"),
);
const base = (process.env.NEXT_PUBLIC_ASSET_BASE || manifest.baseUrl).replace(
  /\/$/,
  "",
);
await fs.mkdir("public/engine", { recursive: true });
for (const file of await fs.readdir("src/renderer/vendor")) {
  let code = await fs.readFile(path.join("src/renderer/vendor", file), "utf8");
  for (const dir of ["models", "basis", "glyphs", "textures"])
    code = code.replaceAll("/" + dir + "/", base + "/" + dir + "/");
  await fs.writeFile(path.join("public/engine", file), code);
}
let css = await fs.readFile("src/renderer/reference.css", "utf8");
for (const [original, key] of Object.entries(mapping))
  css = css.replaceAll(original, base + "/" + key);
await fs.writeFile("src/app/reference.css", css);
console.log("Media base:", base);
