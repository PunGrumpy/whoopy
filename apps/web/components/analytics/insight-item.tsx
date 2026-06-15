"use client";

import { formatDistanceToNow } from "date-fns";
import { Activity, ArrowRight, Heart, Moon, SportShoe, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { HomeInsight, InsightCategory } from "@/lib/insights";

const CATEGORY_ICONS: Record<InsightCategory, LucideIcon> = {
  recovery: Heart,
  sleep: Moon,
  strain: Activity,
  workout: SportShoe,
};

interface InsightItemProps {
  readonly insight: HomeInsight;
  readonly onDismiss?: () => void;
}

export const InsightItem = ({ insight, onDismiss }: InsightItemProps) => {
  const Icon = CATEGORY_ICONS[insight.category];
  const itemClassName =
    "relative z-1 flex gap-3 rounded-xl p-4 pr-10 transition-colors hover:bg-muted/60";

  const content = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400">
        <Icon className="size-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(insight.date), { addSuffix: true })}
        </span>
        <span className="mt-0.5 inline-flex items-center gap-1 font-medium">
          <span>{insight.title}</span>
          {insight.href ? (
            <ArrowRight
              aria-hidden
              className="size-3.5 shrink-0 -translate-x-1 opacity-0 transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 group-hover:opacity-100"
            />
          ) : null}
        </span>
        <span className="mt-1 text-sm text-muted-foreground">
          {insight.description}
        </span>
      </span>
    </>
  );

  return (
    <div className="group relative">
      {insight.href ? (
        <Link className={itemClassName} href={insight.href}>
          {content}
        </Link>
      ) : (
        <div className={itemClassName}>{content}</div>
      )}
      {onDismiss ? (
        <Button
          aria-label={`Dismiss insight: ${insight.title}`}
          className="absolute top-2 right-2 z-10 opacity-0 transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-100"
          onClick={onDismiss}
          size="icon-xs"
          type="button"
          variant="ghost"
        >
          <X />
        </Button>
      ) : null}
    </div>
  );
};
