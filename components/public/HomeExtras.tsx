"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useLang } from "@/components/i18n/LangProvider";

type L = { en: string; hi: string };
const L = (en: string, hi: string): L => ({ en, hi });

/* Circular avatar placeholder with a tricolour ring (no real photos). */
function Portrait({ label }: { label: string }) {
  return (
    <div
      className="rounded-full grid place-items-center shrink-0"
      style={{ width: 72, height: 72, background: "conic-gradient(#FF9933, #ffffff, #138808, #FF9933)", padding: 3 }}
      aria-hidden
    >
      <div className="w-full h-full rounded-full bg-surface-container-low grid place-items-center" title={label}>
        <Icon name="person" size={34} className="text-secondary" fill />
      </div>
    </div>
  );
}

/* --- Leadership: quote + About BEE + ministers --- */
export function LeadershipBlock() {
  const { lang } = useLang();
  const tx = (o: L) => o[lang];

  const quote = L(
    "Energy sector plays a big role in the progress of the country and contributes to both ease of living and ease of doing business.",
    "ऊर्जा क्षेत्र देश की प्रगति में बड़ी भूमिका निभाता है और जीवन की सुगमता एवं व्यापार की सुगमता दोनों में योगदान देता है।"
  );
  const about = L(
    "The Government of India set up the Bureau of Energy Efficiency (BEE) on 1st March 2002 under the provisions of the Energy Conservation Act, 2001. Its mission is to assist in developing policies and strategies with the primary objective of reducing the energy intensity of the Indian economy.",
    "भारत सरकार ने ऊर्जा संरक्षण अधिनियम, 2001 के प्रावधानों के अंतर्गत 1 मार्च 2002 को ऊर्जा दक्षता ब्यूरो (बीईई) की स्थापना की। इसका मिशन भारतीय अर्थव्यवस्था की ऊर्जा तीव्रता कम करने के प्राथमिक उद्देश्य से नीतियाँ एवं रणनीतियाँ विकसित करने में सहायता करना है।"
  );
  const ministers = [
    { name: L("Shri Manohar Lal", "श्री मनोहर लाल"), role: L("Hon'ble Cabinet Minister of Power", "माननीय केंद्रीय विद्युत मंत्री") },
    { name: L("Shri Shripad Naik", "श्री श्रीपाद नाईक"), role: L("Hon'ble Minister of State for Power", "माननीय विद्युत राज्य मंत्री") },
  ];

  return (
    <section className="w-full bg-surface-ground py-space-2xl">
      <div className="max-w-7xl mx-auto px-gutter space-y-space-lg">
        {/* Quote */}
        <div className="bg-surface-card rounded-xl border border-border-subtle/60 shadow-card p-space-lg flex items-start gap-space-lg">
          <Portrait label={tx(ministers[0].name)} />
          <div>
            <Icon name="format_quote" size={32} className="text-primary/30" />
            <p className="font-headline-sm text-headline-sm text-on-surface leading-snug -mt-2">{tx(quote)}</p>
            <div className="mt-space-sm font-title-lg text-title-lg text-primary">
              {lang === "hi" ? "श्री नरेंद्र मोदी" : "Shri Narendra Modi"}
            </div>
            <div className="font-body-sm text-body-sm text-secondary">
              {lang === "hi" ? "माननीय प्रधानमंत्री, भारत" : "Hon'ble Prime Minister of India"}
            </div>
          </div>
        </div>

        {/* About + ministers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          <div className="lg:col-span-2 bg-surface-card rounded-xl border border-border-subtle/60 shadow-card p-space-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2 mb-space-sm">
              <Icon name="account_tree" size={22} /> {lang === "hi" ? "ऊर्जा दक्षता ब्यूरो (बीईई)" : "Bureau of Energy Efficiency (BEE)"}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{tx(about)}</p>
            <Link href="/about" className="mt-space-md inline-flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md px-space-lg py-2 rounded-full hover:bg-forest-dark transition-colors">
              {lang === "hi" ? "और देखें" : "View more"} <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-space-md">
            {ministers.map((m) => (
              <div key={m.name.en} className="bg-surface-card rounded-xl border border-border-subtle/60 shadow-card p-space-md flex flex-col items-center text-center">
                <Portrait label={tx(m.name)} />
                <div className="font-title-lg text-title-lg text-on-surface mt-space-sm leading-tight">{tx(m.name)}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">{tx(m.role)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Government partner links strip --- */
const PARTNERS = [
  { label: "india.gov.in", href: "https://www.india.gov.in", icon: "public" },
  { label: "data.gov.in", href: "https://data.gov.in", icon: "database" },
  { label: "Public Grievances", href: "https://pgportal.gov.in", icon: "support_agent" },
  { label: "Digital India", href: "https://www.digitalindia.gov.in", icon: "devices" },
  { label: "MyGov", href: "https://www.mygov.in", icon: "groups" },
  { label: "Ministry of Power", href: "https://powermin.gov.in", icon: "bolt" },
];

export function GovLinksStrip() {
  return (
    <section className="w-full bg-surface-container-lowest border-y border-border-subtle py-space-lg">
      <div className="max-w-7xl mx-auto px-gutter">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-sm">
          {PARTNERS.map((p) => (
            <a key={p.label} href={p.href} target="_blank" rel="noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 p-space-md rounded-lg bg-surface-card border border-border-subtle/60 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200 text-center">
              <Icon name={p.icon} size={28} className="text-primary" />
              <span className="font-label-md text-label-md text-on-surface leading-tight">{p.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Quick Links + Location Map --- */
export function QuickLinksMap() {
  const { lang } = useLang();
  const links = [
    { label: L("About Us", "हमारे बारे में"), href: "/about" },
    { label: L("Programmes", "कार्यक्रम"), href: "/programmes" },
    { label: L("Events", "कार्यक्रम एवं आयोजन"), href: "/notifications" },
    { label: L("Publications", "प्रकाशन"), href: "/notifications" },
    { label: L("Tenders", "निविदाएँ"), href: "/notifications" },
    { label: L("RTI", "आरटीआई"), href: "/contact" },
    { label: L("Careers", "भर्ती"), href: "/contact" },
  ];
  const tx = (o: L) => o[lang];

  return (
    <section className="w-full bg-surface-ground py-space-2xl">
      <div className="max-w-7xl mx-auto px-gutter grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
        {/* Quick links */}
        <div>
          <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-2 mb-space-md">
            <Icon name="link" size={24} /> {lang === "hi" ? "त्वरित लिंक" : "Quick Links"}
          </h2>
          <ul className="space-y-space-xs">
            {links.map((l) => (
              <li key={l.label.en}>
                <Link href={l.href} className="flex items-center gap-space-sm py-2 font-body-lg text-body-lg text-on-surface hover:text-primary transition-colors border-b border-border-subtle">
                  <Icon name="chevron_right" size={18} className="text-primary" /> {tx(l.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Location map */}
        <div>
          <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-2 mb-space-md">
            <Icon name="location_on" size={24} fill /> {lang === "hi" ? "स्थान मानचित्र" : "Location Map"}
          </h2>
          <div className="rounded-xl overflow-hidden shadow-card border border-border-subtle/60">
            <iframe
              title="BEE location map"
              src="https://maps.google.com/maps?q=Bureau%20of%20Energy%20Efficiency%2C%20Sewa%20Bhawan%2C%20R.K.%20Puram%2C%20New%20Delhi&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm flex items-center gap-1.5">
            <Icon name="place" size={16} className="text-primary" /> 4th Floor, Sewa Bhawan, R.K. Puram, New Delhi - 110066
          </p>
        </div>
      </div>
    </section>
  );
}
