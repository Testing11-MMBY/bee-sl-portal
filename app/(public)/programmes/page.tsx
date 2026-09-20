"use client";

import { Icon } from "@/components/ui/Icon";
import { useLang } from "@/components/i18n/LangProvider";

type L = { en: string; hi: string };
const L = (en: string, hi: string): L => ({ en, hi });

interface Prog {
  id: string;
  icon: string;
  tag: L;
  title: L;
  desc: L;
}

const PROGRAMMES: Prog[] = [
  {
    id: "sl", icon: "sell", tag: L("Flagship", "प्रमुख"),
    title: L("Standards & Labelling (S&L)", "मानक एवं लेबलिंग (S&L)"),
    desc: L("Launched in 2006, the S&L programme provides consumers an informed choice about the energy savings and cost-saving potential of marketed household and other equipment. It rates appliances from 1 to 5 stars across 38 mandatory and voluntary categories, driving manufacturers toward more efficient designs.", "2006 में शुरू किया गया S&L कार्यक्रम उपभोक्ताओं को बाज़ार में उपलब्ध घरेलू एवं अन्य उपकरणों की ऊर्जा एवं लागत बचत क्षमता के बारे में सूचित विकल्प प्रदान करता है। यह 38 अनिवार्य एवं स्वैच्छिक श्रेणियों में उपकरणों को 1 से 5 स्टार तक रेटिंग देता है, जिससे निर्माता अधिक कुशल डिज़ाइन की ओर प्रेरित होते हैं।"),
  },
  {
    id: "pat", icon: "factory", tag: L("Industry", "उद्योग"),
    title: L("Perform, Achieve & Trade (PAT)", "परफॉर्म, अचीव एवं ट्रेड (PAT)"),
    desc: L("A market-based mechanism to enhance the cost-effectiveness of improvements in energy efficiency in energy-intensive large industries and facilities, through the certification of energy savings that can be traded (Energy Saving Certificates — ESCerts).", "ऊर्जा-गहन बड़े उद्योगों एवं सुविधाओं में ऊर्जा दक्षता सुधारों की लागत-प्रभावशीलता बढ़ाने हेतु एक बाज़ार-आधारित तंत्र, जिसमें ऊर्जा बचत को प्रमाणित कर व्यापार योग्य बनाया जाता है (ऊर्जा बचत प्रमाणपत्र — ESCerts)।"),
  },
  {
    id: "ecbc", icon: "apartment", tag: L("Buildings", "भवन"),
    title: L("Energy Conservation Building Code (ECBC)", "ऊर्जा संरक्षण भवन संहिता (ECBC)"),
    desc: L("Sets minimum energy performance standards for commercial buildings, with the Eco Niwas Samhita covering the residential sector — reducing energy consumption in the country's fast-growing building stock.", "वाणिज्यिक भवनों हेतु न्यूनतम ऊर्जा प्रदर्शन मानक निर्धारित करता है, तथा 'इको निवास संहिता' आवासीय क्षेत्र को कवर करती है — जिससे देश के तेज़ी से बढ़ते भवन क्षेत्र में ऊर्जा खपत कम होती है।"),
  },
  {
    id: "dsm", icon: "bolt", tag: L("Demand Side", "मांग पक्ष"),
    title: L("Demand Side Management (DSM)", "मांग पक्ष प्रबंधन (DSM)"),
    desc: L("Planning, implementation and monitoring of utility activities designed to encourage consumers to modify their level and pattern of electricity usage — spanning Agricultural DSM (AgDSM), Municipal DSM (MuDSM) and DISCOM DSM.", "उपयोगिता गतिविधियों की योजना, कार्यान्वयन एवं निगरानी जो उपभोक्ताओं को बिजली उपयोग के स्तर एवं पैटर्न में बदलाव हेतु प्रोत्साहित करती हैं — इसमें कृषि DSM (AgDSM), नगरपालिका DSM (MuDSM) एवं डिस्कॉम DSM शामिल हैं।"),
  },
  {
    id: "carbon", icon: "co2", tag: L("Markets", "बाज़ार"),
    title: L("Indian Carbon Market (CCTS)", "भारतीय कार्बन बाज़ार (CCTS)"),
    desc: L("The Carbon Credit Trading Scheme establishes a national framework for the decarbonisation of the Indian economy by pricing greenhouse gas emissions through the trading of Carbon Credit Certificates.", "कार्बन क्रेडिट ट्रेडिंग योजना कार्बन क्रेडिट प्रमाणपत्रों के व्यापार के माध्यम से ग्रीनहाउस गैस उत्सर्जन का मूल्य निर्धारण कर भारतीय अर्थव्यवस्था के डीकार्बोनाइज़ेशन हेतु एक राष्ट्रीय ढाँचा स्थापित करती है।"),
  },
  {
    id: "exam", icon: "school", tag: L("Capacity", "क्षमता"),
    title: L("National Certification Examination", "राष्ट्रीय प्रमाणन परीक्षा"),
    desc: L("BEE conducts the National Certification Examination for Energy Managers and Energy Auditors, building the professional capacity required to deliver energy efficiency across industry and buildings.", "बीईई ऊर्जा प्रबंधकों एवं ऊर्जा लेखा परीक्षकों हेतु राष्ट्रीय प्रमाणन परीक्षा आयोजित करता है, जिससे उद्योग एवं भवनों में ऊर्जा दक्षता प्रदान करने हेतु आवश्यक व्यावसायिक क्षमता का निर्माण होता है।"),
  },
  {
    id: "awareness", icon: "campaign", tag: L("Outreach", "जनसंपर्क"),
    title: L("Awareness & Outreach", "जागरूकता एवं जनसंपर्क"),
    desc: L("BEE drives public awareness through the Annual Report, the BEE Line newsletter, the 'Bachat Ke Sitare' star-label campaign, and the National Painting Competition for school children.", "बीईई वार्षिक रिपोर्ट, बीईई लाइन न्यूज़लेटर, 'बचत के सितारे' स्टार-लेबल अभियान एवं स्कूली बच्चों हेतु राष्ट्रीय चित्रकला प्रतियोगिता के माध्यम से जन-जागरूकता को बढ़ावा देता है।"),
  },
  {
    id: "neca", icon: "workspace_premium", tag: L("Recognition", "मान्यता"),
    title: L("National Energy Conservation Award (NECA)", "राष्ट्रीय ऊर्जा संरक्षण पुरस्कार (NECA)"),
    desc: L("Instituted to recognise and encourage industries, establishments and institutions that have taken special efforts to reduce energy consumption while maintaining their production and performance.", "उन उद्योगों, प्रतिष्ठानों एवं संस्थानों को मान्यता देने एवं प्रोत्साहित करने हेतु स्थापित, जिन्होंने अपने उत्पादन एवं प्रदर्शन को बनाए रखते हुए ऊर्जा खपत कम करने हेतु विशेष प्रयास किए हैं।"),
  },
];

