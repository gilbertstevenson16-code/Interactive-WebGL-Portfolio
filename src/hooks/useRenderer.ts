"use client";
import { useEffect, useRef, useState } from "react";
import { loadRenderer, type Renderer, type Listener } from "@/lib/renderer";
import data from "@/data";

export function useRenderer() {
  const host = useRef<HTMLDivElement>(null);
  const [renderer, setRenderer] = useState<Renderer | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let disposed = false,
      frame = 0,
      engine: Renderer | undefined;
    const abort = new AbortController();
    const ticks = new Set<Listener>(),
      resizes = new Set<() => void>();
    let tweenContext: { revert(): void } | undefined;
    const resize = {
      ww: window.innerWidth,
      wh: window.innerHeight,
      small: window.innerWidth <= 649,
      mouse: matchMedia("(hover:hover) and (pointer:fine)").matches,
      add: (fn: () => void) => {
        resizes.add(fn);
      },
      remove: (fn: () => void) => {
        resizes.delete(fn);
      },
    };
    const onResize = () => {
      resize.ww = window.innerWidth;
      resize.wh = window.innerHeight;
      resize.small = resize.ww <= 649;
      resizes.forEach((fn) => fn());
    };
    window.addEventListener("resize", onResize, { signal: abort.signal });
    loadRenderer()
      .then(async (module) => {
        if (disposed || !host.current) return;
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2");
        if (!gl)
          throw Error(
            "WebGL2 is unavailable. Your project links remain accessible below.",
          );
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        engine = new module.PortfolioRenderer({
          $resize: resize,
          $event: {
            on: (_event, fn) => {
              ticks.add(fn);
            },
            off: (_event, fn) => {
              ticks.delete(fn);
            },
          },
        });
        const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
        module.gsap.globalTimeline.timeScale(reduced ? 1000 : 1);
        const current = engine;
        // React owns these subscriptions so navigating/unmounting releases them.
        current.watchBall = () => {
          window.addEventListener(
            "pointermove",
            (event) => {
              if (!resize.mouse || reduced) return;
              const b = current.ball;
              b.tx = event.clientX;
              b.ty = event.clientY;
              if (!b.seen) {
                b.seen = true;
                b.sx = b.tx;
                b.sy = b.ty;
              }
              current.showBall(true);
            },
            { signal: abort.signal },
          );
          document.documentElement.addEventListener(
            "pointerleave",
            () => current.showBall(false),
            { signal: abort.signal },
          );
        };
        current.watchTab = () =>
          document.addEventListener(
            "visibilitychange",
            () =>
              current.videos.forEach((video) =>
                current.playVideo(video, video.playing),
              ),
            { signal: abort.signal },
          );
        tweenContext = module.gsap.context(() => current.mount(host.current!));
        let previous = performance.now();
        const tick = (time: number) => {
          if (disposed) return;
          const ratio = Math.min(2, (time - previous) / (1000 / 60));
          previous = time;
          ticks.forEach((fn) => fn({ time, ratio }));
          frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        await document.fonts.ready;
        current.declare();
        await current.boot(data.featured, []);
        current.bootRelease();
        if (!disposed) setRenderer(current);
        if (!reduced) {
          const rainUrl = "/engine/CHzWqGxK.js";
          const { Rain } = (await import(
            /* webpackIgnore: true */ rainUrl
          )) as {
            Rain: new (
              core: Renderer["core"],
            ) => NonNullable<Renderer["llamaRain"]>;
          };
          if (disposed) return;
          const rain = new Rain(current.core);
          await rain.ensure();
          if (disposed) rain.dispose();
          else current.llamaRain = rain;
        }
      })
      .catch((e) => {
        if (!disposed) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      abort.abort();
      ticks.clear();
      resizes.clear();
      tweenContext?.revert();
      if (engine) {
        engine.llamaRain?.dispose();
        engine.videos.forEach((v) => {
          v.el.pause();
          v.el.removeAttribute("src");
          v.el.load();
          v.texture.dispose();
        });
        engine.resolved.forEach((texture) => texture.dispose());
        for (const scene of [engine.core.scene, engine.core.over])
          scene.traverse((object) => {
            object.geometry?.dispose();
            const materials = object.material
              ? Array.isArray(object.material)
                ? object.material
                : [object.material]
              : [];
            materials.forEach((material) => material.dispose());
          });
        engine.core.renderer?.forceContextLoss();
        engine.core.destroy();
      }
    };
  }, []);
  return { host, renderer, error };
}
