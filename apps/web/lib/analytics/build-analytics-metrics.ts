import type {
  AnalyticsChartData,
  AnalyticsDomain,
  AnalyticsMetrics,
  AnalyticsPageConfig,
  MetricFormat,
  SidebarProgressDef,
  SidebarStatDef,
  SubMetricDef,
  SubMetricValue,
} from "@/lib/analytics/types";
import {
  avgCycleStrain,
  durH,
  getCycleChartData,
  getRecoveryChartData,
  getSleepChartData,
  getSportsMixData,
  getWorkoutChartData,
  getWorkoutCountChartData,
  milliToH,
  round,
  safeAvg,
} from "@/lib/charts/data";
import { RECOVERY_SERIES, SLEEP_SERIES } from "@/lib/charts/types";
import type { WhoopData } from "@/lib/charts/types";

const asChartData = <T extends object>(data: T[]): AnalyticsChartData =>
  data as unknown as AnalyticsChartData;

interface DomainSnapshot {
  avgHrv: number | null;
  avgRhr: number | null;
  avgSleepHours: number | null;
  avgStrain: number;
  avgWorkoutDuration: number | null;
  avgWorkoutStrain: number | null;
  cycleChart: ReturnType<typeof getCycleChartData>;
  latestRecoveryScore: number;
  latestSleepPerformance: number;
  latestStrain: number;
  recoveryChart: ReturnType<typeof getRecoveryChartData>;
  sleepChart: ReturnType<typeof getSleepChartData>;
  sleepDebt: number;
  topSport: string;
  totalWorkoutCalories: number | null;
  workoutBarData: ReturnType<typeof getWorkoutCountChartData>;
  workoutChart: ReturnType<typeof getWorkoutChartData>;
  workoutCount: number;
}

type SnapshotScalar = number | string;

const formatMetricValue = (
  value: number | string | null | undefined,
  format: MetricFormat = "number",
  suffix = ""
): string => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (format === "text") {
    return String(value);
  }

  const numericValue = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numericValue)) {
    return "—";
  }

  switch (format) {
    case "percent": {
      return `${round(numericValue, 0)}%`;
    }
    case "hours": {
      return `${round(numericValue, 1)}h`;
    }
    default: {
      return `${round(numericValue, 1)}${suffix}`;
    }
  }
};

const resolveSnapshotKey = (
  snapshot: DomainSnapshot,
  key: string
): SnapshotScalar | null => {
  const value = snapshot[key as keyof DomainSnapshot];
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }
  return null;
};

const latestSeriesValue = (
  chartData: AnalyticsChartData,
  seriesKey: string
): number | null => {
  const value = chartData.at(-1)?.[seriesKey];
  return typeof value === "number" ? value : null;
};

const avgSeriesValue = (
  chartData: AnalyticsChartData,
  seriesKey: string
): number | null => {
  const values = chartData
    .map((point) => point[seriesKey])
    .filter((value): value is number => typeof value === "number");

  return safeAvg(values);
};

const getDomainChartSource = (
  snapshot: DomainSnapshot,
  domain: AnalyticsDomain
): object[] => {
  switch (domain) {
    case "recovery": {
      return snapshot.recoveryChart;
    }
    case "sleep": {
      return snapshot.sleepChart;
    }
    case "cycles": {
      return snapshot.cycleChart;
    }
    case "workouts": {
      return snapshot.workoutBarData;
    }
    default: {
      const exhaustive: never = domain;
      return exhaustive;
    }
  }
};

const getMetricChartData = (
  snapshot: DomainSnapshot,
  metric: SubMetricDef,
  domain: AnalyticsDomain
): AnalyticsChartData => {
  if (metric.key === "topSport") {
    return [];
  }

  if (metric.key === "duration") {
    return snapshot.workoutChart.map((workout) => ({
      date: workout.date,
      duration: workout.duration,
    }));
  }

  if (domain === "workouts" && metric.key !== "count") {
    return asChartData(snapshot.workoutChart);
  }

  return asChartData(getDomainChartSource(snapshot, domain));
};

const getSubMetricRawValue = (
  snapshot: DomainSnapshot,
  metric: SubMetricDef,
  domain: AnalyticsDomain,
  chartData: AnalyticsChartData
): SnapshotScalar | null => {
  if (metric.key === "topSport") {
    return snapshot.topSport;
  }
  if (metric.key === "duration") {
    return snapshot.avgWorkoutDuration;
  }
  if (domain === "workouts" && metric.key === "strain") {
    return snapshot.avgWorkoutStrain;
  }
  if (domain === "workouts" && metric.key === "Calories") {
    return snapshot.totalWorkoutCalories;
  }
  return latestSeriesValue(chartData, metric.key);
};

