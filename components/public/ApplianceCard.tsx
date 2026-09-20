import Link from "next/link";
import { Icon } from "../ui/Icon";
import { Stars } from "../ui/Stars";
import { Appliance } from "@/lib/mock/appliances";

export function ApplianceCard({ a }: { a: Appliance }) {
  return (
    <div className="bg-surface-card p-space-md rounded-lg border border-border-subtle/70 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="bg-forest-light p-space-sm rounded-xl mb-space-md flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-forest-dark uppercase font-bold tracking-wider">BEE Energy Star</span>
            <Stars value={a.stars} size={18} className="mt-0.5" />
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded bg-surface-card text-forest-dark font-label-sm text-label-sm font-bold shadow-sm">
              ISEER {a.iseer.toFixed(2)}
            </span>
            <div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
              {a.validFrom} - {a.validTo}
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">{a.brand}</span>
            <h4 className="font-title-lg text-title-lg text-on-surface mt-0.5">{a.model}</h4>
            <div className="font-label-sm text-label-sm text-on-surface-variant font-mono mt-0.5">Reg ID: {a.regId}</div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-forest-light text-forest-dark font-label-sm text-label-sm font-semibold flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Verified
          </span>
        </div>

        <div className="grid grid-cols-2 gap-space-xs mt-space-md p-space-sm bg-surface-container-low rounded-lg">
          <div>
            <span className="font-label-sm text-label-sm text-on-surface-variant block">Annual Consumption</span>
            <span className="font-title-lg text-title-lg text-primary font-bold">{a.annualKwh} kWh</span>
          </div>
          <div>
            <span className="font-label-sm text-label-sm text-on-surface-variant block">Cooling Capacity</span>
            <span className="font-title-lg text-title-lg text-on-surface font-bold">{a.capacityW.toLocaleString()} W</span>
          </div>
        </div>

        <ul className="mt-space-sm space-y-1 font-body-sm text-body-sm text-on-surface-variant">
          {a.features.map((f) => (
            <li key={f} className="flex items-center gap-1.5">
              <Icon name="check_circle" size={16} className="text-primary" /> {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-space-md pt-space-sm flex items-center justify-between">
        <button className="font-label-sm text-label-sm text-primary hover:underline flex items-center gap-1" type="button">
          <Icon name="file_present" size={16} /> Test Report PDF
        </button>
        <Link
          href={`/verify?reg=${encodeURIComponent(a.regId)}`}
          className="bg-forest-light text-forest-dark hover:bg-primary hover:text-on-primary px-3 py-1 rounded-lg font-label-sm text-label-sm font-semibold transition-all flex items-center gap-1"
        >
          <Icon name="qr_code_2" size={16} /> View Label
        </Link>
      </div>
    </div>
  );
}
