# Verification

Work is scoped to `goatcheese98/mynameisrohanandimreallygladtomeetyou`, branch `codex/lum-portfolio-accessibility`, based on default `main` at `dfa9eb3dfa821d18edfa7a44d7d206e3546229db`. Cloud restored source was clean and matched the connector's default-branch SHA. Restored onboarding helpers and pristine dependency copy were inspected without using embedded credentials. Implementation uses the authoritative Git checkout, writable `/workspace/onboarding/npm-cache`, and cloud Chromium.

## Baseline (before implementation)

The locked offline install passed outside the process sandbox, exit 0. The first sandboxed install failed with esbuild `spawnSync EPERM`; this is recorded as an environment failure, not an application defect. Baseline production build passed, with existing Svelte unused-selector warnings. No baseline test/typecheck/lint scripts existed.

A real Chromium reproduction at 320px with reduced motion found: header navigation exceeded the viewport; clicking About left the location hash empty; quotes changed after 5.2 seconds. Computed CSS scroll behavior was `auto`, but the original JavaScript explicitly requested smooth scroll; do not interpret the CSS value as a verified motion fix.

## Final checks

Final locked install (`npm ci --cache /workspace/onboarding/npm-cache --offline --no-audit --no-fund`), `npm run typecheck`, `npm run lint`, `npm run build` and `CHROMIUM_PATH=/usr/bin/chromium npm test` all passed, exit 0. Svelte reports zero errors/warnings. Final browser suite: 15 passed in 46.6 seconds. `git diff --check`: exit 0. The initial test runner failed on a missing Node 24 JSON import attribute; corrected before the passing runs. No baseline failure was silently waived.

Published behavior tests cover all original quotes through wraparound, original paragraphs and destinations, real PDF bytes, native keyboard navigation/history, skip-link focus, visible focus in both themes, all target sizes and no horizontal overflow. Calculated WCAG text contrast meets 4.5:1 for foreground/muted/action text, and accent focus against canvas meets 3:1 in each theme. No console/page/HTTP errors occurred in the preserved-content journey. Browser network routes deny external destinations; font files are local. No link followed a live provider destination.

[320 light](design/screens/light-320.png) · [320 dark](design/screens/dark-320.png) · [768 light](design/screens/light-768.png) · [768 dark](design/screens/dark-768.png) · [1440 light](design/screens/light-1440.png) · [1440 dark](design/screens/dark-1440.png). These are application screenshots, not the unattached Paper PNG. Desktop light/dark and narrow dark plus tablet light were visually inspected; behavior assertions cover every generated size/theme.

## Limits and review

Chromium was tested in cloud; Firefox/WebKit and screen-reader speech output were not tested. 200% **text magnification** and reflow passed at 320px. Actual **200% Chromium tab zoom also passed** in separate cloud checks: a 1440px outer window measured 720px layout width/devicePixelRatio 2, and a 640px outer window measured 320px layout width/devicePixelRatio 2. Both had no horizontal overflow and native keyboard Contact navigation passed. Temporary extension attempts timed out; a fresh cloud-only Chromium profile using per-host zoom preferences recovered the check. A profile default-only attempt was correctly rejected because it still measured devicePixelRatio 1. Commands: `node /workspace/work/lum/freshzoom.cjs` and `node /workspace/work/lum/profilezoom.cjs`, final exits 0. These checks used the built static preview, no local desktop browser. The Paper candidate remains unapproved and its original PNG is absent. Ownership/hosting relationship to newer AstroWebsite still needs a separate decision. Remote CI will run after PR creation; local cloud checks do not claim its result.

Reviewed all changed code for native interaction, content preservation, static-render/hydration parity, runtime DOM checks, safe external-link attributes, dependency scope, responsive reading order and unnecessary animation/listeners. Replaced prerender string substitution with callbacks to preserve literal dollar sequences. Client JS decreased from approximately 107.01 kB to 33.38 kB (uncompressed build output); unused GSAP dependency remains installed for compatibility but is no longer bundled. No full-repo migration is claimed.

## Coverage

Browser tests assert original content/links from a default-branch fixture, PDF content, native keyboard/hash/history navigation and focus, quote control, reduced motion, live preference changes, both themes at 320/390/768/1024/1440px, layout and 44px targets, measured text contrast, text magnification and static HTML with JavaScript disabled/missing photo. Screenshots supplement behavior assertions.

No merge, production release, provider call, secret provisioning, package publication or changes to another repository. GitHub CLI authentication was unavailable; publication uses the connector and verifies the exact tested Git tree.
