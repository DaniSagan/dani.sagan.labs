# Mandelbrot renderer

The component retains `/articles/mandelbrot-set`. Controls occupy a full-width row below the canvas on every viewport.

## Camera and numerical engine

- `mandelbrot-view.ts` stores the center as exact dyadic integers, a binary precision and logarithmic zoom. Precision grows to at least `ceil(zoom) + 96` bits. Wheel and pinch preserve the world point under the cursor or gesture midpoint. No maximum zoom level is imposed.
- `mandelbrot-engine.ts` uses analytic cardioid/bulb interior tests and direct binary64 iteration with exact-state periodicity shortcuts near the full view. Deep views use a BigInt reference orbit, perturbation, rebasing and conservative hierarchical BLA skips. At very deep scales, complex deltas carry a separate exponent. Suspicious cancellation is repaired with full-precision iteration.
- BLA skips only bounded reference segments and uses a strict nonlinear tolerance. Four samples are averaged in linear color space, adaptively at edges or throughout in maximum quality. The image remains a finite-iteration approximation.
- `mandelbrot-renderer.ts` schedules tiles across up to eight Web Workers. New camera requests terminate obsolete work; generation IDs prevent stale publication. A coarse image appears first and is refined without empty stripes. Environments without Workers use cooperative tile rendering.
- `mandelbrot-palettes.ts` recolors cached escape samples without rerunning orbits. Saved JSON positions retain all coordinate bits; PNG export uses the current image resolution.

The algorithm references are [mathr: Deep Zoom](https://mathr.co.uk/web/deep-zoom.html) and [Deep zoom theory and practice](https://mathr.co.uk/blog/2021-05-14_deep_zoom_theory_and_practice.html). There is no single universally fastest algorithm; the engine switches according to numerical range.

## Verification

Run `npm run test:mandelbrot`, then build with `npx ng build --configuration development` and run `npm run test:mandelbrot:browser`.

Numerical tests compare against full BigInt oracles at binary zooms 0, 50, 1100 and 4096, exercise a reference that deliberately triggers a precision repair, test exact position serialization, and verify worker cancellation and failures. Browser tests use native mouse and touch input, check recoloring preserves the escape field, and validate desktop, small portrait and landscape layouts. Artifacts are written to `tmp/mandelbrot-audit/`.

A zoom of 2^4096 exceeds 10^1233. Further depth is limited by available time and memory, rather than a fixed UI or binary64 ceiling. Automatic iteration budgets grow with depth; users can select larger budgets or enter a custom integer.
