# Validation — 30 October 2026

Reference: supplied static export. Chromium, desktop 1440×900 and mobile 390×844, en-US, dark scheme, normal motion, homepage state, ten-second settling interval.

## Passed

- TypeScript, ESLint and production static build (13 routes).
- Desktop/mobile: loading, featured WebGL cards, index, detail navigation, next project, close and Profile; no page errors or HTTP failures.
- Eight direct project URLs including spaces, reduced-motion flow, explicit newsletter status and WebGL-unavailable fallback.
- Portable preview edge-case run: no external requests.
- All 198 R2 objects verified for SHA-256, MIME type and CORS.
- Dependency audit: zero reported vulnerabilities at verification time.

## Fidelity and limitations

Homepage pixelmatch threshold 0.1: desktop 987 differing pixels (0.0762%); mobile 11,152 (3.3880%). These measure one frame, not whole-site fidelity. Animated/video frames are not synchronized or masked; mobile video timing contributes to differences.

The original direct-route payload differs from homepage navigation data. This migration consistently uses homepage data. Original direct detail pages therefore are not equivalent visual reference states.

Detail uses native finite scrolling rather than the original full cyclic-scroll choreography. Not every animation/state has been pixel-validated. Two absent reference videos use existing image fallbacks. Newsletter delivery is unconfigured and clearly reported.

React/TypeScript owns the application and lifecycle. The extracted, attributed WebGL renderer remains JavaScript; this is not a complete handwritten TypeScript rewrite.

Portable preview was verified in Chromium over local HTTP. A real Claude/ChatGPT artifact session was not verified. Multi-file serving, WebGL and download permissions depend on the host; a prompt cannot remove those restrictions.

## Reproduce

Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build`.
For portable testing run `npm run preview:package`, then `npm start`.
Use `BASE_URL=http://127.0.0.1:3151 npm test` and `BASE_URL=http://127.0.0.1:3151 node scripts/check-edge-cases.cjs` with the server running.
Install Playwright Chromium if needed. Visual comparison requires the maintainer's authorized reference captures, held outside the source ZIP.
