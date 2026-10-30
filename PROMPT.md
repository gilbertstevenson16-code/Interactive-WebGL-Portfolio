# Run and preview Interactive WebGL Portfolio

Work with the existing authorized Interactive WebGL Portfolio template. Your deliverable is its real interactive website, visible to the user, followed by only the customizations the user requests. Preserve the existing components, styles, renderer, shaders, project content, and media.

## Source

Prefer the source ZIP attached to this product or conversation. Otherwise download:
https://github.com/gilbertstevenson16-code/Interactive-WebGL-Portfolio/releases/download/template-v1.0.0/interactive-webgl-portfolio-source.zip

Repository: https://github.com/gilbertstevenson16-code/Interactive-WebGL-Portfolio.git
Pinned tag: template-v1.0.0

Read AI_START_HERE.md, README.md, docs/validation.md and THIRD_PARTY.md. Do not infer that this is a completely rewritten TypeScript renderer: React/TypeScript owns the application; the attributed WebGL engine is retained JavaScript.

## Detect your environment

Local coding agent: run npm ci, npm run dev -- --hostname 127.0.0.1 --port 3150, then open http://127.0.0.1:3150 in the user's browser. Use canonical R2 media by default.

Remote coding agent: run the application on a host/port supported by your platform and expose it using the platform's preview/port-forwarding tool. A localhost address inside your sandbox is not reachable by the user.

Browser chat AI: create a real interactive Artifact/Preview attached to this conversation. Prefer the complete prebuilt portable preview:
https://github.com/gilbertstevenson16-code/Interactive-WebGL-Portfolio/releases/download/template-v1.0.0/interactive-webgl-portfolio-preview.zip

Download and extract it yourself, then register the complete directory with your platform's supported static-file or multi-file artifact host. Serve index.html, _next, engine, preview-media, and the exported route directories together from one HTTP origin. Preserve module scripts, WebGL2, font loading, and accompanying binary files. Do not merely attach the ZIP or describe a successful build.

If you can build from source, npm run preview:package creates the same portable directory in out/. It attempts R2 and then the pinned GitHub fallback automatically. Do not ask the user to upload media that can be downloaded from the release.

Media fallback:
https://github.com/gilbertstevenson16-code/Interactive-WebGL-Portfolio/releases/download/media-4a4f2ff682aac687/interactive-webgl-portfolio-assets.zip

ZIP SHA-256: e4a117b900d48d6a281b71f60bb784b37176a657cce2e77bdea7301d06242486

Verify files against src/config/assets.json. Package media as same-origin companion files if the panel blocks cdn.promptedsite.com. Do not replace the canonical R2 configuration in the distributed source.

## Acceptance

Open the user-facing preview and check that the loading state clears, the WebGL featured cards render, scrolling/dragging moves the cards, Full opens the project index, a featured project opens its detail, Next/Previous/Close work, and Profile/Newsletter can open and close. Check desktop and mobile, keyboard navigation, missing media and console errors. Run npm run typecheck, npm run lint, npm run build and npm test when your environment supports them. Run npm run assets:verify only when R2 is reachable.

The newsletter is a frontend template without a connected subscription service. Do not report that an email was subscribed. Two videos absent from the supplied reference use their supplied image fallbacks; do not invent replacements.

Do not use an iframe, proxy, screenshot, video-only substitute, guessed mockup, or dangerouslySetInnerHTML to replicate the application. Do not request secrets or private endpoints. Do not commit, push or deploy publicly unless the user asks.

Present the interactive Artifact/Preview or reachable URL first. Report checks actually performed and remaining limitations. Do not stop at an internal server, code block, filesystem path or build report when interactive preview capabilities are available.

If your platform cannot serve companion files, run WebGL, download the packages, or expose a preview, state the exact verified restriction and what deliverable is available. A prompt cannot grant missing platform capabilities; do not claim preview success without a visible functioning result.
