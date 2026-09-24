"use client";

import { createContext, useContext, useEffect, useRef, useReducer, ReactNode } from "react";
import {
  PRIMARY_CERT, IssuanceState, CertEvent, LifecycleStatus, correlationForVersion,
} from "@/lib/mock/certificate";

/* ================================================================== *
 * Central certificate lifecycle store (prototype).
 *
 * One connected record drives issuance, monitoring, verification,
 * amendment and revocation. State persists to localStorage so the public
 * /verify page (outside the app layout) reflects the live status — e.g. a
 * revocation immediately shows as Revoked publicly. All ledger data is
 * SIMULATED.
 * ================================================================== */

const KEY = "bee-cert-state-v2";

export interface CertVersionState {
  version: number; event: CertEvent; status: LifecycleStatus; effectiveDate: string;
  hash: string; txId: string; block: number; ledgerTs: string;
  previousVersion: number | null; officer: string; reason: string;
  correlationId: string; auditRef: string; maker?: string; checker?: string;
}

export interface CertState {
  issuance: IssuanceState;
  stages: { generatedAt?: string; hashedAt?: string; submittedAt?: string; confirmedAt?: string; activatedAt?: string };
  error: { code: string; message: string; retries: number; lastAttempt: string; nextRetry: string } | null;
  versions: CertVersionState[];
  currentVersion: number;
  ledgerAvailable: boolean;
  qrBatchId: string;
  pending: { kind: "amend" | "revoke"; reason: string; maker: string; effectiveDate: string; fields: string } | null;
}

/** Build version state from a seed version, overriding status. */
function seed(idx: number, status: LifecycleStatus): CertVersionState {
  const v = PRIMARY_CERT.versions[idx];
  return {
    version: v.version, event: v.event, status, effectiveDate: v.effectiveDate,
    hash: v.hash, txId: v.tx.txId, block: v.tx.blockNumber, ledgerTs: v.tx.timestamp,
    previousVersion: v.previousVersion, officer: v.officer, reason: v.note,
    correlationId: correlationForVersion(v.version), auditRef: `AUD-CERT-${PRIMARY_CERT.certId.slice(-5)}-V${v.version}`,
  };
}

const now = () => new Date().toISOString();

export const INITIAL: CertState = {
  issuance: "ACTIVE",
  // Issuance-sequence stages align with the v1 issuance ledger commit
  // (04 Sep 2026) so the hash/submit/confirm/activate times never disagree
  // with the on-chain timestamp shown beside them.
  stages: {
    generatedAt: "2026-09-04T06:41:40Z", hashedAt: "2026-09-04T06:41:50Z",
    submittedAt: "2026-09-04T06:41:58Z", confirmedAt: "2026-09-04T06:42:11Z", activatedAt: "2026-09-04T06:42:20Z",
  },
  error: null,
  // Default seed is the full lifecycle: v1 Issued → v2 Amended → v3 Revoked.
  // Every screen shows the complete, consistent journey out of the box;
  // "Reset" then re-runs the issuance interactively for a live demo.
  versions: [seed(0, "Superseded"), seed(1, "Superseded"), seed(2, "Revoked")],
  currentVersion: 3,
  ledgerAvailable: true,
  qrBatchId: "QRB-2026-0731",
  pending: null,
};

type Action =
  | { t: "RESET" }
  | { t: "GENERATE" } | { t: "HASH" } | { t: "SUBMIT" } | { t: "CONFIRM" } | { t: "ACTIVATE"; officer: string }
  | { t: "FAIL" } | { t: "RETRY" }
  | { t: "AMEND_SUBMIT"; reason: string; maker: string; effectiveDate: string; fields: string }
  | { t: "AMEND_APPROVE"; checker: string }
  | { t: "REVOKE_SUBMIT"; reason: string; maker: string; effectiveDate: string }
  | { t: "REVOKE_APPROVE"; checker: string }
  | { t: "CANCEL_PENDING" }
  | { t: "LEDGER"; up: boolean }
  | { t: "HYDRATE"; state: CertState };

