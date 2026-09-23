"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Stars";
import { Card, Status, OK, WARN, BAD } from "@/components/app/ScreenScaffold";
import { CertificateLedgerPanel, CertificateHistoryPanel } from "@/components/app/blockchain/CertificateLedger";
import { PRIMARY_CERT } from "@/lib/mock/certificate";

/* ================================================================== *
 * Registration Record Workspace (Phase 3) — agency, brand and model
 * records open in one common workspace with every processing stage as
 * a tab, instead of a separate page per stage (DDD IA revision).
 * ================================================================== */

type RecType = "Model" | "Agency" | "Brand";

interface Doc { name: string; kind: string; status: "Verified" | "Pending" | "Rejected"; icon: string; }
interface Check { item: string; ok: boolean; }
interface TL { date: string; event: string; actor: string; icon: string; }

interface Rec {
  id: string; type: RecType; name: string; org: string; category?: string;
  stages: string[]; stageIndex: number;
  status: "In scrutiny" | "Approved" | "Pending payment" | "Active" | "Draft";
  profile: { label: string; value: string }[];
  documents: Doc[];
  scrutiny: { iame: string; bee: string; checklist: Check[] };
  approval: { note: string; director: string; secretary: string };
  ratingLabel?: { declaredIseer: string; stars: number; regId?: string };
  payment: { fee: string; status: string; ref: string };
  timeline: TL[];
}

const RECORDS: Rec[] = [
  {
    id: "APP-2026-04821", type: "Model", name: "FrostMax 1.5T", org: "Nova Cool Appliances Ltd.", category: "Room ACs",
    stages: ["Application", "Fee", "IAME scrutiny", "BEE scrutiny", "Approval", "Rating & label", "Active"], stageIndex: 3,
    status: "In scrutiny",
    profile: [
      { label: "Brand / manufacturer", value: "Nova Cool Appliances Ltd." }, { label: "Model number", value: "FM-15TC5" },
      { label: "Family / series", value: "FrostMax Series" }, { label: "Category", value: "Room ACs" },
      { label: "Declared ISEER", value: "5.10" }, { label: "Reference standard", value: "IS 1391 / ISO 5151" },
    ],
    documents: [
      { name: "Test report (CPRI).pdf", kind: "Lab report", status: "Verified", icon: "science" },
      { name: "Lab accreditation.pdf", kind: "Accreditation", status: "Verified", icon: "verified" },
      { name: "Performance data.xlsx", kind: "Performance", status: "Pending", icon: "table_chart" },
    ],
    scrutiny: {
      iame: "Recommended — parameters consistent with test report.", bee: "Under review by BEE technical cell.",
      checklist: [{ item: "Test report from NABL lab", ok: true }, { item: "ISEER within declared band", ok: true }, { item: "Family models declared", ok: true }, { item: "Performance sheet complete", ok: false }],
    },
    approval: { note: "Awaiting BEE scrutiny completion before approval note.", director: "Pending", secretary: "Pending" },
    ratingLabel: { declaredIseer: "5.10", stars: 5, regId: undefined },
    payment: { fee: "₹ 24,000", status: "Paid", ref: "PAY-2026-88120" },
    timeline: [
      { date: "01 Sep 2026", event: "Application submitted", actor: "Nova Cool Appliances", icon: "note_add" },
      { date: "02 Sep 2026", event: "Application fee paid", actor: "Applicant", icon: "payments" },
      { date: "05 Sep 2026", event: "IAME scrutiny recommended", actor: "IAME North", icon: "fact_check" },
      { date: "08 Sep 2026", event: "Moved to BEE scrutiny", actor: "Programme Officer", icon: "reviews" },
    ],
  },
  {
    id: "AGN-2026-0192", type: "Agency", name: "GreenVolt Industries", org: "GreenVolt Industries Pvt. Ltd.",
    stages: ["Registration", "Payment", "Scrutiny", "Approval", "Active"], stageIndex: 4, status: "Active",
    profile: [
      { label: "Legal name", value: "GreenVolt Industries Pvt. Ltd." }, { label: "GSTIN", value: "27ABCDE1234F1Z5" },
      { label: "Registered office", value: "Pune, Maharashtra" }, { label: "Manufacturing facility", value: "Chakan, Pune" },
      { label: "Authorised contact", value: "S. Deshpande" }, { label: "Contact email", value: "sl@greenvolt.example" },
    ],
    documents: [
      { name: "Incorporation certificate.pdf", kind: "Company", status: "Verified", icon: "corporate_fare" },
      { name: "GST registration.pdf", kind: "Tax", status: "Verified", icon: "receipt_long" },
      { name: "Factory licence.pdf", kind: "Facility", status: "Verified", icon: "factory" },
    ],
    scrutiny: {
      iame: "Not applicable for agency registration.", bee: "Documents verified; entity genuine.",
      checklist: [{ item: "Incorporation valid", ok: true }, { item: "GSTIN verified", ok: true }, { item: "Facility address confirmed", ok: true }, { item: "Authorised signatory KYC", ok: true }],
    },
    approval: { note: "Agency approved and activated on the portal.", director: "Approved", secretary: "Approved" },
    payment: { fee: "₹ 50,000", status: "Paid", ref: "PAY-2026-77012" },
    timeline: [
      { date: "10 Jun 2026", event: "Agency registration submitted", actor: "GreenVolt Industries", icon: "domain_add" },
      { date: "11 Jun 2026", event: "Registration fee paid", actor: "Applicant", icon: "payments" },
      { date: "15 Jun 2026", event: "Document scrutiny cleared", actor: "BEE cell", icon: "fact_check" },
      { date: "18 Jun 2026", event: "Agency approved & activated", actor: "Director", icon: "verified" },
    ],
  },
  {
    id: "BRD-2026-0455", type: "Brand", name: "PolarPro", org: "Nova Cool Appliances Ltd.",
    stages: ["Brand details", "Payment", "Scrutiny", "Approval", "Active"], stageIndex: 1, status: "Pending payment",
    profile: [
      { label: "Brand name", value: "PolarPro" }, { label: "Owner agency", value: "Nova Cool Appliances Ltd." },
      { label: "Trademark no.", value: "TM-4471982" }, { label: "Product lines", value: "Room ACs, Refrigerators" },
    ],
    documents: [
      { name: "Trademark certificate.pdf", kind: "IP", status: "Verified", icon: "workspace_premium" },
      { name: "Brand authorisation.pdf", kind: "Authorisation", status: "Pending", icon: "assignment" },
    ],
    scrutiny: { iame: "Not applicable.", bee: "Awaiting fee before scrutiny.", checklist: [{ item: "Trademark valid", ok: true }, { item: "Owner agency active", ok: true }, { item: "Fee received", ok: false }] },
    approval: { note: "Cannot proceed until brand fee is paid.", director: "Pending", secretary: "Pending" },
    payment: { fee: "₹ 10,000", status: "Awaiting payment", ref: "—" },
    timeline: [
      { date: "12 Sep 2026", event: "Brand details submitted", actor: "Nova Cool Appliances", icon: "sell" },
      { date: "12 Sep 2026", event: "Fee invoice generated", actor: "System", icon: "request_quote" },
    ],
  },
];

