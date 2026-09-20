/**
 * Internal BEE / control roles — the 8 columns of DDD Annex A.1.
 * Order here is the canonical order used by every screen's permission tuple.
 */
export const ROLES = [
  { key: "admin", short: "BEE Admin", name: "BEE Administrator" },
  { key: "programme", short: "Programme", name: "Programme Officer" },
  { key: "reviewer", short: "Reviewer", name: "Reviewer & Approver" },
  { key: "director", short: "Director", name: "Director" },
  { key: "secretary", short: "Secretary", name: "Secretary" },
  { key: "finance", short: "Finance", name: "BEE Finance" },
  { key: "helpdesk", short: "Helpdesk", name: "Helpdesk Agent" },
  { key: "auditor", short: "Auditor", name: "Auditor" },
] as const;

export type RoleKey = (typeof ROLES)[number]["key"];

export const ROLE_ORDER: RoleKey[] = ROLES.map((r) => r.key) as RoleKey[];

export function roleByKey(key: string) {
  return ROLES.find((r) => r.key === key) ?? ROLES[0];
}

/** Legend for the Annex-A access codes. */
export const ACCESS_CODES: Record<string, string> = {
  V: "View",
  C: "Create",
  E: "Edit",
  S: "Submit",
  R: "Review",
  A: "Approve or reject",
  X: "Execute action",
  G: "Configure or administer",
  D: "Download or export",
  P: "Public access",
};

/** Split a permission cell like "V/R" or "G/A" into individual codes. */
export function splitCodes(cell: string): string[] {
  if (!cell || cell === "—") return [];
  return cell.split("/").filter(Boolean);
}
