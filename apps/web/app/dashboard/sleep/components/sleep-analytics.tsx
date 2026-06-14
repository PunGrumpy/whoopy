"use client";

import { useMemo } from "react";

import { HeroChartCard } from "@/components/analytics/hero-chart-card";
import { MetricTabSection } from "@/components/analytics/metric-tab-section";
import { PageSidebar } from "@/components/analytics/page-sidebar";
import { useWhoopData } from "@/components/time-range/context";
import { buildAnalyticsMetrics } from "@/lib/analytics/build-analytics-metrics";
import type { AnalyticsPageConfig } from "@/lib/analytics/types";
import { CHART_BLUE } from "@/lib/charts/data";
import { SLEEP_SERIES } from "@/lib/charts/types";

const sleepConfig: AnalyticsPageConfig = {
  domain: "sleep",
  hero: {
    chartType: "line",
    color: CHART_BLUE,
    seriesKey: SLEEP_SERIES.performance,
    summaryFormat: "percent",
    summaryKey: "latestSleepPerformance",
    title: "Sleep Performance",
    tooltipLabel: "Sleep Performance",
    tooltipSuffix: "sleep performance",
    valueSuffix: "%",
  },
  insightCategory: "sleep",
  sidebar: {
    progress: {
      currentKey: "latestSleepPerformance",
      format: "percent",
      label: "Sleep performance",
      max: 100,
      valueSuffix: "%",
    },
    stats: [
      { format: "hours", key: "avgSleepHours", label: "Avg sleep" },
      { format: "hours", key: "sleepDebt", label: "Sleep debt" },
    ],
  },
  tabs: [
    {
      id: "performance",
      label: "Performance",
      metrics: [
        {
          chartType: "line",
          color: CHART_BLUE,
          format: "percent",
          key: SLEEP_SERIES.performance,
          title: "Performance",
          tooltipLabel: "Performance",
          tooltipSuffix: "performance",
          valueSuffix: "%",
        },
        {
          chartType: "line",
          color: "#27ae60",
          format: "percent",
          key: SLEEP_SERIES.efficiency,
          title: "Efficiency",
          tooltipLabel: "Efficiency",
          tooltipSuffix: "efficiency",
          valueSuffix: "%",
        },
        {
          chartType: "line",
          color: "#9b59b6",
          format: "percent",
          key: SLEEP_SERIES.consistency,
          title: "Consistency",
          tooltipLabel: "Consistency",
          tooltipSuffix: "consistency",
          valueSuffix: "%",
        },
        {
          chartType: "line",
          color: "#e67e22",
          format: "number",
          key: SLEEP_SERIES.respiratoryRate,
          title: "Respiratory rate",
          tooltipLabel: "Respiratory rate",
          tooltipSuffix: "breaths/min",
          valueSuffix: " /min",
        },
      ],
    },
    {
      id: "stages",
      label: "Stages",
      metrics: [
        {
          chartType: "line",
          color: "#2d4a8a",
          format: "hours",
          key: SLEEP_SERIES.deep,
          title: "Deep/SWS",
          tooltipLabel: "Deep/SWS",
          tooltipSuffix: "deep sleep",
          valueSuffix: "h",
        },
        {
          chartType: "line",
          color: "#9b59b6",
          format: "hours",
          key: SLEEP_SERIES.rem,
          title: "REM",
          tooltipLabel: "REM",
          tooltipSuffix: "REM sleep",
          valueSuffix: "h",
        },
        {
          chartType: "line",
          color: "#6c8ebf",
          format: "hours",
          key: SLEEP_SERIES.light,
          title: "Light",
          tooltipLabel: "Light",
          tooltipSuffix: "light sleep",
          valueSuffix: "h",
        },
        {
          chartType: "line",
          color: "#c0392b",
          format: "hours",
          key: SLEEP_SERIES.awake,
          title: "Awake",
          tooltipLabel: "Awake",
          tooltipSuffix: "awake time",
          valueSuffix: "h",
        },
      ],
    },
  ],
};

export const SleepAnalytics = () => {
  const data = useWhoopData();
  const metrics = useMemo(
    () => buildAnalyticsMetrics(sleepConfig, data),
    [data]
  );

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_min(22rem,32%)]">
      <div className="flex flex-col gap-10">
        <HeroChartCard hasData={metrics.hasData} hero={metrics.hero} />
        <MetricTabSection hasData={metrics.hasData} tabs={metrics.tabs} />
      </div>
      <PageSidebar
        insightCategory={sleepConfig.insightCategory}
        sidebar={metrics.sidebar}
      />
    </div>
  );
};
