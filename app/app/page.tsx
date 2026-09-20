"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useRole } from "@/components/app/RoleContext";
import { useLang } from "@/components/i18n/LangProvider";
import { modulesForRole, countForRole, SCREEN_COUNT } from "@/lib/screens";

export default function AppOverview() {
  const { role } = useRole();
  const { t } = useLang();
  const modules = modulesForRole(role);
  const visible = countForRole(role);
  const summary = t("app.accessSummary")
    .replace("{visible}", String(visible))
    .replace("{total}", String(SCREEN_COUNT))
    .replace("{modules}", String(modules.length));

  return (
    <div className="p-space-md lg:p-space-lg space-y-space-lg">
      {/* Welcome */}
      <div className="bg-forest-dark text-on-primary rounded-xl p-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">{t("app.officerConsole")}</div>
          <h1 className="font-headline-lg text-headline-lg font-bold">{t("app.welcome").replace("{name}", t(`role.${role}`))}</h1>
          <p className="font-body-md text-body-md text-forest-light/85 mt-1">{summary}</p>
        </div>
        <div className="flex items-center gap-space-md">
          <div className="text-center">
            <div className="font-display-lg text-display-lg font-bold text-solar-gold leading-none">{visible}</div>
            <div className="font-label-sm text-label-sm text-forest-light/80">{t("app.screensForYou")}</div>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
        {[
          { icon: "inbox", label: t("app.kpi.queue"), value: "42", tone: "text-primary" },
          { icon: "hourglass_top", label: t("app.kpi.approval"), value: "9", tone: "text-solar-gold-dark" },
          { icon: "warning", label: t("app.kpi.sla"), value: "3", tone: "text-error" },
          { icon: "task_alt", label: t("app.kpi.cleared"), value: "218", tone: "text-tertiary" },
        ].map((k) => (
          <div key={k.label} className="bg-surface-card rounded-xl shadow-sm p-space-md">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{k.label}</span>
              <Icon name={k.icon} size={18} className={k.tone} />
            </div>
            <div className={`font-headline-md text-headline-md font-bold ${k.tone} mt-1`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Modules grid */}
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-space-md">{t("app.modules")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {modules.map((m) => (
            <div key={m.id} className="bg-surface-card rounded-xl shadow-sm p-space-md hover:shadow-md transition-all">
              <div className="flex items-center gap-space-sm mb-space-sm">
                <span className="w-10 h-10 rounded-lg bg-forest-light text-primary flex items-center justify-center">
                  <Icon name={m.icon} size={22} fill />
                </span>
                <div>
                  <h3 className="font-title-lg text-title-lg text-on-surface">{t(`module.${m.id}`)}</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{m.screens.length} {t("app.screensWord")}</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">{m.blurb}</p>
              <div className="flex flex-wrap gap-1">
                {m.screens.slice(0, 3).map((s) => (
                  <Link key={s.id} href={`/app/${m.id}/${s.id}`} className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-forest-light hover:text-forest-dark">
                    {s.name}
                  </Link>
                ))}
                {m.screens.length > 3 && (
                  <Link href={`/app/${m.id}/${m.screens[0].id}`} className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                    +{m.screens.length - 3} {t("app.more")}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
