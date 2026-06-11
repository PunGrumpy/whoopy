import { TimeRangeSelector } from "@/components/time-range";
import { HomeMetricsProvider } from "@/components/time-range/context";

import { DayStrainCard } from "./components/day-strain-card";
import { RecoveryCard } from "./components/recovery-card";
import { SleepCard } from "./components/sleep-card";
import { StrainTrendCard } from "./components/strain-trend-card";
import { WorkoutsCard } from "./components/workouts-card";

const DashboardPage = () => (
  <>
    <div className="flex items-center justify-between gap-3 p-12 pb-0">
      <h1 className="text-4xl font-medium">Home</h1>
      <TimeRangeSelector />
    </div>
    <div className="p-12">
      <div className="flex flex-col gap-10">
        <HomeMetricsProvider>
          <section className="overflow-hidden rounded-lg border bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <RecoveryCard />
              <WorkoutsCard />
              <DayStrainCard />
              <SleepCard />
              <StrainTrendCard />
            </div>
          </section>
        </HomeMetricsProvider>
      </div>
    </div>
  </>
);

export default DashboardPage;
