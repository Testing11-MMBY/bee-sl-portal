"use client";

import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Stars";
import { Card, FakeTable, ScreenChrome, Status, OK, WARN } from "@/components/app/ScreenScaffold";
import { useLifecycle } from "@/components/app/LifecycleStore";
import { Module, Screen } from "@/lib/screens";
import { ModelApplication, computeStars } from "@/lib/mock/lifecycle";
import { StageBadge, Timeline } from "./shared";

export type DetailVariant =
  | "test-reports"
  | "documents"
  | "performance"
  | "lab"
  | "label-details"
  | "approval-note"
  | "approval-letter"
  | "renewal";

function AppPicker({ apps, selectedId, screenId }: { apps: ModelApplication[]; selectedId: string; screenId: string }) {
  return (
    <Card title={`Models (${apps.length})`}>
      <div className="space-y-space-xs">
        {apps.map((a) => (
          <a key={a.id} href={`/app/model-label/${screenId}?id=${a.id}`}
            className={`block p-space-sm rounded-lg transition-all ${a.id === selectedId ? "bg-forest-light" : "bg-surface-container-low hover:bg-surface-container"}`}>
            <div className="font-title-lg text-title-lg text-on-surface">{a.brand}</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">{a.model} · {a.id}</div>
          </a>
        ))}
      </div>
    </Card>
  );
}

export function ApplicationDetailScreen({ module, screen, variant }: { module: Module; screen: Screen; variant: DetailVariant }) {
  const { apps, byId } = useLifecycle();
  const params = useSearchParams();
  const selected = byId(params.get("id")) ?? apps[0];

  return (
    <ScreenChrome module={module} screen={screen} subtitle={SUBTITLES[variant]}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        <AppPicker apps={apps} selectedId={selected?.id ?? ""} screenId={screen.id} />
        <div className="lg:col-span-2 space-y-space-md">
          {!selected ? (
            <Card><p className="font-body-md text-body-md text-on-surface-variant">No model selected.</p></Card>
          ) : (
            <Body variant={variant} app={selected} />
          )}
        </div>
      </div>
    </ScreenChrome>
  );
}

const SUBTITLES: Record<DetailVariant, string> = {
  "test-reports": "Laboratory test evidence",
  documents: "Document repository & versions",
  performance: "Declared performance parameters",
  lab: "Test laboratory accreditation",
  "label-details": "Bilingual label template fields",
  "approval-note": "Scrutiny & approval note",
  "approval-letter": "Generated approval letter",
  renewal: "Renewal or degradation request",
};

function Head({ app }: { app: ModelApplication }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface">{app.brand}</h3>
        <div className="font-label-sm text-label-sm text-on-surface-variant">{app.model} · {app.id}</div>
      </div>
      <StageBadge app={app} />
    </div>
  );
}

