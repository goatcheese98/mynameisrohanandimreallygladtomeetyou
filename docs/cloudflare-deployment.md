# Static Cloudflare artifact — hosting follow-up

This is a dependent follow-up to the accessibility draft at `12dc3f7d9a4cb31f501a2056f93ef2f9b2014a57`, based on `codex/lum-portfolio-accessibility`. It prepares **Cloudflare Workers Static Assets**, not a Cloudflare Pages Functions/SSR deployment. No account, domain, route, credentials, production deployment or paid service was created or changed. The existing worker name and compatibility date are retained.

## Debt inventory

| Before                                                                                          | After                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static output existed, but Cloudflare behavior was untested                                     | Pinned Wrangler validates an assets-only dry-run; local workerd serves the real artifact                                                                   |
| Broken paths returned an empty 404                                                              | A true HTTP 404 serves a LUM-styled, no-JavaScript page with keyboard paths back to introduction/contact                                                   |
| No explicit CSP, anti-sniffing, framing, referrer or permissions headers                        | Native `_headers` applies restrictive CSP without unsafe-inline/eval and the additional headers on successful and error asset responses                    |
| Cache policy was unspecified                                                                    | HTML and the unhashed photo/PDF explicitly revalidate; only exact emitted fingerprinted assets receive one-year immutable caching; unknown assets never do |
| Repeat-build determinism was unproved; legacy Pages workflow used Node 20 and unlocked install  | Node 24.19.0/npm 11.9.0 contract, `npm ci`, repeat SHA-256 comparison; both workflows use the pinned Node file                                             |
| Unused GSAP remained installed; npm's production audit hid bundled Svelte under devDependencies | GSAP removed; Svelte 5.41.1 → 5.55.7 fixes seven registry advisory matches without changing the Svelte major or Vite/font versions                         |

The original identity, paragraphs, quotes, contact destinations, headshot and PDF are unchanged. Main-page layout and LUM tokens remain unchanged. The 404 shares the compiled Geist/fonts/styles, replaces its title, adds noindex, uses root-relative asset/recovery links, and omits the introduction's hydration script. It remains styled at arbitrarily nested unknown URLs with JavaScript disabled.

## Build and runtime contract

Use Node **24.19.0** (`.node-version`) and npm **11.9.0** (`packageManager`/engines), from the repository root (`engine-strict=true` rejects incompatible Node/npm):

```sh
npm ci
npm run typecheck
npm run lint
npm run build:verify
WRANGLER_SEND_METRICS=false CLOUDFLARE_CF_FETCH_ENABLED=false npm run check:cloudflare
npx playwright install chromium
CHROMIUM_PATH=/usr/bin/chromium npm test
WRANGLER_SEND_METRICS=false CLOUDFLARE_CF_FETCH_ENABLED=false CHROMIUM_PATH=/usr/bin/chromium npm run test:cloudflare
```

On CI use Playwright's installed Chromium and omit `CHROMIUM_PATH`. After all gates pass, CI retains `dist/` plus `wrangler.jsonc` as the `cloudflare-static` downloadable artifact for seven days; no upload to a hosting provider occurs. `build:verify` runs two clean Vite/client and build-time Svelte renders, compares every `dist` file by SHA-256, rejects symlinks, and requires HTML, 404, headers, photo and PDF. The generated `_headers` adds exact emitted cache rules with a bounded rule count. A wildcard cache rule was tested and rejected because it also cached missing-asset 404s as immutable.

`wrangler.jsonc` uses `dist`, explicit `html_handling: auto-trailing-slash` and `not_found_handling: 404-page`. There is no application Worker entry, Node runtime, SSR request handler, binding, migration, API, remote list or secret requirement. Wrangler may emit its own small static-assets shim during dry-run; this is not application SSR. `workers_dev` and preview URLs are explicitly false; no public URL is selected. `.wrangler`, `.prerender` and `.cloudflare-dry-run` are ignored generated folders.

`CLOUDFLARE_CF_FETCH_ENABLED=false` disables Miniflare's optional online Request.cf metadata lookup; that metadata is not used by the app. Telemetry is disabled. Cloud validation additionally preloaded the existing cloud-only outbound guard. Neither setting disables routing, security, browser or quality checks. The initial guarded baseline correctly blocked an optional metadata request; the supported setting then removed that network dependency.

For an interactive **local-only cloud** preview:

```sh
WRANGLER_SEND_METRICS=false CLOUDFLARE_CF_FETCH_ENABLED=false npm run preview:cloudflare
```

This listens on loopback port 4173. The second browser configuration runs all 15 original cases against that runtime, plus native status/header/cache/HEAD and Range-request checks and six 404 theme/width/keyboard/no-JavaScript cases. Its text-magnification fixture is a same-origin test stylesheet, so the test respects the production CSP rather than weakening it. Local workerd ignores the PDF Range request and returns the complete PDF with HTTP 200, which HTTP permits; tests verify identical full-file bytes and also validate a correct 206 representation if supported. The native Range fallback omitted its default Cache-Control, so explicit photo/PDF revalidation rules are shipped. No partial-content guarantee or extra PDF runtime handler is introduced. Local runtime validation does not establish deployed CDN, TLS, WAF or account settings.

