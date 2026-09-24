"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Card, Status, OK, WARN, BAD } from "@/components/app/ScreenScaffold";

/* ================================================================== *
 * Ticket Workspace (Phase 3) — one ticket-centric agent screen that
 * folds classification, assignment, communication, escalation,
 * resolution and closure into a single view (DDD IA revision).
 * ================================================================== */

type Priority = "Low" | "Normal" | "High" | "Urgent";
type TStatus = "New" | "In progress" | "Waiting" | "Resolved" | "Closed";

interface Message { who: "requester" | "agent" | "system"; text: string; time: string; internal?: boolean; }

interface Ticket {
  id: string; subject: string; requester: string; org: string; channel: string;
  category: string; subcategory: string; priority: Priority; status: TStatus;
  assignee: string; team: string; created: string; sla: string; slaBreached: boolean;
  conversation: Message[];
}

const PRIORITY_TONE: Record<Priority, string> = {
  Low: "bg-surface-container text-on-surface-variant",
  Normal: "bg-navy-subtle text-navy-dark",
  High: WARN,
  Urgent: BAD,
};
const STATUS_TONE: Record<TStatus, string> = {
  New: "bg-navy-subtle text-navy-dark",
  "In progress": WARN,
  Waiting: "bg-surface-container text-on-surface-variant",
  Resolved: OK,
  Closed: "bg-surface-container text-on-surface-variant",
};

const TICKETS: Ticket[] = [
  {
    id: "TKT-2026-11842", subject: "QR code on my AC shows 'not found'", requester: "Anita Sharma", org: "Consumer",
    channel: "Web portal", category: "Verification", subcategory: "QR / label authenticity", priority: "High", status: "In progress",
    assignee: "You (Helpdesk)", team: "Verification desk", created: "24 Sep 2026, 09:12 IST", sla: "2h 40m left", slaBreached: false,
    conversation: [
      { who: "requester", text: "I scanned the QR on my new AC and it says the label is not found. Is it fake?", time: "09:12" },
      { who: "system", text: "AI assistant suggested category: Verification / QR (confidence 82%).", time: "09:12", internal: true },
      { who: "agent", text: "Thanks for reaching out. Could you share the registration number printed on the label?", time: "09:18" },
      { who: "requester", text: "It says BEE/RAC/2026/10016.", time: "09:24" },
    ],
  },
  {
    id: "TKT-2026-11840", subject: "Unable to upload quarterly production file", requester: "R. Iyer", org: "Nova Cool Appliances Ltd.",
    channel: "Email", category: "Production", subcategory: "Bulk upload error", priority: "Urgent", status: "New",
    assignee: "Unassigned", team: "—", created: "24 Sep 2026, 08:40 IST", sla: "SLA breached", slaBreached: true,
    conversation: [
      { who: "requester", text: "The bulk upload keeps failing with 'schema mismatch'. Deadline is today.", time: "08:40" },
    ],
  },
  {
    id: "TKT-2026-11835", subject: "How do I renew a model registration?", requester: "M. Verma", org: "Sunrise Electra Pvt. Ltd.",
    channel: "Phone", category: "Registrations", subcategory: "Renewal process", priority: "Normal", status: "Waiting",
    assignee: "You (Helpdesk)", team: "Registrations desk", created: "23 Sep 2026, 16:20 IST", sla: "1d 3h left", slaBreached: false,
    conversation: [
      { who: "requester", text: "My 5-star model is expiring next month, what's the renewal process?", time: "16:20" },
      { who: "agent", text: "Shared KB-201 (Renewal walkthrough). Waiting for confirmation.", time: "16:35" },
    ],
  },
];

