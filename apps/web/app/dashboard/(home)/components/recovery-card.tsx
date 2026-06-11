"use client";

import { Line, LineChart } from "recharts";

import { makeEndDot } from "@/components/charts/end-dot";
import { MiniChart } from "@/components/charts/mini-chart";
import { RecoveryChartTooltip } from "@/components/charts/tooltip";
import { useHomeMetrics } from "@/components/time-range/context";
import { LINE_PROPS, MINI_MARGIN, RECOVERY_LINES } from "@/lib/charts/data";

import { MetricCard } from "./metric";

export const RecoveryCard = () => {
  const { recoveryChart, recoveryScore } = useHomeMetrics();

  return (
    <MetricCard
      className="md:border-r lg:border-b"
      href="/dashboard/recovery"
      title="Recovery"
      value={`${recoveryScore.toLocaleString()}%`}
    >
      <MiniChart>
        <LineChart data={recoveryChart} margin={MINI_MARGIN}>
          <RecoveryChartTooltip />
          {RECOVERY_LINES.map(([key, color]) => (
            <Line
              dataKey={key}
              dot={makeEndDot(color, recoveryChart.length)}
              key={key}
              stroke={color}
              {...LINE_PROPS}
            />
          ))}
        </LineChart>
      </MiniChart>
    </MetricCard>
  );
};
