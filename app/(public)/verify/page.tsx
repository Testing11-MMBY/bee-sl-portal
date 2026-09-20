"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Stars";
import { APPLIANCES, Appliance } from "@/lib/mock/appliances";

function VerifyInner() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("reg") ?? "");
  const [submitted, setSubmitted] = useState(!!params.get("reg"));

  // Also resolve models that went "active" in the officer console (same-origin
  // localStorage) and their allocated QR identifiers — closing the loop.
  const [dynamic, setDynamic] = useState<Appliance[]>([]);
  const [qrIndex, setQrIndex] = useState<Record<string, string>>({});
  useEffect(() => {
    try {
      const life = JSON.parse(localStorage.getItem("bee-lifecycle-v1") || "[]");
      setDynamic(
        life
          .filter((a: { stage: string; regId?: string }) => a.stage === "active" && a.regId)
          .map((a: { brand: string; model: string; regId: string; rating?: number; declaredIseer: number; capacityW: number }): Appliance => ({
            regId: a.regId,
            brand: a.brand,
            model: a.model,
            category: "Room ACs",
            stars: a.rating ?? 5,
            iseer: a.declaredIseer,
            annualKwh: Math.round((a.capacityW / (a.declaredIseer || 5)) * 1600 / 1000),
            capacityW: a.capacityW,
            validFrom: "Jan 2026",
            validTo: "Dec 2028",
            features: [],
          }))
      );
      const qr = JSON.parse(localStorage.getItem("bee-qr-v1") || "[]");
      const idx: Record<string, string> = {};
      qr.forEach((b: { regId: string; allocatedIds?: string[] }) =>
        (b.allocatedIds || []).forEach((q) => (idx[q.toUpperCase()] = b.regId))
      );
      setQrIndex(idx);
    } catch {
      /* ignore */
    }
  }, []);

  const all = [...APPLIANCES, ...dynamic];
  const qTrim = query.trim();
  const regFromQr = qrIndex[qTrim.toUpperCase()];
  const match =
    all.find((a) => a.regId.toLowerCase() === qTrim.toLowerCase()) ??
    (regFromQr ? all.find((a) => a.regId === regFromQr) : undefined);

  return (
    <div className="max-w-4xl mx-auto px-gutter py-space-2xl">
      <div className="text-center mb-space-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-light text-forest-dark font-label-sm text-label-sm uppercase tracking-wider mb-space-sm">
          <Icon name="verified_user" size={16} fill /> Public Authenticity Check
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface">Verify a BEE Star Label</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl mx-auto">
          Scan the QR on the label or enter the BEE Registration ID to confirm the model, brand, star rating and certificate validity from the national database.
        </p>
      </div>

      <div className="bg-surface-card rounded-xl shadow-md p-space-lg">
        <div className="flex flex-col sm:flex-row gap-space-sm">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
              <Icon name="qr_code_scanner" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Registration ID e.g. BEE/RAC/2024/09841"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface-container-low font-body-md text-body-md outline-none focus:bg-surface-card shadow-inner"
            />
          </div>
          <button
            onClick={() => setSubmitted(true)}
            className="bg-primary text-on-primary px-space-lg py-3 rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-forest-dark transition-all"
            type="button"
          >
            <Icon name="search" size={18} /> Verify
          </button>
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-sm">
          Try one of: {APPLIANCES.slice(0, 3).map((a) => a.regId).join("  •  ")}
        </p>
      </div>

      {submitted && (
        <div className="mt-space-lg">
          {match ? (
            <div className="bg-surface-card rounded-xl shadow-md overflow-hidden">
              <div className="bg-forest-dark text-on-primary px-space-lg py-space-md flex items-center gap-space-sm">
                <Icon name="check_circle" size={28} fill className="text-tertiary-fixed" />
                <div>
                  <div className="font-headline-sm text-headline-sm">Authentic — Registered with BEE</div>
                  <div className="font-body-sm text-body-sm text-forest-light/80">Certificate active and verifiable on the ledger.</div>
                </div>
              </div>
              <div className="p-space-lg grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                <div>
                  <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">{match.brand}</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">{match.model}</h2>
                  <div className="font-label-sm text-label-sm font-mono text-on-surface-variant mt-1">{match.regId}</div>
                  <div className="mt-space-md flex items-center gap-space-sm">
                    <Stars value={match.stars} size={22} />
                    <span className="px-2 py-0.5 rounded bg-forest-light text-forest-dark font-label-sm text-label-sm font-bold">ISEER {match.iseer.toFixed(2)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-space-sm">
                  <Fact k="Annual Consumption" v={`${match.annualKwh} kWh`} />
                  <Fact k="Cooling Capacity" v={`${match.capacityW.toLocaleString()} W`} />
                  <Fact k="Valid From" v={match.validFrom} />
                  <Fact k="Valid To" v={match.validTo} />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-error-container text-on-error-container rounded-xl shadow-md p-space-lg flex items-center gap-space-sm">
              <Icon name="gpp_bad" size={28} fill />
              <div>
                <div className="font-headline-sm text-headline-sm">No matching registration found</div>
                <div className="font-body-sm text-body-sm">
                  This ID is not in the BEE register. Do not trust the label — report it to the Consumer Vigilance Cell.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-surface-container-low rounded-lg p-space-sm">
      <div className="font-label-sm text-label-sm text-on-surface-variant">{k}</div>
      <div className="font-title-lg text-title-lg text-on-surface font-bold">{v}</div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-gutter py-space-2xl">Loading…</div>}>
      <VerifyInner />
    </Suspense>
  );
}
