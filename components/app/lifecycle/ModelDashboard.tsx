"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Card, FakeTable, ScreenChrome } from "@/components/app/ScreenScaffold";
import { useLifecycle } from "@/components/app/LifecycleStore";
import { Module, Screen } from "@/lib/screens";
import { STAGE_META } from "@/lib/mock/lifecycle";
import { PipelineBar, StageBadge } from "./shared";

export function ModelDashboard({ module, screen }: { module: Module; screen: Screen }) {
  const { apps, reset } = useLifecycle();
  const active = apps.filter((a) => a.stage === "active").length;
  const inFlight = apps.filter((a) => a.stage !== "active" && a.stage !== "rejected").length;
  const returned = apps.filter((a) => a.returned).length;

  const actions = (
    <div className="flex items-center gap-space-sm">
      <button onClick={reset} className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1.5 hover:bg-surface-container-high" type="button">
        <Icon name="restart_alt" size={18} /> Reset demo
      </button>
      <Link href="/app/model-label/new-model-application" className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1.5 hover:bg-forest-dark shadow-sm">
        <Icon name="add" size={18} /> New application
      </Link>
    </div>
  );

  return (
    <ScreenChrome module={module} screen={screen} actions={actions} subtitle="Live model & label pipeline">
      <div className="space-y-space-md">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
          <Kpi icon="pending_actions" label="In progress" value={inFlight} tone="text-primary" />
          <Kpi icon="undo" label="Returned" value={returned} tone="text-solar-gold-dark" />
          <Kpi icon="verified" label="Active permissions" value={active} tone="text-success" />
          <Kpi icon="inventory_2" label="Total models" value={apps.length} tone="text-secondary" />
        </div>

        <Card title="Pipeline by stage">
          <PipelineBar apps={apps} />
        </Card>

        <Card title="All applications" action={<span className="font-label-sm text-label-sm text-on-surface-variant">{apps.length} models</span>}>
          <FakeTable
            columns={["Reference", "Brand / Model", "ISEER", "Stage", "Updated", ""]}
            rows={apps.map((a) => [
              <span key="id" className="font-mono">{a.id}</span>,
              <div key="m">
                <div className="font-semibold text-on-surface">{a.brand}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">{a.model}</div>
              </div>,
              a.declaredIseer.toFixed(2),
              <StageBadge key="s" app={a} />,
              a.updatedAt,
              <Link
                key="open"
                href={a.stage === "active" || a.stage === "rejected"
                  ? `/app/model-label/label-preview?id=${a.id}`
                  : `/app/model-label/${STAGE_META[a.stage].queue ? stageScreen(a.stage) : "iame-scrutiny"}?id=${a.id}`}
                className="text-primary hover:underline font-label-sm text-label-sm inline-flex items-center gap-1"
              >
                Open <Icon name="arrow_forward" size={14} />
              </Link>,
            ])}
          />
        </Card>
      </div>
    </ScreenChrome>
  );
}

function stageScreen(stage: string): string {
  return {
    fee_due: "model-payment",
    iame_scrutiny: "iame-scrutiny",
    bee_scrutiny: "bee-scrutiny",
    approval: "director-approval",
    rating: "rating-calculation",
    label: "label-preview",
  }[stage] ?? "iame-scrutiny";
}

function Kpi({ icon, label, value, tone }: { icon: string; label: string; value: number; tone: string }) {
  return (
    <div className="bg-surface-card rounded-xl shadow-sm p-space-md">
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>
        <Icon name={icon} size={18} className={tone} />
      </div>
      <div className={`font-headline-md text-headline-md font-bold ${tone} mt-1`}>{value}</div>
    </div>
  );
}
