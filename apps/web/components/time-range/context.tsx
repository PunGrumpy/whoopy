"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  buildHomeDashboardMetrics,
  filterWhoopDataByRange,
} from "@/lib/charts/data";
import type { HomeDashboardMetrics, TimeRange } from "@/lib/charts/data";
import type { WhoopData } from "@/lib/charts/types";
import { whoopData } from "@/lib/data";

interface TimeRangeState {
  data: WhoopData;
  range: TimeRange;
  setRange: (range: TimeRange) => void;
}

const TimeRangeContext = createContext<TimeRangeState | null>(null);

const useTimeRangeState = (): TimeRangeState => {
  const state = useContext(TimeRangeContext);

  if (!state) {
    throw new Error("TimeRangeProvider is required");
  }

  return state;
};

export const TimeRangeProvider = ({ children }: { children: ReactNode }) => {
  const [range, setRange] = useState<TimeRange>("7d");
  const data = useMemo(() => filterWhoopDataByRange(whoopData, range), [range]);
  const state = useMemo(() => ({ data, range, setRange }), [data, range]);

  return (
    <TimeRangeContext.Provider value={state}>
      {children}
    </TimeRangeContext.Provider>
  );
};

export const useTimeRange = (): Pick<TimeRangeState, "range" | "setRange"> => {
  const { range, setRange } = useTimeRangeState();

  return { range, setRange };
};

export const useWhoopData = (): WhoopData => useTimeRangeState().data;

const HomeMetricsContext = createContext<HomeDashboardMetrics | null>(null);

export const HomeMetricsProvider = ({ children }: { children: ReactNode }) => {
  const data = useWhoopData();
  const metrics = useMemo(() => buildHomeDashboardMetrics(data), [data]);

  return (
    <HomeMetricsContext.Provider value={metrics}>
      {children}
    </HomeMetricsContext.Provider>
  );
};

export const useHomeMetrics = (): HomeDashboardMetrics => {
  const metrics = useContext(HomeMetricsContext);

  if (!metrics) {
    throw new Error("HomeMetricsProvider is required");
  }

  return metrics;
};
