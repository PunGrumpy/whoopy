import { TimeRangeSelector } from "@/components/time-range";

import { RecoveryAnalytics } from "./components/recovery-analytics";

const RecoveryPage = () => (
  <>
    <div className="flex items-center justify-between gap-3 p-12 pb-0">
      <h1 className="text-4xl font-medium">Recovery</h1>
      <TimeRangeSelector />
    </div>
    <div className="p-12">
      <RecoveryAnalytics />
    </div>
  </>
);

export default RecoveryPage;
