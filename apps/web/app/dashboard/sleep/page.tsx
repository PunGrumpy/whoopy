import { TimeRangeSelector } from "@/components/time-range";

import { SleepAnalytics } from "./components/sleep-analytics";

const SleepPage = () => (
  <>
    <div className="flex items-center justify-between gap-3 p-12 pb-0">
      <h1 className="text-4xl font-medium">Sleep</h1>
      <TimeRangeSelector />
    </div>
    <div className="p-12">
      <SleepAnalytics />
    </div>
  </>
);

export default SleepPage;
