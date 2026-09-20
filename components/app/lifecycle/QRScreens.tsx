"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Stars";
import { PseudoQR } from "@/components/ui/PseudoQR";
import { Card, FakeTable, ScreenChrome, Status, OK, WARN, BAD, INFO } from "@/components/app/ScreenScaffold";
import { useQR } from "@/components/app/QRStore";
import { Module, Screen } from "@/lib/screens";
import { QRBatch, PERIODS, batchCsv } from "@/lib/mock/qr";
import { APPLIANCES } from "@/lib/mock/appliances";
import { useActor } from "./shared";

const STATUS_TONE: Record<string, string> = { requested: INFO, allocated: WARN, bound: OK };

function BatchStatusBadge({ b }: { b: QRBatch }) {
  return <Status label={b.status[0].toUpperCase() + b.status.slice(1)} tone={STATUS_TONE[b.status]} />;
}

/* --------------------------------- Request -------------------------------- */
export function QRBatchRequest({ module, screen }: { module: Module; screen: Screen }) {
  const { activeModels, request, batches } = useQR();
  const actor = useActor();
  const [appId, setAppId] = useState("");
  const [quantity, setQuantity] = useState("2000");
  const [period, setPeriod] = useState(PERIODS[1]);
  const [done, setDone] = useState(false);

  const selected = activeModels.find((a) => a.id === appId) ?? activeModels[0];

  function submit() {
    if (!selected) return;
    request(selected, Number(quantity) || 0, period);
    setDone(true);
  }

  return (
    <ScreenChrome module={module} screen={screen} subtitle="Allocate a QR batch for an approved model">
      {activeModels.length === 0 ? (
        <Card>
          <div className="text-center py-space-lg text-on-surface-variant">
            <Icon name="inventory_2" size={36} className="text-outline" />
            <p className="font-body-md text-body-md text-on-surface mt-2">No active models yet.</p>
            <p className="font-body-sm text-body-sm">Take a model through approval, rating and label generation first.</p>
            <Link href="/app/model-label/label-preview" className="mt-space-md inline-flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md">
              <Icon name="arrow_forward" size={18} /> Go to label generation
            </Link>
          </div>
        </Card>
      ) : done ? (
        <Card>
          <div className="text-center py-space-lg">
            <div className="w-16 h-16 rounded-full bg-forest-light flex items-center justify-center mx-auto mb-space-md">
              <Icon name="qr_code_2" size={36} fill className="text-primary" />
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Batch requested for {selected?.model}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Allocate it on the batch status screen to generate opaque QR identifiers.</p>
            <div className="flex items-center justify-center gap-space-sm mt-space-lg">
              <Link href="/app/qr-verification/qr-batch-status" className="px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1.5"><Icon name="list_alt" size={18} /> Batch status</Link>
              <button onClick={() => setDone(false)} className="px-space-md py-2.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1.5"><Icon name="add" size={18} /> Request another</button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
          <div className="lg:col-span-2">
            <Card title="Batch request">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Approved model</label>
                  <select value={selected?.id} onChange={(e) => setAppId(e.target.value)} className="w-full py-2 px-3 rounded-lg bg-surface-ground font-body-sm text-body-sm outline-none">
                    {activeModels.map((a) => <option key={a.id} value={a.id}>{a.brand} — {a.model}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Requested quantity</label>
                  <input value={quantity} onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))} className="w-full py-2 px-3 rounded-lg bg-surface-ground font-body-sm text-body-sm outline-none" />
                </div>
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Production period</label>
                  <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full py-2 px-3 rounded-lg bg-surface-ground font-body-sm text-body-sm outline-none">
                    {PERIODS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Registration ID</label>
                  <input value={selected?.regId ?? ""} readOnly className="w-full py-2 px-3 rounded-lg bg-surface-container-low font-body-sm text-body-sm outline-none font-mono" />
                </div>
              </div>
              <div className="mt-space-md bg-navy-subtle text-navy-dark rounded-lg p-space-sm font-body-sm text-body-sm flex items-center gap-space-sm">
                <Icon name="info" size={18} className="text-secondary" /> QR identifiers are cryptographically opaque and never encode PII or mutable status.
              </div>
              <button onClick={submit} className="mt-space-md w-full sm:w-auto bg-primary text-on-primary px-space-lg py-2.5 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 hover:bg-forest-dark">
                <Icon name="qr_code_2" size={18} /> Request batch
              </button>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-sm">Requesting as {actor}.</p>
            </Card>
          </div>
          <Card title="Recent batches">
            <div className="space-y-space-xs">
              {batches.slice(0, 5).map((b) => (
                <div key={b.id} className="p-space-sm rounded-lg bg-surface-container-low">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-label-sm text-label-sm text-on-surface">{b.id}</span>
                    <BatchStatusBadge b={b} />
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">{b.model} · {b.quantity.toLocaleString()} · {b.period}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </ScreenChrome>
  );
}

/* ------------------------------ Batch status ------------------------------ */
export function QRBatchStatus({ module, screen }: { module: Module; screen: Screen }) {
  const { batches, allocate } = useQR();
  const actor = useActor();
  return (
    <ScreenChrome module={module} screen={screen} subtitle="Allocate opaque identifiers to requested batches">
      <Card title={`Batches (${batches.length})`}>
        <FakeTable
          columns={["Batch", "Model", "Qty", "Period", "Bound", "Status", "Action"]}
          rows={batches.map((b) => [
            <span key="id" className="font-mono">{b.id}</span>,
            <div key="m"><div className="font-semibold text-on-surface">{b.brand}</div><div className="font-label-sm text-label-sm text-on-surface-variant">{b.model}</div></div>,
            b.quantity.toLocaleString(),
            b.period,
            `${b.boundSerials.toLocaleString()} / ${b.quantity.toLocaleString()}`,
            <BatchStatusBadge key="s" b={b} />,
            b.status === "requested"
              ? <button key="a" onClick={() => allocate(b.id)} className="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-1"><Icon name="bolt" size={14} /> Allocate</button>
              : b.status === "allocated"
                ? <Link key="a" href={`/app/qr-verification/serial-upload?id=${b.id}`} className="text-primary hover:underline font-label-sm text-label-sm inline-flex items-center gap-1">Bind serials <Icon name="arrow_forward" size={14} /></Link>
                : <Link key="a" href={`/app/qr-verification/qr-download?id=${b.id}`} className="text-primary hover:underline font-label-sm text-label-sm inline-flex items-center gap-1">View QR <Icon name="arrow_forward" size={14} /></Link>,
          ])}
        />
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-sm">Acting as {actor}.</p>
      </Card>
    </ScreenChrome>
  );
}

/* --------------------------- Batch file download -------------------------- */
export function BatchFileDownload({ module, screen }: { module: Module; screen: Screen }) {
  const { batches } = useQR();
  function download(b: QRBatch) {
    const blob = new Blob([batchCsv(b)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${b.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <ScreenChrome module={module} screen={screen} subtitle="Download the allocated batch file with row version and checksum">
      <Card title="Allocated & bound batches">
        <FakeTable
          columns={["Batch", "Model", "Rows", "Checksum", "Download"]}
          rows={batches.filter((b) => b.status !== "requested").map((b) => [
            <span key="id" className="font-mono">{b.id}</span>,
            b.model,
            b.allocatedIds.length.toLocaleString(),
            <span key="c" className="font-mono text-on-surface-variant">{b.id.replace(/\D/g, "")}A{b.allocatedIds.length}</span>,
            <button key="d" onClick={() => download(b)} className="px-2.5 py-1 rounded-lg bg-forest-light text-forest-dark font-label-sm text-label-sm flex items-center gap-1 hover:bg-primary hover:text-on-primary"><Icon name="download" size={14} /> CSV</button>,
          ])}
        />
      </Card>
    </ScreenChrome>
  );
}

/* ------------------------------ Serial upload ----------------------------- */
export function SerialUpload({ module, screen }: { module: Module; screen: Screen }) {
  const { batches, bind, byId } = useQR();
  const actor = useActor();
  const params = useSearchParams();
  const allocatable = batches.filter((b) => b.status === "allocated" || b.status === "bound");
  const selected = byId(params.get("id")) ?? allocatable[0] ?? batches[0];
  const [result, setResult] = useState<{ count: number; duplicates: number } | null>(null);

  function upload() {
    if (!selected) return;
    const count = Math.min(1000, selected.quantity - selected.boundSerials) || 500;
    const duplicates = Math.floor(Math.random() * 4);
    bind(selected.id, count - duplicates, duplicates);
    setResult({ count: count - duplicates, duplicates });
  }

  return (
    <ScreenChrome module={module} screen={screen} subtitle="Upload manufacturer serial bindings">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        <Card title="Batch">
          <div className="space-y-space-xs">
            {allocatable.length === 0 && <p className="font-body-sm text-body-sm text-on-surface-variant">Allocate a batch first.</p>}
            {allocatable.map((b) => (
              <a key={b.id} href={`/app/qr-verification/serial-upload?id=${b.id}`} className={`block p-space-sm rounded-lg ${selected?.id === b.id ? "bg-forest-light" : "bg-surface-container-low hover:bg-surface-container"}`}>
                <div className="font-mono font-label-sm text-label-sm text-on-surface">{b.id}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">{b.model}</div>
              </a>
            ))}
          </div>
        </Card>
        <div className="lg:col-span-2 space-y-space-md">
          <Card title="Upload">
            {!selected ? <p className="font-body-sm text-body-sm text-on-surface-variant">No batch selected.</p> : (
              <>
                <div className="border-2 border-dashed border-border-strong rounded-xl p-space-lg text-center text-on-surface-variant">
                  <Icon name="cloud_upload" size={36} className="text-primary" />
                  <p className="font-body-sm text-body-sm mt-1 text-on-surface">Drop the serial-binding file for <strong>{selected.id}</strong> (.csv with row version + checksum)</p>
                  <button onClick={upload} className="mt-space-md px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md inline-flex items-center gap-1.5"><Icon name="link" size={18} /> Validate & bind serials</button>
                </div>
                <div className="mt-space-md grid grid-cols-3 gap-space-md">
                  <Mini label="Requested" value={selected.quantity.toLocaleString()} />
                  <Mini label="Bound" value={selected.boundSerials.toLocaleString()} tone="text-primary" />
                  <Mini label="Duplicates" value={String(selected.duplicates)} tone="text-error" />
                </div>
              </>
            )}
          </Card>
          {result && (
            <Card title="Binding result">
              <div className="flex items-center gap-space-md">
                <Icon name="check_circle" size={28} fill className="text-primary" />
                <div className="font-body-md text-body-md text-on-surface">
                  Bound <strong>{result.count.toLocaleString()}</strong> serials.
                  {result.duplicates > 0 ? <> Rejected <strong className="text-error">{result.duplicates}</strong> duplicate serial(s).</> : " No duplicates."}
                </div>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-sm">Acting as {actor}.</p>
            </Card>
          )}
        </div>
      </div>
    </ScreenChrome>
  );
}

/* --------------------------- Duplicate exceptions ------------------------- */
export function DuplicateExceptions({ module, screen }: { module: Module; screen: Screen }) {
  const { batches } = useQR();
  const withDupes = batches.filter((b) => b.duplicates > 0);
  const total = withDupes.reduce((s, b) => s + b.duplicates, 0);
  return (
    <ScreenChrome module={module} screen={screen} subtitle="Duplicate serials rejected across the approved scope">
      <div className="space-y-space-md">
        <div className="grid grid-cols-3 gap-space-md">
          <Mini label="Batches with duplicates" value={String(withDupes.length)} />
          <Mini label="Total duplicates" value={String(total)} tone="text-error" />
          <Mini label="Clean batches" value={String(batches.length - withDupes.length)} tone="text-primary" />
        </div>
        <Card title="Exceptions">
          {withDupes.length === 0 ? <p className="font-body-sm text-body-sm text-on-surface-variant py-space-sm">No duplicate exceptions. All bound serials are unique.</p> : (
            <FakeTable
              columns={["Batch", "Model", "Period", "Duplicates", "Disposition"]}
              rows={withDupes.map((b) => [
                <span key="id" className="font-mono">{b.id}</span>, b.model, b.period,
                <span key="d" className="text-error font-semibold">{b.duplicates}</span>,
                <Status key="s" label="Rejected" tone={BAD} />,
              ])}
            />
          )}
        </Card>
      </div>
    </ScreenChrome>
  );
}

/* ------------------------------- QR download ------------------------------ */
export function QRDownload({ module, screen }: { module: Module; screen: Screen }) {
  const { batches, byId } = useQR();
  const params = useSearchParams();
  const usable = batches.filter((b) => b.status !== "requested");
  const selected = byId(params.get("id")) ?? usable[0] ?? batches[0];
  return (
    <ScreenChrome module={module} screen={screen} subtitle="Rendered QR identifiers for an allocated batch">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        <Card title="Batch">
          <div className="space-y-space-xs">
            {usable.map((b) => (
              <a key={b.id} href={`/app/qr-verification/qr-download?id=${b.id}`} className={`block p-space-sm rounded-lg ${selected?.id === b.id ? "bg-forest-light" : "bg-surface-container-low hover:bg-surface-container"}`}>
                <div className="font-mono font-label-sm text-label-sm text-on-surface">{b.id}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">{b.model} · {b.status}</div>
              </a>
            ))}
          </div>
        </Card>
        <div className="lg:col-span-2">
          <Card title={selected ? `${selected.id} — sample identifiers` : "No batch"}>
            {selected && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md">
                {selected.allocatedIds.map((q) => (
                  <div key={q} className="flex flex-col items-center gap-1 p-space-sm bg-surface-container-low rounded-lg">
                    <PseudoQR value={q} size={80} />
                    <span className="font-mono text-label-sm text-on-surface-variant">{q}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </ScreenChrome>
  );
}

/* ------------------------- Verification (internal) ------------------------ */
interface Resolved {
  model: string; brand: string; regId: string; rating: number; iseer: number; status: string; qrBatch?: string;
}

function useResolver() {
  const { batches, activeModels } = useQR();
  return useMemo(() => {
    const map = new Map<string, Resolved>();
    // static public registry
    APPLIANCES.forEach((a) => map.set(a.regId, { model: a.model, brand: a.brand, regId: a.regId, rating: a.stars, iseer: a.iseer, status: "Active" }));
    // live lifecycle active models
    activeModels.forEach((a) => a.regId && map.set(a.regId, { model: a.model, brand: a.brand, regId: a.regId, rating: a.rating ?? 5, iseer: a.declaredIseer, status: "Active", qrBatch: a.qrBatch }));
    // QR ids → resolve to their batch's model
    const byQr = new Map<string, Resolved>();
    batches.forEach((b) => b.allocatedIds.forEach((q) => byQr.set(q, { model: b.model, brand: b.brand, regId: b.regId, rating: b.rating, iseer: 0, status: "Active", qrBatch: b.id })));
    return (query: string): Resolved | undefined => {
      const q = query.trim();
      return map.get(q) ?? byQr.get(q.toUpperCase()) ?? [...map.values()].find((m) => m.regId.toLowerCase() === q.toLowerCase());
    };
  }, [batches, activeModels]);
}

export function VerificationScreen({ module, screen, mode }: { module: Module; screen: Screen; mode: "public" | "certificate" }) {
  const resolve = useResolver();
  const [q, setQ] = useState("");
  const [checked, setChecked] = useState(false);
  const hit = checked ? resolve(q) : undefined;

  return (
    <ScreenChrome module={module} screen={screen} subtitle={mode === "public" ? "Read-only public/mobile authenticity check" : "Certificate hash verification against the ledger"}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
        <Card title="Lookup">
          <div className="flex gap-space-sm">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={mode === "public" ? "QR value or Registration ID" : "Certificate / Registration ID"} className="flex-1 py-2.5 px-3 rounded-lg bg-surface-ground font-body-sm text-body-sm outline-none" />
            <button onClick={() => setChecked(true)} className="px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1"><Icon name="search" size={18} /> Verify</button>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-sm">Try: {APPLIANCES.slice(0, 2).map((a) => a.regId).join("  •  ")}</p>
        </Card>
        <Card title="Result">
          {!checked ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">Enter a value to verify.</p>
          ) : hit ? (
            <div className="space-y-space-sm">
              <div className="flex items-center gap-space-sm">
                <Icon name="verified" size={26} fill className="text-primary" />
                <div>
                  <div className="font-title-lg text-title-lg text-on-surface">{hit.brand} {hit.model}</div>
                  <div className="font-label-sm text-label-sm font-mono text-on-surface-variant">{hit.regId}</div>
                </div>
              </div>
              <div className="flex items-center gap-space-sm"><Stars value={hit.rating} size={18} /> <Status label={hit.status} tone={OK} /></div>
              {mode === "certificate" && (
                <div className="bg-forest-light text-forest-dark rounded-lg p-space-sm font-body-sm text-body-sm flex items-center gap-space-sm">
                  <Icon name="link" size={18} /> Certificate hash anchored on the permissioned ledger{hit.qrBatch ? ` · batch ${hit.qrBatch}` : ""}.
                </div>
              )}
            </div>
          ) : (
            <div className="bg-error-container text-on-error-container rounded-lg p-space-sm font-body-sm text-body-sm flex items-center gap-space-sm">
              <Icon name="gpp_bad" size={20} fill /> No matching registration found. Do not trust the label.
            </div>
          )}
        </Card>
      </div>
    </ScreenChrome>
  );
}

function Mini({ label, value, tone = "text-on-surface" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="bg-surface-container-low rounded-lg p-space-sm">
      <div className="font-label-sm text-label-sm text-on-surface-variant">{label}</div>
      <div className={`font-headline-sm text-headline-sm font-bold ${tone}`}>{value}</div>
    </div>
  );
}
