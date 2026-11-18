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
  await page.getByRole("textbox", { name: "Email" }).fill("browser.qa@example.test");
  const personSubmit = page.waitForResponse((response) =>
    response.url().endsWith("/api/people") && response.request().method() === "POST", { timeout: 15000 });
  await page.getByRole("button", { name: "Add person" }).click();
  const personResponse = await personSubmit;
  const personBody = await personResponse.text();
  assert.equal(personResponse.status(), 201, "Person create API failed: " + personBody);
  await page.getByRole("link", { name: "Browser QA Person" }).waitFor({ timeout: 10000 });
  // Verify real conflict feedback instead of silently duplicating the contact.
  await page.getByRole("textbox", { name: /^Name/ }).fill("Browser QA Duplicate");
  await page.getByRole("textbox", { name: "Email" }).fill("BROWSER.QA@EXAMPLE.TEST");
  const duplicatePost = page.waitForResponse((response) =>
    response.url().endsWith("/api/people") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Add person" }).click();
  assert.equal((await duplicatePost).status(), 409, "duplicate contact email must be rejected");
  await page.getByRole("alert").getByText(/already exists/).waitFor({ timeout: 10000 });


  const search = page.getByRole("combobox", { name: "Search workspace pages and records" });
  await search.fill("Browser QA Person");
  await page.getByRole("option", { name: /Browser QA Person/ }).waitFor({ timeout: 12000 });
  await page.getByRole("option", { name: /Browser QA Person/ }).click();
  await page.waitForURL(/\/people\/[a-z0-9]+/, { timeout: 10000 });
  await page.getByRole("heading", { name: "Browser QA Person" }).waitFor();
  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Browser QA Person Updated");
  await page.getByRole("textbox", { name: "Find company" }).fill("Browser QA Company");
  await page.getByRole("combobox", { name: "Linked company" }).selectOption({ label: "Browser QA Company" });
  const personEditPost = page.waitForResponse((response) =>
    response.url().includes("/api/people/") && response.request().method() === "PATCH");
  await page.getByRole("button", { name: "Save changes" }).click();
  assert.equal((await personEditPost).status(), 200, "contact name/company edit must persist");
  await page.getByRole("heading", { name: "Browser QA Person Updated" }).waitFor({ timeout: 10000 });
  await page.getByRole("link", { name: "Browser QA Company" }).waitFor({ timeout: 10000 });


  await open("/tasks");
  await page.waitForLoadState("networkidle", { timeout: 15000 });
  await page.getByRole("textbox", { name: /Task title/ }).fill("Browser QA Task");
  const taskPost = page.waitForResponse((response) => response.url().endsWith("/api/tasks") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Add task" }).click();
  assert.equal((await taskPost).status(), 201, "task create form must persist");
  await page.getByText("Browser QA Task", { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByRole("textbox", { name: "Edit task title" }).fill("Browser QA Task Edited");
  const taskPatch = page.waitForResponse((response) => response.url().includes("/api/tasks/") && response.request().method() === "PATCH");
  await page.getByRole("button", { name: "Save task" }).click();
  assert.equal((await taskPatch).status(), 200, "task edit must persist");
  await page.getByText("Browser QA Task Edited", { exact: true }).waitFor({ timeout: 10000 });
  const completedCheckbox = page.getByRole("checkbox", { name: "Complete Browser QA Task Edited" });
  const completionPatch = page.waitForResponse((response) =>
    response.url().includes("/api/tasks/") && response.request().method() === "PATCH");
  await completedCheckbox.click();
  assert.equal((await completionPatch).status(), 200, "task checkbox completion must persist");
  assert.equal(await completedCheckbox.isChecked(), true, "task checkbox reflects saved state");
  await page.getByRole("combobox", { name: "State" }).selectOption("completed");
  await page.getByText("Browser QA Task Edited", { exact: true }).waitFor({ timeout: 10000 });

  await open("/deals");
  await page.waitForLoadState("networkidle", { timeout: 15000 });
  await page.getByRole("textbox", { name: /Deal name/ }).fill("Browser QA Deal");
  await page.getByRole("spinbutton", { name: "Value" }).fill("200");
  const dealPost = page.waitForResponse((response) => response.url().endsWith("/api/deals") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Add deal" }).click();
  assert.equal((await dealPost).status(), 201, "deal creation must persist");
  await page.getByText("Browser QA Deal", { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByRole("textbox", { name: "Edit deal name" }).fill("Browser QA Deal Edited");
  await page.getByRole("spinbutton", { name: "Edit deal value" }).fill("275.50");
  const dealPatch = page.waitForResponse((response) => response.url().includes("/api/deals/") && response.request().method() === "PATCH");
  await page.getByRole("button", { name: "Save deal" }).click();
  assert.equal((await dealPatch).status(), 200, "deal edit must persist");
  await page.getByText("Browser QA Deal Edited", { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole("combobox", { name: "Stage filter" }).selectOption("New");
  await page.getByText("Browser QA Deal Edited", { exact: true }).waitFor({ timeout: 10000 });

  await open("/consent");
  await page.waitForLoadState("networkidle", { timeout: 15000 });
  await page.getByRole("textbox", { name: /Email address/ }).fill("browser.suppressed@example.test");
  await page.getByRole("combobox", { name: /Reason/ }).selectOption("unsubscribe");
  const suppressionPost = page.waitForResponse((response) =>
    response.url().endsWith("/api/suppressions") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Record do-not-contact" }).click();
  assert.equal((await suppressionPost).status(), 201, "do-not-contact must persist");
  await page.getByText("browser.suppressed@example.test", { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole("textbox", { name: /Email address/ }).fill("BROWSER.SUPPRESSED@EXAMPLE.TEST");
  const duplicateSuppression = page.waitForResponse((response) =>
    response.url().endsWith("/api/suppressions") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Record do-not-contact" }).click();
  assert.equal((await duplicateSuppression).status(), 409, "duplicate do-not-contact must not overwrite history");
  await page.getByRole("alert").getByText(/already exists/).waitFor({ timeout: 10000 });

  await open("/sources");
  await page.waitForLoadState("networkidle", { timeout: 15000 });
  await page.getByRole("textbox", { name: "Source name" }).fill("Browser QA Source");
  await page.getByRole("textbox", { name: "Source URL" }).fill("https://example.test/research");
  const sourcePost = page.waitForResponse((response) =>
    response.url().endsWith("/api/sources") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Add source" }).click();
  assert.equal((await sourcePost).status(), 201, "source create form must persist");
  await page.getByText("Browser QA Source", { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByRole("textbox", { name: "Edit source name" }).fill("Browser QA Source Updated");
  const sourcePatch = page.waitForResponse((response) =>
    response.url().includes("/api/sources/") && response.request().method() === "PATCH");
  await page.getByRole("button", { name: "Save source" }).click();
  assert.equal((await sourcePatch).status(), 200, "source edit form must persist");
  await page.getByText("Browser QA Source Updated", { exact: true }).waitFor({ timeout: 10000 });

  await open("/analytics");
  await page.waitForLoadState("networkidle", { timeout: 15000 });
  const analyticsSelect = page.getByRole("combobox", { name: "Reporting window" });
  const analyticsResponse = page.waitForResponse((response) =>
    response.url().includes("/api/analytics?days=90") && response.request().method() === "GET");
  await analyticsSelect.selectOption("90");
  assert.equal((await analyticsResponse).status(), 200, "analytics window selection reloads real data");
  await page.getByRole("heading", { name: "CRM analytics" }).waitFor();

  const sections = [
    ["/", "dashboard"], ["/people", "people"], ["/companies", "companies"],
    ["/pipeline", "pipeline"], ["/tasks", "tasks"], ["/deals", "deals"],
    ["/reports", "reports"], ["/settings", "settings"], ["/audit", "audit"], ["/consent", "do-not-contact"], ["/sources", "sources"], ["/analytics", "analytics"],
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
