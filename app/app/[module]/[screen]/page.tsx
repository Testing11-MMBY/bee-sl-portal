import { notFound } from "next/navigation";
import { AppScreen } from "@/components/app/AppScreen";
import { MODULES, moduleById, screenById } from "@/lib/screens";

export function generateStaticParams() {
  return MODULES.flatMap((m) =>
    m.screens.map((s) => ({ module: m.id, screen: s.id }))
  );
}

export default async function ScreenPage({
  params,
}: {
  params: Promise<{ module: string; screen: string }>;
}) {
  const { module: moduleId, screen: screenId } = await params;
  const module = moduleById(moduleId);
  const screen = screenById(moduleId, screenId);
  if (!module || !screen) notFound();
  return <AppScreen module={module} screen={screen} />;
}
