/**
 * Public navigation with mega-menu dropdowns, mirroring beeindia.gov.in.
 * Labels are bilingual; hrefs point to our internal pages (with section anchors).
 */
export interface NavLeaf {
  en: string;
  hi: string;
  href: string;
}
export interface NavGroup {
  groupEn: string;
  groupHi: string;
  items: NavLeaf[];
}
export interface NavItem {
  key: string; // i18n key for the top-level label
  href: string;
  groups?: NavGroup[];
}

export const NAV: NavItem[] = [
  { key: "nav.home", href: "/" },
  {
    key: "nav.about",
    href: "/about",
    groups: [
      {
        groupEn: "About Us",
        groupHi: "हमारे बारे में",
        items: [
          { en: "About BEE", hi: "बीईई के बारे में", href: "/about#about" },
          { en: "Director General's Message", hi: "महानिदेशक का संदेश", href: "/about#message" },
          { en: "Organizational Structure", hi: "संगठनात्मक संरचना", href: "/about#org" },
          { en: "Directory", hi: "निर्देशिका", href: "/contact" },
          { en: "EC Act, 2001", hi: "ऊर्जा संरक्षण अधिनियम, 2001", href: "/about#ec-act" },
        ],
      },
      {
        groupEn: "Partners",
        groupHi: "भागीदार",
        items: [
          { en: "International Partners", hi: "अंतरराष्ट्रीय भागीदार", href: "/about#partners" },
          { en: "National Partners", hi: "राष्ट्रीय भागीदार", href: "/about#partners" },
          { en: "DISCOMs & EESL", hi: "डिस्कॉम एवं ईईएसएल", href: "/about#partners" },
          { en: "ESCOs & ECBC Experts", hi: "एस्को एवं ईसीबीसी विशेषज्ञ", href: "/about#partners" },
        ],
      },
    ],
  },
  {
    key: "nav.programmes",
    href: "/programmes",
    groups: [
      {
        groupEn: "Flagship Programmes",
        groupHi: "प्रमुख कार्यक्रम",
        items: [
          { en: "Standards & Labelling", hi: "मानक एवं लेबलिंग", href: "/programmes#sl" },
          { en: "Perform, Achieve & Trade (PAT)", hi: "परफॉर्म, अचीव एवं ट्रेड (PAT)", href: "/programmes#pat" },
          { en: "Energy Conservation Building Code", hi: "ऊर्जा संरक्षण भवन संहिता", href: "/programmes#ecbc" },
          { en: "Demand Side Management", hi: "मांग पक्ष प्रबंधन", href: "/programmes#dsm" },
        ],
      },
      {
        groupEn: "Markets & Outreach",
        groupHi: "बाज़ार एवं जनसंपर्क",
        items: [
          { en: "Indian Carbon Market (CCTS)", hi: "भारतीय कार्बन बाज़ार (CCTS)", href: "/programmes#carbon" },
          { en: "National Certification Examination", hi: "राष्ट्रीय प्रमाणन परीक्षा", href: "/programmes#exam" },
          { en: "Awareness & Outreach", hi: "जागरूकता एवं जनसंपर्क", href: "/programmes#awareness" },
          { en: "National Energy Conservation Award", hi: "राष्ट्रीय ऊर्जा संरक्षण पुरस्कार", href: "/programmes#neca" },
        ],
      },
    ],
  },
  { key: "nav.directory", href: "/directory" },
  { key: "nav.verify", href: "/verify" },
  { key: "nav.calculator", href: "/calculator" },
  { key: "nav.notifications", href: "/notifications" },
  { key: "nav.contact", href: "/contact" },
];
