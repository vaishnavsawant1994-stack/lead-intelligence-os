import assert from "node:assert/strict";
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const origin = "http://127.0.0.1:3000";
const output = join(process.cwd(), "browser-audit");
mkdirSync(output, { recursive: true });
const qualified = new Set([
  "/", "/people", "/companies", "/pipeline", "/tasks", "/deals",
  "/reports", "/audit", "/settings", "/export", "/import", "/email-finder",
]);

function staticRoutes(directory, relative = "") {
  const routes = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const next = relative ? relative + "/" + entry.name : entry.name;
    if (entry.isDirectory()) {
      if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
        routes.push(...staticRoutes(join(directory, entry.name), relative));
      } else {
        routes.push(...staticRoutes(join(directory, entry.name), next));
      }
    } else if (entry.name === "page.tsx" || entry.name === "page.jsx") {
      if (!relative.split("/").some((part) => part.startsWith("[") && part.endsWith("]"))) {
        routes.push("/" + relative);
      }
    }
  }
  return routes;
}

const login = await fetch(origin + "/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: process.env.APP_ADMIN_EMAIL, password: process.env.APP_ADMIN_PASSWORD,
  }),
});
assert.equal(login.status, 200, "authenticated route inventory requires valid preview credentials");
const cookie = login.headers.get("set-cookie")?.split(";")[0];
assert.ok(cookie?.startsWith("leadveyra_session="));

const routes = [...new Set(staticRoutes(join(process.cwd(), "src", "app")))].sort();
assert.ok(routes.length >= 140, "expected all static Leadveyra page paths");
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const findings = [];
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce", deviceScaleFactor: 1 });
    await context.addCookies([{ name: "leadveyra_session", value: cookie.split("=").slice(1).join("="), url: origin }]);
    const page = await context.newPage();
    let errors = [];
    page.on("pageerror", (error) => errors.push(error.message));

    for (const route of routes) {
      errors = [];
      const start = Date.now();
      let result = {
        route,
        viewport: viewport.width,
        qualification: qualified.has(route) ? "limited-preview" : "not-qualified",
        status: 0, title: null, headings: 0, buttons: 0, anchors: 0,
        unlabeledButtons: 0, placeholderLinks: 0, overflowPx: 0,
        errorMessages: [], elapsedMs: 0,
      };
      try {
        const response = await page.goto(origin + route, { waitUntil: "domcontentloaded", timeout: 16000 });
        result.status = response?.status() ?? 0;
        await page.waitForTimeout(120);
        result.title = await page.title();
        const dom = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll("button"));
          const anchors = Array.from(document.querySelectorAll("a[href]"));
          const visibleButton = (button) => {
            const box = button.getBoundingClientRect();
            return box.width > 0 && box.height > 0 && getComputedStyle(button).visibility !== "hidden";
          };
          return {
            headings: document.querySelectorAll("h1").length,
            buttons: buttons.length,
            anchors: anchors.length,
            unlabeledButtons: buttons.filter((button) => {
              if (!visibleButton(button)) return false;
              const accessible = (button.textContent || "").trim() || button.getAttribute("aria-label")
                || button.getAttribute("title") || (button.querySelector("img")?.getAttribute("alt") || "");
              return !accessible;
            }).length,
            placeholderLinks: anchors.filter((a) => {
              const href = a.getAttribute("href") || "";
              return href === "#" || href.startsWith("javascript:") || href === "";
            }).length,
            overflowPx: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth),
          };
        });
        Object.assign(result, dom);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      }
      result.elapsedMs = Date.now() - start;
      result.errorMessages = errors.slice(0, 5);
      findings.push(result);
    }
    await context.close();
  }
} finally {
  await browser.close();
}

const issues = findings.filter((r) => r.status !== 200 || r.overflowPx > 2 || r.errorMessages.length || r.unlabeledButtons || r.placeholderLinks || !r.headings);
const critical = findings.filter((r) =>
  qualified.has(r.route) && (r.status !== 200 || r.overflowPx > 2 || r.errorMessages.length > 0));
const outputJson = {
  baselineCommit: process.env.GITHUB_SHA || "local",
  description: "Browser static-route inventory, NOT complete business interaction certification.",
  routeCount: routes.length,
  viewports: [1440, 390],
  checked: findings.length,
  issues: issues.length,
  critical: critical.length,
  findings,
};
writeFileSync(join(output, "all-routes.json"), JSON.stringify(outputJson, null, 2));
writeFileSync(join(output, "issues.json"), JSON.stringify(issues, null, 2));
console.log(`Browser route inventory: ${routes.length} unique static page routes / ${findings.length} desktop+mobile visits, ${issues.length} warnings, ${critical.length} critical preview failures.`);
for (const row of issues.slice(0, 35)) {
  console.log("WARN", JSON.stringify({
    route: row.route, viewport: row.viewport, status: row.status, overflowPx: row.overflowPx,
    unlabeledButtons: row.unlabeledButtons, placeholderLinks: row.placeholderLinks,
    headings: row.headings, errors: row.errorMessages,
  }));
}
assert.equal(critical.length, 0, "Qualified preview pages must pass browser route and layout checks; see browser-audit/all-routes.json");
