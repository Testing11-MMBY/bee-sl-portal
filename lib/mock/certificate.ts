/**
 * Connected demo data for the blockchain certificate lifecycle (prototype).
 *
 * EVERY blockchain/verification screen imports from here, so the same
 * manufacturer, model, application id, certificate id, versions, SHA-256
 * hashes and simulated Fabric transaction ids appear consistently across the
 * issuance panel, certificate history, public/authenticated verification and
 * the Fabric monitoring view. All ledger data is SIMULATED for the mockup.
 */

export const ADVISORY_TEXT =
  "AI output is advisory decision support. No regulatory, financial or enforcement action is performed without an authorised human decision.";

export const SIM_LABEL_TEXT = "Simulated Hyperledger Fabric transaction for prototype demonstration.";

export const FABRIC_META = {
  network: "bee-sl-fabric (permissioned)",
  channel: "certchannel",
  chaincode: "bee-cert-cc",
  chaincodeVersion: "v1.4",
  mspId: "BEEMSP",
};

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */
export type CertEvent =
  | "Issued" | "Amended" | "Renewed" | "Rating changed"
  | "Suspended" | "Revoked" | "Superseded" | "Reinstated" | "Expired";

export type LifecycleStatus =
  | "Active" | "Superseded" | "Suspended" | "Revoked" | "Expired" | "Reinstated";

export type TxStatus = "Submitted" | "Confirmed" | "Failed";

export interface LedgerTx {
  txId: string;        // 64-hex simulated Fabric tx id
  blockNumber: number;
  timestamp: string;   // ledger commit time (ISO)
  status: TxStatus;
}

export interface CertVersion {
  version: number;
  event: CertEvent;
  status: LifecycleStatus;
  effectiveDate: string;
  hash: string;                 // SHA-256 of the bilingual certificate PDF
  tx: LedgerTx;
  previousVersion: number | null;
  officer: string;
  note: string;
}

export interface Certificate {
  certId: string;
  regId: string;      // public registration id encoded in the QR
  appId: string;
  manufacturer: string;
  model: string;
  category: string;
  stars: number;
  iseer: number;
  validFrom: string;
  validTo: string;
  currentVersion: number;   // the version treated as "current" for verification
  versions: CertVersion[];
}

/* ------------------------------------------------------------------ *
 * The primary journey certificate — used end to end.
 * v1 Issued (superseded) → v2 Amended (Active, current) → v3 Revoked
 * (available to demonstrate the post-revocation state).
 * ------------------------------------------------------------------ */
export const PRIMARY_CERT: Certificate = {
  certId: "BEE/CERT/RAC/2026/10016",
  regId: "BEE/RAC/2026/10016",
  appId: "APP-2026-05016",
  manufacturer: "Nova Cool Appliances Ltd.",
  model: "FrostMax 1.5T",
  category: "Room ACs",
  stars: 5,
  iseer: 5.10,
  validFrom: "20 Sep 2026",
  validTo: "19 Sep 2029",
  currentVersion: 2,
  versions: [
    {
      version: 1, event: "Issued", status: "Superseded", effectiveDate: "20 Sep 2026",
      hash: "3f9a1c47b8e20d5f6a9c8e14b2d70f83c1a6e59d4b7802fa3c6d1e9b0b4a7e2d",
      tx: { txId: "a1b2c3d4e5f60718293a4b5c6d7e8f901a2b3c4d5e6f70819a2b3c4d5e6f7081", blockNumber: 184320, timestamp: "2026-09-20T06:42:11Z", status: "Confirmed" },
      previousVersion: null, officer: "R. Menon (SDA)", note: "Initial issuance on model approval.",
    },
    {
      version: 2, event: "Amended", status: "Active", effectiveDate: "05 Oct 2026",
      hash: "7c4e9d21a6f083b5c7e1092d4a6b8f30e5c9a1d7b3f206e8a4c1d9b7e3f5028a",
      tx: { txId: "b2c3d4e5f6071829a3b4c5d6e7f8091a2b3c4d5e6f7081920a3b4c5d6e7f8091", blockNumber: 185011, timestamp: "2026-10-05T09:15:44Z", status: "Confirmed" },
      previousVersion: 1, officer: "A. Kapoor (Programme)", note: "Corrected annual energy consumption (820 → 835 kWh) after re-check.",
    },
    {
      version: 3, event: "Revoked", status: "Revoked", effectiveDate: "18 Oct 2026",
      hash: "b28d5f0a9c1e73d64b8a205f0c9e1d7a3b6082f4e5c9d1a7b30e6f28a4c15d9b",
      tx: { txId: "c3d4e5f6071829a3b4c5d6e7f8091a2b3c4d5e6f7081920a3b4c5d6e7f80912a", blockNumber: 185740, timestamp: "2026-10-18T14:03:20Z", status: "Confirmed" },
      previousVersion: 2, officer: "Director (BEE)", note: "Revoked after failed enforcement check-test (measured ISEER 4.62 vs declared 5.10).",
    },
  ],
};

