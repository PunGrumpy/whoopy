import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export interface ExploreCardProps {
  readonly description: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly title: string;
}

export const ExploreCard = ({
  description,
  href,
  icon: Icon,
  title,
}: ExploreCardProps) => (
  <Link
    className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40"
    href={href}
  >
    <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
      <Icon className="size-5" />
    </div>
    <p className="mt-3 font-medium">{title}</p>
    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
      {description}
    </p>
  </Link>
);
