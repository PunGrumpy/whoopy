"use client";

import { useMemo } from "react";

import { useWhoopData } from "@/components/time-range/context";
import { buildDomainInsights } from "@/lib/insights";
import type { InsightCategory } from "@/lib/insights";

import { InsightsList } from "./insights-list";

interface DomainInsightsPanelProps {
  readonly category: InsightCategory;
}

export const DomainInsightsPanel = ({ category }: DomainInsightsPanelProps) => {
  const data = useWhoopData();
  const insights = useMemo(
    () => buildDomainInsights(data, category),
    [category, data]
  );

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium">Insights</h3>
      <div className="mt-4">
        <InsightsList
          dismissible={false}
          emptyMessage="No insights for this time range."
          insights={insights}
        />
      </div>
    </div>
  );
};
