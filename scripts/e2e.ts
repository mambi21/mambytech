/**
 * Browser checks against a running server, using the locally installed
 * Microsoft Edge (no browser download needed).
 *
 *   BASE_URL=http://localhost:3000 E2E_MODE=production npm run e2e
 *   BASE_URL=http://localhost:3001 E2E_MODE=preview npm run e2e   # dev:preview
 *
 * Checks: page structure and metadata, axe-core WCAG 2.2 AA rules, horizontal
 * overflow at phone width, skip link, mobile menu keyboard behaviour, the
 * full-size diagram viewer, and the LinkedIn contact link. Screenshots go to
 * ./screenshots.
 */
import { mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { chromium, type Page } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const MODE = (process.env.E2E_MODE ?? "production") as "production" | "preview";
const LINKEDIN = "https://www.linkedin.com/in/ibrahima-bah-52a079203/";
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

const pages = ["/", "/projects", "/about", "/contact", "/privacy"];

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

    // Full-size diagram viewer: opens as a modal, can be panned, closes with Escape and restores focus.
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const viewer = page.getByRole("button", { name: "View full size" }).first();
    await viewer.click();
    const dialog = page.locator("dialog[open]");
    check(await dialog.isVisible(), "diagram viewer opens");
    const pane = await dialog.locator('[aria-label="Diagram, scrollable"]').evaluate((el) => el.scrollWidth - el.clientWidth);
    check(label === "desktop" || pane > 0, `diagram viewer pans on small screens (${pane}px)`);
    const dialogViolations = await axe(page);
    check(dialogViolations.length === 0, `diagram viewer axe: ${dialogViolations.join(" | ") || "no violations"}`);
    await page.keyboard.press("Escape");
    check((await page.locator("dialog[open]").count()) === 0, "Escape closes the viewer");
    check(await page.evaluate(() => document.activeElement?.textContent?.trim() === "View full size"), "focus returns to the viewer button");

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
        await page.evaluate(() => document.activeElement?.tagName === "A" && document.activeElement.textContent?.includes("Projects")),
        "Tab moves into the menu links",
      );
      await page.keyboard.press("Escape");
      check((await toggle.getAttribute("aria-expanded")) === "false", "Escape closes the menu");
      check(await page.evaluate(() => document.activeElement?.getAttribute("aria-controls") !== null), "focus returns to the toggle");
      await toggle.click();
      await page.screenshot({ path: `screenshots/${MODE}-mobile-menu-open.png` });
      await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Projects" }).click();
      await page.waitForURL("**/projects");
      check((await page.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")) === "false", "menu closes after navigating");
      check(
        (await page.getByRole("navigation", { name: "Primary" }).locator('[aria-current="page"]').first().textContent()) === "Projects",
        "current page marked with aria-current",
      );
    }
    await context.close();
  }

  // Content and links.
  {
    const page = await browser.newPage();
    console.log("\nContent");
    await page.goto(BASE + "/contact");
    const linkedin = page.getByRole("link", { name: /Connect on LinkedIn/ });
    check((await linkedin.getAttribute("href")) === LINKEDIN, "contact links to the LinkedIn profile");
    check((await linkedin.getAttribute("target")) === "_blank" && (await linkedin.getAttribute("rel"))?.includes("noopener"), "LinkedIn opens safely in a new tab");
    check((await page.locator("form").count()) === 0, "no contact form");

    await page.goto(BASE + "/projects");
    for (const title of ["AWS Three-Tier Infrastructure", "Linux Operations & Automation", "CI/CD Pipeline: GitOps to EKS", "Glomaf Marketplace"]) {
      check(await page.getByRole("heading", { name: title }).isVisible(), `projects page shows "${title}"`);
    }
    const body = (await page.locator("main").textContent()) ?? "";
    check(!/case study|in preparation|RHCSA/i.test(body), "no case-study placeholders or certification mentions");
    check(await page.getByText("Pipeline steps").isVisible(), "pipeline steps disclosure present");

    const notFound = await page.goto(BASE + "/projects/does-not-exist");
    check(notFound?.status() === 404, "unknown page returns 404");
    check((await page.locator("h1").textContent()) === "Page not found", "helpful not-found page");
    for (const gone of ["/projects/glomaf", "/blog", "/experience"]) {
      check((await page.goto(BASE + gone))?.status() === 404, `${gone} is not a page`);
    }
    const sitemap = (await (await page.goto(BASE + "/sitemap.xml"))?.text()) ?? "";
    check(MODE === "preview" || ["/projects", "/about", "/contact"].every((p) => sitemap.includes(p)), "sitemap lists the pages");
    await page.close();
  }

  await browser.close();
  console.log(failures.length ? `\n${failures.length} check(s) failed.` : "\nAll checks passed.");
  process.exit(failures.length ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
