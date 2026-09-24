# Review fixes — iteration 2 (inbox scope, status alignment, fixture validation)

Demo "today" = **24 Sep 2026**. All ledger/AI data is **simulated** — this
prototype does not establish backend or API authorization. Every item below was
verified in the running app.

## What changed (by review item)

**P0 · Personal inbox filtered by role & assignment.** Each `WorkflowTask` now
carries `ownerRoles` (from `STAGE_OWNERS`). The personal inbox shows only tasks
the current role can act on, and the All / Overdue / High-priority counts are
computed from that filtered set. The workflow action screens are reachable by
their owner roles via `WORKFLOW_ACCESS` (route guard + a new audit invariant),
so **no visible task link lands on a denial page** for any role.

**P0 · Unanchored certificate status aligned across views.** An unanchored
certificate is never called "Active". `RECON_EXCEPTIONS` carries `regId` +
applicant, monitoring shows *Pending first anchor*, and public verification of
the same registration returns **"Verification pending"** (not "not found", no
authenticity claim) — both from one fixture (`pendingScenarioForReg`).

**P1 · AI evidence fixture validated.** No future dates (window clamped to
24 Sep 2026); the current quarter Jul–Sep 2026 is labelled **Q2 FY27**
(Indian FY); submission "late by" is the real due→filed day difference and the
"N of M" summary counts the actual late rows; the QR scan note no longer claims
a link the rows didn't have ("each row is a scan record").

**P1 · Ledger counters reconciled + version-specific proof.** One definition:
`awaitingAnchor = retrying + submitted-pending + missing`, each record counted
once (the retrying tx and its exception are the same certificate). The KPI and
the reconciliation panel derive from it and show the breakdown. The Certificate
& Ledger tab opens on the **current version's** proof (v3 revocation for the
revoked cert) with a version selector; label and certificate-document hashes are
labelled as one anchored file.

**P1 · Role-specific partner dashboards.** IAME, SDA and Laboratory each get
their own KPI cards and summary wording (assessment / enforcement / testing).
Manufacturer & Agency have a scoped **Payments and receipts** entry for their
own fee status and receipts (the generic Finance menu stays removed).

**P1 · AI model-state control kept within governance.** The "Authorise live
(demo)" control is restricted to model administrators (`GOV_ACTORS` =
admin, director). A view-only role (e.g. Finance) sees a lock message, not the
toggle, and cannot unlock sending.

---

## 1) Role-by-role inbox / navigation test

Seed has **7** in-flight tasks. Before the fix every role saw all 7 (and IAME
could click a Director task into a denial). After: each role sees only its own,
and every visible task link resolves.

| Role | Owns stage(s) | Tasks in inbox | Action target | Link resolves? |
|------|---------------|:--:|---------------|:--:|
| Programme Officer | rating, label | **2** | rating-calculation / label-preview | ✅ |
| Reviewer & Approver | bee_scrutiny | **1** | bee-scrutiny | ✅ |
| Director | approval | **1** | director-approval (Approve/reject) | ✅ (was ❌ denial) |
| Secretary | approval | **1** | director/secretary-approval | ✅ |
| BEE Finance | fee_due | **1** | model-payment | ✅ |
| IAME (Assessor) | iame_scrutiny | **2** | iame-scrutiny | ✅ (was showing all 7) |
| BEE Admin | — | 0 | — (config/admin role) | n/a |
| Helpdesk Agent | — | 0 | — | n/a |
| Auditor | — | 0 (read-only) | — | n/a |
| Manufacturer / Agency | — | 0 BEE tasks | own Payments & receipts reachable | ✅ |
| SDA / Laboratory | — | 0 BEE tasks | assessment/enforcement menus only | ✅ |

Guaranteed for **all** roles by the automated audit invariant *"Workflow action
screens are reachable by their owner roles"* plus the `ownerRoles` inbox filter
(a task is shown only if the role owns it, and owners always have access).

## 2) Certificate status table (one fixture, all views agree)

| Case | Cert / Reg | Portal status | Ledger status | Monitoring | Public verify |
|------|-----------|---------------|---------------|-----------|---------------|
| **Active** (amended, current on the demo journey) | 10016 v2 | Active | Confirmed (COR-88540) | Confirmed | ✅ genuine, active |
| **Pending (first anchor)** | 10022 v1 (RX-01) | Pending first anchor | Retrying — not yet confirmed (COR-89044) | Retrying · awaiting anchor | ⏳ "Verification pending" |
| **Submitted (pending confirmation)** | 10058 v1 (RX-03) | Pending confirmation | Submitted (not confirmed) | Submitted · awaiting anchor | ⏳ "Verification pending" |
| **Hash mismatch (under review)** | 10077 v1 (RX-02) | Active — under review | Hash differs (COR-88820) | Hash mismatch | ⛔ "possible tampering" |
| **Revoked** (demo journey current) | 10016 v3 | Revoked | Confirmed (COR-88991) | Confirmed | ⛔ "revoked — do not trust" |

Counters (auditor monitoring): **Confirmed 4 · Retrying 1 · Submitted-pending 1
· Missing 0 · Hash mismatch 1**. Awaiting anchor = 1 + 1 + 0 = **2** (KPI and
panel agree; each record counted once).

## 3) Fixture validation check

| Check | Result |
|-------|--------|
| Any evidence date after 24 Sep 2026 | **None** (QR window 26 Jun–24 Sep 2026; max row 14 Sep) |
| Financial-year label for Jul–Sep 2026 | **Q2 FY27** (was Q2 FY26) — consistent with Indian FY (Apr–Mar) |
| Submission summary vs rows | **Derived** — "3 of the last 3 due filings were late" counts the actual late rows (was "5 of 4") |
| "Late by" days | **Computed** from due→filed, e.g. due 15 Jan, filed 26 Jan → *Late by 11 days* (was 13 with no basis) |
| Scan-record link claim | Corrected — note now says "each row is a scan record", matching what is shown |
| Ledger counters double-counting | Removed — retrying tx and its exception are one certificate; `awaitingAnchor` sums each once |
| Unanchored cert called "Active" | Removed — portal shows *Pending*, public verify shows *pending* |
| Version-specific proof | Certificate & Ledger opens on current version (v3 revocation) with per-version selector |
| Empty-file SHA-256 (`e3b0c442…b855`) | Absent from the codebase |

Automated audit: **9 invariants pass.** `next build`: **clean** (161 pages,
TypeScript OK).
