# Rohan Jasani — assignment portfolio

Svelte 5 / Vite introduction created for BAIT 518, Assignment 0. Preserves the published introduction, About, Journey, Skills, headshot and contact destinations. Selected work currently has an honest empty state because this repository contains no case studies.

```sh
npm ci
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm test
npm run dev
```

`npm run build` creates the client bundle, renders the same Svelte component to HTML, and inserts it into `dist/index.html`. Static content and native anchor navigation work without JavaScript; quote selection becomes available after hydration. No timers, scroll interception or background animation remain. System color preference selects the LUM light/dark palette. Geist fonts are self-hosted.

`npm run lint` runs read-only ESLint recommended rules for the touched TypeScript and Svelte files, then a Prettier formatting check. Svelte compiler accessibility diagnostics are also enforced by `typecheck`. This is not a full-repository TypeScript migration. The unused starter Counter and existing Vite/Svelte configuration remain JavaScript. The ESLint TypeScript configuration uses Node 24 native type stripping.

Cloud browsers can use `CHROMIUM_PATH=/usr/bin/chromium npm test`. CI uses Playwright's pinned Chromium. Tests run against a freshly built preview, with local fixtures and no external provider requests. See [design decisions](docs/design/lum-portfolio.md) and [verification](docs/verification.md).

## Hosting and AstroWebsite

This repository remains a separate assignment portfolio. The brief identifies a newer AstroWebsite; maintenance ownership and whether both should be hosted are unresolved. This slice neither deletes nor redirects either project, selects a domain, or authorizes duplicate deployment.

The existing `wrangler.jsonc` points to `dist`, and the static build is verified locally in cloud. No Cloudflare API was called, no credentials were provisioned, and no hosting or release was performed. The legacy `deploy` command is retained for compatibility and was not run. Decide maintenance ownership before any future hosting change.
