"use client";

import { Icon } from "@/components/ui/Icon";
import { useLang } from "@/components/i18n/LangProvider";

type L = { en: string; hi: string };
const L = (en: string, hi: string): L => ({ en, hi });

const C = {
  heading: L("About the Bureau of Energy Efficiency", "ऊर्जा दक्षता ब्यूरो के बारे में"),
  aboutTitle: L("About BEE", "बीईई के बारे में"),
  about: L(
    "The Government of India set up the Bureau of Energy Efficiency (BEE) on 1st March 2002 under the provisions of the Energy Conservation Act, 2001. The mission of the Bureau of Energy Efficiency is to assist in developing policies and strategies with a thrust on self-regulation and market principles, with the primary objective of reducing the energy intensity of the Indian economy within the overall framework of the Energy Conservation Act, 2001. This will be achieved with the active participation of all stakeholders, resulting in accelerated and sustained adoption of energy efficiency in all sectors.",
    "भारत सरकार ने ऊर्जा संरक्षण अधिनियम, 2001 के प्रावधानों के अंतर्गत 1 मार्च 2002 को ऊर्जा दक्षता ब्यूरो (बीईई) की स्थापना की। बीईई का मिशन स्व-नियमन एवं बाज़ार सिद्धांतों पर बल देते हुए नीतियाँ एवं रणनीतियाँ विकसित करने में सहायता करना है, जिसका प्राथमिक उद्देश्य ऊर्जा संरक्षण अधिनियम, 2001 के समग्र ढाँचे के भीतर भारतीय अर्थव्यवस्था की ऊर्जा तीव्रता को कम करना है। यह सभी हितधारकों की सक्रिय भागीदारी से प्राप्त किया जाएगा, जिससे सभी क्षेत्रों में ऊर्जा दक्षता को त्वरित एवं सतत रूप से अपनाया जा सके।"
  ),
  msgTitle: L("Director General's Message", "महानिदेशक का संदेश"),
  msg: L(
    "With the growth of the economy, the demand for energy has grown substantially. Further, the high level of energy intensity in some of the sectors is a matter of concern. In such a scenario, efficient use of energy resources and their conservation assume tremendous significance and are essential for the curtailment of wasteful consumption and sustainable development. Recognising the fact that efficient use of energy and its conservation is the least-cost option to meet the increasing energy demand, the Government of India enacted the Energy Conservation Act, 2001 and established the Bureau of Energy Efficiency in March 2002. The Act provides for institutionalising and strengthening the delivery mechanism for energy efficiency services in the country and provides the much-needed coordination between the various entities. Energy saving is a national cause, and all of us will have to join hands and make all-out efforts to make India an energy-efficient economy and society, so that not only do we remain competitive within our own market but are also able to compete in the international market.",
    "अर्थव्यवस्था की वृद्धि के साथ ऊर्जा की माँग में काफी वृद्धि हुई है। इसके अतिरिक्त, कुछ क्षेत्रों में ऊर्जा तीव्रता का उच्च स्तर चिंता का विषय है। ऐसे परिदृश्य में ऊर्जा संसाधनों का कुशल उपयोग एवं उनका संरक्षण अत्यधिक महत्व रखता है तथा अपव्ययी उपभोग को रोकने और सतत विकास के लिए आवश्यक है। यह मानते हुए कि ऊर्जा का कुशल उपयोग एवं संरक्षण बढ़ती ऊर्जा माँग को पूरा करने का न्यूनतम-लागत विकल्प है, भारत सरकार ने ऊर्जा संरक्षण अधिनियम, 2001 अधिनियमित किया और मार्च 2002 में ऊर्जा दक्षता ब्यूरो की स्थापना की। यह अधिनियम देश में ऊर्जा दक्षता सेवाओं हेतु वितरण तंत्र को संस्थागत एवं सुदृढ़ करने का प्रावधान करता है तथा विभिन्न संस्थाओं के बीच अपेक्षित समन्वय प्रदान करता है। ऊर्जा बचत एक राष्ट्रीय कार्य है और हम सभी को मिलकर भारत को एक ऊर्जा-कुशल अर्थव्यवस्था एवं समाज बनाने के भरपूर प्रयास करने होंगे।"
  ),
  dg: L("Director General, Bureau of Energy Efficiency", "महानिदेशक, ऊर्जा दक्षता ब्यूरो"),
  visionT: L("Vision", "दृष्टि"),
  vision: L("An energy-efficient India — a prosperous, low-carbon economy powered by the efficient use of energy.", "ऊर्जा-कुशल भारत — ऊर्जा के कुशल उपयोग से संचालित एक समृद्ध, न्यून-कार्बन अर्थव्यवस्था।"),
  missionT: L("Mission", "मिशन"),
  mission: L("To reduce the energy intensity of the Indian economy through policy, market interventions and the active participation of all stakeholders.", "नीति, बाज़ार हस्तक्षेप एवं सभी हितधारकों की सक्रिय भागीदारी के माध्यम से भारतीय अर्थव्यवस्था की ऊर्जा तीव्रता को कम करना।"),
  orgT: L("Organizational Structure", "संगठनात्मक संरचना"),
  org: L("BEE is headed by a Director General and governed by a Governing Council chaired by the Union Minister of Power. It functions under the Ministry of Power, Government of India.", "बीईई का नेतृत्व एक महानिदेशक करते हैं और यह केंद्रीय विद्युत मंत्री की अध्यक्षता वाली एक शासी परिषद द्वारा शासित है। यह विद्युत मंत्रालय, भारत सरकार के अंतर्गत कार्य करता है।"),
  partnersT: L("Partners", "भागीदार"),
  intlT: L("International Partners", "अंतरराष्ट्रीय भागीदार"),
  natT: L("National Partners", "राष्ट्रीय भागीदार"),
  ecActT: L("The Energy Conservation Act, 2001", "ऊर्जा संरक्षण अधिनियम, 2001"),
  ecAct: L("The Energy Conservation Act, 2001 provides the legal framework, institutional arrangement and regulatory mechanism at the central and state levels to embark upon the energy efficiency drive. BEE derives its powers and functions from the Act — notably Chapter IV (Powers and Functions of the Bureau) and Chapter VIII (Penalty).", "ऊर्जा संरक्षण अधिनियम, 2001 केंद्रीय एवं राज्य स्तर पर ऊर्जा दक्षता अभियान आरंभ करने हेतु विधिक ढाँचा, संस्थागत व्यवस्था एवं नियामक तंत्र प्रदान करता है। बीईई अपनी शक्तियाँ एवं कार्य इसी अधिनियम से प्राप्त करता है — विशेषकर अध्याय IV (ब्यूरो की शक्तियाँ एवं कार्य) तथा अध्याय VIII (शास्ति)।"),
  established: L("Established", "स्थापित"),
  categories: L("Appliance categories", "उपकरण श्रेणियाँ"),
  labelled: L("Star labels issued / yr", "प्रति वर्ष जारी स्टार लेबल"),
  savings: L("Annual consumer savings", "वार्षिक उपभोक्ता बचत"),
};

