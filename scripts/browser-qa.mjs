import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const origin = "http://127.0.0.1:3000";
const output = join(process.cwd(), "browser-screenshots");
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
const page = await context.newPage();
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));

async function open(route) {
  const response = await page.goto(origin + route, { waitUntil: "domcontentloaded", timeout: 20000 });
  assert.equal(response?.status(), 200, route + " must return 200");
  await page.locator("h1").first().waitFor({ timeout: 15000 });
}
async function screenshotRoute(route, filename) {
  await open(route);
  await page.waitForTimeout(250);
  const diagnostics = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const rectInfo = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        tag: element.tagName.toLowerCase(),
        className: typeof element.className === "string" ? element.className.slice(0, 130) : "",
        text: (element.textContent || "").trim().slice(0, 55),
        left: Math.round(rect.left), right: Math.round(rect.right),
        width: Math.round(rect.width),
      };
    };
    return {
      viewportWidth,
      clientWidth: document.documentElement.clientWidth,
      rootScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      outside: Array.from(document.querySelectorAll("body *"))
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && (rect.right > viewportWidth + 2 || rect.left < -2);
        }).slice(0, 15).map(rectInfo),
    };
  });
  const horizontalOverflow = Math.max(diagnostics.rootScrollWidth, diagnostics.bodyScrollWidth) - diagnostics.viewportWidth;
  await page.screenshot({ path: join(output, filename), fullPage: true, animations: "disabled" });
  if (horizontalOverflow > 2) console.error("OVERFLOW_DIAGNOSTICS", route, JSON.stringify(diagnostics));
  assert.ok(horizontalOverflow <= 2, `Horizontal overflow at ${page.viewportSize()?.width}px on ${route}: ${horizontalOverflow}px`);
}

try {
  await open("/login");
  await page.getByRole("textbox", { name: "Email" }).fill(process.env.APP_ADMIN_EMAIL);
  await page.getByLabel("Password").fill(process.env.APP_ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(origin + "/", { timeout: 20000 });
  await page.getByRole("heading", { name: "Dashboard" }).waitFor();
  const tailwindEvidence = await page.evaluate(() => {
    const bodyMargin = getComputedStyle(document.body).marginLeft;
    const header = document.querySelector("header");
    const headerDisplay = header ? getComputedStyle(header).display : "missing";
    return { bodyMargin, headerDisplay };
  });
  assert.equal(tailwindEvidence.bodyMargin, "0px", "Tailwind preflight must remove default body margin");
  assert.equal(tailwindEvidence.headerDisplay, "flex", "Tailwind flex utility must compile on header");

  await open("/companies");
  await page.waitForLoadState("networkidle", { timeout: 15000 });
  await page.getByRole("textbox", { name: /Company name/ }).fill("Browser QA Company");
  const companySubmit = page.waitForResponse((response) =>
    response.url().endsWith("/api/companies") && response.request().method() === "POST", { timeout: 15000 });
  await page.getByRole("button", { name: "Add company" }).click();
  const companyResponse = await companySubmit;
  const companyBody = await companyResponse.text();
  assert.equal(companyResponse.status(), 201, "Company create API failed: " + companyBody);
  await page.getByRole("link", { name: "Browser QA Company" }).waitFor({ timeout: 10000 });

  await open("/people");
  await page.waitForLoadState("networkidle", { timeout: 15000 });
  await page.getByRole("textbox", { name: /^Name/ }).fill("Browser QA Person");
  const personSubmit = page.waitForResponse((response) =>
    response.url().endsWith("/api/people") && response.request().method() === "POST", { timeout: 15000 });
  await page.getByRole("button", { name: "Add person" }).click();
  const personResponse = await personSubmit;
  const personBody = await personResponse.text();
  assert.equal(personResponse.status(), 201, "Person create API failed: " + personBody);
  await page.getByRole("link", { name: "Browser QA Person" }).waitFor({ timeout: 10000 });

  const search = page.getByRole("combobox", { name: "Search workspace pages and records" });
  await search.fill("Browser QA Person");
  await page.getByRole("option", { name: /Browser QA Person/ }).waitFor({ timeout: 12000 });
  await page.getByRole("option", { name: /Browser QA Person/ }).click();
  await page.waitForURL(/\/people\/[a-z0-9]+/, { timeout: 10000 });
  await page.getByRole("heading", { name: "Browser QA Person" }).waitFor();

  const sections = [
    ["/", "dashboard"], ["/people", "people"], ["/companies", "companies"],
    ["/pipeline", "pipeline"], ["/tasks", "tasks"], ["/deals", "deals"],
    ["/reports", "reports"], ["/settings", "settings"], ["/audit", "audit"],
    ["/export", "export"], ["/email-finder", "email-patterns"], ["/2fa", "2fa-disabled"],
  ];
  for (const [route, name] of sections) await screenshotRoute(route, "desktop-" + name + ".png");

  await page.setViewportSize({ width: 390, height: 844 });
  await open("/");
  const menu = page.getByRole("button", { name: /Menu/ });
  await menu.click();
  const mobileNav = page.getByRole("navigation", { name: "Mobile workspace navigation" });
  await mobileNav.waitFor();
  await mobileNav.getByRole("link", { name: "CSV export" }).click();
  await page.waitForURL(origin + "/export", { timeout: 10000 });
  await page.getByRole("heading", { name: "Export workspace data" }).waitFor();

  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: "Quick navigation" });
  await dialog.waitFor({ timeout: 10000 });
  await dialog.getByRole("button", { name: "Reports" }).click();
  await page.waitForURL(origin + "/reports", { timeout: 10000 });

  for (const [route, name] of sections) await screenshotRoute(route, "mobile-" + name + ".png");

  await open("/");
  await menu.click();
  await page.getByRole("navigation", { name: "Mobile workspace navigation" }).getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL(origin + "/login", { timeout: 12000 });
  const anonymous = await page.goto(origin + "/people", { waitUntil: "domcontentloaded" });
  assert.equal(anonymous?.url().includes("/login"), true, "signed-out user must be redirected to login");
  assert.deepEqual(pageErrors, [], "Client JavaScript errors are not allowed");

  console.log("PASS: real Chromium login, create company/person, search, navigation, responsive screenshots, sign-out and protected access.");
} finally {
  await browser.close();
}
