import { CYCLE_SERIES, RECOVERY_SERIES, SLEEP_SERIES } from "./types";
import type {
  CycleChartItem,
  RecoveryChartItem,
  SleepChartItem,
  WhoopCycle,
  WhoopData,
  WhoopRecovery,
  WhoopSleep,
  WhoopWorkout,
  WorkoutChartItem,
  WorkoutCountChartItem,
} from "./types";

export const TIME_RANGES = ["24h", "7d", "30d", "90d"] as const;

export type TimeRange = (typeof TIME_RANGES)[number];

export const STRAIN_GOAL = 21;
export const MINI_MARGIN = { bottom: 6, left: 6, right: 6, top: 6 };
export const TREND_MARGIN = { bottom: 0, left: 0, right: 6, top: 6 };
export const BAR_MARGIN = { bottom: 0, left: 0, right: 0, top: 0 };
export const LINE_PROPS = { strokeWidth: 2, type: "monotone" as const };
export const TOOLTIP_CURSOR = {
  stroke: "var(--border)",
  strokeWidth: 1,
} as const;

export const CHART_BLUE = "#5BC0EB";
export const WORKOUT_BAR_COLOR = "#6C5CE7";
export const DAY_STRAIN_COLOR = "#00B894";
export const FALLBACK_SERIES_COLOR = "#64748b";

export const RECOVERY_LINES = [
  [RECOVERY_SERIES.hrv, "#E36E30"],
  [RECOVERY_SERIES.score, "#D53670"],
] as const;

export const recoveryLineColor = (key: string): string =>
  RECOVERY_LINES.find(([lineKey]) => lineKey === key)?.[1] ??
  FALLBACK_SERIES_COLOR;

export const recoveryColor = (score: number): string => {
  if (score >= 67) {
    return "#1fc96a";
  }
  if (score >= 34) {
    return "#f5c542";
  }
  return "#e0454a";
};

export const ZONE_COLORS: Record<string, string> = {
  "Zone 0": "#90caf9",
  "Zone 1": "#4a90d9",
  "Zone 2": "#27ae60",
  "Zone 3": "#f5c542",
  "Zone 4": "#e67e22",
  "Zone 5": "#e0454a",
};

export const STAGE_COLORS: Record<string, string> = {
  Awake: "#c0392b",
  "Deep/SWS": "#2d4a8a",
  Light: "#6c8ebf",
  REM: "#9b59b6",
};

export const round = (val: number, decimals: number): number => {
  const p = 10 ** decimals;
  return Math.round(val * p) / p;
};

export const milliToH = (ms: number | null | undefined): number =>
  round((ms || 0) / 3_600_000, 2);

export const durH = (r: { start: string; end: string }): number => {
  const s = new Date(r.start).getTime();
  const e = new Date(r.end).getTime();
  return round((e - s) / 3_600_000, 2);
};

export const safeAvg = (arr: number[]): number | null =>
  arr.length ? round(arr.reduce((a, b) => a + b, 0) / arr.length, 1) : null;

export const avgCycleStrain = (cycles: WhoopCycle[]): number =>
  safeAvg(cycles.map((cycle) => cycle.score.strain)) ?? 0;

const formatChartDate = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

const getDayKey = (isoDate: string): string => isoDate.split("T")[0];

export const getRecoveryChartData = (
  sr: WhoopRecovery[]
): RecoveryChartItem[] =>
  sr
    .map((r) => ({
      [RECOVERY_SERIES.hrv]: round(r.score.hrv_rmssd_milli, 1),
      [RECOVERY_SERIES.rhr]: r.score.resting_heart_rate,
      [RECOVERY_SERIES.score]: r.score.recovery_score,
      [RECOVERY_SERIES.skinTemp]: r.score.skin_temp_celsius,
      [RECOVERY_SERIES.spo2]: r.score.spo2_percentage,
      date: formatChartDate(r.updated_at),
    }))
    .toReversed();

export const getSleepChartData = (ss: WhoopSleep[]): SleepChartItem[] =>
  ss
    .map((s) => {
      const stg = s.score.stage_summary || {};
      const need = s.score.sleep_needed || {};
      return {
        [SLEEP_SERIES.awake]: milliToH(stg.total_awake_time_milli),
        [SLEEP_SERIES.consistency]: s.score.sleep_consistency_percentage,
        [SLEEP_SERIES.cycles]: stg.sleep_cycle_count || 0,
        [SLEEP_SERIES.deep]: milliToH(stg.total_slow_wave_sleep_time_milli),
        [SLEEP_SERIES.disturbances]: stg.disturbance_count || 0,
        [SLEEP_SERIES.efficiency]: s.score.sleep_efficiency_percentage,
        [SLEEP_SERIES.light]: milliToH(stg.total_light_sleep_time_milli),
        [SLEEP_SERIES.needBaseline]: milliToH(need.baseline_milli),
        [SLEEP_SERIES.needDebt]: milliToH(need.need_from_sleep_debt_milli),
        [SLEEP_SERIES.needNap]: milliToH(need.need_from_recent_nap_milli),
        [SLEEP_SERIES.needStrain]: milliToH(need.need_from_recent_strain_milli),
        [SLEEP_SERIES.performance]: s.score.sleep_performance_percentage,
        [SLEEP_SERIES.rem]: milliToH(stg.total_rem_sleep_time_milli),
        [SLEEP_SERIES.respiratoryRate]: s.score.respiratory_rate || null,
        [SLEEP_SERIES.sleepHours]: milliToH(
          (stg.total_light_sleep_time_milli || 0) +
            (stg.total_slow_wave_sleep_time_milli || 0) +
            (stg.total_rem_sleep_time_milli || 0)
        ),
        date: formatChartDate(s.start),
      };
    })
    .toReversed();

