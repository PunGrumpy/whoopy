"use client";

import { useMemo } from "react";

import { HeroChartCard } from "@/components/analytics/hero-chart-card";
import { MetricTabSection } from "@/components/analytics/metric-tab-section";
import { PageSidebar } from "@/components/analytics/page-sidebar";
import { useWhoopData } from "@/components/time-range/context";
import { buildAnalyticsMetrics } from "@/lib/analytics/build-analytics-metrics";
import type { AnalyticsPageConfig } from "@/lib/analytics/types";
import { CHART_BLUE, STRAIN_GOAL } from "@/lib/charts/data";
import { CYCLE_SERIES } from "@/lib/charts/types";

const cyclesConfig: AnalyticsPageConfig = {
  domain: "cycles",
  hero: {
    chartType: "area",
    color: CHART_BLUE,
    seriesKey: CYCLE_SERIES.strain,
    summaryKey: "avgStrain",
    title: "Strain",
    tooltipLabel: "Strain",
    tooltipSuffix: "strain",
  },
  insightCategory: "strain",
  sidebar: {
    progress: {
      currentKey: "latestStrain",
      format: "number",
      label: "Day strain",
      max: STRAIN_GOAL,
    },
    stats: [{ format: "number", key: "avgStrain", label: "Avg strain" }],
  },
  tabs: [
    {
      id: "strain",
      label: "Strain",
      metrics: [
        {
          chartType: "area",
          color: CHART_BLUE,
          format: "number",
          key: CYCLE_SERIES.strain,
          title: "Strain",
          tooltipLabel: "Strain",
          tooltipSuffix: "strain",
        },
        {
          chartType: "line",
          color: "#f5c542",
          format: "number",
          key: CYCLE_SERIES.calories,
          title: "Calories",
          tooltipLabel: "Calories",
          tooltipSuffix: "calories",
        },
      ],
    },
    {
      id: "heart-rate",
      label: "Heart Rate",
      metrics: [
        {
          chartType: "line",
          color: "#e0454a",
          format: "number",
          key: CYCLE_SERIES.avgHr,
          title: "Avg HR",
          tooltipLabel: "Avg HR",
          tooltipSuffix: "avg HR",
          valueSuffix: " bpm",
        },
        {
          chartType: "line",
          color: "#e67e22",
          format: "number",
          key: CYCLE_SERIES.maxHr,
          title: "Max HR",
          tooltipLabel: "Max HR",
          tooltipSuffix: "max HR",
          valueSuffix: " bpm",
        },
      ],
    },
  ],
};

export const CyclesAnalytics = () => {
  const data = useWhoopData();
  const metrics = useMemo(
    () => buildAnalyticsMetrics(cyclesConfig, data),
    [data]
  );

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_min(22rem,32%)]">
      <div className="flex flex-col gap-10">
        <HeroChartCard hasData={metrics.hasData} hero={metrics.hero} />
        <MetricTabSection hasData={metrics.hasData} tabs={metrics.tabs} />
      </div>
      <PageSidebar
        insightCategory={cyclesConfig.insightCategory}
        sidebar={metrics.sidebar}
      />
    </div>
  );
};