export function certCurrent(cert: Certificate): CertVersion {
  return cert.versions.find((v) => v.version === cert.currentVersion) ?? cert.versions[cert.versions.length - 1];
}

export function shortHash(h: string): string {
  return `${h.slice(0, 10)}…${h.slice(-8)}`;
}

export function maskHash(h: string): string {
  return `${h.slice(0, 6)}${"•".repeat(10)}${h.slice(-4)}`;
}

export function maskTx(t: string): string {
  return `${t.slice(0, 6)}${"•".repeat(8)}${t.slice(-4)}`;
}

/* ------------------------------------------------------------------ *
 * Verification scenarios (section 11) — the outcomes the prototype must
 * demonstrate. Scenario 1 is the primary journey cert (active + matched).
 * ------------------------------------------------------------------ */
export type VerifyOutcome =
  | "active" | "expired" | "suspended" | "revoked" | "superseded"
  | "mismatch" | "ledger-down" | "not-found";

export interface VerifyScenario {
  id: VerifyOutcome;
  label: string;
  regId: string;
  /** The certificate to render (falls back to a lightweight inline record). */
  manufacturer?: string;
  model?: string;
  stars?: number;
  status?: LifecycleStatus;
  validFrom?: string;
  validTo?: string;
  version?: number;
  /** hash currently computed from the presented certificate */
  currentHash?: string;
  /** hash anchored on the ledger */
  ledgerHash?: string;
  tx?: LedgerTx;
  supersededBy?: string;
}

