# Source and dependency provenance

The owner supplied and authorized the reference repository hiiD4vd/interactive-webgl-portfolio at commit cfc8f9d. React components, hooks, route ownership, packaging, and asset administration were implemented for this migration.

src/renderer/vendor retains the supplied WebGL renderer and its Three.js, GSAP, GLTF/KTX2 loader dependencies. It was extracted by dependency analysis with Nuxt application bootstrap and Vue page components excluded. It remains derived JavaScript with upstream naming; it is not original handwritten TypeScript. Shader source remains embedded in the renderer to preserve its relationships and behavior.

React and Next.js use MIT licenses; installed package licenses remain in their packages. Three.js uses MIT; Basis Universal uses Apache-2.0. GSAP and the supplied renderer retain their applicable upstream licensing. This document does not grant a license to third-party material.

The Diatype font, photographs, videos, models, and glyph data were supplied by the owner and are listed with hashes in src/config/assets.json. Their commercial redistribution licenses were not independently inspected. Project descriptions, client names, and award claims are supplied demonstration content, not verified claims about a buyer. Review those before public branding or resale.
