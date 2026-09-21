"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Stars";
import { Module, Screen } from "@/lib/screens";
import { Card, ScreenChrome, Status, OK, WARN, BAD } from "@/components/app/ScreenScaffold";

/* ================================================================== *
 * Shared AI primitives & mock data (Phase 2 — the five committed AI
 * use cases + model governance, each clearly differentiated).
 * ================================================================== */

export type ModelHealth = "healthy" | "monitor" | "retrain";

export interface AIUseCase {
  id: string;
  href: string;
  icon: string;
  title: string;
  purpose: string;
  recordsAnalysed: number;
  exceptions: number;
  awaitingReview: number;
  lastRun: string;
  model: string;
  status: ModelHealth;
}

export const AI_USECASES: AIUseCase[] = [
  {
    id: "risk", href: "/app/mis-ai/risk-scoring", icon: "target",
    title: "Compliance Risk Scoring",
    purpose: "Prioritise manufacturers and models for enforcement attention.",
    recordsAnalysed: 1284, exceptions: 37, awaitingReview: 12,
    lastRun: "Today 06:15 IST", model: "risk-rank v2.3", status: "healthy",
  },
  {
    id: "anomaly", href: "/app/mis-ai/production-anomaly", icon: "readiness_score",
    title: "Production Anomaly Detection",
    purpose: "Identify suspicious or statistically unusual production submissions.",
    recordsAnalysed: 9640, exceptions: 54, awaitingReview: 21,
    lastRun: "Today 06:40 IST", model: "anomaly-iforest v1.8", status: "monitor",
  },
  {
    id: "document", href: "/app/mis-ai/extraction-review", icon: "document_scanner",
    title: "Document Intelligence",
    purpose: "Compare uploaded certificates and reports with entered data.",
    recordsAnalysed: 2170, exceptions: 88, awaitingReview: 30,
    lastRun: "Today 07:02 IST", model: "doc-extract v3.1", status: "healthy",
  },
  {
    id: "helpdesk", href: "/app/mis-ai/chatbot-review", icon: "smart_toy",
    title: "Helpdesk Assistant",
    purpose: "Answer common questions and assist ticket routing.",
    recordsAnalysed: 5312, exceptions: 19, awaitingReview: 7,
    lastRun: "Live", model: "assist-rag v1.4", status: "monitor",
  },
  {
    id: "trends", href: "/app/mis-ai/rating-trends", icon: "trending_up",
    title: "Star-Rating Trend Analytics",
    purpose: "Support policy and star-threshold revision decisions.",
    recordsAnalysed: 41200, exceptions: 0, awaitingReview: 0,
    lastRun: "Today 05:50 IST", model: "trend-stats v2.0", status: "healthy",
  },
];

export const HEALTH_META: Record<ModelHealth, { label: string; tone: string; icon: string }> = {
  healthy: { label: "Healthy", tone: OK, icon: "check_circle" },
  monitor: { label: "Monitor", tone: WARN, icon: "monitoring" },
  retrain: { label: "Retrain due", tone: BAD, icon: "warning" },
};

function AdvisoryBanner({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-space-sm bg-solar-gold-light/60 border border-solar-gold/40 rounded-xl p-space-sm">
      <Icon name="info" size={18} className="text-solar-gold-dark shrink-0 mt-0.5" />
      <p className="font-body-sm text-body-sm text-on-surface">{text}</p>
    </div>
  );
}

