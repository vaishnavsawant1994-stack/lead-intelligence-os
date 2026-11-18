import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const origin = "http://127.0.0.1:3000";
const username = process.env.APP_ADMIN_EMAIL;
const password = process.env.APP_ADMIN_PASSWORD;

function discoverPages(directory, relative = "") {
  const routes = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const subpath = relative ? relative + "/" + entry.name : entry.name;
    if (entry.isDirectory()) {
      if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
        routes.push(...discoverPages(join(directory, entry.name), relative));
      } else {
        routes.push(...discoverPages(join(directory, entry.name), subpath));
      }
    } else if (entry.name === "page.tsx" || entry.name === "page.jsx") {
      if (!relative.split("/").some((segment) => segment.startsWith("[") && segment.endsWith("]"))) {
        routes.push("/" + relative);
      }
    }
  }
  return routes;
}

const login = await fetch(origin + "/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: username, password }),
});
assert.equal(login.status, 200, "route smoke test requires authenticated preview");
const cookie = login.headers.get("set-cookie")?.split(";")[0];
assert.ok(cookie?.startsWith("leadveyra_session="));

const routes = [...new Set(discoverPages(join(process.cwd(), "src", "app")))].sort();
assert.ok(routes.length >= 140, "expected at least 140 static page routes in the current project");
const failures = [];
let finished = 0;
let index = 0;
const workers = Array.from({ length: 6 }, async () => {
  while (index < routes.length) {
    const route = routes[index++];
    try {
      const response = await fetch(origin + route, {
        redirect: "manual",
        headers: { Cookie: cookie },
        signal: AbortSignal.timeout(20000),
      });
      const type = response.headers.get("content-type") || "";
      const html = await response.text();
      if (response.status !== 200 || !type.includes("text/html") || !html.toLowerCase().includes("<!doctype html")) {
        failures.push({ route, status: response.status, contentType: type, bodySnippet: html.slice(0, 160) });
      }
    } catch (error) {
      failures.push({ route, error: String(error) });
    }
    finished++;
  }
});
await Promise.all(workers);

for (const failure of failures) console.error("FAIL route", failure);
assert.equal(failures.length, 0, `${failures.length} of ${finished} page routes did not return authenticated HTML 200`);
console.log(`PASS: ${finished} authenticated static routes returned HTML 200. Dynamic record routes are separately tested in CRM smoke.`);
