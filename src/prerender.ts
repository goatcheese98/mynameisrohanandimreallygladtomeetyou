import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { render } from "svelte/server";
import App from "./App.svelte";
import NotFound from "./NotFound.svelte";

const html = readFileSync("dist/index.html", "utf8");
if (!html.includes('<div id="app"></div>') || !html.includes("</head>"))
  throw new Error("Static render shell is incomplete");

function page(shell: string, content: { body: string; head: string }): string {
  return shell
    .replace(
      '<div id="app"></div>',
      () => `<div id="app">${content.body}</div>`,
    )
    .replace("</head>", () => `${content.head}</head>`);
}

// A 404 can be served at any depth: its shared stylesheet must be root-relative.
// It is static HTML, so never run the introduction's hydration entry on it.
const errorShell = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
  .replaceAll('href="./assets/', 'href="/assets/')
  .replace(
    /<title>[\s\S]*?<\/title>/,
    "<title>Page not found — Rohan Jasani</title>",
  );
writeFileSync("dist/index.html", page(html, render(App)));
writeFileSync("dist/404.html", page(errorShell, render(NotFound)));

// Exact emitted fingerprinted files only: a wildcard would also cache missing-asset 404s.
const assets = readdirSync("dist/assets")
  .sort()
  .filter((file) => /-[A-Za-z0-9_-]{8,}\.(?:css|js|woff2?)$/.test(file));
const headerTemplate = readFileSync("public/_headers", "utf8");
const templateRules = headerTemplate
  .split(/\r?\n/)
  .filter((line) => line.startsWith("/")).length;
if (assets.length + templateRules > 100)
  throw new Error("Cloudflare static header rule limit exceeded");
const cacheRules = assets
  .map(
    (file) =>
      `/assets/${file}\n  Cache-Control: public, max-age=31536000, immutable`,
  )
  .join("\n\n");
writeFileSync("dist/_headers", headerTemplate + "\n" + cacheRules + "\n");
