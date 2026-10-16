/**
 * Browser checks against a running server, using the locally installed
 * Microsoft Edge (no browser download needed).
 *
 *   BASE_URL=http://localhost:3000 E2E_MODE=production npm run e2e
 *   BASE_URL=http://localhost:3001 E2E_MODE=preview npm run e2e   # dev:preview with CONTACT_PROVIDER=mock
 *
 * Checks: page structure and metadata, axe-core WCAG 2.2 AA rules, horizontal
 * overflow at phone width, skip link, mobile menu keyboard behaviour, and (in
 * preview) every contact-form state. Screenshots go to ./screenshots.
 */
import { mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { chromium, type Page } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const MODE = (process.env.E2E_MODE ?? "production") as "production" | "preview";
const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const failures: string[] = [];
const check = (condition: unknown, message: string) => {
  if (condition) console.log(`  ✓ ${message}`);
  else {
    console.log(`  ✗ ${message}`);
    failures.push(message);
  }
};

const pages = ["/", "/about", "/projects", "/contact", "/privacy"];
if (MODE === "preview") {
  pages.push("/projects/aws-infrastructure", "/projects/linux-automation", "/projects/glomaf", "/experience", "/blog", "/blog/rhel-production-patching");
}

async function axe(page: Page) {
  await page.addScriptTag({ content: axeSource });
  return page.evaluate(async () => {
    // @ts-expect-error injected global
    const result = await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
    });
    return result.violations.map(
      (v: { id: string; impact: string; nodes: { target: string[] }[] }) =>
        `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(", ")}`,
    );
  });
}

