"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ApplianceCard } from "@/components/public/ApplianceCard";
import { APPLIANCES, CATEGORIES } from "@/lib/mock/appliances";

export default function DirectoryPage() {
  const [q, setQ] = useState("");
  const [minStars, setMinStars] = useState(0);
  const [sort, setSort] = useState("iseer");

  const results = useMemo(() => {
    let list = APPLIANCES.filter(
      (a) =>
        a.stars >= minStars &&
        (q === "" ||
          `${a.brand} ${a.model} ${a.regId}`.toLowerCase().includes(q.toLowerCase()))
    );
    list = [...list].sort((a, b) =>
      sort === "iseer" ? b.iseer - a.iseer : sort === "kwh" ? a.annualKwh - b.annualKwh : 0
    );
    return list;
  }, [q, minStars, sort]);

  return (
    <div className="flex flex-col w-full">
      {/* Search console */}
      <section className="w-full bg-surface-ground py-space-lg">
        <div className="max-w-7xl mx-auto px-gutter">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-space-md">
            BEE Verified Appliance Directory
          </h1>
          <div className="bg-surface-card p-space-lg rounded-xl shadow-sm">
            <div className="flex flex-col lg:flex-row gap-space-md items-stretch lg:items-center justify-between mb-space-md">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <Icon name="search" />
                </div>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline outline-none focus:bg-surface-card shadow-inner"
                  placeholder="Search by Brand (e.g. Daikin, Voltas), Model No., or BEE Registration ID..."
                />
              </div>
              <div className="flex items-center gap-space-sm">
                <button className="bg-primary hover:bg-forest-dark text-on-primary px-space-lg py-2.5 rounded-lg font-label-lg text-label-lg flex items-center gap-2 shadow-sm transition-all" type="button">
                  <Icon name="manage_search" size={18} /> Search Database
                </button>
                <button
                  onClick={() => {
                    setQ("");
                    setMinStars(0);
                  }}
                  className="bg-surface-container hover:bg-surface-container-high text-on-surface px-space-md py-2.5 rounded-lg font-label-lg text-label-lg flex items-center gap-1 transition-all"
                  type="button"
                >
                  <Icon name="restart_alt" size={18} /> Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-md pt-space-xs">
              <Field label="Star Rating">
                <select value={minStars} onChange={(e) => setMinStars(Number(e.target.value))} className="w-full py-2 px-3 rounded-lg bg-surface-ground font-body-sm text-body-sm text-on-surface outline-none">
                  <option value={0}>All Ratings (1 to 5 Stars)</option>
                  <option value={5}>5-Star Super Efficient Only</option>
                  <option value={4}>4-Star & Above</option>
                  <option value={3}>3-Star Standard</option>
                </select>
              </Field>
              <Field label="Category">
                <select className="w-full py-2 px-3 rounded-lg bg-surface-ground font-body-sm text-body-sm text-on-surface outline-none">
                  {CATEGORIES.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="ISEER Efficiency Rating">
                <select className="w-full py-2 px-3 rounded-lg bg-surface-ground font-body-sm text-body-sm text-on-surface outline-none">
                  <option>Any ISEER Metric</option>
                  <option>ISEER ≥ 5.0 (High Efficiency)</option>
                  <option>ISEER 4.5 - 4.99</option>
                </select>
              </Field>
              <Field label="Sort By">
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full py-2 px-3 rounded-lg bg-surface-ground font-body-sm text-body-sm text-on-surface outline-none">
                  <option value="iseer">ISEER (Highest First)</option>
                  <option value="kwh">Lowest Electricity (kWh/yr)</option>
                </select>
              </Field>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="w-full bg-surface py-space-xl">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="flex items-center justify-between mb-space-lg">
            <span className="font-label-md text-label-md text-on-surface-variant">
              Showing <strong className="text-on-surface">{results.length}</strong> of 4,821 certified models
            </span>
          </div>
          {results.length === 0 ? (
            <div className="bg-surface-card rounded-xl p-space-2xl text-center text-on-surface-variant">
              <Icon name="search_off" size={40} className="text-outline" />
              <p className="mt-2 font-body-md text-body-md">No models match your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {results.map((a) => (
                <ApplianceCard key={a.regId} a={a} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">{label}</label>
      {children}
    </div>
  );
}
