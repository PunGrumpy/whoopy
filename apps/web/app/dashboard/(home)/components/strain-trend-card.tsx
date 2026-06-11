"use client";

import { Area, AreaChart, XAxis } from "recharts";

import { makeEndDot } from "@/components/charts/end-dot";
import { TrendChart } from "@/components/charts/mini-chart";
import { SingleSeriesChartTooltip } from "@/components/charts/tooltip";
import { useHomeMetrics } from "@/components/time-range/context";
import { CHART_BLUE, LINE_PROPS, TREND_MARGIN } from "@/lib/charts/data";
import { CYCLE_SERIES } from "@/lib/charts/types";

import { MetricCard } from "./metric";

export const StrainTrendCard = () => {
  const { avgStrain, strainChart } = useHomeMetrics();

  return (
    <MetricCard
      className="border-b-0 md:col-span-2 lg:col-span-4"
      href="/dashboard/cycles"
      title="Strain trend"
      value={avgStrain.toLocaleString()}
    >
      <TrendChart>
        <AreaChart data={strainChart} margin={TREND_MARGIN}>
          <defs>
            <linearGradient id="strain-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.35} />
              <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            axisLine={false}
            dataKey="date"
            interval="preserveStartEnd"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            tickLine={false}
          />
          <SingleSeriesChartTooltip
            color={CHART_BLUE}
            headlineSuffix="strain"
            label="Strain"
          />
          <Area
            dataKey={CYCLE_SERIES.strain}
            dot={makeEndDot(CHART_BLUE, strainChart.length)}
            fill="url(#strain-area)"
            stroke={CHART_BLUE}
            {...LINE_PROPS}
          />
        </AreaChart>
      </TrendChart>
    </MetricCard>
  );
};
