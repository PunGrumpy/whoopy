"use client";

import { useHomeMetrics } from "@/components/time-range/context";
import { DAY_STRAIN_COLOR, round, STRAIN_GOAL } from "@/lib/charts/data";

import { MetricCard } from "./metric";

export const DayStrainCard = () => {
  const { dayStrainAvg } = useHomeMetrics();
  const strainProgress = Math.min((dayStrainAvg / STRAIN_GOAL) * 100, 100);

  return (
    <MetricCard
      className="md:border-r"
      href="/dashboard/cycles"
      title="Avg strain"
      value={`${round(dayStrainAvg, 1)} / ${STRAIN_GOAL}`}
    >
      <div className="flex flex-1 items-center">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full"
            style={{
              backgroundColor: DAY_STRAIN_COLOR,
              width: `${strainProgress}%`,
            }}
          />
        </div>
      </div>
    </MetricCard>
  );
};
