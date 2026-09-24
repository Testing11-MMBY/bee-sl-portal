"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Stars";
import { PseudoQR } from "@/components/ui/PseudoQR";
import { ScreenChrome, Card } from "@/components/app/ScreenScaffold";
import { Module, Screen } from "@/lib/screens";
import { CertificateWorkspace } from "@/components/app/blockchain/CertificateWorkspace";
import { CertificateStatusBadge, BlockchainSimulationNotice } from "@/components/app/blockchain/kit";
import { useCert } from "@/components/app/blockchain/CertificateStore";
import { PRIMARY_CERT } from "@/lib/mock/certificate";

/**
 * Labels & Certificates — one record across four tabs. The selected
 * application/model identity (Nova Cool · FrostMax · APP-2026-05016) is fixed
 * for every tab, so the label, certificate, ledger, version history and
 * lifecycle actions all describe the SAME record.
 */
const TABS = [
  { id: "label", label: "Label & QR", icon: "qr_code_2" },
  { id: "cert", label: "Certificate & Ledger", icon: "verified_user" },
  { id: "history", label: "Version history", icon: "manage_history" },
  { id: "actions", label: "Lifecycle actions", icon: "gavel" },
] as const;

export function LabelPreviewScreen({ module, screen }: { module: Module; screen: Screen }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("label");
  const { state, current } = useCert();
  const c = PRIMARY_CERT;

  return (
    <ScreenChrome module={module} screen={screen} subtitle="One record · label, certificate, ledger, QR and public status">
      {/* Fixed record header — identity never changes across tabs */}
      <div className="bg-surface-card rounded-xl shadow-sm p-space-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
          <div className="flex items-start gap-space-sm">
            <span className="w-11 h-11 rounded-lg bg-forest-light text-primary flex items-center justify-center shrink-0"><Icon name="label" size={24} fill /></span>
            <div>
              <div className="flex items-center gap-space-sm flex-wrap">
                <h1 className="font-headline-md text-headline-md text-on-surface">{c.model}</h1>
                <CertificateStatusBadge status={current?.status ?? "Active"} />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{c.manufacturer} · {c.category} · {c.stars}★</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">App {c.appId} · Reg {c.regId} · Cert {c.certId} · v{current?.version ?? c.currentVersion}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border-subtle overflow-x-auto app-scroll">
        {TABS.map((tb) => (
          <button key={tb.id} type="button" onClick={() => setTab(tb.id)} className={`flex items-center gap-1.5 px-space-sm py-2.5 font-label-md text-label-md whitespace-nowrap border-b-2 transition-colors ${tab === tb.id ? "border-primary text-primary font-semibold" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>
            <Icon name={tb.icon} size={16} fill={tab === tb.id} /> {tb.label}
          </button>
        ))}
      </div>

      <div className="mt-space-md">
        {tab === "label" && <LabelAndQR active={state.issuance === "ACTIVE"} qrBatch={state.qrBatchId} />}
        {tab === "cert" && <CertificateWorkspace view="ledger" />}
        {tab === "history" && <CertificateWorkspace view="history" />}
        {tab === "actions" && <CertificateWorkspace view="actions" />}
      </div>
    </ScreenChrome>
  );
}

function LabelAndQR({ active, qrBatch }: { active: boolean; qrBatch: string }) {
  const c = PRIMARY_CERT;
  const { current } = useCert();
  const v = current?.version ?? c.currentVersion;
  const revoked = current?.status === "Revoked";
  return (
    <div className="space-y-space-md">
      <BlockchainSimulationNotice />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
        <Card title="Bilingual star label">
          <div className="flex flex-col sm:flex-row items-center gap-space-lg">
            <div className="w-56 shrink-0 rounded-lg overflow-hidden border border-border-strong">
              <div className="bg-primary text-on-primary text-center py-1 font-label-sm text-label-sm font-bold tracking-wide">BEE STAR LABEL · ऊर्जा दक्षता</div>
              <div className="bg-surface-card p-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">ENERGY · ऊर्जा</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{c.iseer.toFixed(2)} ISEER</span>
                </div>
                <div className="flex justify-center my-2"><Stars value={c.stars} size={22} /></div>
                <div className="text-center font-label-sm text-label-sm text-on-surface-variant">{c.manufacturer}</div>
                <div className="text-center font-body-sm text-body-sm font-semibold text-on-surface">{c.model}</div>
                <div className="mt-space-sm flex items-center justify-between">
                  <div className="p-0.5 bg-white rounded"><PseudoQR value={c.regId} size={40} /></div>
                  <div className="text-right font-label-sm text-label-sm text-on-surface-variant">
                    <div>Valid till {c.validTo}</div>
                    <div className="font-mono">{c.regId}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-space-sm">
              <KV k="Registration ID" v={c.regId} />
              <KV k="QR batch" v={active ? qrBatch : "allocated on activation"} />
              <KV k="Label version" v={`v${v}`} />
              <div className="flex items-center gap-space-sm font-body-sm text-body-sm">
                <Icon name={active && !revoked ? "check_circle" : "lock"} size={18} className={active && !revoked ? "text-success" : "text-solar-gold-dark"} fill={active && !revoked} />
                {revoked ? "Label revoked — QR no longer valid" : active ? "Label & QR active (anchored on the ledger)" : "QR & certificate activate only after ledger confirmation"}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Label artefact & hash">
          <div className="space-y-space-sm">
            <KV k="Artefact" v={`BEE_CERT_RAC_2026_10016_v${v}.pdf`} mono />
            <KV k="Certificate ID" v={c.certId} mono />
            <div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">SHA-256 of label artefact</div>
              <div className="font-mono text-label-sm break-all text-on-surface bg-surface-container-low rounded p-space-sm mt-1">{current?.hash ?? c.versions[c.currentVersion - 1].hash}</div>
            </div>
            <Link href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary hover:underline">
              <Icon name="account_tree" size={14} /> This hash is anchored on the ledger — see the Certificate &amp; Ledger tab
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

function KV({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return <div className="flex items-start justify-between gap-space-sm"><span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">{k}</span><span className={`font-label-md text-label-md text-on-surface font-medium text-right ${mono ? "font-mono break-all" : ""}`}>{v}</span></div>;
}
