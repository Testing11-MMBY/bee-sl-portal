"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/components/i18n/LangProvider";

const QUICK = [
  "Standards & Labelling",
  "PAT Scheme",
  "Energy Conservation Act 2001",
  "RCO Guidelines",
  "Publications & Reports",
];
const PORTALS = [
  "Beestarlabel Portal",
  "SAATHEE Portal",
  "ICM Platform",
  "ADEETIE Registry",
  "National Exam Portal",
];
const GOV = [
  { label: "Ministry of Power", href: "https://powermin.gov.in" },
  { label: "National Portal of India", href: "https://www.india.gov.in" },
  { label: "MyGov India", href: "https://www.mygov.in" },
  { label: "Open Government Data", href: "https://data.gov.in" },
  { label: "Citizen Charter", href: "/notifications" },
];

export function PublicFooter() {
  const { t } = useLang();
  return (
    <footer className="w-full bg-navy-dark text-on-surface-variant pt-space-2xl pb-space-lg">
      <div className="max-w-7xl mx-auto px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-lg pb-space-xl">
          <div className="lg:col-span-2">
            <div className="inline-block bg-white rounded-lg p-space-sm mb-space-md">
              <Image src="/images/bee-logo.png" alt="Bureau of Energy Efficiency" width={1260} height={308} className="h-10 w-auto object-contain" />
            </div>
            <p className="font-body-sm text-body-sm text-secondary-fixed/80 max-w-sm mb-space-md">
              {t("footer.about")}
            </p>
            <div className="font-body-sm text-body-sm text-secondary-fixed/70 flex flex-col gap-1">
              <span>4th Floor, Sewa Bhawan, R.K. Puram, New Delhi - 110066</span>
              <span>Phone: +91 11 26766700 | Email: helpdesk@beeindia.gov.in</span>
            </div>
          </div>

          <div>
            <h4 className="font-title-lg text-title-lg text-on-primary mb-space-md">{t("footer.quick")}</h4>
            <ul className="space-y-space-xs font-body-sm text-body-sm">
              {QUICK.map((l) => (
                <li key={l} className="hover:text-tertiary-fixed">
                  <Link href="/programmes">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-title-lg text-title-lg text-on-primary mb-space-md">{t("footer.portals")}</h4>
            <ul className="space-y-space-xs font-body-sm text-body-sm">
              {PORTALS.map((l) => (
                <li key={l} className="hover:text-tertiary-fixed">
                  <Link href="/directory">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-title-lg text-title-lg text-on-primary mb-space-md">{t("footer.govLinks")}</h4>
            <ul className="space-y-space-xs font-body-sm text-body-sm">
              {GOV.map((l) => (
                <li key={l.label} className="hover:text-tertiary-fixed">
                  {l.href.startsWith("http") ? (
                    <a href={l.href} rel="noreferrer" target="_blank">{l.label}</a>
                  ) : (
                    <Link href={l.href}>{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md font-label-sm text-label-sm text-secondary-fixed/70 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-space-md pt-space-md">
            {["About Us", "Contact Us", "Feedback", "Website Policies", "Help", "Privacy Policy", "Terms & Conditions", "Web Information Manager", "Sitemap", "STQC"].map((l, i, arr) => (
              <span key={l} className="flex items-center gap-space-md">
                <a className="hover:text-on-primary" href="#">{l}</a>
                {i < arr.length - 1 && <span>•</span>}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-space-lg">
            <span>STQC Certified Portal (GIGW 3.0 Compliant)</span>
            <span>{t("footer.updated")}: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
            <span>{t("footer.visitors")}: 28,491,204</span>
          </div>
        </div>
        <div className="text-center mt-space-md font-label-sm text-label-sm text-secondary-fixed/60">
          {t("footer.credit")}
        </div>
        <div className="text-center mt-1 font-label-sm text-label-sm text-secondary-fixed/50">
          © {new Date().getFullYear()} Bureau of Energy Efficiency, Ministry of Power, Government of India. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
