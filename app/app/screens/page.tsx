"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useRole } from "@/components/app/RoleContext";
import { useLang } from "@/components/i18n/LangProvider";
import { MODULES, SCREEN_COUNT, canRoleSee } from "@/lib/screens";

export default function AllScreensPage() {
  const { role } = useRole();
  const { t } = useLang();
  const [q, setQ] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);

  const query = q.trim().toLowerCase();
  const sub = t("app.allScreensSub").replace("{total}", String(SCREEN_COUNT)).replace("{modules}", String(MODULES.length));

  return (
    <div className="p-space-md lg:p-space-lg space-y-space-md">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">{t("app.allScreensTitle")}</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{sub}</p>
        </div>
        <div className="flex items-center gap-space-sm">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline"><Icon name="search" size={18} /></div>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("app.filterScreens")} className="pl-10 pr-3 py-2 rounded-lg bg-surface-card font-body-sm text-body-sm outline-none shadow-sm" />
          </div>
          <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface cursor-pointer bg-surface-card px-space-sm py-2 rounded-lg shadow-sm">
            <input type="checkbox" checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} className="accent-primary" />
            {t("app.myAccessOnly")}
          </label>
        </div>
      </div>

      <div className="space-y-space-md">
        {MODULES.map((m) => {
          const screens = m.screens.filter(
            (s) =>
              (!onlyMine || canRoleSee(s, role)) &&
              (query === "" || s.name.toLowerCase().includes(query) || m.name.toLowerCase().includes(query))
          );
          if (screens.length === 0) return null;
          return (
            <div key={m.id} className="bg-surface-card rounded-xl shadow-sm p-space-md">
              <div className="flex items-center gap-space-sm mb-space-sm">
                <span className="w-9 h-9 rounded-lg bg-forest-light text-primary flex items-center justify-center">
                  <Icon name={m.icon} size={20} fill />
                </span>
                <h2 className="font-title-lg text-title-lg text-on-surface">{t(`module.${m.id}`)}</h2>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{screens.length} / {m.screens.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-xs">
                {screens.map((s) => {
                  const visible = canRoleSee(s, role);
                  return (
                    <Link
                      key={s.id}
                      href={`/app/${m.id}/${s.id}`}
                      className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-all ${
                        visible ? "bg-surface-container-low hover:bg-forest-light hover:text-forest-dark" : "bg-surface-container-low/60 opacity-60"
                      }`}
                    >
                      <Icon name={visible ? "chevron_right" : "lock"} size={16} className={visible ? "text-primary" : "text-outline"} />
                      <span className="font-body-sm text-body-sm">{s.name}</span>
                      <span className="ml-auto font-label-sm text-label-sm text-on-surface-variant">{s.perms[role]}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
