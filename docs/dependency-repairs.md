# Compatible toolchain repairs

This follow-up preserves the reviewed Cloudflare checkpoint `25072484b75bb4ac76c02a54e3583e2b6c0868e0` and its parent accessibility PR. It updates only the compatible dependency graph and verification records. Native Svelte 5.55.7, Node 24.19.0/npm 11.9.0, Wrangler 4.151.2, app source, content, links, assets, layout, tokens and restrictive headers remain unchanged.

## Before and after

| Package       | Reviewed checkpoint | Repaired lock           |
| ------------- | ------------------- | ----------------------- |
| Vite          | 7.1.11              | 7.3.7, exact direct pin |
| Rollup        | 4.52.5              | 4.64.12                 |
| PostCSS       | 8.5.6               | 8.5.31                  |
| source-map-js | 1.2.1               | 1.2.2                   |
| nanoid        | 3.3.11              | 3.3.20                  |
| picomatch     | 2.3.1 / 4.0.3       | 2.3.2 / 4.0.7           |
| braces        | 3.0.3               | 3.0.3; no published fix |

Vite's existing Svelte plugin accepts `^6.3.0 || ^7.0.0`; Vite 7.3.7 stays within that supported major. `npm install --save-dev --save-exact vite@7.3.7` and `npm update rollup postcss source-map-js nanoid picomatch` resolved patches within parent ranges, without force, overrides or audit suppression. Vite's declared esbuild range moves its compiler from 0.25.11 to 0.28.2 (already used by Wrangler); npm deduplicates that existing compiler and its platform binaries. Rollup's platform binaries follow its version, and its compatible @types/estree patch follows its range. npm also reifies Wrangler's existing optional Linux lzma package. No other direct dependency changes.

Exact installed parent/version/range chains and every matching advisory are retained in [dependency-audit.json](dependency-audit.json). Important paths include Vite → Rollup/PostCSS/picomatch, eslint-plugin-svelte → PostCSS → nanoid/source-map-js, svelte-check → fdir → picomatch, and gh-pages → globby → fast-glob → micromatch → picomatch/braces. Shared peer/deduplicated consumers are included in the machine-readable chains.

## Audit scope and remaining exposure

The complete npm bulk-advisory endpoint was queried for every exact lockfile version, including development and optional cross-platform entries, using curl's 30-second bound and a 35-second process timeout. Each returned vulnerable range was matched with semver against actual locked versions. The supplementary `npm audit --json --fetch-retries=0 --fetch-timeout=15000` hit its separate 45-second wall-time limit; no clean CLI result is claimed. The complete bulk result remains available and avoids the CLI's additional fix-metadata resolution. The checkpoint had 19 affected version/range matches across seven package names (picomatch has two installed major versions); the repaired lock has **one high advisory**, solely braces. Neither an empty production-only audit nor build-tool classification is used to dismiss the repaired findings. The five listed Vite dev-server/file-read advisories and all listed repairable transitive findings no longer match.

`braces@3.0.3` remains affected by [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), stack exhaustion from deeply nested patterns. npm still reports 3.0.3 as its latest published release, and the advisory covers `<=3.0.3`. It is reached through the exact gh-pages chain above. This is a genuine unfixed development dependency, not a clean audit. The static deployment includes none of this Node toolchain and cannot accept glob patterns. Current repository commands use fixed, trusted patterns; the legacy gh-pages deploy command is not executed here. An operator running tooling on attacker-controlled glob patterns or untrusted build input remains exposed to denial of service. Retain this debt for a published upstream fix or a separately reviewed removal/replacement of the legacy hosting tool; do not weaken or suppress the audit.

No production hosting action, account/route/credential change, merge or release occurs. The original Cloudflare handoff and owner-only hosting decision still apply. Paper exports/cloud integration/human approval remain unavailable; dependency verification implies no design approval.

## Cloud verification

All eight commands in [dependency-command-results.json](dependency-command-results.json) exited 0: frozen offline `npm ci`, full typecheck (zero errors/warnings), ESLint/Prettier, deterministic double build, official Wrangler dry-run, all 15 original browser cases, all 22 Cloudflare cases (including those same 15), and `git diff --check`. The existing cloud outbound guard remained active for the Wrangler/local Cloudflare checks, with telemetry and optional CF metadata fetching disabled. No test was skipped or check weakened.

The repeated full static artifact digest is unchanged: `2830859f415d654269a22e2e53d848d1d1af9091c75bdf83b48865d749e785ea`. All twelve fresh Cloudflare screenshots (six portfolio plus six 404, both themes at 320/768/1440) are byte-identical to the reviewed captures; their SHA-256 comparisons are recorded in the results. Existing [portfolio screenshots](design/screens/) and [404 screenshots](design/screens/cloudflare-404/) therefore remain valid evidence, without new visual changes or design approval claims.

The implementation commit is `afe0bb26c70ba65c45c789d7c8796c2503fa3deb`; these verification records follow it as a separate commit on the same stacked draft. Exact final published HEAD and its revalidation/CI links are recorded in the PR. Parent PR #2 remains at `12dc3f7d9a4cb31f501a2056f93ef2f9b2014a57`. Firefox, WebKit and screen-reader speech remain untested. The exact model ID and reasoning setting are not exposed to this session and are unavailable.
