"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Stars";

// Indicative ISEER by star band for a 1.5-ton split AC.
const ISEER_BY_STAR: Record<number, number> = { 1: 3.3, 2: 3.6, 3: 4.0, 4: 4.7, 5: 5.25 };
const COOLING_W = 5000; // ~1.5 ton

function annualKwh(hours: number, iseer: number) {
  // energy(kWh) = cooling load (W) / ISEER(W/W) * hours / 1000
  return (COOLING_W / iseer) * hours / 1000;
}

export default function CalculatorPage() {
  const [hours, setHours] = useState(1600);
  const [tariff, setTariff] = useState(8);
  const [chosen, setChosen] = useState(5);
  const [baseline, setBaseline] = useState(1);

  const chosenKwh = annualKwh(hours, ISEER_BY_STAR[chosen]);
  const baseKwh = annualKwh(hours, ISEER_BY_STAR[baseline]);
  const chosenBill = chosenKwh * tariff;
  const baseBill = baseKwh * tariff;
  const annualSaving = baseBill - chosenBill;
  const fiveYr = annualSaving * 5;
  const co2 = (chosenKwh * 0.82) / 1000; // tonnes/yr @ 0.82 kg/kWh grid factor

  return (
    <div className="max-w-6xl mx-auto px-gutter py-space-2xl">
      <div className="mb-space-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-wider mb-space-sm">
          <Icon name="calculate" size={16} /> Official BEE Calculator
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface">Energy & Bill Savings Calculator</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1 max-w-3xl">
          Estimate annual electricity cost and CO₂ for a 1.5-ton split AC and see the saving from choosing a higher BEE star rating.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
        {/* Controls */}
        <div className="bg-surface-card rounded-xl shadow-md p-space-lg space-y-space-lg">
          <Slider label="Operating hours / year" value={hours} min={500} max={3000} step={100} onChange={setHours} suffix="hrs" />
          <Slider label="Electricity tariff" value={tariff} min={4} max={14} step={0.5} onChange={setTariff} prefix="₹" suffix="/kWh" />
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant block mb-space-xs">Your chosen appliance rating</label>
            <StarPicker value={chosen} onChange={setChosen} />
          </div>
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant block mb-space-xs">Compare against (baseline)</label>
            <StarPicker value={baseline} onChange={setBaseline} />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-space-md">
          <div className="bg-forest-dark text-on-primary rounded-xl shadow-md p-space-lg">
            <div className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed">Estimated 5-year saving</div>
            <div className="font-display-lg text-display-lg font-bold text-solar-gold leading-none mt-1">
              ₹{Math.max(0, Math.round(fiveYr)).toLocaleString("en-IN")}
            </div>
            <div className="font-body-sm text-body-sm text-forest-light/80 mt-1">
              vs a {baseline}-star model at the same usage. Annual saving ≈ ₹{Math.max(0, Math.round(annualSaving)).toLocaleString("en-IN")}.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-space-md">
            <Metric icon="bolt" label={`${chosen}-Star annual power`} value={`${Math.round(chosenKwh)} kWh`} tone="text-primary" />
            <Metric icon="receipt_long" label={`${chosen}-Star annual bill`} value={`₹${Math.round(chosenBill).toLocaleString("en-IN")}`} tone="text-on-surface" />
            <Metric icon="bolt" label={`${baseline}-Star annual power`} value={`${Math.round(baseKwh)} kWh`} tone="text-error" />
            <Metric icon="co2" label="CO₂ footprint / yr" value={`${co2.toFixed(2)} t`} tone="text-tertiary" />
          </div>

          <div className="bg-surface-card rounded-xl shadow-sm p-space-md flex items-center gap-space-sm">
            <div className="flex items-center gap-1"><Stars value={chosen} size={18} /></div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              ISEER used: <strong className="text-on-surface">{ISEER_BY_STAR[chosen].toFixed(2)}</strong> (chosen) vs{" "}
              <strong className="text-on-surface">{ISEER_BY_STAR[baseline].toFixed(2)}</strong> (baseline)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label, value, min, max, step, onChange, prefix = "", suffix = "",
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; prefix?: string; suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="font-label-md text-label-md text-on-surface-variant">{label}</label>
        <span className="font-title-lg text-title-lg text-primary font-bold">{prefix}{value}{suffix ? ` ${suffix}` : ""}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-space-xs">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`flex-1 py-2 rounded-lg font-label-lg text-label-lg transition-all ${
            value === n ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container text-on-surface hover:bg-surface-container-high"
          }`}
        >
          {n}★
        </button>
      ))}
    </div>
  );
}

function Metric({ icon, label, value, tone }: { icon: string; label: string; value: string; tone: string }) {
  return (
    <div className="bg-surface-card rounded-xl shadow-sm p-space-md">
      <Icon name={icon} size={22} className={tone} />
      <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">{label}</div>
      <div className={`font-headline-sm text-headline-sm font-bold ${tone}`}>{value}</div>
    </div>
  );
}