async function main() {
  mkdirSync("screenshots", { recursive: true });
  const browser = await chromium.launch({ channel: "msedge" });
  const titles = new Set<string>();

  for (const [label, viewport] of [
    ["desktop", { width: 1366, height: 900 }],
    ["mobile", { width: 375, height: 812 }],
  ] as const) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    console.log(`\n[${MODE}] ${label} ${viewport.width}px`);

    for (const path of pages) {
      const response = await page.goto(BASE + path, { waitUntil: "networkidle" });
      console.log(` ${path}`);
      check(response?.status() === 200, `${path} returns 200`);
      check((await page.locator("h1").count()) === 1, `${path} has exactly one h1`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      check(overflow <= 0, `${path} has no horizontal overflow (${overflow}px)`);

      if (label === "desktop") {
        const title = await page.title();
        check(!titles.has(title), `${path} unique title "${title}"`);
        titles.add(title);
        const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
        check(canonical && new URL(canonical).pathname === path, `${path} canonical ${canonical}`);
        check(await page.locator('meta[name="description"]').getAttribute("content"), `${path} has description`);
        check((await page.locator('meta[property="og:image"]').count()) === 1, `${path} has one og:image`);
        const robots = await page.locator('meta[name="robots"]').getAttribute("content");
        check(MODE === "preview" ? robots?.includes("noindex") : !robots?.includes("noindex"), `${path} robots ${robots}`);
      }

      const violations = await axe(page);
      check(violations.length === 0, `${path} axe: ${violations.length ? violations.join(" | ") : "no violations"}`);
      await page.screenshot({ path: `screenshots/${MODE}-${label}${path.replace(/\//g, "_") || "_home"}.png`, fullPage: true });
    }

    // Skip link is the first focusable element and moves focus to <main>.
    await page.goto(BASE + "/about");
    await page.keyboard.press("Tab");
    check((await page.evaluate(() => document.activeElement?.textContent)) === "Skip to main content", "skip link is first in tab order");
    await page.keyboard.press("Enter");
    check(await page.evaluate(() => document.activeElement?.id === "main"), "skip link moves focus to main");

    if (label === "mobile") {
      await page.goto(BASE + "/");
      const toggle = page.getByRole("button", { name: "Open menu" });
      check(await toggle.isVisible(), "mobile menu toggle visible");
      check((await toggle.getAttribute("aria-expanded")) === "false", "menu starts collapsed");
      await toggle.focus();
      await page.keyboard.press("Enter");
      const close = page.getByRole("button", { name: "Close menu" });
      check((await close.getAttribute("aria-expanded")) === "true", "Enter opens the menu");
      await page.keyboard.press("Tab");
      check(
        await page.evaluate(() => document.activeElement?.tagName === "A" && document.activeElement.textContent?.includes("Work")),
        "Tab moves into the menu links",
      );
      await page.keyboard.press("Escape");
      check((await toggle.getAttribute("aria-expanded")) === "false", "Escape closes the menu");
      check(await page.evaluate(() => document.activeElement?.getAttribute("aria-controls") !== null), "focus returns to the toggle");
      await toggle.click();
      await page.screenshot({ path: `screenshots/${MODE}-mobile-menu-open.png` });
      await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" }).click();
      await page.waitForURL("**/projects");
      check((await page.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")) === "false", "menu closes after navigating");
      check(
        (await page.getByRole("navigation", { name: "Primary" }).locator('[aria-current="page"]').first().textContent()) === "Work",
        "current page marked with aria-current",
      );
    }
    await context.close();
  }

  // Desktop screen: the headline and the hero figure share the first screen.
  // Reduced motion: the hero figure's layers only animate in when motion is allowed.
  {
    console.log("\nHero and motion");
    for (const reducedMotion of ["no-preference", "reduce"] as const) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion });
      const page = await context.newPage();
      await page.goto(BASE + "/", { waitUntil: "networkidle" });
      const layer = page.locator('figure g[class*="group/plate"]').first();
      const animation = await layer.evaluate((el) => getComputedStyle(el).animationName);
      if (reducedMotion === "reduce") {
        check(animation === "none", `hero figure is static with reduced motion (${animation})`);
      } else {
        const top = await page.locator("figure").first().evaluate((el) => el.getBoundingClientRect().top);
        check(top < 900 / 2, `hero figure starts in the first screen at 1440x900 (at ${Math.round(top)}px)`);
        check(animation !== "none", `hero figure animates in when motion is allowed (${animation})`);
        await page.screenshot({ path: `screenshots/${MODE}-laptop-fold.png` });
      }
      await context.close();
    }
  }

  // Not-found page.
  {
    const page = await browser.newPage();
    const response = await page.goto(BASE + "/projects/does-not-exist");
    console.log("\nNot found");
    check(response?.status() === 404, "unknown project returns 404");
    check((await page.locator("h1").textContent()) === "Page not found", "helpful not-found page");
    if (MODE === "production") {
      const draft = await page.goto(BASE + "/projects/glomaf");
      check(draft?.status() === 404, "listed project has no case-study page in production");
      await page.goto(BASE + "/");
      check(await page.getByRole("heading", { name: "Glomaf Marketplace" }).isVisible(), "listed projects appear in the showcase");
      check((await page.getByRole("link", { name: /Read the case study/ }).count()) === 0, "no case-study links for unpublished projects");
      check((await page.goto(BASE + "/blog/rhel-production-patching"))?.status() === 404, "draft post is not published in production");
      check((await page.goto(BASE + "/blog"))?.status() === 404, "blog is hidden while no post is published");
      check((await page.goto(BASE + "/experience"))?.status() === 404, "experience is hidden while every entry needs input");
      const sitemap = await (await page.goto(BASE + "/sitemap.xml"))?.text();
      check(sitemap && !sitemap.includes("/projects/glomaf"), "sitemap excludes drafts");
      await page.goto(BASE + "/contact");
      check(await page.getByText("The contact form isn’t available yet").isVisible(), "contact shows honest unavailable state without credentials");
      check((await page.locator("form").count()) === 0, "no form is offered when delivery is unavailable");
    }
    await page.close();
  }

  if (MODE === "preview") await contactFlow(browser);

  await browser.close();
  console.log(failures.length ? `\n${failures.length} check(s) failed.` : "\nAll checks passed.");
  process.exit(failures.length ? 1 : 0);
}

