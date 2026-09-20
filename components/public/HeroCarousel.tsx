"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { useLang } from "@/components/i18n/LangProvider";

type ContentSlide = {
  kind: "content";
  key: string;
  tag: string; title: string; sub: string; cta: string; href: string; icon: string;
  from: string; to: string; accent: string; chip: string;
};
type ImageSlide = {
  kind: "image";
  key: string;
  src: string; alt: string; href: string;
  fit: "cover" | "contain"; // cover = full-bleed photo; contain = show whole designed banner
  caption?: string; // i18n key, optional
};
type Slide = ContentSlide | ImageSlide;

const SLIDES: Slide[] = [
  { kind: "image", key: "img-foundation", src: "/images/foundation-day.webp", alt: "25th Foundation Day of the Bureau of Energy Efficiency, New Delhi", href: "/about", fit: "cover", caption: "photo.foundation" },
  { kind: "image", key: "img-tiranga", src: "/images/har-ghar-tiranga.jpg", alt: "Har Ghar Tiranga — a national campaign by the Ministry of Culture, Government of India", href: "/notifications", fit: "cover" },
  { kind: "image", key: "img-mann", src: "/images/mann-ki-baat.jpg", alt: "Mann Ki Baat — share your ideas and suggestions, Government of India", href: "/notifications", fit: "cover" },
];

const INTERVAL = 5500;

export function HeroCarousel() {
  const { t } = useLang();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);

  useEffect(() => {
    if (paused || reduced.current) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(id);
  }, [paused, index]);

  const go = (i: number) => setIndex((i + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="relative w-full overflow-hidden bg-navy-dark"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative h-[340px] sm:h-[400px]">
        {SLIDES.map((s, i) => (
          <div
            key={s.key}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${SLIDES.length}`}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            style={s.kind === "content" ? { background: `linear-gradient(120deg, ${s.from}, ${s.to})` } : undefined}
          >
            {s.kind === "image" ? (
              <Link href={s.href} className="block w-full h-full relative overflow-hidden group" aria-label={s.alt}>
                {s.fit === "cover" ? (
                  /* full-bleed photo — fills the frame, with a slow zoom while active */
                  <Image src={s.src} alt={s.alt} fill priority={i === 0} sizes="100vw" className={`object-cover object-center ${i === index ? "hero-zoom" : ""}`} />
                ) : (
                  /* designed banner — show it whole over a blurred fill of itself */
                  <>
                    <Image src={s.src} alt="" aria-hidden fill sizes="100vw" className="object-cover scale-110 blur-2xl brightness-[0.55]" />
                    <Image src={s.src} alt={s.alt} fill priority={i === 0} sizes="100vw" className="object-contain object-center" />
                  </>
                )}
                {/* legibility / depth gradient */}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
                {s.caption && (
                  <span className="absolute left-space-md bottom-space-lg z-10 flex items-center gap-1.5 text-white font-title-lg text-title-lg drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                    <span className="w-1.5 h-5 bg-solar-gold rounded-full" />
                    {t(s.caption)}
                  </span>
                )}
              </Link>
            ) : (
              <>
                <div className="absolute inset-0 overflow-hidden" aria-hidden>
                  <div className="absolute -right-16 -top-20 w-96 h-96 rounded-full" style={{ background: s.accent }} />
                  <div className="absolute right-24 bottom-[-60px] w-64 h-64 rounded-full" style={{ background: s.accent }} />
                  <Icon name={s.icon} size={260} fill className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10" />
                </div>
                <div className="relative z-10 h-full max-w-7xl mx-auto px-gutter flex flex-col justify-center">
                  <span className={`inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm font-bold uppercase tracking-wider ${s.chip}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" /> {t(s.tag)}
                  </span>
                  <h2 className="font-display-lg text-headline-xl sm:text-display-lg font-bold text-white mt-space-sm max-w-2xl leading-tight">
                    {t(s.title)}
                  </h2>
                  <p className="font-body-lg text-body-lg text-white/85 mt-space-sm max-w-xl">{t(s.sub)}</p>
                  <Link
                    href={s.href}
                    className="mt-space-lg inline-flex w-fit items-center gap-2 bg-white text-primary font-label-lg text-label-lg px-space-lg py-2.5 rounded-lg hover:bg-solar-gold hover:text-navy-dark transition-colors shadow-sm"
                  >
                    {t(s.cta)} <Icon name="arrow_forward" size={18} />
                  </Link>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Autoplay progress bar */}
      {!paused && (
        <div key={index} className="hero-progress absolute bottom-0 left-0 h-1 bg-solar-gold z-30" style={{ animationDuration: `${INTERVAL}ms` }} aria-hidden />
      )}

      {/* Controls */}
      <button onClick={() => go(index - 1)} aria-label={t("hero.prev")} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 backdrop-blur text-white flex items-center justify-center hover:bg-white/30 border border-white/25 transition-colors">
        <Icon name="chevron_left" size={26} />
      </button>
      <button onClick={() => go(index + 1)} aria-label={t("hero.next")} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 backdrop-blur text-white flex items-center justify-center hover:bg-white/30 border border-white/25 transition-colors">
        <Icon name="chevron_right" size={26} />
      </button>

      {/* Indicators + pause */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-space-sm bg-black/35 rounded-full px-space-sm py-1.5">
        {SLIDES.map((s, i) => (
          <button key={s.key} onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`} aria-current={i === index} className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`} />
        ))}
        <button onClick={() => setPaused((p) => !p)} aria-label={paused ? t("hero.play") : t("hero.pause")} className="ml-1 text-white/90 hover:text-white flex items-center">
          <Icon name={paused ? "play_arrow" : "pause"} size={18} />
        </button>
      </div>
    </section>
  );
}
