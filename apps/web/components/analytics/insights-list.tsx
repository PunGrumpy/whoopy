"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import type { HomeInsight } from "@/lib/insights";

import { InsightItem } from "./insight-item";

interface InsightsListProps {
  readonly dismissible?: boolean;
  readonly emptyMessage: string;
  readonly insights: HomeInsight[];
}

export const InsightsList = ({
  dismissible = true,
  emptyMessage,
  insights,
}: InsightsListProps) => {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const visibleInsights = insights.filter(
    (insight) => !dismissedIds.includes(insight.id)
  );

  if (visibleInsights.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      <AnimatePresence initial={false}>
        {visibleInsights.map((insight) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            initial={false}
            key={insight.id}
            transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
          >
            <InsightItem
              insight={insight}
              onDismiss={
                dismissible
                  ? () => setDismissedIds((ids) => [...ids, insight.id])
                  : undefined
              }
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