function Bar({ label, value, max = 100, tone = "bg-primary", suffix = "" }: { label: string; value: number; max?: number; tone?: string; suffix?: string }) {
  const pct = Math.max(2, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant mb-0.5">
        <span>{label}</span><span className="text-on-surface font-semibold">{value}{suffix}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-container overflow-hidden">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Confidence({ pct }: { pct: number }) {
  const tone = pct >= 85 ? "bg-tertiary" : pct >= 65 ? "bg-solar-gold-dark" : "bg-error";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-14 h-1.5 rounded-full bg-surface-container overflow-hidden inline-block">
        <span className={`h-full block rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </span>
      <span className="font-label-sm text-label-sm text-on-surface-variant">{pct}%</span>
    </span>
  );
}

function riskBand(score: number) {
  if (score >= 70) return { label: "High", tone: BAD };
  if (score >= 40) return { label: "Medium", tone: WARN };
  return { label: "Low", tone: OK };
}

/* ================================================================== *
 * 1) COMPLIANCE RISK SCORING — ranks ENTITIES for enforcement.
 * ================================================================== */

interface RiskEntity {
  id: string; name: string; kind: "Manufacturer" | "Model"; score: number;
  factors: { label: string; weight: number }[];
  priorEnforcement: number; submissionDelays: number; qrAnomalies: number;
}

const RISK_ENTITIES: RiskEntity[] = [
  { id: "MFR-2231", name: "Nova Cool Appliances Ltd.", kind: "Manufacturer", score: 82,
    factors: [{ label: "QR verification anomalies", weight: 34 }, { label: "Repeated submission delays", weight: 26 }, { label: "Prior enforcement history", weight: 22 }, { label: "Production vs label mismatch", weight: 18 }],
    priorEnforcement: 2, submissionDelays: 5, qrAnomalies: 41 },
  { id: "MDL-10233", name: "FrostMax 1.5T (5★)", kind: "Model", score: 74,
    factors: [{ label: "Cross-model IESER outlier", weight: 30 }, { label: "QR verification anomalies", weight: 28 }, { label: "Production spike", weight: 22 }, { label: "Late quarterly filing", weight: 20 }],
    priorEnforcement: 1, submissionDelays: 3, qrAnomalies: 27 },
  { id: "MFR-1188", name: "Sunrise Electra Pvt. Ltd.", kind: "Manufacturer", score: 58,
    factors: [{ label: "Submission delays", weight: 40 }, { label: "Document mismatch rate", weight: 32 }, { label: "QR anomalies", weight: 28 }],
    priorEnforcement: 0, submissionDelays: 4, qrAnomalies: 12 },
  { id: "MDL-10871", name: "AquaBreeze 2T (3★)", kind: "Model", score: 37,
    factors: [{ label: "Minor label variance", weight: 55 }, { label: "One late filing", weight: 45 }],
    priorEnforcement: 0, submissionDelays: 1, qrAnomalies: 3 },
  { id: "MFR-3012", name: "GreenVolt Industries", kind: "Manufacturer", score: 24,
    factors: [{ label: "Isolated QR mismatch", weight: 60 }, { label: "Data completeness", weight: 40 }],
    priorEnforcement: 0, submissionDelays: 0, qrAnomalies: 2 },
];

export function ComplianceRiskScoring({ module, screen }: { module: Module; screen: Screen }) {
  const [selId, setSelId] = useState(RISK_ENTITIES[0].id);
  const [disposition, setDisposition] = useState("monitor");
  const [note, setNote] = useState("");
  const sel = RISK_ENTITIES.find((e) => e.id === selId)!;
  const band = riskBand(sel.score);

  return (
    <ScreenChrome module={module} screen={screen} subtitle="Risk ranking of entities · model risk-rank v2.3">
      <AdvisoryBanner text="Risk scores are advisory decision-support only. They rank entities for officer attention and do NOT initiate enforcement automatically — every action needs an officer disposition." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
        {[
          { label: "Entities scored", value: "1,284", icon: "target", tone: "text-primary" },
          { label: "High-risk band", value: "37", icon: "priority_high", tone: "text-error" },
          { label: "Awaiting disposition", value: "12", icon: "how_to_reg", tone: "text-solar-gold-dark" },
          { label: "Data period", value: "Q2 FY26", icon: "calendar_month", tone: "text-tertiary" },
        ].map((k) => (
          <div key={k.label} className="bg-surface-card rounded-xl shadow-sm p-space-md">
            <div className="flex items-center justify-between"><span className="font-label-sm text-label-sm text-on-surface-variant">{k.label}</span><Icon name={k.icon} size={18} className={k.tone} /></div>
            <div className={`font-headline-md text-headline-md font-bold ${k.tone} mt-1`}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-space-md">
        {/* Ranking */}
        <div className="lg:col-span-3">
          <Card title="Risk ranking">
            <div className="space-y-1.5">
              {RISK_ENTITIES.map((e, i) => {
                const b = riskBand(e.score);
                const active = e.id === selId;
                return (
                  <button key={e.id} type="button" onClick={() => setSelId(e.id)}
                    className={`w-full flex items-center gap-space-sm p-space-sm rounded-lg text-left transition-colors ${active ? "bg-primary-container/40 ring-1 ring-primary" : "bg-surface-container-low hover:bg-surface-container"}`}>
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface-variant w-6 text-center">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-title-sm text-title-sm text-on-surface truncate">{e.name}</div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">{e.kind} · {e.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-headline-sm text-headline-sm font-bold text-on-surface">{e.score}</div>
                      <Status label={b.label} tone={b.tone} />
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Selected assessment */}
        <div className="lg:col-span-2 space-y-space-md">
          <Card title={sel.name} action={<Status label={`${band.label} · ${sel.score}`} tone={band.tone} />}>
            <div className="font-label-sm text-label-sm text-on-surface-variant mb-space-sm">{sel.kind} · {sel.id} · model risk-rank v2.3</div>
            <div className="space-y-space-sm">
              <div className="font-label-md text-label-md text-on-surface font-semibold">Contributing factors</div>
              {sel.factors.map((f) => <Bar key={f.label} label={f.label} value={f.weight} tone={f.weight > 30 ? "bg-error" : "bg-primary"} suffix="%" />)}
            </div>
            <div className="grid grid-cols-3 gap-space-sm mt-space-md">
              {[
                { l: "Prior enforcement", v: sel.priorEnforcement, i: "gavel" },
                { l: "Submission delays", v: sel.submissionDelays, i: "schedule" },
                { l: "QR anomalies", v: sel.qrAnomalies, i: "qr_code_2" },
              ].map((m) => (
                <div key={m.l} className="bg-surface-container-low rounded-lg p-space-sm text-center">
                  <Icon name={m.i} size={16} className="text-on-surface-variant" />
                  <div className="font-headline-sm text-headline-sm font-bold text-on-surface">{m.v}</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant leading-tight">{m.l}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Officer disposition">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Decision</label>
            <select value={disposition} onChange={(e) => setDisposition(e.target.value)} className="w-full mt-1 mb-space-sm px-space-sm py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm outline-none">
              <option value="assess">Open enforcement assessment</option>
              <option value="monitor">Keep under monitoring</option>
              <option value="dismiss">Dismiss — false positive</option>
            </select>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason / comments (recorded in audit trail)…" rows={3} className="w-full px-space-sm py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm outline-none resize-none" />
            <div className="flex gap-space-sm mt-space-sm">
              <button type="button" className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md font-semibold py-2 rounded-lg hover:bg-forest-dark">
                <Icon name="assignment_turned_in" size={16} /> Record disposition
              </button>
              <Link href="/app/enforcement/sample-plan" className="flex items-center justify-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md py-2 px-space-sm rounded-lg hover:bg-forest-light">
                <Icon name="gavel" size={16} /> Enforcement
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </ScreenChrome>
  );
}

/* ================================================================== *
 * 2) PRODUCTION ANOMALY DETECTION — investigates unusual RECORDS.
 * ================================================================== */

type AnomalyType = "Duplicate pattern" | "Quantity deviation" | "Cross-model similarity" | "Period spike";

interface Anomaly {
  id: string; model: string; type: AnomalyType; confidence: number; period: string;
  observed: number; expected: number; note: string;
}

const ANOMALIES: Anomaly[] = [
  { id: "PRD-88213", model: "FrostMax 1.5T (5★)", type: "Period spike", confidence: 92, period: "Q2 FY26", observed: 48200, expected: 12500, note: "286% above trailing 4-quarter mean." },
  { id: "PRD-88190", model: "CoolWave 1T (4★)", type: "Duplicate pattern", confidence: 88, period: "Q2 FY26", observed: 15000, expected: 15000, note: "Identical serial batch submitted twice." },
  { id: "PRD-88155", model: "AquaBreeze 2T (3★)", type: "Cross-model similarity", confidence: 76, period: "Q2 FY26", observed: 9800, expected: 6100, note: "Serial ranges overlap a different model family." },
  { id: "PRD-88122", model: "PolarPro 2T (5★)", type: "Quantity deviation", confidence: 69, period: "Q2 FY26", observed: 300, expected: 8200, note: "96% below expected — possible under-reporting." },
];

const ANO_TONE: Record<AnomalyType, string> = {
  "Period spike": "bg-error-container text-on-error-container",
  "Duplicate pattern": "bg-navy-subtle text-navy-dark",
  "Cross-model similarity": "bg-solar-gold-light text-solar-gold-dark",
  "Quantity deviation": "bg-secondary-fixed text-on-secondary-fixed",
};

export function ProductionAnomalyDetection({ module, screen }: { module: Module; screen: Screen }) {
  const [selId, setSelId] = useState(ANOMALIES[0].id);
  const sel = ANOMALIES.find((a) => a.id === selId)!;
  const max = Math.max(sel.observed, sel.expected);

  return (
    <ScreenChrome module={module} screen={screen} subtitle="Anomaly queue · model anomaly-iforest v1.8">
      <AdvisoryBanner text="Flagged records are statistically unusual, not proven violations. Each anomaly must be investigated and marked valid or confirmed by an officer before any action." />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-space-md">
        {/* Queue */}
        <div className="lg:col-span-2">
          <Card title={`Anomaly queue · ${ANOMALIES.length}`}>
            <div className="space-y-1.5">
              {ANOMALIES.map((a) => {
                const active = a.id === selId;
                return (
                  <button key={a.id} type="button" onClick={() => setSelId(a.id)}
                    className={`w-full text-left p-space-sm rounded-lg transition-colors ${active ? "bg-primary-container/40 ring-1 ring-primary" : "bg-surface-container-low hover:bg-surface-container"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{a.id}</span>
                      <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${ANO_TONE[a.type]}`}>{a.type}</span>
                    </div>
                    <div className="font-title-sm text-title-sm text-on-surface mt-0.5">{a.model}</div>
                    <div className="mt-1"><Confidence pct={a.confidence} /></div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Investigation */}
        <div className="lg:col-span-3 space-y-space-md">
          <Card title={`Record ${sel.id}`} action={<span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${ANO_TONE[sel.type]}`}>{sel.type}</span>}>
            <div className="font-title-md text-title-md text-on-surface">{sel.model}</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant mb-space-md">{sel.period} · statistical confidence {sel.confidence}%</div>

            <div className="font-label-md text-label-md text-on-surface font-semibold mb-space-sm">Observed vs expected (historical)</div>
            <div className="space-y-space-sm">
              <Bar label="This submission" value={sel.observed} max={max} tone="bg-error" />
              <Bar label="Expected (4-qtr mean)" value={sel.expected} max={max} tone="bg-primary" />
            </div>
            <div className="flex items-start gap-space-sm bg-surface-container-low rounded-lg p-space-sm mt-space-md">
              <Icon name="lightbulb" size={16} className="text-solar-gold-dark shrink-0 mt-0.5" />
              <p className="font-body-sm text-body-sm text-on-surface">{sel.note}</p>
            </div>
          </Card>

          <Card title="Disposition">
            <div className="flex flex-wrap gap-space-sm">
              <button type="button" className="flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md font-semibold py-2 px-space-md rounded-lg hover:bg-forest-dark">
                <Icon name="person_search" size={16} /> Assign for investigation
              </button>
              <button type="button" className="flex items-center gap-1.5 bg-forest-light text-forest-dark font-label-md text-label-md font-semibold py-2 px-space-md rounded-lg hover:bg-tertiary hover:text-on-primary">
                <Icon name="check_circle" size={16} /> Mark valid
              </button>
              <button type="button" className="flex items-center gap-1.5 bg-error-container text-on-error-container font-label-md text-label-md font-semibold py-2 px-space-md rounded-lg hover:bg-error hover:text-on-error">
                <Icon name="report" size={16} /> Confirm exception
              </button>
            </div>
          </Card>
        </div>
      </div>
    </ScreenChrome>
  );
}

