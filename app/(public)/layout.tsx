import { PublicHeader } from "@/components/chrome/PublicHeader";
import { PublicFooter } from "@/components/chrome/PublicFooter";
import { LangProvider } from "@/components/i18n/LangProvider";
import { A11yProvider } from "@/components/public/A11yProvider";
import { AccessibilityBar } from "@/components/public/AccessibilityBar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LangProvider>
      <A11yProvider>
        <PublicHeader />
        <main id="main" className="w-full pt-[196px] bg-surface min-h-screen">
          {children}
        </main>
        <PublicFooter />
        <AccessibilityBar />
      </A11yProvider>
    </LangProvider>
  );
}
