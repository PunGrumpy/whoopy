"use client";

import { Bar, BarChart } from "recharts";

import { MiniChart } from "@/components/charts/mini-chart";
import { SingleSeriesChartTooltip } from "@/components/charts/tooltip";
import { useHomeMetrics } from "@/components/time-range/context";
import { BAR_MARGIN, WORKOUT_BAR_COLOR } from "@/lib/charts/data";
import { WORKOUT_COUNT_SERIES } from "@/lib/charts/types";

import { MetricCard } from "./metric";

export const WorkoutsCard = () => {
  const { workoutBarData, workoutCount } = useHomeMetrics();

  return (
    <MetricCard
      className="lg:border-r"
      href="/dashboard/workouts"
      title="Workouts"
      value={workoutCount.toLocaleString()}
    >
      <MiniChart>
        <BarChart data={workoutBarData} margin={BAR_MARGIN}>
          <SingleSeriesChartTooltip
            color={WORKOUT_BAR_COLOR}
            headlineSuffix="workouts"
            label="Workouts"
          />
          <Bar
            dataKey={WORKOUT_COUNT_SERIES.count}
            fill={WORKOUT_BAR_COLOR}
            maxBarSize={8}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </MiniChart>
    </MetricCard>
  );
};
