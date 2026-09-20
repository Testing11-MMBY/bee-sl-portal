"use client";

import { Icon } from "@/components/ui/Icon";
import { useLang } from "@/components/i18n/LangProvider";

type L = { en: string; hi: string };
const L = (en: string, hi: string): L => ({ en, hi });

const TAGS = {
  notice: { label: L("Public Notice", "सार्वजनिक सूचना"), tone: "bg-forest-light text-forest-dark" },
  circular: { label: L("Circular", "परिपत्र"), tone: "bg-secondary-fixed text-on-secondary-fixed" },
  event: { label: L("Event", "कार्यक्रम"), tone: "bg-solar-gold-light text-solar-gold-dark" },
  doc: { label: L("Notice", "सूचना"), tone: "bg-navy-subtle text-navy-dark" },
  consult: { label: L("Consultation", "परामर्श"), tone: "bg-forest-light text-forest-dark" },
  exam: { label: L("Examination", "परीक्षा"), tone: "bg-secondary-fixed text-on-secondary-fixed" },
  result: { label: L("Result", "परिणाम"), tone: "bg-forest-light text-forest-dark" },
  rules: { label: L("Rules", "नियम"), tone: "bg-navy-subtle text-navy-dark" },
};

type TagKey = keyof typeof TAGS;

const NOTES: { tag: TagKey; date: string; title: L; pdf: string | null }[] = [
  { tag: "notice", date: "12 Sep 2026", pdf: null, title: L("Public Notice for Electric Cooking", "इलेक्ट्रिक कुकिंग हेतु सार्वजनिक सूचना") },
  { tag: "circular", date: "10 Sep 2026", pdf: null, title: L("Intimation of opening of window for ESCO empanelment / re-empanelment 2026", "2026 हेतु एस्को पैनलमेंट / पुनः-पैनलमेंट विंडो खुलने की सूचना") },
  { tag: "event", date: "05 Sep 2026", pdf: null, title: L("National Painting Competition for School Children 2026", "स्कूली बच्चों हेतु राष्ट्रीय चित्रकला प्रतियोगिता 2026") },
  { tag: "doc", date: "03 Sep 2026", pdf: "526.40 KB", title: L("Letter for Submission of Applications for Accreditation as an ACV Agency under the CCTS", "CCTS के अंतर्गत ACV एजेंसी के रूप में मान्यता हेतु आवेदन प्रस्तुत करने संबंधी पत्र") },
  { tag: "consult", date: "28 Aug 2026", pdf: "1.11 MB", title: L("Seeking stakeholders' comments on provisionally eligible Accredited Carbon Verification Agency under CCTS", "CCTS के अंतर्गत अनंतिम रूप से पात्र मान्यता प्राप्त कार्बन सत्यापन एजेंसी पर हितधारकों की टिप्पणियाँ आमंत्रित") },
  { tag: "exam", date: "22 Aug 2026", pdf: null, title: L("Registrations invited for the National Examination 2026 for Energy Managers, Energy Auditors and Energy Auditors (Building)", "ऊर्जा प्रबंधकों, ऊर्जा लेखा परीक्षकों एवं ऊर्जा लेखा परीक्षकों (भवन) हेतु राष्ट्रीय परीक्षा 2026 हेतु पंजीकरण आमंत्रित") },
  { tag: "result", date: "18 Aug 2026", pdf: null, title: L("Notice: Results of the Verification of Marks for the 25th National Examination have been declared", "सूचना: 25वीं राष्ट्रीय परीक्षा हेतु अंकों के सत्यापन के परिणाम घोषित") },
  { tag: "rules", date: "12 Aug 2026", pdf: "692.22 KB", title: L("Inviting Comments on Notification for Energy Conservation (Compliance Enforcement) Rules, 2025", "ऊर्जा संरक्षण (अनुपालन प्रवर्तन) नियम, 2025 की अधिसूचना पर टिप्पणियाँ आमंत्रित") },
  { tag: "notice", date: "05 Aug 2026", pdf: null, title: L("Building Star Labeling Program is under revision — no application shall be accepted until further notice", "भवन स्टार लेबलिंग कार्यक्रम संशोधनाधीन — अगली सूचना तक कोई आवेदन स्वीकार नहीं किया जाएगा") },
  { tag: "consult", date: "28 Jul 2026", pdf: "574.44 KB", title: L("Inviting Comments on the Draft Proposal for Future Fuel Efficiency Norms for HDVs, MDVs & LDVs", "HDV, MDV एवं LDV हेतु भावी ईंधन दक्षता मानदंडों के मसौदा प्रस्ताव पर टिप्पणियाँ आमंत्रित") },
];

export default function NotificationsPage() {
  const { lang } = useLang();
  const tx = (o: L) => o[lang];

  return (
    <div className="max-w-5xl mx-auto px-gutter py-space-2xl">
      <h1 className="font-headline-xl text-headline-xl text-on-surface mb-1">
        {lang === "hi" ? "समाचार, कार्यक्रम एवं डाउनलोड" : "News, Events & Downloads"}
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-xl">
        {lang === "hi"
          ? "ब्यूरो की नवीनतम सार्वजनिक सूचनाएँ, परिपत्र, परामर्श एवं डाउनलोड योग्य दस्तावेज़।"
          : "Latest public notices, circulars, consultations and downloadable documents from the Bureau."}
      </p>
      <div className="space-y-space-sm">
        {NOTES.map((n, i) => {
          const tag = TAGS[n.tag];
          return (
            <div key={i} className="bg-surface-card rounded-xl shadow-sm p-space-md flex items-start sm:items-center gap-space-md hover:shadow-md transition-all">
              <span className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold shrink-0 ${tag.tone}`}>{tx(tag.label)}</span>
              <div className="flex-1 min-w-0">
                <div className="font-title-lg text-title-lg text-on-surface">{tx(n.title)}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">{n.date}</div>
              </div>
              <button className="text-primary hover:underline font-label-sm text-label-sm flex items-center gap-1 shrink-0" type="button">
                <Icon name={n.pdf ? "picture_as_pdf" : "arrow_forward"} size={16} />
                {n.pdf ? `PDF · ${n.pdf}` : lang === "hi" ? "खोलें" : "Open"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
