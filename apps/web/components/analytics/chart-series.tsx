"use client";

import { useId } from "react";
import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
} from "recharts";

import { makeEndDot } from "@/components/charts/end-dot";
import { MiniChart, TrendChart } from "@/components/charts/mini-chart";
import { SingleSeriesChartTooltip } from "@/components/charts/tooltip";
import type { AnalyticsChartData, ChartType } from "@/lib/analytics/types";
import { LINE_PROPS, MINI_MARGIN, TREND_MARGIN } from "@/lib/charts/data";

interface ChartSeriesProps {
  readonly chartData: AnalyticsChartData;
  readonly chartType: ChartType;
  readonly color: string;
  readonly seriesKey: string;
  readonly size: "hero" | "mini";
  readonly tooltipLabel: string;
  readonly tooltipSuffix: string;
  readonly valueSuffix?: string;
}

const HeroXAxis = () => (
  <XAxis
    axisLine={false}
    dataKey="date"
    interval="preserveStartEnd"
    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
    tickLine={false}
  />
);

export const ChartSeries = ({
  chartData,
  chartType,
  color,
  seriesKey,
  size,
  tooltipLabel,
  tooltipSuffix,
  valueSuffix,
}: ChartSeriesProps) => {
  const gradientId = useId();
  const margin = size === "hero" ? TREND_MARGIN : MINI_MARGIN;
  const isHero = size === "hero";

  const tooltip = (
    <SingleSeriesChartTooltip
      color={color}
      headlineSuffix={tooltipSuffix}
      label={tooltipLabel}
      valueSuffix={valueSuffix}
    />
  );

  const xAxis = isHero ? <HeroXAxis /> : null;
  const endDot = makeEndDot(color, chartData.length);

  let chart: ReactNode;

  if (chartType === "bar") {
    chart = (
      <BarChart data={chartData} margin={margin}>
        {tooltip}
        <Bar
          dataKey={seriesKey}
          fill={color}
          maxBarSize={isHero ? 16 : 8}
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    );
  } else if (chartType === "area") {
    chart = (
      <AreaChart data={chartData} margin={margin}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {xAxis}
        {tooltip}
        <Area
          dataKey={seriesKey}
          dot={endDot}
          fill={`url(#${gradientId})`}
          stroke={color}
          {...LINE_PROPS}
        />
      </AreaChart>
    );
  } else {
    chart = (
      <LineChart data={chartData} margin={margin}>
        {xAxis}
        {tooltip}
        <Line dataKey={seriesKey} dot={endDot} stroke={color} {...LINE_PROPS} />
      </LineChart>
    );
  }

  if (isHero) {
    return <TrendChart className="mt-4 h-64 w-full">{chart}</TrendChart>;
  }

  return <MiniChart>{chart}</MiniChart>;
};