function Body({ variant, app }: { variant: DetailVariant; app: ModelApplication }) {
  switch (variant) {
    case "test-reports":
      return (
        <Card><Head app={app} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-md mt-space-md">
            <Fact k="Cooling capacity" v={`${app.capacityW} W`} />
            <Fact k="Power input" v={`${app.powerInputW} W`} />
            <Fact k="Declared ISEER" v={app.declaredIseer.toFixed(2)} />
            <Fact k="Reference standard" v={app.standard} />
            <Fact k="Test lab" v={app.lab} />
            <Fact k="Test date" v={app.testDate} />
          </div>
          <div className="mt-space-md">
            <FakeTable columns={["Document", "Version", "Malware scan"]} rows={app.documents.map((d) => [
              d.name, d.version, <Status key={d.name} label={d.scan === "clean" ? "Clean" : "Scanning"} tone={d.scan === "clean" ? OK : WARN} />,
            ])} />
          </div>
        </Card>
      );
    case "documents":
      return (
        <Card><Head app={app} />
          <div className="mt-space-md">
            <FakeTable columns={["Document", "Version", "Malware scan", "Action"]} rows={app.documents.map((d) => [
              <span key="n" className="flex items-center gap-1.5"><Icon name="description" size={16} className="text-secondary" /> {d.name}</span>,
              d.version,
              <Status key="s" label={d.scan === "clean" ? "Clean" : "Scanning"} tone={d.scan === "clean" ? OK : WARN} />,
              <button key="a" className="text-primary hover:underline font-label-sm text-label-sm">Preview</button>,
            ])} />
          </div>
        </Card>
      );
    case "performance":
      return (
        <Card><Head app={app} />
          <div className="mt-space-md">
            <FakeTable columns={["Parameter", "Declared", "Within range"]} rows={[
              ["Cooling capacity (W)", String(app.capacityW), <Status key="1" label="Yes" tone={OK} />],
              ["Power input (W)", String(app.powerInputW), <Status key="2" label="Yes" tone={OK} />],
              ["ISEER", app.declaredIseer.toFixed(2), <Status key="3" label={app.declaredIseer >= 3.1 ? "Yes" : "No"} tone={OK} />],
              ["Refrigerant", "R-32", <Status key="4" label="Yes" tone={OK} />],
            ]} />
          </div>
        </Card>
      );
    case "lab":
      return (
        <Card><Head app={app} />
          <div className="grid grid-cols-2 gap-space-md mt-space-md">
            <Fact k="Laboratory" v={app.lab} />
            <Fact k="Accreditation" v="NABL — valid" />
            <Fact k="Scope" v={app.category} />
            <Fact k="Valid on test date" v="Yes" />
          </div>
          <div className="mt-space-md bg-success-light text-success rounded-lg p-space-sm font-body-sm text-body-sm flex items-center gap-space-sm">
            <Icon name="verified" size={18} /> Accreditation confirmed valid on the declared test date ({app.testDate}).
          </div>
        </Card>
      );
    case "label-details": {
      const stars = app.rating ?? computeStars(app.declaredIseer);
      return (
        <Card><Head app={app} />
          <div className="grid grid-cols-2 gap-space-md mt-space-md">
            <Fact k="Star rating" v={<Stars value={stars} size={18} />} />
            <Fact k="ISEER on label" v={app.declaredIseer.toFixed(2)} />
            <Fact k="Brand (EN)" v={app.brand} />
            <Fact k="Model (EN)" v={app.model} />
            <Fact k="Label period" v="Valid till Dec 2028" />
            <Fact k="Registration ID" v={app.regId ?? "pending"} />
          </div>
        </Card>
      );
    }
    case "approval-note":
      return (
        <Card><Head app={app} />
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-md">
            Consolidated scrutiny note. Findings and decisions are captured with actor and timestamp.
          </p>
          <ul className="mt-space-sm space-y-space-sm">
            {app.findings.map((f, i) => (
              <li key={i} className="flex items-center gap-space-sm font-body-sm text-body-sm">
                <Icon name={f.ok ? "check_circle" : "error"} size={18} fill className={f.ok ? "text-primary" : "text-solar-gold-dark"} />
                <span className="text-on-surface">{f.text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-space-md"><Timeline app={app} /></div>
        </Card>
      );
    case "approval-letter":
      return (
        <Card><Head app={app} />
          {app.stage === "active" ? (
            <div className="mt-space-md border border-border-strong rounded-lg p-space-lg font-body-md text-body-md text-on-surface leading-relaxed">
              <div className="text-center font-headline-sm text-headline-sm text-primary mb-space-md">Bureau of Energy Efficiency</div>
              <p>This is to certify that model <strong>{app.model}</strong> of <strong>{app.brand}</strong> ({app.category}) has been granted a BEE star-label permission with a rating of <strong>{app.rating}★</strong> (ISEER {app.declaredIseer.toFixed(2)}).</p>
              <p className="mt-space-sm">Registration ID: <strong>{app.regId}</strong> · QR batch: <strong>{app.qrBatch}</strong>. Valid till December 2028, subject to production and enforcement compliance.</p>
              <div className="mt-space-lg flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Digitally signed (eSign / DSC)</span>
                <Icon name="verified" size={28} fill className="text-primary" />
              </div>
            </div>
          ) : (
            <div className="mt-space-md bg-surface-container-low rounded-lg p-space-lg text-center text-on-surface-variant">
              <Icon name="hourglass_top" size={32} className="text-outline" />
              <p className="font-body-sm text-body-sm mt-1">The approval letter is generated once the model reaches an active permission. This model is at <span className="inline-block align-middle"><StageBadge app={app} /></span>.</p>
            </div>
          )}
        </Card>
      );
    case "renewal":
      return (
        <Card><Head app={app} />
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-md">
            Renewal or degradation references the prior approval and effective policy, creating a new permission version.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mt-space-md">
            <Fact k="Current rating" v={<Stars value={app.rating ?? computeStars(app.declaredIseer)} size={18} />} />
            <Fact k="Current ISEER" v={app.declaredIseer.toFixed(2)} />
          </div>
          <div className="mt-space-md flex items-center gap-space-sm">
            <button className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1.5"><Icon name="autorenew" size={18} /> Initiate renewal</button>
            <button className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1.5"><Icon name="trending_down" size={18} /> Degrade rating</button>
          </div>
        </Card>
      );
  }
}

/** Family models — applications grouped by family. */
export function FamilyModels({ module, screen }: { module: Module; screen: Screen }) {
  const { apps } = useLifecycle();
  const families = Array.from(new Set(apps.map((a) => a.family)));
  return (
    <ScreenChrome module={module} screen={screen} subtitle="Models grouped by declared family">
      <div className="space-y-space-md">
        {families.map((fam) => {
          const members = apps.filter((a) => a.family === fam);
          return (
            <Card key={fam} title={fam} action={<span className="font-label-sm text-label-sm text-on-surface-variant">{members.length} model(s)</span>}>
              <FakeTable columns={["Reference", "Model", "ISEER", "Stage"]} rows={members.map((a) => [
                <span key="i" className="font-mono">{a.id}</span>, a.model, a.declaredIseer.toFixed(2), <StageBadge key="s" app={a} />,
              ])} />
            </Card>
          );
        })}
      </div>
    </ScreenChrome>
  );
}

function Fact({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="bg-surface-container-low rounded-lg p-space-sm">
      <div className="font-label-sm text-label-sm text-on-surface-variant">{k}</div>
      <div className="font-title-lg text-title-lg text-on-surface">{v}</div>
    </div>
  );
}