const INTL = ["GEF", "GIZ", "USAID", "UNIDO", "UNDP", "World Bank (IBRD)"];
const NATIONAL = ["DISCOMs", "Designated Consumers", "EESL", "ESCOs", "ECBC Experts", "State Designated Agencies"];

export default function AboutPage() {
  const { lang } = useLang();
  const tx = (o: L) => o[lang];

  return (
    <div className="max-w-5xl mx-auto px-gutter py-space-2xl">
      <h1 className="font-headline-xl text-headline-xl text-on-surface mb-space-lg">{tx(C.heading)}</h1>

      {/* About BEE */}
      <section id="about" className="scroll-mt-[210px] mb-space-2xl">
        <h2 className="font-headline-md text-headline-md text-primary mb-space-sm">{tx(C.aboutTitle)}</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{tx(C.about)}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md mt-space-lg">
          {[
            { v: "2002", l: C.established },
            { v: "38", l: C.categories },
            { v: "10 M+", l: C.labelled },
            { v: "₹11,450 Cr", l: C.savings },
          ].map((s) => (
            <div key={s.v} className="bg-surface-card rounded-xl shadow-sm p-space-md text-center">
              <div className="font-headline-md text-headline-md text-primary font-bold">{s.v}</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">{tx(s.l)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-2xl">
        <div className="bg-forest-light rounded-xl p-space-lg">
          <div className="flex items-center gap-space-sm mb-space-sm">
            <Icon name="visibility" size={22} fill className="text-primary" />
            <h3 className="font-headline-sm text-headline-sm text-forest-dark">{tx(C.visionT)}</h3>
          </div>
          <p className="font-body-md text-body-md text-forest-dark/90">{tx(C.vision)}</p>
        </div>
        <div className="bg-surface-card shadow-sm rounded-xl p-space-lg">
          <div className="flex items-center gap-space-sm mb-space-sm">
            <Icon name="flag" size={22} fill className="text-primary" />
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{tx(C.missionT)}</h3>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">{tx(C.mission)}</p>
        </div>
      </section>

      {/* Message */}
      <section id="message" className="scroll-mt-[210px] mb-space-2xl bg-surface-ground rounded-xl p-space-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-space-sm flex items-center gap-2">
          <Icon name="record_voice_over" size={24} className="text-primary" /> {tx(C.msgTitle)}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{tx(C.msg)}</p>
        <div className="mt-space-md font-title-lg text-title-lg text-primary">— {tx(C.dg)}</div>
      </section>

      {/* Organizational structure */}
      <section id="org" className="scroll-mt-[210px] mb-space-2xl">
        <h2 className="font-headline-md text-headline-md text-primary mb-space-sm">{tx(C.orgT)}</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">{tx(C.org)}</p>
      </section>

      {/* Partners */}
      <section id="partners" className="scroll-mt-[210px] mb-space-2xl">
        <h2 className="font-headline-md text-headline-md text-primary mb-space-md">{tx(C.partnersT)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="bg-surface-card shadow-sm rounded-xl p-space-lg">
            <h3 className="font-title-lg text-title-lg text-on-surface mb-space-sm flex items-center gap-1.5"><Icon name="public" size={18} className="text-secondary" /> {tx(C.intlT)}</h3>
            <div className="flex flex-wrap gap-space-xs">
              {INTL.map((p) => <span key={p} className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">{p}</span>)}
            </div>
          </div>
          <div className="bg-surface-card shadow-sm rounded-xl p-space-lg">
            <h3 className="font-title-lg text-title-lg text-on-surface mb-space-sm flex items-center gap-1.5"><Icon name="apartment" size={18} className="text-secondary" /> {tx(C.natT)}</h3>
            <div className="flex flex-wrap gap-space-xs">
              {NATIONAL.map((p) => <span key={p} className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">{p}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* EC Act */}
      <section id="ec-act" className="scroll-mt-[210px]">
        <h2 className="font-headline-md text-headline-md text-primary mb-space-sm">{tx(C.ecActT)}</h2>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{tx(C.ecAct)}</p>
      </section>
    </div>
  );
}
