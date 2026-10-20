import { test, expect } from "@playwright/test";

const missing = [
  "/missing",
  "/missing/nested/path",
  "/assets/missing.js",
  "/src/App.svelte",
  "/.env",
  "/_headers",
  "/wrangler.jsonc",
];
function secure(headers: Record<string, string>): void {
  expect(headers["content-security-policy"]).toContain("default-src 'none'");
  expect(headers["content-security-policy"]).not.toContain("unsafe-inline");
  expect(headers["content-security-policy"]).not.toContain("unsafe-eval");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
}

test("native assets: real 404s, protected metadata and cache boundaries", async ({
  request,
}) => {
  const home = await request.get("/");
  expect(home.status()).toBe(200);
  secure(home.headers());
  expect(home.headers()["cache-control"]).toContain("no-cache");
  const html = await home.text();
  const files = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/g)].map(
    (match) => match[1]!,
  );
  expect(files.length).toBeGreaterThanOrEqual(2);
  for (const file of files) {
    const response = await request.get(
      new URL(file, "http://127.0.0.1:4173").href,
    );
    expect(response.status()).toBe(200);
    secure(response.headers());
    expect(response.headers()["cache-control"]).toBe(
      "public, max-age=31536000, immutable",
    );
    if (file.endsWith(".js"))
      expect(response.headers()["content-type"]).toMatch(/javascript/);
    if (file.endsWith(".css"))
      expect(response.headers()["content-type"]).toMatch(/text\/css/);
  }
  for (const path of missing) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
    secure(response.headers());
    expect(await response.text()).toContain("Page not found");
    expect(response.headers()["content-type"]).toContain("text/html");
    expect(response.headers()["cache-control"]).not.toContain("immutable");
  }
  const canonical = await request.get("/index.html", { maxRedirects: 0 });
  expect([301, 307, 308]).toContain(canonical.status());
  expect(canonical.headers()["location"]).toBe("/");
  const head = await request.head("/");
  expect(head.status()).toBe(200);
  secure(head.headers());
  expect((await head.body()).length).toBe(0);
  const pdf = await request.get("/rohan-jasani-resume.pdf", {
    headers: { Range: "bytes=0-4" },
  });
  // HTTP permits a static server to ignore Range and return the complete representation.
  // Local workerd does this; verify the fallback bytes rather than inventing a PDF handler.
  expect([200, 206]).toContain(pdf.status());
  const fullPdf = await request.get("/rohan-jasani-resume.pdf");
  const fullBytes = await fullPdf.body();
  expect(fullPdf.status()).toBe(200);
  expect(fullBytes.subarray(0, 5).toString()).toBe("%PDF-");
  if (pdf.status() === 206) {
    expect((await pdf.body()).toString()).toBe("%PDF-");
    expect(pdf.headers()["content-range"]).toBe(
      `bytes 0-4/${fullBytes.length}`,
    );
  } else {
    expect(await pdf.body()).toEqual(fullBytes);
  }
  secure(pdf.headers());
  expect(pdf.headers()["cache-control"]).toBe("no-cache");
  const photo = await request.get("/headshot.jpeg");
  expect(photo.status()).toBe(200);
  secure(photo.headers());
  expect(photo.headers()["content-type"]).toContain("image/jpeg");
  expect(photo.headers()["cache-control"]).toBe("no-cache");
});

for (const colorScheme of ["light", "dark"] as const) {
  for (const width of [320, 768, 1440]) {
    test(`404 ${colorScheme} ${width}: styled at nested paths, keyboard recovery without JavaScript`, async ({
      browser,
    }, testInfo) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        colorScheme,
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      const failures: string[] = [];
      page.on("response", (response) => {
        if (
          response.request().resourceType() !== "document" &&
          response.status() >= 400
        )
          failures.push(response.url());
      });
      await page.route("**/*", (route) =>
        new URL(route.request().url()).hostname === "127.0.0.1"
          ? route.continue()
          : route.abort(),
      );
      const response = await page.goto(
        "http://127.0.0.1:4173/missing/nested/path",
      );
      expect(response!.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Page not found",
      );
      await expect(page).toHaveTitle("Page not found — Rohan Jasani");
      expect(
        await page.locator('meta[name="robots"]').getAttribute("content"),
      ).toBe("noindex");
      expect(await page.locator("script").count()).toBe(0);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => getComputedStyle(document.body).fontFamily),
      ).toContain("Geist");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(failures).toEqual([]);
      await page.screenshot({
        path: testInfo.outputPath(`404-${colorScheme}-${width}.png`),
        fullPage: true,
      });
      await page.keyboard.press("Tab");
      await expect(
        page.getByRole("link", { name: "Skip to content" }),
      ).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator("main")).toBeFocused();
      await page.getByRole("link", { name: "Contact Rohan" }).focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL("http://127.0.0.1:4173/#contact");
      await expect(
        page.getByRole("heading", { name: "Contact", exact: true }),
      ).toBeInViewport();
      await context.close();
    });
  }
}
