"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Card, Status, OK, WARN } from "@/components/app/ScreenScaffold";
import { ROLES } from "@/lib/roles";

/* ================================================================== *
 * Access-management workspace (audit gap fill). Restricted to
 * Administrator. Consolidates role assignment, delegation and access
 * review — the three former standalone catalogue screens — into one
 * workspace, with maker-checker on role changes.
 * ================================================================== */

interface User { name: string; email: string; role: string; org: string; status: "Active" | "Suspended"; lastActive: string; }
const USERS: User[] = [
  { name: "R. Menon", email: "r.menon@bee.gov.in", role: "reviewer", org: "BEE HQ", status: "Active", lastActive: "Today 09:10" },
  { name: "A. Kapoor", email: "a.kapoor@bee.gov.in", role: "programme", org: "BEE North", status: "Active", lastActive: "Today 08:42" },
  { name: "S. Rao", email: "s.rao@sda.mh.gov.in", role: "sda", org: "SDA Maharashtra", status: "Active", lastActive: "Yesterday 17:20" },
  { name: "Nova Cool (portal)", email: "sl@novacool.example", role: "manufacturer", org: "Nova Cool Appliances Ltd.", status: "Active", lastActive: "Today 07:05" },
  { name: "T. Iyer", email: "t.iyer@bee.gov.in", role: "finance", org: "BEE HQ", status: "Suspended", lastActive: "12 Sep" },
];

interface Delegation { from: string; to: string; scope: string; from_d: string; to_d: string; }
const DELEGATIONS: Delegation[] = [
  { from: "Director (BEE)", to: "R. Menon (Reviewer)", scope: "Model approvals up to 3★", from_d: "20 Sep 2026", to_d: "27 Sep 2026" },
  { from: "Secretary", to: "Director (BEE)", scope: "Enforcement closure", from_d: "18 Sep 2026", to_d: "25 Sep 2026" },
];

interface Review { user: string; role: string; lastUsed: string; risk: "Low" | "Review"; }
const REVIEWS: Review[] = [
  { user: "T. Iyer", role: "BEE Finance", lastUsed: "12 days ago", risk: "Review" },
  { user: "S. Rao", role: "SDA Maharashtra", lastUsed: "1 day ago", risk: "Low" },
  { user: "A. Kapoor", role: "Programme Officer", lastUsed: "Today", risk: "Low" },
];

const roleName = (k: string) => ROLES.find((r) => r.key === k)?.name ?? k;

