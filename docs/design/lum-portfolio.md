# LUM portfolio candidate translation

[Exact Paper candidate](https://app.paper.design/file/01M5B2XH5TEZKC9Y9V4P3DHFSX/p-1-0), October 19, 2026: implementation candidate, **not approved**. The attached JSX/styles/token readback is the layout source; no screenshot measurement or local Paper access was used. Its fictional Avery Chen and city project were excluded. No PNG was attached, exported or committed by this implementation.

## Source and tokens

Read through the GitHub connector in `goatcheese98/lum-brain`:

- `src/styles/design-tokens.ts`, blob `e7e0c2362848c209914a5d9da2bcaa5657b663b8`
- `src/styles/fonts.ts`, blob `d32cace0ed25de3f8e164b9b2d906ca6e782c0e9`
- `src/dashboard-shell-css/primitives.ts`, blob `86324ebdaca47f0837b09c774e31a96f4d81b2d5`
- `src/dashboard-shell-css/shell-chrome.ts`, blob `9678f3e1bf6d00e4f2701b355b8612b2a488574b`

The brief's ambiguous dashboard paths resolved under `src/dashboard-shell-css/`, not `src/styles/dashboard-shell-css/`. Canonical palette source was available; no separate design-contract file was needed to infer dark colors. CSS mirrors the relevant exact `--bg/--panel/--panel2/--line/--line2/--fg/--mut/--mut2/--acc/--on-acc` values and 6/8/10/12/16px radii. Dark uses gold `#d6a828` with `#141210` action text. Small body text uses `--mut`, never `--mut2`.

Geist UI and Geist Mono use local font packages instead of LUM's Google Fonts link, avoiding a provider request. `--font-ui`, `--font-mono`, spacing 4/8/12/16/24/32/48/64/96px and 24px body line-height are destination additions identified in the readback. Page padding is 24px below 768px, 32px below 1024px and 48px above. Type is at least 16px; the 30px heading has 40px line-height and -0.03em tracking. The candidate's 720px text column and 96px metadata column inform a responsive editorial row; fixed 900px height and clipping are excluded.

## Native behavior and states

One h1, semantic sections and headings, direct wrapping navigation, a visible-on-focus skip link, 44px targets and 2px accent focus outlines implement the journey: introduction → selected work → existing email/contact. There are no case-study destinations in the original portfolio, so no project data or dead action was invented. About, Journey and Skills retain published descriptions. The original contact and download URLs and download filename survive; the PDF is checked as a real asset.

Static HTML renders before hydration. Missing headshot media leaves the text intact. Empty work has an honest message and email alternative. The quote control is disabled until hydration and changes only by user action; all original quotes remain available. No remote data, loading skeleton, retry, success toast or fake status is needed. No optional animation remains, so no pause control is required. CSS also explicitly suppresses motion under reduced preference.

No application data is fetched from external boundaries; the only DOM boundary (client mount) is checked at runtime. Typed Svelte logic and prerender/client entries replace touched JavaScript; no full-repo migration is claimed.

Application review screenshots are in [screens/](screens/). They do not replace the missing Paper export.
