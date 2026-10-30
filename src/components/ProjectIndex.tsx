"use client";
import { useEffect, useRef } from "react";
import data from "@/data";
import type { Renderer, Plane } from "@/lib/renderer";
export default function ProjectIndex({
  renderer,
  navigate,
}: {
  renderer: Renderer | null;
  navigate: (path: string) => void;
}) {
  const root = useRef<HTMLElement>(null),
    panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!renderer || !root.current) return;
    let active = true;
    const planes: Plane[] = [];
    renderer.hideHome();
    renderer.scan(root.current);
    renderer.depart();
    renderer.fadeLeaving();
    root.current
      .querySelectorAll<HTMLElement>("[data-index-text]")
      .forEach((el) => {
        void renderer.text(el, { reveal: false }).then((plane) => {
          if (plane) {
            if (active) planes.push(plane);
            else plane.dispose();
          }
        });
      });
    renderer.rail.bind(panel.current, data.projects);
    renderer.setScroll(0);
    return () => {
      active = false;
      renderer.rail.bind(null);
      renderer.dropTexts(planes);
    };
  }, [renderer]);
  return (
    <main
      ref={root}
      className="fixed inset-0 overflow-hidden"
      aria-label="All projects"
      onPointerMove={(e) => renderer?.rail.point(e.clientX, e.clientY)}
    >
      <h1 className="sr-only">All projects</h1>
      <div className="absolute inset-0">
        <div className="mx-auto flex min-h-full max-w-[42rem] s:max-w-[90rem] flex-wrap content-center items-center justify-center gap-x-24 gap-y-6 px-20">
          {data.projects.map((project, index) => (
            <span className="relative flex" key={project.slug}>
              <a
                data-index-text
                className="pointer-events-auto cursor-pointer whitespace-nowrap text-18 s:text-30 leading-none tracking-[-0.05em]"
                href={
                  project.featured
                    ? "/projects/" + encodeURIComponent(project.slug)
                    : project.link || "#"
                }
                onPointerEnter={() => renderer?.rail.pick(index)}
                onClick={(e) => {
                  if (project.featured) {
                    e.preventDefault();
                    navigate(e.currentTarget.getAttribute("href")!);
                  }
                }}
              >
                {project.title}
              </a>
            </span>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div ref={panel} className="h-200 w-0 rounded-20" />
      </div>
    </main>
  );
}