export default function ProgrammesPage() {
  const { lang } = useLang();
  const tx = (o: L) => o[lang];

  return (
    <div className="max-w-6xl mx-auto px-gutter py-space-2xl">
      <h1 className="font-headline-xl text-headline-xl text-on-surface mb-1">
        {lang === "hi" ? "कार्यक्रम एवं योजनाएँ" : "Programmes & Schemes"}
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-xl max-w-3xl">
        {lang === "hi"
          ? "बीईई उपकरणों, उद्योग, भवनों, परिवहन एवं बाज़ारों में मांग-पक्ष एवं मानक कार्यक्रमों का एक व्यापक समूह संचालित करता है।"
          : "BEE runs a comprehensive portfolio of demand-side and standards programmes across appliances, industry, buildings, transport and markets."}
      </p>

      <div className="space-y-space-md">
        {PROGRAMMES.map((p) => (
          <section key={p.id} id={p.id} className="scroll-mt-[210px] bg-surface-card rounded-xl shadow-sm p-space-lg flex flex-col sm:flex-row gap-space-md">
            <span className="w-14 h-14 rounded-xl bg-forest-light text-primary flex items-center justify-center shrink-0">
              <Icon name={p.icon} size={28} fill />
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-space-sm mb-1 flex-wrap">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">{tx(p.title)}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">{tx(p.tag)}</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{tx(p.desc)}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
