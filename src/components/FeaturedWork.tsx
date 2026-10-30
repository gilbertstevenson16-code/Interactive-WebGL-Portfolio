"use client";
import { useEffect, useRef } from "react";
import data from "@/data";
import { useCarousel } from "@/hooks/useCarousel";
import type { Renderer } from "@/lib/renderer";
export default function FeaturedWork({
  renderer,
  navigate,
}: {
  renderer: Renderer | null;
  navigate: (path: string) => void;
}) {
  const root = useRef<HTMLElement>(null),
    track = useRef<HTMLDivElement>(null);
  useCarousel(track, renderer, true);
  useEffect(() => {
    if (!renderer || !root.current || !track.current) return;
    let active = true;
    const cards = Array.from(track.current.children) as HTMLElement[];
    void renderer.showTitles(
      cards.map((card, index) => ({
        card,
        el: card.querySelector("[data-title]")!,
        slug: data.featured[index].slug,
      })),
    );
    void renderer.showHome(root.current, data.featured).then(() => {
      if (!active) renderer.hideHome();
    });
    cards.forEach((card) =>
      renderer.pill(card.querySelector("[data-arrow]")!, {
        round: true,
        arrowRight: true,
        strip: true,
      }),
    );
    return () => {
      active = false;
      renderer.hideHome();
    };
  }, [renderer]);
  return (
    <main
      ref={root}
      className="fixed inset-0 overflow-hidden"
      aria-label="Featured work"
    >
      <h1 className="sr-only">Promptedsite — Featured work</h1>
      <div
        ref={track}
        className="absolute w-full left-0 top-0 s:top-1/2 flex flex-col s:flex-row s:-translate-y-1/2 gap-y-20 s:gap-x-10 px-20 s:px-0"
      >
        {data.featured.map((project) => (
          <article
            key={project.slug}
            data-id={project.slug}
            data-gl="card"
            className="relative w-full s:h-[43.5svh] s:max-h-[55rem] s:w-auto flex-none cursor-pointer rounded-15 s:rounded-20"
            style={{ aspectRatio: `${project.width} / ${project.height}` }}
            onPointerEnter={() => renderer?.tone(project.slug, true)}
            onPointerLeave={() => renderer?.tone(project.slug, false)}
          >
            <a
              className="project-link"
              href={"/projects/" + encodeURIComponent(project.slug)}
              aria-label={"View " + project.title}
              onClick={(event) => {
                event.preventDefault();
                renderer?.select(project.slug);
                navigate(event.currentTarget.getAttribute("href")!);
              }}
            />
            <p className="pointer-events-none absolute bottom-10 inset-x-10 s:bottom-10 s:inset-x-20 flex items-end justify-between">
              <span
                data-title
                className="whitespace-nowrap text-16 s:text-18 tracking-[-0.05em]"
              >
                {project.title}
              </span>
              <span
                data-arrow
                aria-hidden="true"
                className="invisible relative inline-flex size-25 s:size-25 items-center justify-center rounded-full bg-black text-white"
              />
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
