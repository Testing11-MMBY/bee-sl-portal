# Review fixes — iteration 3 (partner payment journey & permission)

Prototype, simulated data. This does not establish backend or server-side API
authorization. Every result below was verified in the running app.

## P0 — Partner payment journey & action permission

**Before:** "Payments and receipts" opened the BEE Finance stage screen
("Confirm application fee") for a payer too — with an enabled **Confirm fee
received** button and "Acting as Manufacturer/Agency". A payer could confirm
receipt of their own fee.

**After:** `/app/model-label/model-payment` now branches by role
(`ModelPaymentScreen`):

- **Payer (Manufacturer / Registered Agency)** → a read-only **partner payment
  view** (`PartnerPayments`): only that organisation's applications, with amount
  due/paid, transaction, reconciliation status and a receipt (view/print) where
  Finance has confirmed. **No confirm / settlement action exists on this view.**
- **BEE Finance** → the fee-confirmation workflow, with the **Confirm fee
  received** action enabled.
- **Any other role** → route denied (default-deny).

The rule is enforced at three layers (defense in depth):

| Layer | Enforcement |
|-------|-------------|
| **Route** | `WORKFLOW_ACCESS["/app/model-label/model-payment"] = [finance, manufacturer, agency]`; the menu item is partner-only (`hideFrom` all internal). `RouteGuard` denies everyone else. |
| **View** | External roles render `PartnerPayments` (no action). Internal non-Finance never reach it. |
| **Button** | The "Confirm fee received" button renders only when `role === "finance"` (`canConfirmFee`). |
| **Action ("API")** | `doPrimary()` for the fee stage returns early unless `canConfirmFee` — a non-Finance call is a no-op. In this prototype the "API" is the `payFee` store action; server-side authorization is out of scope. |

### Role-by-role route/action test

| Role | Opens model-payment? | View | Confirm fee action | Own data only |
|------|:--:|------|:--:|:--:|
| Manufacturer | ✅ | Partner payments (Nova Cool Appliances Ltd.) | **absent** | ✅ (3 own apps; no PixelCert) |
| Registered Agency | ✅ | Partner payments (PixelCert Registered Agency) | **absent** | ✅ (3 own apps; no Nova Cool) |
| BEE Finance | ✅ | Fee-confirmation workflow, "Acting as BEE Finance" | **enabled** | queue (Finance) |
| Programme Officer | ❌ denied | — | — | — |
| Auditor | ❌ denied | — | — | — |
| Reviewer / Director / Secretary / Helpdesk / Admin | ❌ denied | — | — | — |

Partner view contents verified: no "Confirm fee received" button, no "Acting as
Manufacturer/Agency", payer-boundary note present ("a payer cannot confirm their
own payment"), amount due/paid + transaction + reconciliation columns, and a
receipt (RCPT-2026-05016) that opens a printable receipt marked "Fee confirmed
by BEE Finance". Manufacturer and Agency see different, own-organisation sets.

## P2 — Reconciliation cause aligned to current state

Certificate `BEE/CERT/RAC/2026/10058` shows *Pending confirmation*. Its
exception cause previously said "Portal marked active before ledger
confirmation" (a since-corrected past state). It now reads **"Ledger commit not
yet received — portal status held at Pending until the transaction confirms"**,
with next step "Await orderer confirmation; escalate if not committed within
SLA" — matching the current pending state.

## Checks

Automated navigation/permission audit: **9 invariants pass**. `next build`:
**clean** (161 pages, TypeScript OK).
