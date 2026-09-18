# Web rendering and image delivery

Photographs remain in `apps/web/public/images/places`; database rows contain
their local URLs and attribution. The web package prepares 320, 480, 640, 768,
1024 and 1280 px WebP variants before dev, build, typecheck and unit tests.
The source files and database image URLs do not need to change.

Run `npm run images:prepare --workspace @kuda-krym/web` after adding or replacing
a photograph during an existing development session. The generated manifest and
variants are ignored by Git and recreated inside the Docker builder. Sharp is
a web development dependency; production serves the generated files directly,
without running the Next.js image optimizer on visitor requests.

Generated URLs include a hash of source bytes and transformation settings.
They receive a one-year immutable cache header. Root-level decorative backgrounds
use a one-day cache with revalidation; replacing a background should also bump
its filename version for an immediate update. Brand SVGs retain their original
URLs. The loader intentionally rejects photographs missing from the build
manifest so incomplete deployments fail visibly instead of silently serving
incorrect image sizes.

Catalog cards render normally; only their photographs use native lazy loading.
The fixed background has no CSS blur. Large translucent panels skip backdrop
blur on coarse pointers, devices without hover, and viewports up to 1024 px.
Card hover transforms only run with a fine pointer and hover support.

Maps keep their full-size loading frame and automatically load their code/provider
as soon as the page mounts. No click or scrolling is required.

## Verification

- `npm run check`: data validation, type checks, lint, unit tests, release checks,
  production build and asset-size budget.
- `npm run test:e2e`: existing desktop journeys and tablet image/map regressions
  in Chromium and WebKit. Install engines with
  `npx playwright install chromium webkit`.
- Tests require the separate PostgreSQL database described in
  `tests/e2e/README.md`.
- Provider success is tested with a local script fixture, not real map traffic.
  Build E2E with `NEXT_PUBLIC_YANDEX_MAPS_API_KEY=e2e-test-key`; this is not a
  production credential.

WebKit desktop emulation does not reproduce the GPU, memory limits or touch
scrolling of a physical iPad. Passing tests verifies behavior and image delivery;
it does not establish an iPad FPS improvement.

The catalog still renders all 50 beaches and 36 coastal locations, preserving
filtering, navigation and accessible content. Pagination can be added when the
catalog grows. A persistent optimizer cache is unnecessary for the prepared
photographs because their resizing is now a build-time operation.
