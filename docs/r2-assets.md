# Media distribution

Canonical bucket: media. Prefix: templates/interactive-webgl-portfolio/releases/4a4f2ff682aac687.

Base URL: https://cdn.promptedsite.com/templates/interactive-webgl-portfolio/releases/4a4f2ff682aac687

198 files, 96,373,386 bytes. Categories are fonts, images, media, textures, models, glyphs, and basis decoders. All were downloaded back from R2 and verified by SHA-256, Content-Type and CORS. Credentials stay outside the source project.

src/config/assets.json contains object checksums; asset-paths.json maps supplied paths to organized keys. React uses src/data/index.ts, while prepare-runtime.mjs resolves the renderer and CSS paths from the same manifest.

The GitHub media release is a fallback for network-restricted AI environments. npm run preview:package verifies its ZIP checksum and every extracted asset before creating a same-origin preview. R2 remains the default for npm run dev and npm run build.

No media binaries are included in the source ZIP. The portable preview ZIP deliberately includes media and the compiled application. Source Git metadata, secrets, node_modules, and caches are excluded from both distributable packages.
