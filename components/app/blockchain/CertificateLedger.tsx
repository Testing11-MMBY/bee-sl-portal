"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Card, Status, OK, WARN, BAD } from "@/components/app/ScreenScaffold";
import {
  Certificate, certCurrent, shortHash, SIM_LABEL_TEXT, FABRIC_META,
  LifecycleStatus,
} from "@/lib/mock/certificate";

/* ================================================================== *
 * Certificate & Ledger panel + history (Phase: blockchain).
 * Lives inside the model/label record workspace. All ledger data is
 * SIMULATED for the prototype.
 * ================================================================== */

const STATUS_TONE: Record<LifecycleStatus, string> = {
  Active: OK, Superseded: "bg-surface-container text-on-surface-variant",
  Suspended: WARN, Revoked: BAD, Expired: "bg-surface-container text-on-surface-variant", Reinstated: OK,
};

/* Issuance sequence (section 8) — statuses the prototype walks through. */
const ISSUANCE = [
  { key: "generated", label: "Certificate generated", icon: "description", detail: "Bilingual PDF certificate + label composed." },
  { key: "hashed", label: "Hash calculated", icon: "tag", detail: "SHA-256 computed over the final certificate bytes." },
  { key: "submitted", label: "Ledger submission pending", icon: "cloud_upload", detail: "Metadata + hash submitted to Hyperledger Fabric." },
  { key: "confirming", label: "Ledger confirmation pending", icon: "hourglass_top", detail: "Awaiting endorsement + ordering." },
  { key: "active", label: "Anchored & active", icon: "verified", detail: "Confirmed on-ledger — certificate & QR go Active." },
];

