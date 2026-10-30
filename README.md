# Interactive WebGL Portfolio

React 19 + TypeScript + Next.js static portfolio, using an attributed WebGL engine from the owner's reference. Featured work, a full project index, eight case studies, profile and newsletter panels. Canonical media lives in Cloudflare R2; a portable preview bundles the same verified assets locally.

## Run

Requires Node 20.9 or newer and npm. No credentials are required.

```sh
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3150
```

Open http://127.0.0.1:3150. For production run npm run build, then npm start (requires Python 3); the export is served at http://127.0.0.1:3151. All exported folders can also be served by an ordinary static HTTP host.

## Validate

```sh
npm run typecheck
npm run lint
npm run build
npm run assets:verify
npx playwright install chromium
BASE_URL=http://127.0.0.1:3151 npm test
```

Start the exported site first before running browser tests. Browser installation and R2 verification require network access; report restrictions honestly when unavailable.

## Browser AI preview

Run npm run preview:package to produce out/ with same-origin media. The script downloads canonical media, or the checksum-pinned GitHub media release if R2 is blocked. Publish/attach the complete out directory through the AI platform's supported static preview mechanism. A remote sandbox localhost address is not accessible from the user's device. See PROMPT.md for the complete customer-facing workflow and distribution links.

The prebuilt release preview requires no package installation. Extract it and serve over HTTP, or run python3 serve-preview.py inside it. It is not designed for file:// opening.

## Architecture

- src/components: semantic React UI for featured cards, project index, case studies, and overlays.
- src/hooks: input, carousel animation, renderer startup and resource cleanup.
- src/data: editable project records and typed media URL resolution.
- src/config: immutable R2 manifest and pinned distribution metadata.
- src/renderer/vendor: retained JavaScript renderer and dependency modules; no Nuxt application bootstrap. These are not handwritten TypeScript components.
- src/renderer/reference.css: supplied CSS preserved as the visual baseline.
- scripts: build-time URL resolution, verification, preview/source packaging and browser checks.

Application state and routing are React-owned. Browser history transitions preserve the WebGL scene. CSS and renderer source are retained to preserve visual behavior. No iframe, reverse proxy or HTML injection is used to render the application.

## Boundaries

The supplied reference lacks vid_1.mp4 and vid_2.mp4; image fallbacks are preserved. Newsletter delivery is not configured. Design claims, project copy and award counts are supplied demo content. Review THIRD_PARTY.md before redistribution. See docs/validation.md for the actual checks and visual limitations; no universal AI-preview or 100% pixel-match guarantee is made.
