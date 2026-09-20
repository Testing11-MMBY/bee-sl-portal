/**
 * QR & Traceability state — batches of opaque QR identifiers allocated against
 * an approved (active) model, and the manufacturer serial bindings. Seeded
 * independently of the live application list but referencing the same models.
 */

export type BatchStatus = "requested" | "allocated" | "bound";

export interface QRBatch {
  id: string; // QB-2026-0231
  appId: string; // model application reference
  brand: string;
  model: string;
  regId: string;
  rating: number;
  quantity: number;
  period: string; // e.g. "Q2 2026-27"
  status: BatchStatus;
  allocatedIds: string[]; // opaque QR identifiers (never encode PII)
  boundSerials: number;
  duplicates: number;
  createdAt: string;
}

/** Cryptographically-opaque-looking id (demo only). */
export function makeQrId(): string {
  const hex = () => Math.floor(Math.random() * 16).toString(16);
  return "Q" + Array.from({ length: 11 }, hex).join("").toUpperCase();
}

export function makeBatchId(seq: number): string {
  return `QB-2026-${(230 + seq).toString().padStart(4, "0")}`;
}

export function batchCsv(batch: QRBatch): string {
  const header = "qr_id,reg_id,model,brand,rating,period";
  const rows = batch.allocatedIds.map(
    (q) => `${q},${batch.regId},${batch.model},${batch.brand},${batch.rating},${batch.period}`
  );
  return [header, ...rows].join("\n");
}

export const PERIODS = ["Q1 2026-27", "Q2 2026-27", "Q3 2026-27", "Q4 2026-27"];

export const SEED_BATCHES: QRBatch[] = [
  {
    id: "QB-2026-0231",
    appId: "APP-2026-04816",
    brand: "Godrej & Boyce",
    model: "Turbo 5-in-1 18TC3-WWR",
    regId: "BEE/RAC/2026/10016",
    rating: 5,
    quantity: 5000,
    period: "Q2 2026-27",
    status: "bound",
    allocatedIds: Array.from({ length: 8 }, makeQrId),
    boundSerials: 4820,
    duplicates: 3,
    createdAt: "06 Sep 2026",
  },
  {
    id: "QB-2026-0230",
    appId: "APP-2026-04816",
    brand: "Godrej & Boyce",
    model: "Turbo 5-in-1 18TC3-WWR",
    regId: "BEE/RAC/2026/10016",
    rating: 5,
    quantity: 2000,
    period: "Q1 2026-27",
    status: "allocated",
    allocatedIds: Array.from({ length: 8 }, makeQrId),
    boundSerials: 0,
    duplicates: 0,
    createdAt: "20 Aug 2026",
  },
];
