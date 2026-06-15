import { TimeRangeSelector } from "@/components/time-range";

import { WorkoutsAnalytics } from "./components/workouts-analytics";

const WorkoutsPage = () => (
  <>
    <div className="flex items-center justify-between gap-3 p-12 pb-0">
      <h1 className="text-4xl font-medium">Workouts</h1>
      <TimeRangeSelector />
    </div>
    <div className="p-12">
      <WorkoutsAnalytics />
    </div>
  </>
);

export default WorkoutsPage;
