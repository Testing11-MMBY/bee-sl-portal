"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  SIM_LABEL_TEXT, CERT_STATUS_META, IssuanceState, maskHash, maskTx, FABRIC_META, FabricTxRow,
} from "@/lib/mock/certificate";
import { CertVersionState } from "./CertificateStore";

/* ================================================================== *
 * Reusable blockchain UI kit. Presentational — data comes via props so
 * the same components render on issuance, history, verification and
 * monitoring screens. All ledger data is SIMULATED.
 * ================================================================== */

export function BlockchainSimulationNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-start gap-space-sm bg-navy-subtle border border-navy-dark/20 rounded-xl ${compact ? "p-space-sm" : "p-space-md"}`} role="note">
      <Icon name="info" size={18} className="text-navy-dark shrink-0 mt-0.5" />
      <p className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">{SIM_LABEL_TEXT}</span> Not connected to a production blockchain network.</p>
    </div>
  );
}

export function CertificateStatusBadge({ status }: { status: string }) {
  const m = CERT_STATUS_META[status] ?? { label: status, tone: "bg-surface-container text-on-surface-variant" };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${m.tone}`}>{m.label}</span>;
}

/* --- Issuance state machine progress --- */
const STEPS: { key: IssuanceState; label: string; icon: string }[] = [
  { key: "CERTIFICATE_GENERATED", label: "Certificate generated", icon: "description" },
  { key: "HASH_CALCULATED", label: "Hash calculated", icon: "tag" },
  { key: "LEDGER_SUBMITTED", label: "Ledger submission", icon: "cloud_upload" },
  { key: "LEDGER_CONFIRMED", label: "Ledger confirmation", icon: "verified_user" },
  { key: "ACTIVE", label: "Certificate & QR active", icon: "verified" },
];
const ORDER: IssuanceState[] = ["DRAFT", "CERTIFICATE_GENERATED", "HASH_CALCULATED", "LEDGER_SUBMITTED", "LEDGER_CONFIRMED", "ACTIVE"];

