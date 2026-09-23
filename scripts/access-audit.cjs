/* eslint-disable */
/**
 * Automated navigation & permission audit.
 * Fails (exit 1) if any invariant is violated. The policy under test is the
 * SAME source the sidebar and route guard use — compiled to `AA_BUILD` first
 * (see scripts/access-audit.sh).
 */
const B = process.env.AA_BUILD;
if (!B) { console.error("Set AA_BUILD to the compiled config dir."); process.exit(2); }

const { ROLES } = require(B + "/roles.js");
const { CATEGORIES, ROLE_CATEGORIES, categoriesForRole, canRoleAccessPath } = require(B + "/categories.js");
const { MODULES, canRoleSee } = require(B + "/screens.js");

// Known standalone (non-registry) routes the sidebar may point at.
const STANDALONE = new Set([
  "/app", "/app/screens", "/app/ai", "/app/enforcement/case",
  "/app/helpdesk/workspace", "/app/registrations/record", "/app/qr/batch",
]);
const SCREEN_PATHS = new Set(MODULES.flatMap((m) => m.screens.map((s) => `/app/${m.id}/${s.id}`)));
function routeExists(href) {
  const path = href.split("?")[0];
  return STANDALONE.has(path) || SCREEN_PATHS.has(path);
}

let failures = 0;
const fail = (msg) => { failures++; console.log("  ✗ " + msg); };
function check(name, fn) {
  const before = failures;
  fn();
  console.log((failures === before ? "✔ " : "✖ ") + name);
}

const items = CATEGORIES.flatMap((c) => c.items.map((it) => ({ ...it, cat: c.id })));

check("Every menu item resolves to a real route", () => {
  items.forEach((it) => { if (!routeExists(it.href)) fail(`${it.cat} · "${it.en}" → ${it.href} (no route)`); });
});

check("No two menu labels open the same generic URL", () => {
  const byHref = {};
  items.forEach((it) => { (byHref[it.href] ||= []).push(`${it.cat}/${it.en}`); });
  Object.entries(byHref).forEach(([href, labels]) => {
    if (labels.length > 1) fail(`${href} is opened by ${labels.length} labels: ${labels.join(", ")}`);
  });
});

check("Every screen is visible to at least one internal role", () => {
  const internal = ROLES.filter((r) => r.kind === "internal").map((r) => r.key);
  MODULES.forEach((m) => m.screens.forEach((s) => {
    if (!internal.some((r) => canRoleSee(s, r))) fail(`orphan screen ${m.id}/${s.id} — no internal role can see it`);
  }));
});

check("Every role has at least one workspace", () => {
  ROLES.forEach((r) => { if (categoriesForRole(r.key).length === 0) fail(`${r.key} has no visible category`); });
});

check("Sidebar ⇄ guard parity (every visible link is allowed)", () => {
  ROLES.forEach((r) => categoriesForRole(r.key).forEach((c) => c.items.forEach((it) => {
    if (!canRoleAccessPath(r.key, it.href.split("?")[0])) fail(`${r.key} sees "${it.en}" but guard denies ${it.href}`);
  })));
});

check("Default-deny holds for unauthorised role/path pairs", () => {
  const deny = [
    ["helpdesk", "/app/administration/appliance-master"],
    ["helpdesk", "/app/finance/finance-queue"],
    ["auditor", "/app/finance/finance-queue"],
    ["finance", "/app/model-label/label-preview"],
    ["manufacturer", "/app/audit/integration-correlation"],
    ["laboratory", "/app/finance/security-deposit-ledger"],
    ["director", "/app/administration/fee-rules"],
  ];
  deny.forEach(([role, path]) => { if (canRoleAccessPath(role, path)) fail(`${role} should NOT reach ${path}`); });
});

check("Public verification is not in any staff sidebar", () => {
  if (items.some((it) => it.href.includes("/public-verification"))) fail("public-verification appears in a sidebar category");
});

const total = MODULES.reduce((n, m) => n + m.screens.length, 0);
console.log(`\nScreens: ${total} · Menu items: ${items.length} · Roles: ${ROLES.length}`);
if (failures) { console.log(`\nFAILED — ${failures} invariant violation(s).`); process.exit(1); }
console.log("\nPASSED — all navigation & permission invariants hold.");
