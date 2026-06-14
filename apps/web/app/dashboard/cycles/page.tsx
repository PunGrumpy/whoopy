import { TimeRangeSelector } from "@/components/time-range";

import { CyclesAnalytics } from "./components/cycles-analytics";

const CyclesPage = () => (
  <>
    <div className="flex items-center justify-between gap-3 p-12 pb-0">
      <h1 className="text-4xl font-medium">Cycles</h1>
      <TimeRangeSelector />
    </div>
    <div className="p-12">
      <CyclesAnalytics />
    </div>
  </>
);

export default CyclesPage;
