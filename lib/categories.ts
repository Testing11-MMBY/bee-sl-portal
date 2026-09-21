import { RoleKey } from "./roles";

/**
 * Two-level console navigation (DDD IA revision).
 *
 * The 14 low-level modules of Annex A.1 are regrouped into 9 top-level
 * categories (A–I). Each category exposes a small, curated set of entry
 * points — NOT the full 140-screen catalogue — so an operator sees only the
 * work relevant to their role. Every item routes to an existing
 * /app/[module]/[screen] page; nothing is removed. The complete catalogue
 * stays reachable at /app/screens for reference only.
 *
 * Consolidated workspaces (agency/brand/model, QR batch, enforcement case,
 * ticket) and the redesigned AI pages are layered on top of these entry
 * points in later phases; for now each item opens its representative screen.
 */
export interface CategoryItem {
  en: string;
  hi: string;
  href: string;
  icon: string;
}

export interface Category {
  id: string;
  en: string;
  hi: string;
  icon: string;
  items: CategoryItem[];
}

export const CATEGORIES: Category[] = [
  {
    id: "home",
    en: "Home",
    hi: "मुख्य",
    icon: "home",
    items: [
      { en: "Dashboard", hi: "डैशबोर्ड", href: "/app", icon: "dashboard" },
      { en: "My work", hi: "मेरा कार्य", href: "/app/workflow/personal-inbox", icon: "inbox" },
      { en: "Approvals", hi: "अनुमोदन", href: "/app/workflow/approval-note", icon: "task_alt" },
      { en: "SLA and escalations", hi: "एसएलए एवं एस्केलेशन", href: "/app/workflow/escalation-dashboard", icon: "priority_high" },
    ],
  },
  {
    id: "registrations",
    en: "Registrations",
    hi: "पंजीकरण",
    icon: "how_to_reg",
    items: [
      { en: "Organisations and users", hi: "संगठन एवं उपयोगकर्ता", href: "/app/identity/organisation-users", icon: "groups" },
      { en: "Agency registrations", hi: "एजेंसी पंजीकरण", href: "/app/agency-brand/agency-registration", icon: "domain" },
      { en: "Brands", hi: "ब्रांड", href: "/app/agency-brand/brand-registration", icon: "sell" },
      { en: "Model applications", hi: "मॉडल आवेदन", href: "/app/model-label/new-model-application", icon: "note_add" },
      { en: "Approved models", hi: "अनुमोदित मॉडल", href: "/app/model-label/model-dashboard", icon: "verified" },
      { en: "Renewals and changes", hi: "नवीनीकरण एवं परिवर्तन", href: "/app/model-label/renewal-or-degradation", icon: "autorenew" },
      { en: "Withdrawals", hi: "वापसी", href: "/app/withdrawal/brand-withdrawal", icon: "cancel" },
    ],
  },
  {
    id: "labels-production",
    en: "Labels and Production",
    hi: "लेबल एवं उत्पादन",
    icon: "label",
    items: [
      { en: "Labels and certificates", hi: "लेबल एवं प्रमाणपत्र", href: "/app/model-label/label-preview", icon: "verified_user" },
      { en: "QR batches", hi: "QR बैच", href: "/app/qr-verification/qr-batch-status", icon: "qr_code_2" },
      { en: "Production submissions", hi: "उत्पादन प्रस्तुति", href: "/app/production/quarterly-submission", icon: "factory" },
      { en: "Bulk uploads", hi: "बल्क अपलोड", href: "/app/production/bulk-upload", icon: "upload_file" },
      { en: "Validation and reconciliation", hi: "सत्यापन एवं समाधान", href: "/app/production/reconciliation", icon: "rule" },
      { en: "Compliance exceptions", hi: "अनुपालन अपवाद", href: "/app/production/compliance-exceptions", icon: "report" },
    ],
  },
  {
    id: "compliance",
    en: "Compliance and Enforcement",
    hi: "अनुपालन एवं प्रवर्तन",
    icon: "gavel",
    items: [
      { en: "Enforcement dashboard", hi: "प्रवर्तन डैशबोर्ड", href: "/app/mis-ai/enforcement-dashboard", icon: "monitoring" },
      { en: "Sampling plans", hi: "नमूना योजनाएँ", href: "/app/enforcement/sample-plan", icon: "science" },
      { en: "Enforcement cases", hi: "प्रवर्तन प्रकरण", href: "/app/enforcement/case", icon: "folder_special" },
      { en: "Laboratory testing", hi: "प्रयोगशाला परीक्षण", href: "/app/enforcement/laboratory-assignment", icon: "biotech" },
      { en: "Challenge testing", hi: "चुनौती परीक्षण", href: "/app/enforcement/challenge-test", icon: "fact_check" },
      { en: "Show-cause and penalties", hi: "कारण बताओ एवं दंड", href: "/app/enforcement/show-cause", icon: "gavel" },
      { en: "Closure and appeals", hi: "समापन एवं अपील", href: "/app/enforcement/enforcement-decision", icon: "how_to_vote" },
    ],
  },
  {
    id: "finance",
    en: "Finance",
    hi: "वित्त",
    icon: "payments",
    items: [
      { en: "Finance work queue", hi: "वित्त कार्य कतार", href: "/app/finance/finance-queue", icon: "inbox" },
      { en: "Transactions", hi: "लेन-देन", href: "/app/finance/transaction-search", icon: "receipt_long" },
      { en: "Reconciliation", hi: "समाधान", href: "/app/finance/payment-reconciliation", icon: "rule" },
      { en: "Refunds and exceptions", hi: "रिफंड एवं अपवाद", href: "/app/finance/refund", icon: "undo" },
      { en: "Deposits and ledgers", hi: "जमा एवं बहीखाते", href: "/app/finance/security-deposit-ledger", icon: "account_balance" },
    ],
  },
  {
    id: "support",
    en: "Support",
    hi: "सहायता",
    icon: "support_agent",
    items: [
      { en: "Raise / track ticket", hi: "टिकट दर्ज / ट्रैक", href: "/app/helpdesk/raise-ticket", icon: "confirmation_number" },
      { en: "Agent workspace", hi: "एजेंट कार्यक्षेत्र", href: "/app/helpdesk/workspace", icon: "headset_mic" },
      { en: "Knowledge base", hi: "ज्ञान आधार", href: "/app/helpdesk/knowledge-base", icon: "menu_book" },
      { en: "SLA dashboard", hi: "एसएलए डैशबोर्ड", href: "/app/helpdesk/sla-dashboard", icon: "speed" },
    ],
  },
  {
    id: "insights",
    en: "Insights and AI",
    hi: "अंतर्दृष्टि एवं एआई",
    icon: "insights",
    items: [
      { en: "Executive MIS", hi: "कार्यकारी एमआईएस", href: "/app/mis-ai/executive-mis", icon: "leaderboard" },
      { en: "Operational dashboards", hi: "परिचालन डैशबोर्ड", href: "/app/mis-ai/registration-dashboard", icon: "dashboard" },
      { en: "Report builder", hi: "रिपोर्ट बिल्डर", href: "/app/mis-ai/report-builder", icon: "build" },
      { en: "Scheduled reports", hi: "अनुसूचित रिपोर्ट", href: "/app/mis-ai/scheduled-reports", icon: "schedule" },
      { en: "AI Insights", hi: "एआई अंतर्दृष्टि", href: "/app/ai", icon: "auto_awesome" },
      { en: "Data quality", hi: "डेटा गुणवत्ता", href: "/app/mis-ai/data-quality", icon: "verified" },
      { en: "AI model governance", hi: "एआई मॉडल गवर्नेंस", href: "/app/mis-ai/model-monitoring", icon: "shield" },
    ],
  },
  {
    id: "administration",
    en: "Administration",
    hi: "प्रशासन",
    icon: "settings",
    items: [
      { en: "Users, roles and delegation", hi: "उपयोगकर्ता, भूमिका एवं प्रत्यायोजन", href: "/app/identity/role-assignment", icon: "manage_accounts" },
      { en: "Master data", hi: "मास्टर डेटा", href: "/app/administration/appliance-master", icon: "database" },
      { en: "Rules and formulas", hi: "नियम एवं सूत्र", href: "/app/administration/rating-formula", icon: "functions" },
      { en: "Workflow and SLA configuration", hi: "कार्यप्रवाह एवं एसएलए कॉन्फ़िग", href: "/app/administration/workflow-configuration", icon: "account_tree" },
      { en: "Fees and document requirements", hi: "शुल्क एवं दस्तावेज़ आवश्यकताएँ", href: "/app/administration/fee-rules", icon: "request_quote" },
      { en: "Notifications and templates", hi: "अधिसूचना एवं टेम्पलेट", href: "/app/administration/notification-templates", icon: "mail" },
      { en: "Integrations", hi: "एकीकरण", href: "/app/administration/reference-publication", icon: "hub" },
    ],
  },
  {
    id: "audit",
    en: "Audit",
    hi: "अंकेक्षण",
    icon: "policy",
    items: [
      { en: "Business audit", hi: "व्यावसायिक अंकेक्षण", href: "/app/audit/business-audit-search", icon: "search" },
      { en: "Security events", hi: "सुरक्षा घटनाएँ", href: "/app/audit/security-event-review", icon: "security" },
      { en: "Configuration changes", hi: "कॉन्फ़िगरेशन परिवर्तन", href: "/app/audit/configuration-history", icon: "history" },
      { en: "Integration monitoring", hi: "एकीकरण निगरानी", href: "/app/audit/integration-correlation", icon: "lan" },
    ],
  },
];

