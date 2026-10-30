"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import data from "@/data";
import { useRenderer } from "@/hooks/useRenderer";
import FeaturedWork from "./FeaturedWork";
import ProjectIndex from "./ProjectIndex";
import ProjectDetail from "./ProjectDetail";
import type { Plane } from "@/lib/renderer";

export default function Portfolio({
  initialPath = "/",
}: {
  initialPath?: string;
}) {
  const [path, setPath] = useState(initialPath),
    [profile, setProfile] = useState(false),
    [submitted, setSubmitted] = useState(false);
  const { host, renderer, error } = useRenderer();
  const dialog = useRef<HTMLDivElement>(null),
    returnFocus = useRef<HTMLElement | null>(null);
  const navigate = useCallback((next: string) => {
    history.pushState({}, "", next);
    setPath(next);
    setProfile(false);
  }, []);
  useEffect(() => {
    const pop = () => setPath(location.pathname);
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  const newsletter = path === "/newsletter",
    overlay = profile || newsletter;
  useEffect(() => {
    if (!renderer || !overlay || !dialog.current) return;
    let active = true;
    const planes: Plane[] = [];
    renderer.bindHole(dialog.current, profile ? "profile" : "news");
    renderer.openHole(true);
    dialog.current
      .querySelectorAll<HTMLElement>("[data-overlay-copy]")
      .forEach((element) => {
        void renderer
          .text(element, {
            over: true,
            reveal: false,
            group: profile ? "profile" : "news",
          })
          .then((plane) => {
            if (plane) {
              if (active) planes.push(plane);
              else plane.dispose();
            }
          });
      });
    return () => {
      active = false;
      renderer.openHole(false);
      renderer.overlay = renderer.overlay.filter(
        (plane) => !planes.includes(plane),
      );
      planes.forEach((plane) => plane.dispose());
    };
  }, [renderer, overlay, profile]);
  useEffect(() => {
    if (!overlay) return;
    returnFocus.current = document.activeElement as HTMLElement;
    dialog.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProfile(false);
        if (newsletter) navigate("/");
      }
      if (e.key === "Tab") {
        const controls = Array.from(
          dialog.current?.querySelectorAll<HTMLElement>("a,button,input") || [],
        );
        const first = controls[0],
          last = controls.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      returnFocus.current?.focus();
    };
  }, [overlay, newsletter, navigate]);
  const slug = path.startsWith("/projects/")
    ? decodeURIComponent(path.slice(10))
    : null;
  const project = data.featured.find((item) => item.slug === slug);
  const link = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      navigate(event.currentTarget.getAttribute("href")!);
    }
  };
  return (
    <div className="bg-black">
      <div ref={host} className="gl" aria-hidden="true" />
      {!error &&
        (project ? (
          <ProjectDetail
            key={project.slug}
            project={project}
            renderer={renderer}
            navigate={navigate}
          />
        ) : path === "/full" ? (
          <ProjectIndex renderer={renderer} navigate={navigate} />
        ) : (
          <FeaturedWork renderer={renderer} navigate={navigate} />
        ))}
      {!renderer && !error && (
        <div
          className="loading-status"
          role="status"
          aria-label="Loading portfolio"
        >
          <span className="sr-only">Loading portfolio…</span>
          <div className="flex gap-x-8">
            <span className="h-5 w-50 rounded-[2rem] bg-white" />
            <span className="h-5 w-50 rounded-[2rem] bg-white" />
            <span className="h-5 w-50 rounded-[2rem] bg-white" />
          </div>
        </div>
      )}
      {error && (
        <main className="fallback">
          <h1>Portfolio</h1>
          <p role="alert">{error}</p>
          {data.featured.map((p) => (
            <a key={p.slug} href={p.link}>
              {p.title} ↗
            </a>
          ))}
        </main>
      )}
      {!project && (
        <header className="portfolio-nav label">
          <div className="portfolio-nav-row">
            <a href="/" onClick={link}>
              Promptedsite
            </a>
            <button
              aria-expanded={profile}
              onClick={() => setProfile((value) => !value)}
            >
              {profile ? "Close" : "Profile"}
            </button>
          </div>
          <div className="portfolio-nav-row">
            <nav aria-label="Project views">
              <a
                href="/"
                onClick={link}
                aria-current={path === "/" ? "page" : undefined}
              >
                Featured
              </a>
              <span aria-hidden="true">/</span>
              <a
                href="/full"
                onClick={link}
                aria-current={path === "/full" ? "page" : undefined}
              >
                Full
              </a>
            </nav>
            <button
              aria-expanded={newsletter}
              onClick={() => navigate(newsletter ? "/" : "/newsletter")}
            >
              {newsletter ? "Close" : "Newsletter"}
            </button>
          </div>
        </header>
      )}
      {overlay && (
        <div
          className="overlay"
          role="dialog"
          aria-modal="true"
          aria-label={profile ? "Profile" : "Newsletter"}
          tabIndex={-1}
          ref={dialog}
        >
          <div className="overlay-content">
            {profile ? (
              <>
                <p data-overlay-copy>
                  Promptedsite, Global design engineer, named Top Agency
                  Independent of the Year in 2022 and 2024, building visually
                  rich, motion-driven websites. Usually lead or sole developer,
                  responsible for front-end architecture, animation, interaction
                  and CMS, alongside international agencies and creative teams.
                </p>
              </>
            ) : (
              <>
                <p data-overlay-copy>
                  An occasional newsletter with insights and thoughts from a
                  design engineer, drawn from over a decade of freelancing.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <label className="sr-only" htmlFor="newsletter-email">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="Email address"
                    autoComplete="email"
                  />
                  <button type="submit">Subscribe</button>
                </form>
                {submitted && (
                  <p role="status">
                    Newsletter delivery is not configured for this template.
                    Contact hello@promptedsite.com.
                  </p>
                )}
              </>
            )}
            <button
              className="sr-only"
              onClick={() => {
                setProfile(false);
                if (newsletter) navigate("/");
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
