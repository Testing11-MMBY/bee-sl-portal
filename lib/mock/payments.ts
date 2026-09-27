/**
 * Partner-facing payment records (prototype, simulated).
 *
 * A payer (Manufacturer or Registered Agency) sees ONLY their own
 * organisation's application fees, transaction and reconciliation status, and
 * receipts. Confirming receipt of a fee is a BEE Finance action and is never
 * available here — a payer cannot confirm their own payment.
 */

export type PayStatus = "Paid" | "Processing" | "Due" | "Failed";
export type ReconStatus = "Reconciled" | "Pending" | "—";

export interface PartnerPaymentRow {
  appId: string;
  model: string;
  stars: number;
  amountDue: number;
  amountPaid: number;
  status: PayStatus;
  method: string;
  txnId: string;
  paidOn?: string;
  recon: ReconStatus;
  /** Present only when Finance has confirmed the fee and a receipt exists. */
  receiptNo?: string;
}

export interface PartnerPaymentSet {
  org: string;
  gstin: string;
  rows: PartnerPaymentRow[];
}

/** Keyed by external role. Each party sees a different, own-organisation set. */
export const PARTNER_PAYMENTS: Record<string, PartnerPaymentSet> = {
  manufacturer: {
    org: "Nova Cool Appliances Ltd.",
    gstin: "27ABCCN1234F1Z5",
    rows: [
      { appId: "APP-2026-05016", model: "FrostMax 1.5T", stars: 5, amountDue: 24000, amountPaid: 24000, status: "Paid", method: "Net banking", txnId: "TXN-9F3A21C7", paidOn: "04 Sep 2026", recon: "Reconciled", receiptNo: "RCPT-2026-05016" },
      { appId: "APP-2026-05044", model: "FrostMax 2T", stars: 5, amountDue: 24000, amountPaid: 24000, status: "Processing", method: "Challan (NEFT)", txnId: "TXN-B7E12D40", paidOn: "26 Sep 2026", recon: "Pending" },
      { appId: "APP-2026-05051", model: "CoolBreeze 1T", stars: 3, amountDue: 24000, amountPaid: 0, status: "Due", method: "—", txnId: "—", recon: "—" },
    ],
  },
  agency: {
    org: "PixelCert Registered Agency",
    gstin: "29AAECP5678Q1Z3",
    rows: [
      { appId: "APP-2026-04980", model: "BreezeLite 1T · Sunrise Electra", stars: 3, amountDue: 24000, amountPaid: 24000, status: "Paid", method: "Net banking", txnId: "TXN-5C90AA12", paidOn: "18 Sep 2026", recon: "Reconciled", receiptNo: "RCPT-2026-04980" },
      { appId: "APP-2026-05002", model: "EcoChill 1.5T · GreenVolt", stars: 4, amountDue: 24000, amountPaid: 24000, status: "Processing", method: "Challan (NEFT)", txnId: "TXN-71D3FE88", paidOn: "27 Sep 2026", recon: "Pending" },
      { appId: "APP-2026-05010", model: "PolarPro 2T · PolarPro", stars: 5, amountDue: 24000, amountPaid: 0, status: "Due", method: "—", txnId: "—", recon: "—" },
    ],
  },
};

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
