"use client";

import { Line, LineChart } from "recharts";

import { makeEndDot } from "@/components/charts/end-dot";
import { MiniChart } from "@/components/charts/mini-chart";
import { SingleSeriesChartTooltip } from "@/components/charts/tooltip";
import { useHomeMetrics } from "@/components/time-range/context";
import { CHART_BLUE, LINE_PROPS, MINI_MARGIN } from "@/lib/charts/data";
import { SLEEP_SERIES } from "@/lib/charts/types";

import { MetricCard } from "./metric-card";

export const SleepCard = () => {
  const { sleepChart, sleepPerformance } = useHomeMetrics();

  return (
    <MetricCard
      href="/dashboard/sleep"
      title="Sleep"
      value={`${sleepPerformance.toLocaleString()}%`}
    >
      <MiniChart>
        <LineChart data={sleepChart} margin={MINI_MARGIN}>
          <SingleSeriesChartTooltip
            color={CHART_BLUE}
            headlineSuffix="sleep performance"
            label="Sleep performance"
            valueSuffix="%"
          />
          <Line
            dataKey={SLEEP_SERIES.performance}
            dot={makeEndDot(CHART_BLUE, sleepChart.length)}
            stroke={CHART_BLUE}
            {...LINE_PROPS}
          />
        </LineChart>
      </MiniChart>
    </MetricCard>
  );
};
