import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";

const origin = "http://127.0.0.1:3000";
const prisma = new PrismaClient();
let requests = 0;
const cookieLogin = await fetch(origin + "/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: process.env.APP_ADMIN_EMAIL, password: process.env.APP_ADMIN_PASSWORD }),
});
assert.equal(cookieLogin.status, 200, "preview administrator can sign in");
const cookie = cookieLogin.headers.get("set-cookie")?.split(";")[0];
assert.ok(cookie?.startsWith("leadveyra_session="), "session cookie is issued");
assert.match(cookieLogin.headers.get("set-cookie") || "", /HttpOnly/i);

async function request(path, method = "GET", body = undefined) {
  requests += 1;
  const response = await fetch(origin + path, {
    method,
    headers: { Cookie: cookie, ...(body !== undefined ? { "Content-Type": "application/json" } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  return { status: response.status, payload };
}
const must = (response, status, label) => {
  assert.equal(response.status, status, `${label}: ${JSON.stringify(response.payload)}`);
  return response.payload;
};
try {
  assert.equal((await fetch(origin + "/api/people")).status, 401, "anonymous CRM access blocked");
  assert.equal((await fetch(origin + "/api/deals")).status, 401, "anonymous deals blocked");
  assert.equal((await fetch(origin + "/api/overview")).status, 401, "anonymous metrics blocked");

  const company = must(await request("/api/companies", "POST", { name: "CI Example Inc", industry: "Software" }), 201, "create company").company;
  assert.ok(company.id);
  const person = must(await request("/api/people", "POST", { name: "Example Person", title: "Founder", email: "person@example.test", companyId: company.id }), 201, "create person").person;
  assert.equal(person.company.name, company.name);
  assert.equal(must(await request("/api/people/" + person.id), 200, "get person").person.name, "Example Person");
  assert.equal(must(await request("/api/people/" + person.id, "PATCH", { status: "Qualified", notes: "CI-only synthetic data" }), 200, "update person").person.status, "Qualified");
  assert.ok(must(await request("/api/people"), 200, "list people").people.some((p) => p.id === person.id));
  assert.equal(must(await request("/api/companies/" + company.id), 200, "get company").company.people.length, 1);
  must(await request("/api/companies/" + company.id, "DELETE"), 409, "linked company cannot be deleted");

  const task = must(await request("/api/tasks", "POST", { title: "CI follow-up", dueAt: "2026-12-01" }), 201, "create task").task;
  assert.ok(must(await request("/api/tasks"), 200, "list tasks").tasks.some((t) => t.id === task.id));
  assert.equal(must(await request("/api/tasks/" + task.id, "PATCH", { completed: true }), 200, "complete task").task.completed, true);

  const deal = must(await request("/api/deals", "POST", { name: "CI Opportunity", value: "12500.50" }), 201, "create deal").deal;
  assert.equal(deal.value, "12500.5");
  assert.equal(must(await request("/api/deals/" + deal.id, "PATCH", { stage: "Negotiation" }), 200, "update deal").deal.stage, "Negotiation");
  assert.ok(must(await request("/api/deals"), 200, "list deals").deals.some((d) => d.id === deal.id));

  const overview = must(await request("/api/overview"), 200, "dashboard metrics").overview;
  assert.equal(overview.people, 1);
  assert.equal(overview.companies, 1);
  assert.equal(overview.deals, 1);
  assert.equal(overview.pendingTasks, 0);
  assert.ok(overview.byStage.some((item) => item.stage === "Qualified" && item.count === 1));

  // A different tenant's records must not leak through the preview administrator APIs.
  const foreign = await prisma.organization.create({ data: { slug: "isolated-ci", name: "Other Tenant" } });
  const otherCompany = await prisma.company.create({ data: { name: "Other Company", organizationId: foreign.id } });
  const otherPerson = await prisma.person.create({ data: { name: "Private Person", organizationId: foreign.id, companyId: otherCompany.id } });
  const otherTask = await prisma.task.create({ data: { title: "Private Task", organizationId: foreign.id } });
  const otherDeal = await prisma.deal.create({ data: { name: "Private Deal", organizationId: foreign.id } });

  must(await request("/api/people/" + otherPerson.id), 404, "cross-tenant person GET denied");
  must(await request("/api/people/" + otherPerson.id, "PATCH", { status: "Won" }), 404, "cross-tenant person PATCH denied");
  must(await request("/api/people/" + otherPerson.id, "DELETE"), 404, "cross-tenant person DELETE denied");
  must(await request("/api/tasks/" + otherTask.id, "PATCH", { completed: true }), 404, "cross-tenant task PATCH denied");
  must(await request("/api/deals/" + otherDeal.id, "PATCH", { stage: "Won" }), 404, "cross-tenant deal PATCH denied");
  must(await request("/api/people", "POST", { name: "Should Fail", companyId: otherCompany.id }), 400, "cross-tenant company linking denied");
  assert.equal(must(await request("/api/people"), 200, "tenant scoped people list").people.length, 1);
  assert.equal(must(await request("/api/tasks"), 200, "tenant scoped tasks list").tasks.length, 1);
  assert.equal(must(await request("/api/deals"), 200, "tenant scoped deals list").deals.length, 1);
  must(await request("/api/people", "POST", { name: "", email: "invalid" }), 400, "validation rejects invalid person");
  must(await request("/api/deals", "POST", { name: "Overpriced", value: "-10" }), 400, "validation rejects invalid deal");
  must(await request("/api/people", "POST", { name: "Cross origin", title: "bad" }), 201, "normal same-origin access works");

  const crossOrigin = await fetch(origin + "/api/people", { method: "POST", headers: { Cookie: cookie, Origin: "https://attacker.example", "Content-Type": "application/json" }, body: JSON.stringify({ name: "Rejected" }) });
  assert.equal(crossOrigin.status, 403, "cross-origin CRM mutation denied");

  must(await request("/api/deals/" + deal.id, "DELETE"), 204, "delete deal");
  must(await request("/api/tasks/" + task.id, "DELETE"), 204, "delete task");
  must(await request("/api/people/" + person.id, "DELETE"), 204, "delete person");
  must(await request("/api/companies/" + company.id, "DELETE"), 204, "delete company");
  console.log(`PASS: ${requests} authenticated CRM requests, tenant isolation and CRUD tests`);
} finally {
  await prisma.$disconnect();
}