export const getCycleChartData = (sc: WhoopCycle[]): CycleChartItem[] =>
  sc
    .map((c) => ({
      [CYCLE_SERIES.avgHr]: c.score.average_heart_rate,
      [CYCLE_SERIES.calories]: round(c.score.kilojoule / 4.184, 1),
      [CYCLE_SERIES.maxHr]: c.score.max_heart_rate,
      [CYCLE_SERIES.strain]: c.score.strain,
      date: formatChartDate(c.start),
    }))
    .toReversed();

export const getWorkoutChartData = (sw: WhoopWorkout[]): WorkoutChartItem[] =>
  sw
    .map((w) => {
      const zones = w.score.zone_durations || {};
      const dist = w.score.distance_meter;
      return {
        "Avg HR": w.score.average_heart_rate,
        Calories: round(w.score.kilojoule / 4.184, 1),
        Distance: dist ? round(dist / 1000, 2) : 0,
        "Max HR": w.score.max_heart_rate,
        "Zone 0 (min)": round((zones.zone_zero_milli || 0) / 60_000, 1),
        "Zone 1 (min)": round((zones.zone_one_milli || 0) / 60_000, 1),
        "Zone 2 (min)": round((zones.zone_two_milli || 0) / 60_000, 1),
        "Zone 3 (min)": round((zones.zone_three_milli || 0) / 60_000, 1),
        "Zone 4 (min)": round((zones.zone_four_milli || 0) / 60_000, 1),
        "Zone 5 (min)": round((zones.zone_five_milli || 0) / 60_000, 1),
        date: formatChartDate(w.start),
        duration: durH(w),
        sport: w.sport_name || "Workout",
        strain: w.score.strain,
      };
    })
    .toReversed();

export const getWorkoutCountChartData = (
  cycles: WhoopCycle[],
  workouts: WhoopWorkout[]
): WorkoutCountChartItem[] => {
  const countByDay = new Map<string, number>();

  for (const workout of workouts) {
    const day = getDayKey(workout.start);
    countByDay.set(day, (countByDay.get(day) ?? 0) + 1);
  }

  return cycles.toReversed().map((cycle) => {
    const day = getDayKey(cycle.start);

    return {
      count: countByDay.get(day) ?? 0,
      date: formatChartDate(cycle.start),
    };
  });
};

export const getSportsMixData = (
  sw: WhoopWorkout[]
): { name: string; value: number }[] => {
  const sportsMap: Record<string, number> = {};
  for (const w of sw) {
    const name = w.sport_name || "Workout";
    sportsMap[name] = (sportsMap[name] || 0) + 1;
  }
  return Object.entries(sportsMap).map(([name, value]) => ({
    name,
    value,
  }));
};

const RANGE_DAYS: Record<TimeRange, number> = {
  "24h": 1,
  "30d": 30,
  "7d": 7,
  "90d": 90,
};

export const filterWhoopDataByRange = (
  data: WhoopData,
  range: TimeRange
): WhoopData => {
  const days = RANGE_DAYS[range];
  const cycles = data.cycles.slice(0, days);
  const cycleDays = new Set(cycles.map((cycle) => getDayKey(cycle.start)));

  return {
    cycles,
    recoveries: data.recoveries.slice(0, days),
    sleeps: data.sleeps.slice(0, days),
    workouts: data.workouts.filter((workout) =>
      cycleDays.has(getDayKey(workout.start))
    ),
  };
};

export interface HomeDashboardMetrics {
  avgStrain: number;
  dayStrainAvg: number;
  recoveryChart: RecoveryChartItem[];
  recoveryScore: number;
  sleepChart: SleepChartItem[];
  sleepPerformance: number;
  strainChart: CycleChartItem[];
  workoutBarData: WorkoutCountChartItem[];
  workoutCount: number;
}

export const buildHomeDashboardMetrics = (
  filtered: WhoopData
): HomeDashboardMetrics => {
  const strainChart = getCycleChartData(filtered.cycles);
  const dayStrainAvg = avgCycleStrain(filtered.cycles);

  return {
    avgStrain: round(dayStrainAvg, 1),
    dayStrainAvg,
    recoveryChart: getRecoveryChartData(filtered.recoveries),
    recoveryScore: filtered.recoveries.at(0)?.score.recovery_score ?? 0,
    sleepChart: getSleepChartData(filtered.sleeps),
    sleepPerformance:
      filtered.sleeps.at(0)?.score.sleep_performance_percentage ?? 0,
    strainChart,
    workoutBarData: getWorkoutCountChartData(
      filtered.cycles,
      filtered.workouts
    ),
    workoutCount: filtered.workouts.length,
  };
};
