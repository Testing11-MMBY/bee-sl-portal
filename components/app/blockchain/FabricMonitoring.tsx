"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Module, Screen } from "@/lib/screens";
import { Card, ScreenChrome, Status, OK, WARN, BAD } from "@/components/app/ScreenScaffold";
import {
  FABRIC_NETWORK, FABRIC_META, FABRIC_TX, FabricTxRow, SIM_LABEL_TEXT,
  RECON_EXCEPTIONS, ReconException, fabricHealth,
} from "@/lib/mock/certificate";
import { FabricTransactionDrawer } from "./kit";

/* ================================================================== *
 * Fabric & integration monitoring — the health summary and the
 * reconciliation counts are COMPUTED from the same tx + exception
 * fixture as the tables, so the screen can never say "in sync" while
 * exceptions exist.
 * ================================================================== */

const TX_TONE: Record<string, string> = { Confirmed: OK, Submitted: WARN, Retrying: WARN, Failed: BAD };
const HEALTH_TONE: Record<string, string> = { Healthy: OK, Degraded: WARN, Unavailable: BAD };

export function FabricMonitoring({ module, screen }: { module: Module; screen: Screen }) {
  const [status, setStatus] = useState("all");
  const [event, setEvent] = useState("all");
  const [q, setQ] = useState("");
  const [selTx, setSelTx] = useState<FabricTxRow | null>(null);

  const H = fabricHealth();
  const rows = FABRIC_TX.filter((r) =>
    (status === "all" || r.status === status) &&
    (event === "all" || r.event === event) &&
    (q === "" || r.ref.toLowerCase().includes(q.toLowerCase()) || r.correlationId.toLowerCase().includes(q.toLowerCase()))
  );
  function openException(x: ReconException) {
    const tx = FABRIC_TX.find((t) => t.correlationId === x.correlationId);
    if (tx) setSelTx(tx);
  }

  return (
    <ScreenChrome module={module} screen={screen} subtitle="Hyperledger Fabric & integration monitoring">
      <div className="flex items-start gap-space-sm bg-navy-subtle border border-navy-dark/20 rounded-xl p-space-sm">
        <Icon name="info" size={18} className="text-navy-dark shrink-0 mt-0.5" />
        <p className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">{SIM_LABEL_TEXT}</span> The health summary is derived from the transaction and exception fixture below.</p>
      </div>

      {/* Health banner (computed) */}
      <div className={`rounded-xl p-space-md flex flex-col md:flex-row md:items-center gap-space-sm ${H.status === "Healthy" ? "bg-success-light" : H.status === "Degraded" ? "bg-solar-gold-light" : "bg-error-container"}`}>
        <div className="flex items-center gap-space-sm">
          <Icon name={H.status === "Healthy" ? "check_circle" : H.status === "Degraded" ? "warning" : "cloud_off"} size={24} className={H.status === "Healthy" ? "text-success" : H.status === "Degraded" ? "text-solar-gold-dark" : "text-error"} fill />
          <div>
            <div className="font-title-md text-title-md text-on-surface font-semibold">Network {H.status}</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">
              {H.status === "Degraded" ? `${H.exceptions} reconciliation exception(s), ${H.retrying} retrying, ${H.mismatch} hash mismatch, ${H.pending} pending — not fully in sync.` : H.status === "Healthy" ? "All transactions confirmed; portal and ledger reconcile." : "No confirmed transactions — ledger unreachable."}
            </div>
          </div>
        </div>
        <div className="md:ml-auto font-label-sm text-label-sm text-on-surface-variant">
          <span className="font-semibold text-on-surface">States:</span> Healthy = all confirmed &amp; peers up · Degraded = any failure/retry/pending/mismatch/peer down · Unavailable = no confirmations
        </div>
      </div>

      {/* KPIs — all computed */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
        <KPI label="Fabric network" value={H.status} icon="lan" tone={H.status === "Healthy" ? "text-success" : H.status === "Degraded" ? "text-solar-gold-dark" : "text-error"} chip={<Status label={H.status} tone={HEALTH_TONE[H.status]} />} />
        <KPI label="Tx success rate" value={`${H.successRate}%`} icon="check_circle" tone={H.successRate >= 99 ? "text-success" : "text-solar-gold-dark"} />
        <KPI label="Retrying / failed" value={`${H.retrying} / ${H.failed}`} icon="error" tone={H.retrying + H.failed ? "text-error" : "text-success"} />
        <KPI label="Hash mismatches" value={String(H.mismatch)} icon="report" tone={H.mismatch ? "text-error" : "text-success"} />
        <KPI label="Awaiting anchor" value={String(H.awaitingAnchor)} icon="hourglass_top" tone={H.awaitingAnchor ? "text-solar-gold-dark" : "text-success"} chip={<span className="font-label-sm text-label-sm text-on-surface-variant">retry {H.retrying} · pending {H.pending} · missing {H.missing}</span>} />
        <KPI label="Avg ledger response" value={`${FABRIC_NETWORK.avgResponseMs} ms`} icon="speed" tone="text-primary" />
        <KPI label="Last committed block" value={`#${FABRIC_NETWORK.lastBlock.toLocaleString("en-IN")}`} icon="deployed_code" tone="text-on-surface" />
      </div>

      {/* Network detail */}
      <Card title="Network">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <Row label="Channel" value={FABRIC_META.channel} />
          <Row label="Chaincode" value={`${FABRIC_META.chaincode} ${FABRIC_META.chaincodeVersion}`} />
          <Row label="Ordering service" value={FABRIC_NETWORK.orderer} />
          <Row label="Peers" value={`${FABRIC_NETWORK.peers.filter((p) => p.status === "Up").length}/${FABRIC_NETWORK.peers.length} up`} />
        </div>
        <div className="mt-space-sm pt-space-sm border-t border-border-subtle flex flex-wrap gap-1.5">
          {FABRIC_NETWORK.peers.map((p) => {
            const up = p.status === "Up";
            return <span key={p.name} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm ${up ? "bg-success-light text-success" : "bg-solar-gold-light text-solar-gold-dark"}`}><Icon name="circle" size={8} /> {p.name} · {p.status}</span>;
          })}
        </div>
      </Card>

      {/* Transaction table + filters */}
      <Card title="Ledger transactions">
        <div className="flex flex-wrap items-center gap-space-sm mb-space-sm">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-outline"><Icon name="search" size={16} /></div>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by reference / correlation" aria-label="Filter transactions" className="pl-8 pr-3 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm outline-none" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status filter" className="px-space-sm py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm outline-none">
            {["all", "Confirmed", "Submitted", "Retrying", "Failed"].map((s) => <option key={s} value={s}>{s === "all" ? "All statuses" : s}</option>)}
          </select>
          <select value={event} onChange={(e) => setEvent(e.target.value)} aria-label="Event filter" className="px-space-sm py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm outline-none">
            {["all", "Issued", "Amended", "Renewed", "Revoked"].map((s) => <option key={s} value={s}>{s === "all" ? "All events" : s}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto app-scroll">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle">
                {["Correlation", "Reference", "Event", "Ver", "Tx ID", "Status", "Block", "Submitted", "Confirmed", "Retry", "Error"].map((h) => (
                  <th key={h} className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide py-2 pr-space-md whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r: FabricTxRow) => (
                <tr key={r.correlationId} onClick={() => setSelTx(r)} className="border-b border-border-subtle/60 hover:bg-surface-container-low cursor-pointer">
                  <td className="py-2 pr-space-md font-mono text-label-sm text-primary whitespace-nowrap underline decoration-dotted">{r.correlationId}</td>
                  <td className="py-2 pr-space-md font-body-sm text-body-sm text-on-surface whitespace-nowrap">{r.ref}</td>
                  <td className="py-2 pr-space-md font-body-sm text-body-sm text-on-surface">{r.event}</td>
                  <td className="py-2 pr-space-md font-body-sm text-body-sm text-on-surface-variant">{r.version === "—" ? "—" : `v${r.version}`}</td>
                  <td className="py-2 pr-space-md font-mono text-label-sm text-on-surface-variant whitespace-nowrap">{r.txId.slice(0, 10)}…</td>
                  <td className="py-2 pr-space-md"><Status label={r.status} tone={TX_TONE[r.status]} /></td>
                  <td className="py-2 pr-space-md font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">{r.block === "—" ? "—" : `#${r.block.toLocaleString("en-IN")}`}</td>
                  <td className="py-2 pr-space-md font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">{fmt(r.submitted)}</td>
                  <td className="py-2 pr-space-md font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">{r.confirmed === "—" ? "—" : fmt(r.confirmed)}</td>
                  <td className="py-2 pr-space-md font-body-sm text-body-sm text-on-surface-variant text-center">{r.retries}</td>
                  <td className="py-2 pr-space-md font-label-sm text-label-sm text-error max-w-[200px] truncate" title={r.error}>{r.error === "—" ? "—" : r.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-sm">Click a transaction row for full endorsement, block and audit detail.</p>
      </Card>

      {/* Reconciliation — counts computed from the same exception fixture */}
      <Card title="Portal ↔ ledger reconciliation" action={<Status label={H.exceptions ? `${H.exceptions} exceptions` : "In sync"} tone={H.exceptions ? WARN : OK} />}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-sm mb-space-xs">
          {[
            { l: "Confirmed on ledger", v: H.confirmed, tone: "text-success" },
            { l: "Retrying", v: H.retrying, tone: "text-solar-gold-dark" },
            { l: "Submitted (pending)", v: H.pending, tone: "text-solar-gold-dark" },
            { l: "Missing tx", v: H.missing, tone: H.missing ? "text-error" : "text-on-surface-variant" },
            { l: "Hash mismatch", v: H.mismatch, tone: H.mismatch ? "text-error" : "text-on-surface-variant" },
            { l: "Total exceptions", v: H.exceptions, tone: "text-error" },
          ].map((k) => (
            <div key={k.l} className="bg-surface-container-low rounded-lg p-space-sm text-center">
              <div className={`font-headline-sm text-headline-sm font-bold ${k.tone}`}>{k.v}</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant leading-tight">{k.l}</div>
            </div>
          ))}
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant mb-space-md flex items-center gap-1">
          <Icon name="functions" size={13} /> Awaiting anchor = retrying ({H.retrying}) + submitted-pending ({H.pending}) + missing ({H.missing}) = <span className="font-semibold text-on-surface">{H.awaitingAnchor}</span>. Each record is counted once. Hash mismatches are anchored but under review, not awaiting anchor.
        </p>
        <div className="overflow-x-auto app-scroll">
          <table className="w-full text-left border-collapse">
            <thead><tr className="border-b border-border-subtle">{["Certificate", "Portal status", "Ledger status", "Cause", "Owner", "Next step", ""].map((h) => <th key={h} className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide py-2 pr-space-md whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {RECON_EXCEPTIONS.map((x) => (
                <tr key={x.id} className="border-b border-border-subtle/60">
                  <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface whitespace-nowrap">{x.certId} · v{x.version}</td>
                  <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface">{x.portalStatus}</td>
                  <td className="py-2.5 pr-space-md"><Status label={x.ledgerStatus} tone={BAD} /></td>
                  <td className="py-2.5 pr-space-md font-label-sm text-label-sm text-on-surface-variant max-w-[220px]">{x.cause}</td>
                  <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">{x.owner}</td>
                  <td className="py-2.5 pr-space-md font-label-sm text-label-sm text-on-surface-variant max-w-[220px]">{x.nextStep}</td>
                  <td className="py-2.5 pr-space-md"><button type="button" onClick={() => openException(x)} className="font-label-sm text-label-sm text-primary hover:underline whitespace-nowrap">Open evidence</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-sm">Opening an exception shows its matching ledger transaction. No destructive auto-fix in this prototype.</p>
      </Card>

      <FabricTransactionDrawer tx={selTx} onClose={() => setSelTx(null)} />
    </ScreenChrome>
  );
}

function fmt(iso: string): string {
  try { return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); }
  catch { return iso; }
}
function KPI({ label, value, icon, tone, chip }: { label: string; value: string; icon: string; tone: string; chip?: React.ReactNode }) {
  return (
    <div className="bg-surface-card rounded-xl shadow-sm p-space-md">
      <div className="flex items-center justify-between"><span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span><Icon name={icon} size={18} className={tone} /></div>
      <div className="flex items-center gap-space-sm mt-1"><div className={`font-headline-sm text-headline-sm font-bold ${tone}`}>{value}</div>{chip}</div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-space-sm"><span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">{label}</span><span className="font-label-md text-label-md text-on-surface font-medium text-right">{value}</span></div>;
}
