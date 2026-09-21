"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Card, Status, OK, WARN, BAD } from "@/components/app/ScreenScaffold";

/* ================================================================== *
 * Enforcement Case Workspace (Phase 3) — a single case-centric screen
 * that consolidates the 14 enforcement stage-screens into tabs, per the
 * DDD IA revision. One case, one URL, ten tabs.
 * ================================================================== */

interface Param { name: string; declared: string; measured: string; pass: boolean; }
interface Custody { seq: number; from: string; to: string; date: string; condition: string; }
interface TL { date: string; event: string; actor: string; icon: string; }

interface EnfCase {
  id: string;
  manufacturer: string; model: string; category: string;
  opened: string; officer: string; stage: string;
  status: "Testing" | "Show-cause" | "Penalty" | "Closed";
  riskSource: string;
  assignment: { iame: string; sda: string; lab: string; assignedOn: string };
  sample: { id: string; source: string; quantity: number; seal: string; collectedOn: string; place: string };
  custody: Custody[];
  lab: { ref: string; testedOn: string; verdict: "Pass" | "Fail"; params: Param[] };
  challenge: { requested: boolean; lab?: string; result?: string; note: string };
  notices: { showCauseOn?: string; deadline?: string; response?: string; responseOn?: string };
  penalty: { proposed: string; amount: string; status: string };
  evidence: { name: string; kind: string; icon: string }[];
  timeline: TL[];
}

