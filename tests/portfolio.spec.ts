import { expect, test } from "@playwright/test";
import content from "./fixtures/published-content.json" with { type: "json" };

// The fixture is extracted from the original default-branch portfolio, not the new UI.
test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    return url.hostname === "127.0.0.1" ? route.continue() : route.abort();
  });
});

test("published identity, descriptions and real destinations survive", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Rohan Jasani",
  );
  for (const text of content.paragraphs)
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  for (const href of content.links)
    await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
  await expect(
    page.getByText(
      "No case studies are published in this assignment portfolio yet.",
    ),
  ).toBeVisible();
  await expect(page.getByText("Avery Chen")).toHaveCount(0);
  const pdf = await page.request.get("/rohan-jasani-resume.pdf");
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  expect(errors).toEqual([]);
});

test("native keyboard navigation, hash, history and quote control", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("link", { name: "Browse selected work" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#work$/);
  await expect(
    page.getByRole("heading", { name: "Selected work" }),
  ).toBeInViewport();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Contact" })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#contact$/);
  await page.goBack();
  await expect(page).toHaveURL(/#work$/);
  const next = page.getByRole("button", { name: "Next quote" });
  await next.focus();
  expect(await next.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe(
    "solid",
  );
  await page.keyboard.press("Enter");
  await expect(page.locator(".quote")).toContainText(content.quotes[1]!);
  await expect(next).toBeFocused();
  for (const quote of [...content.quotes.slice(2), content.quotes[0]!]) {
    await page.keyboard.press("Enter");
    await expect(page.locator(".quote")).toContainText(quote);
  }
});

for (const colorScheme of ["light", "dark"] as const) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`${colorScheme} ${width}px: readable layout, targets and contrast`, async ({
      page,
    }, testInfo) => {
      await page.emulateMedia({ colorScheme });
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      for (const el of await page.locator("a, button").all()) {
        const box = await el.boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(44);
        expect(box!.width).toBeGreaterThanOrEqual(44);
      }
      const contrast = await page.evaluate(() => {
        const rgb = (value: string): number[] =>
          value
            .match(/[\d.]+/g)!
            .slice(0, 3)
            .map(Number);
        const luminance = (values: number[]): number =>
          values
            .map((v) => {
              const s = v / 255;
              return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
            })
            .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i]!, 0);
        const root = getComputedStyle(document.documentElement);
        const ratio = (a: string, b: string): number => {
          const [x, y] = [luminance(rgb(a)), luminance(rgb(b))].sort(
            (a, b) => b - a,
          );
          return (x! + 0.05) / (y! + 0.05);
        };
        const resolve = (token: string): string => {
          const node = document.createElement("span");
          node.style.color = `var(${token})`;
          document.body.append(node);
          const color = getComputedStyle(node).color;
          node.remove();
          return color;
        };
        return {
          body: ratio(resolve("--fg"), root.backgroundColor),
          muted: ratio(resolve("--mut"), root.backgroundColor),
          primary: ratio(resolve("--on-acc"), resolve("--acc")),
          focus: ratio(resolve("--acc"), root.backgroundColor),
          padding: root.fontSize,
        };
      });
      expect(contrast.body).toBeGreaterThanOrEqual(4.5);
      expect(contrast.muted).toBeGreaterThanOrEqual(4.5);
      expect(contrast.primary).toBeGreaterThanOrEqual(4.5);
      expect(contrast.focus).toBeGreaterThanOrEqual(3);
      await page
        .getByRole("navigation")
        .getByRole("link", { name: "Work", exact: true })
        .focus();
      expect(
        await page.evaluate(
          () => getComputedStyle(document.activeElement!).outlineWidth,
        ),
      ).toBe("2px");
      expect(
        await page.evaluate(
          () => getComputedStyle(document.activeElement!).outlineStyle,
        ),
      ).toBe("solid");
      await page.locator("h1").click();
      expect(contrast.padding).toBe("16px");
      await page.screenshot({
        path: testInfo.outputPath(`${colorScheme}-${width}.png`),
        fullPage: true,
      });
    });
  }
}

test("reduced motion remains static, including a live preference change", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const quote = await page.locator(".quote").textContent();
  await page.waitForTimeout(5200);
  await expect(page.locator(".quote")).toHaveText(quote!);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("link", { name: "Browse selected work" }).click();
  await expect(page).toHaveURL(/#work$/);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});

test("200% text zoom reflows and preserves navigation", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");
  // Serve the magnification fixture from the same origin, respecting the production CSP.
  await page.route("**/__text-zoom.css", (route) =>
    route.fulfill({
      contentType: "text/css",
      body: ":root { font-size: 32px; --fs-lg: 32px; --fs-xl: 40px; --fs-2xl: 48px; --fs-3xl: 60px; --leading-body: 48px; } h1, h2, h3 { line-height: 1.35; }",
    }),
  );
  await page.addStyleTag({ url: "/__text-zoom.css" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Skills" })
    .click();
  await expect(page).toHaveURL(/#skills$/);
  await expect(
    page.getByRole("heading", { name: "Skills", exact: true }),
  ).toBeInViewport();
});

test("static content and contact work with JavaScript disabled and media missing", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.route("**/headshot.jpeg", (route) => route.abort());
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Rohan Jasani",
  );
  await expect(
    page.getByText(content.paragraphs[1]!, { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Browse selected work" }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(
    page.getByRole("link", { name: "Get in touch by email" }),
  ).toHaveAttribute("href", "mailto:jasani.rohan@gmail.com");
  await context.close();
});
