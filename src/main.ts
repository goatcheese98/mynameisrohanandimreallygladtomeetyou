import "@fontsource/geist/latin-400.css";
import "@fontsource/geist/latin-600.css";
import "@fontsource/geist-mono/latin-400.css";
import "./app.css";
import App from "./App.svelte";
import { hydrate, mount } from "svelte";

const target = document.getElementById("app");
if (!(target instanceof HTMLElement))
  throw new Error("Portfolio mount element is missing");
if (import.meta.env.DEV) mount(App, { target });
else hydrate(App, { target });
