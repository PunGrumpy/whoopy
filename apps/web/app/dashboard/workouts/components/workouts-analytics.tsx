"use client";

import { useMemo } from "react";

import { HeroChartCard } from "@/components/analytics/hero-chart-card";
import { MetricTabSection } from "@/components/analytics/metric-tab-section";
import { PageSidebar } from "@/components/analytics/page-sidebar";
import { useWhoopData } from "@/components/time-range/context";
import { buildAnalyticsMetrics } from "@/lib/analytics/build-analytics-metrics";
import type { AnalyticsPageConfig } from "@/lib/analytics/types";
import { CHART_BLUE, WORKOUT_BAR_COLOR } from "@/lib/charts/data";
import { WORKOUT_COUNT_SERIES } from "@/lib/charts/types";

const workoutsConfig: AnalyticsPageConfig = {
  domain: "workouts",
  hero: {
    chartType: "bar",
    color: WORKOUT_BAR_COLOR,
    seriesKey: WORKOUT_COUNT_SERIES.count,
    summaryKey: "workoutCount",
    title: "Workouts",
    tooltipLabel: "Workouts",
    tooltipSuffix: "workouts",
  },
  insightCategory: "workout",
  sidebar: {
    stats: [
      { format: "number", key: "workoutCount", label: "Total workouts" },
      { format: "hours", key: "avgWorkoutDuration", label: "Avg duration" },
      { format: "text", key: "topSport", label: "Top sport" },
    ],
  },
  tabs: [
    {
      id: "activity",
      label: "Activity",
      metrics: [
        {
          chartType: "bar",
          color: WORKOUT_BAR_COLOR,
          format: "number",
          key: WORKOUT_COUNT_SERIES.count,
          title: "Workout count",
          tooltipLabel: "Workouts",
          tooltipSuffix: "workouts",
        },
        {
          chartType: "line",
          color: "#00B894",
          format: "hours",
          key: "duration",
          title: "Duration",
          tooltipLabel: "Duration",
          tooltipSuffix: "duration",
          valueSuffix: "h",
        },
        {
          chartType: "none",
          format: "text",
          key: "topSport",
          title: "Top sport",
        },
      ],
    },
    {
      id: "intensity",
      label: "Intensity",
      metrics: [
        {
          chartType: "line",
          color: CHART_BLUE,
          format: "number",
          key: "strain",
          title: "Avg workout strain",
          tooltipLabel: "Strain",
          tooltipSuffix: "strain",
        },
        {
          chartType: "line",
          color: "#f5c542",
          format: "number",
          key: "Calories",
          title: "Calories",
          tooltipLabel: "Calories",
          tooltipSuffix: "calories",
        },
      ],
    },
  ],
};

export const WorkoutsAnalytics = () => {
  const data = useWhoopData();
  const metrics = useMemo(
    () => buildAnalyticsMetrics(workoutsConfig, data),
    [data]
  );

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_min(22rem,32%)]">
      <div className="flex flex-col gap-10">
        <HeroChartCard hasData={metrics.hasData} hero={metrics.hero} />
        <MetricTabSection hasData={metrics.hasData} tabs={metrics.tabs} />
      </div>
      <PageSidebar
        insightCategory={workoutsConfig.insightCategory}
        sidebar={metrics.sidebar}
      />
    </div>
  );
};
