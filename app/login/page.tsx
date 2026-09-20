"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Emblem } from "@/components/chrome/Emblem";
import { ROLES, RoleKey } from "@/lib/roles";
import { countForRole } from "@/lib/screens";
import { persistRole } from "@/components/app/RoleContext";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [role, setRole] = useState<RoleKey>("admin");
  const [otp, setOtp] = useState("");

  function signIn() {
    persistRole(role);
    router.push("/app");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-forest-dark text-on-primary p-space-2xl relative overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-primary absolute top-0 inset-x-0" />
        <Link href="/" className="flex items-center gap-space-md relative z-10">
          <Emblem size={52} invert />
          <div>
            <div className="font-headline-md text-headline-md">Bureau of Energy Efficiency</div>
            <div className="font-label-sm text-label-sm text-forest-light/80">Standards & Labelling Portal</div>
          </div>
        </Link>
        <div className="relative z-10">
          <h1 className="font-display-lg text-display-lg font-bold leading-tight">Secure stakeholder & officer access</h1>
          <p className="font-body-lg text-body-lg text-forest-light/85 mt-space-md max-w-md">
            Registration, model & label lifecycle, fees, production, enforcement, MIS and audit — governed by role, delegation and workflow state.
          </p>
          <div className="flex items-center gap-space-md mt-space-xl">
            {[
              { icon: "shield_lock", t: "MFA enforced" },
              { icon: "verified_user", t: "RBAC + object policy" },
              { icon: "history_edu", t: "Every action audited" },
            ].map((f) => (
              <div key={f.t} className="flex items-center gap-1.5 font-label-md text-label-md text-forest-light/90">
                <Icon name={f.icon} size={18} /> {f.t}
              </div>
            ))}
          </div>
        </div>
        <div className="font-label-sm text-label-sm text-forest-light/60 relative z-10">© {new Date().getFullYear()} BEE, Ministry of Power, Government of India</div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-space-lg bg-surface-ground">
        <div className="w-full max-w-md bg-surface-card rounded-xl shadow-md p-space-xl">
          <Link href="/" className="lg:hidden flex items-center gap-space-sm mb-space-lg">
            <Emblem size={40} />
            <span className="font-headline-sm text-headline-sm text-primary">BEE S&L Portal</span>
          </Link>

          {step === "credentials" ? (
            <>
              <h2 className="font-headline-md text-headline-md text-on-surface">Sign in</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-space-lg">
                Federated Keycloak realm. For this prototype, pick the role you want to explore.
              </p>

              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">User ID</label>
              <input defaultValue="officer@beeindia.gov.in" className="w-full py-2.5 px-3 rounded-lg bg-surface-ground font-body-md text-body-md outline-none mb-space-md" />

              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Password</label>
              <input type="password" defaultValue="demo-password" className="w-full py-2.5 px-3 rounded-lg bg-surface-ground font-body-md text-body-md outline-none mb-space-md" />

              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Sign in as role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as RoleKey)}
                className="w-full py-2.5 px-3 rounded-lg bg-surface-ground font-body-md text-body-md outline-none mb-1"
              >
                {ROLES.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.name} — {countForRole(r.key)} screens
                  </option>
                ))}
              </select>
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-space-lg">
                Role controls which of the 140 screens appear, per DDD Annex A.1.
              </p>

              <button
                onClick={() => setStep("mfa")}
                className="w-full bg-primary text-on-primary py-2.5 rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-forest-dark transition-all"
                type="button"
              >
                Continue <Icon name="arrow_forward" size={18} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setStep("credentials")} className="text-primary font-label-sm text-label-sm flex items-center gap-1 mb-space-md" type="button">
                <Icon name="arrow_back" size={16} /> Back
              </button>
              <h2 className="font-headline-md text-headline-md text-on-surface">Two-factor verification</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-space-lg">
                Enter the 6-digit OTP sent to your registered mobile ending 4821. (Any value works in this demo.)
              </p>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••••"
                inputMode="numeric"
                className="w-full py-3 px-3 rounded-lg bg-surface-ground font-headline-md text-headline-md tracking-[0.5em] text-center outline-none mb-space-lg"
              />
              <button
                onClick={signIn}
                className="w-full bg-primary text-on-primary py-2.5 rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-forest-dark transition-all"
                type="button"
              >
                <Icon name="lock_open" size={18} /> Verify & sign in
              </button>
            </>
          )}

          <div className="mt-space-lg pt-space-md border-t border-border-subtle text-center">
            <Link href="/" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary">← Back to public portal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
