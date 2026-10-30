"use client";
import { useEffect, type RefObject } from "react";
import type { Renderer } from "@/lib/renderer";

/** Reference carousel geometry, with React-owned input and animation cleanup. */
export function useCarousel(
  track: RefObject<HTMLDivElement | null>,
  renderer: Renderer | null,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled || !renderer || !track.current) return;
    const node = track.current,
      abort = new AbortController();
    let frame = 0,
      target = 0,
      actual = 0,
      previous = performance.now(),
      pointer: number | null = null,
      moved = false;
    let entries: {
        element: HTMLElement;
        left: number;
        top: number;
        width: number;
        height: number;
      }[] = [],
      length = 0;
    const small = () => window.innerWidth <= 649;
    const measure = () => {
      const children = Array.from(node.children) as HTMLElement[];
      children.forEach((el) => {
        el.style.transform = "";
      });
      entries = children.map((element) => {
        const r = element.getBoundingClientRect();
        return {
          element,
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height,
        };
      });
      const gap =
        parseFloat(getComputedStyle(node)[small() ? "rowGap" : "columnGap"]) ||
        0;
      const first = entries[0],
        last = entries.at(-1);
      if (!first || !last) return;
      length = small()
        ? last.top + last.height - first.top + gap
        : last.left + last.width - first.left + gap;
      const centered = entries[1] || first;
      target = actual = small()
        ? centered.top + centered.height / 2 - window.innerHeight / 2
        : centered.left + centered.width / 2 - window.innerWidth / 2;
      render();
    };
    const render = () => {
      for (const entry of entries) {
        let shift = actual;
        const max = small()
          ? entry.top + entry.height
          : entry.left + entry.width;
        const min = -(length - max);
        shift = ((((actual - min) % length) + length) % length) + min;
        entry.element.style.transform = small()
          ? `translate3d(0,${-shift}px,0)`
          : `translate3d(${-shift}px,0,0)`;
      }
    };
    const add = (delta: number) => {
      target += delta;
    };
    window.addEventListener(
      "wheel",
      (e) => {
        if (!e.ctrlKey) {
          e.preventDefault();
          add((e.deltaY + e.deltaX) * 1.25);
        }
      },
      { passive: false, signal: abort.signal },
    );
    window.addEventListener(
      "keydown",
      (e) => {
        if ((e.target as HTMLElement).matches("input,textarea")) return;
        const amount = (
          {
            ArrowDown: 100,
            ArrowRight: 100,
            ArrowUp: -100,
            ArrowLeft: -100,
            PageDown: window.innerHeight * 0.9,
            PageUp: -window.innerHeight * 0.9,
            " ": window.innerHeight * 0.9,
          } as Record<string, number>
        )[e.key];
        if (amount !== undefined) {
          e.preventDefault();
          add(amount);
        }
      },
      { signal: abort.signal },
    );
    node.addEventListener(
      "pointerdown",
      (e) => {
        pointer = small() ? e.clientY : e.clientX;
        moved = false;
      },
      { signal: abort.signal },
    );
    window.addEventListener(
      "pointermove",
      (e) => {
        if (pointer === null) return;
        const next = small() ? e.clientY : e.clientX;
        const delta = pointer - next;
        pointer = next;
        if (Math.abs(delta) > 2) moved = true;
        add(delta);
      },
      { signal: abort.signal },
    );
    window.addEventListener(
      "pointerup",
      () => {
        pointer = null;
      },
      { signal: abort.signal },
    );
    window.addEventListener(
      "pointercancel",
      () => {
        pointer = null;
      },
      { signal: abort.signal },
    );
    node.addEventListener(
      "click",
      (e) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        }
      },
      { capture: true, signal: abort.signal },
    );
    window.addEventListener("resize", measure, { signal: abort.signal });
    const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const tick = (time: number) => {
      const ratio = Math.min(2, (time - previous) / (1000 / 60));
      previous = time;
      actual = reduced
        ? target
        : actual + (target - actual) * Math.min(1, 0.1 * ratio);
      actual = Math.round(actual * 100) / 100;
      renderer.setVelocity(small() || reduced ? 0 : target - actual);
      if (small()) renderer.setScroll(reduced ? 0 : target - actual);
      render();
      frame = requestAnimationFrame(tick);
    };
    measure();
    frame = requestAnimationFrame(tick);
    return () => {
      abort.abort();
      cancelAnimationFrame(frame);
      entries.forEach((entry) => (entry.element.style.transform = ""));
    };
  }, [track, renderer, enabled]);
}
