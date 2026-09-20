"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Card, ScreenChrome } from "@/components/app/ScreenScaffold";
import { useLifecycle } from "@/components/app/LifecycleStore";
import { Module, Screen } from "@/lib/screens";
import { computeStars } from "@/lib/mock/lifecycle";
import { useActor } from "./shared";

export function NewModelApplication({ module, screen }: { module: Module; screen: Screen }) {
  const { create, apps } = useLifecycle();
  const actor = useActor();
  const [submitted, setSubmitted] = useState<string | null>(null);

  const [form, setForm] = useState({
    brand: "",
    model: "",
    family: "",
    category: "Room ACs",
    capacityW: "5000",
    powerInputW: "1000",
    declaredIseer: "5.10",
    standard: "IS 1391 / ISO 5151",
    lab: "NABL-DEL-002",
    testDate: "01 Sep 2026",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const projectedStars = computeStars(Number(form.declaredIseer) || 0);

  function submit() {
    create({
      brand: form.brand,
      model: form.model,
      family: form.family,
      category: form.category,
      capacityW: Number(form.capacityW),
      powerInputW: Number(form.powerInputW),
      declaredIseer: Number(form.declaredIseer),
      standard: form.standard,
      lab: form.lab,
      testDate: form.testDate,
    });
    // The reducer prepends the new app; its id is deterministic from length.
    setSubmitted(`APP-2026-${(4820 + apps.length + 1).toString().padStart(5, "0")}`);
  }

  if (submitted) {
    return (
      <ScreenChrome module={module} screen={screen} subtitle="Application submitted">
        <Card>
          <div className="flex flex-col items-center text-center py-space-lg">
            <div className="w-16 h-16 rounded-full bg-forest-light flex items-center justify-center mb-space-md">
              <Icon name="task_alt" size={36} fill className="text-primary" />
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Application {submitted} created</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-md">
              It has entered the pipeline at <strong>Awaiting fee</strong>. Confirm the fee to route it to IAME scrutiny.
            </p>
            <div className="flex items-center gap-space-sm mt-space-lg">
              <Link href={`/app/model-label/model-payment?id=${submitted}`} className="px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1.5 hover:bg-forest-dark">
                <Icon name="payments" size={18} /> Go to fee confirmation
              </Link>
              <Link href="/app/model-label/model-dashboard" className="px-space-md py-2.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1.5">
                <Icon name="dashboard" size={18} /> Back to dashboard
              </Link>
            </div>
          </div>
        </Card>
      </ScreenChrome>
    );
  }

  return (
    <ScreenChrome module={module} screen={screen} subtitle="Create a new model registration">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        <div className="lg:col-span-2 space-y-space-md">
          <Card title="Applicant & model">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <Field label="Brand / manufacturer" value={form.brand} onChange={set("brand")} placeholder="e.g. Daikin India Ltd." />
              <Field label="Model number" value={form.model} onChange={set("model")} placeholder="e.g. FTKM50U 1.5T" />
              <Field label="Family / series" value={form.family} onChange={set("family")} placeholder="e.g. FTKM Series" />
              <SelectField label="Appliance category" value={form.category} onChange={set("category")} options={["Room ACs", "Refrigerators", "Ceiling Fans", "LED Luminaires", "Water Heaters"]} />
            </div>
          </Card>
          <Card title="Performance & test">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <Field label="Cooling capacity (W)" value={form.capacityW} onChange={set("capacityW")} placeholder="5000" />
              <Field label="Power input (W)" value={form.powerInputW} onChange={set("powerInputW")} placeholder="1000" />
              <Field label="Declared ISEER" value={form.declaredIseer} onChange={set("declaredIseer")} placeholder="5.10" />
              <SelectField label="Reference standard" value={form.standard} onChange={set("standard")} options={["IS 1391 / ISO 5151", "IS 1391"]} />
              <SelectField label="Test laboratory (NABL)" value={form.lab} onChange={set("lab")} options={["NABL-DEL-002", "NABL-BLR-014", "NABL-MUM-007"]} />
              <Field label="Test report date" value={form.testDate} onChange={set("testDate")} placeholder="dd mmm yyyy" />
            </div>
          </Card>
          <Card title="Supporting documents">
            <div className="border-2 border-dashed border-border-strong rounded-xl p-space-lg text-center text-on-surface-variant">
              <Icon name="upload_file" size={32} className="text-outline" />
              <p className="font-body-sm text-body-sm mt-1">Test report, lab accreditation and label artwork (PDF ≤ 10 MB). Malware-scanned before acceptance.</p>
            </div>
          </Card>
        </div>

        <div className="space-y-space-md">
          <Card title="Projected outcome">
            <div className="text-center py-space-sm">
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">If declared ISEER holds</div>
              <div className="font-display-lg text-display-lg font-bold text-primary leading-none mt-1">{projectedStars}★</div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Final rating is computed from the effective formula after approval.</p>
            </div>
          </Card>
          <Card title="Fee">
            <div className="flex items-center justify-between font-body-sm text-body-sm">
              <span className="text-on-surface-variant">Application fee</span>
              <span className="font-bold text-on-surface">₹24,000</span>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-sm">Payable after submission to route to IAME scrutiny.</p>
          </Card>
          <button onClick={submit} className="w-full bg-primary text-on-primary py-2.5 rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-forest-dark transition-all">
            <Icon name="send" size={18} /> Submit application
          </button>
          <p className="font-label-sm text-label-sm text-on-surface-variant text-center">Submitting as {actor}. Mandatory fields validated on submit.</p>
        </div>
      </div>
    </ScreenChrome>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string }) {
  return (
    <div>
      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">{label}</label>
      <input value={value} onChange={onChange} placeholder={placeholder} className="w-full py-2 px-3 rounded-lg bg-surface-ground font-body-sm text-body-sm outline-none focus:ring-2 focus:ring-primary/30" />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[] }) {
  return (
    <div>
      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">{label}</label>
      <select value={value} onChange={onChange} className="w-full py-2 px-3 rounded-lg bg-surface-ground font-body-sm text-body-sm outline-none">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
