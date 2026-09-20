"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useA11y } from "./A11yProvider";
import { useLang } from "@/components/i18n/LangProvider";

export function AccessibilityBar() {
  const [open, setOpen] = useState(false);
  const a11y = useA11y();
  const { t } = useLang();

  return (
    <div className="fixed right-3 bottom-3 z-[60] flex flex-col items-end gap-space-sm" data-no-invert>
      {open && (
        <div
          role="dialog"
          aria-label={t("a11y.title")}
          className="w-64 bg-surface-card rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.18)] border border-border-subtle p-space-sm"
        >
          <div className="flex items-center justify-between mb-space-sm px-1">
            <span className="font-title-lg text-title-lg text-on-surface flex items-center gap-1.5">
              <Icon name="accessibility_new" size={20} className="text-primary" /> {t("a11y.title")}
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-on-surface-variant hover:text-on-surface">
              <Icon name="close" size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-space-xs">
            <Btn icon="text_increase" label={t("a11y.bigger")} onClick={a11y.bigger} />
            <Btn icon="text_decrease" label={t("a11y.smaller")} onClick={a11y.smaller} />
            <Btn icon="contrast" label={t("a11y.contrast")} onClick={a11y.toggleContrast} active={a11y.contrast} />
            <Btn icon="font_download" label={t("a11y.dyslexia")} onClick={a11y.toggleReadable} active={a11y.readable} />
          </div>
          <div className="mt-space-xs flex items-center justify-between px-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Zoom: {Math.round(a11y.scale * 100)}%</span>
            <button onClick={a11y.reset} className="font-label-sm text-label-sm text-primary hover:underline flex items-center gap-1">
              <Icon name="restart_alt" size={14} /> {t("a11y.reset")}
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t("a11y.open")}
        aria-expanded={open}
        className="w-12 h-12 rounded-full bg-forest-dark text-on-primary shadow-[0_4px_16px_rgba(0,0,0,0.25)] flex items-center justify-center hover:bg-primary transition-colors"
      >
        <Icon name="accessibility_new" size={24} fill />
      </button>
    </div>
  );
}

function Btn({ icon, label, onClick, active }: { icon: string; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 p-space-sm rounded-lg transition-colors text-center ${
        active ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container"
      }`}
    >
      <Icon name={icon} size={20} />
      <span className="font-label-sm text-label-sm leading-tight">{label}</span>
    </button>
  );
}
