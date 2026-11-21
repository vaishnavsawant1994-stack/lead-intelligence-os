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
  // Preview-only persistent login throttle (the full multi-user identity system is not ready).
  const loginAttempt = (email, password) => fetch(origin + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  assert.equal((await loginAttempt("not-the-admin@example.test", "wrong")).status, 401,
    "unknown login is rejected without creating administrator lock state");
  assert.equal((await prisma.previewLoginThrottle.findUnique({
    where: { id: "single-preview-administrator" },
  })), null, "unknown email does not modify administrator lock state");
  for (let attempt = 0; attempt < 8; attempt++) {
    assert.equal((await loginAttempt(process.env.APP_ADMIN_EMAIL, "deliberately-invalid-" + attempt)).status, 401,
      "incorrect administrator password is refused");
  }
  const lockedLogin = await loginAttempt(process.env.APP_ADMIN_EMAIL, process.env.APP_ADMIN_PASSWORD);
  assert.equal(lockedLogin.status, 429, "repeated failures temporarily block even a correct password");
  assert.ok(Number(lockedLogin.headers.get("retry-after")) > 0, "lockout includes Retry-After");
  const throttled = await prisma.previewLoginThrottle.findUnique({
    where: { id: "single-preview-administrator" },
  });
  assert.ok(throttled.failureCount >= 8, "failed attempts persist to PostgreSQL");
  await prisma.previewLoginThrottle.deleteMany({ where: { id: "single-preview-administrator" } });
  assert.equal((await loginAttempt(process.env.APP_ADMIN_EMAIL, process.env.APP_ADMIN_PASSWORD)).status,
    200, "valid administrator login recovers after lockout reset");
  assert.equal((await prisma.previewLoginThrottle.count()), 0, "successful login clears failed-attempt state");

  assert.equal((await fetch(origin + "/api/people")).status, 401, "anonymous CRM access blocked");
  assert.equal((await fetch(origin + "/api/deals")).status, 401, "anonymous deals blocked");
  assert.equal((await fetch(origin + "/api/overview")).status, 401, "anonymous metrics blocked");
  assert.equal((await fetch(origin + "/api/lookup?q=Example")).status, 401, "anonymous workspace lookup blocked");

  const company = must(await request("/api/companies", "POST", { name: "CI Example Inc", industry: "Software" }), 201, "create company").company;
  assert.ok(company.id);
  const person = must(await request("/api/people", "POST", { name: "Example Person", title: "Founder", email: "person@example.test", companyId: company.id }), 201, "create person").person;
  assert.equal(person.company.name, company.name);
  assert.equal(person.email, "person@example.test", "email stored in normalized lowercase");
  must(await request("/api/people", "POST", { name: "Duplicate Case Variant", email: "PERSON@EXAMPLE.TEST" }), 409,
    "duplicate email across case variants rejected in same organization");
  const second = must(await request("/api/people", "POST", { name: "Temporary Contact", email: "another@example.test" }), 201,
    "another unique contact can be created").person;
  must(await request("/api/people/" + second.id, "PATCH", { email: "PERSON@EXAMPLE.TEST" }), 409,
    "update cannot collide with a different contact email");
  must(await request("/api/people/" + second.id, "DELETE"), 204, "clean up additional contact");

  assert.equal(must(await request("/api/people/" + person.id), 200, "get person").person.name, "Example Person");
  assert.equal(must(await request("/api/people/" + person.id, "PATCH", { status: "Qualified", notes: "CI-only synthetic data" }), 200, "update person").person.status, "Qualified");
  assert.ok(must(await request("/api/people"), 200, "list people").people.some((p) => p.id === person.id));
  assert.equal(must(await request("/api/companies/" + company.id), 200, "get company").company.people.length, 1);
  must(await request("/api/companies/" + company.id, "DELETE"), 409, "linked company cannot be deleted");
  const alternativeCompany = must(await request("/api/companies", "POST", { name: "CI Alternate Company" }), 201,
    "create second company for association editing").company;
  const reattached = must(await request("/api/people/" + person.id, "PATCH",
    { name: "Example Person Updated", companyId: alternativeCompany.id }), 200, "change contact name and company").person;
  assert.equal(reattached.name, "Example Person Updated");
  assert.equal(reattached.company.id, alternativeCompany.id);
  const restored = must(await request("/api/people/" + person.id, "PATCH",
    { name: "Example Person", companyId: company.id }), 200, "restore primary company").person;
  assert.equal(restored.company.id, company.id);
  must(await request("/api/companies/" + alternativeCompany.id, "DELETE"), 204, "clean up alternate company");


  const task = must(await request("/api/tasks", "POST", { title: "CI follow-up", dueAt: "2026-12-01" }), 201, "create task").task;
  assert.ok(must(await request("/api/tasks"), 200, "list tasks").tasks.some((t) => t.id === task.id));
  assert.equal(must(await request("/api/tasks/" + task.id, "PATCH", { completed: true }), 200, "complete task").task.completed, true);

  const deal = must(await request("/api/deals", "POST", { name: "CI Opportunity", value: "12500.50" }), 201, "create deal").deal;
  assert.equal(deal.value, "12500.5");
  assert.equal(must(await request("/api/deals/" + deal.id, "PATCH", { stage: "Negotiation" }), 200, "update deal").deal.stage, "Negotiation");
  assert.ok(must(await request("/api/deals"), 200, "list deals").deals.some((d) => d.id === deal.id));

  const lookup = must(await request("/api/lookup?q=Example"), 200, "real global search").results;
  assert.ok(lookup.some((item) => item.kind === "person" && item.href === "/people/" + person.id), "person search points to real record");
  assert.ok(lookup.some((item) => item.kind === "company" && item.href === "/companies/" + company.id), "company search points to real record");
  must(await request("/api/lookup?q=x"), 400, "short search term rejected");
  for (const detail of ["/people/" + person.id, "/companies/" + company.id]) {
    const response = await fetch(origin + detail, { headers: { Cookie: cookie }, redirect: "manual" });
    assert.equal(response.status, 200, detail + " detail route renders");
  }

  // Verify the list endpoints expose count, bounded pagination and safe filters.
  const currentOrg = await prisma.organization.findUniqueOrThrow({ where: { slug: process.env.APP_PREVIEW_ORG_SLUG } });
  const pagingMarker = "PAGING-CI-SYNTHETIC-";
  await prisma.person.createMany({
    data: Array.from({ length: 29 }, (_, i) => ({
      organizationId: currentOrg.id,
      name: pagingMarker + String(i).padStart(2, "0"),
      status: "New",
    })),
  });
  const firstPage = must(await request("/api/people?page=1&pageSize=25"), 200, "first page of contacts");
  const secondPage = must(await request("/api/people?page=2&pageSize=25"), 200, "second page of contacts");
  assert.equal(firstPage.pagination.total, 30, "total counts include records beyond old 100-row assumptions");
  assert.equal(firstPage.people.length, 25, "bounded first page");
  assert.equal(secondPage.people.length, 5, "remaining contacts are reachable");
  assert.ok(!firstPage.people.some((p) => secondPage.people.some((q) => q.id === p.id)), "pages do not duplicate contacts");
  assert.equal(must(await request("/api/people?status=Qualified"), 200, "filter by status").pagination.total, 1);
  assert.equal(must(await request("/api/people?q=PAGING-CI-SYNTHETIC"), 200, "search by name").pagination.total, 29);
  for (const path of ["/api/people?page=0", "/api/people?pageSize=101", "/api/people?status=invalid", "/api/people?page=1.5"]) {
    must(await request(path), 400, "invalid People pagination/filter rejected");
  }
  await prisma.person.deleteMany({ where: { organizationId: currentOrg.id, name: { startsWith: pagingMarker } } });

  const moreCompany = must(await request("/api/companies", "POST", { name: "Pagination CI Extra" }), 201, "additional company").company;
  assert.equal(must(await request("/api/companies?pageSize=1&page=2"), 200, "companies page two").pagination.total, 2);
  assert.equal(must(await request("/api/companies?q=Pagination"), 200, "company search").pagination.total, 1);
  const moreTask = must(await request("/api/tasks", "POST", { title: "Pagination CI Extra" }), 201, "additional task").task;
  assert.equal(must(await request("/api/tasks?state=completed"), 200, "completed task filter").pagination.total, 1);
  assert.equal(must(await request("/api/tasks?state=pending"), 200, "pending task filter").pagination.total, 1);
  assert.equal(must(await request("/api/tasks?q=Pagination"), 200, "task text search").pagination.total, 1);
  const editedTask = must(await request("/api/tasks/" + moreTask.id, "PATCH", { title: "Edited task", dueAt: "2026-12-18" }), 200, "edit task fields").task;
  assert.equal(editedTask.title, "Edited task");
  assert.equal(editedTask.dueAt.slice(0, 10), "2026-12-18");
  const moreDeal = must(await request("/api/deals", "POST", { name: "Pagination CI Extra", value: "50" }), 201, "additional deal").deal;
  assert.equal(must(await request("/api/deals?pageSize=1&page=2"), 200, "deals page two").pagination.total, 2);
  assert.equal(must(await request("/api/deals?stage=Negotiation"), 200, "deal stage filter").pagination.total, 1);
  assert.equal(must(await request("/api/deals?q=Pagination"), 200, "deal search").pagination.total, 1);
  const editedDeal = must(await request("/api/deals/" + moreDeal.id, "PATCH", { name: "Edited deal", value: "75.25", stage: "Proposal" }), 200, "edit deal fields").deal;
  assert.equal(editedDeal.name, "Edited deal");
  assert.equal(Number(editedDeal.value), 75.25);
  for (const path of ["/api/deals?stage=invalid", "/api/tasks?state=invalid", "/api/companies?pageSize=0"]) {
    must(await request(path), 400, "invalid list filter rejected");
  }
  must(await request("/api/deals/" + moreDeal.id, "DELETE"), 204, "clean up extra deal");
  must(await request("/api/tasks/" + moreTask.id, "DELETE"), 204, "clean up extra task");
  must(await request("/api/companies/" + moreCompany.id, "DELETE"), 204, "clean up extra company");

  assert.equal((await fetch(origin + "/api/analytics?days=30")).status, 401,
    "unauthenticated analytics access denied");
  must(await request("/api/analytics?days=1"), 400, "unsupported reporting window rejected");
  must(await request("/api/analytics?days=invalid"), 400, "invalid reporting window rejected");
  const analytics = must(await request("/api/analytics?days=30"), 200,
    "organization-scoped database analytics");
  assert.equal(analytics.totals.people, 1, "real person count");
  assert.equal(analytics.totals.companies, 1, "real company count");
  assert.equal(analytics.totals.deals, 1, "real deal count");
  assert.equal(analytics.newInWindow.people, 1, "newly created contact included in reporting window");
  assert.ok(analytics.peopleByStatus.some((row) => row.name === "Qualified" && row.count === 1),
    "lead stage source is database");
  assert.ok(analytics.dealsByStage.some((row) => row.name === "Negotiation"
    && row.count === 1 && Number(row.enteredAmount) === 12500.5),
    "deal value is recorded amount, not invented forecast");
  assert.equal(analytics.tasksByState.completed, 1, "task status is real");
  assert.equal(analytics.totals.sources, 0, "unrecorded sources are not invented");
  const shorterAnalytics = must(await request("/api/analytics?days=7"), 200,
    "seven-day analytics");
  assert.equal(shorterAnalytics.days, 7);
  const overview = must(await request("/api/overview"), 200, "dashboard metrics").overview;
  assert.equal(overview.people, 1);
  assert.equal(overview.companies, 1);
  assert.equal(overview.deals, 1);
  assert.equal(overview.pendingTasks, 0);
  assert.ok(overview.byStage.some((item) => item.stage === "Qualified" && item.count === 1));

  // A different tenant's records must not leak through the preview administrator APIs.
  const foreign = await prisma.organization.create({ data: { slug: "isolated-ci", name: "Other Tenant" } });
  const otherCompany = await prisma.company.create({ data: { name: "Other Company", organizationId: foreign.id } });
  const otherPerson = await prisma.person.create({ data: { name: "Private Person", email: "person@example.test", organizationId: foreign.id, companyId: otherCompany.id } });
  const otherTask = await prisma.task.create({ data: { title: "Private Task", organizationId: foreign.id } });
  const otherDeal = await prisma.deal.create({ data: { name: "Private Deal", organizationId: foreign.id } });
  assert.equal(must(await request("/api/lookup?q=Private"), 200, "tenant-scoped search").results.length, 0, "foreign tenant records are not searchable");

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

  const sameOriginRequest = await fetch(origin + "/api/tasks", {
    method: "POST",
    headers: { Cookie: cookie, Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Native browser origin check" }),
  });
  assert.equal(sameOriginRequest.status, 201, "same-origin POST with browser Origin header allowed");
  const sameOriginTask = await sameOriginRequest.json();
  must(await request("/api/tasks/" + sameOriginTask.task.id, "DELETE"), 204, "remove origin regression test task");
    const crossOrigin = await fetch(origin + "/api/people", { method: "POST", headers: { Cookie: cookie, Origin: "https://attacker.example", "Content-Type": "application/json" }, body: JSON.stringify({ name: "Rejected" }) });
  assert.equal(crossOrigin.status, 403, "cross-origin CRM mutation denied");

  // Export must contain only this preview organization's records and be safe for spreadsheet clients.
  assert.equal((await fetch(origin + "/api/export?entity=people")).status, 401, "anonymous CSV export blocked");
  assert.equal(must(await request("/api/ready"), 200, "authenticated PostgreSQL readiness").status, "ready");
  const suspicious = must(await request("/api/people", "POST", { name: "=2+2" }), 201, "formula-like person").person;
  const exported = await fetch(origin + "/api/export?entity=people", { headers: { Cookie: cookie } });
  assert.equal(exported.status, 200, "authenticated people CSV download");
  assert.match(exported.headers.get("content-type") || "", /^text\/csv/);
  assert.match(exported.headers.get("content-disposition") || "", /attachment/);
  const csv = await exported.text();
  assert.ok(csv.includes("Example Person"), "real workspace data exported");
  assert.ok(csv.includes('"' + "'=2+2" + '"'), "spreadsheet formula-like fields neutralized");
  assert.ok(!csv.includes("Private Person"), "other organization never exported");
  for (const kind of ["companies", "tasks", "deals"]) {
    const downloaded = await fetch(origin + "/api/export?entity=" + kind, { headers: { Cookie: cookie } });
    assert.equal(downloaded.status, 200, kind + " CSV exported");
    assert.match(downloaded.headers.get("content-type") || "", /^text\/csv/);
  }
  must(await request("/api/export?entity=missing"), 400, "invalid export type refused");
  const suggestions = must(await request("/api/email-finder", "POST", { firstName: "Example", lastName: "Person", domain: "example.test" }), 200, "suggest unverified email formats");
  assert.equal(suggestions.verified, false);
  assert.ok(suggestions.results.every((item) => item.verified === false), "no fabricated verification or confidence");
  must(await request("/api/email-finder", "POST", { firstName: "Example", lastName: "Person" }), 400, "missing domain refused");
  must(await request("/api/search", "POST", { query: "synthetic sample" }), 503, "unconfigured web search fails closed");
  const drafts = must(await request("/api/generate-drafts", "POST", { person: { name: "Example", company: "Example Inc" } }), 200, "template drafts");
  assert.equal(drafts.generatedByAI, false);
  assert.equal(drafts.sent, false);
  must(await request("/api/webhooks/bounce", "POST", { type: "email.bounced", data: { email: "nobody@example.test" } }), 503, "unsigned bounce is not falsely acknowledged");
  await request("/api/people/" + suspicious.id, "DELETE");

  assert.equal((await fetch(origin + "/api/settings")).status, 401, "anonymous org settings blocked");
  assert.equal((await fetch(origin + "/api/reports")).status, 401, "anonymous reports blocked");
  assert.equal((await fetch(origin + "/api/audit")).status, 401, "anonymous audit access blocked");
  const before = must(await request("/api/settings"), 200, "read PostgreSQL settings").organization;
  assert.equal(before.name, "Leadveyra Test");
  const after = must(await request("/api/settings", "PATCH", { name: "Leadveyra Verified Preview" }), 200, "rename workspace").organization;
  assert.equal(after.name, "Leadveyra Verified Preview");
  assert.equal(must(await request("/api/settings"), 200, "read persisted workspace").organization.name, after.name);
  must(await request("/api/settings", "PATCH", { name: "  " }), 400, "reject blank organization name");
  assert.equal((await fetch(origin + "/api/settings", { method: "PATCH", headers: { Cookie: cookie, Origin: "https://attacker.example", "Content-Type": "application/json" }, body: JSON.stringify({ name: "Attempted cross-origin rename" }) })).status, 403, "cross-origin settings mutation blocked");
  assert.equal((await prisma.organization.findUnique({ where: { id: before.id } })).name, after.name, "organization name saved in PostgreSQL");
  const report = must(await request("/api/reports"), 200, "real CRM reports").report;
  assert.ok(report.leadStages.some((row) => row.stage === "Qualified" && row.count === 1), "qualified leads are counted");
  assert.ok(report.dealStages.some((row) => row.stage === "Negotiation" && Number(row.value) === 12500.5), "deal value from database");
  assert.equal(report.tasks.completed, 1, "completed task from database");
  for (const path of ["/2fa", "/integrations", "/crm", "/phone-finder", "/gdpr", "/billing", "/api-keys"]) {
    const page = await fetch(origin + path, { headers: { Cookie: cookie } });
    assert.equal(page.status, 200, path + " renders");
    assert.ok((await page.text()).includes("not available"), path + " discloses disabled state");
  }
  // A real, persisted private-preview do-not-contact register must never
  // claim that an opt-out record grants positive marketing consent.
  assert.equal((await fetch(origin + "/api/suppressions")).status, 401, "anonymous suppression access denied");
  assert.equal((await fetch(origin + "/api/suppressions", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "someone@example.test", reason: "unsubscribe" }),
  })).status, 401, "anonymous suppression modification denied");
  must(await request("/api/suppressions", "POST", { email: "bad-address", reason: "manual_opt_out" }),
    400, "invalid suppression email denied");
  must(await request("/api/suppressions", "POST", { email: "blocked@example.test", reason: "permission" }),
    400, "invented consent reason denied");
  const suppression = must(await request("/api/suppressions", "POST", {
    email: "STOP@EXAMPLE.TEST", reason: "unsubscribe", note: "Synthetic browser QA opt out",
  }), 201, "record synthetic suppression").entry;
  assert.equal(suppression.email, "stop@example.test", "suppression email is normalized");
  must(await request("/api/suppressions", "POST", {
    email: "stop@example.test", reason: "manual_opt_out",
  }), 409, "duplicate opt-out stays unique and cannot overwrite evidence");
  assert.equal(must(await request("/api/suppressions?q=stop%40example.test"), 200,
    "search scoped do-not-contact").pagination.total, 1);
  must(await request("/api/suppressions?pageSize=101"), 400, "unsafe suppression page size rejected");
  const foreignSuppression = await prisma.suppressionEntry.create({
    data: { organizationId: foreign.id, email: "foreign@example.test", reason: "complaint" },
  });
  assert.equal(must(await request("/api/suppressions?q=foreign"), 200,
    "suppression foreign tenant search").pagination.total, 0);
  const crossSuppression = await fetch(origin + "/api/suppressions", {
    method: "POST",
    headers: { Cookie: cookie, Origin: "https://attacker.example", "Content-Type": "application/json" },
    body: JSON.stringify({ email: "cross-origin@example.test", reason: "unsubscribe" }),
  });
  assert.equal(crossSuppression.status, 403, "cross-origin suppression write denied");
  const suppressedEvents = must(await request("/api/audit"), 200, "suppression audit").events;
  assert.ok(suppressedEvents.some((event) => event.entityType === "suppression"
    && event.entityId === suppression.id && event.action === "created"),
    "suppression creation recorded transactionally");
  assert.ok(!suppressedEvents.some((event) => event.entityId === foreignSuppression.id),
    "foreign suppression audit details are not exposed");
  must(await request("/api/send-email", "POST", {
    to: "stop@example.test", subject: "Never sent", body: "Compliance test",
  }), 503, "email stays disabled despite saved suppression");

  // Source catalog records are organization-scoped; entries are administrator-entered.
  assert.equal((await fetch(origin + "/api/sources")).status, 401, "anonymous source listing denied");
  must(await request("/api/sources", "POST", { name: "Invalid", url: "javascript:alert(1)" }),
    400, "unsafe source URL rejected");
  must(await request("/api/sources", "POST", { name: "Invalid", type: "unknown" }),
    400, "unknown source type rejected");
  const source = must(await request("/api/sources", "POST", {
    name: "Synthetic Research Reference", type: "publication", url: "https://example.test/article",
  }), 201, "source creation").source;
  assert.equal(must(await request("/api/sources?q=Synthetic&type=publication"), 200,
    "source search").pagination.total, 1);
  assert.equal(must(await request("/api/sources/" + source.id), 200, "source detail").source.id, source.id);
  const sourceUpdated = must(await request("/api/sources/" + source.id, "PATCH", {
    name: "Synthetic Research Updated",
  }), 200, "source edit").source;
  assert.equal(sourceUpdated.name, "Synthetic Research Updated");
  const foreignSource = await prisma.source.create({
    data: { organizationId: foreign.id, name: "Foreign Private Source", type: "magazine" },
  });
  must(await request("/api/sources/" + foreignSource.id), 404, "foreign source not readable");
  must(await request("/api/sources/" + foreignSource.id, "PATCH", { name: "Intrusion" }),
    404, "foreign source not editable");
  must(await request("/api/sources/" + foreignSource.id, "DELETE"),
    404, "foreign source not deletable");
  assert.equal(must(await request("/api/sources?q=Foreign%20Private"), 200,
    "foreign source excluded from searches").pagination.total, 0);
  // Recorded research appearance APIs must only link People and Sources
  // from the signed-in preview organization.
  assert.equal((await fetch(origin + "/api/appearances")).status, 401,
    "anonymous research appearances denied");
  must(await request("/api/appearances", "POST", {
    personId: otherPerson.id, sourceId: source.id,
  }), 400, "cross-tenant person association denied");
  must(await request("/api/appearances", "POST", {
    personId: person.id, sourceId: foreignSource.id,
  }), 400, "cross-tenant source association denied");
  must(await request("/api/appearances", "POST", {
    personId: person.id, sourceId: source.id, url: "javascript:alert(1)",
  }), 400, "unsafe appearance URL denied");
  must(await request("/api/appearances", "POST", {
    personId: person.id, sourceId: source.id, date: "2026-02-30",
  }), 400, "invalid appearance date denied");
  const appearance = must(await request("/api/appearances", "POST", {
    personId: person.id, sourceId: source.id, date: "2026-11-21",
    url: "https://example.test/research",
  }), 201, "create research appearance").appearance;
  assert.equal(appearance.person.name, person.name);
  assert.equal(appearance.source.id, source.id);
  assert.equal(must(await request("/api/appearances?personId=" + person.id), 200,
    "research list by person").pagination.total, 1);
  assert.equal(must(await request("/api/appearances?sourceId=" + source.id), 200,
    "research list by source").pagination.total, 1);
  const updatedAppearance = must(await request("/api/appearances/" + appearance.id, "PATCH", {
    date: "2026-11-22", url: "https://example.test/revised",
  }), 200, "update research reference").appearance;
  assert.equal(updatedAppearance.date, "2026-11-22");
  must(await request("/api/appearances/" + appearance.id, "PATCH", {
    date: "2026-02-30",
  }), 400, "invalid research date edit rejected");
  const foreignAppearance = await prisma.appearance.create({
    data: { personId: otherPerson.id, sourceId: foreignSource.id },
  });
  assert.equal(must(await request("/api/appearances"), 200, "scoped research listing").pagination.total, 1);
  must(await request("/api/appearances/" + foreignAppearance.id, "PATCH", {
    date: "2026-11-22",
  }), 404, "foreign research record not editable");
  must(await request("/api/appearances/" + foreignAppearance.id, "DELETE"),
    404, "foreign research record not deletable");
  const crossOriginResearch = await fetch(origin + "/api/appearances", {
    method: "POST", headers: { Cookie: cookie, Origin: "https://attacker.example",
      "Content-Type": "application/json" },
    body: JSON.stringify({ personId: person.id, sourceId: source.id }),
  });
  assert.equal(crossOriginResearch.status, 403, "cross-origin research creation refused");
  must(await request("/api/sources/" + source.id, "DELETE"), 409,
    "linked source deletion must be refused");
  must(await request("/api/appearances/" + appearance.id, "DELETE"),
    204, "research appearance delete");
  must(await request("/api/sources/" + source.id, "DELETE"), 204,
    "unlinked source deletion permitted");
  const appearanceAudit = must(await request("/api/audit"), 200, "research audit").events;
  for (const action of ["created", "updated", "deleted"]) {
    assert.ok(appearanceAudit.some((event) =>
      event.entityType === "appearance" && event.entityId === appearance.id && event.action === action),
      "appearance " + action + " audited");
  }
  const sourceAudit = must(await request("/api/audit"), 200, "source audit trail").events;
  for (const action of ["created", "updated", "deleted"]) {
    assert.ok(sourceAudit.some((event) =>
      event.entityType === "source" && event.entityId === source.id && event.action === action),
      "source " + action + " is audited");
  }
  const badOriginSource = await fetch(origin + "/api/sources", {
    method: "POST",
    headers: { Cookie: cookie, Origin: "https://attacker.example", "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Cross-site mutation" }),
  });
  assert.equal(badOriginSource.status, 403, "cross-origin source creation denied");

  const history = must(await request("/api/audit"), 200, "fetch persisted CRM audit").events;
  for (const [type, entityId, action] of [["company", company.id, "created"], ["person", person.id, "created"], ["person", person.id, "updated"], ["task", task.id, "created"], ["task", task.id, "updated"], ["deal", deal.id, "created"], ["deal", deal.id, "updated"], ["organization", before.id, "updated"]]) {
    assert.ok(history.some((event) => event.entityType === type && event.entityId === entityId && event.action === action), type + " " + action + " was recorded");
  }
  assert.ok(!history.some((event) => [otherPerson.id, otherTask.id, otherDeal.id, otherCompany.id].includes(event.entityId)), "foreign tenant audit records do not leak");
  const auditPage = await fetch(origin + "/audit", { headers: { Cookie: cookie } });
  assert.equal(auditPage.status, 200, "audit screen accessible to signed admin");
  assert.ok((await auditPage.text()).includes("CRM activity history"), "audit screen is labeled as a real limited preview");
  must(await request("/api/deals/" + deal.id, "DELETE"), 204, "delete deal");
  must(await request("/api/tasks/" + task.id, "DELETE"), 204, "delete task");
  must(await request("/api/people/" + person.id, "DELETE"), 204, "delete person");
  must(await request("/api/companies/" + company.id, "DELETE"), 204, "delete company");
  const deletedAudit = must(await request("/api/audit"), 200, "query retained deletion audit").events;
  for (const [type, id] of [["company", company.id], ["person", person.id], ["task", task.id], ["deal", deal.id]]) {
    assert.ok(deletedAudit.some((event) => event.entityType === type && event.entityId === id && event.action === "deleted"), "deletion is logged for " + type);
  }
  // Internal automation fires only on a successful new-person create and
  // persists the generated Task + run/audit in one database transaction.
  assert.equal((await fetch(origin + "/api/automation-rules")).status, 401,
    "anonymous automation listing rejected");
  must(await request("/api/automation-rules", "POST", {
    name: "", taskTitleTemplate: "Follow up",
  }), 400, "blank automation rule rejected");
  const rule = must(await request("/api/automation-rules", "POST", {
    name: "CI new prospect follow-up", taskTitleTemplate: "Follow up with {name}",
  }), 201, "create internal automation").rule;
  assert.equal(rule.trigger, "person_created");
  assert.equal(must(await request("/api/automation-rules"), 200,
    "list automation rules").rules[0]._count.runs, 0);
  const foreignRule = await prisma.automationRule.create({
    data: { organizationId: foreign.id, name: "Private foreign rule",
      taskTitleTemplate: "Private foreign task" },
  });
  assert.equal(must(await request("/api/automation-rules"), 200,
    "foreign rules not leaked").rules.length, 1);
  must(await request("/api/automation-rules/" + foreignRule.id, "PATCH", {
    enabled: false,
  }), 404, "foreign automation edit rejected");
  must(await request("/api/automation-rules/" + foreignRule.id, "DELETE"),
    404, "foreign automation delete rejected");

  const automatedPerson = must(await request("/api/people", "POST", {
    name: "Automation CI Person",
  }), 201, "create person triggering automation").person;
  const taskMatches = must(await request("/api/tasks?q=Follow%20up%20with%20Automation%20CI%20Person"),
    200, "automatically created task");
  assert.equal(taskMatches.pagination.total, 1, "one task created for the new person");
  const createdTask = taskMatches.tasks[0];
  assert.equal(createdTask.title, "Follow up with Automation CI Person");
  let rules = must(await request("/api/automation-rules"), 200,
    "audit automation run").rules;
  assert.equal(rules[0]._count.runs, 1, "run count persisted");
  assert.equal(rules[0].runs[0].personId, automatedPerson.id, "run links triggering person");
  assert.equal(rules[0].runs[0].taskId, createdTask.id, "run links created task");
  must(await request("/api/automation-rules/" + rule.id, "DELETE"), 409,
    "executed rule cannot be deleted with history");

  const revised = must(await request("/api/automation-rules/" + rule.id, "PATCH", {
    name: "CI updated follow-up", taskTitleTemplate: "Review {name}", enabled: false,
  }), 200, "update and pause automation").rule;
  assert.equal(revised.enabled, false);
  const personWhilePaused = must(await request("/api/people", "POST", {
    name: "Automation Paused Person",
  }), 201, "person created while automation paused").person;
  assert.equal(must(await request("/api/automation-rules"), 200,
    "disabled rule did not run").rules[0]._count.runs, 1);
  must(await request("/api/automation-rules/" + rule.id, "PATCH", {
    enabled: true,
  }), 200, "re-enable internal automation");
  const personAfterResume = must(await request("/api/people", "POST", {
    name: "Automation Resumed Person",
  }), 201, "automation resumes on new persons").person;
  const newTasks = must(await request("/api/tasks?q=Review%20Automation%20Resumed%20Person"),
    200, "updated automation task template").tasks;
  assert.equal(newTasks.length, 1);
  const runs = must(await request("/api/automation-rules"), 200,
    "two recorded automation runs").rules;
  assert.equal(runs[0]._count.runs, 2);

  const unused = must(await request("/api/automation-rules", "POST", {
    name: "CI temporary unused automation", taskTitleTemplate: "Temporary task",
  }), 201, "add unused rule").rule;
  must(await request("/api/automation-rules/" + unused.id, "DELETE"), 204,
    "unused rule deletion allowed");
  const autoAudit = must(await request("/api/audit"), 200, "automation audit").events;
  assert.ok(autoAudit.some((event) => event.entityType === "automation_rule"
    && event.entityId === rule.id && event.action === "created"), "automation rule creation audited");
  assert.ok(autoAudit.some((event) => event.entityType === "automation_run"
    && event.action === "created"), "automation run creation audited");

  for (const id of [automatedPerson.id, personWhilePaused.id, personAfterResume.id]) {
    must(await request("/api/people/" + id, "DELETE"), 204, "clean synthetic automation person");
  }
  for (const id of [createdTask.id, newTasks[0].id]) {
    must(await request("/api/tasks/" + id, "DELETE"), 204, "clean synthetic generated task");
  }

  console.log(`PASS: ${requests} authenticated CRM requests, tenant isolation and CRUD tests`);
} finally {
  await prisma.$disconnect();
}
