import { Icon } from "@/components/ui/Icon";

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-gutter py-space-2xl">
      <h1 className="font-headline-xl text-headline-xl text-on-surface mb-1">Contact & Grievance</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-xl max-w-3xl">
        Reach the Bureau, or raise a consumer-vigilance complaint about a suspected counterfeit star label.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
        <div className="space-y-space-md">
          {[
            { icon: "location_on", t: "Head Office", d: "4th Floor, Sewa Bhawan, R.K. Puram, New Delhi - 110066" },
            { icon: "call", t: "Phone", d: "+91 11 26766700" },
            { icon: "mail", t: "Email", d: "helpdesk@beeindia.gov.in" },
            { icon: "schedule", t: "Working Hours", d: "Mon – Fri, 9:30 AM – 6:00 PM IST" },
          ].map((c) => (
            <div key={c.t} className="bg-surface-card rounded-xl shadow-sm p-space-md flex items-center gap-space-md">
              <span className="w-10 h-10 rounded-lg bg-forest-light text-primary flex items-center justify-center shrink-0">
                <Icon name={c.icon} size={22} fill />
              </span>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">{c.t}</div>
                <div className="font-title-lg text-title-lg text-on-surface">{c.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface-card rounded-xl shadow-md p-space-lg">
          <div className="flex items-center gap-space-sm mb-space-md">
            <span className="w-10 h-10 rounded-lg bg-solar-gold-light text-solar-gold-dark flex items-center justify-center">
              <Icon name="report_problem" size={22} fill />
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Report a Fraudulent Star Rating</h2>
          </div>
          <div className="space-y-space-md">
            <Input label="Your name" placeholder="Full name" />
            <Input label="Mobile / Email" placeholder="For updates on your complaint" />
            <Input label="Product & brand" placeholder="e.g. XYZ 1.5-Ton AC, model ABC" />
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Details</label>
              <textarea rows={4} placeholder="Where you saw it, the label details, and why it looks suspicious…" className="w-full py-2 px-3 rounded-lg bg-surface-ground font-body-sm text-body-sm outline-none" />
            </div>
            <button className="w-full bg-error text-on-error py-2.5 rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-on-error-container transition-all" type="button">
              <Icon name="send" size={18} /> Submit Complaint
            </button>
            <p className="font-label-sm text-label-sm text-on-surface-variant text-center">Demo form — submission is not wired to a backend yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">{label}</label>
      <input placeholder={placeholder} className="w-full py-2 px-3 rounded-lg bg-surface-ground font-body-sm text-body-sm outline-none" />
    </div>
  );
}
