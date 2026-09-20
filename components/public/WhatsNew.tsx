"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useLang } from "@/components/i18n/LangProvider";

type L = { en: string; hi: string };
const L = (en: string, hi: string): L => ({ en, hi });

interface Item {
  title: L;
  date: string;
  pdf?: string;
  isNew?: boolean;
}

const TABS: { key: string; label: L; items: Item[] }[] = [
  {
    key: "notices",
    label: L("Notices", "सूचनाएँ"),
    items: [
      { title: L("Public Notice for Electric Cooking", "इलेक्ट्रिक कुकिंग हेतु सार्वजनिक सूचना"), date: "12 Sep 2026", isNew: true },
      { title: L("Seeking stakeholders' comments on Accredited Carbon Verification Agency under CCTS", "CCTS के अंतर्गत मान्यता प्राप्त कार्बन सत्यापन एजेंसी पर हितधारकों की टिप्पणियाँ आमंत्रित"), date: "28 Aug 2026", pdf: "1.11 MB", isNew: true },
      { title: L("Inviting Comments on Energy Conservation (Compliance Enforcement) Rules, 2025", "ऊर्जा संरक्षण (अनुपालन प्रवर्तन) नियम, 2025 पर टिप्पणियाँ आमंत्रित"), date: "12 Aug 2026", pdf: "692.22 KB" },
      { title: L("Building Star Labeling Program is under revision until further notice", "भवन स्टार लेबलिंग कार्यक्रम अगली सूचना तक संशोधनाधीन"), date: "05 Aug 2026" },
      { title: L("Draft Proposal for Future Fuel Efficiency Norms for HDVs, MDVs & LDVs", "HDV, MDV एवं LDV हेतु भावी ईंधन दक्षता मानदंडों का मसौदा प्रस्ताव"), date: "28 Jul 2026", pdf: "574.44 KB" },
    ],
  },
  {
    key: "tenders",
    label: L("Tenders", "निविदाएँ"),
    items: [
      { title: L("RfP for Procurement of IT Infrastructure (Desktops, Laptops, NAS) with IT Asset Management", "आईटी अवसंरचना (डेस्कटॉप, लैपटॉप, एनएएस) की खरीद हेतु आरएफपी"), date: "09 Sep 2026", pdf: "2.40 MB", isNew: true },
      { title: L("Engagement of agency for social media management and content creation", "सोशल मीडिया प्रबंधन एवं कंटेंट निर्माण हेतु एजेंसी की नियुक्ति"), date: "24 Aug 2026", pdf: "880 KB" },
      { title: L("Hiring of vehicles on rental basis for BEE, New Delhi", "बीईई, नई दिल्ली हेतु किराये पर वाहनों की व्यवस्था"), date: "11 Aug 2026", pdf: "310 KB" },
      { title: L("Annual maintenance contract for office equipment", "कार्यालय उपकरणों हेतु वार्षिक रखरखाव अनुबंध"), date: "30 Jul 2026", pdf: "265 KB" },
    ],
  },
  {
    key: "events",
    label: L("Events", "आयोजन"),
    items: [
      { title: L("National Painting Competition for School Children 2026", "स्कूली बच्चों हेतु राष्ट्रीय चित्रकला प्रतियोगिता 2026"), date: "05 Sep 2026", isNew: true },
      { title: L("25th Foundation Day — Bureau of Energy Efficiency", "25वाँ स्थापना दिवस — ऊर्जा दक्षता ब्यूरो"), date: "01 Mar 2026" },
      { title: L("National Energy Conservation Day observance", "राष्ट्रीय ऊर्जा संरक्षण दिवस समारोह"), date: "14 Dec 2025" },
      { title: L("Workshop on PAT Cycle compliance for Designated Consumers", "अभिहित उपभोक्ताओं हेतु PAT चक्र अनुपालन कार्यशाला"), date: "20 Nov 2025" },
    ],
  },
  {
    key: "recruit",
    label: L("Recruitment", "भर्ती"),
    items: [
      { title: L("Result for the post of Assistant Director (Technical) in BEE", "बीईई में सहायक निदेशक (तकनीकी) पद हेतु परिणाम"), date: "10 Sep 2026", pdf: "57.30 KB", isNew: true },
      { title: L("Vacancy Circular — Deputy Director General (Technical)", "रिक्ति परिपत्र — उप महानिदेशक (तकनीकी)"), date: "26 Aug 2026", pdf: "131 KB" },
      { title: L("Recruitment for the post of Assistant Director (Technical) — Vacancy No. 1/2025", "सहायक निदेशक (तकनीकी) पद हेतु भर्ती — रिक्ति सं. 1/2025"), date: "12 Aug 2026", pdf: "92.82 KB" },
      { title: L("Request for Applications for ECSBC Master Trainers", "ECSBC मास्टर ट्रेनर्स हेतु आवेदन आमंत्रित"), date: "16 Apr 2026", pdf: "175 KB" },
    ],
  },
];

export function WhatsNew() {
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  const tx = (o: L) => o[lang];
  const tab = TABS[active];

  return (
    <section className="w-full bg-surface-container-lowest py-space-xl">
      <div className="max-w-7xl mx-auto px-gutter">
        <div className="rounded-xl border border-border-subtle/70 bg-surface-card shadow-card overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-stretch border-b border-border-subtle bg-surface-container-low/50 overflow-x-auto app-scroll" role="tablist">
            {TABS.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={`px-space-md py-space-sm font-title-lg text-title-lg whitespace-nowrap border-b-[3px] transition-colors ${
                    on ? "border-primary text-primary bg-forest-light/40" : "border-transparent text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                  }`}
                >
                  {tx(t.label)}
                </button>
              );
            })}
            <div className="flex-1 hidden sm:block" />
            <Link href="/notifications" className="hidden sm:flex items-center gap-1 px-space-md font-label-md text-label-md text-primary hover:underline">
              {lang === "hi" ? "सभी देखें" : "View All"} <Icon name="arrow_forward" size={15} />
            </Link>
          </div>

          {/* List */}
          <ul>
            {tab.items.map((item, idx) => (
              <li key={idx} className={`flex items-start gap-space-sm px-space-md py-2.5 border-b border-border-subtle last:border-0 ${idx % 2 ? "bg-surface-container-low/40" : ""}`}>
                <Icon name="chevron_right" size={16} className="text-primary mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <Link href="/notifications" className="font-body-md text-body-md text-on-surface hover:text-primary hover:underline">
                    {tx(item.title)}
                  </Link>
                  {item.isNew && <span className="ml-2 align-middle inline-flex items-center px-1.5 py-0.5 rounded-sm bg-error text-on-error font-label-sm text-label-sm uppercase tracking-wide">New</span>}
                  <div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{item.date}</div>
                </div>
                {item.pdf && (
                  <span className="shrink-0 inline-flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                    <Icon name="picture_as_pdf" size={15} className="text-error" /> {item.pdf}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