async function contactFlow(browser: Awaited<ReturnType<typeof chromium.launch>>) {
  console.log("\nContact form (mock provider)");
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  const send = page.getByRole("button", { name: "Send message" });

  // Validation errors.
  await page.waitForTimeout(3200);
  await page.getByLabel("Email", { exact: true }).fill("not-an-email");
  await page.getByLabel("Message", { exact: true }).fill("short");
  await send.click();
  const alert = page.locator("form [role=alert]");
  await alert.waitFor();
  check((await alert.textContent())?.includes("Please fix the highlighted fields"), "validation summary shown");
  check(await page.evaluate(() => document.activeElement?.getAttribute("role") === "alert"), "focus moves to the error summary");
  check((await page.getByLabel("Name", { exact: true }).getAttribute("aria-invalid")) === "true", "name marked aria-invalid");
  check((await page.getByLabel("Email", { exact: true }).getAttribute("aria-describedby"))?.includes("email-error"), "email error linked via aria-describedby");
  check((await page.getByLabel("Email", { exact: true }).inputValue()) === "not-an-email", "entered values are preserved");
  const violations = await axe(page);
  check(violations.length === 0, `contact error state axe: ${violations.join(" | ") || "no violations"}`);
  await page.screenshot({ path: "screenshots/preview-contact-errors.png", fullPage: true });

  // Error links move focus to the field.
  await page.getByRole("link", { name: /^Email:/ }).click();
  check(await page.evaluate(() => document.activeElement?.id === "contact-email"), "error summary link focuses the field");

  // Pending then success.
  await page.getByLabel("Name", { exact: true }).fill("Test Visitor");
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.com");
  await page.getByLabel("Message", { exact: true }).fill("Hello! This is an automated test message from the e2e script.");
  await page.waitForTimeout(3200);
  await send.click();
  check(await page.getByRole("button", { name: "Sending…" }).isVisible(), "pending state shown while sending");
  await page.getByRole("heading", { name: "Message sent" }).waitFor();
  check(true, "success state shown after provider accepts");
  check(await page.evaluate(() => document.activeElement?.getAttribute("role") === "status"), "focus moves to success message");
  await page.screenshot({ path: "screenshots/preview-contact-success.png" });

  // Too-fast submission (spam timing check).
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  await page.waitForFunction(() => (document.querySelector('input[name="startedAt"]') as HTMLInputElement | null)?.value);
  await page.getByLabel("Name", { exact: true }).fill("Fast Bot");
  await page.getByLabel("Email", { exact: true }).fill("bot@example.com");
  await page.getByLabel("Message", { exact: true }).fill("This was submitted immediately after load.");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.locator("form [role=alert]").waitFor();
  check((await page.locator("form [role=alert]").textContent())?.includes("quicker than expected"), "too-fast submission rejected with guidance");

  // Rate limit (5 accepted per window; one already succeeded above).
  let limited = false;
  for (let i = 0; i < 6 && !limited; i++) {
    await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
    await page.waitForTimeout(3100);
    await page.getByLabel("Name", { exact: true }).fill("Repeat Visitor");
    await page.getByLabel("Email", { exact: true }).fill("repeat@example.com");
    await page.getByLabel("Message", { exact: true }).fill("Repeated message to exercise the rate limiter.");
    await page.getByRole("button", { name: "Send message" }).click();
    await Promise.race([
      page.getByRole("heading", { name: "Message sent" }).waitFor(),
      page.locator("form [role=alert]").waitFor(),
    ]);
    limited = (await page.locator("form [role=alert]").count()) > 0 && ((await page.locator("form [role=alert]").textContent()) ?? "").includes("Too many messages");
  }
  check(limited, "rate limit triggers after repeated submissions");
  await page.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
