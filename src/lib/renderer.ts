/** Typed boundary around the supplied, framework-independent WebGL engine. */
export type Project =
  | (typeof import("../data/portfolio.json"))["featured"][number]
  | (typeof import("../data/portfolio.json"))["projects"][number];
export type Frame = { time: number; ratio: number };
export type Listener = (frame: Frame) => void;
export interface Plane {
  dispose(): void;
  progress: number;
  enter?: number;
}
export interface Disposable {
  dispose(): void;
}
export interface Scene {
  traverse(
    callback: (object: {
      geometry?: Disposable;
      material?: Disposable | Disposable[];
    }) => void,
  ): void;
}
export interface Renderer {
  llamaRain?: { ensure(): Promise<unknown>; dispose(): void };
  core: {
    destroy(): void;
    scene: Scene;
    over: Scene;
    renderer: { forceContextLoss(): void };
    onTick?: (delta: number) => void;
  };
  mount(element: HTMLElement): void;
  declare(): void;
  boot(projects: Project[], bars: HTMLElement[]): Promise<void>;
  bootRelease(): void;
  bootP: { p: number };
  nextPaint(): Promise<void>;
  returning?: string;
  showHome(element: HTMLElement, projects: Project[]): Promise<void>;
  hideHome(): void;
  showTitles(
    titles: { card: HTMLElement; el: HTMLElement; slug: string }[],
  ): Promise<void>;
  scan(element: HTMLElement, projects?: Project[]): unknown;
  setVelocity(value: number): void;
  setScroll(value: number): void;
  setProgress(value: number): void;
  tone(slug: string, on: boolean): void;
  select(slug: string): void;
  landTitle(element: HTMLElement, project: Project): void;
  releaseTitle(): void;
  releaseHero(): void;
  text(
    element: HTMLElement,
    options?: { reveal?: boolean; over?: boolean; group?: string },
  ): Promise<Plane | undefined>;
  bindHole(element: HTMLElement | null, group?: string): void;
  openHole(open: boolean): void;
  overlay: Plane[];
  raiseHud(element: HTMLElement): Promise<Plane | undefined>;
  revealHud(delay?: number): void;
  dropTexts(planes: Plane[]): void;
  depart(): void;
  fadeLeaving(): void;
  simple(element: HTMLElement, media: Project["images"][number]): void;
  pill(element: HTMLElement, options: Record<string, boolean>): void;
  rail: {
    bind(element: HTMLElement | null, projects?: Project[]): void;
    point(x: number, y: number): void;
    pick(index: number): void;
  };
  watchBall(): void;
  watchTab(): void;
  showBall(on: boolean): void;
  ball: { tx: number; ty: number; sx: number; sy: number; seen: boolean };
  videos: Map<
    string,
    { el: HTMLVideoElement; texture: Disposable; playing: boolean }
  >;
  playVideo(
    video: { el: HTMLVideoElement; playing: boolean },
    playing: boolean,
  ): void;
  resolved: Map<string, Disposable>;
}
export interface EngineModule {
  PortfolioRenderer: new (context: {
    $resize: {
      ww: number;
      wh: number;
      small: boolean;
      mouse: boolean;
      add(callback: () => void): void;
      remove(callback: () => void): void;
    };
    $event: {
      on(event: string, callback: Listener): void;
      off(event: string, callback: Listener): void;
    };
  }) => Renderer;
  gsap: {
    to(target: object, options: Record<string, unknown>): unknown;
    killTweensOf(target: object): void;
    context(callback: () => void): { revert(): void };
    ticker: { sleep(): void };
    globalTimeline: { timeScale(value: number): void };
  };
}
export const loadRenderer = (): Promise<EngineModule> => {
  const url = "/engine/DZyj3ghP.js";
  return import(/* webpackIgnore: true */ url);
};
