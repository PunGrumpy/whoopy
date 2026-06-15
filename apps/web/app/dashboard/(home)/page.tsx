import { TimeRangeSelector } from "@/components/time-range";
import { HomeMetricsProvider } from "@/components/time-range/context";

import { DayStrainCard } from "./components/day-strain-card";
import {
  ExploreSection,
  HEALTH_EXPLORE_ITEMS,
  METRIC_EXPLORE_ITEMS,
} from "./components/explore";
import { InsightsPanel } from "./components/insights-panel";
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
          <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_min(22rem,32%)]">
            <div className="flex flex-col gap-10">
              <ExploreSection
                items={METRIC_EXPLORE_ITEMS}
                title="Your metrics"
              />
              <ExploreSection
                items={HEALTH_EXPLORE_ITEMS}
                title="Health data"
              />
            </div>
            <InsightsPanel />
          </section>
        </HomeMetricsProvider>
      </div>
    </div>
  </>
);

export default DashboardPage;
