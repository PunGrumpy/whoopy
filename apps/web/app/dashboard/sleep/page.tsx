import { TimeRangeSelector } from "@/components/time-range";

const SleepPage = () => (
  <>
    <div className="flex items-center justify-between gap-3 p-12 pb-0">
      <h1 className="text-4xl font-medium">Sleep</h1>
      <TimeRangeSelector />
    </div>
  </>
);

export default SleepPage;