const CASES: EnfCase[] = [
  {
    id: "ENF-2026-0417",
    manufacturer: "Nova Cool Appliances Ltd.", model: "FrostMax 1.5T (5★)", category: "Room ACs",
    opened: "02 Aug 2026", officer: "R. Menon (SDA)", stage: "Show-cause issued", status: "Show-cause",
    riskSource: "AI risk score 82 (High) + market complaint",
    assignment: { iame: "IAME North — A. Kapoor", sda: "SDA Maharashtra — R. Menon", lab: "NABL-DEL-002 (CPRI)", assignedOn: "05 Aug 2026" },
    sample: { id: "SMP-55120", source: "Market pick-up (retail)", quantity: 2, seal: "SEAL-88213", collectedOn: "08 Aug 2026", place: "Croma, Andheri (W), Mumbai" },
    custody: [
      { seq: 1, from: "SDA field officer", to: "Regional store", date: "08 Aug 2026", condition: "Sealed, intact" },
      { seq: 2, from: "Regional store", to: "Courier (BlueDart)", date: "10 Aug 2026", condition: "Sealed, intact" },
      { seq: 3, from: "Courier", to: "CPRI Lab, Delhi", date: "12 Aug 2026", condition: "Seal verified on receipt" },
    ],
    lab: {
      ref: "LAB-CPRI-20260 / 0091", testedOn: "20 Aug 2026", verdict: "Fail",
      params: [
        { name: "ISEER", declared: "5.10", measured: "4.62", pass: false },
        { name: "Cooling capacity (W)", declared: "5000", measured: "4880", pass: true },
        { name: "Power input (W)", declared: "1000", measured: "1085", pass: false },
        { name: "Annual energy (kWh)", declared: "820", measured: "905", pass: false },
      ],
    },
    challenge: { requested: true, lab: "NABL-BLR-014 (2nd lab)", result: "Pending", note: "Manufacturer exercised the challenge-test option within 30 days." },
    notices: { showCauseOn: "26 Aug 2026", deadline: "10 Sep 2026", response: "Awaited", responseOn: undefined },
    penalty: { proposed: "Suspension of 5★ label + penalty", amount: "₹ 5,00,000 (proposed)", status: "Pending director decision" },
    evidence: [
      { name: "Market purchase invoice.pdf", kind: "Invoice", icon: "receipt_long" },
      { name: "Sample seal photos.zip", kind: "Photos", icon: "photo_library" },
      { name: "CPRI test report.pdf", kind: "Lab report", icon: "science" },
      { name: "Show-cause notice.pdf", kind: "Notice", icon: "gavel" },
    ],
    timeline: [
      { date: "02 Aug 2026", event: "Case opened from AI risk flag + complaint", actor: "System / SDA", icon: "flag" },
      { date: "05 Aug 2026", event: "Assigned to SDA Maharashtra & CPRI lab", actor: "Programme Officer", icon: "assignment_ind" },
      { date: "08 Aug 2026", event: "Sample collected (market pick-up)", actor: "SDA field officer", icon: "science" },
      { date: "12 Aug 2026", event: "Sample received at lab, seal verified", actor: "CPRI Lab", icon: "inventory_2" },
      { date: "20 Aug 2026", event: "Lab result: FAIL (ISEER 4.62 vs 5.10)", actor: "CPRI Lab", icon: "error" },
      { date: "26 Aug 2026", event: "Show-cause notice issued", actor: "SDA — R. Menon", icon: "gavel" },
    ],
  },
  {
    id: "ENF-2026-0389",
    manufacturer: "Sunrise Electra Pvt. Ltd.", model: "CoolWave 1T (4★)", category: "Room ACs",
    opened: "18 Jul 2026", officer: "A. Kapoor (IAME)", stage: "Laboratory testing", status: "Testing",
    riskSource: "Random sampling plan SP-Q2-118",
    assignment: { iame: "IAME North — A. Kapoor", sda: "SDA Delhi — S. Rao", lab: "NABL-BLR-014", assignedOn: "20 Jul 2026" },
    sample: { id: "SMP-54880", source: "Factory stock", quantity: 3, seal: "SEAL-88190", collectedOn: "22 Jul 2026", place: "Manesar plant, Haryana" },
    custody: [
      { seq: 1, from: "IAME officer", to: "Regional store", date: "22 Jul 2026", condition: "Sealed, intact" },
      { seq: 2, from: "Regional store", to: "NABL-BLR-014", date: "25 Jul 2026", condition: "Seal verified on receipt" },
    ],
    lab: {
      ref: "LAB-BLR-20260 / 0044", testedOn: "In progress", verdict: "Pass",
      params: [
        { name: "ISEER", declared: "3.85", measured: "—", pass: true },
        { name: "Cooling capacity (W)", declared: "3500", measured: "—", pass: true },
      ],
    },
    challenge: { requested: false, note: "Not applicable — testing in progress." },
    notices: {},
    penalty: { proposed: "—", amount: "—", status: "Not initiated" },
    evidence: [
      { name: "Sampling plan SP-Q2-118.pdf", kind: "Plan", icon: "description" },
      { name: "Factory sample photos.zip", kind: "Photos", icon: "photo_library" },
    ],
    timeline: [
      { date: "18 Jul 2026", event: "Case opened from sampling plan", actor: "Programme Officer", icon: "flag" },
      { date: "20 Jul 2026", event: "Assigned to IAME North & NABL-BLR-014", actor: "Programme Officer", icon: "assignment_ind" },
      { date: "22 Jul 2026", event: "Sample collected (factory)", actor: "IAME officer", icon: "science" },
      { date: "25 Jul 2026", event: "Sample received at lab", actor: "NABL-BLR-014", icon: "inventory_2" },
    ],
  },
];

const STATUS_TONE: Record<EnfCase["status"], string> = {
  Testing: "bg-navy-subtle text-navy-dark",
  "Show-cause": WARN,
  Penalty: BAD,
  Closed: OK,
};

const TABS = [
  { id: "summary", label: "Case summary", icon: "summarize" },
  { id: "assignment", label: "Assignment", icon: "assignment_ind" },
  { id: "sample", label: "Sample details", icon: "science" },
  { id: "custody", label: "Chain of custody", icon: "link" },
  { id: "lab", label: "Lab results", icon: "biotech" },
  { id: "challenge", label: "Challenge test", icon: "fact_check" },
  { id: "notices", label: "Notices & responses", icon: "gavel" },
  { id: "penalty", label: "Penalty", icon: "account_balance" },
  { id: "evidence", label: "Evidence", icon: "folder" },
  { id: "timeline", label: "Timeline", icon: "history" },
];

