import assert from "node:assert/strict";
const origin = "http://127.0.0.1:3000";
const body = JSON.stringify({
  email: process.env.APP_ADMIN_EMAIL, password: process.env.APP_ADMIN_PASSWORD,
});
async function login(headers) {
  return fetch(origin + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body,
  });
}
const foreign = await login({ Origin: "https://attacker.example" });
assert.equal(foreign.status, 403, "cross-origin admin login rejected");
assert.ok(!foreign.headers.get("set-cookie")?.includes("leadveyra_session"), "no session cookie on foreign origin");
const fetchSite = await login({ "Sec-Fetch-Site": "cross-site" });
assert.equal(fetchSite.status, 403, "cross-site fetch metadata rejected without Origin");
const sameOrigin = await login({ Origin: origin, "Sec-Fetch-Site": "same-origin" });
assert.equal(sameOrigin.status, 200, "legitimate browser origin login accepted");
assert.match(sameOrigin.headers.get("set-cookie") || "", /leadveyra_session/);
const cli = await login({});
assert.equal(cli.status, 200, "CLI login without Origin retained");
console.log("PASS: login origin CSRF protections and legitimate login paths");