export function AccessManagement() {
  const [tab, setTab] = useState<"users" | "delegation" | "review">("users");
  const [pending, setPending] = useState<string | null>(null);

  return (
    <div className="p-space-md lg:p-space-lg space-y-space-md">
      <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
        <Link href="/app" className="hover:text-primary">Console</Link>
        <Icon name="chevron_right" size={14} />
        <span>Administration</span>
        <Icon name="chevron_right" size={14} />
        <span className="text-on-surface font-semibold">Access management</span>
      </div>
      <div className="flex items-start gap-space-sm">
        <span className="w-11 h-11 rounded-lg bg-forest-light text-primary flex items-center justify-center shrink-0"><Icon name="manage_accounts" size={24} fill /></span>
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Access management</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Users, roles, delegation and access review — one restricted workspace.</p>
        </div>
      </div>

      <div className="flex items-start gap-space-sm bg-navy-subtle border border-navy-dark/20 rounded-xl p-space-sm">
        <Icon name="shield" size={18} className="text-navy-dark shrink-0 mt-0.5" />
        <p className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">Administrator-only.</span> Role changes require maker-checker approval; a single administrator cannot grant themselves business-approval powers.</p>
      </div>

      <div className="flex gap-1 border-b border-border-subtle">
        {([["users", "Users & roles", "group"], ["delegation", "Delegation", "swap_horiz"], ["review", "Access review", "fact_check"]] as const).map(([id, label, icon]) => (
          <button key={id} type="button" onClick={() => setTab(id)} className={`flex items-center gap-1.5 px-space-sm py-2.5 font-label-md text-label-md whitespace-nowrap border-b-2 transition-colors ${tab === id ? "border-primary text-primary font-semibold" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>
            <Icon name={icon} size={16} fill={tab === id} /> {label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <Card title="Users & role assignment">
          <div className="overflow-x-auto app-scroll">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b border-border-subtle">{["User", "Organisation", "Role", "Status", "Last active", ""].map((h) => <th key={h} className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide py-2 pr-space-md whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody>
                {USERS.map((u) => (
                  <tr key={u.email} className="border-b border-border-subtle/60">
                    <td className="py-2.5 pr-space-md"><div className="font-body-sm text-body-sm text-on-surface font-semibold">{u.name}</div><div className="font-label-sm text-label-sm text-on-surface-variant">{u.email}</div></td>
                    <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface-variant">{u.org}</td>
                    <td className="py-2.5 pr-space-md font-body-sm text-body-sm text-on-surface">{roleName(u.role)}</td>
                    <td className="py-2.5 pr-space-md"><Status label={u.status} tone={u.status === "Active" ? OK : WARN} /></td>
                    <td className="py-2.5 pr-space-md font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">{u.lastActive}</td>
                    <td className="py-2.5 pr-space-md"><button type="button" onClick={() => setPending(u.email)} className="font-label-sm text-label-sm text-primary hover:underline">Change role</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pending && (
            <div className="mt-space-md bg-solar-gold-light/50 border border-solar-gold/40 rounded-lg p-space-sm">
              <div className="flex items-center gap-space-sm mb-1"><Icon name="hourglass_top" size={16} className="text-solar-gold-dark" /><span className="font-label-md text-label-md text-on-surface font-semibold">Role change for {pending} — submitted for checker approval</span></div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">A second administrator must approve. Change is not applied until approved and logged to the audit trail.</p>
              <button type="button" onClick={() => setPending(null)} className="mt-space-sm font-label-sm text-label-sm text-primary hover:underline">Dismiss</button>
            </div>
          )}
        </Card>
      )}

      {tab === "delegation" && (
        <Card title="Active delegations" action={<button className="flex items-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md py-1.5 px-space-sm rounded-lg hover:bg-forest-light"><Icon name="add" size={16} /> New delegation</button>}>
          <div className="space-y-space-sm">
            {DELEGATIONS.map((d, i) => (
              <div key={i} className="flex flex-wrap items-center gap-space-sm bg-surface-container-low rounded-lg p-space-sm">
                <div className="flex-1 min-w-0"><div className="font-body-sm text-body-sm text-on-surface font-medium">{d.from} <Icon name="arrow_forward" size={14} className="text-outline mx-1" /> {d.to}</div><div className="font-label-sm text-label-sm text-on-surface-variant">{d.scope}</div></div>
                <div className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">{d.from_d} → {d.to_d}</div>
                <button className="font-label-sm text-label-sm text-error hover:underline">Revoke</button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "review" && (
        <Card title="Periodic access review">
          <div className="space-y-space-sm">
            {REVIEWS.map((r) => (
              <div key={r.user} className="flex flex-wrap items-center gap-space-sm bg-surface-container-low rounded-lg p-space-sm">
                <div className="flex-1 min-w-0"><div className="font-body-sm text-body-sm text-on-surface font-semibold">{r.user}</div><div className="font-label-sm text-label-sm text-on-surface-variant">{r.role} · last used {r.lastUsed}</div></div>
                <Status label={r.risk} tone={r.risk === "Low" ? OK : WARN} />
                <div className="flex gap-1.5">
                  <button className="font-label-sm text-label-sm bg-success-light text-success px-2 py-1 rounded hover:bg-tertiary hover:text-on-primary">Confirm</button>
                  <button className="font-label-sm text-label-sm bg-error-container text-on-error-container px-2 py-1 rounded hover:bg-error hover:text-on-error">Revoke</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