const buildSubMetricValue = (
  snapshot: DomainSnapshot,
  metric: SubMetricDef,
  domain: AnalyticsDomain
): SubMetricValue => {
  const chartData = getMetricChartData(snapshot, metric, domain);
  const rawValue = getSubMetricRawValue(snapshot, metric, domain, chartData);

  return {
    chartData,
    chartType: metric.chartType,
    color: metric.color,
    seriesKey: metric.key,
    title: metric.title,
    tooltipLabel: metric.tooltipLabel,
    tooltipSuffix: metric.tooltipSuffix,
    value: formatMetricValue(rawValue, metric.format, metric.valueSuffix),
    valueSuffix: metric.valueSuffix,
  };
};

const buildSidebarStat = (snapshot: DomainSnapshot, stat: SidebarStatDef) => ({
  label: stat.label,
  value: formatMetricValue(
    resolveSnapshotKey(snapshot, stat.key),
    stat.format,
    stat.suffix
  ),
});

const buildSidebarProgress = (
  snapshot: DomainSnapshot,
  progress: SidebarProgressDef
) => {
  const rawValue = resolveSnapshotKey(snapshot, progress.currentKey);
  const numericValue =
    typeof rawValue === "number" ? rawValue : Number(rawValue ?? 0);

  return {
    display: formatMetricValue(
      numericValue,
      progress.format,
      progress.valueSuffix
    ),
    label: progress.label,
    max: progress.max,
    value: numericValue,
  };
};

const buildDomainSnapshot = (data: WhoopData): DomainSnapshot => {
  const recoveryChart = getRecoveryChartData(data.recoveries);
  const sleepChart = getSleepChartData(data.sleeps);
  const cycleChart = getCycleChartData(data.cycles);
  const workoutChart = getWorkoutChartData(data.workouts);
  const workoutBarData = getWorkoutCountChartData(data.cycles, data.workouts);
  const topSportEntry = getSportsMixData(data.workouts)
    .toSorted((a, b) => b.value - a.value)
    .at(0);

  const workoutCalories = workoutChart.map((workout) => workout.Calories);
  const latestSleep = data.sleeps.at(0);

  return {
    avgHrv: avgSeriesValue(asChartData(recoveryChart), RECOVERY_SERIES.hrv),
    avgRhr: avgSeriesValue(asChartData(recoveryChart), RECOVERY_SERIES.rhr),
    avgSleepHours: avgSeriesValue(
      asChartData(sleepChart),
      SLEEP_SERIES.sleepHours
    ),
    avgStrain: round(avgCycleStrain(data.cycles), 1),
    avgWorkoutDuration: safeAvg(data.workouts.map(durH)),
    avgWorkoutStrain: safeAvg(
      data.workouts.map((workout) => workout.score.strain)
    ),
    cycleChart,
    latestRecoveryScore: data.recoveries.at(0)?.score.recovery_score ?? 0,
    latestSleepPerformance:
      data.sleeps.at(0)?.score.sleep_performance_percentage ?? 0,
    latestStrain: data.cycles.at(0)?.score.strain ?? 0,
    recoveryChart,
    sleepChart,
    sleepDebt: milliToH(
      latestSleep?.score.sleep_needed?.need_from_sleep_debt_milli ?? 0
    ),
    topSport: topSportEntry
      ? `${topSportEntry.name} (${topSportEntry.value})`
      : "—",
    totalWorkoutCalories: workoutCalories.length
      ? round(
          workoutCalories.reduce((total, calories) => total + calories, 0),
          0
        )
      : null,
    workoutBarData,
    workoutChart,
    workoutCount: data.workouts.length,
  };
};

export const buildAnalyticsMetrics = (
  config: AnalyticsPageConfig,
  data: WhoopData
): AnalyticsMetrics => {
  const snapshot = buildDomainSnapshot(data);
  const domainChart = getDomainChartSource(snapshot, config.domain);

  return {
    hasData: domainChart.length > 0,
    hero: {
      chartData: asChartData(domainChart),
      chartType: config.hero.chartType,
      color: config.hero.color,
      seriesKey: config.hero.seriesKey,
      summary: formatMetricValue(
        resolveSnapshotKey(snapshot, config.hero.summaryKey),
        config.hero.summaryFormat,
        config.hero.valueSuffix
      ),
      title: config.hero.title,
      tooltipLabel: config.hero.tooltipLabel,
      tooltipSuffix: config.hero.tooltipSuffix,
      valueSuffix: config.hero.valueSuffix,
    },
    sidebar: {
      progress: config.sidebar.progress
        ? buildSidebarProgress(snapshot, config.sidebar.progress)
        : undefined,
      stats: config.sidebar.stats.map((stat) =>
        buildSidebarStat(snapshot, stat)
      ),
    },
    tabs: config.tabs.map((tab) => ({
      id: tab.id,
      label: tab.label,
      metrics: tab.metrics.map((metric) =>
        buildSubMetricValue(snapshot, metric, config.domain)
      ),
    })),
  };
};
