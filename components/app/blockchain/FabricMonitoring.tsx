"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Module, Screen } from "@/lib/screens";
import { Card, ScreenChrome, Status, OK, WARN, BAD } from "@/components/app/ScreenScaffold";
import { FABRIC_NETWORK, FABRIC_META, FABRIC_TX, FabricTxRow, SIM_LABEL_TEXT, PRIMARY_CERT } from "@/lib/mock/certificate";
import { FabricTransactionDrawer, ReconciliationSummary, ReconRow } from "./kit";

/* ================================================================== *
 * Fabric & integration monitoring (section 12) — replaces the generic
 * integration-correlation template.
 * ================================================================== */

const TX_TONE: Record<string, string> = {
  Confirmed: OK, Submitted: WARN, Retrying: WARN, Failed: BAD,
};

export function FabricMonitoring({ module, screen }: { module: Module; screen: Screen }) {
  const [status, setStatus] = useState("all");
  const [event, setEvent] = useState("all");
  const [q, setQ] = useState("");
  const [selTx, setSelTx] = useState<FabricTxRow | null>(null);

  const RECON = {
    counts: { portal: 5, confirmed: 4, missing: 1, mismatch: 1, pending: 1, failed: 0, lastRun: "2 min ago" },
    exceptions: [
      { label: "Missing ledger record", ref: "BEE/CERT/RAC/2026/10022 · v1", kind: "Portal certificate exists, but no confirmed ledger transaction" },
      { label: "Hash mismatch", ref: "BEE/CERT/RAC/2026/10077 · v1", kind: "Portal and ledger hashes differ" },
      { label: "Status lag", ref: `${PRIMARY_CERT.certId} · v2`, kind: "Ledger event exists, but portal status is not updated" },
      { label: "Premature active", ref: "BEE/CERT/RAC/2026/10041 · v2", kind: "Portal shows Active while transaction is still pending" },
    ] as ReconRow[],
  };

  const rows = FABRIC_TX.filter((r) =>
    (status === "all" || r.status === status) &&
    (event === "all" || r.event === event) &&
    (q === "" || r.ref.toLowerCase().includes(q.toLowerCase()) || r.correlationId.toLowerCase().includes(q.toLowerCase()))
  );

  const net = FABRIC_NETWORK;
  const netTone = net.status === "Healthy" ? OK : net.status === "Degraded" ? WARN : BAD;

  return (
    <ScreenChrome module={module} screen={screen} subtitle="Hyperledger Fabric & integration monitoring">
      <div className="flex items-start gap-space-sm bg-navy-subtle border border-navy-dark/20 rounded-xl p-space-sm">
        <Icon name="info" size={18} className="text-navy-dark shrink-0 mt-0.5" />
        <p className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">{SIM_LABEL_TEXT}</span> Metrics below are simulated for the prototype.</p>
      </div>

      {/* Network + KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
        <KPI label="Fabric network" value={net.status} icon="lan" tone={net.status === "Healthy" ? "text-tertiary" : "text-error"} chip={<Status label={net.status} tone={netTone} />} />
        <KPI label="Tx success rate" value={`${net.successRate}%`} icon="check_circle" tone="text-tertiary" />
        <KPI label="Failed (24h)" value={String(net.failed24h)} icon="error" tone="text-error" />
        <KPI label="Pending anchoring" value={String(net.pendingQueue)} icon="hourglass_top" tone="text-solar-gold-dark" />
        <KPI label="Avg ledger response" value={`${net.avgResponseMs} ms`} icon="speed" tone="text-primary" />
        <KPI label="Endorsement failures" value={String(net.endorsementFailures24h)} icon="report" tone="text-solar-gold-dark" />
        <KPI label="Last committed block" value={`#${net.lastBlock.toLocaleString("en-IN")}`} icon="deployed_code" tone="text-on-surface" />
        <KPI label="Retry queue" value={String(FABRIC_TX.filter((r) => r.status === "Retrying").length)} icon="refresh" tone="text-solar-gold-dark" />
      </div>

      {/* Network detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
        <Card title="Network">
          <div className="space-y-space-sm">
            <Row label="Channel" value={FABRIC_META.channel} />
            <Row label="Chaincode" value={`${FABRIC_META.chaincode} ${FABRIC_META.chaincodeVersion}`} />
            <Row label="Ordering service" value={net.orderer} />
            <Row label="Reconciliation" value={net.reconciliation} />
          </div>
          <div className="mt-space-sm pt-space-sm border-t border-border-subtle">
            <div className="font-label-sm text-label-sm text-on-surface-variant mb-1.5">Peers</div>
            <div className="flex flex-wrap gap-1.5">
              {net.peers.map((p) => (
                <span key={p.name} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest-light text-forest-dark font-label-sm text-label-sm"><Icon name="circle" size={8} className="text-tertiary" /> {p.name}</span>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Portal ↔ ledger reconciliation">
          <div className="flex items-center gap-space-sm bg-forest-light text-forest-dark rounded-lg p-space-sm">
            <Icon name="sync" size={20} /> <span className="font-body-sm text-body-sm font-medium">{net.reconciliation}</span>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-sm">Every certificate event in the portal is expected to have a matching confirmed ledger transaction. Mismatches are surfaced in the failed / retrying rows below.</p>
        </Card>
      </div>

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
              {rows.length === 0 && (
                <tr><td colSpan={11} className="py-space-md text-center font-body-sm text-body-sm text-on-surface-variant">No transactions match the filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-sm">Click a transaction row for full endorsement, block and audit detail.</p>
      </Card>

      <Card title="Portal ↔ ledger reconciliation">
        <ReconciliationSummary counts={RECON.counts} exceptions={RECON.exceptions} onOpen={() => { /* opens affected cert/tx in a real system */ }} />
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
      <div className="flex items-center gap-space-sm mt-1">
        <div className={`font-headline-sm text-headline-sm font-bold ${tone}`}>{value}</div>
        {chip}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-space-sm">
      <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">{label}</span>
      <span className="font-label-md text-label-md text-on-surface font-medium text-right">{value}</span>
    </div>
  );
}
