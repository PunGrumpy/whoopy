"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  buildHomeDashboardMetrics,
  filterWhoopDataByRange,
} from "@/lib/charts/data";
import type { HomeDashboardMetrics, TimeRange } from "@/lib/charts/data";
import type { WhoopData } from "@/lib/charts/types";

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
  const [fullData, setFullData] = useState<WhoopData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/whoop");
        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = "/";
            return;
          }
          throw new Error("Failed to fetch WHOOP data");
        }
        setFullData(await res.json());
      } catch (error: unknown) {
        setFetchError(
          error instanceof Error ? error.message : "Failed to load WHOOP data"
        );
      }
    };

    void loadData();
  }, []);

  const data = useMemo(
    () => (fullData ? filterWhoopDataByRange(fullData, range) : null),
    [fullData, range]
  );

  if (fetchError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h2 className="text-xl font-semibold text-destructive">
          Error Loading Data
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">{fetchError}</p>
        <button
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          onClick={() => window.location.reload()}
          type="button"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[50svh] flex-1 flex-col items-center justify-center gap-3">
        <span className="size-10 animate-spin rounded-full border-4 border-muted border-t-foreground" />
        <p className="text-sm text-muted-foreground">
          Fetching your WHOOP data...
        </p>
      </div>
    );
  }

  return (
    <TimeRangeContext.Provider value={{ data, range, setRange }}>
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
