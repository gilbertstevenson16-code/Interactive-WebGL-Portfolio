"use client";
import { useEffect, useRef } from "react";
import data from "@/data";
import type { Renderer, Project, Plane } from "@/lib/renderer";
export default function ProjectDetail({
  project,
  renderer,
  navigate,
}: {
  project: Project;
  renderer: Renderer | null;
  navigate: (path: string) => void;
}) {
  const root = useRef<HTMLElement>(null),
    title = useRef<HTMLHeadingElement>(null);
  const position = data.featured.findIndex((p) => p.slug === project.slug);
  const adjacent = (offset: number) =>
    "/projects/" +
    encodeURIComponent(
      data.featured[
        (position + offset + data.featured.length) % data.featured.length
      ].slug,
    );
  useEffect(() => {
    if (!renderer || !root.current || !title.current) return;
    let active = true;
    const planes: Plane[] = [];
    renderer.scan(root.current, data.featured);
    renderer.landTitle(title.current, project);
    root.current.querySelectorAll<HTMLElement>("[data-copy]").forEach((el) => {
      void renderer.text(el, { reveal: false }).then((plane) => {
        if (plane) {
          if (active) planes.push(plane);
          else plane.dispose();
        }
      });
    });
    root.current
      .querySelectorAll<HTMLElement>("[data-image]")
      .forEach((el, index) => renderer.simple(el, project.images[index]));
    root.current
      .querySelectorAll<HTMLElement>("[data-pill]")
      .forEach((el) =>
        renderer.pill(el, {
          round: el.dataset.pill !== "tag",
          arrow: el.dataset.pill === "visit",
          cross: el.dataset.pill === "close",
        }),
      );
    return () => {
      active = false;
      renderer.dropTexts(planes);
      renderer.releaseHero();
      renderer.releaseTitle();
    };
  }, [renderer, project]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).matches("input,textarea")) return;
      if (e.key === "Escape") navigate("/");
      if (e.key === "ArrowRight") navigate(adjacent(1));
      if (e.key === "ArrowLeft") navigate(adjacent(-1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });
  return (
    <main
      ref={root}
      className="pointer-events-none fixed inset-0 z-20"
      aria-label={project.title}
    >
      <div
        data-id={project.slug}
        data-gl="sheet"
        className="project-panel fixed inset-y-15 s:inset-y-20 inset-x-20 s:inset-x-50 flex flex-col s:flex-row s:items-start gap-y-40 s:gap-x-100 overflow-hidden rounded-15 px-10 s:pt-40 s:rounded-20 s:pl-40 s:pr-120"
      >
        <div className="detail-copy flex flex-col items-start s:flex-1 pt-40 s:pt-0 px-15 s:px-0">
          <h1
            ref={title}
            className="relative whitespace-nowrap text-35 s:text-45 font-regular leading-none tracking-[-0.05em] text-black"
          >
            {project.title}
          </h1>
          <p
            data-copy
            className="mt-15 s:mt-20 max-w-[40rem] text-14 s:text-16 tracking-[-0.035em] text-black"
          >
            {project.description.replace(/<[^>]*>/g, "")}
          </p>
          <div
            data-gl-shield
            className="mt-30 s:mt-45 flex items-start gap-12 text-black"
          >
            <a
              className="relative inline-flex items-center rounded-full h-[2em] aspect-square justify-center px-2 bg-black text-white pointer-events-auto"
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={"Visit " + project.title}
            >
              <span aria-hidden="true">↗</span>
            </a>
            <div className="flex flex-wrap gap-4 s:gap-2">
              {project.tags.map((tag) => (
                <span
                  data-pill="tag"
                  key={tag.id}
                  className="invisible relative inline-flex items-center rounded-full h-[2em] px-[1.25em] bg-[#eee] text-black"
                >
                  <span
                    className="visible absolute inset-0 rounded-[inherit]"
                    aria-hidden="true"
                  />
                  <span data-copy className="label visible whitespace-nowrap">
                    {tag.title}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div
          className="project-images flex w-full flex-col items-center gap-y-30 s:gap-y-60 will-change-transform s:w-700 s:shrink-0 pb-80 has-hover:pb-0"
          onScroll={(e) => {
            const el = e.currentTarget;
            renderer?.setProgress(
              el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight),
            );
          }}
        >
          {project.images.map((media, index) => (
            <div
              key={index}
              className="w-full flex-none"
              data-image
              data-gl="simple"
              role="img"
              aria-label={media.alt || project.title + " image " + (index + 1)}
              style={{ aspectRatio: `${media.width} / ${media.height}` }}
            />
          ))}
        </div>
        <a
          className="relative inline-flex items-center rounded-full h-[2em] aspect-square justify-center px-2 bg-black text-white pointer-events-auto !absolute !bottom-15 s:!bottom-auto s:!top-30 !right-15 s:!right-30 !size-40 s:!size-45 !p-0"
          href="/"
          aria-label="Close project"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <span aria-hidden="true">×</span>
        </a>
      </div>
      {([-1, 1] as const).map((offset) => (
        <div
          key={offset}
          data-id={
            data.featured[
              (position + offset + data.featured.length) % data.featured.length
            ].slug
          }
          data-gl="related"
          className={
            "invisible fixed inset-100 rounded-15 s:rounded-20 bg-white opacity-30 " +
            (offset < 0
              ? "translate-x-[calc((100%+9rem)*-1)] s:translate-x-[calc((100%+7.5rem)*-1)]"
              : "translate-x-[calc(100%+9rem)] s:translate-x-[calc(100%+7.5rem)]")
          }
        >
          <a
            className={
              "pointer-events-auto visible absolute inset-0 cursor-pointer " +
              (offset < 0 ? "-right-25" : "-left-25")
            }
            href={adjacent(offset)}
            aria-label={offset < 0 ? "Previous project" : "Next project"}
            onClick={(e) => {
              e.preventDefault();
              navigate(adjacent(offset));
            }}
          />
        </div>
      ))}
    </main>
  );
}