export function CertificateLedgerPanel({ cert }: { cert: Certificate }) {
  const cur = certCurrent(cert);
  const [phase, setPhase] = useState(5);  // demo cert starts already anchored
  const [failed, setFailed] = useState(false);
  const [simFail, setSimFail] = useState(false);

  const anchored = phase >= 5 && !failed;

  function next() {
    if (failed) return;
    setPhase((p) => {
      const np = Math.min(5, p + 1);
      // simulate a failure at the confirmation step when toggled
      if (np === 4 && simFail) { setFailed(true); return 3; }
      return np;
    });
  }
  function retry() { setFailed(false); setPhase(4); }
  function reset() { setFailed(false); setPhase(0); }

  return (
    <div className="space-y-space-md">
      <div className="flex items-start gap-space-sm bg-navy-subtle border border-navy-dark/20 rounded-xl p-space-sm">
        <Icon name="info" size={18} className="text-navy-dark shrink-0 mt-0.5" />
        <p className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">{SIM_LABEL_TEXT}</span> This is not connected to a production blockchain network.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
        {/* Certificate identity */}
        <Card title="Certificate" action={<Status label={anchored ? cur.status : "Draft"} tone={anchored ? STATUS_TONE[cur.status] : "bg-surface-container text-on-surface-variant"} />}>
          <div className="space-y-space-sm">
            <Row label="Certificate ID" value={cert.certId} mono />
            <Row label="Version" value={`v${cur.version} · ${cur.event}`} />
            <Row label="Registration (QR)" value={cert.regId} mono />
            <Row label="Valid" value={`${cert.validFrom} → ${cert.validTo}`} />
            <div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">SHA-256 hash</div>
              <div className="font-mono text-label-sm break-all text-on-surface bg-surface-container-low rounded p-space-sm mt-1">{phase >= 2 ? cur.hash : "— not yet calculated —"}</div>
            </div>
          </div>
        </Card>

        {/* Issuance sequence */}
        <Card title="Issuance sequence" action={
          <label className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant cursor-pointer">
            <input type="checkbox" checked={simFail} onChange={(e) => setSimFail(e.target.checked)} className="accent-primary" /> Simulate ledger failure
          </label>
        }>
          <div className="space-y-1">
            {ISSUANCE.map((st, i) => {
              const done = !failed && phase > i;
              const active = !failed && phase === i;
              const isFailStep = failed && i === 3;
              return (
                <div key={st.key} className={`flex items-start gap-space-sm p-space-sm rounded-lg ${active ? "bg-primary-container/30" : isFailStep ? "bg-error-container/40" : ""}`}>
                  <Icon name={isFailStep ? "error" : done ? "check_circle" : active ? st.icon : "radio_button_unchecked"} size={18}
                    className={isFailStep ? "text-error" : done ? "text-success" : active ? "text-primary" : "text-outline"} fill={done || isFailStep} />
                  <div className="flex-1">
                    <div className={`font-label-md text-label-md ${done || active ? "text-on-surface font-semibold" : "text-on-surface-variant"}`}>{st.label}</div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">{isFailStep ? "Failed — retry required (endorsement policy failure)." : st.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-space-sm mt-space-md">
            {failed ? (
              <button type="button" onClick={retry} className="flex items-center gap-1.5 bg-error-container text-on-error-container font-label-md text-label-md font-semibold py-2 px-space-md rounded-lg hover:bg-error hover:text-on-error"><Icon name="refresh" size={16} /> Retry submission</button>
            ) : phase < 5 ? (
              <button type="button" onClick={next} className="flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md font-semibold py-2 px-space-md rounded-lg hover:bg-forest-dark"><Icon name="play_arrow" size={16} /> Run next step</button>
            ) : (
              <span className="flex items-center gap-1.5 font-label-md text-label-md text-success font-semibold"><Icon name="verified" size={18} fill /> Anchored & active</span>
            )}
            <button type="button" onClick={reset} className="flex items-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md py-2 px-space-md rounded-lg hover:bg-forest-light"><Icon name="restart_alt" size={16} /> Reset demo</button>
          </div>
        </Card>
      </div>

      {/* Ledger anchor + on/off-ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
        <Card title="Ledger anchor">
          {anchored ? (
            <div className="space-y-space-sm">
              <div className="flex items-center gap-space-sm"><Status label="Confirmed" tone={OK} /><span className="font-label-sm text-label-sm text-on-surface-variant">{FABRIC_META.network} · {FABRIC_META.channel}</span></div>
              <Row label="Transaction ID" value={cur.tx.txId} mono />
              <Row label="Block number" value={`#${cur.tx.blockNumber.toLocaleString("en-IN")}`} />
              <Row label="Ledger timestamp" value={new Date(cur.tx.timestamp).toLocaleString("en-IN")} />
              <Row label="Chaincode" value={`${FABRIC_META.chaincode} ${FABRIC_META.chaincodeVersion}`} />
            </div>
          ) : (
            <div className="flex items-center gap-space-sm text-on-surface-variant"><Icon name="hourglass_empty" size={18} /> <span className="font-body-sm text-body-sm">Anchor details appear once the transaction is confirmed.</span></div>
          )}
        </Card>

        <Card title="What is stored on the ledger">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            <div>
              <div className="font-label-sm text-label-sm text-success font-semibold mb-1 flex items-center gap-1"><Icon name="check" size={14} /> On-ledger (minimal)</div>
              <ul className="space-y-0.5 font-label-sm text-label-sm text-on-surface-variant">
                {["Certificate / permission ID", "Certificate version", "SHA-256 hash", "Issuer", "Issue timestamp", "Lifecycle status", "Previous-version reference", "Transaction metadata"].map((x) => <li key={x} className="flex gap-1"><Icon name="lens" size={7} className="mt-1.5 text-success" />{x}</li>)}
              </ul>
            </div>
            <div>
              <div className="font-label-sm text-label-sm text-error font-semibold mb-1 flex items-center gap-1"><Icon name="block" size={14} /> Never on-ledger</div>
              <ul className="space-y-0.5 font-label-sm text-label-sm text-on-surface-variant">
                {["Certificate PDF", "Personal data", "Test reports", "Commercially sensitive data"].map((x) => <li key={x} className="flex gap-1"><Icon name="lens" size={7} className="mt-1.5 text-error" />{x}</li>)}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---- Certificate history (section 10) ---- */
const EVENT_ICON: Record<string, string> = {
  Issued: "add_circle", Amended: "edit", Renewed: "autorenew", "Rating changed": "star",
  Suspended: "pause_circle", Revoked: "cancel", Superseded: "layers", Reinstated: "restart_alt", Expired: "schedule",
};

export function CertificateHistoryPanel({ cert }: { cert: Certificate }) {
  return (
    <Card title="Certificate history" action={<span className="font-label-sm text-label-sm text-on-surface-variant">No earlier ledger record is overwritten — each action is a new version.</span>}>
      <div className="overflow-x-auto app-scroll">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle">
              {["Ver", "Event", "Effective", "Status", "Hash", "Tx ID", "Prev", "Officer"].map((h) => (
                <th key={h} className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide py-2 pr-space-md whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...cert.versions].reverse().map((v) => (
              <tr key={v.version} className="border-b border-border-subtle/60">
                <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface font-semibold">v{v.version}</td>
                <td className="py-2.5 pr-space-md"><span className="inline-flex items-center gap-1 font-body-sm text-body-sm text-on-surface"><Icon name={EVENT_ICON[v.event] ?? "circle"} size={14} className="text-primary" /> {v.event}</span></td>
                <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">{v.effectiveDate}</td>
                <td className="py-2.5 pr-space-md"><Status label={v.status} tone={STATUS_TONE[v.status]} /></td>
                <td className="py-2.5 pr-space-md font-mono text-label-sm text-on-surface-variant whitespace-nowrap">{shortHash(v.hash)}</td>
                <td className="py-2.5 pr-space-md font-mono text-label-sm text-on-surface-variant whitespace-nowrap">{v.tx.txId.slice(0, 10)}…</td>
                <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface-variant">{v.previousVersion ? `v${v.previousVersion}` : "—"}</td>
                <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">{v.officer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-space-sm">
      <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">{label}</span>
      <span className={`font-label-md text-label-md text-on-surface font-semibold text-right ${mono ? "font-mono break-all" : ""}`}>{value}</span>
    </div>
  );
}
