# Review fixes — credibility & role-correctness pass

Date: 24 Sep 2026 (demo "today"). All ledger/AI data is **simulated** for the
prototype. Every item below was verified in the running app (browser preview),
not just in code.

## P0 — blockers

### P0-A · Label, certificate, ledger and QR are ONE record
- `lib/mock/certificate.ts` `PRIMARY_CERT` is the single journey fixture:
  **Nova Cool Appliances Ltd. · FrostMax 1.5T (5★) · App `APP-2026-05016` ·
  Reg `BEE/RAC/2026/10016` · Cert `BEE/CERT/RAC/2026/10016`**.
- `components/app/lifecycle/LabelPreviewScreen.tsx` renders a **fixed record
  header** + four tabs (Label & QR, Certificate & Ledger, Version history,
  Lifecycle actions). All four read the same store, so the identity never
  switches mid-journey.
- Public verification (`app/(public)/verify/page.tsx`) derives from the shared
  store's **current version** (status, hash, tx), so revoke/amend reflect
  immediately.
- **Evidence:** Label tab and Certificate & Ledger tab both show
  `BEE/CERT/RAC/2026/10016`, v3 · Revoked, Nova Cool / FrostMax, hash
  `b28d5f0a…15d9b`, public verify `reg=BEE/RAC/2026/10016`.

### P0-B · Sidebar matches actual role access
- `lib/categories.ts` now scopes navigation at **item level** (`ext` /
  `hideFrom` on each item). External partners (manufacturer, agency, IAME, SDA,
  laboratory) see **only** their curated items; internal officers keep their
  categories.
- Manufacturer no longer sees BEE Finance queues/reconciliation/ledgers, the
  Helpdesk **agent** workspace, BEE **Approvals**, or internal
  validation/compliance-exception screens.
- IAME / SDA / laboratory get **distinct** assessor/field menus — they do not
  reuse the manufacturer menu.
- `components/app/ScreenScaffold.tsx` unifies the two permission layers: an
  external partner gets a scoped **View/Download** grant on exactly the screens
  their nav policy exposes, so a partner link **never** lands on a "No access"
  dead-end.
- `components/app/RouteGuard.tsx` enforces the same policy on direct-URL access
  (default-deny).
- **Evidence:** manufacturer sidebar = Home / Registrations / Labels &
  Production / Support only; Support = Raise ticket + Knowledge base (no agent
  workspace); direct URL `/app/helpdesk/workspace` → "Not available for your
  role"; IAME menu = Enforcement cases + Challenge testing (+ support).

### P0-B · Overview copy & role switcher
- `app/app/page.tsx` shows partner-appropriate copy and KPIs for external roles
  ("Partner Portal", "Your partner workspace — N work areas…") instead of
  "0 of 140 internal screens", with partner KPIs (models / applications / QR /
  tickets).
- `components/app/AppTopbar.tsx` labels the role switcher **"Preview role"**
  with a tooltip stating it is a prototype preview, not enforced authentication.

## P1 — credibility

### Ledger health ⇄ reconciliation agree
- `fabricHealth()` in `lib/mock/certificate.ts` computes Healthy / Degraded /
  Unavailable from the **same** tx + exception fixture that feeds the counts
  and the exception table, so health can't claim "in sync" while exceptions
  exist. `FabricMonitoring.tsx` renders every KPI and the reconciliation panel
  from that one value.

### AI contradictions resolved
- One shared **`AI_MODELS`** fixture drives the AI landing cards, the use-case
  pages and Model Governance. `assist-rag` is **Shadow**: the Helpdesk
  Assistant's "Accept & send" is **disabled** until "Authorise live (demo)" is
  toggled. **Evidence:** button shows a lock + is disabled in Shadow, enabled
  after authorising.
- **Risk Scoring** "View events / submissions / cases / comparison" now open an
  entity-specific **evidence drawer** carrying the selected entity + scoring
  period (Q2 FY26). Evidence is labelled advisory — "not a confirmed
  violation". **Evidence:** drawer header "Nova Cool Appliances Ltd. · MFR-2231
  · Q2 FY26 · Jul–Sep 2026" with a full event table.
- Recording a **disposition** updates the queue: the "Awaiting disposition" KPI
  decrements and the entity row shows a green "Dispositioned / Cleared" badge.
  **Evidence:** 12 → 11 after recording; Nova Cool row badged.
- **AI Model Governance** aligns to the shared fixture (5 models) and is
  **view-only** for auditors/viewers — the maker-checker pause/rollback/deploy
  form is replaced by a read-only notice. **Evidence:** admin sees the form;
  auditor sees "Read-only — You are viewing as Auditor…".
- **Document Intelligence** SHA-256 replaced the empty-file digest
  (`e3b0c442…b855`) with a plausible fixture hash marked "· simulated fixture".

### Timeline correctness (today = 24 Sep 2026)
- Removed hardcoded relative claims ("Today", "Yesterday", "2 minutes ago",
  "N days ago") in Risk Scoring, Access Management, My Approvals and Ticket
  workspace — replaced with concrete past dates.
- Aligned the issuance-sequence stage timestamps (`CertificateStore` INITIAL)
  to the v1 ledger commit (**04 Sep 2026**) so hash/submit/confirm/activate no
  longer disagree with the on-chain timestamp. Certificate summary "Document"
  now reflects the current version PDF.

### AI use-case navigation fix
- `categoryForPath()` now resolves `/app/mis-ai/*` AI use-case detail pages to
  **Insights** (not Compliance, which also claims the `mis-ai` segment), so
  roles with AI Insights (admin, director, auditor, …) can open them from the
  AI landing instead of being denied.

## Automated audit
`scripts/access-audit.*` (8 invariants, incl. new "external partners see no
internal-only item" and expanded default-deny) — **PASSED**. Full
`next build` — **clean** (161 pages, TypeScript OK).
