import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

/**
 * Standard government-style section header: a short accent bar + left-aligned
 * title, a bottom rule, and an optional "View all" link. Restrained, dense —
 * the opposite of a centered marketing headline.
 */
export function SectionHeader({
  title,
  viewAllHref,
  viewAllLabel = "View All",
  sub,
}: {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  sub?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-space-md border-b border-border-subtle pb-space-sm mb-space-lg">
      <div className="flex items-center gap-space-sm min-w-0">
        <span className="w-1.5 h-7 bg-primary rounded-full shrink-0" />
        <div className="min-w-0">
          <h2 className="font-headline-md text-headline-md text-on-surface font-bold leading-tight truncate">{title}</h2>
          {sub && <p className="font-label-md text-label-md text-on-surface-variant">{sub}</p>}
        </div>
      </div>
      {viewAllHref && (
        <Link href={viewAllHref} className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap">
          {viewAllLabel} <Icon name="arrow_forward" size={15} />
        </Link>
      )}
    </div>
  );
}
