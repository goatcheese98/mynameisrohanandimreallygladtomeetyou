import { defineConfig } from "@playwright/test";
import base from "./playwright.config.ts";

export default defineConfig({
  ...base,
  testMatch: ["**/portfolio.spec.ts", "**/cloudflare.spec.ts"],
  outputDir: "test-results/cloudflare",
  webServer: {
    command: "npm run preview:cloudflare",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      WRANGLER_SEND_METRICS: "false",
      CLOUDFLARE_CF_FETCH_ENABLED: "false",
    },
  },
});
