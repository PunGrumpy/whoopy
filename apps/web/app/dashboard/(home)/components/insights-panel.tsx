"use client";

import { useMemo } from "react";

import { InsightsList } from "@/components/analytics/insights-list";
import { useWhoopData } from "@/components/time-range/context";
import { buildHomeInsights } from "@/lib/insights";

export const InsightsPanel = () => {
  const data = useWhoopData();
  const insights = useMemo(() => buildHomeInsights(data), [data]);

  return (
    <aside className="lg:sticky lg:top-12 lg:self-start">
      <h2 className="text-xl font-medium">Insights</h2>
      <div className="mt-6">
        <InsightsList
          emptyMessage="No insights for this time range yet."
          insights={insights}
        />
      </div>
    </aside>
  );
};