## Dependency audit and compatibility

The production-only npm audit returned zero advisories, but that classification alone is insufficient: Svelte is a build dependency whose browser runtime is bundled. A bounded registry advisory-bulk query therefore inspected exact locked package versions too. Seven Svelte advisories matched 5.41.1 (SSR attribute/dynamic-tag/option/contenteditable paths and DOM clobbering); 5.55.7 is the minimum release beyond all returned vulnerable ranges and has zero matches in the refreshed query. Its Node >=18 requirement and the existing Svelte Vite plugin accept the pinned Node 24/Svelte 5 combination; typecheck, builds and browser behavior verify it here. Fonts remain 5.2.6; Vite remains 7.1.11; Wrangler 4.151.2 requires Node >=22. No `npm audit fix`, force upgrade or framework rewrite was used.

The complete CLI audit was delayed and stopped; the direct registry bulk query completed and was matched against installed versions. Build/dev-only advisory matches remain in braces, picomatch, nanoid, postcss, rollup, source-map-js and Vite. Their exact findings are retained in [dependency-audit.json](dependency-audit.json). These tools are not uploaded as an application runtime; builds consume this repository's trusted source. This follow-up does **not** claim an advisory-free development toolchain. Those compatible toolchain repairs remain a separately scoped debt rather than a broad dependency refresh here.

## Recorded cloud verification

All commands in [hosting-command-results.json](hosting-command-results.json) exited 0: frozen install, typecheck (zero errors/warnings), read-only lint, double build, official dry-run, original preview suite, Cloudflare suite and diff check. Final counts: 15/15 original preview cases and 22/22 Cloudflare-local cases (50.5 seconds). The second suite includes the same original 15; they were not replaced or skipped.

Repeated-build artifact SHA-256: `2830859f415d654269a22e2e53d848d1d1af9091c75bdf83b48865d749e785ea` (digest of the sorted per-file SHA-256 manifest printed by `build:verify`). Baseline root/PDF returned 200 without security headers; broken and missing-asset routes returned empty 404s. During implementation, native tests rejected wildcard immutable caching on missing assets and detected the Range fallback's absent default Cache-Control. Exact emitted cache rules plus explicit PDF/photo revalidation resolved both without a request-time application Worker. The first config-import typecheck error was fixed with TypeScript's no-emit import-extension support. The earlier assumption that Range must return 206 was corrected to HTTP's valid complete-file fallback with byte equality still enforced.

New application screenshots: [320 light](design/screens/cloudflare-404/404-light-320.png), [320 dark](design/screens/cloudflare-404/404-dark-320.png), [768 light](design/screens/cloudflare-404/404-light-768.png), [768 dark](design/screens/cloudflare-404/404-dark-768.png), [1440 light](design/screens/cloudflare-404/404-light-1440.png), [1440 dark](design/screens/cloudflare-404/404-dark-1440.png). All six main-page screenshots from the same Cloudflare run are byte-identical to the accessibility checkpoint. All six new 404 captures were visually inspected in addition to the functional assertions. These are cloud browser application captures, not Paper exports or human approval. Review covers correctness, CSP-compatible hydration, true error status/MIME, root-relative nested-path recovery, cache bounds, unchanged source identity/links and build-only/runtime separation.

## Owner-only deployment decision and exact handoff

The owner must decide whether this separate BAIT 518 assignment portfolio should remain hosted alongside newer AstroWebsite, and identify the authorized existing Cloudflare account/worker/route. The current artifact assumes an **origin-root** mount; prefix hosting requires an explicit base-path review. In particular, `_headers` is a Cloudflare contract and is not enforced by GitHub Pages. The existing GitHub Pages release workflow is preserved (with locked installation/pinned Node), so the owner must resolve duplicate-hosting/release policy before any merge or production release. No workflow was triggered for deployment.

Only after that decision, independent human authorization and access setup by the owner:

1. Check out the reviewed published commit, select the pinned tool versions, and run the full commands above. Verify the recorded artifact digest and tests for that checkout.
2. In the existing Cloudflare account, verify the existing `rohan-jasani-intro` target, origin-root routing and any current settings. Review any required route configuration separately; no route, account ID or domain is inferred here.
3. With the owner's own authorized Cloudflare session, rerun `npm run check:cloudflare`, then run `npx wrangler deploy --config wrangler.jsonc` **only as a separately authorized production action**. Do not use the legacy `npm run deploy` command, which targets GitHub Pages.
4. Verify the chosen existing URL's root document, real nested 404, JS/CSS/font MIME types and cache/security headers, résumé range/download, keyboard navigation and quote hydration. Retain the prior asset deployment/version for the owner's rollback procedure. Local workerd results are not evidence of this production verification.

This session performed steps only through artifact preparation, dry-run and cloud-local checks. Human hosting decisions, actual account/edge verification and any release remain outside its authorization. Paper remains an unapproved candidate; its original PNG and a cloud Paper integration remain unavailable. No design approval is inferred for this follow-up.
