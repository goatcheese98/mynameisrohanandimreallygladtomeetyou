import { readFileSync, writeFileSync } from "node:fs";
import { render } from "svelte/server";
import App from "./App.svelte";

const { body, head } = render(App);
const html = readFileSync("dist/index.html", "utf8");
if (!html.includes('<div id="app"></div>'))
  throw new Error("Static render mount was not found");
writeFileSync(
  "dist/index.html",
  html
    .replace('<div id="app"></div>', () => `<div id="app">${body}</div>`)
    .replace("</head>", () => `${head}</head>`),
);
