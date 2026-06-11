"use client";

import { formatDistanceToNow } from "date-fns";
import { Activity, ArrowRight, Heart, Moon, SportShoe, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useWhoopData } from "@/components/time-range/context";
import { Button } from "@/components/ui/button";
import { buildHomeInsights } from "@/lib/insights";
import type { HomeInsight, InsightCategory } from "@/lib/insights";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const CATEGORY_ICONS: Record<InsightCategory, LucideIcon> = {
  recovery: Heart,
  sleep: Moon,
  strain: Activity,
  workout: SportShoe,
};

interface InsightItemProps {
  readonly insight: HomeInsight;
  readonly onDismiss: () => void;
}

const InsightItem = ({ insight, onDismiss }: InsightItemProps) => {
  const Icon = CATEGORY_ICONS[insight.category];

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
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl bg-muted/60 opacity-0 transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-100"
      />
      {insight.href ? (
        <Link
          className="relative z-1 flex gap-3 rounded-xl p-4 pr-10"
          href={insight.href}
        >
          {content}
        </Link>
      ) : (
        <div className="relative z-1 flex gap-3 rounded-xl p-4 pr-10">
          {content}
        </div>
      )}
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
    </div>
  );
};

export const InsightsPanel = () => {
  const data = useWhoopData();
  const insights = useMemo(() => buildHomeInsights(data), [data]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const visibleInsights = insights.filter(
    (insight) => !dismissedIds.includes(insight.id)
  );

  return (
    <aside className="lg:sticky lg:top-12 lg:self-start">
      <h2 className="text-xl font-medium">Insights</h2>
      {visibleInsights.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No insights for this time range yet.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-1">
          <AnimatePresence initial={false}>
            {visibleInsights.map((insight) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                initial={false}
                key={insight.id}
                transition={{ duration: 0.15, ease: EASE_OUT }}
              >
                <InsightItem
                  insight={insight}
                  onDismiss={() =>
                    setDismissedIds((ids) => [...ids, insight.id])
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </aside>
  );
};