function reducer(s: CertState, a: Action): CertState {
  switch (a.t) {
    case "HYDRATE": return a.state;
    case "RESET":
      return { ...INITIAL, issuance: "DRAFT", stages: {}, versions: [], currentVersion: 0, error: null, pending: null };
    case "GENERATE": return { ...s, issuance: "CERTIFICATE_GENERATED", stages: { ...s.stages, generatedAt: now() } };
    case "HASH": return { ...s, issuance: "HASH_CALCULATED", stages: { ...s.stages, hashedAt: now() } };
    case "SUBMIT": return { ...s, issuance: "LEDGER_SUBMITTED", stages: { ...s.stages, submittedAt: now() }, error: null };
    case "CONFIRM": return { ...s, issuance: "LEDGER_CONFIRMED", stages: { ...s.stages, confirmedAt: now() }, error: null };
    case "ACTIVATE":
      return { ...s, issuance: "ACTIVE", stages: { ...s.stages, activatedAt: now() }, versions: [seed(0, "Active")], currentVersion: 1, error: null };
    case "FAIL":
      return {
        ...s, issuance: "RETRYING",
        error: { code: "ENDORSEMENT_POLICY_FAILURE", message: "peer1 unavailable", retries: 1, lastAttempt: now(), nextRetry: new Date(Date.now() + 30000).toISOString() },
      };
    case "RETRY": return { ...s, issuance: "LEDGER_SUBMITTED", error: null, stages: { ...s.stages, submittedAt: now() } };
    case "AMEND_SUBMIT":
      return { ...s, pending: { kind: "amend", reason: a.reason, maker: a.maker, effectiveDate: a.effectiveDate, fields: a.fields } };
    case "AMEND_APPROVE": {
      if (!s.pending || s.pending.kind !== "amend") return s;
      const nextV = s.currentVersion + 1;
      const superseded = s.versions.map((v) => (v.version === s.currentVersion ? { ...v, status: "Superseded" as LifecycleStatus } : v));
      const vNew: CertVersionState = { ...seed(1, "Active"), version: nextV, previousVersion: s.currentVersion, event: "Amended", effectiveDate: s.pending.effectiveDate, reason: s.pending.reason, officer: s.pending.maker, maker: s.pending.maker, checker: a.checker };
      return { ...s, versions: [...superseded, vNew], currentVersion: nextV, pending: null };
    }
    case "REVOKE_SUBMIT":
      return { ...s, pending: { kind: "revoke", reason: a.reason, maker: a.maker, effectiveDate: a.effectiveDate, fields: "Lifecycle status → Revoked" } };
    case "REVOKE_APPROVE": {
      if (!s.pending || s.pending.kind !== "revoke") return s;
      const nextV = s.currentVersion + 1;
      const prev = s.versions.map((v) => (v.version === s.currentVersion ? { ...v, status: "Superseded" as LifecycleStatus } : v));
      const vNew: CertVersionState = { ...seed(2, "Revoked"), version: nextV, previousVersion: s.currentVersion, event: "Revoked", effectiveDate: s.pending.effectiveDate, reason: s.pending.reason, officer: s.pending.maker, maker: s.pending.maker, checker: a.checker };
      return { ...s, versions: [...prev, vNew], currentVersion: nextV, pending: null };
    }
    case "CANCEL_PENDING": return { ...s, pending: null };
    case "LEDGER": return { ...s, ledgerAvailable: a.up };
    default: return s;
  }
}

interface Ctx {
  state: CertState;
  current: CertVersionState | undefined;
  publicStatus: LifecycleStatus;
  dispatch: React.Dispatch<Action>;
}
const CertContext = createContext<Ctx | null>(null);

export function CertProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const first = useRef(true);

  // hydrate once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) dispatch({ t: "HYDRATE", state: JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);
  // persist — skip the first run so the INITIAL seed never clobbers a saved state
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const current = state.versions.find((v) => v.version === state.currentVersion);
  const publicStatus: LifecycleStatus = current?.status ?? "Active";
  return <CertContext.Provider value={{ state, current, publicStatus, dispatch }}>{children}</CertContext.Provider>;
}

export function useCert() {
  const c = useContext(CertContext);
  if (!c) throw new Error("useCert must be used within CertProvider");
  return c;
}

/** Standalone reader for pages outside the app layout (e.g. public /verify). */
export function readCertState(): CertState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as CertState;
  } catch { /* ignore */ }
  return INITIAL;
}