export const VERIFY_SCENARIOS: VerifyScenario[] = [
  {
    id: "active", label: "Active — hash matched", regId: PRIMARY_CERT.regId,
    manufacturer: PRIMARY_CERT.manufacturer, model: PRIMARY_CERT.model, stars: 5,
    status: "Active", validFrom: PRIMARY_CERT.validFrom, validTo: PRIMARY_CERT.validTo, version: 2,
    currentHash: PRIMARY_CERT.versions[1].hash, ledgerHash: PRIMARY_CERT.versions[1].hash, tx: PRIMARY_CERT.versions[1].tx,
  },
  {
    id: "expired", label: "Expired", regId: "BEE/RAC/2023/00412",
    manufacturer: "Sunrise Electra Pvt. Ltd.", model: "BreezeLite 1T", stars: 3,
    status: "Expired", validFrom: "12 Mar 2020", validTo: "11 Mar 2023", version: 1,
    currentHash: "9d1c7a4e2b6083f5c9a1d7b3e6082f4e5c9d1a7b30e6f28a4c15d9b7e3f5028a",
    ledgerHash: "9d1c7a4e2b6083f5c9a1d7b3e6082f4e5c9d1a7b30e6f28a4c15d9b7e3f5028a",
    tx: { txId: "e5f6071829a3b4c5d6e7f8091a2b3c4d5e6f7081920a3b4c5d6e7f80912a3b4c", blockNumber: 90210, timestamp: "2020-03-12T05:20:00Z", status: "Confirmed" },
  },
  {
    id: "suspended", label: "Suspended", regId: "BEE/RAC/2026/10041",
    manufacturer: "GreenVolt Industries", model: "EcoChill 1.5T", stars: 4,
    status: "Suspended", validFrom: "02 Feb 2026", validTo: "01 Feb 2029", version: 2,
    currentHash: "1a7b30e6f28a4c15d9b7e3f5028a9d1c7a4e2b6083f5c9a1d7b3e6082f4e5c9d",
    ledgerHash: "1a7b30e6f28a4c15d9b7e3f5028a9d1c7a4e2b6083f5c9a1d7b3e6082f4e5c9d",
    tx: { txId: "f6071829a3b4c5d6e7f8091a2b3c4d5e6f7081920a3b4c5d6e7f80912a3b4c5d", blockNumber: 181004, timestamp: "2026-08-30T11:02:00Z", status: "Confirmed" },
  },
  {
    id: "revoked", label: "Revoked (same journey cert)", regId: PRIMARY_CERT.regId,
    manufacturer: PRIMARY_CERT.manufacturer, model: PRIMARY_CERT.model, stars: 5,
    status: "Revoked", validFrom: PRIMARY_CERT.validFrom, validTo: PRIMARY_CERT.validTo, version: 3,
    currentHash: PRIMARY_CERT.versions[2].hash, ledgerHash: PRIMARY_CERT.versions[2].hash, tx: PRIMARY_CERT.versions[2].tx,
  },
  {
    id: "superseded", label: "Superseded by newer version", regId: "BEE/RAC/2026/09980",
    manufacturer: "PolarPro Appliances", model: "PolarPro 2T", stars: 5,
    status: "Superseded", validFrom: "10 Jan 2026", validTo: "09 Jan 2029", version: 1,
    currentHash: "5c9d1a7b30e6f28a4c15d9b7e3f5028a9d1c7a4e2b6083f5c9a1d7b3e6082f4e",
    ledgerHash: "5c9d1a7b30e6f28a4c15d9b7e3f5028a9d1c7a4e2b6083f5c9a1d7b3e6082f4e",
    tx: { txId: "071829a3b4c5d6e7f8091a2b3c4d5e6f7081920a3b4c5d6e7f80912a3b4c5d6e", blockNumber: 179220, timestamp: "2026-06-11T08:40:00Z", status: "Confirmed" },
    supersededBy: "BEE/RAC/2026/09981 (v2)",
  },
  {
    id: "mismatch", label: "Hash mismatch — possible tampering", regId: "BEE/RAC/2026/10077",
    manufacturer: "Unknown / suspect", model: "ArcticMax 1.5T", stars: 5,
    status: "Active", validFrom: "15 Jul 2026", validTo: "14 Jul 2029", version: 1,
    currentHash: "deadbeef00112233445566778899aabbccddeeff00112233445566778899aabb",
    ledgerHash: "aa11bb22cc33dd44ee55ff6677889900aa11bb22cc33dd44ee55ff6677889900",
    tx: { txId: "1829a3b4c5d6e7f8091a2b3c4d5e6f7081920a3b4c5d6e7f80912a3b4c5d6e7f", blockNumber: 183990, timestamp: "2026-07-15T07:10:00Z", status: "Confirmed" },
  },
  {
    id: "ledger-down", label: "Ledger temporarily unavailable", regId: "BEE/RAC/2026/10016",
    manufacturer: PRIMARY_CERT.manufacturer, model: PRIMARY_CERT.model, stars: 5,
    status: "Active", validFrom: PRIMARY_CERT.validFrom, validTo: PRIMARY_CERT.validTo, version: 2,
  },
  { id: "not-found", label: "Registration not found", regId: "BEE/RAC/9999/00000" },
];

export function scenarioByReg(reg: string): VerifyScenario | undefined {
  const norm = reg.trim().toLowerCase();
  // primary reg resolves to the active scenario by default
  const exact = VERIFY_SCENARIOS.find((s) => s.regId.toLowerCase() === norm && s.id !== "revoked" && s.id !== "ledger-down");
  return exact;
}

/* ------------------------------------------------------------------ *
 * Fabric monitoring (section 12) — network + a transaction table that
 * reuses the primary cert's tx ids for cross-screen consistency.
 * ------------------------------------------------------------------ */
export const FABRIC_NETWORK = {
  status: "Healthy" as "Healthy" | "Degraded" | "Down",
  peers: [
    { name: "peer0.bee.gov", status: "Up" }, { name: "peer1.bee.gov", status: "Up" },
    { name: "peer0.nic.gov", status: "Up" },
  ],
  orderer: "orderer.bee.gov — Up (Raft, 3 nodes)",
  lastBlock: 185742,
  successRate: 99.4,
  failed24h: 3,
  pendingQueue: 2,
  avgResponseMs: 420,
  endorsementFailures24h: 1,
  reconciliation: "In sync (portal ↔ ledger, checked 2 min ago)",
};

export interface FabricTxRow {
  correlationId: string;
  ref: string;          // application/certificate reference
  event: CertEvent | "Verification";
  version: number | "—";
  txId: string;
  status: TxStatus | "Retrying";
  block: number | "—";
  submitted: string;
  confirmed: string;
  retries: number;
  error: string;
}