const STATUS_TONE: Record<Rec["status"], string> = {
  "In scrutiny": WARN, Approved: OK, "Pending payment": "bg-navy-subtle text-navy-dark", Active: OK, Draft: "bg-surface-container text-on-surface-variant",
};
const DOC_TONE: Record<Doc["status"], string> = { Verified: OK, Pending: WARN, Rejected: BAD };
const TYPE_ICON: Record<RecType, string> = { Model: "label", Agency: "domain", Brand: "sell" };

export default function RecordWorkspace() {
  // Reached from "Agency registrations" — default to an agency record.
  const [recId, setRecId] = useState((RECORDS.find((r) => r.type === "Agency") ?? RECORDS[0]).id);
  const [tab, setTab] = useState("overview");
  const r = RECORDS.find((x) => x.id === recId)!;

  const tabs = [
    { id: "overview", label: "Overview", icon: "summarize" },
    { id: "profile", label: "Profile", icon: "badge" },
    { id: "documents", label: "Documents", icon: "folder" },
    { id: "scrutiny", label: "Scrutiny", icon: "fact_check" },
    { id: "approval", label: "Approval", icon: "how_to_vote" },
    ...(r.type === "Model" ? [{ id: "rating", label: "Rating & label", icon: "star" }] : []),
    ...(r.type === "Model" ? [{ id: "certificate", label: "Certificate & Ledger", icon: "verified_user" }] : []),
    ...(r.type === "Model" ? [{ id: "certhistory", label: "Certificate history", icon: "manage_history" }] : []),
    { id: "payment", label: "Payment", icon: "payments" },
    { id: "history", label: "History", icon: "history" },
  ];
  const activeTab = tabs.some((tb) => tb.id === tab) ? tab : "overview";

  return (
    <div className="p-space-md lg:p-space-lg space-y-space-md">
      <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
        <Link href="/app" className="hover:text-primary">Console</Link>
        <Icon name="chevron_right" size={14} />
        <span>Registrations</span>
        <Icon name="chevron_right" size={14} />
        <span className="text-on-surface font-semibold">Record workspace</span>
      </div>

      {/* Header + record picker */}
      <div className="bg-surface-card rounded-xl shadow-sm p-space-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-start gap-space-sm">
            <span className="w-11 h-11 rounded-lg bg-forest-light text-primary flex items-center justify-center shrink-0"><Icon name={TYPE_ICON[r.type]} size={24} fill /></span>
            <div>
              <div className="flex items-center gap-space-sm flex-wrap">
                <h1 className="font-headline-md text-headline-md text-on-surface">{r.name}</h1>
                <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-semibold">{r.type}</span>
                <Status label={r.status} tone={STATUS_TONE[r.status]} />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{r.id} · {r.org}{r.category ? ` · ${r.category}` : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Record</label>
            <select value={recId} onChange={(e) => { setRecId(e.target.value); setTab("overview"); }} className="px-space-sm py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm outline-none">
              {RECORDS.map((x) => <option key={x.id} value={x.id}>{x.type}: {x.name}</option>)}
            </select>
          </div>
        </div>

        {/* Stage stepper */}
        <div className="flex items-center gap-1 overflow-x-auto app-scroll mt-space-md pt-space-md border-t border-border-subtle">
          {r.stages.map((s, i) => {
            const done = i < r.stageIndex, active = i === r.stageIndex;
            return (
              <div key={s} className="flex items-center gap-1 shrink-0">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm ${active ? "bg-primary text-on-primary font-semibold" : done ? "bg-forest-light text-forest-dark" : "bg-surface-container text-on-surface-variant"}`}>
                  <Icon name={done ? "check" : active ? "radio_button_checked" : "radio_button_unchecked"} size={14} /> {s}
                </div>
                {i < r.stages.length - 1 && <span className={`w-4 h-px ${done ? "bg-primary" : "bg-border-strong"}`} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto app-scroll border-b border-border-subtle">
        {tabs.map((tb) => {
          const active = activeTab === tb.id;
          return (
            <button key={tb.id} type="button" onClick={() => setTab(tb.id)}
              className={`flex items-center gap-1.5 px-space-sm py-2.5 font-label-md text-label-md whitespace-nowrap border-b-2 transition-colors ${active ? "border-primary text-primary font-semibold" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>
              <Icon name={tb.icon} size={16} fill={active} /> {tb.label}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
          <div className="lg:col-span-2">
            <Card title="Record overview">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-space-md">
                {r.profile.slice(0, 6).map((p) => <Field key={p.label} label={p.label} value={p.value} />)}
              </div>
            </Card>
          </div>
          <Card title="At a glance">
            <div className="space-y-space-sm">
              <Detail label="Current stage" value={r.stages[r.stageIndex]} />
              <Detail label="Documents" value={`${r.documents.filter((d) => d.status === "Verified").length}/${r.documents.length} verified`} />
              <Detail label="Payment" value={r.payment.status} />
              {r.ratingLabel && <Detail label="Projected rating" value={`${r.ratingLabel.stars}★`} />}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "profile" && (
        <Card title={`${r.type} profile`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {r.profile.map((p) => <Field key={p.label} label={p.label} value={p.value} />)}
          </div>
        </Card>
      )}

      {activeTab === "documents" && (
        <Card title="Documents & tests" action={<button className="flex items-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md py-1.5 px-space-sm rounded-lg hover:bg-forest-light"><Icon name="upload" size={16} /> Add</button>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            {r.documents.map((d) => (
              <div key={d.name} className="flex items-center gap-space-sm bg-surface-container-low rounded-lg p-space-sm">
                <span className="w-9 h-9 rounded-lg bg-forest-light text-primary flex items-center justify-center shrink-0"><Icon name={d.icon} size={18} /></span>
                <div className="min-w-0 flex-1"><div className="font-body-sm text-body-sm text-on-surface font-medium truncate">{d.name}</div><div className="font-label-sm text-label-sm text-on-surface-variant">{d.kind}</div></div>
                <Status label={d.status} tone={DOC_TONE[d.status]} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "scrutiny" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
          <Card title="Scrutiny checklist">
            <div className="space-y-1.5">
              {r.scrutiny.checklist.map((ch) => (
                <div key={ch.item} className="flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface">
                  <Icon name={ch.ok ? "check_circle" : "cancel"} size={18} className={ch.ok ? "text-tertiary" : "text-error"} /> {ch.item}
                </div>
              ))}
            </div>
          </Card>
          <Card title="Scrutiny notes">
            <div className="space-y-space-sm">
              <div><div className="font-label-sm text-label-sm text-on-surface-variant">IAME</div><p className="font-body-sm text-body-sm text-on-surface">{r.scrutiny.iame}</p></div>
              <div><div className="font-label-sm text-label-sm text-on-surface-variant">BEE</div><p className="font-body-sm text-body-sm text-on-surface">{r.scrutiny.bee}</p></div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "approval" && (
        <Card title="Approval">
          <p className="font-body-sm text-body-sm text-on-surface mb-space-md">{r.approval.note}</p>
          <div className="grid grid-cols-2 gap-space-md">
            <Detail label="Director" value={r.approval.director} />
            <Detail label="Secretary" value={r.approval.secretary} />
          </div>
          <div className="flex gap-space-sm mt-space-md">
            <button className="flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md font-semibold py-2 px-space-md rounded-lg hover:bg-forest-dark"><Icon name="check" size={16} /> Approve</button>
            <button className="flex items-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md py-2 px-space-md rounded-lg hover:bg-error-container"><Icon name="close" size={16} /> Reject</button>
            <button className="flex items-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md py-2 px-space-md rounded-lg hover:bg-solar-gold-light"><Icon name="undo" size={16} /> Return</button>
          </div>
        </Card>
      )}

      {activeTab === "rating" && r.ratingLabel && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
          <Card title="Rating calculation">
            <div className="flex items-center gap-space-md">
              <div><div className="font-label-sm text-label-sm text-on-surface-variant">Declared ISEER</div><div className="font-headline-md text-headline-md font-bold text-on-surface">{r.ratingLabel.declaredIseer}</div></div>
              <Icon name="arrow_forward" size={20} className="text-outline" />
              <div><div className="font-label-sm text-label-sm text-on-surface-variant">Computed rating</div><Stars value={r.ratingLabel.stars} /></div>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-sm">Final rating confirmed from the effective formula after BEE approval.</p>
          </Card>
          <Card title="Label & registration">
            <Detail label="Registration ID" value={r.ratingLabel.regId ?? "Issued on activation"} />
            <div className="mt-space-sm flex items-center gap-space-sm">
              <Stars value={r.ratingLabel.stars} />
              <span className="font-label-md text-label-md text-on-surface-variant">{r.ratingLabel.stars}-star label</span>
            </div>
            <button className="mt-space-md flex items-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md py-2 px-space-md rounded-lg hover:bg-forest-light"><Icon name="visibility" size={16} /> Preview label</button>
          </Card>
        </div>
      )}

      {activeTab === "certificate" && r.type === "Model" && <CertificateLedgerPanel cert={PRIMARY_CERT} />}

      {activeTab === "certhistory" && r.type === "Model" && <CertificateHistoryPanel cert={PRIMARY_CERT} />}

      {activeTab === "payment" && (
        <Card title="Payment">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            <Field label="Fee" value={r.payment.fee} />
            <Field label="Status" value={r.payment.status} />
            <Field label="Reference" value={r.payment.ref} />
          </div>
        </Card>
      )}

      {activeTab === "history" && (
        <Card title="History">
          <div className="space-y-0">
            {r.timeline.map((t, i) => (
              <div key={i} className="flex gap-space-sm">
                <div className="flex flex-col items-center">
                  <span className="w-8 h-8 rounded-full bg-surface-container text-primary flex items-center justify-center shrink-0"><Icon name={t.icon} size={16} /></span>
                  {i < r.timeline.length - 1 && <span className="w-px flex-1 bg-border-strong my-1" />}
                </div>
                <div className="pb-space-md">
                  <div className="font-label-sm text-label-sm text-on-surface-variant">{t.date}</div>
                  <div className="font-body-md text-body-md text-on-surface font-medium">{t.event}</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">{t.actor}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-label-sm text-label-sm text-on-surface-variant">{label}</div>
      <div className="font-body-md text-body-md text-on-surface font-medium">{value}</div>
    </div>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>
      <span className="font-label-md text-label-md text-on-surface font-semibold">{value}</span>
    </div>
  );
}
