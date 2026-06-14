"use client";

import type { HeroChartValue } from "@/lib/analytics/types";

import { AnalyticsEmpty } from "./analytics-empty";
import { ChartSeries } from "./chart-series";

interface HeroChartCardProps {
  readonly hasData: boolean;
  readonly hero: HeroChartValue;
}

export const HeroChartCard = ({ hasData, hero }: HeroChartCardProps) => (
  <section className="rounded-lg border bg-card p-6">
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="text-lg font-medium">{hero.title}</h2>
      <p className="text-2xl font-medium tabular-nums">{hero.summary}</p>
    </div>
    {hasData ? (
      <ChartSeries
        chartData={hero.chartData}
        chartType={hero.chartType}
        color={hero.color}
        seriesKey={hero.seriesKey}
        size="hero"
        tooltipLabel={hero.tooltipLabel}
        tooltipSuffix={hero.tooltipSuffix}
        valueSuffix={hero.valueSuffix}
      />
    ) : (
      <AnalyticsEmpty
        className="mt-4 min-h-64 border-none"
        title="No data available"
      />
    )}
  </section>
);