/**
 * Role-based menu visibility (DDD IA revision, §1). Operators never see the
 * whole catalogue — only the categories relevant to their function. The
 * external actor roles from the spec table (manufacturer/agency, IAME, SDA,
 * laboratory) belong to the applicant/field portals; this internal officer
 * console maps the remaining control roles as below.
 */
export const ROLE_CATEGORIES: Record<RoleKey, string[]> = {
  admin: ["home", "administration", "audit", "insights"],
  programme: ["home", "registrations", "labels-production", "compliance", "insights"],
  reviewer: ["home", "registrations", "labels-production", "compliance", "insights"],
  director: ["home", "insights"],
  secretary: ["home", "insights"],
  finance: ["home", "finance", "registrations", "insights"],
  helpdesk: ["home", "support"],
  auditor: ["home", "audit", "insights"],
};

/** Categories visible to a role, in canonical order. */
export function categoriesForRole(role: RoleKey): Category[] {
  const allowed = ROLE_CATEGORIES[role] ?? CATEGORIES.map((c) => c.id);
  return CATEGORIES.filter((c) => allowed.includes(c.id));
}

/** Which category a given /app path belongs to (for active-state + auto-open). */
export function categoryForPath(pathname: string): Category | undefined {
  // exact item match first (handles screens shared across categories)
  const exact = CATEGORIES.find((c) => c.items.some((it) => it.href === pathname));
  if (exact) return exact;
  // else match by /app/<module> segment
  const seg = pathname.split("/").slice(0, 3).join("/"); // "/app/<module>"
  return CATEGORIES.find((c) =>
    c.items.some((it) => it.href === seg || it.href.startsWith(seg + "/"))
  );
}
