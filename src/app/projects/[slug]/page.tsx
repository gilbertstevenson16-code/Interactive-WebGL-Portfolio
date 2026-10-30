import Portfolio from "@/components/Portfolio";
import data from "@/data/portfolio.json";
export function generateStaticParams() {
  return data.featured.map((project) => ({ slug: project.slug }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Portfolio
      initialPath={"/projects/" + encodeURIComponent(decodeURIComponent(slug))}
    />
  );
}
