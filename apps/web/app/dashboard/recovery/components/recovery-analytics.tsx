"use client";

import { useMemo } from "react";

import { HeroChartCard } from "@/components/analytics/hero-chart-card";
import { MetricTabSection } from "@/components/analytics/metric-tab-section";
import { PageSidebar } from "@/components/analytics/page-sidebar";
import { useWhoopData } from "@/components/time-range/context";
import { buildAnalyticsMetrics } from "@/lib/analytics/build-analytics-metrics";
import type { AnalyticsPageConfig } from "@/lib/analytics/types";
import { RECOVERY_SERIES } from "@/lib/charts/types";

const recoveryConfig: AnalyticsPageConfig = {
  domain: "recovery",
  hero: {
    chartType: "line",
    color: "#D53670",
    seriesKey: RECOVERY_SERIES.score,
    summaryFormat: "percent",
    summaryKey: "latestRecoveryScore",
    title: "Recovery Score",
    tooltipLabel: "Recovery Score",
    tooltipSuffix: "recovery score",
    valueSuffix: "%",
  },
  insightCategory: "recovery",
  sidebar: {
    progress: {
      currentKey: "latestRecoveryScore",
      format: "percent",
      label: "Recovery",
      max: 100,
      valueSuffix: "%",
    },
    stats: [
      { format: "number", key: "avgHrv", label: "Avg HRV", suffix: " ms" },
      {
        format: "number",
        key: "avgRhr",
        label: "Avg resting HR",
        suffix: " bpm",
      },
    ],
  },
  tabs: [
    {
      id: "scores",
      label: "Scores",
      metrics: [
        {
          chartType: "line",
          color: "#D53670",
          format: "percent",
          key: RECOVERY_SERIES.score,
          title: "Recovery Score",
          tooltipLabel: "Recovery Score",
          tooltipSuffix: "recovery score",
          valueSuffix: "%",
        },
        {
          chartType: "line",
          color: "#E36E30",
          format: "number",
          key: RECOVERY_SERIES.hrv,
          title: "HRV",
          tooltipLabel: "HRV",
          tooltipSuffix: "HRV",
          valueSuffix: " ms",
        },
      ],
    },
    {
      id: "physiology",
      label: "Physiology",
      metrics: [
        {
          chartType: "line",
          color: "#5BC0EB",
          format: "number",
          key: RECOVERY_SERIES.rhr,
          title: "Resting HR",
          tooltipLabel: "Resting HR",
          tooltipSuffix: "resting HR",
          valueSuffix: " bpm",
        },
        {
          chartType: "line",
          color: "#6C5CE7",
          format: "percent",
          key: RECOVERY_SERIES.spo2,
          title: "SpO2",
          tooltipLabel: "SpO2",
          tooltipSuffix: "SpO2",
          valueSuffix: "%",
        },
      ],
    },
  ],
};

export const RecoveryAnalytics = () => {
  const data = useWhoopData();
  const metrics = useMemo(
    () => buildAnalyticsMetrics(recoveryConfig, data),
    [data]
  );

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_min(22rem,32%)]">
      <div className="flex flex-col gap-10">
        <HeroChartCard hasData={metrics.hasData} hero={metrics.hero} />
        <MetricTabSection hasData={metrics.hasData} tabs={metrics.tabs} />
      </div>
      <PageSidebar
        insightCategory={recoveryConfig.insightCategory}
        sidebar={metrics.sidebar}
      />
    </div>
  );
};
