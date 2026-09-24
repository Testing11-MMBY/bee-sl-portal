"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Card, FakeTable, ScreenChrome, Status, OK, WARN, BAD, INFO } from "@/components/app/ScreenScaffold";
import { useLifecycle } from "@/components/app/LifecycleStore";
import { useRole } from "@/components/app/RoleContext";
import { Module, Screen } from "@/lib/screens";
import { STAGE_META } from "@/lib/mock/lifecycle";
import { StageBadge } from "./shared";

const PR_TONE: Record<string, string> = { High: BAD, Medium: WARN, Low: INFO };

/** Personal inbox & team queue. */
export function WorkflowInbox({ module, screen, scope }: { module: Module; screen: Screen; scope: "personal" | "team" }) {
  const { tasks } = useLifecycle();
  const { role } = useRole();
  const [filter, setFilter] = useState<"all" | "overdue" | "returned">("all");

  // Personal inbox = only the tasks THIS role owns (can act on). The team queue
  // keeps the full shared list. Counts below derive from `mine`, so the tabs and
  // the empty state always match what is shown.
  const mine = scope === "personal" ? tasks.filter((t) => t.ownerRoles.includes(role)) : tasks;
  const shown = mine.filter((t) =>
    filter === "all" ? true : filter === "overdue" ? t.overdue : t.priority === "High"
  );

  return (
    <ScreenChrome module={module} screen={screen} subtitle={scope === "personal" ? "Tasks you can act on" : "Shared team queue"}>
      <div className="space-y-space-md">
        <div className="flex items-center gap-space-sm">
          {([
            ["all", `All (${mine.length})`],
            ["overdue", `Overdue (${mine.filter((t) => t.overdue).length})`],
            ["returned", `High priority (${mine.filter((t) => t.priority === "High").length})`],
          ] as const).map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)} className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md ${filter === k ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface"}`}>
              {label}
            </button>
          ))}
        </div>
        <Card>
          {shown.length === 0 ? (
            <div className="py-space-lg text-center">
              <Icon name="inbox" size={28} className="text-outline" />
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {scope === "personal"
                  ? mine.length === 0
                    ? "No tasks are currently assigned to your role."
                    : "No tasks match this filter."
                  : "No tasks in this view."}
              </p>
            </div>
          ) : (
            <FakeTable
              columns={["Task", "Reference", "Queue", "Priority", "Due", ""]}
              rows={shown.map((t) => [
                <span key="t" className="font-medium text-on-surface">{t.title}</span>,
                <span key="r" className="font-mono">{t.appId}</span>,
                t.queue,
                <Status key="p" label={t.priority} tone={PR_TONE[t.priority]} />,
                <span key="d" className={t.overdue ? "text-error font-semibold" : ""}>{t.overdue ? "Overdue" : t.due}</span>,
                <Link key="o" href={`/app/${t.actionModule}/${t.actionScreen}?id=${t.appId}`} className="text-primary hover:underline font-label-sm text-label-sm inline-flex items-center gap-1">
                  Action <Icon name="arrow_forward" size={14} />
                </Link>,
              ])}
            />
          )}
        </Card>
      </div>
    </ScreenChrome>
  );
}

/** Application review — every in-flight application with its stage & next action. */
export function ApplicationReview({ module, screen }: { module: Module; screen: Screen }) {
  const { apps } = useLifecycle();
  const inFlight = apps.filter((a) => a.stage !== "active" && a.stage !== "rejected");
  return (
    <ScreenChrome module={module} screen={screen} subtitle="In-flight applications across all stages">
      <Card title={`In review (${inFlight.length})`}>
        <FakeTable
          columns={["Reference", "Brand / Model", "Stage", "Owner queue", "Next action"]}
          rows={inFlight.map((a) => [
            <span key="id" className="font-mono">{a.id}</span>,
            <div key="m"><div className="font-semibold text-on-surface">{a.brand}</div><div className="font-label-sm text-label-sm text-on-surface-variant">{a.model}</div></div>,
            <StageBadge key="s" app={a} />,
            STAGE_META[a.stage].queue,
            <Link key="n" href={`/app/model-label/${stageScreen(a.stage)}?id=${a.id}`} className="text-primary hover:underline font-label-sm text-label-sm inline-flex items-center gap-1">
              {actionLabel(a.stage)} <Icon name="arrow_forward" size={14} />
            </Link>,
          ])}
        />
      </Card>
    </ScreenChrome>
  );
}

/** Escalation dashboard — overdue / returned items. */
export function EscalationDashboard({ module, screen }: { module: Module; screen: Screen }) {
  const { apps, tasks } = useLifecycle();
  const overdue = tasks.filter((t) => t.overdue);
  const returned = apps.filter((a) => a.returned);
  return (
    <ScreenChrome module={module} screen={screen} subtitle="SLA breaches and returned items">
      <div className="space-y-space-md">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
          <Kpi icon="warning" label="Overdue tasks" value={overdue.length} tone="text-error" />
          <Kpi icon="undo" label="Returned" value={returned.length} tone="text-solar-gold-dark" />
          <Kpi icon="hourglass_top" label="In flight" value={tasks.length} tone="text-primary" />
          <Kpi icon="schedule" label="Avg age (days)" value={4} tone="text-secondary" />
        </div>
        <Card title="Escalated items">
          <FakeTable
            columns={["Reference", "Task", "Stage", "Age", "Escalate to"]}
            rows={overdue.map((t) => [
              <span key="id" className="font-mono">{t.appId}</span>,
              t.title,
              STAGE_META[t.stage].short,
              <span key="a" className="text-error font-semibold">Overdue</span>,
              STAGE_META[t.stage].queue,
            ])}
          />
        </Card>
      </div>
    </ScreenChrome>
  );
}

/** Workflow history — the merged timeline across applications. */
export function WorkflowHistory({ module, screen }: { module: Module; screen: Screen }) {
  const { apps } = useLifecycle();
  const events = apps
    .flatMap((a) => a.timeline.map((e) => ({ ...e, appId: a.id, model: a.model })))
    .slice()
    .reverse();
  return (
    <ScreenChrome module={module} screen={screen} subtitle="Transition history across all applications">
      <Card title={`Events (${events.length})`}>
        <FakeTable
          columns={["When", "Reference", "Model", "Event", "Actor"]}
          rows={events.map((e, i) => [
            e.at,
            <span key={i} className="font-mono">{e.appId}</span>,
            e.model,
            e.label,
            e.actor,
          ])}
        />
      </Card>
    </ScreenChrome>
  );
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

function actionLabel(stage: string): string {
  return {
    fee_due: "Confirm fee",
    iame_scrutiny: "IAME scrutiny",
    bee_scrutiny: "BEE scrutiny",
    approval: "Approve",
    rating: "Compute rating",
    label: "Generate label",
  }[stage] ?? "Open";
}