export default function CaseWorkspace() {
  const [caseId, setCaseId] = useState(CASES[0].id);
  const [tab, setTab] = useState("summary");
  const c = CASES.find((x) => x.id === caseId)!;

  return (
    <div className="p-space-md lg:p-space-lg space-y-space-md">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
        <Link href="/app" className="hover:text-primary">Console</Link>
        <Icon name="chevron_right" size={14} />
        <span>Compliance &amp; Enforcement</span>
        <Icon name="chevron_right" size={14} />
        <span className="text-on-surface font-semibold">Enforcement case</span>
      </div>

      {/* Case header */}
      <div className="bg-surface-card rounded-xl shadow-sm p-space-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-start gap-space-sm">
            <span className="w-11 h-11 rounded-lg bg-forest-light text-primary flex items-center justify-center shrink-0"><Icon name="gavel" size={24} fill /></span>
            <div>
              <div className="flex items-center gap-space-sm flex-wrap">
                <h1 className="font-headline-md text-headline-md text-on-surface">{c.id}</h1>
                <Status label={c.stage} tone={STATUS_TONE[c.status]} />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{c.manufacturer} · {c.model} · {c.category}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Opened {c.opened} · Officer {c.officer}</p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Case</label>
            <select value={caseId} onChange={(e) => { setCaseId(e.target.value); setTab("summary"); }} className="px-space-sm py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm outline-none">
              {CASES.map((x) => <option key={x.id} value={x.id}>{x.id} — {x.model}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto app-scroll border-b border-border-subtle">
        {TABS.map((tb) => {
          const active = tab === tb.id;
          return (
            <button key={tb.id} type="button" onClick={() => setTab(tb.id)}
              className={`flex items-center gap-1.5 px-space-sm py-2.5 font-label-md text-label-md whitespace-nowrap border-b-2 transition-colors ${
                active ? "border-primary text-primary font-semibold" : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}>
              <Icon name={tb.icon} size={16} fill={active} /> {tb.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === "summary" && <Summary c={c} onGo={setTab} />}
      {tab === "assignment" && <Assignment c={c} />}
      {tab === "sample" && <Sample c={c} />}
      {tab === "custody" && <CustodyTab c={c} />}
      {tab === "lab" && <LabResults c={c} />}
      {tab === "challenge" && <Challenge c={c} />}
      {tab === "notices" && <Notices c={c} />}
      {tab === "penalty" && <Penalty c={c} />}
      {tab === "evidence" && <Evidence c={c} />}
      {tab === "timeline" && <Timeline c={c} />}
    </div>
  );
}

/* ---- helpers ---- */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-label-sm text-label-sm text-on-surface-variant">{label}</div>
      <div className="font-body-md text-body-md text-on-surface font-medium">{value}</div>
    </div>
  );
}

function Summary({ c, onGo }: { c: EnfCase; onGo: (t: string) => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
      <div className="lg:col-span-2">
        <Card title="Case summary">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-space-md">
            <Field label="Manufacturer" value={c.manufacturer} />
            <Field label="Model" value={c.model} />
            <Field label="Category" value={c.category} />
            <Field label="Opened" value={c.opened} />
            <Field label="Assigned officer" value={c.officer} />
            <Field label="Current stage" value={c.stage} />
          </div>
          <div className="flex items-start gap-space-sm bg-surface-container-low rounded-lg p-space-sm mt-space-md">
            <Icon name="lightbulb" size={16} className="text-solar-gold-dark shrink-0 mt-0.5" />
            <p className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">Origin:</span> {c.riskSource}</p>
          </div>
        </Card>
      </div>
      <Card title="Quick status">
        <div className="space-y-space-sm">
          <QuickRow icon="biotech" label="Lab verdict" value={c.lab.verdict} tone={c.lab.verdict === "Fail" ? "text-error" : "text-tertiary"} onClick={() => onGo("lab")} />
          <QuickRow icon="fact_check" label="Challenge test" value={c.challenge.requested ? c.challenge.result ?? "Requested" : "None"} onClick={() => onGo("challenge")} />
          <QuickRow icon="gavel" label="Show-cause" value={c.notices.showCauseOn ?? "Not issued"} onClick={() => onGo("notices")} />
          <QuickRow icon="account_balance" label="Penalty" value={c.penalty.status} onClick={() => onGo("penalty")} />
        </div>
      </Card>
    </div>
  );
}
function QuickRow({ icon, label, value, tone = "text-on-surface", onClick }: { icon: string; label: string; value: string; tone?: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center gap-space-sm bg-surface-container-low rounded-lg p-space-sm text-left hover:bg-surface-container">
      <Icon name={icon} size={18} className="text-on-surface-variant" />
      <span className="flex-1 font-label-md text-label-md text-on-surface-variant">{label}</span>
      <span className={`font-label-md text-label-md font-semibold ${tone}`}>{value}</span>
      <Icon name="chevron_right" size={16} className="text-outline" />
    </button>
  );
}

function Assignment({ c }: { c: EnfCase }) {
  return (
    <Card title="Assignment" action={<button className="flex items-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md py-1.5 px-space-sm rounded-lg hover:bg-forest-light"><Icon name="swap_horiz" size={16} /> Reassign</button>}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <Field label="IAME" value={c.assignment.iame} />
        <Field label="SDA" value={c.assignment.sda} />
        <Field label="Testing laboratory" value={c.assignment.lab} />
        <Field label="Assigned on" value={c.assignment.assignedOn} />
      </div>
    </Card>
  );
}

function Sample({ c }: { c: EnfCase }) {
  return (
    <Card title="Sample details">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-space-md">
        <Field label="Sample ID" value={c.sample.id} />
        <Field label="Source" value={c.sample.source} />
        <Field label="Quantity" value={`${c.sample.quantity} unit(s)`} />
        <Field label="Seal number" value={c.sample.seal} />
        <Field label="Collected on" value={c.sample.collectedOn} />
        <Field label="Place" value={c.sample.place} />
      </div>
    </Card>
  );
}

function CustodyTab({ c }: { c: EnfCase }) {
  return (
    <Card title="Chain of custody">
      <div className="space-y-0">
        {c.custody.map((h, i) => (
          <div key={h.seq} className="flex gap-space-sm">
            <div className="flex flex-col items-center">
              <span className="w-7 h-7 rounded-full bg-forest-light text-forest-dark flex items-center justify-center font-label-sm text-label-sm font-bold shrink-0">{h.seq}</span>
              {i < c.custody.length - 1 && <span className="w-px flex-1 bg-border-strong my-1" />}
            </div>
            <div className="pb-space-md">
              <div className="font-body-md text-body-md text-on-surface font-medium">{h.from} <Icon name="arrow_forward" size={14} className="text-outline mx-1" /> {h.to}</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">{h.date} · {h.condition}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function LabResults({ c }: { c: EnfCase }) {
  return (
    <Card title="Laboratory results" action={<Status label={c.lab.verdict} tone={c.lab.verdict === "Fail" ? BAD : OK} />}>
      <div className="font-label-sm text-label-sm text-on-surface-variant mb-space-sm">Report {c.lab.ref} · tested {c.lab.testedOn}</div>
      <div className="overflow-x-auto app-scroll">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle">
              {["Parameter", "Declared", "Measured", "Result"].map((h) => <th key={h} className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide py-2 pr-space-md">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {c.lab.params.map((p) => (
              <tr key={p.name} className="border-b border-border-subtle/60">
                <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface">{p.name}</td>
                <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface-variant">{p.declared}</td>
                <td className={`py-2.5 pr-space-md font-body-sm text-body-sm font-semibold ${!p.pass ? "text-error" : "text-on-surface"}`}>{p.measured}</td>
                <td className="py-2.5 pr-space-md">{p.measured === "—" ? <span className="font-label-sm text-label-sm text-on-surface-variant">Pending</span> : <Status label={p.pass ? "Pass" : "Fail"} tone={p.pass ? OK : BAD} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Challenge({ c }: { c: EnfCase }) {
  return (
    <Card title="Challenge test">
      {c.challenge.requested ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          <Field label="Status" value="Requested" />
          <Field label="Second laboratory" value={c.challenge.lab ?? "—"} />
          <Field label="Result" value={c.challenge.result ?? "Pending"} />
        </div>
      ) : (
        <div className="flex items-center gap-space-sm text-on-surface-variant"><Icon name="info" size={18} /> <span className="font-body-sm text-body-sm">No challenge test on record.</span></div>
      )}
      <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-sm">{c.challenge.note}</p>
    </Card>
  );
}

function Notices({ c }: { c: EnfCase }) {
  if (!c.notices.showCauseOn) {
    return <Card title="Notices &amp; responses"><div className="flex items-center gap-space-sm text-on-surface-variant"><Icon name="info" size={18} /> <span className="font-body-sm text-body-sm">No notices issued yet on this case.</span></div></Card>;
  }
  return (
    <Card title="Notices &amp; responses" action={<button className="flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md font-semibold py-1.5 px-space-sm rounded-lg hover:bg-forest-dark"><Icon name="add" size={16} /> New notice</button>}>
      <div className="space-y-space-sm">
        <div className="bg-solar-gold-light/40 rounded-lg p-space-sm">
          <div className="flex items-center justify-between"><span className="font-label-md text-label-md text-on-surface font-semibold">Show-cause notice</span><span className="font-label-sm text-label-sm text-on-surface-variant">Issued {c.notices.showCauseOn}</span></div>
          <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Response deadline: {c.notices.deadline}</div>
        </div>
        <div className="bg-surface-container-low rounded-lg p-space-sm">
          <div className="flex items-center justify-between"><span className="font-label-md text-label-md text-on-surface font-semibold">Manufacturer response</span><Status label={c.notices.response ?? "Awaited"} tone={WARN} /></div>
        </div>
      </div>
    </Card>
  );
}

function Penalty({ c }: { c: EnfCase }) {
  return (
    <Card title="Penalty" action={<Status label={c.penalty.status} tone={c.status === "Penalty" ? BAD : WARN} />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <Field label="Proposed action" value={c.penalty.proposed} />
        <Field label="Amount" value={c.penalty.amount} />
      </div>
      {c.penalty.proposed !== "—" && (
        <div className="flex flex-wrap gap-space-sm mt-space-md">
          <button className="flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md font-semibold py-2 px-space-md rounded-lg hover:bg-forest-dark"><Icon name="how_to_vote" size={16} /> Recommend to Director</button>
          <button className="flex items-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md py-2 px-space-md rounded-lg hover:bg-forest-light"><Icon name="edit" size={16} /> Revise proposal</button>
        </div>
      )}
    </Card>
  );
}

function Evidence({ c }: { c: EnfCase }) {
  return (
    <Card title="Evidence" action={<button className="flex items-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md py-1.5 px-space-sm rounded-lg hover:bg-forest-light"><Icon name="upload" size={16} /> Add</button>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
        {c.evidence.map((e) => (
          <div key={e.name} className="flex items-center gap-space-sm bg-surface-container-low rounded-lg p-space-sm">
            <span className="w-9 h-9 rounded-lg bg-forest-light text-primary flex items-center justify-center shrink-0"><Icon name={e.icon} size={18} /></span>
            <div className="min-w-0 flex-1">
              <div className="font-body-sm text-body-sm text-on-surface font-medium truncate">{e.name}</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">{e.kind}</div>
            </div>
            <Icon name="download" size={16} className="text-on-surface-variant" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function Timeline({ c }: { c: EnfCase }) {
  return (
    <Card title="Timeline">
      <div className="space-y-0">
        {c.timeline.map((t, i) => (
          <div key={i} className="flex gap-space-sm">
            <div className="flex flex-col items-center">
              <span className="w-8 h-8 rounded-full bg-surface-container text-primary flex items-center justify-center shrink-0"><Icon name={t.icon} size={16} /></span>
              {i < c.timeline.length - 1 && <span className="w-px flex-1 bg-border-strong my-1" />}
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
  );
}
