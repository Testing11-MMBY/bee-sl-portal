"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ScreenChrome } from "@/components/app/ScreenScaffold";
import { Module, Screen } from "@/lib/screens";
import { StageScreen } from "./StageScreen";
import { CertificateWorkspace } from "@/components/app/blockchain/CertificateWorkspace";

/**
 * Label preview screen — retains the existing label & QR generation view and
 * adds a "Certificate and Ledger" tab for the blockchain issuance lifecycle.
 */
export function LabelPreviewScreen({ module, screen }: { module: Module; screen: Screen }) {
  const [tab, setTab] = useState<"label" | "cert">("label");
  return (
    <ScreenChrome module={module} screen={screen} subtitle="Generate label & allocate QR · anchor certificate on the ledger">
      <div className="flex gap-1 border-b border-border-subtle -mt-space-xs">
        {([["label", "Label & QR", "qr_code_2"], ["cert", "Certificate & Ledger", "verified_user"]] as const).map(([id, label, icon]) => (
          <button key={id} type="button" onClick={() => setTab(id)} className={`flex items-center gap-1.5 px-space-sm py-2.5 font-label-md text-label-md whitespace-nowrap border-b-2 transition-colors ${tab === id ? "border-primary text-primary font-semibold" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>
            <Icon name={icon} size={16} fill={tab === id} /> {label}
          </button>
        ))}
      </div>
      <div className="mt-space-md">
        {tab === "label" ? <StageScreen module={module} screen={screen} variant="label" bare /> : <CertificateWorkspace />}
      </div>
    </ScreenChrome>
  );
}
