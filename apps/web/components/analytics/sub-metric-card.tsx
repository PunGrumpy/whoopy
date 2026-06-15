"use client";

import type { SubMetricValue } from "@/lib/analytics/types";

import { ChartSeries } from "./chart-series";

interface SubMetricCardProps {
  readonly metric: SubMetricValue;
}

export const SubMetricCard = ({ metric }: SubMetricCardProps) => (
  <div className="flex flex-col rounded-lg border bg-card p-4">
    <p className="text-sm text-muted-foreground">{metric.title}</p>
    <p className="mt-1 text-lg font-medium tabular-nums">{metric.value}</p>
    {metric.chartType !== "none" && metric.chartData.length > 0 ? (
      <div className="mt-2 min-h-11">
        <ChartSeries
          chartData={metric.chartData}
          chartType={metric.chartType}
          color={metric.color ?? "#64748b"}
          seriesKey={metric.seriesKey}
          size="mini"
          tooltipLabel={metric.tooltipLabel ?? metric.title}
          tooltipSuffix={metric.tooltipSuffix ?? metric.title.toLowerCase()}
          valueSuffix={metric.valueSuffix}
        />
      </div>
    ) : null}
  </div>
);
