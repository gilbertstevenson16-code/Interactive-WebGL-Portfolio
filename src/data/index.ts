import source from "./portfolio.json";
import manifest from "@/config/assets.json";
import mapping from "@/config/asset-paths.json";
const paths: Record<string, string> = mapping;
const base = (process.env.NEXT_PUBLIC_ASSET_BASE || manifest.baseUrl).replace(
  /\/$/,
  "",
);
const asset = (value: string) =>
  paths[value] ? base + "/" + paths[value] : value;
function project<
  T extends (typeof source.projects)[number] | (typeof source.featured)[number],
>(item: T): T {
  return {
    ...item,
    src: asset(item.src),
    thumb: asset(item.thumb),
    card: asset(item.card),
    video: item.video ? asset(item.video) : null,
    images: item.images.map((image) => ({
      ...image,
      src: asset(image.src),
      thumb: asset(image.thumb),
      card: asset(image.card),
      video: image.video ? asset(image.video) : null,
    })),
  } as T;
}
export default {
  ...source,
  projects: source.projects.map(project),
  featured: source.featured.map(project),
};
