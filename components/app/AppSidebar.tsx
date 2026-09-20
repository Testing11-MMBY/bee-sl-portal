"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Emblem } from "@/components/chrome/Emblem";
import { modulesForRole } from "@/lib/screens";
import { useRole } from "./RoleContext";
import { useLang } from "@/components/i18n/LangProvider";

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { role } = useRole();
  const { t } = useLang();
  const pathname = usePathname();
  const modules = modulesForRole(role);

  // Which module is open in the current route
  const activeModule = pathname.split("/")[2];
  const [open, setOpen] = useState<string | null>(activeModule ?? "identity");

  return (
    <nav className="flex flex-col h-full bg-forest-dark text-forest-light">
      <Link href="/app" className="flex items-center gap-space-sm px-space-md h-[60px] shrink-0 border-b border-white/10" onClick={onNavigate}>
        <Emblem size={34} invert />
        <div className="leading-tight">
          <div className="font-title-lg text-title-lg text-on-primary">BEE S&L</div>
          <div className="font-label-sm text-label-sm text-forest-light/70">{t("app.officerConsole")}</div>
        </div>
      </Link>

      <div className="flex-1 overflow-y-auto app-scroll py-space-sm">
        <SidebarLink href="/app" icon="dashboard" label={t("app.overview")} active={pathname === "/app"} onNavigate={onNavigate} />
        <SidebarLink href="/app/screens" icon="apps" label={t("app.allScreens")} active={pathname === "/app/screens"} onNavigate={onNavigate} />

        <div className="mt-space-sm">
          {modules.map((m) => {
            const isOpen = open === m.id;
            const inModule = activeModule === m.id;
            return (
              <div key={m.id}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : m.id)}
                  className={`w-full flex items-center gap-space-sm px-space-md py-2 text-left transition-colors ${
                    inModule ? "text-on-primary" : "text-forest-light hover:text-on-primary"
                  }`}
                >
                  <Icon name={m.icon} size={20} fill={inModule} />
                  <span className="flex-1 font-label-lg text-label-lg">{t(`module.${m.id}`)}</span>
                  <span className="font-label-sm text-label-sm text-forest-light/50">{m.screens.length}</span>
                  <Icon name={isOpen ? "expand_less" : "expand_more"} size={18} />
                </button>
                {isOpen && (
                  <div className="pb-space-xs">
                    {m.screens.map((sc) => {
                      const href = `/app/${m.id}/${sc.id}`;
                      const active = pathname === href;
                      return (
                        <Link
                          key={sc.id}
                          href={href}
                          onClick={onNavigate}
                          className={`flex items-center gap-space-sm pl-[38px] pr-space-md py-1.5 font-body-sm text-body-sm transition-colors ${
                            active
                              ? "bg-primary-container text-on-primary font-semibold"
                              : "text-forest-light/80 hover:text-on-primary hover:bg-white/5"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? "bg-solar-gold" : "bg-forest-light/30"}`} />
                          {sc.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Link href="/" className="flex items-center gap-space-sm px-space-md py-space-sm border-t border-white/10 text-forest-light/80 hover:text-on-primary font-label-md text-label-md shrink-0" onClick={onNavigate}>
        <Icon name="public" size={18} /> {t("app.publicPortal")}
      </Link>
    </nav>
  );
}

function SidebarLink({
  href, icon, label, active, onNavigate,
}: {
  href: string; icon: string; label: string; active: boolean; onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-space-sm px-space-md py-2 font-label-lg text-label-lg transition-colors ${
        active ? "bg-primary-container text-on-primary" : "text-forest-light hover:text-on-primary hover:bg-white/5"
      }`}
    >
      <Icon name={icon} size={20} fill={active} /> {label}
    </Link>
  );
}