/* ================================================================== *
 * 3) DOCUMENT INTELLIGENCE — split screen doc vs extracted fields.
 * ================================================================== */

interface ExtractedField { field: string; entered: string; extracted: string; confidence: number; page: number; }

const DOC_FIELDS: ExtractedField[] = [
  { field: "Brand / manufacturer", entered: "Nova Cool Appliances Ltd.", extracted: "Nova Cool Appliances Ltd.", confidence: 99, page: 1 },
  { field: "Model number", entered: "FM-15TC5", extracted: "FM-15TC5", confidence: 97, page: 1 },
  { field: "Declared ISEER", entered: "5.10", extracted: "4.90", confidence: 88, page: 2 },
  { field: "Cooling capacity (W)", entered: "5000", extracted: "5000", confidence: 96, page: 2 },
  { field: "Test laboratory", entered: "NABL-DEL-002", extracted: "NABL-DEL-020", confidence: 71, page: 3 },
  { field: "Test report date", entered: "01 Sep 2026", extracted: "01 Sep 2026", confidence: 94, page: 3 },
];

export function DocumentIntelligence({ module, screen }: { module: Module; screen: Screen }) {
  const [page, setPage] = useState(1);
  const mismatches = DOC_FIELDS.filter((f) => f.entered !== f.extracted).length;

  return (
    <ScreenChrome module={module} screen={screen} subtitle="Certificate vs entered data · model doc-extract v3.1">
      <div className="flex flex-wrap items-center gap-space-md">
        <div className="flex items-center gap-1.5 font-label-md text-label-md"><span className="w-2.5 h-2.5 rounded-full bg-error inline-block" /> {mismatches} field mismatches</div>
        <div className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant"><span className="w-2.5 h-2.5 rounded-full bg-tertiary inline-block" /> {DOC_FIELDS.length - mismatches} matched</div>
        <span className="font-label-sm text-label-sm text-on-surface-variant">Source: TEST-REPORT-FM15TC5.pdf</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
        {/* Left: document preview */}
        <Card title="Uploaded document" action={
          <div className="flex items-center gap-space-sm font-label-sm text-label-sm">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} className="text-on-surface-variant hover:text-primary"><Icon name="chevron_left" size={18} /></button>
            <span>Page {page} / 3</span>
            <button type="button" onClick={() => setPage((p) => Math.min(3, p + 1))} className="text-on-surface-variant hover:text-primary"><Icon name="chevron_right" size={18} /></button>
          </div>
        }>
          <div className="aspect-[3/4] bg-surface-container-low rounded-lg border border-border-subtle p-space-md overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="text-center border-b border-border-subtle pb-space-sm mb-space-sm">
                <div className="font-title-md text-title-md text-on-surface">TEST REPORT</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">NABL-accredited laboratory · Page {page}</div>
              </div>
              <div className="space-y-2 flex-1">
                {DOC_FIELDS.filter((f) => f.page === page).map((f) => (
                  <div key={f.field} className={`p-space-sm rounded-lg ${f.entered !== f.extracted ? "bg-error-container/50 ring-1 ring-error/40" : "bg-surface-card"}`}>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">{f.field}</div>
                    <div className="font-body-md text-body-md text-on-surface font-semibold">{f.extracted}</div>
                  </div>
                ))}
                {DOC_FIELDS.filter((f) => f.page === page).length === 0 && (
                  <div className="text-center font-label-sm text-label-sm text-on-surface-variant pt-space-lg">No extracted fields on this page.</div>
                )}
              </div>
              <div className="text-center font-label-sm text-label-sm text-on-surface-variant/60 border-t border-border-subtle pt-space-sm">Highlighted blocks are AI-detected source regions.</div>
            </div>
          </div>
        </Card>

        {/* Right: extracted fields */}
        <Card title="Extracted vs entered">
          <div className="space-y-space-sm">
            {DOC_FIELDS.map((f) => {
              const mismatch = f.entered !== f.extracted;
              return (
                <div key={f.field} className={`rounded-lg p-space-sm ${mismatch ? "bg-error-container/40 ring-1 ring-error/30" : "bg-surface-container-low"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">{f.field}</span>
                    <button type="button" onClick={() => setPage(f.page)} className="font-label-sm text-label-sm text-primary hover:underline">p.{f.page}</button>
                  </div>
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">Entered</div>
                      <div className={`font-body-sm text-body-sm ${mismatch ? "text-error font-semibold" : "text-on-surface"}`}>{f.entered}</div>
                    </div>
                    <div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">Extracted</div>
                      <div className={`font-body-sm text-body-sm ${mismatch ? "text-error font-semibold" : "text-on-surface"}`}>{f.extracted}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-space-sm">
                    <Confidence pct={f.confidence} />
                    {mismatch ? (
                      <div className="flex gap-1.5">
                        <button type="button" className="font-label-sm text-label-sm bg-forest-light text-forest-dark px-2 py-1 rounded hover:bg-tertiary hover:text-on-primary">Use entered</button>
                        <button type="button" className="font-label-sm text-label-sm bg-primary text-on-primary px-2 py-1 rounded hover:bg-forest-dark">Correct</button>
                        <button type="button" className="font-label-sm text-label-sm bg-surface-container text-on-surface px-2 py-1 rounded hover:bg-solar-gold-light">Clarify</button>
                      </div>
                    ) : (
                      <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1"><Icon name="check" size={14} /> Match</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant mt-space-md border-t border-border-subtle pt-space-sm">
            Extraction model doc-extract v3.1 · OCR + layout parser · confidence is per-field, human review required below 85%.
          </div>
        </Card>
      </div>
    </ScreenChrome>
  );
}

/* ================================================================== *
 * 4) HELPDESK AI ASSISTANT — conversation + routing assist.
 * ================================================================== */

export function HelpdeskAssistant({ module, screen }: { module: Module; screen: Screen }) {
  const [reply, setReply] = useState(
    "You can verify a BEE star label by scanning the QR code on the appliance, or by entering the registration number at bee-portal /verify. A genuine label returns the brand, model and star rating."
  );
  const transcript = [
    { who: "user", text: "How do I check if a star label on my new AC is genuine?" },
    { who: "ai", text: "You can scan the QR code on the label to verify it instantly." },
    { who: "user", text: "There is no QR, only a registration number BEE/RAC/2026/10016." },
  ];

  return (
    <ScreenChrome module={module} screen={screen} subtitle="Conversation + routing assist · model assist-rag v1.4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-space-md">
        {/* Transcript */}
        <div className="lg:col-span-3">
          <Card title="Conversation transcript">
            <div className="space-y-space-sm">
              {transcript.map((m, i) => (
                <div key={i} className={`flex ${m.who === "user" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[80%] p-space-sm rounded-xl font-body-sm text-body-sm ${m.who === "user" ? "bg-surface-container-low text-on-surface rounded-tl-none" : "bg-primary-container/50 text-on-surface rounded-tr-none"}`}>
                    <div className="font-label-sm text-label-sm text-on-surface-variant mb-0.5">{m.who === "user" ? "Citizen" : "AI assistant"}</div>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-space-md border-t border-border-subtle pt-space-md">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Suggested response</span>
                <Confidence pct={82} />
              </div>
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={4} className="w-full px-space-sm py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm outline-none resize-none" />
              <div className="flex flex-wrap gap-space-sm mt-space-sm">
                <button type="button" className="flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md font-semibold py-2 px-space-md rounded-lg hover:bg-forest-dark"><Icon name="send" size={16} /> Accept &amp; send</button>
                <button type="button" className="flex items-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md py-2 px-space-md rounded-lg hover:bg-forest-light"><Icon name="edit" size={16} /> Edit</button>
                <button type="button" className="flex items-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md py-2 px-space-md rounded-lg hover:bg-error-container"><Icon name="block" size={16} /> Reject</button>
                <button type="button" className="flex items-center gap-1.5 bg-solar-gold-light text-solar-gold-dark font-label-md text-label-md font-semibold py-2 px-space-md rounded-lg ml-auto hover:bg-solar-gold hover:text-on-primary"><Icon name="support_agent" size={16} /> Escalate to human</button>
              </div>
            </div>
          </Card>
        </div>

        {/* Assist panel */}
        <div className="lg:col-span-2 space-y-space-md">
          <Card title="Routing assist">
            <div className="space-y-space-sm">
              <Row label="Detected intent" value="Label authenticity check" />
              <Row label="Recommended category" value="Verification / QR" />
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Recommended priority</span>
                <Status label="Normal" tone={OK} />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Intent confidence</span>
                <Confidence pct={82} />
              </div>
            </div>
          </Card>

          <Card title="Knowledge sources used">
            <div className="space-y-1.5">
              {["KB-114 · Verifying a genuine star label", "KB-090 · Registration number format", "FAQ · What if there is no QR code?"].map((s) => (
                <div key={s} className="flex items-start gap-space-sm bg-surface-container-low rounded-lg p-space-sm">
                  <Icon name="menu_book" size={16} className="text-primary shrink-0 mt-0.5" />
                  <span className="font-body-sm text-body-sm text-on-surface">{s}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Quality &amp; feedback">
            <div className="flex items-center gap-space-sm">
              <button type="button" className="flex-1 flex items-center justify-center gap-1.5 bg-surface-container-low text-on-surface font-label-md text-label-md py-2 rounded-lg hover:bg-forest-light"><Icon name="thumb_up" size={16} /> Helpful</button>
              <button type="button" className="flex-1 flex items-center justify-center gap-1.5 bg-surface-container-low text-on-surface font-label-md text-label-md py-2 rounded-lg hover:bg-error-container"><Icon name="thumb_down" size={16} /> Not helpful</button>
            </div>
            <button type="button" className="w-full mt-space-sm flex items-center justify-center gap-1.5 border border-error/40 text-error font-label-md text-label-md py-2 rounded-lg hover:bg-error-container/40">
              <Icon name="flag" size={16} /> Report unsupported / hallucinated answer
            </button>
          </Card>
        </div>
      </div>
    </ScreenChrome>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>
      <span className="font-label-md text-label-md text-on-surface font-semibold">{value}</span>
    </div>
  );
}

/* ================================================================== *
 * 5) STAR-RATING TREND ANALYTICS — policy / threshold support.
 * ================================================================== */

const DIST_BEFORE = [6, 14, 28, 34, 18]; // 1..5 star %
const DIST_AFTER = [2, 9, 22, 37, 30];
const TREND = [
  { q: "Q1'25", avg: 3.4 }, { q: "Q2'25", avg: 3.5 }, { q: "Q3'25", avg: 3.7 },
  { q: "Q4'25", avg: 3.8 }, { q: "Q1'26", avg: 4.0 }, { q: "Q2'26", avg: 4.1 },
];

export function StarRatingTrends({ module, screen }: { module: Module; screen: Screen }) {
  const [category, setCategory] = useState("Room ACs");
  const maxTrend = 5;

  return (
    <ScreenChrome module={module} screen={screen} subtitle="Distribution & thresholds · model trend-stats v2.0">
      <div className="flex flex-wrap items-center gap-space-sm">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-space-sm py-2 rounded-lg bg-surface-card shadow-sm font-body-sm text-body-sm outline-none">
          {["Room ACs", "Refrigerators", "Ceiling Fans", "LED Lamps", "Water Heaters"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="px-space-sm py-2 rounded-lg bg-surface-card shadow-sm font-body-sm text-body-sm outline-none">
          {["Last 6 quarters", "FY 2025-26", "Last 3 years"].map((d) => <option key={d}>{d}</option>)}
        </select>
        <button type="button" className="ml-auto flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md font-semibold py-2 px-space-md rounded-lg hover:bg-forest-dark"><Icon name="download" size={16} /> Export analysis</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
        <Card title={`Star distribution — ${category}`}>
          <div className="flex items-end justify-around h-48 gap-space-sm pt-space-md">
            {DIST_AFTER.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold mb-1">{v}%</span>
                <div className="w-full rounded-t-md bg-primary" style={{ height: `${(v / 40) * 100}%` }} />
                <div className="flex items-center gap-0.5 mt-1"><span className="font-label-sm text-label-sm text-on-surface-variant">{i + 1}</span><Icon name="star" size={12} className="text-solar-gold-dark" /></div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-space-sm bg-solar-gold-light/50 rounded-lg p-space-sm mt-space-sm">
            <Icon name="join_inner" size={16} className="text-solar-gold-dark shrink-0 mt-0.5" />
            <p className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">Clustering alert:</span> 30% of models sit just above the 5★ ISEER cut-off — a threshold revision would reclassify many to 4★.</p>
          </div>
        </Card>

        <Card title="Average rating over time">
          <div className="flex items-end justify-around h-48 gap-space-sm pt-space-md relative">
            {TREND.map((t) => (
              <div key={t.q} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold mb-1">{t.avg}</span>
                <div className="w-full rounded-t-md bg-tertiary" style={{ height: `${(t.avg / maxTrend) * 100}%` }} />
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">{t.q}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-space-sm mt-space-sm font-label-sm text-label-sm text-on-surface-variant">
            <span className="inline-flex items-center gap-1"><span className="w-3 h-0.5 bg-error inline-block" /> Threshold revision (Q3'25)</span>
          </div>
        </Card>
      </div>

      <Card title="Before / after policy comparison">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {[{ label: "Before revision", data: DIST_BEFORE, tone: "bg-outline" }, { label: "After revision", data: DIST_AFTER, tone: "bg-primary" }].map((block) => (
            <div key={block.label}>
              <div className="font-label-md text-label-md text-on-surface font-semibold mb-space-sm">{block.label}</div>
              <div className="space-y-1.5">
                {block.data.map((v, i) => (
                  <div key={i} className="flex items-center gap-space-sm">
                    <span className="w-10 flex items-center gap-0.5 font-label-sm text-label-sm text-on-surface-variant">{i + 1}<Icon name="star" size={11} className="text-solar-gold-dark" /></span>
                    <div className="flex-1 h-3 rounded-full bg-surface-container overflow-hidden"><div className={`h-full rounded-full ${block.tone}`} style={{ width: `${(v / 40) * 100}%` }} /></div>
                    <span className="w-9 text-right font-label-sm text-label-sm text-on-surface">{v}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </ScreenChrome>
  );
}

/* ================================================================== *
 * 6) AI MODEL GOVERNANCE — restricted registry & controls.
 * ================================================================== */

interface GovModel {
  name: string; version: string; trained: string; status: "Approved" | "Shadow" | "Retired";
  accuracy: number; drift: "Low" | "Rising" | "High"; retrained: string; owner: string; override: number;
}

const GOV_MODELS: GovModel[] = [
  { name: "risk-rank", version: "v2.3", trained: "Apr 2024 – Mar 2026", status: "Approved", accuracy: 91, drift: "Low", retrained: "12 Aug 2026", owner: "Enforcement Analytics", override: 14 },
  { name: "anomaly-iforest", version: "v1.8", trained: "Jan 2025 – Jun 2026", status: "Approved", accuracy: 86, drift: "Rising", retrained: "01 Jul 2026", owner: "Production Cell", override: 23 },
  { name: "doc-extract", version: "v3.1", trained: "Jul 2023 – Feb 2026", status: "Approved", accuracy: 94, drift: "Low", retrained: "20 Jun 2026", owner: "Registrations IT", override: 9 },
  { name: "assist-rag", version: "v1.4", trained: "KB snapshot Jun 2026", status: "Shadow", accuracy: 79, drift: "High", retrained: "—", owner: "Helpdesk Digital", override: 31 },
];

const DRIFT_TONE: Record<GovModel["drift"], string> = { Low: OK, Rising: WARN, High: BAD };
const GOV_STATUS_TONE: Record<GovModel["status"], string> = { Approved: OK, Shadow: WARN, Retired: "bg-surface-container text-on-surface-variant" };

export function AIModelGovernance({ module, screen }: { module: Module; screen: Screen }) {
  const [selName, setSelName] = useState(GOV_MODELS[0].name);
  const sel = GOV_MODELS.find((m) => m.name === selName)!;

  return (
    <ScreenChrome module={module} screen={screen} subtitle="Model registry & controls · restricted">
      <div className="flex items-start gap-space-sm bg-navy-subtle border border-navy-dark/20 rounded-xl p-space-sm">
        <Icon name="shield" size={18} className="text-navy-dark shrink-0 mt-0.5" />
        <p className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">Restricted view.</span> AI model governance is separate from business insights and limited to authorised model owners, administrators and auditors.</p>
      </div>

      <Card title="Model registry">
        <div className="overflow-x-auto app-scroll">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle">
                {["Model", "Version", "Status", "Accuracy", "Drift", "Last retrain", "Override rate", ""].map((c) => (
                  <th key={c} className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide py-2 pr-space-md whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GOV_MODELS.map((m) => (
                <tr key={m.name} className={`border-b border-border-subtle/60 cursor-pointer hover:bg-surface-container-low ${m.name === selName ? "bg-primary-container/25" : ""}`} onClick={() => setSelName(m.name)}>
                  <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface font-semibold whitespace-nowrap">{m.name}</td>
                  <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface-variant">{m.version}</td>
                  <td className="py-2.5 pr-space-md"><Status label={m.status} tone={GOV_STATUS_TONE[m.status]} /></td>
                  <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface">{m.accuracy}%</td>
                  <td className="py-2.5 pr-space-md"><Status label={m.drift} tone={DRIFT_TONE[m.drift]} /></td>
                  <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">{m.retrained}</td>
                  <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface">{m.override}%</td>
                  <td className="py-2.5 pr-space-md"><Icon name="chevron_right" size={16} className="text-outline" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
        <Card title={`${sel.name} ${sel.version}`} action={<Status label={sel.status} tone={GOV_STATUS_TONE[sel.status]} />}>
          <div className="space-y-space-sm">
            <Row label="Training-data period" value={sel.trained} />
            <Row label="Responsible owner" value={sel.owner} />
            <Row label="Last retraining" value={sel.retrained} />
            <div className="flex items-center justify-between"><span className="font-label-sm text-label-sm text-on-surface-variant">Model drift</span><Status label={sel.drift} tone={DRIFT_TONE[sel.drift]} /></div>
            <Bar label="Accuracy" value={sel.accuracy} tone="bg-tertiary" suffix="%" />
            <Bar label="Human override rate" value={sel.override} tone={sel.override > 25 ? "bg-error" : "bg-solar-gold-dark"} suffix="%" />
          </div>
        </Card>

        <div className="space-y-space-md">
          <Card title="Deployment history">
            <div className="space-y-space-sm">
              {[
                { v: sel.version, when: "Current · production", tone: OK },
                { v: "v" + (parseFloat(sel.version.slice(1)) - 0.1).toFixed(1), when: "Previous · retired", tone: "bg-surface-container text-on-surface-variant" },
                { v: "v" + (parseFloat(sel.version.slice(1)) - 0.2).toFixed(1), when: "Archived", tone: "bg-surface-container text-on-surface-variant" },
              ].map((d) => (
                <div key={d.v} className="flex items-center justify-between bg-surface-container-low rounded-lg p-space-sm">
                  <span className="font-body-sm text-body-sm text-on-surface font-semibold">{sel.name} {d.v}</span>
                  <Status label={d.when} tone={d.tone} />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Controls &amp; evidence">
            <div className="flex flex-wrap gap-space-sm mb-space-sm">
              <button type="button" className="flex items-center gap-1.5 bg-error-container text-on-error-container font-label-md text-label-md font-semibold py-2 px-space-md rounded-lg hover:bg-error hover:text-on-error"><Icon name="undo" size={16} /> Roll back version</button>
              <button type="button" className="flex items-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md py-2 px-space-md rounded-lg hover:bg-forest-light"><Icon name="pause_circle" size={16} /> Pause model</button>
            </div>
            <div className="space-y-1.5">
              {["Fairness assessment — passed (Jun 2026)", "Explainability report (SHAP) available", "Bias audit — no protected-attribute leakage"].map((e) => (
                <div key={e} className="flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface"><Icon name="verified" size={15} className="text-tertiary shrink-0" /> {e}</div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </ScreenChrome>
  );
}