export function IssuanceProgress({ state, error }: { state: IssuanceState; error?: { code: string; message: string; retries: number } | null }) {
  const idx = ORDER.indexOf(state === "RETRYING" || state === "FAILED" ? "LEDGER_SUBMITTED" : state);
  const failing = state === "RETRYING" || state === "FAILED";
  return (
    <div className="space-y-1">
      {STEPS.map((st) => {
        const sIdx = ORDER.indexOf(st.key);
        const done = sIdx < idx || (sIdx === idx && state === "ACTIVE" && st.key === "ACTIVE");
        const active = sIdx === idx && !done;
        const isSubmitErr = failing && st.key === "LEDGER_SUBMITTED";
        return (
          <div key={st.key} className={`flex items-start gap-space-sm p-space-sm rounded-lg ${active && !isSubmitErr ? "bg-primary-container/30" : isSubmitErr ? "bg-error-container/40" : ""}`}>
            <Icon name={isSubmitErr ? "error" : done ? "check_circle" : active ? st.icon : "radio_button_unchecked"} size={18}
              className={isSubmitErr ? "text-error" : done ? "text-success" : active ? "text-primary" : "text-outline"} fill={done || isSubmitErr} />
            <div className="flex-1">
              <div className={`font-label-md text-label-md ${done || active ? "text-on-surface font-semibold" : "text-on-surface-variant"}`}>{st.label}</div>
              {isSubmitErr && error && <div className="font-label-sm text-label-sm text-error">{error.code}: {error.message} · retry {error.retries}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --- Ledger proof (hash comparison + tx evidence) --- */
export function LedgerProof({
  portalHash, anchoredHash, txId, block, ledgerTs, mode = "authorised", defaultOpen = true,
}: {
  portalHash?: string; anchoredHash?: string; txId?: string; block?: number; ledgerTs?: string;
  mode?: "public" | "authorised"; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const matched = portalHash && anchoredHash ? portalHash === anchoredHash : null;
  const show = (h?: string, mask?: (x: string) => string) => (h ? (mode === "public" && mask ? mask(h) : h) : "—");
  return (
    <div className="border border-border-subtle rounded-lg overflow-hidden">
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-space-sm px-space-md py-space-sm bg-surface-container-low hover:bg-surface-container text-left">
        <Icon name="account_tree" size={18} className="text-primary" />
        <span className="flex-1 font-label-md text-label-md text-on-surface font-semibold">View ledger proof</span>
        <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">{SIM_LABEL_TEXT}</span>
        <Icon name={open ? "expand_less" : "expand_more"} size={18} className="text-on-surface-variant" />
      </button>
      {open && (
        <div className="p-space-md space-y-space-sm">
          {matched !== null && (
            <div className={`flex items-center gap-space-sm rounded-lg p-space-sm font-label-md text-label-md font-semibold ${matched ? "bg-forest-light text-forest-dark" : "bg-error-container text-on-error-container"}`}>
              <Icon name={matched ? "check_circle" : "error"} size={18} fill /> Hash comparison: {matched ? "MATCH" : "MISMATCH"}
            </div>
          )}
          <ProofRow k="Current document hash (SHA-256)" v={show(portalHash, maskHash)} />
          <ProofRow k="Anchored ledger hash" v={show(anchoredHash, maskHash)} />
          <ProofRow k="Ledger transaction ID" v={txId ? (mode === "public" ? maskTx(txId) : txId) : "—"} />
          <ProofRow k="Block number" v={block ? `#${block.toLocaleString("en-IN")}` : "—"} />
          <ProofRow k="Ledger timestamp" v={ledgerTs ? new Date(ledgerTs).toLocaleString("en-IN") : "—"} />
          {mode === "public" && <p className="font-label-sm text-label-sm text-on-surface-variant">Hash and transaction values are masked for public view. Authorised officers can view complete values.</p>}
        </div>
      )}
    </div>
  );
}
function ProofRow({ k, v }: { k: string; v: string }) {
  return <div className="flex items-start justify-between gap-space-sm"><span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">{k}</span><span className="font-mono text-label-sm text-on-surface break-all text-right">{v}</span></div>;
}

/* --- Lifecycle timeline --- */
const EVENT_ICON: Record<string, string> = {
  Issued: "add_circle", Amended: "edit", Renewed: "autorenew", "Rating changed": "star",
  Suspended: "pause_circle", Revoked: "cancel", Superseded: "layers", Reinstated: "restart_alt", Expired: "schedule",
};
export function LifecycleTimeline({ versions }: { versions: CertVersionState[] }) {
  return (
    <div className="space-y-0">
      {[...versions].reverse().map((v, i, arr) => (
        <div key={v.version} className="flex gap-space-sm">
          <div className="flex flex-col items-center">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${v.status === "Revoked" ? "bg-error-container text-error" : v.status === "Active" ? "bg-forest-light text-tertiary" : "bg-surface-container text-on-surface-variant"}`}><Icon name={EVENT_ICON[v.event] ?? "circle"} size={16} /></span>
            {i < arr.length - 1 && <span className="w-px flex-1 bg-border-strong my-1" />}
          </div>
          <div className="pb-space-md">
            <div className="flex items-center gap-space-sm"><span className="font-body-md text-body-md text-on-surface font-semibold">v{v.version} · {v.event}</span><CertificateStatusBadge status={v.status} /></div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">{v.effectiveDate} · {v.officer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* --- Clickable version history --- */
export function CertificateVersionHistory({ versions, certId }: { versions: CertVersionState[]; certId: string }) {
  const [sel, setSel] = useState<number | null>(versions.length ? versions[versions.length - 1].version : null);
  const v = versions.find((x) => x.version === sel);
  if (!versions.length) return <p className="font-body-sm text-body-sm text-on-surface-variant">No versions yet — run issuance first.</p>;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
      <div className="overflow-x-auto app-scroll">
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-border-subtle">{["Ver", "Event", "Status", "Effective", "Block", "Prev"].map((h) => <th key={h} className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide py-2 pr-space-md whitespace-nowrap">{h}</th>)}</tr></thead>
          <tbody>
            {[...versions].reverse().map((x) => (
              <tr key={x.version} onClick={() => setSel(x.version)} className={`border-b border-border-subtle/60 cursor-pointer hover:bg-surface-container-low ${x.version === sel ? "bg-primary-container/25" : ""}`}>
                <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface font-semibold">v{x.version}</td>
                <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface">{x.event}</td>
                <td className="py-2.5 pr-space-md"><CertificateStatusBadge status={x.version === Math.max(...versions.map((z) => z.version)) ? x.status : x.status} /></td>
                <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">{x.effectiveDate}</td>
                <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface-variant">#{x.block.toLocaleString("en-IN")}</td>
                <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface-variant">{x.previousVersion ? `v${x.previousVersion}` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {v && (
        <div className="bg-surface-container-low rounded-lg p-space-md space-y-1.5">
          <div className="flex items-center gap-space-sm mb-1"><span className="font-title-sm text-title-sm text-on-surface font-semibold">v{v.version} · {v.event}</span><CertificateStatusBadge status={v.status} /></div>
          <KV k="Certificate ID" v={certId} />
          <KV k="Effective date" v={v.effectiveDate} />
          <KV k="Reason" v={v.reason} />
          <KV k="Authorising officer" v={v.officer} />
          {v.checker && <KV k="Checker" v={v.checker} />}
          <KV k="Document hash" v={`${v.hash.slice(0, 14)}…${v.hash.slice(-8)}`} mono />
          <KV k="Transaction ID" v={`${v.txId.slice(0, 14)}…`} mono />
          <KV k="Block number" v={`#${v.block.toLocaleString("en-IN")}`} />
          <KV k="Previous version" v={v.previousVersion ? `v${v.previousVersion}` : "—"} />
          <KV k="Correlation ID" v={v.correlationId} />
          <KV k="Audit entry" v={v.auditRef} />
        </div>
      )}
    </div>
  );
}
function KV({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return <div className="flex items-start justify-between gap-space-sm"><span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">{k}</span><span className={`font-label-md text-label-md text-on-surface font-medium text-right ${mono ? "font-mono break-all" : ""}`}>{v}</span></div>;
}

/* --- Fabric transaction detail drawer --- */
export function FabricTransactionDrawer({ tx, onClose }: { tx: FabricTxRow | null; onClose: () => void }) {
  if (!tx) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-label="Transaction detail">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-card h-full overflow-y-auto app-scroll shadow-elevated">
        <div className="sticky top-0 bg-surface-card border-b border-border-subtle px-space-md py-space-sm flex items-center justify-between">
          <div className="flex items-center gap-space-sm"><Icon name="receipt_long" size={20} className="text-primary" /><span className="font-title-md text-title-md text-on-surface">{tx.correlationId}</span></div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-on-surface-variant hover:text-on-surface"><Icon name="close" size={22} /></button>
        </div>
        <div className="p-space-md space-y-1.5">
          <CertificateStatusBadge status={tx.status} />
          <KV k="Certificate ID" v={tx.ref} />
          <KV k="Event type" v={tx.event} />
          <KV k="Certificate version" v={tx.version === "—" ? "—" : `v${tx.version}`} />
          <KV k="Chaincode function" v={fn(tx.event)} />
          <KV k="Channel / chaincode" v={`${FABRIC_META.channel} · ${FABRIC_META.chaincode} ${FABRIC_META.chaincodeVersion}`} />
          <KV k="Submitted hash" v={`${tx.txId.slice(0, 14)}…`} mono />
          <KV k="Transaction ID" v={tx.txId} mono />
          <KV k="Endorsing peers" v="peer0.bee.gov, peer1.bee.gov, peer0.nic.gov" />
          <KV k="Endorsement result" v={tx.status === "Confirmed" ? "3/3 endorsed" : tx.status === "Retrying" ? "1/3 — policy failure" : "pending"} />
          <KV k="Validation code" v={tx.status === "Confirmed" ? "VALID (0)" : "—"} />
          <KV k="Block number" v={tx.block === "—" ? "—" : `#${tx.block.toLocaleString("en-IN")}`} />
          <KV k="Submitted time" v={fmt(tx.submitted)} />
          <KV k="Confirmed time" v={tx.confirmed === "—" ? "—" : fmt(tx.confirmed)} />
          <KV k="Retry count" v={String(tx.retries)} />
          <div><div className="font-label-sm text-label-sm text-on-surface-variant">Error details</div><div className={`font-body-sm text-body-sm ${tx.error === "—" ? "text-on-surface-variant" : "text-error"}`}>{tx.error}</div></div>
          <KV k="Related audit entry" v={`AUD-TX-${tx.correlationId.slice(-5)}`} />
        </div>
      </div>
    </div>
  );
}
function fn(e: string): string {
  return e === "Issued" ? "IssueCertificate" : e === "Amended" ? "AmendCertificate" : e === "Revoked" ? "RevokeCertificate" : e === "Renewed" ? "RenewCertificate" : "QueryCertificate";
}
function fmt(iso: string): string {
  try { return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" }); } catch { return iso; }
}

/* --- Reconciliation summary --- */
export interface ReconRow { label: string; ref: string; kind: string }
export function ReconciliationSummary({ counts, exceptions, onOpen }: {
  counts: { portal: number; confirmed: number; missing: number; mismatch: number; pending: number; failed: number; lastRun: string };
  exceptions: ReconRow[];
  onOpen?: (r: ReconRow) => void;
}) {
  return (
    <div className="space-y-space-md">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-sm">
        {[
          { l: "Portal certificates", v: counts.portal, tone: "text-on-surface" },
          { l: "Confirmed on ledger", v: counts.confirmed, tone: "text-tertiary" },
          { l: "Missing ledger", v: counts.missing, tone: "text-error" },
          { l: "Hash mismatches", v: counts.mismatch, tone: "text-error" },
          { l: "Pending", v: counts.pending, tone: "text-solar-gold-dark" },
          { l: "Failed", v: counts.failed, tone: "text-error" },
        ].map((k) => (
          <div key={k.l} className="bg-surface-container-low rounded-lg p-space-sm text-center">
            <div className={`font-headline-sm text-headline-sm font-bold ${k.tone}`}>{k.v}</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant leading-tight">{k.l}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="font-label-md text-label-md text-on-surface font-semibold mb-space-sm">Reconciliation exceptions</div>
        <div className="space-y-1.5">
          {exceptions.map((r) => (
            <div key={r.ref + r.kind} className="flex items-center gap-space-sm bg-error-container/30 rounded-lg p-space-sm">
              <Icon name="rule" size={16} className="text-error shrink-0" />
              <div className="flex-1 min-w-0"><div className="font-body-sm text-body-sm text-on-surface">{r.kind}</div><div className="font-label-sm text-label-sm text-on-surface-variant">{r.ref}</div></div>
              {onOpen && <button type="button" onClick={() => onOpen(r)} className="font-label-sm text-label-sm text-primary hover:underline shrink-0">Open</button>}
            </div>
          ))}
          {exceptions.length === 0 && <div className="flex items-center gap-space-sm text-on-surface-variant"><Icon name="check_circle" size={16} className="text-tertiary" /> <span className="font-body-sm text-body-sm">No exceptions — portal and ledger are in sync.</span></div>}
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-sm">Last reconciliation: {counts.lastRun}. Auto-fix is intentionally not available in this prototype.</p>
      </div>
    </div>
  );
}