export default function TicketWorkspace() {
  const [selId, setSelId] = useState(TICKETS[0].id);
  const [reply, setReply] = useState("");
  const [internal, setInternal] = useState(false);
  const t = TICKETS.find((x) => x.id === selId)!;

  return (
    <div className="p-space-md lg:p-space-lg space-y-space-md">
      <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
        <Link href="/app" className="hover:text-primary">Console</Link>
        <Icon name="chevron_right" size={14} />
        <span>Support</span>
        <Icon name="chevron_right" size={14} />
        <span className="text-on-surface font-semibold">Agent workspace</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        {/* Queue */}
        <div>
          <Card title={`Ticket queue · ${TICKETS.length}`}>
            <div className="space-y-1.5">
              {TICKETS.map((x) => {
                const active = x.id === selId;
                return (
                  <button key={x.id} type="button" onClick={() => setSelId(x.id)}
                    className={`w-full text-left p-space-sm rounded-lg transition-colors ${active ? "bg-primary-container/40 ring-1 ring-primary" : "bg-surface-container-low hover:bg-surface-container"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{x.id}</span>
                      <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${PRIORITY_TONE[x.priority]}`}>{x.priority}</span>
                    </div>
                    <div className="font-title-sm text-title-sm text-on-surface mt-0.5 leading-tight">{x.subject}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{x.requester}</span>
                      <span className={`font-label-sm text-label-sm flex items-center gap-1 ${x.slaBreached ? "text-error font-semibold" : "text-on-surface-variant"}`}><Icon name="timer" size={12} /> {x.sla}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 space-y-space-md">
          {/* Header */}
          <div className="bg-surface-card rounded-xl shadow-sm p-space-md">
            <div className="flex items-start justify-between gap-space-md flex-wrap">
              <div>
                <div className="flex items-center gap-space-sm flex-wrap">
                  <h1 className="font-headline-sm text-headline-sm text-on-surface">{t.subject}</h1>
                  <Status label={t.status} tone={STATUS_TONE[t.status]} />
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{t.id} · {t.requester} ({t.org}) · via {t.channel} · {t.created}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg font-label-md text-label-md font-semibold flex items-center gap-1 ${t.slaBreached ? "bg-error-container text-on-error-container" : "bg-surface-container-low text-on-surface"}`}>
                <Icon name="timer" size={15} /> {t.sla}
              </span>
            </div>
          </div>

          {/* Classification + Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <Card title="Classification">
              <div className="space-y-space-sm">
                <SelectRow label="Category" value={t.category} options={["Verification", "Production", "Registrations", "Finance", "Other"]} />
                <SelectRow label="Sub-category" value={t.subcategory} options={[t.subcategory, "General query"]} />
                <SelectRow label="Priority" value={t.priority} options={["Low", "Normal", "High", "Urgent"]} />
              </div>
            </Card>
            <Card title="Assignment &amp; escalation">
              <div className="space-y-space-sm">
                <Detail label="Assigned to" value={t.assignee} />
                <Detail label="Team" value={t.team} />
                <div className="flex gap-space-sm pt-1">
                  <button type="button" className="flex-1 flex items-center justify-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md py-2 rounded-lg hover:bg-forest-light"><Icon name="person_add" size={16} /> Assign to me</button>
                  <button type="button" className="flex items-center justify-center gap-1.5 bg-solar-gold-light text-solar-gold-dark font-label-md text-label-md font-semibold py-2 px-space-sm rounded-lg hover:bg-solar-gold hover:text-on-primary"><Icon name="arrow_upward" size={16} /> Escalate</button>
                </div>
              </div>
            </Card>
          </div>

          {/* Conversation */}
          <Card title="Communication">
            <div className="space-y-space-sm max-h-72 overflow-y-auto app-scroll pr-1">
              {t.conversation.map((m, i) => {
                if (m.who === "system" || m.internal) {
                  return (
                    <div key={i} className="flex items-start gap-space-sm bg-surface-container-low rounded-lg p-space-sm">
                      <Icon name="smart_toy" size={15} className="text-navy-dark shrink-0 mt-0.5" />
                      <div><span className="font-label-sm text-label-sm text-navy-dark font-semibold">Internal · {m.time}</span><p className="font-body-sm text-body-sm text-on-surface">{m.text}</p></div>
                    </div>
                  );
                }
                const isAgent = m.who === "agent";
                return (
                  <div key={i} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[82%] p-space-sm rounded-xl font-body-sm text-body-sm ${isAgent ? "bg-primary-container/50 rounded-tr-none" : "bg-surface-container-low rounded-tl-none"}`}>
                      <div className="font-label-sm text-label-sm text-on-surface-variant mb-0.5">{isAgent ? "Agent" : t.requester} · {m.time}</div>
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border-subtle mt-space-sm pt-space-sm">
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder={internal ? "Add an internal note (not visible to requester)…" : "Type a reply to the requester…"} rows={2}
                className={`w-full px-space-sm py-2 rounded-lg font-body-sm text-body-sm outline-none resize-none ${internal ? "bg-solar-gold-light/40" : "bg-surface-container-low"}`} />
              <div className="flex items-center justify-between mt-space-sm">
                <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface cursor-pointer">
                  <input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} className="accent-primary" /> Internal note
                </label>
                <button type="button" className="flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md font-semibold py-2 px-space-md rounded-lg hover:bg-forest-dark"><Icon name="send" size={16} /> {internal ? "Add note" : "Send reply"}</button>
              </div>
            </div>
          </Card>

          {/* Resolution & closure */}
          <Card title="Resolution &amp; closure">
            <textarea placeholder="Resolution summary (recorded on close)…" rows={2} className="w-full px-space-sm py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm outline-none resize-none" />
            <div className="flex flex-wrap items-center gap-space-sm mt-space-sm">
              <button type="button" className="flex items-center gap-1.5 bg-tertiary text-on-primary font-label-md text-label-md font-semibold py-2 px-space-md rounded-lg hover:opacity-90"><Icon name="check_circle" size={16} /> Mark resolved</button>
              <button type="button" className="flex items-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md py-2 px-space-md rounded-lg hover:bg-forest-light"><Icon name="lock" size={16} /> Close ticket</button>
              <span className="ml-auto flex items-center gap-space-sm font-label-sm text-label-sm text-on-surface-variant">
                CSAT feedback: <Icon name="sentiment_satisfied" size={18} className="text-success" /> <Icon name="sentiment_neutral" size={18} className="text-solar-gold-dark" /> <Icon name="sentiment_dissatisfied" size={18} className="text-error" />
              </span>
            </div>
          </Card>
        </div>
      </div>
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

function SelectRow({ label, value, options }: { label: string; value: string; options: string[] }) {
  const [v, setV] = useState(value);
  const opts = options.includes(v) ? options : [v, ...options];
  return (
    <div className="flex items-center justify-between gap-space-sm">
      <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">{label}</span>
      <select value={v} onChange={(e) => setV(e.target.value)} className="px-space-sm py-1.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm outline-none max-w-[60%]">
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