export const FABRIC_TX: FabricTxRow[] = [
  { correlationId: "COR-88213", ref: PRIMARY_CERT.certId, event: "Issued", version: 1, txId: PRIMARY_CERT.versions[0].tx.txId, status: "Confirmed", block: 184320, submitted: "2026-09-20T06:41:58Z", confirmed: "2026-09-20T06:42:11Z", retries: 0, error: "—" },
  { correlationId: "COR-88540", ref: PRIMARY_CERT.certId, event: "Amended", version: 2, txId: PRIMARY_CERT.versions[1].tx.txId, status: "Confirmed", block: 185011, submitted: "2026-10-05T09:15:30Z", confirmed: "2026-10-05T09:15:44Z", retries: 0, error: "—" },
  { correlationId: "COR-88991", ref: PRIMARY_CERT.certId, event: "Revoked", version: 3, txId: PRIMARY_CERT.versions[2].tx.txId, status: "Confirmed", block: 185740, submitted: "2026-10-18T14:03:05Z", confirmed: "2026-10-18T14:03:20Z", retries: 0, error: "—" },
  { correlationId: "COR-89044", ref: "BEE/CERT/RAC/2026/10022", event: "Issued", version: 1, txId: "092a3b4c5d6e7f80912a3b4c5d6e7f8091a2b3c4d5e6f7081920a3b4c5d6e7f8", status: "Retrying", block: "—", submitted: "2026-10-19T10:20:00Z", confirmed: "—", retries: 2, error: "ENDORSEMENT_POLICY_FAILURE: peer1 unavailable" },
  { correlationId: "COR-89050", ref: "BEE/CERT/RAC/2026/10011", event: "Renewed", version: 2, txId: "2a3b4c5d6e7f80912a3b4c5d6e7f8091a2b3c4d5e6f7081920a3b4c5d6e7f809", status: "Confirmed", block: 185741, submitted: "2026-10-19T11:02:00Z", confirmed: "2026-10-19T11:02:12Z", retries: 0, error: "—" },
];

/* ------------------------------------------------------------------ *
 * Shared status configuration — single source of truth for badges.
 * ------------------------------------------------------------------ */
export const CERT_STATUS_META: Record<string, { label: string; tone: string }> = {
  DRAFT: { label: "Draft", tone: "bg-surface-container text-on-surface-variant" },
  CERTIFICATE_GENERATED: { label: "Certificate generated", tone: "bg-navy-subtle text-navy-dark" },
  HASH_CALCULATED: { label: "Hash calculated", tone: "bg-navy-subtle text-navy-dark" },
  LEDGER_SUBMITTED: { label: "Ledger submitted", tone: "bg-solar-gold-light text-solar-gold-dark" },
  RETRYING: { label: "Retrying", tone: "bg-solar-gold-light text-solar-gold-dark" },
  FAILED: { label: "Failed — retry required", tone: "bg-error-container text-on-error-container" },
  LEDGER_CONFIRMED: { label: "Anchored & confirmed", tone: "bg-success-light text-success" },
  ACTIVE: { label: "Active", tone: "bg-success-light text-success" },
  Active: { label: "Active", tone: "bg-success-light text-success" },
  Amended: { label: "Amended", tone: "bg-success-light text-success" },
  Superseded: { label: "Superseded", tone: "bg-surface-container text-on-surface-variant" },
  Suspended: { label: "Suspended", tone: "bg-solar-gold-light text-solar-gold-dark" },
  Revoked: { label: "Revoked", tone: "bg-error-container text-on-error-container" },
  Expired: { label: "Expired", tone: "bg-surface-container text-on-surface-variant" },
  Reinstated: { label: "Reinstated", tone: "bg-success-light text-success" },
  Renewed: { label: "Renewed", tone: "bg-success-light text-success" },
  "Rating changed": { label: "Rating changed", tone: "bg-solar-gold-light text-solar-gold-dark" },
};

export type IssuanceState =
  | "DRAFT" | "CERTIFICATE_GENERATED" | "HASH_CALCULATED" | "LEDGER_SUBMITTED"
  | "RETRYING" | "FAILED" | "LEDGER_CONFIRMED" | "ACTIVE";

/** Correlation id for a version, from the Fabric tx log (cross-screen consistency). */
export function correlationForVersion(v: number): string {
  return FABRIC_TX.find((t) => t.ref === PRIMARY_CERT.certId && t.version === v)?.correlationId ?? `COR-${88000 + v}`;
}
